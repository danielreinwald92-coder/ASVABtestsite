# Mission ASVAB — Current Project State

Last verified: July 19, 2026

This is the compact handoff index for a new development session. Read `AGENTS.md` or
`CLAUDE.md` first for binding rules, then use this file to locate current implementation
state and remaining priorities. Historical files under `docs/superpowers/` explain how
features were built; unchecked boxes there are not the current work queue.

## Production Baseline

- Static HTML/JavaScript application deployed from `main` to Vercel. The canonical production
  URL is `https://www.missionasvab.org`; the bare domain permanently redirects to `www`.
- Twelve served pages; account and admin data use Supabase project `rcspwkmrtukblvvdifer`.
- Guest practice works without an account. Every completed test produces a deterministic Today’s
  Mission that opens a real study chapter and checkpoint. Supabase adds saved test/mission history,
  profiles, reports, cross-device mission status, and guarded admin operations.
- The 20-minute Starting-Point Diagnostic uses 18 balanced AR/WK/PC/MK questions and returns
  study priorities without presenting an AFQT percentile or official-test claim.
- The question bank has 902 questions across eight Mission ASVAB practice sections, with
  complete explanation coverage and four AFQT plus four technical study courses.
- Timed practice uses per-section CAT-style scored-question limits. General Science is
  15 questions in 12 minutes, following the [official CAT-ASVAB timing table](https://www.officialasvab.com/applicants/cat-asvab/).
- Mission ASVAB combines Auto/Shop into one AS practice section and omits Assembling
  Objects; the About page discloses the AO omission.

## Verification Baseline

- `npm test` — 197 node:test/jsdom checks.
- `npm run test:e2e` — Chromium checks all 12 pages under the production Vercel headers,
  then completes both a 55-question guest AFQT flow and the 18-question guest diagnostic/mission flow.
- `node scripts/validate-site.js` — question pools, explanations, course shapes, diagnostic blueprint,
  mission catalog targets, and scoring.
- `node scripts/check-no-inline-js.js` — strict CSP guard for every served page.
- Vercel runs the unit, data/scoring, and no-inline-JS gates before publishing output.
- Vercel excludes documentation and local developer-tool configuration from the static output.
- Any change to an existing JavaScript file requires a `CACHE_VERSION` bump in
  `service-worker.js`.

## Source-of-Truth Map

- Section names, counts, and timers: `js/section-config.js`
- Preset section lists and diagnostic blueprint: `js/test-config.js`
- Quiz behavior and persistence: `js/quiz-engine.js`
- Scoring model and limitations: `js/scoring.js` and `docs/scoring-methodology.md`
- Question and explanation content: `js/quiz-data.js` and `js/explanations.js`
- Study courses: `js/courses.js` and `js/courses-tech.js`
- Personalized next step: `js/mission-recommendations.js` and `js/mission-progress.js`
- Supabase client expectations: `js/auth.js`, `js/dashboard.js`, `js/admin.js`
- New database changes: `supabase/migrations/`
- Deployment/security headers: `vercel.json`
- Canonical production routing: Vercel project domains (`www` primary; bare domain → `www` 308)
- Release history visible to users: Recent Updates in `index.html`

## Known Constraints and Next Priorities

1. New personalized-mission schema changes are version-controlled under `supabase/migrations/`,
   but the older Supabase baseline, grants, policies, and RPC definitions still need a repository export.
2. Perform a dedicated privacy/operations review of recruiter lead collection and its Google
   Apps Script destination before materially increasing traffic.
3. Account-synced flashcard progress and reminders remain intentionally deferred because they
   require new writable data surfaces and RLS design.
4. Large static question/course bundles are a future performance-splitting opportunity; keep
   graceful loading behavior and offline support when addressing it.

## Handoff Checklist

Before changing code, confirm current behavior in the source-of-truth files and relevant tests.
Before shipping, run all four verification commands, update affected documentation, add one
plain-language Recent Updates entry for user-visible work, bump the service-worker cache for
existing-JavaScript changes, and confirm the deployed production flow.
