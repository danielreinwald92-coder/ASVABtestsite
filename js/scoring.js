// Official-pipeline scoring (IRT v2). Structure matches operational CAT-ASVAB:
// MAP theta per section -> official standard-score transforms -> official VE ->
// AFQTS -> verbatim PAY97 percentile table -> official Army composite weights.
// Item parameters are heuristic estimates (see js/irt-params.js and the spec);
// everything downstream of theta is published math.
(function (root) {
  function dep(name, path) {
    if (root[name]) return root[name];
    if (typeof module !== 'undefined' && module.exports) return require(path);
    return null;
  }
  const IRT = dep('MissionASVABIRT', './irt.js');
  const PARAMS = dep('MissionASVABIRTParams', './irt-params.js');
  const PENALTY = dep('MissionASVABPenalty', './penalty-table.js');

  const AFQT_SECTIONS = ['AR', 'WK', 'PC', 'MK'];
  const ALL_SECTIONS = ['GS', 'AR', 'WK', 'PC', 'MK', 'EI', 'AS', 'MC'];

  function getSectionPercent(sectionResults, code) {
    const section = sectionResults && sectionResults[code];
    if (!section || !section.total) return 0;
    return Math.round((section.correct / section.total) * 100);
  }

  // theta -> standard score for a section code, routing AS through its own
  // published transform (SS_TRANSFORM has no AS entry — asStandardScore is
  // the degenerate combined-AS form of Segall eq. 2.4).
  function sectionSS(code, theta) {
    return code === 'AS' ? PARAMS.asStandardScore(theta) : PARAMS.thetaToSS(code, theta);
  }

  function answeredQuestions(section) {
    return (section.questions || []).filter(function (q) { return q.answered !== false; });
  }

  function answeredCount(section) {
    return answeredQuestions(section).length;
  }

  // A required section is scoreable when it has >=1 answered record, OR its
  // emptiness is EXPLAINED by `unanswered` (the real "ran out of time before
  // the last section" path — sectionAbility routes that through
  // mapEstimate([]) === theta 0 -> penalty[n] -> a low-but-defined score, per
  // Task 3's incomplete-test penalty table; every section has a penalty entry
  // at unanswered === section length). Only a section with ZERO answered
  // records AND no unanswered count is genuinely inconsistent/corrupt input —
  // that's the "no data" case the missing-section gates below also cover.
  function isScoreable(section) {
    return answeredCount(section) > 0 || (section.unanswered || 0) > 0;
  }

  // MAP theta + penalty for a section's response records.
  function sectionAbility(sectionResults, code) {
    const section = sectionResults[code];
    const questions = answeredQuestions(section);
    const records = questions.map(function (q) {
      const params = PARAMS.getItemParams(code, q.difficulty || 3, q.originalId || q.id);
      return { a: params.a, b: params.b, c: params.c, correct: !!q.isCorrect };
    });
    const est = IRT.mapEstimate(records);
    let theta = est.theta;
    const unanswered = section.unanswered || 0;
    if (unanswered > 0) {
      // A missing/incomplete penalty table must fail loudly rather than
      // silently score an incomplete test as if fully answered — mirrors how
      // a missing IRT/PARAMS dependency already throws on first use above.
      if (!PENALTY || !PENALTY[code] || !PENALTY[code][unanswered]) {
        throw new Error('MissionASVABScoring: missing incomplete-test penalty for ' + code + ' unanswered=' + unanswered);
      }
      const p = PENALTY[code][unanswered];
      theta = p.A + p.B * theta;
    }
    return { theta: theta, sem: est.sem };
  }

  function getScoreDetails(sectionResults) {
    if (!sectionResults) return null;
    const hasAll = AFQT_SECTIONS.every(function (code) { return sectionResults[code]; });
    if (!hasAll) return null;

    // Forward-looking (Task 6 consumes this): when the full 8-section profile
    // is present, surface every section's ability alongside the AFQT four so
    // downstream code (results/line-score UI) doesn't need a second pipeline
    // pass to get GS/EI/AS/MC theta/sem/ss.
    const hasAll8 = ALL_SECTIONS.every(function (code) { return sectionResults[code]; });

    // Same bogus-score rationale as the hasAll gate above, extended to a
    // section with zero answered records AND no unanswered count to explain
    // it (see isScoreable): include the opportunistic all-8 set in the check
    // when it applies, since those sections are also surfaced in the
    // returned `sections` object below.
    const requiredCodes = hasAll8 ? ALL_SECTIONS : AFQT_SECTIONS;
    const scoreable = requiredCodes.every(function (code) { return isScoreable(sectionResults[code]); });
    if (!scoreable) return null;

    const sections = {};
    AFQT_SECTIONS.forEach(function (code) {
      const ab = sectionAbility(sectionResults, code);
      sections[code] = { theta: ab.theta, sem: ab.sem, ss: PARAMS.thetaToSS(code, ab.theta) };
    });

    if (hasAll8) {
      ALL_SECTIONS.forEach(function (code) {
        if (sections[code]) return; // AFQT sections already computed above
        const ab = sectionAbility(sectionResults, code);
        sections[code] = { theta: ab.theta, sem: ab.sem, ss: sectionSS(code, ab.theta) };
      });
    }

    const ssVE = PARAMS.veStandardScore(sections.WK.theta, sections.PC.theta);
    const afqts = Math.round(sections.AR.ss) + Math.round(sections.MK.ss) + 2 * Math.round(ssVE);
    const percentile = PARAMS.afqtsToPercentile(afqts);

    // Delta-method SE of AFQTS from independent section posteriors (spec §10).
    const se = Math.sqrt(
      Math.pow(11.528721 * sections.AR.sem, 2) +
      Math.pow(10.025804 * sections.MK.sem, 2) +
      Math.pow(2 * 7.225587 * sections.WK.sem, 2) +
      Math.pow(2 * 5.010103 * sections.PC.sem, 2)
    );
    const band = {
      low: PARAMS.afqtsToPercentile(Math.round(afqts - se)),
      high: PARAMS.afqtsToPercentile(Math.round(afqts + se))
    };
    return { sections: sections, ve: { theta: null, ss: ssVE }, afqts: afqts, percentile: percentile, band: band };
  }

  function calculateAFQTEstimate(sectionResults) {
    const details = getScoreDetails(sectionResults);
    return details ? details.percentile : null;
  }

  // Single-section practice (spec §10): same MAP-theta + SS routing as
  // getScoreDetails' per-section loop, for exactly one section, with none of
  // the 4-section AFQT gating — AFQT/percentile still require the full AFQT
  // set, this only adds a standard score alongside the % headline. Returns
  // null when the section is missing/unscoreable so callers can fall back to
  // the plain %-correct display, same as getScoreDetails' null case.
  function getSingleSectionDetails(sectionResults, code) {
    if (!sectionResults || !sectionResults[code] || !isScoreable(sectionResults[code])) return null;
    const ab = sectionAbility(sectionResults, code);
    return { theta: ab.theta, sem: ab.sem, ss: sectionSS(code, ab.theta) };
  }

  function calculateLineScores(sectionResults) {
    if (!sectionResults) return null;
    const hasAll = ALL_SECTIONS.every(function (code) { return sectionResults[code]; });
    if (!hasAll) return null; // partial data would produce plausible-looking but bogus composites
    // A zero-answered section with no unanswered count to explain it is
    // equivalent to missing data — see isScoreable() above. A zero-answered
    // section WITH an unanswered count (ran out of time) is fine; the
    // incomplete-test penalty in sectionAbility() handles it.
    const scoreable = ALL_SECTIONS.every(function (code) { return isScoreable(sectionResults[code]); });
    if (!scoreable) return null;

    const theta = {};
    ALL_SECTIONS.forEach(function (code) { theta[code] = sectionAbility(sectionResults, code).theta; });

    const ss = {
      GS: PARAMS.thetaToSS('GS', theta.GS),
      AR: PARAMS.thetaToSS('AR', theta.AR),
      MK: PARAMS.thetaToSS('MK', theta.MK),
      MC: PARAMS.thetaToSS('MC', theta.MC),
      EI: PARAMS.thetaToSS('EI', theta.EI),
      AS: PARAMS.asStandardScore(theta.AS),
      VE: PARAMS.veStandardScore(theta.WK, theta.PC)
    };

    return {
      GT: { name: 'General Technical', score: PARAMS.gtScore(Math.round(ss.AR), Math.round(ss.VE)) },
      CL: { name: 'Clerical', score: PARAMS.lineScoreFromSS('CL', ss) },
      CO: { name: 'Combat', score: PARAMS.lineScoreFromSS('CO', ss) },
      EL: { name: 'Electronics', score: PARAMS.lineScoreFromSS('EL', ss) },
      FA: { name: 'Field Artillery', score: PARAMS.lineScoreFromSS('FA', ss) },
      GM: { name: 'General Maintenance', score: PARAMS.lineScoreFromSS('GM', ss) },
      MM: { name: 'Mechanical Maintenance', score: PARAMS.lineScoreFromSS('MM', ss) },
      OF: { name: 'Operators & Food', score: PARAMS.lineScoreFromSS('OF', ss) },
      SC: { name: 'Surveillance & Comms', score: PARAMS.lineScoreFromSS('SC', ss) },
      ST: { name: 'Skilled Technical', score: PARAMS.lineScoreFromSS('ST', ss) }
    };
  }

  const api = { getSectionPercent, getScoreDetails, getSingleSectionDetails, calculateAFQTEstimate, calculateLineScores };
  root.MissionASVABScoring = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
