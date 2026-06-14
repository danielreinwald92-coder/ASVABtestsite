# Mission ASVAB — Full Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax. Each task ends with a commit. Run `node scripts/validate-site.js` before every commit once the harness exists.

**Goal:** Execute the agreed 4-phase June 2026 audit remediation: close the critical privilege-escalation hole, harden infra, fix engine/scoring bugs, build a regression suite, rebuild AFQT scoring on a documented public approximation, complete an a11y/perf pass, and ship the queued features — autonomously, verified at every step.

**Architecture:** Static HTML/JS site (no framework, no bundler) on Vercel; Supabase (Postgres + Auth) backend, project `rcspwkmrtukblvvdifer`. New: a Node `package.json` with `node:test` + `jsdom` for unit tests and one Playwright smoke test; a `.vercelignore` + `robots.txt`; a GitHub Actions CI gate; a shared CSS file; a service worker for offline.

**Tech Stack:** Vanilla JS (ES classes), Supabase JS v2 (CDN, to be pinned + SRI), Vercel static hosting, `node:test`/`jsdom`/Playwright for tests, GitHub Actions for CI.

**Resolved product decisions (from `project_audit_open_decisions`):** scoring = best public approximation (documented); MK timer = 31 min; recruiter form keeps sending AFQT but discloses it + adds consent timestamp + spam protection; no minor age-gate (privacy note only); docs/ + preview-*.html excluded from deploy but kept in repo; study-program.js deleted; RLS fixed + verified.

**Default decisions made for autonomy (document in final report):**
- D1 — Mistake history persistence: add compact per-question results to Supabase via a new `question_results jsonb` column on `test_results` (stores `[{id, section, correct}]`, no question text). Enables weak-area practice without bloating rows.
- D2 — Report-a-question: new `question_reports` table with RLS (insert own, admin select).
- D3 — Offline queue: localStorage-backed queue + a service worker for asset caching (no Supabase write while offline; flush on reconnect). Already partially present (`pendingTestResult`); formalize it.
- D4 — Data retention (decision #5, still open): take NO destructive default. Implement user-initiated export + delete (delete already exists). Leave automated retention unbuilt; note it.
- D5 — Leaked-password protection is an Auth dashboard/Management-API setting, not SQL. Attempt via Management API; if not reachable with current creds, surface as the single manual click required.

---

## PHASE 1 — Stabilize & Protect

### Task 1.0 — RLS audit of record (read-only; already performed this session — confirm still true)

**Confirmed 2026-06-14 via execute_sql (record + re-confirm before relying on it):**
- `profiles` policies: `profiles_select_own` USING `auth.uid()=id`; `profiles_select_admin` (authenticated) USING `is_admin()`; `profiles_insert_own` WITH CHECK `auth.uid()=id`; `profiles_update_own` USING `auth.uid()=id`. ✅ own-row scoped. **Note (admin.js:169 lists all users):** admin listing works via `profiles_select_admin` (is_admin()), NOT a public select-all — confirm a NON-admin gets only their own row.
- `test_results` policies: `results_select_own` USING `auth.uid()=user_id`; `results_select_admin` USING `is_admin()`; `results_insert_own` WITH CHECK `auth.uid()=user_id`. ✅ own-`user_id` scoped. No DELETE policy (direct deletes blocked).
- Admin RPCs (`admin_delete_user`, `admin_delete_user_tests`, `admin_set_is_admin`, `admin_user_signins`) — all begin `IF NOT public.is_admin() THEN RAISE EXCEPTION 'not authorized'`. ✅ self-guard. `delete_my_account` derives target from `me uuid := auth.uid()` and only deletes self. ✅ `is_admin()` reads `profiles WHERE id=auth.uid() AND is_admin` → false for anon/non-admin. ✅

- [ ] **Step 1 — Re-confirm** the above with `execute_sql` (pg_policies + pg_get_functiondef for the 5 funcs). If anything diverges from the recorded state, STOP and reassess.
- [ ] **Step 2 — No commit** (read-only); proceed to 1.1.

### Task 1.1 — Close the `is_admin` privilege-escalation hole (CRITICAL)

**Surface:** `authenticated`/`anon` hold column UPDATE+INSERT on `public.profiles.is_admin`; `profiles_update_own` RLS allows own-row writes; no guard trigger. Confirmed exploitable: a user can self-promote via `PATCH /profiles?id=eq.<uid> {"is_admin":true}`. Same risk applies to `email` (account takeover surface). The admin RPCs are SECURITY DEFINER **and self-guard with `is_admin()` (verified in Task 1.0)**, so revoking the column grant does NOT relocate the hole into the RPC — the admin UI keeps working, non-admins still get "not authorized".

- [ ] **Step 1 — Apply migration** (via `mcp__plugin_supabase_supabase__apply_migration`, name `revoke_sensitive_profile_columns`):
```sql
REVOKE INSERT (is_admin), UPDATE (is_admin) ON public.profiles FROM anon, authenticated;
REVOKE INSERT (email),    UPDATE (email)    ON public.profiles FROM anon, authenticated;
```
- [ ] **Step 2 — Verify grants gone:** run `execute_sql`:
```sql
select grantee, column_name, privilege_type from information_schema.column_privileges
where table_schema='public' and table_name='profiles' and column_name in ('is_admin','email')
and grantee in ('anon','authenticated') order by 1,2,3;
```
Expected: no `UPDATE`/`INSERT` rows for is_admin/email (only SELECT/REFERENCES may remain).
- [ ] **Step 3 — ACTIVE non-admin exploit test (belt-and-suspenders).** Pick a real non-admin profile id `:uid`. In `execute_sql`, simulate the authenticated role + JWT and attempt the escalation; assert it is blocked by the grant:
```sql
-- emulate PostgREST authenticated context for a non-admin user
set local role authenticated;
set local request.jwt.claims = '{"sub":":uid","role":"authenticated"}';
-- this MUST fail with: permission denied for column is_admin (or 0 rows / error)
update public.profiles set is_admin = true where id = ':uid'::uuid;
reset role;
```
Expected: ERROR `permission denied for column is_admin`. If it succeeds, the revoke didn't take — STOP. (Wrap in a transaction you roll back so no state changes: `begin; ... ; rollback;`.)
- [ ] **Step 4 — Verify admin path still works:** the SECURITY DEFINER `admin_set_is_admin` runs as owner and bypasses the column revoke; no `js/admin.js` change needed. (Optional) confirm by reading its owner role.
- [ ] **Step 5 — Confirm app writes don't touch these columns:** `js/dashboard.js:395-405` updates `{name, education, age, zipcode, test_date}` only (no email/is_admin) — OK. `register.html:144-146` updates `{name, education, age, zipcode}` — OK. Email is set at signUp via auth, synced by `handle_new_user` trigger on INSERT — OK.
- [ ] **Step 6 — Re-run advisors:** `get_advisors(type=security)`; confirm no new criticals. Document remaining SECURITY DEFINER warns as accepted (functions self-guard, proven in 1.0).
- [ ] **Step 7 — Commit** (docs only; DB change has no repo artifact besides this plan + a migration note):
```bash
git add docs/superpowers/plans/2026-06-14-asvab-remediation.md
git commit -m "docs: record RLS column-grant remediation (is_admin/email revoke)"
```

### Task 1.2 — Email→profiles sync + delete cascade verification (read-only confirm; fix only if broken)

- [ ] **Step 1** — `execute_sql`: list triggers on `auth.users` and confirm whether email updates propagate to `profiles.email`. `handle_new_user` only fires on INSERT. If users can change their auth email, `profiles.email` will drift.
- [ ] **Step 2** — Confirm `profiles_id_fkey` (`profiles.id → auth.users.id`) and `test_results_user_id_fkey` ON DELETE behavior.
```sql
select tc.constraint_name, rc.delete_rule from information_schema.referential_constraints rc
join information_schema.table_constraints tc on tc.constraint_name=rc.constraint_name
where tc.table_schema='public';
```
- [ ] **Step 3** — If `profiles` delete is not `CASCADE` from auth.users (or test_results not cascade from profiles), add an `apply_migration` to set `ON DELETE CASCADE` so `delete_my_account`/`admin_delete_user` fully clean up. If already cascade, no-op.
- [ ] **Step 4** — If email drift is possible, add a SECURITY DEFINER trigger on `auth.users` AFTER UPDATE OF email to sync `profiles.email`. Migration name `sync_profile_email`. (Only if Step 1 shows drift.)
- [ ] **Step 5 — Commit** the migration note in plan if any change applied.

### Task 1.3 — Leaked-password protection + auth hardening (rate limiting / CAPTCHA / enumeration)

- [ ] **Step 1** — Attempt to enable, via Supabase Management API (`PATCH /v1/projects/{ref}/config/auth`) using the OAuth session: (a) leaked-password protection, (b) reasonable password min length, (c) auth rate limiting (lower per-hour signup/OTP/token limits if defaults are permissive). If creds/tooling don't permit a setting, record it in the final report as a required manual dashboard toggle (list each one). **Do not claim a setting is enabled unless the API response confirms it.**
- [ ] **Step 2 — CAPTCHA:** check whether Auth bot/abuse protection (hCaptcha/Turnstile) is configurable via the Management API. If yes and enabling it requires a client-side widget, scope that as a follow-up (it touches `register.html`/`login.html` markup + CSP `script-src`/`frame-src`) and record the decision; if it can't be enabled without a provider key the owner must supply, surface that as a manual item rather than half-wiring it.
- [ ] **Step 3** — Confirm signup email-enumeration posture (Supabase returns generic responses by default). Inspect `register.html`/`login.html` error handling; if any path surfaces "email already registered" specifically, make the copy generic.
- [ ] **Step 4 — Verify:** re-read the auth config via the Management API (`GET .../config/auth`) and assert each intended flag is set; jsdom-test any client copy change.
- [ ] **Step 5 — Commit** any client copy change; record auth-config state (enabled vs manual-needed) for the final report.

### Task 1.4 — Exclude docs/ + preview-*.html from deploy; add robots.txt

**Files:** Create `.vercelignore`, `robots.txt`. Keep files in git.

- [ ] **Step 1** — Create `/Users/dan/Desktop/ASVAB/.vercelignore`. **Do NOT exclude `scripts/`** — the build gate (Task 1.6) runs `node scripts/validate-site.js`, which must exist at build time; excluding it would fail every deploy. Also do NOT exclude `js/` (validate loads it). Exclude only:
```
docs/
preview-*.html
.github/
*.md
```
(`scripts/validate-site.js` becomes reachable at `/scripts/validate-site.js` — zero secrets, negligible. `package.json`/`package-lock.json` are NOT excluded.)
- [ ] **Step 2** — Create `/Users/dan/Desktop/ASVAB/robots.txt`:
```
User-agent: *
Disallow: /admin.html
Disallow: /preview-
Sitemap: https://<PROD_DOMAIN>/sitemap.xml
```
(Resolve `<PROD_DOMAIN>` from `vercel.json`/project; if unknown, omit Sitemap line.)
- [ ] **Step 3** — Verify `.vercelignore` globs don't exclude anything served (only docs/preview/scripts/.github/markdown). `index.html` etc. unaffected.
- [ ] **Step 4 — Commit:** `chore: exclude docs/preview/scripts from Vercel deploy + add robots.txt`.

### Task 1.5 — Pin Supabase CDN version + SRI on all 8 pages

**Files:** `admin.html:201`, `dashboard.html:276`, `index.html:1059`, `login.html:85`, `quiz.html:590`, `register.html:88`, `results.html:1053`, `reset-password.html:64`.

- [ ] **Step 1** — Resolve the exact pinned URL FIRST, then hash THOSE bytes (hash mismatch = dead auth on all pages). Determine the resolved version + correct UMD path: `curl -sL https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2 -o /tmp/sb.js` and `curl -sI https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2` to read the resolved version; confirm the canonical UMD file path for that version (likely `@2.X.Y/dist/umd/supabase.js`). Download the **exact pinned URL you will reference** (not the `@2` redirect) and compute SRI from that identical file: `curl -sL "<PINNED_URL>" | openssl dgst -sha384 -binary | openssl base64 -A`.
- [ ] **Step 2** — Replace each `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>` (8 pages) with:
```html
<script src="<PINNED_URL>" integrity="sha384-<HASH>" crossorigin="anonymous"></script>
```
- [ ] **Step 3** — Keep CSP `script-src https://cdn.jsdelivr.net` (no widening).
- [ ] **Step 4 — Automated verify (REQUIRED before commit):** add a temporary Playwright/node check (or extend the smoke) that loads at least one auth page (e.g. `login.html`) and asserts `window.supabase` is defined after load (proves SRI accepted the file). Manual `npx serve` eyeballing is NOT sufficient (it doesn't apply the prod CSP). Only commit once the global is confirmed on a real page load.
- [ ] **Step 5 — Commit:** `chore: pin Supabase CDN version + add SRI integrity`.

### Task 1.6 — Wire validate-site.js into Vercel build + minimal validate-only CI

**Files:** `vercel.json` (buildCommand), new `.github/workflows/ci.yml`. **NOTE:** the FULL `npm ci`/`npm test` CI job is deferred to Task 2.1b (after `package.json`+lockfile exist). This task adds only the dependency-free validate gate so Phase 1 is self-contained.

- [ ] **Step 1** — Set `vercel.json` `buildCommand` to `node scripts/validate-site.js` (outputDirectory stays `.`). validate-site.js uses only Node builtins (`fs`,`path`,`vm`) — no install needed. Non-zero exit blocks the deploy; it reads files only (no writes), so deployed output is unchanged.
- [ ] **Step 2** — Create `.github/workflows/ci.yml` on push/PR: checkout, setup-node 20, then a single step `node scripts/validate-site.js` (NO npm ci/npm test yet — nothing to install).
- [ ] **Step 3 — Verify** workflow YAML parses: `python3 -c "import yaml;yaml.safe_load(open('.github/workflows/ci.yml'))"`. And run `node scripts/validate-site.js` locally → exit 0.
- [ ] **Step 4 — Commit:** `ci: validate-site in Vercel build + GitHub Actions gate`.

---

## PHASE 2 — Reliability & Correctness

### Task 2.1 — Bootstrap the test harness (package.json + node:test + jsdom)

**Files:** Create `package.json`, `tests/setup.js`, `tests/helpers/load.js`.

- [ ] **Step 1** — Create `package.json` with devDeps `jsdom`, `@playwright/test`; scripts: `"test": "node --test tests/unit"`, `"test:e2e": "playwright test"`, `"validate": "node scripts/validate-site.js"`. Engines node>=20.
- [ ] **Step 2** — `npm install` to generate lockfile.
- [ ] **Step 3** — Create `tests/helpers/load.js`: a helper that loads a given `js/*.js` file into a `vm` context (mirroring validate-site.js's loader) and returns its globals (`MissionASVABScoring`, `asvabData`, etc.) for assertion.
- [ ] **Step 4 — Verify:** `node --test tests/unit` runs (0 tests OK) with exit 0.
- [ ] **Step 5 — Commit:** `test: bootstrap node:test + jsdom harness`.

### Task 2.1b — Upgrade CI to full npm gate (now that package.json + lockfile exist)

**Files:** `.github/workflows/ci.yml` (created minimal in Task 1.6).

- [ ] **Step 1** — Add steps after checkout/setup-node: `npm ci`, `npm test`, then `node scripts/validate-site.js`. (The Playwright e2e job can be a separate workflow or a `continue-on-error` step until Task 2.12 lands; don't let a missing browser fail the gate prematurely.)
- [ ] **Step 2 — Verify** YAML parses (`python3 -c "import yaml;yaml.safe_load(open('.github/workflows/ci.yml'))"`); confirm `npm ci` works against the committed lockfile.
- [ ] **Step 3 — Commit:** `ci: add npm ci + unit tests to gate`.

### Task 2.2 — Scoring tests, split into INVARIANT (survives rebuild) vs CHARACTERIZATION (replaced by 3.1)

**Files:** `tests/unit/scoring.invariants.test.js`, `tests/unit/scoring.characterization.test.js`.

**Rationale:** Task 3.1 deliberately changes scoring *outputs*. Tests asserting specific mid-range numbers will (correctly) break then. Separate the two so the rebuild doesn't look like a regression.

- [ ] **Step 1 — INVARIANT tests** (must hold before AND after 3.1): perfect input → AFQT === 99; zero/empty input → AFQT ≥ 1 and NOT NaN; full sections → exactly 10 line scores; all line scores are integers and not NaN; AFQT monotonic non-decreasing as inputs rise; line-score composite *structure* uses the right sections (GT uses VE+AR, ST uses GS+VE+MK+MC, etc.) — assert which sections feed each, not the exact multiplier. These mirror `validate-site.js` invariants (perfect→99, 10 line scores) so CI and units agree.
- [ ] **Step 2 — CHARACTERIZATION tests** (label clearly `@characterization — expected to change in Task 3.1`): snapshot a few current outputs (the heuristic percentile + current line-score numbers) so we can SEE exactly what the rebuild changes. Task 3.1 will replace these with new-curve anchor tests.
- [ ] **Step 3 — Run, expect pass.**
- [ ] **Step 4 — Commit:** `test: scoring invariants + characterization split`.

### Task 2.3 — Engine ID-contract + page-structure tests (jsdom)

**Files:** `tests/unit/dom-contracts.test.js`.

- [ ] **Step 1 — Write tests** that load each HTML page into jsdom and assert the element IDs the JS depends on exist (e.g., `quiz.html` has `#timerLive`, `#diagnosticBtn` on dashboard, `#afqtScore`/`#afqtPercentile` on results, recruiter form fields on index). Prevents "JS references missing ID" regressions.
- [ ] **Step 2 — Run, fix any** genuine missing-ID findings.
- [ ] **Step 3 — Commit:** `test: DOM id-contract coverage`.

### Task 2.4 — Fix visibilitychange listener leak

**File:** `js/quiz-engine.js:212-222` (in `startTimer`).

- [ ] **Step 1 — Write failing test** (jsdom): instantiate engine, call `startTimer()` N times, assert only one visibilitychange handler is attached (track via a spy on `document.addEventListener`).
- [ ] **Step 2 — Fix:** move the visibilitychange handler registration OUT of `startTimer` into `init`/constructor (register once), or store `this._visHandler` and `removeEventListener` before re-adding. The handler should pause/resume the interval without re-binding.
- [ ] **Step 3 — Run, expect pass.**
- [ ] **Step 4 — Commit:** `fix: stop visibilitychange listener accumulation in quiz engine`.

### Task 2.5 — Double-submit guard

**File:** `js/quiz-engine.js` (`submitQuiz` ~463; ALL callers: `nextQuestion` 428, `showSubmitConfirm` 458, **and the timer-expiry path `this.submitQuiz()` at ~206**). The guard must cover the timer-expiry race (timer hits 0 while a manual submit is in flight).

- [ ] **Step 1 — Write failing test:** call `submitQuiz()` twice rapidly (and simulate timer-expiry calling it during an in-flight manual submit); assert `saveResultsToSupabase` is invoked at most once.
- [ ] **Step 2 — Fix:** add `this._isSubmitting` guard at top of `submitQuiz` (`if (this._isSubmitting) return; this._isSubmitting = true;`). Disable the submit button in DOM on first click. **Reset semantics:** `saveResultsToSupabase` swallows its own errors and returns a result object (it does NOT throw — quiz-engine.js:566-593 queues failures to `pendingTestResult`), so submission always "completes". Therefore: do NOT auto-reset the guard in a finally; the flow proceeds to results either way. Only clear `_isSubmitting` if the code path keeps the user on the quiz page (it doesn't, normally). Net: guard stays set through navigation — correct.
- [ ] **Step 3 — Run, expect pass.**
- [ ] **Step 4 — Commit:** `fix: guard against double quiz submission (incl. timer-expiry race)`.

### Task 2.6 — Wire showSubmitConfirm + clear stale results

**Files:** `js/quiz-engine.js` (`nextQuestion` 416-429, `showSubmitConfirm` 446-460, `submitQuiz`, `startNewTest` 654-658).

- [ ] **Step 1** — In `nextQuestion`, on the last question call `showSubmitConfirm()` instead of `submitQuiz()` directly, so users get the review/confirm step. Keep the confirm copy listing unanswered count.
- [ ] **Step 2** — In `startNewTest` (and at start of a fresh test), `localStorage.removeItem('quizResults')` so a new test never shows a prior result.
- [ ] **Step 3 — Test:** jsdom test that last-question advance triggers confirm path; and that startNewTest clears `quizResults`.
- [ ] **Step 4 — Commit:** `fix: wire submit-confirm + clear stale quizResults on new test`.

### Task 2.7 — MK timer 23→31 min

**File:** `js/quiz-data.js:45`.

- [ ] **Step 1 — Test:** assert `asvabData.sections.MK.timeLimit === 31*60`.
- [ ] **Step 2 — Fix:** change `23 * 60` → `31 * 60`.
- [ ] **Step 3** — Reconcile CLAUDE.md section table (already says 31) — no change needed; note other sections vs CLAUDE.md (GS 12 vs data 10, EI 10 ok, AR 55 ok). **Verify each section timeLimit against CLAUDE.md; fix mismatches or document why data differs.** (CLAUDE.md GS=12min but data=10min; AS=7 ok; SI not in data. Decide canonical: CLAUDE.md is spec → align data to it, or update CLAUDE table. Default: align data to CLAUDE.md spec where they conflict, and update CLAUDE.md LEARNED note.)
- [ ] **Step 4 — Run validate + tests; Commit:** `fix: correct section timings to spec (MK 31min, GS 12min)`.

### Task 2.8 — NaN% guard in results + section breakdown

**File:** `results.html:1162-1200` (and dashboard render paths).

- [ ] **Step 1 — Test (jsdom):** render section breakdown with `{correct:0,total:0}`; assert no `NaN` appears in output and width is `0%`.
- [ ] **Step 2 — Fix:** `const percent = data.total > 0 ? Math.round((data.correct/data.total)*100) : 0;` everywhere this pattern appears (results.html, dashboard.js section cards/history).
- [ ] **Step 3 — Commit:** `fix: guard divide-by-zero NaN% in score rendering`.

### Task 2.9 — DiagnosticBtn race + registration error surfacing

**Files:** `dashboard.html:281-289`, `register.html:133-150`.

- [ ] **Step 1 — DiagnosticBtn:** make the handler `await` the profile update and only then navigate (`window.location.href='select-test.html'`); surface failures with a visible message instead of silent. Prevent default link nav until save resolves.
- [ ] **Step 2 — Registration:** when `profileError` occurs after successful signUp, surface a visible warning ("Account created, but profile details didn't save — update them in your dashboard") instead of console-only.
- [ ] **Step 3 — Test:** jsdom tests for both surfacing paths (mock client).
- [ ] **Step 4 — Commit:** `fix: await diagnostic save + surface registration/profile errors`.

### Task 2.10 — Recruiter form hardening + consent timestamp + disclosure

**Files:** `index.html:975-1050`, `results.html` (mirrored form).

**CORS CONSTRAINT (do not regress working submits):** the endpoint is a Google Apps Script `/exec`, which 302-redirects to `script.googleusercontent.com` and returns NO CORS headers for arbitrary origins. The current code deliberately ignores the response. Reading `res.ok`/`res.json()` would throw a CORS/opaque error and route SUCCESSFUL submissions into `.catch()` → false "Something went wrong". **Therefore: do NOT add response-body validation.** Keep fire-and-forget semantics (optionally `mode:'no-cors'`, which yields an opaque response you cannot read — treat reaching `.then` without a network error as "submitted").

- [ ] **Step 1** — Add a fetch timeout via `AbortController` (~10s) so a hung request shows an error instead of spinning forever. On `AbortError`/network error → show the existing error alert. On resolve (opaque) → show success. Do NOT inspect `res.ok`/body.
- [ ] **Step 2** — Add a hidden honeypot field (`<input name="company" style="position:absolute;left:-9999px" tabindex="-1" autocomplete="off" aria-hidden="true">`) — if filled, silently no-op (pretend success, don't send). Disable the submit button while in-flight (double-click guard), re-enable on completion/error.
- [ ] **Step 3** — Capture consent: add `consentText` (exact checkbox copy) + `consentTimestamp` (ISO) to the payload. Update on-page disclosure copy to explicitly state the practice AFQT estimate is shared with recruiters (decision #3). For the results.html form, `practiceScore` is filled with the AFQT — the disclosure must name that.
- [ ] **Step 4** — Mirror identical changes in `results.html` form (source:'results', practiceScore filled with AFQT).
- [ ] **Step 5 — Test:** jsdom — honeypot blocks send; timeout (AbortController) shows error; payload includes `consentText`+`consentTimestamp`; submit button disables during flight. Mock fetch (resolve + reject + abort).
- [ ] **Step 6 — Commit:** `feat: harden recruiter form (timeout, honeypot, consent capture, AFQT disclosure)`.

### Task 2.11 — Escape remaining innerHTML sinks + escHtml single-quote + form double-click guards

**Files:** `js/admin.js` (escHtml 387-393), `results.html` review list, any sink interpolating dynamic strings.

- [ ] **Step 1** — Replace the inline `onclick="openUserModal('${u.id}')"` row handler (admin.js:169) with `data-id="${u.id}"` + a delegated click listener on the table body. (Note: `u.id` is currently interpolated RAW, not via escHtml — and it's a server UUID, low risk — but moving to `data-id` removes the inline handler entirely, which Phase 3 CSP work needs.) Also extend `escHtml` to escape single quotes (`'`→`&#39;`) defensively for any value that lands inside a single-quoted attribute.
- [ ] **Step 2** — Audit the sinks flagged "safe because static" and confirm none interpolate Supabase profile text (name/email/education/zipcode) without `escHtml`; wrap any that do. Focus on admin.js modal/table and dashboard.js history rows.
- [ ] **Step 3** — Add submit-guard (disable button on submit) to login/register/reset-password/dashboard account forms.
- [ ] **Step 4 — Test + Commit:** `fix: tighten HTML escaping + form double-submit guards`.

### Task 2.12 — Playwright smoke test (1 happy path)

**Files:** `tests/e2e/smoke.spec.js`, `playwright.config.js`.

- [ ] **Step 1** — Config to serve the static site (`npx serve` / Playwright webServer) and run one test: load index → start a Quick AFQT test → answer all → reach results → assert an AFQT number renders (not NaN). Use a seeded/deterministic question path if possible, else just assert flow + numeric score.
- [ ] **Step 2 — Run** `npx playwright install --with-deps chromium` then `npm run test:e2e`; expect pass.
- [ ] **Step 3 — Commit:** `test: Playwright smoke for AFQT happy path`.

---

## PHASE 3 — Scoring Rebuild + A11y + Perf

### Task 3.1 — Research + implement a documented public AFQT approximation

**File:** `js/scoring.js`, new `docs/scoring-methodology.md`.

- [ ] **Step 1 — Research** (web): the WK+PC→VE table and the AFQT raw (2·VE+AR+MK) → percentile mapping from the 1997 NLSY norming as publicly approximated. Capture a defensible piecewise/logistic mapping with citations. Current code uses a percent-average heuristic (`scoring.js:11-25`) — not real percentiles.
- [ ] **Step 2 — Write tests** encoding the target curve's anchor points (e.g., the CLAUDE.md anchors: raw≈85→31st, ≈100→50th, ≈135→93rd; plus standard-score scaling for sections). Tests assert monotonicity and anchor accuracy within tolerance.
- [ ] **Step 3 — Implement:** convert raw section %correct → ASVAB standard scores (mean 50, sd 10 approximation), compute VE from WK+PC, AFQT raw, then map raw→percentile via the researched curve. Replace the heuristic. **Rework `calculateLineScores` (scoring.js:45-54), do NOT keep it as-is:** the current `*0.75`/`*0.5`/`*0.375` multipliers exist to fake a scaled number out of percentages. With real standard scores, Army line scores are **SUMS of standard scores** (composites routinely 80-150+), not multiplied-down percentages — so REMOVE the multipliers and sum the standard scores per the documented formulas (GT=VE+AR, CL=VE+AR+MK, CO=AR+AS+MC, EL=GS+AR+MK+EI, FA=AR+MK+MC, GM=GS+AS+MK+EI, MM=AS+MC+EI, OF=VE+AS+MC, SC=VE+AR+AS+MC, ST=GS+VE+MK+MC). Verify outputs land in realistic Army ranges; update the invariant tests' *structure* expectations accordingly (still exactly 10, integer, no NaN).
- [ ] **Step 4 — Document** methodology + limits + sources in `docs/scoring-methodology.md`; reconcile CLAUDE.md "Percentile Scoring" section.
- [ ] **Step 5 — Run** scoring tests + validate-site (perfect→99 still holds); **Commit:** `feat: rebuild AFQT scoring on documented public approximation`.

### Task 3.2 — Reduced-motion support (DO AFTER Task 3.6 — shared CSS exists)

**Files:** `css/shared.css` (created in Task 3.6). **Sequencing:** run Task 3.6 FIRST, then add this once to the shared stylesheet (avoids editing 12 pages then de-duping).

- [ ] **Step 1** — Add to `css/shared.css` (covers every page that links it):
```css
@media (prefers-reduced-motion: reduce){*{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important;}}
```
For any page not yet migrated to shared.css, add the block inline.
- [ ] **Step 2 — Verify** via jsdom presence test (assert the media query string exists in shared.css and is linked) or manual; **Commit:** `a11y: respect prefers-reduced-motion site-wide`.

### Task 3.3 — Keyboard accessibility: select-test cards, quiz answers, mobile menu

**Files:** `select-test.html:420-459,603-619`, `quiz.html` answer options + `js/quiz-engine.js` render, `index.html`/`study-guide.html`/`about.html` mobile menu.

- [ ] **Step 1 — select-test cards:** add `role="button"` (or radio group semantics), `tabindex="0"`, and a `keydown` handler (Enter/Space) mirroring click.
- [ ] **Step 2 — quiz answers:** make `.answer-option` focusable (`tabindex=0`, `role="radio"` within `role="radiogroup"`), Enter/Space selects; add a visible keyboard hint ("Press A–D"). Keep existing A/B/C/D shortcuts.
- [ ] **Step 3 — mobile menu:** add `:focus-visible` outlines, Escape-to-close, and a focus trap while open; return focus to the hamburger on close.
- [ ] **Step 4 — Test** (jsdom: handlers present/keydown selects) + manual; **Commit:** `a11y: keyboard nav for select-test, quiz answers, mobile menu`.

### Task 3.4 — Modal focus management (admin + dashboard)

**Files:** `admin.html:194-199` + `js/admin.js`, `dashboard.html:221` + `js/dashboard.js`.

- [ ] **Step 1** — On open: move focus to first interactive element / close button; trap Tab within modal; restore focus to the trigger on close; ensure Escape closes (admin already has it at admin.js:421 — replicate for dashboard).
- [ ] **Step 2 — Test + Commit:** `a11y: focus trap + restore for modals`.

### Task 3.5 — Contrast, labels, aria-sort, live regions

**Files:** color tokens in shared/page CSS; `admin.html:132-159` filter inputs; `admin.html:175` sortable headers; quiz/results live regions.

- [ ] **Step 1** — Fix gold-on-cream (#d4a853 on #faf8f5 ~3.5:1) where used for TEXT to reach ≥4.5:1 (introduce a darker `--gold-text` token, e.g. ~#a07b2c, for text contexts; keep brand gold for non-text accents). **Verify with a measurement:** a tiny node script computing WCAG contrast ratio for each changed fg/bg pair (relative-luminance formula) asserting ≥4.5 for normal text / ≥3.0 for large text. List each pair fixed.
- [ ] **Step 2** — Add `<label>`s (visually-hidden ok) to admin filter inputs; add `aria-sort` to sortable `<th>` and update it on sort.
- [ ] **Step 3** — Verify quiz timer + results score live regions announce sensibly (avoid over-announce: timer `aria-live="off"` except at thresholds, or coarse updates).
- [ ] **Step 4 — Commit:** `a11y: contrast, form labels, aria-sort, live-region tuning`.

### Task 3.6 — Extract shared CSS + nav, delete study-program.js

**Files:** new `css/shared.css`; all HTML pages; delete `js/study-program.js`.

- [ ] **Step 1 — Delete** `js/study-program.js` (confirmed unreferenced) and grep to re-confirm zero references. Update validate-site.js if it loads it (it loads courses.js, not study-program — confirm).
- [ ] **Step 2 — Create** `css/shared.css` with the duplicated `:root` tokens, nav/header, mobile menu, footer, common buttons/forms. Link it from each page; remove the now-duplicated inline blocks page-by-page, verifying layout unchanged after each.
- [ ] **Step 3** — Update CSP `style-src` if moving to external stylesheet lets us drop some inline styles (keep `'unsafe-inline'` only if still needed after Task 3.7).
- [ ] **Step 4 — Verify** each page renders unchanged. Migrate ONE page first, Playwright-screenshot it before/after, diff; only proceed to the rest once the pattern is proven. Commit per-page or in small batches (not all 12 at once) so a visual regression is bisectable. Run validate-site + tests after each batch.
- [ ] **Step 5 — Commit:** `perf: extract shared CSS/nav, delete dead study-program.js`.

### Task 3.7 — Convert inline event handlers → listeners; tighten CSP

**Files:** all HTML pages (67 handlers) + their JS.

- [ ] **Step 1** — Page by page, replace `onclick=`/`onsubmit=` with `data-action` attributes + a delegated listener in the page's JS (or dedicated init). Cover the template-string handlers in study-guide.html and admin.js row rendering (`onclick="openUserModal('${id}')"` → `data-id` + delegation).
- [ ] **Step 2** — Once a page has zero inline handlers and zero inline event attrs, it no longer needs `'unsafe-inline'` for scripts. After ALL pages converted, remove `'unsafe-inline'` from CSP `script-src` in vercel.json. (Inline `<script>` blocks must also be moved to files or hashed — audit: there are inline `<script>` blocks on most pages; move page logic to `js/page-*.js` or add CSP hashes. Default: move to external per-page JS files.)
- [ ] **Step 3** — Keep `style-src 'unsafe-inline'` if inline styles remain (lower risk); note as follow-up if not fully removed.
- [ ] **Step 4 — Add an automated guard BEFORE dropping unsafe-inline:** a node/CI check that greps every served HTML page and FAILS if any `on*=` attribute or non-empty inline `<script>` (without a CSP hash) remains. This is the gate — do not rely on eyeballing. Also handle `document.write(new Date().getFullYear())` (5 pages) and the Vercel Analytics bootstrap (`index.html:1058`) — move date-write to an external script or a static year; confirm `/_vercel/insights/script.js` is an external src (allowed) not an inline bootstrap.
- [ ] **Step 5 — Extend e2e to ALL pages under prod CSP:** the single happy-path smoke (2.12) never loads admin/dashboard/login/study-guide/reset-password. Add a Playwright test that visits every served page WITH the production CSP applied and asserts zero console errors / zero CSP violations. Only after this passes, remove `'unsafe-inline'` from `script-src` in vercel.json.
- [ ] **Step 6 — Commit:** `security: remove inline handlers/scripts, drop script-src unsafe-inline`.

### Task 3.8 — Split section metadata out of quiz-data.js + lazy-load courses.js

**Files:** new `js/section-config.js`; `js/quiz-data.js`; `study-guide.html` (courses loader).

- [ ] **Step 1** — Move `asvabData.sections` (timing/counts/names) into `js/section-config.js` as the single source of section metadata; have quiz-data reference it (or keep questions keyed by code and read config from the new file). Update all consumers (quiz-engine, test-config, scoring, validate-site).
- [ ] **Step 2** — Lazy-load `courses.js` (217KB) only when a course is opened on study-guide.html (dynamic `import()` or injected `<script>` on demand), not on initial page load.
- [ ] **Step 3 — Verify** validate-site (it asserts section contracts + courses) still passes; study-guide course open still works.
- [ ] **Step 4 — Commit:** `perf: split section metadata; lazy-load courses.js`.

---

## PHASE 4 — Features

### Task 4.1 — Persist per-question results (DB) + capture on submit

**Files:** Supabase migration; `js/quiz-engine.js:552-568` (strip step).

- [ ] **Step 1 — Migration** `add_question_results` (apply_migration): `ALTER TABLE public.test_results ADD COLUMN question_results jsonb;` No RLS change (existing policies cover the row). Keep payload compact.
- [ ] **Step 2** — In `submitQuiz`, instead of fully stripping, also send `question_results = [{id, section, correct}]` (no text/options — keep small). Verify insert still satisfies RLS (`auth.uid()=user_id`).
- [ ] **Step 3 — Test** (jsdom + mock client): payload includes compact question_results.
- [ ] **Step 4 — Commit:** `feat: persist compact per-question results for weak-area analysis`.

### Task 4.2 — Mistake history → weak-area practice → study plan

**Files:** `js/dashboard.js` (focus panel 1128-1149), new `js/weak-areas.js`, `study-guide.html`/`select-test.html` entry points.

- [ ] **Step 1** — Aggregate `question_results` across a user's tests into per-section (and, where mappable, per-topic/chapter) accuracy. Extend the existing focus-panel weak-area detection to use historical question data, not just the latest test.
- [ ] **Step 2** — "Practice my weak areas": generate a targeted quiz drawing questions from the weakest sections (reuse QuizManager pools). Wire a button from dashboard/results.
- [ ] **Step 3** — "Study plan": map weakest sections → recommended `courses.js` chapters; render an ordered plan on dashboard/study-guide. (Leverage existing courses chapter structure.)
- [ ] **Step 4 — Test** (unit for aggregation logic) + manual; **Commit:** `feat: weak-area practice + study plan from mistake history`.

### Task 4.3 — Report-a-question

**Files:** Supabase migration (`question_reports` + RLS); `quiz.html`/`results.html` review UI; `js/quiz-engine.js`/results JS; optional admin view in `admin.html`.

- [ ] **Step 1 — Migration:** create `public.question_reports (id uuid pk default gen_random_uuid(), user_id uuid references profiles(id), question_id text, test_type text, reason text, details text, created_at timestamptz default now())`; enable RLS; policies: insert where `auth.uid()=user_id`; select where `is_admin()`.
- [ ] **Step 2** — Add a "Report this question" control in the results review list; submit inserts a report (rate-limit client-side; sanitize details).
- [ ] **Step 3** — (Optional) admin.html list of reports.
- [ ] **Step 4 — Test + Commit:** `feat: report-a-question with RLS-protected reports table`.

### Task 4.4 — Offline queue + service worker

**Files:** new `service-worker.js`, `manifest.json`; registration in pages; formalize `pendingTestResult` flush.

- [ ] **Step 1** — Add a service worker caching the app shell (HTML/CSS/JS, NOT Supabase API). Register on each page. Add `manifest.json` (name, icons, theme) for installability.
- [ ] **Step 2** — Formalize offline result queue: on submit while offline, enqueue to localStorage (the `pendingTestResult` mechanism already exists at quiz-engine.js:574-593); on `online`/next load, flush queued results to Supabase. Add status messaging.
- [ ] **Step 3** — Ensure CSP allows the service worker (same-origin) and that the SW doesn't cache `admin.html`/auth-sensitive responses.
- [ ] **Step 4 — Test** (Playwright offline mode if feasible; else manual) + **Commit:** `feat: offline app-shell SW + result queue flush`.

### Task 4.5 — User data export

**Files:** `dashboard.html` + `js/dashboard.js`.

- [ ] **Step 1** — Add a "Download my data" button: query the user's profile + all `test_results`, generate JSON (and/or CSV) client-side, trigger download. Data already fetched in dashboard.js.
- [ ] **Step 2 — Test + Commit:** `feat: user-initiated data export`.

---

## Final verification (after all tasks)

- [ ] `node scripts/validate-site.js` → passes
- [ ] `npm test` (node:test units) → all pass
- [ ] `npm run test:e2e` (Playwright smoke) → passes
- [ ] `get_advisors(security)` + `get_advisors(performance)` → no unresolved criticals; documented residuals only
- [ ] Re-verify RLS: a simulated non-admin cannot update is_admin (column grant gone)
- [ ] Manual click-through of every page with the tightened CSP (no console errors)
- [ ] Update memory `project_remediation_plan.md` → mark phases complete; update CLAUDE.md LEARNED/scoring section
- [ ] Summary report to user: what shipped, the default decisions taken (D1–D5), and any manual step left (e.g., leaked-password toggle if Management API was not reachable)

---

## Open items deliberately NOT auto-decided
- Data retention policy (decision #5): no automated deletion implemented; export + manual delete provided. Flag for owner.
- Whether to keep sending practice AFQT to recruiters is RESOLVED (yes, with disclosure) — implemented in 2.10.
