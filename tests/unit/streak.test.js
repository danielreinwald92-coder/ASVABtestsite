const test = require('node:test');
const assert = require('node:assert');
const { loadScripts } = require('../helpers/load');

const { window } = loadScripts(['js/streak.js']);
const { computeStreak } = window.MissionASVABStreak;

// Note: computeStreak returns an object from the vm sandbox realm, so its
// prototype differs from the test realm's Object — assert on fields, not
// deepStrictEqual (which checks prototype identity).
function eq(result, current, longest) {
  assert.strictEqual(result.current, current);
  assert.strictEqual(result.longest, longest);
}

test('no activity → zero streak', () => {
  eq(computeStreak([], '2026-07-04'), 0, 0);
});

test('today only → current 1', () => {
  eq(computeStreak(['2026-07-04'], '2026-07-04'), 1, 1);
});

test('consecutive run ending today → counts all', () => {
  eq(computeStreak(['2026-07-02', '2026-07-03', '2026-07-04'], '2026-07-04'), 3, 3);
});

test('duplicates same day count once', () => {
  eq(computeStreak(['2026-07-04', '2026-07-04', '2026-07-03'], '2026-07-04'), 2, 2);
});

test('current run allowed to end yesterday (today not yet practiced)', () => {
  eq(computeStreak(['2026-07-02', '2026-07-03'], '2026-07-04'), 2, 2);
});

test('gap breaks current but longest remembered', () => {
  const r = computeStreak(['2026-06-01', '2026-06-02', '2026-06-03', '2026-07-04'], '2026-07-04');
  assert.strictEqual(r.longest, 3);
  assert.strictEqual(r.current, 1);
});

test('stale run (ended before yesterday) → current 0', () => {
  assert.strictEqual(computeStreak(['2026-06-01', '2026-06-02'], '2026-07-04').current, 0);
});

test('handles month boundary as consecutive', () => {
  eq(computeStreak(['2026-06-30', '2026-07-01'], '2026-07-01'), 2, 2);
});
