# IRT Scoring v2 — Real-ASVAB Scoring Engine Design

- **Date:** 2026-08-06
- **Status:** Approved by owner (2026-08-06) — approach "A: full overhaul in one go", engine-only scope
- **Supersedes:** the linear %-correct scoring model in `js/scoring.js` and §Percentile Scoring of `docs/scoring-methodology.md`

## 1. Context and problem

The site currently scores practice tests by mapping each section's % correct linearly onto the
20–80 standard-score band, averaging WK/PC into VE, and converting `(2·VE + AR + MK)/2` to a
percentile with a normal CDF fit to three anchor points. A comprehensive review (2026-08-06) found
five compounding fidelity gaps versus the real CAT-ASVAB:

1. **Difficulty-blind scoring under an adaptive engine.** quick/full tests adapt question
   difficulty to a running ability ladder, but scoring sees only correct/total. Strong test-takers
   are fed harder questions, miss more, and get systematically compressed toward the middle
   (weak test-takers inflated symmetrically).
2. **VE is officially a weighted composite** (PC ≈ 0.62 the weight of WK — PC is the least
   reliable subtest), not a 50/50 average.
3. **The AFQT percentile conversion is published** (PAY97 empirical table, left-skewed); our
   symmetric normal fit is off by up to ~10 percentile points in parts of the range.
4. **Army line scores are on the wrong scale.** Official composites use a published weight matrix
   and are reported mean 100/SD 20; our straight standard-score sums center near 150 for
   three-subtest composites, so users cannot compare against real MOS cutoffs (e.g. GT ≥ 110).
5. **Unanswered items count as wrong**; the real test applies a documented
   random-guessing-equivalent penalty.

The research (two deep-dives, 2026-08-06) established that **everything downstream of the item
parameters is public**: the exact Bayesian update equations the CAT engine runs, the official
theta→standard-score transforms, the VE/AS composite formulas, the full AFQTS→percentile table,
and the Army composite weight matrix. Only per-item IRT parameters (a, b, c) are non-public; we
estimate those and design for later empirical calibration.

## 2. Goal and non-goals

**Goal:** make the scoring pipeline structurally identical to the operational CAT-ASVAB, with
item parameters as the single documented estimate. Results remain a practice estimate — but a
faithful one, citable to primary sources.

**Non-goals / out of scope (explicit):**
- AO (Assembling Objects) stays excluded (deliberate 2026-05 decision; not in AFQT or Army line scores).
- AS stays a single combined section (disclosed on About page); no AI/SI split.
- No hidden tryout items, no Sympson-Hetter exposure control (item security is a non-problem for
  a practice site; variety comes from randomesque selection + the recent-seen buffer).
- No new question content in this project (hard-item expansion for MK/PC d4–d5 deferred to a
  follow-up by owner decision).
- No empirical item recalibration yet — this project starts *collecting* the per-item data that
  enables it.
- Diagnostic mode unchanged (fixed 18-question blueprint, no AFQT — by design).

## 3. Research foundation

Primary sources (local extracts in `docs/research/`):

- **Segall, D.O. (2004), *Development and Evaluation of the 1997 ASVAB Score Scale*, DMDC**
  (`segall1997.txt`) — official composite definitions, Form 04D transforms (Table 2.4), VE/AS
  formulas (eqs. 2.3–2.4), AFQT percentile table (Table 2.5), Army weights (Table 2.7), GT
  formula. https://www.officialasvab.com/wp-content/uploads/2019/08/1997score_scale.pdf
- **ASVAB Technical Bulletin No. 1** (`techbulletin1.txt`) — CAT-ASVAB item selection, Owen
  interim estimation, posterior-mode final scoring, incomplete-test penalty (Segall 1988),
  reliabilities. https://www.officialasvab.com/wp-content/uploads/2019/08/asvab_techbulletin_1.pdf
- **ASVAB Technical Bulletin No. 3** (`asvab_tb3.txt`) — Forms 5–9 3PL item-parameter pool
  statistics (Tables 2.27–2.36), N(0,1) prior decision, BILOG-MG calibration.
  https://www.officialasvab.com/docs/asvab_techbulletin_3.pdf
- **van der Linden (1996), RR-96-01** (`eric_vdl.pdf`, `owen_pg22.png`, `owen_pg23.png`) — Owen's
  update equations A.1–A.6 verbatim. https://files.eric.ed.gov/fulltext/ED424235.pdf
- **DMDC (2004), ASVAB Norms for the CEP** (`cep_norms.txt`) — per-subtest SS→percentile youth
  population curves (display/context). https://prod-media.asvabprogram.com/CEP_PDF_Contents/ASVAB_Norms.pdf
- NLSY79 Attachment 106 scans (`att106/`) — 1980-metric conversion tables (context only; v2 uses
  the '97 scale).

## 4. Architecture

New pure-logic modules (no DOM, unit-testable, IIFE + CommonJS export like `scoring.js`):

```
js/irt.js          # 3PL p(θ), Fisher information, Owen interim update, MAP final estimate + SEM
js/irt-params.js   # per-item (a,b,c) assignment; official constant tables (SS transforms,
                   #   VE/AS composites, AFQTS→percentile table, Army weight matrix)
js/scoring.js      # REWRITTEN: consumes per-question response records; runs official pipeline
js/quiz-engine.js  # interim ability via Owen; max-info selection; theta/SEM/difficulty in results
scripts/generate-penalty-table.js  # offline simulation → committed penalty coefficients JSON
```

Data flow: `quiz-engine` materializes slots via max-info selection at the current Owen interim
theta → per-question records `{id, section, difficulty, correct}` → `scoring.js` re-estimates
final MAP theta per section from the full response set → official transforms → SS, VE, AFQTS,
percentile, line scores → results/persistence.

## 5. Item parameters (the estimated link)

Per-item 3PL parameters derived from the 1–5 difficulty tag and published pool statistics:

- `b = B_MEAN[section] + OFFSET[tag] × B_SD[section]`, `OFFSET = {1: −1.5, 2: −0.75, 3: 0, 4: +0.75, 5: +1.5}`
- `a = A_MEAN[section]` (constant within section until empirical calibration)
- `c = C_MEAN[section]`

Published pool statistics (TB3 Tables 2.27–2.36, midpoints of the Forms 5–9 ranges; AS = mean of
AI/SI):

| Section | a | b mean | b SD | c |
|---|---|---|---|---|
| GS | 1.07 | +0.15 | 1.25 | 0.19 |
| AR | 1.31 | −0.04 | 1.10 | 0.175 |
| WK | 1.50 | −0.16 | 1.20 | 0.215 |
| PC | 1.26 | −0.36 | 1.10 | 0.18 |
| MK | 1.45 | +0.44 | 0.95 | 0.17 |
| EI | 1.18 | −0.03 | 1.30 | 0.21 |
| AS | 1.34 | −0.03 | 1.15 | 0.185 |
| MC | 0.95 | +0.01 | 1.20 | 0.19 |

Override hook: `irt-params.js` consults an optional calibration table
(`calibrated[item.id] → {a,b,c}`) before the heuristic. Empty at launch; a future project fills it
from accumulated `question_results` response data (the same way the real pools were calibrated).

Known consequence: with constant a/c within a section, max-information ordering reduces to
b-proximity — a smoother version of the current ladder. Acceptable; per-item variation arrives
with calibration.

## 6. Ability estimation

**Interim (drives selection), after each locked answer** — Owen's Bayesian update (TB1 Ch. 3;
equations per van der Linden RR-96-01 A.1–A.6). With posterior mean μ, variance σ², item (a,b,c),
normal-ogive metric (divide logistic a by 1.702), φ/Φ = standard normal pdf/cdf:

```
ξ  = (b − μ) / sqrt(a⁻² + σ²)
P* = c + (1−c)·Φ(−ξ)                        # predictive P(correct)
correct:   μ′ = μ + (1−c)·σ²·(a⁻²+σ²)^(−1/2)·φ(ξ)/P*
           σ²′ = σ²·{1 − (1−c)·(1 + a⁻²/σ²)^(−1)·(φ(ξ)/ζ)·((1−c)·φ(ξ)/ζ − ξ)},  ζ = c+(1−c)Φ(ξ)
incorrect: μ′ = μ − σ²·(a⁻²+σ²)^(−1/2)·φ(ξ)/Φ(ξ)
           σ²′ = σ²·{1 − (1 + a⁻²/σ²)^(−1)·(φ(ξ)/Φ(ξ))·(φ(ξ)/Φ(ξ) + ξ)}
```

Prior: N(0,1) (TB3 §4.2 decision). Persisted in the generated-test state for resume (replacing
`abilityLevels`).

Metric convention: published ASVAB a-parameters follow the D=1.7 normal-metric convention. Use
`a` directly in Owen's normal-ogive equations above; use the logistic 3PL with the D=1.702 factor
(`P(θ) = c + (1−c)/(1+exp(−1.702·a·(θ−b)))`) for the MAP likelihood and Fisher information, so
both stages agree. Unit tests must validate the Owen implementation against hand-computed values
from the scanned primary source (`docs/research/owen_pg22.png`/`owen_pg23.png`).

**Final score** — posterior mode (MAP) of the 3PL likelihood × N(0,1) prior over all answered
scored items in the section, computed by dense grid search over θ ∈ [−4, +4], step 0.01 (801
points; trivial for ≤15 items; no further refinement — 0.01 θ ≈ 0.1 SS point). Matches the
official estimator choice (order-independent; defined for all-correct/all-wrong; low-information
results regress toward the mean). **SEM** = posterior SD computed on the same grid.

**Incomplete-test penalty** — official method (TB1 Ch. 3 §7): final theta adjusted so the score is
equivalent in expectation to random guessing on unreached items. `scripts/generate-penalty-table.js`
replicates the official derivation offline: sample true θ uniform [−3,3], simulate k answered items
via the v2 engine, append random responses (P(correct) = 0.2 per official spec — retain their
constant, not 1/4) for the remainder, regress full-test MAP on partial-test MAP → per
(section, unanswered-count) linear coefficients `{A, B}`, committed as
`js/penalty-table.js` data. Runtime: `θ_final = A + B·θ_answered`. Replaces "unanswered = wrong."

## 7. Item selection (quick/full modes)

At slot materialization: compute Fisher information at the current interim μ for every available
item (not used this session, not in recent-seen buffer; existing relaxation ladder retained),
select uniformly at random among the **top 5** most informative ("randomesque" — replaces
Sympson-Hetter for a practice context). First item per section: μ = 0. Diagnostic keeps its fixed
`difficultyPlan`; tutor mode unchanged.

## 8. Official score pipeline (exact public math)

1. **Standard scores** (Segall Table 2.4, Form 04D; integers via `Math.round`; **no 20–80
   truncation** — the prior handles extremes, matching the '97 scale decision):
   `SS = A·θ + B` with (A, B): GS 11.543462/48.988873, AR 11.528721/48.365417,
   WK 11.032817/47.809880, PC 12.351821/45.886521, MK 10.025804/46.255061,
   MC 12.957792/51.247394, EI 11.034039/51.159592.
2. **VE** (eq. 2.3): `SS_VE = 7.225587·θ_WK + 5.010103·θ_PC + 46.897156`, rounded.
3. **AS** (eq. 2.4 degenerate, single combined θ): `SS_AS = 14.639259·θ_AS + 56.220220`, rounded.
4. **AFQT**: `AFQTS = SS_AR + SS_MK + 2·SS_VE` (rounded SS per official definition) → percentile
   by verbatim lookup of Segall Table 2.5, encoded as contiguous ranges:

```
≤109→1  110-118→2  119-124→3  125-133→4  134-137→5  138-141→6  142-145→7
146-147→8  148-151→9  152-153→10  154-156→11  157→12  158-159→13  160→14
161-162→15  163-164→16  165-166→17  167→18  168-169→19  170→20  171→21
172-173→22  174→23  175→24  176-177→25  178→26  179→27  180→28  181→29
182→30  183→31  184→32  185→33  186→34  187-188→35  189→36  190→38  191→39
192→40  193→41  194→42  195→43  196→44  197→45  198→46  199→47  200→48
201→49  202→50  203→51  204→52  205→53  206→54  207→55  208→56  209→57
210→59  211→60  212→61  213→62  214→63  215→64  216→66  217→67  218→68
219→69  220-221→70  222→71  223→72  224→73  225→74  226→75  227→76  228→77
229→78  230→79  231→80  232→81  233-234→82  235→83  236→84  237-238→85
239→86  240→87  241-242→88  243→89  244-245→90  246→91  247-248→92
249-251→93  252-253→94  254-256→95  257-259→96  260-263→97  264-268→98  ≥269→99
```
   (Percentiles 37, 58, and 65 are absent from the official table — verified against the verbatim
   source; the gaps are correct, not typos.)
5. **Army line scores** — reported scale mean 100/SD 20, directly comparable to MOS cutoffs:
   - `GT = Rnd(1.074292 × (SS_AR + SS_VE) − 7.443781)` (rounded SS inputs)
   - Nine non-integer composites (Segall Table 2.7, applied to **unrounded** standard scores in
     order GS AR MK MC EI AS VE, plus constant; round the final value):

| | GS | AR | MK | MC | EI | AS | VE | Constant |
|---|---|---|---|---|---|---|---|---|
| CL | .00000 | .75179 | .58715 | .11541 | .07756 | .07489 | .67976 | −14.32772 |
| CO | .19868 | .33090 | .63397 | .38486 | .19979 | .41161 | .30347 | −23.17105 |
| EL | .08324 | .44254 | .49064 | .26341 | .30258 | .36786 | .49906 | −22.46667 |
| FA | .15031 | .42263 | .60172 | .42966 | .16389 | .35866 | .31958 | −22.32119 |
| GM | .23521 | .46357 | .45285 | .29280 | .30216 | .50542 | .21527 | −23.36174 |
| MM | .05942 | .32829 | .28517 | .39607 | .30796 | .87309 | .21150 | −23.08481 |
| OF | .14306 | .53676 | .34092 | .36843 | .19683 | .50334 | .36757 | −22.84882 |
| SC | .01235 | .42812 | .63650 | .25070 | .32194 | .24636 | .52770 | −21.18951 |
| ST | .12865 | .49010 | .47825 | .31207 | .14493 | .21736 | .62177 | −19.65219 |

   Line scores still require all 8 sections; the legacy "5 of 8" partial-data path is removed
   (same bogus-score rationale as the AFQT gate).

## 9. Quiz-flow fidelity change

In quick/full (CAT) modes: submitting an answer locks it and advances; the Previous button is
removed/hidden. UI copy: "Like the real CAT-ASVAB, you can't return to a question after
answering." Tutor mode and the diagnostic keep current navigation. This is required for coherent
interim estimation (Owen updates assume a locked response sequence) and matches the real test.

## 10. Persistence and display

- **Migration** (additive, `supabase/migrations/`): `ALTER TABLE test_results ADD COLUMN
  scoring_version text;` New results write `'irt-v2'`; null = legacy model. Requirement: if
  column-level INSERT grants are active on `test_results` (see the `profiles.is_admin` LEARNED
  lesson), the migration must grant INSERT on the new column to `authenticated`; verify with
  `has_column_privilege('authenticated','test_results','scoring_version','INSERT')`.
- `section_scores` per-section jsonb gains `theta` (2dp), `sem` (2dp), `ss` (int) alongside
  `correct`/`total`. `question_results` items gain `difficulty` (1–5). Update the exact-shape
  unit test deliberately (`tests/unit/quiz-engine-question-results.test.js`).
- **Results page:** AFQT percentile headline unchanged in position; adds a score band
  ("Estimated AFQT 54 · likely range 43–65"; CEP student reports show SEM bands — precedent).
  Band computation (independent section errors, delta method):
  `SE(AFQTS) = sqrt(A_AR²·sem_AR² + A_MK²·sem_MK² + (2·7.225587)²·sem_WK² + (2·5.010103)²·sem_PC²)`,
  then percentile band = table lookup of `AFQTS ± SE(AFQTS)`. Sections display real standard scores (mean 50/SD
  10). Line scores render on the new 100/20 scale with a one-line note that they are comparable to
  Army MOS cutoff scales. Single-section practice: keep % correct headline, add the SS.
- **Dashboard:** results annotated by `scoring_version`; one-time note "Scoring model upgraded
  Aug 2026 — earlier scores used the previous model" where history mixes versions (sparkline
  tooltip + a small legend line).
- **Homepage Recent Updates:** one plain-language entry on ship date (e.g. "Scores now use the
  same scoring method as the real computer-adaptive ASVAB, including official score tables").
- Guest-import path (`mission-progress.js` `compactResultPayload`) carries the new fields.

## 11. Validation and testing

- **Unit — irt.js:** Owen updates against hand-computed vectors; properties (correct ⇒ μ↑ σ²↓,
  incorrect ⇒ μ↓ σ²↓); MAP at extremes finite and prior-regressed; SEM decreases with item count.
- **Unit — pipeline:** every constant pinned (θ=0 → documented SS intercepts; VE formula; AFQTS
  anchors 183→31, 202→50, 249→93, ≤109→1, ≥269→99; gaps at 37/58); average profile (all θ = PAY97
  means ⇒ SS 50) → every line score ≈ 100; perfect full test → AFQT 99; all-wrong → 1.
- **Invariants suite updated:** AFQT null unless all 4 sections; 10 line-score keys; finite
  integers; monotonicity (flipping any answer wrong→correct never lowers any score).
- **End-to-end simulation test** (the acceptance gate, mirroring the official program's
  validation): N=500 simulees θ ~ N(0,1) seeded RNG, full selection+scoring loop per AFQT section;
  require corr(θ̂, θ) ≥ 0.90 per 15-item section (≥ 0.85 for PC's 10 items), |mean bias| ≤ 0.05,
  and monotone mean percentile across theta deciles. This proves the compression bias is gone.
- **validate-site.js additions:** every question has integer `difficulty` 1–5 (currently
  unenforced); AFQTS lookup returns a 1–99 non-decreasing value for every integer input 0–400
  (the ≤109 / ≥269 clamps make the domain total); params table covers all 8 sections; penalty
  table covers all (section, count) combinations.
- **E2E (Playwright):** guest AFQT flow still completes and renders a percentile + band; no
  console/CSP errors (existing harness).

## 12. Release steps

1. `CACHE_VERSION` bump in `service-worker.js` (JS changes).
2. `docs/scoring-methodology.md` rewritten around the v2 pipeline with the citations above;
   CLAUDE.md Percentile Scoring + LEARNED sections updated; `docs/PROJECT-STATE.md` refreshed.
3. Recent Updates feed entry (real date, plain language, 1/day rule).
4. Full gates: `npm test`, `npm run test:e2e`, `node scripts/validate-site.js`,
   `node scripts/check-no-inline-js.js`.

## 13. Risks and mitigations

- **Item parameters are estimates** → the honesty line everywhere ("official pipeline, estimated
  item parameters; still a practice estimate"); calibration override hook ships now; per-item
  response data starts accumulating immediately.
- **Score discontinuity vs user history** → `scoring_version` tagging + dashboard annotation;
  line-score scale change called out explicitly in the results note.
- **PC has 10 items** (official CAT reliability .43–.87 band is why VE downweights PC) → the
  official VE weighting inherently mitigates; SEM band communicates residual noise.
- **MK/PC lack d4/d5 items** → ceiling on high-ability discrimination in those sections until the
  content follow-up; max-info selection degrades gracefully; noted in methodology doc.
- **Diagnostic untouched** → its fixed ladder and null AFQT are unaffected by all of the above.
