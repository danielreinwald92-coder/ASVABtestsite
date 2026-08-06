# IRT Scoring v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the linear %-correct scoring model with the official CAT-ASVAB pipeline: 3PL IRT ability estimation (Owen interim + MAP final), official theta→standard-score transforms, official VE weighting, verbatim PAY97 AFQT percentile table, and the official Army composite weight matrix.

**Architecture:** Two new pure-logic browser modules (`js/irt.js`, `js/irt-params.js`) plus a generated penalty table feed a rewritten `js/scoring.js`; `js/quiz-engine.js` swaps its 1–5 ability ladder for Owen Bayesian state and max-information item selection. All modules follow the project's IIFE + `root.X` + optional `module.exports` pattern. Spec (single source of truth for constants and rationale): `docs/superpowers/specs/2026-08-06-irt-scoring-v2-design.md`.

**Tech Stack:** Vanilla JS (no new dependencies), node:test + jsdom for tests, Supabase for persistence, Playwright e2e.

## Global Constraints

- **No inline JS in HTML** — strict CSP; all logic in `js/*.js`; `scripts/check-no-inline-js.js` gates CI.
- **Module pattern:** every new js file is an IIFE taking `(typeof window !== 'undefined' ? window : globalThis)`, exposing `root.<Name>` and `module.exports` when available (copy the pattern from the current `js/scoring.js:20` and `:153-158`).
- **Tests:** node:test (`npm test` runs `tests/unit/*.test.js`); DOM-dependent tests use the existing `tests/helpers/load.js` / `tests/helpers/engine.js` jsdom harness.
- **Pool ratchet:** never reduce question pools (`POOL_MINIMUMS` in `scripts/validate-site.js`).
- **Diagnostic mode is untouched:** fixed 18-question `difficultyPlan` ladder, `afqt: null`, `line_scores: null` (pinned by `tests/unit/diagnostic.test.js`).
- **Release rule:** any change to an existing JS file requires a `CACHE_VERSION` bump in `service-worker.js` (done once, Task 9).
- **Commit after every green task** (conventional messages, `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` footer).
- Constants (transforms, weights, AFQT table) must match the spec **digit-for-digit** — they are official published values; do not round or "clean up".

---

### Task 1: `js/irt.js` — 3PL math, Owen update, MAP estimate

**Files:**
- Create: `js/irt.js`
- Test: `tests/unit/irt.test.js`

**Interfaces:**
- Consumes: nothing (pure math, zero dependencies).
- Produces (used by Tasks 2–6):
  - `p3pl(theta, {a,b,c}) → number` (probability correct, logistic 3PL with D=1.702)
  - `fisherInfo(theta, {a,b,c}) → number`
  - `owenUpdate({mean, variance}, {a,b,c}, correct:boolean) → {mean, variance}`
  - `mapEstimate([{a,b,c,correct}]) → {theta, sem}`
  - `normalCdf(z) → number`, `normalPdf(x) → number`
  - Global: `root.MissionASVABIRT`, CommonJS `module.exports`.

- [ ] **Step 1: Write the failing test**

Create `tests/unit/irt.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert');
const IRT = require('../../js/irt.js');

const ITEM = { a: 1, b: 0, c: 0.2 };

test('p3pl at theta=b returns c + (1-c)/2', () => {
  assert.ok(Math.abs(IRT.p3pl(0, ITEM) - 0.6) < 1e-9);
});

test('p3pl is increasing in theta and bounded (c, 1)', () => {
  let prev = 0;
  for (let t = -4; t <= 4; t += 0.5) {
    const p = IRT.p3pl(t, ITEM);
    assert.ok(p > ITEM.c && p < 1 && p > prev);
    prev = p;
  }
});

test('fisherInfo peaks near b', () => {
  const atB = IRT.fisherInfo(0, ITEM);
  assert.ok(atB > IRT.fisherInfo(-2, ITEM));
  assert.ok(atB > IRT.fisherInfo(2.5, ITEM));
});

// Hand-computed from the Owen equations (spec §6) with state {0,1}, item {1,0,0.2}:
// xi = 0, phi(0)=0.3989423, Phi(0)=0.5, P*=0.6, zeta=0.6, shrink=0.5.
test('owenUpdate correct: hand-computed anchor', () => {
  const s = IRT.owenUpdate({ mean: 0, variance: 1 }, ITEM, true);
  assert.ok(Math.abs(s.mean - 0.37610) < 1e-4, `mean ${s.mean}`);
  assert.ok(Math.abs(s.variance - 0.85853) < 1e-4, `variance ${s.variance}`);
});

test('owenUpdate incorrect: hand-computed anchor', () => {
  const s = IRT.owenUpdate({ mean: 0, variance: 1 }, ITEM, false);
  assert.ok(Math.abs(s.mean - (-0.56418)) < 1e-4, `mean ${s.mean}`);
  assert.ok(Math.abs(s.variance - 0.68170) < 1e-4, `variance ${s.variance}`);
});

test('owenUpdate properties: correct raises mean, incorrect lowers, variance always shrinks', () => {
  for (const b of [-1.5, 0, 1.5]) {
    const item = { a: 1.3, b, c: 0.18 };
    const up = IRT.owenUpdate({ mean: 0, variance: 1 }, item, true);
    const down = IRT.owenUpdate({ mean: 0, variance: 1 }, item, false);
    assert.ok(up.mean > 0 && down.mean < 0);
    assert.ok(up.variance < 1 && down.variance < 1);
  }
});

test('owenUpdate: correct on hard item moves mean more than correct on easy item', () => {
  const hard = IRT.owenUpdate({ mean: 0, variance: 1 }, { a: 1, b: 1.5, c: 0.2 }, true);
  const easy = IRT.owenUpdate({ mean: 0, variance: 1 }, { a: 1, b: -1.5, c: 0.2 }, true);
  assert.ok(hard.mean > easy.mean);
});

test('mapEstimate: empty input returns prior', () => {
  assert.deepStrictEqual(IRT.mapEstimate([]), { theta: 0, sem: 1 });
});

test('mapEstimate: all correct is high but prior-regressed; all wrong is low', () => {
  const items = Array.from({ length: 15 }, (_, i) => ({ a: 1.3, b: -1 + i * 0.15, c: 0.18 }));
  const allRight = IRT.mapEstimate(items.map((it) => ({ ...it, correct: true })));
  const allWrong = IRT.mapEstimate(items.map((it) => ({ ...it, correct: false })));
  assert.ok(allRight.theta > 1.2 && allRight.theta < 4);
  assert.ok(allWrong.theta < -1.2 && allWrong.theta > -4);
  assert.ok(Number.isFinite(allRight.sem) && allRight.sem > 0);
});

test('mapEstimate: sem shrinks as items are added', () => {
  const mk = (n) => Array.from({ length: n }, (_, i) => ({ a: 1.3, b: (i % 5) - 2, c: 0.18, correct: i % 2 === 0 }));
  assert.ok(IRT.mapEstimate(mk(15)).sem < IRT.mapEstimate(mk(5)).sem);
});

test('mapEstimate is monotone: flipping a response to correct never lowers theta', () => {
  const items = Array.from({ length: 10 }, (_, i) => ({ a: 1.2, b: -1.5 + i * 0.3, c: 0.2, correct: i < 5 }));
  const base = IRT.mapEstimate(items).theta;
  const flipped = items.map((it, i) => (i === 7 ? { ...it, correct: true } : it));
  assert.ok(IRT.mapEstimate(flipped).theta >= base);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/unit/irt.test.js`
Expected: FAIL with `Cannot find module '../../js/irt.js'`

- [ ] **Step 3: Write the implementation**

Create `js/irt.js`:

```js
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test tests/unit/irt.test.js`
Expected: PASS (all tests). If the two hand-computed anchors fail by more than 1e-4, re-derive the expected values from the equations in spec §6 against `docs/research/owen_pg22.png`/`owen_pg23.png` before touching the implementation — the scans are the authority.

- [ ] **Step 5: Run the whole suite, then commit**

Run: `npm test` — expected: 197 existing + new tests all pass.

```bash
git add js/irt.js tests/unit/irt.test.js
git commit -m "feat: 3PL IRT core (Owen interim update, MAP final estimate)"
```

---

### Task 2: `js/irt-params.js` — item parameters + official conversion tables

**Files:**
- Create: `js/irt-params.js`
- Test: `tests/unit/irt-params.test.js`

**Interfaces:**
- Consumes: nothing.
- Produces (used by Tasks 3–6, 9):
  - `SECTION_IRT` — `{GS|AR|WK|PC|MK|EI|AS|MC: {a, bMean, bSD, c}}`
  - `getItemParams(sectionCode, difficulty, itemId) → {a, b, c}` (CALIBRATED override first)
  - `thetaToSS(sectionCode, theta) → number` (unrounded; sections GS AR WK PC MK MC EI only)
  - `veStandardScore(thetaWK, thetaPC) → number` (unrounded)
  - `asStandardScore(thetaAS) → number` (unrounded)
  - `afqtsToPercentile(afqts) → integer 1–99`
  - `gtScore(ssArRounded, ssVeRounded) → integer`
  - `lineScoreFromSS(code, ssMap) → integer` for the nine non-integer composites; `ssMap = {GS,AR,MK,MC,EI,AS,VE}` unrounded
  - Global: `root.MissionASVABIRTParams`, CommonJS export.

- [ ] **Step 1: Write the failing test**

Create `tests/unit/irt-params.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert');
const P = require('../../js/irt-params.js');

test('theta 0 maps to the official Form 04D intercepts', () => {
  assert.ok(Math.abs(P.thetaToSS('AR', 0) - 48.365417) < 1e-6);
  assert.ok(Math.abs(P.thetaToSS('MK', 0) - 46.255061) < 1e-6);
  assert.ok(Math.abs(P.thetaToSS('MC', 0) - 51.247394) < 1e-6);
});

test('VE and AS composite formulas match Segall eqs. 2.3-2.4', () => {
  assert.ok(Math.abs(P.veStandardScore(0, 0) - 46.897156) < 1e-6);
  assert.ok(Math.abs(P.veStandardScore(1, 1) - (7.225587 + 5.010103 + 46.897156)) < 1e-6);
  assert.ok(Math.abs(P.asStandardScore(0) - 56.220220) < 1e-6);
});

test('AFQT table anchors (Segall Table 2.5)', () => {
  assert.strictEqual(P.afqtsToPercentile(0), 1);
  assert.strictEqual(P.afqtsToPercentile(109), 1);
  assert.strictEqual(P.afqtsToPercentile(110), 2);
  assert.strictEqual(P.afqtsToPercentile(170), 20);
  assert.strictEqual(P.afqtsToPercentile(183), 31);
  assert.strictEqual(P.afqtsToPercentile(202), 50);
  assert.strictEqual(P.afqtsToPercentile(231), 80);
  assert.strictEqual(P.afqtsToPercentile(249), 93);
  assert.strictEqual(P.afqtsToPercentile(268), 98);
  assert.strictEqual(P.afqtsToPercentile(269), 99);
  assert.strictEqual(P.afqtsToPercentile(400), 99);
});

test('AFQT table is total and non-decreasing over 0..400, hits exactly 1..99 minus {37,58,65}', () => {
  const seen = new Set();
  let prev = 1;
  for (let s = 0; s <= 400; s++) {
    const p = P.afqtsToPercentile(s);
    assert.ok(Number.isInteger(p) && p >= 1 && p <= 99, `afqts ${s} -> ${p}`);
    assert.ok(p >= prev, `not monotone at ${s}`);
    prev = p;
    seen.add(p);
  }
  for (let p = 1; p <= 99; p++) {
    const expected = ![37, 58, 65].includes(p);
    assert.strictEqual(seen.has(p), expected, `percentile ${p}`);
  }
});

test('item params: difficulty tag maps onto the published pool distribution', () => {
  const mk5 = P.getItemParams('MK', 5, 'mk_x');
  assert.ok(Math.abs(mk5.b - (0.44 + 1.5 * 0.95)) < 1e-9);
  assert.strictEqual(mk5.a, 1.45);
  assert.strictEqual(mk5.c, 0.17);
  const pc1 = P.getItemParams('PC', 1, 'pc_x');
  assert.ok(Math.abs(pc1.b - (-0.36 - 1.5 * 1.10)) < 1e-9);
  const fallback = P.getItemParams('WK', undefined, 'wk_x');
  assert.ok(Math.abs(fallback.b - (-0.16)) < 1e-9, 'missing difficulty treated as 3');
});

test('CALIBRATED override wins over the heuristic', () => {
  P.CALIBRATED.test_item_1 = { a: 2, b: 0.5, c: 0.25 };
  try {
    assert.deepStrictEqual(P.getItemParams('AR', 2, 'test_item_1'), { a: 2, b: 0.5, c: 0.25 });
  } finally {
    delete P.CALIBRATED.test_item_1;
  }
});

test('average profile (all SS 50) scores ~100 on every Army composite', () => {
  const ss = { GS: 50, AR: 50, MK: 50, MC: 50, EI: 50, AS: 50, VE: 50 };
  for (const code of ['CL', 'CO', 'EL', 'FA', 'GM', 'MM', 'OF', 'SC', 'ST']) {
    assert.strictEqual(P.lineScoreFromSS(code, ss), 100, code);
  }
  assert.strictEqual(P.gtScore(50, 50), 100);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/unit/irt-params.test.js`
Expected: FAIL with `Cannot find module '../../js/irt-params.js'`

- [ ] **Step 3: Write the implementation**

Create `js/irt-params.js`. Every constant below is from the v2 spec (§5, §8) — copy digit-for-digit:

```js
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test tests/unit/irt-params.test.js` — expected: PASS.
If the "minus {37,58,65}" test fails, diff `AFQT_STARTS` against the verbatim table in `docs/research/segall1997.txt` lines 767–860 — the extract is the authority.

- [ ] **Step 5: Commit**

```bash
git add js/irt-params.js tests/unit/irt-params.test.js
git commit -m "feat: official ASVAB conversion tables + heuristic 3PL item parameters"
```

---

### Task 3: penalty table (generator script + committed data)

**Files:**
- Create: `scripts/generate-penalty-table.js`
- Create: `js/penalty-table.js` (generated output, committed)
- Test: `tests/unit/penalty-table.test.js`

**Interfaces:**
- Consumes: `MissionASVABIRT.{p3pl, fisherInfo, mapEstimate}`, `MissionASVABIRTParams.getItemParams`, question bank tag distribution from `js/quiz-data.js`, section lengths from `js/section-config.js`.
- Produces: `root.MissionASVABPenalty` = `{ [sectionCode]: { [unansweredCount]: {A, B} } }` — used by `scoring.js` (Task 4) as `theta = A + B * theta` when a section has unanswered items.

- [ ] **Step 1: Write the generator**

Create `scripts/generate-penalty-table.js` (node script; official method from spec §6 — regress full-test MAP on partial-test MAP with random completions at P(correct)=0.2):

```js
#!/usr/bin/env node
// Generates js/penalty-table.js — incomplete-test penalty coefficients,
// replicating the official CAT-ASVAB derivation (Segall 1988; TB1 Ch.3 §7):
// theta_final = A + B * theta_answered, per (section, unansweredCount).
// Deterministic (seeded PRNG). Re-run only when irt params or pools change:
//   node scripts/generate-penalty-table.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const IRT = require('../js/irt.js');
const PARAMS = require('../js/irt-params.js');

// Load the browser-global question bank and section config in a sandbox.
const sandbox = {};
sandbox.globalThis = sandbox;
sandbox.window = undefined;
for (const f of ['js/section-config.js', 'js/quiz-data.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'), sandbox);
}
const SECTIONS = sandbox.SECTION_CONFIG;
const bank = sandbox.asvabData.questions;

function mulberry32(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SIMULEES = 1000;
const rand = mulberry32(19970801);

function sectionItems(code) {
  return bank[code].map((q) => PARAMS.getItemParams(code, q.difficulty || 3, q.id));
}

// Adaptive administration mirroring the engine: max info at current Owen mean,
// random among top 5, no reuse.
function administer(items, theta, count, state, used, randomResponses) {
  const records = [];
  for (let i = 0; i < count; i++) {
    let best = [];
    for (let j = 0; j < items.length; j++) {
      if (used.has(j)) continue;
      const info = IRT.fisherInfo(state.mean, items[j]);
      best.push([info, j]);
    }
    if (!best.length) break;
    best.sort((x, y) => y[0] - x[0]);
    const pick = best[Math.floor(rand() * Math.min(5, best.length))][1];
    used.add(pick);
    const item = items[pick];
    const pCorrect = randomResponses ? 0.2 : IRT.p3pl(theta, item);
    const correct = rand() < pCorrect;
    Object.assign(state, IRT.owenUpdate(state, item, correct));
    records.push({ a: item.a, b: item.b, c: item.c, correct });
  }
  return records;
}

function regress(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((s, v) => s + v, 0) / n;
  const my = ys.reduce((s, v) => s + v, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) * (xs[i] - mx);
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  const B = sxx > 1e-9 ? sxy / sxx : 0;
  return { A: Number((my - B * mx).toFixed(4)), B: Number(B.toFixed(4)) };
}

const table = {};
for (const code of Object.keys(SECTIONS)) {
  const n = SECTIONS[code].questionsPerTest;
  const items = sectionItems(code);
  table[code] = {};
  for (let u = 1; u <= n; u++) {
    const partial = [];
    const full = [];
    for (let s = 0; s < SIMULEES; s++) {
      const theta = -3 + 6 * rand();
      const state = { mean: 0, variance: 1 };
      const used = new Set();
      const answered = administer(items, theta, n - u, state, used, false);
      const randomTail = administer(items, theta, u, state, used, true);
      partial.push(IRT.mapEstimate(answered).theta);
      full.push(IRT.mapEstimate(answered.concat(randomTail)).theta);
    }
    table[code][u] = regress(partial, full);
  }
  console.log(`${code}: ${n} unanswered-counts done`);
}

const out = '// GENERATED by scripts/generate-penalty-table.js — do not hand-edit.\n' +
  '// Incomplete-test penalty (official method, spec §6): theta = A + B * theta_answered.\n' +
  '(function (root) {\n' +
  '  const table = ' + JSON.stringify(table, null, 2).replace(/\n/g, '\n  ') + ';\n' +
  '  root.MissionASVABPenalty = table;\n' +
  '  if (typeof module !== \'undefined\' && module.exports) {\n' +
  '    module.exports = table;\n' +
  '  }\n' +
  '})(typeof window !== \'undefined\' ? window : globalThis);\n';
fs.writeFileSync(path.join(__dirname, '..', 'js', 'penalty-table.js'), out);
console.log('Wrote js/penalty-table.js');
```

Note: `mapEstimate` with an empty `answered` array (u = n) returns `{theta: 0}` for every simulee, so `sxx` is ~0 and `regress` correctly degrades to `B = 0`, `A = mean(full)` — the all-random case.

- [ ] **Step 2: Run the generator**

Run: `node scripts/generate-penalty-table.js` (takes a few minutes — 8 sections × up to 15 counts × 1000 simulees).
Expected: prints one line per section, writes `js/penalty-table.js`.

- [ ] **Step 3: Write the structural test**

Create `tests/unit/penalty-table.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert');
const PENALTY = require('../../js/penalty-table.js');
const SECTIONS = ['GS', 'AR', 'WK', 'PC', 'MK', 'EI', 'AS', 'MC'];
const LENGTHS = { GS: 15, AR: 15, WK: 15, PC: 10, MK: 15, EI: 15, AS: 10, MC: 15 };

test('penalty table covers every (section, unansweredCount) with finite coefficients', () => {
  for (const code of SECTIONS) {
    for (let u = 1; u <= LENGTHS[code]; u++) {
      const p = PENALTY[code] && PENALTY[code][u];
      assert.ok(p && Number.isFinite(p.A) && Number.isFinite(p.B), `${code}/${u}`);
      assert.ok(p.B >= 0 && p.B <= 1.2, `${code}/${u} B=${p.B}`);
    }
  }
});

test('penalty grows with unanswered count (evaluated at theta=1)', () => {
  for (const code of SECTIONS) {
    const few = PENALTY[code][1];
    const many = PENALTY[code][LENGTHS[code] - 1];
    assert.ok(many.A + many.B * 1 < few.A + few.B * 1 + 0.15, code);
  }
});

test('all-unanswered coefficient is a low fixed score', () => {
  for (const code of SECTIONS) {
    const p = PENALTY[code][LENGTHS[code]];
    assert.ok(p.B === 0 || Math.abs(p.B) < 0.2, code);
    assert.ok(p.A < 0, `${code} all-random should score below average, got A=${p.A}`);
  }
});
```

- [ ] **Step 4: Run tests**

Run: `node --test tests/unit/penalty-table.test.js` — expected: PASS. If a bound fails marginally (simulation data), inspect the generated values for sanity against the official property "penalty grows with number unfinished" before loosening any tolerance.

- [ ] **Step 5: Commit**

```bash
git add scripts/generate-penalty-table.js js/penalty-table.js tests/unit/penalty-table.test.js
git commit -m "feat: incomplete-test penalty table (official regression method, generated)"
```

---

### Task 4: rewrite `js/scoring.js` + simulation acceptance test

**Files:**
- Modify: `js/scoring.js` (full rewrite; keep the public names `calculateAFQTEstimate`, `calculateLineScores`, `getSectionPercent`)
- Modify: `tests/unit/scoring.invariants.test.js`, `tests/unit/scoring.characterization.test.js`
- Test: `tests/unit/irt-simulation.test.js`

**Interfaces:**
- Consumes: `MissionASVABIRT.mapEstimate`, `MissionASVABIRTParams.*`, `MissionASVABPenalty` (all via `require` in node / globals in browser).
- Produces (used by quiz-engine Task 6, validate-site Task 9, page code Task 8):
  - `sectionResults` input shape per section: `{ name, correct, total, unanswered?, questions: [{ id?, originalId?, difficulty?, isCorrect, answered? }] }` — questions with `answered === false` are excluded from MAP and counted via the penalty.
  - `getScoreDetails(sectionResults) → { sections: {CODE: {theta, sem, ss}}, ve: {theta: null, ss}, afqts, percentile, band: {low, high} } | null` (null unless all 4 AFQT sections present)
  - `calculateAFQTEstimate(sectionResults) → integer 1–99 | null` (unchanged signature)
  - `calculateLineScores(sectionResults) → {GT: {name, score}, ...10 keys} | null` (now requires **all 8** sections)
  - `getSectionPercent(sectionResults, code) → integer` (unchanged, display helper)

- [ ] **Step 1: Update the invariants tests (write failing tests first)**

Rewrite `tests/unit/scoring.invariants.test.js` fixtures to the new per-question shape. Build fixtures with a helper at the top of the file:

```js
function mkSection(name, pattern, difficulty) {
  // pattern: array of booleans (isCorrect per question)
  return {
    name,
    correct: pattern.filter(Boolean).length,
    total: pattern.length,
    questions: pattern.map((ok, i) => ({
      id: `${name}_${i}`, difficulty: difficulty || ((i % 5) + 1), isCorrect: ok, answered: true
    }))
  };
}
function fullResults(fractionCorrect) {
  const mk = (n) => Array.from({ length: n }, (_, i) => i < Math.round(n * fractionCorrect));
  return {
    GS: mkSection('GS', mk(15)), AR: mkSection('AR', mk(15)), WK: mkSection('WK', mk(15)),
    PC: mkSection('PC', mk(10)), MK: mkSection('MK', mk(15)), EI: mkSection('EI', mk(15)),
    AS: mkSection('AS', mk(10)), MC: mkSection('MC', mk(15))
  };
}
```

Keep/adapt these invariants (same assertions, new fixtures):
- AFQT is `null` unless all of AR/WK/PC/MK are present.
- Perfect test (`fullResults(1)`) → AFQT exactly 99; all-wrong (`fullResults(0)`) → 1.
- Zero/empty totals → finite result ≥ 1 (no NaN).
- `calculateLineScores` returns exactly the 10 keys, every score a finite integer.
- Monotonic: `fullResults(0.3)` ≤ `fullResults(0.55)` ≤ `fullResults(0.85)` for AFQT and for every line score.

Add new invariants:
- `calculateLineScores` returns `null` when any of the 8 sections is missing (the 5-of-8 partial path is removed).
- Average-profile calibration: a fixture where every section's MAP theta lands near the PAY97 average should produce line scores near 100 — assert every line score of `fullResults(0.6)` is between 60 and 140 (sanity band, exact values pinned in characterization).
- Band sanity: `getScoreDetails(fullResults(0.6)).band.low ≤ percentile ≤ band.high`, all in 1–99.
- Unanswered penalty: a fixture with AR `answered: false` on 5 of 15 questions and `unanswered: 5` scores strictly lower than the same fixture fully answered correct-pattern, and no error is thrown.

- [ ] **Step 2: Run to verify the new tests fail**

Run: `node --test tests/unit/scoring.invariants.test.js`
Expected: FAIL (old scoring.js can't consume the new shapes / new functions missing).

- [ ] **Step 3: Rewrite `js/scoring.js`**

```js
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
    return { sections: sections, ve: { ss: ssVE }, afqts: afqts, percentile: percentile, band: band };
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
```

Then run `grep -rn "percentToStandardScore\|getSectionStandardScore\|afqtRawToPercentile" js/ tests/ scripts/ *.html` — those three v1 functions are removed; update every caller found (expected: only old tests and possibly `scripts/validate-site.js`, which Task 9 rewrites; if `js/weak-areas.js` or any page file uses them, port that call site to `getScoreDetails`).

- [ ] **Step 4: Run invariants; re-pin characterization**

Run: `node --test tests/unit/scoring.invariants.test.js` — expected: PASS.

Rewrite `tests/unit/scoring.characterization.test.js` (its header says values are expected to change): build `fullResults(0.6)`-style fixtures with the Step-1 helper, run once with a temporary `console.log` to capture actual AFQT/GT/CO values, then pin those exact numbers with a comment `// pinned 2026-08-06, IRT v2 model`. Keep the ±8 anchor tests only if rewritten against `afqtsToPercentile` (183→31, 202→50, 249→93 — now exact, tolerance 0).

- [ ] **Step 5: Write the simulation acceptance test**

Create `tests/unit/irt-simulation.test.js` — proves the compression bias is gone (spec §11):

```js
const test = require('node:test');
const assert = require('node:assert');
const IRT = require('../../js/irt.js');
const PARAMS = require('../../js/irt-params.js');

function mulberry32(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Synthetic pool mirroring a section's real tag mix; runs the same
// select-max-info / answer / Owen-update loop the engine uses.
function simulate(code, nItems, poolTags, simulees, rand) {
  const items = poolTags.map((tag, i) => PARAMS.getItemParams(code, tag, `${code}_sim_${i}`));
  const trueThetas = [];
  const estThetas = [];
  for (let s = 0; s < simulees; s++) {
    const u1 = Math.max(rand(), 1e-9);
    const theta = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * rand()); // Box-Muller N(0,1)
    const state = { mean: 0, variance: 1 };
    const used = new Set();
    const records = [];
    for (let k = 0; k < nItems; k++) {
      const ranked = items.map((it, idx) => [used.has(idx) ? -1 : IRT.fisherInfo(state.mean, it), idx])
        .filter((r) => r[0] >= 0).sort((a, b) => b[0] - a[0]);
      const pick = ranked[Math.floor(rand() * Math.min(5, ranked.length))][1];
      used.add(pick);
      const correct = rand() < IRT.p3pl(theta, items[pick]);
      Object.assign(state, IRT.owenUpdate(state, items[pick], correct));
      records.push({ a: items[pick].a, b: items[pick].b, c: items[pick].c, correct });
    }
    trueThetas.push(theta);
    estThetas.push(IRT.mapEstimate(records).theta);
  }
  const n = simulees;
  const mx = trueThetas.reduce((a, v) => a + v, 0) / n;
  const my = estThetas.reduce((a, v) => a + v, 0) / n;
  let sxx = 0; let syy = 0; let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (trueThetas[i] - mx) ** 2;
    syy += (estThetas[i] - my) ** 2;
    sxy += (trueThetas[i] - mx) * (estThetas[i] - my);
  }
  return { corr: sxy / Math.sqrt(sxx * syy), bias: my - mx };
}

// Tag mixes approximating the real pools (AR 122: 14/40/40/23/5; PC 85: 7/42/31/5/0).
function tags(counts) {
  const out = [];
  counts.forEach((c, i) => { for (let k = 0; k < c; k++) out.push(i + 1); });
  return out;
}

test('AR (15 items): recovered theta correlates >= 0.90 with truth, |bias| <= 0.08', () => {
  const r = simulate('AR', 15, tags([14, 40, 40, 23, 5]), 500, mulberry32(42));
  assert.ok(r.corr >= 0.90, `corr ${r.corr}`);
  assert.ok(Math.abs(r.bias) <= 0.08, `bias ${r.bias}`);
});

test('PC (10 items): recovered theta correlates >= 0.85 with truth', () => {
  const r = simulate('PC', 10, tags([7, 42, 31, 5, 0]), 500, mulberry32(43));
  assert.ok(r.corr >= 0.85, `corr ${r.corr}`);
  assert.ok(Math.abs(r.bias) <= 0.10, `bias ${r.bias}`);
});
```

- [ ] **Step 6: Run everything**

Run: `npm test` — expected: all suites pass (the quiz-engine suites still pass because the engine isn't touched yet and `calculateAFQTEstimate`/`calculateLineScores` keep their signatures — if an engine-integration test feeds count-only sections and fails, note it and fix in Task 6, not here; if it blocks the suite, temporarily skip it with `test.skip` and a `// re-enabled in Task 6` comment).

- [ ] **Step 7: Commit**

```bash
git add js/scoring.js tests/unit/scoring.invariants.test.js tests/unit/scoring.characterization.test.js tests/unit/irt-simulation.test.js
git commit -m "feat: official-pipeline scoring (MAP theta, official transforms, PAY97 table, Army weights)"
```

---

### Task 5: engine — Owen interim state + max-information selection

**Files:**
- Modify: `js/quiz-engine.js` (constructor/init ~`:157`, resume `:382,407-408,423`, `materializeSlot` `:306-346`)
- Modify: `js/quiz-data.js` (add `QuizManager.selectMaxInfoQuestion` near `selectNextAdaptiveQuestion` `:5940`; delete `updateAbilityLevel` `:5966-5982`)
- Modify: `tests/helpers/engine.js` (load `js/irt.js`, `js/irt-params.js`, `js/penalty-table.js` into the jsdom window before `quiz-data.js`)
- Test: `tests/unit/quiz-engine-adaptive.test.js` (new; plus fix any existing test referencing `updateAbilityLevel` — grep first)

**Interfaces:**
- Consumes: `MissionASVABIRT.{fisherInfo, owenUpdate}`, `MissionASVABIRTParams.getItemParams` as browser globals.
- Produces: `this.abilityState[sectionCode] = {mean, variance}` (replaces `this.abilityLevels`); `QuizManager.selectMaxInfoQuestion(pool, sectionCode, thetaMean, usedIds) → question|null`. Task 6 relies on `abilityState` and on `slot.difficulty` still being set at `materializeSlot` (`:343`, unchanged).

- [ ] **Step 1: Write failing tests**

Create `tests/unit/quiz-engine-adaptive.test.js` using the `tests/helpers/engine.js` harness (mirror the setup style of `tests/unit/quiz-engine-afqt-gate.test.js`):

- Starting a quick test initializes `engine.abilityState.AR` to `{mean: 0, variance: 1}`.
- `QuizManager.selectMaxInfoQuestion(pool, 'AR', 0, new Set())` returns a question whose `difficulty` is in {2, 3} (max info near theta 0 with the AR pool's b-mapping) — assert over 20 draws all results are 2 or 3.
- With `thetaMean = 2.5`, selected difficulties over 20 draws are ≥ 3 (harder items are more informative for high theta).
- Used-id exclusion: passing a `usedIds` set containing an id means it is never returned.
- Diagnostic path unchanged: existing `tests/unit/diagnostic.test.js` must keep passing (fixed `targetDifficulty` ladder).

Run: `node --test tests/unit/quiz-engine-adaptive.test.js` — expected: FAIL (`selectMaxInfoQuestion` undefined, `abilityState` undefined).

- [ ] **Step 2: Implement `selectMaxInfoQuestion` in `js/quiz-data.js`**

Add next to `selectNextAdaptiveQuestion` (keep that function — the diagnostic's fixed-difficulty path still uses it):

```js
  // ADAPTIVE v2: maximum Fisher information at the current interim theta,
  // randomized among the top 5 candidates ("randomesque" — practice-site
  // replacement for Sympson-Hetter exposure control).
  selectMaxInfoQuestion: function(pool, sectionCode, thetaMean, usedIds) {
    const g = (typeof window !== 'undefined') ? window : globalThis;
    const IRT = g.MissionASVABIRT;
    const P = g.MissionASVABIRTParams;
    const candidates = [];
    for (let d = 1; d <= 5; d++) {
      (pool.byDifficulty[d] || []).forEach(q => {
        if (!usedIds.has(q.id)) candidates.push(q);
      });
    }
    if (!candidates.length) return null;
    if (!IRT || !P) return candidates[0]; // graceful degradation if modules failed to load
    const scored = candidates.map(q => ({
      q,
      info: IRT.fisherInfo(thetaMean, P.getItemParams(sectionCode, q.difficulty || 3, q.id))
    }));
    scored.sort((x, y) => y.info - x.info);
    const top = scored.slice(0, Math.min(5, scored.length));
    return top[Math.floor(Math.random() * top.length)].q;
  },
```

Delete `updateAbilityLevel` (`js/quiz-data.js:5966-5982`). Run `grep -rn "updateAbilityLevel" js/ tests/` and update every caller (engine call site is replaced in Step 3; any test asserting ladder behavior is superseded — delete those assertions).

- [ ] **Step 3: Swap engine ability state and selection**

In `js/quiz-engine.js`:

1. `generateNewTest` (`~:157`): replace `this.abilityLevels[code] = 3;` with `this.abilityState[code] = { mean: 0, variance: 1 };` (and rename the property everywhere: constructor init, `saveGeneratedTest` persistence, resume/restore paths at `:382`, `:407-408`, `:423`). On resume, if a stored test has no `abilityState` (pre-deploy session), initialize `{mean: 0, variance: 1}` per section — same graceful default the old code used at `:314-316`.
2. `materializeSlot` (`:306-346`): replace the ability computation + selection block (`:318` and `:328-333`) with:

```js
    const state = this.abilityState[slot.sectionCode] ||
      (this.abilityState[slot.sectionCode] = { mean: 0, variance: 1 });
    const pick = (excludedSet) => slot.targetDifficulty
      ? QuizManager.selectNextAdaptiveQuestion(this.questionPools[slot.sectionCode], slot.targetDifficulty, excludedSet)
      : QuizManager.selectMaxInfoQuestion(this.questionPools[slot.sectionCode], slot.sectionCode, state.mean, excludedSet);
    let question = pick(excluded);
    if (!question) question = pick(this.usedQuestionIds);
```

Everything else in the function (recent-seen exclusion, `usedQuestionIds`, option shuffling, `slot.difficulty = question.difficulty` at `:343`) stays.

- [ ] **Step 4: Update `tests/helpers/engine.js`**

Add `js/irt.js`, `js/irt-params.js`, `js/penalty-table.js` to the scripts it loads into jsdom, **before** `js/quiz-data.js`. Follow the file's existing load-list pattern.

- [ ] **Step 5: Run tests**

Run: `node --test tests/unit/quiz-engine-adaptive.test.js tests/unit/diagnostic.test.js` then `npm test`.
Expected: new tests PASS; diagnostic suite PASS untouched; any remaining failures are tests pinning the old ladder — update them (they are superseded behavior, not regressions).

- [ ] **Step 6: Commit**

```bash
git add js/quiz-engine.js js/quiz-data.js tests/helpers/engine.js tests/unit/quiz-engine-adaptive.test.js
git commit -m "feat: Owen Bayesian interim ability + max-information item selection"
```

---

### Task 6: engine — answer locking, CAT navigation, submit payloads

**Files:**
- Modify: `js/quiz-engine.js` (`selectAnswer` `:686-721`, `nextQuestion` `:754-783`, `goToQuestion` `:734-752`, prev-button render `:630-636`, submit path `:843-980`, state save/load for the new `lockedAnswers` set)
- Modify: `js/mission-progress.js` (`compactResultPayload` `:167-198`)
- Modify: `tests/unit/quiz-engine-question-results.test.js` (payload shape), plus new tests below
- Test: `tests/unit/quiz-engine-cat-flow.test.js` (new)

**Interfaces:**
- Consumes: `abilityState` + `MissionASVABIRT.owenUpdate` (Task 5), `MissionASVABScoring.{getScoreDetails, calculateLineScores, getSectionPercent}` (Task 4).
- Produces (persisted shapes Tasks 7–8 rely on):
  - `sectionResults[code] = { name, correct, total, unanswered, questions: [{id, originalId, text, options, userAnswer, correctAnswer, isCorrect, difficulty, answered}] }`
  - localStorage `quizResults` gains `afqtBand: {low, high}|null`, `scoringVersion: 'irt-v2'`, per-section `theta/sem/ss` inside its section entries
  - Supabase payload: `section_scores[code] = {correct, total, theta, sem, ss}`, `question_results` items `{id, section, correct, difficulty}`, top-level `scoring_version: 'irt-v2'`
  - `engine.isCatMode() → boolean` (sectioned, not tutor, not diagnostic)

- [ ] **Step 1: Write failing tests**

Create `tests/unit/quiz-engine-cat-flow.test.js` (jsdom harness):
- `isCatMode()` is true for quick/full, false for tutor and diagnostic.
- In a quick test: select an answer on question 1, call `nextQuestion()` — the answer is locked: `selectAnswer(otherIndex)` on a back-reference no longer changes `engine.answers[q.id]`, and `goToQuestion(previousIndex)` does not move `currentQuestion` backward.
- Owen update fires on lock, not on select: after `selectAnswer`, `abilityState[code].mean` is unchanged; after `nextQuestion()`, it moved and `variance` decreased.
- Diagnostic: `goToQuestion` backward still works (navigation untouched).
- Submit: complete a quick test via the harness, assert `quizResults.scoringVersion === 'irt-v2'`, `afqtBand.low <= afqt <= afqtBand.high`, each section entry has finite `theta`, `sem`, `ss`, and every question record has `difficulty` 1–5 and `answered: true`.
- Unanswered handling: force-expire a section with 5 slots unreached (use the harness's timer/section-advance hooks like the existing section-change tests do), assert `sectionResults` for that section reports `unanswered: 5`, records for unreached slots have `answered: false`, and AFQT still computes without error.

Update `tests/unit/quiz-engine-question-results.test.js:49-66`: expected exact keys become `['correct', 'difficulty', 'id', 'section']`.

Run: `node --test tests/unit/quiz-engine-cat-flow.test.js` — expected: FAIL.

- [ ] **Step 2: Implement navigation + locking**

In `js/quiz-engine.js`:

1. Constructor: add `this.lockedAnswers = new Set();` — serialize/restore it in `saveState`/state-load exactly the way `tutorRevealed` is handled (grep `tutorRevealed` for the three sites: init, save, restore).
2. Add methods:

```js
  isCatMode() {
    return this.isSectioned() && this.mode !== 'tutor' && this.testType !== 'diagnostic';
  }

  // Finalize the current answer: in CAT modes an answer becomes immutable when
  // the user advances (like the real CAT-ASVAB), and the interim Owen ability
  // for the section updates at that moment.
  lockCurrentAnswer() {
    const q = this.quizData.questions[this.currentQuestion];
    if (!q || this.answers[q.id] === undefined || this.lockedAnswers.has(q.id)) return;
    this.lockedAnswers.add(q.id);
    this.updateInterimAbility(q);
  }

  updateInterimAbility(q) {
    const g = (typeof window !== 'undefined') ? window : globalThis;
    const IRT = g.MissionASVABIRT;
    const P = g.MissionASVABIRTParams;
    const code = q.sectionCode || this.testSections[0];
    if (!IRT || !P || !this.abilityState[code]) return;
    const item = P.getItemParams(code, q.difficulty || 3, q.originalId || q.id);
    this.abilityState[code] = IRT.owenUpdate(
      this.abilityState[code], item, this.answers[q.id] === q.correct);
  }
```

3. `selectAnswer` (`:686`): add a lock guard after the tutor guard: `if (this.isCatMode() && this.lockedAnswers.has(this.quizData.questions[this.currentQuestion].id)) return;` Replace the old ladder block (`:697-711`) with: tutor mode updates interim ability at reveal — inside the existing `if (this.mode === 'tutor')` block that adds to `tutorRevealed`, call `this.updateInterimAbility(question)`. (Non-tutor modes now update at lock time instead.)
4. `nextQuestion` (`:754`): after the answer-required guard, insert `if (this.isCatMode()) this.lockCurrentAnswer();` before any navigation branch. Also call `lockCurrentAnswer()` at the top of `advanceSection` and inside the submit path so section-timeout with a selected-but-not-advanced answer still locks and updates.
5. `goToQuestion` (`:734`): add `if (this.isCatMode() && index < this.currentQuestion) return;` after the range guards.
6. Prev-button render (`:630-636`): change the visibility condition to also hide when `this.isCatMode()`: `prevBtn.style.visibility = (atFloor || this.isCatMode()) ? 'hidden' : 'visible';`

- [ ] **Step 3: Implement submit-path changes**

In the submit path (`:843-980`):
1. Unreached-slot handling (`:843-850`): keep force-materialization (the results review list needs question text), but tag the records: when building per-section `questions` (`:876-884`), add `difficulty: q.difficulty || 3` and `answered: this.answers[q.id] !== undefined`; unanswered records keep `isCorrect: false`. Count `unanswered` per section and set it on `sectionResults[code]`.
2. After building `sectionResults`, replace the AFQT call (`:896`) with:

```js
    const details = (this.testType !== 'diagnostic' && root.MissionASVABScoring.getScoreDetails)
      ? root.MissionASVABScoring.getScoreDetails(sectionResults)
      : null;
```
   preserving the existing diagnostic/all-four-sections gating exactly as `calculateAFQTEstimate` did (the gate lives inside `getScoreDetails`; the diagnostic branch stays null). `afqt = details ? details.percentile : null`, and store `afqtBand = details ? details.band : null`, `scoringVersion: 'irt-v2'` in the `quizResults` object.
3. Section-scores payload (`:964`): `{correct, total, theta, sem, ss}` — round `theta`/`sem` to 2 decimals, `ss` to integer, from `details.sections[code]` for AFQT sections; for the other four sections (full test), compute via `getScoreDetails`-equivalent per-section call — expose the per-section numbers by having `calculateLineScores` unnecessary here: instead add the four non-AFQT sections into the stored payload only when line scores were computed, using the same `sectionAbility` values. Simplest correct implementation: extend `getScoreDetails` (Task 4 already returns `sections` for the 4 AFQT codes) — when all 8 sections are present, include all 8 in `details.sections`. Implement that in `scoring.js` now if not already (one-line loop change), with a unit assertion added to the invariants file.
4. `question_results` payload (`:966`): add `difficulty` to each item.
5. Supabase insert payload (`:958-980`): add `scoring_version: 'irt-v2'`.
6. `js/mission-progress.js` `compactResultPayload` (`:167-198`): mirror all of the above (difficulty in question items, theta/sem/ss in section_scores, scoring_version).

- [ ] **Step 4: Run tests**

Run: `npm test` — expected: PASS, including the updated question-results shape test, the AFQT-gate suite (gate semantics unchanged), and the diagnostic suite (still `afqt: null`).

- [ ] **Step 5: Commit**

```bash
git add js/quiz-engine.js js/mission-progress.js tests/unit/quiz-engine-cat-flow.test.js tests/unit/quiz-engine-question-results.test.js
git commit -m "feat: CAT answer locking, forward-only navigation, v2 result payloads"
```

---

### Task 7: Supabase migration + verification

**Files:**
- Create: `supabase/migrations/20260806_scoring_version.sql` (use `date +%Y%m%d%H%M%S` prefix format matching existing files in `supabase/migrations/`)

**Interfaces:**
- Consumes: Task 6's client payload (`scoring_version` key).
- Produces: `test_results.scoring_version text` column, writable by `authenticated`.

- [ ] **Step 1: Write the migration**

```sql
-- IRT scoring v2: tag each result with the scoring model that produced it.
-- null = legacy linear %-correct model (v1); 'irt-v2' = official-pipeline model.
alter table public.test_results add column if not exists scoring_version text;
comment on column public.test_results.scoring_version is
  'Scoring model that produced this row; null = pre-2026-08 linear model';
```

- [ ] **Step 2: Apply and verify**

Apply via the Supabase MCP tools (authenticate first) or ask the owner to run it in the SQL editor (project ref `rcspwkmrtukblvvdifer`). Then verify the column-grant requirement from the spec (`profiles.is_admin` LEARNED lesson — a table-level grant makes column REVOKEs moot, but if `test_results` ever got column-level INSERT grants this new column must be included):

```sql
select has_column_privilege('authenticated', 'public.test_results', 'scoring_version', 'INSERT');
```

Expected: `true`. If `false`, run `grant insert (scoring_version), update (scoring_version) on public.test_results to authenticated;` and re-verify. Record the outcome in the task commit message.

- [ ] **Step 3: Smoke-test an insert**

With the migration applied, complete a signed-in practice test locally (`npx serve .`) or rely on the Task 10 e2e run; confirm in the Supabase table editor that the new row has `scoring_version = 'irt-v2'`. An anonymous/offline-queued result must also flush cleanly (offline-queue payload passes unknown keys through — verify `js/offline-queue.js` doesn't whitelist columns; grep for the insert call).

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/*scoring_version.sql
git commit -m "feat: test_results.scoring_version column (migration + grant verification)"
```

---

### Task 8: results + dashboard UI

**Files:**
- Modify: `js/page-results.js` (AFQT branch `:47-64`, score-band copy `:110-119`), `results.html` (line-scores note `:1103`)
- Modify: `js/dashboard.js` (history list/sparkline `:315-367`), `dashboard.html` (annotation element if needed)
- Test: extend `tests/unit/` page tests if a jsdom harness exists for page-results (grep `page-results` in tests/; if none, cover via Playwright in Task 10)

**Interfaces:**
- Consumes: `quizResults.{afqt, afqtBand, scoringVersion}` and per-section `{theta, sem, ss}` from localStorage (Task 6); `test_results.scoring_version` from Supabase (Task 7).
- Produces: user-visible band, SS display, line-score note, dashboard model-change annotation.

- [ ] **Step 1: Results page**

In `js/page-results.js` AFQT branch (`:57-58`): when `results.afqtBand` exists, render the sub-line as
`` `${n}th Percentile · likely range ${band.low}–${band.high}` `` (fall back to the current wording when absent — legacy stored results). Where section rows render percent, append the standard score when present: `“Standard score {ss}”`. All content set via `textContent` (no innerHTML with user data; CSP-safe, no inline handlers).

In `results.html:1103` replace the line-scores note text with: *"Estimated Army line scores on the official reporting scale (average is 100) — comparable to published Army MOS minimums. Still a practice estimate, not an official score."*

- [ ] **Step 2: Dashboard annotation**

In `js/dashboard.js` where result history renders (`:315-367`): if the fetched rows contain both `scoring_version` null and `'irt-v2'`, insert a single note element (created via DOM APIs, styled with an existing muted-text class): *"Scoring model upgraded Aug 2026 — earlier scores used our previous model and aren't directly comparable."*

- [ ] **Step 3: Verify by hand**

Run `npx serve .`, complete a guest AFQT practice test, confirm: band renders, section standard scores render, line-score note on a full test, no console errors. (Playwright covers this again in Task 10.)

- [ ] **Step 4: Commit**

```bash
git add js/page-results.js results.html js/dashboard.js dashboard.html
git commit -m "feat: score band, standard scores, official-scale line-score note, dashboard model note"
```

---

### Task 9: wiring, validation gates, service worker

**Files:**
- Modify: every HTML page that loads `js/quiz-data.js`, `js/quiz-engine.js`, or `js/scoring.js` (find with `grep -ln "quiz-data.js\|quiz-engine.js\|scoring.js" *.html`) — add `<script src="js/irt.js" defer></script>`, `<script src="js/irt-params.js" defer></script>`, `<script src="js/penalty-table.js" defer></script>` **before** those tags, matching each page's existing script-tag style exactly (defer/no-defer).
- Modify: `service-worker.js` — add the three new files to the precache asset list; bump `CACHE_VERSION`.
- Modify: `scripts/validate-site.js`

**Interfaces:**
- Consumes: everything shipped in Tasks 1–6.
- Produces: green build gates (`validate-site.js` runs in the Vercel buildCommand).

- [ ] **Step 1: Script tags + service worker**

Make the HTML/script-tag changes above. In `service-worker.js`: add `js/irt.js`, `js/irt-params.js`, `js/penalty-table.js` to the cached app-shell list and bump `CACHE_VERSION` (single bump for this whole release).

- [ ] **Step 2: validate-site.js additions**

Extend `scripts/validate-site.js` (follow its existing check/fail helper style):
1. Every question in every pool has integer `difficulty` between 1 and 5 (currently unenforced).
2. `require('../js/irt-params.js')`: `afqtsToPercentile(s)` for `s` in 0..400 returns an integer 1–99, non-decreasing; `SECTION_IRT` and `SS_TRANSFORM`+`AS`/`VE` cover all 8 sections.
3. `require('../js/penalty-table.js')`: every (section, 1..questionsPerTest) has finite `{A, B}`.
4. Update the existing perfect-test scoring check (`:157-167`): build the perfect fixture in the new per-question shape (all `isCorrect: true, answered: true`, difficulties cycling 1–5) → assert AFQT === 99 and exactly 10 finite integer line scores.

- [ ] **Step 3: Run all gates**

Run: `npm test && node scripts/validate-site.js && node scripts/check-no-inline-js.js`
Expected: all green. Then `npm run test:e2e` — if the guest-flow spec clicks Previous or changes answers, update the spec to the forward-only flow (that behavior change is intentional); all pages must stay console/CSP-clean.

- [ ] **Step 4: Commit**

```bash
git add *.html service-worker.js scripts/validate-site.js tests/e2e
git commit -m "feat: wire IRT modules into pages, SW precache + cache bump, v2 validation gates"
```

---

### Task 10: documentation, updates feed, final verification

**Files:**
- Modify: `docs/scoring-methodology.md` (rewrite), `CLAUDE.md` (Percentile Scoring section, Architecture file list, LEARNED), `docs/PROJECT-STATE.md`, `index.html` (Recent Updates)

- [ ] **Step 1: Rewrite `docs/scoring-methodology.md`**

Replace the v1 content with the v2 pipeline, keeping the same honest framing. Required sections (source: the v2 spec — lift its constants and citations):
1. Header disclaimer (practice estimate; item parameters estimated, pipeline official).
2. Item parameters: heuristic 1–5 tag → 3PL mapping, published pool statistics table, calibration-override hook.
3. Ability estimation: Owen interim (N(0,1) prior), MAP final, grid details, incomplete-test penalty method.
4. Standard scores & composites: Form 04D transforms, VE eq. 2.3, AS eq. 2.4, AFQTS definition, verbatim-table lookup (note the 37/58/65 gaps), Army GT formula + Table 2.7 weights, mean-100/SD-20 interpretation.
5. What changed vs v1 and why (compression bias, VE weighting, table vs normal fit, line-score scale) — brief.
6. Sources: the six primary sources from spec §3 with URLs.

- [ ] **Step 2: Update CLAUDE.md**

- Architecture block: add `irt.js`, `irt-params.js`, `penalty-table.js`, `scripts/generate-penalty-table.js` one-liners.
- Replace the "Percentile Scoring" section: standard scores now come from MAP theta via official transforms; AFQTS = SS_AR + SS_MK + 2·SS_VE → verbatim PAY97 table; line scores = official weight matrix, mean 100/SD 20. Keep "documented public approximation" framing; update the anchor sanity checks to the exact table anchors (183→31, 202→50, 249→93, tolerance 0).
- LEARNED: update the "Scoring is a documented practice estimate" bullet to name the v2 invariants (perfect→99, 10 line scores ≈ 100-centered, AFQT table verbatim).
- Update `docs/PROJECT-STATE.md`'s scoring pointer.

- [ ] **Step 3: Recent Updates entry**

Read the real date with `date`. Add one entry at the top of the `updates-list` in `index.html`, remove the oldest so 4 remain: *"Practice scores now use the official ASVAB scoring method — including the real AFQT conversion table and Army line-score scales."* (One entry max for the ship day; fold other same-day items in.)

- [ ] **Step 4: Full verification (superpowers:verification-before-completion)**

Run and confirm output before claiming done:
```bash
npm test
node scripts/validate-site.js
node scripts/check-no-inline-js.js
npm run test:e2e
```
All green + a manual `npx serve .` pass through: guest AFQT flow (band renders), full-test line scores ~100-centered, diagnostic unchanged (no AFQT), tutor mode unchanged.

- [ ] **Step 5: Commit**

```bash
git add docs/scoring-methodology.md CLAUDE.md docs/PROJECT-STATE.md index.html
git commit -m "docs: v2 scoring methodology, CLAUDE.md, homepage updates feed"
```

---

## Plan self-review notes (already applied)

- **Spec coverage:** §4→Tasks 1–2, §5→Task 2, §6→Tasks 1+3+4, §7→Task 5, §8→Tasks 2+4, §9→Task 6, §10→Tasks 6–8, §11→Tasks 1–6+9, §12→Tasks 9–10, §13 mitigations land in Tasks 4 (override hook), 6–8 (versioning/band). AI/SI legacy fallback from v1 `scoring.js` is intentionally dropped (dead code — the engine only ever emits combined `AS`).
- **Type consistency:** `getItemParams(sectionCode, difficulty, itemId)` everywhere; `abilityState = {mean, variance}`; `getScoreDetails` returns `sections/{theta,sem,ss}` and Task 6 step 3.3 extends it to all 8 sections when present — the invariants file asserts that.
- **Known judgment calls:** interim Owen update at lock-time (Next) in CAT modes, at reveal in tutor; unreached slots still force-materialize for the review list but are excluded from MAP via `answered: false` + penalty.
