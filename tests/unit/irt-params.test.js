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
