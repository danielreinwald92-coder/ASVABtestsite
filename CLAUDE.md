# CLAUDE.md

Mission ASVAB - Static HTML/JS practice test site for military applicants preparing for the Armed Services Vocational Aptitude Battery. Deployed on Vercel.

## Core Features

1. **Two Test Modes**
   - Quick AFQT (30 min): WK, PC, AR, MK sections only - calculates AFQT percentile
   - Full Army Assessment (60 min): All 8 sections - calculates AFQT + 10 Army line scores

2. **User Flow**
   - Landing page → Test mode selection → Timed section-by-section test → Results with score breakdown

3. **Scoring System**
   - VE (Verbal Expression) = lookup table from WK + PC raw scores
   - AFQT raw = 2×VE + AR + MK, converted to percentile via approximation curve
   - Army line scores: GT, CL, CO, EL, FA, GM, MM, OF, SC, ST

## Architecture

```
HTML Pages (12 served; admin/login/etc. + the 5 preview-*.html are NOT deployed — see .vercelignore):
├── index.html  select-test.html  test-intro.html  quiz.html  results.html
├── dashboard.html  study-guide.html  about.html
└── admin.html  login.html  register.html  reset-password.html

js/
├── quiz-engine.js          # Core quiz logic, timer, CAT slot materialization, offline queue
├── scoring.js              # AFQT (standard-score model) + Army line scores (sums of std scores)
├── quiz-data.js            # Question bank (sections metadata now lives in section-config.js)
├── section-config.js       # Single source of truth for section metadata (timing/counts/names)
├── courses.js              # Study content (~217KB, lazy-loaded on study-guide.html)
├── weak-areas.js           # Per-section accuracy aggregation → weak-area practice/study plan
├── test-config.js          # Test mode configs (quick/full section lists)
├── auth.js                 # Supabase client singleton + session helpers
├── offline-queue.js        # Flush queued (offline) test results when back online
├── admin.js  dashboard.js  # Admin panel + user dashboard logic
├── page-*.js               # Per-page logic (externalized; NO inline <script> — see CSP rule below)
├── focus-trap.js  mobile-menu.js  sw-register.js  year.js  # shared UI/PWA helpers
css/shared.css              # Shared :root tokens, nav, mobile menu, reduced-motion, focus styles
service-worker.js           # App-shell offline cache (bypasses Supabase/cross-origin/admin)
manifest.json  robots.txt  .vercelignore
scripts/
├── validate-site.js        # Data/scoring contract checks (runs as the Vercel buildCommand)
└── check-no-inline-js.js   # CI gate: fails if any inline on*= handler or inline <script> exists
tests/                      # node:test + jsdom suite (76 tests). helpers/load.js, helpers/engine.js
docs/scoring-methodology.md # AFQT model, sources, limits
```

## Development

```bash
npx serve .                    # Local dev server
npm test                       # Run the node:test + jsdom unit suite (76 tests)
node scripts/validate-site.js  # Validate quiz data + scoring contracts (also the Vercel build gate)
node scripts/check-no-inline-js.js  # Verify no inline JS (required by the strict CSP)
git push                       # main auto-deploys to Vercel (build runs validate-site.js)
```

CI (`.github/workflows/ci.yml`) runs `npm ci → npm test → validate-site → check-no-inline-js` on push/PR.

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
| Auto Information | AI | 10 | 7 min | Combined as AS |
| Shop Information | SI | 10 | 6 min | Combined as AS |
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
- **Open question (owner):** General Science timing — this table says 12 min but `section-config.js`
  uses 10 min. Unresolved; reconcile when decided.
