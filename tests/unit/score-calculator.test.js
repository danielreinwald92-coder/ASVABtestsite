'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const C = require('../../js/score-calculator.js');

test('average standard scores give AFQTS 200 and all line scores 100', () => {
  const r = C.calculate({ AR: 50, MK: 50, VE: 50, GS: 50, EI: 50, AS: 50, MC: 50 });
  assert.strictEqual(r.afqts, 200);
  assert.strictEqual(r.percentile, 48);
  for (const v of Object.values(r.lineScores)) assert.strictEqual(v, 100);
});

test('AFQT anchors match the official table exactly', () => {
  assert.strictEqual(C.calculate({ AR: 40, MK: 43, VE: 50 }).percentile, 31); // 183
  assert.strictEqual(C.calculate({ AR: 50, MK: 52, VE: 50 }).percentile, 50); // 202
  assert.strictEqual(C.calculate({ AR: 60, MK: 59, VE: 65 }).percentile, 93); // 249
});

test('VE is derived from WK and PC when not given, and VE wins when given', () => {
  const derived = C.calculate({ AR: 50, MK: 50, WK: 60, PC: 60 });
  assert.ok(derived.ok && derived.ve > 50);
  const given = C.calculate({ AR: 50, MK: 50, WK: 60, PC: 60, VE: 45 });
  assert.strictEqual(given.ve, 45);
});

test('missing or out-of-range AFQT inputs are reported, technical sections are optional', () => {
  assert.deepStrictEqual(C.calculate({ AR: 50, MK: 90, WK: 50 }).missing, ['MK', 'VE']);
  const r = C.calculate({ AR: 50, MK: 50, VE: 50, GS: 50 });
  assert.strictEqual(r.lineScores, null);
  assert.deepStrictEqual(r.lineMissing, ['EI', 'AS', 'MC']);
});

test('AFQT categories follow the DoD bands', () => {
  assert.deepStrictEqual([99, 93, 92, 65, 64, 50, 49, 31, 30, 21, 20, 16, 15, 10, 9, 1].map(C.afqtCategory),
    ['I', 'I', 'II', 'II', 'IIIA', 'IIIA', 'IIIB', 'IIIB', 'IVA', 'IVA', 'IVB', 'IVB', 'IVC', 'IVC', 'V', 'V']);
});
