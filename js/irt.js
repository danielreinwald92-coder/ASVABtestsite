// 3PL IRT math for the CAT engine and scoring pipeline (IRT scoring v2).
//
// Metric convention: published ASVAB item parameters follow the D=1.7
// normal-metric convention, so `a` is used directly in Owen's normal-ogive
// update and with the D=1.702 factor in the logistic 3PL for MAP/information.
// Sources (see docs/research/ and the v2 spec): Segall 2004; ASVAB Technical
// Bulletins No. 1 & 3; van der Linden RR-96-01 (Owen's eqs. A.1-A.6).
(function (root) {
  const D = 1.702;
  const SQRT_2PI = Math.sqrt(2 * Math.PI);

  function normalPdf(x) {
    return Math.exp(-0.5 * x * x) / SQRT_2PI;
  }

  // Standard normal CDF via the Abramowitz & Stegun 7.1.26 erf approximation
  // (max abs error ~1.5e-7), same implementation the v1 scoring module used.
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

  function p3pl(theta, item) {
    return item.c + (1 - item.c) / (1 + Math.exp(-D * item.a * (theta - item.b)));
  }

  // 3PL Fisher information (Lord 1980, eq. 5-9).
  function fisherInfo(theta, item) {
    const p = p3pl(theta, item);
    const ratio = (p - item.c) / (1 - item.c);
    return Math.pow(D * item.a, 2) * ((1 - p) / p) * ratio * ratio;
  }

  // Owen's sequential Bayesian update — the interim estimator the real
  // CAT-ASVAB runs between items (normal-ogive metric; `a` used directly).
  function owenUpdate(state, item, correct) {
    const a = item.a;
    const b = item.b;
    const c = item.c;
    const invA2 = 1 / (a * a);
    const den = Math.sqrt(invA2 + state.variance);
    const xi = (b - state.mean) / den;
    const shrink = state.variance / (state.variance + invA2);
    if (correct) {
      const pStar = c + (1 - c) * normalCdf(-xi);
      const zeta = c + (1 - c) * normalCdf(xi);
      const g = normalPdf(xi) / zeta;
      return {
        mean: state.mean + (1 - c) * (state.variance / den) * (normalPdf(xi) / pStar),
        variance: state.variance * (1 - (1 - c) * shrink * g * ((1 - c) * g - xi))
      };
    }
    const r = normalPdf(xi) / normalCdf(xi);
    return {
      mean: state.mean - (state.variance / den) * r,
      variance: state.variance * (1 - shrink * r * (r + xi))
    };
  }

  // Final ability: posterior mode (MAP) of the 3PL likelihood x N(0,1) prior,
  // dense grid over [-4, 4] step 0.01 (the official estimator choice; spec §6).
  // SEM is the posterior SD computed on the same grid.
  function mapEstimate(responses) {
    if (!responses || !responses.length) return { theta: 0, sem: 1 };
    const thetas = [];
    const logPost = [];
    let maxLp = -Infinity;
    for (let i = 0; i <= 800; i++) {
      const t = -4 + i * 0.01;
      let lp = -0.5 * t * t;
      for (const r of responses) {
        const p = p3pl(t, r);
        lp += Math.log(r.correct ? p : 1 - p);
      }
      thetas.push(t);
      logPost.push(lp);
      if (lp > maxLp) maxLp = lp;
    }
    let mode = 0;
    let sumW = 0;
    let sumWT = 0;
    let sumWT2 = 0;
    for (let i = 0; i < thetas.length; i++) {
      if (logPost[i] === maxLp) mode = thetas[i];
      const w = Math.exp(logPost[i] - maxLp);
      sumW += w;
      sumWT += w * thetas[i];
      sumWT2 += w * thetas[i] * thetas[i];
    }
    const mean = sumWT / sumW;
    const sem = Math.sqrt(Math.max(sumWT2 / sumW - mean * mean, 1e-6));
    return { theta: mode, sem };
  }

  const api = { p3pl, fisherInfo, owenUpdate, mapEstimate, normalCdf, normalPdf };
  root.MissionASVABIRT = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
