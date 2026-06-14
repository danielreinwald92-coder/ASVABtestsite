const {test} = require('node:test');
const assert = require('node:assert');
const {loadCore} = require('../helpers/load.js');

const {scoring} = loadCore();

// These tests snapshot CURRENT scoring behavior so that a future scoring
// rebuild produces a visible diff. They are EXPECTED to change — they are not
// invariants. If they fail after an intentional scoring change, update them.

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

test('@characterization (expected to change in scoring rebuild): mid-range AFQT equals 73', () => {
  const afqt = scoring.calculateAFQTEstimate(fullSections);
  assert.strictEqual(afqt, 73);
});

test('@characterization (expected to change in scoring rebuild): GT line score equals 111', () => {
  const ls = scoring.calculateLineScores(fullSections);
  assert.strictEqual(ls.GT.score, 111);
});

test('@characterization (expected to change in scoring rebuild): CO line score equals 63', () => {
  const ls = scoring.calculateLineScores(fullSections);
  assert.strictEqual(ls.CO.score, 63);
});
