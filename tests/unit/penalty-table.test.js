const test = require('node:test');
const assert = require('node:assert');
const PENALTY = require('../../js/penalty-table.js');
const SECTIONS = ['GS', 'AR', 'WK', 'PC', 'MK', 'EI', 'AS', 'MC'];
const LENGTHS = { GS: 15, AR: 15, WK: 15, PC: 10, MK: 15, EI: 15, AS: 10, MC: 15 };

test('penalty table covers every (section, unansweredCount) with finite coefficients', () => {
  for (const code of SECTIONS) {
    for (let u = 1; u <= LENGTHS[code]; u++) {
      const p = PENALTY[code] && PENALTY[code][u];
      assert.ok(p && Number.isFinite(p.A) && Number.isFinite(p.B), `${code}/${u}`);
      assert.ok(p.B >= 0 && p.B <= 1.2, `${code}/${u} B=${p.B}`);
    }
  }
});

test('penalty grows with unanswered count (evaluated at theta=1)', () => {
  for (const code of SECTIONS) {
    const few = PENALTY[code][1];
    const many = PENALTY[code][LENGTHS[code] - 1];
    assert.ok(many.A + many.B * 1 < few.A + few.B * 1 + 0.15, code);
  }
});

test('all-unanswered coefficient is a low fixed score', () => {
  for (const code of SECTIONS) {
    const p = PENALTY[code][LENGTHS[code]];
    assert.ok(p.B === 0 || Math.abs(p.B) < 0.2, code);
    assert.ok(p.A < 0, `${code} all-random should score below average, got A=${p.A}`);
  }
});
