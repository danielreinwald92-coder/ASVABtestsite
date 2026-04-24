# ASVAB Study Guide - Course Building Plan

## Overview

Each AFQT section gets a complete course with chapters organized by problem type. Each chapter has:
1. **Lesson** - Concepts, examples, tips
2. **Question Pool** - 15-20 questions with explanations for ALL answers
3. **Chapter Quiz** - 5-7 randomized questions, 80% to pass

## Data Structure

Each course lives in `/js/courses.js` under a section key (AR, MK, WK, PC).

```javascript
{
  name: "Section Name",
  description: "Brief description",
  icon: "📐",
  chapters: [
    {
      id: "AR-1",
      title: "Chapter Title",
      description: "What you'll learn",
      
      lesson: {
        intro: "Opening hook",
        concepts: [
          { title: "Concept Name", content: "Explanation" }
        ],
        examples: [
          { problem: "...", steps: ["..."], tip: "..." }
        ],
        summary: "Key takeaway"
      },
      
      questions: [
        {
          id: "AR1-001",
          text: "Question text",
          options: [
            { text: "Wrong answer", explanation: "Why it's wrong" },
            { text: "Correct answer", explanation: "Why it's right", correct: true },
            ...
          ]
        }
      ],
      
      quizConfig: {
        questionsPerQuiz: 6,
        passingScore: 0.8
      }
    }
  ]
}
```

---

## SECTION 1: ARITHMETIC REASONING (AR) ✅ COMPLETE

**Chapters:**
1. Ratios & Proportions (15 questions)
2. Percentages (16 questions)
3. Distance, Rate & Time (15 questions)
4. Work Problems (10 questions)
5. Statistics - Mean, Median, Mode (10 questions)

---

## SECTION 2: MATHEMATICS KNOWLEDGE (MK)

**Chapters:**

### MK-1: Solving Equations
- Linear equations (one variable)
- Equations with variables on both sides
- Multi-step equations
- **15 questions**

### MK-2: Exponents & Radicals
- Exponent rules (multiply, divide, power of power)
- Negative and zero exponents
- Simplifying square roots
- **15 questions**

### MK-3: FOIL & Factoring
- FOIL method for multiplying binomials
- Factoring quadratics
- Difference of squares
- **15 questions**

### MK-4: Pythagorean Theorem
- Finding hypotenuse
- Finding legs
- Pythagorean triples (3-4-5, 5-12-13, etc.)
- Word problems with right triangles
- **12 questions**

### MK-5: Area, Perimeter & Circumference
- Rectangles and squares
- Triangles
- Circles (area and circumference)
- Combined shapes
- **15 questions**

### MK-6: Inequalities
- Solving inequalities
- Flipping the sign rule
- Graphing on number line
- **10 questions**

---

## SECTION 3: WORD KNOWLEDGE (WK)

**Chapters:**

### WK-1: Prefixes
- Common prefixes (un-, re-, pre-, dis-, anti-, sub-, super-, mis-, etc.)
- How to use prefixes to decode unknown words
- **15 questions** (vocabulary with prefix clues)

### WK-2: Roots
- Latin/Greek roots (bene-, mal-, aud-, vis-, dict-, port-, etc.)
- Combining roots with prefixes/suffixes
- **15 questions**

### WK-3: Suffixes
- Common suffixes (-tion, -ness, -able, -ous, -ment, -ful, -less)
- How suffixes indicate part of speech
- **12 questions**

### WK-4: Test Strategy
- Positive vs negative words
- Process of elimination
- Trusting your gut
- Context clues
- **15 high-frequency ASVAB vocabulary questions**

---

## SECTION 4: PARAGRAPH COMPREHENSION (PC)

**Chapters:**

### PC-1: Main Idea Questions
- Finding the central theme
- First/last sentence strategy
- Too broad vs too narrow
- **8 passages with questions**

### PC-2: Detail Questions
- Finding specific information
- "According to the passage..."
- Going back to verify
- **8 passages with questions**

### PC-3: Inference Questions
- "It can be inferred..."
- What's implied vs stated
- Using evidence
- **8 passages with questions**

### PC-4: Vocabulary in Context
- Word meaning from context
- Substitution method
- **6 passages with questions**

### PC-5: Tone & Purpose
- Author's attitude
- Why was this written?
- Word choice analysis
- **6 passages with questions**

---

## Implementation Notes

1. **Question Explanations**: Every wrong answer must explain WHY it's wrong, not just say "incorrect"

2. **Randomization**: Questions are shuffled each quiz. Answer order is also shuffled.

3. **Progress Tracking**: Completed chapters saved to localStorage

4. **Passing Score**: 80% (configurable per chapter)

5. **Retakes**: Users can retake quizzes unlimited times with different questions each time

---

## Files

- `/js/courses.js` - All course data
- `/study-guide.html` - The UI that renders courses
