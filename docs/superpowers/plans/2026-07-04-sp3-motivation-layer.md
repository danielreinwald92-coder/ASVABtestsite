# SP3 — Motivation Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a client-side motivation layer — test-date countdown + paced study plan, derived study streak, on-device spaced-repetition flashcards, a locally-generated shareable score card, and a dismissible PWA install prompt — with zero DB changes.

**Architecture:** Small single-responsibility modules with pure logic separated from DOM/storage so the logic is unit-testable without jsdom. Pure modules: `js/streak.js`, `js/study-plan.js`, `js/spaced-repetition.js` (scheduler), plus DOM-side `js/share-card.js` and `js/pwa-install.js`. Dashboard/study-guide/results page scripts wire them in via `addEventListener` (strict CSP — no inline JS).

**Tech Stack:** Plain JS classic scripts (IIFE + window globals), node:test + jsdom, localStorage, Canvas 2D + Web Share API.

## Global Constraints

- **No DB/Supabase changes.** All state is derived from existing data or stored in `localStorage`.
- **Strict CSP:** no inline `<script>`/`on*=`; wire via `addEventListener`. `check-no-inline-js.js` enforces.
- **Module pattern:** `(function (root) { ... root.X = X; if (module.exports) module.exports = X; })(typeof window !== 'undefined' ? window : this);` — matches existing files, so `loadScripts` in tests and `validate-site` can pick up globals.
- **localStorage keys namespaced** `missionasvab.sp3.*`. All storage access wrapped in try/catch (private-mode safe), same defensive posture as `js/recent-seen.js`.
- **Dates use the user's local calendar day** (not UTC) for streaks/SR due-dates.
- **Recent Updates feed:** add one homepage entry on ship (real date, plain language).

## File Structure

- `js/streak.js` (new) — `computeStreak(dateStrings, todayStr) → { current, longest }`. Pure.
- `js/study-plan.js` (new) — `buildStudyPlan({ daysRemaining, weakSections }) → { phase, headline, items[] }`. Pure.
- `js/spaced-repetition.js` (new) — pure `review(state, grade, todayStr) → state`, `isDue(state, todayStr) → bool`, `dueCount(states, todayStr)`; plus `SRStore` localStorage wrapper.
- `js/share-card.js` (new) — `buildShareText(result) → { title, lines[] }` (pure, tested) + `renderAndShare(result)` (canvas + navigator.share/download).
- `js/pwa-install.js` (new) — install-prompt capture + dismissible banner.
- `js/page-dashboard.js` (modify) — render countdown + streak + study plan + install banner.
- `js/page-study-guide.js` (modify) — add SR "Review" mode to the flashcard tool.
- `js/page-results.js` (modify) — add "Share result" action.
- `dashboard.html`, `study-guide.html`, `results.html` (modify) — containers/buttons (no inline JS).
- Tests: `tests/unit/streak.test.js`, `study-plan.test.js`, `spaced-repetition.test.js`, `share-card.test.js`.

---

### Task 1: Study streak (pure logic + dashboard card)

**Files:** Create `js/streak.js`, `tests/unit/streak.test.js`; modify `js/page-dashboard.js`, `dashboard.html`.

**Interfaces:**
- Produces: `window.MissionASVABStreak.computeStreak(dateStrings: string[], todayStr: string) → {current:number, longest:number}`. `dateStrings` are `YYYY-MM-DD` local-day strings (caller derives from `test_results.created_at`).

- [ ] **Step 1: Write failing test** `tests/unit/streak.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert');
const { loadScripts } = require('../helpers/load');
const { window } = loadScripts(['js/streak.js']);
const { computeStreak } = window.MissionASVABStreak;

test('no activity → zero streak', () => {
  assert.deepStrictEqual(computeStreak([], '2026-07-04'), { current: 0, longest: 0 });
});
test('today only → current 1', () => {
  assert.deepStrictEqual(computeStreak(['2026-07-04'], '2026-07-04'), { current: 1, longest: 1 });
});
test('consecutive run ending today → counts all', () => {
  assert.deepStrictEqual(
    computeStreak(['2026-07-02', '2026-07-03', '2026-07-04'], '2026-07-04'),
    { current: 3, longest: 3 });
});
test('duplicates same day count once', () => {
  assert.deepStrictEqual(
    computeStreak(['2026-07-04', '2026-07-04', '2026-07-03'], '2026-07-04'),
    { current: 2, longest: 2 });
});
test('current run allowed to end yesterday (today not yet practiced)', () => {
  assert.deepStrictEqual(
    computeStreak(['2026-07-02', '2026-07-03'], '2026-07-04'),
    { current: 2, longest: 2 });
});
test('gap breaks current but longest remembered', () => {
  const r = computeStreak(['2026-06-01', '2026-06-02', '2026-06-03', '2026-07-04'], '2026-07-04');
  assert.strictEqual(r.longest, 3);
  assert.strictEqual(r.current, 1);
});
test('stale run (ended before yesterday) → current 0', () => {
  assert.strictEqual(computeStreak(['2026-06-01', '2026-06-02'], '2026-07-04').current, 0);
});
```

- [ ] **Step 2:** `node --test tests/unit/streak.test.js` → FAIL (module missing).
- [ ] **Step 3: Implement** `js/streak.js`:

```js
// Derived study-streak logic. No storage — computed from the distinct local
// calendar days on which the user completed any test (timed or tutor).
(function (root) {
  'use strict';
  function toDayNumber(str) {
    const [y, m, d] = str.split('-').map(Number);
    return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
  }
  function computeStreak(dateStrings, todayStr) {
    const days = Array.from(new Set(dateStrings)).map(toDayNumber).sort((a, b) => a - b);
    if (days.length === 0) return { current: 0, longest: 0 };
    let longest = 1, run = 1;
    for (let i = 1; i < days.length; i++) {
      run = days[i] === days[i - 1] + 1 ? run + 1 : 1;
      if (run > longest) longest = run;
    }
    const today = toDayNumber(todayStr);
    const last = days[days.length - 1];
    let current = 0;
    if (last === today || last === today - 1) {
      current = 1;
      for (let i = days.length - 1; i > 0; i--) {
        if (days[i] === days[i - 1] + 1) current++; else break;
      }
    }
    return { current, longest };
  }
  root.MissionASVABStreak = { computeStreak };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.MissionASVABStreak;
})(typeof window !== 'undefined' ? window : this);
```

- [ ] **Step 4:** `node --test tests/unit/streak.test.js` → PASS.
- [ ] **Step 5: Dashboard wiring.** In `dashboard.html` add `<script src="js/streak.js"></script>` (before `js/page-dashboard.js`) and a `<div id="streak-card" class="dash-card" hidden></div>`. In `js/page-dashboard.js`, after test-results load, derive local-day strings (`new Date(r.created_at).toLocaleDateString('en-CA')` → `YYYY-MM-DD`), call `computeStreak`, and if `current > 0` fill the card ("🔥 {current}-day streak · best {longest}"). Wire with textContent (no innerHTML of user data).
- [ ] **Step 6:** Manual check via `npm test` (all green) + `node scripts/check-no-inline-js.js`.
- [ ] **Step 7: Commit** `feat: derived study streak on dashboard`.

### Task 2: Test-date countdown + paced study plan

**Files:** Create `js/study-plan.js`, `tests/unit/study-plan.test.js`; modify `js/page-dashboard.js`, `dashboard.html`.

**Interfaces:**
- Consumes: `profiles.test_date` (already loaded on the dashboard), weak sections from the existing weak-area aggregation (`window.MissionASVABWeakAreas` or the dashboard's computed list — reuse whatever `page-dashboard.js` already has; pass an array of section codes worst-first).
- Produces: `window.MissionASVABStudyPlan.buildStudyPlan({daysRemaining:number|null, weakSections:string[]}) → {phase:'none'|'foundation'|'focus'|'sprint', headline:string, items:string[]}`.

- [ ] **Step 1: Write failing test** `tests/unit/study-plan.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert');
const { loadScripts } = require('../helpers/load');
const { window } = loadScripts(['js/study-plan.js']);
const { buildStudyPlan } = window.MissionASVABStudyPlan;

test('no test date → foundation-style generic plan, phase none', () => {
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
});
```

- [ ] **Step 2:** run test → FAIL.
- [ ] **Step 3: Implement** `js/study-plan.js` (section-code → full name map inline; phase buckets: `null`→none, `>21`→foundation, `7..21`→focus, `<7`(incl. negative)→sprint; `items` = 2–4 short strings; focus/sprint reference `weakSections` names when present, else a sensible default like "rotate through all sections"):

```js
(function (root) {
  'use strict';
  var NAMES = { GS:'General Science', AR:'Arithmetic Reasoning', WK:'Word Knowledge',
    PC:'Paragraph Comprehension', MK:'Mathematics Knowledge', EI:'Electronics Information',
    AS:'Auto & Shop Information', MC:'Mechanical Comprehension' };
  function names(codes) { return (codes || []).map(function (c) { return NAMES[c] || c; }); }
  function buildStudyPlan(opts) {
    var d = opts && opts.daysRemaining;
    var weak = names(opts && opts.weakSections).slice(0, 2);
    var weakPhrase = weak.length ? weak.join(' and ') : 'your weakest sections';
    if (d === null || d === undefined) {
      return { phase: 'none', headline: 'Set a test date to unlock a paced plan',
        items: ['Take a full practice test to find your baseline',
          'Add your test date in Account settings for a day-by-day plan'] };
    }
    if (d > 21) return { phase: 'foundation', headline: 'Build your foundation',
      items: ['Work broadly across all sections', 'Read the study guides for AFQT sections (AR, MK, WK, PC)',
        'Take a full practice test each week to track progress'] };
    if (d >= 7) return { phase: 'focus', headline: 'Focus on your weak spots',
      items: ['Drill ' + weakPhrase + ' with section practice',
        'Review answer explanations on every miss', 'Take a full practice test mid-week'] };
    return { phase: 'sprint', headline: d < 0 ? 'Test date passed - update it in Account' : 'Final sprint',
      items: ['Take full timed practice tests to build stamina',
        'Do a light review of ' + weakPhrase, 'Rest well the night before test day'] };
  }
  root.MissionASVABStudyPlan = { buildStudyPlan: buildStudyPlan };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.MissionASVABStudyPlan;
})(typeof window !== 'undefined' ? window : this);
```

- [ ] **Step 4:** run test → PASS.
- [ ] **Step 5: Dashboard wiring.** Add `<script src="js/study-plan.js">` + a countdown/plan container to `dashboard.html`. In `js/page-dashboard.js`: parse `profile.test_date` to `daysRemaining` (local-day diff; `null` if unset), gather weak section codes worst-first from existing dashboard data, call `buildStudyPlan`, render headline + countdown ("18 days until your ASVAB" / "Add your test date") + `items` as a `<ul>` built with `textContent` per `<li>`.
- [ ] **Step 6:** `npm test` green, `check-no-inline-js` green.
- [ ] **Step 7: Commit** `feat: test-date countdown and paced study plan on dashboard`.

### Task 3: Spaced-repetition flashcards

**Files:** Create `js/spaced-repetition.js`, `tests/unit/spaced-repetition.test.js`; modify `js/page-study-guide.js`, `study-guide.html`.

**Interfaces:**
- Produces: `window.MissionASVABSR` = `{ review(state, grade, todayStr), isDue(state, todayStr), dueCount(statesObj, todayStr), SRStore }`. `state = { reps, intervalDays, ease, due }` (`due` = `YYYY-MM-DD`); `grade ∈ {'again','good','easy'}`. A missing/`null` state is a new card (due immediately).

- [ ] **Step 1: Write failing test** `tests/unit/spaced-repetition.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert');
const { loadScripts } = require('../helpers/load');
const { window } = loadScripts(['js/spaced-repetition.js']);
const { review, isDue } = window.MissionASVABSR;

test('new (null) card is due', () => {
  assert.strictEqual(isDue(null, '2026-07-04'), true);
});
test('again → due next day, interval reset to 1', () => {
  const s = review(null, 'again', '2026-07-04');
  assert.strictEqual(s.intervalDays, 1);
  assert.strictEqual(s.due, '2026-07-05');
});
test('good on new card → interval 1 → due next day', () => {
  const s = review(null, 'good', '2026-07-04');
  assert.strictEqual(s.intervalDays, 1);
  assert.strictEqual(s.due, '2026-07-05');
});
test('good again grows interval beyond 1', () => {
  const s1 = review(null, 'good', '2026-07-04');
  const s2 = review(s1, 'good', s1.due);
  assert.ok(s2.intervalDays > 1);
});
test('easy grows faster than good', () => {
  const g = review(null, 'good', '2026-07-04');
  const e = review(null, 'easy', '2026-07-04');
  assert.ok(e.intervalDays >= g.intervalDays);
});
test('not due before due date', () => {
  const s = review(null, 'good', '2026-07-04');
  assert.strictEqual(isDue(s, '2026-07-04'), false);
  assert.strictEqual(isDue(s, s.due), true);
});
```

- [ ] **Step 2:** run test → FAIL.
- [ ] **Step 3: Implement** `js/spaced-repetition.js` — an SM-2-lite scheduler (ease starts 2.3, `again`→reps 0/interval 1/ease−0.2 floor 1.3; `good`→reps+1, interval = reps<=1?1: round(prev*ease); `easy`→reps+1, ease+0.15, interval = round(max(good,prev*ease*1.3), min 2)), `due = addDays(todayStr, intervalDays)`, `isDue(state,today)= !state || state.due <= today` (string compare works on `YYYY-MM-DD`), `dueCount(obj,today)` counts entries where `isDue`. Include a date helper `addDays(str,n)` via UTC epoch-day math (mirrors streak.js). Plus `SRStore` = try/catch localStorage get/set of a `{cardId: state}` map under key `missionasvab.sp3.sr.<deck>`.
- [ ] **Step 4:** run test → PASS.
- [ ] **Step 5: Study-guide wiring.** In `study-guide.html` add `<script src="js/spaced-repetition.js">`. In `js/page-study-guide.js` flashcard tool: add a "Review (spaced repetition)" toggle. In SR mode, build the queue from cards where `isDue(store.get(deck)[cardId], today)`; after flipping, show Again/Good/Easy buttons that call `review`, persist via `SRStore`, and advance. Show a "Due today: N" badge. Leave the existing "flip through all" mode untouched. Deck id = `'vocab'` / `'formulas'`; card id = existing card's stable key (term/formula name).
- [ ] **Step 6:** `npm test` green; `check-no-inline-js` green (buttons wired via delegation, no inline handlers).
- [ ] **Step 7: Commit** `feat: spaced-repetition review mode for flashcards`.

### Task 4: Shareable score card

**Files:** Create `js/share-card.js`, `tests/unit/share-card.test.js`; modify `js/page-results.js`, `results.html`.

**Interfaces:**
- Produces: `window.MissionASVABShareCard` = `{ buildShareText(result), renderAndShare(result) }`. `result = { mode:'timed'|'tutor', afqtPercentile?:number, lineScores?:{code,score}[], dateStr }`. `buildShareText` is pure and returns `{ title:string, lines:string[] }` with NO personally-identifying data.

- [ ] **Step 1: Write failing test** `tests/unit/share-card.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert');
const { loadScripts } = require('../helpers/load');
const { window } = loadScripts(['js/share-card.js']);
const { buildShareText } = window.MissionASVABShareCard;

test('timed result shows AFQT percentile', () => {
  const t = buildShareText({ mode: 'timed', afqtPercentile: 72, dateStr: '2026-07-04' });
  assert.ok(t.lines.join(' ').includes('72'));
  assert.ok(/AFQT/i.test(t.lines.join(' ')));
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
```

- [ ] **Step 2:** run test → FAIL.
- [ ] **Step 3: Implement** `js/share-card.js`: `buildShareText` (pure — reads only `mode`, `afqtPercentile`, `lineScores`, `dateStr`; ignores everything else) + `renderAndShare(result)` that draws the text onto a 1080×1080 offscreen `<canvas>` (brand colors `#0a1628`/`#d4a853`, "Mission ASVAB" wordmark, "Practice result" caption), then `canvas.toBlob` → try `navigator.canShare({files})`+`navigator.share`, catch/absent → trigger a download of the PNG. All DOM APIs feature-detected.
- [ ] **Step 4:** run test → PASS.
- [ ] **Step 5: Results wiring.** In `results.html` add `<script src="js/share-card.js">` + a "Share result" button (hidden by default). In `js/page-results.js`, after scores render, populate a `result` object from the already-computed scores and show the button; on click call `renderAndShare`. Never include the user's name.
- [ ] **Step 6:** `npm test` green; `check-no-inline-js` green.
- [ ] **Step 7: Commit** `feat: shareable score card on results page`.

### Task 5: PWA install prompt

**Files:** Create `js/pwa-install.js`; modify `dashboard.html` (+ `index.html` if desired), `js/page-dashboard.js`.

**Interfaces:**
- Self-contained module `window.MissionASVABInstall.init(bannerEl)` — attaches `beforeinstallprompt`/`appinstalled` handlers and manages the dismiss flag.

- [ ] **Step 1: Implement** `js/pwa-install.js`: on `beforeinstallprompt` → `preventDefault()`, stash the event, and if `localStorage` dismiss flag (`missionasvab.sp3.installDismissed`) is not set, reveal `bannerEl` with an Install button (fires `evt.prompt()`) and a Dismiss button (sets the flag, hides banner). On `appinstalled`, hide + set flag. iOS Safari (no event, `navigator.standalone === false`, and not already dismissed): show a one-line "Add to Home Screen from your browser's Share menu" hint instead. All feature-detected and try/catch around storage.
- [ ] **Step 2: Wiring.** Add a hidden `<div id="install-banner" class="install-banner" hidden>` with Install/Dismiss buttons to `dashboard.html`, `<script src="js/pwa-install.js">`, and call `MissionASVABInstall.init(document.getElementById('install-banner'))` from `js/page-dashboard.js`. Buttons wired via `addEventListener`.
- [ ] **Step 3:** `node scripts/check-no-inline-js.js` green; `npm test` green (no logic test — DOM/event-only; covered by manual QA).
- [ ] **Step 4: Commit** `feat: dismissible PWA install prompt`.

### Task 6: Ship

- [ ] **Step 1:** Full gates: `npm test && node scripts/validate-site.js && node scripts/check-no-inline-js.js`.
- [ ] **Step 2:** Homepage Recent Updates: new top `<li>` (real date) — e.g. "Added a study-day streak, a test-date countdown with a paced plan, spaced-repetition flashcards, and shareable results." Keep 4, condense if same-day.
- [ ] **Step 3:** Merge branch → main, push (auto-deploys), confirm Vercel deploy READY.

## Self-Review Notes

- Spec coverage: countdown+plan (Task 2), streak (Task 1), SR flashcards (Task 3), shareable report (Task 4), install prompt (Task 5), ship+feed (Task 6). No DB anywhere. ✅
- Type consistency: `computeStreak`, `buildStudyPlan`, `review/isDue/dueCount/SRStore`, `buildShareText/renderAndShare`, `MissionASVABInstall.init` — names identical across tasks, wiring, and tests.
- Pure logic isolated from DOM/storage in every feature so unit tests need no jsdom.
