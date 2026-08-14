# SEO Foundation Pass — Design

Date: 2026-08-13
Status: Approved direction by owner ("full SEO foundation pass", hand-crafted reference
pages, all remaining decisions delegated). Follow-up candidate after this ships: MOS pages.

## Goal

Raise the site's search visibility and social-share quality without changing any app
behavior. Four pieces: (1) structured data + richer metadata on existing public pages,
(2) social share cards incl. a real OG image, (3) five new hand-crafted indexable content
pages targeting high-intent searches, (4) internal-linking + sitemap/gate/test plumbing so
the new pages are first-class citizens of the existing quality ratchets.

Out of scope (deliberate): MOS pages (next project), auto-generated course-chapter
mirrors, analytics changes (Vercel Web Analytics already installed), any JS behavior
change, any Supabase change.

## Current state (verified 2026-08-13)

- 5 public pages (index, select-test, study-guide, test-intro, about) already have
  `<title>`, meta description, canonical, and OG basics — but **no og:image, no
  twitter:* tags, no JSON-LD, no favicon links** (icons/icon.svg exists, unreferenced).
- robots.txt already disallows the 7 app/auth pages and points at sitemap.xml (5 URLs).
- `scripts/check-no-inline-js.js` already whitelists `application/ld+json` inline blocks;
  its SERVED_PAGES list (and the e2e smoke list in `tests/e2e/public-flow.spec.js`) are
  hardcoded to the current 12 pages.
- CSP allows self-hosted images; pages are fully static with per-page inline `<style>`
  and shared `css/shared.css`; footer + nav markup is duplicated per page (about.html is
  the cleanest template for content pages).
- Service worker: navigations are network-first, so new HTML pages need no SW change.

## New pages (5)

All follow the about.html pattern: same head structure, nav (with hamburger + mobile
menu), hero, `.content` sections, CTA to select-test.html, footer with disclaimer.
No new JS; they load only `js/year.js`, `js/mobile-menu.js`, `js/sw-register.js`, and
the Vercel insights script, all already CSP-clean. Content grounded in existing site
facts (about.html tables, docs/scoring-methodology.md, official CAT-ASVAB timing table);
every eligibility/minimum-score claim carries a "standards change — verify with a
recruiter" caveat.

1. **faq.html — "ASVAB FAQ: Common Questions Answered"**
   12–15 questions phrased the way people search ("Is the ASVAB hard?", "What is a good
   ASVAB score?", "How many times can you take the ASVAB?", "How long is the ASVAB?",
   "Can you use a calculator?", "What ASVAB score do I need for the Army/Navy/Air
   Force/Marines/Coast Guard?", "What is the AFQT?", "What are line scores?", "How is
   the CAT-ASVAB different from paper?", "How do I retake it / what are the wait
   times?", "Do practice tests predict my real score?"). Marked up with FAQPage JSON-LD
   (verbatim same Q/A text as visible content — required by Google policy).
2. **asvab-scores.html — "ASVAB Scores Explained: AFQT, Standard Scores & Line Scores"**
   Deeper than about.html: what the AFQT percentile means, category table, branch
   minimums, standard scores (mean 50/SD 10), how VE combines WK+PC, what "good" looks
   like per goal, Army line scores at mean 100/SD 20, how CAT adaptive scoring works
   (site's differentiated expertise), how to raise a score. Cross-links about.html,
   formula sheet, practice test.
3. **asvab-math-formulas.html — "ASVAB Math Formula Sheet (AR + MK)"**
   Formulas grouped by topic (arithmetic/percent, ratio-proportion, DRT, work rate,
   averages, algebra/exponents/FOIL, geometry area/perimeter/volume, Pythagorean),
   each with a one-line "when you use it". Print-friendly (`@media print` hides
   nav/CTA/footer). Grounded in AR/MK course content.
4. **asvab-word-list.html — "ASVAB Word Knowledge Vocabulary List"**
   ~120 curated ASVAB-register words with concise definitions, grouped A–Z in bands;
   short section on how WK questions work + synonym strategy; links to study-guide
   flashcards. Hand-authored (not exported from the question pool — never expose live
   pool answer keys).
5. **asvab-study-plan.html — "How to Study for the ASVAB (Week-by-Week Plan)"**
   4-week and 8-week plans built around the site's actual flow: diagnostic → weak-area
   priorities → section courses → timed AFQT practice → full test. Links diagnostic
   mode, study guide, dashboard test-date countdown.

URL style: flat root `.html` files matching the existing site convention.

## Metadata layer (existing 5 public pages + 5 new)

- `og:image` → absolute `https://www.missionasvab.org/og-image.png` (new asset,
  1200×630 PNG, navy #0a1628 + gold wordmark, rendered once via a Playwright screenshot
  script run from scratchpad; only the PNG is committed) + `og:image:width/height/alt`.
- `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`,
  `twitter:image` mirroring OG values.
- `<link rel="icon" href="icons/icon.svg" type="image/svg+xml">` on all 10 pages
  (favicon for browser tabs + Google result favicons).
- JSON-LD:
  - index.html: `WebSite` (name, alternateName "Mission ASVAB", url) + `Organization`
    (name, url, logo → icons/icon.svg absolute).
  - faq.html: `FAQPage` with all visible Q/As.
  - 4 reference pages: `Article` (headline, description, datePublished/dateModified,
    author+publisher → Organization "Mission ASVAB").
  - No schema added to app/auth pages; they stay robots-disallowed and untouched.

## Internal linking

- Footer of the 10 public/content pages gains a compact `.footer-links` row above the
  disclaimer: FAQ · ASVAB Scores · Math Formulas · Word List · Study Plan · About.
- index.html gains a small "Free ASVAB Resources" band (5 links with one-line
  descriptions) so the homepage passes link equity; styled with existing tokens.
- Reference pages cross-link each other where topically natural + CTA to practice.
- about.html scores section links to asvab-scores.html.

## Plumbing

- sitemap.xml: +5 URLs (priority 0.8 scores/faq, 0.7 others; changefreq monthly);
  bump `lastmod` (2026-08-13) on pages whose content changes.
- robots.txt: unchanged (new pages crawlable by default).
- `scripts/check-no-inline-js.js`: add 5 pages to SERVED_PAGES (comment 12 → 17).
- `tests/e2e/public-flow.spec.js`: add 5 pages to its SERVED_PAGES smoke list.
- **New contract test `tests/unit/seo-pages.test.js`** (string/regex level, no jsdom):
  1. every root `*.html` (excluding `preview-*`) appears in check-no-inline-js
     SERVED_PAGES and in the e2e smoke list (parsed from both files' source);
  2. every sitemap URL maps to an existing file, and every indexable page (root page
     not Disallowed in robots.txt) is in the sitemap;
  3. every inline `application/ld+json` block on served pages parses as JSON with
     `@context` + `@type`;
  4. every sitemap page has canonical, meta description, `og:image`, `twitter:card`,
     and a favicon link.
- Service worker: **no change, no CACHE_VERSION bump** — no existing JS file changes
  in this pass (HTML + assets + tests/scripts only); navigations are network-first so
  updated/new HTML serves fresh. If implementation ends up touching any existing js/*
  file, bump the version per the release rule.
- Recent Updates feed (index.html): one entry dated the real ship date — "Added free
  study resources you can read without starting a test: an ASVAB FAQ, score guide,
  math formula sheet, vocabulary list, and week-by-week study plan." Drop the oldest
  entry to keep 4.
- Docs: CLAUDE.md (page count/list, architecture tree, new contract test),
  docs/PROJECT-STATE.md (baseline + verification lists). Memory update post-ship.

## Quality gates before merge

- All four commands green: `npm test`, `npm run test:e2e`,
  `node scripts/validate-site.js`, `node scripts/check-no-inline-js.js`.
- Independent fact-review agent re-checks every factual claim on the 5 new pages
  (score tables, minimums, retake rules, timing) against about.html /
  scoring-methodology / official-source knowledge before merge (project convention:
  adversarial review has kept content-error count at 0).
- Rendered-page sanity: e2e smoke covers CSP/console errors on all 17 pages.

## Error handling / risk

- Pages are static; the only runtime failure mode is a missing asset (og-image,
  icon) — covered by the contract test's file-existence checks.
- Duplicate-content risk (scores page vs about.html) handled by distinct intent:
  about = orientation, scores page = deep dive; both canonical to themselves.
- No behavioral surface changes; app pages untouched.

## Self-review

Checked for placeholders (none), contradictions (SW no-bump rule matches "no existing
JS changed" plan and is conditioned otherwise), scope (single implementation plan,
~10 file edits + 5 new pages + 2 assets + 1 test), ambiguity (page list, URL names,
schema types, and gate additions all enumerated).
