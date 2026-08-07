# Scoring Methodology (v2 — IRT-based)

This document describes how Mission ASVAB estimates AFQT percentiles and Army
line scores from a practice test, the public sources behind the model, and
the limits of that model.

> **This is a practice estimate, not an official score.** Mission ASVAB's
> scoring *pipeline* is now structurally identical to the operational
> CAT-ASVAB — the same Bayesian ability estimation, the same published
> theta→standard-score transforms, the same AFQT percentile table, and the
> same Army composite weight matrix. The one part that is **not** public and
> therefore **is** an estimate is the per-item difficulty/discrimination/
> guessing parameters (a, b, c) behind each question — the real ASVAB item
> bank's parameters are classified. Everything *downstream* of those
> per-item parameters is official, publicly documented math. Your official
> AFQT and line scores at MEPS will still differ, because they run on the
> real, calibrated item bank.

## 1. Item parameters (the estimated link)

The real CAT-ASVAB scores every answer against a 3-parameter logistic (3PL)
item response function, using per-item parameters (discrimination `a`,
difficulty `b`, guessing floor `c`) that come from live-testing millions of
examinees. Those per-item values are not public. Mission ASVAB instead
derives a 3PL parameter set for every question from its existing 1–5
difficulty tag and the **published pool-level statistics** for each section
(ASVAB Technical Bulletin No. 3, Tables 2.27–2.36 — midpoints of the Forms
5–9 ranges; the AS row is the mean of the official AI/SI pools, matching
Mission ASVAB's combined AS section):

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

Per item:

```
b = B_MEAN[section] + OFFSET[tag] × B_SD[section]
OFFSET = { 1: −1.5, 2: −0.75, 3: 0, 4: +0.75, 5: +1.5 }
a = A_MEAN[section]   (constant within a section)
c = C_MEAN[section]   (constant within a section)
```

**Calibration override hook:** `js/irt-params.js` consults an optional
per-item table (`CALIBRATED[item.id] → {a,b,c}`) before falling back to the
heuristic above. It is empty at launch. Every scored response is already
recorded (`question_results`, including the 1–5 `difficulty` tag), so a
future project can empirically calibrate real per-item parameters from
accumulated response data — the same approach used to build the original
official pools — without changing anything downstream.

**Known consequence:** with `a` and `c` held constant within a section,
maximum-information item selection reduces to proximity of `b` to the
current ability estimate — a smoother version of the previous difficulty
ladder. Per-item variation in discrimination/guessing arrives with
calibration.

## 2. Ability estimation

**Interim estimate (drives item selection).** After each locked answer in
quick/full (CAT) modes, Mission ASVAB runs Owen's sequential Bayesian update
— the same interim estimator the operational CAT-ASVAB uses between items
(ASVAB Technical Bulletin No. 1, Ch. 3; equations per van der Linden RR-96-01,
eqs. A.1–A.6). Starting from a **N(0,1) prior** (the ASVAB program's own
documented choice, per Technical Bulletin No. 3 §4.2), with posterior mean μ
and variance σ², and normal-ogive metric (`a` used directly, no D-scaling):

```
ξ  = (b − μ) / sqrt(a⁻² + σ²)
P* = c + (1−c)·Φ(−ξ)                        # predictive P(correct)
correct:   μ′ = μ + (1−c)·σ²·(a⁻²+σ²)^(−1/2)·φ(ξ)/P*
           σ²′ = σ²·{1 − (1−c)·(1 + a⁻²/σ²)^(−1)·(φ(ξ)/ζ)·((1−c)·φ(ξ)/ζ − ξ)},  ζ = c+(1−c)Φ(ξ)
incorrect: μ′ = μ − σ²·(a⁻²+σ²)^(−1/2)·φ(ξ)/Φ(ξ)
           σ²′ = σ²·{1 − (1 + a⁻²/σ²)^(−1)·(φ(ξ)/Φ(ξ))·(φ(ξ)/Φ(ξ) + ξ)}
```

φ/Φ are the standard normal pdf/cdf. This state is what drives item
selection (max-information among not-yet-used, not-recently-seen items,
randomized among the top 5); it does not itself become the reported score.

**Final score.** For scoring, Mission ASVAB computes the posterior mode
(MAP) of the 3PL likelihood times the same N(0,1) prior, over every
answered scored item in the section — the official ASVAB estimator choice
(order-independent; defined even for all-correct or all-wrong response
sets; regresses toward the mean under low information). This uses a dense
grid search over θ ∈ [−4, +4] in steps of 0.01 (801 points). **SEM** is the
posterior standard deviation computed on that same grid.

*Metric note:* published ASVAB `a`-parameters follow the D=1.7 normal-metric
convention, so `a` is used directly in Owen's normal-ogive update above; the
MAP likelihood and item-selection information use the equivalent logistic
3PL with the D=1.702 scaling factor, so both stages agree.

**Incomplete-test penalty.** If a section ends with unanswered (unreached)
items, the real CAT-ASVAB does not simply score them wrong — it applies a
documented penalty procedure (Segall, 1988; Technical Bulletin No. 1, Ch. 3
§7) so the final score is equivalent, in expectation, to random guessing on
the unreached items. Mission ASVAB replicates the official derivation
offline (`scripts/generate-penalty-table.js`): for each section, simulate
many true abilities, administer the section adaptively for the answered
count, append simulated random responses (P(correct) = 0.2, the documented
guessing constant) for the remainder, and regress full-test MAP theta on
partial-test MAP theta. The resulting per-(section, unanswered-count)
coefficients are committed as `js/penalty-table.js` and applied at score
time:

```
θ_final = A + B · θ_answered
```

This replaces the old "unanswered = wrong" behavior.

## 3. Standard scores & composites

**Section standard scores** use the official theta→SS linear transforms
(Segall 2004, Table 2.4, Form 04D), `SS = A·θ + B`, rounded to the nearest
integer, with **no 20–80 truncation** (the N(0,1) prior already keeps
extreme results in check, matching the '97 scale's own design):

| Section | A | B |
|---|---|---|
| GS | 11.543462 | 48.988873 |
| AR | 11.528721 | 48.365417 |
| WK | 11.032817 | 47.809880 |
| PC | 12.351821 | 45.886521 |
| MK | 10.025804 | 46.255061 |
| MC | 12.957792 | 51.247394 |
| EI | 11.034039 | 51.159592 |

**Verbal Expression (VE)** is not a simple average — it is the official
weighted composite (Segall eq. 2.3), which weights WK about 1.4× as heavily
as PC (PC is the least reliable ASVAB subtest):

```
SS_VE = 7.225587 · θ_WK + 5.010103 · θ_PC + 46.897156
```

**Auto & Shop (AS)** uses the degenerate single-combined-section form of the
official AS composite (Segall eq. 2.4, since Mission ASVAB reports one
combined AS section rather than separate AI/SI):

```
SS_AS = 14.639259 · θ_AS + 56.220220
```

**AFQT.** The AFQT score (AFQTS) is the official composite of *rounded*
section standard scores:

```
AFQTS = SS_AR + SS_MK + 2 · SS_VE
```

AFQTS converts to a **1–99 percentile** by a verbatim lookup of Segall
(2004) Table 2.5 — the actual 1997 reference-population (PAY97) table, not
a curve fit. It is a contiguous, left-skewed step function:

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

Percentiles **37, 58, and 65 are absent** from the official table — verified
against the primary source, not a transcription gap. AFQTS ≤ 109 clamps to
percentile 1; AFQTS ≥ 269 clamps to 99. Sanity anchors: 183 → 31st
percentile (the Army's enlistment minimum), 202 → 50th (average), 249 → 93rd
(AFQT Category I) — these are exact table lookups, not approximations.

**Army line scores** use the official published composites (Segall 2004
§2.5.3), reported on a scale with **mean 100 and SD 20** — directly
comparable to real Army MOS qualification cutoffs (e.g. GT ≥ 110 for many
jobs). **GT** has its own published formula, applied to rounded standard
scores:

```
GT = round(1.074292 × (SS_AR + SS_VE) − 7.443781)
```

The other nine composites are non-integer weighted sums (Segall 2004, Table
2.7) applied to **unrounded** section standard scores, plus a constant,
rounded once at the end:

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

Line scores require all 8 Mission ASVAB sections; there is no partial-data
fallback (a composite built from a subset of its inputs is not a real score
— same rationale as the AFQT all-4-sections gate).

**Score band on the results page.** Because item parameters are estimated,
the results page shows an AFQT band, not just a point estimate (e.g.
"Estimated AFQT 54 · likely range 43–65") — the same idea as the official
program's own CEP student reports, which also publish a standard-error band
around a section score. The band is **±1 standard error (~68% coverage)**,
computed via the delta method from the independent section posterior SEMs:

```
SE(AFQTS) = sqrt( A_AR²·sem_AR² + A_MK²·sem_MK² + (2·7.225587)²·sem_WK² + (2·5.010103)²·sem_PC² )
```

then the band bounds are `AFQTS ± SE(AFQTS)`, each converted through the
same Table 2.5 lookup. The site's copy deliberately says **"likely range,"**
never "confidence interval" — a ±1 SE band is not a 95% CI, and conflating
the two would overstate precision.

## 4. What changed vs. the v1 model, and why

The previous model scored on section % correct alone, using a symmetric
normal-CDF fit to three anchor points. Five compounding gaps prompted this
rewrite:

- **Compression bias.** quick/full tests are adaptive (harder questions for
  stronger test-takers), but v1 scoring only saw correct/total — so strong
  test-takers who correctly missed harder items were pulled toward the
  middle, and weak test-takers were inflated symmetrically. v2's ability
  estimate (theta) is computed from *which* items were answered and how
  hard they were, the same way the real CAT does, so it does not have this
  bias.
- **VE weighting.** v1 averaged WK and PC standard scores 50/50. The
  official VE composite weights WK about 1.4× as heavily as PC, because PC
  is ASVAB's least reliable subtest. v2 uses the exact published weights.
- **Table vs. normal fit.** v1 approximated the AFQT percentile curve with
  a symmetric normal CDF fit to three points (off by up to ~10 percentile
  points in parts of the range). v2 does a verbatim lookup of the actual,
  left-skewed 1997 reference-population table.
- **Line-score scale.** v1 reported Army line scores as straight
  standard-score sums, which center near 150 for three-subtest composites —
  useless for comparing against real MOS cutoffs like "GT ≥ 110." v2 uses
  the official weight matrix, reported mean 100/SD 20, directly comparable
  to real cutoffs.
- **Unanswered items.** v1 counted every unanswered item as wrong. v2
  applies the same documented incomplete-test penalty the real CAT-ASVAB
  uses, so running out of time is scored the way the real test scores it.

## 5. Sources

- Segall, D.O. (2004), *Development and Evaluation of the 1997 ASVAB Score
  Scale*, Defense Manpower Data Center — official composite definitions,
  Form 04D transforms (Table 2.4), VE/AS formulas (eqs. 2.3–2.4), the AFQT
  percentile table (Table 2.5), and the Army composite weights (Table 2.7):
  https://www.officialasvab.com/wp-content/uploads/2019/08/1997score_scale.pdf
- ASVAB Technical Bulletin No. 1 — CAT-ASVAB item selection, Owen interim
  estimation, posterior-mode (MAP) final scoring, and the incomplete-test
  penalty procedure:
  https://www.officialasvab.com/wp-content/uploads/2019/08/asvab_techbulletin_1.pdf
- ASVAB Technical Bulletin No. 3 — Forms 5–9 3PL item-parameter pool
  statistics (Tables 2.27–2.36) and the N(0,1) prior decision:
  https://www.officialasvab.com/docs/asvab_techbulletin_3.pdf
- van der Linden, W.J. (1996), *Assembling Tests for the Measurement of
  Multiple Traits*, RR-96-01 — Owen's Bayesian update equations (A.1–A.6)
  in full: https://files.eric.ed.gov/fulltext/ED424235.pdf
- DMDC (2004), *ASVAB Norms for the CEP* — per-subtest standard-score
  percentile curves for the youth reference population (context for the
  results-page score band):
  https://prod-media.asvabprogram.com/CEP_PDF_Contents/ASVAB_Norms.pdf
- NLSY79 Attachment 106 — 1980-metric AFQT conversion tables (background/
  context only; Mission ASVAB scores exclusively on the 1997 scale above,
  so this source is not used in any live calculation).
