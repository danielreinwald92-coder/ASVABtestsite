const { test } = require('node:test');
const assert = require('node:assert');
const WA = require('../../js/weak-areas.js');

// 4.2(a) — pure aggregation over a user's test_results rows.

test('aggregates question_results across multiple tests', () => {
  const rows = [
    { question_results: [
      { id: 1, section: 'AR', correct: true },
      { id: 2, section: 'AR', correct: false },
      { id: 3, section: 'MK', correct: true },
    ] },
    { question_results: [
      { id: 4, section: 'AR', correct: false },
      { id: 5, section: 'MK', correct: true },
    ] },
  ];
  const agg = WA.aggregateSectionAccuracy(rows);
  assert.deepEqual({ ...agg.AR }, { correct: 1, total: 3, accuracy: 33 });
  assert.deepEqual({ ...agg.MK }, { correct: 2, total: 2, accuracy: 100 });
});

test('falls back to section_scores when question_results is null/missing (older rows)', () => {
  const rows = [
    { question_results: null, section_scores: { AR: { correct: 2, total: 10 }, WK: { correct: 9, total: 10 } } },
    { section_scores: { AR: { correct: 3, total: 10 } } }, // no question_results key at all
  ];
  const agg = WA.aggregateSectionAccuracy(rows);
  assert.deepEqual({ ...agg.AR }, { correct: 5, total: 20, accuracy: 25 });
  assert.deepEqual({ ...agg.WK }, { correct: 9, total: 10, accuracy: 90 });
});

test('prefers question_results over section_scores on a row that has both', () => {
  const rows = [{
    question_results: [
      { id: 1, section: 'AR', correct: true },
      { id: 2, section: 'AR', correct: true },
    ],
    section_scores: { AR: { correct: 0, total: 99 } }, // must be ignored
  }];
  const agg = WA.aggregateSectionAccuracy(rows);
  assert.deepEqual({ ...agg.AR }, { correct: 2, total: 2, accuracy: 100 });
});

test('mixes granular and fallback rows into one aggregate per section', () => {
  const rows = [
    { question_results: [
      { id: 1, section: 'AR', correct: true },
      { id: 2, section: 'AR', correct: false },
    ] },
    { section_scores: { AR: { correct: 1, total: 2 } } }, // older row
  ];
  const agg = WA.aggregateSectionAccuracy(rows);
  assert.deepEqual({ ...agg.AR }, { correct: 2, total: 4, accuracy: 50 });
});

test('weakestSections ranks lowest accuracy first and respects N', () => {
  const rows = [{ section_scores: {
    AR: { correct: 2, total: 10 }, // 20%
    MK: { correct: 5, total: 10 }, // 50%
    WK: { correct: 9, total: 10 }, // 90%
    PC: { correct: 4, total: 10 }, // 40%
  } }];
  const top2 = WA.weakestSections(rows, 2);
  assert.deepEqual(top2.map(s => s.code), ['AR', 'PC']);
  assert.strictEqual(top2[0].accuracy, 20);
});

test('weakestSections tiebreaks equal accuracy by more attempts', () => {
  const rows = [
    { section_scores: { AR: { correct: 1, total: 2 } } },   // 50%, 2 attempts
    { section_scores: { MK: { correct: 5, total: 10 } } },  // 50%, 10 attempts
  ];
  const ranked = WA.weakestSections(rows, 2);
  assert.deepEqual(ranked.map(s => s.code), ['MK', 'AR']);
});

test('weakestSections can filter to a section whitelist', () => {
  const rows = [{ section_scores: {
    AR: { correct: 2, total: 10 },
    GS: { correct: 1, total: 10 }, // not an AFQT section
    MK: { correct: 5, total: 10 },
  } }];
  const ranked = WA.weakestSections(rows, 5, { sections: ['AR', 'MK', 'WK', 'PC'] });
  assert.deepEqual(ranked.map(s => s.code), ['AR', 'MK']);
});

test('handles zero tests / empty input without throwing', () => {
  assert.deepEqual(WA.aggregateSectionAccuracy([]), {});
  assert.deepEqual(WA.aggregateSectionAccuracy(null), {});
  assert.deepEqual(WA.weakestSections([], 2), []);
  assert.deepEqual(WA.weakestSections(undefined, 2), []);
});

test('ignores sections with zero total', () => {
  const rows = [{ section_scores: { AR: { correct: 0, total: 0 } } }];
  const agg = WA.aggregateSectionAccuracy(rows);
  // total 0 → not bucketed via fallback path
  assert.strictEqual(agg.AR, undefined);
  assert.deepEqual(WA.weakestSections(rows, 2), []);
});
