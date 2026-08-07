const {test} = require('node:test');
const assert = require('node:assert');
const {loadCore} = require('../helpers/load.js');

const {scoring} = loadCore();

const LINE_KEYS = ['GT', 'CL', 'CO', 'EL', 'FA', 'GM', 'MM', 'OF', 'SC', 'ST'];

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

function afqtOnly(fractionCorrect) {
  const all = fullResults(fractionCorrect);
  return { AR: all.AR, WK: all.WK, PC: all.PC, MK: all.MK };
}

test('AFQT returns null unless ALL four AFQT sections are present', () => {
  // A partial set would silently score the missing sections as theta=0
  // (via mapEstimate([]) === {theta:0}) and produce a plausible-looking but
  // bogus percentile.
  const full = fullResults(0.6);
  assert.strictEqual(scoring.calculateAFQTEstimate({ AR: full.AR }), null);
  assert.strictEqual(scoring.calculateAFQTEstimate({ AR: full.AR, WK: full.WK, PC: full.PC }), null);
});

test('perfect AFQT input caps at 99', () => {
  const afqt = scoring.calculateAFQTEstimate(afqtOnly(1));
  assert.strictEqual(afqt, 99);
});

test('all-wrong AFQT input floors at 1', () => {
  const afqt = scoring.calculateAFQTEstimate(afqtOnly(0));
  assert.strictEqual(afqt, 1);
});

test('zero/empty totals yield null (never a bogus ~35th-percentile score) and never throw', () => {
  // A present section with ZERO answered records carries no information —
  // mapEstimate([]) === {theta:0} would otherwise silently produce a
  // plausible-looking ~35th percentile "average" score for a test nobody
  // took. That must be null, same as a genuinely missing section.
  const empty = (name) => mkSection(name, []);
  const input = { AR: empty('AR'), WK: empty('WK'), PC: empty('PC'), MK: empty('MK') };
  assert.doesNotThrow(() => scoring.calculateAFQTEstimate(input));
  const afqt = scoring.calculateAFQTEstimate(input);
  assert.strictEqual(afqt, null, `expected null, got ${afqt}`);
});

test('calculateLineScores returns exactly 10 line keys', () => {
  const ls = scoring.calculateLineScores(fullResults(0.6));
  assert.deepStrictEqual(Object.keys(ls).sort(), [...LINE_KEYS].sort());
});

test('every line score is a finite integer', () => {
  const ls = scoring.calculateLineScores(fullResults(0.6));
  for (const key of LINE_KEYS) {
    const score = ls[key].score;
    assert.ok(Number.isInteger(score), `${key}.score not integer: ${score}`);
    assert.ok(Number.isFinite(score), `${key}.score not finite: ${score}`);
  }
});

test('all 10 expected line keys are present', () => {
  const ls = scoring.calculateLineScores(fullResults(0.6));
  for (const key of LINE_KEYS) {
    assert.ok(key in ls, `missing line key: ${key}`);
  }
});

test('AFQT is monotonic non-decreasing across rising inputs', () => {
  const worse = scoring.calculateAFQTEstimate(afqtOnly(0.3));
  const mid = scoring.calculateAFQTEstimate(afqtOnly(0.55));
  const better = scoring.calculateAFQTEstimate(afqtOnly(0.85));
  assert.ok(Number.isFinite(worse) && Number.isFinite(mid) && Number.isFinite(better));
  assert.ok(mid >= worse, `mid (${mid}) should be >= worse (${worse})`);
  assert.ok(better >= mid, `better (${better}) should be >= mid (${mid})`);
});

test('line scores are monotonic non-decreasing across rising inputs (every key)', () => {
  const worse = scoring.calculateLineScores(fullResults(0.3));
  const mid = scoring.calculateLineScores(fullResults(0.55));
  const better = scoring.calculateLineScores(fullResults(0.85));
  for (const key of LINE_KEYS) {
    assert.ok(mid[key].score >= worse[key].score,
      `${key}: mid (${mid[key].score}) should be >= worse (${worse[key].score})`);
    assert.ok(better[key].score >= mid[key].score,
      `${key}: better (${better[key].score}) should be >= mid (${mid[key].score})`);
  }
});

test('calculateLineScores returns null when any of the 8 sections is missing', () => {
  const partial = fullResults(0.6);
  delete partial.EI;
  assert.strictEqual(scoring.calculateLineScores(partial), null);
});

test('calculateLineScores returns null when a present section has zero answered records', () => {
  // Present (not missing/deleted) but nobody answered any GS question — same
  // "no information" case as the missing-section gate above.
  const partial = fullResults(0.6);
  partial.GS = mkSection('GS', []);
  assert.strictEqual(scoring.calculateLineScores(partial), null);
});

test('getScoreDetails returns null when a present section has zero answered records, even with all 4 AFQT sections fine', () => {
  const partial = fullResults(0.6);
  partial.GS = mkSection('GS', []);
  assert.strictEqual(scoring.getScoreDetails(partial), null);
});

test('average-profile calibration: fullResults(0.6) line scores land in a sane band (60-140)', () => {
  const ls = scoring.calculateLineScores(fullResults(0.6));
  for (const key of LINE_KEYS) {
    assert.ok(ls[key].score >= 60 && ls[key].score <= 140,
      `${key}.score ${ls[key].score} outside sanity band [60,140]`);
  }
});

test('band sanity: getScoreDetails band brackets the percentile, all within 1-99', () => {
  const details = scoring.getScoreDetails(fullResults(0.6));
  assert.ok(details, 'expected non-null details for a full AFQT-eligible profile');
  const { percentile, band } = details;
  assert.ok(band.low >= 1 && band.low <= 99, `band.low ${band.low} out of [1,99]`);
  assert.ok(band.high >= 1 && band.high <= 99, `band.high ${band.high} out of [1,99]`);
  assert.ok(percentile >= 1 && percentile <= 99, `percentile ${percentile} out of [1,99]`);
  assert.ok(band.low <= percentile, `band.low (${band.low}) should be <= percentile (${percentile})`);
  assert.ok(percentile <= band.high, `percentile (${percentile}) should be <= band.high (${band.high})`);
});

test('unanswered penalty: identical answered records score strictly lower with unanswered:5 than unanswered:0', () => {
  // Isolate the penalty transform itself: use the SAME 10 answered records
  // (same MAP theta going in) in both fixtures, varying only whether the
  // section reports 5 unanswered questions or 0. A comparison against a
  // differently-answered baseline (e.g. a 15/15-correct section) can't
  // distinguish "MAP theta is naturally lower with fewer correct answers"
  // from "the incomplete-test penalty actually fired" — this can.
  const arQuestions = Array.from({ length: 10 }, (_, i) => ({
    id: `AR_${i}`, difficulty: (i % 5) + 1, isCorrect: i < 6, answered: true
  }));

  const withPenalty = fullResults(0.6);
  withPenalty.AR = { name: 'AR', correct: 6, total: 15, unanswered: 5, questions: arQuestions };

  const withoutPenalty = fullResults(0.6);
  withoutPenalty.AR = { name: 'AR', correct: 6, total: 10, unanswered: 0, questions: arQuestions };

  assert.doesNotThrow(() => scoring.calculateAFQTEstimate(afqtOnlyFrom(withPenalty)));
  const withPenaltyAFQT = scoring.calculateAFQTEstimate(afqtOnlyFrom(withPenalty));
  const withoutPenaltyAFQT = scoring.calculateAFQTEstimate(afqtOnlyFrom(withoutPenalty));

  assert.ok(withPenaltyAFQT < withoutPenaltyAFQT,
    `with-penalty (${withPenaltyAFQT}) should be strictly less than without-penalty (${withoutPenaltyAFQT})`);
});

test('a missing incomplete-test penalty table entry throws rather than silently skipping the penalty', () => {
  // unanswered: 999 has no entry in js/penalty-table.js for any section
  // (max is the section length, 15 for AR) — sectionAbility must fail loudly
  // instead of silently treating the test as if it had no unanswered items.
  const results = fullResults(0.6);
  const arQuestions = Array.from({ length: 10 }, (_, i) => ({
    id: `AR_${i}`, difficulty: (i % 5) + 1, isCorrect: i < 6, answered: true
  }));
  results.AR = { name: 'AR', correct: 6, total: 15, unanswered: 999, questions: arQuestions };
  assert.throws(() => scoring.calculateAFQTEstimate(afqtOnlyFrom(results)));
});

function afqtOnlyFrom(all) {
  return { AR: all.AR, WK: all.WK, PC: all.PC, MK: all.MK };
}

test('getScoreDetails includes all 8 sections when all 8 are present (forward-looking for Task 6)', () => {
  const details = scoring.getScoreDetails(fullResults(0.6));
  assert.ok(details, 'expected non-null details');
  const codes = Object.keys(details.sections).sort();
  assert.deepStrictEqual(codes, ['AR', 'AS', 'EI', 'GS', 'MC', 'MK', 'PC', 'WK'].sort());
});

test('getScoreDetails includes only the 4 AFQT sections when only those are present', () => {
  const details = scoring.getScoreDetails(afqtOnly(0.6));
  assert.ok(details, 'expected non-null details');
  const codes = Object.keys(details.sections).sort();
  assert.deepStrictEqual(codes, ['AR', 'MK', 'PC', 'WK']);
});
