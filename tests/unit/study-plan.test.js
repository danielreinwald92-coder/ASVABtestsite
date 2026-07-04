const test = require('node:test');
const assert = require('node:assert');
const { loadScripts } = require('../helpers/load');

const { window } = loadScripts(['js/study-plan.js']);
const { buildStudyPlan } = window.MissionASVABStudyPlan;

test('no test date → phase none with generic items', () => {
  const p = buildStudyPlan({ daysRemaining: null, weakSections: [] });
  assert.strictEqual(p.phase, 'none');
  assert.ok(p.items.length > 0);
});

test('far out (>21) → foundation', () => {
  assert.strictEqual(buildStudyPlan({ daysRemaining: 40, weakSections: ['AR'] }).phase, 'foundation');
});

test('mid (7..21) → focus and names weak sections', () => {
  const p = buildStudyPlan({ daysRemaining: 14, weakSections: ['AR', 'WK'] });
  assert.strictEqual(p.phase, 'focus');
  assert.ok(p.items.join(' ').includes('Arithmetic Reasoning'));
});

test('close (<7) → sprint', () => {
  assert.strictEqual(buildStudyPlan({ daysRemaining: 3, weakSections: [] }).phase, 'sprint');
});

test('boundary 21 → focus, 22 → foundation', () => {
  assert.strictEqual(buildStudyPlan({ daysRemaining: 21, weakSections: [] }).phase, 'focus');
  assert.strictEqual(buildStudyPlan({ daysRemaining: 22, weakSections: [] }).phase, 'foundation');
});

test('boundary 7 → focus, 6 → sprint', () => {
  assert.strictEqual(buildStudyPlan({ daysRemaining: 7, weakSections: [] }).phase, 'focus');
  assert.strictEqual(buildStudyPlan({ daysRemaining: 6, weakSections: [] }).phase, 'sprint');
});

test('past date (negative) → sprint with update nudge', () => {
  const p = buildStudyPlan({ daysRemaining: -2, weakSections: [] });
  assert.strictEqual(p.phase, 'sprint');
  assert.ok(/update/i.test(p.headline));
});

test('focus with no weak sections falls back gracefully', () => {
  const p = buildStudyPlan({ daysRemaining: 14, weakSections: [] });
  assert.ok(p.items.join(' ').includes('weakest sections'));
});
