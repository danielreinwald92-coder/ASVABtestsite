# Scoring Methodology

This document describes how Mission ASVAB estimates AFQT percentiles and Army
line scores from a practice test, the public sources behind the approximation,
and the limits of that approximation.

> **This is a practice estimate, not an official score.** The real ASVAB is
> scored with Item Response Theory (IRT) ability estimates and classified
> equating/norming tables that are not public. The numbers produced here are a
> best-effort *public approximation* meant to help applicants gauge readiness.
> Your official AFQT and line scores at MEPS will differ.

## 1. Section % correct → standard score

Official ASVAB **standard scores** are scaled to a **mean of 50 and a standard
deviation of 10**; a 60 is one SD above average, a 40 one SD below
([officialasvab.com](https://www.officialasvab.com/counselors-educators/scores/),
[military.com](https://www.military.com/join-armed-forces/asvab/what-your-asvab-scores-mean.html)).
The vast majority of scores fall within ±3 SD, i.e. the **20–80** band.

We only know each section's **% correct** — we do **not** have the IRT ability
(theta) estimates or item difficulty parameters the real test uses. So we apply
a documented linear approximation:

```
standardScore = 20 + (percentCorrect / 100) × (80 − 20)
```

This places 0% correct at 20 (≈ −3 SD), 100% correct at 80 (≈ +3 SD), and 50%
correct at the population mean of 50. **Simplification / limitation:** the real
relationship between % correct and ability is non-linear and item-difficulty
dependent (equating). A linear map is the most defensible choice given only
%-correct data, but it will diverge from official scores, especially at the
extremes.

**Verbal Expression (VE)** is approximated as the average of the WK and PC
standard scores. Officially VE is derived from the summed WK+PC raw scores via a
lookup table; averaging the two standard scores is a public approximation of
that.

**Auto & Shop (AS)** is a single combined section. If the dataset carries a
combined `AS` section we use it directly; if it carries the legacy `AI`
(Auto Information) and `SI` (Shop Information) pair, we average their percents
first (their official combination into one AS standard score).

## 2. AFQT percentile

The 20-minute **Starting-Point Diagnostic is deliberately excluded from AFQT scoring**. Although it
samples AR, WK, PC, and MK, its 18-question blueprint is designed only to choose a useful study
starting point. Diagnostic results store `afqt: null` and the results page shows percent correct,
section evidence, and a personalized study mission—not an AFQT percentile or enlistment prediction.

The official AFQT composite formula is:

```
AFQT raw = 2 × VE + AR + MK
```

where VE, AR, and MK are standard scores
([Indeed](https://www.indeed.com/career-advice/career-development/how-the-asvab-afqt-score-is-computed),
[Kaplan](https://www.kaptest.com/study/asvab/what-is-the-afqt/)). That raw
composite is then looked up against the **1997 reference population (PAY97 / the
1997 Profile of American Youth, a national probability sample of 18–23 year
olds)** to produce a **percentile from 1 to 99** — the percentage of the
reference group you scored at or above
([officialasvab.com](https://www.officialasvab.com/researchers/scores/),
[NLSY97 codebook supplement](https://www.nlsinfo.org/content/cohorts/nlsy97/other-documentation/codebook-supplement/appendix-10-cat-asvab-scores)).
The actual PAY97 conversion table is not published, so we **fit a normal-curve
approximation** to it.

Implementation detail: the official `2×VE + AR + MK` composite is centered near
200 on the standard-score scale. We rescale it by ½ to a **~100-centered
practice composite** (a monotonic rescale that does not change ordering) so it
maps cleanly onto the project's documented percentile anchors, then convert with
a normal CDF:

```
percentile = clamp( round( 100 × Φ((rawComposite − 100) / 26) ), 1, 99 )
```

Φ is the standard normal CDF, implemented in-code via the Abramowitz & Stegun
7.1.26 `erf` approximation (no external dependency).

### Anchor points (sanity checks)

The curve is fit to these published reference points (the project's documented
anchors). Tolerance in tests is ±8 percentile.

| AFQT raw composite | Target percentile | Model output |
|--------------------|-------------------|--------------|
| 85  | 31st (Army enlistment minimum) | 28 |
| 100 | 50th (average)                 | 50 |
| 135 | 93rd (AFQT Category I)         | 91 |

A perfect test clamps to 99; an all-incorrect / empty test clamps to 1.

## 3. Army line scores

Army line scores (composites) are **sums of the component standard scores** —
they routinely run from roughly 80 to 150+ for two- and three-test composites,
and higher for four-test composites. They are **not** percentages and are not
scaled down. The previous implementation multiplied percentage-sums by ad-hoc
factors (×0.75 / ×0.5 / ×0.375); those fudge factors have been removed.

| Code | Composite | Formula |
|------|-----------|---------|
| GT | General Technical      | VE + AR |
| CL | Clerical               | VE + AR + MK |
| CO | Combat                 | AR + AS + MC |
| EL | Electronics            | GS + AR + MK + EI |
| FA | Field Artillery        | AR + MK + MC |
| GM | General Maintenance    | GS + AS + MK + EI |
| MM | Mechanical Maintenance | AS + MC + EI |
| OF | Operators & Food       | VE + AS + MC |
| SC | Surveillance & Comms   | VE + AR + AS + MC |
| ST | Skilled Technical      | GS + VE + MK + MC |

**Limitation:** the Army re-standardizes each composite against its own
reference distribution; we report the straight standard-score sum, so absolute
values are approximate (the *relative* strengths across composites are the
useful signal).

## 4. Example outputs

| Profile (≈ % correct) | AFQT percentile | GT |
|-----------------------|-----------------|----|
| Weak (~25%)           | 13 | 73 |
| Average (~53%)        | 54 | 103 |
| Strong (~85%)         | 96 | 147 |
| Perfect (100%)        | 99 | 160 |

## 5. Sources

- ASVAB official — researcher scores & PAY97 norming: https://www.officialasvab.com/researchers/scores/
- ASVAB official — understanding scores (mean 50, SD 10): https://www.officialasvab.com/counselors-educators/scores/
- military.com — what your ASVAB scores mean: https://www.military.com/join-armed-forces/asvab/what-your-asvab-scores-mean.html
- Indeed — how the AFQT score is computed (2VE+AR+MK): https://www.indeed.com/career-advice/career-development/how-the-asvab-afqt-score-is-computed
- Kaplan — what is the AFQT: https://www.kaptest.com/study/asvab/what-is-the-afqt/
- NLSY97 codebook supplement, Appendix 10 (CAT-ASVAB scores / percentile method): https://www.nlsinfo.org/content/cohorts/nlsy97/other-documentation/codebook-supplement/appendix-10-cat-asvab-scores
- Abramowitz & Stegun, *Handbook of Mathematical Functions*, eq. 7.1.26 (erf approximation used for the normal CDF).
