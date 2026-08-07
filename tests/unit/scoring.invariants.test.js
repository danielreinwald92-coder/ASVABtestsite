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

test('zero/empty totals yield finite AFQT >= 1 (no NaN)', () => {
  const empty = (name) => mkSection(name, []);
  const afqt = scoring.calculateAFQTEstimate({
    AR: empty('AR'), WK: empty('WK'), PC: empty('PC'), MK: empty('MK')
  });
  assert.ok(Number.isFinite(afqt), `expected finite, got ${afqt}`);
  assert.ok(afqt >= 1, `expected >= 1, got ${afqt}`);
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

test('unanswered penalty: an AR section with 5 unanswered scores strictly lower than the same fixture fully answered correct', () => {
  // Fully-answered baseline: AR all correct.
  const fullyAnswered = fullResults(0.6);
  fullyAnswered.AR = mkSection('AR', Array.from({ length: 15 }, () => true));
  const fullyAnsweredAFQT = scoring.calculateAFQTEstimate(afqtOnlyFrom(fullyAnswered));

  // Same pattern, but the last 5 questions are unanswered (answered: false)
  // and reflected via unanswered: 5 on the section.
  const withUnanswered = fullResults(0.6);
  const arPattern = Array.from({ length: 15 }, (_, i) => i < 10); // 10 correct, 5 unanswered
  const arQuestions = arPattern.map((ok, i) => ({
    id: `AR_${i}`, difficulty: (i % 5) + 1,
    isCorrect: i < 10 ? true : false,
    answered: i < 10
  }));
  withUnanswered.AR = {
    name: 'AR', correct: 10, total: 15, unanswered: 5, questions: arQuestions
  };

  assert.doesNotThrow(() => scoring.calculateAFQTEstimate(afqtOnlyFrom(withUnanswered)));
  const penalizedAFQT = scoring.calculateAFQTEstimate(afqtOnlyFrom(withUnanswered));

  assert.ok(penalizedAFQT < fullyAnsweredAFQT,
    `penalized (${penalizedAFQT}) should be strictly less than fully-answered (${fullyAnsweredAFQT})`);
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
