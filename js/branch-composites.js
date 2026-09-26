// Branch classification composites from ASVAB standard scores (all published
// math from Segall 2004, "Development and Evaluation of the 1997 ASVAB Score
// Scale", the same report as the AFQT table in js/irt-params.js):
//   Army       - the 10 line scores (GT eq. + Table 2.7 weights, irt-params.js)
//   Air Force  - M/A/G/E unit-weighted sums (sec. 2.5.1) -> percentile via
//                Tables C.1-C.4, copied verbatim
//   Marines    - GT/MM/EL/CL unit-weighted sums (sec. 2.5.2) -> mean 100 /
//                SD 20 scale with the published linear transforms
//   Navy / CG  - report raw sums of standard scores, so no composite here;
//                job rules sum the sections directly (js/job-matcher.js)
// Inputs are standard scores { GS, AR, WK, PC, MK, EI, AS, MC, VE } (any may
// be missing). Composites that need a missing section are omitted, never guessed.
(function (root) {
  const P = root.MissionASVABIRTParams ||
    (typeof module !== 'undefined' && module.exports ? require('./irt-params.js') : null);

  // Official score reports carry integer standard scores; every service sum is
  // built from those rounded values.
  function rounded(ss) {
    const out = {};
    for (const k of Object.keys(ss || {})) {
      if (Number.isFinite(ss[k])) out[k] = Math.round(ss[k]);
    }
    return out;
  }

  function sumOf(r, weights) {
    let total = 0;
    for (const k of Object.keys(weights)) {
      if (!Number.isFinite(r[k])) return null;
      total += weights[k] * r[k];
    }
    return total;
  }

  // Tables C.1-C.4: percentile for each integer sum from `floor` upward
  // (sums at or below floor -> first entry; past the end -> 99).
  const MAGE_TABLES = {
    M: { floor: 144, pct: [
      1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3,
      4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 7,
      7, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 11, 11, 11, 12, 12, 13, 13, 14, 14,
      14, 15, 15, 15, 16, 16, 17, 18, 18, 19, 19, 20, 21, 21, 22, 22, 23, 24, 24, 25,
      26, 26, 27, 28, 28, 29, 29, 30, 31, 31, 33, 33, 34, 35, 36, 37, 37, 38, 39, 40,
      41, 42, 43, 44, 45, 46, 47, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
      60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 78,
      79, 80, 81, 81, 82, 83, 84, 85, 86, 86, 87, 87, 88, 88, 89, 90, 90, 91, 91, 92,
      92, 93, 93, 93, 94, 94, 95, 95, 95, 95, 96, 96, 96, 97, 97, 97, 97, 97, 98, 98,
      98, 98, 98, 98, 98, 99
    ] },
    A: { floor: 55, pct: [
      1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 6, 6, 7, 7, 8, 9,
      10, 10, 11, 13, 14, 15, 16, 17, 19, 20, 21, 23, 25, 27, 28, 30, 32, 34, 35, 37,
      39, 41, 43, 45, 47, 49, 50, 52, 55, 56, 59, 61, 63, 65, 67, 69, 71, 72, 74, 76,
      78, 80, 82, 84, 85, 87, 88, 90, 91, 92, 93, 94, 95, 96, 96, 97, 97, 98, 98, 99
    ] },
    G: { floor: 51, pct: [
      1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6, 6, 7,
      7, 8, 8, 9, 10, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 23, 24, 26, 28,
      30, 32, 33, 36, 38, 40, 42, 44, 47, 49, 51, 53, 55, 57, 59, 62, 64, 66, 68, 70,
      72, 74, 76, 78, 80, 81, 83, 84, 85, 87, 88, 89, 91, 92, 93, 94, 95, 95, 96, 96,
      97, 97, 98, 98, 99
    ] },
    E: { floor: 119, pct: [
      1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5,
      5, 5, 5, 6, 6, 6, 7, 7, 7, 7, 8, 8, 9, 9, 9, 10, 10, 11, 11, 12,
      12, 13, 13, 14, 14, 15, 16, 16, 17, 17, 18, 19, 19, 20, 21, 22, 23, 23, 24, 25,
      26, 27, 28, 30, 31, 31, 33, 34, 35, 36, 37, 38, 39, 40, 41, 43, 44, 45, 46, 47,
      49, 50, 51, 52, 53, 54, 55, 56, 58, 59, 60, 61, 62, 64, 65, 66, 67, 68, 69, 70,
      71, 72, 73, 74, 75, 76, 76, 77, 79, 80, 81, 81, 82, 83, 84, 84, 85, 86, 87, 87,
      88, 88, 89, 89, 90, 91, 91, 91, 92, 92, 93, 93, 94, 94, 94, 95, 95, 95, 96, 96,
      96, 96, 97, 97, 97, 97, 98, 98, 98, 98, 98, 98, 98, 99
    ] },
  };

  const MAGE_SUMS = {
    M: { AR: 1, MC: 1, AS: 1, VE: 2 },
    A: { MK: 1, VE: 1 },
    G: { AR: 1, VE: 1 },
    E: { GS: 1, AR: 1, MK: 1, EI: 1 }
  };

  function magePercentile(code, sum) {
    const t = MAGE_TABLES[code];
    const i = Math.round(sum) - t.floor;
    if (i <= 0) return t.pct[0];
    if (i >= t.pct.length) return 99;
    return t.pct[i];
  }

  function airForce(ss) {
    const r = rounded(ss);
    const out = {};
    for (const code of Object.keys(MAGE_SUMS)) {
      const s = sumOf(r, MAGE_SUMS[code]);
      if (s !== null) out[code] = magePercentile(code, s);
    }
    return out;
  }

  // Sec. 2.5.2: C = Rnd(slope * sum + intercept), mean 100 / SD 20 in the '97
  // reference population (derived from the Table 2.6 moments).
  const MARINE = {
    GT: { sum: { AR: 1, MC: 1, VE: 1 }, slope: 0.755294, intercept: -13.289535 },
    MM: { sum: { AR: 1, MC: 1, EI: 1, AS: 1 }, slope: 0.588215, intercept: -17.645724 },
    EL: { sum: { GS: 1, AR: 1, MK: 1, EI: 1 }, slope: 0.577992, intercept: -15.599795 },
    CL: { sum: { MK: 1, VE: 1 }, slope: 1.092264, intercept: -9.232992 }
  };

  function marines(ss) {
    const r = rounded(ss);
    const out = {};
    for (const code of Object.keys(MARINE)) {
      const m = MARINE[code];
      const s = sumOf(r, m.sum);
      if (s !== null) out[code] = Math.round(m.slope * s + m.intercept);
    }
    return out;
  }

  const ARMY_TECH = ['GS', 'AR', 'MK', 'MC', 'EI', 'AS', 'VE'];

  // GT needs only AR + VE (the AFQT tests cover it); the other nine use all
  // seven inputs through the Table 2.7 weights.
  function army(ss) {
    const out = {};
    const r = rounded(ss);
    if (Number.isFinite(r.AR) && Number.isFinite(r.VE)) out.GT = P.gtScore(r.AR, r.VE);
    if (ARMY_TECH.every((k) => Number.isFinite(ss[k]))) {
      for (const code of Object.keys(P.ARMY_WEIGHTS)) out[code] = P.lineScoreFromSS(code, ss);
    }
    return out;
  }

  // Which sections feed each composite, for "what to study" suggestions.
  // Army lists the primary ingredients (CLAUDE.md), not the small cross-weights.
  const INGREDIENTS = {
    army: {
      GT: ['VE', 'AR'], CL: ['VE', 'AR', 'MK'], CO: ['AR', 'AS', 'MC'], EL: ['GS', 'AR', 'MK', 'EI'],
      FA: ['AR', 'MK', 'MC'], GM: ['GS', 'AS', 'MK', 'EI'], MM: ['AS', 'MC', 'EI'], OF: ['VE', 'AS', 'MC'],
      SC: ['VE', 'AR', 'AS', 'MC'], ST: ['GS', 'VE', 'MK', 'MC']
    },
    'air-force': { M: ['AR', 'MC', 'AS', 'VE'], A: ['MK', 'VE'], G: ['AR', 'VE'], E: ['GS', 'AR', 'MK', 'EI'] },
    'marine-corps': { GT: ['VE', 'AR', 'MC'], MM: ['AR', 'MC', 'EI', 'AS'], EL: ['GS', 'AR', 'MK', 'EI'], CL: ['VE', 'MK'] }
  };

  function forBranch(branch, ss) {
    if (branch === 'army') return army(ss || {});
    if (branch === 'air-force') return airForce(ss || {});
    if (branch === 'marine-corps') return marines(ss || {});
    return {};
  }

  const api = { rounded, airForce, marines, army, forBranch, magePercentile, MAGE_TABLES, MAGE_SUMS, MARINE, INGREDIENTS };
  root.MissionASVABBranchComposites = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
