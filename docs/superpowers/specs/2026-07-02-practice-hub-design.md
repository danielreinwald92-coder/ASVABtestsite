# SP2 — Practice Hub

**Date:** 2026-07-02
**Status:** Approved design, awaiting implementation plan
**Depends on:** SP1 (tutor mode, `testConfig.mode`, explanations) — merged & deployed.
**Owner decisions baked in:** two-path hub (presets + custom section checklist);
real per-section timers with auto-advance (timed mode only); on-device
localStorage recent-seen buffer for repeat avoidance; AFQT only when all four
AFQT sections are present.

## Context

Today `select-test.html` offers only two presets (Quick AFQT / Full ASVAB) plus a
read-only "Sections Included" box — no way to practice an individual section from
the UI (custom tests are reachable only via the dashboard weak-area button or a
`?section=` URL param). Multi-section timed tests run on **one pooled clock** (sum
of all section limits) with free navigation across the whole test — unlike the
real CAT-ASVAB, which times each section separately. And question repeats are
avoided only **within a single session** (`usedQuestionIds`); retakes re-show
questions, which is acute given thin non-AFQT pools (AS 25, GS 30, EI 30, MC 35).

SP2 delivers a practice hub, real per-section timing, and cross-retake repeat
avoidance. It is the second of four planned sub-projects (SP1 done; SP3
motivation; SP4 GS/AS/MC/EI content).

## Goals

1. Let users start practice on any single section or custom subset from
   `select-test.html`, alongside the existing presets.
2. Time each section separately in timed multi-section tests, auto-advancing when
   a section's time expires (real CAT-ASVAB behavior).
3. Avoid re-showing recently-seen questions across retakes, degrading gracefully
   on thin pools.
4. Show an AFQT estimate only when it is actually valid (all four AFQT sections).

## Non-goals (deferred)

- Server-side / cross-device "seen" tracking (recent-seen is on-device only).
- Expanding the thin non-AFQT question pools (SP4).
- Changing tutor mode's untimed, free-navigation behavior.
- Persisting custom-practice section-timer state to Supabase.

## 1. Practice Hub UI

**Files:** `select-test.html`, `js/page-select-test.js`.

- Keep the two preset cards (Quick AFQT, Full ASVAB) as one-click starts.
- Add a **"Practice by section"** panel: a checklist of all 8 sections rendered
  from `SECTION_CONFIG`/`QuizManager` (name, code, `questionsPerTest`,
  `timeLimit` in minutes). Each row is a labeled checkbox (keyboard-operable).
- **Live summary** under the checklist: "Selected: N sections · Qq · M min"
  (Q = sum of `questionsPerTest`, M = `ceil(sum(timeLimit)/60)`; in tutor mode
  show "untimed" instead of minutes).
- **Preset ↔ custom interaction:** selecting a preset card checks exactly that
  preset's sections and highlights the card; toggling any checkbox clears the
  preset highlight (state becomes "custom"). The single **Start** button always
  reflects the current selection.
- **Tutor toggle** (from SP1) sits with the Start control and applies to whichever
  path is active → `testConfig.mode`.
- **Start** enabled when the name field has ≥2 chars AND ≥1 section is selected;
  disabled with a hint otherwise.
- On Start: write `testConfig = { sections, mode }` to sessionStorage and navigate
  to `test-intro.html` (same flow as today). `testType` is derived from the
  section set: `quick` if it equals the AFQT four (`AR,WK,PC,MK` as a set), `full`
  if it equals all 8, else `custom`. Persist `testType` to localStorage as today.
- All behavior wired via `addEventListener` in `page-select-test.js` — no inline
  JS/handlers (strict CSP / `check-no-inline-js.js`).

## 2. Per-section timers + auto-advance (timed mode only)

**Files:** `js/quiz-engine.js`, `quiz.html`.

The engine currently pools one timer = `Σ section timeLimit`. Replace with a
per-section countdown for **timed** mode. Tutor mode keeps its untimed,
free-navigation behavior unchanged.

**Section model:** the ordered `testSections` define section boundaries. The
engine tracks:
- `activeSectionIndex` (0-based into `testSections`),
- `sectionTimeRemaining` (seconds left in the active section),
- a set/marker of completed section codes.
Precompute, per section, the slot index range `[start, end)` in `quizData.questions`.

**Header/UI:** the quiz header shows "Section X of N: <name>" and the active
section's countdown (`timerDisplay` reused). SR warnings + color thresholds apply
per section (e.g. announce at 60s and 30s left when the section is long enough;
choose thresholds proportional to the section limit so short sections still warn).

**Navigation scoping (timed):**
- Prev and the navigator only move **within the active section's slot range**.
- The navigator renders **only the active section's questions** (numbered within
  the section), so completed/future sections are not reachable from it.
- You **cannot return to a completed section**.
- "Next" on the last question of a non-final section triggers **advance to the
  next section**; on the final section it triggers the existing submit-confirm.
- "Must answer to advance" behavior within a section is unchanged.

**Advance / expiry:**
- Advancing to a section (by finishing it or by timer expiry) sets
  `activeSectionIndex++`, resets `sectionTimeRemaining` to the new section's
  `timeLimit`, materializes/points at its first slot, and restarts the countdown.
- **Timer hits 0:** mark the current section complete (its unanswered slots stay
  unanswered = wrong, as today), then advance. If it was the final section →
  `submitQuiz()`.
- Manual advance before expiry (finishing a section early) is allowed and behaves
  the same (mark complete, advance). No extra confirm is needed: "must answer to
  advance" already guarantees every earlier question in the section is answered by
  the time the user reaches its last question.

**Save/resume:** `saveState()` persists `activeSectionIndex`,
`sectionTimeRemaining`, and completed-section markers alongside existing state;
`loadSavedState()` restores them and resumes the active section's countdown. The
visibility-pause behavior (pause on hidden, resume on visible) is preserved but
now pauses/resumes the **section** timer.

**Single-section timed test:** one section, one countdown = that section's limit —
behaves like today minus the pooled-sum quirk.

**Backward-compatible resume:** a saved state from before SP2 (no
`activeSectionIndex`) is **discarded and the test regenerated fresh** — mid-test
sessionStorage resume across a single deploy is rare and low-value, and this
avoids fragile migration of pooled-timer state into the per-section model. Detect
via the absence of `activeSectionIndex` in the saved `quizState`.

## 3. Repeat avoidance

**Files:** new `js/recent-seen.js`; hook in `js/quiz-engine.js` (and it is used
by the adaptive selection path in `js/quiz-data.js`).

- `js/recent-seen.js` exposes a small DOM-free API on `window.MissionASVABRecentSeen`
  (and `module.exports` for tests):
  - `getRecent(sectionCode) -> string[]` — recently-shown bank question ids for
    that section (most-recent last), read from localStorage.
  - `record(sectionCode, ids)` — append shown ids, dedupe, and **cap** the stored
    list to `min(storedCap, poolSize(sectionCode) - questionsPerTest(sectionCode))`
    so the exclusion set can never make a section unfillable. Oldest entries drop
    first.
  - Storage key namespaced (e.g. `recentSeen:v1`), one entry per section code.
  - All access wrapped in try/catch → if localStorage is unavailable/quota-full,
    every method degrades to a no-op (repeats allowed, no crash).
- **Exclusion at selection:** when the engine materializes a slot, it passes the
  exclusion set `usedQuestionIds ∪ getRecent(section)` to the adaptive selector.
  The selector already filters by a used-id set; the recent-seen ids are added to
  that set for selection only.
- **Relaxation:** if the filtered pool at the current ability can't yield a
  question, fall back to the current behavior (session `usedQuestionIds` only),
  i.e. allow a recently-seen question rather than fail. The cap above makes this
  rare; the fallback guarantees a test always fills.
- **Recording:** on submit (and safe to also do incrementally as slots
  materialize), record the shown `originalId`s per section via `record()`.
- Works identically for guests and logged-in users; no Supabase change.

## 4. Scoring correctness — AFQT only when valid

**Files:** `js/quiz-engine.js` (call-site gate; `scoring.js` untouched).

- The engine computes `afqt` only when the test's section set includes **all
  four** AFQT sections (`AR, WK, PC, MK`): `includesAllAFQT = AFQT.every(s =>
  testSections.includes(s))`. Otherwise `afqt = null` → the results page shows a
  practice score (existing null-AFQT path).
- Tutor mode already forces `afqt = null` (SP1); this rule additionally covers
  timed custom subsets.
- Line scores remain `full`-only (unchanged).
- `scoring.js` and its invariant/characterization tests are **not modified** — the
  rule lives at the engine call site, so `calculateAFQTEstimate` keeps its current
  contract for the preset paths that already pass all four sections.

## Error handling summary

| Failure | Behavior |
|---|---|
| 0 sections selected | Start disabled with a hint |
| Section pool can't fill under recent-seen exclusion | Relax to session-used-only; always fills |
| localStorage unavailable / quota | recent-seen no-ops; repeats allowed; no crash |
| Resume mid-section | Restore active section + remaining time; legacy state (no `activeSectionIndex`) → discard + regenerate |
| Custom subset lacking all 4 AFQT sections | `afqt=null` → practice score, no eligibility copy |
| Timer expiry on final section | Submit |

## Testing

- `node:test` + jsdom:
  - Hub selection → `testConfig`/`testType` mapping (quick/full/custom detection,
    ≥1-section + name gating, summary math).
  - Per-section timing: advance on finish, lock+advance on expiry, submit on final
    expiry, navigation confined to the active section range, no return to
    completed sections, save/resume of `activeSectionIndex` + `sectionTimeRemaining`.
  - `recent-seen`: cap never exceeds `poolSize - questionsPerTest`; oldest-drop;
    exclusion applied; relaxation fallback fills; localStorage-failure no-op.
  - AFQT gate: all-4 present → number; any missing → null.
- Existing 94 tests stay green; `scoring.js` invariants untouched.
- `validate-site.js` + `check-no-inline-js.js` stay green.
- Manual browser pass: custom section start; timed multi-section auto-advance +
  section lock; tutor mode unaffected; resume mid-section; strict-CSP console clean.

## Implementation order

1. **Scoring gate + recent-seen module** — smallest, isolated, well-tested units
   with no UI coupling. Ship.
2. **Per-section timers + navigation scoping + save/resume** — the engine core.
   Ship.
3. **Practice Hub UI** — wire selection → `testConfig`; depends on nothing above
   but is the user-visible entry point. Ship.

## Risks

- **Per-section navigation rework** is the highest-risk change (touches timer,
  navigator, save/resume, submit). Mitigate with characterization tests on the
  existing timed flow before refactoring, and thorough per-section unit tests.
- **Legacy in-progress resume** across the SP2 deploy — handle old saved state
  without crashing (fallback path).
- **Thin pools + recent-seen** could starve selection — the cap + relaxation
  fallback prevent unfillable tests; covered by tests.
