# CLAUDE.md

Mission ASVAB - Static HTML/JS practice test site for military applicants preparing for the Armed Services Vocational Aptitude Battery. Deployed on Vercel at `https://www.missionasvab.org`; the bare domain permanently redirects to `www`.

## Core Features

1. **Four Test Modes**
   - Starting-Point Diagnostic (20 minutes): 18 balanced AR/WK/PC/MK questions; produces study priorities and no AFQT percentile
   - APT-Style AFQT Predictor (25 minutes): 20 adaptive AR/WK/PC/MK questions (5 each), same IRT pipeline,
     reports a predicted AFQT with a wider likely range (`test_type = 'apt'`)
   - AFQT Practice (~2 hours): AR, WK, PC, MK sections - calculates an estimated AFQT percentile
   - Full Army Assessment (~3 hours): All 8 Mission ASVAB sections - calculates estimated AFQT + 10 Army line scores

2. **User Flow**
   - Landing page → Test mode selection → Timed section-by-section test → Results with score breakdown → personalized Today’s Mission → resumable lesson + checkpoint

3. **Scoring System (IRT v2)**
   - Per-question responses feed a 3PL IRT pipeline: MAP ability (theta) per section →
     official Segall (2004) theta→standard-score transforms → official VE/AS composites →
     AFQTS via verbatim PAY97 percentile table → official Army line-score weight matrix
   - Army line scores: GT, CL, CO, EL, FA, GM, MM, OF, SC, ST (mean 100 / SD 20)

## Architecture

```
HTML Pages (all 25 deployed; admin.html is served but gated by requireAdmin(). Documentation,
repository/tooling config and Playwright config are excluded — see .vercelignore; the buildCommand also strips tests/,
scripts/ and package files from the served output after the build gates run):
├── index.html  select-test.html  test-intro.html  quiz.html  results.html
├── dashboard.html  study-guide.html  about.html
├── admin.html  login.html  register.html  reset-password.html
└── faq.html  asvab-scores.html  asvab-math-formulas.html  asvab-word-list.html
    asvab-study-plan.html       # static indexable resource pages (SEO pass, no JS beyond shared helpers)
    asvab-arithmetic-reasoning.html … asvab-mechanical-comprehension.html  # 8 GENERATED section guides
                                # (lessons + 10 sample Qs); edit scripts/build-section-guides.js or the
                                # source data, re-run it; a unit test fails if pages drift

js/
├── quiz-engine.js          # Core quiz logic, timer, CAT slot materialization (Owen interim +
│                           #   max-info selection), offline queue, render-time escaping,
│                           #   section-change toasts, resume/redirect guards, answer locking (CAT)
├── irt.js                  # 3PL p(θ)/Fisher info, Owen interim Bayesian update, MAP final + SEM
├── irt-params.js           # Per-item (a,b,c) assignment + official constant tables (SS transforms,
│                           #   VE/AS composites, AFQTS→percentile table, Army weight matrix)
├── penalty-table.js        # GENERATED incomplete-test penalty coefficients (per section/unanswered
│                           #   count, plus byLength[n] for short presets like APT); regenerate via
│                           #   scripts/generate-penalty-table.js whenever pools or presets change
├── scoring.js              # REWRITTEN (IRT v2): MAP theta → official transforms → AFQTS/percentile/
│                           #   line scores; see docs/scoring-methodology.md
├── quiz-data.js            # Question bank, 966 questions (sections metadata lives in section-config.js)
├── section-config.js       # Single source of truth for section metadata (timing/counts/names)
├── explanations.js         # Per-question answer explanations, lazy via load-explanations.js (SP1)
├── courses.js              # AR/MK/WK/PC study courses (~217KB, lazy on study-guide.html)
├── courses-tech.js         # GS/AS/MC/EI study courses (SP4); lazy, merged into `courses` by loader
├── weak-areas.js           # Per-section accuracy aggregation → weak-area practice/study plan
├── mission-recommendations.js # Pure result evidence → deterministic, content-validated mission
├── mission-progress.js     # Local mission history, guest-result import, Supabase mission sync
├── recent-seen.js          # On-device recent-question buffer for repeat avoidance (SP2)
├── streak.js  study-plan.js  # Dashboard: derived streak + test-date countdown/paced plan (SP3)
├── spaced-repetition.js    # SM-2-lite scheduler + localStorage store for flashcard review (SP3)
├── share-card.js  pwa-install.js  # Local shareable score card + dismissible install prompt (SP3)
├── test-config.js          # Test mode configs (diagnostic/apt/quick/full + diagnostic blueprint)
├── auth.js                 # Supabase client singleton + session helpers + friendlyAuthError()
│                           #   (maps raw Supabase auth errors to plain language on all auth pages)
├── offline-queue.js        # Flush queued (offline) test results when back online
├── admin.js  dashboard.js  # Admin panel + user dashboard logic
├── page-*.js               # Per-page logic (externalized; NO inline <script> — see CSP rule below)
├── focus-trap.js  mobile-menu.js  sw-register.js  year.js  # shared UI/PWA helpers
css/shared.css              # Design system: tokens (palette, type roles, radius, elevation) +
                            #   shared components (.btn variants, .card, .patch, .logo, nav, mobile
                            #   menu, footer, focus/reduced-motion floors). Fonts sitewide: Barlow
                            #   Condensed (display, uppercase) / DM Sans (body) / Chakra Petch (data)
service-worker.js           # App-shell offline cache (bypasses Supabase/cross-origin/admin)
manifest.json  robots.txt  .vercelignore
scripts/
├── validate-site.js        # Data/scoring contract checks + per-section POOL_MINIMUMS ratchet +
│                           #   distinct-options check + explanation/course-shape contracts +
│                           #   IRT v2 contracts (difficulty tags, AFQTS table, params/penalty coverage)
│                           #   (runs in the Vercel buildCommand after npm test)
├── generate-penalty-table.js  # Offline simulation → regenerates js/penalty-table.js (official
│                           #   incomplete-test penalty derivation); re-run only if irt params/pools change
├── build-section-guides.js # Regenerates the 8 asvab-<section>.html guides (--check = drift test)
└── check-no-inline-js.js   # CI gate: fails if any inline on*= handler or inline <script> exists
supabase/migrations/        # Versioned additive database changes (new schema work belongs here)
tests/                      # node:test + jsdom suite (286 tests). helpers/load.js, helpers/engine.js
tests/e2e/                  # Playwright: all-page CSP/console smoke + guest AFQT and diagnostic flows
playwright.config.js        # Chromium config; local server mirrors production Vercel headers
docs/scoring-methodology.md # AFQT model, sources, limits
docs/PROJECT-STATE.md       # Concise current-state index and prioritized handoff context
```

## Development

```bash
npx serve .                    # Local dev server
npm test                       # Run the node:test + jsdom unit suite (286 tests)
npm run test:e2e               # Run Playwright against all pages + the guest AFQT flow
node scripts/validate-site.js  # Validate quiz data + scoring contracts (also a Vercel build gate)
node scripts/check-no-inline-js.js  # Verify no inline JS (required by the strict CSP)
git push                       # main auto-deploys to Vercel (build runs unit + validation + CSP gates)
```

**Release step:** any deploy that changes an existing JS file must bump `CACHE_VERSION` in
`service-worker.js` — subresources are cache-first, so without a bump the first post-deploy
load runs fresh HTML against stale cached JS.

CI (`.github/workflows/ci.yml`) runs `npm ci → unit tests → Playwright → validate-site → check-no-inline-js` on push/PR.

## Documentation Maintenance

Documentation review is a required first step for every change or implementation:

- Before editing code, read this file and the task-relevant documentation under `docs/` to recover
  the current architecture, established decisions, constraints, and known risks.
- Verify documentation claims against the current code and tests before relying on them. Current
  behavior is the source of truth when an older plan or status note is stale.
- During material work, update the smallest relevant documentation surface as the implementation
  changes. Do not wait for a future session to reconstruct important context from Git history.
- Update this file when architecture, file ownership, development commands, data models, security
  rules, release steps, or durable working conventions change.
- Update a task-relevant spec, methodology, or status document when its described behavior or
  decision changes. Clearly mark or correct stale information instead of leaving contradictions.
- User-visible releases must also follow the Recent Updates Feed rules below.
- Keep this file concise and current: it is the primary orientation index for a new development
  session. Record durable facts and decisions, not a running transcript or low-level implementation
  history.
- Before declaring work complete, confirm that affected documentation matches the shipped code and
  that required documentation updates are included in the same change.

## Backend (Supabase, project ref `rcspwkmrtukblvvdifer`)

- `profiles` (RLS): own-row select/insert/update; admins select all via `is_admin()`. Column writes
  for anon/authenticated are restricted to `name,age,education,zipcode,test_date` — **`is_admin` and
  `email` are NOT writable by clients** (admin changes go through the `admin_set_is_admin` SECURITY
  DEFINER RPC). See the privilege-escalation lesson in LEARNED.
- `test_results` (RLS): own-`user_id` select/insert. Has `section_scores`, `line_scores`,
  `afqt_score`, `client_result_id` (per-user deduplication), and `question_results` jsonb
  (`[{id,section,correct}]`, for weak-area analysis).
- `study_missions` (RLS): own-row select/insert/update for account-synced Today’s Mission status,
  content target, and section evidence. Anonymous roles have no table grants; answer text and profile
  fields are not stored. Local guest history uses `missionasvab.missions.v1` and imports after sign-in.
- `question_reports` (RLS): insert-own / select own-or-admin; backs the report-a-question feature.
- Admin RPCs (`admin_*`, `delete_my_account`) are SECURITY DEFINER and self-guard with `is_admin()`/
  `auth.uid()`. Deletes cascade auth.users → profiles → test_results/study_missions.

## ASVAB Section Reference

| Section | Code | Questions (CAT) | Time | Used For |
|---------|------|-----------------|------|----------|
| Word Knowledge | WK | 15 | 9 min | AFQT (VE) |
| Paragraph Comprehension | PC | 10 | 27 min | AFQT (VE) |
| Arithmetic Reasoning | AR | 15 | 55 min | AFQT, GT, CL, CO, EL, FA, SC |
| Mathematics Knowledge | MK | 15 | 31 min | AFQT, CL, EL, FA, GM, ST |
| General Science | GS | 15 | 12 min | EL, GM, ST |
| Auto & Shop Information | AS | 10 | 7 min | CO, GM, MM, OF, SC |
| Mechanical Comprehension | MC | 15 | 22 min | CO, FA, MM, OF, SC, ST |
| Electronics Information | EI | 15 | 10 min | EL, GM, MM |

## Army Line Score Formulas

**Primary ingredients** (which sections feed which composite — unchanged):

- GT (General Technical): VE + AR
- CL (Clerical): VE + AR + MK
- CO (Combat): AR + AS + MC
- EL (Electronics): GS + AR + MK + EI
- FA (Field Artillery): AR + MK + MC
- GM (General Maintenance): GS + AS + MK + EI
- MM (Mechanical Maintenance): AS + MC + EI
- OF (Operators and Food): VE + AS + MC
- SC (Surveillance & Comms): VE + AR + AS + MC
- ST (Skilled Technical): GS + VE + MK + MC

**As shipped (IRT v2), these are not integer sums.** GT uses its own published
formula (`round(1.074292·(SS_AR + SS_VE) − 7.443781)`, rounded SS inputs); the
other nine use the exact Segall (2004) Table 2.7 non-integer weight matrix
applied to **unrounded** standard scores (CL/EL/GM, etc. carry a small
nonzero weight on sections outside their "primary ingredients" list above —
e.g. CL includes a small MC term). All ten are reported on a scale with
**mean 100 / SD 20**, directly comparable to real Army MOS cutoffs. Exact
weights: `js/irt-params.js` (`ARMY_WEIGHTS`); full table and citation:
[docs/scoring-methodology.md](docs/scoring-methodology.md).

## Percentile Scoring

**This is a documented public approximation, not official scoring** — the
*pipeline* is the real CAT-ASVAB's official math; the *item parameters* feeding
it are estimated. Full model, sources, and limits:
[docs/scoring-methodology.md](docs/scoring-methodology.md).

Per-question responses → MAP theta per section (3PL IRT, Owen interim update
during the test, posterior-mode final estimate) → official Segall (2004)
theta→standard-score transforms (mean 50, SD 10, no 20–80 truncation) → VE via
the official weighted composite (eq. 2.3, WK weighted ~1.4× PC) → AFQTS =
SS_AR + SS_MK + 2·SS_VE → percentile via **verbatim lookup** of the official
1997 (PAY97) Table 2.5 (not a curve fit; percentiles 37/58/65 are legitimately
absent). Anchor points are now **exact table lookups, tolerance 0**:
- AFQTS 183 → 31st percentile (Army minimum)
- AFQTS 202 → 50th percentile (average)
- AFQTS 249 → 93rd percentile (Category I)

Army line scores use the official Table 2.7 weight matrix, reported mean
100/SD 20 (see Army Line Score Formulas above) — not simple standard-score
sums.

## Recent Updates Feed (homepage trust signal)

`index.html` has a **"Recent Updates"** section (static `<ul class="updates-list">`, no JS —
CSP-safe) that shows the site is actively maintained. **Whenever we ship a user-facing change,
add an entry:**

- Add a new `<li class="update-item">` at the **top** of the list; remove the oldest so **only the
  4 most recent** remain.
- Format: `<span class="update-date">Mon D, YYYY</span>` + `<span class="update-text">…</span>`.
- **Plain language, benefit-focused, non-technical.** Write for a military applicant, not a
  developer. "Added step-by-step answer explanations" ✅ — not "refactored the explanation renderer" ❌.
- Skip purely internal changes (refactors, CI, security-header tweaks) unless the user notices them.
  Group security/perf work as user benefits ("Made login faster and more secure").
- One short sentence per entry. Use the **real ship date** — read the system clock (`date`),
  don't guess.
- **One entry per day, max.** If several updates ship the same day, condense them into a single
  `<li>` (combine benefits into one sentence, or a brief "and more") rather than repeating the date.

## Self-Correction Protocol

When corrected, propose: `[LEARN] Category: Rule`
Wait for approval before adding to LEARNED section.

## LEARNED

- **Security / RLS:** Column-level `REVOKE` on a Supabase table is a NO-OP if the role holds a
  *table-level* grant (Supabase's default `GRANT ALL ... TO anon, authenticated` + rely-on-RLS).
  To restrict a sensitive column, `REVOKE INSERT,UPDATE ON <table> FROM anon,authenticated` then
  `GRANT` only the safe columns. Verify with `has_column_privilege('authenticated','tbl','col','UPDATE')`,
  not just `information_schema` introspection. (This is how the `profiles.is_admin` self-promotion
  hole was closed, 2026-06-14.)
- **CSP / no inline JS:** Production CSP sets `script-src 'self' https://cdn.jsdelivr.net` (NO
  `'unsafe-inline'`). Do NOT add inline `<script>` blocks or `on*=` attributes to served pages —
  put logic in `js/page-<name>.js` and wire via `addEventListener`/delegation. `scripts/check-no-inline-js.js`
  enforces this in CI and will fail the build otherwise. Supabase JS is pinned + SRI-hashed.
- **Scoring is a documented practice estimate**, not official — see Percentile Scoring section
  (IRT v2, shipped Aug 2026: MAP theta → official Segall transforms → verbatim AFQTS table →
  official Army weight matrix; only the per-item a/b/c parameters are estimated). Keep the v2
  invariants green: perfect full test → AFQT 99, all-wrong → 1, exactly 10 line scores each
  ≈100-centered (mean 100/SD 20 scale) and finite/integer, monotonic (flipping an answer
  wrong→correct never lowers any score), and the AFQTS→percentile table matches Table 2.5
  verbatim (anchors 183→31, 202→50, 249→93 at tolerance 0; gaps at 37/58/65 are correct).
- **Content lives in two course bundles:** AR/MK/WK/PC courses in `courses.js`; GS/AS/MC/EI courses
  in `courses-tech.js` (SP4). The study-guide loader lazy-loads both and `Object.assign(courses,
  coursesTech)` — a `courses-tech.js` load failure must leave the base four courses working. Edit
  the right file for the section. `validate-site.js` mirrors the merge before its course-shape checks.
- **Pool sizes only grow:** `scripts/validate-site.js` has a `POOL_MINIMUMS` ratchet (WK 160, PC 105,
  AR 134, MK 152, GS 105, EI 105, AS 100, MC 105). Raise the entry when you intentionally grow a pool;
  never let a pool drop below it. Every question needs a 40–600 char, single-line, HTML-safe (no
  `< > &`) explanation in `explanations.js`. New questions get adversarial blind-solve verification
  (two independent agents re-solve without the key) before merge — this has kept key errors at 0.
- **SP3 motivation features are client-side only (no DB):** streak is derived from `test_results`
  dates, spaced-repetition state + install-dismiss live in `localStorage` (namespaced
  `missionasvab.sp3.*`). Account-synced flashcard progress was deliberately deferred to avoid a new
  writable table + RLS. Keep pure logic (streak/study-plan/SR scheduler/share-text) separate from
  DOM/storage so it stays unit-testable without jsdom.
- **CAT timing:** Use the current official CAT-ASVAB table for scored-question limits. General
  Science is 15 scored questions in 12 minutes. Mission ASVAB combines Auto/Shop into one AS
  practice section and intentionally omits AO, as disclosed on the About page.
