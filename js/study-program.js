// ASVAB Study Program - Comprehensive Learning System
// Covers the 4 AFQT sections: AR, MK, WK, PC

const studyProgram = {

  // ========================================
  // PROGRAM OVERVIEW
  // ========================================
  overview: {
    title: "ASVAB AFQT Mastery Program",
    description: "A structured 4-6 week study program designed to maximize your AFQT score",
    afqtSections: ["AR", "MK", "WK", "PC"],
    recommendedWeeks: 6,
    dailyStudyMinutes: 60
  },

  // ========================================
  // SECTION 1: ARITHMETIC REASONING (AR)
  // ========================================
  AR: {
    name: "Arithmetic Reasoning",
    code: "AR",
    testInfo: {
      questions: 16,
      timeMinutes: 39,
      secondsPerQuestion: 146,
      description: "Word problems requiring mathematical reasoning and operations"
    },

    // Study tips and strategies
    strategies: {
      primary: [
        {
          name: "Backsolving",
          description: "Test answer choices by plugging them into the problem. Start with choice B or C (middle values) to quickly narrow down.",
          example: "If 3x + 5 = 20, test the answers: try x=5: 3(5)+5=20 ✓"
        },
        {
          name: "Keyword Identification",
          description: "Translate words to math operations",
          keywords: {
            addition: ["sum", "total", "combined", "increased by", "more than", "plus"],
            subtraction: ["difference", "fewer", "less than", "decreased by", "minus", "remain"],
            multiplication: ["product", "times", "of", "doubled", "tripled", "each"],
            division: ["quotient", "per", "divided by", "ratio", "split", "average"]
          }
        },
        {
          name: "Draw It Out",
          description: "Sketch diagrams for distance, time, or spatial problems. Visual representation often reveals the solution path."
        },
        {
          name: "Eliminate Irrelevant Information",
          description: "Word problems often include extra details. Identify only the numbers and facts needed to solve."
        }
      ],
      timeManagement: [
        "You have about 2.5 minutes per question - don't rush",
        "Read the entire question before solving",
        "If stuck after 1 minute, mark it and move on",
        "Never leave questions blank - guess if needed (25% chance)"
      ],
      commonMistakes: [
        "Not reading what the question is actually asking",
        "Forgetting to convert units (feet to inches, hours to minutes)",
        "Calculation errors from rushing",
        "Not checking if your answer is reasonable"
      ]
    },

    // Lessons organized by topic
    lessons: [
      {
        id: "AR-L01",
        title: "Ratios and Proportions",
        importance: "HIGH - Most frequently tested topic",
        concepts: [
          {
            name: "Setting Up Ratios",
            explanation: "A ratio compares two quantities. Write as a:b or a/b. The key is matching units on both sides.",
            formula: "a/b = c/d → cross multiply: a×d = b×c"
          },
          {
            name: "Solving Proportions",
            explanation: "Cross-multiply and solve for the unknown. Always check your answer by substituting back.",
            example: "If 3 apples cost $2, how much do 12 apples cost? 3/2 = 12/x → 3x = 24 → x = $8"
          },
          {
            name: "Scale Problems",
            explanation: "Maps and models use ratios. Set up: scale measurement / actual measurement = given ratio"
          }
        ]
      },
      {
        id: "AR-L02",
        title: "Percentages",
        importance: "HIGH - Common in real-world scenarios",
        concepts: [
          {
            name: "Basic Percentage Formula",
            explanation: "Part = Whole × Percentage (as decimal). To find %: (Part/Whole) × 100",
            formula: "Part = Whole × (Percent/100)"
          },
          {
            name: "Percent Increase/Decrease",
            explanation: "Change = Original × Percent. For increase, add to original. For decrease, subtract.",
            formula: "New Value = Original × (1 ± percent/100)"
          },
          {
            name: "Discounts and Tax",
            explanation: "Discount: multiply by (1 - discount%). Tax: multiply by (1 + tax%).",
            example: "$50 item with 20% off: $50 × 0.80 = $40"
          },
          {
            name: "Simple Interest",
            explanation: "Interest earned on the principal amount only.",
            formula: "I = P × R × T (Principal × Rate × Time in years)"
          }
        ]
      },
      {
        id: "AR-L03",
        title: "Distance, Rate, and Time",
        importance: "HIGH - Classic ASVAB word problem type",
        concepts: [
          {
            name: "The DRT Formula",
            explanation: "Distance = Rate × Time. Rearrange for any variable.",
            formula: "D = R × T | R = D/T | T = D/R"
          },
          {
            name: "Meeting Problems",
            explanation: "Two objects moving toward each other: add their speeds. Moving same direction: subtract speeds.",
            example: "Train A at 60mph and Train B at 40mph toward each other close 100 miles per hour combined."
          },
          {
            name: "Round Trip Problems",
            explanation: "Total distance = 2 × one-way distance. Average speed ≠ average of speeds!"
          }
        ]
      },
      {
        id: "AR-L04",
        title: "Fractions and Decimals",
        importance: "MEDIUM-HIGH - Foundation for other topics",
        concepts: [
          {
            name: "Fraction Operations",
            explanation: "Add/Subtract: need common denominator. Multiply: top×top, bottom×bottom. Divide: flip and multiply.",
            formula: "a/b ÷ c/d = a/b × d/c"
          },
          {
            name: "Converting Fractions to Decimals",
            explanation: "Divide numerator by denominator. Know common conversions by heart.",
            commonConversions: {
              "1/2": 0.5, "1/4": 0.25, "3/4": 0.75, "1/5": 0.2,
              "1/3": 0.333, "2/3": 0.667, "1/8": 0.125
            }
          },
          {
            name: "Mixed Numbers",
            explanation: "Convert to improper fractions for calculations: multiply whole number by denominator, add numerator.",
            example: "2¾ = (2×4 + 3)/4 = 11/4"
          }
        ]
      },
      {
        id: "AR-L05",
        title: "Statistics and Probability",
        importance: "MEDIUM - Appears regularly",
        concepts: [
          {
            name: "Mean (Average)",
            explanation: "Sum of all values divided by the count of values.",
            formula: "Mean = Sum of values / Number of values"
          },
          {
            name: "Median",
            explanation: "Middle value when arranged in order. For even count, average the two middle values."
          },
          {
            name: "Mode",
            explanation: "Most frequently occurring value. There can be multiple modes or no mode."
          },
          {
            name: "Basic Probability",
            explanation: "Probability = Favorable outcomes / Total possible outcomes. Always between 0 and 1.",
            formula: "P(event) = favorable / total"
          }
        ]
      },
      {
        id: "AR-L06",
        title: "Unit Conversions",
        importance: "MEDIUM - Critical for avoiding errors",
        concepts: [
          {
            name: "Length Conversions",
            conversions: {
              "1 foot": "12 inches",
              "1 yard": "3 feet",
              "1 mile": "5,280 feet"
            }
          },
          {
            name: "Time Conversions",
            conversions: {
              "1 hour": "60 minutes",
              "1 day": "24 hours",
              "1 week": "7 days"
            }
          },
          {
            name: "Weight/Volume Conversions",
            conversions: {
              "1 pound": "16 ounces",
              "1 gallon": "4 quarts",
              "1 quart": "2 pints"
            }
          }
        ]
      }
    ],

    // Practice questions with detailed explanations
    practiceQuestions: [
      {
        id: "AR-P01",
        topic: "Ratios and Proportions",
        difficulty: 1,
        question: "If a car travels 150 miles on 6 gallons of gas, how many gallons are needed to travel 400 miles?",
        options: ["14 gallons", "16 gallons", "18 gallons", "20 gallons"],
        correct: 1,
        explanation: {
          setup: "Set up a proportion: miles/gallons = miles/gallons",
          steps: [
            "150/6 = 400/x",
            "Cross multiply: 150x = 6 × 400",
            "150x = 2,400",
            "x = 2,400 ÷ 150 = 16 gallons"
          ],
          tip: "Always check: 150÷6 = 25 mpg. 400÷25 = 16 gallons ✓"
        }
      },
      {
        id: "AR-P02",
        topic: "Percentages",
        difficulty: 2,
        question: "A jacket originally priced at $80 is on sale for 25% off. If sales tax is 8%, what is the final price?",
        options: ["$60.00", "$64.80", "$68.40", "$72.00"],
        correct: 1,
        explanation: {
          setup: "First apply discount, then add tax",
          steps: [
            "Discount: $80 × 0.25 = $20 off",
            "Sale price: $80 - $20 = $60",
            "Tax: $60 × 0.08 = $4.80",
            "Final price: $60 + $4.80 = $64.80"
          ],
          tip: "Or use: $80 × 0.75 × 1.08 = $64.80"
        }
      },
      {
        id: "AR-P03",
        topic: "Distance, Rate, Time",
        difficulty: 2,
        question: "Two cars start from the same point and travel in opposite directions. One travels at 55 mph and the other at 45 mph. After how many hours will they be 300 miles apart?",
        options: ["2 hours", "3 hours", "4 hours", "5 hours"],
        correct: 1,
        explanation: {
          setup: "When traveling opposite directions, add the rates",
          steps: [
            "Combined rate = 55 + 45 = 100 mph",
            "Distance = Rate × Time",
            "300 = 100 × Time",
            "Time = 300 ÷ 100 = 3 hours"
          ],
          tip: "Check: Car 1 travels 55×3=165 mi, Car 2 travels 45×3=135 mi. Total: 300 mi ✓"
        }
      },
      {
        id: "AR-P04",
        topic: "Fractions",
        difficulty: 1,
        question: "A recipe calls for 2¼ cups of flour. If you want to make half the recipe, how much flour do you need?",
        options: ["1 cup", "1⅛ cups", "1¼ cups", "1½ cups"],
        correct: 1,
        explanation: {
          setup: "Divide the mixed number by 2",
          steps: [
            "Convert to improper fraction: 2¼ = 9/4",
            "Divide by 2: 9/4 ÷ 2 = 9/4 × 1/2 = 9/8",
            "Convert back: 9/8 = 1⅛ cups"
          ],
          tip: "Quick check: 2¼ is between 2 and 2.5, so half is between 1 and 1.25 ✓"
        }
      },
      {
        id: "AR-P05",
        topic: "Statistics",
        difficulty: 2,
        question: "A student scored 78, 82, 91, and 85 on four tests. What score is needed on the fifth test to achieve an average of 85?",
        options: ["85", "87", "89", "91"],
        correct: 2,
        explanation: {
          setup: "Use the average formula: Sum = Average × Count",
          steps: [
            "Target sum for 5 tests: 85 × 5 = 425",
            "Current sum: 78 + 82 + 91 + 85 = 336",
            "Needed score: 425 - 336 = 89"
          ],
          tip: "Verify: (78+82+91+85+89)/5 = 425/5 = 85 ✓"
        }
      },
      {
        id: "AR-P06",
        topic: "Percentages",
        difficulty: 3,
        question: "After a 20% raise, Maria earns $54,000 per year. What was her salary before the raise?",
        options: ["$43,200", "$45,000", "$47,500", "$50,000"],
        correct: 1,
        explanation: {
          setup: "Work backwards: new salary = old salary × 1.20",
          steps: [
            "Let x = original salary",
            "x × 1.20 = $54,000",
            "x = $54,000 ÷ 1.20",
            "x = $45,000"
          ],
          tip: "Common mistake: Don't subtract 20% from $54,000 - that gives wrong answer!"
        }
      },
      {
        id: "AR-P07",
        topic: "Ratios",
        difficulty: 3,
        question: "A mixture contains water and concentrate in a ratio of 5:2. If the total mixture is 28 liters, how many liters of concentrate are there?",
        options: ["4 liters", "6 liters", "8 liters", "10 liters"],
        correct: 2,
        explanation: {
          setup: "Total parts = 5 + 2 = 7. Find value of one part.",
          steps: [
            "One part = 28 ÷ 7 = 4 liters",
            "Concentrate = 2 parts = 2 × 4 = 8 liters"
          ],
          tip: "Verify: Water = 5×4 = 20L. Total: 20+8 = 28L ✓"
        }
      },
      {
        id: "AR-P08",
        topic: "Simple Interest",
        difficulty: 2,
        question: "How much interest is earned on $2,000 invested at 4% simple interest for 3 years?",
        options: ["$80", "$160", "$240", "$320"],
        correct: 2,
        explanation: {
          setup: "Use I = P × R × T formula",
          steps: [
            "P (Principal) = $2,000",
            "R (Rate) = 4% = 0.04",
            "T (Time) = 3 years",
            "I = $2,000 × 0.04 × 3 = $240"
          ],
          tip: "Simple interest = same amount each year: $80/year × 3 = $240"
        }
      },
      {
        id: "AR-P09",
        topic: "Distance, Rate, Time",
        difficulty: 3,
        question: "A hiker walks 8 miles at 4 mph, then jogs 6 miles at 6 mph. What is the average speed for the entire trip?",
        options: ["4.67 mph", "5.00 mph", "5.25 mph", "5.50 mph"],
        correct: 0,
        explanation: {
          setup: "Average speed = Total Distance ÷ Total Time (NOT average of speeds!)",
          steps: [
            "Walking time: 8 mi ÷ 4 mph = 2 hours",
            "Jogging time: 6 mi ÷ 6 mph = 1 hour",
            "Total distance: 8 + 6 = 14 miles",
            "Total time: 2 + 1 = 3 hours",
            "Average speed: 14 ÷ 3 = 4.67 mph"
          ],
          tip: "NEVER average speeds directly - it's a common trick on the ASVAB!"
        }
      },
      {
        id: "AR-P10",
        topic: "Work Problems",
        difficulty: 4,
        question: "If Worker A can complete a job in 6 hours and Worker B can complete the same job in 4 hours, how long will it take them working together?",
        options: ["2.0 hours", "2.4 hours", "2.5 hours", "3.0 hours"],
        correct: 1,
        explanation: {
          setup: "Add their work rates: rate = 1/time",
          steps: [
            "Worker A's rate: 1/6 job per hour",
            "Worker B's rate: 1/4 job per hour",
            "Combined rate: 1/6 + 1/4 = 2/12 + 3/12 = 5/12 job per hour",
            "Time = 1 ÷ (5/12) = 12/5 = 2.4 hours"
          ],
          tip: "Combined time is always less than either individual time"
        }
      }
    ]
  },

  // ========================================
  // SECTION 2: MATHEMATICS KNOWLEDGE (MK)
  // ========================================
  MK: {
    name: "Mathematics Knowledge",
    code: "MK",
    testInfo: {
      questions: 16,
      timeMinutes: 20,
      secondsPerQuestion: 75,
      description: "Pure math concepts - algebra and geometry (no word problems)"
    },

    strategies: {
      primary: [
        {
          name: "Memorize Key Formulas",
          description: "No formula sheet provided. You must know area, perimeter, volume, and algebraic rules by heart.",
          critical: ["Pythagorean theorem", "Quadratic formula", "Area formulas", "FOIL method"]
        },
        {
          name: "Substitute and Check",
          description: "Plug answer choices back into the original equation to verify. Faster than solving sometimes."
        },
        {
          name: "Estimate First",
          description: "Before calculating, estimate the answer to eliminate obviously wrong choices."
        }
      ],
      timeManagement: [
        "Only ~75 seconds per question - fastest AFQT section",
        "Know formulas cold to save precious seconds",
        "Skip complex calculations - come back later",
        "Don't get stuck on one problem"
      ],
      commonMistakes: [
        "Sign errors with negative numbers",
        "Forgetting order of operations (PEMDAS)",
        "Confusing area with perimeter",
        "Not simplifying answers fully"
      ]
    },

    lessons: [
      {
        id: "MK-L01",
        title: "Algebra Fundamentals",
        importance: "HIGH - Foundation for all algebra problems",
        concepts: [
          {
            name: "Solving Linear Equations",
            explanation: "Isolate the variable by doing the same operation to both sides",
            steps: ["Combine like terms", "Move variables to one side", "Move constants to the other", "Divide by coefficient"],
            example: "3x + 7 = 22 → 3x = 15 → x = 5"
          },
          {
            name: "Order of Operations (PEMDAS)",
            explanation: "Parentheses, Exponents, Multiplication/Division (left to right), Addition/Subtraction (left to right)"
          },
          {
            name: "Inequalities",
            explanation: "Solve like equations, but flip the sign when multiplying/dividing by a negative number",
            example: "-2x > 6 → x < -3 (sign flips!)"
          }
        ]
      },
      {
        id: "MK-L02",
        title: "Exponents and Radicals",
        importance: "HIGH - Tested frequently",
        concepts: [
          {
            name: "Exponent Rules",
            rules: {
              "Multiplication": "a^m × a^n = a^(m+n)",
              "Division": "a^m ÷ a^n = a^(m-n)",
              "Power of Power": "(a^m)^n = a^(m×n)",
              "Zero Exponent": "a^0 = 1",
              "Negative Exponent": "a^(-n) = 1/a^n"
            }
          },
          {
            name: "Square Roots",
            explanation: "√(a×b) = √a × √b. √(a/b) = √a / √b. Know perfect squares: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100"
          },
          {
            name: "Simplifying Radicals",
            explanation: "Factor out perfect squares: √50 = √(25×2) = 5√2"
          }
        ]
      },
      {
        id: "MK-L03",
        title: "Polynomials",
        importance: "HIGH - FOIL and factoring appear often",
        concepts: [
          {
            name: "FOIL Method",
            explanation: "Multiply binomials: First, Outer, Inner, Last",
            example: "(x+3)(x+2) = x² + 2x + 3x + 6 = x² + 5x + 6"
          },
          {
            name: "Factoring",
            explanation: "Reverse of FOIL. Find two numbers that multiply to c and add to b in x² + bx + c",
            example: "x² + 7x + 12 = (x+3)(x+4) because 3×4=12 and 3+4=7"
          },
          {
            name: "Difference of Squares",
            formula: "a² - b² = (a+b)(a-b)",
            example: "x² - 9 = (x+3)(x-3)"
          }
        ]
      },
      {
        id: "MK-L04",
        title: "Geometry - Triangles",
        importance: "HIGH - Pythagorean theorem is heavily tested",
        concepts: [
          {
            name: "Pythagorean Theorem",
            formula: "a² + b² = c² (c is the hypotenuse - longest side)",
            commonTriples: ["3-4-5", "5-12-13", "8-15-17", "7-24-25"],
            tip: "Multiples also work: 6-8-10, 9-12-15, etc."
          },
          {
            name: "Triangle Properties",
            facts: [
              "Sum of angles = 180°",
              "Sum of any two sides > third side",
              "Area = ½ × base × height"
            ]
          },
          {
            name: "Special Triangles",
            types: {
              "45-45-90": "Sides ratio = 1:1:√2",
              "30-60-90": "Sides ratio = 1:√3:2"
            }
          }
        ]
      },
      {
        id: "MK-L05",
        title: "Geometry - Circles",
        importance: "HIGH - Multiple formulas to memorize",
        concepts: [
          {
            name: "Circle Formulas",
            formulas: {
              "Circumference": "C = 2πr = πd",
              "Area": "A = πr²"
            },
            tip: "π ≈ 3.14 or 22/7"
          },
          {
            name: "Circle Parts",
            definitions: {
              "Radius": "Distance from center to edge",
              "Diameter": "Distance across through center (d = 2r)",
              "Chord": "Line segment with endpoints on circle"
            }
          }
        ]
      },
      {
        id: "MK-L06",
        title: "Geometry - Area and Perimeter",
        importance: "HIGH - Know these formulas cold",
        concepts: [
          {
            name: "Rectangle/Square",
            formulas: {
              "Perimeter": "P = 2l + 2w (or 4s for square)",
              "Area": "A = l × w (or s² for square)"
            }
          },
          {
            name: "Triangle",
            formulas: {
              "Perimeter": "P = a + b + c",
              "Area": "A = ½ × base × height"
            }
          },
          {
            name: "Parallelogram/Trapezoid",
            formulas: {
              "Parallelogram Area": "A = base × height",
              "Trapezoid Area": "A = ½(b₁ + b₂) × h"
            }
          }
        ]
      },
      {
        id: "MK-L07",
        title: "Geometry - Volume",
        importance: "MEDIUM-HIGH - Usually 1-2 questions",
        concepts: [
          {
            name: "Volume Formulas",
            formulas: {
              "Rectangular Solid": "V = l × w × h",
              "Cube": "V = s³",
              "Cylinder": "V = πr²h",
              "Sphere": "V = (4/3)πr³",
              "Cone": "V = (1/3)πr²h"
            }
          }
        ]
      },
      {
        id: "MK-L08",
        title: "Quadratic Equations",
        importance: "MEDIUM - Know the quadratic formula",
        concepts: [
          {
            name: "Quadratic Formula",
            formula: "x = (-b ± √(b²-4ac)) / 2a for ax² + bx + c = 0",
            tip: "Memorize it: 'Negative b plus or minus the square root of b squared minus 4ac, all over 2a'"
          },
          {
            name: "Factoring to Solve",
            explanation: "If you can factor, set each factor = 0",
            example: "x² - 5x + 6 = 0 → (x-2)(x-3) = 0 → x = 2 or x = 3"
          }
        ]
      },
      {
        id: "MK-L09",
        title: "Number Properties",
        importance: "MEDIUM - Fundamentals tested in various ways",
        concepts: [
          {
            name: "Prime Numbers",
            explanation: "Numbers divisible only by 1 and themselves",
            list: "2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31..."
          },
          {
            name: "Factors and Multiples",
            definitions: {
              "Factor": "Divides evenly into a number",
              "Multiple": "Result of multiplying by an integer",
              "GCF": "Greatest Common Factor",
              "LCM": "Least Common Multiple"
            }
          },
          {
            name: "Integer Properties",
            rules: [
              "Even × Even = Even",
              "Even × Odd = Even",
              "Odd × Odd = Odd",
              "Negative × Negative = Positive"
            ]
          }
        ]
      }
    ],

    practiceQuestions: [
      {
        id: "MK-P01",
        topic: "Linear Equations",
        difficulty: 1,
        question: "Solve for x: 5x - 12 = 3x + 8",
        options: ["x = 2", "x = 5", "x = 10", "x = 20"],
        correct: 2,
        explanation: {
          steps: [
            "5x - 12 = 3x + 8",
            "Subtract 3x from both sides: 2x - 12 = 8",
            "Add 12 to both sides: 2x = 20",
            "Divide by 2: x = 10"
          ],
          tip: "Check: 5(10)-12 = 38, 3(10)+8 = 38 ✓"
        }
      },
      {
        id: "MK-P02",
        topic: "Exponents",
        difficulty: 2,
        question: "Simplify: (x³)² × x⁴",
        options: ["x⁸", "x⁹", "x¹⁰", "x²⁴"],
        correct: 2,
        explanation: {
          steps: [
            "(x³)² = x^(3×2) = x⁶",
            "x⁶ × x⁴ = x^(6+4) = x¹⁰"
          ],
          tip: "Power of power: multiply exponents. Same base multiplication: add exponents."
        }
      },
      {
        id: "MK-P03",
        topic: "Pythagorean Theorem",
        difficulty: 2,
        question: "A right triangle has legs of 6 and 8. What is the length of the hypotenuse?",
        options: ["7", "10", "12", "14"],
        correct: 1,
        explanation: {
          steps: [
            "a² + b² = c²",
            "6² + 8² = c²",
            "36 + 64 = c²",
            "100 = c²",
            "c = 10"
          ],
          tip: "This is a 3-4-5 triangle multiplied by 2 → 6-8-10"
        }
      },
      {
        id: "MK-P04",
        topic: "Circle Area",
        difficulty: 2,
        question: "What is the area of a circle with diameter 10?",
        options: ["25π", "50π", "100π", "10π"],
        correct: 0,
        explanation: {
          steps: [
            "Diameter = 10, so radius = 5",
            "Area = πr²",
            "Area = π(5)² = 25π"
          ],
          tip: "Common mistake: using diameter instead of radius. Always halve the diameter first!"
        }
      },
      {
        id: "MK-P05",
        topic: "FOIL",
        difficulty: 2,
        question: "Expand: (x - 4)(x + 7)",
        options: ["x² + 3x - 28", "x² - 3x - 28", "x² + 3x + 28", "x² + 11x - 28"],
        correct: 0,
        explanation: {
          steps: [
            "First: x × x = x²",
            "Outer: x × 7 = 7x",
            "Inner: -4 × x = -4x",
            "Last: -4 × 7 = -28",
            "Combine: x² + 7x - 4x - 28 = x² + 3x - 28"
          ],
          tip: "Watch signs carefully with FOIL!"
        }
      },
      {
        id: "MK-P06",
        topic: "Factoring",
        difficulty: 3,
        question: "Factor: x² - 9x + 20",
        options: ["(x-4)(x-5)", "(x+4)(x+5)", "(x-2)(x-10)", "(x-4)(x+5)"],
        correct: 0,
        explanation: {
          steps: [
            "Find two numbers that multiply to +20 and add to -9",
            "Numbers: -4 and -5 (because -4 × -5 = 20 and -4 + -5 = -9)",
            "Factor: (x - 4)(x - 5)"
          ],
          tip: "Both factors are negative because product is positive and sum is negative"
        }
      },
      {
        id: "MK-P07",
        topic: "Volume",
        difficulty: 2,
        question: "What is the volume of a cylinder with radius 3 and height 7?",
        options: ["21π", "42π", "63π", "147π"],
        correct: 2,
        explanation: {
          steps: [
            "V = πr²h",
            "V = π(3)²(7)",
            "V = π(9)(7)",
            "V = 63π"
          ],
          tip: "Cylinder volume = area of circular base × height"
        }
      },
      {
        id: "MK-P08",
        topic: "Inequalities",
        difficulty: 3,
        question: "Solve: -3x + 7 > 16",
        options: ["x > 3", "x < 3", "x > -3", "x < -3"],
        correct: 3,
        explanation: {
          steps: [
            "-3x + 7 > 16",
            "-3x > 9 (subtract 7)",
            "x < -3 (divide by -3, flip inequality!)"
          ],
          tip: "CRITICAL: When you multiply or divide by a negative, flip the inequality sign!"
        }
      },
      {
        id: "MK-P09",
        topic: "Simplifying Radicals",
        difficulty: 3,
        question: "Simplify: √72",
        options: ["6√2", "8√3", "4√9", "3√8"],
        correct: 0,
        explanation: {
          steps: [
            "Factor 72 to find perfect squares: 72 = 36 × 2",
            "√72 = √(36 × 2)",
            "= √36 × √2",
            "= 6√2"
          ],
          tip: "Look for the largest perfect square factor"
        }
      },
      {
        id: "MK-P10",
        topic: "Angles",
        difficulty: 2,
        question: "Two angles are supplementary. One angle is 35°. What is the other angle?",
        options: ["55°", "65°", "125°", "145°"],
        correct: 3,
        explanation: {
          steps: [
            "Supplementary angles sum to 180°",
            "Other angle = 180° - 35° = 145°"
          ],
          tip: "Supplementary = 180° (straight line). Complementary = 90° (right angle)."
        }
      }
    ]
  },

  // ========================================
  // SECTION 3: WORD KNOWLEDGE (WK)
  // ========================================
  WK: {
    name: "Word Knowledge",
    code: "WK",
    testInfo: {
      questions: 16,
      timeMinutes: 8,
      secondsPerQuestion: 30,
      description: "Vocabulary - synonyms and word meanings"
    },

    strategies: {
      primary: [
        {
          name: "Learn Word Parts",
          description: "Master 50-100 common roots, prefixes, and suffixes to unlock thousands of words",
          examples: {
            "bene- (good)": "benefit, benevolent, benefactor",
            "mal- (bad)": "malice, malfunction, malevolent",
            "-ous (full of)": "dangerous, courageous, spacious"
          }
        },
        {
          name: "Context Clues",
          description: "Use surrounding words or the sentence structure to infer meaning"
        },
        {
          name: "Process of Elimination",
          description: "Rule out clearly wrong answers first - especially important with 30-second limit"
        },
        {
          name: "Trust Your Gut",
          description: "If you've seen the word before, your first instinct is usually right"
        }
      ],
      timeManagement: [
        "Only 30 seconds per question - fastest paced section",
        "Don't deliberate - eliminate and choose quickly",
        "If stuck after 20 seconds, make your best guess and move on",
        "Practice under timed conditions is essential"
      ],
      commonMistakes: [
        "Over-thinking simple words",
        "Confusing similar-sounding words",
        "Not using word parts to decode unfamiliar words",
        "Second-guessing correct first instincts"
      ]
    },

    // Common prefixes, roots, and suffixes
    wordParts: {
      prefixes: [
        { part: "un-, in-, im-, dis-", meaning: "not", examples: ["unhappy", "invisible", "impossible", "disagree"] },
        { part: "re-", meaning: "again", examples: ["redo", "return", "review"] },
        { part: "pre-", meaning: "before", examples: ["preview", "predict", "prepare"] },
        { part: "post-", meaning: "after", examples: ["postpone", "postwar", "postscript"] },
        { part: "anti-", meaning: "against", examples: ["antiwar", "antibody", "antisocial"] },
        { part: "pro-", meaning: "for, forward", examples: ["progress", "promote", "proactive"] },
        { part: "mis-", meaning: "wrongly", examples: ["mistake", "misunderstand", "mislead"] },
        { part: "sub-", meaning: "under", examples: ["submarine", "subway", "submerge"] },
        { part: "super-", meaning: "above", examples: ["superior", "supernatural", "supervise"] },
        { part: "trans-", meaning: "across", examples: ["transport", "transfer", "translate"] }
      ],
      roots: [
        { part: "bene-", meaning: "good", examples: ["benefit", "benevolent", "benefactor"] },
        { part: "mal-", meaning: "bad", examples: ["malice", "malfunction", "malevolent"] },
        { part: "aud-", meaning: "hear", examples: ["audio", "audience", "audible"] },
        { part: "vid-, vis-", meaning: "see", examples: ["video", "vision", "visible"] },
        { part: "scrib-, script-", meaning: "write", examples: ["describe", "scripture", "inscription"] },
        { part: "port-", meaning: "carry", examples: ["transport", "portable", "import"] },
        { part: "dict-", meaning: "say, speak", examples: ["dictate", "predict", "dictionary"] },
        { part: "rupt-", meaning: "break", examples: ["rupture", "interrupt", "erupt"] },
        { part: "tract-", meaning: "pull, draw", examples: ["tractor", "attract", "extract"] },
        { part: "spec-, spect-", meaning: "look", examples: ["spectacle", "inspect", "respect"] }
      ],
      suffixes: [
        { part: "-tion, -sion", meaning: "act or state", examples: ["action", "decision", "creation"] },
        { part: "-ness", meaning: "state of being", examples: ["happiness", "darkness", "kindness"] },
        { part: "-able, -ible", meaning: "capable of", examples: ["readable", "flexible", "visible"] },
        { part: "-ous, -ious", meaning: "full of", examples: ["dangerous", "spacious", "curious"] },
        { part: "-ment", meaning: "result of", examples: ["development", "agreement", "movement"] },
        { part: "-er, -or", meaning: "one who", examples: ["teacher", "actor", "builder"] },
        { part: "-ly", meaning: "in a manner", examples: ["quickly", "happily", "carefully"] },
        { part: "-ful", meaning: "full of", examples: ["helpful", "beautiful", "powerful"] },
        { part: "-less", meaning: "without", examples: ["helpless", "careless", "fearless"] }
      ]
    },

    lessons: [
      {
        id: "WK-L01",
        title: "High-Frequency ASVAB Vocabulary",
        importance: "HIGH - These words appear often",
        wordSets: [
          {
            category: "Describing Actions",
            words: [
              { word: "alleviate", definition: "to reduce or lessen", example: "Medicine can alleviate pain." },
              { word: "commence", definition: "to begin or start", example: "The ceremony will commence at noon." },
              { word: "compel", definition: "to force or drive", example: "Evidence compelled him to confess." },
              { word: "concur", definition: "to agree", example: "I concur with your assessment." },
              { word: "designate", definition: "to point out or indicate", example: "The sign designates a fire exit." },
              { word: "endeavor", definition: "to try or attempt", example: "We endeavor to improve daily." },
              { word: "facilitate", definition: "to make easier", example: "Technology facilitates communication." },
              { word: "implement", definition: "to put into action", example: "We will implement the new policy." },
              { word: "obsolete", definition: "outdated, no longer used", example: "Typewriters are now obsolete." },
              { word: "terminate", definition: "to end or stop", example: "The contract will terminate in May." }
            ]
          },
          {
            category: "Describing People/Things",
            words: [
              { word: "adept", definition: "highly skilled", example: "She is adept at public speaking." },
              { word: "affluent", definition: "wealthy, rich", example: "They live in an affluent neighborhood." },
              { word: "benevolent", definition: "kind, charitable", example: "The benevolent donor helped many." },
              { word: "candid", definition: "honest, straightforward", example: "I appreciate your candid feedback." },
              { word: "diligent", definition: "hardworking, careful", example: "A diligent student studies daily." },
              { word: "frugal", definition: "thrifty, economical", example: "Frugal shoppers use coupons." },
              { word: "hostile", definition: "unfriendly, aggressive", example: "The hostile crowd booed loudly." },
              { word: "meticulous", definition: "very careful, precise", example: "Surgeons must be meticulous." },
              { word: "prudent", definition: "wise, careful", example: "It's prudent to save money." },
              { word: "resilient", definition: "able to recover quickly", example: "Children are often resilient." }
            ]
          },
          {
            category: "Describing Size/Amount",
            words: [
              { word: "abundant", definition: "plentiful, more than enough", example: "There was abundant food at the feast." },
              { word: "diminish", definition: "to become smaller", example: "His enthusiasm began to diminish." },
              { word: "immense", definition: "extremely large", example: "The stadium was immense." },
              { word: "minimal", definition: "very small, least possible", example: "There was minimal damage." },
              { word: "scarce", definition: "rare, in short supply", example: "Clean water was scarce." },
              { word: "substantial", definition: "large in size or importance", example: "He made a substantial donation." }
            ]
          }
        ]
      },
      {
        id: "WK-L02",
        title: "Synonyms Strategy",
        importance: "HIGH - How to approach synonym questions",
        strategies: [
          {
            name: "Use in a Sentence",
            explanation: "Put the word in a simple sentence, then try each answer choice in the same sentence"
          },
          {
            name: "Positive/Negative Check",
            explanation: "Determine if the word has positive, negative, or neutral connotation - eliminate answers with wrong tone"
          },
          {
            name: "Degree of Intensity",
            explanation: "Words can be mild or intense. 'Angry' is mild, 'furious' is intense. Match the intensity."
          }
        ]
      }
    ],

    practiceQuestions: [
      {
        id: "WK-P01",
        difficulty: 1,
        question: "ABANDON most nearly means",
        options: ["keep", "desert", "find", "protect"],
        correct: 1,
        explanation: {
          answer: "Desert means to leave behind or give up, same as abandon.",
          wordParts: "From Latin 'abandonare' - to give up control",
          tip: "Think of an 'abandoned building' - it's been deserted."
        }
      },
      {
        id: "WK-P02",
        difficulty: 1,
        question: "TRIVIAL most nearly means",
        options: ["important", "unimportant", "difficult", "easy"],
        correct: 1,
        explanation: {
          answer: "Trivial means of little significance or importance.",
          tip: "Think 'trivia' - minor facts that don't really matter."
        }
      },
      {
        id: "WK-P03",
        difficulty: 2,
        question: "CANDID most nearly means",
        options: ["sweet", "honest", "hidden", "bright"],
        correct: 1,
        explanation: {
          answer: "Candid means straightforward, honest, and open.",
          tip: "'Candid camera' captures real, unposed reactions - honest moments."
        }
      },
      {
        id: "WK-P04",
        difficulty: 2,
        question: "METICULOUS most nearly means",
        options: ["careless", "musical", "careful", "metal"],
        correct: 2,
        explanation: {
          answer: "Meticulous means extremely careful about details.",
          tip: "A meticulous person dots every 'i' and crosses every 't'."
        }
      },
      {
        id: "WK-P05",
        difficulty: 2,
        question: "BENEVOLENT most nearly means",
        options: ["mean", "violent", "kind", "weak"],
        correct: 2,
        explanation: {
          answer: "Benevolent means kindly and charitable.",
          wordParts: "'Bene' = good, 'volent' = wishing. So 'good-wishing' = kind.",
          tip: "Use the root! 'Bene-' always means good."
        }
      },
      {
        id: "WK-P06",
        difficulty: 3,
        question: "ALLEVIATE most nearly means",
        options: ["worsen", "reduce", "raise", "create"],
        correct: 1,
        explanation: {
          answer: "Alleviate means to make less severe, to reduce.",
          example: "Medicine alleviates pain - it reduces pain.",
          tip: "Think 'relieve' which sounds similar and means nearly the same."
        }
      },
      {
        id: "WK-P07",
        difficulty: 3,
        question: "OBSOLETE most nearly means",
        options: ["modern", "outdated", "absolute", "transparent"],
        correct: 1,
        explanation: {
          answer: "Obsolete means no longer in use, outdated.",
          example: "VHS tapes are obsolete - replaced by streaming.",
          tip: "Technology becomes obsolete when newer versions replace it."
        }
      },
      {
        id: "WK-P08",
        difficulty: 3,
        question: "RESILIENT most nearly means",
        options: ["weak", "quick to recover", "slow", "hard"],
        correct: 1,
        explanation: {
          answer: "Resilient means able to recover quickly from difficulties.",
          tip: "Think of resilient materials like rubber that bounce back."
        }
      },
      {
        id: "WK-P09",
        difficulty: 4,
        question: "ASCERTAIN most nearly means",
        options: ["certain", "guess", "determine", "forget"],
        correct: 2,
        explanation: {
          answer: "Ascertain means to find out or determine with certainty.",
          wordParts: "Contains 'certain' - to make certain, to verify.",
          tip: "Don't be fooled by 'certain' as an answer - ascertain is a verb meaning to find out."
        }
      },
      {
        id: "WK-P10",
        difficulty: 4,
        question: "IMPEDE most nearly means",
        options: ["help", "speed up", "block", "move"],
        correct: 2,
        explanation: {
          answer: "Impede means to obstruct or hinder progress.",
          wordParts: "'Im-' = in, 'ped' = foot. Literally 'in the foot' - something blocking your path.",
          tip: "An 'impediment' is something that impedes - a blockage or obstacle."
        }
      }
    ]
  },

  // ========================================
  // SECTION 4: PARAGRAPH COMPREHENSION (PC)
  // ========================================
  PC: {
    name: "Paragraph Comprehension",
    code: "PC",
    testInfo: {
      questions: 11,
      timeMinutes: 27,
      secondsPerQuestion: 147,
      description: "Reading comprehension - understanding passages"
    },

    strategies: {
      primary: [
        {
          name: "Read Questions First",
          description: "Before reading the passage, scan the question to know what to look for. This focuses your reading."
        },
        {
          name: "Stick to the Text",
          description: "Answers must be supported by the passage. Never use outside knowledge or make assumptions."
        },
        {
          name: "Find Evidence",
          description: "For every answer, you should be able to point to specific words or sentences that support it."
        },
        {
          name: "Watch for Qualifier Words",
          description: "Answer choices with 'all', 'never', 'always' are often wrong. Choices with 'some', 'may', 'often' are often right."
        }
      ],
      questionTypes: [
        {
          type: "Main Idea",
          description: "What is the passage primarily about?",
          tip: "Look at the first and last sentences. The main idea is usually broad, not a specific detail."
        },
        {
          type: "Supporting Details",
          description: "Find specific facts stated in the passage",
          tip: "Go back to the passage and find the exact sentence that answers the question."
        },
        {
          type: "Inference",
          description: "What can be concluded or implied?",
          tip: "The answer won't be directly stated but must be logically supported by the text."
        },
        {
          type: "Vocabulary in Context",
          description: "What does this word mean as used here?",
          tip: "Re-read the sentence with each answer choice substituted in."
        },
        {
          type: "Author's Purpose/Tone",
          description: "Why did the author write this? What's the attitude?",
          tip: "Look at word choices - are they neutral, positive, negative, persuasive?"
        }
      ],
      timeManagement: [
        "Most generous timing - about 2.5 minutes per question",
        "Read the passage carefully once, then the question",
        "Go back to verify answers - you have time",
        "Don't second-guess supported answers"
      ],
      commonMistakes: [
        "Using outside knowledge instead of the passage",
        "Choosing answers that 'sound true' but aren't supported",
        "Not re-reading the passage to verify",
        "Over-analyzing simple questions"
      ]
    },

    lessons: [
      {
        id: "PC-L01",
        title: "Active Reading Strategies",
        importance: "HIGH - How you read determines comprehension",
        techniques: [
          {
            name: "Preview the Question",
            steps: [
              "Read the question (not answer choices) first",
              "Note keywords in the question",
              "Read the passage with those keywords in mind"
            ]
          },
          {
            name: "Identify Topic Sentences",
            explanation: "The first sentence of each paragraph often states the main point. Pay extra attention here."
          },
          {
            name: "Mark Key Words",
            explanation: "Mentally note or underline names, dates, numbers, and transition words (however, therefore, because)"
          }
        ]
      },
      {
        id: "PC-L02",
        title: "Answer Elimination",
        importance: "HIGH - Systematic elimination improves accuracy",
        rules: [
          {
            rule: "Extreme Words",
            explanation: "Answers with 'always', 'never', 'all', 'none' are usually wrong",
            exception: "Unless the passage explicitly uses these words"
          },
          {
            rule: "Too Narrow",
            explanation: "For main idea questions, avoid answers that only cover one detail"
          },
          {
            rule: "Too Broad",
            explanation: "Answers that go beyond what the passage discusses are wrong"
          },
          {
            rule: "Not Stated",
            explanation: "If you can't point to text that supports it, eliminate it"
          }
        ]
      }
    ],

    practiceQuestions: [
      {
        id: "PC-P01",
        difficulty: 1,
        passage: "The honeybee is one of the most important insects on Earth. Without bees, many of the foods we eat would not exist. Bees pollinate approximately 80% of flowering plants, including many fruits and vegetables. When a bee visits a flower to collect nectar, pollen sticks to its body. As it moves to the next flower, some of this pollen rubs off, fertilizing the plant.",
        question: "What is the main idea of this passage?",
        options: [
          "Bees collect nectar from flowers",
          "Bees are essential for pollinating plants we depend on",
          "Pollen sticks to bees when they visit flowers",
          "80% of plants are flowering plants"
        ],
        correct: 1,
        explanation: {
          answer: "The passage emphasizes the importance of bees for pollination and food production.",
          evidence: "First sentence: 'one of the most important insects' and 'many foods we eat would not exist'",
          tip: "Main idea = the BIG picture, not one specific detail"
        }
      },
      {
        id: "PC-P02",
        difficulty: 2,
        passage: "The United States Marine Corps was established on November 10, 1775, when the Continental Congress authorized two battalions of Marines. The Marines' first mission was to serve as landing troops for the Continental Navy. Today, the Marine Corps remains a rapid response force, capable of deploying to conflicts around the world within days. Their motto, 'Semper Fidelis,' means 'Always Faithful.'",
        question: "Based on the passage, which statement is true?",
        options: [
          "The Marines were established before the Revolutionary War ended",
          "The Marine Corps was originally part of the Army",
          "Marines can only fight on land",
          "The Marine motto is in Spanish"
        ],
        correct: 0,
        explanation: {
          answer: "The Marines were established in 1775, during the Revolutionary War (which ended in 1783).",
          evidence: "The passage states they were established November 10, 1775 - the Revolutionary War was ongoing.",
          tip: "The passage doesn't say 'during the war,' but you can infer it from the date and context."
        }
      },
      {
        id: "PC-P03",
        difficulty: 2,
        passage: "Although many people believe that lightning never strikes the same place twice, this is actually a myth. In fact, tall structures like the Empire State Building are struck by lightning about 25 times per year. Lightning tends to strike the tallest object in an area because it provides the shortest path between the cloud and the ground.",
        question: "Why does lightning tend to strike tall structures?",
        options: [
          "Tall buildings attract more clouds",
          "They provide the shortest path to the ground",
          "They are struck about 25 times per year",
          "People believe myths about lightning"
        ],
        correct: 1,
        explanation: {
          answer: "The passage explicitly states lightning strikes tall objects 'because it provides the shortest path between the cloud and the ground.'",
          tip: "'Why' questions look for cause-and-effect. Find the word 'because' in the passage."
        }
      },
      {
        id: "PC-P04",
        difficulty: 3,
        passage: "The development of penicillin is often credited to Alexander Fleming, who discovered the antibiotic properties of the Penicillium mold in 1928. However, Fleming was unable to produce penicillin in large quantities. It was not until 1941 that Howard Florey and Ernst Boris Chain developed methods for mass production, making the drug available to treat wounded soldiers during World War II.",
        question: "What can be inferred about penicillin before 1941?",
        options: [
          "It was widely used to treat infections",
          "It was available only in limited quantities",
          "Alexander Fleming refused to share his discovery",
          "World War II soldiers did not need antibiotics"
        ],
        correct: 1,
        explanation: {
          answer: "The passage states Fleming 'was unable to produce penicillin in large quantities' and mass production methods weren't developed until 1941.",
          evidence: "This implies it was only available in limited quantities before that time.",
          tip: "Inference = logical conclusion based on stated facts, not wild guessing."
        }
      },
      {
        id: "PC-P05",
        difficulty: 3,
        passage: "Despite their fearsome reputation, most shark species pose little threat to humans. Of the more than 500 shark species, only about 12 are considered potentially dangerous to people. Sharks are actually vital to ocean ecosystems, helping to keep populations of other fish in balance. Unfortunately, sharks face a much greater threat from humans: approximately 100 million sharks are killed by people each year, primarily for their fins.",
        question: "The author's tone toward sharks can best be described as:",
        options: [
          "fearful and cautious",
          "defensive and sympathetic",
          "neutral and uninterested",
          "hostile and critical"
        ],
        correct: 1,
        explanation: {
          answer: "The author defends sharks (corrects misconceptions) and shows sympathy (mentions they face threats from humans).",
          evidence: "'most shark species pose little threat,' 'sharks are actually vital,' 'sharks face a much greater threat from humans'",
          tip: "For tone questions, look at word choices - positive or negative? Does the author take a side?"
        }
      },
      {
        id: "PC-P06",
        difficulty: 3,
        passage: "The human brain contains approximately 86 billion neurons, each connecting to thousands of other neurons. This creates a network more complex than any computer ever built. While computers excel at calculations and data storage, the brain is superior at pattern recognition, creativity, and adapting to new situations. The brain also uses far less energy—about 20 watts—compared to supercomputers that require millions of watts.",
        question: "According to the passage, in what way is the brain superior to computers?",
        options: [
          "Processing speed and calculations",
          "Data storage capacity",
          "Pattern recognition and adaptation",
          "Energy production"
        ],
        correct: 2,
        explanation: {
          answer: "The passage directly states 'the brain is superior at pattern recognition, creativity, and adapting to new situations.'",
          tip: "This is a detail question - the answer is stated directly in the text."
        }
      },
      {
        id: "PC-P07",
        difficulty: 4,
        passage: "The term 'ghost town' typically evokes images of abandoned mining settlements in the American West. However, ghost towns exist worldwide and are created by various circumstances. Economic downturns can cause residents to leave when jobs disappear. Natural disasters like floods or earthquakes may render areas uninhabitable. In some cases, entire towns have been evacuated due to environmental contamination, as happened near the Chernobyl nuclear disaster.",
        question: "Which of the following is NOT mentioned as a cause of ghost towns?",
        options: [
          "Mining operations ending",
          "Economic decline",
          "War and military conflict",
          "Environmental contamination"
        ],
        correct: 2,
        explanation: {
          answer: "War and military conflict are never mentioned in the passage.",
          evidence: "The passage mentions: mining settlements, economic downturns, natural disasters, environmental contamination - but not war.",
          tip: "'NOT mentioned' questions require checking each answer against the passage."
        }
      },
      {
        id: "PC-P08",
        difficulty: 4,
        passage: "Coffee is the second most traded commodity in the world after oil. The coffee plant originated in Ethiopia, where legend says a goat herder named Kaldi noticed his goats became energetic after eating coffee berries. Today, Brazil produces about one-third of the world's coffee, followed by Vietnam and Colombia. The global coffee industry employs over 125 million people worldwide.",
        question: "The word 'commodity' as used in this passage most nearly means:",
        options: [
          "a convenient item",
          "a product that is bought and sold",
          "a comfortable situation",
          "a common occurrence"
        ],
        correct: 1,
        explanation: {
          answer: "In context, commodity refers to a product (coffee) that is traded/bought and sold globally.",
          tip: "Substitute each answer into the sentence: 'Coffee is the second most traded [product that is bought and sold]' makes sense."
        }
      }
    ]
  },

  // ========================================
  // STUDY SCHEDULE
  // ========================================
  studySchedule: {
    weeks: [
      {
        week: 1,
        title: "Assessment & Foundation",
        goals: [
          "Take a full diagnostic practice test (untimed)",
          "Identify your strongest and weakest sections",
          "Set up a daily study schedule (60-90 minutes)",
          "Review basic math operations"
        ],
        dailyFocus: {
          "Day 1-2": "Diagnostic test + review",
          "Day 3-4": "Arithmetic fundamentals (fractions, decimals)",
          "Day 5-6": "Begin vocabulary building (20 words/day)",
          "Day 7": "Review + mini quiz"
        }
      },
      {
        week: 2,
        title: "Mathematics Focus",
        goals: [
          "Master ratio, proportion, and percentage problems",
          "Learn distance/rate/time formulas",
          "Continue vocabulary building"
        ],
        dailyFocus: {
          "Day 1-2": "Ratios and proportions",
          "Day 3-4": "Percentages (discount, tax, interest)",
          "Day 5-6": "Distance, rate, time problems",
          "Day 7": "Review + 20 practice problems"
        }
      },
      {
        week: 3,
        title: "Algebra & Geometry",
        goals: [
          "Master algebra fundamentals",
          "Learn geometry formulas",
          "Continue vocabulary (now at 60+ new words)"
        ],
        dailyFocus: {
          "Day 1-2": "Linear equations and inequalities",
          "Day 3-4": "FOIL, factoring, exponents",
          "Day 5-6": "Geometry formulas (area, perimeter, volume)",
          "Day 7": "Review + mixed practice test"
        }
      },
      {
        week: 4,
        title: "Verbal Sections Focus",
        goals: [
          "Master word parts (prefixes, roots, suffixes)",
          "Learn paragraph comprehension strategies",
          "Practice timed reading passages"
        ],
        dailyFocus: {
          "Day 1-2": "Intensive vocabulary (word parts)",
          "Day 3-4": "Paragraph comprehension strategies",
          "Day 5-6": "Timed reading practice (15 passages)",
          "Day 7": "Full verbal section practice test"
        }
      },
      {
        week: 5,
        title: "Integration & Timed Practice",
        goals: [
          "Take 2-3 full-length timed practice tests",
          "Review every incorrect answer",
          "Focus extra time on your 2 weakest sections"
        ],
        dailyFocus: {
          "Day 1": "Full practice test #1",
          "Day 2": "Review test #1 errors thoroughly",
          "Day 3-4": "Targeted practice on weak areas",
          "Day 5": "Full practice test #2",
          "Day 6": "Review test #2 errors",
          "Day 7": "Light review, organize notes"
        }
      },
      {
        week: 6,
        title: "Final Review & Test Prep",
        goals: [
          "Final practice test",
          "Review formulas and high-frequency vocabulary",
          "Get proper rest before test day"
        ],
        dailyFocus: {
          "Day 1": "Final full practice test",
          "Day 2": "Review remaining weak areas",
          "Day 3": "Formula and vocabulary review",
          "Day 4": "Light review only",
          "Day 5": "Rest - no studying",
          "Day 6": "Light reading if needed, early bed",
          "Day 7": "TEST DAY - eat breakfast, stay calm"
        }
      }
    ],

    priorityOrder: [
      { section: "AR", reason: "Highest weight in AFQT, most learnable with practice" },
      { section: "MK", reason: "Builds on AR concepts, formula-dependent" },
      { section: "WK", reason: "Vocabulary takes time to build - start early" },
      { section: "PC", reason: "Strategy-based, improves with consistent practice" }
    ],

    testDayTips: [
      "Get 8 hours of sleep the night before",
      "Eat a good breakfast with protein",
      "Arrive early to reduce stress",
      "Bring valid ID and any required documents",
      "Read each question carefully",
      "Never leave questions blank - always guess",
      "Don't spend too long on difficult questions",
      "Trust your preparation"
    ]
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = studyProgram;
}
