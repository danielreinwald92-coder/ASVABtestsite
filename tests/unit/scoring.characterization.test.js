const {test} = require('node:test');
const assert = require('node:assert');
const {loadCore} = require('../helpers/load.js');

const {scoring} = loadCore();

// These tests snapshot CURRENT scoring behavior so that a future scoring
// rebuild produces a visible diff. They are EXPECTED to change — they are not
// invariants. If they fail after an intentional scoring change, update them.
//
// Updated 2026-06-14 for the standard-score scoring rebuild
// (see docs/scoring-methodology.md). The percentile anchor tests below assert
// the published-reference curve fit.

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

test('@characterization (standard-score model): mid-range AFQT equals 85', () => {
  const afqt = scoring.calculateAFQTEstimate(fullSections);
  assert.strictEqual(afqt, 85);
});

test('@characterization (standard-score model): GT line score equals 129', () => {
  const ls = scoring.calculateLineScores(fullSections);
  assert.strictEqual(ls.GT.score, 129);
});

test('@characterization (standard-score model): CO line score equals 169', () => {
  const ls = scoring.calculateLineScores(fullSections);
  assert.strictEqual(ls.CO.score, 169);
});

// Anchor tests: the AFQT raw -> percentile curve must roughly reproduce the
// published 1997 (PAY97) reference points. Tolerance +/-8 percentile.
const ANCHORS = [
  { raw: 85, percentile: 31 },  // Army enlistment minimum
  { raw: 100, percentile: 50 }, // average
  { raw: 135, percentile: 93 }, // Category I
];

for (const { raw, percentile } of ANCHORS) {
  test(`@anchor: AFQT raw ${raw} maps near percentile ${percentile} (+/-8)`, () => {
    const actual = scoring.afqtRawToPercentile(raw);
    assert.ok(
      Math.abs(actual - percentile) <= 8,
      `raw ${raw}: expected ~${percentile}, got ${actual}`
    );
  });
}
