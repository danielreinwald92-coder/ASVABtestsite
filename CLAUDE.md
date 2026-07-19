# CLAUDE.md

Mission ASVAB - Static HTML/JS practice test site for military applicants preparing for the Armed Services Vocational Aptitude Battery. Deployed on Vercel at `https://www.missionasvab.org`; the bare domain permanently redirects to `www`.

## Core Features

1. **Two Test Modes**
   - AFQT Practice (~2 hours): AR, WK, PC, MK sections - calculates an estimated AFQT percentile
   - Full Army Assessment (~3 hours): All 8 Mission ASVAB sections - calculates estimated AFQT + 10 Army line scores

2. **User Flow**
   - Landing page → Test mode selection → Timed section-by-section test → Results with score breakdown

3. **Scoring System**
   - VE (Verbal Expression) = lookup table from WK + PC raw scores
   - AFQT raw = 2×VE + AR + MK, converted to percentile via approximation curve
   - Army line scores: GT, CL, CO, EL, FA, GM, MM, OF, SC, ST

## Architecture

```
HTML Pages (all 12 deployed; admin.html is served but gated by requireAdmin(). Documentation,
repository/tooling config and Playwright config are excluded — see .vercelignore; the buildCommand also strips tests/,
scripts/ and package files from the served output after the build gates run):
├── index.html  select-test.html  test-intro.html  quiz.html  results.html
├── dashboard.html  study-guide.html  about.html
└── admin.html  login.html  register.html  reset-password.html

js/
├── quiz-engine.js          # Core quiz logic, timer, CAT slot materialization, offline queue,
│                           #   render-time escaping, section-change toasts, resume/redirect guards
├── scoring.js              # AFQT (standard-score model) + Army line scores (sums of std scores)
├── quiz-data.js            # Question bank, 902 questions (sections metadata lives in section-config.js)
├── section-config.js       # Single source of truth for section metadata (timing/counts/names)
├── explanations.js         # Per-question answer explanations, lazy via load-explanations.js (SP1)
├── courses.js              # AR/MK/WK/PC study courses (~217KB, lazy on study-guide.html)
├── courses-tech.js         # GS/AS/MC/EI study courses (SP4); lazy, merged into `courses` by loader
├── weak-areas.js           # Per-section accuracy aggregation → weak-area practice/study plan
├── recent-seen.js          # On-device recent-question buffer for repeat avoidance (SP2)
├── streak.js  study-plan.js  # Dashboard: derived streak + test-date countdown/paced plan (SP3)
├── spaced-repetition.js    # SM-2-lite scheduler + localStorage store for flashcard review (SP3)
├── share-card.js  pwa-install.js  # Local shareable score card + dismissible install prompt (SP3)
├── test-config.js          # Test mode configs (quick/full section lists)
├── auth.js                 # Supabase client singleton + session helpers + friendlyAuthError()
│                           #   (maps raw Supabase auth errors to plain language on all auth pages)
├── offline-queue.js        # Flush queued (offline) test results when back online
├── admin.js  dashboard.js  # Admin panel + user dashboard logic
├── page-*.js               # Per-page logic (externalized; NO inline <script> — see CSP rule below)
├── focus-trap.js  mobile-menu.js  sw-register.js  year.js  # shared UI/PWA helpers
css/shared.css              # Shared :root tokens, nav, mobile menu, reduced-motion, focus styles
service-worker.js           # App-shell offline cache (bypasses Supabase/cross-origin/admin)
manifest.json  robots.txt  .vercelignore
scripts/
├── validate-site.js        # Data/scoring contract checks + per-section POOL_MINIMUMS ratchet +
│                           #   distinct-options check + explanation/course-shape contracts
│                           #   (runs in the Vercel buildCommand after npm test)
└── check-no-inline-js.js   # CI gate: fails if any inline on*= handler or inline <script> exists
tests/                      # node:test + jsdom suite (184 tests). helpers/load.js, helpers/engine.js
tests/e2e/                  # Playwright: all-page CSP/console smoke + complete guest AFQT flow
playwright.config.js        # Chromium config; local server mirrors production Vercel headers
docs/scoring-methodology.md # AFQT model, sources, limits
docs/PROJECT-STATE.md       # Concise current-state index and prioritized handoff context
```

## Development

```bash
npx serve .                    # Local dev server
npm test                       # Run the node:test + jsdom unit suite (184 tests)
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
  `afqt_score`, and `question_results` jsonb (`[{id,section,correct}]`, for weak-area analysis).
- `question_reports` (RLS): insert-own / select own-or-admin; backs the report-a-question feature.
- Admin RPCs (`admin_*`, `delete_my_account`) are SECURITY DEFINER and self-guard with `is_admin()`/
  `auth.uid()`. Deletes cascade auth.users → profiles → test_results.

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

## Percentile Scoring

**This is a documented public approximation, not official scoring.** Full model,
sources, and limits: [docs/scoring-methodology.md](docs/scoring-methodology.md).

Section % correct → standard score (mean 50, SD 10, linear onto the 20–80 band).
VE ≈ avg(WK, PC) standard scores. AFQT raw = 2·VE + AR + MK, rescaled to a
~100-centered practice composite and mapped to a 1–99 percentile via a normal
CDF fit to the 1997 (PAY97) reference. Anchor points (sanity checks, ±8):
- 31st percentile (Army minimum) ~ raw composite 85
- 50th percentile (average) ~ raw composite 100
- 93rd percentile (Category I) ~ raw composite 135

Army line scores are **sums of standard scores** (no percentage multipliers).

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
- **Scoring is a documented practice estimate**, not official — see Percentile Scoring section. Keep
  the invariants green (perfect→99, exactly 10 line scores, integer/finite, monotonic).
- **Content lives in two course bundles:** AR/MK/WK/PC courses in `courses.js`; GS/AS/MC/EI courses
  in `courses-tech.js` (SP4). The study-guide loader lazy-loads both and `Object.assign(courses,
  coursesTech)` — a `courses-tech.js` load failure must leave the base four courses working. Edit
  the right file for the section. `validate-site.js` mirrors the merge before its course-shape checks.
- **Pool sizes only grow:** `scripts/validate-site.js` has a `POOL_MINIMUMS` ratchet (WK 148, PC 85,
  AR 122, MK 132, GS 105, EI 105, AS 100, MC 105). Raise the entry when you intentionally grow a pool;
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
