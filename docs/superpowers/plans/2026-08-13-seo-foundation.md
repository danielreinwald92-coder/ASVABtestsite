# SEO Foundation Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship structured data, social share cards, a favicon, five hand-crafted indexable content pages (FAQ, scores, math formulas, word list, study plan), and the sitemap/gate/test plumbing that makes them first-class citizens.

**Architecture:** Pure static additions. Five new root `.html` pages cloned from the about.html pattern (shared nav/footer, per-page inline `<style>`, zero new JS). Metadata upgrades to the five existing public pages. One new string-level contract test ratchets the whole surface. No existing `js/*` file changes → no CACHE_VERSION bump.

**Tech Stack:** Static HTML/CSS, JSON-LD, node:test, Playwright (page smoke + one-off OG-image render).

Spec: `docs/superpowers/specs/2026-08-13-seo-foundation-design.md`

## Global Constraints

- Strict CSP: NO inline `<script>` except `type="application/ld+json"`, NO `on*=` attributes. `style-src` allows inline styles.
- New pages load exactly these scripts (bottom of `<body>`): `js/year.js`, `js/mobile-menu.js`, `/_vercel/insights/script.js` (defer), `js/sw-register.js`.
- No em dashes anywhere in site copy (owner ban). Plain hyphens.
- Canonical URLs use `https://www.missionasvab.org/<page>.html`.
- Every eligibility/minimum-score claim carries a "standards change - confirm with a recruiter" style caveat.
- Never expose live question-pool content or answer keys on content pages.
- All 10 public/content pages get: meta description, canonical, OG set incl. `og:image`, twitter card set, favicon link.
- Do not modify `service-worker.js` or any `js/*` file.
- Commit after each task on branch `seo-foundation`.

### Shared head metadata block (every page; substitute TITLE, DESC, PAGE)

```html
<title>TITLE</title>
<meta name="description" content="DESC">
<link rel="canonical" href="https://www.missionasvab.org/PAGE">
<meta property="og:title" content="TITLE">
<meta property="og:description" content="DESC">
<meta property="og:type" content="website">
<meta property="og:url" content="https://www.missionasvab.org/PAGE">
<meta property="og:site_name" content="Mission ASVAB">
<meta property="og:image" content="https://www.missionasvab.org/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Mission ASVAB - free ASVAB practice tests and study tools">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="TITLE">
<meta name="twitter:description" content="DESC">
<meta name="twitter:image" content="https://www.missionasvab.org/og-image.png">
<link rel="icon" href="icons/icon.svg" type="image/svg+xml">
```

Existing pages keep their current title/description/canonical/OG basics; only the missing lines (og:image group, twitter group, favicon) are added.

### Shared page skeleton for new pages

Copy about.html's structure verbatim: `<head>` boilerplate (charset, viewport, fonts preconnect + Cormorant Garamond/DM Sans stylesheet, `css/shared.css`, `manifest.json`, `theme-color #0a1628`), the full `<nav>` + `.mobile-menu` block (no `class="active"` on any nav link since these pages are not in the top nav), `.hero` header, `<main class="content">`, `.cta-section` before `</main>`, and the `<footer>` disclaimer block. Reuse about.html's `<style>` rules for nav/logo/hero/content/section/score-table/cta plus per-page additions listed in each task.

### Shared footer-links row (all 10 public/content pages, inside `<footer>` ABOVE the disclaimer `<p>`)

```html
<p class="footer-links" style="font-size: 0.85rem; margin: 0 auto 1rem;">
  <a href="faq.html">ASVAB FAQ</a> ·
  <a href="asvab-scores.html">Scores Explained</a> ·
  <a href="asvab-math-formulas.html">Math Formulas</a> ·
  <a href="asvab-word-list.html">Word List</a> ·
  <a href="asvab-study-plan.html">Study Plan</a> ·
  <a href="about.html">About the ASVAB</a>
</p>
```

On pages whose footer is a plain inline-styled `<footer style="...">` (about.html pattern), style links inline: `style="color: inherit;"` per `<a>` is NOT needed; instead add to the page `<style>`: `.footer-links a { color: var(--cream-200); text-decoration: underline; } .footer-links a:hover { color: var(--white); }` and give the footer links row `opacity: 0.85`. index.html has `.site-footer` classes; put the same rules in its `<style>`.

---

### Task 1: OG image asset

**Files:**
- Create: `og-image.png` (committed binary, 1200×630)
- Scratchpad (not committed): `render-og.js`, `og.html`

**Interfaces:**
- Produces: `/og-image.png` referenced by every page's `og:image`/`twitter:image`.

- [ ] **Step 1: Write the render template** to scratchpad `og.html`:

```html
<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  body { margin: 0; width: 1200px; height: 630px; display: flex; flex-direction: column;
    justify-content: center; align-items: center; background: #0a1628;
    font-family: Georgia, 'Times New Roman', serif; }
  .logo { font-size: 92px; font-weight: 700; color: #ffffff; letter-spacing: -2px; }
  .logo span { color: #d4a843; }
  .tag { font-family: Helvetica, Arial, sans-serif; font-size: 34px; color: #f2efe8;
    margin-top: 18px; }
  .sub { font-family: Helvetica, Arial, sans-serif; font-size: 24px; color: #d4a843;
    margin-top: 26px; letter-spacing: 1px; }
  .rule { width: 160px; height: 4px; background: #d4a843; margin-top: 30px; }
</style></head><body>
  <div class="logo">Mission <span>ASVAB</span></div>
  <div class="tag">Free ASVAB practice tests with instant AFQT estimates</div>
  <div class="rule"></div>
  <div class="sub">All 8 sections · Study guides · No payment, no catches</div>
</body></html>
```

- [ ] **Step 2: Screenshot it** with scratchpad `render-og.js` run from the repo root (Playwright + Chromium already installed for e2e):

```js
const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.goto('file://' + process.argv[2]);
  await page.screenshot({ path: 'og-image.png' });
  await browser.close();
})();
```

Run: `node <scratchpad>/render-og.js <scratchpad>/og.html` (cwd = repo root)
Expected: `og-image.png` exists, `file og-image.png` reports 1200 x 630 PNG.

- [ ] **Step 3: Visually inspect** the PNG (Read tool) - wordmark centered, gold accent, no clipping.

- [ ] **Step 4: Commit**

```bash
git add og-image.png && git commit -m "feat: add social share card image"
```

---

### Task 2: faq.html

**Files:**
- Create: `faq.html`

**Interfaces:**
- Consumes: shared skeleton + head block (TITLE `ASVAB FAQ - Common Questions Answered | Mission ASVAB`, DESC `Straight answers to common ASVAB questions: minimum scores by branch, retakes, difficulty, calculators, test length, AFQT vs line scores, and how to prepare.`, PAGE `faq.html`).
- Produces: page linked by footer row and homepage resources band.

- [ ] **Step 1: Author the page.** Hero h1 "ASVAB Frequently Asked Questions". Each Q is an `<h2>` inside a `.section`, answer in 1-3 `<p>`. Exactly these 13 questions, with answers grounded in these facts (about.html:353-396 tables, docs/scoring-methodology.md; phrase naturally, cite no external sites):
  1. What is the ASVAB? (multiple-choice qualification + job-matching test, all branches)
  2. What is the AFQT score? (percentile 1-99 from AR, WK, PC, MK only; determines enlistment eligibility)
  3. What ASVAB score do I need to enlist? (commonly cited minimums: Army 31, Navy 31, Marines 32, Air Force 36, Coast Guard 40; note Army Future Soldier Prep Course for 24-30; caveat: minimums shift with recruiting needs - confirm with a recruiter)
  4. What is a good ASVAB score? (50+ beats half of test takers and opens most jobs; 65+ Category II; 93+ Category I; depends on target job)
  5. Is the ASVAB hard? (covers high-school-level material; adaptive CAT gives harder questions as you answer correctly; preparation matters more than difficulty)
  6. How long is the ASVAB? (CAT-ASVAB typically about 2-3 hours; adaptive, most finish faster than paper)
  7. Can you use a calculator? (No, any version; scratch paper provided)
  8. How many times can you take the ASVAB? (retake after 1 month, second retake after another month, then 6-month waits; scores valid 2 years; confirm current policy with a recruiter)
  9. What are line scores? (composites of subtests that qualify you for specific jobs; Army examples GT/CL/CO; each MOS has minimums)
  10. What is the difference between the CAT-ASVAB and the paper ASVAB? (computer adaptive picks questions based on your answers, fewer questions, no going back; paper is fixed-form)
  11. Do I have to take Assembling Objects? (official CAT includes AO; not used for AFQT or current Army line scores - why this site omits it)
  12. Do practice test scores predict my real score? (good practice estimates are directionally useful; this site documents its scoring model openly, but only the real test counts - link asvab-scores.html)
  13. How should I start studying? (take the 20-minute diagnostic, review weak areas, follow the study plan - link asvab-study-plan.html and select-test.html)
- [ ] **Step 2: Add FAQPage JSON-LD** in `<head>`: `<script type="application/ld+json">` with `@context https://schema.org`, `@type FAQPage`, `mainEntity` array of all 13 `Question`s whose `acceptedAnswer.text` matches the visible answer text (plain text, tags stripped).
- [ ] **Step 3: Add footer-links row** (shared block; keep the faq.html link but it may self-reference - drop the self link, list the other 5).
- [ ] **Step 4: Verify** `node -e` JSON.parse of the ld+json block passes; page opens with correct layout via `npx serve .` spot check skipped (covered by e2e later); run `node scripts/check-no-inline-js.js` - still green (page not yet in list, expected).
- [ ] **Step 5: Commit** `git add faq.html && git commit -m "feat: add ASVAB FAQ page with FAQPage structured data"`

---

### Task 3: asvab-scores.html

**Files:**
- Create: `asvab-scores.html`
- Modify: `about.html` (one cross-link sentence at the end of "The AFQT Score" section: `<p>Want the full picture? Read our <a href="asvab-scores.html">complete guide to ASVAB scores</a>.</p>`)

**Interfaces:**
- Consumes: shared skeleton + head block (TITLE `ASVAB Scores Explained - AFQT, Standard Scores and Line Scores | Mission ASVAB`, DESC `How ASVAB scoring works: AFQT percentiles, standard scores, VE, Army line scores at mean 100, what counts as a good score, and how the adaptive CAT-ASVAB decides your questions.`, PAGE `asvab-scores.html`).
- Produces: deep-dive scores page; Article JSON-LD.

- [ ] **Step 1: Author the page.** Sections (each `.section` with `<h2>`), reusing about.html's `.score-table` styles:
  1. "Your AFQT percentile" - 1-99 percentile not percent-correct; computed from AR, MK, and a Verbal (VE) composite of WK+PC counted twice; category table (reuse the exact 6-row table from about.html:353-393).
  2. "Standard scores" - each subtest reported on mean 50/SD 10 scale; 60+ is top ~16%.
  3. "Branch minimum AFQT scores" - table Army 31, Navy 31, Marines 32, Air Force 36, Coast Guard 40 + Future Soldier Prep note + recruiting-needs caveat (mirror about.html:395-396 wording).
  4. "What is a good score?" - by goal: enlist (beat the minimum), job choice (50-64 solid, 65+ strong), bonuses/programs (higher helps); no single number.
  5. "Army line scores" - composites on mean 100/SD 20; GT = verbal + arithmetic reasoning; each MOS sets minimums; full practice estimates on this site's results page.
  6. "How the CAT-ASVAB decides your questions" - adaptive: answer correctly, next question is harder; scoring weighs difficulty, not just count correct; you cannot go back; this is why pacing and accuracy both matter.
  7. "How to raise your score" - diagnose weak sections first (diagnostic link), drill weak areas, timed practice; links asvab-math-formulas.html, asvab-word-list.html, asvab-study-plan.html.
- [ ] **Step 2: Add Article JSON-LD**: `@type Article`, headline = title, description = DESC, `datePublished`/`dateModified` `2026-08-13`, `author`/`publisher` = `{"@type":"Organization","name":"Mission ASVAB","url":"https://www.missionasvab.org/"}`.
- [ ] **Step 3: Footer-links row** (omit self link).
- [ ] **Step 4: Verify** ld+json parses; about.html cross-link renders inside the AFQT section.
- [ ] **Step 5: Commit** `git add asvab-scores.html about.html && git commit -m "feat: add ASVAB scores explained guide"`

---

### Task 4: asvab-math-formulas.html

**Files:**
- Create: `asvab-math-formulas.html`

**Interfaces:**
- Consumes: shared skeleton + head block (TITLE `ASVAB Math Formula Sheet - Every Formula for AR and MK | Mission ASVAB`, DESC `Free printable ASVAB math formula sheet: percentages, ratios, distance-rate-time, work problems, averages, exponents, FOIL, geometry, and the Pythagorean theorem with plain-language usage notes.`, PAGE `asvab-math-formulas.html`).
- Produces: print-friendly formula reference; Article JSON-LD.

- [ ] **Step 1: Author the page.** Formula groups as `.section` blocks; each formula a row in a two-column `.score-table` (Formula | When to use it). Include exactly these groups/formulas (grounded in courses.js AR/MK chapters):
  - Percentages: `part = percent × whole`; `percent change = (new - old) / old × 100`; finding original: `original = new / (1 ± rate)`
  - Ratios and proportions: `a/b = c/d means ad = bc` (cross multiply)
  - Distance-rate-time: `d = r × t`; average speed = total distance / total time (never the average of two speeds)
  - Work problems: combined rate `1/t = 1/a + 1/b`
  - Averages: `mean = sum / count`; missing value = `target mean × new count - current sum`; median = middle of sorted list; mode = most frequent
  - Exponents: `x^a · x^b = x^(a+b)`; `x^a / x^b = x^(a-b)`; `(x^a)^b = x^(ab)`; `x^0 = 1`; `x^-a = 1/x^a`
  - Algebra: FOIL `(a+b)(c+d) = ac + ad + bc + bd`; difference of squares `a² - b² = (a+b)(a-b)`; factoring `x² + bx + c = (x+m)(x+n)` where `m+n=b, mn=c`
  - Geometry: rectangle `A = lw`, `P = 2(l+w)`; triangle `A = ½bh`; circle `A = πr²`, `C = 2πr`; box volume `V = lwh`; cylinder `V = πr²h`
  - Pythagorean theorem: `a² + b² = c²`; common triples 3-4-5, 5-12-13, 8-15-17
  - Interest: simple interest `I = P × r × t`
- [ ] **Step 2: Print stylesheet** in the page `<style>`: `@media print { nav, .mobile-menu, .hero p, .cta-section, footer, .hamburger { display: none; } .content { padding: 0; } body { background: #fff; } }`. Add a visible tip near the top: "Tip: print this page - it works as a one-page cheat sheet for practice sessions (no formula sheet is provided on the real test)."
- [ ] **Step 3: Article JSON-LD** (same shape as Task 3, this page's headline/DESC).
- [ ] **Step 4: Footer-links row** (omit self).
- [ ] **Step 5: Verify + commit** `git add asvab-math-formulas.html && git commit -m "feat: add printable ASVAB math formula sheet"`

---

### Task 5: asvab-word-list.html

**Files:**
- Create: `asvab-word-list.html`

**Interfaces:**
- Consumes: shared skeleton + head block (TITLE `ASVAB Word Knowledge Vocabulary List - 120 Words to Know | Mission ASVAB`, DESC `Free ASVAB vocabulary list: 120 words at the level the Word Knowledge section actually tests, with short plain-language definitions and synonym strategy tips.`, PAGE `asvab-word-list.html`).
- Produces: vocabulary reference; Article JSON-LD.

- [ ] **Step 1: Author the page.** Intro section: how WK works (synonym questions, "most nearly means"), strategy (roots/prefixes, context, eliminate opposites). Then 120 hand-authored words in 6 alphabetical bands (`A-C`, `D-F`, `G-L`, `M-P`, `Q-S`, `T-Z`), each band a `.section` with a two-column `.score-table` (Word | Meaning). Constraints: ASVAB-register adult vocabulary (e.g. abate, benevolent, candid, diligent, eloquent, feasible, hazardous, impartial, keen, lucrative, meticulous, novice, obsolete, pragmatic, resilient, scrutinize, tedious, verify, wary, zealous - extend to 120 in the same register), definitions 3-10 plain words, no word repeated, alphabetical within bands, NOT copied from the live WK question pool (hand-authored fresh; overlap of common words is fine, but never reproduce a pool question's exact stem/options).
- [ ] **Step 2: Closing CTA section** linking study-guide.html flashcards ("Turn these into flashcards - the study guide has a spaced-repetition deck") and select-test.html.
- [ ] **Step 3: Article JSON-LD** (page headline/DESC).
- [ ] **Step 4: Footer-links row** (omit self).
- [ ] **Step 5: Verify + commit** `git add asvab-word-list.html && git commit -m "feat: add ASVAB word knowledge vocabulary list"`

---

### Task 6: asvab-study-plan.html

**Files:**
- Create: `asvab-study-plan.html`

**Interfaces:**
- Consumes: shared skeleton + head block (TITLE `How to Study for the ASVAB - Week-by-Week Plan | Mission ASVAB`, DESC `A realistic ASVAB study plan: start with a 20-minute diagnostic, target your weakest sections, then build up to full timed practice tests. 4-week and 8-week schedules included.`, PAGE `asvab-study-plan.html`).
- Produces: study-plan guide; Article JSON-LD.

- [ ] **Step 1: Author the page.** Sections:
  1. "Start with a diagnostic, not a textbook" - 20-minute starting-point diagnostic → study priorities (link select-test.html).
  2. "The 4-week plan" - table (Week | Focus): 1 diagnostic + weakest AFQT section course; 2 second-weakest + daily flashcards; 3 timed AFQT practice + review every miss with explanations; 4 full-length practice + light review, rest before test day.
  3. "The 8-week plan" - same structure stretched: 1-2 diagnostic + weakest section, 3-4 remaining AFQT sections, 5-6 technical sections for target jobs + line scores (link asvab-scores.html), 7 timed AFQT + full practice, 8 taper + retake weak-section drills.
  4. "Daily habits that move scores" - 20-30 min/day beats weekend cramming; flashcards for vocab (link asvab-word-list.html); redo missed questions; keep the formula sheet handy (link asvab-math-formulas.html).
  5. "Test week" - sleep, no calculator surprises, answer everything, pacing; link faq.html for logistics questions.
  6. If you have a test date, set it on your dashboard for a countdown and paced plan (link dashboard.html).
- [ ] **Step 2: Article JSON-LD** (page headline/DESC).
- [ ] **Step 3: Footer-links row** (omit self).
- [ ] **Step 4: Verify + commit** `git add asvab-study-plan.html && git commit -m "feat: add week-by-week ASVAB study plan guide"`

---

### Task 7: Metadata upgrade on the 5 existing public pages

**Files:**
- Modify: `index.html`, `select-test.html`, `study-guide.html`, `test-intro.html`, `about.html` (head blocks only)

**Interfaces:**
- Consumes: `og-image.png` from Task 1.
- Produces: complete OG/twitter/favicon metadata on all existing public pages; WebSite+Organization JSON-LD on index.html.

- [ ] **Step 1: Add to each page's `<head>`** (after the existing `og:site_name` line): the `og:image` group, twitter group, and favicon line from the shared head block (existing titles/descriptions reused as the twitter title/description values).
- [ ] **Step 2: index.html JSON-LD** before `</head>`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "name": "Mission ASVAB",
      "url": "https://www.missionasvab.org/",
      "description": "Free ASVAB practice tests with instant AFQT score estimates, study guides for all 8 sections, and step-by-step answer explanations."
    },
    {
      "@type": "Organization",
      "name": "Mission ASVAB",
      "url": "https://www.missionasvab.org/",
      "logo": "https://www.missionasvab.org/icons/icon.svg"
    }
  ]
}
</script>
```

- [ ] **Step 3: Verify** `node scripts/check-no-inline-js.js` green (ld+json allowed); grep each of the 5 pages for `og:image`, `twitter:card`, `rel="icon"` - all present.
- [ ] **Step 4: Commit** `git add index.html select-test.html study-guide.html test-intro.html about.html && git commit -m "feat: complete social/share metadata and structured data on public pages"`

---

### Task 8: Internal linking + homepage resources band + Recent Updates

**Files:**
- Modify: `index.html`, `select-test.html`, `study-guide.html`, `test-intro.html`, `about.html` (footers); `index.html` (resources band + updates feed)

**Interfaces:**
- Consumes: the 5 new pages' URLs.
- Produces: sitewide footer links; homepage "Free ASVAB Resources" band; updated Recent Updates feed.

- [ ] **Step 1: Add the shared footer-links row** to the 5 existing pages' footers (above the disclaimer `<p>`), plus the `.footer-links a` style rules in each page's `<style>`.
- [ ] **Step 2: Homepage resources band** - new `<section>` after the Recent Updates section, using existing token styles:

```html
<section class="resources-band">
  <h2>Free ASVAB Resources</h2>
  <ul class="resources-list">
    <li><a href="faq.html">ASVAB FAQ</a><span>Minimum scores, retakes, calculators, and test-day rules</span></li>
    <li><a href="asvab-scores.html">Scores Explained</a><span>AFQT percentiles, standard scores, and Army line scores</span></li>
    <li><a href="asvab-math-formulas.html">Math Formula Sheet</a><span>Every AR and MK formula on one printable page</span></li>
    <li><a href="asvab-word-list.html">Word Knowledge List</a><span>120 vocabulary words with plain definitions</span></li>
    <li><a href="asvab-study-plan.html">Study Plan</a><span>Week-by-week schedule from diagnostic to test day</span></li>
  </ul>
</section>
```

Style with existing vars (cream band, navy headings, card-style list items) inside index.html's `<style>`, mobile-first single column, no horizontal overflow.
- [ ] **Step 3: Recent Updates entry** (index.html feed): prepend

```html
<li class="update-item">
  <span class="update-date">Aug 13, 2026</span>
  <span class="update-text">Added free study resources you can read without starting a test: an ASVAB FAQ, a score guide, a printable math formula sheet, a vocabulary list, and a week-by-week study plan.</span>
</li>
```

and delete the oldest (Jul 4) item so 4 remain.
- [ ] **Step 4: Verify** links resolve (`ls` the 5 files), no inline JS introduced, updates list has exactly 4 items.
- [ ] **Step 5: Commit** `git add index.html select-test.html study-guide.html test-intro.html about.html && git commit -m "feat: cross-link new resource pages and announce them in Recent Updates"`

---

### Task 9: Plumbing - sitemap, gates, e2e, contract test

**Files:**
- Modify: `sitemap.xml`, `scripts/check-no-inline-js.js:18-31`, `tests/e2e/public-flow.spec.js:3-16`
- Create: `tests/unit/seo-pages.test.js`

**Interfaces:**
- Consumes: all 5 new pages + metadata from Tasks 2-8.
- Produces: ratcheted contract - every future root page must join the gates, sitemap, and metadata standard or `npm test` fails.

- [ ] **Step 1: Write the failing contract test** `tests/unit/seo-pages.test.js`:

```js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const rootPages = fs.readdirSync(root)
  .filter((f) => f.endsWith('.html') && !f.startsWith('preview-'));

function listFrom(source, marker) {
  const m = source.match(new RegExp(marker + '\\s*=\\s*\\[([^\\]]+)\\]'));
  assert.ok(m, `found ${marker} list`);
  return [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
}

test('every served root page is covered by the inline-JS gate', () => {
  const listed = listFrom(read('scripts/check-no-inline-js.js'), 'SERVED_PAGES');
  for (const page of rootPages) assert.ok(listed.includes(page), `${page} in gate list`);
});

test('every served root page is covered by the e2e smoke list', () => {
  const listed = listFrom(read('tests/e2e/public-flow.spec.js'), 'SERVED_PAGES')
    .map((r) => (r === '/' ? 'index.html' : r.replace(/^\//, '')));
  for (const page of rootPages) assert.ok(listed.includes(page), `${page} in e2e list`);
});

test('sitemap covers exactly the indexable pages and every URL resolves', () => {
  const sitemap = read('sitemap.xml');
  const robots = read('robots.txt');
  const disallowed = [...robots.matchAll(/^Disallow:\s*\/(\S+)/gm)].map((m) => m[1]);
  const urls = [...sitemap.matchAll(/<loc>https:\/\/www\.missionasvab\.org\/([^<]*)<\/loc>/g)]
    .map((m) => m[1] === '' ? 'index.html' : m[1]);
  for (const u of urls) assert.ok(fs.existsSync(path.join(root, u)), `${u} exists`);
  const indexable = rootPages.filter((p) => !disallowed.includes(p));
  for (const p of indexable) assert.ok(urls.includes(p), `${p} in sitemap`);
});

test('every sitemap page has full share metadata and valid JSON-LD', () => {
  const sitemap = read('sitemap.xml');
  const urls = [...sitemap.matchAll(/<loc>https:\/\/www\.missionasvab\.org\/([^<]*)<\/loc>/g)]
    .map((m) => m[1] === '' ? 'index.html' : m[1]);
  for (const u of urls) {
    const html = read(u);
    for (const needle of ['name="description"', 'rel="canonical"', 'property="og:image"',
      'name="twitter:card"', 'rel="icon"']) {
      assert.ok(html.includes(needle), `${u} has ${needle}`);
    }
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      const parsed = JSON.parse(m[1]);
      assert.ok(parsed['@context'], `${u} JSON-LD has @context`);
    }
  }
});

test('og-image asset exists', () => {
  assert.ok(fs.existsSync(path.join(root, 'og-image.png')));
});
```

- [ ] **Step 2: Run it to verify it fails** - `node --test tests/unit/seo-pages.test.js` - expected failures: new pages missing from both SERVED_PAGES lists and sitemap.
- [ ] **Step 3: Update the lists.** `scripts/check-no-inline-js.js`: append the 5 new filenames to SERVED_PAGES and change the header comment "scans the 12 served HTML pages" to 17. `tests/e2e/public-flow.spec.js`: append `'/faq.html', '/asvab-scores.html', '/asvab-math-formulas.html', '/asvab-word-list.html', '/asvab-study-plan.html'`.
- [ ] **Step 4: Update sitemap.xml.** Add the 5 URLs (faq + scores `priority 0.8`, others `0.7`, all `changefreq monthly`, `lastmod 2026-08-13`); bump `lastmod` to `2026-08-13` on `/` and `/about.html` (content changed).
- [ ] **Step 5: Run the full gates** - `node --test tests/unit/seo-pages.test.js` PASS, then `npm test`, `node scripts/validate-site.js`, `node scripts/check-no-inline-js.js` all green.
- [ ] **Step 6: Commit** `git add sitemap.xml scripts/check-no-inline-js.js tests/e2e/public-flow.spec.js tests/unit/seo-pages.test.js && git commit -m "feat: sitemap + gate coverage for resource pages, add SEO contract test"`

---

### Task 10: Docs + full verification

**Files:**
- Modify: `CLAUDE.md`, `docs/PROJECT-STATE.md`

**Interfaces:**
- Consumes: everything shipped in Tasks 1-9.
- Produces: docs matching shipped code; all gates green on the branch.

- [ ] **Step 1: CLAUDE.md.** Architecture tree: change "all 12 deployed" to 17 and append a line for the 5 resource pages (`faq.html asvab-scores.html asvab-math-formulas.html asvab-word-list.html asvab-study-plan.html # static indexable resource pages (SEO pass, no JS beyond shared helpers)`); update the unit-test count if it changed; note the new contract test alongside validate/check gates.
- [ ] **Step 2: PROJECT-STATE.md.** Production Baseline: 12 → 17 pages + one sentence on the SEO pass (metadata, JSON-LD, OG image, 5 resource pages); Verification Baseline: mention `tests/unit/seo-pages.test.js` contract; update "Last verified" date.
- [ ] **Step 3: Run everything**: `npm test` && `npm run test:e2e` && `node scripts/validate-site.js` && `node scripts/check-no-inline-js.js`. All green (e2e now smokes 17 pages).
- [ ] **Step 4: Commit** `git add CLAUDE.md docs/PROJECT-STATE.md && git commit -m "docs: record SEO foundation pass (17 pages, contract test)"`

---

### Task 11: Independent fact review (gate before merge)

**Files:** none (review only; fixes land as a follow-up commit if found)

- [ ] **Step 1: Dispatch a fresh reviewer subagent** with faq.html, asvab-scores.html, asvab-math-formulas.html, asvab-word-list.html, asvab-study-plan.html and this instruction: "Adversarially fact-check every checkable claim (score tables, branch minimums, retake waits, timing, formulas, word definitions) against authoritative ASVAB knowledge; flag anything wrong, outdated, or stated without the recruiting-needs caveat; flag any em dash in copy; flag any claim of affiliation."
- [ ] **Step 2: Fix findings** (if any), re-run `npm test` + `node scripts/check-no-inline-js.js`, commit `fix: fact-review corrections on resource pages`.

## Self-Review

- Spec coverage: metadata layer (T7), OG image (T1), favicon (T1/T7 via shared block), 5 pages (T2-T6), FAQPage/Article/WebSite JSON-LD (T2-T7), footer + homepage links (T8), Recent Updates (T8), sitemap/robots/gates/e2e/contract test (T9), docs (T10), fact review (T11), no SW change (global constraint). No gaps found.
- Placeholders: none; all page tasks carry exact titles, descriptions, facts, and structures.
- Consistency: filenames identical across T2-T6, T8 band, T9 lists; JSON-LD shapes defined per task; footer row identical everywhere (minus self-links).
