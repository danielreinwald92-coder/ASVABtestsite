const {test} = require('node:test');
const assert = require('node:assert');
const {loadCore} = require('../helpers/load.js');
const PARAMS = require('../../js/irt-params.js');

const {scoring} = loadCore();

// These tests snapshot CURRENT scoring behavior so that a future scoring
// rebuild produces a visible diff. They are EXPECTED to change — they are not
// invariants. If they fail after an intentional scoring change, update them.
//
// Updated 2026-08-06 for the IRT v2 rebuild: MAP theta per section -> official
// standard-score transforms -> official VE -> AFQTS -> verbatim PAY97
// percentile table -> official Army composite weights. See
// docs/scoring-methodology.md, js/irt.js, js/irt-params.js.

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

test('@characterization (IRT v2 model): fullResults(0.6) AFQT equals 16', () => {
  const afqt = scoring.calculateAFQTEstimate(fullResults(0.6));
  assert.strictEqual(afqt, 16); // pinned 2026-08-06, IRT v2 model
});

test('@characterization (IRT v2 model): fullResults(0.6) GT line score equals 78', () => {
  const ls = scoring.calculateLineScores(fullResults(0.6));
  assert.strictEqual(ls.GT.score, 78); // pinned 2026-08-06, IRT v2 model
});

test('@characterization (IRT v2 model): fullResults(0.6) CO line score equals 88', () => {
  const ls = scoring.calculateLineScores(fullResults(0.6));
  assert.strictEqual(ls.CO.score, 88); // pinned 2026-08-06, IRT v2 model
});

// Anchor tests: the verbatim '97 (PAY97) AFQTS -> percentile table (Segall
// Table 2.5) is published math, not an approximation, so these are now EXACT
// — tolerance 0 (previously +/-8 under the old percentToStandardScore model).
const ANCHORS = [
  { afqts: 183, percentile: 31 }, // Army enlistment minimum
  { afqts: 202, percentile: 50 }, // average
  { afqts: 249, percentile: 93 }, // Category I
];

for (const { afqts, percentile } of ANCHORS) {
  test(`@anchor: AFQTS ${afqts} maps exactly to percentile ${percentile}`, () => {
    const actual = PARAMS.afqtsToPercentile(afqts);
    assert.strictEqual(actual, percentile); // pinned 2026-08-06, IRT v2 model
  });
}
