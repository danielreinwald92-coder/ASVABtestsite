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
  // renderSectionBreakdown was externalized from results.html into
  // js/page-results.js (CSP script-src hardening); read the shipped source.
  const html = fs.readFileSync(path.join(root, 'js/page-results.js'), 'utf8');
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

// SP1 — the review renders a 💡 explanation block for questions that have one.
test('renderFilteredQuestions injects an explanation block when available', () => {
  const src = fs.readFileSync(path.join(root, 'js/page-results.js'), 'utf8');
  // Pull the two functions we need out of the shipped source.
  const fnSrc = extractFn(src, 'escReview') + '\n' + extractFn(src, 'renderFilteredQuestions');

  let listHTML = '';
  const listEl = {
    set innerHTML(v) { listHTML = v; },
    get innerHTML() { return listHTML; },
  };
  const sandbox = {
    console,
    document: { getElementById: (id) => (id === 'reviewQuestionsList' ? listEl : null) },
    allReviewQuestions: [{
      num: 1, section: 'AR', sectionName: 'Arithmetic Reasoning',
      id: 5, originalId: 'AR001',
      text: 'Q?', options: ['a', 'b', 'c', 'd'],
      userAnswer: 0, correctAnswer: 1, isCorrect: false,
    }],
    questionExplanations: { AR001: 'Divide total by count to get the average.' },
    reportedQuestionIds: new Set(),
  };
  vm.createContext(sandbox);
  vm.runInContext(fnSrc + '\nthis.__fn = renderFilteredQuestions;', sandbox);
  sandbox.__fn('all');

  assert.ok(listHTML.includes('review-explanation'), 'expected an explanation block');
  assert.ok(listHTML.includes('Divide total by count'), 'expected explanation text');
});
