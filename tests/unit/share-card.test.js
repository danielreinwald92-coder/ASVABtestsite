const test = require('node:test');
const assert = require('node:assert');
const { loadScripts } = require('../helpers/load');

const { window } = loadScripts(['js/share-card.js']);
const { buildShareText } = window.MissionASVABShareCard;

test('timed result shows AFQT percentile', () => {
  const t = buildShareText({ mode: 'timed', afqtPercentile: 72, dateStr: '2026-07-04' });
  const joined = t.lines.join(' ');
  assert.ok(joined.includes('72'));
  assert.ok(/AFQT/i.test(joined));
});

test('timed result includes up to 3 line scores', () => {
  const t = buildShareText({
    mode: 'timed', afqtPercentile: 60, dateStr: '2026-07-04',
    lineScores: [{ code: 'GT', score: 110 }, { code: 'CL', score: 105 }, { code: 'EL', score: 100 }, { code: 'MM', score: 95 }]
  });
  const joined = t.lines.join(' ');
  assert.ok(joined.includes('GT'));
  assert.ok(!joined.includes('MM')); // capped at 3
});

test('percentile uses correct ordinal suffix', () => {
  assert.ok(buildShareText({ mode: 'timed', afqtPercentile: 91 }).lines[0].includes('91st percentile'));
  assert.ok(buildShareText({ mode: 'timed', afqtPercentile: 72 }).lines[0].includes('72nd percentile'));
  assert.ok(buildShareText({ mode: 'timed', afqtPercentile: 93 }).lines[0].includes('93rd percentile'));
  assert.ok(buildShareText({ mode: 'timed', afqtPercentile: 11 }).lines[0].includes('11th percentile'));
  assert.ok(buildShareText({ mode: 'timed', afqtPercentile: 12 }).lines[0].includes('12th percentile'));
  assert.ok(buildShareText({ mode: 'timed', afqtPercentile: 13 }).lines[0].includes('13th percentile'));
  assert.ok(buildShareText({ mode: 'timed', afqtPercentile: 50 }).lines[0].includes('50th percentile'));
});

test('tutor result has no AFQT claim', () => {
  const t = buildShareText({ mode: 'tutor', dateStr: '2026-07-04' });
  assert.ok(!/AFQT/i.test(t.lines.join(' ')));
});

test('never leaks a name field even if present', () => {
  const t = buildShareText({ mode: 'timed', afqtPercentile: 50, dateStr: '2026-07-04', name: 'Jane Doe' });
  assert.ok(!t.lines.join(' ').includes('Jane'));
  assert.ok(!(t.title + '').includes('Jane'));
});

test('timed result without a numeric AFQT falls back to practice card', () => {
  const t = buildShareText({ mode: 'timed', dateStr: '2026-07-04' });
  assert.ok(!/AFQT/i.test(t.lines.join(' ')));
});
