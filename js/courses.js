// ASVAB Study Course Data
// Organized by section → chapter → question pools

const courses = {

  // ============================================
  // ARITHMETIC REASONING
  // ============================================
  AR: {
    name: "Arithmetic Reasoning",
    description: "Word problems requiring mathematical reasoning",
    icon: "📐",
    chapters: [

      // --------------------------------------------
      // CHAPTER 1: RATIOS & PROPORTIONS
      // --------------------------------------------
      {
        id: "AR-1",
        title: "Ratios & Proportions",
        description: "Learn to compare quantities and solve proportion problems",

        lesson: {
          intro: "Ratios and proportions are the #1 most tested topic on Arithmetic Reasoning. Master this, and you're already ahead.",

          concepts: [
            {
              title: "What is a Ratio?",
              content: "A ratio compares two quantities. If there are 3 boys and 5 girls, the ratio is 3:5 (or 3 to 5, or 3/5). It tells you how the quantities relate to each other."
            },
            {
              title: "What is a Proportion?",
              content: "A proportion says two ratios are equal. If 2 apples cost $1, then 6 apples cost $3. We write this as 2/1 = 6/3. Both ratios equal the same thing."
            },
            {
              title: "The Cross-Multiply Trick",
              content: "To solve any proportion, cross-multiply. If a/b = c/d, then a×d = b×c. This is your secret weapon for these problems.",
              svg: `<svg width="280" height="140" viewBox="0 0 280 140">
                <style>
                  text { font-family: 'DM Sans', sans-serif; font-size: 18px; fill: #0a1628; }
                  .var { font-style: italic; font-weight: 600; }
                  .line { stroke: #0a1628; stroke-width: 2; }
                  .cross { stroke: #d4a853; stroke-width: 3; }
                  .label { font-size: 14px; fill: #666; }
                </style>
                <text x="40" y="35" class="var">a</text>
                <line x1="30" y1="45" x2="55" y2="45" class="line"/>
                <text x="40" y="70" class="var">b</text>
                <text x="80" y="52">=</text>
                <text x="120" y="35" class="var">c</text>
                <line x1="110" y1="45" x2="135" y2="45" class="line"/>
                <text x="120" y="70" class="var">d</text>
                <line x1="35" y1="85" x2="130" y2="130" class="cross"/>
                <line x1="35" y1="130" x2="130" y2="85" class="cross"/>
                <text x="180" y="100" class="var">a</text>
                <text x="195" y="100">×</text>
                <text x="210" y="100" class="var">d</text>
                <text x="230" y="100">=</text>
                <text x="245" y="100" class="var">b</text>
                <text x="260" y="100">×</text>
                <text x="275" y="100" class="var">c</text>
              </svg>`
            }
          ],

          examples: [
            {
              problem: "If 4 tickets cost $30, how much do 10 tickets cost?",
              steps: [
                "Set up the proportion: 4 tickets/$30 = 10 tickets/$x",
                "Write as fractions: 4/30 = 10/x",
                "Cross-multiply: 4 × x = 30 × 10",
                "Solve: 4x = 300, so x = 75",
                "Answer: $75"
              ],
              tip: "Always put the same units in the same position (tickets on top, dollars on bottom)."
            },
            {
              problem: "A map scale shows 1 inch = 50 miles. If two cities are 3.5 inches apart on the map, what's the actual distance?",
              steps: [
                "Set up: 1 inch/50 miles = 3.5 inches/x miles",
                "Cross-multiply: 1 × x = 50 × 3.5",
                "Solve: x = 175 miles"
              ],
              tip: "Map and scale problems are just proportions in disguise."
            }
          ],

          summary: "For any ratio problem: (1) Set up the proportion with matching units, (2) Cross-multiply, (3) Solve for x, (4) Check if your answer makes sense."
        },

        questions: [
          {
            id: "AR1-001",
            text: "If a car travels 180 miles on 6 gallons of gas, how many miles can it travel on 10 gallons?",
            options: [
              { text: "240 miles", explanation: "This assumes 24 mpg, but 180÷6 = 30 mpg." },
              { text: "270 miles", explanation: "This assumes 27 mpg, but 180÷6 = 30 mpg." },
              { text: "300 miles", explanation: "Correct! 180÷6 = 30 mpg. 30 × 10 = 300 miles.", correct: true },
              { text: "360 miles", explanation: "This assumes 36 mpg, but 180÷6 = 30 mpg." }
            ]
          },
          {
            id: "AR1-002",
            text: "A recipe calls for 2 cups of flour for every 3 cups of sugar. If you use 9 cups of sugar, how much flour do you need?",
            options: [
              { text: "4 cups", explanation: "Let's check: 2/3 ≠ 4/9. Cross-multiply: 2×9 = 18, but 3×4 = 12. Not equal." },
              { text: "5 cups", explanation: "Let's check: 2/3 ≠ 5/9. Cross-multiply: 2×9 = 18, but 3×5 = 15. Not equal." },
              { text: "6 cups", explanation: "Correct! 2/3 = 6/9. Cross-multiply: 2×9 = 18 and 3×6 = 18. Equal!", correct: true },
              { text: "8 cups", explanation: "Let's check: 2/3 ≠ 8/9. Cross-multiply: 2×9 = 18, but 3×8 = 24. Not equal." }
            ]
          },
          {
            id: "AR1-003",
            text: "If 5 workers can build a fence in 8 days, how many days would it take 10 workers?",
            options: [
              { text: "4 days", explanation: "Correct! Double the workers = half the time. 5×8 = 10×4 = 40 worker-days.", correct: true },
              { text: "8 days", explanation: "This assumes the same time regardless of workers. More workers = less time." },
              { text: "16 days", explanation: "More workers should mean LESS time, not more." },
              { text: "2 days", explanation: "This would require 20 workers worth of work (10×2=20), but we only need 40 worker-days." }
            ]
          },
          {
            id: "AR1-004",
            text: "A map has a scale of 1 inch = 25 miles. If two cities are 175 miles apart, how far apart are they on the map?",
            options: [
              { text: "5 inches", explanation: "5 × 25 = 125 miles, not 175." },
              { text: "6 inches", explanation: "6 × 25 = 150 miles, not 175." },
              { text: "7 inches", explanation: "Correct! 7 × 25 = 175 miles.", correct: true },
              { text: "8 inches", explanation: "8 × 25 = 200 miles, not 175." }
            ]
          },
          {
            id: "AR1-005",
            text: "If 3 pounds of apples cost $4.50, how much do 7 pounds cost?",
            options: [
              { text: "$9.00", explanation: "This is only 6 pounds worth ($1.50 × 6)." },
              { text: "$10.50", explanation: "Correct! $4.50÷3 = $1.50 per pound. $1.50 × 7 = $10.50.", correct: true },
              { text: "$12.00", explanation: "This would be $1.71 per pound, but actual price is $1.50." },
              { text: "$7.50", explanation: "This is only 5 pounds worth ($1.50 × 5)." }
            ]
          },
          {
            id: "AR1-006",
            text: "A mixture contains water and juice in a ratio of 4:1. If you have 20 cups total, how many cups are juice?",
            options: [
              { text: "2 cups", explanation: "This would give ratio 18:2 = 9:1, not 4:1." },
              { text: "4 cups", explanation: "Correct! 4:1 means 5 total parts. 20÷5 = 4 cups per part. Juice = 1 part = 4 cups.", correct: true },
              { text: "5 cups", explanation: "This gives ratio 15:5 = 3:1, not 4:1." },
              { text: "10 cups", explanation: "This gives ratio 10:10 = 1:1, not 4:1." }
            ]
          },
          {
            id: "AR1-007",
            text: "If 8 men can dig a ditch in 6 hours, how long would it take 12 men?",
            options: [
              { text: "3 hours", explanation: "This would require 36 man-hours (12×3), but we need 48 man-hours." },
              { text: "4 hours", explanation: "Correct! Total work = 8×6 = 48 man-hours. 48÷12 = 4 hours.", correct: true },
              { text: "9 hours", explanation: "More workers means LESS time, not more." },
              { text: "6 hours", explanation: "This ignores that more workers = faster work." }
            ]
          },
          {
            id: "AR1-008",
            text: "A car's gas tank holds 15 gallons. If the car gets 28 miles per gallon, how far can it go on a full tank?",
            options: [
              { text: "380 miles", explanation: "This would be about 25 mpg (380÷15)." },
              { text: "400 miles", explanation: "This would be about 27 mpg (400÷15)." },
              { text: "420 miles", explanation: "Correct! 15 gallons × 28 mpg = 420 miles.", correct: true },
              { text: "450 miles", explanation: "This would be 30 mpg (450÷15)." }
            ]
          },
          {
            id: "AR1-009",
            text: "In a class, the ratio of boys to girls is 3:5. If there are 15 boys, how many girls are there?",
            options: [
              { text: "20 girls", explanation: "Let's check: 15/20 = 3/4, not 3/5." },
              { text: "25 girls", explanation: "Correct! 3:5 = 15:x. Cross-multiply: 3x = 75, x = 25.", correct: true },
              { text: "30 girls", explanation: "Let's check: 15/30 = 1/2, not 3/5." },
              { text: "18 girls", explanation: "Let's check: 15/18 = 5/6, not 3/5." }
            ]
          },
          {
            id: "AR1-010",
            text: "A printer prints 240 pages in 4 minutes. How many pages can it print in 7 minutes?",
            options: [
              { text: "360 pages", explanation: "This is only 6 minutes worth (60 × 6)." },
              { text: "400 pages", explanation: "This would be about 57 pages per minute, but actual rate is 60." },
              { text: "420 pages", explanation: "Correct! 240÷4 = 60 pages/min. 60 × 7 = 420.", correct: true },
              { text: "480 pages", explanation: "This is 8 minutes worth (60 × 8)." }
            ]
          },
          {
            id: "AR1-011",
            text: "If 6 oranges cost $2, how many oranges can you buy for $5?",
            options: [
              { text: "12 oranges", explanation: "12 oranges would cost $4 (12 × $0.33)." },
              { text: "15 oranges", explanation: "Correct! Each orange costs $2÷6 = $0.33. $5÷$0.33 = 15.", correct: true },
              { text: "18 oranges", explanation: "18 oranges would cost $6 (18 × $0.33)." },
              { text: "10 oranges", explanation: "10 oranges would cost $3.33 (10 × $0.33)." }
            ]
          },
          {
            id: "AR1-012",
            text: "A photograph is 4 inches by 6 inches. If it's enlarged so the shorter side is 10 inches, what is the longer side?",
            options: [
              { text: "12 inches", explanation: "This keeps the 4:6 ratio with 8 inches, not 10." },
              { text: "15 inches", explanation: "Correct! 4:6 = 10:x. 4x = 60, x = 15.", correct: true },
              { text: "16 inches", explanation: "16/10 = 1.6, but 6/4 = 1.5. Ratio doesn't match." },
              { text: "20 inches", explanation: "20/10 = 2, but 6/4 = 1.5. Ratio doesn't match." }
            ]
          },
          {
            id: "AR1-013",
            text: "If 2 gallons of paint cover 700 square feet, how much paint is needed to cover 2,100 square feet?",
            options: [
              { text: "4 gallons", explanation: "4 gallons covers 1,400 sq ft (700 × 2)." },
              { text: "5 gallons", explanation: "5 gallons covers 1,750 sq ft (350 × 5)." },
              { text: "6 gallons", explanation: "Correct! 2,100 ÷ 700 = 3. So 2 × 3 = 6 gallons.", correct: true },
              { text: "7 gallons", explanation: "7 gallons covers 2,450 sq ft (350 × 7)." }
            ]
          },
          {
            id: "AR1-014",
            text: "A train travels 270 miles in 3 hours. At this rate, how far will it travel in 5 hours?",
            options: [
              { text: "400 miles", explanation: "This assumes 80 mph, but actual speed is 90 mph." },
              { text: "450 miles", explanation: "Correct! 270÷3 = 90 mph. 90 × 5 = 450 miles.", correct: true },
              { text: "500 miles", explanation: "This assumes 100 mph, but actual speed is 90 mph." },
              { text: "350 miles", explanation: "This assumes 70 mph, but actual speed is 90 mph." }
            ]
          },
          {
            id: "AR1-015",
            text: "Bronze is made of copper and tin in a ratio of 19:1. How much copper is needed to make 100 pounds of bronze?",
            options: [
              { text: "90 pounds", explanation: "This would mean 10 pounds tin, giving ratio 9:1." },
              { text: "95 pounds", explanation: "Correct! 19:1 = 20 total parts. 100÷20 = 5 lb per part. Copper = 19×5 = 95 lb.", correct: true },
              { text: "80 pounds", explanation: "This would mean 20 pounds tin, giving ratio 4:1." },
              { text: "99 pounds", explanation: "This would mean 1 pound tin, giving ratio 99:1." }
            ]
          }
        ],

        quizConfig: {
          questionsPerQuiz: 6,
          passingScore: 0.8
        }
      },

      // --------------------------------------------
      // CHAPTER 2: PERCENTAGES
      // --------------------------------------------
      {
        id: "AR-2",
        title: "Percentages",
        description: "Master discounts, tax, tips, interest, and percent change",

        lesson: {
          intro: "Percentages are everywhere — shopping, banking, test scores. Once you understand that 'percent' just means 'per 100,' these problems become simple.",

          concepts: [
            {
              title: "What is a Percent?",
              content: "Percent means 'per 100.' So 25% means 25 out of 100, or 25/100, or 0.25. To convert a percent to a decimal, just move the decimal point 2 places left: 25% → 0.25"
            },
            {
              title: "Finding a Percent OF Something",
              content: "To find X% of a number, multiply by the decimal. What is 20% of 80? → 80 × 0.20 = 16"
            },
            {
              title: "Percent Increase/Decrease",
              content: "For a 20% increase, multiply by 1.20. For a 20% decrease, multiply by 0.80. This is faster than calculating the change and adding/subtracting."
            },
            {
              title: "Finding the Original (Working Backwards)",
              content: "If a price AFTER a 20% increase is $60, the original is $60 ÷ 1.20 = $50. Don't just subtract 20% — that gives the wrong answer!"
            }
          ],

          examples: [
            {
              problem: "A $120 jacket is on sale for 25% off. What's the sale price?",
              steps: [
                "25% off means you pay 75% (100% - 25% = 75%)",
                "Convert: 75% = 0.75",
                "Multiply: $120 × 0.75 = $90",
                "Answer: $90"
              ],
              tip: "Shortcut: For X% off, multiply by (1 - X/100)"
            },
            {
              problem: "After a 15% raise, Tom earns $46,000. What was his original salary?",
              steps: [
                "After 15% increase, he has 115% of original",
                "$46,000 = 1.15 × original",
                "Original = $46,000 ÷ 1.15 = $40,000"
              ],
              tip: "WARNING: Don't just subtract 15% from $46,000. That gives $39,100, which is wrong!"
            }
          ],

          summary: "Key formulas: Part = Whole × (Percent/100). For increase: New = Original × (1 + rate). For decrease: New = Original × (1 - rate). To find original: Original = New ÷ (1 ± rate)."
        },

        questions: [
          {
            id: "AR2-001",
            text: "What is 15% of 80?",
            options: [
              { text: "8", explanation: "This is 10% of 80, not 15%." },
              { text: "12", explanation: "Correct! 80 × 0.15 = 12.", correct: true },
              { text: "15", explanation: "You found 15% of 100, not 80." },
              { text: "16", explanation: "This is 20% of 80, not 15%." }
            ]
          },
          {
            id: "AR2-002",
            text: "A $50 shirt is on sale for 20% off. What is the sale price?",
            options: [
              { text: "$30", explanation: "This would be 40% off, not 20% off." },
              { text: "$35", explanation: "This would be 30% off, not 20% off." },
              { text: "$40", explanation: "Correct! 20% of $50 = $10 off. $50 - $10 = $40.", correct: true },
              { text: "$45", explanation: "This would be only 10% off, not 20% off." }
            ]
          },
          {
            id: "AR2-003",
            text: "A restaurant bill is $45. If you leave a 20% tip, what is the total amount you pay?",
            options: [
              { text: "$49", explanation: "This is only about 9% tip ($4 on $45)." },
              { text: "$52", explanation: "This is about 16% tip ($7 on $45)." },
              { text: "$54", explanation: "Correct! 20% of $45 = $9. $45 + $9 = $54.", correct: true },
              { text: "$56", explanation: "This is about 24% tip ($11 on $45)." }
            ]
          },
          {
            id: "AR2-004",
            text: "A TV originally costs $400. It's marked down 30%. What's the new price?",
            options: [
              { text: "$120", explanation: "This IS the discount amount, not the final price." },
              { text: "$280", explanation: "Correct! 30% of $400 = $120 off. $400 - $120 = $280.", correct: true },
              { text: "$300", explanation: "This would be 25% off, not 30% off." },
              { text: "$370", explanation: "This would be only 7.5% off, not 30% off." }
            ]
          },
          {
            id: "AR2-005",
            text: "After a 25% raise, Maria earns $50,000. What was her salary before the raise?",
            options: [
              { text: "$37,500", explanation: "This is 25% less than $50,000, but that's not how raises work. After +25%, you have 125%." },
              { text: "$40,000", explanation: "Correct! $50,000 ÷ 1.25 = $40,000. Check: $40,000 × 1.25 = $50,000 ✓", correct: true },
              { text: "$42,500", explanation: "$42,500 × 1.25 = $53,125, not $50,000." },
              { text: "$45,000", explanation: "$45,000 × 1.25 = $56,250, not $50,000." }
            ]
          },
          {
            id: "AR2-006",
            text: "A coat is $80 after a 20% discount. What was the original price?",
            options: [
              { text: "$96", explanation: "$96 × 0.80 = $76.80, not $80." },
              { text: "$100", explanation: "Correct! $80 is 80% of original. $80 ÷ 0.80 = $100.", correct: true },
              { text: "$104", explanation: "$104 × 0.80 = $83.20, not $80." },
              { text: "$90", explanation: "$90 × 0.80 = $72, not $80." }
            ]
          },
          {
            id: "AR2-007",
            text: "You deposit $1,000 at 5% simple interest for 3 years. How much interest do you earn?",
            options: [
              { text: "$50", explanation: "This is only 1 year of interest." },
              { text: "$100", explanation: "This is 2 years of interest." },
              { text: "$150", explanation: "Correct! Simple interest = $1,000 × 0.05 × 3 = $150.", correct: true },
              { text: "$157.63", explanation: "This would be compound interest, not simple interest." }
            ]
          },
          {
            id: "AR2-008",
            text: "A shirt costs $60 before tax. If sales tax is 8%, what's the total price?",
            options: [
              { text: "$64.00", explanation: "This is only about 6.7% tax ($4 on $60)." },
              { text: "$64.80", explanation: "Correct! 8% of $60 = $4.80. $60 + $4.80 = $64.80.", correct: true },
              { text: "$68.00", explanation: "This is about 13.3% tax ($8 on $60)." },
              { text: "$65.60", explanation: "This is about 9.3% tax ($5.60 on $60)." }
            ]
          },
          {
            id: "AR2-009",
            text: "A population increased from 200,000 to 250,000. What was the percent increase?",
            options: [
              { text: "20%", explanation: "20% of 200,000 is 40,000, giving 240,000." },
              { text: "25%", explanation: "Correct! Increase = 50,000. 50,000 ÷ 200,000 = 0.25 = 25%.", correct: true },
              { text: "50%", explanation: "50% of 200,000 is 100,000, giving 300,000." },
              { text: "80%", explanation: "This confuses 250/200 = 1.25 with 125%. The increase is 25%, not 80%." }
            ]
          },
          {
            id: "AR2-010",
            text: "A stock dropped from $80 to $60. What was the percent decrease?",
            options: [
              { text: "20%", explanation: "20% of $80 is $16, giving $64, not $60." },
              { text: "25%", explanation: "Correct! Drop = $20. $20 ÷ $80 = 0.25 = 25%.", correct: true },
              { text: "33%", explanation: "This calculates $20/$60, but you need to divide by the ORIGINAL amount." },
              { text: "75%", explanation: "75% of $80 is $60, but that's what REMAINS, not the decrease." }
            ]
          },
          {
            id: "AR2-011",
            text: "A $70 item has a 15% off coupon. Then you pay 6% sales tax. What's the final price?",
            options: [
              { text: "$59.50", explanation: "This is the price after discount but before tax." },
              { text: "$63.07", explanation: "Correct! $70 × 0.85 = $59.50. Then $59.50 × 1.06 = $63.07.", correct: true },
              { text: "$65.17", explanation: "This adds tax before applying the discount (wrong order)." },
              { text: "$60.83", explanation: "This calculation has an error. $59.50 × 1.06 = $63.07." }
            ]
          },
          {
            id: "AR2-012",
            text: "If 40% of a number is 28, what is the number?",
            options: [
              { text: "11.2", explanation: "This is 40% of 28, not the number that 28 is 40% of." },
              { text: "56", explanation: "40% of 56 = 22.4, not 28." },
              { text: "70", explanation: "Correct! 28 ÷ 0.40 = 70. Check: 70 × 0.40 = 28 ✓", correct: true },
              { text: "68", explanation: "40% of 68 = 27.2, not 28." }
            ]
          },
          {
            id: "AR2-013",
            text: "A car's value depreciated by 15% to $17,000. What was the original value?",
            options: [
              { text: "$19,550", explanation: "$19,550 × 0.85 = $16,617.50, not $17,000." },
              { text: "$20,000", explanation: "Correct! $17,000 ÷ 0.85 = $20,000. Check: $20,000 × 0.85 = $17,000 ✓", correct: true },
              { text: "$18,700", explanation: "$18,700 × 0.85 = $15,895, not $17,000." },
              { text: "$21,250", explanation: "$21,250 × 0.85 = $18,062.50, not $17,000." }
            ]
          },
          {
            id: "AR2-014",
            text: "In a class of 30 students, 60% are female. How many males are in the class?",
            options: [
              { text: "10", explanation: "This would mean 20 females, which is 66.7%, not 60%." },
              { text: "12", explanation: "Correct! 60% female means 40% male. 30 × 0.40 = 12.", correct: true },
              { text: "15", explanation: "This is 50% of the class, but males are only 40%." },
              { text: "18", explanation: "This is 60% — that's the number of females, not males." }
            ]
          },
          {
            id: "AR2-015",
            text: "A salesperson earns a 6% commission. How much does she earn on $8,500 in sales?",
            options: [
              { text: "$425", explanation: "This is 5% commission, not 6%." },
              { text: "$510", explanation: "Correct! $8,500 × 0.06 = $510.", correct: true },
              { text: "$595", explanation: "This is 7% commission, not 6%." },
              { text: "$680", explanation: "This is 8% commission, not 6%." }
            ]
          },
          {
            id: "AR2-016",
            text: "A price increased by 10% and then decreased by 10%. The final price is:",
            options: [
              { text: "The same as the original", explanation: "This is a common mistake! 110% × 90% = 99%, not 100%." },
              { text: "1% less than the original", explanation: "Correct! 1.10 × 0.90 = 0.99 = 99% of original.", correct: true },
              { text: "1% more than the original", explanation: "The calculation is 1.10 × 0.90 = 0.99, which is less than 1." },
              { text: "10% less than the original", explanation: "The math is 1.10 × 0.90 = 0.99, only 1% less." }
            ]
          }
        ],

        quizConfig: {
          questionsPerQuiz: 6,
          passingScore: 0.8
        }
      },

      // --------------------------------------------
      // CHAPTER 3: DISTANCE, RATE, TIME
      // --------------------------------------------
      {
        id: "AR-3",
        title: "Distance, Rate & Time",
        description: "Master problems involving speed, distance, and travel time",

        lesson: {
          intro: "These problems appear constantly on the ASVAB. A car travels, a plane flies, someone walks — they all use one simple formula.",

          concepts: [
            {
              title: "The DRT Formula",
              content: "Distance = Rate × Time. That's it! If you know any two values, you can find the third. D = R×T, R = D÷T, T = D÷R."
            },
            {
              title: "Two Objects Moving",
              content: "If objects move TOWARD each other or AWAY from each other, ADD their speeds. If they move in the SAME direction, SUBTRACT their speeds."
            },
            {
              title: "Average Speed Trap",
              content: "Average speed is NOT the average of two speeds! It's always Total Distance ÷ Total Time. This is a common ASVAB trick."
            }
          ],

          examples: [
            {
              problem: "Two cars leave the same point traveling in opposite directions, one at 50 mph and one at 70 mph. After how many hours are they 360 miles apart?",
              steps: [
                "They're moving apart, so ADD speeds: 50 + 70 = 120 mph",
                "Use D = R × T, solving for T: 360 = 120 × T",
                "T = 360 ÷ 120 = 3 hours"
              ],
              tip: "Think of it as the gap between them growing at 120 mph."
            },
            {
              problem: "A hiker walks 10 miles at 2 mph, then 10 miles at 5 mph. What's the average speed for the whole trip?",
              steps: [
                "Time for first 10 miles: 10 ÷ 2 = 5 hours",
                "Time for second 10 miles: 10 ÷ 5 = 2 hours",
                "Total: 20 miles in 7 hours",
                "Average speed = 20 ÷ 7 ≈ 2.86 mph"
              ],
              tip: "NOT (2+5)÷2 = 3.5 mph! That's wrong. Use Total Distance ÷ Total Time."
            }
          ],

          summary: "D = R × T (memorize this!). Add speeds when moving apart; subtract when moving same direction. Average speed = Total Distance ÷ Total Time."
        },

        questions: [
          {
            id: "AR3-001",
            text: "A car travels 240 miles in 4 hours. What is its average speed?",
            options: [
              { text: "50 mph", explanation: "50 × 4 = 200 miles, not 240." },
              { text: "55 mph", explanation: "55 × 4 = 220 miles, not 240." },
              { text: "60 mph", explanation: "Correct! Speed = Distance ÷ Time = 240 ÷ 4 = 60 mph.", correct: true },
              { text: "65 mph", explanation: "65 × 4 = 260 miles, not 240." }
            ]
          },
          {
            id: "AR3-002",
            text: "How long does it take to drive 180 miles at 45 mph?",
            options: [
              { text: "3 hours", explanation: "3 × 45 = 135 miles, not 180." },
              { text: "4 hours", explanation: "Correct! Time = Distance ÷ Rate = 180 ÷ 45 = 4 hours.", correct: true },
              { text: "5 hours", explanation: "5 × 45 = 225 miles, not 180." },
              { text: "4.5 hours", explanation: "4.5 × 45 = 202.5 miles, not 180." }
            ]
          },
          {
            id: "AR3-003",
            text: "A plane flies at 500 mph for 3.5 hours. How far does it travel?",
            options: [
              { text: "1,500 miles", explanation: "This is 3 hours at 500 mph." },
              { text: "1,650 miles", explanation: "This is 3.3 hours at 500 mph." },
              { text: "1,750 miles", explanation: "Correct! D = 500 × 3.5 = 1,750 miles.", correct: true },
              { text: "1,850 miles", explanation: "This is 3.7 hours at 500 mph." }
            ]
          },
          {
            id: "AR3-004",
            text: "Two cars start from the same point, traveling in opposite directions at 40 mph and 60 mph. How far apart are they after 2 hours?",
            options: [
              { text: "120 miles", explanation: "This is only one car's distance (60 × 2)." },
              { text: "160 miles", explanation: "This calculation has an error." },
              { text: "200 miles", explanation: "Correct! Combined speed = 40 + 60 = 100 mph. Distance = 100 × 2 = 200 miles.", correct: true },
              { text: "80 miles", explanation: "This is only one car's distance (40 × 2)." }
            ]
          },
          {
            id: "AR3-005",
            text: "A bus leaves at 8:00 AM traveling at 50 mph. A car leaves at 10:00 AM traveling at 70 mph on the same route. At what time does the car catch up?",
            options: [
              { text: "12:00 PM", explanation: "By noon, bus traveled 4hrs × 50 = 200mi. Car traveled 2hrs × 70 = 140mi. Not caught up." },
              { text: "1:00 PM", explanation: "By 1pm, bus traveled 5hrs × 50 = 250mi. Car traveled 3hrs × 70 = 210mi. Not caught up." },
              { text: "3:00 PM", explanation: "Correct! Bus: 7hrs × 50 = 350mi. Car: 5hrs × 70 = 350mi. They meet!", correct: true },
              { text: "2:00 PM", explanation: "By 2pm, bus traveled 6hrs × 50 = 300mi. Car traveled 4hrs × 70 = 280mi. Not caught up." }
            ]
          },
          {
            id: "AR3-006",
            text: "A cyclist rides 30 miles in 2 hours. At this rate, how long will it take to ride 45 miles?",
            options: [
              { text: "2.5 hours", explanation: "2.5 × 15 = 37.5 miles, not 45." },
              { text: "3 hours", explanation: "Correct! Rate = 30÷2 = 15 mph. Time = 45÷15 = 3 hours.", correct: true },
              { text: "3.5 hours", explanation: "3.5 × 15 = 52.5 miles, not 45." },
              { text: "4 hours", explanation: "4 × 15 = 60 miles, not 45." }
            ]
          },
          {
            id: "AR3-007",
            text: "A train travels 90 miles at 60 mph, then 60 miles at 30 mph. What is the average speed for the whole trip?",
            options: [
              { text: "45 mph", explanation: "This is (60+30)÷2, but average speed doesn't work that way!", correct: true },
              { text: "50 mph", explanation: "Let's check: Time1 = 90÷60 = 1.5hrs. Time2 = 60÷30 = 2hrs. Total: 150mi in 3.5hrs = 42.9mph." },
              { text: "42.9 mph", explanation: "Correct! Total distance = 150mi. Total time = 1.5 + 2 = 3.5hrs. 150÷3.5 ≈ 42.9mph.", correct: true },
              { text: "55 mph", explanation: "Average speed = Total Distance ÷ Total Time, not the average of speeds." }
            ]
          },
          {
            id: "AR3-008",
            text: "Walking at 3 mph, how long does it take to walk 2 miles?",
            options: [
              { text: "30 minutes", explanation: "30 min = 0.5 hr. 0.5 × 3 = 1.5 miles, not 2." },
              { text: "40 minutes", explanation: "Correct! T = 2÷3 = 0.667 hrs = 40 minutes.", correct: true },
              { text: "45 minutes", explanation: "45 min = 0.75 hr. 0.75 × 3 = 2.25 miles, not 2." },
              { text: "1 hour", explanation: "1 hour at 3 mph = 3 miles, not 2." }
            ]
          },
          {
            id: "AR3-009",
            text: "Two trains are 400 miles apart and travel toward each other at 60 mph and 40 mph. How long until they meet?",
            options: [
              { text: "3 hours", explanation: "In 3hrs, they close 100mph × 3 = 300mi, not 400mi." },
              { text: "4 hours", explanation: "Correct! Combined closing speed = 60+40 = 100mph. Time = 400÷100 = 4hrs.", correct: true },
              { text: "5 hours", explanation: "In 5hrs, they close 100mph × 5 = 500mi, more than needed." },
              { text: "6 hours", explanation: "This is much too long. They're closing at 100 mph." }
            ]
          },
          {
            id: "AR3-010",
            text: "A runner completes a 10K (6.2 miles) in 50 minutes. What is her speed in mph?",
            options: [
              { text: "6.2 mph", explanation: "This would mean she ran for exactly 1 hour, but she ran for 50 min." },
              { text: "7.44 mph", explanation: "Correct! 50 min = 5/6 hr. Speed = 6.2 ÷ (5/6) = 6.2 × 6/5 = 7.44 mph.", correct: true },
              { text: "8.0 mph", explanation: "At 8 mph for 50 min, she'd cover 8 × (50/60) = 6.67 miles." },
              { text: "6.8 mph", explanation: "At 6.8 mph for 50 min, she'd cover 6.8 × (50/60) = 5.67 miles." }
            ]
          },
          {
            id: "AR3-011",
            text: "A car gets 28 mpg. How many gallons are needed for a 350-mile trip?",
            options: [
              { text: "10 gallons", explanation: "10 × 28 = 280 miles, not enough." },
              { text: "12.5 gallons", explanation: "Correct! 350 ÷ 28 = 12.5 gallons.", correct: true },
              { text: "14 gallons", explanation: "14 × 28 = 392 miles, more than needed." },
              { text: "11 gallons", explanation: "11 × 28 = 308 miles, not enough." }
            ]
          },
          {
            id: "AR3-012",
            text: "A ship sails 120 miles downstream (with current) in 4 hours, and 120 miles upstream (against current) in 6 hours. What is the ship's speed in still water?",
            options: [
              { text: "20 mph", explanation: "This is the upstream speed, not the still water speed." },
              { text: "25 mph", explanation: "Correct! Downstream: 30mph, Upstream: 20mph. Still water = (30+20)÷2 = 25mph.", correct: true },
              { text: "30 mph", explanation: "This is the downstream speed, not the still water speed." },
              { text: "22 mph", explanation: "The still water speed is the average of downstream and upstream speeds." }
            ]
          },
          {
            id: "AR3-013",
            text: "If you drive 60 mph for 2 hours and 40 mph for 3 hours, what is your total distance?",
            options: [
              { text: "200 miles", explanation: "This is only the second part: 40 × 3 = 120, plus maybe rounding error." },
              { text: "220 miles", explanation: "This calculation has an error. First part = 120, second = 120." },
              { text: "240 miles", explanation: "Correct! (60 × 2) + (40 × 3) = 120 + 120 = 240 miles.", correct: true },
              { text: "250 miles", explanation: "This would require 10 more miles somewhere." }
            ]
          },
          {
            id: "AR3-014",
            text: "A flight departs at 9:00 AM and arrives at 1:30 PM after flying 1,800 miles. What was the plane's speed?",
            options: [
              { text: "350 mph", explanation: "350 × 4.5 = 1,575 miles, not 1,800." },
              { text: "400 mph", explanation: "Correct! Time = 4.5 hours. Speed = 1,800 ÷ 4.5 = 400 mph.", correct: true },
              { text: "450 mph", explanation: "450 × 4.5 = 2,025 miles, not 1,800." },
              { text: "375 mph", explanation: "375 × 4.5 = 1,687.5 miles, not 1,800." }
            ]
          },
          {
            id: "AR3-015",
            text: "Two cyclists start 100 miles apart and ride toward each other at 12 mph and 8 mph. How long until they meet?",
            options: [
              { text: "4 hours", explanation: "In 4hrs, they close 20mph × 4 = 80mi, not 100mi." },
              { text: "5 hours", explanation: "Correct! Combined speed = 12+8 = 20mph. Time = 100÷20 = 5hrs.", correct: true },
              { text: "6 hours", explanation: "In 6hrs, they close 20mph × 6 = 120mi, more than needed." },
              { text: "8 hours", explanation: "This is much too long at 20 mph closing speed." }
            ]
          }
        ],

        quizConfig: {
          questionsPerQuiz: 6,
          passingScore: 0.8
        }
      },

      // --------------------------------------------
      // CHAPTER 4: WORK PROBLEMS
      // --------------------------------------------
      {
        id: "AR-4",
        title: "Work Problems",
        description: "Solve problems where people or machines work together",

        lesson: {
          intro: "Work problems ask how long it takes multiple people (or machines) to complete a job together. The trick is to think about work RATES, not time.",

          concepts: [
            {
              title: "Work Rate",
              content: "If someone can do a job in 6 hours, their work rate is 1/6 of the job per hour. Always express rate as: 1 ÷ (time to complete whole job)."
            },
            {
              title: "Combining Work Rates",
              content: "When people work together, ADD their rates. If A does 1/6 per hour and B does 1/4 per hour, together they do 1/6 + 1/4 = 5/12 per hour."
            },
            {
              title: "Finding Total Time",
              content: "Once you have the combined rate, total time = 1 ÷ (combined rate). So if combined rate is 5/12 per hour, time = 1 ÷ (5/12) = 12/5 = 2.4 hours."
            }
          ],

          examples: [
            {
              problem: "Alex can paint a room in 6 hours. Beth can paint it in 4 hours. How long if they work together?",
              steps: [
                "Alex's rate: 1/6 room per hour",
                "Beth's rate: 1/4 room per hour",
                "Combined rate: 1/6 + 1/4 = 2/12 + 3/12 = 5/12 room per hour",
                "Time = 1 ÷ (5/12) = 12/5 = 2.4 hours"
              ],
              tip: "The answer must be less than either person's time alone!"
            }
          ],

          summary: "Work rate = 1/time. Add rates when working together. Total time = 1 ÷ combined rate. The combined time is always less than any individual time."
        },

        questions: [
          {
            id: "AR4-001",
            text: "Mike can mow a lawn in 3 hours. Tom can mow it in 6 hours. How long if they work together?",
            options: [
              { text: "2 hours", explanation: "Correct! Mike: 1/3, Tom: 1/6. Together: 1/3 + 1/6 = 1/2 lawn/hr. Time = 2 hrs.", correct: true },
              { text: "4.5 hours", explanation: "This is just the average of 3 and 6, but that's not how work rates combine." },
              { text: "3 hours", explanation: "Together they should be faster than Mike alone." },
              { text: "1.5 hours", explanation: "This would require a combined rate of 2/3, but it's only 1/2." }
            ]
          },
          {
            id: "AR4-002",
            text: "Pipe A fills a tank in 8 hours. Pipe B fills it in 4 hours. How long to fill it using both pipes?",
            options: [
              { text: "2 hours", explanation: "This would require rate of 1/2, but combined rate is 3/8." },
              { text: "2 hours 40 minutes", explanation: "Correct! A: 1/8, B: 1/4 = 2/8. Together: 3/8. Time = 8/3 = 2.67 hrs = 2h 40m.", correct: true },
              { text: "3 hours", explanation: "3 × (3/8) = 9/8 > 1, so it would be overfilled." },
              { text: "6 hours", explanation: "This is slower than Pipe B alone, which doesn't make sense." }
            ]
          },
          {
            id: "AR4-003",
            text: "Worker A completes a job in 10 hours. Worker B completes it in 15 hours. Working together, how long?",
            options: [
              { text: "5 hours", explanation: "5 × (1/6) = 5/6 < 1, not enough to finish." },
              { text: "6 hours", explanation: "Correct! A: 1/10, B: 1/15. Together: 3/30 + 2/30 = 5/30 = 1/6. Time = 6 hrs.", correct: true },
              { text: "12.5 hours", explanation: "This is the average, but combined work is faster." },
              { text: "8 hours", explanation: "8 × (1/6) = 8/6 > 1, more than needed." }
            ]
          },
          {
            id: "AR4-004",
            text: "A can do a job in 12 days, B in 6 days, C in 4 days. How long if all three work together?",
            options: [
              { text: "1 day", explanation: "1 × (1/2) = 1/2 < 1, not enough to finish." },
              { text: "2 days", explanation: "Correct! Rates: 1/12 + 1/6 + 1/4 = 1/12 + 2/12 + 3/12 = 6/12 = 1/2. Time = 2 days.", correct: true },
              { text: "3 days", explanation: "3 × (1/2) = 3/2 > 1, more than needed." },
              { text: "4 days", explanation: "This equals C's time alone, but all three together is faster." }
            ]
          },
          {
            id: "AR4-005",
            text: "Two machines together complete a job in 3 hours. Machine A alone takes 5 hours. How long for Machine B alone?",
            options: [
              { text: "6 hours", explanation: "B's rate would be 1/6. Together: 1/5 + 1/6 = 11/30 ≠ 1/3." },
              { text: "7.5 hours", explanation: "Correct! Combined: 1/3. A: 1/5. B: 1/3 - 1/5 = 5/15 - 3/15 = 2/15. B alone = 15/2 = 7.5 hrs.", correct: true },
              { text: "8 hours", explanation: "B's rate would be 1/8. Together: 1/5 + 1/8 = 13/40 ≠ 1/3." },
              { text: "4 hours", explanation: "B's rate would be 1/4. Together: 1/5 + 1/4 = 9/20 ≠ 1/3." }
            ]
          },
          {
            id: "AR4-006",
            text: "A pipe fills a pool in 6 hours. A drain empties it in 10 hours. If both are open, how long to fill the pool?",
            options: [
              { text: "8 hours", explanation: "Net rate is positive, so it fills faster than 8 hours." },
              { text: "15 hours", explanation: "Correct! Fill rate 1/6, drain rate 1/10. Net: 1/6 - 1/10 = 5/30 - 3/30 = 2/30 = 1/15. Time = 15 hrs.", correct: true },
              { text: "4 hours", explanation: "This ignores that the drain is removing water." },
              { text: "16 hours", explanation: "Net rate is 1/15, so time is exactly 15 hours." }
            ]
          },
          {
            id: "AR4-007",
            text: "5 workers can build a wall in 12 days. How many days for 10 workers?",
            options: [
              { text: "4 days", explanation: "This assumes 3× workers, but we only have 2×." },
              { text: "6 days", explanation: "Correct! Double the workers = half the time. 12 ÷ 2 = 6 days.", correct: true },
              { text: "8 days", explanation: "10 workers is double 5 workers, so time should be halved." },
              { text: "24 days", explanation: "More workers means less time, not more." }
            ]
          },
          {
            id: "AR4-008",
            text: "Machine A makes 100 parts in 4 hours. Machine B makes 100 parts in 5 hours. How long for both to make 100 parts together?",
            options: [
              { text: "2 hours", explanation: "In 2 hrs, A makes 50 and B makes 40. Total = 90, not 100." },
              { text: "2 hours 13 min", explanation: "Correct! A: 25/hr, B: 20/hr. Together: 45/hr. Time = 100/45 = 2.22 hrs ≈ 2h 13m.", correct: true },
              { text: "4.5 hours", explanation: "This is the average, but together they're faster." },
              { text: "3 hours", explanation: "In 3 hrs together, they'd make 45 × 3 = 135 parts." }
            ]
          },
          {
            id: "AR4-009",
            text: "John can finish a project in 8 hours. After John works alone for 2 hours, Mary joins him and they finish together in 2 more hours. How long would Mary take alone?",
            options: [
              { text: "4 hours", explanation: "Correct! John did 2/8 alone + 2/8 with Mary = 4/8. Mary did 4/8 in 2 hrs, so 8 hrs for full job... wait, let me recalculate.", correct: false },
              { text: "6 hours", explanation: "John did 2/8 alone. Together 2 hrs finished 6/8. John's share: 2/8. Mary: 4/8 in 2 hrs = 1/4 rate. Full job = 4 hrs... checking.", correct: false },
              { text: "8 hours", explanation: "Correct! John alone: 2hrs = 2/8 = 1/4. Remaining: 3/4. Together in 2hrs: John adds 2/8 = 1/4, so Mary did 3/4 - 1/4 = 2/4 in 2 hrs. Rate = 1/4. Full job = 4 hrs. Let me recheck...", correct: false },
              { text: "4 hours", explanation: "Correct! John did 2/8 in first 2 hrs, 2/8 in next 2 hrs = 4/8. Mary did remaining 4/8 in 2 hrs, so her rate is 2/8 = 1/4/hr. Full job = 4 hrs.", correct: true }
            ]
          },
          {
            id: "AR4-010",
            text: "A job takes 6 workers 8 days. How many workers are needed to finish in 4 days?",
            options: [
              { text: "8 workers", explanation: "8 × 4 = 32 worker-days, but we need 48 worker-days." },
              { text: "10 workers", explanation: "10 × 4 = 40 worker-days, but we need 48 worker-days." },
              { text: "12 workers", explanation: "Correct! Total work = 6 × 8 = 48 worker-days. 48 ÷ 4 days = 12 workers.", correct: true },
              { text: "3 workers", explanation: "Fewer workers would take MORE time, not less." }
            ]
          }
        ],

        quizConfig: {
          questionsPerQuiz: 5,
          passingScore: 0.8
        }
      },

      // --------------------------------------------
      // CHAPTER 5: STATISTICS (Mean, Median, Mode)
      // --------------------------------------------
      {
        id: "AR-5",
        title: "Statistics Basics",
        description: "Calculate mean, median, mode, and solve average problems",

        lesson: {
          intro: "Statistics problems are straightforward once you know the definitions. These appear regularly on the ASVAB.",

          concepts: [
            {
              title: "Mean (Average)",
              content: "Add all values, then divide by how many there are. Mean of 3, 5, 7 = (3+5+7) ÷ 3 = 15 ÷ 3 = 5."
            },
            {
              title: "Median (Middle)",
              content: "Arrange values in order, then find the middle one. For 2, 5, 9, the median is 5. For even counts, average the two middle values."
            },
            {
              title: "Mode (Most Common)",
              content: "The value that appears most often. In 2, 3, 3, 5, 7, the mode is 3. There can be multiple modes or no mode."
            },
            {
              title: "Finding a Missing Value",
              content: "If you need a certain average, use: Sum = Average × Count. Then subtract the known values to find the missing one."
            }
          ],

          examples: [
            {
              problem: "A student scored 78, 82, 91, and 85 on four tests. What score is needed on the fifth test to achieve an 85 average?",
              steps: [
                "Target sum for 5 tests: 85 × 5 = 425",
                "Current sum: 78 + 82 + 91 + 85 = 336",
                "Needed score: 425 - 336 = 89"
              ],
              tip: "Use Sum = Average × Count to work backwards."
            }
          ],

          summary: "Mean = Sum ÷ Count. Median = middle value (arrange first!). Mode = most frequent. To find missing value: Sum needed - Sum known."
        },

        questions: [
          {
            id: "AR5-001",
            text: "Find the mean of: 12, 15, 18, 21, 24",
            options: [
              { text: "17", explanation: "Sum = 90. 90 ÷ 5 = 18, not 17." },
              { text: "18", explanation: "Correct! Sum = 12+15+18+21+24 = 90. Mean = 90 ÷ 5 = 18.", correct: true },
              { text: "19", explanation: "Sum = 90. 90 ÷ 5 = 18, not 19." },
              { text: "20", explanation: "Sum = 90. 90 ÷ 5 = 18, not 20." }
            ]
          },
          {
            id: "AR5-002",
            text: "Find the median of: 7, 3, 9, 1, 5",
            options: [
              { text: "3", explanation: "Ordered: 1, 3, 5, 7, 9. The middle value is 5, not 3." },
              { text: "5", explanation: "Correct! Ordered: 1, 3, 5, 7, 9. The middle (3rd) value is 5.", correct: true },
              { text: "7", explanation: "Ordered: 1, 3, 5, 7, 9. The middle value is 5, not 7." },
              { text: "9", explanation: "This is the largest value, not the middle." }
            ]
          },
          {
            id: "AR5-003",
            text: "Find the mode of: 4, 7, 2, 7, 9, 4, 7",
            options: [
              { text: "2", explanation: "2 appears only once. 7 appears three times." },
              { text: "4", explanation: "4 appears twice. 7 appears three times." },
              { text: "7", explanation: "Correct! 7 appears 3 times (more than any other value).", correct: true },
              { text: "9", explanation: "9 appears only once. 7 appears three times." }
            ]
          },
          {
            id: "AR5-004",
            text: "The average of 5 numbers is 20. What is their sum?",
            options: [
              { text: "25", explanation: "Sum = Average × Count = 20 × 5 = 100, not 25." },
              { text: "50", explanation: "Sum = Average × Count = 20 × 5 = 100, not 50." },
              { text: "100", explanation: "Correct! Sum = Average × Count = 20 × 5 = 100.", correct: true },
              { text: "4", explanation: "This is 20 ÷ 5, but we need 20 × 5." }
            ]
          },
          {
            id: "AR5-005",
            text: "A student has test scores of 88, 92, 76, and 84. What score is needed on the 5th test to have an 85 average?",
            options: [
              { text: "80", explanation: "Sum would be 340 + 80 = 420. Average = 420 ÷ 5 = 84, not 85." },
              { text: "85", explanation: "Correct! Need sum of 425 (85 × 5). Have 340. Need 425 - 340 = 85.", correct: true },
              { text: "90", explanation: "Sum would be 340 + 90 = 430. Average = 430 ÷ 5 = 86, not 85." },
              { text: "75", explanation: "Sum would be 340 + 75 = 415. Average = 415 ÷ 5 = 83, not 85." }
            ]
          },
          {
            id: "AR5-006",
            text: "Find the median of: 12, 8, 15, 6, 10, 14",
            options: [
              { text: "10", explanation: "Ordered: 6, 8, 10, 12, 14, 15. Middle two are 10 and 12. Median = 11." },
              { text: "11", explanation: "Correct! Ordered: 6, 8, 10, 12, 14, 15. Median = (10+12) ÷ 2 = 11.", correct: true },
              { text: "12", explanation: "For even count, average the two middle values: (10+12) ÷ 2 = 11." },
              { text: "10.5", explanation: "The middle values are 10 and 12, so median = (10+12) ÷ 2 = 11." }
            ]
          },
          {
            id: "AR5-007",
            text: "The average age of 4 people is 25. When a 5th person joins, the average becomes 30. How old is the 5th person?",
            options: [
              { text: "40", explanation: "New sum = 150. Old sum = 100. 5th person = 150 - 100 = 50, not 40." },
              { text: "45", explanation: "New sum = 150. Old sum = 100. 5th person = 150 - 100 = 50, not 45." },
              { text: "50", explanation: "Correct! Old sum = 25 × 4 = 100. New sum = 30 × 5 = 150. 5th = 150 - 100 = 50.", correct: true },
              { text: "55", explanation: "New sum = 150. Old sum = 100. 5th person = 150 - 100 = 50, not 55." }
            ]
          },
          {
            id: "AR5-008",
            text: "What is the range of: 14, 8, 22, 5, 17?",
            options: [
              { text: "13", explanation: "Range = Max - Min = 22 - 5 = 17, not 13." },
              { text: "14", explanation: "Range = Max - Min = 22 - 5 = 17, not 14." },
              { text: "17", explanation: "Correct! Range = Maximum - Minimum = 22 - 5 = 17.", correct: true },
              { text: "22", explanation: "This is the maximum, not the range." }
            ]
          },
          {
            id: "AR5-009",
            text: "The mean of 6, 10, and x is 12. Find x.",
            options: [
              { text: "16", explanation: "Sum would be 6 + 10 + 16 = 32. Mean = 32 ÷ 3 = 10.67, not 12." },
              { text: "18", explanation: "Sum would be 6 + 10 + 18 = 34. Mean = 34 ÷ 3 = 11.33, not 12." },
              { text: "20", explanation: "Correct! Sum needed = 12 × 3 = 36. x = 36 - 6 - 10 = 20.", correct: true },
              { text: "14", explanation: "Sum would be 6 + 10 + 14 = 30. Mean = 30 ÷ 3 = 10, not 12." }
            ]
          },
          {
            id: "AR5-010",
            text: "A basketball player scored 18, 24, 15, 22, and 31 points in 5 games. What was the average?",
            options: [
              { text: "20", explanation: "Sum = 110. 110 ÷ 5 = 22, not 20." },
              { text: "22", explanation: "Correct! Sum = 18+24+15+22+31 = 110. Average = 110 ÷ 5 = 22.", correct: true },
              { text: "24", explanation: "Sum = 110. 110 ÷ 5 = 22, not 24." },
              { text: "26", explanation: "Sum = 110. 110 ÷ 5 = 22, not 26." }
            ]
          }
        ],

        quizConfig: {
          questionsPerQuiz: 5,
          passingScore: 0.8
        }
      }
    ]
  },

  // ============================================
  // MATHEMATICS KNOWLEDGE
  // ============================================
  MK: {
    name: "Mathematics Knowledge",
    description: "Algebra and geometry concepts",
    icon: "🔢",
    chapters: [

      // --------------------------------------------
      // CHAPTER 1: SOLVING EQUATIONS
      // --------------------------------------------
      {
        id: "MK-1",
        title: "Solving Equations",
        description: "Master linear equations and multi-step problems",

        lesson: {
          intro: "Equations are like a balance scale. Whatever you do to one side, you MUST do to the other. Once you get this, algebra becomes straightforward.",

          concepts: [
            {
              title: "The Balance Rule",
              content: "An equation is balanced. To keep it balanced, any operation you do to the left side, you must do to the right side too. Add 5 to the left? Add 5 to the right."
            },
            {
              title: "Isolating the Variable",
              content: "Your goal is to get x (or whatever variable) alone on one side. Do this by 'undoing' operations in reverse order: first add/subtract, then multiply/divide."
            },
            {
              title: "Variables on Both Sides",
              content: "If x appears on both sides, first move all x terms to one side by adding or subtracting. Then solve as usual."
            }
          ],

          examples: [
            {
              problem: "Solve: 3x + 7 = 22",
              steps: [
                "Subtract 7 from both sides: 3x = 15",
                "Divide both sides by 3: x = 5",
                "Check: 3(5) + 7 = 15 + 7 = 22 ✓"
              ],
              tip: "Always check your answer by plugging it back in!"
            },
            {
              problem: "Solve: 5x - 8 = 2x + 7",
              steps: [
                "Subtract 2x from both sides: 3x - 8 = 7",
                "Add 8 to both sides: 3x = 15",
                "Divide by 3: x = 5"
              ],
              tip: "Move all x terms to the side with the larger coefficient."
            }
          ],

          summary: "To solve any equation: (1) Move variables to one side, (2) Move numbers to the other side, (3) Divide by the coefficient. Always check your answer."
        },

        questions: [
          {
            id: "MK1-001",
            text: "Solve: 2x + 5 = 17",
            options: [
              { text: "x = 6", explanation: "Correct! 2x = 12, so x = 6. Check: 2(6) + 5 = 17 ✓", correct: true },
              { text: "x = 7", explanation: "2(7) + 5 = 19, not 17." },
              { text: "x = 11", explanation: "You subtracted 5 but forgot to divide by 2." },
              { text: "x = 4", explanation: "2(4) + 5 = 13, not 17." }
            ]
          },
          {
            id: "MK1-002",
            text: "Solve: 4x - 9 = 15",
            options: [
              { text: "x = 6", explanation: "Correct! 4x = 24, so x = 6.", correct: true },
              { text: "x = 1.5", explanation: "You divided 15 - 9 by 4, but should add 9 first: 4x = 24." },
              { text: "x = 24", explanation: "You added 9 but forgot to divide by 4." },
              { text: "x = 4", explanation: "4(4) - 9 = 7, not 15." }
            ]
          },
          {
            id: "MK1-003",
            text: "Solve: 7x + 3 = 5x + 11",
            options: [
              { text: "x = 4", explanation: "Correct! 2x = 8, so x = 4.", correct: true },
              { text: "x = 7", explanation: "7(7) + 3 = 52, but 5(7) + 11 = 46. Not equal." },
              { text: "x = 2", explanation: "7(2) + 3 = 17, but 5(2) + 11 = 21. Not equal." },
              { text: "x = 8", explanation: "You found 2x = 8 but that means x = 4, not 8." }
            ]
          },
          {
            id: "MK1-004",
            text: "Solve: 3(x + 2) = 18",
            options: [
              { text: "x = 4", explanation: "Correct! x + 2 = 6, so x = 4.", correct: true },
              { text: "x = 6", explanation: "3(6 + 2) = 24, not 18." },
              { text: "x = 8", explanation: "You divided 18 by 3 but didn't subtract 2." },
              { text: "x = 5", explanation: "3(5 + 2) = 21, not 18." }
            ]
          },
          {
            id: "MK1-005",
            text: "Solve: x/4 + 3 = 7",
            options: [
              { text: "x = 16", explanation: "Correct! x/4 = 4, so x = 16.", correct: true },
              { text: "x = 1", explanation: "1/4 + 3 = 3.25, not 7." },
              { text: "x = 10", explanation: "10/4 + 3 = 5.5, not 7." },
              { text: "x = 28", explanation: "You multiplied 7 by 4, but should first subtract 3." }
            ]
          },
          {
            id: "MK1-006",
            text: "Solve: 6x - 4 = 2x + 12",
            options: [
              { text: "x = 4", explanation: "Correct! 4x = 16, so x = 4.", correct: true },
              { text: "x = 2", explanation: "6(2) - 4 = 8, but 2(2) + 12 = 16. Not equal." },
              { text: "x = 8", explanation: "6(8) - 4 = 44, but 2(8) + 12 = 28. Not equal." },
              { text: "x = 3", explanation: "6(3) - 4 = 14, but 2(3) + 12 = 18. Not equal." }
            ]
          },
          {
            id: "MK1-007",
            text: "Solve: 2(x - 3) = x + 4",
            options: [
              { text: "x = 10", explanation: "Correct! 2x - 6 = x + 4, so x = 10.", correct: true },
              { text: "x = 7", explanation: "2(7 - 3) = 8, but 7 + 4 = 11. Not equal." },
              { text: "x = 4", explanation: "2(4 - 3) = 2, but 4 + 4 = 8. Not equal." },
              { text: "x = 1", explanation: "2(1 - 3) = -4, but 1 + 4 = 5. Not equal." }
            ]
          },
          {
            id: "MK1-008",
            text: "Solve: 5x + 2 = 3x - 6",
            options: [
              { text: "x = -4", explanation: "Correct! 2x = -8, so x = -4.", correct: true },
              { text: "x = 4", explanation: "5(4) + 2 = 22, but 3(4) - 6 = 6. Not equal." },
              { text: "x = -2", explanation: "5(-2) + 2 = -8, but 3(-2) - 6 = -12. Not equal." },
              { text: "x = 2", explanation: "5(2) + 2 = 12, but 3(2) - 6 = 0. Not equal." }
            ]
          },
          {
            id: "MK1-009",
            text: "Solve: 8 - 2x = 14",
            options: [
              { text: "x = -3", explanation: "Correct! -2x = 6, so x = -3.", correct: true },
              { text: "x = 3", explanation: "8 - 2(3) = 2, not 14." },
              { text: "x = 11", explanation: "8 - 2(11) = -14, not 14." },
              { text: "x = -11", explanation: "8 - 2(-11) = 30, not 14." }
            ]
          },
          {
            id: "MK1-010",
            text: "Solve: (x + 5)/2 = 9",
            options: [
              { text: "x = 13", explanation: "Correct! x + 5 = 18, so x = 13.", correct: true },
              { text: "x = 7", explanation: "(7 + 5)/2 = 6, not 9." },
              { text: "x = 4", explanation: "(4 + 5)/2 = 4.5, not 9." },
              { text: "x = 18", explanation: "You found x + 5 = 18, but x = 13, not 18." }
            ]
          },
          {
            id: "MK1-011",
            text: "Solve: 4(2x + 1) = 28",
            options: [
              { text: "x = 3", explanation: "Correct! 2x + 1 = 7, then 2x = 6, so x = 3.", correct: true },
              { text: "x = 6", explanation: "4(2(6) + 1) = 52, not 28." },
              { text: "x = 7", explanation: "You found 2x + 1 = 7, but that means x = 3." },
              { text: "x = 3.5", explanation: "4(2(3.5) + 1) = 32, not 28." }
            ]
          },
          {
            id: "MK1-012",
            text: "Solve: 9x - 5 = 7x + 9",
            options: [
              { text: "x = 7", explanation: "Correct! 2x = 14, so x = 7.", correct: true },
              { text: "x = 2", explanation: "9(2) - 5 = 13, but 7(2) + 9 = 23. Not equal." },
              { text: "x = 14", explanation: "You found 2x = 14, but x = 7, not 14." },
              { text: "x = 4", explanation: "9(4) - 5 = 31, but 7(4) + 9 = 37. Not equal." }
            ]
          },
          {
            id: "MK1-013",
            text: "Solve: x/3 - 2 = 4",
            options: [
              { text: "x = 18", explanation: "Correct! x/3 = 6, so x = 18.", correct: true },
              { text: "x = 6", explanation: "6/3 - 2 = 0, not 4." },
              { text: "x = 2", explanation: "2/3 - 2 = -1.33, not 4." },
              { text: "x = 12", explanation: "12/3 - 2 = 2, not 4." }
            ]
          },
          {
            id: "MK1-014",
            text: "Solve: 3x + 4 = 4x - 5",
            options: [
              { text: "x = 9", explanation: "Correct! 4 + 5 = x, so x = 9.", correct: true },
              { text: "x = -9", explanation: "3(-9) + 4 = -23, but 4(-9) - 5 = -41. Not equal." },
              { text: "x = 1", explanation: "3(1) + 4 = 7, but 4(1) - 5 = -1. Not equal." },
              { text: "x = -1", explanation: "3(-1) + 4 = 1, but 4(-1) - 5 = -9. Not equal." }
            ]
          },
          {
            id: "MK1-015",
            text: "Solve: 2(3x - 1) = 4(x + 2)",
            options: [
              { text: "x = 5", explanation: "Correct! 6x - 2 = 4x + 8, so 2x = 10, x = 5.", correct: true },
              { text: "x = 3", explanation: "2(3(3) - 1) = 16, but 4(3 + 2) = 20. Not equal." },
              { text: "x = 10", explanation: "2(3(10) - 1) = 58, but 4(10 + 2) = 48. Not equal." },
              { text: "x = 2", explanation: "2(3(2) - 1) = 10, but 4(2 + 2) = 16. Not equal." }
            ]
          }
        ],

        quizConfig: {
          questionsPerQuiz: 6,
          passingScore: 0.8
        }
      },

      // --------------------------------------------
      // CHAPTER 2: EXPONENTS & RADICALS
      // --------------------------------------------
      {
        id: "MK-2",
        title: "Exponents & Radicals",
        description: "Master exponent rules and simplifying square roots",

        lesson: {
          intro: "Exponents are just shorthand for repeated multiplication. x³ means x × x × x. Once you learn the rules, these problems become quick wins.",

          concepts: [
            {
              title: "Multiplying Same Base = ADD Exponents",
              content: "x³ × x⁴ = x⁷. Why? Because (x·x·x) × (x·x·x·x) = x⁷. When multiplying same bases, add the exponents."
            },
            {
              title: "Dividing Same Base = SUBTRACT Exponents",
              content: "x⁸ ÷ x³ = x⁵. You're canceling out 3 of the x's from the 8, leaving 5."
            },
            {
              title: "Power of a Power = MULTIPLY Exponents",
              content: "(x³)² = x⁶. You're squaring x³, which means x³ × x³ = x⁶."
            },
            {
              title: "Special Cases",
              content: "x⁰ = 1 (anything to the zero power is 1). x⁻ⁿ = 1/xⁿ (negative exponent means reciprocal)."
            }
          ],

          examples: [
            {
              problem: "Simplify: x⁵ × x³",
              steps: [
                "Same base (x), so ADD exponents",
                "x⁵⁺³ = x⁸"
              ],
              tip: "ADD for multiplication, SUBTRACT for division."
            },
            {
              problem: "Simplify: (x⁴)³",
              steps: [
                "Power of a power: MULTIPLY exponents",
                "x⁴ˣ³ = x¹²"
              ],
              tip: "MULTIPLY when you have an exponent raised to another exponent."
            }
          ],

          summary: "Three rules: Multiply same base → ADD exponents. Divide same base → SUBTRACT. Power of power → MULTIPLY. x⁰ = 1."
        },

        questions: [
          {
            id: "MK2-001",
            text: "Simplify: x⁴ × x⁵",
            options: [
              { text: "x⁹", explanation: "Correct! Add exponents: 4 + 5 = 9.", correct: true },
              { text: "x²⁰", explanation: "You multiplied exponents, but multiplication means ADD: 4 + 5 = 9." },
              { text: "x¹", explanation: "You subtracted, but multiplication means ADD exponents." },
              { text: "2x⁹", explanation: "The coefficient stays 1, not 2. Just x⁹." }
            ]
          },
          {
            id: "MK2-002",
            text: "Simplify: x⁸ ÷ x³",
            options: [
              { text: "x⁵", explanation: "Correct! Subtract exponents: 8 - 3 = 5.", correct: true },
              { text: "x¹¹", explanation: "You added, but division means SUBTRACT exponents." },
              { text: "x²⁴", explanation: "You multiplied, but division means SUBTRACT." },
              { text: "x²·⁶⁷", explanation: "You divided 8 by 3, but should SUBTRACT: 8 - 3 = 5." }
            ]
          },
          {
            id: "MK2-003",
            text: "Simplify: (x³)⁴",
            options: [
              { text: "x¹²", explanation: "Correct! Power of power: MULTIPLY exponents: 3 × 4 = 12.", correct: true },
              { text: "x⁷", explanation: "You added, but power of power means MULTIPLY." },
              { text: "x⁸¹", explanation: "3⁴ = 81, but the exponent rule is 3 × 4 = 12." },
              { text: "x¹", explanation: "3 × 4 = 12, not 1." }
            ]
          },
          {
            id: "MK2-004",
            text: "Simplify: x⁰",
            options: [
              { text: "1", explanation: "Correct! Anything (except 0) to the zero power equals 1.", correct: true },
              { text: "0", explanation: "Common mistake! x⁰ = 1, not 0." },
              { text: "x", explanation: "x⁰ = 1, not x. x¹ = x." },
              { text: "undefined", explanation: "x⁰ is defined and equals 1." }
            ]
          },
          {
            id: "MK2-005",
            text: "Simplify: (x²)³ × x⁴",
            options: [
              { text: "x¹⁰", explanation: "Correct! (x²)³ = x⁶, then x⁶ × x⁴ = x¹⁰.", correct: true },
              { text: "x⁹", explanation: "2 × 3 = 6, then 6 + 4 = 10, not 9." },
              { text: "x²⁴", explanation: "You multiplied all three: 2 × 3 × 4 = 24. Wrong order of operations." },
              { text: "x⁶", explanation: "(x²)³ = x⁶, but then you need to multiply by x⁴: x⁶ × x⁴ = x¹⁰." }
            ]
          },
          {
            id: "MK2-006",
            text: "Simplify: x⁻²",
            options: [
              { text: "1/x²", explanation: "Correct! Negative exponent means reciprocal: x⁻² = 1/x².", correct: true },
              { text: "-x²", explanation: "Negative exponent doesn't make x negative. It means 1/x²." },
              { text: "x²", explanation: "The negative matters! x⁻² = 1/x²." },
              { text: "-2x", explanation: "The exponent stays an exponent. x⁻² = 1/x²." }
            ]
          },
          {
            id: "MK2-007",
            text: "Simplify: √36",
            options: [
              { text: "6", explanation: "Correct! 6 × 6 = 36, so √36 = 6.", correct: true },
              { text: "18", explanation: "18 is half of 36, not the square root. 6 × 6 = 36." },
              { text: "9", explanation: "9 × 9 = 81, not 36. 6 × 6 = 36." },
              { text: "4", explanation: "4 × 4 = 16, not 36. 6 × 6 = 36." }
            ]
          },
          {
            id: "MK2-008",
            text: "Simplify: √50",
            options: [
              { text: "5√2", explanation: "Correct! √50 = √(25 × 2) = √25 × √2 = 5√2.", correct: true },
              { text: "25", explanation: "√50 ≈ 7.07, not 25. Factor: √50 = 5√2." },
              { text: "10√5", explanation: "10√5 ≈ 22.4, but √50 ≈ 7.07. Factor: √50 = 5√2." },
              { text: "2√25", explanation: "2√25 = 2 × 5 = 10, but √50 ≈ 7.07. Should be 5√2." }
            ]
          },
          {
            id: "MK2-009",
            text: "Simplify: x⁶/x²",
            options: [
              { text: "x⁴", explanation: "Correct! 6 - 2 = 4.", correct: true },
              { text: "x³", explanation: "6 ÷ 2 = 3, but division of exponents means SUBTRACT: 6 - 2 = 4." },
              { text: "x⁸", explanation: "You added, but division means SUBTRACT." },
              { text: "x¹²", explanation: "You multiplied, but division means SUBTRACT." }
            ]
          },
          {
            id: "MK2-010",
            text: "Simplify: (2x³)²",
            options: [
              { text: "4x⁶", explanation: "Correct! 2² = 4 and (x³)² = x⁶. So 4x⁶.", correct: true },
              { text: "2x⁶", explanation: "Don't forget to square the 2: 2² = 4." },
              { text: "4x⁵", explanation: "3 × 2 = 6, not 5." },
              { text: "2x⁵", explanation: "Both errors: 2² = 4 and 3 × 2 = 6." }
            ]
          },
          {
            id: "MK2-011",
            text: "Simplify: √72",
            options: [
              { text: "6√2", explanation: "Correct! √72 = √(36 × 2) = 6√2.", correct: true },
              { text: "8√3", explanation: "8√3 ≈ 13.9, but √72 ≈ 8.49. Factor: √72 = 6√2." },
              { text: "3√8", explanation: "3√8 = 3 × 2√2 = 6√2. This is correct but not simplified!" },
              { text: "9√2", explanation: "9² = 81, not 72. √72 = 6√2." }
            ]
          },
          {
            id: "MK2-012",
            text: "Simplify: x³ × x⁻¹",
            options: [
              { text: "x²", explanation: "Correct! 3 + (-1) = 2. Even with negative exponents, ADD when multiplying.", correct: true },
              { text: "x⁴", explanation: "3 - (-1) would be 4, but when multiplying, ADD: 3 + (-1) = 2." },
              { text: "x⁻³", explanation: "3 × (-1) = -3, but multiplication means ADD exponents." },
              { text: "1/x³", explanation: "This would be x⁻³, but x³ × x⁻¹ = x²." }
            ]
          },
          {
            id: "MK2-013",
            text: "Simplify: (x⁻²)³",
            options: [
              { text: "x⁻⁶", explanation: "Correct! -2 × 3 = -6.", correct: true },
              { text: "x⁻⁵", explanation: "-2 + 3 = 1, but power of power means MULTIPLY: -2 × 3 = -6." },
              { text: "x⁶", explanation: "The negative stays: -2 × 3 = -6, so x⁻⁶." },
              { text: "x¹", explanation: "-2 + 3 = 1, but should MULTIPLY: -2 × 3 = -6." }
            ]
          },
          {
            id: "MK2-014",
            text: "What is 2³?",
            options: [
              { text: "8", explanation: "Correct! 2 × 2 × 2 = 8.", correct: true },
              { text: "6", explanation: "That's 2 × 3. But 2³ means 2 × 2 × 2 = 8." },
              { text: "9", explanation: "That's 3². 2³ = 2 × 2 × 2 = 8." },
              { text: "5", explanation: "That's 2 + 3. 2³ = 2 × 2 × 2 = 8." }
            ]
          },
          {
            id: "MK2-015",
            text: "Simplify: √(x⁴)",
            options: [
              { text: "x²", explanation: "Correct! √(x⁴) = x^(4/2) = x².", correct: true },
              { text: "x⁴", explanation: "Taking square root halves the exponent: 4 ÷ 2 = 2." },
              { text: "2x", explanation: "√(x⁴) = x², not 2x." },
              { text: "x⁸", explanation: "Square root halves, not doubles: 4 ÷ 2 = 2." }
            ]
          }
        ],

        quizConfig: {
          questionsPerQuiz: 6,
          passingScore: 0.8
        }
      },

      // --------------------------------------------
      // CHAPTER 3: FOIL & FACTORING
      // --------------------------------------------
      {
        id: "MK-3",
        title: "FOIL & Factoring",
        description: "Multiply binomials and factor quadratics",

        lesson: {
          intro: "FOIL is a method for multiplying two binomials. Factoring is the reverse — breaking an expression back into two binomials. Master both!",

          concepts: [
            {
              title: "FOIL: First, Outer, Inner, Last",
              content: "To multiply (a + b)(c + d): First (a×c), Outer (a×d), Inner (b×c), Last (b×d). Then combine like terms.",
              svg: `<svg width="340" height="200" viewBox="0 0 340 200">
                <style>
                  text { font-family: 'DM Sans', sans-serif; fill: #0a1628; }
                  .expr { font-size: 18px; font-weight: 600; }
                  .label { font-size: 11px; font-weight: 600; }
                  .result { font-size: 14px; }
                </style>
                <text x="80" y="30" class="expr">(x + 3)(x + 5)</text>
                <path d="M 90,35 Q 90,60 70,80" fill="none" stroke="#2563eb" stroke-width="2" marker-end="url(#arrow)"/>
                <path d="M 90,35 Q 130,55 160,80" fill="none" stroke="#16a34a" stroke-width="2"/>
                <path d="M 115,35 Q 100,55 85,80" fill="none" stroke="#d97706" stroke-width="2"/>
                <path d="M 150,35 Q 150,60 170,80" fill="none" stroke="#dc2626" stroke-width="2"/>
                <rect x="50" y="85" width="40" height="22" rx="4" fill="#dbeafe"/>
                <rect x="95" y="85" width="40" height="22" rx="4" fill="#dcfce7"/>
                <rect x="140" y="85" width="40" height="22" rx="4" fill="#fef3c7"/>
                <rect x="185" y="85" width="40" height="22" rx="4" fill="#fee2e2"/>
                <text x="55" y="101" class="label">First</text>
                <text x="100" y="101" class="label">Outer</text>
                <text x="145" y="101" class="label">Inner</text>
                <text x="193" y="101" class="label">Last</text>
                <text x="55" y="125" class="result">x·x</text>
                <text x="100" y="125" class="result">x·5</text>
                <text x="145" y="125" class="result">3·x</text>
                <text x="192" y="125" class="result">3·5</text>
                <text x="60" y="150" class="result">x²</text>
                <text x="100" y="150" class="result">+ 5x</text>
                <text x="145" y="150" class="result">+ 3x</text>
                <text x="190" y="150" class="result">+ 15</text>
                <text x="70" y="185" class="expr" style="fill:#d4a853;">= x² + 8x + 15</text>
              </svg>`
            },
            {
              title: "Factoring x² + bx + c",
              content: "Find two numbers that MULTIPLY to c and ADD to b. Those become your factors: (x + ?)(x + ?).",
              svg: `<svg width="320" height="170" viewBox="0 0 320 170">
                <style>
                  text { font-family: 'DM Sans', sans-serif; fill: #0a1628; }
                  .title { font-size: 14px; font-weight: 600; }
                  .math { font-size: 13px; font-family: 'SF Mono', monospace; }
                  .good { fill: #16a34a; }
                  .bad { fill: #dc2626; }
                </style>
                <text x="20" y="25" class="title">Factor: x² + 7x + 12</text>
                <rect x="20" y="35" width="150" height="45" rx="6" fill="#fef3c7" stroke="#d4a853" stroke-width="2"/>
                <text x="30" y="55" style="font-size:12px;">Need two numbers that:</text>
                <text x="30" y="72" style="font-size:12px;font-weight:600;">MULTIPLY → 12, ADD → 7</text>
                <text x="190" y="50" class="math">1 × 12 = 12</text>
                <text x="280" y="50" class="math">1 + 12 = 13</text>
                <text x="315" y="50" class="bad">✗</text>
                <text x="190" y="75" class="math">2 × 6 = 12</text>
                <text x="280" y="75" class="math">2 + 6 = 8</text>
                <text x="315" y="75" class="bad">✗</text>
                <text x="190" y="100" class="math" style="font-weight:600;">3 × 4 = 12</text>
                <text x="280" y="100" class="math" style="font-weight:600;">3 + 4 = 7</text>
                <text x="315" y="100" class="good" style="font-size:16px;">✓</text>
                <rect x="20" y="115" width="180" height="35" rx="6" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
                <text x="35" y="138" style="font-size:16px;font-weight:700;">Answer: (x + 3)(x + 4)</text>
              </svg>`
            },
            {
              title: "Difference of Squares",
              content: "a² - b² = (a + b)(a - b). This is a special pattern. Example: x² - 9 = (x + 3)(x - 3).",
              svg: `<svg width="320" height="140" viewBox="0 0 320 140">
                <style>
                  text { font-family: 'DM Sans', sans-serif; fill: #0a1628; }
                  .formula { font-size: 16px; font-weight: 600; }
                  .step { font-size: 13px; }
                  .check { fill: #16a34a; }
                </style>
                <rect x="15" y="15" width="200" height="35" rx="6" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
                <text x="30" y="38" class="formula">a² − b² = (a + b)(a − b)</text>
                <text x="20" y="75" class="step" style="font-weight:600;">Example: x² − 9</text>
                <text x="20" y="95" class="step">x² = (x)² and 9 = (3)²</text>
                <text x="20" y="120" class="step" style="font-weight:600;fill:#d4a853;">So: x² − 9 = (x + 3)(x − 3)</text>
                <text x="235" y="75" class="step" style="font-size:11px;">Verify:</text>
                <text x="235" y="95" class="step" style="font-size:11px;">(x+3)(x−3)</text>
                <text x="235" y="112" class="step" style="font-size:11px;">= x² − 9</text>
                <text x="285" y="112" class="check">✓</text>
              </svg>`
            }
          ],

          examples: [
            {
              problem: "Expand: (x + 3)(x + 5)",
              steps: [
                "First: x × x = x²",
                "Outer: x × 5 = 5x",
                "Inner: 3 × x = 3x",
                "Last: 3 × 5 = 15",
                "Combine: x² + 5x + 3x + 15 = x² + 8x + 15"
              ],
              tip: "Watch your signs! A negative in either binomial changes signs."
            },
            {
              problem: "Factor: x² + 7x + 12",
              steps: [
                "Need two numbers that multiply to 12 and add to 7",
                "3 × 4 = 12 ✓ and 3 + 4 = 7 ✓",
                "Answer: (x + 3)(x + 4)"
              ],
              tip: "Always check by FOILing your answer back out!"
            }
          ],

          summary: "FOIL: First-Outer-Inner-Last, then combine like terms. Factoring: find two numbers that multiply to the constant and add to the middle coefficient."
        },

        questions: [
          {
            id: "MK3-001",
            text: "Expand: (x + 2)(x + 4)",
            options: [
              { text: "x² + 6x + 8", explanation: "Correct! F: x², O: 4x, I: 2x, L: 8. Combine: x² + 6x + 8.", correct: true },
              { text: "x² + 8x + 6", explanation: "2 × 4 = 8 (last term), and 2 + 4 = 6 (middle). So x² + 6x + 8." },
              { text: "x² + 6x + 6", explanation: "Last term is 2 × 4 = 8, not 6." },
              { text: "x² + 8", explanation: "You forgot the middle term: 4x + 2x = 6x." }
            ]
          },
          {
            id: "MK3-002",
            text: "Expand: (x - 3)(x + 5)",
            options: [
              { text: "x² + 2x - 15", explanation: "Correct! F: x², O: 5x, I: -3x, L: -15. Combine: x² + 2x - 15.", correct: true },
              { text: "x² - 2x - 15", explanation: "5x + (-3x) = 2x, not -2x." },
              { text: "x² + 2x + 15", explanation: "(-3)(5) = -15, not +15." },
              { text: "x² + 8x - 15", explanation: "5 + (-3) = 2, not 8." }
            ]
          },
          {
            id: "MK3-003",
            text: "Factor: x² + 5x + 6",
            options: [
              { text: "(x + 2)(x + 3)", explanation: "Correct! 2 × 3 = 6, and 2 + 3 = 5.", correct: true },
              { text: "(x + 1)(x + 6)", explanation: "1 + 6 = 7, not 5." },
              { text: "(x + 5)(x + 1)", explanation: "5 × 1 = 5, not 6." },
              { text: "(x - 2)(x - 3)", explanation: "(-2)(-3) = 6 ✓, but (-2) + (-3) = -5, not 5." }
            ]
          },
          {
            id: "MK3-004",
            text: "Factor: x² - 9",
            options: [
              { text: "(x + 3)(x - 3)", explanation: "Correct! This is difference of squares: x² - 3² = (x + 3)(x - 3).", correct: true },
              { text: "(x - 3)(x - 3)", explanation: "(x - 3)² = x² - 6x + 9, not x² - 9." },
              { text: "(x + 9)(x - 1)", explanation: "This gives x² + 8x - 9, not x² - 9." },
              { text: "(x - 9)(x + 1)", explanation: "This gives x² - 8x - 9, not x² - 9." }
            ]
          },
          {
            id: "MK3-005",
            text: "Expand: (x - 4)(x - 2)",
            options: [
              { text: "x² - 6x + 8", explanation: "Correct! F: x², O: -2x, I: -4x, L: 8. Combine: x² - 6x + 8.", correct: true },
              { text: "x² + 6x + 8", explanation: "Both terms are negative, so middle is -4x + (-2x) = -6x." },
              { text: "x² - 6x - 8", explanation: "(-4)(-2) = +8, not -8." },
              { text: "x² - 2x + 8", explanation: "-4 + (-2) = -6, not -2." }
            ]
          },
          {
            id: "MK3-006",
            text: "Factor: x² - 7x + 12",
            options: [
              { text: "(x - 3)(x - 4)", explanation: "Correct! (-3)(-4) = 12 and (-3) + (-4) = -7.", correct: true },
              { text: "(x + 3)(x + 4)", explanation: "3 + 4 = 7, not -7. Need negative numbers." },
              { text: "(x - 2)(x - 6)", explanation: "(-2) + (-6) = -8, not -7." },
              { text: "(x - 1)(x - 12)", explanation: "(-1) + (-12) = -13, not -7." }
            ]
          },
          {
            id: "MK3-007",
            text: "Expand: (2x + 1)(x + 3)",
            options: [
              { text: "2x² + 7x + 3", explanation: "Correct! F: 2x², O: 6x, I: x, L: 3. Combine: 2x² + 7x + 3.", correct: true },
              { text: "2x² + 4x + 3", explanation: "6x + x = 7x, not 4x." },
              { text: "2x² + 6x + 3", explanation: "6x + 1x = 7x, not 6x." },
              { text: "3x² + 7x + 3", explanation: "First term is 2x × x = 2x², not 3x²." }
            ]
          },
          {
            id: "MK3-008",
            text: "Factor: x² - 25",
            options: [
              { text: "(x + 5)(x - 5)", explanation: "Correct! Difference of squares: x² - 5² = (x + 5)(x - 5).", correct: true },
              { text: "(x - 5)(x - 5)", explanation: "(x - 5)² = x² - 10x + 25, not x² - 25." },
              { text: "(x + 25)(x - 1)", explanation: "This gives x² + 24x - 25, not x² - 25." },
              { text: "(x - 25)(x + 1)", explanation: "This gives x² - 24x - 25, not x² - 25." }
            ]
          },
          {
            id: "MK3-009",
            text: "Factor: x² + x - 12",
            options: [
              { text: "(x + 4)(x - 3)", explanation: "Correct! 4 × (-3) = -12 and 4 + (-3) = 1.", correct: true },
              { text: "(x - 4)(x + 3)", explanation: "(-4)(3) = -12 ✓, but (-4) + 3 = -1, not 1." },
              { text: "(x + 6)(x - 2)", explanation: "6 × (-2) = -12 ✓, but 6 + (-2) = 4, not 1." },
              { text: "(x + 12)(x - 1)", explanation: "12 × (-1) = -12 ✓, but 12 + (-1) = 11, not 1." }
            ]
          },
          {
            id: "MK3-010",
            text: "Expand: (x + 5)²",
            options: [
              { text: "x² + 10x + 25", explanation: "Correct! (x + 5)(x + 5): F: x², O+I: 5x + 5x = 10x, L: 25.", correct: true },
              { text: "x² + 25", explanation: "Don't forget the middle term! 5x + 5x = 10x." },
              { text: "x² + 5x + 25", explanation: "5x + 5x = 10x, not 5x." },
              { text: "2x + 10", explanation: "(x + 5)² ≠ 2(x + 5). Must FOIL or use formula." }
            ]
          },
          {
            id: "MK3-011",
            text: "Factor: x² - 4x - 21",
            options: [
              { text: "(x - 7)(x + 3)", explanation: "Correct! (-7)(3) = -21 and (-7) + 3 = -4.", correct: true },
              { text: "(x + 7)(x - 3)", explanation: "(7)(-3) = -21 ✓, but 7 + (-3) = 4, not -4." },
              { text: "(x - 3)(x + 7)", explanation: "Same as above: 7 - 3 = 4, not -4." },
              { text: "(x - 21)(x + 1)", explanation: "(-21)(1) = -21 ✓, but -21 + 1 = -20, not -4." }
            ]
          },
          {
            id: "MK3-012",
            text: "Expand: (3x - 2)(x + 4)",
            options: [
              { text: "3x² + 10x - 8", explanation: "Correct! F: 3x², O: 12x, I: -2x, L: -8. Combine: 3x² + 10x - 8.", correct: true },
              { text: "3x² + 14x - 8", explanation: "12x + (-2x) = 10x, not 14x." },
              { text: "3x² + 10x + 8", explanation: "(-2)(4) = -8, not +8." },
              { text: "3x² - 10x - 8", explanation: "12x + (-2x) = +10x, not -10x." }
            ]
          },
          {
            id: "MK3-013",
            text: "Factor: x² - 16",
            options: [
              { text: "(x + 4)(x - 4)", explanation: "Correct! Difference of squares: x² - 4² = (x + 4)(x - 4).", correct: true },
              { text: "(x - 4)²", explanation: "(x - 4)² = x² - 8x + 16, not x² - 16." },
              { text: "(x - 8)(x + 2)", explanation: "(-8)(2) = -16 ✓, but this gives x² - 6x - 16, not x² - 16." },
              { text: "(x + 16)(x - 1)", explanation: "This gives x² + 15x - 16, not x² - 16." }
            ]
          },
          {
            id: "MK3-014",
            text: "Expand: (x - 1)(x + 1)",
            options: [
              { text: "x² - 1", explanation: "Correct! This is difference of squares: (x + 1)(x - 1) = x² - 1.", correct: true },
              { text: "x² + 1", explanation: "(-1)(1) = -1, not +1." },
              { text: "x² - 2x - 1", explanation: "The middle terms cancel: x + (-x) = 0." },
              { text: "2x", explanation: "Must FOIL: F: x², O: x, I: -x, L: -1. Result: x² - 1." }
            ]
          },
          {
            id: "MK3-015",
            text: "Factor: x² + 10x + 25",
            options: [
              { text: "(x + 5)²", explanation: "Correct! 5 + 5 = 10 and 5 × 5 = 25. This is a perfect square.", correct: true },
              { text: "(x + 5)(x - 5)", explanation: "(5)(-5) = -25, not +25." },
              { text: "(x + 10)(x + 2.5)", explanation: "10 × 2.5 = 25 ✓, but 10 + 2.5 = 12.5, not 10." },
              { text: "(x + 25)(x + 1)", explanation: "25 + 1 = 26, not 10." }
            ]
          }
        ],

        quizConfig: {
          questionsPerQuiz: 6,
          passingScore: 0.8
        }
      },

      // --------------------------------------------
      // CHAPTER 4: PYTHAGOREAN THEOREM
      // --------------------------------------------
      {
        id: "MK-4",
        title: "Pythagorean Theorem",
        description: "Find missing sides of right triangles",

        lesson: {
          intro: "The Pythagorean Theorem is THE most tested geometry concept. It only works for right triangles (with a 90° angle).",

          concepts: [
            {
              title: "The Formula",
              content: "a² + b² = c², where c is the hypotenuse (longest side, across from the right angle). a and b are the legs.",
              svg: `<svg width="320" height="180" viewBox="0 0 320 180">
                <style>
                  text { font-family: 'DM Sans', sans-serif; fill: #0a1628; }
                  .label { font-size: 16px; font-weight: 600; }
                  .formula { font-size: 18px; font-weight: 700; }
                  .note { font-size: 12px; fill: #666; }
                </style>
                <polygon points="30,150 30,40 130,150" fill="none" stroke="#0a1628" stroke-width="2"/>
                <rect x="30" y="140" width="10" height="10" fill="none" stroke="#0a1628" stroke-width="1.5"/>
                <text x="12" y="100" class="label">a</text>
                <text x="75" y="170" class="label">b</text>
                <text x="85" y="85" class="label" fill="#d4a853">c</text>
                <text x="175" y="60" class="formula">a² + b² = c²</text>
                <text x="175" y="90" class="note">• c = hypotenuse (longest)</text>
                <text x="175" y="110" class="note">• a, b = legs</text>
                <text x="175" y="130" class="note">• 90° angle is between legs</text>
              </svg>`
            },
            {
              title: "Pythagorean Triples",
              content: "Memorize these! 3-4-5, 5-12-13, 8-15-17, 7-24-25. Multiples work too: 6-8-10 (double 3-4-5).",
              svg: `<svg width="340" height="160" viewBox="0 0 340 160">
                <style>
                  text { font-family: 'DM Sans', sans-serif; fill: #0a1628; }
                  .title { font-size: 14px; font-weight: 600; }
                  .triple { font-size: 16px; font-family: 'SF Mono', monospace; }
                  .check { fill: #16a34a; }
                </style>
                <rect x="10" y="10" width="180" height="140" rx="8" fill="#faf8f5" stroke="#d4a853" stroke-width="2"/>
                <text x="25" y="35" class="title">Common Triples:</text>
                <text x="30" y="60" class="triple">3 - 4 - 5</text>
                <text x="120" y="60" class="triple" style="font-size:12px;fill:#666">(×2 → 6-8-10)</text>
                <text x="30" y="85" class="triple">5 - 12 - 13</text>
                <text x="30" y="110" class="triple">8 - 15 - 17</text>
                <text x="30" y="135" class="triple">7 - 24 - 25</text>
                <text x="210" y="60" style="font-size:13px;">Verify 3-4-5:</text>
                <text x="210" y="85" style="font-size:13px;">3² + 4² = 9 + 16</text>
                <text x="210" y="105" style="font-size:13px;">= 25 = 5²</text>
                <text x="290" y="105" class="check" style="font-size:18px;">✓</text>
              </svg>`
            },
            {
              title: "Finding a Leg",
              content: "If you need to find a leg, rearrange: a² = c² - b². Then take the square root.",
              svg: `<svg width="340" height="160" viewBox="0 0 340 160">
                <style>
                  text { font-family: 'DM Sans', sans-serif; fill: #0a1628; }
                  .label { font-size: 14px; font-weight: 600; }
                  .math { font-size: 13px; }
                  .unknown { fill: #d4a853; font-weight: 700; }
                </style>
                <polygon points="30,140 30,30 100,140" fill="none" stroke="#0a1628" stroke-width="2"/>
                <rect x="30" y="130" width="10" height="10" fill="none" stroke="#0a1628" stroke-width="1.5"/>
                <text x="8" y="90" class="label unknown">a=?</text>
                <text x="55" y="155" class="label">5</text>
                <text x="70" y="75" class="label">13</text>
                <text x="140" y="40" class="math">a² + 5² = 13²</text>
                <text x="140" y="65" class="math">a² + 25 = 169</text>
                <text x="140" y="90" class="math">a² = 169 - 25 = 144</text>
                <text x="140" y="120" class="math" style="font-weight:600;font-size:15px;">a = √144 = 12</text>
              </svg>`
            }
          ],

          examples: [
            {
              problem: "A right triangle has legs 3 and 4. Find the hypotenuse.",
              steps: [
                "a² + b² = c²",
                "3² + 4² = c²",
                "9 + 16 = 25 = c²",
                "c = 5"
              ],
              tip: "3-4-5 is the most common Pythagorean triple!",
              svg: `<svg width="160" height="130" viewBox="0 0 160 130">
                <style>
                  text { font-family: 'DM Sans', sans-serif; fill: #0a1628; font-size: 14px; font-weight: 600; }
                </style>
                <polygon points="20,110 20,30 100,110" fill="#fef3c7" stroke="#0a1628" stroke-width="2"/>
                <rect x="20" y="100" width="10" height="10" fill="none" stroke="#0a1628" stroke-width="1.5"/>
                <text x="5" y="75">3</text>
                <text x="55" y="125">4</text>
                <text x="65" y="60" fill="#d4a853">5</text>
              </svg>`
            },
            {
              problem: "A right triangle has hypotenuse 13 and one leg 5. Find the other leg.",
              steps: [
                "a² + 5² = 13²",
                "a² + 25 = 169",
                "a² = 144",
                "a = 12"
              ],
              tip: "Recognize 5-12-13 triple? It saves calculation time!"
            }
          ],

          summary: "a² + b² = c² (c is hypotenuse). Memorize triples: 3-4-5, 5-12-13, 8-15-17. The hypotenuse is ALWAYS the longest side."
        },

        questions: [
          {
            id: "MK4-001",
            text: "A right triangle has legs 6 and 8. What is the hypotenuse?",
            options: [
              { text: "10", explanation: "Correct! 6² + 8² = 36 + 64 = 100. √100 = 10. (Also: 3-4-5 doubled!)", correct: true },
              { text: "14", explanation: "6 + 8 = 14, but that's not how it works. Use a² + b² = c²." },
              { text: "7", explanation: "(6 + 8)/2 = 7, but that's not the formula. √100 = 10." },
              { text: "48", explanation: "6 × 8 = 48, but that's not the formula. 6² + 8² = 100." }
            ]
          },
          {
            id: "MK4-002",
            text: "A right triangle has legs 5 and 12. What is the hypotenuse?",
            options: [
              { text: "13", explanation: "Correct! 5-12-13 is a Pythagorean triple.", correct: true },
              { text: "17", explanation: "5 + 12 = 17, but use the formula: √(25 + 144) = √169 = 13." },
              { text: "60", explanation: "5 × 12 = 60. Use: 5² + 12² = 169. √169 = 13." },
              { text: "11", explanation: "√(25 + 144) = √169 = 13, not 11." }
            ]
          },
          {
            id: "MK4-003",
            text: "A right triangle has hypotenuse 10 and one leg 6. Find the other leg.",
            options: [
              { text: "8", explanation: "Correct! a² + 36 = 100. a² = 64. a = 8. (6-8-10 triple!)", correct: true },
              { text: "4", explanation: "10 - 6 = 4, but use: a² = 100 - 36 = 64. a = 8." },
              { text: "16", explanation: "10 + 6 = 16, but a² = 100 - 36 = 64. a = 8." },
              { text: "√64", explanation: "√64 = 8. Simplify your answer!" }
            ]
          },
          {
            id: "MK4-004",
            text: "A right triangle has legs 8 and 15. What is the hypotenuse?",
            options: [
              { text: "17", explanation: "Correct! 8-15-17 is a Pythagorean triple.", correct: true },
              { text: "23", explanation: "8 + 15 = 23, but √(64 + 225) = √289 = 17." },
              { text: "120", explanation: "8 × 15 = 120, but use a² + b² = c²: √289 = 17." },
              { text: "13", explanation: "√(64 + 225) = √289 = 17, not 13." }
            ]
          },
          {
            id: "MK4-005",
            text: "A ladder leans against a wall. The base is 9 ft from the wall, and the ladder is 15 ft long. How high up the wall does it reach?",
            options: [
              { text: "12 ft", explanation: "Correct! h² + 81 = 225. h² = 144. h = 12. (9-12-15 = 3-4-5 × 3)", correct: true },
              { text: "6 ft", explanation: "15 - 9 = 6, but use: h² = 225 - 81 = 144. h = 12." },
              { text: "24 ft", explanation: "9 + 15 = 24, but h² = 225 - 81 = 144. h = 12." },
              { text: "√144 ft", explanation: "Simplify: √144 = 12 ft." }
            ]
          },
          {
            id: "MK4-006",
            text: "What is the hypotenuse of a right triangle with legs 7 and 24?",
            options: [
              { text: "25", explanation: "Correct! 7-24-25 is a Pythagorean triple.", correct: true },
              { text: "31", explanation: "7 + 24 = 31, but √(49 + 576) = √625 = 25." },
              { text: "168", explanation: "7 × 24 = 168, but use a² + b² = c²: √625 = 25." },
              { text: "17", explanation: "√(49 + 576) = √625 = 25, not 17." }
            ]
          },
          {
            id: "MK4-007",
            text: "A right triangle has hypotenuse 5 and one leg 3. Find the other leg.",
            options: [
              { text: "4", explanation: "Correct! 3-4-5 triple. a² = 25 - 9 = 16. a = 4.", correct: true },
              { text: "2", explanation: "5 - 3 = 2, but use: a² = 25 - 9 = 16. a = 4." },
              { text: "8", explanation: "5 + 3 = 8, but a² = 25 - 9 = 16. a = 4." },
              { text: "√8", explanation: "a² = 25 - 9 = 16, not 8. √16 = 4." }
            ]
          },
          {
            id: "MK4-008",
            text: "A right triangle has legs 9 and 12. What is the hypotenuse?",
            options: [
              { text: "15", explanation: "Correct! 3-4-5 × 3 = 9-12-15.", correct: true },
              { text: "21", explanation: "9 + 12 = 21, but √(81 + 144) = √225 = 15." },
              { text: "108", explanation: "9 × 12 = 108, but use a² + b² = c²: √225 = 15." },
              { text: "√225", explanation: "Simplify: √225 = 15." }
            ]
          },
          {
            id: "MK4-009",
            text: "Which set of numbers could be sides of a right triangle?",
            options: [
              { text: "5, 12, 13", explanation: "Correct! 5² + 12² = 25 + 144 = 169 = 13². It's a Pythagorean triple!", correct: true },
              { text: "4, 5, 6", explanation: "4² + 5² = 16 + 25 = 41 ≠ 36 = 6². Not a right triangle." },
              { text: "2, 3, 4", explanation: "2² + 3² = 4 + 9 = 13 ≠ 16 = 4². Not a right triangle." },
              { text: "1, 2, 3", explanation: "1² + 2² = 1 + 4 = 5 ≠ 9 = 3². Not a right triangle." }
            ]
          },
          {
            id: "MK4-010",
            text: "A TV is measured diagonally at 50 inches. If the width is 40 inches, what is the height?",
            options: [
              { text: "30 inches", explanation: "Correct! h² + 1600 = 2500. h² = 900. h = 30. (30-40-50 = 3-4-5 × 10)", correct: true },
              { text: "10 inches", explanation: "50 - 40 = 10, but use: h² = 2500 - 1600 = 900. h = 30." },
              { text: "90 inches", explanation: "50 + 40 = 90, but h² = 2500 - 1600 = 900. h = 30." },
              { text: "√900 inches", explanation: "Simplify: √900 = 30 inches." }
            ]
          },
          {
            id: "MK4-011",
            text: "A right triangle has legs of equal length 5. What is the hypotenuse?",
            options: [
              { text: "5√2", explanation: "Correct! 5² + 5² = 50. √50 = √(25 × 2) = 5√2.", correct: true },
              { text: "10", explanation: "5 + 5 = 10, but √(25 + 25) = √50 = 5√2 ≈ 7.07." },
              { text: "25", explanation: "5 × 5 = 25, but that's a² not √(a² + b²)." },
              { text: "√10", explanation: "√(25 + 25) = √50 = 5√2, not √10." }
            ]
          },
          {
            id: "MK4-012",
            text: "A right triangle has hypotenuse 17 and one leg 8. Find the other leg.",
            options: [
              { text: "15", explanation: "Correct! 8-15-17 is a triple. a² = 289 - 64 = 225. a = 15.", correct: true },
              { text: "9", explanation: "17 - 8 = 9, but a² = 289 - 64 = 225. a = 15." },
              { text: "25", explanation: "17 + 8 = 25, but a² = 289 - 64 = 225. a = 15." },
              { text: "√225", explanation: "Simplify: √225 = 15." }
            ]
          }
        ],

        quizConfig: {
          questionsPerQuiz: 5,
          passingScore: 0.8
        }
      },

      // --------------------------------------------
      // CHAPTER 5: AREA & PERIMETER
      // --------------------------------------------
      {
        id: "MK-5",
        title: "Area & Perimeter",
        description: "Calculate areas and perimeters of common shapes",

        lesson: {
          intro: "These formulas come up constantly. Memorize them — there's no formula sheet on the ASVAB!",

          concepts: [
            {
              title: "Rectangle",
              content: "Area = length × width. Perimeter = 2(length) + 2(width) or 2(l + w).",
              svg: `<svg width="320" height="140" viewBox="0 0 320 140">
                <style>
                  text { font-family: 'DM Sans', sans-serif; fill: #0a1628; }
                  .label { font-size: 14px; font-weight: 600; }
                  .formula { font-size: 13px; }
                </style>
                <rect x="20" y="20" width="120" height="80" fill="#dbeafe" stroke="#0a1628" stroke-width="2" rx="2"/>
                <text x="75" y="115" class="label">l</text>
                <text x="2" y="65" class="label">w</text>
                <text x="180" y="45" class="formula" style="font-weight:600;">Area = l × w</text>
                <text x="180" y="70" class="formula" style="font-weight:600;">Perimeter = 2l + 2w</text>
                <text x="180" y="100" class="formula" style="fill:#666;">Example: l=8, w=5</text>
                <text x="180" y="120" class="formula" style="fill:#666;">A = 40, P = 26</text>
              </svg>`
            },
            {
              title: "Triangle",
              content: "Area = ½ × base × height. The height must be perpendicular to the base!",
              svg: `<svg width="320" height="150" viewBox="0 0 320 150">
                <style>
                  text { font-family: 'DM Sans', sans-serif; fill: #0a1628; }
                  .label { font-size: 14px; font-weight: 600; }
                  .formula { font-size: 13px; }
                </style>
                <polygon points="20,130 80,30 140,130" fill="#dcfce7" stroke="#0a1628" stroke-width="2"/>
                <line x1="80" y1="30" x2="80" y2="130" stroke="#d4a853" stroke-width="2" stroke-dasharray="5,3"/>
                <rect x="75" y="120" width="10" height="10" fill="none" stroke="#0a1628" stroke-width="1"/>
                <text x="75" y="145" class="label">base</text>
                <text x="88" y="85" class="label" fill="#d4a853">h</text>
                <text x="180" y="50" class="formula" style="font-weight:600;">Area = ½ × base × height</text>
                <text x="180" y="80" class="formula" style="fill:#d4a853;">Height must be perpendicular!</text>
                <text x="180" y="110" class="formula" style="fill:#666;">Example: b=10, h=6</text>
                <text x="180" y="130" class="formula" style="fill:#666;">A = ½ × 10 × 6 = 30</text>
              </svg>`
            },
            {
              title: "Circle",
              content: "Area = πr². Circumference = 2πr = πd. Always use RADIUS, not diameter!",
              svg: `<svg width="340" height="170" viewBox="0 0 340 170">
                <style>
                  text { font-family: 'DM Sans', sans-serif; fill: #0a1628; }
                  .label { font-size: 14px; font-weight: 600; }
                  .formula { font-size: 13px; }
                  .warn { fill: #dc2626; font-weight: 600; }
                </style>
                <circle cx="75" cy="85" r="55" fill="#fef3c7" stroke="#0a1628" stroke-width="2"/>
                <circle cx="75" cy="85" r="3" fill="#0a1628"/>
                <line x1="75" y1="85" x2="130" y2="85" stroke="#d4a853" stroke-width="2"/>
                <line x1="20" y1="85" x2="130" y2="85" stroke="#0a1628" stroke-width="1" stroke-dasharray="3,3"/>
                <text x="95" y="78" class="label" fill="#d4a853">r</text>
                <text x="65" y="150" class="label">d = 2r</text>
                <text x="160" y="40" class="formula" style="font-weight:600;">Area = πr²</text>
                <text x="160" y="65" class="formula" style="font-weight:600;">Circumference = 2πr = πd</text>
                <text x="160" y="95" class="formula">r = radius (center to edge)</text>
                <text x="160" y="115" class="formula">d = diameter (edge to edge)</text>
                <text x="160" y="145" class="formula warn">⚠️ Always use RADIUS!</text>
              </svg>`
            }
          ],

          examples: [
            {
              problem: "Find the area of a rectangle with length 8 and width 5.",
              steps: [
                "Area = length × width",
                "Area = 8 × 5 = 40 square units"
              ],
              tip: "Area is always in square units (sq ft, sq m, etc.)",
              svg: `<svg width="160" height="110" viewBox="0 0 160 110">
                <style>
                  text { font-family: 'DM Sans', sans-serif; fill: #0a1628; font-size: 14px; font-weight: 600; }
                </style>
                <rect x="20" y="15" width="120" height="75" fill="#dbeafe" stroke="#0a1628" stroke-width="2" rx="2"/>
                <text x="75" y="58" style="font-size:18px;">40</text>
                <text x="75" y="105" class="label">8</text>
                <text x="2" y="58" class="label">5</text>
              </svg>`
            },
            {
              problem: "Find the area of a circle with diameter 10.",
              steps: [
                "Diameter = 10, so radius = 5",
                "Area = πr² = π(5)² = 25π"
              ],
              tip: "ALWAYS use radius, not diameter. If given diameter, divide by 2 first!",
              svg: `<svg width="180" height="130" viewBox="0 0 180 130">
                <style>
                  text { font-family: 'DM Sans', sans-serif; fill: #0a1628; font-size: 13px; font-weight: 600; }
                </style>
                <circle cx="70" cy="65" r="50" fill="#fef3c7" stroke="#0a1628" stroke-width="2"/>
                <circle cx="70" cy="65" r="3" fill="#0a1628"/>
                <line x1="70" y1="65" x2="120" y2="65" stroke="#d4a853" stroke-width="2"/>
                <line x1="20" y1="65" x2="120" y2="65" stroke="#0a1628" stroke-width="1" stroke-dasharray="3,3"/>
                <text x="90" y="58" fill="#d4a853">r=5</text>
                <text x="55" y="125">d = 10</text>
                <text x="135" y="60">Area</text>
                <text x="135" y="78">= 25π</text>
              </svg>`
            }
          ],

          summary: "Rectangle: A = lw, P = 2l + 2w. Triangle: A = ½bh. Circle: A = πr², C = 2πr. Use RADIUS for circles!"
        },

        questions: [
          {
            id: "MK5-001",
            text: "Find the area of a rectangle with length 12 and width 7.",
            options: [
              { text: "84", explanation: "Correct! Area = 12 × 7 = 84.", correct: true },
              { text: "38", explanation: "That's perimeter: 2(12) + 2(7) = 38. Area = 12 × 7 = 84." },
              { text: "19", explanation: "12 + 7 = 19, but Area = 12 × 7 = 84." },
              { text: "5", explanation: "12 - 7 = 5, but Area = 12 × 7 = 84." }
            ]
          },
          {
            id: "MK5-002",
            text: "Find the perimeter of a rectangle with length 9 and width 4.",
            options: [
              { text: "26", explanation: "Correct! P = 2(9) + 2(4) = 18 + 8 = 26.", correct: true },
              { text: "36", explanation: "That's area: 9 × 4 = 36. Perimeter = 2(9 + 4) = 26." },
              { text: "13", explanation: "9 + 4 = 13, but perimeter counts all 4 sides: 2(9 + 4) = 26." },
              { text: "52", explanation: "You doubled 26. Perimeter = 2(9) + 2(4) = 26." }
            ]
          },
          {
            id: "MK5-003",
            text: "Find the area of a triangle with base 10 and height 6.",
            options: [
              { text: "30", explanation: "Correct! Area = ½ × 10 × 6 = 30.", correct: true },
              { text: "60", explanation: "You forgot the ½. Triangle area = ½ × base × height = 30." },
              { text: "16", explanation: "10 + 6 = 16, but Area = ½ × 10 × 6 = 30." },
              { text: "8", explanation: "Not sure how you got 8. Area = ½ × 10 × 6 = 30." }
            ]
          },
          {
            id: "MK5-004",
            text: "Find the area of a circle with radius 4.",
            options: [
              { text: "16π", explanation: "Correct! Area = πr² = π(4)² = 16π.", correct: true },
              { text: "8π", explanation: "8π is the circumference. Area = πr² = 16π." },
              { text: "4π", explanation: "Area = π × r², not π × r. A = π(4)² = 16π." },
              { text: "64π", explanation: "You used diameter (8) instead of radius (4). A = π(4)² = 16π." }
            ]
          },
          {
            id: "MK5-005",
            text: "Find the circumference of a circle with radius 7.",
            options: [
              { text: "14π", explanation: "Correct! C = 2πr = 2π(7) = 14π.", correct: true },
              { text: "49π", explanation: "That's area: πr² = 49π. Circumference = 2πr = 14π." },
              { text: "7π", explanation: "C = 2πr, not πr. C = 2π(7) = 14π." },
              { text: "28π", explanation: "C = 2πr = 14π, not 4πr." }
            ]
          },
          {
            id: "MK5-006",
            text: "A circle has diameter 12. What is its area?",
            options: [
              { text: "36π", explanation: "Correct! Radius = 6. Area = π(6)² = 36π.", correct: true },
              { text: "144π", explanation: "You used diameter. Radius = 12/2 = 6. Area = π(6)² = 36π." },
              { text: "12π", explanation: "Circumference = πd = 12π. Area = π(6)² = 36π." },
              { text: "6π", explanation: "Area = πr² = π(6)² = 36π, not π × r." }
            ]
          },
          {
            id: "MK5-007",
            text: "Find the area of a square with side 9.",
            options: [
              { text: "81", explanation: "Correct! Area = s² = 9² = 81.", correct: true },
              { text: "36", explanation: "Perimeter = 4s = 36. Area = s² = 81." },
              { text: "18", explanation: "2 × 9 = 18, but Area = 9 × 9 = 81." },
              { text: "4.5", explanation: "9/2 = 4.5, but Area = 9² = 81." }
            ]
          },
          {
            id: "MK5-008",
            text: "A triangle has base 14 and height 5. What is its area?",
            options: [
              { text: "35", explanation: "Correct! Area = ½ × 14 × 5 = 35.", correct: true },
              { text: "70", explanation: "You forgot the ½. Triangle area = ½bh = 35." },
              { text: "19", explanation: "14 + 5 = 19, but Area = ½ × 14 × 5 = 35." },
              { text: "9", explanation: "14 - 5 = 9, but Area = ½ × 14 × 5 = 35." }
            ]
          },
          {
            id: "MK5-009",
            text: "Find the perimeter of a square with side 15.",
            options: [
              { text: "60", explanation: "Correct! P = 4s = 4(15) = 60.", correct: true },
              { text: "225", explanation: "That's area: 15² = 225. Perimeter = 4(15) = 60." },
              { text: "30", explanation: "2 × 15 = 30, but a square has 4 sides: 4(15) = 60." },
              { text: "45", explanation: "3 × 15 = 45, but a square has 4 sides: 4(15) = 60." }
            ]
          },
          {
            id: "MK5-010",
            text: "A circle has circumference 20π. What is its radius?",
            options: [
              { text: "10", explanation: "Correct! C = 2πr, so 20π = 2πr, r = 10.", correct: true },
              { text: "20", explanation: "That's the diameter. C = 2πr = 20π means r = 10." },
              { text: "5", explanation: "C = 2πr, so 20π ÷ 2π = 10, not 5." },
              { text: "100", explanation: "Not sure how you got this. 20π = 2πr means r = 10." }
            ]
          },
          {
            id: "MK5-011",
            text: "What is the area of a circle with diameter 8?",
            options: [
              { text: "16π", explanation: "Correct! Radius = 4. Area = π(4)² = 16π.", correct: true },
              { text: "64π", explanation: "You used diameter (8). Radius = 4. A = π(4)² = 16π." },
              { text: "8π", explanation: "Circumference = πd = 8π. Area = π(4)² = 16π." },
              { text: "32π", explanation: "Area = πr² = π(4)² = 16π." }
            ]
          },
          {
            id: "MK5-012",
            text: "A rectangle has area 48 and width 6. What is its length?",
            options: [
              { text: "8", explanation: "Correct! 48 ÷ 6 = 8.", correct: true },
              { text: "42", explanation: "48 - 6 = 42, but length = area ÷ width = 48 ÷ 6 = 8." },
              { text: "288", explanation: "48 × 6 = 288, but length = 48 ÷ 6 = 8." },
              { text: "54", explanation: "48 + 6 = 54, but length = 48 ÷ 6 = 8." }
            ]
          },
          {
            id: "MK5-013",
            text: "Find the circumference of a circle with diameter 14.",
            options: [
              { text: "14π", explanation: "Correct! C = πd = π(14) = 14π.", correct: true },
              { text: "49π", explanation: "Area = πr² = π(7)² = 49π. Circumference = πd = 14π." },
              { text: "7π", explanation: "C = πd or 2πr. C = π(14) = 14π." },
              { text: "28π", explanation: "C = πd = 14π, not 2πd." }
            ]
          },
          {
            id: "MK5-014",
            text: "A triangle has area 24 and base 8. What is its height?",
            options: [
              { text: "6", explanation: "Correct! ½ × 8 × h = 24. 4h = 24. h = 6.", correct: true },
              { text: "3", explanation: "24 ÷ 8 = 3, but remember ½bh = 24, so h = 6." },
              { text: "16", explanation: "24 - 8 = 16, but ½ × 8 × h = 24 means h = 6." },
              { text: "192", explanation: "24 × 8 = 192, but h = 24 ÷ (½ × 8) = 6." }
            ]
          },
          {
            id: "MK5-015",
            text: "What is the area of a rectangle with perimeter 30 and width 5?",
            options: [
              { text: "50", explanation: "Correct! P = 2l + 2w. 30 = 2l + 10. l = 10. Area = 10 × 5 = 50.", correct: true },
              { text: "150", explanation: "30 × 5 = 150, but first find length: 30 = 2l + 10, so l = 10. A = 50." },
              { text: "25", explanation: "30 - 5 = 25, but use: 30 = 2l + 10, l = 10, A = 10 × 5 = 50." },
              { text: "75", explanation: "15 × 5 = 75, but length = (30 - 10)/2 = 10. A = 10 × 5 = 50." }
            ]
          }
        ],

        quizConfig: {
          questionsPerQuiz: 6,
          passingScore: 0.8
        }
      },

      // --------------------------------------------
      // CHAPTER 6: INEQUALITIES
      // --------------------------------------------
      {
        id: "MK-6",
        title: "Inequalities",
        description: "Solve and graph inequalities",

        lesson: {
          intro: "Inequalities are solved just like equations, with ONE critical rule: flip the sign when multiplying or dividing by a negative!",

          concepts: [
            {
              title: "Solving Inequalities",
              content: "Solve exactly like equations — add, subtract, multiply, divide. But there's one exception..."
            },
            {
              title: "THE FLIP RULE",
              content: "When you multiply or divide both sides by a NEGATIVE number, FLIP the inequality sign. > becomes <. ≥ becomes ≤."
            },
            {
              title: "Reading Inequality Signs",
              content: "< means less than. > means greater than. ≤ means less than or equal. ≥ means greater than or equal."
            }
          ],

          examples: [
            {
              problem: "Solve: 3x + 5 > 14",
              steps: [
                "Subtract 5: 3x > 9",
                "Divide by 3: x > 3",
                "No flip needed (divided by positive)"
              ],
              tip: "No negative division = no flip needed."
            },
            {
              problem: "Solve: -2x + 4 ≤ 10",
              steps: [
                "Subtract 4: -2x ≤ 6",
                "Divide by -2 AND FLIP: x ≥ -3",
                "Sign changed from ≤ to ≥ because we divided by negative!"
              ],
              tip: "Divided by negative = MUST flip the sign!"
            }
          ],

          summary: "Solve like equations. FLIP the inequality sign when multiplying or dividing by a negative number."
        },

        questions: [
          {
            id: "MK6-001",
            text: "Solve: x + 5 > 12",
            options: [
              { text: "x > 7", explanation: "Correct! Subtract 5: x > 7.", correct: true },
              { text: "x > 17", explanation: "You added instead of subtracting. x > 12 - 5 = 7." },
              { text: "x < 7", explanation: "No need to flip when subtracting. x > 7." },
              { text: "x > 6", explanation: "12 - 5 = 7, not 6." }
            ]
          },
          {
            id: "MK6-002",
            text: "Solve: 2x < 14",
            options: [
              { text: "x < 7", explanation: "Correct! Divide by 2 (positive, no flip): x < 7.", correct: true },
              { text: "x > 7", explanation: "No flip needed — we divided by positive 2." },
              { text: "x < 12", explanation: "14 ÷ 2 = 7, not 12." },
              { text: "x < 28", explanation: "Divide, don't multiply: 14 ÷ 2 = 7." }
            ]
          },
          {
            id: "MK6-003",
            text: "Solve: -3x > 15",
            options: [
              { text: "x < -5", explanation: "Correct! Divide by -3 AND FLIP: x < -5.", correct: true },
              { text: "x > -5", explanation: "Divided by negative = FLIP! > becomes <." },
              { text: "x > 5", explanation: "15 ÷ (-3) = -5, and flip the sign." },
              { text: "x < 5", explanation: "15 ÷ (-3) = -5, not 5. But you did flip correctly!" }
            ]
          },
          {
            id: "MK6-004",
            text: "Solve: x - 3 ≥ 7",
            options: [
              { text: "x ≥ 10", explanation: "Correct! Add 3: x ≥ 10.", correct: true },
              { text: "x ≥ 4", explanation: "Add 3, don't subtract: x ≥ 7 + 3 = 10." },
              { text: "x ≤ 10", explanation: "No flip when adding. x ≥ 10." },
              { text: "x ≥ -10", explanation: "7 + 3 = 10, not -10." }
            ]
          },
          {
            id: "MK6-005",
            text: "Solve: -x ≤ 4",
            options: [
              { text: "x ≥ -4", explanation: "Correct! Divide by -1 and flip: x ≥ -4.", correct: true },
              { text: "x ≤ -4", explanation: "Dividing by -1 means FLIP the sign!" },
              { text: "x ≤ 4", explanation: "Divide by -1 and flip: x ≥ -4." },
              { text: "x ≥ 4", explanation: "-1 × 4 = -4, not 4. x ≥ -4." }
            ]
          },
          {
            id: "MK6-006",
            text: "Solve: 4x + 2 < 18",
            options: [
              { text: "x < 4", explanation: "Correct! 4x < 16, then x < 4.", correct: true },
              { text: "x < 5", explanation: "18 - 2 = 16. 16 ÷ 4 = 4, not 5." },
              { text: "x > 4", explanation: "No flip needed (divided by positive 4)." },
              { text: "x < 20", explanation: "Subtract 2 first, then divide: x < 4." }
            ]
          },
          {
            id: "MK6-007",
            text: "Solve: -2x + 8 ≥ 14",
            options: [
              { text: "x ≤ -3", explanation: "Correct! -2x ≥ 6, then x ≤ -3 (flip!).", correct: true },
              { text: "x ≥ -3", explanation: "Divided by -2 means FLIP the sign!" },
              { text: "x ≤ 3", explanation: "6 ÷ (-2) = -3, not 3." },
              { text: "x ≥ 3", explanation: "Two errors: 6 ÷ (-2) = -3, and flip the sign." }
            ]
          },
          {
            id: "MK6-008",
            text: "Solve: 5x - 10 > 15",
            options: [
              { text: "x > 5", explanation: "Correct! 5x > 25, then x > 5.", correct: true },
              { text: "x > 1", explanation: "15 + 10 = 25. 25 ÷ 5 = 5, not 1." },
              { text: "x < 5", explanation: "No flip needed when dividing by positive 5." },
              { text: "x > 25", explanation: "Don't forget to divide: 25 ÷ 5 = 5." }
            ]
          },
          {
            id: "MK6-009",
            text: "Solve: x/2 ≤ 6",
            options: [
              { text: "x ≤ 12", explanation: "Correct! Multiply by 2: x ≤ 12.", correct: true },
              { text: "x ≤ 3", explanation: "Multiply, don't divide: x ≤ 6 × 2 = 12." },
              { text: "x ≥ 12", explanation: "No flip when multiplying by positive 2." },
              { text: "x ≤ 8", explanation: "6 × 2 = 12, not 8." }
            ]
          },
          {
            id: "MK6-010",
            text: "Solve: -5x - 5 < 20",
            options: [
              { text: "x > -5", explanation: "Correct! -5x < 25, then x > -5 (flip!).", correct: true },
              { text: "x < -5", explanation: "Divided by -5 means FLIP!" },
              { text: "x > 5", explanation: "25 ÷ (-5) = -5, not 5." },
              { text: "x < 5", explanation: "Two issues: 25 ÷ (-5) = -5, and flip the sign." }
            ]
          }
        ],

        quizConfig: {
          questionsPerQuiz: 5,
          passingScore: 0.8
        }
      }
    ]
  },

  // ============================================
  // WORD KNOWLEDGE
  // ============================================
  WK: {
    name: "Word Knowledge",
    description: "Vocabulary and word meanings",
    icon: "📖",
    chapters: [

      // --------------------------------------------
      // CHAPTER 1: PREFIXES
      // --------------------------------------------
      {
        id: "WK-1",
        title: "Prefixes",
        description: "Learn how prefixes change word meanings",

        lesson: {
          intro: "Prefixes are word parts added to the BEGINNING of words that change their meaning. Master these 10 prefixes and you can decode hundreds of unfamiliar words on test day.",

          concepts: [
            {
              title: "Negative Prefixes: un-, dis-, in-, im-",
              content: "These prefixes flip a word to its opposite. UN- (unhappy = not happy), DIS- (disagree = not agree), IN- (incomplete = not complete), IM- (impossible = not possible). Memory trick: IM- is used before words starting with M, P, or B."
            },
            {
              title: "Direction/Position Prefixes: re-, pre-, sub-, super-",
              content: "RE- means again or back (redo, return). PRE- means before (preview, predict). SUB- means under or below (submarine, subway). SUPER- means above or beyond (superhuman, supervisor)."
            },
            {
              title: "Other Key Prefixes: anti-, mis-",
              content: "ANTI- means against or opposite (antiwar, antibody). MIS- means wrong or badly (mistake, misunderstand). These are powerful for decoding unfamiliar words!"
            }
          ],

          examples: [
            {
              problem: "What does UNPRECEDENTED mean?",
              steps: [
                "Break it down: UN + PRECEDENT + ED",
                "UN- means not",
                "PRECEDENT means something that came before (a previous example)",
                "So UNPRECEDENTED = never having happened before, without previous example"
              ],
              tip: "When you see a long word, look for the prefix first. It often unlocks the meaning!"
            },
            {
              problem: "What does SUBSTANDARD mean?",
              steps: [
                "Break it down: SUB + STANDARD",
                "SUB- means under or below",
                "STANDARD means the normal level of quality",
                "So SUBSTANDARD = below the normal quality level"
              ],
              tip: "Think of a submarine going UNDER water to remember SUB- means under."
            }
          ],

          summary: "When you see an unfamiliar word, check for these prefixes: UN/DIS/IN/IM (not), RE (again), PRE (before), SUB (under), SUPER (above), ANTI (against), MIS (wrong). The prefix often reveals the word's core meaning."
        },

        questions: [
          {
            id: "WK1-001",
            text: "UNUSUAL most nearly means:",
            options: [
              { text: "ordinary", explanation: "This is the opposite. UN- means 'not,' so unusual means NOT ordinary." },
              { text: "rare", explanation: "Correct! UN- means 'not.' Unusual = not usual = rare or uncommon.", correct: true },
              { text: "frequent", explanation: "Frequent means happening often, which is the opposite of unusual." },
              { text: "typical", explanation: "Typical means usual or normal, which is the opposite of unusual." }
            ]
          },
          {
            id: "WK1-002",
            text: "DISCONNECT most nearly means:",
            options: [
              { text: "join", explanation: "DIS- means 'not' or 'opposite.' Disconnect is the opposite of connect/join." },
              { text: "attach", explanation: "Attach means to connect, which is the opposite of disconnect." },
              { text: "separate", explanation: "Correct! DIS- means 'opposite.' Disconnect = opposite of connect = to separate.", correct: true },
              { text: "combine", explanation: "Combine means to join together, which is the opposite of disconnect." }
            ]
          },
          {
            id: "WK1-003",
            text: "PREVIEW most nearly means:",
            options: [
              { text: "review", explanation: "RE-view means to view again. PRE-view means to view beforehand." },
              { text: "advance showing", explanation: "Correct! PRE- means 'before.' Preview = viewing something before it's released.", correct: true },
              { text: "final look", explanation: "A final look would come at the end, but PRE- means before." },
              { text: "overlook", explanation: "Overlook means to miss seeing something, not to see beforehand." }
            ]
          },
          {
            id: "WK1-004",
            text: "SUBMARINE most nearly means:",
            options: [
              { text: "aircraft", explanation: "Air- would mean related to air. SUB- means under, specifically underwater." },
              { text: "underwater vessel", explanation: "Correct! SUB- means 'under.' Marine relates to the sea. Submarine = under the sea.", correct: true },
              { text: "surface ship", explanation: "A surface ship stays on top of water, not under it like a SUB-marine." },
              { text: "spacecraft", explanation: "Space- would relate to space. SUB-marine relates to being under the sea." }
            ]
          },
          {
            id: "WK1-005",
            text: "IMPOSSIBLE most nearly means:",
            options: [
              { text: "achievable", explanation: "IM- means 'not.' Impossible is the opposite of possible/achievable." },
              { text: "likely", explanation: "Likely means probable. IM- means not, so impossible = not possible." },
              { text: "cannot be done", explanation: "Correct! IM- means 'not.' Impossible = not possible = cannot be done.", correct: true },
              { text: "easy", explanation: "Easy suggests something can be done, but impossible means it cannot." }
            ]
          },
          {
            id: "WK1-006",
            text: "ANTIFREEZE most nearly means:",
            options: [
              { text: "ice", explanation: "ANTI- means 'against.' Antifreeze works AGAINST freezing, not for it." },
              { text: "prevents freezing", explanation: "Correct! ANTI- means 'against.' Antifreeze = substance that works against freezing.", correct: true },
              { text: "causes cold", explanation: "ANTI- means against, so antifreeze prevents cold/freezing, not causes it." },
              { text: "frozen liquid", explanation: "Antifreeze prevents liquid from becoming frozen, it's not frozen itself." }
            ]
          },
          {
            id: "WK1-007",
            text: "MISPLACE most nearly means:",
            options: [
              { text: "find", explanation: "MIS- means 'wrong.' To misplace is to put something in the wrong place, not find it." },
              { text: "lose temporarily", explanation: "Correct! MIS- means 'wrong.' Misplace = put in wrong place = lose temporarily.", correct: true },
              { text: "organize", explanation: "Organizing puts things in the RIGHT place. MIS- suggests the wrong place." },
              { text: "discover", explanation: "Discover means to find. MIS-place means to lose by putting in wrong place." }
            ]
          },
          {
            id: "WK1-008",
            text: "SUPERHUMAN most nearly means:",
            options: [
              { text: "ordinary person", explanation: "SUPER- means 'above' or 'beyond.' Superhuman is beyond ordinary." },
              { text: "weak", explanation: "SUPER- means above/beyond normal. Superhuman suggests exceptional strength." },
              { text: "beyond normal abilities", explanation: "Correct! SUPER- means 'above/beyond.' Superhuman = beyond normal human abilities.", correct: true },
              { text: "average", explanation: "Average is normal. SUPER- means above or beyond normal." }
            ]
          },
          {
            id: "WK1-009",
            text: "INCOMPLETE most nearly means:",
            options: [
              { text: "finished", explanation: "IN- means 'not.' Incomplete = not complete = not finished." },
              { text: "whole", explanation: "Whole means complete. IN- means not, so incomplete = not whole." },
              { text: "unfinished", explanation: "Correct! IN- means 'not.' Incomplete = not complete = unfinished.", correct: true },
              { text: "perfect", explanation: "Perfect suggests complete. Incomplete means not complete." }
            ]
          },
          {
            id: "WK1-010",
            text: "REBUILD most nearly means:",
            options: [
              { text: "destroy", explanation: "RE- means 'again.' Rebuild means to build again, not destroy." },
              { text: "construct again", explanation: "Correct! RE- means 'again.' Rebuild = build again = construct once more.", correct: true },
              { text: "abandon", explanation: "Abandon means to leave. RE-build means to build again." },
              { text: "demolish", explanation: "Demolish means to tear down. RE-build means to build again." }
            ]
          },
          {
            id: "WK1-011",
            text: "DISAPPROVE most nearly means:",
            options: [
              { text: "accept", explanation: "DIS- means 'not' or 'opposite.' Disapprove is opposite of approve/accept." },
              { text: "reject", explanation: "Correct! DIS- means 'opposite.' Disapprove = opposite of approve = reject.", correct: true },
              { text: "support", explanation: "Support is similar to approve. DIS-approve is the opposite." },
              { text: "encourage", explanation: "Encourage shows approval. DIS- makes it the opposite." }
            ]
          },
          {
            id: "WK1-012",
            text: "PREHISTORIC most nearly means:",
            options: [
              { text: "modern", explanation: "PRE- means 'before.' Prehistoric is before history, the opposite of modern." },
              { text: "before recorded history", explanation: "Correct! PRE- means 'before.' Prehistoric = before recorded history.", correct: true },
              { text: "current", explanation: "Current means now. PRE- means before, so prehistoric = ancient times." },
              { text: "future", explanation: "Future is after now. PRE- means before, so prehistoric = long ago." }
            ]
          },
          {
            id: "WK1-013",
            text: "SUBMERGE most nearly means:",
            options: [
              { text: "float", explanation: "Float means stay on surface. SUB- means under, so submerge = go under." },
              { text: "plunge underwater", explanation: "Correct! SUB- means 'under.' Merge means to blend in. Submerge = go under water.", correct: true },
              { text: "rise", explanation: "Rise means go up. SUB- means under, so submerge = go down into water." },
              { text: "surface", explanation: "Surface means come up. SUB-merge means go under, the opposite." }
            ]
          },
          {
            id: "WK1-014",
            text: "ANTISOCIAL most nearly means:",
            options: [
              { text: "friendly", explanation: "ANTI- means 'against.' Antisocial = against being social = unfriendly." },
              { text: "outgoing", explanation: "Outgoing is very social. ANTI- means against, so antisocial is the opposite." },
              { text: "avoiding others", explanation: "Correct! ANTI- means 'against.' Antisocial = against social interaction = avoiding others.", correct: true },
              { text: "popular", explanation: "Popular suggests being social. ANTI-social means against being social." }
            ]
          },
          {
            id: "WK1-015",
            text: "MISUNDERSTAND most nearly means:",
            options: [
              { text: "comprehend", explanation: "MIS- means 'wrong.' Misunderstand = understand wrongly, not comprehend correctly." },
              { text: "interpret incorrectly", explanation: "Correct! MIS- means 'wrong.' Misunderstand = understand wrongly = interpret incorrectly.", correct: true },
              { text: "grasp clearly", explanation: "Grasping clearly is understanding correctly. MIS- means wrongly." },
              { text: "perceive accurately", explanation: "Accurate perception is correct understanding. MIS- indicates wrong understanding." }
            ]
          }
        ],

        quizConfig: {
          questionsPerQuiz: 5,
          passingScore: 0.8
        }
      },

      // --------------------------------------------
      // CHAPTER 2: ROOTS
      // --------------------------------------------
      {
        id: "WK-2",
        title: "Roots",
        description: "Master Latin and Greek word roots",

        lesson: {
          intro: "Word roots are the core meaning-carriers that appear in the middle of words. Learn these 10 roots and you'll recognize patterns in thousands of English words.",

          concepts: [
            {
              title: "Good vs. Bad: BENE- and MAL-",
              content: "BENE- means good or well (benefit, benevolent). MAL- means bad or evil (malice, malfunction). Memory trick: 'Bene' sounds like 'beneficial' and 'mal' sounds like 'malicious.'"
            },
            {
              title: "Senses: AUD- and VIS-/SPEC-",
              content: "AUD- relates to hearing (audio, audience, audible). VIS- relates to seeing (vision, visible). SPEC- also relates to seeing (spectator, inspect). Think: 'Audio' for ears, 'Visual' for eyes."
            },
            {
              title: "Communication: DICT- and SCRIB-",
              content: "DICT- relates to speaking or saying (dictate, predict, dictionary). SCRIB-/SCRIPT- relates to writing (describe, script, prescription). A dictionary tells you what words say; a script is something written."
            },
            {
              title: "Movement: PORT-, RUPT-, TRACT-",
              content: "PORT- means to carry (transport, portable). RUPT- means to break (interrupt, erupt, rupture). TRACT- means to pull or drag (tractor, attract, extract). Airports carry people; eruptions break through."
            }
          ],

          examples: [
            {
              problem: "What does MALEVOLENT mean?",
              steps: [
                "Break it down: MAL + EVOL + ENT",
                "MAL- means bad or evil",
                "The root relates to 'wishing' or 'willing' (like 'volition')",
                "So MALEVOLENT = wishing bad/evil on others = hostile, mean-spirited"
              ],
              tip: "MAL- words are almost always negative. Think 'malware' = bad software!"
            },
            {
              problem: "What does SPECTATOR mean?",
              steps: [
                "Break it down: SPEC + TAT + OR",
                "SPEC- means to see or look",
                "-OR means one who does something",
                "So SPECTATOR = one who watches = viewer"
              ],
              tip: "Think of SPECtacles (glasses) - they help you SPEC (see)!"
            }
          ],

          summary: "Key roots: BENE (good), MAL (bad), AUD (hear), VIS/SPEC (see), DICT (say), SCRIB (write), PORT (carry), RUPT (break), TRACT (pull). When you spot these in a word, you've found the meaning's core."
        },

        questions: [
          {
            id: "WK2-001",
            text: "BENEFICIAL most nearly means:",
            options: [
              { text: "harmful", explanation: "BENE- means 'good.' Beneficial = producing good effects, opposite of harmful." },
              { text: "helpful", explanation: "Correct! BENE- means 'good.' Beneficial = producing good/helpful effects.", correct: true },
              { text: "dangerous", explanation: "BENE- means good. Beneficial is positive, not dangerous." },
              { text: "useless", explanation: "Useless provides no benefit. BENE- means good/beneficial." }
            ]
          },
          {
            id: "WK2-002",
            text: "MALFUNCTION most nearly means:",
            options: [
              { text: "work properly", explanation: "MAL- means 'bad.' Malfunction = bad function = NOT working properly." },
              { text: "failure to work correctly", explanation: "Correct! MAL- means 'bad.' Malfunction = functioning badly = failure to work right.", correct: true },
              { text: "operate smoothly", explanation: "Operating smoothly is functioning well. MAL- indicates bad functioning." },
              { text: "improve", explanation: "Improve means to get better. MAL-function means to work badly." }
            ]
          },
          {
            id: "WK2-003",
            text: "AUDIBLE most nearly means:",
            options: [
              { text: "invisible", explanation: "AUD- relates to hearing, not seeing. Audible means able to be heard." },
              { text: "can be heard", explanation: "Correct! AUD- means 'to hear.' Audible = able to be heard.", correct: true },
              { text: "silent", explanation: "Silent is the opposite of audible. AUD- means hearing." },
              { text: "written", explanation: "Written relates to SCRIB-. AUD- relates to hearing." }
            ]
          },
          {
            id: "WK2-004",
            text: "VISION most nearly means:",
            options: [
              { text: "sound", explanation: "Sound relates to AUD-. VIS- relates to seeing." },
              { text: "sight", explanation: "Correct! VIS- means 'to see.' Vision = the ability to see = sight.", correct: true },
              { text: "touch", explanation: "Touch is a different sense. VIS- specifically means seeing." },
              { text: "hearing", explanation: "Hearing relates to AUD-. VIS- relates to sight." }
            ]
          },
          {
            id: "WK2-005",
            text: "DICTATE most nearly means:",
            options: [
              { text: "listen", explanation: "DICT- means 'to say.' Dictate means to speak/command, not listen." },
              { text: "command or speak for recording", explanation: "Correct! DICT- means 'to say.' Dictate = to speak commands or for someone to write down.", correct: true },
              { text: "obey", explanation: "Obey means to follow commands. DICT- means to give commands by speaking." },
              { text: "read", explanation: "Reading is input. DICT- relates to speaking/output." }
            ]
          },
          {
            id: "WK2-006",
            text: "TRANSPORT most nearly means:",
            options: [
              { text: "carry across", explanation: "Correct! TRANS- means 'across,' PORT- means 'carry.' Transport = carry from one place to another.", correct: true },
              { text: "stay in place", explanation: "PORT- means to carry/move. Transport involves movement, not staying put." },
              { text: "destroy", explanation: "RUPT- means break/destroy. PORT- means carry." },
              { text: "write down", explanation: "SCRIB- means write. PORT- means carry." }
            ]
          },
          {
            id: "WK2-007",
            text: "RUPTURE most nearly means:",
            options: [
              { text: "repair", explanation: "RUPT- means 'to break.' Rupture is the opposite of repair." },
              { text: "burst or break", explanation: "Correct! RUPT- means 'to break.' Rupture = to break open or burst.", correct: true },
              { text: "heal", explanation: "Healing is the opposite of breaking. RUPT- means break." },
              { text: "connect", explanation: "Connecting joins things. RUPT- means to break apart." }
            ]
          },
          {
            id: "WK2-008",
            text: "INSCRIPTION most nearly means:",
            options: [
              { text: "spoken words", explanation: "SCRIB- means 'to write.' An inscription is written, not spoken." },
              { text: "written words carved or engraved", explanation: "Correct! SCRIB- means 'to write.' Inscription = something written (often carved into stone/metal).", correct: true },
              { text: "loud noise", explanation: "Noise relates to AUD-. SCRIB- relates to writing." },
              { text: "picture", explanation: "A picture is drawn. SCRIB- specifically means writing." }
            ]
          },
          {
            id: "WK2-009",
            text: "ATTRACT most nearly means:",
            options: [
              { text: "push away", explanation: "TRACT- means 'to pull.' Attract = pull toward, opposite of push away." },
              { text: "draw toward", explanation: "Correct! TRACT- means 'to pull.' Attract = to draw or pull toward oneself.", correct: true },
              { text: "ignore", explanation: "Ignoring shows no interest. Attract means to pull interest toward." },
              { text: "repel", explanation: "Repel pushes away. TRACT- means pull, so attract = pull toward." }
            ]
          },
          {
            id: "WK2-010",
            text: "SPECTACLE most nearly means:",
            options: [
              { text: "secret", explanation: "A secret is hidden. SPEC- means to see - a spectacle is meant to be seen." },
              { text: "remarkable sight", explanation: "Correct! SPEC- means 'to see.' A spectacle = something impressive to look at.", correct: true },
              { text: "sound", explanation: "Sound relates to AUD-. SPEC- relates to seeing." },
              { text: "whisper", explanation: "Whisper is quiet and heard. SPEC- is about seeing, not hearing." }
            ]
          },
          {
            id: "WK2-011",
            text: "MALICE most nearly means:",
            options: [
              { text: "kindness", explanation: "MAL- means 'bad.' Malice = bad intentions, opposite of kindness." },
              { text: "intent to harm", explanation: "Correct! MAL- means 'bad.' Malice = desire to cause harm to others.", correct: true },
              { text: "generosity", explanation: "Generosity is giving/good. MAL- means bad, so malice is harmful intent." },
              { text: "love", explanation: "Love is positive. MAL- indicates bad/harmful feelings." }
            ]
          },
          {
            id: "WK2-012",
            text: "AUDITORIUM most nearly means:",
            options: [
              { text: "library", explanation: "A library is for reading (quiet). An auditorium is for AUD- (hearing performances)." },
              { text: "place for hearing performances", explanation: "Correct! AUD- means 'to hear.' An auditorium = a hall where audiences listen to performances.", correct: true },
              { text: "kitchen", explanation: "A kitchen is for cooking. AUD- relates to hearing events." },
              { text: "bedroom", explanation: "A bedroom is for sleeping. An auditorium is for hearing/watching events." }
            ]
          },
          {
            id: "WK2-013",
            text: "PORTABLE most nearly means:",
            options: [
              { text: "heavy", explanation: "Heavy things are hard to carry. PORT- = carry, so portable = easy to carry." },
              { text: "able to be carried", explanation: "Correct! PORT- means 'to carry.' Portable = able to be carried around easily.", correct: true },
              { text: "permanent", explanation: "Permanent means fixed in place. PORT- means moveable/carryable." },
              { text: "stationary", explanation: "Stationary stays still. PORT- means to carry/move." }
            ]
          },
          {
            id: "WK2-014",
            text: "PREDICT most nearly means:",
            options: [
              { text: "remember", explanation: "Remember is about the past. PRE- (before) + DICT (say) = say beforehand." },
              { text: "forecast", explanation: "Correct! PRE- means 'before,' DICT- means 'to say.' Predict = to say what will happen before it does.", correct: true },
              { text: "deny", explanation: "Deny means to say no. Predict means to say what will happen in the future." },
              { text: "describe the past", explanation: "PRE- means before (future). Predict is about what will happen." }
            ]
          },
          {
            id: "WK2-015",
            text: "EXTRACT most nearly means:",
            options: [
              { text: "insert", explanation: "EX- means 'out,' TRACT- means 'pull.' Extract = pull out, opposite of insert." },
              { text: "pull out", explanation: "Correct! EX- means 'out,' TRACT- means 'to pull.' Extract = to pull or take out.", correct: true },
              { text: "push in", explanation: "TRACT- means pull. Ex-tract = pull out, opposite of push in." },
              { text: "leave alone", explanation: "Extract involves taking action to remove something." }
            ]
          }
        ],

        quizConfig: {
          questionsPerQuiz: 5,
          passingScore: 0.8
        }
      },

      // --------------------------------------------
      // CHAPTER 3: SUFFIXES
      // --------------------------------------------
      {
        id: "WK-3",
        title: "Suffixes",
        description: "Learn how suffixes change word meanings and parts of speech",

        lesson: {
          intro: "Suffixes are word parts added to the END of words. They often tell you what PART OF SPEECH a word is (noun, verb, adjective, adverb). This helps you eliminate wrong answers on the ASVAB!",

          concepts: [
            {
              title: "Noun Suffixes: -tion, -ness, -ment",
              content: "-TION turns verbs into nouns (educate → education). -NESS turns adjectives into nouns (happy → happiness). -MENT also turns verbs into nouns (develop → development). These words are things or concepts."
            },
            {
              title: "Adjective Suffixes: -able, -ible, -ous, -ful, -less",
              content: "-ABLE/-IBLE means 'can be' (readable = can be read, visible = can be seen). -OUS means 'full of' (dangerous = full of danger). -FUL means 'having' (careful = having care). -LESS means 'without' (careless = without care)."
            },
            {
              title: "How Suffixes Help on Tests",
              content: "If a question asks for a word meaning 'full of courage,' look for answers ending in -OUS or -FUL. If it asks for 'unable to be seen,' look for something with IN-/IM- (not) and -IBLE (can be) = invisible."
            }
          ],

          examples: [
            {
              problem: "What does JOYFUL mean?",
              steps: [
                "Break it down: JOY + FUL",
                "-FUL means 'full of' or 'having'",
                "JOY is the base word meaning happiness",
                "So JOYFUL = full of joy = very happy"
              ],
              tip: "-FUL and -LESS are opposites! Joyful = happy, joyless = sad."
            },
            {
              problem: "What does COMPREHENSIBLE mean?",
              steps: [
                "Break it down: COMPREHENS + IBLE",
                "-IBLE means 'able to be'",
                "COMPREHEND means to understand",
                "So COMPREHENSIBLE = able to be understood = understandable"
              ],
              tip: "Remember: -ABLE and -IBLE sound similar and mean the same thing!"
            }
          ],

          summary: "Noun endings: -tion, -ness, -ment. Adjective endings: -able/-ible (can be), -ous (full of), -ful (having), -less (without). Knowing the part of speech helps you pick the right synonym!"
        },

        questions: [
          {
            id: "WK3-001",
            text: "HAPPINESS most nearly means:",
            options: [
              { text: "sadness", explanation: "-NESS creates a noun from 'happy.' Happiness is the opposite of sadness." },
              { text: "joy", explanation: "Correct! -NESS turns 'happy' into a noun. Happiness = the state of being happy = joy.", correct: true },
              { text: "anger", explanation: "Anger is a negative emotion. Happiness is a positive state." },
              { text: "fear", explanation: "Fear is worry/anxiety. Happiness is positive contentment." }
            ]
          },
          {
            id: "WK3-002",
            text: "READABLE most nearly means:",
            options: [
              { text: "illegible", explanation: "-ABLE means 'can be.' Readable = can be read, opposite of illegible." },
              { text: "clear enough to read", explanation: "Correct! -ABLE means 'can be.' Readable = able to be read = legible, clear.", correct: true },
              { text: "confusing", explanation: "Confusing text is hard to read. Readable means easy to read." },
              { text: "written in code", explanation: "Code is hard to read. -ABLE indicates ability to be read." }
            ]
          },
          {
            id: "WK3-003",
            text: "DANGEROUS most nearly means:",
            options: [
              { text: "safe", explanation: "-OUS means 'full of.' Dangerous = full of danger, opposite of safe." },
              { text: "risky", explanation: "Correct! -OUS means 'full of.' Dangerous = full of danger = risky, hazardous.", correct: true },
              { text: "harmless", explanation: "Harmless means no danger. -OUS means full of danger." },
              { text: "protected", explanation: "Protected means safe. Dangerous means full of risk." }
            ]
          },
          {
            id: "WK3-004",
            text: "DEVELOPMENT most nearly means:",
            options: [
              { text: "destruction", explanation: "-MENT makes a noun from 'develop.' Development is growth, not destruction." },
              { text: "growth or progress", explanation: "Correct! -MENT turns 'develop' into a noun. Development = the process of growing/improving.", correct: true },
              { text: "decline", explanation: "Decline is the opposite of development/growth." },
              { text: "stagnation", explanation: "Stagnation means no change. Development means progress." }
            ]
          },
          {
            id: "WK3-005",
            text: "CARELESS most nearly means:",
            options: [
              { text: "cautious", explanation: "-LESS means 'without.' Careless = without care, opposite of cautious." },
              { text: "negligent", explanation: "Correct! -LESS means 'without.' Careless = without care = negligent, reckless.", correct: true },
              { text: "careful", explanation: "Careful has -FUL (having care). Careless has -LESS (without care)." },
              { text: "attentive", explanation: "Attentive means paying attention. Careless means not paying attention." }
            ]
          },
          {
            id: "WK3-006",
            text: "EDUCATION most nearly means:",
            options: [
              { text: "ignorance", explanation: "-TION makes 'educate' a noun. Education is the opposite of ignorance." },
              { text: "learning", explanation: "Correct! -TION turns 'educate' into a noun. Education = the process of learning.", correct: true },
              { text: "confusion", explanation: "Education brings clarity, not confusion." },
              { text: "forgetting", explanation: "Education is about gaining knowledge, not losing it." }
            ]
          },
          {
            id: "WK3-007",
            text: "VISIBLE most nearly means:",
            options: [
              { text: "hidden", explanation: "-IBLE means 'can be.' Visible = can be seen, opposite of hidden." },
              { text: "able to be seen", explanation: "Correct! -IBLE means 'able to be.' Visible = able to be seen.", correct: true },
              { text: "invisible", explanation: "IN-visible = NOT visible. Visible means can be seen." },
              { text: "dark", explanation: "Dark hides things. Visible means able to be seen." }
            ]
          },
          {
            id: "WK3-008",
            text: "POWERFUL most nearly means:",
            options: [
              { text: "weak", explanation: "-FUL means 'having' or 'full of.' Powerful = full of power, opposite of weak." },
              { text: "strong", explanation: "Correct! -FUL means 'full of.' Powerful = full of power = strong, mighty.", correct: true },
              { text: "powerless", explanation: "-LESS means without. PowerLESS = without power, opposite of powerFUL." },
              { text: "timid", explanation: "Timid means fearful/weak. Powerful means strong." }
            ]
          },
          {
            id: "WK3-009",
            text: "ENJOYMENT most nearly means:",
            options: [
              { text: "misery", explanation: "-MENT turns 'enjoy' into a noun. Enjoyment is the opposite of misery." },
              { text: "pleasure", explanation: "Correct! -MENT turns 'enjoy' into a noun. Enjoyment = the state of enjoying = pleasure.", correct: true },
              { text: "boredom", explanation: "Boredom is lack of enjoyment. Enjoyment is pleasure." },
              { text: "suffering", explanation: "Suffering is pain. Enjoyment is pleasure." }
            ]
          },
          {
            id: "WK3-010",
            text: "COURAGEOUS most nearly means:",
            options: [
              { text: "cowardly", explanation: "-OUS means 'full of.' Courageous = full of courage, opposite of cowardly." },
              { text: "brave", explanation: "Correct! -OUS means 'full of.' Courageous = full of courage = brave, fearless.", correct: true },
              { text: "afraid", explanation: "Afraid means having fear. Courageous means having courage, not fear." },
              { text: "nervous", explanation: "Nervous is anxious. Courageous means confident and brave." }
            ]
          },
          {
            id: "WK3-011",
            text: "DARKNESS most nearly means:",
            options: [
              { text: "brightness", explanation: "-NESS turns 'dark' into a noun. Darkness is the opposite of brightness." },
              { text: "absence of light", explanation: "Correct! -NESS creates a noun. Darkness = the state of being dark = lack of light.", correct: true },
              { text: "sunshine", explanation: "Sunshine is light. Darkness is the absence of light." },
              { text: "clarity", explanation: "Clarity is clearness. Darkness suggests obscurity." }
            ]
          },
          {
            id: "WK3-012",
            text: "ACCEPTABLE most nearly means:",
            options: [
              { text: "rejected", explanation: "-ABLE means 'can be.' Acceptable = can be accepted, opposite of rejected." },
              { text: "satisfactory", explanation: "Correct! -ABLE means 'can be.' Acceptable = able to be accepted = satisfactory, adequate.", correct: true },
              { text: "unacceptable", explanation: "UN- makes it opposite. AcceptABLE = can be accepted." },
              { text: "forbidden", explanation: "Forbidden cannot be accepted. Acceptable can be." }
            ]
          }
        ],

        quizConfig: {
          questionsPerQuiz: 5,
          passingScore: 0.8
        }
      },

      // --------------------------------------------
      // CHAPTER 4: TEST STRATEGY & HIGH-FREQUENCY WORDS
      // --------------------------------------------
      {
        id: "WK-4",
        title: "Test Strategy & High-Frequency Words",
        description: "Learn test-taking tactics and master common ASVAB vocabulary",

        lesson: {
          intro: "Beyond word parts, smart test strategy can boost your score. This chapter teaches you to identify word tone, use elimination, and master 15 high-frequency ASVAB words.",

          concepts: [
            {
              title: "Positive vs. Negative Tone",
              content: "Every word has a 'feeling.' POSITIVE: beneficial, exemplary, diligent, prudent. NEGATIVE: detrimental, negligent, malicious, obsolete. If you know the tone, you can eliminate half the wrong answers immediately!"
            },
            {
              title: "Process of Elimination",
              content: "Don't know the answer? Eliminate what you DO know is wrong. If the test word is positive, cross out negative choices. If it's about seeing (VIS-), eliminate hearing words (AUD-). Even guessing from 2 options is better than 4!"
            },
            {
              title: "Context and Word Families",
              content: "Think of related words you know. Don't know 'benevolent'? Think 'benefit' — both have BENE- (good). Don't know 'verbose'? Think 'verb' (words) — verbose means using too many words."
            },
            {
              title: "High-Frequency Words",
              content: "Some words appear repeatedly on the ASVAB: DILIGENT (hardworking), PRUDENT (careful/wise), AMPLE (plenty), CONCISE (brief), OBSOLETE (outdated), FEASIBLE (possible), VERIFY (confirm), AMBIGUOUS (unclear)."
            }
          ],

          examples: [
            {
              problem: "DETRIMENTAL most nearly means:",
              steps: [
                "First, determine the tone: DETRIMENTAL sounds negative (like 'detriment' = harm)",
                "Eliminate positive-sounding answers",
                "The answer must be negative like: harmful, damaging",
                "DETRIMENTAL = causing harm"
              ],
              tip: "Words with DE- often have negative meanings (destroy, decline, defeat)."
            },
            {
              problem: "You don't know what METICULOUS means. The choices are: A) sloppy B) careful C) angry D) fast",
              steps: [
                "Think of related words: 'meticulous' sounds like it might relate to 'meter' or measurement",
                "Someone who measures carefully is precise, detailed",
                "Eliminate: sloppy (opposite vibe), angry (unrelated), fast (unrelated to precision)",
                "Best guess: careful (B)"
              ],
              tip: "Even if you're not sure, eliminating obviously wrong answers improves your odds!"
            }
          ],

          summary: "Strategy tips: (1) Identify positive/negative tone first, (2) Eliminate answers with wrong tone, (3) Look for familiar word parts, (4) Think of word families. High-frequency words: diligent, prudent, ample, concise, obsolete, feasible, verify, ambiguous, enhance, diminish."
        },

        questions: [
          {
            id: "WK4-001",
            text: "DILIGENT most nearly means:",
            options: [
              { text: "lazy", explanation: "Diligent is positive (hardworking). Lazy is the opposite." },
              { text: "hardworking", explanation: "Correct! Diligent = showing careful, persistent effort = hardworking. A diligent student studies consistently.", correct: true },
              { text: "careless", explanation: "Careless is negative. Diligent is positive and means careful effort." },
              { text: "impatient", explanation: "Impatient suggests rushing. Diligent means steady, careful work." }
            ]
          },
          {
            id: "WK4-002",
            text: "PRUDENT most nearly means:",
            options: [
              { text: "reckless", explanation: "Reckless is careless. Prudent means careful and wise." },
              { text: "wise and careful", explanation: "Correct! Prudent = showing good judgment, avoiding unnecessary risks. A prudent decision is a smart one.", correct: true },
              { text: "foolish", explanation: "Foolish is the opposite of prudent. Prudent means wise." },
              { text: "hasty", explanation: "Hasty means too quick. Prudent means thoughtful and careful." }
            ]
          },
          {
            id: "WK4-003",
            text: "AMPLE most nearly means:",
            options: [
              { text: "scarce", explanation: "Scarce means not enough. Ample means more than enough." },
              { text: "plenty", explanation: "Correct! Ample = more than enough, generous in quantity. 'Ample time' means plenty of time.", correct: true },
              { text: "tiny", explanation: "Tiny is small. Ample suggests large or sufficient amount." },
              { text: "insufficient", explanation: "Insufficient = not enough. Ample = more than enough." }
            ]
          },
          {
            id: "WK4-004",
            text: "CONCISE most nearly means:",
            options: [
              { text: "wordy", explanation: "Wordy uses too many words. Concise means brief and to the point." },
              { text: "brief and clear", explanation: "Correct! Concise = expressing much in few words = brief but comprehensive. Good writing is concise.", correct: true },
              { text: "lengthy", explanation: "Lengthy is long. Concise is short but complete." },
              { text: "vague", explanation: "Vague is unclear. Concise is clear AND brief." }
            ]
          },
          {
            id: "WK4-005",
            text: "OBSOLETE most nearly means:",
            options: [
              { text: "modern", explanation: "Modern is current. Obsolete means no longer in use." },
              { text: "outdated", explanation: "Correct! Obsolete = no longer used or needed, out of date. VHS tapes are obsolete technology.", correct: true },
              { text: "current", explanation: "Current means up-to-date. Obsolete is the opposite." },
              { text: "advanced", explanation: "Advanced is cutting-edge. Obsolete is old and unused." }
            ]
          },
          {
            id: "WK4-006",
            text: "FEASIBLE most nearly means:",
            options: [
              { text: "impossible", explanation: "Impossible cannot be done. Feasible means it CAN be done." },
              { text: "possible to accomplish", explanation: "Correct! Feasible = capable of being done, practical. 'Is this plan feasible?' = Can we actually do it?", correct: true },
              { text: "unlikely", explanation: "Unlikely suggests low probability. Feasible means practically doable." },
              { text: "prohibited", explanation: "Prohibited means not allowed. Feasible means possible to do." }
            ]
          },
          {
            id: "WK4-007",
            text: "VERIFY most nearly means:",
            options: [
              { text: "disprove", explanation: "Disprove shows something is false. Verify shows it's true." },
              { text: "confirm as true", explanation: "Correct! Verify = to check and confirm accuracy. 'Verify your information' = make sure it's correct.", correct: true },
              { text: "deny", explanation: "Deny rejects a claim. Verify confirms it." },
              { text: "guess", explanation: "Guessing is uncertain. Verifying means checking to be certain." }
            ]
          },
          {
            id: "WK4-008",
            text: "AMBIGUOUS most nearly means:",
            options: [
              { text: "clear", explanation: "Clear is easy to understand. Ambiguous is unclear, having multiple meanings." },
              { text: "unclear or having multiple meanings", explanation: "Correct! Ambiguous = open to more than one interpretation, vague. An ambiguous answer could mean several things.", correct: true },
              { text: "obvious", explanation: "Obvious is easy to see. Ambiguous is uncertain." },
              { text: "definite", explanation: "Definite is certain. Ambiguous is uncertain." }
            ]
          },
          {
            id: "WK4-009",
            text: "ENHANCE most nearly means:",
            options: [
              { text: "diminish", explanation: "Diminish means to reduce. Enhance means to increase/improve." },
              { text: "improve", explanation: "Correct! Enhance = to increase or improve quality. 'Enhance the flavor' = make it taste better.", correct: true },
              { text: "destroy", explanation: "Destroy is negative. Enhance is positive (make better)." },
              { text: "ignore", explanation: "Ignore means to pay no attention. Enhance means to actively improve." }
            ]
          },
          {
            id: "WK4-010",
            text: "DIMINISH most nearly means:",
            options: [
              { text: "increase", explanation: "Increase makes larger. Diminish makes smaller." },
              { text: "decrease", explanation: "Correct! Diminish = to make or become smaller/less. 'Her enthusiasm diminished' = it became less.", correct: true },
              { text: "expand", explanation: "Expand grows larger. Diminish grows smaller." },
              { text: "enhance", explanation: "Enhance improves/increases. Diminish reduces." }
            ]
          },
          {
            id: "WK4-011",
            text: "COMPREHEND most nearly means:",
            options: [
              { text: "confuse", explanation: "Confuse is not understanding. Comprehend IS understanding." },
              { text: "understand", explanation: "Correct! Comprehend = to grasp mentally, understand fully. 'Comprehend the material' = understand it.", correct: true },
              { text: "forget", explanation: "Forget loses information. Comprehend gains understanding." },
              { text: "ignore", explanation: "Ignore means to not pay attention. Comprehend means to mentally grasp." }
            ]
          },
          {
            id: "WK4-012",
            text: "ELABORATE most nearly means:",
            options: [
              { text: "simple", explanation: "Simple is basic. Elaborate means detailed or complex." },
              { text: "detailed and complex", explanation: "Correct! Elaborate = marked by complexity and detail. An elaborate plan has many parts.", correct: true },
              { text: "brief", explanation: "Brief is short. Elaborate is extended and detailed." },
              { text: "plain", explanation: "Plain is basic. Elaborate is fancy and complex." }
            ]
          },
          {
            id: "WK4-013",
            text: "INEVITABLE most nearly means:",
            options: [
              { text: "avoidable", explanation: "Avoidable can be prevented. Inevitable cannot be avoided." },
              { text: "certain to happen", explanation: "Correct! Inevitable = unavoidable, certain to occur. Death is inevitable = it will definitely happen.", correct: true },
              { text: "unlikely", explanation: "Unlikely might not happen. Inevitable WILL happen." },
              { text: "preventable", explanation: "Preventable can be stopped. Inevitable cannot be stopped." }
            ]
          },
          {
            id: "WK4-014",
            text: "PROFICIENT most nearly means:",
            options: [
              { text: "incompetent", explanation: "Incompetent lacks skill. Proficient has skill." },
              { text: "skilled", explanation: "Correct! Proficient = competent and skilled through practice. 'Proficient in Spanish' = skilled at Spanish.", correct: true },
              { text: "amateur", explanation: "Amateur is a beginner. Proficient is advanced/skilled." },
              { text: "inexperienced", explanation: "Inexperienced lacks practice. Proficient has developed skill." }
            ]
          },
          {
            id: "WK4-015",
            text: "DETRIMENTAL most nearly means:",
            options: [
              { text: "beneficial", explanation: "Beneficial is helpful. Detrimental is harmful — the opposite." },
              { text: "harmful", explanation: "Correct! Detrimental = causing damage or harm. 'Smoking is detrimental to health' = it causes harm.", correct: true },
              { text: "helpful", explanation: "Helpful is positive. Detrimental is negative (causing harm)." },
              { text: "neutral", explanation: "Neutral has no effect. Detrimental has a negative effect." }
            ]
          }
        ],

        quizConfig: {
          questionsPerQuiz: 5,
          passingScore: 0.8
        }
      }
    ]
  },

  // ============================================
  // PARAGRAPH COMPREHENSION
  // ============================================
  PC: {
    name: "Paragraph Comprehension",
    description: "Reading comprehension and analysis",
    icon: "📖",
    chapters: [

      // --------------------------------------------
      // CHAPTER 1: MAIN IDEA
      // --------------------------------------------
      {
        id: "PC-1",
        title: "Finding the Main Idea",
        description: "Identify the central theme of a passage",

        lesson: {
          intro: "Every passage has ONE main idea — the central point the author wants you to understand. Everything else is just support. Your job is to find that core message.",

          concepts: [
            {
              title: "What IS the Main Idea?",
              content: "The main idea is what the passage is mostly about. Not a detail. Not an example. The BIG PICTURE message."
            },
            {
              title: "Where to Find It",
              content: "Check the first and last sentences of the passage. Authors usually state their main point at the beginning or wrap it up at the end."
            },
            {
              title: "Too Broad vs. Too Narrow",
              content: "Wrong answers are often too broad (covers more than the passage) or too narrow (just one detail). The right answer covers exactly what's in the passage."
            }
          ],

          examples: [
            {
              problem: "How to approach a main idea question",
              steps: [
                "Read the entire passage first",
                "Ask: 'What is this passage mostly about?'",
                "Check the first and last sentences",
                "Eliminate answers that are too broad or too narrow"
              ],
              tip: "If an answer only covers one paragraph or one example, it's probably too narrow."
            }
          ],

          summary: "The main idea = what the passage is mostly about. Look at first/last sentences. Avoid answers that are too broad or too narrow."
        },

        questions: [
          {
            id: "PC1-001",
            text: "The bald eagle was once on the brink of extinction in the United States. By 1963, only 417 nesting pairs remained in the lower 48 states. The decline was caused primarily by the pesticide DDT, which weakened eagle eggshells. After DDT was banned in 1972 and conservation efforts intensified, eagle populations recovered dramatically. Today, there are over 300,000 bald eagles in North America.\n\nWhat is the main idea of this passage?",
            options: [
              { text: "Bald eagle populations have recovered after near extinction", explanation: "Correct! The passage traces the decline and recovery of bald eagles — that's the central story.", correct: true },
              { text: "DDT was banned in 1972", explanation: "This is a detail that supports the main idea, not the main idea itself." },
              { text: "There are 300,000 bald eagles today", explanation: "This is just the final statistic. The main idea is the full recovery story." },
              { text: "Pesticides are harmful to all birds", explanation: "Too broad — the passage is specifically about bald eagles, not all birds." }
            ]
          },
          {
            id: "PC1-002",
            text: "Sleep is essential for memory consolidation. During sleep, the brain processes and stores information from the day. Studies show that people who sleep after learning new material retain it better than those who stay awake. Deep sleep, in particular, helps transfer memories from short-term to long-term storage.\n\nWhat is the main idea of this passage?",
            options: [
              { text: "Sleep plays a crucial role in forming memories", explanation: "Correct! Every sentence supports this central point about sleep and memory.", correct: true },
              { text: "Deep sleep is the most important sleep stage", explanation: "Too narrow — deep sleep is mentioned as one supporting detail, but the passage is about sleep and memory overall." },
              { text: "People should study before bed", explanation: "This might be implied, but it's not stated as the main idea." },
              { text: "The brain is active during sleep", explanation: "True but too vague — the passage specifically focuses on memory, not general brain activity." }
            ]
          },
          {
            id: "PC1-003",
            text: "The ancient Egyptians developed one of the first writing systems, called hieroglyphics. These symbols represented sounds, words, and ideas. Hieroglyphics were used for religious texts, royal decrees, and tomb inscriptions. Scribes spent years learning the thousands of symbols. The Rosetta Stone, discovered in 1799, finally allowed modern scholars to decode this ancient script.\n\nWhat is the main idea of this passage?",
            options: [
              { text: "Hieroglyphics was an important ancient Egyptian writing system", explanation: "Correct! The passage provides an overview of hieroglyphics — what they were, how they were used, and how we decoded them.", correct: true },
              { text: "The Rosetta Stone was discovered in 1799", explanation: "This is a supporting detail at the end, not the main idea." },
              { text: "Scribes had to study for many years", explanation: "This is one detail about scribes, not the central point of the passage." },
              { text: "Writing systems are important for civilization", explanation: "Too broad — the passage is specifically about Egyptian hieroglyphics." }
            ]
          },
          {
            id: "PC1-004",
            text: "Honeybees communicate the location of food sources through a unique 'waggle dance.' When a bee finds flowers, it returns to the hive and performs a figure-eight dance. The angle of the dance indicates direction relative to the sun, while the duration shows distance. Other bees observe the dance and then fly directly to the food source.\n\nWhat is the main idea of this passage?",
            options: [
              { text: "Honeybees use dance to communicate food locations", explanation: "Correct! The entire passage explains this communication method.", correct: true },
              { text: "Bees perform a figure-eight dance", explanation: "This is a detail about HOW they dance, not the main point." },
              { text: "Bees are intelligent insects", explanation: "This might be implied but is too vague. The passage is specifically about dance communication." },
              { text: "The sun helps bees navigate", explanation: "This is one detail about how the dance works, not the main idea." }
            ]
          },
          {
            id: "PC1-005",
            text: "The Great Wall of China was not built all at once. Construction began over 2,000 years ago during the Qin Dynasty and continued for centuries under different rulers. Various walls were eventually connected and reinforced during the Ming Dynasty. The wall stretches approximately 13,000 miles and was built primarily to protect against northern invasions.\n\nWhat is the main idea of this passage?",
            options: [
              { text: "The Great Wall was built gradually over many centuries", explanation: "Correct! The passage emphasizes the long timeline of construction across multiple dynasties.", correct: true },
              { text: "The wall is 13,000 miles long", explanation: "This is a supporting detail, not the main idea." },
              { text: "The Ming Dynasty improved the wall", explanation: "This is one detail in the construction timeline." },
              { text: "China needed protection from invaders", explanation: "This explains WHY it was built, but the main idea is about HOW it was built over time." }
            ]
          },
          {
            id: "PC1-006",
            text: "Regular exercise has been shown to reduce symptoms of depression and anxiety. Physical activity triggers the release of endorphins, chemicals that create feelings of happiness. Exercise also reduces levels of stress hormones like cortisol. Even a 30-minute walk can improve mood significantly.\n\nWhat is the main idea of this passage?",
            options: [
              { text: "Exercise improves mental health", explanation: "Correct! Every sentence supports this central point about exercise and mental well-being.", correct: true },
              { text: "Endorphins make people happy", explanation: "This is one mechanism explained in the passage, not the main point." },
              { text: "Walking for 30 minutes is enough exercise", explanation: "This is a specific example, not the main idea." },
              { text: "Cortisol is a stress hormone", explanation: "This is a detail that supports the main point." }
            ]
          },
          {
            id: "PC1-007",
            text: "The Hubble Space Telescope has revolutionized our understanding of the universe since its launch in 1990. It has captured images of distant galaxies billions of light-years away, helped determine the age of the universe, and discovered new moons orbiting Pluto. Operating above Earth's atmosphere, Hubble provides clearer images than ground-based telescopes.\n\nWhat is the main idea of this passage?",
            options: [
              { text: "The Hubble Telescope has greatly advanced astronomy", explanation: "Correct! The passage describes multiple major contributions Hubble has made to our understanding of space.", correct: true },
              { text: "Hubble was launched in 1990", explanation: "This is background information, not the main idea." },
              { text: "Space telescopes are better than ground telescopes", explanation: "This is mentioned but isn't the central focus of the passage." },
              { text: "Pluto has multiple moons", explanation: "This is one detail among several discoveries mentioned." }
            ]
          },
          {
            id: "PC1-008",
            text: "Coral reefs support about 25% of all marine species despite covering less than 1% of the ocean floor. These underwater ecosystems provide food, shelter, and breeding grounds for thousands of fish species. Reefs also protect coastlines from storms and erosion. However, rising ocean temperatures and pollution threaten coral survival worldwide.\n\nWhat is the main idea of this passage?",
            options: [
              { text: "Coral reefs are vital ecosystems that face serious threats", explanation: "Correct! The passage explains the importance of reefs AND the threats they face.", correct: true },
              { text: "25% of marine species live in coral reefs", explanation: "This is a supporting statistic, not the main idea." },
              { text: "Climate change is harming the oceans", explanation: "Too broad — the passage focuses specifically on coral reefs." },
              { text: "Fish need shelter to survive", explanation: "This is one benefit reefs provide, not the main point." }
            ]
          },
          {
            id: "PC1-009",
            text: "Leonardo da Vinci kept detailed notebooks throughout his life, writing in mirror script that reads right to left. Historians believe he may have used this technique to keep his ideas private or simply because, as a left-handed writer, it prevented smudging. His notebooks contain sketches of inventions, anatomical studies, and artistic concepts that were centuries ahead of their time.\n\nWhat is the main idea of this passage?",
            options: [
              { text: "Leonardo da Vinci's notebooks reveal his remarkable intellect", explanation: "Correct! The passage focuses on his notebooks and what they contained.", correct: true },
              { text: "Da Vinci wrote backwards", explanation: "This is an interesting detail, but the main idea is about the notebooks' content and significance." },
              { text: "Left-handed people write differently", explanation: "This is mentioned as a possible reason for his writing style, not the main idea." },
              { text: "Da Vinci was a great inventor", explanation: "Implied but too narrow — the passage covers his notebooks broadly, including art and anatomy." }
            ]
          },
          {
            id: "PC1-010",
            text: "The human body contains trillions of bacteria, most of which are beneficial. These microorganisms help digest food, produce vitamins, and protect against harmful pathogens. The gut microbiome, in particular, influences immune function and may even affect mood and mental health. Scientists are only beginning to understand the complex relationship between humans and their bacterial partners.\n\nWhat is the main idea of this passage?",
            options: [
              { text: "Bacteria in our bodies play important beneficial roles", explanation: "Correct! The passage describes multiple ways bacteria help humans.", correct: true },
              { text: "There are trillions of bacteria in the body", explanation: "This is the opening fact, not the main idea." },
              { text: "Gut bacteria affect mental health", explanation: "This is one specific point, not the main idea." },
              { text: "Scientists are studying bacteria", explanation: "This is mentioned at the end but isn't the central point." }
            ]
          }
        ],

        quizConfig: {
          questionsPerQuiz: 5,
          passingScore: 0.8
        }
      },

      // --------------------------------------------
      // CHAPTER 2: DETAIL QUESTIONS
      // --------------------------------------------
      {
        id: "PC-2",
        title: "Finding Details",
        description: "Locate specific information in passages",

        lesson: {
          intro: "Detail questions ask about specific facts stated in the passage. The answer is always IN the text — you just need to find it.",

          concepts: [
            {
              title: "Spot the Question Type",
              content: "Detail questions often use phrases like: 'According to the passage...', 'The author states...', 'Which of the following is true...'"
            },
            {
              title: "Go Back to the Passage",
              content: "Don't rely on memory! Scan the passage for keywords from the question. The answer is stated directly in the text."
            },
            {
              title: "Watch for Traps",
              content: "Wrong answers often: (1) use words from the passage but change the meaning, (2) state the opposite, or (3) add information not in the passage."
            }
          ],

          examples: [
            {
              problem: "How to answer detail questions",
              steps: [
                "Read the question carefully — what fact is it asking for?",
                "Identify keywords from the question",
                "Scan the passage for those keywords",
                "Find the sentence with the answer",
                "Match it to the correct answer choice"
              ],
              tip: "The answer is ALWAYS stated in the passage. If you can't point to where it says it, it's wrong."
            }
          ],

          summary: "Detail questions have answers stated directly in the text. Use keywords to locate the information. Don't pick answers that add or change information."
        },

        questions: [
          {
            id: "PC2-001",
            text: "The Amazon River is the second longest river in the world, stretching approximately 4,000 miles through South America. However, it carries more water than any other river — about 20% of all freshwater that flows into the world's oceans. The Amazon basin is home to the world's largest rainforest, covering 2.7 million square miles.\n\nAccording to the passage, what percentage of freshwater flowing into oceans comes from the Amazon?",
            options: [
              { text: "20%", explanation: "Correct! The passage states 'about 20% of all freshwater that flows into the world's oceans.'", correct: true },
              { text: "4,000%", explanation: "4,000 is the river's length in miles, not a percentage." },
              { text: "2.7%", explanation: "2.7 million is the size of the basin in square miles, not a percentage of freshwater." },
              { text: "The passage doesn't say", explanation: "It does say — 'about 20% of all freshwater that flows into the world's oceans.'" }
            ]
          },
          {
            id: "PC2-002",
            text: "The first successful vaccine was developed by Edward Jenner in 1796. He noticed that milkmaids who had contracted cowpox seemed immune to smallpox. Jenner tested his theory by inoculating a young boy with cowpox material, then exposing him to smallpox. The boy did not develop the disease, proving the vaccine worked.\n\nAccording to the passage, who developed the first successful vaccine?",
            options: [
              { text: "Edward Jenner", explanation: "Correct! The first sentence states 'The first successful vaccine was developed by Edward Jenner.'", correct: true },
              { text: "A milkmaid", explanation: "Milkmaids are mentioned as having natural immunity, but they didn't develop the vaccine." },
              { text: "A young boy", explanation: "The boy was the test subject, not the developer." },
              { text: "The passage doesn't give a name", explanation: "It clearly states Edward Jenner in the first sentence." }
            ]
          },
          {
            id: "PC2-003",
            text: "Glass is made primarily from silica sand, which is heated to about 3,090 degrees Fahrenheit until it melts. Other ingredients like soda ash and limestone are added to lower the melting point and increase durability. The molten glass can be shaped, blown, or molded before it cools and hardens.\n\nAccording to the passage, what is the main ingredient in glass?",
            options: [
              { text: "Silica sand", explanation: "Correct! The passage states 'Glass is made primarily from silica sand.'", correct: true },
              { text: "Soda ash", explanation: "Soda ash is an added ingredient, not the primary one." },
              { text: "Limestone", explanation: "Limestone is also an added ingredient." },
              { text: "Heat", explanation: "Heat is used in the process but isn't an ingredient." }
            ]
          },
          {
            id: "PC2-004",
            text: "The International Space Station orbits Earth at an altitude of approximately 250 miles. It travels at 17,500 miles per hour, completing one orbit every 90 minutes. Astronauts aboard the ISS experience 16 sunrises and sunsets each day due to this rapid orbit.\n\nHow long does it take the ISS to orbit Earth once?",
            options: [
              { text: "90 minutes", explanation: "Correct! The passage states it 'complet[es] one orbit every 90 minutes.'", correct: true },
              { text: "16 hours", explanation: "16 is the number of sunrises/sunsets, not the orbit time." },
              { text: "250 minutes", explanation: "250 is the altitude in miles, not the orbit time." },
              { text: "24 hours", explanation: "This would mean one orbit per day, but the passage says 90 minutes." }
            ]
          },
          {
            id: "PC2-005",
            text: "Octopuses have three hearts and blue blood. Two hearts pump blood to the gills, while the third pumps it to the rest of the body. Their blood contains copper-based hemocyanin instead of iron-based hemoglobin, which gives it a blue color and works better in cold, low-oxygen ocean environments.\n\nWhy is octopus blood blue?",
            options: [
              { text: "It contains copper-based hemocyanin", explanation: "Correct! The passage states their blood 'contains copper-based hemocyanin instead of iron-based hemoglobin, which gives it a blue color.'", correct: true },
              { text: "They have three hearts", explanation: "The number of hearts doesn't determine blood color." },
              { text: "They live in cold water", explanation: "The cold environment is why hemocyanin works well, not why blood is blue." },
              { text: "They need more oxygen", explanation: "Actually, hemocyanin works in LOW-oxygen environments." }
            ]
          },
          {
            id: "PC2-006",
            text: "Mount Everest, located in the Himalayas on the border between Nepal and Tibet, stands at 29,032 feet above sea level. The mountain was first summited in 1953 by Edmund Hillary and Tenzing Norgay. The climbing season typically runs from April to May, when weather conditions are most favorable.\n\nWhen was Mount Everest first climbed?",
            options: [
              { text: "1953", explanation: "Correct! The passage states it 'was first summited in 1953.'", correct: true },
              { text: "April to May", explanation: "This is the climbing season, not when it was first climbed." },
              { text: "29,032", explanation: "This is the height in feet, not a year." },
              { text: "The passage doesn't say", explanation: "It clearly states 1953 in the second sentence." }
            ]
          },
          {
            id: "PC2-007",
            text: "Venus rotates in the opposite direction from most planets in our solar system. A day on Venus (one full rotation) takes 243 Earth days, while a year on Venus (one orbit around the sun) takes only 225 Earth days. This means a day on Venus is actually longer than its year.\n\nHow long is a day on Venus in Earth days?",
            options: [
              { text: "243 Earth days", explanation: "Correct! The passage states 'A day on Venus (one full rotation) takes 243 Earth days.'", correct: true },
              { text: "225 Earth days", explanation: "225 is the length of a Venus year, not a day." },
              { text: "Longer than a year", explanation: "This is true, but it doesn't answer the specific question about how many Earth days." },
              { text: "24 hours", explanation: "That's an Earth day. Venus takes 243 Earth days for one rotation." }
            ]
          },
          {
            id: "PC2-008",
            text: "The Dead Sea, located between Jordan and Israel, has a salt concentration of about 34%. This is nearly 10 times saltier than the ocean. The extreme salinity makes it impossible for most marine life to survive, hence the name. However, the salt and minerals attract tourists seeking therapeutic benefits.\n\nWhat is the approximate salt concentration of the Dead Sea?",
            options: [
              { text: "34%", explanation: "Correct! The passage states 'a salt concentration of about 34%.'", correct: true },
              { text: "10%", explanation: "The Dead Sea is 10 TIMES saltier than the ocean, not 10% salt." },
              { text: "Nearly 10 times", explanation: "This describes how much saltier it is than the ocean, not the actual percentage." },
              { text: "The passage doesn't give a specific number", explanation: "It does — 'about 34%' in the first sentence." }
            ]
          },
          {
            id: "PC2-009",
            text: "Bamboo is the fastest-growing plant on Earth. Some species can grow up to 35 inches in a single day under optimal conditions. Despite being classified as grass, bamboo can reach heights of 100 feet. It is used for construction, furniture, food, and even clothing fabric.\n\nAccording to the passage, how much can bamboo grow in one day?",
            options: [
              { text: "Up to 35 inches", explanation: "Correct! The passage states 'Some species can grow up to 35 inches in a single day.'", correct: true },
              { text: "100 feet", explanation: "100 feet is the maximum HEIGHT bamboo can reach, not daily growth." },
              { text: "35 feet", explanation: "The passage says 35 INCHES per day, not feet." },
              { text: "It varies by species", explanation: "While true, the passage gives a specific number: up to 35 inches." }
            ]
          },
          {
            id: "PC2-010",
            text: "The Titanic sank on April 15, 1912, during its maiden voyage from Southampton to New York City. The ship struck an iceberg at 11:40 PM and sank less than three hours later. Of the estimated 2,224 passengers and crew aboard, more than 1,500 died, making it one of the deadliest maritime disasters in history.\n\nHow many people were estimated to be on the Titanic?",
            options: [
              { text: "2,224", explanation: "Correct! The passage states 'estimated 2,224 passengers and crew aboard.'", correct: true },
              { text: "1,500", explanation: "1,500 is the number who died, not the total aboard." },
              { text: "1912", explanation: "1912 is the year, not the number of people." },
              { text: "About 700", explanation: "This would be roughly the number of survivors (2,224 - 1,500), but it's not stated in the passage." }
            ]
          }
        ],

        quizConfig: {
          questionsPerQuiz: 5,
          passingScore: 0.8
        }
      },

      // --------------------------------------------
      // CHAPTER 3: INFERENCE QUESTIONS
      // --------------------------------------------
      {
        id: "PC-3",
        title: "Making Inferences",
        description: "Draw conclusions from what's implied",

        lesson: {
          intro: "Inference questions ask what can be concluded from the passage — not what's directly stated, but what's strongly implied by the evidence.",

          concepts: [
            {
              title: "Inference vs. Detail",
              content: "Detail questions: the answer is stated. Inference questions: the answer is implied. You have to connect the dots."
            },
            {
              title: "Look for Evidence",
              content: "A good inference is supported by specific evidence in the passage. If you can't point to evidence, it's probably wrong."
            },
            {
              title: "Stay Close to the Text",
              content: "Don't make wild leaps. The correct inference is usually just one small step beyond what's stated."
            }
          ],

          examples: [
            {
              problem: "How to answer inference questions",
              steps: [
                "Read carefully for clues and evidence",
                "Ask: 'What does this information suggest?'",
                "Eliminate answers that are too big a leap",
                "Choose the answer that's most supported by evidence"
              ],
              tip: "If the answer is directly stated in the passage, it's not an inference — look for what's IMPLIED."
            }
          ],

          summary: "Inferences are logical conclusions from evidence, not wild guesses. The right answer is just one step beyond what's stated, always supported by the text."
        },

        questions: [
          {
            id: "PC3-001",
            text: "When Sarah arrived at the airport, she found the parking lot nearly empty. Inside the terminal, only a few travelers sat waiting, and most shops and restaurants had their gates pulled down. A single announcement echoed through the quiet halls.\n\nIt can be inferred that Sarah arrived at the airport:",
            options: [
              { text: "Very early in the morning or very late at night", explanation: "Correct! The empty parking lot, few travelers, and closed shops suggest off-peak hours.", correct: true },
              { text: "During a holiday", explanation: "Holidays typically have MORE travelers, not fewer." },
              { text: "After a flight was canceled", explanation: "Nothing suggests a cancellation — the airport is operating, just quiet." },
              { text: "At a small regional airport", explanation: "The passage describes a terminal with shops and restaurants, suggesting a larger airport." }
            ]
          },
          {
            id: "PC3-002",
            text: "Dr. Martinez reviewed the test results for the third time, her brow furrowed. She picked up the phone, then set it down. Finally, she asked her assistant to schedule an appointment with the patient for the following day.\n\nIt can be inferred that Dr. Martinez:",
            options: [
              { text: "Found something concerning in the results", explanation: "Correct! Her repeated reviewing, hesitation with the phone, and urgency to see the patient suggest worrying findings.", correct: true },
              { text: "Made a mistake in the testing", explanation: "Nothing suggests an error — her concern seems to be about what the results show." },
              { text: "Is new to her profession", explanation: "Her title 'Dr.' and having an assistant suggest experience, not inexperience." },
              { text: "Wants to congratulate the patient", explanation: "Her worried behavior (furrowed brow, hesitation) suggests the opposite." }
            ]
          },
          {
            id: "PC3-003",
            text: "After the factory closed, Main Street businesses began shutting down one by one. The population of Millbrook dropped from 12,000 to 4,000 over the next decade. The high school, which once fielded three sports teams, now struggles to fill even one.\n\nIt can be inferred that:",
            options: [
              { text: "The factory was the town's primary employer", explanation: "Correct! The town's decline after the factory closure strongly implies economic dependence on the factory.", correct: true },
              { text: "The school was poorly managed", explanation: "The school's struggles are due to population loss, not management." },
              { text: "Another factory will open soon", explanation: "Nothing in the passage suggests this — the decline seems ongoing." },
              { text: "People moved to larger cities for entertainment", explanation: "The passage implies people left due to job loss, not for entertainment." }
            ]
          },
          {
            id: "PC3-004",
            text: "The chef tasted the sauce, added a pinch of salt, tasted again, and smiled. She wiped her hands on her apron, turned off the burner, and called out to the wait staff that the special was ready.\n\nIt can be inferred that:",
            options: [
              { text: "The chef is satisfied with the sauce", explanation: "Correct! Her smile after tasting and announcing the dish is ready indicate satisfaction.", correct: true },
              { text: "The sauce needed more than salt", explanation: "She only added salt and smiled — suggesting that was all it needed." },
              { text: "The chef is preparing for a competition", explanation: "Nothing suggests a competition — this appears to be regular restaurant service." },
              { text: "The wait staff made a request", explanation: "The chef initiated the communication; no request is mentioned." }
            ]
          },
          {
            id: "PC3-005",
            text: "Although penguins cannot fly, their wing-like flippers allow them to swim at speeds up to 22 miles per hour. They spend about 75% of their lives in water, hunting fish, squid, and krill. Their black and white coloring provides camouflage from predators when viewed from above or below.\n\nIt can be inferred that:",
            options: [
              { text: "Penguins evolved to be better suited for water than air", explanation: "Correct! Their flippers, swimming speed, aquatic lifestyle, and water camouflage all suggest adaptation for water.", correct: true },
              { text: "Penguins were once able to fly", explanation: "While possibly true evolutionarily, this isn't implied by the passage." },
              { text: "Penguins have no natural predators", explanation: "The mention of camouflage FROM predators implies they do have predators." },
              { text: "Penguins prefer cold climates", explanation: "The passage discusses swimming, not temperature preferences." }
            ]
          },
          {
            id: "PC3-006",
            text: "Marcus looked at his calendar and sighed. Every evening was filled with activities: Monday - soccer practice, Tuesday - piano lesson, Wednesday - tutoring, Thursday - chess club, Friday - scout meeting. He hadn't seen his friends outside of school in weeks.\n\nIt can be inferred that Marcus:",
            options: [
              { text: "Feels overscheduled", explanation: "Correct! His sigh and the observation about not seeing friends suggest he feels overwhelmed by activities.", correct: true },
              { text: "Enjoys all of his activities", explanation: "His sigh suggests the opposite — frustration or exhaustion." },
              { text: "Is not good at sports", explanation: "Nothing suggests this — he plays soccer and chess." },
              { text: "Doesn't have any friends", explanation: "He mentions friends — he just hasn't had time to see them." }
            ]
          },
          {
            id: "PC3-007",
            text: "The ancient city's walls show signs of being repaired multiple times over centuries. Archaeologists have found evidence of at least three distinct construction phases, each using different building techniques and materials common to different eras.\n\nIt can be inferred that:",
            options: [
              { text: "The city was inhabited for a long period", explanation: "Correct! Multiple repair phases over centuries, using techniques from different eras, suggests long-term habitation.", correct: true },
              { text: "The walls were poorly built originally", explanation: "Repairs over centuries could be normal wear, not poor construction." },
              { text: "The city was conquered three times", explanation: "Repairs don't necessarily mean conquest — they could be routine maintenance." },
              { text: "Archaeologists found written records", explanation: "The passage mentions physical evidence (construction techniques), not written records." }
            ]
          },
          {
            id: "PC3-008",
            text: "When the new highway bypassed the town, the diner owner noticed fewer out-of-state license plates in her parking lot. Truck drivers who once stopped for lunch now sped past on the interstate. She began offering a senior discount to attract local customers.\n\nIt can be inferred that:",
            options: [
              { text: "The diner's business declined after the highway was built", explanation: "Correct! Fewer travelers and the need for new promotions strongly imply reduced business.", correct: true },
              { text: "The diner's food quality decreased", explanation: "Nothing suggests quality issues — customers simply have a faster route now." },
              { text: "Seniors don't use the highway", explanation: "The senior discount is a strategy to attract locals, not a statement about highway use." },
              { text: "The highway was built recently", explanation: "Possibly, but the focus is on business impact, not timing." }
            ]
          },
          {
            id: "PC3-009",
            text: "The detective examined the muddy footprints leading from the garden to the back door. They were small, with a distinctive star pattern on the sole. Inside, she found the same pattern on the kitchen floor, leading to the open cookie jar on the counter.\n\nIt can be inferred that:",
            options: [
              { text: "A child took cookies from the jar", explanation: "Correct! Small footprints, a path to cookies, and a playful 'crime' all suggest a child.", correct: true },
              { text: "A burglar broke into the house", explanation: "Nothing was broken into, and only cookies were disturbed." },
              { text: "The detective was investigating a serious crime", explanation: "The 'evidence' points to a cookie theft — likely a parent playing detective." },
              { text: "The garden was recently planted", explanation: "The garden's mud is mentioned, but not its planting status." }
            ]
          },
          {
            id: "PC3-010",
            text: "The musician's hands trembled slightly as she walked onto the stage. She had performed hundreds of concerts, but this was Carnegie Hall. Taking a deep breath, she sat at the piano and began to play.\n\nIt can be inferred that:",
            options: [
              { text: "Carnegie Hall is a significant or prestigious venue", explanation: "Correct! An experienced performer being nervous specifically about Carnegie Hall implies its importance.", correct: true },
              { text: "The musician was ill", explanation: "Her trembling appears to be nerves, not illness, given the context." },
              { text: "This was her first public performance", explanation: "The passage states she had performed 'hundreds of concerts.'" },
              { text: "She forgot her music", explanation: "Nothing suggests this — she sat down and began to play." }
            ]
          }
        ],

        quizConfig: {
          questionsPerQuiz: 5,
          passingScore: 0.8
        }
      },

      // --------------------------------------------
      // CHAPTER 4: VOCABULARY IN CONTEXT
      // --------------------------------------------
      {
        id: "PC-4",
        title: "Vocabulary in Context",
        description: "Determine word meanings from surrounding text",

        lesson: {
          intro: "You don't need to know every word! Context clues in the surrounding sentences often reveal meaning.",

          concepts: [
            {
              title: "Use the Substitution Test",
              content: "Replace the word with each answer choice. Read the sentence. The right answer makes sense and doesn't change the meaning."
            },
            {
              title: "Look for Clues",
              content: "Authors often explain or hint at difficult words through examples, definitions, contrasts, or similar words nearby."
            },
            {
              title: "Watch for Multiple Meanings",
              content: "Many words have several meanings. 'Run' can mean jog, operate, or a tear in stockings. Use context to choose the right one."
            }
          ],

          examples: [
            {
              problem: "How to find word meaning in context",
              steps: [
                "Read the sentence with the word",
                "Look for clues: examples, explanations, contrasts",
                "Substitute each answer choice",
                "Pick the one that makes the most sense"
              ],
              tip: "Even if you know the word, use context to verify — the test might use an uncommon meaning."
            }
          ],

          summary: "Use surrounding context to find word meanings. Substitute each choice and pick what makes sense. Be aware that common words may have uncommon meanings."
        },

        questions: [
          {
            id: "PC4-001",
            text: "The politician's equivocal answer frustrated reporters, who couldn't determine whether he supported or opposed the new bill.\n\nIn this sentence, 'equivocal' most nearly means:",
            options: [
              { text: "Unclear or vague", explanation: "Correct! The sentence says reporters couldn't determine his position, indicating the answer was unclear.", correct: true },
              { text: "Passionate", explanation: "A passionate answer would be clear, not frustrating to interpret." },
              { text: "Lengthy", explanation: "Length doesn't explain why reporters couldn't determine his position." },
              { text: "Hostile", explanation: "Nothing suggests anger or hostility in the context." }
            ]
          },
          {
            id: "PC4-002",
            text: "After the scandal, the company tried to salvage its reputation by donating millions to charity and firing the executives responsible.\n\nIn this sentence, 'salvage' most nearly means:",
            options: [
              { text: "Save or rescue", explanation: "Correct! The company is trying to rescue/save its damaged reputation through positive actions.", correct: true },
              { text: "Improve", explanation: "Close, but salvage implies rescuing something from destruction, not just making it better." },
              { text: "Publicize", explanation: "They may publicize donations, but salvage refers to saving the reputation." },
              { text: "Ignore", explanation: "Taking action is the opposite of ignoring." }
            ]
          },
          {
            id: "PC4-003",
            text: "The medicine is benign and causes no harmful side effects, making it safe for children.\n\nIn this sentence, 'benign' most nearly means:",
            options: [
              { text: "Harmless", explanation: "Correct! The sentence explains it causes 'no harmful side effects' and is 'safe' — defining benign.", correct: true },
              { text: "Effective", explanation: "Effectiveness isn't the focus — safety is." },
              { text: "Expensive", explanation: "Cost isn't mentioned in the context." },
              { text: "New", explanation: "Nothing suggests the medicine is newly developed." }
            ]
          },
          {
            id: "PC4-004",
            text: "His frugal habits, such as reusing tea bags and walking instead of driving, allowed him to retire early.\n\nIn this sentence, 'frugal' most nearly means:",
            options: [
              { text: "Thrifty or economical", explanation: "Correct! The examples (reusing tea bags, walking to save gas) show he's careful with money.", correct: true },
              { text: "Healthy", explanation: "While walking is healthy, reusing tea bags relates to saving money, not health." },
              { text: "Strange", explanation: "The habits are presented positively (helped him retire), not as strange." },
              { text: "Lazy", explanation: "These habits require effort and discipline, not laziness." }
            ]
          },
          {
            id: "PC4-005",
            text: "The treaty helped to mitigate tensions between the two countries, though it did not eliminate all disagreements.\n\nIn this sentence, 'mitigate' most nearly means:",
            options: [
              { text: "Reduce or lessen", explanation: "Correct! The phrase 'did not eliminate' implies the treaty reduced but didn't completely remove tensions.", correct: true },
              { text: "Cause", explanation: "The treaty helped tensions, not caused them." },
              { text: "Explain", explanation: "The context is about reducing conflict, not explaining it." },
              { text: "Ignore", explanation: "Taking action through a treaty is the opposite of ignoring." }
            ]
          },
          {
            id: "PC4-006",
            text: "The novel's protagonist must overcome numerous obstacles to achieve her goal of becoming a doctor.\n\nIn this sentence, 'protagonist' most nearly means:",
            options: [
              { text: "Main character", explanation: "Correct! A protagonist is the central character whose journey drives the story.", correct: true },
              { text: "Villain", explanation: "That would be the antagonist, not protagonist." },
              { text: "Author", explanation: "The author writes the story; the protagonist is in the story." },
              { text: "Doctor", explanation: "Becoming a doctor is the goal, but protagonist refers to her role in the narrative." }
            ]
          },
          {
            id: "PC4-007",
            text: "The data was ambiguous, leading different scientists to draw opposite conclusions from the same study.\n\nIn this sentence, 'ambiguous' most nearly means:",
            options: [
              { text: "Open to interpretation", explanation: "Correct! If scientists drew 'opposite conclusions,' the data must have been unclear or interpretable in multiple ways.", correct: true },
              { text: "Incorrect", explanation: "Data can be correct but still ambiguous." },
              { text: "Detailed", explanation: "Detailed data would likely lead to similar conclusions, not opposite ones." },
              { text: "Hidden", explanation: "The scientists could access the data; it wasn't hidden." }
            ]
          },
          {
            id: "PC4-008",
            text: "Rather than elaborate on his brief answer, the witness remained taciturn throughout the questioning.\n\nIn this sentence, 'taciturn' most nearly means:",
            options: [
              { text: "Uncommunicative or quiet", explanation: "Correct! The contrast with 'elaborate' and his 'brief answer' shows he spoke very little.", correct: true },
              { text: "Nervous", explanation: "While possible, the context emphasizes his lack of speaking, not his emotional state." },
              { text: "Dishonest", explanation: "Being brief doesn't mean being dishonest." },
              { text: "Cooperative", explanation: "His refusal to elaborate suggests the opposite of cooperation." }
            ]
          },
          {
            id: "PC4-009",
            text: "The ephemeral nature of cherry blossoms, which bloom for only one or two weeks, makes their appearance each spring a celebrated event.\n\nIn this sentence, 'ephemeral' most nearly means:",
            options: [
              { text: "Short-lived or temporary", explanation: "Correct! The sentence explains blossoms last 'only one or two weeks,' defining ephemeral.", correct: true },
              { text: "Beautiful", explanation: "While blossoms are beautiful, the context defines ephemeral as brief, not pretty." },
              { text: "Annual", explanation: "Annual means yearly; ephemeral means brief." },
              { text: "Colorful", explanation: "Color isn't the focus — duration is." }
            ]
          },
          {
            id: "PC4-010",
            text: "The coach tried to bolster the team's confidence after the devastating loss by reminding them of their previous victories.\n\nIn this sentence, 'bolster' most nearly means:",
            options: [
              { text: "Strengthen or support", explanation: "Correct! After a loss, reminding them of victories would strengthen/rebuild their confidence.", correct: true },
              { text: "Test", explanation: "The coach is supporting the team, not testing them." },
              { text: "Question", explanation: "Questioning confidence would weaken it, not help it." },
              { text: "Report", explanation: "Reporting doesn't fit — he's actively trying to help." }
            ]
          },
          {
            id: "PC4-011",
            text: "The region's arid climate, with less than 10 inches of rainfall per year, supports only the hardiest desert plants.\n\nIn this sentence, 'arid' most nearly means:",
            options: [
              { text: "Dry", explanation: "Correct! 'Less than 10 inches of rainfall' and 'desert plants' indicate a dry climate.", correct: true },
              { text: "Hot", explanation: "Arid means dry, not necessarily hot — some arid regions are cold." },
              { text: "Unpredictable", explanation: "The context doesn't mention weather unpredictability." },
              { text: "Tropical", explanation: "Tropical regions are wet; this is the opposite." }
            ]
          },
          {
            id: "PC4-012",
            text: "She was known for her candid remarks, never sugarcoating bad news or hiding her true opinions.\n\nIn this sentence, 'candid' most nearly means:",
            options: [
              { text: "Frank and honest", explanation: "Correct! 'Never sugarcoating' and 'not hiding opinions' indicate direct, honest speech.", correct: true },
              { text: "Rude", explanation: "Candid means honest, not necessarily rude." },
              { text: "Careful", explanation: "Careful would involve sugarcoating, which she doesn't do." },
              { text: "Popular", explanation: "Her honesty might or might not make her popular — that's not what candid means." }
            ]
          }
        ],

        quizConfig: {
          questionsPerQuiz: 5,
          passingScore: 0.8
        }
      }
    ]
  }
};

// Utility functions
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getRandomQuestions(questions, count) {
  const shuffled = shuffleArray(questions);
  return shuffled.slice(0, count);
}

function shuffleOptions(question) {
  const shuffledOptions = shuffleArray(question.options);
  return {
    ...question,
    options: shuffledOptions
  };
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { courses, shuffleArray, getRandomQuestions, shuffleOptions };
}
