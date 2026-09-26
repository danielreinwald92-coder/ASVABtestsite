// ASVAB score calculator (asvab-score-calculator.html): standard scores from a
// score report -> AFQTS -> AFQT percentile and Army line scores, using the
// same official constants as the practice-test scoring (js/irt-params.js).
// Pure functions only; DOM wiring lives in js/page-score-calculator.js.
(function (root) {
  const P = root.MissionASVABIRTParams ||
    (typeof module !== 'undefined' && module.exports ? require('./irt-params.js') : null);

  const MIN_SS = 20;
  const MAX_SS = 80;

  function validSS(v) {
    return Number.isFinite(v) && v >= MIN_SS && v <= MAX_SS;
  }

  // Invert the official theta -> SS transform so WK/PC standard scores can be
  // recombined through the official VE composite (Segall eq. 2.3).
  function ssToTheta(code, ss) {
    const t = P.SS_TRANSFORM[code];
    return (ss - t.B) / t.A;
  }

  function veFromWkPc(wk, pc) {
    return P.veStandardScore(ssToTheta('WK', wk), ssToTheta('PC', pc));
  }

  // inputs: { AR, MK, WK, PC, VE?, GS?, EI?, AS?, MC? } (numbers or NaN).
  // VE from the score report wins over WK/PC when given.
  function calculate(inputs) {
    const errors = [];
    const ar = inputs.AR;
    const mk = inputs.MK;
    let ve = inputs.VE;
    if (!validSS(ar)) errors.push('AR');
    if (!validSS(mk)) errors.push('MK');
    if (!validSS(ve)) {
      if (validSS(inputs.WK) && validSS(inputs.PC)) ve = veFromWkPc(inputs.WK, inputs.PC);
      else errors.push('VE');
    }
    if (errors.length) return { ok: false, missing: errors };

    const veRounded = Math.round(ve);
    const afqts = Math.round(ar) + Math.round(mk) + 2 * veRounded;
    const result = {
      ok: true,
      ve: veRounded,
      afqts: afqts,
      percentile: P.afqtsToPercentile(afqts),
      lineScores: null,
      lineMissing: [],
    };

    const tech = ['GS', 'EI', 'AS', 'MC'];
    result.lineMissing = tech.filter((c) => !validSS(inputs[c]));
    if (!result.lineMissing.length) {
      const ss = { GS: inputs.GS, AR: ar, MK: mk, MC: inputs.MC, EI: inputs.EI, AS: inputs.AS, VE: ve };
      result.lineScores = { GT: P.gtScore(Math.round(ar), veRounded) };
      ['CL', 'CO', 'EL', 'FA', 'GM', 'MM', 'OF', 'SC', 'ST'].forEach((code) => {
        result.lineScores[code] = P.lineScoreFromSS(code, ss);
      });
    }
    return result;
  }

  // AFQT category bands used across the services (DoD Instruction 1145.01).
  function afqtCategory(percentile) {
    if (percentile >= 93) return 'I';
    if (percentile >= 65) return 'II';
    if (percentile >= 50) return 'IIIA';
    if (percentile >= 31) return 'IIIB';
    if (percentile >= 21) return 'IVA';
    if (percentile >= 16) return 'IVB';
    if (percentile >= 10) return 'IVC';
    return 'V';
  }

  const api = { MIN_SS, MAX_SS, calculate, veFromWkPc, afqtCategory };
  root.MissionASVABScoreCalculator = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
