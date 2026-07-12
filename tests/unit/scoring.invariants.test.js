const {test} = require('node:test');
const assert = require('node:assert');
const {loadCore} = require('../helpers/load.js');

const {scoring} = loadCore();

const LINE_KEYS = ['GT', 'CL', 'CO', 'EL', 'FA', 'GM', 'MM', 'OF', 'SC', 'ST'];

const fullSections = {
  WK: {correct: 12, total: 15},
  PC: {correct: 7, total: 10},
  AR: {correct: 11, total: 15},
  MK: {correct: 10, total: 15},
  GS: {correct: 9, total: 15},
  AI: {correct: 6, total: 10},
  SI: {correct: 5, total: 10},
  MC: {correct: 8, total: 15},
  EI: {correct: 9, total: 15},
};

test('AFQT returns null unless ALL four AFQT sections are present', () => {
  // A partial set would silently score the missing sections as 0% (SS 20)
  // and produce a plausible-looking but bogus percentile.
  assert.strictEqual(scoring.calculateAFQTEstimate({AR: {correct: 10, total: 15}}), null);
  assert.strictEqual(scoring.calculateAFQTEstimate({
    AR: {correct: 10, total: 15},
    WK: {correct: 10, total: 15},
    PC: {correct: 7, total: 10},
  }), null);
});

test('perfect AFQT input caps at 99', () => {
  const afqt = scoring.calculateAFQTEstimate({
    AR: {correct: 15, total: 15},
    WK: {correct: 15, total: 15},
    PC: {correct: 10, total: 10},
    MK: {correct: 15, total: 15},
  });
  assert.strictEqual(afqt, 99);
});

test('zero/empty totals yield finite AFQT >= 1 (no NaN)', () => {
  const afqt = scoring.calculateAFQTEstimate({
    AR: {correct: 0, total: 0},
    WK: {correct: 0, total: 0},
    PC: {correct: 0, total: 0},
    MK: {correct: 0, total: 0},
  });
  assert.ok(Number.isFinite(afqt), `expected finite, got ${afqt}`);
  assert.ok(afqt >= 1, `expected >= 1, got ${afqt}`);
});

test('calculateLineScores returns exactly 10 line keys', () => {
  const ls = scoring.calculateLineScores(fullSections);
  assert.deepStrictEqual(Object.keys(ls).sort(), [...LINE_KEYS].sort());
});

test('every line score is a finite integer', () => {
  const ls = scoring.calculateLineScores(fullSections);
  for (const key of LINE_KEYS) {
    const score = ls[key].score;
    assert.ok(Number.isInteger(score), `${key}.score not integer: ${score}`);
    assert.ok(Number.isFinite(score), `${key}.score not finite: ${score}`);
  }
});

test('all 10 expected line keys are present', () => {
  const ls = scoring.calculateLineScores(fullSections);
  for (const key of LINE_KEYS) {
    assert.ok(key in ls, `missing line key: ${key}`);
  }
});

test('AFQT is monotonic non-decreasing across rising inputs', () => {
  const worse = scoring.calculateAFQTEstimate({
    AR: {correct: 3, total: 15},
    WK: {correct: 3, total: 15},
    PC: {correct: 2, total: 10},
    MK: {correct: 3, total: 15},
  });
  const mid = scoring.calculateAFQTEstimate({
    AR: {correct: 8, total: 15},
    WK: {correct: 8, total: 15},
    PC: {correct: 5, total: 10},
    MK: {correct: 8, total: 15},
  });
  const better = scoring.calculateAFQTEstimate({
    AR: {correct: 13, total: 15},
    WK: {correct: 13, total: 15},
    PC: {correct: 9, total: 10},
    MK: {correct: 13, total: 15},
  });
  assert.ok(Number.isFinite(worse) && Number.isFinite(mid) && Number.isFinite(better));
  assert.ok(mid >= worse, `mid (${mid}) should be >= worse (${worse})`);
  assert.ok(better >= mid, `better (${better}) should be >= mid (${mid})`);
});
