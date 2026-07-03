# SP4 — GS/AS/MC/EI Content Expansion (Design Spec)

**Date:** 2026-07-03
**Status:** Approved by owner (brainstorm 2026-07-03)
**Depends on:** SP1 (explanations + tutor mode, shipped 2026-07-02), SP2 (practice hub + repeat avoidance, shipped 2026-07-02)

## Goal

The four technical sections — General Science (GS), Auto & Shop (AS), Mechanical
Comprehension (MC), Electronics Information (EI) — drive most Army line scores but
have thin question pools and **no study courses**. SP4 brings them to parity with
the covered sections (AR/MK/WK/PC): pools of ~100+ questions each and full
unit/lesson study courses.

No DB or schema changes anywhere in SP4. Pure content + small loader/gate changes.

## Targets

| Section | Pool today | Pool target | New questions | Per-test draw | Repeat-avoidance headroom after |
|---------|-----------|-------------|---------------|---------------|-------------------------------|
| AS | 25 | 100 | +75 | 10 | 90 (was 15) |
| MC | 35 | 105 | +70 | 15 | 90 (was 20) |
| GS | 30 | 105 | +75 | 15 | 90 (was 15) |
| EI | 30 | 105 | +75 | 15 | 90 (was 15) |

~295 new questions total. **Every new question ships with an explanation**
(build gate already enforces 100% coverage).

Four new study courses at full parity with the existing AR/MK courses:
unit → lesson structure, worked examples, plain-language teaching voice,
SVG diagrams where they genuinely help (as with the existing math visuals).

## Where content lives

- **Questions:** appended to their section arrays in `js/quiz-data.js`, same shape
  as existing entries (`id`, `text`, `options[4]`, `correct` index, `difficulty` 1–5).
  IDs continue each section's existing zero-padded scheme (e.g. `AS026`…`AS100`).
- **Explanations:** appended to `js/explanations.js` (lazy-loaded; unchanged mechanism).
- **Courses:** new file `js/courses-tech.js` containing the GS/AS/MC/EI courses,
  lazy-loaded alongside the existing `js/courses.js` (~217KB) rather than doubling it.
  - `js/page-study-guide.js`'s lazy loader is extended to load both files and merge
    the course objects.
  - **Graceful degradation:** if `courses-tech.js` fails to load, the existing four
    courses must still render and function.
- **Study-guide UI:** four new course cards/nav entries. The page is data-driven, so
  this is mostly data plus whatever small card/nav additions are needed.

## Authoring pipeline (per section)

1. **Topic blueprint first** — subtopic list with counts, e.g.:
   - GS: life science, earth/space science, physical science, chemistry
   - AS: engine systems, electrical/fuel/cooling, brakes/suspension/drivetrain;
     shop tools, fasteners, materials, processes
   - MC: forces & motion, levers, pulleys, gears, fluids/hydraulics, springs & structures
   - EI: circuits & Ohm's law, components, schematic symbols, AC/DC, electrical safety
2. **Difficulty-balanced batches** — difficulty 1–5 spread mirroring the existing
   covered pools (roughly balanced, slightly weighted to 2–4).
3. **Dedup** against the existing pool (no near-duplicate stems or recycled distractor sets).
4. **Adversarial answer-key verification** — independent agents re-solve every new
   question blind (no key). Any disagreement → fix or drop before merge. Same protocol
   that found 0 key errors in SP1 (`docs/superpowers/notes/answer-key-review.md`).

Course content goes through a lighter factual review pass (agents check each lesson's
claims and worked examples).

## Gates & tests

- `scripts/validate-site.js` gains **per-section pool minimums** — build fails if any
  pool drops below its shipped size (ratchet: AS ≥ 100, MC ≥ 105, GS ≥ 105, EI ≥ 105
  once each ships; existing sections ratchet at current sizes).
- Explanation coverage gate extends automatically to new IDs (no change needed).
- Existing HTML-safety and length-bounds checks in validate-site apply to new
  explanations; question text/options get the same character-safety treatment as
  existing entries.
- New unit test: merged course data (`courses.js` + `courses-tech.js`) matches the
  shape the study-guide renderer expects (every course has units → lessons with the
  required fields).
- `scripts/check-no-inline-js.js` unchanged — new content is data, not markup;
  any SVG diagrams follow the existing pattern used by courses.js visuals.

## Ship process

One section per branch → verify → merge → deploy, in order **AS → MC → GS → EI**
(thinnest pool first). Each merge:

- runs the full gate suite (npm test, validate-site, check-no-inline-js);
- adds a homepage **Recent Updates** entry per CLAUDE.md rules (plain language,
  benefit-focused, real date, max 1/day — same-day ships condense into one entry).

`js/recent-seen.js` (repeat avoidance) needs **no changes** — its cap is derived from
pool size, so headroom rises automatically.

## Out of scope

- Any DB/Supabase change.
- Splitting `quiz-data.js`/`courses.js` into per-section modules (deferred perf item;
  explicitly not coupled to SP4 — considered and rejected as Approach C).
- SP3 motivation layer (separate spec to follow).
- AO (Assembling Objects) — intentionally removed 2026-05; do not re-add.

## Success criteria

- All four pools at/above target; every question has a verified answer key and explanation.
- Four courses live on the study guide, rendering correctly, with courses.js load
  unaffected when courses-tech.js is absent/fails.
- All gates green; no regression in the existing 117-test suite.
- Weak-areas practice and section practice (SP2 hub) work unchanged with the bigger pools.
