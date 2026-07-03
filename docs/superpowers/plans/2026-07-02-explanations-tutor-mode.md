# Question Explanations + Tutor Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add one concise explanation to every question in the bank (shown in the results review for all test modes) and add an untimed "tutor mode" that gives instant per-question feedback with the explanation, feeding weak-area analysis without polluting the AFQT progress chart.

**Architecture:** Explanations live in a new standalone `js/explanations.js` (global map keyed by question id), lazy-loaded via `js/load-explanations.js` only on the results page and in tutor mode — never during a timed quiz. Tutor mode is a flag on the existing `QuizEngine` (`?mode=tutor`) that hides the timer, locks each answer on selection, reveals correct/incorrect + explanation, and records the session with `mode='tutor'` and a null AFQT. The dashboard filters its score chart to `mode='timed'` rows while weak-area aggregation consumes all rows.

**Tech Stack:** Vanilla ES5-ish classic scripts (no bundler), `node:test` + jsdom unit tests, `scripts/validate-site.js` build gate, Supabase Postgres (project ref `rcspwkmrtukblvvdifer`), strict CSP (`script-src 'self' https://cdn.jsdelivr.net`, enforced by `scripts/check-no-inline-js.js`).

**Source spec:** `docs/superpowers/specs/2026-07-02-explanations-tutor-mode-design.md`

---

## File Structure

**Create:**
- `js/explanations.js` — `window.QUIZ_EXPLANATIONS = { "<question-id>": "<explanation>", … }`. Same IIFE/global pattern as `js/section-config.js`. Populated in Phase C.
- `js/load-explanations.js` — `window.loadExplanations()` → Promise resolving to the map; injects `explanations.js` once, resolves `{}` on error (graceful degradation).
- `tests/unit/explanations-contract.test.js` — orphan/length/coverage contract mirror of the build gate.
- `tests/unit/load-explanations.test.js` — loader fast-path + error-path.
- `tests/unit/quiz-engine-tutor.test.js` — tutor-mode engine behavior.
- `tests/unit/dashboard-mode-filter.test.js` — dashboard timed-only filter + weak-area inclusion.

**Modify:**
- `js/quiz-engine.js` — tutor mode: detect `mode`, skip timer, lock/reveal on answer, tutor navigator colors, `mode` in results + Supabase payload, null AFQT/line-scores for tutor.
- `js/page-results.js` — lazy-load explanations, render explanation block in review, tutor-session summary copy.
- `js/dashboard.js` — split timed vs all results; score summary/chart/section-cards use timed only; focus panel/weak-areas use all; history labels tutor rows "Practice".
- `js/page-select-test.js` + `select-test.html` — "Untimed tutor mode" toggle → `testConfig.mode`.
- `js/page-test-intro.js` + `test-intro.html` — forward `mode` to `quiz.html?mode=tutor`; adapt copy (no timer rules).
- `quiz.html` — add `#tutorFeedback` container, tutor CSS, include `js/load-explanations.js`.
- `results.html` — include `js/load-explanations.js` before `js/page-results.js`.
- `scripts/validate-site.js` — explanation orphan/length/coverage contract (staged allowlist).
- `service-worker.js` — precache `explanations.js` + `load-explanations.js`; bump `CACHE_VERSION`.

**Migration (Supabase, apply via `apply_migration`):**
- `add_mode_to_test_results` — `alter table test_results add column mode text not null default 'timed'` + check constraint `mode in ('timed','tutor')`. (`afqt_score` is already nullable — verified 2026-07-02.)

---

# PHASE A — Explanations infrastructure + results review

*Shippable on its own: timed tests immediately gain an explanation block in the review (empty until Phase C content lands, block simply doesn't render).*

## Task A1: `explanations.js` scaffold + `load-explanations.js` loader

**Files:**
- Create: `js/explanations.js`
- Create: `js/load-explanations.js`
- Test: `tests/unit/load-explanations.test.js`

- [ ] **Step 1: Create the explanations data file (empty map, ready for Phase C)**

`js/explanations.js`:
```js
// Answer explanations for the ASVAB question bank, keyed by question id
// (matches js/quiz-data.js question.id, e.g. "AR042"). One concise explanation
// per question. Loaded ON DEMAND (results review + tutor mode) via
// js/load-explanations.js — NEVER during a timed quiz.
// Contract enforced by scripts/validate-site.js. Format + authoring process:
// docs/superpowers/specs/2026-07-02-explanations-tutor-mode-design.md
(function (root) {
  const QUIZ_EXPLANATIONS = {
    // Populated in per-section batches (Phase C). Key = question id string.
  };

  root.QUIZ_EXPLANATIONS = QUIZ_EXPLANATIONS;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = QUIZ_EXPLANATIONS;
  }
})(typeof window !== 'undefined' ? window : this);
```

- [ ] **Step 2: Write the failing loader test**

`tests/unit/load-explanations.test.js`:
```js
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..', '..');

function loadInSandbox(extraGlobals = {}) {
  const sandbox = Object.assign({ console }, extraGlobals);
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  const src = fs.readFileSync(path.join(root, 'js/load-explanations.js'), 'utf8');
  vm.runInContext(src, sandbox);
  return sandbox;
}

test('loadExplanations resolves immediately when QUIZ_EXPLANATIONS already present', async () => {
  const sandbox = loadInSandbox({ QUIZ_EXPLANATIONS: { AR001: 'because' } });
  const map = await sandbox.loadExplanations();
  assert.deepStrictEqual(map, { AR001: 'because' });
});

test('loadExplanations resolves {} when the injected script errors', async () => {
  // Fake document whose appended <script> immediately fires onerror.
  const fakeDoc = {
    head: { appendChild(node) { if (node.onerror) node.onerror(); } },
    createElement() { return { set src(v) {}, onload: null, onerror: null }; },
  };
  const sandbox = loadInSandbox({ document: fakeDoc });
  const map = await sandbox.loadExplanations();
  assert.deepStrictEqual(map, {});
});

test('loadExplanations resolves the map when the injected script loads', async () => {
  const fakeDoc = {
    head: {
      appendChild(node) {
        // Simulate the script tag running explanations.js, then firing onload.
        this._sandbox.QUIZ_EXPLANATIONS = { MK009: 'x squared' };
        if (node.onload) node.onload();
      },
    },
    createElement() { return { set src(v) {}, onload: null, onerror: null }; },
  };
  const sandbox = loadInSandbox({ document: fakeDoc });
  fakeDoc.head._sandbox = sandbox;
  const map = await sandbox.loadExplanations();
  assert.deepStrictEqual(map, { MK009: 'x squared' });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `node --test tests/unit/load-explanations.test.js`
Expected: FAIL — `load-explanations.js` does not exist / `loadExplanations is not a function`.

- [ ] **Step 4: Create the loader**

`js/load-explanations.js`:
```js
// Lazy loader for js/explanations.js. Injects the script once (same-origin, so
// allowed by the strict CSP script-src 'self') and caches the promise. Resolves
// to the QUIZ_EXPLANATIONS map, or {} if the script is missing/fails — callers
// degrade gracefully (no explanation block rendered).
(function (root) {
  let _promise = null;

  function loadExplanations() {
    if (root.QUIZ_EXPLANATIONS) return Promise.resolve(root.QUIZ_EXPLANATIONS);
    if (_promise) return _promise;

    _promise = new Promise((resolve) => {
      try {
        const s = root.document.createElement('script');
        s.src = 'js/explanations.js';
        s.onload = () => resolve(root.QUIZ_EXPLANATIONS || {});
        s.onerror = () => resolve({});
        root.document.head.appendChild(s);
      } catch (_) {
        resolve({});
      }
    });
    return _promise;
  }

  root.loadExplanations = loadExplanations;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadExplanations };
  }
})(typeof window !== 'undefined' ? window : this);
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `node --test tests/unit/load-explanations.test.js`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add js/explanations.js js/load-explanations.js tests/unit/load-explanations.test.js
git commit -m "feat: explanations data file + lazy loader (SP1 Phase A)"
```

## Task A2: Build-gate explanation contract

**Files:**
- Modify: `scripts/validate-site.js`
- Test: `tests/unit/explanations-contract.test.js`

- [ ] **Step 1: Write the failing contract test**

`tests/unit/explanations-contract.test.js`:
```js
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..', '..');

function loadData() {
  const ctx = { console, window: {} };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  for (const f of ['js/section-config.js', 'js/quiz-data.js', 'js/explanations.js']) {
    vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
  }
  return {
    questions: ctx.window.asvabData.questions,
    explanations: ctx.window.QUIZ_EXPLANATIONS,
  };
}

test('every explanation key maps to a real question id (no orphans)', () => {
  const { questions, explanations } = loadData();
  const ids = new Set();
  for (const list of Object.values(questions)) list.forEach((q) => ids.add(q.id));
  for (const key of Object.keys(explanations)) {
    assert.ok(ids.has(key), `explanation for unknown question id "${key}"`);
  }
});

test('every explanation is within the length bounds (40–600 chars)', () => {
  const { explanations } = loadData();
  for (const [id, text] of Object.entries(explanations)) {
    assert.strictEqual(typeof text, 'string', `${id} explanation must be a string`);
    assert.ok(text.length >= 40, `${id} explanation too short (${text.length} chars)`);
    assert.ok(text.length <= 600, `${id} explanation too long (${text.length} chars)`);
  }
});
```

- [ ] **Step 2: Run the test to verify it passes trivially (empty map) — this proves the harness**

Run: `node --test tests/unit/explanations-contract.test.js`
Expected: PASS (both tests pass vacuously over the empty map — confirms wiring before content exists).

- [ ] **Step 3: Add the contract to the build gate**

In `scripts/validate-site.js`, after the existing `loadScript('js/quiz-data.js', context);` line, add:
```js
loadScript('js/explanations.js', context);
```

Then, after the existing `for (const [code, section] of Object.entries(asvabData.sections))` loop that validates questions (ends at the line `}` before the courses loop), insert:
```js
// --- Explanation contract (SP1) ---------------------------------------------
// Staged rollout: full per-section coverage is enforced only for sections whose
// explanation batch has landed (Phase C adds codes here). Orphan + length checks
// always apply. Remove the allowlist and enforce all 8 once content is complete.
const SECTIONS_WITH_EXPLANATIONS = [
  // 'WK', 'PC', 'AR', 'MK', 'GS', 'AS', 'MC', 'EI'  ← uncomment per batch
];
const explanations = context.window.QUIZ_EXPLANATIONS || {};

const allQuestionIds = new Set();
for (const list of Object.values(asvabData.questions)) {
  list.forEach((q) => allQuestionIds.add(q.id));
}
for (const [key, text] of Object.entries(explanations)) {
  assert(allQuestionIds.has(key), `explanation for unknown question id ${key}`);
  assert(typeof text === 'string' && text.length >= 40 && text.length <= 600,
    `explanation ${key} must be a 40–600 char string`);
}
for (const code of SECTIONS_WITH_EXPLANATIONS) {
  for (const q of (asvabData.questions[code] || [])) {
    assert(explanations[q.id] && explanations[q.id].length > 0,
      `${q.id} (${code}) is missing an explanation`);
  }
}
```

- [ ] **Step 4: Run the build gate to verify it still passes**

Run: `node scripts/validate-site.js`
Expected: `Validation passed` (allowlist empty → coverage check is a no-op; orphan/length pass over the empty map).

- [ ] **Step 5: Commit**

```bash
git add scripts/validate-site.js tests/unit/explanations-contract.test.js
git commit -m "feat: explanation build-gate contract, staged per-section (SP1 Phase A)"
```

## Task A3: Render the explanation block in the results review

**Files:**
- Modify: `js/page-results.js`
- Modify: `results.html`
- Test: `tests/unit/results-render.test.js` (add a case)

- [ ] **Step 1: Write the failing test (extract + run the real renderFilteredQuestions)**

Add to `tests/unit/results-render.test.js`:
```js
// SP1 — the review renders a 💡 explanation block for questions that have one.
test('renderFilteredQuestions injects an explanation block when available', () => {
  const src = fs.readFileSync(path.join(root, 'js/page-results.js'), 'utf8');
  // Pull the two functions we need out of the shipped source.
  const fnSrc = extractFn(src, 'renderFilteredQuestions');

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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/unit/results-render.test.js`
Expected: FAIL — no `review-explanation` markup (and `questionExplanations` unused).

- [ ] **Step 3: Add explanation state + block to `page-results.js`**

Near the top of `js/page-results.js`, beside `let allReviewQuestions = [];`, add:
```js
// SP1 — explanation map (lazy-loaded) + the filter currently shown, so we can
// re-render in place once explanations arrive.
let questionExplanations = {};
let currentReviewFilter = 'all';
```

In `renderFilteredQuestions`, replace the first line:
```js
function renderFilteredQuestions(filter) {
```
with:
```js
function renderFilteredQuestions(filter) {
  currentReviewFilter = filter;
```

Then, inside the `filtered.forEach(q => { … })` loop, immediately BEFORE the closing `html += \`\n      </div>\n    \`;` that ends each `.review-question`, insert the explanation block:
```js
    // SP1 — explanation block (first-party static content; renders only when loaded).
    const explanation = questionExplanations[q.originalId];
    if (explanation) {
      html += `
        <div class="review-explanation">
          <span class="review-explanation-label">💡 Explanation</span>
          <p class="review-explanation-text">${explanation}</p>
        </div>
      `;
    }
```

- [ ] **Step 4: Lazy-load explanations in `renderAnswerReview` and re-render**

In `js/page-results.js`, at the END of `renderAnswerReview` (after the `document.querySelectorAll('.filter-btn')…` wiring block), append:
```js
  // SP1 — pull in explanations without blocking the initial review render, then
  // re-render the current filter so the 💡 blocks appear.
  if (typeof loadExplanations === 'function') {
    loadExplanations().then((map) => {
      questionExplanations = map || {};
      renderFilteredQuestions(currentReviewFilter);
    });
  }
```

- [ ] **Step 5: Add the loader script to `results.html`**

In `results.html`, find the `<script src="js/page-results.js"></script>` line and add immediately BEFORE it:
```html
  <script src="js/load-explanations.js"></script>
```

- [ ] **Step 6: Add review-explanation styles to `results.html`**

In the `<style>` block of `results.html`, add (near the other `.review-*` rules):
```css
    .review-explanation {
      margin-top: 1rem;
      padding: 1rem 1.25rem;
      background: var(--cream-100);
      border-left: 3px solid var(--gold-500);
      border-radius: 8px;
    }
    .review-explanation-label {
      display: block;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--gold-text);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 0.35rem;
    }
    .review-explanation-text {
      margin: 0;
      font-size: 0.95rem;
      color: var(--text-primary);
      line-height: 1.55;
    }
```

- [ ] **Step 7: Run the test + inline-JS gate**

Run: `node --test tests/unit/results-render.test.js && node scripts/check-no-inline-js.js`
Expected: PASS; inline-JS gate prints no violations.

- [ ] **Step 8: Commit**

```bash
git add js/page-results.js results.html tests/unit/results-render.test.js
git commit -m "feat: show answer explanations in the results review (SP1 Phase A)"
```

## Task A4: Precache explanations in the service worker

**Files:**
- Modify: `service-worker.js`

- [ ] **Step 1: Add the two files to the precache list and bump the cache version**

In `service-worker.js`, change:
```js
const CACHE_VERSION = 'mission-asvab-v1';
```
to:
```js
const CACHE_VERSION = 'mission-asvab-v2';
```

In the `PRECACHE_URLS` array, under the `// Core JS` group, add:
```js
  '/js/load-explanations.js',
  '/js/explanations.js',
```

- [ ] **Step 2: Verify the worker still parses**

Run: `node -e "require('fs').readFileSync('service-worker.js','utf8'); new Function(require('fs').readFileSync('service-worker.js','utf8').replace(/self\./g,'({}).')); console.log('parse ok')"`
Expected: `parse ok` (syntax check; the worker isn't executed here).

- [ ] **Step 3: Commit**

```bash
git add service-worker.js
git commit -m "chore: precache explanations assets, bump SW cache to v2 (SP1 Phase A)"
```

## Task A5: Phase A full verification

- [ ] **Step 1: Run the whole suite + gates**

Run: `npm test && node scripts/validate-site.js && node scripts/check-no-inline-js.js`
Expected: all unit tests pass (79 = 76 prior + 3 new files' tests), `Validation passed`, no inline-JS violations.

- [ ] **Step 2: Manual smoke (CSP)** — serve locally and confirm the review still renders and no CSP console errors:

Run: `npx serve . -l 3000` then open `http://localhost:3000/results.html` after taking a test. Confirm review shows (explanation blocks absent until Phase C — expected).

---

# PHASE B — Tutor mode

*Depends on Phase A (uses the loader + explanation data). Shippable once content for at least the AFQT sections has landed, but the mode works with or without explanations.*

## Task B1: Add the `mode` column to `test_results`

**Files:**
- Migration only (Supabase project `rcspwkmrtukblvvdifer`).

- [ ] **Step 1: Confirm current schema (afqt_score already nullable)**

Run (MCP `execute_sql`):
```sql
select column_name, is_nullable from information_schema.columns
where table_schema='public' and table_name='test_results' and column_name in ('afqt_score','mode');
```
Expected: `afqt_score | YES`; no `mode` row yet.

- [ ] **Step 2: Apply the migration**

MCP `apply_migration`, name `add_mode_to_test_results`:
```sql
alter table public.test_results
  add column mode text not null default 'timed';

alter table public.test_results
  add constraint test_results_mode_check check (mode in ('timed','tutor'));
```

- [ ] **Step 3: Verify + confirm existing rows defaulted to 'timed'**

Run (MCP `execute_sql`):
```sql
select mode, count(*) from public.test_results group by mode;
```
Expected: all existing rows report `timed`.

- [ ] **Step 4: Verify column-level write grant covers `mode` for authenticated**

Run (MCP `execute_sql`):
```sql
select has_column_privilege('authenticated','public.test_results','mode','INSERT') as can_insert;
```
Expected: `can_insert | true` (test_results grants insert to own rows; `mode` is a normal column, not a locked-down one like on `profiles`). If false, `grant insert (mode) on public.test_results to authenticated;` and re-verify.

## Task B2: Engine detects tutor mode and skips the timer

**Files:**
- Modify: `js/quiz-engine.js`
- Test: `tests/unit/quiz-engine-tutor.test.js`

- [ ] **Step 1: Write the failing test**

`tests/unit/quiz-engine-tutor.test.js`:
```js
const { test } = require('node:test');
const assert = require('node:assert');
const { loadEngine, fakeDoc } = require('../helpers/engine.js');

function tutorSandbox(search) {
  return loadEngine({
    document: fakeDoc(),
    location: { search },
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  });
}

test('engine reads mode=tutor from the URL', () => {
  const sandbox = tutorSandbox('?mode=tutor&section=AR');
  const engine = new sandbox.QuizEngine();
  engine.loadTestConfig();
  assert.strictEqual(engine.mode, 'tutor');
});

test('engine defaults to timed mode with no mode param', () => {
  const sandbox = tutorSandbox('?section=AR');
  const engine = new sandbox.QuizEngine();
  engine.loadTestConfig();
  assert.strictEqual(engine.mode, 'timed');
});

test('startTimer is skipped in tutor mode', () => {
  const sandbox = tutorSandbox('?mode=tutor&section=AR');
  const engine = new sandbox.QuizEngine();
  engine.mode = 'tutor';
  let started = false;
  engine.startTimer = () => { started = true; };
  engine.maybeStartTimer();
  assert.strictEqual(started, false);
});

test('startTimer runs in timed mode', () => {
  const sandbox = tutorSandbox('?section=AR');
  const engine = new sandbox.QuizEngine();
  engine.mode = 'timed';
  let started = false;
  engine.startTimer = () => { started = true; };
  engine.maybeStartTimer();
  assert.strictEqual(started, true);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/unit/quiz-engine-tutor.test.js`
Expected: FAIL — `engine.mode` undefined, `maybeStartTimer` not a function.

- [ ] **Step 3: Add mode state + reads**

In `js/quiz-engine.js` constructor, after `this._isSubmitting = false;`, add:
```js
    // Tutor mode: untimed, instant feedback + explanation. Set in loadTestConfig().
    this.mode = 'timed';
    this.tutorRevealed = new Set(); // slot ids whose feedback has been shown
```

In `loadTestConfig()`, after the `const typeParam = urlParams.get('type');` line, add:
```js
    const modeParam = urlParams.get('mode');
```
and after the `const savedConfig = sessionStorage.getItem('testConfig');` line's `if/else` block that sets `this.testSections` (i.e. at the very end of `loadTestConfig`, before the closing `}`), add:
```js
    // Tutor mode comes from the URL param, falling back to the saved config.
    let cfgMode = null;
    if (savedConfig) { try { cfgMode = (JSON.parse(savedConfig) || {}).mode || null; } catch (_) {} }
    this.mode = (modeParam === 'tutor' || cfgMode === 'tutor') ? 'tutor' : 'timed';
```

Add a `maybeStartTimer()` method (place it right after `startTimer()`):
```js
  // Timed tests run the clock; tutor mode never does (no time pressure, no auto-submit).
  maybeStartTimer() {
    if (this.mode === 'tutor') return;
    this.startTimer();
  }
```

In `init()`, replace `this.startTimer();` with `this.maybeStartTimer();`.

Also in `init()`, after `this.updateSectionHeader();`, add:
```js
    if (this.mode === 'tutor') this.applyTutorChrome();
```
And add the `applyTutorChrome()` method (hides the timer, relabels the page) right after `maybeStartTimer()`:
```js
  // Hide timer UI and relabel for tutor mode. Uses optional chaining because
  // these elements may be absent in tests.
  applyTutorChrome() {
    const timer = document.querySelector && document.querySelector('.quiz-timer');
    if (timer) timer.style.display = 'none';
    const title = document.querySelector && document.querySelector('.quiz-title');
    if (title) title.textContent = 'Tutor Mode — Untimed Practice';
  }
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test tests/unit/quiz-engine-tutor.test.js`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add js/quiz-engine.js tests/unit/quiz-engine-tutor.test.js
git commit -m "feat: tutor mode detection + timer skip in quiz engine (SP1 Phase B)"
```

## Task B3: Lock answer + reveal feedback in tutor mode

**Files:**
- Modify: `js/quiz-engine.js`
- Test: `tests/unit/quiz-engine-tutor.test.js` (add cases)

- [ ] **Step 1: Write the failing tests**

Add to `tests/unit/quiz-engine-tutor.test.js`:
```js
test('selecting an answer in tutor mode reveals it and locks re-answers', () => {
  const sandbox = loadEngine({
    document: fakeDoc(),
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  });
  const engine = new sandbox.QuizEngine();
  engine.mode = 'tutor';
  engine.quizData = { questions: [{ id: 1, originalId: 'AR001', sectionCode: 'AR', correct: 2, difficulty: 3 }] };
  engine.answers = {};
  engine.currentQuestion = 0;
  let renders = 0;
  engine.renderQuestion = () => { renders++; };

  engine.selectAnswer(0); // wrong
  assert.strictEqual(engine.answers[1], 0, 'answer recorded');
  assert.ok(engine.tutorRevealed.has(1), 'slot marked revealed');

  engine.selectAnswer(2); // attempt to change after reveal — must be ignored
  assert.strictEqual(engine.answers[1], 0, 'answer stays locked after reveal');
});

test('timed mode still allows changing an answer', () => {
  const sandbox = loadEngine({
    document: fakeDoc(),
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  });
  const engine = new sandbox.QuizEngine();
  engine.mode = 'timed';
  engine.quizData = { questions: [{ id: 1, originalId: 'AR001', sectionCode: 'AR', correct: 2, difficulty: 3 }] };
  engine.answers = {};
  engine.currentQuestion = 0;
  engine.renderQuestion = () => {};
  engine.selectAnswer(0);
  engine.selectAnswer(3);
  assert.strictEqual(engine.answers[1], 3, 'timed answers remain changeable');
});
```

- [ ] **Step 2: Run to verify failure**

Run: `node --test tests/unit/quiz-engine-tutor.test.js`
Expected: FAIL — tutor lock not implemented (second selectAnswer changes the answer).

- [ ] **Step 3: Implement the lock in `selectAnswer`**

In `js/quiz-engine.js`, at the very top of `selectAnswer(index)` (before `const question = …`), add:
```js
    // Tutor mode: once feedback is revealed the answer is final (changing it
    // would be meaningless after seeing the key).
    if (this.mode === 'tutor') {
      const cur = this.quizData.questions[this.currentQuestion];
      if (cur && this.tutorRevealed.has(cur.id)) return;
    }
```

Then, at the END of `selectAnswer` (after `this.saveState();` and before `this.renderQuestion();`), add:
```js
    if (this.mode === 'tutor') {
      this.tutorRevealed.add(question.id);
    }
```

- [ ] **Step 4: Run to verify pass**

Run: `node --test tests/unit/quiz-engine-tutor.test.js`
Expected: PASS.

- [ ] **Step 5: Render the reveal in `renderQuestion` (options styling + explanation panel)**

In `js/quiz-engine.js` `renderQuestion()`, replace the answer-options `container.innerHTML = question.options.map(...)` block with a version that adds reveal classes in tutor mode:
```js
    const revealed = this.mode === 'tutor' && this.tutorRevealed.has(question.id);
    container.innerHTML = question.options.map((option, idx) => {
      const isSelected = this.answers[question.id] === idx;
      let revealClass = '';
      if (revealed) {
        if (idx === question.correct) revealClass = ' reveal-correct';
        else if (isSelected) revealClass = ' reveal-incorrect';
      }
      return `
        <div class="answer-option ${isSelected ? 'selected' : ''}${revealClass}" data-index="${idx}" role="radio" tabindex="0" aria-checked="${isSelected}" aria-label="Option ${letters[idx]}: ${option}. Press ${letters[idx]} to select.">
          <span class="answer-letter" aria-hidden="true">${letters[idx]}</span>
          <span class="answer-text">${option}</span>
          <span class="keyboard-hint" aria-hidden="true">Press ${letters[idx]}</span>
        </div>
      `;
    }).join('');
```

Then, right after that `container.innerHTML = …` assignment, add the feedback-panel update:
```js
    // Tutor feedback panel (present only on quiz.html; guarded for tests).
    const feedback = document.getElementById('tutorFeedback');
    if (feedback) {
      if (revealed) {
        const correct = this.answers[question.id] === question.correct;
        const explanation = (this.explanations && this.explanations[question.originalId]) || '';
        feedback.className = 'tutor-feedback ' + (correct ? 'is-correct' : 'is-incorrect');
        feedback.innerHTML = `
          <div class="tutor-verdict">${correct ? '✓ Correct' : '✗ Not quite'}</div>
          ${explanation ? `<p class="tutor-explanation">${explanation}</p>` : ''}
        `;
        feedback.hidden = false;
      } else {
        feedback.hidden = true;
        feedback.innerHTML = '';
      }
    }
```

- [ ] **Step 6: Load explanations once when tutor mode starts**

In `js/quiz-engine.js` `init()`, replace the line you added earlier:
```js
    if (this.mode === 'tutor') this.applyTutorChrome();
```
with:
```js
    if (this.mode === 'tutor') {
      this.applyTutorChrome();
      this.explanations = {};
      if (typeof loadExplanations === 'function') {
        loadExplanations().then((map) => {
          this.explanations = map || {};
          this.renderQuestion(); // refresh if the user is already on a revealed slot
        });
      }
    }
```

- [ ] **Step 7: Run the tutor tests + inline-JS gate**

Run: `node --test tests/unit/quiz-engine-tutor.test.js && node scripts/check-no-inline-js.js`
Expected: PASS; no inline-JS violations.

- [ ] **Step 8: Commit**

```bash
git add js/quiz-engine.js tests/unit/quiz-engine-tutor.test.js
git commit -m "feat: tutor answer-lock, reveal styling + explanation panel (SP1 Phase B)"
```

## Task B4: Tutor navigator colors + submit button label

**Files:**
- Modify: `js/quiz-engine.js`

- [ ] **Step 1: Tutor navigator shows correct/incorrect instead of answered**

In `js/quiz-engine.js` `updateNavigator()`, replace the body of the `dots.forEach(...)` callback with:
```js
    dots.forEach((dot, idx) => {
      const question = this.quizData.questions[idx];
      dot.classList.remove('current', 'answered', 'flagged', 'nav-correct', 'nav-incorrect');
      if (idx === this.currentQuestion) dot.classList.add('current');
      if (this.mode === 'tutor' && this.tutorRevealed.has(question.id)) {
        dot.classList.add(this.answers[question.id] === question.correct ? 'nav-correct' : 'nav-incorrect');
      } else if (this.answers[question.id] !== undefined) {
        dot.classList.add('answered');
      }
      if (this.flagged.has(question.id)) dot.classList.add('flagged');
    });
```

Apply the same correct/incorrect branch to `renderNavigator()` (the initial build): replace its `if (this.answers[q.id] !== undefined) classes.push('answered');` line with:
```js
      if (this.mode === 'tutor' && this.tutorRevealed.has(q.id)) {
        classes.push(this.answers[q.id] === q.correct ? 'nav-correct' : 'nav-incorrect');
      } else if (this.answers[q.id] !== undefined) {
        classes.push('answered');
      }
```

- [ ] **Step 2: Verify the full engine suite still passes**

Run: `node --test tests/unit/quiz-engine-*.test.js`
Expected: PASS (existing engine tests + tutor tests; timed behavior unchanged because the new branches are gated on `this.mode === 'tutor'`).

- [ ] **Step 3: Commit**

```bash
git add js/quiz-engine.js
git commit -m "feat: tutor navigator correct/incorrect dots (SP1 Phase B)"
```

## Task B5: Record tutor sessions (null AFQT, mode flag)

**Files:**
- Modify: `js/quiz-engine.js`
- Test: `tests/unit/quiz-engine-tutor.test.js` (add cases)

- [ ] **Step 1: Write the failing tests**

Add to `tests/unit/quiz-engine-tutor.test.js`:
```js
test('tutor submit stores mode=tutor with a null AFQT', () => {
  const stored = {};
  const sandbox = loadEngine({
    document: fakeDoc(),
    localStorage: { setItem: (k, v) => { stored[k] = v; }, removeItem() {} },
    sessionStorage: { removeItem() {}, setItem() {} },
    MissionASVABConfig: { getTestTypeFromSections: () => 'custom' },
    MissionASVABScoring: { calculateAFQTEstimate: () => 62, calculateLineScores: () => ({}) },
  });
  const engine = new sandbox.QuizEngine();
  engine.mode = 'tutor';
  engine.testSections = ['AR'];
  engine.quizData = {
    section: 'Arithmetic Reasoning', sectionCode: 'AR', timeLimit: 0,
    questions: [{ id: 1, originalId: 'AR001', sectionCode: 'AR', sectionName: 'Arithmetic Reasoning', text: 'q', options: ['a','b','c','d'], correct: 1 }],
  };
  engine.answers = { 1: 1 };
  engine.timeRemaining = 0;
  engine.saveResultsToSupabase = async () => ({ skipped: true });
  engine.materializeSlot = () => {};

  return engine.submitQuiz().then(() => {
    const results = JSON.parse(stored.quizResults);
    assert.strictEqual(results.mode, 'tutor');
    assert.strictEqual(results.afqt, null, 'tutor sessions carry no AFQT');
  });
});

test('timed submit still computes an AFQT', () => {
  const stored = {};
  const sandbox = loadEngine({
    document: fakeDoc(),
    localStorage: { setItem: (k, v) => { stored[k] = v; }, removeItem() {} },
    sessionStorage: { removeItem() {}, setItem() {} },
    MissionASVABConfig: { getTestTypeFromSections: () => 'afqt' },
    MissionASVABScoring: { calculateAFQTEstimate: () => 62, calculateLineScores: () => ({}) },
  });
  const engine = new sandbox.QuizEngine();
  engine.mode = 'timed';
  engine.testSections = ['AR'];
  engine.quizData = { section: 'AR', sectionCode: 'AR', timeLimit: 100,
    questions: [{ id: 1, originalId: 'AR001', sectionCode: 'AR', sectionName: 'AR', text: 'q', options: ['a','b','c','d'], correct: 1 }] };
  engine.answers = { 1: 1 };
  engine.timeRemaining = 40;
  engine.saveResultsToSupabase = async () => ({ skipped: true });
  engine.materializeSlot = () => {};

  return engine.submitQuiz().then(() => {
    const results = JSON.parse(stored.quizResults);
    assert.strictEqual(results.mode, 'timed');
    assert.strictEqual(results.afqt, 62);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `node --test tests/unit/quiz-engine-tutor.test.js`
Expected: FAIL — `results.mode` undefined; tutor AFQT is 62 not null.

- [ ] **Step 3: Implement in `submitQuiz`**

In `js/quiz-engine.js` `submitQuiz()`, replace:
```js
    // Calculate AFQT estimate if applicable
    let afqtEstimate = null;
    afqtEstimate = MissionASVABScoring.calculateAFQTEstimate(sectionResults);
```
with:
```js
    // Tutor sessions are untimed practice: no AFQT (it would overstate readiness).
    const afqtEstimate = this.mode === 'tutor'
      ? null
      : MissionASVABScoring.calculateAFQTEstimate(sectionResults);
```

In the `quizResults` object literal, add a `mode` field (after the `sectionCode:` line):
```js
      mode: this.mode,
```

- [ ] **Step 4: Add `mode` to the Supabase payload (null line scores for tutor)**

In `saveResultsToSupabase(quizResults)`, replace:
```js
    const lineScores = MissionASVABScoring.calculateLineScores(quizResults.sectionResults);
```
with:
```js
    const lineScores = quizResults.mode === 'tutor'
      ? null
      : MissionASVABScoring.calculateLineScores(quizResults.sectionResults);
```

And in the `payload` object literal, add after `test_type: quizResults.testType || 'afqt',`:
```js
      mode: quizResults.mode || 'timed',
```

- [ ] **Step 5: Run tutor tests + full engine suite**

Run: `node --test tests/unit/quiz-engine-*.test.js`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add js/quiz-engine.js tests/unit/quiz-engine-tutor.test.js
git commit -m "feat: record tutor sessions with mode flag + null AFQT/line-scores (SP1 Phase B)"
```

## Task B6: Tutor-aware results page copy

**Files:**
- Modify: `js/page-results.js`

- [ ] **Step 1: Branch the score-card copy on tutor mode**

In `js/page-results.js` `loadResults()`, after the line `const hasAFQT = typeof results.afqt === 'number';`, add:
```js
  const isTutor = results.mode === 'tutor';
```

Replace the `else` branch of the AFQT-label block:
```js
  } else {
    document.getElementById('afqtLabel').textContent = 'Practice Score';
    document.getElementById('afqtPercentile').textContent = `${results.score}% Correct — single-section practice, not an AFQT estimate`;
  }
```
with:
```js
  } else if (isTutor) {
    document.getElementById('afqtLabel').textContent = 'Tutor Practice';
    document.getElementById('afqtPercentile').textContent = `${results.score}% correct — untimed practice with explanations`;
  } else {
    document.getElementById('afqtLabel').textContent = 'Practice Score';
    document.getElementById('afqtPercentile').textContent = `${results.score}% Correct — single-section practice, not an AFQT estimate`;
  }
```

And guard the eligibility messaging: replace the top of the message block:
```js
  if (!hasAFQT) {
```
with:
```js
  if (isTutor) {
    message = 'Practice Complete';
    description = 'Review each question below with its explanation. Weak areas from this session feed your study plan. Take a timed test when you want an AFQT estimate.';
  } else if (!hasAFQT) {
```

(The `displayScore`/`afqtScore` element already shows `results.score` when `afqt` is null — correct for tutor.)

Line scores are already gated on `results.testType === 'full'`; tutor custom sessions are never `'full'`, so they render no line scores. No change needed there.

- [ ] **Step 2: Verify the review still renders (unchanged path) + inline-JS gate**

Run: `node --test tests/unit/results-render.test.js && node scripts/check-no-inline-js.js`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add js/page-results.js
git commit -m "feat: tutor-session summary copy on results page (SP1 Phase B)"
```

## Task B7: Dashboard — timed-only scores, tutor in weak-areas + history

**Files:**
- Modify: `js/dashboard.js`
- Test: `tests/unit/dashboard-mode-filter.test.js`

- [ ] **Step 1: Write the failing test (extract real functions)**

`tests/unit/dashboard-mode-filter.test.js`:
```js
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

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

test('timedOnly keeps timed + legacy(undefined) rows, drops tutor rows', () => {
  const sandbox = { console };
  vm.createContext(sandbox);
  vm.runInContext(extractFn(src, 'timedOnly') + '\nthis.__fn = timedOnly;', sandbox);
  const rows = [
    { id: 'a', mode: 'timed' },
    { id: 'b', mode: 'tutor' },
    { id: 'c' }, // legacy row, no mode → treated as timed
  ];
  const out = sandbox.__fn(rows).map((r) => r.id);
  assert.deepStrictEqual(out, ['a', 'c']);
});
```

- [ ] **Step 2: Run to verify failure**

Run: `node --test tests/unit/dashboard-mode-filter.test.js`
Expected: FAIL — `timedOnly` not found.

- [ ] **Step 3: Add the `timedOnly` helper and split usage in `loadDashboard`**

In `js/dashboard.js`, add this helper near the top (after `let _currentSession = null;`):
```js
// Score/AFQT views are truthful timed-test predictors, so they exclude untimed
// tutor sessions. Legacy rows (no mode) predate tutor mode → treat as timed.
function timedOnly(results) {
  return (results || []).filter((r) => (r && r.mode ? r.mode : 'timed') === 'timed');
}
```

In `loadDashboard()`, replace the render block:
```js
  hideWelcomeState();
  renderScoreSummary(results);
  renderProgressChart(results);
  renderSectionBreakdown(results);
  renderFocusPanel(results);
  renderTestHistory(results);
```
with:
```js
  hideWelcomeState();
  const timed = timedOnly(results);
  // Timed-only: AFQT score card, trend chart, section cards.
  renderScoreSummary(timed);
  renderProgressChart(timed);
  renderSectionBreakdown(timed);
  // All results (incl. tutor practice): weak-area focus + full history.
  renderFocusPanel(results);
  renderTestHistory(results);
```

- [ ] **Step 4: Guard the timed-only renderers against an all-tutor account**

`renderScoreSummary`, `renderProgressChart`, and `renderSectionBreakdown` index `results[0]`. If a user has only tutor sessions, `timed` is empty. Add an early guard to each.

In `renderScoreSummary(results)`, add as the first lines:
```js
  if (!results.length) {
    document.getElementById('latestAfqt').textContent = '—';
    document.getElementById('latestDate').textContent = 'Take a timed test for your AFQT';
    return;
  }
```

In `renderProgressChart(results)`, the existing `afqtResults.length < 2` branch already handles the empty case (renders the "take another test" message) — no change, but confirm it runs before any `results[0]` access (it does).

In `renderSectionBreakdown(results)`, add as the first lines:
```js
  if (!results.length) {
    const c = document.getElementById('sectionCards');
    const w = c && c.closest('.section-card-container');
    if (w) w.style.display = 'none';
    return;
  }
```

- [ ] **Step 5: Label tutor rows "Practice" in history**

In `renderTestHistory(results)`, inside the `page.map(...)`, replace:
```js
        <td>${r.test_type === 'full' ? 'Full Assessment' : 'AFQT'}</td>
```
with:
```js
        <td>${(r.mode === 'tutor') ? 'Practice' : (r.test_type === 'full' ? 'Full Assessment' : 'AFQT')}</td>
```

- [ ] **Step 6: Run the test + full suite**

Run: `node --test tests/unit/dashboard-mode-filter.test.js && npm test`
Expected: PASS. (`weak-areas.test.js` already covers aggregation over `question_results`; tutor rows carry `question_results`, so no weak-areas change is needed — `renderFocusPanel(results)` passing all rows is the only requirement.)

- [ ] **Step 7: Commit**

```bash
git add js/dashboard.js tests/unit/dashboard-mode-filter.test.js
git commit -m "feat: dashboard shows timed-only AFQT, tutor feeds weak-areas + history (SP1 Phase B)"
```

## Task B8: Entry points — select-test toggle, test-intro forwarding

**Files:**
- Modify: `select-test.html`, `js/page-select-test.js`
- Modify: `test-intro.html`, `js/page-test-intro.js`
- Modify: `js/dashboard.js` (weak-area practice defaults to tutor)

- [ ] **Step 1: Add the tutor toggle to `select-test.html`**

In `select-test.html`, immediately BEFORE the `<button … id="startBtn">` (the start button), add:
```html
        <label class="tutor-toggle">
          <input type="checkbox" id="tutorToggle">
          <span>Untimed tutor mode — instant feedback &amp; explanations after each question</span>
        </label>
```

Add styling in the page's `<style>` block:
```css
    .tutor-toggle {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      margin: 0 0 1.25rem;
      font-size: 0.9rem;
      color: var(--text-secondary);
      cursor: pointer;
    }
    .tutor-toggle input { width: 18px; height: 18px; cursor: pointer; }
```

- [ ] **Step 2: Persist the mode in `page-select-test.js`**

In `js/page-select-test.js`, inside the `startBtn.addEventListener('click', …)` handler, replace:
```js
    const sections = MissionASVABConfig.getSectionsForType(selectedType);
    sessionStorage.setItem('testConfig', JSON.stringify({ sections: sections }));
```
with:
```js
    const sections = MissionASVABConfig.getSectionsForType(selectedType);
    const tutorEl = document.getElementById('tutorToggle');
    const mode = tutorEl && tutorEl.checked ? 'tutor' : 'timed';
    sessionStorage.setItem('testConfig', JSON.stringify({ sections: sections, mode: mode }));
```

- [ ] **Step 3: Forward the mode from `test-intro.html`**

In `js/page-test-intro.js`, after the line `const sections = testConfig.sections || MissionASVABConfig.getSectionsForType(testType);`, add:
```js
  const mode = testConfig.mode === 'tutor' ? 'tutor' : 'timed';
```

Replace the start-button navigation:
```js
  startBtn.addEventListener('click', () => {
    if (!startBtn.disabled) {
      window.location.href = 'quiz.html';
    }
  });
```
with:
```js
  startBtn.addEventListener('click', () => {
    if (!startBtn.disabled) {
      window.location.href = mode === 'tutor' ? 'quiz.html?mode=tutor' : 'quiz.html';
    }
  });
```

- [ ] **Step 4: Adapt test-intro copy for tutor mode**

In `js/page-test-intro.js`, at the end of `loadTestInfo()`, add:
```js
    if (mode === 'tutor') {
      const timeEl = document.getElementById('timeLimit');
      if (timeEl && timeEl.parentElement) timeEl.parentElement.style.display = 'none';
      const badge = document.getElementById('testBadge');
      if (badge) badge.textContent = 'Tutor Mode — Untimed';
    }
```

- [ ] **Step 5: Default dashboard weak-area practice to tutor mode**

In `js/dashboard.js` `startWeakAreaPractice(sections)`, replace:
```js
  sessionStorage.setItem('testConfig', JSON.stringify({ sections: codes }));
```
with:
```js
  sessionStorage.setItem('testConfig', JSON.stringify({ sections: codes, mode: 'tutor' }));
```

- [ ] **Step 6: Run the inline-JS gate + full suite**

Run: `node scripts/check-no-inline-js.js && npm test`
Expected: no inline-JS violations; all tests pass.

- [ ] **Step 7: Commit**

```bash
git add select-test.html js/page-select-test.js test-intro.html js/page-test-intro.js js/dashboard.js
git commit -m "feat: tutor-mode entry points (select-test toggle, weak-area practice) (SP1 Phase B)"
```

## Task B9: Add the tutor feedback container + CSS to `quiz.html`

**Files:**
- Modify: `quiz.html`

- [ ] **Step 1: Add the feedback container to the question card**

In `quiz.html`, inside `<div class="question-card">`, immediately AFTER `<p class="answers-hint">…</p>`, add:
```html
      <div id="tutorFeedback" class="tutor-feedback" role="status" aria-live="polite" hidden></div>
```

- [ ] **Step 2: Add the loader script**

In `quiz.html`, add BEFORE `<script src="js/quiz-engine.js"></script>`:
```html
  <script src="js/load-explanations.js"></script>
```

- [ ] **Step 3: Add tutor CSS**

In the `quiz.html` `<style>` block, add:
```css
    .tutor-feedback {
      margin-top: 1.75rem;
      padding: 1.25rem 1.5rem;
      border-radius: 12px;
      border-left: 4px solid var(--navy-700);
      background: var(--cream-100);
    }
    .tutor-feedback.is-correct { border-left-color: #27ae60; }
    .tutor-feedback.is-incorrect { border-left-color: #c0392b; }
    .tutor-verdict { font-weight: 600; margin-bottom: 0.4rem; color: var(--navy-900); }
    .tutor-feedback.is-correct .tutor-verdict { color: #1e8449; }
    .tutor-feedback.is-incorrect .tutor-verdict { color: #a93226; }
    .tutor-explanation { margin: 0; line-height: 1.6; color: var(--text-primary); }

    .answer-option.reveal-correct {
      border-color: #27ae60;
      background: #eafaf1;
    }
    .answer-option.reveal-incorrect {
      border-color: #c0392b;
      background: #fdecea;
    }
    .nav-dot.nav-correct { background: #27ae60; color: var(--white); }
    .nav-dot.nav-incorrect { background: #c0392b; color: var(--white); }
```

- [ ] **Step 4: Inline-JS gate**

Run: `node scripts/check-no-inline-js.js`
Expected: no violations.

- [ ] **Step 5: Commit**

```bash
git add quiz.html
git commit -m "feat: tutor feedback panel + reveal styles on quiz page (SP1 Phase B)"
```

## Task B10: Phase B verification + manual browser pass

- [ ] **Step 1: Full suite + gates**

Run: `npm test && node scripts/validate-site.js && node scripts/check-no-inline-js.js`
Expected: all pass.

- [ ] **Step 2: Manual click-through (strict CSP, both modes)**

Run: `npx serve . -l 3000`. In a browser with the console open:
1. `select-test.html` → check "Untimed tutor mode" → Start → verify no timer, answer locks + feedback/reveal appears, Next advances, navigator dots turn green/red.
2. Submit → `results.html` shows "Tutor Practice"/"Practice Complete", `% correct`, no AFQT percentile, no line scores, review shows explanations (once Phase C content exists).
3. Take a normal timed test → verify timer runs, no reveal-on-answer, results show AFQT as before.
4. Log in, open `dashboard.html` → tutor session appears in history as "Practice", AFQT chart/score-card unchanged by it, focus panel reflects tutor mistakes.
5. Confirm **zero** CSP violations in the console on quiz/results/dashboard/select-test.

- [ ] **Step 3: (If not merging to main yet) push the branch / open PR per the finishing-a-development-branch skill.**

---

# PHASE C — Explanation content (per-section batches)

*Not TDD — this is bulk first-party content authoring gated by the Task A2 contract. Executed as batched subagent runs. AFQT sections (WK, PC, AR, MK) first, then GS, AS, MC, EI.*

**Per-section procedure (repeat for each of the 8 section codes):**

- [ ] **Step 1: Extract the section's questions** — from `js/quiz-data.js`, the array under `asvabData.questions.<CODE>`: each `{id, text, options, correct, difficulty}`.

- [ ] **Step 2: Adversarial answer-key verification (per question), THEN author.**
  For each question, an independent pass must justify the keyed correct option (`options[correct]`) from first principles BEFORE writing the explanation:
  - If the key is justifiable → write a 2–4 sentence explanation (40–600 chars). AR/MK: show the worked steps. WK: define the word + a usage/memory hook. PC: cite what in the passage justifies the answer. GS/AS/MC/EI: state the fact/principle and why it applies. Where one distractor is a common trap, one sentence may name it.
  - If the key is NOT justifiable → **do not** invent an explanation. Record the question id + the discrepancy in a running list `docs/superpowers/notes/answer-key-review.md` and skip it (leave it out of `explanations.js` for now). These are surfaced to the owner as suspected answer-key errors.

- [ ] **Step 3: Add the batch to `js/explanations.js`** — insert `"<id>": "<explanation>",` entries into the `QUIZ_EXPLANATIONS` map.

- [ ] **Step 4: Flip the gate for that section** — add the section code to `SECTIONS_WITH_EXPLANATIONS` in `scripts/validate-site.js` (skipped questions from Step 2 will make the coverage check fail — so only add the code once every question either has an explanation or is resolved with the owner; until then keep the code out of the allowlist and the orphan/length checks still protect what's written).

- [ ] **Step 5: Validate + commit the batch**

Run: `node scripts/validate-site.js && node --test tests/unit/explanations-contract.test.js`
Expected: `Validation passed`; contract green.
```bash
git add js/explanations.js scripts/validate-site.js docs/superpowers/notes/answer-key-review.md
git commit -m "content: <CODE> answer explanations (SP1 Phase C)"
```

- [ ] **Step 6: When all 8 sections are complete** — remove the `SECTIONS_WITH_EXPLANATIONS` allowlist gate in favor of full-bank enforcement:
  replace the `for (const code of SECTIONS_WITH_EXPLANATIONS)` loop with a loop over every question id, asserting each has an explanation. Commit.

---

## Self-Review (completed during authoring)

**Spec coverage check** — every spec section maps to a task:
- Spec §1 (explanations.js, lazy load, SW precache, content style, authoring) → A1, A4, C.
- Spec §2 (build gates: coverage/orphan/length, node:test mirror, staged) → A2.
- Spec §3 (tutor mode: `?mode=tutor`, no timer, lock→feedback→Next, keyboard, CAT unchanged, navigator colors, CSP, degradation) → B2, B3, B4, B9.
- Spec §4 (recording: `mode` migration, null AFQT, weak-areas all rows, dashboard timed-only + "Practice" label, tutor results page, guests) → B1, B5, B6, B7.
- Spec §5 (results review upgrade all modes, lazy load, ships first, missing→no render) → A3.
- Spec §6 (entry points: select-test toggle, weak-area default tutor, test-intro copy) → B8.
- Error-handling table → A1 (loader→{}), A3 (missing id→no block), B5/B1 (offline queue unchanged), C (key errors flagged).
- Testing section → A1/A2/A3/B2/B3/B5/B7 tests + B10 manual.

**Consistency notes:**
- Explanation lookups key on `question.originalId` (bank id like `"AR001"`), NOT the integer slot `id` — the review and the engine both carry `originalId`. Verified in `submitQuiz` (`originalId: q.originalId`) and `materializeSlot` (`slot.originalId = question.id`).
- `afqt_score` is already nullable in production (verified via information_schema 2026-07-02) — the migration only adds `mode`. Spec risk about relaxing the constraint is moot.
- Method/field names used consistently: `this.mode`, `this.tutorRevealed` (Set of slot ids), `this.explanations`, `maybeStartTimer()`, `applyTutorChrome()`, `timedOnly()`, `questionExplanations`/`currentReviewFilter` (results), `loadExplanations()`.

**Out-of-scope observation (do not fix here):** the existing report-a-question feature stores `question_id: q.id` (the integer slot id) rather than `originalId`, so reports don't reference the bank question. Pre-existing; flag to owner separately.
