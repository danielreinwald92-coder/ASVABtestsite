const test = require('node:test');
const assert = require('node:assert');
const { loadScripts } = require('../helpers/load');

const { window } = loadScripts(['js/spaced-repetition.js']);
const { review, isDue, dueCount } = window.MissionASVABSR;

test('new (null) card is due', () => {
  assert.strictEqual(isDue(null, '2026-07-04'), true);
});

test('again → due next day, interval reset to 1', () => {
  const s = review(null, 'again', '2026-07-04');
  assert.strictEqual(s.intervalDays, 1);
  assert.strictEqual(s.due, '2026-07-05');
});

test('good on new card → interval 1 → due next day', () => {
  const s = review(null, 'good', '2026-07-04');
  assert.strictEqual(s.intervalDays, 1);
  assert.strictEqual(s.due, '2026-07-05');
});

test('good again grows interval beyond 1', () => {
  const s1 = review(null, 'good', '2026-07-04');
  const s2 = review(s1, 'good', s1.due);
  assert.ok(s2.intervalDays > 1);
});

test('easy grows at least as fast as good', () => {
  const g = review(null, 'good', '2026-07-04');
  const e = review(null, 'easy', '2026-07-04');
  assert.ok(e.intervalDays >= g.intervalDays);
});

test('not due before due date; due on/after it', () => {
  const s = review(null, 'good', '2026-07-04');
  assert.strictEqual(isDue(s, '2026-07-04'), false);
  assert.strictEqual(isDue(s, s.due), true);
});

test('again lowers ease but not below floor', () => {
  let s = null;
  for (let i = 0; i < 10; i++) s = review(s, 'again', '2026-07-04');
  assert.ok(s.ease >= 1.3);
});

test('dueCount counts only due cards', () => {
  const states = {
    a: review(null, 'good', '2026-07-04'),   // due 07-05
    b: review(null, 'easy', '2026-07-04')     // due later
  };
  assert.strictEqual(dueCount(states, '2026-07-04'), 0);
  assert.strictEqual(dueCount(states, '2026-07-05'), 1);
});
