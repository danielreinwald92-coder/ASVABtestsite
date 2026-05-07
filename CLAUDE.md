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
HTML Pages:
├── index.html              # Landing page
├── select-test.html        # Test mode selection (AFQT vs Full)
├── test-intro.html         # Test instructions before starting
├── quiz.html               # Main test engine with timer
├── results.html            # Score breakdown and analysis
├── study-guide.html        # Study materials
└── about.html              # About page

js/
├── quiz-engine.js          # Core quiz logic and timer
├── scoring.js              # VE table, AFQT calc, Army line scores
├── quiz-data.js            # Question bank (~113KB)
├── courses.js              # Study content (~222KB)
├── test-config.js          # Section configs and timing
├── ao-visuals.js           # Visual components
└── study-program.js        # Study program logic

scripts/
└── validate-site.js        # Site validation checks
```

## Development

```bash
npx serve .                 # Local dev server
node scripts/validate-site.js  # Validate site
git push                    # Auto-deploys to Vercel
```

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

AFQT percentile based on 1997 norming study. Uses logistic curve approximation:
- 31st percentile (Army minimum) ~ raw score 85
- 50th percentile (average) ~ raw score 100
- 93rd percentile (Category I) ~ raw score 135

## Self-Correction Protocol

When corrected, propose: `[LEARN] Category: Rule`
Wait for approval before adding to LEARNED section.

## LEARNED
<!-- Auto-populated through corrections -->
