const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { JSDOM } = require('jsdom');

const root = path.resolve(__dirname, '..', '..');

function extractFn(source, name) {
  const start = source.indexOf('function ' + name);
  assert.ok(start >= 0, `could not find ${name}`);
  let depth = 0, i = source.indexOf('{', start);
  for (; i < source.length; i++) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}' && --depth === 0) break;
  }
  return source.slice(start, i + 1);
}

const src = fs.readFileSync(path.join(root, 'js/dashboard.js'), 'utf8');

// IRT v2 (Task 8) — a row written before this deploy has scoring_version:
// null; a row written after has scoring_version: 'irt-v2'. The dashboard
// history note should appear only when an account has BOTH kinds of rows,
// never for an all-legacy or all-v2 history.
test('hasMixedScoringVersions is true only when both legacy(null) and irt-v2 rows are present', () => {
  const sandbox = { console };
  vm.createContext(sandbox);
  vm.runInContext(extractFn(src, 'hasMixedScoringVersions') + '\nthis.__fn = hasMixedScoringVersions;', sandbox);

  assert.strictEqual(sandbox.__fn([]), false);
  assert.strictEqual(sandbox.__fn(null), false);
  assert.strictEqual(sandbox.__fn([{ scoring_version: null }]), false, 'all-legacy history');
  assert.strictEqual(sandbox.__fn([{ scoring_version: 'irt-v2' }]), false, 'all-v2 history');
  assert.strictEqual(
    sandbox.__fn([{ scoring_version: null }, { scoring_version: 'irt-v2' }]),
    true,
    'mixed history'
  );
  // Rows that predate the migration entirely (no scoring_version key) count
  // as legacy too, same as an explicit null.
  assert.strictEqual(sandbox.__fn([{}, { scoring_version: 'irt-v2' }]), true);
});

test('renderScoringModelNote inserts a single muted note when versions are mixed, and hides/removes duplication otherwise', () => {
  const dom = new JSDOM(
    '<div class="section-card-container"><div class="section-title">Test History</div><div id="historyTable"></div></div>'
  );
  const { document } = dom.window;

  const sandbox = { console, document };
  vm.createContext(sandbox);
  const fnSrc = extractFn(src, 'hasMixedScoringVersions') + '\n' + extractFn(src, 'renderScoringModelNote');
  vm.runInContext(fnSrc + '\nthis.__fn = renderScoringModelNote;', sandbox);

  const mixed = [{ scoring_version: null }, { scoring_version: 'irt-v2' }];
  sandbox.__fn(mixed);

  let notes = document.querySelectorAll('#scoringModelNote');
  assert.strictEqual(notes.length, 1, 'expected exactly one note element');
  assert.strictEqual(notes[0].hidden, false);
  assert.match(notes[0].textContent, /Scoring model upgraded Aug 2026/);
  assert.ok(!/confidence interval/i.test(notes[0].textContent));

  // Re-render (e.g. pagination triggers renderTestHistory again) must not
  // duplicate the element in the DOM.
  sandbox.__fn(mixed);
  notes = document.querySelectorAll('#scoringModelNote');
  assert.strictEqual(notes.length, 1, 'must not duplicate the note element on re-render');

  // A single-model history (no mixing) hides the existing note.
  sandbox.__fn([{ scoring_version: 'irt-v2' }]);
  notes = document.querySelectorAll('#scoringModelNote');
  assert.strictEqual(notes.length, 1);
  assert.strictEqual(notes[0].hidden, true);
});
