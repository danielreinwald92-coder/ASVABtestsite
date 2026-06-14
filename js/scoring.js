// Shared scoring helpers for practice-test result estimates.
//
// This module produces a DEFENSIBLE PUBLIC APPROXIMATION of ASVAB scoring.
// It is NOT the official scoring algorithm (which is IRT-based and uses
// classified equating/norming tables). See docs/scoring-methodology.md for the
// model, public sources, anchor points, and limitations.
//
// Model summary:
//  1. Each section's % correct is mapped to an approximate STANDARD SCORE
//     (official ASVAB scale: mean 50, SD 10). We lack IRT ability estimates,
//     so we use a documented linear approximation onto the empirical 20-80
//     standard-score band (+/-3 SD), placing 50% correct at the mean of 50.
//  2. VE (Verbal Expression) is approximated from the WK and PC standard
//     scores. AFQT raw = 2*VE + AR + MK (the official composite formula),
//     rescaled to a ~100-centered practice composite and mapped to a 1-99
//     percentile via a normal-curve fit anchored to the published 1997 (PAY97)
//     reference points.
//  3. Army line scores are SUMS of section standard scores (the real composite
//     scale), not multiplied-down percentages.
(function (root) {
  const AFQT_SECTIONS = root.MissionASVABConfig?.AFQT_SECTIONS || ['AR', 'WK', 'PC', 'MK'];

  // Empirical standard-score band. ASVAB standard scores are scaled to mean 50,
  // SD 10; the overwhelming majority of scores fall within +/-3 SD (20-80).
  const SS_MEAN = 50;
  const SS_MIN = 20; // ~ -3 SD
  const SS_MAX = 80; // ~ +3 SD

  // Percentile-curve parameters (normal CDF). The AFQT raw composite used here
  // is centered at 100 for an average performer; SD chosen to fit the published
  // reference anchors (raw ~85 -> 31st, ~100 -> 50th, ~135 -> 93rd percentile).
  const AFQT_RAW_MEAN = 100;
  const AFQT_RAW_SD = 26;

  function getSectionPercent(sectionResults, code) {
    const section = sectionResults && sectionResults[code];
    if (!section || !section.total) return 0;
    return Math.round((section.correct / section.total) * 100);
  }

  // Map % correct (0-100) to an approximate standard score (mean 50, SD 10).
  // Documented simplification: linear onto the 20-80 band, 50% correct -> 50.
  function percentToStandardScore(pct) {
    const clamped = Math.max(0, Math.min(100, pct));
    return SS_MIN + (clamped / 100) * (SS_MAX - SS_MIN);
  }

  // Standard score for a section by code, with AS (Auto & Shop) fallback:
  // some datasets carry a combined 'AS' section, others the legacy AI + SI
  // pair. If 'AS' is absent we average the AI/SI percents (their official
  // combination as a single Auto & Shop standard score).
  function getSectionStandardScore(sectionResults, code) {
    if (code === 'AS' && !(sectionResults && sectionResults.AS)) {
      const ai = getSectionPercent(sectionResults, 'AI');
      const si = getSectionPercent(sectionResults, 'SI');
      return percentToStandardScore((ai + si) / 2);
    }
    return percentToStandardScore(getSectionPercent(sectionResults, code));
  }

  // Verbal Expression standard score, approximated from WK and PC.
  function getVEStandardScore(sectionResults) {
    const wk = getSectionStandardScore(sectionResults, 'WK');
    const pc = getSectionStandardScore(sectionResults, 'PC');
    return (wk + pc) / 2;
  }

  // Standard normal CDF via the Abramowitz & Stegun 7.1.26 erf approximation
  // (max abs error ~1.5e-7). Avoids any external dependency.
  function normalCdf(z) {
    const sign = z < 0 ? -1 : 1;
    const x = Math.abs(z) / Math.SQRT2;
    const t = 1 / (1 + 0.3275911 * x);
    const poly = t * (0.254829592 +
      t * (-0.284496736 +
      t * (1.421413741 +
      t * (-1.453152027 +
      t * 1.061405429))));
    const erf = 1 - poly * Math.exp(-x * x);
    return 0.5 * (1 + sign * erf);
  }

  // AFQT raw composite -> percentile (1-99). The curve is fit to the published
  // 1997 reference anchors documented in docs/scoring-methodology.md.
  function afqtRawToPercentile(raw) {
    const z = (raw - AFQT_RAW_MEAN) / AFQT_RAW_SD;
    const pct = Math.round(normalCdf(z) * 100);
    return Math.min(99, Math.max(1, pct));
  }

  function calculateAFQTEstimate(sectionResults) {
    if (!sectionResults) return null;

    const hasAFQTSection = AFQT_SECTIONS.some((code) => sectionResults[code]);
    if (!hasAFQTSection) return null;

    const ve = getVEStandardScore(sectionResults);
    const ar = getSectionStandardScore(sectionResults, 'AR');
    const mk = getSectionStandardScore(sectionResults, 'MK');

    // Official composite is 2*VE + AR + MK (centered ~200 on the standard-score
    // scale). We rescale by 1/2 to a ~100-centered practice composite so it maps
    // onto the documented percentile anchors. This is a monotonic rescaling and
    // does not change the percentile ordering.
    const rawAFQT = (2 * ve + ar + mk) / 2;

    return afqtRawToPercentile(rawAFQT);
  }

  function calculateLineScores(sectionResults) {
    if (!sectionResults) return null;

    const requiredSections = ['AR', 'WK', 'PC', 'MK', 'GS', 'AS', 'MC', 'EI'];
    const hasSections = requiredSections.filter((code) => sectionResults[code]).length;
    // Allow the legacy AI/SI pair to count toward the AS requirement.
    const hasAS = sectionResults.AS || sectionResults.AI || sectionResults.SI;
    if (hasSections + (hasAS && !sectionResults.AS ? 1 : 0) < 5) return null;

    const ve = getVEStandardScore(sectionResults);
    const ar = getSectionStandardScore(sectionResults, 'AR');
    const mk = getSectionStandardScore(sectionResults, 'MK');
    const gs = getSectionStandardScore(sectionResults, 'GS');
    const as = getSectionStandardScore(sectionResults, 'AS');
    const mc = getSectionStandardScore(sectionResults, 'MC');
    const ei = getSectionStandardScore(sectionResults, 'EI');

    // Army line scores are SUMS of the component standard scores.
    return {
      GT: { name: 'General Technical', score: Math.round(ve + ar) },
      CL: { name: 'Clerical', score: Math.round(ve + ar + mk) },
      CO: { name: 'Combat', score: Math.round(ar + as + mc) },
      EL: { name: 'Electronics', score: Math.round(gs + ar + mk + ei) },
      FA: { name: 'Field Artillery', score: Math.round(ar + mk + mc) },
      GM: { name: 'General Maintenance', score: Math.round(gs + as + mk + ei) },
      MM: { name: 'Mechanical Maintenance', score: Math.round(as + mc + ei) },
      OF: { name: 'Operators & Food', score: Math.round(ve + as + mc) },
      SC: { name: 'Surveillance & Comms', score: Math.round(ve + ar + as + mc) },
      ST: { name: 'Skilled Technical', score: Math.round(gs + ve + mk + mc) }
    };
  }

  const api = {
    getSectionPercent,
    percentToStandardScore,
    getSectionStandardScore,
    afqtRawToPercentile,
    calculateAFQTEstimate,
    calculateLineScores
  };

  root.MissionASVABScoring = api;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
