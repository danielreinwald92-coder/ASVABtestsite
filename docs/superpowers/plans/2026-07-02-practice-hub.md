# Practice Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let users start practice on any section or custom subset from a redesigned select-test hub, time each section separately in timed multi-section tests (auto-advancing on expiry), avoid re-showing recently-seen questions across retakes, and only show an AFQT estimate when all four AFQT sections are present.

**Architecture:** Three loosely-coupled pieces. (1) A tiny `js/recent-seen.js` localStorage module the engine consults when materializing CAT slots. (2) A per-section timer + section-scoped navigation model inside `js/quiz-engine.js` (timed mode only; tutor mode untouched). (3) A section-checklist UI in `select-test.html`/`js/page-select-test.js`. An AFQT-validity gate is added at the engine's scoring call site so `scoring.js` stays untouched.

**Tech Stack:** Vanilla classic-script JS (no bundler), `node:test`+jsdom (`npm test`), `scripts/validate-site.js` build gate, `scripts/check-no-inline-js.js` CSP gate. Question ids are strings like `"AR001"` (bank id = `question.originalId` on a materialized slot).

**Source spec:** `docs/superpowers/specs/2026-07-02-practice-hub-design.md`

---

## File Structure

**Create:**
- `js/recent-seen.js` — `window.MissionASVABRecentSeen` = `{ getRecent(code), record(code, ids) }`, localStorage-backed, capped, fail-safe.
- `tests/unit/recent-seen.test.js`
- `tests/unit/quiz-engine-sections.test.js` — per-section timer + navigation.
- `tests/unit/quiz-engine-afqt-gate.test.js` — AFQT-only-when-all-4.
- `tests/unit/page-select-test-hub.test.js` — hub selection → testConfig mapping (pure helpers).

**Modify:**
- `js/quiz-engine.js` — AFQT gate; recent-seen exclusion + recording; section-range model; per-section timer; section-scoped navigation; save/resume fields + schema-versioned legacy discard.
- `quiz.html` — include `js/recent-seen.js`; no markup change required (existing `.quiz-section` + `#timerDisplay` reused).
- `select-test.html` — interactive section checklist replacing the static info boxes.
- `js/page-select-test.js` — selection state → `testConfig`/`testType`; pure helpers exported for tests.
- `js/page-test-intro.js` — label custom tests correctly.
- `service-worker.js` — precache `js/recent-seen.js`; bump `CACHE_VERSION`.

---

# PHASE 1 — Isolated units (scoring gate + recent-seen)

## Task 1: AFQT estimate only when all four AFQT sections are present

**Files:**
- Modify: `js/quiz-engine.js` (`submitQuiz`)
- Test: `tests/unit/quiz-engine-afqt-gate.test.js`

- [ ] **Step 1: Write the failing test**

`tests/unit/quiz-engine-afqt-gate.test.js`:
```js
const { test } = require('node:test');
const assert = require('node:assert');
const { loadEngine, fakeDoc } = require('../helpers/engine.js');

function engineFor(sections) {
  const stored = {};
  const sandbox = loadEngine({
    document: fakeDoc(),
    window: { location: { href: '' } },
    localStorage: { setItem: (k, v) => { stored[k] = v; }, removeItem() {} },
    sessionStorage: { removeItem() {}, setItem() {} },
    MissionASVABConfig: { AFQT_SECTIONS: ['AR', 'WK', 'PC', 'MK'], getTestTypeFromSections: () => 'custom' },
    MissionASVABScoring: { calculateAFQTEstimate: () => 55, calculateLineScores: () => null },
  });
  const engine = new sandbox.QuizEngine();
  engine.mode = 'timed';
  engine.testSections = sections;
  engine.quizData = {
    section: 'X', sectionCode: sections.join(','), timeLimit: 100,
    questions: sections.map((s, i) => ({ id: i + 1, originalId: s + '001', sectionCode: s, sectionName: s, text: 'q', options: ['a', 'b', 'c', 'd'], correct: 0 })),
  };
  engine.answers = {};
  engine.quizData.questions.forEach(q => { engine.answers[q.id] = 0; });
  engine.timeRemaining = 40;
  engine.saveResultsToSupabase = async () => ({ skipped: true });
  engine.materializeSlot = () => {};
  return { engine, stored };
}

test('AFQT is null for a custom subset missing an AFQT section', () => {
  const { engine, stored } = engineFor(['AR', 'WK', 'PC']); // missing MK
  return engine.submitQuiz().then(() => {
    assert.strictEqual(JSON.parse(stored.quizResults).afqt, null);
  });
});

test('AFQT is computed when all four AFQT sections are present', () => {
  const { engine, stored } = engineFor(['AR', 'WK', 'PC', 'MK']);
  return engine.submitQuiz().then(() => {
    assert.strictEqual(JSON.parse(stored.quizResults).afqt, 55);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `node --test tests/unit/quiz-engine-afqt-gate.test.js`
Expected: FAIL — the 3-section case currently returns 55, not null.

- [ ] **Step 3: Implement the gate**

In `js/quiz-engine.js` `submitQuiz()`, replace the SP1 block:
```js
    // Tutor sessions are untimed practice: no AFQT (it would overstate readiness).
    const afqtEstimate = this.mode === 'tutor'
      ? null
      : MissionASVABScoring.calculateAFQTEstimate(sectionResults);
```
with:
```js
    // AFQT is only valid with all four AFQT sections. Tutor sessions never score.
    const AFQT = (MissionASVABConfig.AFQT_SECTIONS) || ['AR', 'WK', 'PC', 'MK'];
    const includesAllAFQT = AFQT.every((s) => this.testSections.includes(s));
    const afqtEstimate = (this.mode === 'tutor' || !includesAllAFQT)
      ? null
      : MissionASVABScoring.calculateAFQTEstimate(sectionResults);
```

- [ ] **Step 4: Run to verify it passes**

Run: `node --test tests/unit/quiz-engine-afqt-gate.test.js`
Expected: PASS (2 tests).

- [ ] **Step 5: Run the full engine suite (no regressions)**

Run: `node --test tests/unit/quiz-engine-*.test.js`
Expected: PASS — the SP1 tutor submit test still passes (tutor path still yields null); the timed submit tests use the AFQT four.

- [ ] **Step 6: Commit**

```bash
git add js/quiz-engine.js tests/unit/quiz-engine-afqt-gate.test.js
git commit -m "feat: AFQT estimate only when all four AFQT sections present (SP2)"
```

## Task 2: `recent-seen.js` module

**Files:**
- Create: `js/recent-seen.js`
- Test: `tests/unit/recent-seen.test.js`

- [ ] **Step 1: Write the failing test**

`tests/unit/recent-seen.test.js`:
```js
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..', '..');

function load(localStoreThrows = false) {
  const store = {};
  const localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { if (localStoreThrows) throw new Error('quota'); store[k] = String(v); },
  };
  const sandbox = {
    console, localStorage,
    // Minimal asvabData so cap = poolSize - questionsPerTest is computable.
    asvabData: {
      questions: { AS: Array.from({ length: 25 }, (_, i) => ({ id: 'AS' + i })) },
      sections: { AS: { questionsPerTest: 10 } },
    },
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(root, 'js/recent-seen.js'), 'utf8'), sandbox);
  return { api: sandbox.MissionASVABRecentSeen, store };
}

test('record then getRecent returns stored ids (most-recent last)', () => {
  const { api } = load();
  api.record('AS', ['AS1', 'AS2']);
  api.record('AS', ['AS3']);
  assert.deepStrictEqual(api.getRecent('AS'), ['AS1', 'AS2', 'AS3']);
});

test('dedupes, keeping the most recent occurrence', () => {
  const { api } = load();
  api.record('AS', ['AS1', 'AS2']);
  api.record('AS', ['AS1']); // AS1 seen again → moves to the end, no dupe
  assert.deepStrictEqual(api.getRecent('AS'), ['AS2', 'AS1']);
});

test('caps stored ids at poolSize - questionsPerTest (25 - 10 = 15)', () => {
  const { api } = load();
  const ids = Array.from({ length: 30 }, (_, i) => 'AS' + i);
  api.record('AS', ids);
  const kept = api.getRecent('AS');
  assert.strictEqual(kept.length, 15, 'must cap at 15');
  assert.strictEqual(kept[kept.length - 1], 'AS29', 'keeps the newest');
  assert.strictEqual(kept[0], 'AS15', 'drops the oldest');
});

test('getRecent is [] for an unknown section', () => {
  const { api } = load();
  assert.deepStrictEqual(api.getRecent('WK'), []);
});

test('never throws when localStorage.setItem throws (quota)', () => {
  const { api } = load(true);
  assert.doesNotThrow(() => api.record('AS', ['AS1']));
  assert.deepStrictEqual(api.getRecent('AS'), []); // nothing persisted, but no crash
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `node --test tests/unit/recent-seen.test.js`
Expected: FAIL — `js/recent-seen.js` does not exist.

- [ ] **Step 3: Create the module**

`js/recent-seen.js`:
```js
// Cross-retake repeat avoidance (SP2). Tracks recently-shown bank question ids
// per section in localStorage so new tests can skip them. Capped so the exclusion
// set can never make a section unfillable; fully fail-safe (any storage error
// degrades to a no-op → repeats allowed, never a crash). On-device only.
(function (root) {
  const KEY = 'recentSeen:v1';

  function readAll() {
    try {
      const raw = root.localStorage.getItem(KEY);
      const obj = raw ? JSON.parse(raw) : {};
      return obj && typeof obj === 'object' ? obj : {};
    } catch (_) { return {}; }
  }
  function writeAll(obj) {
    try { root.localStorage.setItem(KEY, JSON.stringify(obj)); } catch (_) {}
  }
  function poolSize(code) {
    try { return (root.asvabData.questions[code] || []).length; } catch (_) { return 0; }
  }
  function perTest(code) {
    try { return (root.asvabData.sections[code].questionsPerTest) || 0; } catch (_) { return 0; }
  }
  // Leave at least questionsPerTest unseen so a test can always be built.
  function cap(code) {
    const c = poolSize(code) - perTest(code);
    return c > 0 ? c : 0;
  }

  function getRecent(code) {
    const all = readAll();
    return Array.isArray(all[code]) ? all[code].slice() : [];
  }

  function record(code, ids) {
    if (!code || !Array.isArray(ids) || ids.length === 0) return;
    const all = readAll();
    const merged = (Array.isArray(all[code]) ? all[code] : []).concat(ids);
    // Dedupe keeping most-recent occurrence, preserving order (most-recent last).
    const seen = new Set();
    const deduped = [];
    for (let i = merged.length - 1; i >= 0; i--) {
      if (!seen.has(merged[i])) { seen.add(merged[i]); deduped.unshift(merged[i]); }
    }
    const c = cap(code);
    all[code] = c > 0 ? deduped.slice(Math.max(0, deduped.length - c)) : [];
    writeAll(all);
  }

  const api = { getRecent, record };
  root.MissionASVABRecentSeen = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : this);
```

- [ ] **Step 4: Run to verify it passes**

Run: `node --test tests/unit/recent-seen.test.js`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add js/recent-seen.js tests/unit/recent-seen.test.js
git commit -m "feat: recent-seen localStorage module for repeat avoidance (SP2)"
```

## Task 3: Wire recent-seen into the engine (exclude + record) and load it

**Files:**
- Modify: `js/quiz-engine.js` (`materializeSlot`, `submitQuiz`)
- Modify: `quiz.html`, `service-worker.js`
- Test: `tests/unit/quiz-engine-sections.test.js` (recent-seen cases; file created here, extended in Phase 2)

- [ ] **Step 1: Write the failing test**

Create `tests/unit/quiz-engine-sections.test.js`:
```js
const { test } = require('node:test');
const assert = require('node:assert');
const { loadEngine, fakeDoc } = require('../helpers/engine.js');

// A fake QuizManager whose adaptive selector honors the usedIds set, so we can
// assert recent-seen ids are excluded.
function fakeQuizManager(poolIds) {
  return {
    getSectionInfo: (code) => ({ name: code, timeLimit: 600, questionsPerTest: poolIds.length }),
    getAdaptiveQuestionPool: () => ({ ids: poolIds.slice() }),
    selectNextAdaptiveQuestion: (pool, ability, usedIds) => {
      const q = pool.ids.find((id) => !usedIds.has(id));
      return q ? { id: q, difficulty: 3, text: 't', options: ['a', 'b', 'c', 'd'], correct: 0 } : null;
    },
    shuffleQuestionOptions: (q) => ({ text: q.text, options: q.options, correct: q.correct }),
    updateAbilityLevel: (lvl) => lvl,
  };
}

test('materializeSlot excludes recent-seen ids, then relaxes when exhausted', () => {
  const recent = { AR: ['AR1', 'AR2'] };
  const sandbox = loadEngine({
    document: fakeDoc(),
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    QuizManager: fakeQuizManager(['AR1', 'AR2', 'AR3']),
    MissionASVABRecentSeen: { getRecent: (c) => recent[c] || [], record() {} },
  });
  const engine = new sandbox.QuizEngine();
  engine.quizData = { questions: [{ id: 1, sectionCode: 'AR', sectionName: 'AR' }, { id: 2, sectionCode: 'AR', sectionName: 'AR' }] };
  engine.questionPools = { AR: { ids: ['AR1', 'AR2', 'AR3'] } };
  engine.abilityLevels = { AR: 3 };
  engine.usedQuestionIds = new Set();

  engine.materializeSlot(0); // should skip AR1/AR2 → AR3
  assert.strictEqual(engine.quizData.questions[0].originalId, 'AR3');

  engine.materializeSlot(1); // AR3 used; recent AR1/AR2 excluded → null → relax to AR1
  assert.strictEqual(engine.quizData.questions[1].originalId, 'AR1');
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `node --test tests/unit/quiz-engine-sections.test.js`
Expected: FAIL — current `materializeSlot` ignores recent-seen (would pick AR1 first).

- [ ] **Step 3: Add the exclusion to `materializeSlot`**

In `js/quiz-engine.js` `materializeSlot(index)`, replace:
```js
    const ability = Math.max(1, Math.min(5, Math.round(this.abilityLevels[slot.sectionCode])));
    const question = QuizManager.selectNextAdaptiveQuestion(
      this.questionPools[slot.sectionCode],
      ability,
      this.usedQuestionIds
    );
    if (!question) return; // pool exhausted (shouldn't happen for production pools)
```
with:
```js
    const ability = Math.max(1, Math.min(5, Math.round(this.abilityLevels[slot.sectionCode])));
    // SP2: also avoid questions the user saw in recent tests (on-device). If the
    // filtered pool can't supply one, relax to the session-used set so a test
    // always fills (thin non-AFQT pools).
    const excluded = new Set(this.usedQuestionIds);
    const RS = (typeof MissionASVABRecentSeen !== 'undefined') ? MissionASVABRecentSeen
      : (typeof window !== 'undefined' ? window.MissionASVABRecentSeen : null);
    if (RS && typeof RS.getRecent === 'function') {
      RS.getRecent(slot.sectionCode).forEach((id) => excluded.add(id));
    }
    let question = QuizManager.selectNextAdaptiveQuestion(
      this.questionPools[slot.sectionCode], ability, excluded);
    if (!question) {
      question = QuizManager.selectNextAdaptiveQuestion(
        this.questionPools[slot.sectionCode], ability, this.usedQuestionIds);
    }
    if (!question) return; // pool exhausted (shouldn't happen for production pools)
```

- [ ] **Step 4: Record shown questions on submit**

In `js/quiz-engine.js` `submitQuiz()`, immediately AFTER `localStorage.setItem('quizResults', JSON.stringify(quizResults));`, add:
```js
    // SP2: remember the bank questions shown this test so retakes avoid them.
    const RS = (typeof MissionASVABRecentSeen !== 'undefined') ? MissionASVABRecentSeen
      : (typeof window !== 'undefined' ? window.MissionASVABRecentSeen : null);
    if (RS && typeof RS.record === 'function') {
      const bySection = {};
      this.quizData.questions.forEach((q) => {
        if (q.originalId && q.sectionCode) {
          (bySection[q.sectionCode] = bySection[q.sectionCode] || []).push(q.originalId);
        }
      });
      Object.keys(bySection).forEach((code) => {
        try { RS.record(code, bySection[code]); } catch (_) {}
      });
    }
```

- [ ] **Step 5: Load the module on the quiz page**

In `quiz.html`, add BEFORE `<script src="js/quiz-engine.js"></script>` (and after `js/quiz-data.js`):
```html
  <script src="js/recent-seen.js"></script>
```

- [ ] **Step 6: Precache it + bump the SW version**

In `service-worker.js`, change `const CACHE_VERSION = 'mission-asvab-v2';` to `'mission-asvab-v3';`, and in `PRECACHE_URLS` under `// Core JS` add:
```js
  '/js/recent-seen.js',
```

- [ ] **Step 7: Run tests + gates**

Run: `node --test tests/unit/quiz-engine-sections.test.js && npm test 2>&1 | tail -3 && node scripts/check-no-inline-js.js`
Expected: PASS; full suite green; no inline-JS violations.

- [ ] **Step 8: Commit**

```bash
git add js/quiz-engine.js quiz.html service-worker.js tests/unit/quiz-engine-sections.test.js
git commit -m "feat: engine excludes + records recent-seen questions (SP2)"
```

---

# PHASE 2 — Per-section timers + section-scoped navigation

*Highest-risk phase. Tutor mode (`this.mode === 'tutor'`) is never sectioned — all new logic is gated on `isSectioned()` (= timed mode). Single-section timed tests are the trivial N=1 case.*

## Task 4: Section-range model + active-section state + save/resume

**Files:**
- Modify: `js/quiz-engine.js`
- Test: `tests/unit/quiz-engine-sections.test.js` (add cases)

- [ ] **Step 1: Write the failing tests**

Add to `tests/unit/quiz-engine-sections.test.js`:
```js
function sectionedEngine() {
  const sandbox = loadEngine({
    document: fakeDoc(),
    sessionStorage: { _d: {}, getItem(k) { return this._d[k] || null; }, setItem(k, v) { this._d[k] = v; }, removeItem(k) { delete this._d[k]; } },
    QuizManager: {
      getSectionInfo: (code) => ({ AR: { name: 'AR', timeLimit: 60, questionsPerTest: 2 }, WK: { name: 'WK', timeLimit: 30, questionsPerTest: 2 } }[code]),
      getAdaptiveQuestionPool: () => ({ ids: [] }),
    },
  });
  const engine = new sandbox.QuizEngine();
  engine.mode = 'timed';
  engine.testSections = ['AR', 'WK'];
  engine.quizData = { section: 'x', sectionCode: 'AR,WK', timeLimit: 90, questions: [
    { id: 1, sectionCode: 'AR', sectionName: 'AR' }, { id: 2, sectionCode: 'AR', sectionName: 'AR' },
    { id: 3, sectionCode: 'WK', sectionName: 'WK' }, { id: 4, sectionCode: 'WK', sectionName: 'WK' },
  ] };
  return { sandbox, engine };
}

test('buildSectionRanges groups contiguous slots by section', () => {
  const { engine } = sectionedEngine();
  engine.buildSectionRanges();
  assert.deepStrictEqual(engine.sectionRanges.map((r) => [r.code, r.start, r.end, r.timeLimit]),
    [['AR', 0, 2, 60], ['WK', 2, 4, 30]]);
});

test('isSectioned is false in tutor mode, true in timed mode', () => {
  const { engine } = sectionedEngine();
  assert.strictEqual(engine.isSectioned(), true);
  engine.mode = 'tutor';
  assert.strictEqual(engine.isSectioned(), false);
});

test('saveState/loadSavedState round-trips section state (schemaV 2)', () => {
  const { sandbox, engine } = sectionedEngine();
  engine.buildSectionRanges();
  engine.activeSectionIndex = 1;
  engine.sectionTimeRemaining = 17;
  engine.completedSections = new Set([0]);
  engine.currentQuestion = 2;
  engine.saveState();
  engine.quizData && sandbox.sessionStorage.setItem('generatedTest', JSON.stringify(engine.quizData));

  const e2 = new sandbox.QuizEngine();
  e2.mode = 'timed';
  e2.testSections = ['AR', 'WK'];
  const ok = e2.loadSavedState();
  assert.strictEqual(ok, true);
  assert.strictEqual(e2.activeSectionIndex, 1);
  assert.strictEqual(e2.sectionTimeRemaining, 17);
  assert.ok(e2.completedSections.has(0));
});

test('loadSavedState discards pre-SP2 state without schemaV', () => {
  const { sandbox, engine } = sectionedEngine();
  sandbox.sessionStorage.setItem('generatedTest', JSON.stringify(engine.quizData));
  sandbox.sessionStorage.setItem('quizState', JSON.stringify({ answers: {}, currentQuestion: 0 })); // no schemaV
  const e2 = new sandbox.QuizEngine();
  e2.testSections = ['AR', 'WK'];
  assert.strictEqual(e2.loadSavedState(), false);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `node --test tests/unit/quiz-engine-sections.test.js`
Expected: FAIL — `buildSectionRanges`/`isSectioned` undefined; save/resume lacks section fields.

- [ ] **Step 3: Add constructor state**

In `js/quiz-engine.js` constructor, after the SP1 tutor fields (`this.tutorRevealed = new Set();`), add:
```js
    // SP2 per-section timing (timed mode only). Ranges are [{code,name,start,end,timeLimit}].
    this.sectionRanges = [];
    this.activeSectionIndex = 0;
    this.sectionTimeRemaining = 0;
    this.completedSections = new Set();
```

- [ ] **Step 4: Add helpers**

In `js/quiz-engine.js`, add these methods (place after `generateNewTest()`):
```js
  // Timed tests are sectioned; tutor mode is a single free-navigation span.
  isSectioned() {
    return this.mode !== 'tutor';
  }

  // Derive contiguous per-section slot ranges from the generated questions.
  buildSectionRanges() {
    const ranges = [];
    const qs = (this.quizData && this.quizData.questions) || [];
    let i = 0;
    while (i < qs.length) {
      const code = qs[i].sectionCode;
      const start = i;
      while (i < qs.length && qs[i].sectionCode === code) i++;
      const info = QuizManager.getSectionInfo(code);
      ranges.push({
        code,
        name: (info && info.name) || (qs[start] && qs[start].sectionName) || code,
        start,
        end: i,
        timeLimit: (info && info.timeLimit) || 0,
      });
    }
    this.sectionRanges = ranges;
  }

  // The active slot range: the current section when sectioned, else the whole test.
  getActiveRange() {
    if (this.isSectioned() && this.sectionRanges.length) {
      return this.sectionRanges[this.activeSectionIndex];
    }
    return { start: 0, end: (this.quizData && this.quizData.questions.length) || 0 };
  }
```

- [ ] **Step 5: Initialize section state in `generateNewTest`**

In `js/quiz-engine.js` `generateNewTest()`, replace:
```js
    this.timeRemaining = this.quizData.timeLimit;
    this.saveGeneratedTest();
```
with:
```js
    this.timeRemaining = this.quizData.timeLimit;

    // SP2: set up the per-section timer/navigation model.
    this.buildSectionRanges();
    this.activeSectionIndex = 0;
    this.completedSections = new Set();
    this.currentQuestion = 0;
    this.sectionTimeRemaining = (this.isSectioned() && this.sectionRanges.length)
      ? this.sectionRanges[0].timeLimit
      : this.timeRemaining;

    this.saveGeneratedTest();
```

- [ ] **Step 6: Persist + restore section state (schema-versioned)**

In `js/quiz-engine.js` `saveState()`, replace the whole `const state = {…}` object with:
```js
    const state = {
      schemaV: 2, // SP2: bump so pre-SP2 in-progress states are discarded on resume
      answers: this.answers,
      flagged: Array.from(this.flagged),
      currentQuestion: this.currentQuestion,
      timeRemaining: this.timeRemaining,
      abilityLevels: this.abilityLevels,
      usedQuestionIds: Array.from(this.usedQuestionIds),
      tutorRevealed: Array.from(this.tutorRevealed),
      activeSectionIndex: this.activeSectionIndex,
      sectionTimeRemaining: this.sectionTimeRemaining,
      completedSections: Array.from(this.completedSections),
    };
```

In `loadSavedState()`, replace:
```js
    if (savedTest && savedState) {
      this.quizData = JSON.parse(savedTest);
      const state = JSON.parse(savedState);
```
with:
```js
    if (savedTest && savedState) {
      const state = JSON.parse(savedState);
      // SP2: the timer/navigation model changed. Discard any pre-SP2 in-progress
      // state (no schemaV) and regenerate a fresh test rather than migrate it.
      if (state.schemaV !== 2) {
        sessionStorage.removeItem('generatedTest');
        sessionStorage.removeItem('quizState');
        return false;
      }
      this.quizData = JSON.parse(savedTest);
```
Then, still in `loadSavedState()`, after the existing `this.tutorRevealed = new Set(state.tutorRevealed || []);` line, add:
```js

      // SP2 section state.
      this.buildSectionRanges();
      this.activeSectionIndex = state.activeSectionIndex || 0;
      this.sectionTimeRemaining = (typeof state.sectionTimeRemaining === 'number')
        ? state.sectionTimeRemaining
        : ((this.sectionRanges[this.activeSectionIndex] && this.sectionRanges[this.activeSectionIndex].timeLimit) || this.timeRemaining);
      this.completedSections = new Set(state.completedSections || []);
```

- [ ] **Step 7: Run the tests**

Run: `node --test tests/unit/quiz-engine-sections.test.js`
Expected: PASS (the Task 3 recent-seen test + the 4 new ones).

- [ ] **Step 8: Commit**

```bash
git add js/quiz-engine.js tests/unit/quiz-engine-sections.test.js
git commit -m "feat: per-section range model + schema-versioned save/resume (SP2)"
```

## Task 5: Per-section countdown + auto-advance/expiry

**Files:**
- Modify: `js/quiz-engine.js` (`startTimer`, `updateTimerDisplay`, add `advanceSection`)
- Test: `tests/unit/quiz-engine-sections.test.js` (add cases)

- [ ] **Step 1: Write the failing tests**

Add to `tests/unit/quiz-engine-sections.test.js`:
```js
test('advanceSection moves to the next section and resets its timer', () => {
  const { engine } = sectionedEngine();
  engine.buildSectionRanges();
  engine.activeSectionIndex = 0;
  engine.sectionTimeRemaining = 0;
  engine.currentQuestion = 1;
  engine.timeRemaining = 90;
  engine.renderQuestion = () => {}; engine.renderNavigator = () => {}; engine.updateSectionHeader = () => {}; engine.startTimer = () => {};
  engine.advanceSection();
  assert.strictEqual(engine.activeSectionIndex, 1);
  assert.strictEqual(engine.sectionTimeRemaining, 30, 'WK timeLimit');
  assert.strictEqual(engine.currentQuestion, 2, 'first WK slot');
  assert.ok(engine.completedSections.has(0));
});

test('advanceSection on the final section submits', () => {
  const { engine } = sectionedEngine();
  engine.buildSectionRanges();
  engine.activeSectionIndex = 1; // last
  let submitted = false;
  engine.submitQuiz = () => { submitted = true; };
  engine.advanceSection();
  assert.strictEqual(submitted, true);
});

test('early manual advance drops the unused section time from the total', () => {
  const { engine } = sectionedEngine();
  engine.buildSectionRanges();
  engine.activeSectionIndex = 0;
  engine.sectionTimeRemaining = 25; // finished AR early with 25s left
  engine.timeRemaining = 90;
  engine.renderQuestion = () => {}; engine.renderNavigator = () => {}; engine.updateSectionHeader = () => {}; engine.startTimer = () => {};
  engine.advanceSection();
  assert.strictEqual(engine.timeRemaining, 65, '90 - 25 unused');
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `node --test tests/unit/quiz-engine-sections.test.js`
Expected: FAIL — `advanceSection` undefined.

- [ ] **Step 3: Add `advanceSection` + make the timer section-aware**

In `js/quiz-engine.js`, add `advanceSection()` (place after `getActiveRange()`):
```js
  // Move to the next section (by finishing early or by timer expiry). On the
  // final section, submit. Unused time on an early advance is removed from the
  // total budget so timeUsed reflects real elapsed time.
  advanceSection() {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
    this.completedSections.add(this.activeSectionIndex);

    if (this.activeSectionIndex >= this.sectionRanges.length - 1) {
      this.submitQuiz();
      return;
    }

    if (this.sectionTimeRemaining > 0) {
      this.timeRemaining -= this.sectionTimeRemaining;
    }
    this.activeSectionIndex++;
    const range = this.sectionRanges[this.activeSectionIndex];
    this.sectionTimeRemaining = range.timeLimit;
    this.currentQuestion = range.start;
    this._warned10 = false;
    this._warned5 = false;

    this.saveState();
    this.renderQuestion();
    this.renderNavigator();
    this.updateSectionHeader();
    this.startTimer();
  }
```

Replace the `startTimer()` interval body. Change:
```js
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      this.updateTimerDisplay();

      // Debounce: only persist every N seconds (navigation/answer events flush immediately)
      const now = Date.now();
      if (now - this._lastSaveAt >= this._timerSaveIntervalMs) {
        this.saveState();
      }

      if (this.timeRemaining <= 0) {
        clearInterval(this.timerInterval);
        this.submitQuiz();
      }
    }, 1000);
```
to:
```js
    this.timerInterval = setInterval(() => {
      // Sectioned (timed) tests run a per-section clock; both the section clock
      // and the total budget tick down together.
      if (this.isSectioned()) this.sectionTimeRemaining--;
      this.timeRemaining--;
      this.updateTimerDisplay();

      // Debounce: only persist every N seconds (navigation/answer events flush immediately)
      const now = Date.now();
      if (now - this._lastSaveAt >= this._timerSaveIntervalMs) {
        this.saveState();
      }

      if (this.isSectioned() && this.sectionTimeRemaining <= 0) {
        // Section time up → lock it and advance (advanceSection submits if last).
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.advanceSection();
        return;
      }
      if (this.timeRemaining <= 0) {
        clearInterval(this.timerInterval);
        this.submitQuiz();
      }
    }, 1000);
```

- [ ] **Step 4: Make `updateTimerDisplay` show + warn on the section clock**

In `js/quiz-engine.js` `updateTimerDisplay()`, replace:
```js
  updateTimerDisplay() {
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
```
with:
```js
  updateTimerDisplay() {
    const remaining = this.isSectioned() ? this.sectionTimeRemaining : this.timeRemaining;
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
```
Then replace the warning block:
```js
    if (timerEl) {
      if (this.timeRemaining <= 300) { // 5 minutes
        timerEl.style.background = '#c53030';
        if (!this._warned5 && liveEl) {
          liveEl.textContent = '5 minutes remaining';
          this._warned5 = true;
        }
      } else if (this.timeRemaining <= 600) { // 10 minutes
        timerEl.style.background = '#b45309';
        if (!this._warned10 && liveEl) {
          liveEl.textContent = '10 minutes remaining';
          this._warned10 = true;
        }
      }
    }
```
with:
```js
    if (timerEl) {
      // Per-section warnings (sections range from 6–55 min; warn near the end).
      if (remaining <= 30) {
        timerEl.style.background = '#c53030';
        if (!this._warned5 && liveEl) {
          liveEl.textContent = '30 seconds left in this section';
          this._warned5 = true;
        }
      } else if (remaining <= 60) {
        timerEl.style.background = '#b45309';
        if (!this._warned10 && liveEl) {
          liveEl.textContent = '1 minute left in this section';
          this._warned10 = true;
        }
      } else {
        timerEl.style.background = '';
      }
    }
```

- [ ] **Step 5: Run the tests + full engine suite**

Run: `node --test tests/unit/quiz-engine-sections.test.js && node --test tests/unit/quiz-engine-*.test.js`
Expected: PASS. (The existing visibility test still passes — `bindVisibilityHandler` is unchanged and still resumes via `startTimer` while `this.timeRemaining > 0`.)

- [ ] **Step 6: Commit**

```bash
git add js/quiz-engine.js tests/unit/quiz-engine-sections.test.js
git commit -m "feat: per-section countdown with auto-advance on expiry (SP2)"
```

## Task 6: Section-scoped navigation

**Files:**
- Modify: `js/quiz-engine.js` (`nextQuestion`, `prevQuestion`, `goToQuestion`)
- Test: `tests/unit/quiz-engine-sections.test.js` (add cases)

- [ ] **Step 1: Write the failing tests**

Add to `tests/unit/quiz-engine-sections.test.js`:
```js
test('nextQuestion advances to the next section at a section boundary', () => {
  const { engine } = sectionedEngine();
  engine.buildSectionRanges();
  engine.activeSectionIndex = 0;
  engine.currentQuestion = 1; // last AR slot (range [0,2))
  engine.answers = { 2: 0 };
  let advanced = false;
  engine.advanceSection = () => { advanced = true; };
  engine.nextQuestion();
  assert.strictEqual(advanced, true, 'boundary triggers advanceSection');
});

test('nextQuestion within a section just moves forward', () => {
  const { engine } = sectionedEngine();
  engine.buildSectionRanges();
  engine.activeSectionIndex = 0;
  engine.currentQuestion = 0;
  engine.answers = { 1: 0 };
  engine.renderQuestion = () => {};
  engine.nextQuestion();
  assert.strictEqual(engine.currentQuestion, 1);
});

test('nextQuestion on the final section shows submit confirm', () => {
  const { engine } = sectionedEngine();
  engine.buildSectionRanges();
  engine.activeSectionIndex = 1; // last, range [2,4)
  engine.currentQuestion = 3;
  engine.answers = { 4: 0 };
  let confirmed = false;
  engine.showSubmitConfirm = () => { confirmed = true; };
  engine.nextQuestion();
  assert.strictEqual(confirmed, true);
});

test('prevQuestion cannot cross below the active section start', () => {
  const { engine } = sectionedEngine();
  engine.buildSectionRanges();
  engine.activeSectionIndex = 1; // range [2,4)
  engine.currentQuestion = 2;
  engine.renderQuestion = () => {};
  engine.prevQuestion();
  assert.strictEqual(engine.currentQuestion, 2, 'stays at section start');
});

test('goToQuestion ignores targets outside the active section', () => {
  const { engine } = sectionedEngine();
  engine.buildSectionRanges();
  engine.activeSectionIndex = 1; // range [2,4)
  engine.currentQuestion = 2;
  engine.answers = { 1: 0 };
  engine.renderQuestion = () => {};
  engine.goToQuestion(0); // slot 0 is in section AR (completed)
  assert.strictEqual(engine.currentQuestion, 2, 'no cross-section jump');
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `node --test tests/unit/quiz-engine-sections.test.js`
Expected: FAIL — navigation is not yet section-scoped.

- [ ] **Step 3: Section-scope the three navigation methods**

In `js/quiz-engine.js`, replace `goToQuestion(index)`:
```js
  goToQuestion(index) {
    if (index < 0 || index >= this.quizData.questions.length) return;

    // Sectioned tests: can only move within the active section.
    if (this.isSectioned()) {
      const range = this.getActiveRange();
      if (index < range.start || index >= range.end) return;
    }

    // Can only go to answered questions or the current question.
    const targetQuestion = this.quizData.questions[index];
    if (index > this.currentQuestion && this.answers[targetQuestion.id] === undefined) {
      return;
    }

    this.currentQuestion = index;
    this.saveState();
    this.renderQuestion();
  }
```

Replace `nextQuestion()`:
```js
  nextQuestion() {
    const question = this.quizData.questions[this.currentQuestion];
    if (this.answers[question.id] === undefined) {
      this.showAnswerRequired();
      return;
    }

    if (this.isSectioned()) {
      const range = this.getActiveRange();
      if (this.currentQuestion < range.end - 1) {
        this.currentQuestion++;
        this.saveState();
        this.renderQuestion();
      } else if (this.activeSectionIndex >= this.sectionRanges.length - 1) {
        this.showSubmitConfirm(); // last question of the last section
      } else {
        this.advanceSection(); // finished this section early
      }
      return;
    }

    // Tutor / non-sectioned: free navigation across the whole test.
    if (this.currentQuestion < this.quizData.questions.length - 1) {
      this.currentQuestion++;
      this.saveState();
      this.renderQuestion();
    } else {
      this.showSubmitConfirm();
    }
  }
```

Replace `prevQuestion()`:
```js
  prevQuestion() {
    const min = this.isSectioned() ? this.getActiveRange().start : 0;
    if (this.currentQuestion > min) {
      this.currentQuestion--;
      this.saveState();
      this.renderQuestion();
    }
  }
```

- [ ] **Step 4: Run the tests + full engine suite**

Run: `node --test tests/unit/quiz-engine-sections.test.js && node --test tests/unit/quiz-engine-*.test.js`
Expected: PASS. (SP1 tutor tests still pass — tutor keeps the non-sectioned branch.)

- [ ] **Step 5: Commit**

```bash
git add js/quiz-engine.js tests/unit/quiz-engine-sections.test.js
git commit -m "feat: section-scoped navigation for timed tests (SP2)"
```

## Task 7: Section-aware navigator + header rendering

**Files:**
- Modify: `js/quiz-engine.js` (`renderNavigator`, `updateNavigator`, `updateSectionHeader`)

- [ ] **Step 1: Render only the active section's questions in the navigator**

In `js/quiz-engine.js`, replace `renderNavigator()`:
```js
  renderNavigator() {
    const grid = document.getElementById('navigatorGrid');
    if (!grid) return;

    // Sectioned tests show only the active section; tutor shows the whole test.
    const range = this.isSectioned()
      ? this.getActiveRange()
      : { start: 0, end: this.quizData.questions.length };

    let html = '';
    for (let idx = range.start; idx < range.end; idx++) {
      const q = this.quizData.questions[idx];
      const classes = ['nav-dot'];
      if (idx === this.currentQuestion) classes.push('current');
      if (this.mode === 'tutor' && this.tutorRevealed.has(q.id)) {
        classes.push(this.answers[q.id] === q.correct ? 'nav-correct' : 'nav-incorrect');
      } else if (this.answers[q.id] !== undefined) {
        classes.push('answered');
      }
      if (this.flagged.has(q.id)) classes.push('flagged');
      const sectionAttr = q.sectionCode ? `data-section="${q.sectionCode}"` : '';
      html += `<div class="${classes.join(' ')}" data-index="${idx}" ${sectionAttr}>${idx - range.start + 1}</div>`;
    }
    grid.innerHTML = html;
  }
```

Replace `updateNavigator()` (rebuild so the dot set stays correct across section advances):
```js
  updateNavigator() {
    this.renderNavigator();
  }
```

- [ ] **Step 2: Show "Section X of N" in the header**

In `js/quiz-engine.js`, replace `updateSectionHeader()`:
```js
  updateSectionHeader() {
    const header = document.querySelector('.quiz-section');
    if (!header) return;

    if (this.isSectioned() && this.sectionRanges.length) {
      const range = this.sectionRanges[this.activeSectionIndex];
      header.textContent = this.sectionRanges.length > 1
        ? `Section ${this.activeSectionIndex + 1} of ${this.sectionRanges.length}: ${range.name}`
        : range.name;
      return;
    }

    // Tutor / fallback: the current question's section name, else the test name.
    const question = this.quizData.questions[this.currentQuestion];
    header.textContent = (question && question.sectionName) || this.quizData.section;
  }
```

- [ ] **Step 3: Run the full engine + DOM-contract suites**

Run: `node --test tests/unit/quiz-engine-*.test.js && node --test tests/unit/dom-contracts.test.js`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add js/quiz-engine.js
git commit -m "feat: section-scoped navigator + 'Section X of N' header (SP2)"
```

## Task 8: Phase 2 verification

- [ ] **Step 1: Full suite + gates**

Run: `npm test 2>&1 | tail -3 && node scripts/validate-site.js && node scripts/check-no-inline-js.js`
Expected: all pass.

- [ ] **Step 2: Real-data engine smoke (multi-section timed)**

Run this node smoke (adapts the SP1 pattern) to confirm section ranges + advance work against real data:
```bash
node -e '
const vm=require("vm"),fs=require("fs");
const ctx={console,URLSearchParams,setInterval:()=>1,clearInterval:()=>{},setTimeout:()=>0,
  document:{addEventListener(){},getElementById:()=>null,querySelector:()=>null},
  sessionStorage:{_d:{},getItem(k){return this._d[k]||null},setItem(k,v){this._d[k]=v},removeItem(k){delete this._d[k]}},
  localStorage:{_d:{},getItem(k){return this._d[k]||null},setItem(k,v){this._d[k]=v},removeItem(k){delete this._d[k]}},
  window:{},location:{search:"?type=full"}};
ctx.globalThis=ctx;ctx.window=ctx;ctx.window.location=ctx.location;vm.createContext(ctx);
for(const f of ["js/section-config.js","js/quiz-data.js","js/scoring.js","js/test-config.js","js/recent-seen.js"]) vm.runInContext(fs.readFileSync(f,"utf8"),ctx,{filename:f});
vm.runInContext(fs.readFileSync("js/quiz-engine.js","utf8")+"\nthis.QuizEngine=QuizEngine;",ctx);
const e=new ctx.QuizEngine(); e.loadTestConfig(); e.generateNewTest();
console.log("sections:", e.sectionRanges.map(r=>r.code+"["+r.start+","+r.end+")@"+r.timeLimit).join(" "));
console.log("active:", e.activeSectionIndex, "sectionTime:", e.sectionTimeRemaining, "total:", e.timeRemaining);
'
```
Expected: prints 8 section ranges in canonical order with correct timeLimits; active=0; sectionTime = GS timeLimit (600); total = sum.

- [ ] **Step 3: Commit (no-op if clean) / proceed**

---

# PHASE 3 — Practice Hub UI

## Task 9: Section checklist markup + styles in `select-test.html`

**Files:**
- Modify: `select-test.html`

- [ ] **Step 1: Replace the static section info boxes with an interactive checklist**

In `select-test.html`, find the block that starts at `<!-- Section Info -->` / `<h2 class="section-title">Sections Included</h2>` and contains `<div class="section-info-box" id="quickSections">` … through the end of `<div class="section-info-box" id="fullSections">…</div>`. Replace that entire "Sections Included" block with:
```html
    <h2 class="section-title">Or practice by section</h2>
    <div class="section-picker" id="sectionPicker" role="group" aria-label="Choose sections to practice">
      <!-- rows injected by js/page-select-test.js from SECTION_CONFIG -->
    </div>
    <div class="picker-summary" id="pickerSummary" aria-live="polite"></div>
```

- [ ] **Step 2: Add styles**

In the `select-test.html` `<style>` block, add:
```css
    .section-picker {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
      gap: 0.6rem;
      margin: 0.5rem 0 1rem;
    }
    .picker-row {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      padding: 0.7rem 0.9rem;
      background: var(--white);
      border: 2px solid var(--cream-200);
      border-radius: 10px;
      cursor: pointer;
    }
    .picker-row.checked { border-color: var(--navy-900); }
    .picker-row input { width: 18px; height: 18px; cursor: pointer; }
    .picker-name { font-weight: 600; color: var(--navy-900); }
    .picker-meta { margin-left: auto; font-size: 0.8rem; color: var(--text-secondary); white-space: nowrap; }
    .picker-summary { font-weight: 600; color: var(--navy-700); margin-bottom: 1rem; min-height: 1.2em; }
```

- [ ] **Step 3: Verify markup (inline-JS gate)**

Run: `node scripts/check-no-inline-js.js`
Expected: no violations (no inline JS added).

- [ ] **Step 4: Commit**

```bash
git add select-test.html
git commit -m "feat: section-picker markup + styles on select-test (SP2)"
```

## Task 10: Hub selection logic → testConfig

**Files:**
- Modify: `js/page-select-test.js`, `js/page-test-intro.js`
- Test: `tests/unit/page-select-test-hub.test.js`

- [ ] **Step 1: Write the failing test (pure helpers)**

`tests/unit/page-select-test-hub.test.js`:
```js
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..', '..');

// Extract the two pure helpers from the shipped source and run them.
function loadHelpers() {
  const src = fs.readFileSync(path.join(root, 'js/page-select-test.js'), 'utf8');
  function extract(name) {
    const start = src.indexOf('function ' + name);
    assert.ok(start >= 0, 'missing ' + name);
    let depth = 0, i = src.indexOf('{', start);
    for (; i < src.length; i++) { if (src[i] === '{') depth++; else if (src[i] === '}' && --depth === 0) break; }
    return src.slice(start, i + 1);
  }
  const sandbox = {
    MissionASVABConfig: {
      getSectionsForType: (t) => ({ quick: ['AR', 'WK', 'PC', 'MK'], full: ['GS', 'AR', 'WK', 'PC', 'MK', 'EI', 'AS', 'MC'] }[t]),
      getTestTypeFromSections: (s) => {
        const q = ['AR', 'WK', 'PC', 'MK'], f = ['GS', 'AR', 'WK', 'PC', 'MK', 'EI', 'AS', 'MC'];
        if (s.length === q.length && q.every((c, i) => s[i] === c)) return 'afqt';
        if (s.length === f.length && f.every((c, i) => s[i] === c)) return 'full';
        return s.length === 1 ? 'single' : 'custom';
      },
    },
  };
  vm.createContext(sandbox);
  vm.runInContext(extract('orderSections') + '\n' + extract('deriveTestType') + '\nthis.orderSections=orderSections;this.deriveTestType=deriveTestType;', sandbox);
  return sandbox;
}

test('orderSections returns canonical (full) order regardless of input order', () => {
  const s = loadHelpers();
  assert.deepStrictEqual(s.orderSections(['MK', 'AR']), ['AR', 'MK']);
  assert.deepStrictEqual(s.orderSections(['MC', 'GS', 'AR']), ['GS', 'AR', 'MC']);
});

test('deriveTestType maps the AFQT four to quick, all eight to full, else custom', () => {
  const s = loadHelpers();
  assert.strictEqual(s.deriveTestType(['AR', 'WK', 'PC', 'MK']), 'quick');
  assert.strictEqual(s.deriveTestType(['GS', 'AR', 'WK', 'PC', 'MK', 'EI', 'AS', 'MC']), 'full');
  assert.strictEqual(s.deriveTestType(['WK']), 'custom');
  assert.strictEqual(s.deriveTestType(['AR', 'WK']), 'custom');
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `node --test tests/unit/page-select-test-hub.test.js`
Expected: FAIL — helpers don't exist yet.

- [ ] **Step 3: Rewrite `js/page-select-test.js`**

Replace the entire contents of `js/page-select-test.js` with:
```js
// Page logic for select-test.html (SP2 practice hub)
// Externalized from an inline <script> (CSP script-src hardening).
// Loaded at end of <body> after test-config.js / section-config.js / quiz-data.js.

// --- Pure helpers (unit-tested) ---------------------------------------------

// Canonical section order = the full-test order. Filtering it keeps any custom
// selection in the order getTestTypeFromSections expects (it is order-sensitive).
function orderSections(selected) {
  const canonical = MissionASVABConfig.getSectionsForType('full');
  const set = new Set(selected);
  return canonical.filter((code) => set.has(code));
}

// Map an ordered section list to the localStorage testType used by test-intro:
// quick (AFQT four) / full (all eight) / custom (anything else).
function deriveTestType(orderedSections) {
  const t = MissionASVABConfig.getTestTypeFromSections(orderedSections);
  if (t === 'afqt') return 'quick';
  if (t === 'full') return 'full';
  return 'custom';
}

// --- Page wiring ------------------------------------------------------------

(function () {
  sessionStorage.removeItem('quizState');
  sessionStorage.removeItem('generatedTest');
  sessionStorage.removeItem('testConfig');

  const nameInput = document.getElementById('userName');
  const startBtn = document.getElementById('startBtn');
  const picker = document.getElementById('sectionPicker');
  const summary = document.getElementById('pickerSummary');
  const tutorEl = document.getElementById('tutorToggle');

  const savedName = localStorage.getItem('asvabUserName');
  if (savedName) nameInput.value = savedName;

  // Selection state: a Set of section codes. Start from the quick preset.
  const selected = new Set(MissionASVABConfig.getSectionsForType('quick'));

  // Build the section-picker rows from SECTION_CONFIG (full-test order).
  const allCodes = MissionASVABConfig.getSectionsForType('full');
  picker.innerHTML = allCodes.map((code) => {
    const info = QuizManager.getSectionInfo(code) || {};
    const mins = Math.round((info.timeLimit || 0) / 60);
    return `
      <label class="picker-row" data-code="${code}">
        <input type="checkbox" data-code="${code}">
        <span class="picker-name">${info.name || code}</span>
        <span class="picker-meta">${info.questionsPerTest || 0}q · ${mins}m</span>
      </label>`;
  }).join('');

  function syncPickerUI() {
    picker.querySelectorAll('.picker-row').forEach((row) => {
      const code = row.dataset.code;
      const box = row.querySelector('input');
      const on = selected.has(code);
      box.checked = on;
      row.classList.toggle('checked', on);
    });
    // Reflect selection on the preset cards.
    const ordered = orderSections(Array.from(selected));
    const type = deriveTestType(ordered);
    document.querySelectorAll('.test-type-card').forEach((c) => {
      const isMatch = (type === 'quick' && c.dataset.type === 'quick') ||
        (type === 'full' && c.dataset.type === 'full');
      c.classList.toggle('selected', isMatch);
      c.setAttribute('aria-checked', isMatch ? 'true' : 'false');
    });
    updateSummaryAndButton();
  }

  function updateSummaryAndButton() {
    const ordered = orderSections(Array.from(selected));
    let q = 0, secs = 0;
    ordered.forEach((code) => {
      const info = QuizManager.getSectionInfo(code) || {};
      q += info.questionsPerTest || 0;
      secs += info.timeLimit || 0;
    });
    const tutor = tutorEl && tutorEl.checked;
    const timeStr = tutor ? 'untimed' : `${Math.ceil(secs / 60)} min`;
    summary.textContent = ordered.length
      ? `Selected: ${ordered.length} section${ordered.length > 1 ? 's' : ''} · ${q}q · ${timeStr}`
      : 'Select at least one section to begin.';

    const nameValid = nameInput.value.trim().length >= 2;
    startBtn.disabled = !nameValid || ordered.length === 0;
    startBtn.textContent = ordered.length ? `Start Practice (${q} questions)` : 'Start Practice';
  }

  // Preset cards set the selection to that preset's sections.
  document.querySelectorAll('.test-type-card').forEach((card) => {
    card.setAttribute('role', 'radio');
    card.setAttribute('tabindex', '0');
    const choose = () => {
      selected.clear();
      MissionASVABConfig.getSectionsForType(card.dataset.type).forEach((c) => selected.add(c));
      syncPickerUI();
    };
    card.addEventListener('click', choose);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); choose(); }
    });
  });

  // Checkbox toggles edit the custom selection.
  picker.addEventListener('change', (e) => {
    const box = e.target.closest('input[data-code]');
    if (!box) return;
    const code = box.dataset.code;
    if (box.checked) selected.add(code); else selected.delete(code);
    syncPickerUI();
  });

  nameInput.addEventListener('input', updateSummaryAndButton);
  if (tutorEl) tutorEl.addEventListener('change', updateSummaryAndButton);

  syncPickerUI();

  startBtn.addEventListener('click', () => {
    if (startBtn.disabled) return;
    const ordered = orderSections(Array.from(selected));
    if (!ordered.length) return;

    localStorage.setItem('asvabUserName', nameInput.value.trim());
    localStorage.setItem('testType', deriveTestType(ordered));

    sessionStorage.removeItem('quizState');
    sessionStorage.removeItem('generatedTest');
    const mode = tutorEl && tutorEl.checked ? 'tutor' : 'timed';
    sessionStorage.setItem('testConfig', JSON.stringify({ sections: ordered, mode: mode }));

    window.location.href = 'test-intro.html';
  });
})();
```

NOTE: this rewrite assumes `select-test.html` still has: `#userName`, `#startBtn`, `#tutorToggle` (SP1), `.test-type-card[data-type]` cards, and the `#sectionPicker`/`#pickerSummary` from Task 9. Confirm those ids exist before running.

- [ ] **Step 4: Label custom tests in `js/page-test-intro.js`**

In `js/page-test-intro.js` `loadTestInfo()`, replace:
```js
    const activeConfig = MissionASVABConfig.getTestConfig(testType);
    const totalTimeMinutes = Math.ceil(details.totalTimeSeconds / 60);

    document.getElementById('testBadge').textContent = activeConfig.label;
    document.getElementById('sectionTitle').textContent = activeConfig.title;
    document.getElementById('sectionDesc').textContent = activeConfig.description;
    document.getElementById('sectionCode').textContent = activeConfig.sectionCode;

    document.getElementById('questionCount').textContent = details.totalQuestions;
    document.getElementById('timeLimit').textContent = totalTimeMinutes;
```
with:
```js
    const totalTimeMinutes = Math.ceil(details.totalTimeSeconds / 60);
    const isPreset = testType === 'quick' || testType === 'full';

    if (isPreset) {
      const activeConfig = MissionASVABConfig.getTestConfig(testType);
      document.getElementById('testBadge').textContent = activeConfig.label;
      document.getElementById('sectionTitle').textContent = activeConfig.title;
      document.getElementById('sectionDesc').textContent = activeConfig.description;
      document.getElementById('sectionCode').textContent = activeConfig.sectionCode;
    } else {
      // Custom section practice — label from the actual selection.
      document.getElementById('testBadge').textContent = 'Custom Practice';
      document.getElementById('sectionTitle').textContent = sections.length === 1
        ? (QuizManager.getSectionInfo(sections[0]) || {}).name || 'Section Practice'
        : 'Custom Practice';
      document.getElementById('sectionDesc').textContent = 'Practice the sections you selected.';
      document.getElementById('sectionCode').textContent = sections.join(', ');
    }

    document.getElementById('questionCount').textContent = details.totalQuestions;
    document.getElementById('timeLimit').textContent = totalTimeMinutes;
```
The SP1 tutor override at the end of `loadTestInfo()` (hides the time limit, sets the badge to "Tutor Mode — Untimed") stays and correctly runs after this block.

- [ ] **Step 5: Run the tests + gates**

Run: `node --test tests/unit/page-select-test-hub.test.js && npm test 2>&1 | tail -3 && node scripts/check-no-inline-js.js && node scripts/validate-site.js`
Expected: all pass; no inline-JS violations.

- [ ] **Step 6: Commit**

```bash
git add js/page-select-test.js js/page-test-intro.js tests/unit/page-select-test-hub.test.js
git commit -m "feat: practice-hub selection logic + custom test labeling (SP2)"
```

## Task 11: Final verification

- [ ] **Step 1: Full suite + both gates**

Run: `npm test 2>&1 | tail -3 && node scripts/validate-site.js && node scripts/check-no-inline-js.js`
Expected: all green.

- [ ] **Step 2: Manual browser pass** (`npx serve . -l 3000`, console open):
1. **Custom practice:** select-test → check AR + MK only → summary shows "2 sections"; Start → test-intro shows "Custom Practice"; timed test runs **per-section** (AR clock, then auto-advances to MK); results show a practice score (no AFQT — MK+AR is not all four), review shows explanations.
2. **Full test:** per-section timers, "Section X of 8" header, navigator shows only the current section, cannot return to a completed section, auto-advance on expiry; results show AFQT + line scores.
3. **Quick preset:** starts the AFQT four; AFQT computed.
4. **Tutor toggle + custom:** untimed, free navigation, no section timer, explanations on reveal.
5. **Repeat avoidance:** take the same single-section practice twice; the second attempt avoids the first attempt's questions (until the pool is thin).
6. **Resume:** refresh mid-section → resumes the active section with its remaining time (pre-SP2 saved states regenerate cleanly).
7. **Zero CSP console errors** on select-test / test-intro / quiz / results.

- [ ] **Step 3: Report** completion with test counts + gate results.

---

## Self-Review (completed during authoring)

**Spec coverage:**
- §1 Practice Hub UI → Tasks 9, 10 (checklist, preset↔custom sync, summary, testType derivation, ≥1-section+name gating, tutor toggle, canonical ordering).
- §2 Per-section timers + auto-advance → Tasks 4 (ranges/state/save-resume/legacy-discard), 5 (countdown/advance/expiry), 6 (nav scoping), 7 (navigator/header). Tutor untouched (all gated on `isSectioned()`).
- §3 Repeat avoidance → Tasks 2 (module: cap, dedupe, fail-safe), 3 (exclude + relax + record + load + precache).
- §4 Scoring correctness → Task 1 (AFQT-all-4 gate at call site; scoring.js untouched).
- §5 Testing → tests in Tasks 1,2,3,4,5,6,10 + Task 11 manual. Existing 94 stay green (verified each engine task runs the full engine suite).
- Error-handling table → recent-seen fail-safe (T2), relax fallback (T3), legacy discard (T4), custom-subset AFQT null (T1), final-section expiry submit (T5), 0-sections disables Start (T10).

**Consistency:**
- Field/method names consistent across tasks: `isSectioned()`, `sectionRanges` (`{code,name,start,end,timeLimit}`), `activeSectionIndex`, `sectionTimeRemaining`, `completedSections` (Set of indices), `getActiveRange()`, `advanceSection()`, `buildSectionRanges()`, `orderSections()`, `deriveTestType()`.
- Recent-seen keys on the bank id (`originalId`); exclusion set and `usedQuestionIds` are both bank ids — homogeneous. Verified against `materializeSlot` (`slot.originalId = question.id`).
- `saveState` schemaV=2 gates legacy discard in `loadSavedState`; both tutor and timed states now carry schemaV, so tutor resumes still work post-SP2 (only *pre*-SP2 states are discarded).
- `getTestTypeFromSections` is order-sensitive → `orderSections()` always emits canonical order before calling it. Verified against `test-config.js:34-45`.

**Placeholder scan:** none — every code step has complete code.

**Deferred note (out of scope, do not fix here):** `question_results` still stores the integer slot id, not `originalId` (SP1 finding). SP2's recent-seen is on-device and does not depend on it.
