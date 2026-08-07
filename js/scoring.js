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

  // MAP theta + penalty for a section's response records.
  function sectionAbility(sectionResults, code) {
    const section = sectionResults[code];
    const questions = (section.questions || []).filter(function (q) { return q.answered !== false; });
    const records = questions.map(function (q) {
      const params = PARAMS.getItemParams(code, q.difficulty || 3, q.originalId || q.id);
      return { a: params.a, b: params.b, c: params.c, correct: !!q.isCorrect };
    });
    const est = IRT.mapEstimate(records);
    let theta = est.theta;
    const unanswered = section.unanswered || 0;
    if (unanswered > 0 && PENALTY && PENALTY[code] && PENALTY[code][unanswered]) {
      const p = PENALTY[code][unanswered];
      theta = p.A + p.B * theta;
    }
    return { theta: theta, sem: est.sem };
  }

  function getScoreDetails(sectionResults) {
    if (!sectionResults) return null;
    const hasAll = AFQT_SECTIONS.every(function (code) { return sectionResults[code]; });
    if (!hasAll) return null;

    const sections = {};
    AFQT_SECTIONS.forEach(function (code) {
      const ab = sectionAbility(sectionResults, code);
      sections[code] = { theta: ab.theta, sem: ab.sem, ss: PARAMS.thetaToSS(code, ab.theta) };
    });

    // Forward-looking (Task 6 consumes this): when the full 8-section profile
    // is present, surface every section's ability alongside the AFQT four so
    // downstream code (results/line-score UI) doesn't need a second pipeline
    // pass to get GS/EI/AS/MC theta/sem/ss.
    const hasAll8 = ALL_SECTIONS.every(function (code) { return sectionResults[code]; });
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

  function calculateLineScores(sectionResults) {
    if (!sectionResults) return null;
    const hasAll = ALL_SECTIONS.every(function (code) { return sectionResults[code]; });
    if (!hasAll) return null; // partial data would produce plausible-looking but bogus composites

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

  const api = { getSectionPercent, getScoreDetails, calculateAFQTEstimate, calculateLineScores };
  root.MissionASVABScoring = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
