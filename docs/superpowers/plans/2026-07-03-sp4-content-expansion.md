# SP4 — GS/AS/MC/EI Content Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Grow the GS/AS/MC/EI question pools to 100+ (each question with a verified key + explanation) and add four full-parity study courses in a new lazy-loaded `js/courses-tech.js`.

**Architecture:** Pure content expansion on the existing static-site data files. Questions append to `js/quiz-data.js`, explanations to `js/explanations.js`, courses live in a new `js/courses-tech.js` merged into the existing `courses` object at load time. Build gates ratchet so pools can never shrink. Ships one section at a time: AS → MC → GS → EI, each on its own branch merged to main (auto-deploys).

**Tech Stack:** Plain JS classic scripts (IIFE/globals, strict CSP: no inline JS), node:test + jsdom suite, `scripts/validate-site.js` as Vercel build gate.

## Global Constraints

- **No DB/Supabase changes.** SP4 is content + loader/gate work only.
- **Strict CSP:** no inline `<script>` or `on*=` HTML attributes (js property assignment like `card.onclick =` inside external files is fine). `scripts/check-no-inline-js.js` enforces.
- **Explanation contract (validate-site):** 40–600 chars, single line, NO `<`, `>` or `&` characters, keyed by question id.
- **Bank question shape:** `{ id, text, options: [4 strings], correct: 0-3, difficulty: 1-5 }`. IDs zero-padded per section (`AS026`…`AS100`, `MC036`…, `GS031`…, `EI031`…).
- **Course chapter shape (validated by validate-site):** `{ id, title, description, lesson: { intro, concepts: [{title, content, svg?}], examples: [{problem, steps: [], tip?, svg?}], summary }, questions: [{ id, text, options: [4 × { text, explanation, correct? }] }], quizConfig: { questionsPerQuiz: 6 } }` — exactly one option `correct: true` per question; every option has a non-empty `explanation`; wrong options must not say "Correct!".
- **Chapter quiz questions ≥ questionsPerQuiz (6); use 8–10 per chapter** (existing courses use ~10).
- **Every new bank question is adversarially verified** (2 independent blind solvers must agree with the key) before commit.
- **Recent Updates feed:** every ship adds/updates the homepage entry per CLAUDE.md rules (plain language, real `date` output, max 1/day → condense same-day ships).
- **Pool ratchets** land in `scripts/validate-site.js` in the same branch that ships the section.

## File Structure

- `js/courses-tech.js` (new): `const coursesTech = { AS: {...}, MC: {...}, GS: {...}, EI: {...} }` + same module tail pattern as courses.js (attach to window/this). Grows one section per ship.
- `js/page-study-guide.js` (modify): loader loads courses.js then courses-tech.js (tolerating failure of the latter), merges via `Object.assign(courses, coursesTech)`; home grid lists all 8 sections with availability = presence in merged `courses`.
- `js/quiz-data.js` (modify ×4): append questions per section.
- `js/explanations.js` (modify ×4): append explanations per section.
- `scripts/validate-site.js` (modify): load + merge courses-tech.js; add `POOL_MINIMUMS` ratchet table.
- `tests/unit/courses-tech.test.js` (new): merged-shape contract + graceful-degradation contract.

---

### Task 1: Infrastructure — courses-tech.js scaffold, loader merge, validate-site ratchets

**Files:**
- Create: `js/courses-tech.js` (scaffold with AS course placeholder replaced in Task 3 — ship this task only together with Task 2+3 on the AS branch)
- Modify: `js/page-study-guide.js` (`loadCourses()` at ~line 132; `initHome()` allCourses list at ~line 158; coming-soon card names/icons at ~line 180)
- Modify: `scripts/validate-site.js` (load/merge courses-tech; POOL_MINIMUMS)
- Test: `tests/unit/courses-tech.test.js`

**Interfaces:**
- Produces: global `coursesTech` object (same course shape as `courses`); merged into `courses` before any renderer runs; `POOL_MINIMUMS` map in validate-site.

- [ ] **Step 1: Write failing test** `tests/unit/courses-tech.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert');
const { loadScripts } = require('../helpers/load');

test('courses-tech merges into courses with valid renderer shape', () => {
  const ctx = loadScripts([
    { file: 'js/courses.js', append: 'this.courses = courses;' },
    { file: 'js/courses-tech.js', append: 'this.coursesTech = coursesTech;' }
  ]);
  const merged = Object.assign({}, ctx.courses, ctx.coursesTech);
  for (const [code, course] of Object.entries(ctx.coursesTech)) {
    assert.ok(['GS', 'AS', 'MC', 'EI'].includes(code), `unexpected course ${code}`);
    assert.ok(course.name && course.description && course.icon, `${code} missing card fields`);
    for (const ch of course.chapters) {
      assert.ok(ch.lesson.intro && ch.lesson.summary, `${ch.id} missing intro/summary`);
      assert.ok(Array.isArray(ch.lesson.concepts) && ch.lesson.concepts.length > 0, `${ch.id} no concepts`);
      assert.ok(Array.isArray(ch.lesson.examples) && ch.lesson.examples.length > 0, `${ch.id} no examples`);
      assert.ok(ch.questions.length >= ch.quizConfig.questionsPerQuiz, `${ch.id} too few questions`);
    }
  }
  assert.ok(Object.keys(merged).length >= 5, 'merge lost courses');
});
```

- [ ] **Step 2:** `npm test` → new test FAILS (courses-tech.js missing).
- [ ] **Step 3:** Create `js/courses-tech.js` (AS content arrives in Task 3; scaffold carries the real AS course before this branch ships — never merge an empty scaffold).
- [ ] **Step 4:** Extend `loadCourses()` in page-study-guide.js: after courses.js resolves, inject `js/courses-tech.js` in a `.then()` whose `onerror` resolves anyway (log warning), then `if (typeof coursesTech !== 'undefined') Object.assign(courses, coursesTech)`. Cache one promise as today.
- [ ] **Step 5:** `initHome()`: `const allCourses = ['AR','MK','WK','PC','GS','AS','MC','EI'].map(code => ({ code, available: typeof courses !== 'undefined' && !!courses[code] }));` and extend the coming-soon `names`/`icons` maps with GS/AS/MC/EI entries so unshipped sections render as "Coming soon".
- [ ] **Step 6:** validate-site.js: `loadScript('js/courses-tech.js', context, 'this.coursesTech = coursesTech;'); Object.assign(courses, context.coursesTech);` before the course-shape loop. Add ratchet: `const POOL_MINIMUMS = { WK: 148, PC: 85, AR: 122, MK: 132, GS: 30, EI: 30, AS: 100, MC: 35 };` (AS raised in this branch; each later ship raises its own) with `assert(questions.length >= POOL_MINIMUMS[code], ...)` inside the section loop.
- [ ] **Step 7:** `npm test && node scripts/validate-site.js && node scripts/check-no-inline-js.js` → all green.
- [ ] **Step 8:** Commit `feat: courses-tech.js lazy course bundle + pool ratchets`.

### Tasks 2/4/6/8: Question authoring — AS(+75→100), MC(+70→105), GS(+75→105), EI(+75→105)

Per section (repeat identically):

- [ ] **Step 1: Topic blueprint** (counts sum to the new-question total), difficulty spread ≈ 15% d1 / 25% d2 / 30% d3 / 20% d4 / 10% d5:
  - **AS (+75):** engine fundamentals 12, fuel/ignition/electrical 11, cooling/lubrication 8, brakes/suspension/steering/drivetrain 12, shop hand tools 12, fasteners & joining 8, measuring/materials/processes 12.
  - **MC (+70):** forces & Newton's laws 10, simple machines–levers 10, pulleys & mechanical advantage 10, gears/wheels/torque 10, fluids & hydraulics/pressure 10, springs/structures/materials 10, motion/energy/work-power 10.
  - **GS (+75):** life science (biology/human body/health) 20, earth & space science 18, physical science (physics) 19, chemistry 18.
  - **EI (+75):** current/voltage/resistance & Ohm's law 15, circuits (series/parallel) 12, components (resistor/capacitor/diode/transistor…) 15, schematic symbols & wiring 10, AC/DC/power/magnetism 13, electrical safety/tools/practical 10.
- [ ] **Step 2: Author in parallel subagent batches** (~15 questions per agent, one topic cluster each). Agent prompt requires: bank question shape; 4 plausible options; single unambiguous key; difficulty tag; **plus a 40–600 char single-line explanation with no `<`/`>`/`&`**; plain ASCII; no near-duplicates of the provided existing-stems list (pass current section stems in the prompt).
- [ ] **Step 3: Dedup + normalize** (script in scratchpad): id sequence, difficulty spread, stem similarity vs existing pool, option count, explanation constraints.
- [ ] **Step 4: Adversarial key verification:** 2 independent subagents per batch re-solve every question blind (question + options only, no key, no explanation). Both must match the key; any mismatch → fix or drop the question. Record results in `docs/superpowers/notes/sp4-answer-key-review.md`.
- [ ] **Step 5:** Append survivors to `js/quiz-data.js` (section array) + `js/explanations.js`; if drops brought the count below target, author a top-up batch and re-verify it the same way.
- [ ] **Step 6:** `npm test && node scripts/validate-site.js` → green (ratchet for this section raised in the same branch).
- [ ] **Step 7:** Commit `feat: expand <SEC> pool to <N> verified questions with explanations`.

### Tasks 3/5/7/9: Course authoring — AS, MC, GS, EI

Per section (repeat identically):

- [ ] **Step 1:** Chapter outline (6–7 chapters/section) mirroring the AR/MK course tone (plain-language, military-applicant voice):
  - **AS:** Engine Basics · Engine Systems (fuel/ignition/cooling/lubrication) · Electrical & Starting Systems · Brakes, Suspension & Drivetrain · Hand Tools & Power Tools · Fasteners, Materials & Shop Processes.
  - **MC:** Forces & Motion · Levers & Simple Machines · Pulleys & Mechanical Advantage · Gears, Wheels & Torque · Fluids & Hydraulics · Springs, Structures & Materials.
  - **GS:** Life Science: The Human Body · Life Science: Biology & Ecology · Earth Science · Space Science · Physical Science: Motion & Energy · Chemistry Basics.
  - **EI:** Electricity Fundamentals (V/I/R, Ohm's law) · Series & Parallel Circuits · Electronic Components · Reading Schematics & Symbols · AC, DC & Power · Magnetism, Motors & Electrical Safety.
- [ ] **Step 2:** Author chapters via parallel subagents (one chapter each): `lesson` with intro, 3–5 concepts (SVG diagram where genuinely clarifying, following the inline-`<svg>` + scoped-`<style>` pattern in courses.js), 2–3 worked examples with steps + tip, summary; **8–10 chapter quiz questions** with per-option explanations (exactly one `correct: true`; wrong-option explanations never say "Correct").
- [ ] **Step 3:** Factual review pass: one subagent per chapter checks every claim, worked example, and quiz key; fix or drop flagged items.
- [ ] **Step 4:** Add section course to `js/courses-tech.js`.
- [ ] **Step 5:** `npm test && node scripts/validate-site.js && node scripts/check-no-inline-js.js` → green.
- [ ] **Step 6:** Commit `feat: add <SEC> study course`.

### Ship step (end of each section branch)

- [ ] Raise the section's `POOL_MINIMUMS` entry to its new size (AS 100, MC 105, GS 105, EI 105).
- [ ] Update homepage Recent Updates (`index.html`): new top `<li>` with real date, condense if same-day, keep 4.
- [ ] Full gates: `npm test && node scripts/validate-site.js && node scripts/check-no-inline-js.js`.
- [ ] Merge branch to main, push (auto-deploys), confirm Vercel deploy READY.

## Self-Review Notes

- Spec coverage: pools ✅ (Tasks 2/4/6/8), courses ✅ (3/5/7/9), loader+degradation ✅ (Task 1), gates ✅ (Task 1 + ship steps), Recent Updates ✅ (ship step), no-DB ✅ (no task touches Supabase).
- Type consistency: `coursesTech` global name used consistently in courses-tech.js, page-study-guide.js merge, validate-site.js append, and test.
- Verification protocol matches SP1's (blind re-solve, 2 agents, fix-or-drop).
