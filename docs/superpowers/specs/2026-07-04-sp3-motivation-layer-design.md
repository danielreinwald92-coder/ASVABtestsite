# SP3 — Motivation Layer (Design Spec)

**Date:** 2026-07-04
**Status:** Owner-delegated ("you make the decisions and implementations"). Decisions documented below.
**Depends on:** SP1, SP2, SP4 (all shipped). Builds on existing `profiles.test_date`,
`test_results` history, the study-guide flashcard tool, and the PWA/service-worker setup.

## Goal

Turn one-off practice into sustained study habit. Five features from the roadmap:
test-date countdown + paced study plan, spaced-repetition flashcards, study streaks,
shareable score report, and a PWA install prompt.

## Key scoping decision — NO new DB tables

Every SP3 feature is built **client-side** on data we already have. This matches the
low-risk, additive philosophy of SP4 and avoids new Supabase tables / RLS surface (the
privilege-escalation lesson in LEARNED makes new writable tables the highest-risk change
we can make). Specifically:

- **Streaks** are *derived* from existing `test_results` timestamps — no stored counter.
- **Spaced-repetition flashcard state** persists in `localStorage` (on-device), the same
  pattern as `js/recent-seen.js`. Account-sync is explicitly deferred as a future additive
  enhancement; it would need a new table + RLS and is not worth the risk for the MVP.
- **Countdown / study plan** read `profiles.test_date` (already collected) and existing
  weak-area data. No schema change.
- **Shareable report** and **install prompt** are pure frontend.

Result: SP3 ships with **zero DB migrations**, like SP2/SP4.

## Features

### 1. Test-date countdown + paced study plan (dashboard)
- If `profiles.test_date` is set and in the future: a **countdown card** ("18 days until
  your ASVAB") at the top of the dashboard. If unset: a prompt to add a test date (links to
  the existing account test-date field). If past: a gentle "update your test date" nudge.
- A **paced study plan**: given days remaining and the user's weakest sections (from the
  existing weak-areas aggregation), render a short ordered checklist ("This week: focus on
  Arithmetic Reasoning and Word Knowledge"). Buckets: far out (>21 days) = broad coverage;
  mid (7–21) = weak-area focus; close (<7) = full-practice-test emphasis. Static logic, no
  storage of plan state.

### 2. Study streak (dashboard)
- Compute the current daily streak and longest streak from distinct calendar days present in
  `test_results` (any mode counts). Show a small flame/number card ("5-day streak"). Purely
  derived on load; no writes. Uses the user's local date.

### 3. Spaced-repetition flashcards (study guide)
- Extend the existing flashcard tool (`js/page-study-guide.js`, vocab + formulas) with an
  optional **"Review" (spaced repetition)** mode. Each card gets a lightweight SM-2-lite
  schedule (again / good / easy → interval in days) stored in `localStorage` keyed by card id.
- A "Due today" count surfaces cards whose next-review date has arrived. Cards without state
  are treated as new. All on-device; clearing storage resets progress (documented, acceptable).
- Keep the existing "flip through all" mode unchanged for users who don't want SR.

### 4. Shareable score report (results page)
- After a scored (timed) test, a **"Share result"** action renders a self-contained summary
  **card** (AFQT percentile + a few line scores + date + site name) to an offscreen `<canvas>`,
  then offers the OS share sheet via `navigator.share`/`navigator.canShare` (files) with a
  **download PNG fallback**. No server, no upload; the image is generated locally.
- Tutor/practice sessions (no AFQT) get a simpler "I practiced on Mission ASVAB" card.
- Copy is encouraging and non-identifying (no name unless the user's own display).

### 5. PWA install prompt
- Capture `beforeinstallprompt`, suppress the mini-infobar, and show a **dismissible custom
  banner** ("Add Mission ASVAB to your home screen") on the dashboard/home. Respect dismissal
  via `localStorage` (don't re-nag). Fire the saved prompt on click. iOS (no event) gets a
  one-line "Add to Home Screen from the share menu" hint, shown at most once.

## Architecture / where code lives

New per-feature modules, wired via `addEventListener` (strict CSP: no inline JS):

- `js/streak.js` — pure function `computeStreak(testResultDates, today) → {current, longest}`.
  Unit-tested in isolation.
- `js/study-plan.js` — pure function `buildStudyPlan({daysRemaining, weakSections}) → plan`.
  Unit-tested.
- `js/spaced-repetition.js` — pure SR scheduler (`review(cardState, grade, today) → newState`,
  `isDue(cardState, today)`) + a thin `localStorage` store wrapper. Scheduler unit-tested.
- `js/share-card.js` — canvas rendering + Web Share/download. (DOM-side; lightly tested via
  the pure layout/text-builder portion.)
- `js/pwa-install.js` — install-prompt banner logic.
- Dashboard wiring (`js/page-dashboard.js`/`dashboard.js`) consumes streak + countdown +
  study-plan + install banner. Study-guide wiring adds the SR review mode. Results wiring
  (`js/page-results.js`) adds the share action.

Each new file has ONE clear responsibility, and the pure logic (streak, plan, SR scheduler)
is separated from DOM/storage so it can be unit-tested without jsdom.

## Testing

- `computeStreak`: no results → 0/0; consecutive days → correct current/longest; a gap resets
  current but preserves longest; multiple results same day count once; today vs yesterday edge.
- `buildStudyPlan`: bucket boundaries (>21, 7–21, <7, 0/past), empty weak-sections fallback.
- SR scheduler: new card, again resets interval, good/easy grow interval, `isDue` boundaries.
- Share-card text builder: AFQT vs practice variants produce expected strings, no PII leak.
- Existing 119-test suite stays green; all changes additive.

## Gates & ship

- `npm test` (with new unit tests), `validate-site`, `check-no-inline-js` all green.
- Ships as one branch (features are small and share the dashboard surface), merged to main
  (auto-deploys). Homepage Recent Updates entry on ship.
- Manual browser QA (canvas share, install prompt) is noted as owner-side, same as prior SPs
  (no browser env here).

## Out of scope (deferred, additive later)

- Account-synced flashcard/SR progress across devices (needs new table + RLS).
- Push notifications / reminder emails.
- Leaderboards or social features.

## Success criteria

- Dashboard shows an accurate countdown (when a test date is set), a derived streak, and a
  sensible paced plan.
- Study guide offers a working spaced-repetition review mode persisted on-device.
- Results page can generate and share/download a summary card locally.
- A dismissible install prompt appears where supported and does not re-nag.
- Zero DB changes; all gates green; no regression.
