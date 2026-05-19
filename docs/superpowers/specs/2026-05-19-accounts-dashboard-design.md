# Accounts, Dashboard & Lead Generation — Design Spec
**Date:** 2026-05-19  
**Project:** Mission ASVAB  
**Status:** Approved

---

## Overview

Add user accounts, a smart study dashboard, and a private admin/lead view to Mission ASVAB. The site remains fully static on Vercel. Supabase provides auth, database, and email — no backend server required.

**Goals:**
1. Let users save and track their practice test scores over time
2. Surface intelligent, data-driven study suggestions based on weak sections and score trends
3. Capture lead data (email, name, age, education, zip) for recruiter follow-up
4. Give the site owner a private admin page to view, filter, and export leads

---

## Architecture

The existing static HTML/JS structure is unchanged. Supabase JS SDK is added via CDN script tag on pages that need it.

**New pages:**
- `register.html` — account creation form
- `login.html` — sign in + forgot password
- `reset-password.html` — new password form (linked from reset email)
- `dashboard.html` — user hub with progress and suggestions
- `admin.html` — private admin/lead view

**Modified pages:**
- `index.html` — nav gets Login / Sign Up CTAs; soft account CTA in hero
- `quiz.html` / `quiz-engine.js` — saves results to Supabase on completion (if logged in); falls back to localStorage for guests
- `results.html` — adds "View My Progress" button linking to dashboard; soft CTA for guests to create account

**Auth provider:** Supabase (email+password, JWT sessions, branded email templates)

---

## Data Model

### `profiles`
Extends Supabase's built-in `auth.users`.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | FK → auth.users.id |
| `email` | text | |
| `name` | text | |
| `age` | integer | nullable |
| `education` | text | "High School", "Some College", "College Grad", "Graduate Degree" |
| `zipcode` | text | nullable |
| `test_date` | date | nullable — when they plan to take the real ASVAB |
| `is_admin` | boolean | default false |
| `created_at` | timestamp | |

### `test_results`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | |
| `user_id` | uuid | FK → profiles.id |
| `test_type` | text | "afqt" or "full" |
| `afqt_score` | integer | percentile estimate |
| `section_scores` | jsonb | e.g. `{ AR: 73, MK: 58, WK: 81, PC: 66 }` |
| `line_scores` | jsonb | e.g. `{ GT: 95, CL: 88, ... }` — null for AFQT-only tests |
| `taken_at` | timestamp | |

Row Level Security is enabled on both tables. Users can only read/write their own rows. Admin reads all rows via a service-role policy gated by `is_admin`.

---

## User Flows

### Registration
1. Visitor clicks "Get Started Free" on `index.html`
2. `register.html` — form: email, name, education (dropdown), age (optional), zipcode (optional)
3. Supabase creates user + sends branded confirmation email
4. On confirmation, user lands on `dashboard.html` — welcome screen (first login only)

### Welcome Screen (first login only)
Shown inside `dashboard.html` when `test_results` count = 0. Brief intro copy, optional test date input, prominent "Take Your Diagnostic Test" CTA → routes to `select-test.html`. Skippable — dashboard shows empty state if skipped.

### Returning User
`index.html` → Login → `dashboard.html`. Nav shows user's name and a Dashboard link when authenticated.

### Password Reset
1. `login.html` → "Forgot password?" link
2. User enters email → Supabase sends branded reset email
3. Link routes to `reset-password.html` — new password form
4. On success → redirect to `dashboard.html`

### Taking a Test (logged in)
Quiz completes → `quiz-engine.js` saves results to both Supabase (`test_results`) and `localStorage` → `results.html` shows scores as normal + "View My Progress" button.

### Guest User
All existing functionality unchanged. No forced login wall. Soft CTA on `results.html`: "Save your scores and track progress — create a free account."

---

## Dashboard (`dashboard.html`)

Four zones, top to bottom:

### Zone 1 — Score Summary Bar
- Most recent AFQT percentile, large and prominent
- Date of last test
- Delta indicator vs. previous test (e.g. "↑ 8 points since last test")
- Empty state: prompt to take first test

### Zone 2 — Progress Chart
- SVG line chart of AFQT percentile over all tests, plotted by date
- Consistent with existing `ao-visuals.js` SVG pattern
- Single data point state: "Take another test to see your trend"

### Zone 3 — Section Breakdown & Smart Suggestions
**Section cards (one per AFQT section: AR, MK, WK, PC):**
- Latest score %
- Trend arrow vs. previous test (↑ / ↓ / →)
- Color band: red < 50%, yellow 50–69%, green 70%+

**"Focus This Week" panel:**
Algorithm picks the 1–2 sections with the lowest scores AND worst trend (declining or flat at low score). Outputs plain-English suggestion:
> "Your Arithmetic Reasoning has dropped in your last two tests and has your lowest score. Focus here before your next test."

No target score. Suggestions are purely comparative across the user's own history.

### Zone 4 — Test History
- Table: date, test type, AFQT score; row expands to show section breakdown
- Newest first, 10 rows visible, paginated

---

## Admin Page (`admin.html`)

Gated by `is_admin = true` on the `profiles` table. Non-admins are redirected to `login.html`. Admin flag is set directly in the Supabase dashboard — no UI needed.

### Summary Stats (top)
- Total registered users
- New this week
- Users with at least one test taken
- Average AFQT across all users

### User Table
Columns: Name, Email, Age, Education, Zip, Joined, Tests Taken, Best AFQT

### Filters
- Date range (joined between)
- Education level dropdown
- Zip code text search
- Minimum tests taken

### Export
"Export CSV" button downloads the current filtered view: name, email, age, education, zip, joined date, test count, best AFQT.

---

## Auth & Email

- Supabase handles all auth logic: signup, login, JWT refresh, password reset
- Email templates customized in Supabase dashboard to match Mission ASVAB navy/gold branding
- Emails: confirmation (on register), password reset
- No custom email infrastructure needed

---

## New Files Summary

| File | Purpose |
|------|---------|
| `register.html` | Account creation |
| `login.html` | Sign in + forgot password |
| `reset-password.html` | Password reset landing |
| `dashboard.html` | User dashboard |
| `admin.html` | Admin/lead view |
| `js/auth.js` | Supabase client init, session helpers, auth guards |
| `js/dashboard.js` | Dashboard data fetching and rendering logic |
| `js/admin.js` | Admin table, filters, CSV export |

## Modified Files Summary

| File | Change |
|------|--------|
| `index.html` | Login/signup nav CTAs, soft hero CTA |
| `quiz-engine.js` | Save results to Supabase on completion |
| `results.html` | "View My Progress" CTA + guest account prompt |
