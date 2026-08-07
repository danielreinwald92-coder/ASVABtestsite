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
  const fnSrc = extractFn(html, 'formatSectionScoreLine') + '\n' +
    extractFn(html, 'formatUnansweredNote') + '\n' +
    extractFn(html, 'renderSectionBreakdown');

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

// IRT v2 (Task 8) — the AFQT sub-line renders a "likely range" band when
// results.afqtBand is present, and falls back to the plain percentile line
// otherwise (legacy stored results predating this deploy have no afqtBand
// field at all; a scored-but-band-less case is also possible in principle).
test('formatAfqtPercentileLine renders a "likely range" band and never implies a 95% CI', () => {
  const src = fs.readFileSync(path.join(root, 'js/page-results.js'), 'utf8');
  const fnSrc = extractFn(src, 'getOrdinalSuffix') + '\n' + extractFn(src, 'formatAfqtPercentileLine');

  const sandbox = { console };
  vm.createContext(sandbox);
  vm.runInContext(fnSrc + '\nthis.__fn = formatAfqtPercentileLine;', sandbox);

  const withBand = sandbox.__fn(72, { low: 65, high: 79 });
  assert.strictEqual(withBand, '72nd Percentile · likely range 65–79');
  assert.ok(!/confidence interval/i.test(withBand), 'must not say "confidence interval"');
  assert.ok(!/95%/.test(withBand), 'must not imply 95% coverage');

  // Legacy results (no afqtBand key) and any explicit null/undefined band
  // both fall back to the plain percentile line, unchanged from before.
  assert.strictEqual(sandbox.__fn(72, null), '72nd Percentile');
  assert.strictEqual(sandbox.__fn(72, undefined), '72nd Percentile');
  assert.strictEqual(sandbox.__fn(72, {}), '72nd Percentile');
});

// IRT v2 (Task 8) — section rows append a standard score when the section was
// scored (`ss` present), and a plain unanswered note when the section has
// unreached CAT slots — but never for legacy-shaped section data (no `ss`,
// no `unanswered` key at all), so old stored results render exactly as before.
test('renderSectionBreakdown appends standard score / unanswered note only when present', () => {
  const src = fs.readFileSync(path.join(root, 'js/page-results.js'), 'utf8');
  const fnSrc = extractFn(src, 'formatSectionScoreLine') + '\n' +
    extractFn(src, 'formatUnansweredNote') + '\n' +
    extractFn(src, 'renderSectionBreakdown');

  const grid = {
    _html: '',
    set innerHTML(v) { this._html = v; },
    get innerHTML() { return this._html; },
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

  // Legacy shape: no `ss`, no `unanswered` key at all.
  ctx.renderSectionBreakdown({ WK: { correct: 12, total: 15 } });
  assert.ok(!/Standard score/.test(grid._html), 'legacy section must not render a standard score');
  assert.ok(!/unanswered/.test(grid._html), 'legacy section must not render an unanswered note');

  // Scored, fully-answered section: standard score only, no unanswered note.
  ctx.renderSectionBreakdown({ AR: { correct: 10, total: 15, unanswered: 0, ss: 52 } });
  assert.ok(grid._html.includes('Standard score 52'), 'expected the standard score to render');
  assert.ok(!/unanswered/.test(grid._html), 'a fully-answered scored section must not render an unanswered note');

  // Scored section with unreached CAT slots: both standard score and note.
  ctx.renderSectionBreakdown({ MK: { correct: 8, total: 15, unanswered: 3, ss: 46 } });
  assert.ok(grid._html.includes('Standard score 46'));
  assert.ok(grid._html.includes('3 unanswered — scored as random guesses'));

  // Singular phrasing for exactly one unanswered question, still scored (ss present).
  ctx.renderSectionBreakdown({ MC: { correct: 8, total: 15, unanswered: 1, ss: 50 } });
  assert.ok(grid._html.includes('1 unanswered — scored as a random guess'));

  // Diagnostic/tutor sections track `unanswered` too (Task 6), but were never
  // routed through the IRT penalty table (no `ss`) — unanswered there really
  // is zero credit, so the note must NOT claim a random-guess adjustment.
  ctx.renderSectionBreakdown({ GS: { correct: 5, total: 15, unanswered: 4 } });
  assert.ok(grid._html.includes('4 unanswered — no credit given'));
  assert.ok(!/random guess/.test(grid._html));
});
