# SP1 — Question Explanations + Tutor Mode

**Date:** 2026-07-02
**Status:** Approved design, awaiting implementation plan
**Owner decisions baked in:** single-explanation format; tutor sessions feed weak-areas only; architecture = separate lazy explanations file (Approach A).

## Context

Mission ASVAB's 607-question bank (`js/quiz-data.js`) has zero answer explanations — the
results review shows *what* was correct, never *why*. Explanations exist only inside
`js/courses.js` chapter quizzes. There is also no untimed practice mode: every quiz runs
the timer. This sub-project (SP1) closes both gaps. It is the first of four planned
sub-projects (SP2 practice hub, SP3 motivation layer, SP4 GS/AS/MC/EI content).

## Goals

1. Every question in the bank has one high-quality explanation, shown in the results
   review for **all** test modes.
2. A tutor mode: untimed, instant per-question feedback with the explanation, reusing
   the existing CAT engine.
3. Tutor sessions improve weak-area analysis and the study plan without polluting the
   AFQT progress chart.
4. Authoring doubles as a full answer-key audit of the bank.

## Non-goals (deferred)

- Redesigning `select-test.html` into a practice hub (SP2).
- Per-option rationales (single explanation per question only).
- New study content or bigger question pools (SP4).
- Explanations served from Supabase — static file only.

## 1. Data — `js/explanations.js`

- Flat map, classic-script global (matches `quiz-data.js` pattern):
  `window.QUIZ_EXPLANATIONS = { "<question-id>": "<explanation>", … }`.
- Loaded on demand via a dynamic-script helper (same pattern as lazy `courses.js` on
  study-guide). Never loaded during timed quizzes.
- Added to the service-worker precache so offline tutor sessions and offline results
  review keep explanations.
- Content style: 2–4 sentences. AR/MK: worked steps. WK: definition + usage/memory
  hook. PC: what in the passage justifies the answer. GS/AS/MC/EI: the fact or
  principle and why it applies. Where a distractor is a known trap, one sentence may
  name it.
- **Authoring process:** generated in per-section batches; each batch adversarially
  verified — the verifier must independently justify the keyed correct answer *before*
  seeing the explanation. Questions whose key cannot be justified are flagged to the
  owner as suspected answer-key errors (not silently explained around). Batches land
  incrementally, AFQT sections (WK, PC, AR, MK) first.

## 2. Build gates

`scripts/validate-site.js` (also the Vercel build gate) gains contracts:

- Every question ID in `quiz-data.js` has a non-empty explanation.
- No orphan explanation IDs (explanation without a question).
- Length sanity bounds: 40–600 characters (guard against truncated/runaway entries).

Mirrored as `node:test` cases. Gate activates per-section as batches land (staged
allowlist) so partial coverage never blocks deploys mid-rollout; once all 607 are in,
the allowlist is removed and full coverage is enforced.

## 3. Tutor mode (quiz engine)

- Entry: `quiz.html?mode=tutor`; composes with existing `?section=` param.
- Timer hidden and never started; no auto-submit; "Save & Exit" unchanged.
- Flow: select answer → answer **locks** (feedback reveals the key, so later changes
  would be meaningless) → feedback panel shows ✓/✗, highlights the correct option,
  renders the 💡 explanation → "Next" button advances.
- Keyboard: A–D answers; Enter/→ advances after feedback. Flagging (F) unchanged.
- CAT slot materialization and ability adjustment unchanged.
- Navigator dots show green/red (correct/incorrect) in tutor mode instead of
  answered/unanswered.
- All new UI wired via `addEventListener` in external JS — the strict CSP /
  `check-no-inline-js.js` gate must stay green.
- Graceful degradation: if `explanations.js` fails to load, feedback still shows
  ✓/✗ and the correct option; the explanation block is hidden.

## 4. Recording — feed weak-areas only

- Additive migration on `test_results`: `mode text not null default 'timed'`
  (`'timed' | 'tutor'`); confirm `afqt_score`/`line_scores` accept null for tutor rows
  (relax constraints if needed — additive/safe only).
- Tutor rows save `question_results` (and per-section accuracy) as usual;
  `afqt_score` and `line_scores` are null.
- `weak-areas.js`: aggregates **all** rows — practice mistakes improve the focus panel
  and study plan.
- `dashboard.js`: progress chart, latest-score card, and deltas filter to
  `mode = 'timed'` rows only. History lists tutor sessions labeled **"Practice"** with
  per-section accuracy, no AFQT.
- `results.html` for tutor sessions: accuracy summary + full review, no AFQT
  percentile, no line scores, no enlistment-eligibility copy.
- Guests: tutor results stay in localStorage exactly like timed guest results.

## 5. Results review upgrade (all modes)

- The existing review on `results.html` (All/Incorrect/Correct filters) gains a 💡
  explanation block under each reviewed question.
- `explanations.js` is lazy-loaded when the review section first renders.
- Ships first, independently of tutor mode — timed tests gain value immediately.
- Missing file or missing ID → block simply doesn't render.

## 6. Entry points (minimal; SP2 supersedes)

- `select-test.html`: an "Untimed tutor mode" toggle on the mode cards → appends
  `mode=tutor`.
- Dashboard "Practice My Weak Areas" launches in tutor mode by default.
- `test-intro.html`: copy adapts in tutor mode (no timer rules/warnings).

## Error handling summary

| Failure | Behavior |
|---|---|
| `explanations.js` load fails | Review/tutor degrade to ✓/✗ + correct answer; no explanation block |
| Explanation missing for an ID | Block hidden at runtime; build gate prevents at deploy time |
| Supabase insert fails (tutor) | Existing offline queue / save-retry banner path, unchanged |
| Suspected wrong answer key found while authoring | Flagged to owner with reasoning; question skipped until resolved |

## Testing

- `node:test` + jsdom: tutor-mode engine behavior (no timer, lock-on-answer, feedback
  panel, navigator colors, summary path), explanations contract, dashboard timed-only
  filtering, weak-areas inclusion of tutor rows.
- `validate-site.js` contracts (§2) run as the build gate.
- Existing 76 tests stay green; scoring invariants untouched (tutor rows produce no
  AFQT).
- Manual click-through of quiz/results/select-test/dashboard under the strict CSP.

## Implementation order

1. **Explanations infrastructure + results review** — `explanations.js` scaffold,
   lazy loader, review block, build gates (staged), SW precache entry. Ship.
2. **Tutor mode** — engine flag, feedback UI, recording migration + dashboard/history
   filtering, entry points. Ship.
3. **Content batches** — per-section explanation authoring with adversarial key
   verification; AFQT sections first; remove gate allowlist when complete.

## Risks

- **Answer-key errors surfaced by authoring** — expected; treated as a feature
  (audit), flagged not auto-fixed.
- **`afqt_score` nullability** — verify actual column constraints before the
  migration. If the column is NOT NULL, dropping that constraint is the intended
  (additive-safe) fix; only if something blocks it does the plan need an alternative.
- **CSP regressions** — all new UI must pass `check-no-inline-js.js`; no inline
  handlers.
- **Dashboard chart regressions** — characterization tests before filtering change.
