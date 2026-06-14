const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..', '..');

// Extract the renderSectionBreakdown() function body straight out of
// results.html and execute the real code against fake DOM nodes. This tests the
// actual shipped logic (not a copy) for the divide-by-zero NaN% guard.
function extractFn(source, name) {
  const start = source.indexOf('function ' + name);
  assert.ok(start >= 0, `could not find function ${name}`);
  let depth = 0;
  let i = source.indexOf('{', start);
  for (; i < source.length; i++) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}') {
      depth--;
      if (depth === 0) break;
    }
  }
  return source.slice(start, i + 1);
}

// 2.8 — a section with {correct:0, total:0} must not produce "NaN%".
test('renderSectionBreakdown guards divide-by-zero (no NaN, width 0%)', () => {
  const html = fs.readFileSync(path.join(root, 'results.html'), 'utf8');
  const fnSrc = extractFn(html, 'renderSectionBreakdown');

  const grid = {
    _html: '',
    set innerHTML(v) {
      this._html = v;
    },
    get innerHTML() {
      return this._html;
    },
  };
  const container = { style: {} };
  const document = {
    getElementById(id) {
      if (id === 'breakdownGrid') return grid;
      if (id === 'sectionBreakdown') return container;
      return null;
    },
  };

  const ctx = { document, console };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(fnSrc + '\nthis.renderSectionBreakdown = renderSectionBreakdown;', ctx);

  ctx.renderSectionBreakdown({ AR: { correct: 0, total: 0 } });

  assert.ok(!/NaN/.test(grid._html), 'rendered HTML must not contain NaN');
  assert.ok(/width:\s*0%/.test(grid._html), 'zero-total section should render width 0%');
});
