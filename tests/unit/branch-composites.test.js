'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const B = require('../../js/branch-composites.js');

const AVG = { GS: 50, AR: 50, WK: 50, PC: 50, MK: 50, EI: 50, AS: 50, MC: 50, VE: 50 };

test('Air Force MAGE tables match Segall 2004 Tables C.1-C.4 spot values exactly', () => {
  // Pairs read directly from the published tables (sum -> percentile).
  const spots = {
    M: [[144, 1], [140, 1], [145, 2], [184, 7], [257, 53], [263, 59], [304, 92], [328, 98], [329, 99], [400, 99]],
    A: [[55, 1], [56, 2], [95, 39], [101, 50], [103, 55], [133, 98], [134, 99]],
    G: [[51, 1], [52, 2], [89, 26], [92, 32], [97, 42], [132, 97], [135, 99]],
    E: [[119, 1], [120, 2], [159, 12], [164, 15], [227, 79], [235, 85], [271, 98], [272, 99]]
  };
  for (const [code, pairs] of Object.entries(spots)) {
    for (const [sum, pct] of pairs) assert.strictEqual(B.magePercentile(code, sum), pct, `${code} ${sum}`);
  }
});

test('MAGE tables are contiguous, 1..99 and never decrease', () => {
  for (const [code, t] of Object.entries(B.MAGE_TABLES)) {
    assert.strictEqual(t.pct[0], 1, `${code} floor`);
    assert.strictEqual(t.pct[t.pct.length - 1], 99, `${code} ceiling`);
    for (let i = 1; i < t.pct.length; i++) assert.ok(t.pct[i] >= t.pct[i - 1], `${code} monotonic at ${i}`);
  }
});

test('Air Force composites use the published unit-weighted sums (M counts VE twice)', () => {
  const af = B.airForce(AVG);
  assert.strictEqual(af.M, B.magePercentile('M', 250));
  assert.strictEqual(af.A, B.magePercentile('A', 100));
  assert.strictEqual(af.G, B.magePercentile('G', 100));
  assert.strictEqual(af.E, B.magePercentile('E', 200));
  assert.deepStrictEqual(Object.keys(B.airForce({ AR: 50, VE: 50, MK: 50 })).sort(), ['A', 'G']);
});

test('Marine composites follow Segall sec. 2.5.2 and center on 100', () => {
  assert.deepStrictEqual(B.marines(AVG), { GT: 100, MM: 100, EL: 100, CL: 100 });
  // GT = Rnd(0.755294 * (AR + MC + VE) - 13.289535)
  assert.strictEqual(B.marines({ AR: 60, MC: 55, VE: 58 }).GT, Math.round(0.755294 * 173 - 13.289535));
  assert.deepStrictEqual(Object.keys(B.marines({ MK: 50, VE: 50 })), ['CL']);
});

test('Army composites reuse the official line scores; GT alone from the AFQT sections', () => {
  const a = B.army(AVG);
  assert.strictEqual(Object.keys(a).length, 10);
  for (const v of Object.values(a)) assert.strictEqual(v, 100);
  assert.deepStrictEqual(B.army({ AR: 50, VE: 50, MK: 50, WK: 50, PC: 50 }), { GT: 100 });
});

test('every composite is monotonic in each input section', () => {
  const secs = ['GS', 'AR', 'MK', 'EI', 'AS', 'MC', 'VE'];
  for (const s of secs) {
    const lo = Object.assign({}, AVG);
    const hi = Object.assign({}, AVG, { [s]: 58 });
    for (const fn of [B.army, B.airForce, B.marines]) {
      const a = fn(lo); const b = fn(hi);
      for (const k of Object.keys(a)) assert.ok(b[k] >= a[k], `${fn.name} ${k} rises with ${s}`);
    }
  }
});
