# Military job requirements (all five branches)

Shipped 2026-09-26. Owner goal: organic traffic from job-level searches ("68W ASVAB score") plus a
"See my options" step after a practice test.

## What it is

| Piece | File(s) |
|---|---|
| Data (single source) | `js/job-requirements.js`: `ORDER`, `BRANCHES[key]` (copy, `afqtMin`, `source`, `jobs`), `GT_PROGRAMS` |
| Composites | `js/branch-composites.js`: Army line scores (reuses `irt-params.js`), Air Force MAGE (Segall 2004 Tables C.1-C.4 verbatim), Marine GT/MM/EL/CL (Segall sec. 2.5.2 transforms) |
| Matcher | `js/job-matcher.js`: rule engine -> qualifies / close / notYet / unknown / other |
| Options UI | `js/options-view.js` (shared), `my-options.html` + `js/page-my-options.js` (noindex), results card in `js/page-results.js`, calculator in `js/page-score-calculator.js` |
| Pages | `scripts/build-job-pages.js` generates `asvab-score-requirements.html`, `asvab-gt-score.html`, `<branch>-asvab-scores.html` (x5), `jobs/<branch>-<code>-<slug>.html` (featured jobs), and the `<!-- job-pages -->` sitemap block |
| Gates | `validate-site.js` data contract; `tests/unit/job-pages.test.js` (drift, hrefs, hand-written minimum copy); `job-matcher` / `branch-composites` unit tests; e2e options + calculator flows |

Job pages live in `jobs/` and use `<base href="/">` so shared chrome links stay root-relative. Never
use `#fragment` links on those pages.

## Rule format

A job `rule` is an OR of paths; each path is an AND of terms:
`{c:'ST',min:101}` (composite), `{sum:{VE:1,AR:1,MK:2},min:255}` (Navy/CG standard-score sums, integer
SS), `{afqt:65}`, `{test:'DLAB',min:110}`. Sums containing AO/CS/CT and standalone tests are never
judged; a job whose only paths need them lands in "other". Missing sections give "unknown" (AFQT-only
tests still match GT, Air Force A/G, Navy/CG VE+AR jobs). "Close" = best path short by <= 10 points
total. Branch AFQT minimum gates everything.

## Sources (as of 2026-09-26)

| Branch | Source | Jobs | Notes |
|---|---|---|---|
| Army | Smartbook DA Pam 611-21 Ch.10C, EOFY2025 (posted 2025-12-04), api.army.mil | 138 | Effective (not Rescind) rows; post-Jul-2004 tiers. 15X/40D take effect Oct 2026: add then. |
| Air Force / Space Force | DAFECD 30 Apr 2026, Attachment 4 + para 3 (public mirror tmd.texas.gov) | 111 | ~15 AFSCs use PSM/TAPAS/Cyber Test/EDPT; stored as `test` terms. |
| Navy | COMNAVCRUITCOMINST 1130.8S (5 Aug 2026), Ch.5 matrices, etoolbox.cnrc.navy.mil | 77 | "Valid until 31MAR26" Cyber Test paths omitted (IT, IT-ATF, ITS). MA skipped (two conflicting rows). "until 30SEP26" footnotes on AECF/MM/PACT: re-check in Oct 2026. |
| Marine Corps | NAVMC 1200.1D (FY19, May 2018), mosmanual.com mirror | 148 | Newest public edition; 1200.1K/L/M are access-controlled. Refresh if a public copy appears. |
| Coast Guard | PTEM M1500.10C Encl.(3) (2017) minus 10 per ALCOAST ACN 112/21 (Nov 2021) | 20 | Current table is CAC-only. MK's VE+AR alternative reduction is inferred. |

AFQT minimums (diploma): Army/Navy/Air Force/Marines 31, Coast Guard 32. Hand-written copies live in
`asvab-scores.html`, `faq.html` (answer + JSON-LD) and `about.html`; `job-pages.test.js` fails if they
drift from `afqtMin`. Owner decision: no education-tier (GED) detail on these pages.

## Verification

Featured jobs (99) were re-extracted blind by independent agents from the raw sources on 2026-09-26:
96/100 matched; the 4 differences were resolved (Navy ABH dropped as unsourced; expired Navy Cyber Test
paths removed; Navy NUC NAPT paths added; AF 1C1X1 kept as G55 + 2-factor + TAPAS). New or changed
featured jobs need the same blind check before merge.

## Refresh cadence

- Army: each end-of-FY Smartbook edition (December).
- Air Force: DAFECD every 30 Apr / 31 Oct.
- Navy: each 1130.8 revision (several per year).
- Marines / Coast Guard: when a newer public source appears.

To refresh: edit `js/job-requirements.js` (keep one job per line), bump the branch `source`, run
`node scripts/build-job-pages.js`, then the usual gates. Bump `CACHE_VERSION` for any JS change.

## Owner copy rules

One friendly footer line on every page ("Requirements change often. For the exact requirements for
your situation, talk to a local recruiter.") plus a neutral source line. No per-row warning labels,
no em dashes.
