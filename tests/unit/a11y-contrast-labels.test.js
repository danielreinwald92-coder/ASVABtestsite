// 3.5 — accessible gold text token, admin filter labels, and aria-sort headers.
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { loadDom } = require('../helpers/load.js');

const rootDir = path.resolve(__dirname, '..', '..');

// --- WCAG relative-luminance contrast ---------------------------------------
function channel(c) {
  c /= 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function luminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}
function contrast(a, b) {
  const hi = Math.max(luminance(a), luminance(b));
  const lo = Math.min(luminance(a), luminance(b));
  return (hi + 0.05) / (lo + 0.05);
}

function cssVar(name) {
  const css = fs.readFileSync(path.join(rootDir, 'css/shared.css'), 'utf8');
  const m = css.match(new RegExp('--' + name + ':\\s*(#[0-9a-fA-F]{6})'));
  assert.ok(m, `--${name} should be defined in css/shared.css`);
  return m[1];
}

test('--gold-text reaches WCAG AA (>=4.5:1) on cream and white', () => {
  const gold = cssVar('gold-text');
  const cream = cssVar('cream-100');
  const white = cssVar('white');
  const onCream = contrast(gold, cream);
  const onWhite = contrast(gold, white);
  assert.ok(onCream >= 4.5, `gold-text on cream is ${onCream.toFixed(2)}:1, need >=4.5`);
  assert.ok(onWhite >= 4.5, `gold-text on white is ${onWhite.toFixed(2)}:1, need >=4.5`);
});

test('admin filter controls all have an accessible label', () => {
  const { document } = loadDom('admin.html');
  const ids = ['filterSearch', 'filterFrom', 'filterTo', 'filterEducation', 'filterZip', 'filterMinTests'];
  for (const id of ids) {
    const control = document.getElementById(id);
    assert.ok(control, `#${id} exists`);
    const hasLabel = !!document.querySelector(`label[for="${id}"]`);
    const hasAria = control.hasAttribute('aria-label') || control.hasAttribute('aria-labelledby');
    assert.ok(hasLabel || hasAria, `#${id} should have an associated <label> or aria-label`);
  }
});

test('admin sortable headers expose aria-sort', () => {
  const { document } = loadDom('admin.html');
  const headers = [...document.querySelectorAll('#adminTableHead th.sortable')];
  assert.ok(headers.length >= 4, 'expected several sortable headers');
  for (const th of headers) {
    assert.ok(th.hasAttribute('aria-sort'), `sortable th[data-sort="${th.dataset.sort}"] should have aria-sort`);
  }
  // The default sort (created_at desc) should be reflected in the static markup.
  const joined = document.querySelector('#adminTableHead th[data-sort="created_at"]');
  assert.strictEqual(joined.getAttribute('aria-sort'), 'descending');
});
