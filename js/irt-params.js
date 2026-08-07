// Item-parameter assignment and official score-conversion tables (IRT v2).
// All constants are published values — see the v2 spec §5/§8 and docs/research/.
(function (root) {
  // Published pool statistics (ASVAB Tech Bulletin 3, Forms 5-9 midpoints).
  const SECTION_IRT = {
    GS: { a: 1.07, bMean: 0.15, bSD: 1.25, c: 0.19 },
    AR: { a: 1.31, bMean: -0.04, bSD: 1.10, c: 0.175 },
    WK: { a: 1.50, bMean: -0.16, bSD: 1.20, c: 0.215 },
    PC: { a: 1.26, bMean: -0.36, bSD: 1.10, c: 0.18 },
    MK: { a: 1.45, bMean: 0.44, bSD: 0.95, c: 0.17 },
    EI: { a: 1.18, bMean: -0.03, bSD: 1.30, c: 0.21 },
    AS: { a: 1.34, bMean: -0.03, bSD: 1.15, c: 0.185 },
    MC: { a: 0.95, bMean: 0.01, bSD: 1.20, c: 0.19 }
  };

  const DIFF_OFFSET = { 1: -1.5, 2: -0.75, 3: 0, 4: 0.75, 5: 1.5 };

  // Per-item empirical calibration overrides (itemId -> {a,b,c}). Empty at
  // launch; a future project fills this from accumulated question_results.
  const CALIBRATED = {};

  function getItemParams(sectionCode, difficulty, itemId) {
    if (itemId && CALIBRATED[itemId]) return CALIBRATED[itemId];
    const s = SECTION_IRT[sectionCode] || SECTION_IRT.AR;
    const offset = DIFF_OFFSET[difficulty] !== undefined ? DIFF_OFFSET[difficulty] : 0;
    return { a: s.a, b: s.bMean + offset * s.bSD, c: s.c };
  }

  // Official theta -> standard-score transforms (Segall 2004, Table 2.4, Form 04D).
  const SS_TRANSFORM = {
    GS: { A: 11.543462, B: 48.988873 },
    AR: { A: 11.528721, B: 48.365417 },
    WK: { A: 11.032817, B: 47.809880 },
    PC: { A: 12.351821, B: 45.886521 },
    MK: { A: 10.025804, B: 46.255061 },
    MC: { A: 12.957792, B: 51.247394 },
    EI: { A: 11.034039, B: 51.159592 }
  };

  function thetaToSS(sectionCode, theta) {
    const t = SS_TRANSFORM[sectionCode];
    if (!t) return NaN;
    return t.A * theta + t.B;
  }

  // Segall eq. 2.3 (official VE weighting: PC ~0.62 the weight of WK).
  function veStandardScore(thetaWK, thetaPC) {
    return 7.225587 * thetaWK + 5.010103 * thetaPC + 46.897156;
  }

  // Segall eq. 2.4, degenerate single combined-AS form (7.648241 + 6.991018).
  function asStandardScore(thetaAS) {
    return 14.639259 * thetaAS + 56.220220;
  }

  // '97 AFQT percentile conversion (Segall Table 2.5, verbatim). Each entry is
  // [first AFQTS value of the run, percentile]; values below 110 are 1, values
  // >= 269 are 99. Percentiles 37, 58 and 65 are absent in the official table.
  const AFQT_STARTS = [
    [110, 2], [119, 3], [125, 4], [134, 5], [138, 6], [142, 7], [146, 8],
    [148, 9], [152, 10], [154, 11], [157, 12], [158, 13], [160, 14], [161, 15],
    [163, 16], [165, 17], [167, 18], [168, 19], [170, 20], [171, 21], [172, 22],
    [174, 23], [175, 24], [176, 25], [178, 26], [179, 27], [180, 28], [181, 29],
    [182, 30], [183, 31], [184, 32], [185, 33], [186, 34], [187, 35], [189, 36],
    [190, 38], [191, 39], [192, 40], [193, 41], [194, 42], [195, 43], [196, 44],
    [197, 45], [198, 46], [199, 47], [200, 48], [201, 49], [202, 50], [203, 51],
    [204, 52], [205, 53], [206, 54], [207, 55], [208, 56], [209, 57], [210, 59],
    [211, 60], [212, 61], [213, 62], [214, 63], [215, 64], [216, 66], [217, 67],
    [218, 68], [219, 69], [220, 70], [222, 71], [223, 72], [224, 73], [225, 74],
    [226, 75], [227, 76], [228, 77], [229, 78], [230, 79], [231, 80], [232, 81],
    [233, 82], [235, 83], [236, 84], [237, 85], [239, 86], [240, 87], [241, 88],
    [243, 89], [244, 90], [246, 91], [247, 92], [249, 93], [252, 94], [254, 95],
    [257, 96], [260, 97], [264, 98], [269, 99]
  ];

  function afqtsToPercentile(afqts) {
    if (!Number.isFinite(afqts) || afqts < 110) return 1;
    let pct = 1;
    for (let i = 0; i < AFQT_STARTS.length; i++) {
      if (afqts >= AFQT_STARTS[i][0]) pct = AFQT_STARTS[i][1];
      else break;
    }
    return pct;
  }

  // Army composites (Segall 2004): GT has its own published formula (rounded
  // SS inputs); the nine non-integer composites use Table 2.7 weights applied
  // to unrounded standard scores in the order GS AR MK MC EI AS VE + constant.
  function gtScore(ssArRounded, ssVeRounded) {
    return Math.round(1.074292 * (ssArRounded + ssVeRounded) - 7.443781);
  }

  const ARMY_WEIGHTS = {
    CL: { GS: 0.00000, AR: 0.75179, MK: 0.58715, MC: 0.11541, EI: 0.07756, AS: 0.07489, VE: 0.67976, C: -14.32772 },
    CO: { GS: 0.19868, AR: 0.33090, MK: 0.63397, MC: 0.38486, EI: 0.19979, AS: 0.41161, VE: 0.30347, C: -23.17105 },
    EL: { GS: 0.08324, AR: 0.44254, MK: 0.49064, MC: 0.26341, EI: 0.30258, AS: 0.36786, VE: 0.49906, C: -22.46667 },
    FA: { GS: 0.15031, AR: 0.42263, MK: 0.60172, MC: 0.42966, EI: 0.16389, AS: 0.35866, VE: 0.31958, C: -22.32119 },
    GM: { GS: 0.23521, AR: 0.46357, MK: 0.45285, MC: 0.29280, EI: 0.30216, AS: 0.50542, VE: 0.21527, C: -23.36174 },
    MM: { GS: 0.05942, AR: 0.32829, MK: 0.28517, MC: 0.39607, EI: 0.30796, AS: 0.87309, VE: 0.21150, C: -23.08481 },
    OF: { GS: 0.14306, AR: 0.53676, MK: 0.34092, MC: 0.36843, EI: 0.19683, AS: 0.50334, VE: 0.36757, C: -22.84882 },
    SC: { GS: 0.01235, AR: 0.42812, MK: 0.63650, MC: 0.25070, EI: 0.32194, AS: 0.24636, VE: 0.52770, C: -21.18951 },
    ST: { GS: 0.12865, AR: 0.49010, MK: 0.47825, MC: 0.31207, EI: 0.14493, AS: 0.21736, VE: 0.62177, C: -19.65219 }
  };

  function lineScoreFromSS(code, ssMap) {
    const w = ARMY_WEIGHTS[code];
    if (!w) return NaN;
    const sum = w.GS * ssMap.GS + w.AR * ssMap.AR + w.MK * ssMap.MK +
      w.MC * ssMap.MC + w.EI * ssMap.EI + w.AS * ssMap.AS + w.VE * ssMap.VE + w.C;
    return Math.round(sum);
  }

  const api = {
    SECTION_IRT, DIFF_OFFSET, CALIBRATED, getItemParams,
    SS_TRANSFORM, thetaToSS, veStandardScore, asStandardScore,
    AFQT_STARTS, afqtsToPercentile, gtScore, ARMY_WEIGHTS, lineScoreFromSS
  };
  root.MissionASVABIRTParams = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
