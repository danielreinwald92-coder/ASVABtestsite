// ASVAB Study Course Data — technical sections (GS / AS / MC / EI).
// Same shape as js/courses.js; lazy-loaded after it by
// js/page-study-guide.js and merged into `courses` via Object.assign.
// Contract enforced by scripts/validate-site.js and
// tests/unit/courses-tech.test.js.

const coursesTech = {
  EI: {
    "name": "Electronics Information",
    "description": "Circuits, components, power, and electrical safety",
    "icon": "⚡",
    "chapters": [
      {
        "id": "EI-1",
        "title": "Electricity Fundamentals",
        "description": "Learn what current, voltage, and resistance really are, master Ohm's law, and understand why some materials carry electricity while others block it.",
        "lesson": {
          "intro": "Every piece of military equipment, from a radio to a Humvee's starter motor, runs on the same three electrical ideas: current, voltage, and resistance. If you understand how these three work together, you can answer a huge share of the Electronics Information questions on the ASVAB. This chapter builds that foundation step by step, using a simple water-pipe picture you can fall back on any time a question feels confusing.",
          "concepts": [
            {
              "title": "The Water-Pipe Analogy: Picture Electricity as Water",
              "content": "Electricity in a wire behaves a lot like water in a pipe, and that picture makes the whole subject easier. Voltage is like water pressure: it is the push that makes things move. Current is like the flow of water: how much actually moves past a point each second. Resistance is like a narrow or clogged section of pipe: it fights the flow and limits how much gets through. More pressure means more flow, and a narrower pipe means less flow. Keep this picture in mind, because almost every basic electricity question can be translated into pressure, flow, and pipe size."
            },
            {
              "title": "Current: The Flow of Electric Charge (Amps)",
              "content": "Current is the movement of electric charge, carried by tiny particles called electrons, through a conductor such as a copper wire. It is measured in amperes, usually shortened to amps, and the symbol used in formulas is I. One amp means a specific, large number of electrons passing a point every second, just like gallons per minute measures water flow. A small flashlight might draw a fraction of an amp, while a vehicle starter motor can draw well over 100 amps. When a question asks how much electricity is flowing, it is asking about current in amps."
            },
            {
              "title": "Voltage: The Electrical Push (Volts)",
              "content": "Voltage is the electrical pressure that pushes current through a circuit, and it is measured in volts, with the symbol V (you may also see E for electromotive force). A battery or generator creates a difference in electrical pressure between its two terminals, and that difference is what drives electrons through the wires. A standard car battery supplies about 12 volts, a common household outlet in the United States supplies about 120 volts, and a single AA battery supplies 1.5 volts. Without voltage there is no push, and without a push there is no current, no matter how good the wire is."
            },
            {
              "title": "Resistance: Opposition to Flow (Ohms)",
              "content": "Resistance is how strongly a material or component fights the flow of current, and it is measured in ohms, with the symbol R. In the water picture, resistance is the narrow pipe or partial clog that slows the flow. Every real wire has at least a little resistance, and devices called resistors are built on purpose to add a precise amount of it to control current. Higher resistance means less current flows for the same voltage. Resistance is not always bad: the heating element in a toaster and the filament in an old-style light bulb do their jobs precisely because they resist current and turn that fight into heat and light."
            },
            {
              "title": "Ohm's Law: The One Formula to Memorize",
              "content": "Ohm's law ties the three quantities together: voltage equals current times resistance, written V = I x R. From that one equation you can solve for any of the three values if you know the other two. To find current, divide voltage by resistance: I = V / R. To find resistance, divide voltage by current: R = V / I. A handy memory tool is the Ohm's law triangle: put V on top, with I and R side by side on the bottom; cover the letter you want, and the positions of the remaining two tell you whether to multiply or divide. The ASVAB loves this formula, so practice it until the three arrangements feel automatic."
            },
            {
              "title": "Conductors, Insulators, and Semiconductors",
              "content": "Materials differ in how easily they let current flow. Conductors, such as copper, silver, gold, and aluminum, have electrons that move freely, so they carry current with very little resistance; that is why wires are made of copper. Insulators, such as rubber, glass, plastic, and dry wood, hold their electrons tightly and block current, which is why wires are wrapped in rubber or plastic coatings for safety. Semiconductors, such as silicon and germanium, sit in between: they conduct under some conditions and resist under others, and that controllable behavior is what makes transistors, diodes, and computer chips possible. Remember one caution the test likes: pure water is a poor conductor, but ordinary water with dissolved minerals conducts electricity, which is why water and electricity are a dangerous mix."
            },
            {
              "title": "What Changes a Wire's Resistance",
              "content": "Four things determine how much resistance a wire has. First, length: a longer wire has more resistance, just as a longer pipe is harder to push water through. Second, thickness: a thicker wire has less resistance because it gives electrons a wider path, like a bigger pipe. Third, material: copper resists less than iron, and silver resists even less than copper, so the choice of metal matters. Fourth, temperature: for most metals, resistance goes up as the wire gets hotter, because the vibrating atoms get in the way of the moving electrons. So the lowest-resistance wire is short, thick, made of a good conductor, and kept cool."
            }
          ],
          "examples": [
            {
              "problem": "A 12-volt battery is connected to a circuit with a total resistance of 4 ohms. How much current flows?",
              "steps": [
                "Identify what you know: voltage V = 12 volts, resistance R = 4 ohms. You need current, I.",
                "Pick the right form of Ohm's law. Solving for current: I = V / R.",
                "Plug in the numbers: I = 12 / 4.",
                "Do the division: 12 divided by 4 equals 3.",
                "State the answer with its unit: the current is 3 amps."
              ],
              "tip": "When the question gives you volts and ohms and asks for amps, it is always divide: volts divided by ohms."
            },
            {
              "problem": "A radio circuit draws 2 amps of current through a resistance of 6 ohms. What voltage is pushing that current?",
              "steps": [
                "Identify what you know: current I = 2 amps, resistance R = 6 ohms. You need voltage, V.",
                "Use the basic form of Ohm's law: V = I x R.",
                "Plug in the numbers: V = 2 x 6.",
                "Multiply: 2 times 6 equals 12.",
                "State the answer with its unit: the voltage is 12 volts."
              ],
              "tip": "Voltage is the only one of the three you find by multiplying. If the answer needs volts, multiply amps by ohms."
            },
            {
              "problem": "A heater connected to a 120-volt outlet draws 10 amps. What is the resistance of the heater?",
              "steps": [
                "Identify what you know: voltage V = 120 volts, current I = 10 amps. You need resistance, R.",
                "Rearrange Ohm's law to solve for resistance: R = V / I.",
                "Plug in the numbers: R = 120 / 10.",
                "Divide: 120 divided by 10 equals 12.",
                "State the answer with its unit: the resistance is 12 ohms."
              ],
              "tip": "Check your answer by running it back through V = I x R: 10 amps x 12 ohms = 120 volts, which matches the outlet voltage. If it does not match, recheck your division."
            }
          ],
          "summary": "Current (amps) is the flow of charge, voltage (volts) is the push behind it, and resistance (ohms) is the opposition to it, all linked by Ohm's law: V = I x R. Conductors like copper carry current easily, insulators like rubber block it, and semiconductors like silicon can do either, which makes modern electronics possible. A wire's resistance rises with more length and higher temperature, and falls with more thickness and better conductor material."
        },
        "questions": [
          {
            "id": "EI1-001",
            "text": "In the water-pipe analogy for electricity, voltage is best compared to what?",
            "options": [
              {
                "text": "The amount of water flowing through the pipe",
                "explanation": "The amount of water flowing corresponds to current, not voltage. Current measures how much charge moves past a point each second."
              },
              {
                "text": "The water pressure pushing the flow",
                "explanation": "Correct! Voltage is the electrical pressure, or push, that drives current through a circuit, just as water pressure drives flow through a pipe.",
                "correct": true
              },
              {
                "text": "A narrow or clogged section of pipe",
                "explanation": "A narrow or clogged pipe represents resistance, the opposition to flow, not the push behind it."
              },
              {
                "text": "The length of the pipe",
                "explanation": "Pipe length relates to resistance: a longer path opposes flow more. It does not represent the electrical push."
              }
            ]
          },
          {
            "id": "EI1-002",
            "text": "Electric current is measured in which unit?",
            "options": [
              {
                "text": "Volts",
                "explanation": "Volts measure voltage, the electrical pressure that pushes current, not the current itself."
              },
              {
                "text": "Ohms",
                "explanation": "Ohms measure resistance, the opposition to current flow, not the flow itself."
              },
              {
                "text": "Watts",
                "explanation": "Watts measure electrical power, the rate at which energy is used, not the flow of charge."
              },
              {
                "text": "Amperes",
                "explanation": "Correct! Current, the flow of electric charge through a conductor, is measured in amperes, usually shortened to amps.",
                "correct": true
              }
            ]
          },
          {
            "id": "EI1-003",
            "text": "A 24-volt power supply is connected across a resistance of 8 ohms. Using Ohm's law, how much current flows in the circuit?",
            "options": [
              {
                "text": "3 amps",
                "explanation": "Correct! Current I = V / R = 24 / 8 = 3 amps. When you know volts and ohms, divide to get amps.",
                "correct": true
              },
              {
                "text": "192 amps",
                "explanation": "This comes from multiplying 24 x 8 instead of dividing. Multiplying current by resistance gives voltage; to find current you divide voltage by resistance."
              },
              {
                "text": "16 amps",
                "explanation": "This comes from subtracting 8 from 24, but Ohm's law never uses subtraction. Current equals voltage divided by resistance: 24 / 8 = 3 amps."
              },
              {
                "text": "0.33 amps",
                "explanation": "This comes from dividing the wrong way, 8 / 24. Ohm's law says I = V / R, so it is 24 divided by 8, which equals 3 amps."
              }
            ]
          },
          {
            "id": "EI1-004",
            "text": "A circuit carries 5 amps of current through a 10-ohm resistor. What is the voltage across the resistor?",
            "options": [
              {
                "text": "2 volts",
                "explanation": "This comes from dividing 10 by 5, but voltage is found by multiplying, not dividing: V = I x R = 5 x 10 = 50 volts."
              },
              {
                "text": "15 volts",
                "explanation": "This comes from adding 5 and 10, but Ohm's law uses multiplication for voltage: V = I x R = 5 x 10 = 50 volts."
              },
              {
                "text": "50 volts",
                "explanation": "Correct! Voltage V = I x R = 5 amps x 10 ohms = 50 volts. Voltage is the one quantity in Ohm's law you find by multiplying.",
                "correct": true
              },
              {
                "text": "0.5 volts",
                "explanation": "This comes from dividing 5 by 10. To find voltage you multiply current by resistance: 5 x 10 = 50 volts."
              }
            ]
          },
          {
            "id": "EI1-005",
            "text": "Which of the following materials is the best conductor of electricity?",
            "options": [
              {
                "text": "Rubber",
                "explanation": "Rubber is an insulator. It holds its electrons tightly and blocks current, which is why it is used to coat wires for safety."
              },
              {
                "text": "Copper",
                "explanation": "Correct! Copper is an excellent conductor because its electrons move freely, which is why most electrical wiring is made of copper.",
                "correct": true
              },
              {
                "text": "Glass",
                "explanation": "Glass is an insulator, not a conductor. It strongly resists the flow of current."
              },
              {
                "text": "Dry wood",
                "explanation": "Dry wood is an insulator and does not carry current well. Of the choices listed, copper is the material that conducts electricity best."
              }
            ]
          },
          {
            "id": "EI1-006",
            "text": "Silicon is commonly used in transistors and computer chips because it is which type of material?",
            "options": [
              {
                "text": "A semiconductor",
                "explanation": "Correct! Silicon is a semiconductor: it conducts under some conditions and resists under others, and that controllable behavior is what makes transistors, diodes, and chips work.",
                "correct": true
              },
              {
                "text": "A conductor",
                "explanation": "Conductors like copper always carry current easily. Silicon is useful precisely because its conduction can be turned on and off, which is semiconductor behavior."
              },
              {
                "text": "An insulator",
                "explanation": "Insulators like rubber and glass block current all the time. Silicon can conduct under the right conditions, so it is not an insulator."
              },
              {
                "text": "A resistor",
                "explanation": "A resistor is a circuit component, not a category of material. Silicon belongs to the in-between class of materials called semiconductors."
              }
            ]
          },
          {
            "id": "EI1-007",
            "text": "An electric heater plugged into a 120-volt outlet draws 6 amps. What is the resistance of the heater?",
            "options": [
              {
                "text": "720 ohms",
                "explanation": "This comes from multiplying 120 x 6, which would give power-related numbers, not resistance. Resistance R = V / I = 120 / 6 = 20 ohms."
              },
              {
                "text": "126 ohms",
                "explanation": "This comes from adding 120 and 6, but Ohm's law never adds. Divide voltage by current: 120 / 6 = 20 ohms."
              },
              {
                "text": "0.05 ohms",
                "explanation": "This comes from dividing the wrong way, 6 / 120. Resistance equals voltage divided by current: 120 / 6 = 20 ohms."
              },
              {
                "text": "20 ohms",
                "explanation": "Correct! Resistance R = V / I = 120 volts / 6 amps = 20 ohms. You can check it: 6 amps x 20 ohms = 120 volts.",
                "correct": true
              }
            ]
          },
          {
            "id": "EI1-008",
            "text": "Which change would DECREASE the resistance of a wire?",
            "options": [
              {
                "text": "Making the wire longer",
                "explanation": "A longer wire has more resistance, not less, because the electrons must fight their way through more material, like water pushed through a longer pipe."
              },
              {
                "text": "Raising the wire's temperature",
                "explanation": "For most metals, heating the wire increases resistance, because the vibrating atoms interfere more with the moving electrons."
              },
              {
                "text": "Making the wire thicker",
                "explanation": "Correct! A thicker wire gives electrons a wider path, so resistance goes down, just as a wider pipe lets more water flow.",
                "correct": true
              },
              {
                "text": "Replacing copper wire with iron wire of the same size",
                "explanation": "Iron has more resistance than copper, so this swap would increase resistance. Copper and silver are among the lowest-resistance metals."
              }
            ]
          }
        ],
        "quizConfig": {
          "questionsPerQuiz": 6
        }
      },
      {
        "id": "EI-2",
        "title": "Series and Parallel Circuits",
        "description": "Learn how circuits are wired: series circuits with one path, parallel circuits with many paths, how to compute total resistance, and how fuses and breakers keep circuits safe.",
        "lesson": {
          "intro": "In Chapter 1 you learned about voltage, current, and resistance. Now let's see how components are actually connected together. There are only two basic ways to wire a circuit: series (one path) and parallel (multiple paths). The ASVAB loves this topic because a few simple rules let you answer a lot of questions. Master these rules and you will pick up easy points on test day.",
          "concepts": [
            {
              "title": "What Makes a Circuit: The Complete Loop",
              "content": "A circuit only works when current has a complete, unbroken loop to travel: from the power source, through the components, and back to the source. A CLOSED circuit is a complete loop, and current flows. An OPEN circuit has a break somewhere, like a switch turned off or a broken wire, so no current flows at all. A SHORT circuit is different and dangerous: current finds an accidental shortcut around the load, taking a path with almost no resistance. With almost no resistance holding it back, current surges to very high levels, which creates heat and can start fires. Remember the three states: closed means working, open means stopped, short means trouble."
            },
            {
              "title": "Series Circuits: One Path for Everything",
              "content": "In a series circuit, components are connected end to end in a single line, like beads on a string. Current has exactly one path, so the SAME current flows through every component. There is no other way for it to go. Total resistance is easy: just ADD up each resistance. Three resistors of 10 ohms, 20 ohms, and 30 ohms in series give a total of 60 ohms. The catch with series wiring: if any single component fails or the path breaks anywhere, the whole circuit goes dead. Think of old-style holiday lights where one burned-out bulb killed the entire string."
            },
            {
              "title": "Parallel Circuits: Many Paths, Same Voltage",
              "content": "In a parallel circuit, components are connected side by side, each on its own branch, like rungs on a ladder. Every branch connects directly across the power source, so every branch gets the SAME full voltage. Current, on the other hand, splits up: each branch draws its own current based on its own resistance, and the branch currents add up to the total. The best part is independence: if one branch fails or is switched off, the other branches keep working, because each one has its own complete path back to the source."
            },
            {
              "title": "Total Resistance in Parallel: It Goes Down",
              "content": "Here is the rule that surprises people: adding more resistors in PARALLEL makes the total resistance go DOWN, not up. Why? Each new branch is another lane for current to use, and more lanes means less overall opposition. Two handy shortcuts for the ASVAB: First, if two EQUAL resistors are in parallel, the total is half of one of them. Two 10-ohm resistors in parallel equal 5 ohms. Second, the total resistance of a parallel group is always LESS than the smallest resistor in the group. If you compute a parallel total and it comes out bigger than the smallest branch, you made a mistake. For two unequal resistors, use product over sum: multiply the two values, then divide by their sum."
            },
            {
              "title": "Why Your House Is Wired in Parallel",
              "content": "Every home is wired in parallel, and now you can see why. First, every outlet and light gets the same full voltage, which in American homes is about 120 volts, so every appliance gets the power it was designed for. Second, everything works independently: you can turn off the kitchen light without killing the TV, and a burned-out lamp does not black out the house. If homes were wired in series, turning off one switch would shut down everything, and every device you plugged in would steal voltage from all the others."
            },
            {
              "title": "Fuses and Circuit Breakers: The Safety Crew",
              "content": "Because a short circuit or an overloaded circuit lets current climb dangerously high, every circuit needs protection. A FUSE contains a thin metal strip that melts when too much current flows through it, breaking the circuit. It works once and then must be replaced. A CIRCUIT BREAKER does the same job with a switch mechanism that trips open on excess current, and it can simply be reset and reused. Both devices do the same thing: they deliberately OPEN the circuit to stop dangerous current before wires overheat and start a fire. Key point for the test: fuses and breakers protect the wiring and prevent fires; they respond to too much current."
            }
          ],
          "examples": [
            {
              "problem": "Three resistors of 10 ohms, 20 ohms, and 30 ohms are connected in series with a 12-volt battery. What is the total resistance, and how much current flows?",
              "steps": [
                "In series, resistances simply add: 10 + 20 + 30 = 60 ohms total.",
                "Use Ohm's law to find current: I = V / R.",
                "I = 12 volts / 60 ohms = 0.2 amps.",
                "Because this is a series circuit, that same 0.2 amps flows through all three resistors."
              ],
              "tip": "Series math is the easy one: just add everything up. And remember, the current you calculate is the current everywhere in the loop."
            },
            {
              "problem": "Two 10-ohm resistors are connected in parallel. What is the total resistance?",
              "steps": [
                "Equal resistors in parallel: divide one resistor's value by the number of branches.",
                "10 ohms / 2 branches = 5 ohms total.",
                "Check with product over sum: (10 x 10) / (10 + 10) = 100 / 20 = 5 ohms. Same answer.",
                "Sanity check: 5 ohms is less than 10 ohms, and parallel totals must be smaller than the smallest branch. It checks out."
              ],
              "tip": "Two equal resistors in parallel always equal half of one. Three equal resistors equal one third, and so on."
            },
            {
              "problem": "A 6-ohm resistor and a 3-ohm resistor are connected in parallel. What is the total resistance?",
              "steps": [
                "The resistors are not equal, so use product over sum.",
                "Multiply the values: 6 x 3 = 18.",
                "Add the values: 6 + 3 = 9.",
                "Divide: 18 / 9 = 2 ohms total.",
                "Sanity check: 2 ohms is less than 3 ohms, the smallest branch, so the answer makes sense."
              ],
              "tip": "Product over sum only works for exactly two resistors at a time. If a question gives you three, combine two of them first, then combine that result with the third."
            }
          ],
          "summary": "A circuit needs a complete closed loop to work; an open circuit stops current, and a short circuit lets dangerous current surge through an accidental low-resistance path. Series circuits have one path: current is the same everywhere, resistances add, and one failure kills the whole circuit. Parallel circuits have multiple paths: every branch gets the full source voltage, total resistance drops as branches are added, and each branch works independently. Homes use parallel wiring so every device gets full voltage and works on its own. Fuses melt and breakers trip to open the circuit when current gets too high, protecting wiring and preventing fires. Nail these rules and you own this part of the EI section."
        },
        "questions": [
          {
            "id": "EI2-001",
            "text": "Three resistors of 5 ohms, 10 ohms, and 15 ohms are connected in series. What is the total resistance?",
            "options": [
              {
                "text": "10 ohms",
                "explanation": "This is just the middle resistor's value. In a series circuit you must add all three resistances together."
              },
              {
                "text": "30 ohms",
                "correct": true,
                "explanation": "Correct! In series, resistances simply add: 5 + 10 + 15 = 30 ohms."
              },
              {
                "text": "3.3 ohms",
                "explanation": "A total smaller than the smallest resistor could only happen in a parallel circuit. These resistors are in series, so you add them: 5 + 10 + 15 = 30 ohms."
              },
              {
                "text": "750 ohms",
                "explanation": "This comes from multiplying the values (5 x 10 x 15). Series resistances are added, not multiplied: 5 + 10 + 15 = 30 ohms."
              }
            ]
          },
          {
            "id": "EI2-002",
            "text": "In a series circuit, which quantity is the same at every point in the circuit?",
            "options": [
              {
                "text": "Current",
                "correct": true,
                "explanation": "Correct! A series circuit has only one path, so the same current must flow through every component in the loop."
              },
              {
                "text": "Voltage across each component",
                "explanation": "In series, the source voltage is divided among the components, so each one can have a different voltage across it. It is parallel circuits where every branch sees the same voltage."
              },
              {
                "text": "Resistance of each component",
                "explanation": "The individual resistors in a series circuit can all have different values. What stays the same everywhere is the current flowing through them."
              },
              {
                "text": "Power used by each component",
                "explanation": "Components with different resistances use different amounts of power even in series. The quantity that is identical everywhere in a series loop is the current."
              }
            ]
          },
          {
            "id": "EI2-003",
            "text": "Two 10-ohm resistors are connected in parallel. What is the total resistance?",
            "options": [
              {
                "text": "20 ohms",
                "explanation": "Adding the values gives the SERIES total. In parallel, the total drops: two equal 10-ohm resistors give half of one, which is 5 ohms."
              },
              {
                "text": "10 ohms",
                "explanation": "Adding a second parallel branch changes the total; it does not stay at one resistor's value. Two equal resistors in parallel give half of one: 5 ohms."
              },
              {
                "text": "5 ohms",
                "correct": true,
                "explanation": "Correct! Two equal resistors in parallel equal half of one: 10 / 2 = 5 ohms. Product over sum confirms it: (10 x 10) / (10 + 10) = 100 / 20 = 5 ohms."
              },
              {
                "text": "100 ohms",
                "explanation": "This is the product of the two values, but you still have to divide by their sum: 100 / 20 = 5 ohms. Parallel totals are always smaller than the smallest branch."
              }
            ]
          },
          {
            "id": "EI2-004",
            "text": "Five light bulbs are wired in series. If one bulb burns out, what happens to the other four?",
            "options": [
              {
                "text": "They keep glowing at the same brightness",
                "explanation": "That would be true in a parallel circuit, where each bulb has its own path. In series there is only one path, and a burned-out bulb breaks it."
              },
              {
                "text": "They glow brighter to make up for the lost bulb",
                "explanation": "The bulbs cannot get brighter, because a burned-out bulb in series breaks the only current path. With no complete loop, no current flows at all."
              },
              {
                "text": "Only the bulbs after the broken one go out",
                "explanation": "Current needs a complete loop, not just a path up to the break. A break anywhere in a series circuit stops current everywhere in the circuit."
              },
              {
                "text": "All of them go out",
                "correct": true,
                "explanation": "Correct! A series circuit has only one path. When one bulb burns out, the loop is broken, current stops everywhere, and every bulb goes dark, like old-style holiday light strings."
              }
            ]
          },
          {
            "id": "EI2-005",
            "text": "In a parallel circuit, which quantity is the same across every branch?",
            "options": [
              {
                "text": "Current through each branch",
                "explanation": "Branch currents differ: a branch with less resistance draws more current. What every parallel branch shares is the full source voltage."
              },
              {
                "text": "Voltage",
                "correct": true,
                "explanation": "Correct! Every parallel branch connects directly across the power source, so each branch receives the same full voltage."
              },
              {
                "text": "Resistance of each branch",
                "explanation": "The branches can have completely different resistances. The thing they all share is the voltage across them, since each connects directly to the source."
              },
              {
                "text": "Nothing is the same between branches",
                "explanation": "There is one quantity all parallel branches share: voltage. Each branch is connected directly across the source, so each sees the full source voltage."
              }
            ]
          },
          {
            "id": "EI2-006",
            "text": "Why are the outlets and lights in a house wired in parallel instead of in series?",
            "options": [
              {
                "text": "Parallel wiring uses less copper wire",
                "explanation": "Parallel wiring generally uses more wire, not less, because each branch needs its own path. Homes use parallel wiring for full voltage and independent operation."
              },
              {
                "text": "Series wiring would deliver too much voltage to each device",
                "explanation": "It is the opposite: in series, devices would split the voltage and each would get LESS than it needs. Parallel wiring gives every device the full voltage."
              },
              {
                "text": "Each device gets full voltage and works independently of the others",
                "correct": true,
                "explanation": "Correct! In parallel, every outlet and light gets the same full source voltage, and turning off or losing one device does not affect the others."
              },
              {
                "text": "Parallel wiring prevents short circuits from ever happening",
                "explanation": "Short circuits can happen in any wiring arrangement; that is why homes have fuses or breakers. Parallel wiring is used for full voltage at every device and independent operation."
              }
            ]
          },
          {
            "id": "EI2-007",
            "text": "What is the main purpose of a fuse or circuit breaker?",
            "options": [
              {
                "text": "To open the circuit when current gets dangerously high",
                "correct": true,
                "explanation": "Correct! Both devices break the circuit when current exceeds a safe level, protecting the wiring from overheating and preventing fires. A fuse melts once; a breaker trips and can be reset."
              },
              {
                "text": "To increase the voltage supplied to appliances",
                "explanation": "Fuses and breakers do not change voltage; that is the job of a transformer. Their purpose is to open the circuit when current climbs to a dangerous level."
              },
              {
                "text": "To store extra electricity for power outages",
                "explanation": "Storing energy is what a battery does. A fuse or breaker is a safety device that opens the circuit when too much current flows."
              },
              {
                "text": "To keep current flowing during a short circuit",
                "explanation": "This is backwards: during a short circuit, current surges dangerously high, and the fuse or breaker STOPS it by opening the circuit."
              }
            ]
          },
          {
            "id": "EI2-008",
            "text": "A 12-ohm resistor and a 6-ohm resistor are connected in parallel. What is the total resistance?",
            "options": [
              {
                "text": "18 ohms",
                "explanation": "Adding the values gives the series total. For two parallel resistors use product over sum: (12 x 6) / (12 + 6) = 72 / 18 = 4 ohms."
              },
              {
                "text": "9 ohms",
                "explanation": "This is the average of the two values, which is not how parallel resistance works. Use product over sum: (12 x 6) / (12 + 6) = 72 / 18 = 4 ohms."
              },
              {
                "text": "6 ohms",
                "explanation": "A parallel total must be LESS than the smallest branch, so it must come out below 6 ohms. Product over sum gives (12 x 6) / (12 + 6) = 72 / 18 = 4 ohms."
              },
              {
                "text": "4 ohms",
                "correct": true,
                "explanation": "Correct! Product over sum: (12 x 6) / (12 + 6) = 72 / 18 = 4 ohms. And 4 ohms is less than the smallest branch (6 ohms), which confirms the answer makes sense."
              }
            ]
          }
        ],
        "quizConfig": {
          "questionsPerQuiz": 6
        }
      },
      {
        "id": "EI-3",
        "title": "Electronic Components",
        "description": "Meet the building blocks of every circuit: resistors, capacitors, inductors, diodes, transistors, relays, transformers, batteries, and integrated circuits. Learn what each part does and when to use it.",
        "lesson": {
          "intro": "Every radio, vehicle, and piece of gear in the military is built from a small set of basic electronic parts. Once you know what each component does, circuit questions on the ASVAB get a lot easier. Think of components like members of a squad: each one has a specific job. Resistors hold current back, capacitors store energy for a moment, diodes act like one-way doors, and transistors do the switching and amplifying. In this chapter you will learn each component's job, the symbol-level idea behind it, and a few safety points that show up on the test.",
          "concepts": [
            {
              "title": "Resistors and Potentiometers",
              "content": "A resistor's job is to limit (resist) the flow of current. Resistance is measured in ohms. Without resistors, sensitive parts like LEDs would draw too much current and burn out. Resistors are color-coded with painted bands that tell you their value. A potentiometer is a variable resistor: it has a knob or slider that changes its resistance. The volume knob on a radio and a dimmer control are classic potentiometers. Key idea for the test: more resistance means less current for the same voltage (Ohm's law), and a potentiometer lets you adjust that resistance on the fly."
            },
            {
              "title": "Capacitors: Tiny Energy Tanks",
              "content": "A capacitor stores electrical charge on two metal plates separated by an insulator, then releases that charge quickly when needed. Capacitance is measured in farads (usually microfarads in real circuits). Capacitors smooth out ripples in power supplies, provide quick bursts of energy for things like camera flashes, and block DC while letting AC signals pass. SAFETY: a large capacitor can hold a dangerous charge long after the equipment is unplugged. That is why technicians discharge capacitors before working inside old TVs, microwave ovens, or power supplies. Power off does not always mean safe."
            },
            {
              "title": "Inductors, Coils, and Transformers",
              "content": "An inductor is a coil of wire that stores energy in a magnetic field and resists changes in current. Inductance is measured in henries. Coils are used in filters, motors, and tuning circuits. A transformer is two coils (a primary and a secondary) wound near each other. AC in the primary creates a changing magnetic field that induces voltage in the secondary. The turns ratio sets the voltage change: if the secondary has half the turns of the primary, it puts out half the voltage (step-down). More secondary turns than primary means higher output voltage (step-up). Transformers only work on AC or pulsing current, because a steady DC current makes no changing magnetic field."
            },
            {
              "title": "Diodes and LEDs: One-Way Valves",
              "content": "A diode lets current flow in only one direction, like a one-way valve or a check valve in a water line. Current flows from the anode to the cathode when the diode is forward-biased; it blocks flow the other way. This one-way behavior is what makes rectification possible: diodes convert AC (which flips direction) into pulsing DC. Your phone charger uses diodes to do exactly that. An LED (light-emitting diode) is a diode that gives off light when current flows through it in the correct direction. LEDs are efficient and long-lasting, but they need a resistor in series to limit current or they will burn out."
            },
            {
              "title": "Transistors, Relays, and Solenoids",
              "content": "A transistor is a tiny semiconductor device that acts as a switch or an amplifier. A small current or voltage at one terminal controls a much larger current through the other two terminals. That is the whole trick behind modern electronics: small signals controlling big ones, millions of times per second. A relay does the same basic job mechanically: a small current through a coil creates a magnetic field that pulls a set of contacts closed (or open), switching a separate, often much larger, circuit. Your car's starter uses a relay so a small key switch can control a huge starter current. A solenoid is a coil with a movable iron plunger; when energized, the plunger moves and does mechanical work, like engaging a starter gear or opening a valve."
            },
            {
              "title": "Batteries, Cells, and Integrated Circuits",
              "content": "A cell is a single chemical unit that produces voltage (a standard alkaline AA cell is 1.5 volts). A battery is one or more cells packaged together. Connect cells in SERIES (positive to negative in a chain) and the voltages ADD: four 1.5 volt cells in series give 6 volts. Connect cells in PARALLEL (positives together, negatives together) and the voltage stays the same but the capacity adds, so the battery lasts longer and can supply more current. Memory hook: series stacks voltage, parallel stacks capacity. Finally, an integrated circuit (IC or chip) packs thousands to billions of transistors, resistors, and other parts onto one small piece of silicon. ICs are the brains of radios, computers, and nearly all modern gear."
            }
          ],
          "examples": [
            {
              "problem": "A transformer has 500 turns on its primary winding and 100 turns on its secondary. The primary is connected to 120 volts AC. What voltage appears at the secondary?",
              "steps": [
                "Find the turns ratio: primary to secondary is 500 to 100, which simplifies to 5 to 1.",
                "A 5 to 1 ratio with fewer turns on the secondary means this is a step-down transformer: output voltage is the input divided by 5.",
                "Compute: 120 volts divided by 5 equals 24 volts.",
                "The secondary delivers 24 volts AC."
              ],
              "tip": "Secondary voltage equals primary voltage times (secondary turns divided by primary turns). Fewer secondary turns always means lower voltage."
            },
            {
              "problem": "You need 9 volts for a field radio but you only have a box of fresh 1.5 volt cells. How should you connect them, and how many do you need?",
              "steps": [
                "Series connections add voltage, so chain cells positive to negative.",
                "Divide the voltage you need by the voltage per cell: 9 divided by 1.5 equals 6.",
                "Connect 6 cells in series: 6 times 1.5 equals 9 volts.",
                "If you also wanted longer run time at 9 volts, you could build a second series string of 6 cells and connect the two strings in parallel: still 9 volts, but double the capacity."
              ],
              "tip": "Series adds voltage, parallel adds capacity. Check your answer by multiplying cells times volts per cell."
            },
            {
              "problem": "Pick the right component for each job: (a) convert AC from the wall into DC, (b) let a small dashboard switch control the heavy current to a starter motor, (c) adjust the brightness of a panel lamp smoothly.",
              "steps": [
                "(a) Converting AC to DC is rectification, and rectification needs one-way valves for current. That is the diode's job, so use diodes (a rectifier).",
                "(b) A small current controlling a big separate circuit is exactly what a relay does: the switch energizes the relay coil, and the relay contacts carry the heavy motor current.",
                "(c) Smoothly adjusting current to a lamp calls for a variable resistor, so use a potentiometer as a dimmer."
              ],
              "tip": "Match the component to its one-sentence job description: diode equals one-way valve, relay equals small current switching a big one, potentiometer equals adjustable resistance."
            }
          ],
          "summary": "Resistors limit current, and potentiometers are resistors you can adjust. Capacitors store charge and can still bite after the power is off, so discharge them first. Inductors are coils that store energy in a magnetic field, and transformers use two coils and a turns ratio to step AC voltage up or down. Diodes pass current one way and make rectification (AC to DC) possible; LEDs are diodes that light up. Transistors are tiny switches and amplifiers, relays let small currents switch big ones, and solenoids turn current into mechanical motion. Cells in series add voltage; cells in parallel add capacity. Integrated circuits pack huge numbers of these parts onto one chip. Learn each part's one-line job and you will recognize it instantly on test day."
        },
        "questions": [
          {
            "id": "EI3-001",
            "text": "What is the primary purpose of a resistor in a circuit?",
            "options": [
              {
                "text": "To store electrical charge for later use",
                "explanation": "Storing charge is the job of a capacitor, not a resistor. A resistor does not store energy; it opposes current flow and gives off any excess energy as heat."
              },
              {
                "text": "To limit the flow of current",
                "explanation": "Correct! A resistor opposes (resists) current flow, measured in ohms. Resistors protect sensitive parts like LEDs by keeping current at a safe level.",
                "correct": true
              },
              {
                "text": "To convert AC into DC",
                "explanation": "Converting AC to DC is rectification, which is done with diodes. A resistor treats current the same in both directions."
              },
              {
                "text": "To amplify weak signals",
                "explanation": "Amplification is a transistor's job. A resistor cannot make a signal stronger; it can only reduce current or drop voltage."
              }
            ]
          },
          {
            "id": "EI3-002",
            "text": "The volume knob on a radio smoothly adjusts loudness. Which component is it most likely to be?",
            "options": [
              {
                "text": "A relay",
                "explanation": "A relay is an on-off switch operated by an electromagnet. It snaps between states and cannot provide a smooth, gradual adjustment."
              },
              {
                "text": "A diode",
                "explanation": "A diode is a one-way valve for current. It has no knob or adjustable value, so it cannot act as a volume control."
              },
              {
                "text": "A transformer",
                "explanation": "A transformer steps AC voltage up or down using a fixed turns ratio. It is not an adjustable control you turn with a knob."
              },
              {
                "text": "A potentiometer",
                "explanation": "Correct! A potentiometer is a variable resistor. Turning the knob changes its resistance, which smoothly adjusts the signal level, making it perfect for volume and dimmer controls.",
                "correct": true
              }
            ]
          },
          {
            "id": "EI3-003",
            "text": "A technician unplugs an old power supply but still gets a painful shock from inside it. Which component most likely caused the shock?",
            "options": [
              {
                "text": "A capacitor that was still holding a charge",
                "explanation": "Correct! Capacitors store electrical charge and large ones can hold a dangerous charge long after power is removed. Technicians safely discharge capacitors before working inside equipment.",
                "correct": true
              },
              {
                "text": "A resistor that was still limiting current",
                "explanation": "A resistor does not store energy. Once power is removed, a resistor has no charge left to deliver a shock."
              },
              {
                "text": "An LED that was still lit",
                "explanation": "An LED only emits light while current flows through it, and it stores essentially no energy of its own. It could not shock anyone after the unit was unplugged."
              },
              {
                "text": "A fuse that had blown",
                "explanation": "A blown fuse is an open circuit; it interrupts current rather than storing energy. It poses no shock hazard after power is removed."
              }
            ]
          },
          {
            "id": "EI3-004",
            "text": "Why are diodes used in a phone charger?",
            "options": [
              {
                "text": "They increase the wall voltage to a higher level",
                "explanation": "Stepping voltage up or down is done by a transformer or converter circuit, not by the diodes themselves. Diodes control the direction of current, not its voltage level."
              },
              {
                "text": "They store energy so the phone charges faster",
                "explanation": "Diodes do not store energy. Energy storage for smoothing the output is handled by capacitors."
              },
              {
                "text": "They allow current to flow in only one direction, converting AC to DC",
                "explanation": "Correct! A diode is a one-way valve for current. Arranged as a rectifier, diodes turn the back-and-forth AC from the wall into one-direction DC that a phone battery needs.",
                "correct": true
              },
              {
                "text": "They limit current with their color-coded resistance value",
                "explanation": "Color-coded values belong to resistors. A diode's job is direction control, not setting a resistance value."
              }
            ]
          },
          {
            "id": "EI3-005",
            "text": "Which statement best describes what a transistor does?",
            "options": [
              {
                "text": "It stores charge on two metal plates separated by an insulator",
                "explanation": "That describes a capacitor. A transistor is a semiconductor device with a completely different job."
              },
              {
                "text": "It acts as a tiny switch or amplifier, using a small signal to control a larger current",
                "explanation": "Correct! A small current or voltage at one terminal of a transistor controls a much larger current through the others. This switching and amplifying action is the foundation of modern electronics.",
                "correct": true
              },
              {
                "text": "It converts electrical current into mechanical motion with a plunger",
                "explanation": "A coil with a movable plunger is a solenoid. Transistors have no moving parts at all."
              },
              {
                "text": "It steps AC voltage up or down using two coils of wire",
                "explanation": "Two coupled coils that change AC voltage make up a transformer, not a transistor. The similar names trip people up, so read carefully on test day."
              }
            ]
          },
          {
            "id": "EI3-006",
            "text": "A step-down transformer has 400 turns on the primary and 100 turns on the secondary. If 240 volts AC is applied to the primary, what is the secondary voltage?",
            "options": [
              {
                "text": "960 volts",
                "explanation": "That would be a step-up result from multiplying by 4. With fewer turns on the secondary, the voltage goes down, not up."
              },
              {
                "text": "240 volts",
                "explanation": "The voltage only stays the same when the turns ratio is 1 to 1. Here the secondary has one quarter of the primary turns, so the voltage must change."
              },
              {
                "text": "120 volts",
                "explanation": "That would be correct for a 2 to 1 ratio, but this transformer's ratio is 400 to 100, which is 4 to 1. Divide by 4, not by 2."
              },
              {
                "text": "60 volts",
                "explanation": "Correct! The turns ratio is 400 to 100, or 4 to 1 step-down. Secondary voltage equals 240 divided by 4, which is 60 volts.",
                "correct": true
              }
            ]
          },
          {
            "id": "EI3-007",
            "text": "Three 1.5 volt cells are connected in series. What is the total voltage of the combination?",
            "options": [
              {
                "text": "4.5 volts",
                "explanation": "Correct! Cells in series add their voltages: 1.5 plus 1.5 plus 1.5 equals 4.5 volts.",
                "correct": true
              },
              {
                "text": "1.5 volts",
                "explanation": "The voltage stays at 1.5 volts only if the cells are connected in parallel. In series, the voltages add together."
              },
              {
                "text": "3.0 volts",
                "explanation": "That would be the total for only two cells in series. With three cells, add 1.5 volts three times."
              },
              {
                "text": "0.5 volts",
                "explanation": "Series cells never divide the voltage down. Their voltages add, so the total is higher than a single cell, not lower."
              }
            ]
          },
          {
            "id": "EI3-008",
            "text": "In a vehicle, a small current from the ignition switch needs to control the very large current going to the starter motor. Which component is designed for this job?",
            "options": [
              {
                "text": "A capacitor",
                "explanation": "A capacitor stores and releases charge; it cannot use one circuit to switch another. It is the wrong tool for controlling a heavy motor current."
              },
              {
                "text": "A potentiometer",
                "explanation": "A potentiometer adjusts resistance gradually, and its small contacts could never handle starter-motor current. This job needs a switching device, not an adjustable resistor."
              },
              {
                "text": "A relay",
                "explanation": "Correct! A relay uses a small current through its coil to create a magnetic field that closes heavy-duty contacts, letting a small switch safely control a much larger circuit like a starter motor.",
                "correct": true
              },
              {
                "text": "An LED",
                "explanation": "An LED is a diode that produces light. It indicates status on a dashboard but cannot switch a large current."
              }
            ]
          }
        ],
        "quizConfig": {
          "questionsPerQuiz": 6
        }
      },
      {
        "id": "EI-4",
        "title": "Reading Schematics and Wiring",
        "description": "Learn to read circuit schematics like a map: recognize the standard symbols for batteries, resistors, capacitors, diodes, switches, and more. Then move into real-world wiring, including US household wire colors, wire gauge, breaker sizing, and grounded plugs.",
        "lesson": {
          "intro": "Every piece of military electronics, from a radio to a generator panel, comes with a schematic: a simple drawing that shows how the circuit is put together. Once you can read one, you can troubleshoot almost anything. The good news is that schematics use a small set of standard symbols, and the ASVAB loves to ask about them. In this chapter you will learn those symbols, practice following a simple circuit on paper, and then step into practical wiring: which wire color does what in a US household circuit, how wire thickness is measured, and why the ground pin on a plug can save your life. None of this requires math. It is pure recognition and common sense, which makes it some of the easiest points you can earn on test day.",
          "concepts": [
            {
              "title": "What a Schematic Is",
              "content": "A schematic is a map of a circuit. It does not show what the parts physically look like or where they sit inside the equipment. Instead, it uses standard symbols connected by straight lines to show how electricity flows from one component to the next. The lines represent wires or conductive paths. A dot where lines cross means the wires are connected; lines that cross without a dot are not connected. Because everyone uses the same symbols, a technician in one unit can read a schematic drawn by someone on the other side of the world. Reading a schematic is like reading a road map: you trace the path the current takes from the power source, through each component, and back to the source."
            },
            {
              "title": "The Core Symbols You Must Know",
              "content": "Learn these by their word descriptions, because that is how the test presents them. Battery: a pair of parallel lines, one long and one short. The long line is the positive terminal and the short line is the negative terminal. Resistor: a zigzag line, like a sawtooth or a stretched letter W. Capacitor: two parallel lines of equal length with a gap between them (do not confuse it with the battery, whose lines are unequal). Diode: a triangle pointing at a bar; the triangle shows the direction conventional current is allowed to flow, and the bar blocks it the other way. Ground: a set of short horizontal lines stacked and getting smaller as they go down, like a small upside-down pyramid. Switch: a line that pivots at a hinge point, like a tiny drawbridge that opens and closes the circuit. Lamp or light bulb: a circle with a loop or curl of wire inside it."
            },
            {
              "title": "Following a Simple Circuit on Paper",
              "content": "To trace a circuit, start at the positive terminal of the power source (the long line of the battery symbol) and follow the wire line with your finger. Ask three questions as you go. First, is there a complete loop back to the negative terminal? If yes, current can flow. Second, are there any open switches along the path? An open switch breaks the loop and stops all current in that path. Third, what components does the current pass through, and in what order? If components sit one after another on the same single path, they are in series and the same current flows through all of them. If the path splits into branches that rejoin later, those branches are in parallel and the current divides between them. A classic simple schematic is a battery, a switch, and a lamp in one loop: close the switch, the loop is complete, and the lamp lights."
            },
            {
              "title": "US Household Wire Colors",
              "content": "In standard US residential wiring, insulation color tells you the job of each wire. Black is the hot wire: it carries current from the panel to the device and is the dangerous one. (Red is also used as a second hot wire in some circuits.) White is the neutral wire: it completes the circuit by carrying current back to the panel. Green, or bare copper with no insulation at all, is the ground wire: it normally carries no current and exists purely for safety, giving fault current a safe path to the earth so a breaker can trip instead of a person getting shocked. Memory hook: black means back off (hot), white returns the current (neutral), and green is like grass, connected to the ground."
            },
            {
              "title": "Wire Gauge: AWG",
              "content": "Wire thickness in the US is measured in American Wire Gauge, or AWG. Here is the part that trips people up: the numbering runs backwards. A LOWER gauge number means a THICKER wire, and a thicker wire can safely carry MORE current. So 10 AWG wire is thicker than 14 AWG wire. Common household pairings to remember: 14 gauge wire is rated for 15 amp circuits (typical lighting), 12 gauge wire for 20 amp circuits (typical outlets), and 10 gauge wire for 30 amp circuits (dryers and similar heavy loads). Why does thickness matter? A wire that is too thin for its current acts like a weak resistor: it heats up, the insulation can melt, and a fire can start. Think of gauge like a water pipe: a fatter pipe moves more water; a fatter wire moves more current safely."
            },
            {
              "title": "Breakers, Plugs, and Grounding",
              "content": "A circuit breaker is a safety switch that trips (opens the circuit) when current exceeds its rating. The breaker must be matched to the wire, not to the appliance: the breaker rating can never exceed what the wire can safely carry. Putting a 30 amp breaker on thin 14 gauge wire is dangerous, because the wire would overheat long before the breaker ever tripped. The breaker protects the wiring; sizing it too big removes that protection. On plugs, the third round pin is the ground pin, connected to the green or bare ground wire. If a hot wire inside an appliance comes loose and touches the metal case, the ground path carries that fault current straight back to the panel and trips the breaker instantly. Without the ground, the metal case would sit there energized, waiting for someone to touch it. That is why you should never snap the ground pin off a plug to make it fit a two-slot outlet."
            }
          ],
          "examples": [
            {
              "problem": "A schematic shows a symbol made of two parallel lines, one noticeably longer than the other. Nearby is another symbol made of two parallel lines of equal length with a gap between them. Which is the battery and which is the capacitor?",
              "steps": [
                "Recall the rule: a battery symbol has UNEQUAL lines, one long (positive terminal) and one short (negative terminal).",
                "A capacitor symbol has two EQUAL parallel lines separated by a gap.",
                "The first symbol (long line plus short line) is therefore the battery.",
                "The second symbol (two equal lines) is the capacitor."
              ],
              "tip": "Unequal lines equals battery, equal lines equals capacitor. If the lines match, it stores a charge; if one is longer, it supplies the charge."
            },
            {
              "problem": "You need to wire a new 20 amp outlet circuit. Should you use 14 gauge or 12 gauge wire, and what size breaker should protect it?",
              "steps": [
                "Recall the standard pairings: 14 AWG handles 15 amps, 12 AWG handles 20 amps, 10 AWG handles 30 amps.",
                "The circuit is 20 amps, so 14 gauge is too thin. Choose 12 gauge.",
                "Match the breaker to the wire: 12 gauge wire pairs with a 20 amp breaker.",
                "Check the logic: the breaker (20 amps) does not exceed what the wire can carry, so the wire is protected."
              ],
              "tip": "Lower AWG number means thicker wire and more current capacity. The breaker protects the wire, so never install a breaker rated higher than the wire can handle."
            },
            {
              "problem": "You trace a simple schematic: from the battery's long line, the wire runs to a pivoting-line symbol shown in the open position, then to a circle with a loop inside, then back to the battery's short line. Will the lamp light?",
              "steps": [
                "Identify the symbols: the pivoting line is a switch, and the circle with a loop is a lamp.",
                "The circuit is one single loop: battery, switch, lamp, back to battery. Everything is in series.",
                "The switch is drawn OPEN, so the loop is broken at that point.",
                "An open switch stops current everywhere in a series loop, so no current reaches the lamp. The lamp does not light. Closing the switch would complete the loop and light it."
              ],
              "tip": "In a series loop, one open switch kills the whole circuit. Always check switch positions before deciding whether current flows."
            }
          ],
          "summary": "A schematic is a symbol map of a circuit: battery (one long line, one short line), resistor (zigzag), capacitor (two equal parallel lines), diode (triangle against a bar, pointing the direction current may flow), ground (descending stack of shrinking lines), switch (pivoting line), and lamp (circle with a loop). Trace circuits from the positive terminal and check for a complete loop and open switches. In US household wiring, black is hot, white is neutral, and green or bare copper is ground. Wire gauge runs backwards: lower AWG number means thicker wire and more current, with 14 AWG for 15 amps, 12 AWG for 20 amps, and 10 AWG for 30 amps. Breakers are sized to protect the wire, never larger than the wire's rating, and the round third pin on a plug is the ground that trips the breaker during a fault. Master these facts and the schematic and wiring questions become free points."
        },
        "questions": [
          {
            "id": "EI4-001",
            "text": "On a schematic, a symbol shows two parallel lines, one long and one short. What component is this?",
            "options": [
              {
                "text": "A battery",
                "explanation": "Correct! The battery symbol uses unequal parallel lines: the long line is the positive terminal and the short line is the negative terminal.",
                "correct": true
              },
              {
                "text": "A capacitor",
                "explanation": "A capacitor is drawn as two parallel lines of EQUAL length with a gap between them. Unequal lines indicate a battery."
              },
              {
                "text": "A resistor",
                "explanation": "A resistor is drawn as a zigzag line, not as parallel lines."
              },
              {
                "text": "A switch",
                "explanation": "A switch is drawn as a line that pivots at a hinge point, like a small drawbridge, not as parallel lines."
              }
            ]
          },
          {
            "id": "EI4-002",
            "text": "Which schematic symbol represents a resistor?",
            "options": [
              {
                "text": "A circle with a loop of wire inside",
                "explanation": "A circle with a loop inside represents a lamp or light bulb, not a resistor."
              },
              {
                "text": "A zigzag line",
                "explanation": "Correct! The standard resistor symbol is a zigzag or sawtooth line, representing opposition to current flow.",
                "correct": true
              },
              {
                "text": "A triangle pointing at a bar",
                "explanation": "A triangle against a bar is the diode symbol, which allows current in only one direction."
              },
              {
                "text": "A stack of shrinking horizontal lines",
                "explanation": "Descending lines that get smaller represent a ground connection, not a resistor."
              }
            ]
          },
          {
            "id": "EI4-003",
            "text": "A diode symbol shows a triangle pointing at a bar. What does this symbol tell you about current?",
            "options": [
              {
                "text": "Current flows equally well in both directions",
                "explanation": "That describes a plain wire or a resistor. A diode is specifically a one-way device."
              },
              {
                "text": "Current is stored between two plates",
                "explanation": "Storing charge between plates describes a capacitor, whose symbol is two equal parallel lines."
              },
              {
                "text": "Current is allowed to flow only in the direction the triangle points",
                "explanation": "Correct! A diode is a one-way valve for current: conventional current flows in the direction the triangle points, and the bar blocks flow the other way.",
                "correct": true
              },
              {
                "text": "The circuit is connected to the earth at that point",
                "explanation": "A connection to earth is shown by the ground symbol, a descending stack of shrinking lines, not by a triangle and bar."
              }
            ]
          },
          {
            "id": "EI4-004",
            "text": "In standard US household wiring, which wire is the hot wire that carries current from the panel to the device?",
            "options": [
              {
                "text": "The white wire",
                "explanation": "White is the neutral wire, which carries current back to the panel to complete the circuit."
              },
              {
                "text": "The green wire",
                "explanation": "Green (or bare copper) is the safety ground wire and normally carries no current at all."
              },
              {
                "text": "The bare copper wire",
                "explanation": "Bare copper serves the same role as green: it is the ground wire, present only for safety."
              },
              {
                "text": "The black wire",
                "explanation": "Correct! Black is the hot wire in US household wiring. It carries current from the panel and is the wire most likely to shock you.",
                "correct": true
              }
            ]
          },
          {
            "id": "EI4-005",
            "text": "Which of the following wires is the THICKEST?",
            "options": [
              {
                "text": "14 AWG",
                "explanation": "In the AWG system a higher number means a thinner wire, so 14 AWG is thinner than both 12 and 10 AWG."
              },
              {
                "text": "10 AWG",
                "explanation": "Correct! AWG numbering runs backwards: the lower the gauge number, the thicker the wire. Of these choices, 10 AWG is the lowest number and therefore the thickest.",
                "correct": true
              },
              {
                "text": "12 AWG",
                "explanation": "12 AWG is thicker than 14 AWG but thinner than 10 AWG, since lower gauge numbers mean thicker wire."
              },
              {
                "text": "16 AWG",
                "explanation": "16 AWG is the highest number listed, which makes it the THINNEST wire of the four, not the thickest."
              }
            ]
          },
          {
            "id": "EI4-006",
            "text": "Why is it dangerous to protect thin 14 gauge wire with an oversized 30 amp breaker?",
            "options": [
              {
                "text": "The breaker would trip constantly and cut power to the circuit",
                "explanation": "An OVERSIZED breaker trips too rarely, not too often. The danger is the opposite: it fails to trip when it should."
              },
              {
                "text": "The wire could overheat and start a fire before the breaker ever trips",
                "explanation": "Correct! The breaker exists to protect the wire. 14 gauge wire is rated for about 15 amps, so a 30 amp breaker would let the wire carry far more current than it can handle, overheating it before the breaker reacts.",
                "correct": true
              },
              {
                "text": "The breaker would lower the voltage available to appliances",
                "explanation": "A breaker does not regulate voltage. It simply opens the circuit when current exceeds its rating."
              },
              {
                "text": "Nothing is wrong; a bigger breaker just allows more devices",
                "explanation": "This is a dangerous assumption. The breaker rating must never exceed the safe current rating of the wire it protects."
              }
            ]
          },
          {
            "id": "EI4-007",
            "text": "What is the purpose of the round third pin on a grounded US plug?",
            "options": [
              {
                "text": "It carries the normal operating current to the appliance",
                "explanation": "Normal operating current flows through the hot and neutral blades. The ground pin carries current only during a fault."
              },
              {
                "text": "It doubles the power available to the appliance",
                "explanation": "The ground pin does not deliver power at all. It is a safety connection only."
              },
              {
                "text": "It gives fault current a safe path so the breaker trips instead of a person getting shocked",
                "explanation": "Correct! The ground pin connects the appliance case to the ground wire. If a hot wire touches the metal case, the fault current flows through the ground path and trips the breaker immediately, instead of energizing the case.",
                "correct": true
              },
              {
                "text": "It keeps the plug from being inserted upside down",
                "explanation": "While the pin does affect plug orientation, that is not its purpose. Its job is electrical safety through grounding."
              }
            ]
          },
          {
            "id": "EI4-008",
            "text": "A schematic shows one loop: a battery, an open switch, and a lamp connected in series. What happens in this circuit?",
            "options": [
              {
                "text": "The lamp lights at half brightness",
                "explanation": "There is no partial flow through an open switch. An open switch stops current completely, so the lamp cannot light at any brightness."
              },
              {
                "text": "No current flows and the lamp stays off until the switch is closed",
                "explanation": "Correct! An open switch breaks the loop, and in a series circuit one break stops all current. Closing the switch completes the loop and lights the lamp.",
                "correct": true
              },
              {
                "text": "Current flows through the lamp but skips the switch",
                "explanation": "In a series loop there is only one path. Current cannot skip any component, so the open switch blocks everything."
              },
              {
                "text": "The battery drains quickly because the circuit is open",
                "explanation": "An open circuit draws no current, so the battery is not being drained. Batteries drain when current flows, not when the loop is broken."
              }
            ]
          }
        ],
        "quizConfig": {
          "questionsPerQuiz": 6
        }
      },
      {
        "id": "EI-5",
        "title": "AC, DC, and Electrical Power",
        "description": "Learn the difference between direct and alternating current, why AC powers our homes, how rectifiers convert AC to DC, and how to calculate electrical power with P = V x I.",
        "lesson": {
          "intro": "Every piece of electrical gear you will touch in the military runs on one of two kinds of current: DC or AC. Your flashlight, radio battery, and vehicle electrical system use DC. The outlets in the barracks and the generators powering a field kitchen supply AC. In this chapter you will learn what makes them different, why AC won the battle for long-distance power delivery, and how to calculate electrical power using one simple formula: P = V x I. Master that formula and a handful of standards, and you will be ready for a big chunk of the Electronics Information section.",
          "concepts": [
            {
              "title": "DC: Direct Current",
              "content": "Direct current (DC) flows in one direction only, at a steady level. Batteries are the classic DC source: a AA cell pushes conventional current out of its positive terminal, through the circuit, and back into its negative terminal, always the same way. Solar panels and vehicle alternator systems (after internal rectification) also deliver DC. Because DC never changes direction, it is easy to store in batteries and it is what almost all electronic circuits, from radios to computers, actually need internally. Remember: batteries equal DC, always."
            },
            {
              "title": "AC: Alternating Current",
              "content": "Alternating current (AC) reverses direction many times per second. Instead of flowing steadily one way, the current pushes forward, slows, reverses, and pushes back, over and over in a smooth wave pattern. The number of complete back-and-forth cycles per second is the frequency, measured in hertz (Hz). Wall outlets, power lines, and generators at power plants all supply AC. If you plug something into an outlet, it is running on AC, at least until something inside converts it."
            },
            {
              "title": "Why AC Won: Transformers and Transmission",
              "content": "In the late 1800s there was a famous fight between DC (Edison) and AC (Tesla and Westinghouse). AC won for one big reason: transformers. A transformer can easily step AC voltage up or down, but it does not work on steady DC. Power companies step voltage way up (hundreds of thousands of volts) for long-distance lines. Higher voltage means less current is needed to deliver the same power, and less current means far less energy wasted as heat in the wires. Near your home, transformers step the voltage back down to a safe level. Cheap, efficient voltage changing is why AC runs the power grid."
            },
            {
              "title": "US Standards: 120 Volts, 60 Hertz",
              "content": "In the United States, standard household outlets deliver about 120 volts AC at a frequency of 60 hertz. That 60 Hz means the current completes 60 full back-and-forth cycles every second. Large appliances like electric dryers, ranges, and central air conditioners use special 240-volt circuits to deliver more power. Many other countries use 220 to 240 volts at 50 Hz, which is why travelers need adapters and converters. For the ASVAB, memorize the US pair: 120 volts, 60 Hz."
            },
            {
              "title": "Rectifiers: Converting AC to DC",
              "content": "Your phone charger plugs into an AC outlet, but the phone battery needs DC. The device that converts AC into DC is called a rectifier, built from diodes, which are one-way valves for current. A rectifier blocks or flips the reverse half of the AC wave so current only flows one direction, and filter components smooth it into steady DC. Nearly every electronic device you plug into the wall has a rectifier inside its power supply. Going the other direction, DC to AC, takes a different device called an inverter."
            },
            {
              "title": "Power: P = V x I",
              "content": "Electrical power is the rate at which electrical energy is used, measured in watts (W). The formula is simple: Power equals Voltage times Current, or P = V x I. A device drawing 2 amps from a 120-volt outlet uses 120 x 2 = 240 watts. You can rearrange the formula too: I = P divided by V tells you the current, and V = P divided by I tells you the voltage. One kilowatt (kW) is 1000 watts. This formula shows up constantly on the ASVAB, so practice it until it is automatic."
            },
            {
              "title": "Watts vs Kilowatt-Hours, and Dedicated Circuits",
              "content": "Watts measure power, the rate of energy use right now. Kilowatt-hours (kWh) measure energy, which is power multiplied by time, and that is what the utility company bills you for. Run a 1000-watt (1 kW) heater for 3 hours and you use 3 kWh. Now think about current: a 1500-watt space heater at 120 volts draws 1500 / 120 = 12.5 amps, most of a standard 15-amp or 20-amp circuit by itself. That is why high-power appliances like dryers, ranges, and water heaters get their own dedicated circuits, often at 240 volts: it keeps the current in each wire at a safe level and prevents tripped breakers and overheated wiring. One more pairing to remember: a generator converts mechanical energy into electrical energy, while a motor does the opposite, converting electrical energy into mechanical motion. They are opposite machines built on the same principles."
            }
          ],
          "examples": [
            {
              "problem": "A microwave oven is rated at 1200 watts and plugs into a standard 120-volt outlet. How much current does it draw?",
              "steps": [
                "Start with the power formula: P = V x I.",
                "We know P = 1200 watts and V = 120 volts, and we need I.",
                "Rearrange the formula to solve for current: I = P / V.",
                "Plug in the numbers: I = 1200 / 120.",
                "Divide: 1200 / 120 = 10.",
                "The microwave draws 10 amps of current."
              ],
              "tip": "With 120-volt outlets, there is a quick shortcut: divide the wattage by 120. A 1200 W appliance draws 10 A, a 600 W appliance draws 5 A. Ten amps is a big share of a 15-amp circuit, which is why running two big appliances on one circuit trips the breaker."
            },
            {
              "problem": "A flashlight bulb runs on a 6-volt battery and draws 0.5 amps. How much power does the bulb use?",
              "steps": [
                "Use the power formula directly: P = V x I.",
                "Identify the values: V = 6 volts, I = 0.5 amps.",
                "Multiply: P = 6 x 0.5.",
                "6 x 0.5 = 3.",
                "The bulb uses 3 watts of power."
              ],
              "tip": "When you have voltage and current, just multiply, no rearranging needed. Watch your decimals: multiplying by 0.5 is the same as taking half."
            },
            {
              "problem": "A 2000-watt space heater runs for 4 hours. If electricity costs 15 cents per kilowatt-hour, how much did it cost to run?",
              "steps": [
                "First convert watts to kilowatts: 2000 watts = 2000 / 1000 = 2 kW.",
                "Energy equals power multiplied by time: 2 kW x 4 hours = 8 kilowatt-hours (kWh).",
                "Multiply energy by the price: 8 kWh x 15 cents = 120 cents.",
                "Convert to dollars: 120 cents = 1.20 dollars.",
                "Running the heater for 4 hours cost 1 dollar and 20 cents."
              ],
              "tip": "Watts tell you how fast energy is used; kilowatt-hours tell you how much was used in total. The electric company bills for kWh (energy), not watts (power)."
            }
          ],
          "summary": "DC flows one way and comes from batteries; AC reverses direction, comes from generators and wall outlets, and won the grid because transformers can step its voltage up for efficient long-distance transmission and back down for safe use. US household power is 120 volts at 60 Hz. Rectifiers convert AC to DC (inverters do the reverse). Power in watts is P = V x I, and you can rearrange it as I = P / V or V = P / I. Your electric bill charges for energy in kilowatt-hours, which is power times time. High-power appliances draw big currents, so they need dedicated circuits. And keep the opposites straight: generators turn mechanical energy into electrical energy, while motors turn electrical energy into mechanical energy. You have the core of electrical power in hand, keep drilling that formula."
        },
        "questions": [
          {
            "id": "EI5-001",
            "text": "Which of the following is a source of direct current (DC)?",
            "options": [
              {
                "text": "A battery",
                "explanation": "Correct! Batteries always supply direct current, which flows steadily in one direction from one terminal to the other.",
                "correct": true
              },
              {
                "text": "A household wall outlet",
                "explanation": "Wall outlets supply alternating current (AC), which in the US cycles 60 times per second (60 hertz)."
              },
              {
                "text": "A power plant generator",
                "explanation": "Power plant generators produce alternating current, which is what travels over transmission lines to homes."
              },
              {
                "text": "A transformer",
                "explanation": "A transformer is not a power source at all; it changes the voltage of AC power that passes through it."
              }
            ]
          },
          {
            "id": "EI5-002",
            "text": "Why did AC become the standard for long-distance electric power transmission?",
            "options": [
              {
                "text": "AC is easier to store in batteries",
                "explanation": "It is actually DC that batteries store; AC cannot be stored directly in a battery."
              },
              {
                "text": "Transformers can easily step AC voltage up and down, reducing losses over long lines",
                "explanation": "Correct! Transformers let power companies raise AC voltage for efficient long-distance transmission, then lower it for safe household use. Transformers do not work on steady DC.",
                "correct": true
              },
              {
                "text": "AC flows in only one direction, making it safer",
                "explanation": "AC reverses direction many times per second; it is DC that flows in only one direction."
              },
              {
                "text": "AC requires thicker wires than DC",
                "explanation": "Needing thicker wire would be a disadvantage, not a reason to adopt AC. High-voltage AC actually allows thinner wires because less current is needed."
              }
            ]
          },
          {
            "id": "EI5-003",
            "text": "What are the standard voltage and frequency of household outlets in the United States?",
            "options": [
              {
                "text": "240 volts at 50 Hz",
                "explanation": "220 to 240 volts at 50 Hz is common in Europe and many other countries, not the standard US outlet."
              },
              {
                "text": "120 volts at 50 Hz",
                "explanation": "The voltage is right, but US power runs at 60 cycles per second, not 50."
              },
              {
                "text": "12 volts at 60 Hz",
                "explanation": "12 volts is a typical vehicle battery voltage (DC), far below household outlet voltage."
              },
              {
                "text": "120 volts at 60 Hz",
                "explanation": "Correct! Standard US household outlets deliver about 120 volts of AC at a frequency of 60 hertz, meaning 60 complete cycles per second.",
                "correct": true
              }
            ]
          },
          {
            "id": "EI5-004",
            "text": "What device converts alternating current (AC) into direct current (DC)?",
            "options": [
              {
                "text": "An inverter",
                "explanation": "An inverter does the opposite job: it converts DC into AC, for example turning battery power into outlet-style power."
              },
              {
                "text": "A transformer",
                "explanation": "A transformer changes AC voltage levels up or down, but its output is still AC."
              },
              {
                "text": "A rectifier",
                "explanation": "Correct! A rectifier, built from diodes that act as one-way valves, forces current to flow in only one direction, converting AC into DC.",
                "correct": true
              },
              {
                "text": "A circuit breaker",
                "explanation": "A circuit breaker is a safety device that cuts off current when it gets too high; it does not convert current types."
              }
            ]
          },
          {
            "id": "EI5-005",
            "text": "A hair dryer draws 10 amps from a 120-volt outlet. How much power does it use?",
            "options": [
              {
                "text": "12 watts",
                "explanation": "This comes from dividing 120 by 10, but power requires multiplying voltage by current, not dividing."
              },
              {
                "text": "1200 watts",
                "explanation": "Correct! P = V x I, so P = 120 x 10 = 1200 watts.",
                "correct": true
              },
              {
                "text": "130 watts",
                "explanation": "This comes from adding 120 and 10, but the power formula multiplies voltage and current."
              },
              {
                "text": "600 watts",
                "explanation": "600 watts would be the result of 120 x 5, but this dryer draws 10 amps, so multiply 120 by 10."
              }
            ]
          },
          {
            "id": "EI5-006",
            "text": "A 1500-watt space heater plugs into a 120-volt outlet. How much current does it draw?",
            "options": [
              {
                "text": "8 amps",
                "explanation": "8 amps at 120 volts would be only 960 watts. Divide 1500 by 120 to find the actual current."
              },
              {
                "text": "15 amps",
                "explanation": "Close, but 15 amps at 120 volts would be 1800 watts. Work the division carefully: 1500 / 120."
              },
              {
                "text": "12.5 amps",
                "explanation": "Correct! I = P / V = 1500 / 120 = 12.5 amps. That is most of a standard circuit's capacity, which is why space heaters often trip breakers.",
                "correct": true
              },
              {
                "text": "180 amps",
                "explanation": "This would come from multiplying instead of dividing. To find current from power and voltage, use I = P / V."
              }
            ]
          },
          {
            "id": "EI5-007",
            "text": "A utility company bills customers based on kilowatt-hours (kWh). What does a kilowatt-hour measure?",
            "options": [
              {
                "text": "The total energy used over time",
                "explanation": "Correct! A kilowatt-hour is energy: power (kilowatts) multiplied by time (hours). A 1 kW device running for 1 hour uses 1 kWh.",
                "correct": true
              },
              {
                "text": "The rate of energy use at a given instant",
                "explanation": "The rate of energy use is power, measured in watts or kilowatts, not kilowatt-hours."
              },
              {
                "text": "The voltage delivered to the home",
                "explanation": "Voltage is measured in volts, and it is roughly constant regardless of how much you use."
              },
              {
                "text": "The current flowing through the meter",
                "explanation": "Current is measured in amps. Kilowatt-hours combine power and time to measure energy consumed."
              }
            ]
          },
          {
            "id": "EI5-008",
            "text": "Which statement best describes the relationship between a generator and a motor?",
            "options": [
              {
                "text": "Both convert electrical energy into heat",
                "explanation": "Converting electrical energy mostly into heat describes a heating element or a resistor, not generators and motors."
              },
              {
                "text": "A generator converts mechanical energy into electrical energy, while a motor does the reverse",
                "explanation": "Correct! A generator turns motion into electricity; a motor turns electricity into motion. They are opposite machines built on the same electromagnetic principles.",
                "correct": true
              },
              {
                "text": "A motor converts mechanical energy into electrical energy, while a generator does the reverse",
                "explanation": "This is backwards: the motor consumes electricity to create motion, and the generator uses motion to create electricity."
              },
              {
                "text": "Both store electrical energy for later use",
                "explanation": "Storing electrical energy is the job of a battery or capacitor; generators and motors convert energy between forms rather than storing it."
              }
            ]
          }
        ],
        "quizConfig": {
          "questionsPerQuiz": 6
        }
      },
      {
        "id": "EI-6",
        "title": "Magnetism, Motors, and Electrical Safety",
        "description": "Learn how electricity and magnetism work together to power motors and generators, then master the safety rules that keep electricians and mechanics alive on the job.",
        "lesson": {
          "intro": "This chapter ties together two big ideas. First, electricity and magnetism are two sides of the same coin: current creates magnetic fields, and moving magnets create current. That single relationship explains electromagnets, motors, and generators. Second, we cover electrical safety, the knowledge that matters most in the real world. The ASVAB loves both topics because they show you understand electricity as a working technician would, not just on paper. Take your time here. These concepts show up in the military every day, from vehicle alternators to shipboard generators to the outlet in your barracks bathroom.",
          "concepts": [
            {
              "title": "Electricity and Magnetism Are Linked",
              "content": "Any time current flows through a wire, a magnetic field forms in circles around that wire. This was discovered when a compass needle moved near a current-carrying wire. The bigger the current, the stronger the field. This connection is called electromagnetism, and it is the foundation for motors, generators, transformers, relays, and speakers. Remember the one-line version for test day: moving electric charge creates a magnetic field. No current, no field. The field appears the instant current flows and disappears the instant it stops, which is exactly what makes it so useful, you can switch magnetism on and off."
            },
            {
              "title": "Electromagnets: Coil Plus Core",
              "content": "A straight wire makes a weak field, so we wind the wire into a coil. Each loop adds its field to the next, concentrating the magnetism. Slide an iron core inside the coil and the field gets dramatically stronger, because iron focuses and multiplies magnetic field lines. That is an electromagnet. Three things make an electromagnet stronger: more turns of wire in the coil, more current through the wire, and a better iron core. Unlike a permanent magnet, an electromagnet can be turned on and off, and its strength can be adjusted by changing the current. That is why junkyard cranes, door locks, relays, and solenoids in your car starter all use electromagnets."
            },
            {
              "title": "Induction: Motion Makes Current",
              "content": "The link works in reverse too. If you move a magnet past a coil of wire, or move the coil past the magnet, a voltage is induced in the wire and current flows. This is electromagnetic induction. The key word is motion, or more precisely a changing magnetic field. A magnet sitting still next to a coil induces nothing. Move it faster, use a stronger magnet, or add more turns to the coil, and you induce more voltage. Induction is how every power plant generator, vehicle alternator, and transformer works. When the ASVAB asks how a generator produces electricity, the answer is induction: relative motion between a magnet and a coil."
            },
            {
              "title": "Motors and Generators in One Breath Each",
              "content": "A motor takes in electrical energy and puts out mechanical motion: current through a coil creates a magnetic field that pushes against another magnetic field, spinning the shaft. A generator is the exact same machine run backward: something mechanical spins a coil through a magnetic field, and induction produces electrical current. Motor: electricity in, motion out. Generator: motion in, electricity out. In fact, many machines can do both. Your car has one of each, the starter motor uses battery current to crank the engine, and the alternator uses engine rotation to generate current that recharges the battery."
            },
            {
              "title": "Current Is What Hurts You",
              "content": "People say do not touch high voltage, but current, measured in amps, is what actually injures and kills. Currents well under one amp, even a few hundredths of an amp, can stop a human heart if they pass through the chest. Voltage matters because it pushes current through your body, and your skin resistance is the main thing limiting that current. Wet skin has far lower resistance than dry skin, so the same voltage pushes much more current through you when you are wet or sweaty. That is why working with wet hands, standing on a wet floor, or handling electrical gear near water is so dangerous. Dry conditions, insulated tools, and rubber-soled boots all raise resistance and lower the current that could flow through you."
            },
            {
              "title": "Built-In Protections: Grounding, GFCIs, Fuses, and Breakers",
              "content": "Grounding gives fault current a safe, low-resistance path into the earth instead of through your body. The third round prong on a plug connects a tool's metal case to ground, so if a hot wire touches the case, the current flows to ground and trips the breaker instead of waiting to shock you. A GFCI, or ground fault circuit interrupter, watches the current going out and coming back; if even a tiny amount leaks, possibly through a person, it shuts off power in a fraction of a second. That is why GFCI outlets are required near water: bathrooms, kitchens, garages, and outdoors. Fuses and circuit breakers protect against overloads by opening the circuit when current gets too high. Never bypass one with a bigger fuse, a coin, or a wire, that removes the protection and invites overheated wiring and fire. If a fuse keeps blowing, the circuit is telling you something is wrong; find the cause."
            },
            {
              "title": "Field Safety Habits That Save Lives",
              "content": "First, capacitors store charge even after the power is off. Equipment like TV circuits, microwave ovens, and motor-start circuits can deliver a serious shock hours after being unplugged, so capacitors must be safely discharged before you work near them. Second, always test before touching: verify a circuit is dead with a meter or tester even if you flipped the breaker yourself, because breakers get mislabeled and switches fail. Third, respect extension cord gauge. A long, thin cord has too much resistance for a high-current tool; it drops voltage, overheats, and can start a fire. Bigger loads and longer runs need thicker wire, which means a lower gauge number, 12 gauge is thicker than 16 gauge. These habits are simple, and they are exactly what separates a safe technician from a statistic."
            }
          ],
          "examples": [
            {
              "problem": "A soldier is using an electric drill in a flooded motor pool bay. The drill has a cracked case and the outlet is a standard non-GFCI receptacle. What is wrong with this picture, and what should be done?",
              "steps": [
                "Identify the hazards one at a time. Standing water lowers the resistance between the soldier's body and ground, so any fault current has an easy path through him.",
                "The cracked case means a hot wire inside could contact the housing or the soldier's hand directly, energizing exactly what he is holding.",
                "The non-GFCI outlet means there is nothing watching for leakage current. A regular breaker only trips on a large overload, not the small current that can stop a heart.",
                "Fix the situation: stop work, take the damaged drill out of service, get out of the standing water, and use a GFCI-protected outlet or a portable GFCI adapter for any work near water.",
                "The safety chain here is resistance, fault path, and protection. Break the hazard at every link you can: dry footing, sound equipment, and GFCI protection."
              ],
              "tip": "On the ASVAB, water plus electricity almost always points to the same answers: wet skin means lower resistance and more current, and GFCI protection is required near water."
            },
            {
              "problem": "A generator on base keeps blowing its 20 amp fuse. A private suggests wrapping the fuse in foil so it stops blowing. Walk through why this is dangerous and what the correct action is.",
              "steps": [
                "Ask what the fuse is doing. It blows when current exceeds 20 amps, which means the circuit is drawing more current than the wiring is rated to carry safely.",
                "Wrapping the fuse in foil creates a solid metal path around it, so the fuse can never open the circuit. The protection is gone but the overload is still there.",
                "With no protection, the excess current keeps flowing, the wiring overheats, insulation melts, and a fire or destroyed equipment is the likely result.",
                "The blown fuse is a symptom, not the problem. The correct action is to find the cause of the overload, maybe a short circuit, a failing motor, or too many loads on one circuit, and fix it.",
                "Replace the fuse only with one of the exact same rating. A bigger fuse or a bypass just moves the failure point from a cheap fuse to the expensive wiring."
              ],
              "tip": "Never bypass or oversize a fuse or breaker. Any test answer involving foil, coins, wire jumpers, or a bigger fuse than specified is the wrong move every time."
            },
            {
              "problem": "A technician unplugs a microwave oven to replace a part, then reaches inside immediately. A moment later he gets a strong shock. The unit was unplugged, so what happened, and what should he have done?",
              "steps": [
                "Recall that capacitors store electrical charge. A microwave contains a large high-voltage capacitor that can hold a dangerous charge long after the power cord is pulled.",
                "Unplugging removes the source of new energy, but it does nothing about energy already stored in the capacitor. The capacitor sat there charged, waiting for a path, and his hand provided one.",
                "The correct procedure is to unplug the unit, wait, and then safely discharge the capacitor using the proper tool or bleeder procedure before touching anything.",
                "Then apply the universal rule: test before touching. Verify with a meter that no voltage remains between the points you are about to handle.",
                "The lesson generalizes to any equipment with capacitors, power supplies, TV and monitor circuits, motor-start circuits, and flash units. Unplugged does not automatically mean safe."
              ],
              "tip": "Two habits cover most shock scenarios: assume capacitors are charged until proven discharged, and test every circuit dead before you touch it, even one you de-energized yourself."
            }
          ],
          "summary": "Current through a wire creates a magnetic field; coiling the wire and adding an iron core makes an electromagnet whose strength grows with more turns, more current, and a better core. Induction is the reverse: relative motion between a magnet and a coil produces current. A motor turns electrical energy into motion; a generator turns motion into electrical energy. On the safety side, current in amps is what injures, and wet skin lets far more current through. GFCIs protect people near water, grounding gives fault current a safe path, and fuses and breakers must never be bypassed. Capacitors stay charged after power-off, so discharge them and always test before touching. Match extension cord gauge to the load, thicker wire and lower gauge numbers for bigger tools and longer runs. Know the physics, respect the hazards, and you will handle every question in this section with confidence."
        },
        "questions": [
          {
            "id": "EI6-001",
            "text": "What happens in the space around a wire when electric current flows through it?",
            "options": [
              {
                "text": "A magnetic field forms around the wire",
                "correct": true,
                "explanation": "Correct! Any current-carrying wire is surrounded by a magnetic field. This link between electricity and magnetism is the basis of electromagnets, motors, and generators."
              },
              {
                "text": "The wire becomes permanently magnetized",
                "explanation": "The field exists only while current flows. When the current stops, the field around the wire disappears, unlike a permanent magnet."
              },
              {
                "text": "Nothing happens unless the wire is coiled",
                "explanation": "Even a straight wire produces a magnetic field when current flows. Coiling the wire simply concentrates and strengthens that field."
              },
              {
                "text": "The wire loses all electrical resistance",
                "explanation": "Current does not eliminate resistance. In fact, current flowing through resistance produces heat, which is a separate effect from the magnetic field."
              }
            ]
          },
          {
            "id": "EI6-002",
            "text": "Which change would make an electromagnet weaker?",
            "options": [
              {
                "text": "Adding more turns of wire to the coil",
                "explanation": "More turns make the electromagnet stronger, because each loop adds its magnetic field to the others."
              },
              {
                "text": "Increasing the current through the coil",
                "explanation": "More current means a stronger magnetic field, so this strengthens the electromagnet rather than weakening it."
              },
              {
                "text": "Removing the iron core from the coil",
                "correct": true,
                "explanation": "Correct! The iron core concentrates and multiplies the magnetic field. Take it out and the electromagnet becomes much weaker, even with the same coil and current."
              },
              {
                "text": "Inserting a larger iron core into the coil",
                "explanation": "An iron core strengthens an electromagnet by focusing the field lines, so adding one does the opposite of weakening it."
              }
            ]
          },
          {
            "id": "EI6-003",
            "text": "A generator produces electricity primarily because of which principle?",
            "options": [
              {
                "text": "Static charge building up on the spinning shaft",
                "explanation": "Static electricity is not how generators work. Generators rely on the interaction between coils of wire and magnetic fields."
              },
              {
                "text": "Electromagnetic induction from motion between a magnet and a coil",
                "correct": true,
                "explanation": "Correct! When a coil and a magnetic field move relative to each other, a voltage is induced in the coil. Spinning the machine provides that motion, which is exactly what a generator does."
              },
              {
                "text": "Chemical reactions inside the windings",
                "explanation": "Chemical reactions produce electricity in batteries, not in generators. A generator converts mechanical motion into electrical energy."
              },
              {
                "text": "Friction between the brushes and the shaft",
                "explanation": "Brushes simply carry current to or from rotating parts. Friction there is an unwanted side effect, not the source of the electricity."
              }
            ]
          },
          {
            "id": "EI6-004",
            "text": "Which statement best describes the difference between a motor and a generator?",
            "options": [
              {
                "text": "A motor converts electrical energy to motion; a generator converts motion to electrical energy",
                "correct": true,
                "explanation": "Correct! They are essentially the same machine run in opposite directions. Electricity in, motion out is a motor. Motion in, electricity out is a generator."
              },
              {
                "text": "A motor uses magnets but a generator does not",
                "explanation": "Both devices depend on magnetic fields interacting with coils. Neither one works without magnetism."
              },
              {
                "text": "A generator stores energy while a motor releases it",
                "explanation": "Neither device stores energy. Batteries and capacitors store energy; motors and generators convert it from one form to another."
              },
              {
                "text": "A motor runs on AC only and a generator produces DC only",
                "explanation": "Motors and generators both come in AC and DC versions. The direction of energy conversion, not the type of current, is what separates them."
              }
            ]
          },
          {
            "id": "EI6-005",
            "text": "In an electrical shock, which quantity actually causes injury to the body?",
            "options": [
              {
                "text": "The wattage rating printed on the equipment",
                "explanation": "The equipment's power rating describes normal operation, not what flows through a person during a shock."
              },
              {
                "text": "The voltage alone, regardless of anything else",
                "explanation": "Voltage is the push, but injury depends on how much current that push actually drives through the body. High voltage with almost no current path can do little, while modest voltage through wet skin can be deadly."
              },
              {
                "text": "The frequency of the household supply",
                "explanation": "Frequency has some effect on how the body responds, but it is not the fundamental cause of injury. The amount of current through the body is what matters most."
              },
              {
                "text": "The current, in amps, that flows through the body",
                "correct": true,
                "explanation": "Correct! Current is what disrupts the heart and burns tissue. Even a small fraction of one amp through the chest can be fatal, which is why lowering possible current with dry skin, insulation, and GFCIs is so important."
              }
            ]
          },
          {
            "id": "EI6-006",
            "text": "Why does the electrical code require GFCI outlets in bathrooms, kitchens, and outdoor locations?",
            "options": [
              {
                "text": "GFCIs boost the voltage to make up for damp conditions",
                "explanation": "A GFCI does not change the voltage at all. It monitors current and disconnects power when some of it leaks out of the circuit."
              },
              {
                "text": "Water lowers body resistance, and a GFCI cuts power fast when current leaks through a person",
                "correct": true,
                "explanation": "Correct! Near water, a person's resistance drops and shock risk rises. A GFCI compares outgoing and returning current and trips in a fraction of a second if any current takes a stray path, such as through a body."
              },
              {
                "text": "GFCIs prevent the outlet from being overloaded by large appliances",
                "explanation": "Overload protection is the job of fuses and circuit breakers. A GFCI protects against leakage current, not against drawing too much current."
              },
              {
                "text": "GFCIs are waterproof, so they can be splashed safely",
                "explanation": "A GFCI outlet is not inherently waterproof. Its value is the internal sensing that shuts off power when current leaks, which protects people in damp locations."
              }
            ]
          },
          {
            "id": "EI6-007",
            "text": "A 15 amp fuse in a piece of equipment keeps blowing. What is the correct response?",
            "options": [
              {
                "text": "Replace it with a 30 amp fuse so it stops blowing",
                "explanation": "Oversizing the fuse lets dangerous current flow through wiring rated for less, risking overheating and fire. The fuse size must match the circuit."
              },
              {
                "text": "Wrap the fuse in metal foil to keep the circuit closed",
                "explanation": "Bypassing a fuse with foil removes all overload protection while the fault keeps drawing excess current. This is a classic cause of electrical fires."
              },
              {
                "text": "Find and fix the cause of the overload, then install a fuse of the same rating",
                "correct": true,
                "explanation": "Correct! A repeatedly blowing fuse is a warning that too much current is flowing, often from a short or failing component. Fix the cause, then replace the fuse with the exact rating specified."
              },
              {
                "text": "Remove the fuse and connect the wires directly together",
                "explanation": "Jumping around the fuse leaves the circuit completely unprotected. The underlying fault remains and can now overheat the wiring unchecked."
              }
            ]
          },
          {
            "id": "EI6-008",
            "text": "A technician unplugs an appliance before repairing it. Why might the circuits inside still deliver a dangerous shock?",
            "options": [
              {
                "text": "The metal chassis generates its own voltage when touched",
                "explanation": "Metal does not create voltage on its own. The danger comes from energy that was stored while the unit was powered."
              },
              {
                "text": "Residual current keeps circulating in the wires for days",
                "explanation": "Current in ordinary wires stops as soon as the circuit is broken. What persists is charge stored in capacitors, not circulating current in the wiring."
              },
              {
                "text": "Unplugging reverses the polarity of the internal circuits",
                "explanation": "Removing power does not reverse polarity. The real hazard is stored energy that remains inside certain components."
              },
              {
                "text": "Capacitors inside can hold a stored charge after power is removed",
                "correct": true,
                "explanation": "Correct! Capacitors store charge and can hold it long after the plug is pulled. Safe practice is to discharge capacitors properly and test with a meter before touching any internal circuitry."
              }
            ]
          }
        ],
        "quizConfig": {
          "questionsPerQuiz": 6
        }
      }
    ]
  },
  GS: {
    "name": "General Science",
    "description": "Life, earth, space, physical science, and chemistry",
    "icon": "🔬",
    "chapters": [
      {
        "id": "GS-1",
        "title": "Life Science: The Human Body",
        "description": "A tour of the body's major organ systems, blood basics, and nutrition so you can answer General Science questions about how the human body works.",
        "lesson": {
          "intro": "Your body is a team of organ systems working together every second, whether you are running a two-mile or catching your breath afterward. The ASVAB General Science section expects you to know what each system does and how they connect. Learn the big jobs first, and the details fall into place.",
          "concepts": [
            {
              "title": "The Circulatory and Respiratory Systems",
              "content": "The circulatory system moves blood through the body using the heart as a pump and blood vessels as the roadways. Arteries carry blood away from the heart, veins carry it back, and tiny capillaries are where oxygen and nutrients pass into your cells. The respiratory system brings in oxygen and removes carbon dioxide, with the lungs doing the actual gas exchange in tiny air sacs called alveoli. These two systems work as partners: the lungs load oxygen into the blood, and the heart pushes that oxygen-rich blood out to the muscles and organs. When you exercise, both speed up together to keep your cells supplied."
            },
            {
              "title": "The Digestive System",
              "content": "The digestive system breaks food down into nutrients your body can absorb and use for energy. It starts in the mouth, where chewing and saliva begin the process, then travels down the esophagus to the stomach, where acid and enzymes continue breaking food apart. The small intestine does most of the nutrient absorption, passing those nutrients into the bloodstream. The large intestine absorbs water and packages the leftover waste. Organs like the liver and pancreas help by producing bile and enzymes that make digestion possible."
            },
            {
              "title": "The Nervous and Endocrine Systems",
              "content": "The nervous system is the body's fast communication network, using the brain, spinal cord, and nerves to send electrical signals in fractions of a second. It controls everything from your reflexes to your thoughts and lets you react instantly to your surroundings. The endocrine system is the slower chemical messenger system, using glands to release hormones into the blood. Glands like the thyroid, pancreas, and adrenal glands control long-term processes such as growth, metabolism, and stress response. Together, fast nerves and slow hormones keep the whole body coordinated and balanced."
            },
            {
              "title": "The Skeletal and Muscular Systems",
              "content": "The skeletal system is the body's frame, made of 206 bones in the adult body that provide structure, protect organs, and give muscles something to pull against. Bones also store minerals like calcium and produce blood cells inside their marrow. The muscular system creates movement, and it comes in three types: skeletal muscle that you control voluntarily, smooth muscle that lines your organs and works automatically, and cardiac muscle found only in the heart. Muscles attach to bones by tough cords called tendons and work by pulling, never pushing. This is why muscles often work in pairs, with one contracting while its partner relaxes."
            },
            {
              "title": "The Immune System",
              "content": "The immune system is the body's defense force against germs like bacteria and viruses. Its first line of defense is physical barriers such as your skin and the mucus in your nose and throat. If germs get past those barriers, white blood cells hunt down and destroy the invaders. The body can also build antibodies, which are special proteins that recognize a specific germ and help fight it off faster the next time. This memory is the reason vaccines work and why you usually only get certain illnesses, like chickenpox, once."
            },
            {
              "title": "Blood Basics and Nutrition",
              "content": "Blood is made of red blood cells that carry oxygen using a protein called hemoglobin, white blood cells that fight infection, platelets that help blood clot, and plasma, the liquid that carries everything. Blood comes in types A, B, AB, and O, and type O negative is the universal donor because it can be given to almost anyone in an emergency. Good nutrition fuels all of this: carbohydrates give quick energy, proteins build and repair tissue, and fats store energy and protect organs. Vitamins and minerals are needed in small amounts but matter a lot, since shortages cause specific problems such as scurvy from too little vitamin C or anemia from too little iron."
            }
          ],
          "examples": [
            {
              "problem": "Which organ system is responsible for exchanging oxygen and carbon dioxide with the outside air?",
              "steps": [
                "The question asks about gas exchange with the air, so focus on which system deals with air moving in and out of the body.",
                "The circulatory system moves blood, and the digestive system handles food, so rule those out.",
                "The lungs take in oxygen and release carbon dioxide, and the lungs belong to the respiratory system.",
                "The correct answer is the respiratory system."
              ],
              "tip": "Link the key word to the system: air and breathing means respiratory, blood and heart means circulatory."
            },
            {
              "problem": "A person's diet is very low in vitamin C. Which condition are they most likely to develop?",
              "steps": [
                "Recall that each vitamin deficiency causes a specific problem.",
                "Vitamin C is needed to keep gums, skin, and connective tissue healthy.",
                "A long-term lack of vitamin C causes scurvy, which shows up as bleeding gums and slow-healing wounds.",
                "The correct answer is scurvy."
              ],
              "tip": "Memorize a few classic deficiency pairs: vitamin C and scurvy, vitamin D and rickets, iron and anemia."
            },
            {
              "problem": "Which type of blood cell is mainly responsible for carrying oxygen to the body's tissues?",
              "steps": [
                "Break the blood down into its parts: red cells, white cells, platelets, and plasma.",
                "White blood cells fight infection and platelets help clotting, so neither carries oxygen.",
                "Red blood cells contain hemoglobin, the protein that binds oxygen.",
                "The correct answer is red blood cells."
              ],
              "tip": "Remember red for oxygen, white for defense, and platelets for plugging leaks."
            }
          ],
          "summary": "Each organ system has one big job, and knowing those jobs, plus how blood and nutrition support them, covers most General Science body questions. Focus on the pairs that work together, such as the heart and lungs or nerves and hormones, and memorize a handful of classic vitamin and mineral deficiencies. Match the key word in the question to the right system and the answer usually stands out."
        },
        "questions": [
          {
            "id": "GS1-001",
            "text": "Which organ system uses the heart to pump blood through arteries, veins, and capillaries?",
            "options": [
              {
                "text": "Respiratory system",
                "explanation": "The respiratory system handles breathing and gas exchange in the lungs, not pumping blood through vessels."
              },
              {
                "text": "Circulatory system",
                "explanation": "Correct! The circulatory system uses the heart as a pump to move blood through arteries, veins, and capillaries.",
                "correct": true
              },
              {
                "text": "Digestive system",
                "explanation": "The digestive system breaks down food and absorbs nutrients; it does not pump blood."
              },
              {
                "text": "Skeletal system",
                "explanation": "The skeletal system provides the body's frame and protects organs, but it does not pump blood."
              }
            ]
          },
          {
            "id": "GS1-002",
            "text": "Where does most nutrient absorption take place in the digestive system?",
            "options": [
              {
                "text": "The stomach",
                "explanation": "The stomach uses acid and enzymes to break food apart, but it is not where most nutrients are absorbed."
              },
              {
                "text": "The large intestine",
                "explanation": "The large intestine mainly absorbs water and packages waste, not most nutrients."
              },
              {
                "text": "The small intestine",
                "explanation": "Correct! The small intestine absorbs most nutrients and passes them into the bloodstream.",
                "correct": true
              },
              {
                "text": "The esophagus",
                "explanation": "The esophagus is just a tube that carries food from the mouth to the stomach; no absorption happens there."
              }
            ]
          },
          {
            "id": "GS1-003",
            "text": "Which blood component contains hemoglobin and carries oxygen to body tissues?",
            "options": [
              {
                "text": "White blood cells",
                "explanation": "White blood cells fight infection; they do not carry oxygen."
              },
              {
                "text": "Platelets",
                "explanation": "Platelets help blood clot and stop bleeding, but they do not carry oxygen."
              },
              {
                "text": "Plasma",
                "explanation": "Plasma is the liquid part of blood that carries cells and nutrients, but hemoglobin is inside red cells, not plasma."
              },
              {
                "text": "Red blood cells",
                "explanation": "Correct! Red blood cells contain hemoglobin, the protein that binds and carries oxygen.",
                "correct": true
              }
            ]
          },
          {
            "id": "GS1-004",
            "text": "A long-term shortage of vitamin C most commonly leads to which condition?",
            "options": [
              {
                "text": "Scurvy",
                "explanation": "Correct! Vitamin C keeps gums and connective tissue healthy, and a lasting shortage causes scurvy.",
                "correct": true
              },
              {
                "text": "Rickets",
                "explanation": "Rickets is caused by a lack of vitamin D, which affects bone strength, not vitamin C."
              },
              {
                "text": "Anemia",
                "explanation": "Anemia is most often linked to low iron, which affects red blood cells, not vitamin C."
              },
              {
                "text": "Goiter",
                "explanation": "A goiter is linked to an iodine shortage affecting the thyroid, not vitamin C."
              }
            ]
          },
          {
            "id": "GS1-005",
            "text": "Which system uses glands to release hormones that control processes like growth and metabolism?",
            "options": [
              {
                "text": "Nervous system",
                "explanation": "The nervous system sends fast electrical signals through nerves; it does not release hormones from glands."
              },
              {
                "text": "Muscular system",
                "explanation": "The muscular system creates movement by contracting; it does not produce hormones."
              },
              {
                "text": "Endocrine system",
                "explanation": "Correct! The endocrine system uses glands to release hormones that control growth, metabolism, and other slow processes.",
                "correct": true
              },
              {
                "text": "Immune system",
                "explanation": "The immune system defends against germs; it does not control growth and metabolism through hormones."
              }
            ]
          },
          {
            "id": "GS1-006",
            "text": "Which macronutrient is the body's main source of quick energy?",
            "options": [
              {
                "text": "Proteins",
                "explanation": "Proteins are mainly used to build and repair tissue, not as the body's first choice for quick energy."
              },
              {
                "text": "Carbohydrates",
                "explanation": "Correct! Carbohydrates are the body's main source of quick, readily available energy.",
                "correct": true
              },
              {
                "text": "Fats",
                "explanation": "Fats store energy long term and protect organs, but they are not the fastest energy source."
              },
              {
                "text": "Water",
                "explanation": "Water is essential for life but is not a macronutrient that provides energy."
              }
            ]
          },
          {
            "id": "GS1-007",
            "text": "What is the main job of platelets in the blood?",
            "options": [
              {
                "text": "Carrying oxygen to tissues",
                "explanation": "Carrying oxygen is the job of red blood cells, not platelets."
              },
              {
                "text": "Fighting off infections",
                "explanation": "Fighting infection is the job of white blood cells, not platelets."
              },
              {
                "text": "Helping the blood clot",
                "explanation": "Correct! Platelets help the blood clot so that bleeding stops after an injury.",
                "correct": true
              },
              {
                "text": "Producing antibodies",
                "explanation": "Antibodies are proteins made as part of the immune response, not the main function of platelets."
              }
            ]
          },
          {
            "id": "GS1-008",
            "text": "Which type of muscle is found only in the heart?",
            "options": [
              {
                "text": "Skeletal muscle",
                "explanation": "Skeletal muscle attaches to bones and is under voluntary control; it is not the heart's muscle type."
              },
              {
                "text": "Smooth muscle",
                "explanation": "Smooth muscle lines organs like the stomach and intestines and works automatically, but it is not found in the heart."
              },
              {
                "text": "Cardiac muscle",
                "explanation": "Correct! Cardiac muscle is the special muscle type found only in the heart.",
                "correct": true
              },
              {
                "text": "Tendon tissue",
                "explanation": "Tendons are tough cords that connect muscle to bone; they are not a type of muscle."
              }
            ]
          }
        ],
        "quizConfig": {
          "questionsPerQuiz": 6
        }
      },
      {
        "id": "GS-2",
        "title": "Life Science: Cells, Genetics, and Ecology",
        "description": "The building blocks of living things, from the tiny cell up to whole ecosystems. Learn cell parts, how energy flows through photosynthesis and respiration, how traits pass from parents to offspring, how scientists classify life, and how organisms interact in food chains and habitats.",
        "lesson": {
          "intro": "Life science, also called biology, is the study of living things. On the ASVAB General Science section you will see questions about the smallest units of life (cells), how living things get energy, how traits are inherited, how organisms are grouped, and how they depend on one another. Do not worry if biology felt overwhelming in school. This chapter breaks it into plain, memorable pieces. If you learn a handful of key terms and a few simple rules, you can answer most life science questions with confidence.",
          "concepts": [
            {
              "title": "The Cell and Its Parts",
              "content": "The cell is the basic unit of life. Every living thing is made of one or more cells. Three parts show up on tests again and again. The cell membrane is the thin outer layer that surrounds the cell and controls what goes in and out, like a security gate. The nucleus is the control center that holds the cell's DNA and directs its activities, like the brain of the cell. The mitochondria are the powerhouses that break down food to release energy the cell can use. A handy phrase to remember is that the mitochondria are the powerhouse of the cell. Other parts include cytoplasm, the jelly-like fluid that fills the cell, and ribosomes, which build proteins."
            },
            {
              "title": "Plant Cells vs Animal Cells",
              "content": "Plant and animal cells share the basics: both have a membrane, a nucleus, and mitochondria. But plant cells have three extra features that animal cells do not have. First, a cell wall, a stiff outer layer outside the membrane that gives the plant structure and support. Second, chloroplasts, the green structures that capture sunlight to make food through photosynthesis. Third, a large central vacuole that stores water and helps the plant stay firm. Remember it this way: only plants make their own food, so only plant cells have chloroplasts and a rigid cell wall."
            },
            {
              "title": "Photosynthesis and Respiration",
              "content": "These two processes are opposites, and together they power life on Earth. Photosynthesis happens in plants (in the chloroplasts). Plants take in carbon dioxide and water, use energy from sunlight, and produce sugar (food) and oxygen. In short: sunlight plus carbon dioxide plus water yields sugar plus oxygen. Cellular respiration happens in nearly all living cells (mainly in the mitochondria). It does the reverse: it takes in sugar and oxygen and releases energy, carbon dioxide, and water. Plants do both, while animals only do respiration. This is why plants give off the oxygen we breathe, and why animals and plants both need to break down food for energy."
            },
            {
              "title": "DNA, Genes, and Inherited Traits",
              "content": "DNA is the molecule inside the nucleus that carries the instructions for building and running a living thing. DNA is shaped like a twisted ladder called a double helix. A gene is a segment of DNA that codes for one specific trait, such as eye color. Chromosomes are the tightly packed structures that hold the DNA; humans have 46 (23 pairs). Offspring inherit one copy of each gene from each parent. Traits can be dominant or recessive. A dominant trait shows up whenever at least one dominant gene is present. A recessive trait shows up only when both copies are the recessive version. Uppercase letters stand for dominant genes and lowercase for recessive, so a person with Bb shows the dominant trait, while only bb shows the recessive trait."
            },
            {
              "title": "Classifying Living Things",
              "content": "Scientists organize life into groups from broadest to most specific. The order, from largest group to smallest, is: kingdom, phylum, class, order, family, genus, species. A species is the most specific group, meaning organisms that can breed and produce fertile offspring. Every organism gets a two-part scientific name from its genus and species (for example, humans are Homo sapiens). One common test split is between vertebrates, animals with a backbone (such as fish, amphibians, reptiles, birds, and mammals), and invertebrates, animals without a backbone (such as insects, worms, spiders, and jellyfish). Most animals on Earth are actually invertebrates."
            },
            {
              "title": "Ecology: Energy and Relationships in Nature",
              "content": "Ecology is the study of how living things interact with each other and their environment. A habitat is the place where an organism lives. Energy flows through an ecosystem in a food chain. Producers, usually plants, make their own food using sunlight and form the base. Consumers eat other organisms: herbivores eat plants, carnivores eat animals, and omnivores eat both. Decomposers, such as bacteria and fungi, break down dead material and return nutrients to the soil. A food web is many food chains linked together, showing that most animals eat more than one thing. Symbiosis means two species living closely together. There are three types: mutualism, where both benefit; commensalism, where one benefits and the other is unaffected; and parasitism, where one benefits and the other is harmed."
            }
          ],
          "examples": [
            {
              "problem": "Which cell structure is responsible for producing energy for the cell?",
              "steps": [
                "The question asks which part supplies energy.",
                "Recall the roles: the nucleus is the control center, the membrane controls what enters and exits, and the mitochondria break down food to release energy.",
                "The key phrase is that the mitochondria are the powerhouse of the cell.",
                "So the mitochondria are the energy producer."
              ],
              "tip": "Match each part to a one-word job: nucleus equals control, membrane equals gate, mitochondria equals power. Then pick the one about energy."
            },
            {
              "problem": "A plant takes in carbon dioxide and water and, using sunlight, produces sugar and oxygen. What is this process called?",
              "steps": [
                "Notice the clues: sunlight is used, and oxygen is given off.",
                "Respiration does the opposite (it uses oxygen and releases carbon dioxide), so it does not fit.",
                "Making food from sunlight, carbon dioxide, and water is the definition of photosynthesis.",
                "The answer is photosynthesis."
              ],
              "tip": "If you see sunlight and oxygen being produced, think photosynthesis. If you see oxygen being used up and energy released, think respiration."
            },
            {
              "problem": "Brown eye color (B) is dominant over blue eye color (b). A person has the gene pair Bb. What eye color will this person have?",
              "steps": [
                "A dominant trait appears whenever at least one dominant gene (the uppercase letter) is present.",
                "The person has one B (brown, dominant) and one b (blue, recessive).",
                "Because a dominant gene is present, the dominant trait shows.",
                "So the person will have brown eyes. Only a bb pair would give blue eyes."
              ],
              "tip": "One uppercase letter is enough to show the dominant trait. The recessive trait needs two lowercase letters."
            }
          ],
          "summary": "Cells are the basic unit of life: the nucleus controls the cell, the membrane guards it, and the mitochondria power it. Plant cells add a cell wall, chloroplasts, and a large vacuole. Photosynthesis makes food using sunlight and releases oxygen, while respiration breaks food down to release energy. DNA holds the instructions, genes code for traits, and dominant traits show with just one dominant gene while recessive traits need two. Life is classified from kingdom down to species, and animals split into vertebrates (with a backbone) and invertebrates (without). In ecosystems, energy flows from producers to consumers to decomposers, and symbiosis describes close relationships that may help both, help one, or harm one. Learn these key terms and you can reason your way through most life science questions."
        },
        "questions": [
          {
            "id": "GS2-001",
            "text": "Which part of the cell contains the DNA and directs the cell's activities?",
            "options": [
              {
                "text": "Cell membrane",
                "explanation": "The cell membrane is the outer layer that controls what enters and leaves the cell, not the part that holds DNA."
              },
              {
                "text": "Nucleus",
                "explanation": "Correct! The nucleus is the control center of the cell and holds its DNA, directing the cell's activities.",
                "correct": true
              },
              {
                "text": "Mitochondria",
                "explanation": "Mitochondria release energy from food; they are the powerhouse, not the control center that stores DNA."
              },
              {
                "text": "Cytoplasm",
                "explanation": "Cytoplasm is the jelly-like fluid that fills the cell; it does not store the DNA or direct the cell."
              }
            ]
          },
          {
            "id": "GS2-002",
            "text": "Which structure is found in plant cells but NOT in animal cells?",
            "options": [
              {
                "text": "Nucleus",
                "explanation": "Both plant and animal cells have a nucleus, so it is not unique to plants."
              },
              {
                "text": "Cell membrane",
                "explanation": "Both plant and animal cells are surrounded by a cell membrane, so it is not unique to plants."
              },
              {
                "text": "Cell wall",
                "explanation": "Correct! The rigid cell wall is found in plant cells but not animal cells, giving plants their structure and support.",
                "correct": true
              },
              {
                "text": "Mitochondria",
                "explanation": "Both plant and animal cells contain mitochondria for producing energy, so it is not unique to plants."
              }
            ]
          },
          {
            "id": "GS2-003",
            "text": "During photosynthesis, what gas do plants release into the air?",
            "options": [
              {
                "text": "Oxygen",
                "explanation": "Correct! Photosynthesis uses carbon dioxide and water with sunlight to make sugar and releases oxygen, the gas animals breathe.",
                "correct": true
              },
              {
                "text": "Carbon dioxide",
                "explanation": "Plants take carbon dioxide in during photosynthesis; they release it during respiration, not photosynthesis."
              },
              {
                "text": "Nitrogen",
                "explanation": "Nitrogen makes up most of the air but is not the gas produced by photosynthesis."
              },
              {
                "text": "Hydrogen",
                "explanation": "Hydrogen is not the gas released during photosynthesis; the released gas is oxygen."
              }
            ]
          },
          {
            "id": "GS2-004",
            "text": "Cellular respiration mainly takes place in which cell structure?",
            "options": [
              {
                "text": "Nucleus",
                "explanation": "The nucleus stores DNA and controls the cell; it is not where respiration takes place."
              },
              {
                "text": "Chloroplast",
                "explanation": "Chloroplasts carry out photosynthesis in plants, not respiration."
              },
              {
                "text": "Mitochondria",
                "explanation": "Correct! Mitochondria break down sugar with oxygen to release energy, which is the process of cellular respiration.",
                "correct": true
              },
              {
                "text": "Cell wall",
                "explanation": "The cell wall provides support in plant cells and has no role in releasing energy."
              }
            ]
          },
          {
            "id": "GS2-005",
            "text": "A segment of DNA that codes for a specific trait, such as hair color, is called a:",
            "options": [
              {
                "text": "Cell",
                "explanation": "A cell is the whole basic unit of life, not a segment of DNA that codes for one trait."
              },
              {
                "text": "Gene",
                "explanation": "Correct! A gene is a segment of DNA that carries the instructions for a specific trait.",
                "correct": true
              },
              {
                "text": "Tissue",
                "explanation": "A tissue is a group of similar cells working together, not a piece of DNA."
              },
              {
                "text": "Ribosome",
                "explanation": "A ribosome is the structure that builds proteins; it is not a segment of DNA coding for a trait."
              }
            ]
          },
          {
            "id": "GS2-006",
            "text": "Tall (T) is dominant over short (t) in a pea plant. Which gene pairing would produce a SHORT plant?",
            "options": [
              {
                "text": "TT",
                "explanation": "Two dominant genes produce a tall plant, not a short one."
              },
              {
                "text": "Tt",
                "explanation": "With one dominant T present, the dominant trait shows, so this plant would be tall."
              },
              {
                "text": "tt",
                "explanation": "Correct! A recessive trait like short only appears when both genes are recessive, so tt produces a short plant.",
                "correct": true
              },
              {
                "text": "Tt or TT",
                "explanation": "Both of these pairings include a dominant T, so both would produce tall plants, not short ones."
              }
            ]
          },
          {
            "id": "GS2-007",
            "text": "Which of the following is an invertebrate (an animal without a backbone)?",
            "options": [
              {
                "text": "Frog",
                "explanation": "A frog is an amphibian and has a backbone, making it a vertebrate."
              },
              {
                "text": "Snake",
                "explanation": "A snake is a reptile with a backbone, so it is a vertebrate."
              },
              {
                "text": "Spider",
                "explanation": "Correct! A spider has no backbone, which makes it an invertebrate.",
                "correct": true
              },
              {
                "text": "Eagle",
                "explanation": "An eagle is a bird with a backbone, so it is a vertebrate."
              }
            ]
          },
          {
            "id": "GS2-008",
            "text": "In an ecosystem, organisms such as bacteria and fungi that break down dead material and return nutrients to the soil are called:",
            "options": [
              {
                "text": "Producers",
                "explanation": "Producers, such as plants, make their own food using sunlight; they do not break down dead material."
              },
              {
                "text": "Consumers",
                "explanation": "Consumers eat other organisms for energy; they are not the organisms that break down dead matter."
              },
              {
                "text": "Decomposers",
                "explanation": "Correct! Decomposers such as bacteria and fungi break down dead organisms and recycle nutrients back into the soil.",
                "correct": true
              },
              {
                "text": "Predators",
                "explanation": "Predators are consumers that hunt and eat other animals; they do not break down and recycle dead material."
              }
            ]
          }
        ],
        "quizConfig": {
          "questionsPerQuiz": 6
        }
      },
      {
        "id": "GS-3",
        "title": "Earth Science",
        "description": "Learn the structure of the Earth, plate tectonics, the rock cycle, weathering and erosion, the water cycle, weather basics, and the layers of the atmosphere - all high-frequency General Science topics on the ASVAB.",
        "lesson": {
          "intro": "Earth Science is one of the most predictable topics on the ASVAB General Science section, which is great news for you. The test loves to ask about Earth's layers, the three rock types, the water cycle, and weather fronts - and these facts do not change. Master the vocabulary in this chapter and you will pick up easy points on test day. Take it one concept at a time, and use the memory tricks along the way.",
          "concepts": [
            {
              "title": "Earth's Layers",
              "content": "The Earth is built like an egg with four main layers. The crust is the thin, rocky outer shell where we live - it is thinnest under the oceans (about 5 to 10 km) and thickest under continents (up to about 70 km). Below the crust is the mantle, the thickest layer, made of hot, slowly flowing solid rock. Movement in the mantle drives the motion of the plates above it. Next comes the outer core, a layer of liquid iron and nickel - its motion generates Earth's magnetic field. At the center is the inner core, a solid ball of iron and nickel. Even though the inner core is the hottest layer, it stays solid because of the crushing pressure at the center of the planet. Memory trick: from outside in, think Crust, Mantle, Outer core, Inner core - and remember outer is liquid, inner is solid."
            },
            {
              "title": "Plate Tectonics: Earthquakes, Volcanoes, and Mountains",
              "content": "Earth's crust is broken into large slabs called tectonic plates that ride on the slowly moving mantle. Where plates meet, big things happen. At convergent boundaries, plates push together - this builds mountains (the Himalayas formed this way) and can force one plate under another in a process called subduction, which fuels volcanoes. At divergent boundaries, plates pull apart and new crust forms, as at the Mid-Atlantic Ridge. At transform boundaries, plates slide past each other, like the San Andreas Fault in California - this grinding motion causes earthquakes. Earthquake strength is measured with the Richter scale (or the modern moment magnitude scale), and each whole number step means about 10 times more ground shaking. The Ring of Fire around the Pacific Ocean is famous for earthquakes and volcanoes because so many plate boundaries meet there."
            },
            {
              "title": "The Rock Cycle: Igneous, Sedimentary, Metamorphic",
              "content": "All rocks fall into three families, and the ASVAB expects you to know how each forms. Igneous rock forms when melted rock cools and hardens - think of the word ignite, meaning fire. Granite forms from magma cooling slowly underground; basalt and obsidian form from lava cooling quickly at the surface. Sedimentary rock forms when layers of sediment (sand, mud, shells, pebbles) are pressed and cemented together over time - sandstone, limestone, and shale are examples, and this is the only rock type where you find fossils. Metamorphic rock forms when existing rock is changed by intense heat and pressure without fully melting - the word means changed form. Limestone becomes marble, and shale becomes slate. The rock cycle connects all three: any rock can melt into magma, break down into sediment, or be squeezed and heated into metamorphic rock."
            },
            {
              "title": "Weathering vs. Erosion",
              "content": "These two terms are easy to confuse, and the ASVAB knows it. Weathering is the breaking down of rock in place - the rock crumbles but does not go anywhere. Erosion is the carrying away of those broken pieces by wind, water, ice, or gravity. Memory trick: weathering breaks, erosion takes. Weathering comes in two types. Physical (mechanical) weathering breaks rock without changing its chemistry - for example, water freezes in a crack, expands, and splits the rock (frost wedging). Chemical weathering changes the rock's actual makeup - acid rain dissolving limestone, or iron in rock rusting. After erosion moves the material, deposition drops it in a new place, which is how deltas form at river mouths and how sedimentary rock gets its raw material."
            },
            {
              "title": "The Water Cycle",
              "content": "The water cycle moves water endlessly between the oceans, the air, and the land, powered by the sun. Evaporation: the sun heats liquid water and turns it into water vapor that rises into the air. (Plants also release vapor through their leaves - that is called transpiration.) Condensation: as the vapor rises and cools, it turns back into tiny liquid droplets, forming clouds. Precipitation: when the droplets grow heavy enough, they fall as rain, snow, sleet, or hail. The water then collects in rivers, lakes, oceans, and underground (as groundwater), and runoff carries surface water back to the sea to start the cycle again. Quick check: evaporation is liquid to gas, condensation is gas to liquid, precipitation is water falling from clouds."
            },
            {
              "title": "Weather: Air Pressure, Fronts, Humidity, and Clouds",
              "content": "Weather is driven by air pressure, moisture, and moving air masses. Air pressure is the weight of the atmosphere pressing down, measured with a barometer. High pressure usually brings clear, calm weather; low pressure brings clouds and storms. Falling barometer readings signal a storm is coming. Humidity is the amount of water vapor in the air; relative humidity compares the vapor present to the maximum the air could hold at that temperature - warm air can hold more moisture than cold air. A front is the boundary where two air masses meet. A cold front pushes under warm air and forces it up quickly, causing brief heavy storms followed by cooler, clearer weather. A warm front slides gently over cold air, bringing steady, lighter rain and warmer temperatures. Know the main cloud types: cirrus are thin, wispy, high-altitude ice clouds that often signal changing weather; cumulus are puffy, cotton-ball clouds of fair weather; stratus are flat gray layers that bring drizzle; and any cloud with nimbus in its name (nimbostratus, cumulonimbus) is a rain cloud - cumulonimbus is the towering thunderstorm cloud."
            },
            {
              "title": "Layers of the Atmosphere",
              "content": "The atmosphere has layers stacked from the ground up: troposphere, stratosphere, mesosphere, thermosphere, and exosphere. The troposphere is the lowest layer, where we live and where essentially all weather happens; temperature drops as you go up. The stratosphere sits above it and contains the ozone layer, which absorbs harmful ultraviolet radiation from the sun - jet airliners often cruise near the bottom of this calm layer. The mesosphere is where most meteors burn up, and it is the coldest layer. The thermosphere is extremely thin but very hot, and it is where auroras occur and where many satellites and the space station orbit. The exosphere is the outermost fringe fading into space. Memory trick for the order going up: The Smart Marine Trains Everyday - Troposphere, Stratosphere, Mesosphere, Thermosphere, Exosphere. Bonus fact the test likes: air is about 78 percent nitrogen and 21 percent oxygen."
            }
          ],
          "examples": [
            {
              "problem": "ASVAB-style question: Which layer of the Earth is liquid? (A) crust (B) mantle (C) outer core (D) inner core",
              "steps": [
                "Recall the four layers from outside in: crust, mantle, outer core, inner core.",
                "The crust is solid rock - that is the ground under your feet, so rule out A.",
                "The mantle is hot rock that flows very slowly, but it is considered solid, so rule out B.",
                "The inner core is solid because extreme pressure keeps the iron and nickel from melting, so rule out D.",
                "The outer core is molten (liquid) iron and nickel, and its motion creates Earth's magnetic field. The answer is C."
              ],
              "tip": "Remember the pair: OUTer core is liquid (think of liquid pouring OUT), inner core is solid. This exact fact shows up often."
            },
            {
              "problem": "ASVAB-style question: A rock formed from layers of compressed sand and shell fragments, containing fossils, is most likely which type? (A) igneous (B) sedimentary (C) metamorphic (D) volcanic",
              "steps": [
                "Break down the clues: layers, compressed sediment, and fossils.",
                "Igneous rock forms from cooled melted rock - fossils would be destroyed by that heat, so rule out A (and D, since volcanic rock is a kind of igneous rock).",
                "Metamorphic rock forms under intense heat and pressure that usually destroys fossils and erases layering, so rule out C.",
                "Sedimentary rock forms exactly this way: sediments pile up in layers and get cemented together, trapping fossils. The answer is B."
              ],
              "tip": "Fossils are found only in sedimentary rock. If a question mentions fossils or layers, sedimentary is almost always the answer."
            },
            {
              "problem": "ASVAB-style question: The barometer has been falling steadily all afternoon. What weather should you expect? (A) clear, calm skies (B) an approaching storm (C) lower humidity (D) no change",
              "steps": [
                "A barometer measures air pressure.",
                "Falling pressure means a low-pressure system is moving in.",
                "Low pressure lets air rise; rising air cools, water vapor condenses, and clouds and precipitation form.",
                "So falling pressure signals clouds and storms, while rising or high pressure signals fair weather. The answer is B."
              ],
              "tip": "Link them as opposites: high pressure = happy weather, low pressure = lousy weather. A falling barometer means trouble is on the way."
            }
          ],
          "summary": "You now have the core Earth Science facts the ASVAB tests most. Earth has four layers - crust, mantle, liquid outer core, solid inner core. Tectonic plates collide (mountains, volcanoes), separate (new crust), and slide (earthquakes). The three rock types are igneous (cooled melt), sedimentary (compressed layers, home of fossils), and metamorphic (changed by heat and pressure). Weathering breaks rock in place; erosion carries it away. The water cycle runs evaporation, condensation, precipitation. Falling pressure and cold fronts mean storms; cumulonimbus clouds mean thunder. And the atmosphere stacks up as troposphere, stratosphere, mesosphere, thermosphere, exosphere. Drill the quiz below until these feel automatic - these are some of the easiest points you can bank on test day."
        },
        "questions": [
          {
            "id": "GS3-001",
            "options": [
              {
                "text": "Crust",
                "explanation": "The crust is actually the thinnest layer - only about 5 to 70 km, a thin shell compared to the rest of the planet."
              },
              {
                "text": "Mantle",
                "correct": true,
                "explanation": "Correct! The mantle is the thickest layer, extending roughly 2,900 km below the crust and making up most of Earth's volume."
              },
              {
                "text": "Outer core",
                "explanation": "The outer core is a substantial layer of liquid iron and nickel, but it is not as thick as the mantle."
              },
              {
                "text": "Inner core",
                "explanation": "The inner core is a relatively small solid ball at the center - far from the thickest layer."
              }
            ],
            "text": "Which layer of the Earth is the thickest?"
          },
          {
            "id": "GS3-002",
            "options": [
              {
                "text": "Sliding past each other",
                "correct": true,
                "explanation": "Correct! The San Andreas Fault is a transform boundary, where plates grind sideways past each other, and that sudden slipping causes earthquakes."
              },
              {
                "text": "Pulling apart from each other",
                "explanation": "Plates pulling apart is a divergent boundary, like the Mid-Atlantic Ridge, where new crust forms - not the San Andreas situation."
              },
              {
                "text": "Colliding head-on to build mountains",
                "explanation": "Head-on collision is a convergent boundary, which built ranges like the Himalayas. The San Andreas plates slide sideways instead."
              },
              {
                "text": "Melting into the mantle together",
                "explanation": "Plates do not melt together at a fault. Sinking of one plate under another (subduction) happens at convergent boundaries, not transform faults."
              }
            ],
            "text": "Earthquakes along the San Andreas Fault occur mainly because two plates are doing what?"
          },
          {
            "id": "GS3-003",
            "options": [
              {
                "text": "Sedimentary",
                "explanation": "Sedimentary rock forms from compressed layers of sediment like sand and shells, not from cooling melted rock."
              },
              {
                "text": "Metamorphic",
                "explanation": "Metamorphic rock forms when existing rock is changed by heat and pressure without fully melting."
              },
              {
                "text": "Igneous",
                "correct": true,
                "explanation": "Correct! Igneous rock forms when melted rock cools and solidifies - granite from slow-cooling magma underground, basalt and obsidian from fast-cooling lava at the surface."
              },
              {
                "text": "Fossilized",
                "explanation": "Fossilized is not one of the three rock families. Fossils are found in sedimentary rock, but the rock formed from cooled melt is igneous."
              }
            ],
            "text": "Which type of rock forms when magma or lava cools and hardens?"
          },
          {
            "id": "GS3-004",
            "options": [
              {
                "text": "Erosion",
                "explanation": "Erosion means the pieces are carried away by wind, water, ice, or gravity. Here the pieces stayed in place, so nothing was transported."
              },
              {
                "text": "Deposition",
                "explanation": "Deposition is when transported material gets dropped in a new location, like sediment at a river delta. Nothing was moved and dropped here."
              },
              {
                "text": "Chemical weathering",
                "explanation": "Chemical weathering changes the rock's actual chemistry, like acid rain dissolving limestone. Freezing water splitting rock is a physical process."
              },
              {
                "text": "Physical weathering",
                "correct": true,
                "explanation": "Correct! This is frost wedging, a classic form of physical (mechanical) weathering - the rock breaks apart in place without any chemical change."
              }
            ],
            "text": "Water freezes in a crack in a boulder, expands, and splits the rock apart. The broken pieces stay right where they fell. This is an example of what?"
          },
          {
            "id": "GS3-005",
            "options": [
              {
                "text": "Rises into the air as a gas",
                "explanation": "Liquid water turning into rising vapor is evaporation, the step that comes before condensation."
              },
              {
                "text": "Cools and turns into liquid droplets, forming clouds",
                "correct": true,
                "explanation": "Correct! Condensation is water vapor cooling and changing from gas back to liquid - those tiny droplets are what clouds are made of."
              },
              {
                "text": "Falls to the ground as rain or snow",
                "explanation": "Water falling from clouds is precipitation, the step that follows condensation."
              },
              {
                "text": "Soaks into the ground as groundwater",
                "explanation": "Water soaking into the soil is infiltration, which happens after precipitation reaches the ground - not condensation."
              }
            ],
            "text": "In the water cycle, condensation is the process by which water vapor does what?"
          },
          {
            "id": "GS3-006",
            "options": [
              {
                "text": "Days of steady, light rain and rising temperatures",
                "explanation": "Long, gentle, steady rain with warming temperatures is the signature of a warm front, not a cold front."
              },
              {
                "text": "No change in weather at all",
                "explanation": "Fronts are boundaries between different air masses, so some weather change almost always occurs when one passes."
              },
              {
                "text": "Brief heavy storms, then cooler, clearer air",
                "correct": true,
                "explanation": "Correct! A cold front shoves warm air upward fast, triggering short but intense storms, and then cooler, drier, clearer air moves in behind it."
              },
              {
                "text": "A week of thick fog and high humidity",
                "explanation": "Fog forms when moist air cools near the ground, often in calm high-pressure conditions - it is not the typical result of a passing cold front."
              }
            ],
            "text": "A cold front passes through your area. What weather typically follows it?"
          },
          {
            "id": "GS3-007",
            "options": [
              {
                "text": "Cirrus",
                "explanation": "Cirrus clouds are thin, wispy ice clouds found at high altitude. They may hint at changing weather but do not produce storms."
              },
              {
                "text": "Stratus",
                "explanation": "Stratus clouds are flat, gray layers that can bring drizzle, but they are low and calm - not towering storm clouds."
              },
              {
                "text": "Cumulus",
                "explanation": "Plain cumulus clouds are the puffy, cotton-ball clouds of fair weather. Only when they grow into cumulonimbus do they mean storms."
              },
              {
                "text": "Cumulonimbus",
                "correct": true,
                "explanation": "Correct! Cumulonimbus clouds tower high into the sky and bring thunderstorms, heavy rain, lightning, and sometimes hail. The nimbus part of the name signals rain."
              }
            ],
            "text": "Which cloud type is the towering cloud most associated with thunderstorms?"
          },
          {
            "id": "GS3-008",
            "options": [
              {
                "text": "Troposphere",
                "correct": true,
                "explanation": "Correct! The troposphere is the lowest layer, where we live and where essentially all clouds, rain, and storms form."
              },
              {
                "text": "Stratosphere",
                "explanation": "The stratosphere is the calm layer above the weather - it holds the ozone layer, and jets cruise there to avoid turbulence."
              },
              {
                "text": "Mesosphere",
                "explanation": "The mesosphere is the coldest layer and is best known as the place where most meteors burn up, not where weather happens."
              },
              {
                "text": "Thermosphere",
                "explanation": "The thermosphere is extremely thin, very hot air where auroras occur and satellites orbit - far above any weather."
              }
            ],
            "text": "In which layer of the atmosphere does nearly all weather occur?"
          }
        ],
        "quizConfig": {
          "questionsPerQuiz": 6
        }
      },
      {
        "id": "GS-4",
        "title": "Space Science",
        "description": "Learn the solar system, the Sun and stars, moons and space rocks, why we have days, years, and seasons, plus moon phases, eclipses, tides, and galaxies.",
        "lesson": {
          "intro": "Space science questions show up regularly on the General Science section, and the good news is that most of them test a small set of facts you can lock down fast: the order of the planets, why Earth has seasons, what causes moon phases and eclipses, and the difference between things like asteroids and comets. In this chapter we will tour the solar system from the Sun outward, then zoom in on Earth to understand day and night, the year, seasons, and tides, and finish by zooming way out to stars and galaxies. Think of it as a map of the neighborhood, then the whole city.",
          "concepts": [
            {
              "title": "The Solar System: Planet Order and the Two Planet Families",
              "content": "Our solar system has eight planets orbiting the Sun. In order from the Sun outward they are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. A classic memory trick: My Very Educated Mother Just Served Us Noodles. The planets split into two families. The four inner planets (Mercury, Venus, Earth, Mars) are the terrestrial or rocky planets: small, dense, with solid rocky surfaces. The four outer planets (Jupiter, Saturn, Uranus, Neptune) are the gas giants (Uranus and Neptune are often called ice giants): huge, made mostly of gas like hydrogen and helium, with no solid surface to stand on, and all four have ring systems (Saturn's are just the most visible). Between Mars and Jupiter lies the asteroid belt. A few traits worth memorizing: Mercury is the smallest planet and closest to the Sun; Venus is the hottest planet because its thick carbon dioxide atmosphere traps heat (a runaway greenhouse effect); Mars is the red planet, colored by iron oxide (rust) in its soil; Jupiter is the largest planet; Saturn is famous for its bright rings. Pluto was reclassified as a dwarf planet in 2006."
            },
            {
              "title": "The Sun Is a Star",
              "content": "The Sun is an ordinary star, and it looks huge and bright only because it is so close to us, about 93 million miles away. It contains more than 99 percent of all the mass in the solar system, and its gravity is what holds the planets in their orbits. The Sun is a giant ball of hot gas, mostly hydrogen and some helium. Its energy comes from nuclear fusion in its core: hydrogen atoms are fused together into helium, releasing enormous amounts of energy that travels to Earth as light and heat. The Sun is not burning like a fire, fusion is a nuclear process, not a chemical one. Sunlight takes a little over 8 minutes to reach Earth. Compared to other stars, the Sun is average in size and temperature, a middle-aged yellow star about 4.6 billion years old."
            },
            {
              "title": "Moons, Asteroids, Comets, Meteors, and Meteorites",
              "content": "A moon (or natural satellite) is a body that orbits a planet. Earth has one moon; Mars has two small ones; Jupiter and Saturn each have dozens. Now the space rocks, which the test loves to ask about. Asteroids are rocky, metallic objects, most of which orbit the Sun in the asteroid belt between Mars and Jupiter. Comets are chunks of ice, dust, and rock, often described as dirty snowballs, that travel in long, stretched-out orbits; when a comet gets close to the Sun, some of its ice turns to gas and forms a glowing tail that always points away from the Sun because of the solar wind. Meteoroid, meteor, and meteorite describe the same object at three stages: a meteoroid is a small piece of rock or metal traveling through space; when it enters Earth's atmosphere and burns up from friction, the streak of light is called a meteor (a shooting star); if a piece survives the trip and lands on the ground, that surviving rock is a meteorite. Memory hook: it is only a meteorITE once it hITs the ground."
            },
            {
              "title": "Rotation vs. Revolution: Day, Night, and the Year",
              "content": "Two different motions of Earth explain two different cycles, and the ASVAB expects you to keep them straight. Rotation is Earth spinning on its own axis, like a top. One complete rotation takes about 24 hours, and this is what causes day and night: the side of Earth facing the Sun has daytime while the side facing away has night. Because Earth rotates from west to east, the Sun appears to rise in the east and set in the west. Revolution is Earth traveling in its orbit around the Sun. One complete revolution takes about 365.25 days, which is one year. That extra quarter day is why we add a leap day (February 29) every four years. Quick check: rotation = spin = day; revolution = orbit = year."
            },
            {
              "title": "Seasons, Moon Phases, and Eclipses",
              "content": "Seasons happen because Earth's axis is tilted about 23.5 degrees, not because Earth gets closer to or farther from the Sun. As Earth revolves around the Sun, the tilt stays pointed the same direction, so different hemispheres lean toward the Sun at different times of year. When the Northern Hemisphere is tilted toward the Sun, it gets more direct sunlight and longer days, that is northern summer, and at the same time the Southern Hemisphere has winter. Six months later the situation reverses. Moon phases happen because the Moon orbits Earth about once a month, and we see different amounts of its sunlit half. The cycle runs new moon (Moon between Earth and Sun, dark to us), waxing crescent, first quarter, waxing gibbous, full moon (Earth between Moon and Sun, fully lit face), then waning gibbous, last quarter, waning crescent, and back to new. Waxing means growing brighter, waning means shrinking. Eclipses are about shadows. A solar eclipse happens when the Moon passes between the Sun and Earth and the Moon's shadow falls on Earth, blocking the Sun; it can only occur at a new moon. A lunar eclipse happens when Earth passes between the Sun and the Moon, and Earth's shadow falls on the Moon; it can only occur at a full moon, and the Moon often turns a reddish color."
            },
            {
              "title": "Tides, Stars, and Galaxies",
              "content": "Tides are the regular rise and fall of ocean water, caused mainly by the gravitational pull of the Moon (the Sun helps, but the Moon is the bigger factor because it is so much closer). Most coastlines see about two high tides and two low tides each day. When the Sun, Moon, and Earth line up (at new moon and full moon), their pulls combine and we get extra-large spring tides; when they form a right angle (at the quarter moons), we get weaker neap tides. Zooming out: a star is a giant ball of hot gas producing energy by nuclear fusion. Stars come in different colors that indicate temperature, blue-white stars are the hottest and red stars are the coolest, with yellow stars like our Sun in the middle. The distances between stars are so vast that we measure them in light-years, the distance light travels in one year (about 6 trillion miles). A light-year measures distance, not time. Stars group together by gravity into galaxies, enormous collections of billions of stars plus gas and dust. Our galaxy is the Milky Way, a spiral galaxy, and our Sun is just one of its hundreds of billions of stars. The universe contains billions of galaxies."
            }
          ],
          "examples": [
            {
              "problem": "ASVAB-style question: Which of the following causes Earth to experience seasons? (A) Earth's changing distance from the Sun (B) The tilt of Earth's axis (C) Earth's rotation on its axis (D) The phases of the Moon",
              "steps": [
                "Eliminate the common trap first. Choice A sounds logical, but Earth's distance from the Sun barely changes, and in fact Earth is slightly CLOSER to the Sun during Northern Hemisphere winter, so distance cannot be the cause.",
                "Check choice C. Rotation is Earth spinning once every 24 hours, that explains day and night, not seasons.",
                "Check choice D. Moon phases come from the Moon's orbit around Earth and have nothing to do with Earth's temperature or seasons.",
                "That leaves choice B. Earth's axis is tilted about 23.5 degrees, so as Earth revolves around the Sun, each hemisphere leans toward the Sun for part of the year (summer, more direct light, longer days) and away for part of the year (winter).",
                "The answer is B."
              ],
              "tip": "Distance from the Sun is the number one wrong answer the test hopes you will pick. Seasons = tilt, every time."
            },
            {
              "problem": "ASVAB-style question: A rock from space streaks through Earth's atmosphere, and a fragment of it is later found on the ground. The fragment found on the ground is called a: (A) meteor (B) meteoroid (C) meteorite (D) comet",
              "steps": [
                "Recall the three-stage naming rule for the same object.",
                "In space, the small rock is a meteoroid, so B describes it before it arrives, not on the ground.",
                "While burning through the atmosphere, the streak of light is a meteor, so A describes the flash, not the rock you can pick up.",
                "A comet is a completely different object, an icy body with a tail that orbits the Sun, so D is out.",
                "Once a surviving piece lands on Earth, it is a meteorite. Memory hook: it is a meteorITE once it hITs the ground. The answer is C."
              ],
              "tip": "Meteoroid in space, meteor in the air, meteorite on the ground. Say it three times and this question becomes a free point."
            },
            {
              "problem": "ASVAB-style question: During a lunar eclipse, which body is in the middle of the lineup? (A) The Moon (B) The Sun (C) Earth (D) None, they do not line up",
              "steps": [
                "An eclipse is a shadow event, so first ask: whose shadow is falling on what?",
                "LUNAR eclipse means the Moon is the thing being eclipsed, something is shading the Moon.",
                "The only body big enough and positioned to cast a shadow on the Moon is Earth, so the order must be Sun, then Earth, then Moon, with Earth in the middle.",
                "Double-check with the moon phase rule: a lunar eclipse can only happen at a full moon, when the Moon is on the opposite side of Earth from the Sun, which matches Earth being in the middle.",
                "The answer is C."
              ],
              "tip": "Name the eclipse after the victim: in a LUNAR eclipse the Moon goes dark (Earth in the middle); in a SOLAR eclipse the Sun is blocked (Moon in the middle)."
            }
          ],
          "summary": "The eight planets in order are Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune: four small rocky inner planets, then the asteroid belt, then four gas giants. The Sun is an average star powered by nuclear fusion of hydrogen into helium. Asteroids are rocky, comets are icy with tails that point away from the Sun, and the same space rock is a meteoroid in space, a meteor burning in the atmosphere, and a meteorite on the ground. Earth's rotation (24 hours) causes day and night; its revolution around the Sun (365.25 days) defines the year; the 23.5 degree axial tilt, not distance, causes the seasons. Moon phases come from seeing different amounts of the Moon's sunlit side; a solar eclipse needs a new moon with the Moon in the middle, and a lunar eclipse needs a full moon with Earth in the middle. Tides are driven mainly by the Moon's gravity. Star color indicates temperature (blue hottest, red coolest), distances are measured in light-years, and our Sun is one of hundreds of billions of stars in the Milky Way galaxy. Nail these facts and space science becomes some of the easiest points on the test."
        },
        "questions": [
          {
            "id": "GS4-001",
            "options": [
              {
                "text": "Venus",
                "explanation": "Venus is the second planet from the Sun. It is the hottest planet, but not the closest."
              },
              {
                "text": "Mercury",
                "correct": true,
                "explanation": "Correct! Mercury is the first and closest planet to the Sun, and also the smallest planet in the solar system."
              },
              {
                "text": "Mars",
                "explanation": "Mars is the fourth planet from the Sun, the last of the inner rocky planets before the asteroid belt."
              },
              {
                "text": "Earth",
                "explanation": "Earth is the third planet from the Sun, after Mercury and Venus."
              }
            ],
            "text": "Which planet is closest to the Sun?"
          },
          {
            "id": "GS4-002",
            "options": [
              {
                "text": "Earth's revolution around the Sun",
                "explanation": "Revolution is Earth's yearly orbit around the Sun. It defines the year, not the day-night cycle."
              },
              {
                "text": "The tilt of Earth's axis",
                "explanation": "The 23.5 degree axial tilt causes the seasons, not day and night."
              },
              {
                "text": "The Moon blocking sunlight",
                "explanation": "The Moon blocking sunlight is a solar eclipse, a rare event, not the everyday cause of night."
              },
              {
                "text": "Earth's rotation on its axis",
                "correct": true,
                "explanation": "Correct! Earth spins once on its axis about every 24 hours. The side facing the Sun has day while the side facing away has night."
              }
            ],
            "text": "What causes day and night on Earth?"
          },
          {
            "id": "GS4-003",
            "options": [
              {
                "text": "small, dense planets with rocky surfaces",
                "explanation": "That describes the four inner terrestrial planets: Mercury, Venus, Earth, and Mars."
              },
              {
                "text": "dwarf planets like Pluto",
                "explanation": "Dwarf planets are much smaller bodies. Pluto is a dwarf planet, but the four outer planets are full-sized giants."
              },
              {
                "text": "large planets made mostly of gases such as hydrogen and helium",
                "correct": true,
                "explanation": "Correct! The outer planets are gas giants: huge, low-density worlds composed mostly of hydrogen and helium with no solid surface to stand on."
              },
              {
                "text": "moons that orbit the inner planets",
                "explanation": "Moons orbit planets, but Jupiter, Saturn, Uranus, and Neptune are planets themselves, each orbiting the Sun."
              }
            ],
            "text": "The four outer planets (Jupiter, Saturn, Uranus, and Neptune) are best described as:"
          },
          {
            "id": "GS4-004",
            "options": [
              {
                "text": "nuclear fusion of hydrogen into helium",
                "correct": true,
                "explanation": "Correct! In the Sun's core, hydrogen atoms fuse together to form helium, releasing enormous energy that reaches Earth as light and heat."
              },
              {
                "text": "burning coal and other fuels",
                "explanation": "Ordinary burning is a chemical reaction that could never power a star. The Sun's energy is nuclear, not chemical."
              },
              {
                "text": "reflecting light from other stars",
                "explanation": "The Sun produces its own light. It is the Moon and planets that shine by reflecting sunlight."
              },
              {
                "text": "splitting uranium atoms apart",
                "explanation": "Splitting heavy atoms is fission, the process used in nuclear power plants. Stars run on fusion, which joins light atoms together."
              }
            ],
            "text": "The Sun produces its energy by:"
          },
          {
            "id": "GS4-005",
            "options": [
              {
                "text": "comet",
                "explanation": "A comet is a large icy body orbiting the Sun that grows a glowing tail near the Sun. It is not a rock burning in our atmosphere."
              },
              {
                "text": "meteorite",
                "explanation": "A meteorite is the piece that survives the trip and is found on the ground. The streak of light in the sky has a different name."
              },
              {
                "text": "asteroid",
                "explanation": "Asteroids are rocky objects orbiting the Sun, mostly in the belt between Mars and Jupiter, not flashes of light in our atmosphere."
              },
              {
                "text": "meteor",
                "correct": true,
                "explanation": "Correct! The streak of light from a space rock burning in the atmosphere is a meteor, often called a shooting star. In space it was a meteoroid, and any piece that lands is a meteorite."
              }
            ],
            "text": "A small space rock burns up as it passes through Earth's atmosphere, creating a streak of light. That streak of light is called a:"
          },
          {
            "id": "GS4-006",
            "options": [
              {
                "text": "Earth moves much closer to the Sun in summer",
                "explanation": "This is the classic trap. Earth's distance from the Sun changes very little, and Earth is actually slightly closer to the Sun during Northern Hemisphere winter."
              },
              {
                "text": "Earth's axis is tilted about 23.5 degrees",
                "correct": true,
                "explanation": "Correct! As Earth orbits the Sun, the tilted axis makes each hemisphere lean toward the Sun for part of the year (summer) and away for part of the year (winter)."
              },
              {
                "text": "the Sun gives off more heat at certain times of year",
                "explanation": "The Sun's energy output stays essentially steady through the year. The change is in how directly that energy hits each hemisphere."
              },
              {
                "text": "the Moon's gravity heats and cools the oceans",
                "explanation": "The Moon's gravity causes tides, the rise and fall of ocean water. It does not heat the oceans or drive the seasons."
              }
            ],
            "text": "Earth has seasons mainly because:"
          },
          {
            "id": "GS4-007",
            "options": [
              {
                "text": "Earth passes between the Sun and the Moon",
                "explanation": "When Earth is in the middle, Earth's shadow falls on the Moon. That is a lunar eclipse, not a solar eclipse."
              },
              {
                "text": "the Sun passes between Earth and the Moon",
                "explanation": "The Sun is at the center of the solar system and does not move between Earth and the Moon. This arrangement never happens."
              },
              {
                "text": "the Moon passes between the Sun and Earth",
                "correct": true,
                "explanation": "Correct! In a solar eclipse the Moon moves between the Sun and Earth, casting its shadow on Earth and blocking the Sun. It can only happen at a new moon."
              },
              {
                "text": "Earth's shadow falls on the Moon",
                "explanation": "Earth's shadow falling on the Moon describes a lunar eclipse, which happens at a full moon and often turns the Moon reddish."
              }
            ],
            "text": "A solar eclipse occurs when:"
          },
          {
            "id": "GS4-008",
            "options": [
              {
                "text": "strong winds blowing across the ocean surface",
                "explanation": "Winds create waves and can push water around in storms, but the steady, predictable rise and fall of the tides comes from gravity, not wind."
              },
              {
                "text": "heat from the Sun expanding the seawater",
                "explanation": "Warming can expand water slightly, but that effect is far too small and slow to produce the twice-daily rise and fall of the tides."
              },
              {
                "text": "underwater earthquakes and volcanoes",
                "explanation": "Underwater earthquakes can trigger tsunamis, which are rare, single events. Regular daily tides have a different cause."
              },
              {
                "text": "the gravitational pull of the Moon",
                "correct": true,
                "explanation": "Correct! The Moon's gravity pulls on Earth's oceans, creating bulges of water that produce roughly two high tides and two low tides each day. The Sun contributes too, but the Moon is the main driver because it is much closer."
              }
            ],
            "text": "Ocean tides on Earth are caused mainly by:"
          }
        ],
        "quizConfig": {
          "questionsPerQuiz": 6
        }
      },
      {
        "id": "GS-5",
        "title": "Physical Science: Motion, Energy, and Waves",
        "description": "Master the physics questions on the General Science section: motion and Newton's laws, energy and heat, temperature scales, states of matter, waves, sound, light, and density. These concepts show up often, and every one of them can be learned with plain language and a little practice.",
        "lesson": {
          "intro": "Physics is not about memorizing scary formulas. It is about describing how the everyday world works: why a truck is harder to stop than a bicycle, why a metal bench feels colder than a wooden one, and why you see lightning before you hear thunder. The ASVAB tests these ideas at a basic level. If you can picture the situation, you can usually reason your way to the answer. In this chapter we cover motion, forces, energy, heat, waves, sound, light, and density. Take it one section at a time. You have got this.",
          "concepts": [
            {
              "title": "Motion Basics: Speed, Velocity, and Acceleration",
              "content": "Speed tells you how fast something moves: speed equals distance divided by time. A car that covers 120 miles in 2 hours has a speed of 60 miles per hour. Velocity is speed plus a direction, such as 60 miles per hour heading north. Because velocity includes direction, it is called a vector; plain speed is not. Acceleration is any change in velocity over time. That means speeding up, slowing down, or even turning at a constant speed all count as acceleration, because in each case the velocity is changing. On the ASVAB, remember these three definitions and the formula speed equals distance divided by time. If you know any two of distance, time, and speed, you can find the third."
            },
            {
              "title": "Newton's Three Laws of Motion",
              "content": "First law (inertia): an object at rest stays at rest, and an object in motion keeps moving in a straight line at constant speed, unless an outside force acts on it. This is why you lurch forward when a vehicle brakes suddenly. Second law: force equals mass times acceleration, written F equals m x a. The bigger the mass, the more force it takes to accelerate it, which is why a loaded truck needs more braking force than an empty one. Force is measured in newtons; one newton accelerates a 1 kilogram mass at 1 meter per second squared. Third law: for every action there is an equal and opposite reaction. When a rifle fires, the bullet goes forward and the rifle kicks back against your shoulder with equal force. Rockets work the same way: hot gas pushes down and out, and the rocket is pushed up."
            },
            {
              "title": "Energy Forms and Conservation",
              "content": "Energy is the ability to do work, and it comes in forms: kinetic energy (energy of motion), potential energy (stored energy, such as a rock held above the ground or a stretched spring), chemical energy (in fuel and food), thermal energy (heat), electrical energy, and nuclear energy. The law of conservation of energy says energy cannot be created or destroyed, only changed from one form to another. A swinging pendulum is the classic example: at the top of its swing it has maximum potential energy and zero kinetic energy; at the bottom it has maximum kinetic energy and minimum potential energy. The energy trades back and forth, but the total stays the same (some is slowly lost to air friction as heat, which is still energy, just a different form). Kinetic energy grows quickly with speed: doubling an object's speed makes its kinetic energy four times as large."
            },
            {
              "title": "Heat, Temperature Scales, and States of Matter",
              "content": "Heat moves in three ways. Conduction is heat transfer by direct contact, as when a metal spoon left in hot soup gets hot along its whole length; metals are good conductors. Convection is heat carried by moving fluids (liquids or gases): warm air rises and cool air sinks, creating circulating currents, which is how a room heater warms the whole room. Radiation is heat transfer by electromagnetic waves and needs no matter at all; this is how the sun warms the Earth across empty space. Temperature is measured on three scales. On Fahrenheit, water freezes at 32 degrees and boils at 212 degrees. On Celsius, water freezes at 0 degrees and boils at 100 degrees. Kelvin is the SI scale used in science: 0 kelvin is absolute zero, the coldest possible temperature, and water freezes at about 273 kelvin. Matter commonly exists as solid, liquid, or gas. Melting (solid to liquid), evaporation or boiling (liquid to gas), condensation (gas to liquid), and freezing (liquid to solid) are phase changes. Sublimation is a solid turning directly into a gas, as dry ice does. During a phase change, the temperature of the substance stays constant while heat is absorbed or released."
            },
            {
              "title": "Waves, Sound, and Light",
              "content": "A wave carries energy from place to place. Wavelength is the distance from one crest to the next. Frequency is how many waves pass a point each second, measured in hertz. Amplitude is the height of the wave, which relates to its energy: for sound, bigger amplitude means louder; for light, brighter. For a given wave speed, frequency and wavelength trade off: higher frequency means shorter wavelength, because wave speed equals frequency x wavelength. Sound is a mechanical wave, which means it needs a medium (matter) to travel through; sound cannot travel through the vacuum of space. Sound travels fastest in solids, slower in liquids, and slowest in gases, because particles that are packed closer together pass the vibration along faster. In air, sound moves at roughly 343 meters per second, far slower than light, which is why you see lightning before you hear the thunder. Light is an electromagnetic wave and needs no medium; it travels through space at about 300,000 kilometers per second. Reflection is light bouncing off a surface, as in a mirror. Refraction is light bending as it passes from one material into another, which is why a straw in a glass of water looks bent at the surface. Visible light is one small slice of the electromagnetic spectrum, which runs from low-frequency radio waves through microwaves, infrared, visible light, ultraviolet, X-rays, and gamma rays at the highest frequencies."
            },
            {
              "title": "Density, Buoyancy, and SI Units",
              "content": "Density is mass divided by volume, often given in grams per cubic centimeter. Water has a density of 1 gram per cubic centimeter, and that number is your yardstick: an object less dense than the fluid it is placed in floats, and an object more dense sinks. This is buoyancy. Archimedes' principle says the upward buoyant force on an object equals the weight of the fluid the object displaces (pushes aside). A steel ship floats even though steel is denser than water because the ship's hull encloses a lot of air, making the ship's overall density less than water's. Finally, know the basic SI (metric) units, because science questions use them: length is measured in meters, mass in kilograms, time in seconds, temperature in kelvin, force in newtons, energy in joules, power in watts, and frequency in hertz. Note that mass and weight are different: mass is the amount of matter in an object and never changes, while weight is the force of gravity on that mass, so an astronaut weighs less on the moon but has the same mass."
            }
          ],
          "examples": [
            {
              "problem": "A convoy travels 180 miles in 4 hours. What is its average speed?",
              "steps": [
                "Recall the formula: speed equals distance divided by time.",
                "Plug in the numbers: 180 miles divided by 4 hours.",
                "Divide: 180 divided by 4 equals 45.",
                "The average speed is 45 miles per hour."
              ],
              "tip": "The same triangle of relationships works in every direction: distance equals speed x time, and time equals distance divided by speed. Learn one formula and you own all three."
            },
            {
              "problem": "What force is needed to accelerate a 12 kilogram ammunition crate at 3 meters per second squared across a frictionless surface?",
              "steps": [
                "Use Newton's second law: force equals mass x acceleration.",
                "Plug in the values: 12 kilograms x 3 meters per second squared.",
                "Multiply: 12 x 3 equals 36.",
                "The required force is 36 newtons."
              ],
              "tip": "Units are your friend. Kilograms x meters per second squared gives newtons automatically, so if your units come out right, your setup is probably right too."
            },
            {
              "problem": "A metal block has a mass of 54 grams and a volume of 20 cubic centimeters. Will it float or sink in water?",
              "steps": [
                "Density equals mass divided by volume.",
                "Plug in: 54 grams divided by 20 cubic centimeters.",
                "Divide: 54 divided by 20 equals 2.7, so the density is 2.7 grams per cubic centimeter.",
                "Compare with water, which has a density of 1 gram per cubic centimeter.",
                "Since 2.7 is greater than 1, the block is denser than water, so it sinks."
              ],
              "tip": "For float-or-sink questions, you rarely need the exact number. Just compare the object's density to the fluid's density: less dense floats, more dense sinks."
            }
          ],
          "summary": "You now have the core physics toolkit for the ASVAB. Speed is distance divided by time, velocity adds direction, and acceleration is any change in velocity. Newton's laws explain inertia, force equals mass x acceleration, and action-reaction pairs. Energy changes form but is never created or destroyed. Heat moves by conduction (contact), convection (moving fluids), and radiation (waves through space). Water freezes at 32 Fahrenheit, 0 Celsius, and about 273 kelvin, and boils at 212 Fahrenheit and 100 Celsius. Waves are described by frequency, wavelength, and amplitude; sound needs a medium and travels fastest in solids, while light needs no medium and travels far faster. Reflection bounces light, refraction bends it. Density is mass divided by volume, and objects float when they are less dense than the fluid around them. Review the SI units, work the practice questions below, and trust the process: every one of these ideas gets easier each time you see it."
        },
        "questions": [
          {
            "id": "GS5-001",
            "options": [
              {
                "text": "Speed",
                "explanation": "Speed tells you only how fast something is moving, with no direction attached, so it is a scalar, not a vector."
              },
              {
                "text": "Velocity",
                "correct": true,
                "explanation": "Correct! Velocity is speed together with a direction, such as 50 miles per hour heading east, which makes it a vector quantity."
              },
              {
                "text": "Mass",
                "explanation": "Mass is just the amount of matter in an object. It has size but no direction, so it is a scalar."
              },
              {
                "text": "Temperature",
                "explanation": "Temperature is a single number with no direction, so it is a scalar quantity, not a vector."
              }
            ],
            "text": "Which of the following quantities includes both a magnitude and a direction?"
          },
          {
            "id": "GS5-002",
            "options": [
              {
                "text": "The first law, because the rifle resists changes in motion",
                "explanation": "The first law describes inertia, an object's resistance to changes in motion. It does not explain why firing forward produces a backward kick."
              },
              {
                "text": "The second law, because force equals mass times acceleration",
                "explanation": "The second law relates force, mass, and acceleration for a single object. It can describe how hard the kick is, but the reason a kick exists at all is a different law."
              },
              {
                "text": "The law of conservation of energy",
                "explanation": "Conservation of energy is about energy changing forms, not about paired forces. It is not one of Newton's laws of motion."
              },
              {
                "text": "The third law, because every action has an equal and opposite reaction",
                "correct": true,
                "explanation": "Correct! The rifle pushes the bullet forward, and the bullet pushes back on the rifle with an equal and opposite force. That reaction force is the recoil you feel."
              }
            ],
            "text": "A rifle kicks backward against the shooter's shoulder when it fires. Which of Newton's laws best explains this recoil?"
          },
          {
            "id": "GS5-003",
            "options": [
              {
                "text": "Potential energy",
                "correct": true,
                "explanation": "Correct! At the top of the swing the pendulum is at its highest point and not moving, so its energy is stored as gravitational potential energy. As it swings down, that energy converts to kinetic energy."
              },
              {
                "text": "Kinetic energy",
                "explanation": "Kinetic energy is the energy of motion, and at the top of the swing the pendulum is momentarily not moving, so its kinetic energy is zero there."
              },
              {
                "text": "Chemical energy",
                "explanation": "Chemical energy is stored in the bonds of substances like fuel or food. A swinging pendulum does not involve chemical energy changes."
              },
              {
                "text": "Electrical energy",
                "explanation": "Nothing in a simple swinging pendulum generates or stores electrical energy. The trade is between potential and kinetic energy."
              }
            ],
            "text": "A pendulum is momentarily at rest at the very top of its swing. At that instant, its energy is mostly in what form?"
          },
          {
            "id": "GS5-004",
            "options": [
              {
                "text": "Radiation",
                "explanation": "Radiation transfers heat by electromagnetic waves and needs no contact, like sunlight warming your skin. The spoon is heated by direct contact instead."
              },
              {
                "text": "Convection",
                "explanation": "Convection is heat carried by circulating liquids or gases. Heat traveling up through the solid metal of the spoon is a different process."
              },
              {
                "text": "Conduction",
                "correct": true,
                "explanation": "Correct! Conduction is heat transfer by direct contact through a material. Metals conduct heat well, so the heat travels from the soup up through the spoon to the handle."
              },
              {
                "text": "Sublimation",
                "explanation": "Sublimation is a phase change in which a solid turns directly into a gas, like dry ice. It is not a form of heat transfer."
              }
            ],
            "text": "A metal spoon left standing in a pot of hot soup soon becomes hot all the way up the handle. This is an example of which type of heat transfer?"
          },
          {
            "id": "GS5-005",
            "options": [
              {
                "text": "212 degrees Celsius",
                "explanation": "212 is the boiling point of water on the Fahrenheit scale, not the Celsius scale. Be careful not to mix up the two scales."
              },
              {
                "text": "100 degrees Celsius",
                "correct": true,
                "explanation": "Correct! On the Celsius scale, water freezes at 0 degrees and boils at 100 degrees at standard atmospheric pressure. The scale was designed around these two points."
              },
              {
                "text": "0 degrees Celsius",
                "explanation": "0 degrees Celsius is the freezing point of water, the temperature at which it turns to ice, not the boiling point."
              },
              {
                "text": "32 degrees Celsius",
                "explanation": "32 degrees is the freezing point of water on the Fahrenheit scale. It is not a special temperature on the Celsius scale."
              }
            ],
            "text": "At standard atmospheric pressure, water boils at what temperature on the Celsius scale?"
          },
          {
            "id": "GS5-006",
            "options": [
              {
                "text": "Sound waves move too fast in space to be detected",
                "explanation": "Speed is not the issue. In a vacuum there is no matter for sound to travel through at any speed."
              },
              {
                "text": "The human ear cannot function in low gravity",
                "explanation": "The ear works fine in low gravity; astronauts talk to each other normally inside their spacecraft where there is air."
              },
              {
                "text": "Explosions in space do not release any energy",
                "explanation": "Explosions in space do release energy, including light and heat. What is missing is a medium to carry sound waves."
              },
              {
                "text": "Sound is a mechanical wave and needs a medium such as air to travel",
                "correct": true,
                "explanation": "Correct! Sound travels as vibrations passed from particle to particle, so it requires matter such as air, water, or metal. Space is a near-perfect vacuum with almost no particles, so sound cannot travel through it."
              }
            ],
            "text": "Why can astronauts in the vacuum of space not hear an explosion happening nearby?"
          },
          {
            "id": "GS5-007",
            "options": [
              {
                "text": "Longer wavelength",
                "explanation": "This is backwards. When speed is constant, raising the frequency squeezes the waves closer together, which shortens the wavelength."
              },
              {
                "text": "Larger amplitude",
                "explanation": "Amplitude is the height of the wave and is independent of frequency. A high-frequency wave can be tall or short."
              },
              {
                "text": "Shorter wavelength",
                "correct": true,
                "explanation": "Correct! Wave speed equals frequency x wavelength. If the speed is the same and the frequency is higher, the wavelength must be shorter to keep the product equal."
              },
              {
                "text": "Slower speed",
                "explanation": "The problem states that both waves travel at the same speed, so wave A is not slower. The difference shows up in the wavelength instead."
              }
            ],
            "text": "Two waves travel at the same speed. Wave A has a higher frequency than wave B. Compared to wave B, wave A must have a:"
          },
          {
            "id": "GS5-008",
            "options": [
              {
                "text": "It will float, because its density is less than the density of water",
                "correct": true,
                "explanation": "Correct! Density equals mass divided by volume: 6 divided by 10 equals 0.6 grams per cubic centimeter. Water's density is 1 gram per cubic centimeter, and since 0.6 is less than 1, the object floats."
              },
              {
                "text": "It will sink, because its density is greater than the density of water",
                "explanation": "Its density is 6 divided by 10, which is 0.6 grams per cubic centimeter. That is less than water's density of 1, so the object floats rather than sinks."
              },
              {
                "text": "It will sink, because any object heavier than 5 grams sinks in water",
                "explanation": "Floating and sinking depend on density, not on mass alone. A massive steel ship floats because its overall density, including the air inside, is less than water's."
              },
              {
                "text": "It will float, because its volume is greater than its mass",
                "explanation": "Comparing a volume number to a mass number directly is not meaningful because they have different units. The right test is to compute density and compare it with the density of water."
              }
            ],
            "text": "An object with a volume of 10 cubic centimeters and a mass of 6 grams is placed in water. What will happen?"
          }
        ],
        "quizConfig": {
          "questionsPerQuiz": 6
        }
      },
      {
        "id": "GS-6",
        "title": "Chemistry Basics",
        "description": "Learn the chemistry fundamentals the ASVAB loves to test: atoms and their parts, elements vs compounds vs mixtures, how to read the periodic table, chemical vs physical changes, acids and bases on the pH scale, everyday reactions like combustion and rusting, solutions and solubility, and the common gases you breathe every day.",
        "lesson": {
          "intro": "Chemistry can sound intimidating, but the General Science section only expects the basics - and you already know more chemistry than you think. Every time you watch iron rust, dissolve sugar in coffee, or light a campfire, you are watching chemistry in action. In this chapter we will break matter down to its smallest pieces (atoms), learn how those pieces combine into elements, compounds, and mixtures, get comfortable reading the periodic table, and cover the reactions, acids, bases, and gases that show up again and again on the test. Take it one concept at a time - these ideas build on each other, and by the end they will feel like common sense.",
          "concepts": [
            {
              "title": "Atoms: Protons, Neutrons, and Electrons",
              "content": "The atom is the basic building block of all matter. Every atom has a tiny, dense center called the nucleus, which contains protons (positive charge) and neutrons (no charge). Whizzing around the nucleus are electrons (negative charge), which are far lighter than protons and neutrons. Two numbers describe every atom. The atomic number is the number of protons - it is the atom's identity card. Change the number of protons and you have a different element entirely. The mass number is protons plus neutrons (electrons are so light they barely count toward mass). So carbon, with atomic number 6 and mass number 12, has 6 protons and 12 - 6 = 6 neutrons. In a neutral atom, the number of electrons equals the number of protons, so the charges cancel out. Atoms of the same element with different numbers of neutrons are called isotopes - same atomic number, different mass number."
            },
            {
              "title": "Elements, Compounds, and Mixtures",
              "content": "An element is a pure substance made of only one kind of atom - gold (Au), oxygen (O), and iron (Fe) are elements. You cannot break an element into anything simpler by ordinary chemical means. A compound forms when two or more different elements chemically bond in a fixed ratio - water (H2O), table salt (NaCl), and carbon dioxide (CO2) are compounds. A compound's properties are usually completely different from its ingredients: sodium is a metal that reacts violently with water, and chlorine is a poisonous gas, yet together they make ordinary table salt. A mixture is different - it is two or more substances physically combined, not chemically bonded, and the parts keep their own properties. Salt water, air, and trail mix are mixtures, and you can separate them by physical means like evaporation or filtering. Quick test: if separating it requires a chemical reaction, it is a compound; if you can separate it physically, it is a mixture."
            },
            {
              "title": "Reading the Periodic Table",
              "content": "The periodic table organizes all known elements by increasing atomic number. Vertical columns are called groups (or families) - elements in the same group have similar chemical behavior. For example, Group 1 holds the very reactive alkali metals like sodium (Na) and potassium (K), and Group 18 on the far right holds the noble gases like helium (He) and neon (Ne), which almost never react at all. Horizontal rows are called periods. Metals sit on the left and center of the table - they are typically shiny, solid at room temperature (mercury is the famous liquid exception), and good conductors of heat and electricity. Nonmetals sit in the upper right - they are poor conductors and are often gases or brittle solids. A staircase line separates the two, with a few in-between elements called metalloids (like silicon) along it. Memorize the common symbols: H hydrogen, He helium, C carbon, N nitrogen, O oxygen, Na sodium, K potassium, Fe iron, Cu copper, Au gold, Ag silver, Pb lead, Ca calcium, Cl chlorine. Watch out for the tricky ones that come from Latin names: Fe (iron), Au (gold), Ag (silver), Na (sodium), K (potassium), Pb (lead)."
            },
            {
              "title": "Chemical vs Physical Changes",
              "content": "A physical change alters the form or state of a substance without creating anything new. Melting ice, boiling water, dissolving sugar, tearing paper, and bending metal are all physical changes - the substance is still the same stuff, and many physical changes are easy to reverse. A chemical change (chemical reaction) produces one or more brand-new substances with different properties. Burning wood, rusting iron, digesting food, and baking a cake are chemical changes. Clues that a chemical change happened include: a gas is produced (bubbles), light or heat is given off, a permanent color change, or a solid (precipitate) forms out of a liquid. Chemical changes are usually hard or impossible to reverse - you cannot un-burn a log. On the test, ask yourself one question: did a new substance form? If yes, it is chemical. If it just changed shape, size, or state, it is physical."
            },
            {
              "title": "Acids, Bases, and the pH Scale",
              "content": "Acids and bases are measured on the pH scale, which runs from 0 to 14. A pH below 7 is acidic, exactly 7 is neutral, and above 7 is basic (also called alkaline). The farther from 7, the stronger the acid or base. Pure water is neutral at pH 7. Everyday acids include lemon juice and vinegar (around pH 2 to 3), stomach acid (hydrochloric acid, around pH 1 to 2), and soda. Everyday bases include baking soda (around pH 9), soap, ammonia, and drain cleaner (very basic, pH 13 to 14). Litmus paper is the classic test: acids turn blue litmus red, and bases turn red litmus blue. A memory trick - acids taste sour (think citrus), while bases feel slippery (think soap). When an acid and a base react with each other, they neutralize, producing water and a salt. That is why an antacid tablet (a base) calms excess stomach acid."
            },
            {
              "title": "Everyday Reactions: Combustion, Oxidation, and Rusting",
              "content": "Two reactions show up constantly on the ASVAB. Combustion is rapid burning: a fuel combines with oxygen and releases heat and light. Burning a fuel like wood, gasoline, or propane with plenty of oxygen produces carbon dioxide (CO2) and water (H2O). Fire needs three things - fuel, oxygen, and heat (the fire triangle) - and removing any one of them puts the fire out. Oxidation is the broader family of reactions where a substance combines with oxygen (more precisely, loses electrons). Combustion is fast oxidation; rusting is slow oxidation. Rust forms when iron reacts with oxygen in the presence of water or moisture, producing iron oxide - the flaky reddish-brown coating on old steel. Both water and oxygen are needed, which is why painting, oiling, or galvanizing (coating with zinc) protects metal: the coating keeps oxygen and moisture away from the iron."
            },
            {
              "title": "Solutions, Solubility, and Common Gases",
              "content": "A solution is a mixture where one substance dissolves evenly into another. The solute is what gets dissolved (like salt), and the solvent does the dissolving (like water). Water dissolves so many things it is called the universal solvent. Solubility is how much solute can dissolve in a given amount of solvent. For most solids, solubility increases as temperature rises - hot tea dissolves sugar faster and holds more of it than iced tea. Gases behave the opposite way: gases dissolve better in cold liquids, which is why a warm soda goes flat faster than a cold one. A solution holding all the solute it can is saturated. Now the common gases. Nitrogen (N2) makes up about 78 percent of the air, oxygen (O2) about 21 percent. Oxygen supports combustion and is what our bodies need from every breath. Carbon dioxide (CO2) is produced by respiration and combustion, is used by plants for photosynthesis, and is heavier than air, which makes it useful in fire extinguishers - it smothers flames by displacing oxygen. Hydrogen (H) is the lightest and most abundant element in the universe and is highly flammable, which is why blimps switched to non-flammable helium."
            }
          ],
          "examples": [
            {
              "problem": "An atom has an atomic number of 11 and a mass number of 23. How many protons, neutrons, and electrons does the neutral atom have?",
              "steps": [
                "The atomic number equals the number of protons, so the atom has 11 protons.",
                "The mass number is protons plus neutrons. Subtract to find neutrons: 23 - 11 = 12 neutrons.",
                "In a neutral atom, electrons equal protons, so there are 11 electrons.",
                "Answer: 11 protons, 12 neutrons, 11 electrons. Bonus: atomic number 11 is sodium (Na)."
              ],
              "tip": "Protons = atomic number. Neutrons = mass number minus atomic number. Electrons = protons (when the atom is neutral). Master this three-step pattern and every atom question becomes simple subtraction."
            },
            {
              "problem": "A liquid turns blue litmus paper red. Which of these could it be: ammonia, pure water, vinegar, or soap solution?",
              "steps": [
                "Recall the litmus rule: acids turn blue litmus red; bases turn red litmus blue.",
                "The liquid turned blue litmus red, so it must be an acid with a pH below 7.",
                "Check each option: ammonia and soap are bases (pH above 7), pure water is neutral (pH 7), and vinegar is an acid (about pH 2 to 3).",
                "Answer: vinegar."
              ],
              "tip": "Memory hook: Blue to Red means aciD is ahead. Acids are sour things like vinegar and citrus; bases are slippery things like soap and ammonia."
            },
            {
              "problem": "A steel fence left outside develops a reddish-brown, flaky coating over several months. Is this a chemical or physical change, and what caused it?",
              "steps": [
                "Ask the key question: did a new substance form? The reddish-brown flaky coating is rust (iron oxide), which is a new substance with different properties than steel.",
                "Because a new substance formed, this is a chemical change.",
                "Identify the cause: iron in the steel slowly combined with oxygen from the air in the presence of moisture - a slow oxidation reaction.",
                "Answer: it is a chemical change caused by iron reacting with oxygen and water to form iron oxide (rust)."
              ],
              "tip": "Rusting, burning, and digesting are always chemical changes. Melting, freezing, dissolving, and bending are physical. When in doubt, ask: could I get the original substance back easily? If not, it is probably chemical."
            }
          ],
          "summary": "You now have the chemistry toolkit the ASVAB expects. Atoms are built from protons and neutrons in the nucleus with electrons around them; the atomic number counts protons and the mass number counts protons plus neutrons. Elements are one kind of atom, compounds are elements chemically bonded in fixed ratios, and mixtures are physical combinations you can separate physically. On the periodic table, columns are groups with similar behavior, rows are periods, metals sit left, and nonmetals sit upper right - and remember the Latin-based symbols like Fe, Au, Ag, Na, K, and Pb. Physical changes keep the same substance; chemical changes make new ones. The pH scale runs 0 to 14 with 7 neutral - acids turn blue litmus red, bases turn red litmus blue. Combustion is fast oxidation and rusting is slow oxidation, both needing oxygen. In solutions, the solute dissolves in the solvent, solids dissolve better hot while gases dissolve better cold. And in the air around you: about 78 percent nitrogen, 21 percent oxygen, with CO2 feeding plants and smothering fires, and hydrogen as the lightest, most flammable element. Review the tricky symbols and the pH landmarks one more time, then test yourself with the practice questions - you are ready for this."
        },
        "questions": [
          {
            "id": "GS6-001",
            "options": [
              {
                "text": "Electron",
                "explanation": "Electrons carry a negative charge and orbit outside the nucleus."
              },
              {
                "text": "Neutron",
                "explanation": "Neutrons are in the nucleus but carry no charge at all - that is why they are called neutrons."
              },
              {
                "text": "Proton",
                "correct": true,
                "explanation": "Correct! Protons are positively charged particles in the nucleus, and the number of protons (the atomic number) determines which element the atom is."
              },
              {
                "text": "Photon",
                "explanation": "A photon is a particle of light, not a building block of the atom."
              }
            ],
            "text": "Which particle in an atom carries a positive charge?"
          },
          {
            "id": "GS6-002",
            "options": [
              {
                "text": "8",
                "correct": true,
                "explanation": "Correct! Neutrons = mass number minus protons, so 16 - 8 = 8 neutrons. This atom is oxygen."
              },
              {
                "text": "16",
                "explanation": "16 is the mass number (protons plus neutrons together), not the neutron count by itself."
              },
              {
                "text": "24",
                "explanation": "This adds the mass number and the proton count. Instead, subtract protons from the mass number: 16 - 8 = 8."
              },
              {
                "text": "2",
                "explanation": "Subtracting incorrectly gives this. The rule is mass number minus atomic number: 16 - 8 = 8 neutrons."
              }
            ],
            "text": "An atom has 8 protons and a mass number of 16. How many neutrons does it have?"
          },
          {
            "id": "GS6-003",
            "options": [
              {
                "text": "An element",
                "explanation": "An element contains only one kind of atom, like pure gold or pure oxygen. Salt water contains several substances."
              },
              {
                "text": "A compound",
                "explanation": "A compound has elements chemically bonded in a fixed ratio. The salt and the water in salt water are not bonded to each other and can be separated by evaporation."
              },
              {
                "text": "A pure substance",
                "explanation": "A pure substance is a single element or compound. Salt water is a combination of two substances, so it is not pure."
              },
              {
                "text": "A mixture",
                "correct": true,
                "explanation": "Correct! Salt water is a mixture (specifically a solution) - the salt and water are physically combined, keep their own properties, and can be separated by evaporating the water."
              }
            ],
            "text": "Salt water is best described as which of the following?"
          },
          {
            "id": "GS6-004",
            "options": [
              {
                "text": "Ir",
                "explanation": "Ir is the symbol for iridium, a different metal."
              },
              {
                "text": "Fe",
                "correct": true,
                "explanation": "Correct! Iron's symbol is Fe, from its Latin name ferrum. Other Latin-based symbols include Au (gold), Ag (silver), Na (sodium), and Pb (lead)."
              },
              {
                "text": "In",
                "explanation": "In is the symbol for indium, not iron."
              },
              {
                "text": "I",
                "explanation": "I is the symbol for iodine, a nonmetal."
              }
            ],
            "text": "On the periodic table, what is the correct chemical symbol for iron?"
          },
          {
            "id": "GS6-005",
            "options": [
              {
                "text": "Ice melting into water",
                "explanation": "Melting is a change of state - the substance is still H2O - so it is a physical change."
              },
              {
                "text": "Sugar dissolving in tea",
                "explanation": "Dissolving is a physical change. The sugar is still sugar, and you could recover it by evaporating the water."
              },
              {
                "text": "Iron rusting on a fence",
                "correct": true,
                "explanation": "Correct! Rusting creates a new substance, iron oxide, with different properties than iron, so it is a chemical change (slow oxidation)."
              },
              {
                "text": "Tearing a sheet of paper",
                "explanation": "Tearing only changes the paper's size and shape - no new substance forms, so it is a physical change."
              }
            ],
            "text": "Which of the following is a chemical change?"
          },
          {
            "id": "GS6-006",
            "options": [
              {
                "text": "It is a base and will feel slippery",
                "explanation": "Bases have a pH above 7. A pH of 3 is well below 7, so this solution is not a base."
              },
              {
                "text": "It is neutral, like pure water",
                "explanation": "Neutral means exactly pH 7, which is where pure water sits. A pH of 3 is far from neutral."
              },
              {
                "text": "It is an acid and will turn blue litmus paper red",
                "correct": true,
                "explanation": "Correct! Any pH below 7 is acidic, and acids turn blue litmus paper red. A pH of 3 is about as acidic as vinegar or lemon juice."
              },
              {
                "text": "It is an acid and will turn red litmus paper blue",
                "explanation": "This has the litmus rule backwards. Acids turn blue litmus red; it is bases that turn red litmus blue."
              }
            ],
            "text": "A solution has a pH of 3. Which statement about it is true?"
          },
          {
            "id": "GS6-007",
            "options": [
              {
                "text": "Oxygen and moisture",
                "correct": true,
                "explanation": "Correct! Rust forms when iron reacts with oxygen in the presence of water or moisture, producing iron oxide. Remove either one - for example with paint or an oil coating - and rusting stops."
              },
              {
                "text": "Nitrogen and sunlight",
                "explanation": "Nitrogen is very unreactive and sunlight is not required - rust forms in the dark just fine. The key ingredients are oxygen and moisture."
              },
              {
                "text": "Carbon dioxide and heat",
                "explanation": "Rusting does not require CO2 or added heat. It is a slow reaction between iron, oxygen, and water at ordinary temperatures."
              },
              {
                "text": "Hydrogen and salt",
                "explanation": "Salt can speed rusting up (which is why cars rust faster near the ocean), but the two essential ingredients are oxygen and moisture, not hydrogen and salt."
              }
            ],
            "text": "Which two things must both be present for iron to rust?"
          },
          {
            "id": "GS6-008",
            "options": [
              {
                "text": "Oxygen",
                "explanation": "Oxygen is vital, but it is only about 21 percent of the air - the second largest share, not the largest."
              },
              {
                "text": "Carbon dioxide",
                "explanation": "Carbon dioxide is less than 1 percent of the atmosphere, even though it is important for plants and climate."
              },
              {
                "text": "Hydrogen",
                "explanation": "Hydrogen is the most abundant element in the universe, but it makes up only a tiny trace of Earth's atmosphere."
              },
              {
                "text": "Nitrogen",
                "correct": true,
                "explanation": "Correct! Nitrogen (N2) makes up about 78 percent of the air we breathe, with oxygen at about 21 percent and all other gases sharing the last 1 percent."
              }
            ],
            "text": "Which gas makes up the largest portion of Earth's atmosphere?"
          }
        ],
        "quizConfig": {
          "questionsPerQuiz": 6
        }
      }
    ]
  },
  MC: {
    "name": "Mechanical Comprehension",
    "description": "Forces, machines, and how mechanical things work",
    "icon": "⚙️",
    "chapters": [
      {
        "id": "MC-1",
        "title": "Forces and Motion",
        "description": "Learn what forces are, how Newton's laws explain everyday motion, and the basics of friction, gravity, work, energy, and power.",
        "lesson": {
          "intro": "Every question on the Mechanical Comprehension section comes back to one big idea: forces make things move, stop, or change direction. If you understand pushes, pulls, friction, and gravity, you can reason your way through gears, levers, and pulleys later on. This chapter gives you that foundation in plain language, with the kind of examples the ASVAB loves to ask about.",
          "concepts": [
            {
              "title": "What a Force Is, and Net Force",
              "content": "A force is simply a push or a pull, and it is measured in newtons (N). Most objects have several forces acting on them at once, like when you push a crate forward while friction drags it backward. The net force is what you get when you combine all of those forces, keeping track of direction. Forces in the same direction add together, and forces in opposite directions subtract. If the net force is zero, the object is in equilibrium: it either stays still or keeps moving at the same steady speed. If the net force is not zero, the object speeds up, slows down, or changes direction."
            },
            {
              "title": "Newton's Three Laws in Everyday Terms",
              "content": "Newton's first law says objects keep doing what they are doing unless a net force changes it, which is why you lurch forward when a vehicle brakes hard. This tendency to resist changes in motion is called inertia, and objects with more mass have more of it. Newton's second law connects force, mass, and acceleration with the formula force equals mass times acceleration (F = m x a); the same push accelerates a light object more than a heavy one. Newton's third law says every action has an equal and opposite reaction, which is how a rifle kicks back against your shoulder when it fires. These three laws explain almost every motion question the ASVAB can throw at you."
            },
            {
              "title": "Weight vs Mass",
              "content": "Mass is the amount of matter in an object, measured in kilograms, and it never changes no matter where you go. Weight is the force of gravity pulling on that mass, measured in newtons, and it depends on location. On Earth, weight equals mass times about 9.8 meters per second squared, so a 60 kilogram person weighs about 588 newtons. Take that same person to the Moon and their mass is still 60 kilograms, but their weight drops to about one sixth of the Earth value because the Moon's gravity is weaker. If a test question asks what stays the same in space, the answer is mass."
            },
            {
              "title": "Friction: Static vs Kinetic, Helpful vs Harmful",
              "content": "Friction is the force that resists sliding between two surfaces in contact. Static friction acts on objects that are not yet moving, and it is what you have to overcome to get a heavy box sliding. Kinetic friction acts on objects that are already sliding, and it is almost always weaker than static friction, which is why the box gets easier to push once it starts moving. Friction can be helpful: it lets your boots grip the ground, lets tires steer a truck, and lets brakes stop a vehicle. It can also be harmful, wearing out engine parts and wasting energy as heat, which is why machines use oil, grease, and bearings to reduce it."
            },
            {
              "title": "Gravity and Falling Objects",
              "content": "Gravity pulls every object toward the center of the Earth, and near the surface it accelerates falling objects at about 9.8 meters per second squared. Ignoring air resistance, all objects fall at the same rate, so a heavy wrench and a light bolt dropped together hit the ground at the same time. In the real world, air resistance pushes back against falling objects, which is why a feather drifts down slowly while a rock plummets. A falling object speeds up until air resistance grows large enough to balance its weight; after that it falls at a constant terminal velocity. Remember that gravity acts on an object whether it is falling, sitting on a table, or flying through the air."
            },
            {
              "title": "Work, Energy, and Power",
              "content": "In physics, work has a specific meaning: work equals force times the distance moved in the direction of the force, measured in joules. Holding a heavy pack perfectly still does no work in the physics sense, because nothing moves. Energy is the ability to do work, and it comes in two main mechanical forms: kinetic energy is the energy of motion, and potential energy is stored energy, like a raised weight or a stretched spring. Kinetic energy grows with the square of speed, so doubling an object's speed gives it four times the kinetic energy. Power is how fast work gets done: power equals work divided by time, measured in watts, so a more powerful motor does the same job in less time."
            }
          ],
          "examples": [
            {
              "problem": "A worker pushes a 10 kilogram cart with a force of 50 newtons while friction pushes back with 20 newtons. What is the cart's acceleration?",
              "steps": [
                "Find the net force first. The push and the friction act in opposite directions, so subtract: 50 N minus 20 N equals 30 N of net force in the direction of the push.",
                "Apply Newton's second law, F = m x a, rearranged to a = F divided by m.",
                "Divide the net force by the mass: 30 N divided by 10 kg equals 3 meters per second squared.",
                "The cart accelerates at 3 meters per second squared in the direction the worker is pushing."
              ],
              "tip": "Always find the NET force before using F = m x a. A common trap answer uses the full 50 N push and gets 5 meters per second squared, which ignores friction."
            },
            {
              "problem": "Two soldiers pull on a stalled truck with ropes. One pulls east with 300 newtons and the other pulls west with 300 newtons. What happens to the truck?",
              "steps": [
                "Identify the forces: 300 N east and 300 N west, which are equal in size and opposite in direction.",
                "Combine them to find the net force: 300 N minus 300 N equals 0 N.",
                "A net force of zero means the truck is in equilibrium.",
                "By Newton's first law, an object with zero net force does not change its motion, so the stationary truck stays exactly where it is."
              ],
              "tip": "Balanced forces do not mean no forces are acting; they mean the forces cancel out. Equilibrium can also apply to something already moving at a constant speed in a straight line."
            },
            {
              "problem": "A mechanic lifts a toolbox with a steady force of 40 newtons through a height of 5 meters, and the lift takes 4 seconds. How much work is done, and how much power is used?",
              "steps": [
                "Use the work formula: work equals force times distance.",
                "Multiply: 40 N x 5 m equals 200 joules of work.",
                "Use the power formula: power equals work divided by time.",
                "Divide: 200 joules divided by 4 seconds equals 50 watts of power."
              ],
              "tip": "Keep the two formulas straight: work cares about distance, power cares about time. If two people do the same work but one finishes faster, the faster one used more power, not more work."
            }
          ],
          "summary": "Forces are pushes and pulls, and it is the net force that decides whether an object stays in equilibrium or accelerates according to F = m x a. Mass measures matter and never changes, while weight is gravity's pull and depends on location; friction and gravity are the everyday forces you will see most on the test. Work is force times distance, energy is stored either in motion (kinetic) or position (potential), and power measures how quickly that work gets done."
        },
        "questions": [
          {
            "id": "MC1-001",
            "text": "A crate is pushed to the right with 100 newtons while friction resists with 40 newtons to the left. What is the net force on the crate?",
            "options": [
              {
                "text": "140 newtons to the right",
                "explanation": "This adds the two forces together, but forces in opposite directions subtract rather than add. Adding only works when forces point the same way."
              },
              {
                "text": "60 newtons to the right",
                "explanation": "Correct! Forces in opposite directions subtract: 100 N minus 40 N leaves a net force of 60 N in the direction of the stronger force, which is to the right.",
                "correct": true
              },
              {
                "text": "40 newtons to the left",
                "explanation": "This is just the friction force by itself. The net force must account for the 100 N push as well, and the push is stronger than the friction."
              },
              {
                "text": "0 newtons",
                "explanation": "A net force of zero would require the forces to balance exactly. Here the push (100 N) is much stronger than the friction (40 N), so they do not cancel."
              }
            ]
          },
          {
            "id": "MC1-002",
            "text": "A passenger standing on a bus stumbles forward when the driver brakes suddenly. Which of Newton's laws best explains this?",
            "options": [
              {
                "text": "The second law, because braking creates a large force on the passenger",
                "explanation": "The second law relates force to acceleration, but the stumble happens because the bus decelerates while the passenger's body initially does not. That resistance to change is a first-law idea."
              },
              {
                "text": "The third law, because the passenger pushes back on the bus",
                "explanation": "The third law covers action and reaction pairs, like recoil. It does not explain why the passenger's body keeps moving forward when the bus slows down."
              },
              {
                "text": "The law of gravity, because the passenger's weight pulls them forward",
                "explanation": "Gravity pulls straight down, not forward. The forward stumble comes from the passenger's own motion continuing, not from weight."
              },
              {
                "text": "The first law, because the passenger's body tends to keep moving forward",
                "explanation": "Correct! Newton's first law says a moving object keeps moving unless a force stops it. The brakes stop the bus, but the passenger's body continues forward due to inertia.",
                "correct": true
              }
            ]
          },
          {
            "id": "MC1-003",
            "text": "Using F = m x a, what force is needed to accelerate a 20 kilogram cart at 2 meters per second squared?",
            "options": [
              {
                "text": "40 newtons",
                "explanation": "Correct! Force equals mass times acceleration: 20 kg x 2 meters per second squared equals 40 newtons.",
                "correct": true
              },
              {
                "text": "10 newtons",
                "explanation": "This divides the mass by the acceleration instead of multiplying. Newton's second law multiplies mass by acceleration to get force."
              },
              {
                "text": "22 newtons",
                "explanation": "This adds the mass and acceleration numbers together. The formula calls for multiplication, not addition."
              },
              {
                "text": "80 newtons",
                "explanation": "This doubles the correct answer, as if the acceleration were 4 meters per second squared. Multiply 20 by 2 to get the right force."
              }
            ]
          },
          {
            "id": "MC1-004",
            "text": "An astronaut travels from Earth to the Moon. Which statement is true?",
            "options": [
              {
                "text": "Both her mass and her weight stay the same",
                "explanation": "Weight depends on gravity, and the Moon's gravity is only about one sixth of Earth's, so her weight definitely changes."
              },
              {
                "text": "Her mass decreases but her weight stays the same",
                "explanation": "This is backwards. Mass is the amount of matter in her body and never changes with location; it is weight that varies with gravity."
              },
              {
                "text": "Her mass stays the same but her weight decreases",
                "explanation": "Correct! Mass is constant everywhere, but weight is the pull of gravity on that mass. The Moon's weaker gravity means she weighs about one sixth as much there.",
                "correct": true
              },
              {
                "text": "Both her mass and her weight decrease",
                "explanation": "Her weight does decrease, but her mass does not. No matter where she goes, the amount of matter in her body is unchanged."
              }
            ]
          },
          {
            "id": "MC1-005",
            "text": "Why does a heavy footlocker become easier to push once it starts sliding across the floor?",
            "options": [
              {
                "text": "The footlocker loses weight once it is moving",
                "explanation": "Motion does not change an object's weight. Gravity pulls on the footlocker just as hard whether it is sitting still or sliding."
              },
              {
                "text": "Kinetic friction is usually weaker than static friction",
                "explanation": "Correct! Static friction, which holds a stationary object in place, is almost always stronger than the kinetic friction that acts once the object is sliding, so less push is needed to keep it moving.",
                "correct": true
              },
              {
                "text": "Gravity stops acting on sliding objects",
                "explanation": "Gravity acts on every object all the time, moving or not. The change you feel comes from friction, not from gravity turning off."
              },
              {
                "text": "The floor becomes smoother as the footlocker moves",
                "explanation": "The floor's surface does not change in the moment the box starts sliding. The real reason is the difference between static and kinetic friction."
              }
            ]
          },
          {
            "id": "MC1-006",
            "text": "A wrench and a much lighter bolt are dropped from the same height at the same time, and air resistance is negligible. What happens?",
            "options": [
              {
                "text": "They hit the ground at the same time",
                "explanation": "Correct! Without air resistance, gravity accelerates all objects at the same rate, about 9.8 meters per second squared, so mass does not affect fall time.",
                "correct": true
              },
              {
                "text": "The wrench lands first because it is heavier",
                "explanation": "This feels intuitive, but heavier objects do not fall faster when air resistance is negligible. Gravity gives every object the same acceleration regardless of mass."
              },
              {
                "text": "The bolt lands first because it is lighter",
                "explanation": "Lighter objects have no falling advantage. With air resistance out of the picture, both objects accelerate identically and land together."
              },
              {
                "text": "Neither falls until a force is applied",
                "explanation": "A force is already applied the moment they are released: gravity. Both objects begin accelerating downward immediately."
              }
            ]
          },
          {
            "id": "MC1-007",
            "text": "A soldier drags a sled with a force of 50 newtons across 8 meters of level ground. How much work is done on the sled?",
            "options": [
              {
                "text": "58 joules",
                "explanation": "This adds the force and distance together. Work is force multiplied by distance, not the sum of the two numbers."
              },
              {
                "text": "6.25 joules",
                "explanation": "This divides the force by the distance. The work formula multiplies them: work equals force times distance."
              },
              {
                "text": "800 joules",
                "explanation": "This is double the correct value, as if the distance were 16 meters. Multiply 50 N by 8 m carefully to get the right answer."
              },
              {
                "text": "400 joules",
                "explanation": "Correct! Work equals force times distance: 50 N x 8 m equals 400 joules.",
                "correct": true
              }
            ]
          },
          {
            "id": "MC1-008",
            "text": "A truck doubles its speed from 20 to 40 kilometers per hour. What happens to its kinetic energy?",
            "options": [
              {
                "text": "It doubles",
                "explanation": "This would be true if kinetic energy grew in a straight line with speed, but it grows with the square of speed, so doubling speed does more than double the energy."
              },
              {
                "text": "It stays the same because the mass did not change",
                "explanation": "Kinetic energy depends on both mass and speed. Even with constant mass, a faster truck carries much more energy of motion."
              },
              {
                "text": "It becomes four times as large",
                "explanation": "Correct! Kinetic energy depends on the square of speed. Doubling the speed means 2 x 2, so the kinetic energy becomes four times greater. This is why higher speeds make crashes so much more destructive.",
                "correct": true
              },
              {
                "text": "It becomes half as large",
                "explanation": "Speeding up never reduces kinetic energy. A faster object always has more energy of motion, not less."
              }
            ]
          }
        ],
        "quizConfig": {
          "questionsPerQuiz": 6
        }
      },
      {
        "id": "MC-2",
        "title": "Levers and Simple Machines",
        "description": "Master the six simple machines, the three lever classes, and how to compute mechanical advantage and solve seesaw balance problems - core skills for the Mechanical Comprehension section.",
        "lesson": {
          "intro": "Almost every mechanical device you will ever touch - from a crowbar to a truck jack to a pair of pliers - is built from a handful of basic building blocks called simple machines. The ASVAB loves these because they test whether you can reason about force, not just memorize facts. The good news: once you learn one golden rule (trade distance for force) and one simple formula (mechanical advantage), most of these questions become quick arithmetic. In this chapter you will learn the six simple machines, break down the three classes of levers with examples you already use in daily life, and practice the classic seesaw balance problems that show up on nearly every version of the test.",
          "concepts": [
            {
              "title": "The Six Simple Machines",
              "content": "Engineers group nearly all basic mechanical devices into six simple machines: the lever, the inclined plane, the wedge, the screw, the wheel and axle, and the pulley. Each one does the same fundamental job - it changes the size or direction of a force to make work easier. The key idea is the trade-off: a simple machine can multiply your force, but only by making you apply that force over a longer distance. You never get free work out of a machine. If a ramp lets you push with one quarter of the force, you must push four times as far. That trade-off number is called mechanical advantage (MA). MA equals the load force divided by the effort force, or equivalently the distance the effort moves divided by the distance the load moves. An MA of 3 means the machine multiplies your force by 3."
            },
            {
              "title": "Lever Basics: Effort, Load, and Fulcrum",
              "content": "A lever is a rigid bar that pivots on a fixed point. Every lever problem has three players. The fulcrum is the pivot point the bar rotates around. The load (also called resistance) is the weight or object you are trying to move. The effort is the force you apply. The distance from the fulcrum to where you push is the effort arm, and the distance from the fulcrum to the load is the load arm. Everything about how a lever behaves comes from where these three things sit relative to each other - and that is exactly what defines the three classes of levers."
            },
            {
              "title": "The Three Classes of Levers",
              "content": "Class 1: the fulcrum sits between the effort and the load. Think of a crowbar prying up a crate, a seesaw, or a pair of scissors. Class 1 levers can multiply force (long effort arm, short load arm) and they reverse the direction of motion - push down on one end, the other end goes up. Class 2: the load sits between the fulcrum and the effort. The classic example is a wheelbarrow - the wheel is the fulcrum, the cargo sits in the middle, and you lift the handles at the far end. A bottle opener and a nutcracker work the same way. Class 2 levers always multiply force, because the effort arm is always longer than the load arm. Class 3: the effort sits between the fulcrum and the load. Tweezers, a fishing rod, a broom, and your own forearm are class 3 levers. These never multiply force - you actually apply more force than the load - but in exchange they multiply speed and range of motion. Memory trick: think F-L-E for what is in the middle - Fulcrum (class 1), Load (class 2), Effort (class 3)."
            },
            {
              "title": "Mechanical Advantage from Arm Lengths",
              "content": "For a lever, the ideal mechanical advantage is simply the effort arm divided by the load arm: MA equals effort arm divided by load arm. If you push on a crowbar 6 feet from the fulcrum and the load sits 1 foot from the fulcrum on the other side, MA equals 6 divided by 1, which is 6. That means a 50 pound push can lift a 300 pound load, because 50 x 6 equals 300. To find the effort needed, divide the load by the MA. Notice the trade-off in action: your end of the bar swings through a big arc while the load barely rises. Class 2 levers always have MA greater than 1, class 3 levers always have MA less than 1, and class 1 levers can go either way depending on where the fulcrum sits."
            },
            {
              "title": "Balance and Torque: Seesaw Problems",
              "content": "Torque is the turning effect of a force, and for ASVAB purposes it equals force times distance from the fulcrum. A lever balances when the torque on one side equals the torque on the other side. This gives you the balance equation: weight 1 x distance 1 equals weight 2 x distance 2. Every seesaw problem is this one equation. Example: a 100 pound child sits 6 feet from the center of a seesaw. Where must a 150 pound adult sit to balance? Set 100 x 6 equal to 150 x d. The left side is 600, so d equals 600 divided by 150, which is 4 feet. Heavier riders sit closer to the fulcrum; lighter riders sit farther out. If the torques are unequal, the side with the larger torque rotates downward - some questions ask which way the bar tips, and you answer by comparing the two force-times-distance products."
            },
            {
              "title": "Inclined Plane, Wedge, Screw, and Wheel and Axle",
              "content": "Inclined plane: a ramp. MA equals the length of the slope divided by the vertical height. A 12 foot ramp rising 3 feet has MA equal to 4, so a 400 pound crate can be pushed up with about 100 pounds of force (ignoring friction). Longer, shallower ramps mean easier pushing over a longer distance. Wedge: two inclined planes back to back that move through the material - an axe, a knife, a chisel, a nail. A longer, thinner wedge gives more mechanical advantage. Screw: an inclined plane wrapped in a spiral around a cylinder. The distance between neighboring threads is called the pitch. Finer threads (smaller pitch) give more mechanical advantage but require more turns to advance - the same distance-for-force trade again. Wheel and axle: a large wheel fixed to a smaller shaft so they turn together, like a steering wheel, a doorknob, or a screwdriver handle. MA equals the wheel radius divided by the axle radius. A steering wheel with a 10 inch radius on a 2 inch radius shaft gives MA equal to 5."
            }
          ],
          "examples": [
            {
              "problem": "A 120 pound student sits 4 feet from the fulcrum of a seesaw. How far from the fulcrum must an 80 pound student sit on the other side to balance it?",
              "steps": [
                "Write the balance equation: weight 1 x distance 1 equals weight 2 x distance 2.",
                "Plug in the known side: 120 x 4 equals 480 foot-pounds of torque.",
                "Set the other side equal to it: 80 x d equals 480.",
                "Solve for d: d equals 480 divided by 80, which is 6 feet.",
                "Check that it makes sense: the lighter student sits farther from the fulcrum. 6 feet is farther than 4 feet, so the answer fits."
              ],
              "tip": "On seesaw problems, always compute the known side's torque first (force x distance), then divide by the other force. And sanity-check: lighter always sits farther out."
            },
            {
              "problem": "A worker uses a 9 foot pry bar to lift a heavy rock. The fulcrum is placed 1 foot from the rock, so the worker pushes down 8 feet from the fulcrum. The rock weighs 400 pounds. How much force must the worker apply?",
              "steps": [
                "Identify the arms: the effort arm is 8 feet and the load arm is 1 foot.",
                "Compute the mechanical advantage: MA equals effort arm divided by load arm, so MA equals 8 divided by 1, which is 8.",
                "Find the required effort: effort equals load divided by MA, so effort equals 400 divided by 8, which is 50 pounds.",
                "Confirm with torque balance: 50 x 8 equals 400, and 400 x 1 equals 400. The torques match, so 50 pounds is right."
              ],
              "tip": "Two ways to solve any lever force problem: divide the load by the MA, or set the two torques equal. They always give the same answer - use whichever comes to mind first, and use the other to check."
            },
            {
              "problem": "A mover must load a 300 pound crate onto a truck bed that is 2.5 feet off the ground. He uses a ramp that is 10 feet long. Ignoring friction, how much force does he need to push the crate up the ramp?",
              "steps": [
                "Find the ramp's mechanical advantage: MA equals slope length divided by height, so MA equals 10 divided by 2.5, which is 4.",
                "Divide the load by the MA: effort equals 300 divided by 4, which is 75 pounds.",
                "Notice the trade-off: he pushes with only 75 pounds instead of lifting 300, but he must push the crate along 10 feet of ramp instead of raising it 2.5 feet straight up."
              ],
              "tip": "For inclined planes, the only two numbers that matter for MA are slope length and vertical height. The weight of the object comes in only at the last step, when you divide by the MA."
            }
          ],
          "summary": "Simple machines trade distance for force - that single idea explains everything in this chapter. The six simple machines are the lever, inclined plane, wedge, screw, wheel and axle, and pulley. Levers come in three classes based on what sits in the middle: fulcrum (class 1, like a crowbar or seesaw), load (class 2, like a wheelbarrow - always multiplies force), or effort (class 3, like tweezers - trades force for speed and range). A lever's mechanical advantage is effort arm divided by load arm, and the effort needed is load divided by MA. Balance problems use one equation: weight 1 x distance 1 equals weight 2 x distance 2 - the heavier object always sits closer to the fulcrum. For ramps, MA is slope length divided by height; for wheel and axle, it is wheel radius divided by axle radius; a wedge is two inclined planes back to back; a screw is an inclined plane wrapped around a cylinder. Master the torque equation and the MA formulas and you can solve these problems in seconds."
        },
        "questions": [
          {
            "id": "MC2-001",
            "options": [
              {
                "text": "Wheel and axle",
                "explanation": "The wheel and axle is one of the six simple machines - a large wheel fixed to a smaller shaft, like a doorknob or steering wheel."
              },
              {
                "text": "Spring",
                "correct": true,
                "explanation": "Correct! A spring stores energy but is not one of the six simple machines. The six are the lever, inclined plane, wedge, screw, wheel and axle, and pulley."
              },
              {
                "text": "Screw",
                "explanation": "The screw is one of the six simple machines - it is an inclined plane wrapped in a spiral around a cylinder."
              },
              {
                "text": "Pulley",
                "explanation": "The pulley is one of the six simple machines - it changes the direction of a force and can multiply it when used in combinations."
              }
            ],
            "text": "Which of the following is NOT one of the six simple machines?"
          },
          {
            "id": "MC2-002",
            "options": [
              {
                "text": "Class 3",
                "explanation": "In a class 3 lever the effort is between the fulcrum and the load, like tweezers. A crowbar has the fulcrum in the middle instead."
              },
              {
                "text": "Class 2",
                "explanation": "In a class 2 lever the load sits between the fulcrum and the effort, like a wheelbarrow. A crowbar's fulcrum is in the middle, not its load."
              },
              {
                "text": "Class 1",
                "correct": true,
                "explanation": "Correct! When the fulcrum sits between the effort and the load, it is a class 1 lever. Crowbars, seesaws, and scissors are all class 1."
              },
              {
                "text": "It is not a lever",
                "explanation": "A crowbar is one of the most common examples of a lever - a rigid bar rotating around a fixed pivot point."
              }
            ],
            "text": "A crowbar prying up a crate, with the pivot point between your hands and the crate, is an example of which class of lever?"
          },
          {
            "id": "MC2-003",
            "options": [
              {
                "text": "Class 2 - it always multiplies force",
                "correct": true,
                "explanation": "Correct! With the load between the fulcrum (the wheel) and the effort (the handles), a wheelbarrow is a class 2 lever. The effort arm is always longer than the load arm, so the MA is always greater than 1."
              },
              {
                "text": "Class 1 - it always reverses the direction of motion",
                "explanation": "A class 1 lever has the fulcrum in the middle, like a seesaw. In a wheelbarrow the fulcrum is the wheel at one end, not the middle."
              },
              {
                "text": "Class 3 - it always multiplies speed",
                "explanation": "A class 3 lever has the effort in the middle, like tweezers or a fishing rod. A wheelbarrow's effort is at the end of the handles, not in the middle."
              },
              {
                "text": "Class 2 - it always multiplies distance",
                "explanation": "The class is right, but the benefit is backwards. A class 2 lever multiplies force, not distance - the load moves a shorter distance than your hands do."
              }
            ],
            "text": "In a wheelbarrow, the load sits between the wheel and the handles. What class of lever is this, and what does that guarantee?"
          },
          {
            "id": "MC2-004",
            "options": [
              {
                "text": "16",
                "explanation": "16 would come from multiplying 8 x 2, but mechanical advantage is a ratio, not a product. Divide the effort arm by the load arm instead."
              },
              {
                "text": "10",
                "explanation": "10 is 8 plus 2, but arm lengths are divided, not added, to find mechanical advantage."
              },
              {
                "text": "0.25",
                "explanation": "0.25 comes from dividing the arms in the wrong order (2 divided by 8). The effort arm goes on top: effort arm divided by load arm."
              },
              {
                "text": "4",
                "correct": true,
                "explanation": "Correct! MA equals effort arm divided by load arm: 8 divided by 2 equals 4. This lever multiplies your force by 4."
              }
            ],
            "text": "A lever has an effort arm of 8 feet and a load arm of 2 feet. What is its ideal mechanical advantage?"
          },
          {
            "id": "MC2-005",
            "options": [
              {
                "text": "9 feet",
                "explanation": "9 feet would balance things if the weights were swapped. The heavier child must sit closer to the fulcrum, not farther, so the distance must be less than 6 feet."
              },
              {
                "text": "4 feet",
                "correct": true,
                "explanation": "Correct! Balance requires 60 x 6 equals 90 x d. The left side is 360, so d equals 360 divided by 90, which is 4 feet. The heavier child sits closer to the center."
              },
              {
                "text": "6 feet",
                "explanation": "Equal distances only balance equal weights. Since the second child is heavier, sitting at the same 6 feet would tip the seesaw toward the heavier side."
              },
              {
                "text": "3 feet",
                "explanation": "At 3 feet the heavier child's torque is 90 x 3, which is 270 - less than the lighter child's 360. Solve 90 x d equals 360 to get the right distance."
              }
            ],
            "text": "A 60 pound child sits 6 feet from the center of a seesaw. How far from the center must a 90 pound child sit on the other side to balance it?"
          },
          {
            "id": "MC2-006",
            "options": [
              {
                "text": "125 pounds",
                "explanation": "125 pounds is half the load, which would be right only for an MA of 2. This ramp's MA is slope length divided by height: 10 divided by 2 equals 5."
              },
              {
                "text": "250 pounds",
                "explanation": "250 pounds is the full weight - what it would take to lift the barrel straight up with no ramp at all. The ramp reduces the required force."
              },
              {
                "text": "50 pounds",
                "correct": true,
                "explanation": "Correct! The ramp's MA is 10 divided by 2, which equals 5. Effort equals load divided by MA: 250 divided by 5 equals 50 pounds."
              },
              {
                "text": "25 pounds",
                "explanation": "25 pounds would require an MA of 10, which would need a ramp 20 feet long for a 2 foot rise. This ramp's MA is only 5."
              }
            ],
            "text": "A ramp 10 feet long is used to raise a 250 pound barrel onto a platform 2 feet high. Ignoring friction, how much force is needed to push the barrel up the ramp?"
          },
          {
            "id": "MC2-007",
            "options": [
              {
                "text": "5",
                "correct": true,
                "explanation": "Correct! For a wheel and axle, MA equals wheel radius divided by axle radius: 10 divided by 2 equals 5. Your turning force at the rim is multiplied 5 times at the shaft."
              },
              {
                "text": "20",
                "explanation": "20 is 10 x 2, but mechanical advantage comes from dividing the wheel radius by the axle radius, not multiplying them."
              },
              {
                "text": "8",
                "explanation": "8 is the difference between the radii (10 minus 2), but MA is the ratio of the two radii, not their difference."
              },
              {
                "text": "0.2",
                "explanation": "0.2 is the ratio flipped upside down (2 divided by 10). When effort is applied at the larger wheel, the wheel radius goes on top, giving an MA greater than 1."
              }
            ],
            "text": "A steering wheel has a radius of 10 inches and turns a steering shaft with a radius of 2 inches. What is the mechanical advantage of this wheel and axle?"
          },
          {
            "id": "MC2-008",
            "options": [
              {
                "text": "A lever bent into a circle",
                "explanation": "A lever is a rigid bar rotating around a fulcrum. A screw works by a completely different principle - a sloped surface wound around a shaft."
              },
              {
                "text": "A wedge with a handle",
                "explanation": "A wedge is two inclined planes back to back that split material as they are driven straight in, like an axe. A screw's threads spiral around a cylinder instead."
              },
              {
                "text": "Two pulleys joined together",
                "explanation": "Pulleys use ropes and grooved wheels to redirect and multiply force. Screws have no rope or wheel - they use spiraled threads."
              },
              {
                "text": "An inclined plane wrapped around a cylinder",
                "correct": true,
                "explanation": "Correct! A screw is an inclined plane (the thread) wound in a spiral around a cylinder. Finer threads mean a gentler slope, more mechanical advantage, and more turns to drive it in."
              }
            ],
            "text": "A screw is best described as which simple machine in disguise?"
          }
        ],
        "quizConfig": {
          "questionsPerQuiz": 6
        }
      },
      {
        "id": "MC-3",
        "title": "Pulleys and Mechanical Advantage",
        "description": "Learn how fixed and movable pulleys work, how to count rope strands to find mechanical advantage, and how block and tackle systems let you lift heavy loads with less force.",
        "lesson": {
          "intro": "Pulleys are everywhere in the military: hoisting equipment onto trucks, raising flags, rigging loads on ships, and lifting engines out of vehicles. The ASVAB loves pulley questions because they test one big idea: mechanical advantage, which is how a simple machine multiplies your force. The best part is that pulley problems follow simple, reliable rules. Once you learn to count rope strands, you can solve almost any pulley question on the test in seconds. Let's break it down step by step.",
          "concepts": [
            {
              "title": "The Fixed Pulley: Changing Direction, Not Force",
              "content": "A fixed pulley is attached to something that does not move, like a ceiling beam or a flagpole. The wheel spins, but the pulley itself stays put. A single fixed pulley has a mechanical advantage of 1, which means it does NOT reduce the force you need. If the load weighs 100 pounds, you still pull with 100 pounds of force. So why use one? Direction. A fixed pulley lets you pull DOWN to lift a load UP. Pulling down is easier and safer because you can use your body weight and stand on the ground instead of hauling a rope upward. Think of a flagpole: the pulley at the top does not make the flag lighter, it just lets you raise the flag while standing at the bottom."
            },
            {
              "title": "The Movable Pulley: Cutting the Force in Half",
              "content": "A movable pulley is attached to the load itself, and the pulley moves up with the load as you lift. Here is the key difference: the load now hangs from TWO strands of rope, one on each side of the pulley wheel. Each strand carries half the weight, so you only supply half the force. A single movable pulley has a mechanical advantage of 2. To lift a 100 pound load, you pull with only 50 pounds of force. The trade-off is that you must pull the rope twice as far as the load rises. Nothing is free in mechanics, but spreading the work over a longer pull makes heavy loads manageable."
            },
            {
              "title": "Counting Strands: The Golden Rule of Pulley Problems",
              "content": "Here is the rule that solves most ASVAB pulley questions: the mechanical advantage equals the number of rope strands directly supporting the load or the movable pulley block. Look at the diagram and count every strand of rope that is holding the load up. Do not count a strand that just runs over a fixed pulley and down to your hand as a free end, unless that strand also pulls upward on the movable block. Two supporting strands means a mechanical advantage of 2. Four supporting strands means a mechanical advantage of 4, and you pull with one fourth of the load's weight. When you see a pulley diagram on the test, ignore the clutter, find the load, and count the strands holding it up. That number is your answer to almost everything."
            },
            {
              "title": "Block and Tackle: Stacking Pulleys for Big Lifts",
              "content": "A block and tackle combines fixed and movable pulleys into one system. A block is a frame holding one or more pulley wheels, and the tackle is the rope threaded through them. One block is fixed to a support overhead, the other block is attached to the load and moves with it. Threading the rope back and forth between the blocks creates multiple supporting strands. A block and tackle with 4 supporting strands gives a mechanical advantage of 4: a 400 pound crate needs only 100 pounds of pull. Sailors, riggers, and mechanics have used block and tackle systems for centuries to move loads far heavier than any person could lift alone. The same counting rule applies: strands supporting the load equal the mechanical advantage."
            },
            {
              "title": "The Force-Distance Trade-Off and Efficiency",
              "content": "Mechanical advantage never gives you free work. If a pulley system has a mechanical advantage of 4, you use one fourth of the force, but you must pull 4 times as much rope. To lift a load 2 feet with that system, you pull 8 feet of rope through your hands. Force goes down, distance goes up, and the total work stays the same. That is the trade-off in every simple machine. In the real world, there is one more factor: friction. Rope rubbing over pulley wheels and axles wastes some of your effort as heat, so the actual mechanical advantage is always a little less than the ideal number you get from counting strands. Efficiency measures this: a system that is 80 percent efficient delivers only 80 percent of your effort to the load, so you must pull somewhat harder than the ideal calculation says. More pulleys mean more lifting power, but also more friction. On the ASVAB, assume the ideal numbers unless the question mentions friction or efficiency."
            }
          ],
          "examples": [
            {
              "problem": "A block and tackle diagram shows a crate hanging from a movable block. Four strands of rope support the movable block, and the free end of the rope comes off a fixed pulley to the worker's hands. The crate weighs 200 pounds. How much force must the worker pull with, and how much rope must be pulled to raise the crate 3 feet?",
              "steps": [
                "Count the strands supporting the load: the diagram shows 4 strands holding up the movable block, so the mechanical advantage is 4.",
                "Find the force: divide the load by the mechanical advantage. 200 pounds divided by 4 equals 50 pounds of pull.",
                "Find the rope distance: multiply the lift height by the mechanical advantage. 3 feet x 4 equals 12 feet of rope pulled.",
                "Check the trade-off: 50 pounds x 12 feet equals 600 foot-pounds of work in, and 200 pounds x 3 feet equals 600 foot-pounds of work out. They match, so the answer makes sense."
              ],
              "tip": "Always check your answer with the work equation: force in x distance in should equal load x lift height in an ideal system. If the two sides do not match, recount your strands."
            },
            {
              "problem": "A mechanic uses a single movable pulley to lift a 300 pound engine out of a vehicle. How much force is needed, and how far must the rope be pulled to raise the engine 2 feet?",
              "steps": [
                "Identify the pulley type: a single movable pulley attached to the load has 2 supporting strands, so the mechanical advantage is 2.",
                "Find the force: 300 pounds divided by 2 equals 150 pounds of pull.",
                "Find the rope distance: 2 feet of lift x 2 equals 4 feet of rope pulled.",
                "Sanity check: 150 pounds is still a hard pull for one person, which is why real engine hoists use more pulleys or a chain fall for a bigger mechanical advantage."
              ],
              "tip": "A single movable pulley always cuts the force in half and doubles the rope distance. Memorize that pair: half the force, twice the pull."
            },
            {
              "problem": "A hoisting rig has an ideal mechanical advantage of 4, but friction in the pulleys makes it only 80 percent efficient. How much force is actually needed to lift a 320 pound load?",
              "steps": [
                "Start with the ideal force: 320 pounds divided by 4 equals 80 pounds if the system were perfect.",
                "Account for friction: at 80 percent efficiency, only 80 percent of your pull reaches the load, so you must pull harder than the ideal 80 pounds.",
                "Divide the ideal force by the efficiency: 80 pounds divided by 0.80 equals 100 pounds of actual pull.",
                "Interpret the result: friction costs the worker an extra 20 pounds of effort. The actual mechanical advantage is 320 divided by 100, which is 3.2 instead of the ideal 4."
              ],
              "tip": "Friction always makes real force HIGHER than the ideal calculation. If an efficiency answer comes out easier than the ideal number, you divided in the wrong direction."
            }
          ],
          "summary": "A fixed pulley changes the direction of your pull but not the force, with a mechanical advantage of 1. A movable pulley rides on the load and gives a mechanical advantage of 2. For any pulley system, count the rope strands supporting the load: that count is the mechanical advantage. Divide the load weight by the mechanical advantage to get the required force, and multiply the lift height by the mechanical advantage to get the rope distance you must pull. That force-distance trade-off means total work stays the same. Friction reduces real-world performance, so actual mechanical advantage is always a bit less than the ideal strand count. Master strand counting and the trade-off rule, and pulley questions become some of the easiest points on the test."
        },
        "questions": [
          {
            "id": "MC3-001",
            "options": [
              {
                "text": "2",
                "explanation": "A mechanical advantage of 2 comes from a single MOVABLE pulley, where two strands support the load. A fixed pulley does not multiply force at all."
              },
              {
                "text": "1",
                "correct": true,
                "explanation": "Correct! A fixed pulley only changes the direction of your pull, it does not reduce the force needed. Its mechanical advantage is 1: a 100 pound load still takes 100 pounds of pull."
              },
              {
                "text": "0",
                "explanation": "A mechanical advantage of 0 would mean the machine transmits no force at all, which no working pulley does. Even a fixed pulley passes your full pull through to the load."
              },
              {
                "text": "It depends on the rope length",
                "explanation": "Rope length has no effect on mechanical advantage. Mechanical advantage depends on how many strands support the load, not on how long the rope is."
              }
            ],
            "text": "What is the mechanical advantage of a single fixed pulley, like the one at the top of a flagpole?"
          },
          {
            "id": "MC3-002",
            "options": [
              {
                "text": "100 pounds",
                "explanation": "That would be true for a fixed pulley, which has a mechanical advantage of 1. A movable pulley is supported by two strands, so the force is cut in half."
              },
              {
                "text": "200 pounds",
                "explanation": "A pulley never makes a load HARDER to lift. Doubling the force would mean a mechanical advantage below 1, which is not how a movable pulley works."
              },
              {
                "text": "50 pounds",
                "correct": true,
                "explanation": "Correct! A single movable pulley has two supporting strands, giving a mechanical advantage of 2. Divide the load by 2: 100 pounds divided by 2 equals 50 pounds of pull."
              },
              {
                "text": "25 pounds",
                "explanation": "25 pounds would require a mechanical advantage of 4, which takes four supporting strands. A single movable pulley has only two strands, so it gives a mechanical advantage of 2."
              }
            ],
            "text": "A single movable pulley is attached to a 100 pound load. Ignoring friction, how much force is needed to lift it?"
          },
          {
            "id": "MC3-003",
            "options": [
              {
                "text": "3",
                "correct": true,
                "explanation": "Correct! The golden rule: mechanical advantage equals the number of strands supporting the load. Three supporting strands means a mechanical advantage of 3, so you pull with one third of the load's weight."
              },
              {
                "text": "2",
                "explanation": "This undercounts the strands. Every strand pulling up on the movable block shares the load, and the problem states there are three of them, not two."
              },
              {
                "text": "6",
                "explanation": "There is no doubling step in the strand rule. Mechanical advantage equals the strand count itself, so three strands gives 3, not 6."
              },
              {
                "text": "1.5",
                "explanation": "Mechanical advantage from strand counting is simply the number of supporting strands, which is a whole number here. Three strands gives a mechanical advantage of 3."
              }
            ],
            "text": "In a pulley diagram, three strands of rope directly support the movable block holding the load. What is the ideal mechanical advantage of the system?"
          },
          {
            "id": "MC3-004",
            "options": [
              {
                "text": "400 pounds",
                "explanation": "That is the full weight of the crate with no help from the pulleys. The whole point of a mechanical advantage of 4 is to reduce the needed force to one fourth of the load."
              },
              {
                "text": "1600 pounds",
                "explanation": "This multiplies instead of divides. Mechanical advantage reduces the force you supply: divide the load by the mechanical advantage, do not multiply."
              },
              {
                "text": "200 pounds",
                "explanation": "200 pounds would be the answer for a mechanical advantage of 2. With a mechanical advantage of 4, the force drops to one fourth of the load, not one half."
              },
              {
                "text": "100 pounds",
                "correct": true,
                "explanation": "Correct! Force equals load divided by mechanical advantage: 400 pounds divided by 4 equals 100 pounds. Each of the four supporting strands carries 100 pounds of the load."
              }
            ],
            "text": "A block and tackle with a mechanical advantage of 4 is used to hoist a 400 pound crate. Ignoring friction, how much pulling force is required?"
          },
          {
            "id": "MC3-005",
            "options": [
              {
                "text": "2 feet",
                "explanation": "Pulling the same distance as the lift only happens when the mechanical advantage is 1. With a mechanical advantage of 5, you trade extra rope distance for reduced force."
              },
              {
                "text": "10 feet",
                "correct": true,
                "explanation": "Correct! Rope pulled equals lift height x mechanical advantage: 2 feet x 5 equals 10 feet. You use one fifth the force but pull five times the distance, so total work stays the same."
              },
              {
                "text": "5 feet",
                "explanation": "5 feet is just the mechanical advantage number with the wrong units. Multiply the lift height of 2 feet by the mechanical advantage of 5 to get the rope distance."
              },
              {
                "text": "0.4 feet",
                "explanation": "This divides the lift by the mechanical advantage, which goes the wrong way. Higher mechanical advantage means MORE rope pulled, never less than the lift height."
              }
            ],
            "text": "A pulley system has a mechanical advantage of 5. To raise a load 2 feet, how much rope must be pulled through the system?"
          },
          {
            "id": "MC3-006",
            "options": [
              {
                "text": "It changes the direction of the pull, letting you pull down to lift a load up",
                "correct": true,
                "explanation": "Correct! A fixed pulley redirects your effort. Pulling downward lets you use your body weight and stand safely on the ground, which is why flagpoles and simple hoists use one."
              },
              {
                "text": "It doubles the speed of the load",
                "explanation": "With a fixed pulley the load moves exactly as fast as you pull the rope, no faster. Speed doubling is not a property of any single pulley."
              },
              {
                "text": "It cuts the required force in half",
                "explanation": "Cutting the force in half is what a MOVABLE pulley does, because two strands support the load. A fixed pulley has a mechanical advantage of 1 and does not reduce force."
              },
              {
                "text": "It eliminates friction from the system",
                "explanation": "Every pulley adds a little friction at its wheel and axle rather than removing it. Friction is a loss in all real pulley systems, fixed or movable."
              }
            ],
            "text": "A single fixed pulley does not reduce the force needed to lift a load. What is its main practical benefit?"
          },
          {
            "id": "MC3-007",
            "options": [
              {
                "text": "The actual value is higher, because friction grips the rope and helps lift",
                "explanation": "Friction works against you in a hoisting system, wasting effort as heat at the wheels and axles. It never adds lifting help, so it cannot raise the mechanical advantage."
              },
              {
                "text": "They are always exactly equal",
                "explanation": "Ideal and actual values match only in a frictionless system, which does not exist in the real world. Real pulleys always lose some effort to friction."
              },
              {
                "text": "The actual value is lower, because friction wastes some of the applied effort",
                "correct": true,
                "explanation": "Correct! Rope rubbing over wheels and axles turns part of your pull into heat, so the load receives less than your full effort. Actual mechanical advantage is always somewhat below the ideal strand count."
              },
              {
                "text": "Friction only affects fixed pulleys, not movable ones",
                "explanation": "Every turning wheel and every rope bend adds friction, whether the pulley is fixed or movable. In fact, more pulleys of any type mean more total friction loss."
              }
            ],
            "text": "Because of friction in the pulley wheels, how does the actual mechanical advantage of a real block and tackle compare to its ideal mechanical advantage?"
          },
          {
            "id": "MC3-008",
            "options": [
              {
                "text": "600 pounds",
                "explanation": "That ignores the pulley system entirely. With 6 supporting strands, the load is shared 6 ways, so the crew supplies only a fraction of the full weight."
              },
              {
                "text": "300 pounds",
                "explanation": "300 pounds would match a mechanical advantage of 2. Here the mechanical advantage is 6, one for each supporting strand, so divide 600 by 6, not by 2."
              },
              {
                "text": "60 pounds",
                "explanation": "This divides by 10 instead of by the strand count. The mechanical advantage equals the 6 supporting strands, and 600 divided by 6 is not 60."
              },
              {
                "text": "100 pounds",
                "correct": true,
                "explanation": "Correct! Six supporting strands give a mechanical advantage of 6. Force equals 600 pounds divided by 6, which is 100 pounds. The trade-off: they pull 6 feet of rope for every 1 foot the generator rises."
              }
            ],
            "text": "A rigging crew uses a block and tackle with 6 rope strands supporting the movable block to hoist a 600 pound generator. Ignoring friction, how hard must they pull?"
          }
        ],
        "quizConfig": {
          "questionsPerQuiz": 6
        }
      },
      {
        "id": "MC-4",
        "title": "Gears, Wheels, and Torque",
        "description": "Learn how gears, pulleys, chains, and levers trade speed for turning force. Master gear ratios, gear trains, belts, worm gears, cams, and torque so you can answer any rotation question on test day.",
        "lesson": {
          "intro": "Almost every machine that spins uses gears, belts, or chains to move power from one shaft to another. The ASVAB loves these questions because they all come down to a few simple rules: count the teeth, compare the sizes, and remember that speed and torque always trade places. Once you know those rules, you can solve gear problems in seconds. Let's break it down.",
          "concepts": [
            {
              "title": "Meshed Gears Reverse Direction",
              "content": "When two gears mesh directly, their teeth interlock like fingers. As the first gear (the driver) turns clockwise, it pushes the second gear (the driven gear) counterclockwise. Every direct mesh flips the direction of rotation. So in a row of meshed gears, the direction alternates: gear 1 clockwise, gear 2 counterclockwise, gear 3 clockwise, and so on. Quick rule: with an odd number of gears in a straight line, the first and last gears turn the same direction; with an even number, they turn opposite directions. On the test, trace the rotation gear by gear and you will never get lost."
            },
            {
              "title": "Gear Ratio from Tooth Counts",
              "content": "The gear ratio compares the driven gear to the driver gear. Ratio equals teeth on the driven gear divided by teeth on the driver gear. If a 10-tooth gear drives a 30-tooth gear, the ratio is 30 divided by 10, which is 3 to 1. That means the driver must turn 3 full times to spin the driven gear once. Speed works in reverse of tooth count: the gear with more teeth always turns slower. To find output speed, multiply the driver speed by the driver teeth, then divide by the driven teeth. Teeth in equals teeth out - the number of teeth passing the mesh point is the same for both gears every second."
            },
            {
              "title": "The Speed-Torque Trade-Off",
              "content": "Gears never give you something for free. When a small gear drives a big gear, the big gear turns slower but with more torque (turning force). When a big gear drives a small gear, the small gear spins faster but with less torque. Whatever factor you lose in speed, you gain in torque, and vice versa. A 3 to 1 reduction gives one third the speed and three times the torque. This is exactly like the gears on a bicycle or a truck: low gear equals slow and strong for climbing hills, high gear equals fast and weak for cruising on flat ground."
            },
            {
              "title": "Idler Gears and Gear Trains",
              "content": "An idler gear sits between the driver and the driven gear. Here is the key fact the ASVAB tests: an idler changes only the direction of the final gear - it has no effect on the overall gear ratio, no matter how many teeth it has. The ratio still depends only on the first and last gears. A gear train is a series of gears working together. In a compound gear train, two gears share the same shaft, so they turn at the same speed. To find the total ratio of a compound train, multiply the ratios of each stage together. Compound trains let machines multiply torque enormously in a small space."
            },
            {
              "title": "Belts, Pulleys, Sprockets, and Chains",
              "content": "Belts and pulleys work like gears, but you compare diameters instead of teeth. A small pulley driving a large pulley slows the output and boosts torque, just like gears. Output speed equals driver speed times driver diameter divided by driven diameter. One big difference: two pulleys connected by an open belt turn in the SAME direction, because there is no meshing to flip the rotation. To reverse the direction, you cross the belt into a figure-eight shape - a crossed belt makes the pulleys turn in opposite directions. Sprockets and chains (like on a bicycle) behave like a belt drive that cannot slip: both sprockets turn the same direction, and the speed ratio comes from the tooth counts, just like gears."
            },
            {
              "title": "Worm Gears, Cams, and Cranks",
              "content": "A worm gear is a screw-shaped shaft (the worm) meshed with a toothed wheel. Each full turn of the worm advances the wheel by just one tooth, so a worm meshed with a 40-tooth wheel gives a 40 to 1 reduction - huge torque, very slow output. Bonus: most worm drives self-lock, meaning the wheel cannot drive the worm backward, which is why they are used in hoists and guitar tuners. A cam is an egg-shaped or lobed wheel that converts rotary motion into up-and-down (reciprocating) motion - think of the camshaft opening valves in an engine. A crank does the opposite job in an engine: the crankshaft turns the up-and-down motion of the pistons into rotation."
            },
            {
              "title": "Torque Equals Force Times Lever Arm",
              "content": "Torque is twisting force, and the formula is simple: torque equals force times the distance from the pivot (the lever arm). Push with 50 pounds on a wrench 1 foot long and you get 50 pound-feet of torque. Use a 2-foot wrench with the same 50 pounds and you get 100 pound-feet - double the twist for the same effort. That is why mechanics slip a pipe (a cheater bar) over a wrench handle to break loose a stuck bolt: the longer arm multiplies the torque. It is also why door handles sit far from the hinges and why steering wheels are wide. More distance from the pivot means more torque from the same push."
            }
          ],
          "examples": [
            {
              "problem": "A 12-tooth gear turning at 90 rpm drives a 36-tooth gear. How fast does the 36-tooth gear turn, and what happens to the torque?",
              "steps": [
                "Find the gear ratio: driven teeth divided by driver teeth equals 36 divided by 12, which is 3. The ratio is 3 to 1.",
                "The bigger gear turns slower by that factor. Output speed equals 90 rpm divided by 3, which is 30 rpm.",
                "Check with teeth per minute: the driver passes 12 x 90 = 1080 teeth per minute, and 1080 divided by 36 teeth equals 30 rpm. It matches.",
                "Torque trades the other way: the 36-tooth gear delivers about 3 times the torque of the driver.",
                "Direction: the two gears mesh directly, so the driven gear turns the opposite way from the driver."
              ],
              "tip": "Speed and tooth count are always opposites: more teeth means slower rotation but more torque."
            },
            {
              "problem": "In a compound gear train, gear A (12 teeth) drives gear B (24 teeth). Gear C (10 teeth) is on the same shaft as gear B and drives gear D (30 teeth). If gear A turns at 600 rpm, how fast does gear D turn?",
              "steps": [
                "Stage 1: A drives B. Ratio equals 24 divided by 12, which is 2. Gear B turns at 600 divided by 2, which is 300 rpm.",
                "Gears B and C share one shaft, so gear C also turns at 300 rpm.",
                "Stage 2: C drives D. Ratio equals 30 divided by 10, which is 3. Gear D turns at 300 divided by 3, which is 100 rpm.",
                "Total reduction: multiply the stage ratios, 2 x 3 = 6. Check: 600 rpm divided by 6 equals 100 rpm. It matches.",
                "The output shaft is 6 times slower but delivers roughly 6 times the torque of the input."
              ],
              "tip": "In compound trains, multiply the stage ratios together. Gears on the same shaft always spin at the same speed."
            },
            {
              "problem": "A motor pulley 4 inches in diameter spins at 500 rpm and drives a 10-inch pulley with an open belt. How fast does the big pulley turn, and which direction?",
              "steps": [
                "For pulleys, use diameters the way you use teeth for gears. Output speed equals driver speed times driver diameter divided by driven diameter.",
                "Multiply: 500 rpm x 4 inches = 2000. Divide by the driven diameter: 2000 divided by 10 equals 200 rpm.",
                "Sanity check: the driven pulley is 2.5 times bigger (10 divided by 4), so it should turn 2.5 times slower. 500 divided by 2.5 equals 200 rpm. It matches.",
                "Direction: an open belt does not flip rotation, so both pulleys turn the same direction. Only a crossed belt would reverse it."
              ],
              "tip": "Belt-driven pulleys turn the same way unless the belt is crossed. Meshed gears always turn opposite ways."
            }
          ],
          "summary": "Meshed gears reverse direction at every mesh; belts and chains keep the same direction unless the belt is crossed. Gear ratio equals driven teeth divided by driver teeth, and the gear with more teeth turns slower but with more torque - speed and torque always trade places. Idlers change direction only, never the ratio. Compound gear trains multiply their stage ratios, worm gears give big reductions and self-lock, cams turn rotation into up-and-down motion, and cranks do the reverse. Torque equals force times lever arm, which is why a longer wrench loosens a stubborn bolt with the same push. Learn these rules and rotation questions become free points."
        },
        "questions": [
          {
            "id": "MC4-001",
            "options": [
              {
                "text": "Clockwise, the same as the driver",
                "explanation": "Meshed teeth push against each other, so a direct mesh always flips the rotation. Same-direction rotation happens with belts or chains, not meshed gears."
              },
              {
                "text": "Counterclockwise, opposite the driver",
                "explanation": "Correct! Every direct gear mesh reverses direction. The driver's teeth push the driven gear's teeth the opposite way, so clockwise in means counterclockwise out.",
                "correct": true
              },
              {
                "text": "It depends on which gear has more teeth",
                "explanation": "Tooth count sets the speed and torque ratio, not the direction. Any two directly meshed gears turn opposite ways regardless of size."
              },
              {
                "text": "The driven gear does not turn at all",
                "explanation": "Meshed gears transmit motion; if the driver turns, the driven gear must turn too. A locked driven gear would stop the whole train."
              }
            ],
            "text": "Two gears are meshed together. If the driver gear turns clockwise, which way does the driven gear turn?"
          },
          {
            "id": "MC4-002",
            "options": [
              {
                "text": "Three times faster, with less torque",
                "explanation": "This reverses the relationship. The larger gear cannot spin faster than the small gear driving it - the same number of teeth must pass the mesh point on both gears."
              },
              {
                "text": "At the same speed, with the same torque",
                "explanation": "Equal speed only happens when both gears have the same number of teeth. Here the tooth counts differ by a factor of three, so speed must change."
              },
              {
                "text": "Three times faster, with more torque",
                "explanation": "Gears never increase both speed and torque at once - that would create energy from nothing. One always trades for the other."
              },
              {
                "text": "One third the speed, with about three times the torque",
                "explanation": "Correct! The ratio is 24 divided by 8, which is 3 to 1. The bigger gear turns one third as fast, and the lost speed comes back as roughly triple the torque.",
                "correct": true
              }
            ],
            "text": "An 8-tooth gear drives a 24-tooth gear. Compared with the driver, the 24-tooth gear turns:"
          },
          {
            "id": "MC4-003",
            "options": [
              {
                "text": "Only the direction of the final gear, not the gear ratio",
                "explanation": "Correct! An idler flips the rotation of the last gear but has zero effect on the ratio. Speed and torque still depend only on the first and last gears.",
                "correct": true
              },
              {
                "text": "It doubles the gear ratio",
                "explanation": "An idler's tooth count cancels out of the math - it receives and passes along the same tooth-per-second rate, so the overall ratio is unchanged."
              },
              {
                "text": "It increases the torque of the output gear",
                "explanation": "Torque changes come from the ratio between the first and last gears. Since an idler leaves that ratio alone, it adds no torque."
              },
              {
                "text": "It reduces the speed of the output gear by half",
                "explanation": "The idler does not slow the output at all. Whatever speed the driver would have given the driven gear directly, the idler passes along unchanged."
              }
            ],
            "text": "An idler gear is placed between a driver gear and a driven gear. What does the idler change?"
          },
          {
            "id": "MC4-004",
            "options": [
              {
                "text": "25 pound-feet",
                "explanation": "This divides force by distance. Torque multiplies them: a longer handle gives more twist, not less."
              },
              {
                "text": "52 pound-feet",
                "explanation": "This adds force and distance. Torque is force times lever arm, not force plus lever arm."
              },
              {
                "text": "100 pound-feet",
                "explanation": "Correct! Torque equals force times lever arm: 50 pounds x 2 feet = 100 pound-feet. Slipping a cheater bar over the handle to double the length would double it again to 200.",
                "correct": true
              },
              {
                "text": "50 pound-feet",
                "explanation": "That would be true with a 1-foot handle. Here the lever arm is 2 feet, so the same push produces twice as much torque."
              }
            ],
            "text": "A mechanic pushes with 50 pounds of force on a wrench handle 2 feet from the bolt. How much torque is applied to the bolt?"
          },
          {
            "id": "MC4-005",
            "options": [
              {
                "text": "When the driven pulley is larger than the driver",
                "explanation": "Pulley size changes speed and torque, not direction. Big or small, an open belt still carries both pulleys the same way."
              },
              {
                "text": "When the belt is crossed in a figure-eight",
                "explanation": "Correct! An open belt turns both pulleys the same direction. Crossing the belt reverses the driven pulley, making the two turn opposite ways.",
                "correct": true
              },
              {
                "text": "Always - belt-driven pulleys turn opposite ways",
                "explanation": "That rule belongs to meshed gears. Belts have no interlocking teeth to flip the rotation, so an ordinary open belt keeps both pulleys turning the same way."
              },
              {
                "text": "When the driver pulley spins very fast",
                "explanation": "Speed has nothing to do with direction. A faster driver just makes the driven pulley spin faster in the same direction as before."
              }
            ],
            "text": "Two pulleys are connected by a belt. Under which condition do the pulleys turn in OPPOSITE directions?"
          },
          {
            "id": "MC4-006",
            "options": [
              {
                "text": "1 turn; the worm spins freely in both directions",
                "explanation": "One turn of the worm advances the wheel only one tooth, not one full revolution. This answer misses the huge reduction that makes worm gears useful."
              },
              {
                "text": "20 turns; the drive doubles the speed",
                "explanation": "Each worm turn moves one tooth, and the wheel has 40 teeth, so 20 turns covers only half a revolution. Worm drives also reduce speed sharply - they never double it."
              },
              {
                "text": "4 turns; the wheel can drive the worm backward easily",
                "explanation": "The count is off by a factor of ten, and the load typically cannot back-drive a worm - that locking behavior is the opposite of what this option claims."
              },
              {
                "text": "40 turns; the drive usually self-locks so the wheel cannot drive the worm backward",
                "explanation": "Correct! Each worm revolution advances the wheel one tooth, so a 40-tooth wheel needs 40 turns - a 40 to 1 reduction with big torque. Most worm drives self-lock, which is why hoists and guitar tuners use them.",
                "correct": true
              }
            ],
            "text": "A worm (screw gear) meshes with a 40-tooth worm wheel. How many turns of the worm are needed to rotate the wheel once, and what is a common bonus feature of worm drives?"
          },
          {
            "id": "MC4-007",
            "options": [
              {
                "text": "3 times, in the same direction as the front sprocket",
                "explanation": "Correct! The ratio is 48 divided by 16, which is 3, so the small rear sprocket spins 3 times per pedal turn. A chain works like a belt, so both sprockets turn the same direction.",
                "correct": true
              },
              {
                "text": "3 times, in the opposite direction",
                "explanation": "The speed ratio of 3 is right, but a chain does not reverse rotation the way meshed gears do. Both sprockets turn the same way."
              },
              {
                "text": "One third of a turn, in the same direction",
                "explanation": "This flips the ratio. The rear sprocket is the smaller one, so it must turn faster than the pedals, not slower."
              },
              {
                "text": "48 times, in the same direction",
                "explanation": "This uses the tooth count itself instead of the ratio. Divide 48 by 16 to compare the sprockets: the rear turns 3 times per pedal revolution, not 48."
              }
            ],
            "text": "A bicycle has a 48-tooth front sprocket connected by a chain to a 16-tooth rear sprocket. For each full turn of the pedals, the rear sprocket turns:"
          },
          {
            "id": "MC4-008",
            "options": [
              {
                "text": "The crankshaft",
                "explanation": "The crankshaft does the reverse job: it converts the up-and-down motion of the pistons into rotation that ultimately turns the wheels."
              },
              {
                "text": "An idler gear",
                "explanation": "An idler only passes rotation along and flips its direction. It cannot turn spinning motion into up-and-down motion."
              },
              {
                "text": "The camshaft, using egg-shaped cam lobes",
                "explanation": "Correct! A cam is a lobed wheel that changes rotary motion into reciprocating (up-and-down) motion. As each cam lobe rotates, its high spot pushes the valve open once per turn.",
                "correct": true
              },
              {
                "text": "A crossed belt",
                "explanation": "A crossed belt reverses the direction of a driven pulley, but the motion is still rotation. It never produces up-and-down movement."
              }
            ],
            "text": "In a gasoline engine, which part converts rotary motion into the up-and-down motion that opens the valves?"
          }
        ],
        "quizConfig": {
          "questionsPerQuiz": 6
        }
      },
      {
        "id": "MC-5",
        "title": "Fluids and Hydraulics",
        "description": "Learn how liquids and gases transmit force: pressure, Pascal's principle, hydraulic jacks and brakes, water pressure at depth, buoyancy, flow through pipes, and the pumps and valves that make fluid systems work.",
        "lesson": {
          "intro": "Ever wonder how a small hand pump can lift a 3-ton truck, or why pressing a brake pedal with one foot can stop a vehicle moving at highway speed? The answer is fluid power. Liquids and gases can carry force from one place to another and even multiply it along the way. The military runs on fluid power - hydraulic lifts, brake systems, aircraft landing gear, and fuel pumps all use the ideas in this chapter. The good news: it all comes down to one simple formula, pressure equals force divided by area, plus a few common-sense rules. Master those and the ASVAB fluid questions become easy points.",
          "concepts": [
            {
              "title": "Pressure = Force / Area",
              "content": "Pressure is how concentrated a force is. The formula is P = F / A, where force is in pounds and area is in square inches, giving pressure in pounds per square inch (psi). The same force feels very different depending on the area it acts on. Push a thumbtack with 10 pounds of force and the tiny point creates enormous pressure - it sinks into the wall. Push a book against the wall with the same 10 pounds and nothing happens, because the force spreads over a large area. Two rearranged versions of the formula are just as useful: F = P x A (force equals pressure times area) and A = F / P. On the ASVAB, always check whether the question asks for pressure, force, or area, then pick the right version. Bigger area with the same force means lower pressure; smaller area with the same force means higher pressure."
            },
            {
              "title": "Pascal's Principle: Pressure Travels Everywhere Equally",
              "content": "Pascal's principle says that pressure applied to an enclosed fluid is transmitted equally and undiminished to every part of the fluid and to the walls of the container. Squeeze a sealed water bottle in the middle and the pressure rises at the top, the bottom, and everywhere in between - all at the same time and by the same amount. This works because liquids are practically incompressible: you cannot squeeze water into a smaller volume, so any push you give it has to go somewhere. This one rule is the foundation of every hydraulic system. It means the pressure at the small input piston equals the pressure at the large output piston, and that fact is what lets hydraulics multiply force."
            },
            {
              "title": "Hydraulic Systems Multiply Force",
              "content": "A hydraulic system connects a small piston to a large piston through a sealed fluid line. Because pressure is the same everywhere in the fluid (Pascal's principle), the force at each piston equals that shared pressure times the piston's area. A larger piston therefore produces a larger force. Here is the three-step method: first, find the pressure from the input side (P = input force / input area). Second, that same pressure acts on the output piston. Third, multiply pressure by the output area to get the output force (F = P x A). The force multiplies by the ratio of the areas. A hydraulic jack uses this to lift vehicles, and car brakes use it to turn light pedal pressure into strong clamping force at the wheels. But there is no free lunch - just like levers, hydraulics trade distance for force. If the large piston has 10 times the area, it pushes with 10 times the force but moves only one tenth as far. That is why you pump a jack handle many times to raise a car a few inches."
            },
            {
              "title": "Water Pressure, Depth, and Buoyancy",
              "content": "In any liquid, pressure increases with depth because the deeper you go, the more liquid is stacked above you, pressing down. In fresh water, pressure rises about 0.433 psi for every foot of depth - roughly 1 psi for every 2.3 feet. Only depth matters, not the width or shape of the container: a narrow 10-foot pipe full of water has the same pressure at the bottom as a 10-foot-deep lake. This depth pressure also explains buoyancy. Water pushes harder on the bottom of a submerged object than on its top (the bottom is deeper), so there is a net upward push called the buoyant force. Archimedes' principle says the buoyant force equals the weight of the fluid the object displaces. If an object weighs less than the water it pushes aside - meaning it is less dense than water - it floats. If it weighs more, it sinks. That is why a steel ship floats: its hollow hull can push aside a volume of water that would outweigh the ship, so its average density is less than water and it settles only until the displaced water weighs exactly as much as the ship."
            },
            {
              "title": "Flow, Pneumatics, Pumps, and Valves",
              "content": "When fluid flows through a pipe, the same amount must pass every point each second. So when a pipe narrows, the fluid must speed up to squeeze the same flow through the smaller opening - narrower means faster. That is why putting your thumb over a garden hose makes the water jet out. Pneumatic systems work like hydraulics but use compressed air or gas instead of liquid. Air is compressible, so pneumatics are springy and less precise, but they are lighter, cleaner, and safe if a line leaks - think air tools, air brakes on trucks, and tire inflators. Hydraulic fluid does not compress, so hydraulics deliver stronger, stiffer, more exact force - think jacks, excavators, and aircraft controls. Pumps put fluid in motion and build pressure; valves control the fluid. A check valve allows flow in one direction only, a relief valve opens automatically to release dangerous excess pressure, and a shutoff valve simply starts or stops flow."
            }
          ],
          "examples": [
            {
              "problem": "A hydraulic jack has a small input piston with an area of 2 square inches and a large output piston with an area of 20 square inches. You push down on the small piston with 50 pounds of force. How much force does the large piston produce?",
              "steps": [
                "Step 1: Find the pressure created at the input piston. P = F / A = 50 pounds / 2 in2 = 25 psi.",
                "Step 2: Apply Pascal's principle - that same 25 psi acts on every part of the fluid, including the large piston.",
                "Step 3: Find the output force. F = P x A = 25 psi x 20 in2 = 500 pounds.",
                "Check with the area ratio: the output piston is 20 / 2 = 10 times larger, so the force is multiplied by 10. 50 x 10 = 500 pounds. It matches."
              ],
              "tip": "Shortcut: output force = input force x (output area / input area). But remember the trade-off - to lift the load 1 inch, the small piston must travel 10 inches."
            },
            {
              "problem": "In a car's brake system, your foot pushes the master cylinder piston (area 1 square inch) with 100 pounds of force. Each wheel cylinder piston has an area of 4 square inches. How much force does each wheel cylinder apply to the brakes?",
              "steps": [
                "Step 1: Find the system pressure from the input side. P = F / A = 100 pounds / 1 in2 = 100 psi.",
                "Step 2: Pascal's principle sends that 100 psi through the brake fluid to every wheel cylinder equally - that is why all four brakes engage at the same time.",
                "Step 3: Find the force at each wheel. F = P x A = 100 psi x 4 in2 = 400 pounds.",
                "So a 100-pound push from your foot becomes 400 pounds of braking force at each wheel."
              ],
              "tip": "This also shows why air in brake lines is dangerous: air compresses, so your pedal push squeezes the bubble instead of transmitting pressure, and the pedal feels spongy."
            },
            {
              "problem": "You need a hydraulic press to deliver 300 pounds of output force, but you can only supply 40 pounds of input force on a piston with an area of 2 square inches. How large must the output piston be?",
              "steps": [
                "Step 1: Find the pressure you can create. P = F / A = 40 pounds / 2 in2 = 20 psi.",
                "Step 2: The output piston sees that same 20 psi and must produce 300 pounds.",
                "Step 3: Rearrange F = P x A to solve for area: A = F / P = 300 pounds / 20 psi = 15 in2.",
                "Check: 20 psi x 15 in2 = 300 pounds. A 15 square inch output piston does the job."
              ],
              "tip": "When a fluid problem asks for a missing piece, write P = F / A first, then rearrange for whatever the question wants. The pressure is always the bridge between the two pistons."
            }
          ],
          "summary": "Pressure is force divided by area (P = F / A), measured in psi. Pascal's principle says pressure in an enclosed fluid transmits equally in all directions, which lets hydraulic systems multiply force: find the pressure at the small piston, then multiply by the large piston's area - the force gain equals the area ratio, and the big piston moves proportionally less. Water pressure grows with depth (about 0.433 psi per foot in fresh water), and that depth difference creates buoyancy: objects float when they weigh less than the water they displace. In pipes, narrower sections mean faster flow. Hydraulics use incompressible liquid for strong, precise force; pneumatics use compressible air for lighter, springier power. Pumps create flow and pressure; check valves allow one-way flow and relief valves vent excess pressure. You now have every tool the ASVAB uses for fluid questions - work the arithmetic step by step and these are reliable points."
        },
        "questions": [
          {
            "id": "MC5-001",
            "options": [
              {
                "text": "800 psi",
                "explanation": "This multiplies force by area (200 x 4). Pressure is force DIVIDED by area, not multiplied."
              },
              {
                "text": "50 psi",
                "explanation": "Correct! P = F / A = 200 pounds / 4 in2 = 50 psi. Pressure is how concentrated the force is over the area.",
                "correct": true
              },
              {
                "text": "204 psi",
                "explanation": "This adds force and area, which mixes two different kinds of quantities. Use P = F / A: divide 200 by 4."
              },
              {
                "text": "25 psi",
                "explanation": "This would be right if the area were 8 in2. With a 4 in2 piston, 200 / 4 = 50 psi."
              }
            ],
            "text": "A 200-pound force is applied to a piston with an area of 4 square inches. What is the pressure in the fluid?"
          },
          {
            "id": "MC5-002",
            "options": [
              {
                "text": "felt only at the point where the force was applied",
                "explanation": "That describes pushing on a solid, not a fluid. A confined liquid passes the pressure along in every direction."
              },
              {
                "text": "strongest near the input piston and weaker farther away",
                "explanation": "Pascal's principle says the pressure is undiminished - it does not fade with distance in a confined fluid."
              },
              {
                "text": "converted into heat before it reaches the walls",
                "explanation": "Real systems lose a little energy to friction, but Pascal's principle is about pressure transmission, and the pressure reaches the walls essentially undiminished."
              },
              {
                "text": "transmitted equally to every part of the fluid and the container walls",
                "explanation": "Correct! Pressure applied to an enclosed fluid transmits equally and undiminished throughout the fluid. This is the rule that makes hydraulic systems possible.",
                "correct": true
              }
            ],
            "text": "According to Pascal's principle, when pressure is applied to a liquid in a sealed container, the pressure is:"
          },
          {
            "id": "MC5-003",
            "options": [
              {
                "text": "240 pounds",
                "explanation": "Correct! Pressure = 60 / 3 = 20 psi. That same pressure acts on the 12 in2 output piston: 20 x 12 = 240 pounds. The area ratio is 4, so the force is multiplied by 4.",
                "correct": true
              },
              {
                "text": "15 pounds",
                "explanation": "This divides the force by the area ratio instead of multiplying. The LARGER piston produces the LARGER force: 60 x 4 = 240 pounds."
              },
              {
                "text": "60 pounds",
                "explanation": "The pressure is the same at both pistons, but force equals pressure times area. The bigger piston has more area, so it delivers more force - 240 pounds."
              },
              {
                "text": "720 pounds",
                "explanation": "This multiplies 60 by 12, using the output area alone. First find the pressure (60 / 3 = 20 psi), then multiply by 12 in2 to get 240 pounds."
              }
            ],
            "text": "A hydraulic press has an input piston of 3 square inches and an output piston of 12 square inches. If you push the input piston with 60 pounds, what force does the output piston deliver?"
          },
          {
            "id": "MC5-004",
            "options": [
              {
                "text": "8 inches",
                "explanation": "The pistons do not move the same distance. The large piston gains force but gives up distance - it moves only 1 inch."
              },
              {
                "text": "64 inches",
                "explanation": "This multiplies instead of divides. Hydraulics trade distance for force: the big piston moves LESS, not more."
              },
              {
                "text": "1 inch",
                "explanation": "Correct! Force is multiplied by 8, so distance is divided by 8. The input moves 8 inches, so the output moves 8 / 8 = 1 inch. Like levers, hydraulics trade distance for force.",
                "correct": true
              },
              {
                "text": "16 inches",
                "explanation": "The output piston cannot move farther than the input in a force-multiplying system. With 8 times the area, it moves one eighth the distance: 1 inch."
              }
            ],
            "text": "In a hydraulic jack, the output piston has 8 times the area of the input piston. If the input piston moves down 8 inches, how far does the output piston move up?"
          },
          {
            "id": "MC5-005",
            "options": [
              {
                "text": "The width of the container",
                "explanation": "Width does not matter. A narrow pipe and a wide lake with the same water depth have the same pressure at the bottom."
              },
              {
                "text": "The depth of the water",
                "explanation": "Correct! Liquid pressure depends on depth - in fresh water it rises about 0.433 psi per foot. The deeper the water, the more weight is stacked above, regardless of container shape or width.",
                "correct": true
              },
              {
                "text": "The shape of the container",
                "explanation": "Shape has no effect on pressure at a given depth. Only how deep the water is matters."
              },
              {
                "text": "The total volume of water",
                "explanation": "A huge shallow pond has less bottom pressure than a skinny 20-foot pipe of water. Depth, not total volume, sets the pressure."
              }
            ],
            "text": "Which factor determines the water pressure at the bottom of a container?"
          },
          {
            "id": "MC5-006",
            "options": [
              {
                "text": "The paint on the hull seals out water and makes the ship lighter",
                "explanation": "Paint protects the hull from rust but has nothing to do with floating. Buoyancy comes from displaced water."
              },
              {
                "text": "Moving forward creates lift under the hull like an airplane wing",
                "explanation": "A ship floats even when anchored and perfectly still. Floating is about buoyant force, not motion."
              },
              {
                "text": "Salt water pushes metal upward by magnetic attraction",
                "explanation": "There is no magnetic effect involved, and ships float in fresh water too. The answer is displacement."
              },
              {
                "text": "The hollow hull makes the ship less dense overall than the water it displaces",
                "explanation": "Correct! Archimedes' principle: the buoyant force equals the weight of the water displaced. The hollow hull pushes aside a huge volume of water, so the ship's average density is less than water and it floats.",
                "correct": true
              }
            ],
            "text": "A steel ship floats even though steel is denser than water. Why?"
          },
          {
            "id": "MC5-007",
            "options": [
              {
                "text": "speeds up",
                "explanation": "Correct! The same amount of water must pass every point each second, so when the opening shrinks, the water must move faster to get through. This is why covering a hose nozzle makes the stream shoot farther.",
                "correct": true
              },
              {
                "text": "slows down",
                "explanation": "It is the opposite. If the water slowed in the narrow part, flow would pile up behind it. The same flow through a smaller opening requires higher speed."
              },
              {
                "text": "stops flowing",
                "explanation": "A narrower pipe restricts flow but does not stop it. The water squeezes through by speeding up."
              },
              {
                "text": "keeps exactly the same speed",
                "explanation": "Speed can only stay the same if the pipe size stays the same. A smaller cross-section forces the water to move faster."
              }
            ],
            "text": "Water flows through a pipe that narrows to half its original diameter. In the narrow section, the water:"
          },
          {
            "id": "MC5-008",
            "options": [
              {
                "text": "Pneumatic systems cannot transmit any force",
                "explanation": "Pneumatics transmit plenty of force - air brakes stop 40-ton trucks. The real difference is the working fluid: compressible gas versus incompressible liquid."
              },
              {
                "text": "Hydraulic systems only work in cold weather",
                "explanation": "Temperature is not the dividing line - both types work across a wide range of conditions. The difference is gas versus liquid."
              },
              {
                "text": "Pneumatics use compressible gas, while hydraulics use nearly incompressible liquid",
                "explanation": "Correct! Pneumatic systems use compressed air, which squeezes and springs back, making them lighter but less precise. Hydraulic liquid does not compress, so hydraulics deliver stronger, stiffer, more exact force.",
                "correct": true
              },
              {
                "text": "Hydraulic systems do not follow Pascal's principle",
                "explanation": "Both systems rely on Pascal's principle - pressure transmits through the confined fluid either way. The difference is that gas compresses and liquid does not."
              }
            ],
            "text": "What is the main difference between a pneumatic system and a hydraulic system?"
          }
        ],
        "quizConfig": {
          "questionsPerQuiz": 6
        }
      },
      {
        "id": "MC-6",
        "title": "Springs, Structures, and Materials",
        "description": "Learn how springs stretch under load, how forces like tension, compression, and shear act on materials, and why bridges, towers, and machines are built the way they are. This chapter covers Hooke's law, center of gravity and stability, trusses and beams, thermal expansion, bearings, and counterweights.",
        "lesson": {
          "intro": "So far you have studied levers, gears, pulleys, and fluids. This chapter zooms out to the stuff machines and structures are made of. Why does a spring stretch a predictable amount? Why do bridges use triangles everywhere? Why does a wide, low stance keep a crane from tipping over? These are the kinds of questions the ASVAB loves, and the good news is that almost every one of them can be answered with a few simple, common-sense rules. No heavy math here, just clear thinking about forces and shapes. Let's get into it.",
          "concepts": [
            {
              "title": "Hooke's Law: Springs Stretch in Proportion to Force",
              "content": "A spring is honest: pull on it twice as hard and it stretches twice as far. That simple idea is Hooke's law. In plain words, the stretch (or squeeze) of a spring is directly proportional to the force applied to it, as long as you do not overload it. If 10 pounds stretches a spring 1 inch, then 20 pounds stretches it 2 inches and 5 pounds stretches it half an inch. Every spring has a stiffness, often called the spring constant. A stiff spring (like a truck suspension spring) needs a lot of force for a little stretch. A soft spring (like the one in a ballpoint pen) stretches easily. One warning: Hooke's law only holds up to the spring's elastic limit. Stretch a spring too far and it stays bent out of shape permanently. On the test, assume springs behave proportionally unless the question says otherwise."
            },
            {
              "title": "Springs in Series vs. Springs in Parallel",
              "content": "How you connect springs changes how the combination behaves. In series means end to end, like links in a chain. The same force passes through each spring, so each one stretches its full amount and the stretches add up. Two identical springs in series stretch twice as far as one spring alone under the same load, so the combination acts softer. In parallel means side by side, both attached between the same two points, sharing the load. Each spring carries only part of the force, so each stretches less. Two identical springs in parallel each carry half the load, so the combination stretches half as much and acts stiffer. Memory hook: series = softer, parallel = stiffer. Think of a truck with multiple leaf springs stacked side by side: parallel springs make a stiff suspension that can carry heavy cargo."
            },
            {
              "title": "Three Ways to Load a Material: Tension, Compression, and Shear",
              "content": "Every force on a solid part is basically one of three types. Tension is a pulling or stretching force. A tow rope, a crane cable, and the string of a bow are all in tension. Ropes and cables can ONLY carry tension; you cannot push a rope. Compression is a squeezing or pushing force. The legs of a table, a building column, and the jack holding up a car are in compression. Shear is a sliding force, where two parts of a material are pushed in opposite directions past each other, like the blades of scissors cutting paper or a bolt being loaded sideways where two plates meet. Real structures often mix these: when a beam bends, its top surface is squeezed (compression) while its bottom surface is stretched (tension). If a test question asks what kind of force a cable, rope, or chain carries, the answer is tension."
            },
            {
              "title": "Center of Gravity and Stability: Why Wide Bases Win",
              "content": "The center of gravity (CG) is the balance point of an object, the single spot where all its weight seems to act. Stability follows one rule: an object stays upright as long as its center of gravity is over its base of support. Tip the object until the CG passes beyond the edge of the base, and gravity takes over and knocks it down. Two things make an object more stable. First, a wider base, because the CG has to travel farther sideways before it passes the edge. Second, a lower center of gravity, because a low CG swings outward less for the same amount of tilt. This is why a race car is low and wide while a tall bookcase tips easily, why you spread your feet on a moving bus, and why a forklift must keep its load low while driving. To make anything harder to tip: widen the base, lower the weight."
            },
            {
              "title": "Triangles, Trusses, and Beams: How Structures Carry Loads",
              "content": "Look at any bridge or radio tower and you will see triangles everywhere. Here is why: a triangle is the only shape that cannot change its angles without changing the length of a side. Push on a square frame and it collapses sideways into a diamond; push on a triangle and nothing moves unless a side stretches or crushes. Engineers connect triangles into a truss, a framework that turns a heavy load into simple tension and compression in each straight member, which is exactly what materials handle best. Beams work differently: a beam resting on two supports carries a load by bending. The load is shared between the supports, but not always equally. The support CLOSER to the load carries MORE of the weight. Stand near the left end of a plank and the left support does most of the work. Put the load exactly in the middle and each support carries half. Spreading a load out along a beam (instead of concentrating it at one point) reduces the worst bending and is easier on the beam."
            },
            {
              "title": "Thermal Expansion, Bearings, and Counterweights",
              "content": "Three quick topics that show up on the test. Thermal expansion: nearly all materials expand when heated and shrink when cooled. Bridges have expansion joints and gaps so hot summer days do not buckle the deck. Mechanics use this on purpose: to slide a tight-fitting bearing or gear onto a shaft, heat the part so its hole grows, slip it on, and let it cool into a super-tight shrink fit. To loosen a stuck metal lid or nut, heat it so it expands away from what it grips. Bearings: a bearing is a machine part that lets things rotate or slide with very little friction, usually by putting rolling balls or rollers between the moving surfaces, because rolling friction is far lower than sliding friction. Lubrication (oil or grease) helps the same way, by separating metal surfaces with a slippery film so they never scrape directly. Less friction means less wear, less heat, and less wasted effort. Counterweights: a counterweight is a weight placed on the opposite side of a pivot to balance a load, exactly like a see-saw. Tower cranes carry huge concrete counterweights behind the cab, elevators hang a counterweight on the other end of the cable, and drawbridges use them too. The balance rule is the lever rule from earlier chapters: weight times distance on one side equals weight times distance on the other. Counterweights mean the motor only has to move the difference, not the whole load."
            }
          ],
          "examples": [
            {
              "problem": "A spring stretches 2 inches when a 10-pound weight hangs from it. How far will it stretch with a 25-pound weight? (Assume the spring stays within its elastic limit.)",
              "steps": [
                "Hooke's law says stretch is proportional to force, so first find the stretch per pound.",
                "10 pounds causes 2 inches of stretch, so each pound causes 2 divided by 10 = 0.2 inches of stretch.",
                "Multiply by the new load: 25 pounds x 0.2 inches per pound = 5 inches.",
                "Sanity check: 25 pounds is 2.5 times the original 10 pounds, so the stretch should be 2.5 times the original 2 inches. 2.5 x 2 = 5 inches. It checks out."
              ],
              "tip": "Set up spring problems as a simple ratio: new stretch = old stretch x (new force divided by old force). If the force goes up 2.5 times, the stretch goes up 2.5 times."
            },
            {
              "problem": "Under a 20-pound load, one spring stretches 4 inches. How far does the load drop if you hang it from (a) two of these springs connected end to end (series), and (b) two of these springs side by side sharing the load (parallel)?",
              "steps": [
                "Series (end to end): the full 20 pounds pulls through BOTH springs, so each spring stretches its full 4 inches.",
                "The stretches add: 4 + 4 = 8 inches total. The series pair acts like one softer spring.",
                "Parallel (side by side): the two springs share the 20 pounds, so each carries only 10 pounds.",
                "Half the force means half the stretch: each spring stretches 2 inches, and since they stretch together, the load drops just 2 inches. The parallel pair acts like one stiffer spring."
              ],
              "tip": "Series doubles the stretch (softer); parallel halves it (stiffer). If you mix these up, picture a chain of slinky springs (very stretchy) versus a stack of leaf springs on a truck (very stiff)."
            },
            {
              "problem": "A tool cabinet and a low workbench weigh the same. The cabinet is tall and narrow with heavy drawers up top; the bench is short and wide with a heavy steel base. A soldier bumps into each one with the same sideways push. Which is more likely to tip over, and why?",
              "steps": [
                "Find each object's center of gravity. The cabinet has heavy drawers up high, so its CG is high. The bench has a heavy base, so its CG is low.",
                "Compare the bases. The cabinet is narrow, so its CG only has to shift a short distance sideways to pass the edge of its base. The bench is wide, so its CG must travel much farther to reach the edge.",
                "Apply the tipping rule: an object falls over when its center of gravity moves past the edge of its base of support.",
                "The tall, narrow, top-heavy cabinet tips first. Its high CG swings outward quickly as it tilts, and its narrow base gives the CG only a short trip to the edge. The wide, low bench barely notices the push."
              ],
              "tip": "For any stability question, ask two things: how HIGH is the weight, and how WIDE is the base? Low and wide = stable. Tall and narrow = tippy. You do not need numbers, just this comparison."
            }
          ],
          "summary": "Springs follow Hooke's law: stretch is proportional to force, so double the pull means double the stretch. Springs in series (end to end) add their stretches and act softer; springs in parallel (side by side) share the load and act stiffer. Materials feel three basic forces: tension (pulling, the only force a rope can carry), compression (squeezing, what columns and legs feel), and shear (sliding, like scissors). An object is stable while its center of gravity stays over its base, so a wider base and a lower center of gravity both resist tipping. Triangles cannot change shape without a side changing length, which is why trusses in bridges and towers are built from them. A beam on two supports shares its load, with the closer support carrying more. Metals expand when heated, which mechanics use for shrink fits and freeing stuck parts. Bearings and lubrication cut friction so machines run cooler and last longer, and counterweights balance loads across a pivot so motors only lift the difference. Keep picturing real equipment as you review, and these questions will feel like common sense on test day."
        },
        "questions": [
          {
            "id": "MC6-001",
            "options": [
              {
                "text": "4 inches",
                "explanation": "This would be the stretch for a 20-pound weight (double the force, double the stretch). The question uses 30 pounds, which is triple the original force."
              },
              {
                "text": "6 inches",
                "correct": true,
                "explanation": "Correct! Hooke's law says stretch is proportional to force. 30 pounds is 3 times the original 10 pounds, so the stretch is 3 times the original 2 inches: 3 x 2 = 6 inches."
              },
              {
                "text": "2 inches",
                "explanation": "The stretch does not stay the same when the force changes. A spring stretches more as more force is applied, in direct proportion."
              },
              {
                "text": "12 inches",
                "explanation": "This would require 60 pounds (6 times the original force). Tripling the force from 10 to 30 pounds only triples the stretch, from 2 inches to 6 inches."
              }
            ],
            "text": "A spring stretches 2 inches when a 10-pound weight is hung from it. If a 30-pound weight is hung from the same spring instead, how far will it stretch?"
          },
          {
            "id": "MC6-002",
            "options": [
              {
                "text": "1.5 inches",
                "explanation": "This is what happens in PARALLEL, where the springs share the load side by side. In series, the springs are end to end and the full load passes through each one."
              },
              {
                "text": "3 inches",
                "explanation": "This is the stretch of a single spring alone. Connecting a second spring in series adds its stretch on top, so the total is larger."
              },
              {
                "text": "6 inches",
                "correct": true,
                "explanation": "Correct! In series, the full load pulls through both springs, so each stretches its full 3 inches. The stretches add: 3 + 3 = 6 inches. Springs in series act softer."
              },
              {
                "text": "9 inches",
                "explanation": "This would be three springs in series (3 x 3 inches). Two identical springs in series give twice the stretch of one, which is 6 inches."
              }
            ],
            "text": "One spring stretches 3 inches under a certain load. If two identical springs are connected end to end (in series) and the same load is hung from the pair, how far does the load drop?"
          },
          {
            "id": "MC6-003",
            "options": [
              {
                "text": "Half as much",
                "correct": true,
                "explanation": "Correct! In parallel, each spring carries only half the load, and half the force produces half the stretch. The pair acts like one stiffer spring."
              },
              {
                "text": "Twice as much",
                "explanation": "Twice the stretch is what springs in SERIES (end to end) produce. Parallel springs share the load, so each one stretches less, not more."
              },
              {
                "text": "The same amount",
                "explanation": "The stretch changes because each parallel spring feels only half the force. Less force on each spring means less stretch."
              },
              {
                "text": "Four times as much",
                "explanation": "Adding a parallel spring makes the system stiffer, not dramatically softer. The load is shared, so the stretch drops to half, it does not multiply."
              }
            ],
            "text": "Two identical springs are mounted side by side (in parallel) and share a load equally. Compared to one spring carrying the whole load alone, the parallel pair will stretch:"
          },
          {
            "id": "MC6-004",
            "options": [
              {
                "text": "Compression",
                "explanation": "Compression is a squeezing or pushing force, like what a building column feels. A flexible cable cannot be pushed; it would simply go slack."
              },
              {
                "text": "Shear",
                "explanation": "Shear is a sliding force, where material is pushed in opposite directions past itself, like paper between scissor blades. A hanging cable is being pulled, not slid."
              },
              {
                "text": "Torsion",
                "explanation": "Torsion is a twisting force, like what a screwdriver shaft feels. A cable holding a hanging load is being stretched along its length, not twisted. Torsion is the twisting cousin of the three loads taught here."
              },
              {
                "text": "Tension",
                "correct": true,
                "explanation": "Correct! A cable supporting a hanging load is being pulled and stretched, which is tension. Ropes, chains, and cables can only carry tension, never compression."
              }
            ],
            "text": "A cable on a crane is holding a heavy load in the air. What type of force is the cable experiencing?"
          },
          {
            "id": "MC6-005",
            "options": [
              {
                "text": "Moving the heaviest items to the top shelf",
                "explanation": "Heavy items up high raise the center of gravity, which makes tipping easier, not harder. Heavy items belong on the bottom shelves."
              },
              {
                "text": "Widening its base and storing the heaviest items on the bottom shelf",
                "correct": true,
                "explanation": "Correct! A wider base means the center of gravity must travel farther sideways before it passes the edge, and heavy items down low keep the center of gravity low. Both changes resist tipping."
              },
              {
                "text": "Making the rack taller with the same base",
                "explanation": "A taller rack with the same base raises the center of gravity, so a smaller tilt moves it past the edge of the base. That makes tipping more likely."
              },
              {
                "text": "Narrowing the base to save floor space",
                "explanation": "A narrower base gives the center of gravity a shorter trip to the edge of the base, so the rack tips with a smaller push. Narrow bases reduce stability."
              }
            ],
            "text": "Which change would make a tall storage rack LESS likely to tip over when bumped?"
          },
          {
            "id": "MC6-006",
            "options": [
              {
                "text": "Triangles use less metal than any other shape",
                "explanation": "Material savings are a side benefit in some designs, but they are not the core reason. The key property of a triangle is its rigidity, not its material use."
              },
              {
                "text": "Triangles are easier to weld than other shapes",
                "explanation": "Ease of fabrication is not the reason. Squares and rectangles are just as easy to join, but a square frame can collapse sideways into a diamond under load."
              },
              {
                "text": "A triangle cannot change shape unless one of its sides changes length, so it stays rigid under load",
                "correct": true,
                "explanation": "Correct! A triangle's angles are locked in by its side lengths, so it cannot rack or fold like a square frame can. Trusses use this rigidity to turn heavy loads into simple tension and compression in each member."
              },
              {
                "text": "Triangles let the wind pass through the structure",
                "explanation": "Open frameworks of any shape let wind through. The reason engineers choose triangles specifically is that a triangle is rigid and cannot change its shape without a side stretching or crushing."
              }
            ],
            "text": "Bridge trusses and radio towers are built mainly from triangles rather than squares. Why?"
          },
          {
            "id": "MC6-007",
            "options": [
              {
                "text": "The left support, because the support closer to a load carries more of it",
                "correct": true,
                "explanation": "Correct! A load on a beam is shared between the supports in proportion to how close it is to each one. Standing near the left support puts most of the weight on the left support."
              },
              {
                "text": "The right support, because the load has farther to travel to reach it",
                "explanation": "It works the other way around. The farther a support is from the load, the SMALLER the share of the load it carries. The nearer support does most of the work."
              },
              {
                "text": "Both supports carry the weight equally no matter where the person stands",
                "explanation": "The supports share the load equally only when the load is exactly in the middle. Move the load toward one support and that support's share grows."
              },
              {
                "text": "Neither support carries the weight; the plank itself absorbs it",
                "explanation": "The plank transmits the weight, it does not absorb it. Every pound of the person and the plank ends up pressing down on the two supports."
              }
            ],
            "text": "A uniform plank rests on two supports, one at each end. A person stands on the plank much closer to the left support than to the right. Which support carries more of the person's weight?"
          },
          {
            "id": "MC6-008",
            "options": [
              {
                "text": "Cool the bearing in a freezer so it slips on more easily",
                "explanation": "Cooling the bearing makes it shrink, so its hole gets even smaller and the fit gets tighter. Cooling is used on the SHAFT, not the bearing, when chilling is the chosen method."
              },
              {
                "text": "Heat the shaft so it becomes softer",
                "explanation": "Heating the shaft makes it expand and grow thicker, which makes the fit worse. It also does not meaningfully soften at safe working temperatures."
              },
              {
                "text": "Hammer the bearing on with heavy blows",
                "explanation": "Hammering a bearing risks cracking it, damaging the rollers, and scoring the shaft. Thermal expansion does the job without force."
              },
              {
                "text": "Heat the bearing so its hole expands, slide it on, and let it cool into a tight fit",
                "correct": true,
                "explanation": "Correct! Metal expands when heated, and a heated bearing's hole grows just enough to slip over the shaft. As it cools it shrinks back, gripping the shaft in a tight shrink fit."
              }
            ],
            "text": "A mechanic needs to slide a metal bearing onto a shaft, but the bearing's hole is just slightly too small. What is the standard technique?"
          }
        ],
        "quizConfig": {
          "questionsPerQuiz": 6
        }
      }
    ]
  },
  AS: {
    "name": "Auto & Shop Information",
    "description": "Automotive systems, shop tools, and how things get fixed",
    "icon": "🔧",
    "chapters": [
      {
        "id": "AS-1",
        "title": "Engine Basics",
        "description": "Learn how a four-stroke engine works, the job of each major part, and the key differences between gasoline, diesel, and two-stroke engines.",
        "lesson": {
          "intro": "Engine questions are the backbone of the Auto Information section, and the four-stroke cycle is the single most tested idea. The good news: an engine is just a machine that turns burning fuel into spinning motion, and once you can picture the four strokes in your head, a huge chunk of ASVAB auto questions become easy points. Let's build that picture step by step.",
          "concepts": [
            {
              "title": "The Four-Stroke Cycle: Intake, Compression, Power, Exhaust",
              "content": "A four-stroke gasoline engine repeats the same four steps over and over: intake, compression, power, and exhaust. On the intake stroke, the piston moves down and the open intake valve lets a mixture of air and fuel into the cylinder. On the compression stroke, both valves close and the piston moves up, squeezing that mixture into a small space so it will burn with more force. On the power stroke, the spark plug fires, the mixture burns rapidly, and the expanding gases push the piston down - this is the only stroke that actually produces power. On the exhaust stroke, the piston moves back up and pushes the burned gases out through the open exhaust valve. A popular memory trick is suck, squeeze, bang, blow - it matches the four strokes in order."
            },
            {
              "title": "Major Engine Parts and What They Do",
              "content": "The cylinder is the round chamber where combustion happens, and the piston is the plug that slides up and down inside it. The piston connects to the crankshaft through a connecting rod, and the crankshaft converts the piston's up-and-down motion into the rotating motion that eventually drives the wheels. The camshaft is a separate rotating shaft with egg-shaped lobes that open and close the intake and exhaust valves at exactly the right moments; it is driven by the crankshaft and turns at half the crankshaft's speed in a four-stroke engine. The spark plug delivers the electric spark that ignites the air-fuel mixture in a gasoline engine. The flywheel is a heavy disc bolted to the end of the crankshaft that stores rotating energy and smooths out the engine between power strokes."
            },
            {
              "title": "Diesel vs. Gasoline: How the Fire Gets Started",
              "content": "The biggest difference between diesel and gasoline engines is how the fuel is ignited. A gasoline engine uses a spark plug to light the air-fuel mixture. A diesel engine has no spark plugs at all - instead it compresses the air so hard that it gets hot enough to ignite the fuel on its own the moment fuel is injected into the cylinder. That is called compression ignition, and it is why diesel engines use much higher compression ratios than gasoline engines. Diesels also compress only air during the compression stroke, with fuel injected right at the top, while a gasoline engine typically compresses an air-fuel mixture. If an ASVAB question mentions ignition without a spark plug, think diesel."
            },
            {
              "title": "Two-Stroke vs. Four-Stroke Engines",
              "content": "A four-stroke engine needs four piston strokes - two full crankshaft revolutions - to complete one power cycle. A two-stroke engine squeezes the whole cycle into just two strokes, so it fires once every single revolution of the crankshaft. That makes two-stroke engines simpler and lighter for their power, which is why you find them in chainsaws, string trimmers, and small dirt bikes. The trade-off is that many small two-strokes require oil to be mixed directly into the fuel to lubricate the engine, and they tend to run dirtier and wear out faster. Four-strokes keep their oil in a separate system and run cleaner, which is why cars and trucks use them."
            },
            {
              "title": "Displacement and Compression Ratio in Plain Terms",
              "content": "Displacement is the total volume the pistons sweep through as they travel in their cylinders - basically the size of the engine - measured in liters or cubic inches. All else being equal, more displacement means the engine can pull in more air and fuel per cycle, which generally means more power. Compression ratio compares the cylinder volume when the piston is at the bottom of its stroke to the volume when the piston is at the top. For example, a 9 to 1 compression ratio means the mixture is squeezed into one ninth of its original space. Higher compression ratios extract more energy from each combustion event, which is one reason diesel engines, with ratios often around 15 to 1 or higher, are so fuel efficient compared to typical gasoline ratios of roughly 9 to 1 through 13 to 1."
            }
          ],
          "examples": [
            {
              "problem": "ASVAB-style question: During which stroke of a four-stroke engine does the spark plug fire?",
              "steps": [
                "Recall the order of the four strokes: intake, compression, power, exhaust - suck, squeeze, bang, blow.",
                "The spark plug's job is to ignite the compressed air-fuel mixture, and the burning mixture is what pushes the piston down.",
                "That push happens on the power stroke: the spark fires just before the piston reaches the top of the compression stroke, so the burning mixture drives the piston down through the power stroke.",
                "Answer: the power stroke."
              ],
              "tip": "If a question asks which stroke produces the engine's power, or when the spark occurs, the answer is the power stroke - the bang in suck, squeeze, bang, blow."
            },
            {
              "problem": "ASVAB-style question: A mechanic notes that an engine ignites its fuel using only the heat of compressed air, with no spark plugs. What type of engine is this?",
              "steps": [
                "List what you know about ignition: gasoline engines use a spark plug; diesel engines use compression ignition.",
                "The question says there are no spark plugs and the heat of compression ignites the fuel.",
                "That matches compression ignition exactly, which is the defining feature of a diesel engine.",
                "Answer: a diesel engine."
              ],
              "tip": "No spark plug plus ignition by compression heat always points to diesel. Diesel engines also have much higher compression ratios than gasoline engines - the two facts go hand in hand."
            },
            {
              "problem": "ASVAB-style question: In a four-stroke engine, how many crankshaft revolutions are needed to complete one full cycle, and how many times does the camshaft turn during that cycle?",
              "steps": [
                "One full four-stroke cycle is four piston strokes: intake, compression, power, exhaust.",
                "Each crankshaft revolution moves the piston down once and up once - two strokes. So four strokes require two crankshaft revolutions.",
                "The camshaft must open each valve only once per full cycle, so it turns at half crankshaft speed.",
                "Half of two revolutions is one revolution. Answer: the crankshaft turns twice and the camshaft turns once per complete cycle."
              ],
              "tip": "Memorize the 2 to 1 relationship: in a four-stroke engine the crankshaft always spins twice for every single turn of the camshaft."
            }
          ],
          "summary": "The four-stroke cycle - intake, compression, power, exhaust - is the heart of nearly every car engine, with the piston, crankshaft, camshaft, valves, and spark plug each playing a specific role in making it happen. Remember the key contrasts: gasoline uses spark ignition while diesel uses compression ignition, and a two-stroke fires every revolution while a four-stroke fires every other revolution. Know those facts cold and you have already locked down the most commonly tested engine material on the ASVAB."
        },
        "questions": [
          {
            "id": "AS1-001",
            "text": "What is the correct order of the four strokes in a four-stroke gasoline engine?",
            "options": [
              {
                "text": "Intake, compression, power, exhaust",
                "explanation": "Correct! The cycle is intake (mixture enters), compression (mixture is squeezed), power (spark ignites the mixture and pushes the piston down), and exhaust (burned gases are pushed out). Remember it as suck, squeeze, bang, blow.",
                "correct": true
              },
              {
                "text": "Intake, power, compression, exhaust",
                "explanation": "This is tempting because it starts and ends in the right place, but the mixture must be compressed before it is ignited. Power comes after compression, not before."
              },
              {
                "text": "Compression, intake, exhaust, power",
                "explanation": "The cycle cannot start with compression - there is nothing in the cylinder to compress until the intake stroke draws in the air-fuel mixture first."
              },
              {
                "text": "Exhaust, intake, power, compression",
                "explanation": "This scrambles the sequence. The burned gases are expelled last, after the power stroke, not at the beginning of the cycle."
              }
            ]
          },
          {
            "id": "AS1-002",
            "text": "Which engine part converts the up-and-down motion of the pistons into rotating motion?",
            "options": [
              {
                "text": "The camshaft",
                "explanation": "The camshaft rotates, so it is a tempting pick, but its job is to open and close the valves - it does not convert piston motion into rotation."
              },
              {
                "text": "The flywheel",
                "explanation": "The flywheel is already rotating - it stores energy and smooths the engine's rotation, but it is not what converts the piston's motion."
              },
              {
                "text": "The crankshaft",
                "explanation": "Correct! The pistons connect to the crankshaft through connecting rods, and the crankshaft's offset design turns their up-and-down (reciprocating) motion into the rotating motion that drives the vehicle.",
                "correct": true
              },
              {
                "text": "The intake valve",
                "explanation": "The intake valve simply opens to let the air-fuel mixture into the cylinder. It plays no role in converting motion."
              }
            ]
          },
          {
            "id": "AS1-003",
            "text": "How does a diesel engine ignite its fuel?",
            "options": [
              {
                "text": "With a spark plug, just like a gasoline engine",
                "explanation": "This is the trap answer - spark plugs are the gasoline engine's ignition method. Diesel engines do not use spark plugs at all."
              },
              {
                "text": "With the heat of highly compressed air",
                "explanation": "Correct! A diesel engine compresses air so much that it becomes hot enough to ignite the fuel the instant it is injected. This is called compression ignition and it is the defining feature of a diesel.",
                "correct": true
              },
              {
                "text": "With a continuously burning pilot flame",
                "explanation": "Pilot flames are found in appliances like older furnaces and water heaters, not in diesel engines."
              },
              {
                "text": "With an electric heating coil that stays on while the engine runs",
                "explanation": "Some diesels use glow plugs briefly to help cold starts, but normal running ignition comes from the heat of compression, not a heating coil that stays on."
              }
            ]
          },
          {
            "id": "AS1-004",
            "text": "During which stroke does a four-stroke gasoline engine actually produce power?",
            "options": [
              {
                "text": "The intake stroke",
                "explanation": "The intake stroke only draws the air-fuel mixture into the cylinder - the engine is spending energy here, not producing it."
              },
              {
                "text": "The compression stroke",
                "explanation": "Compression is preparation, not production. The piston uses energy to squeeze the mixture; nothing has ignited yet."
              },
              {
                "text": "The exhaust stroke",
                "explanation": "By the exhaust stroke the burning is finished - the piston is just pushing spent gases out of the cylinder."
              },
              {
                "text": "The power stroke",
                "explanation": "Correct! The spark plug ignites the compressed mixture and the rapidly expanding gases force the piston down. This is the only stroke that delivers power to the crankshaft.",
                "correct": true
              }
            ]
          },
          {
            "id": "AS1-005",
            "text": "In a four-stroke engine, how many times does the crankshaft rotate to complete one full four-stroke cycle?",
            "options": [
              {
                "text": "One rotation",
                "explanation": "One crankshaft rotation covers only two strokes - one down and one up. That describes a two-stroke engine's cycle, not a four-stroke's."
              },
              {
                "text": "Two rotations",
                "explanation": "Correct! Each crankshaft revolution moves the piston through two strokes, so completing all four strokes - intake, compression, power, exhaust - takes two full revolutions. The camshaft turns once in that same time.",
                "correct": true
              },
              {
                "text": "Four rotations",
                "explanation": "It is easy to match four strokes with four rotations, but each rotation includes two strokes, so only two rotations are needed."
              },
              {
                "text": "Half a rotation",
                "explanation": "Half a rotation is just one stroke - the piston moving one direction. A full cycle needs four strokes."
              }
            ]
          },
          {
            "id": "AS1-006",
            "text": "Which of the following is a common characteristic of small two-stroke engines, such as those in chainsaws?",
            "options": [
              {
                "text": "They fire once every two crankshaft revolutions",
                "explanation": "That describes a four-stroke engine. A two-stroke fires once every single revolution, which is part of why it makes strong power for its size."
              },
              {
                "text": "They keep their lubricating oil in a separate oil pan like a car engine",
                "explanation": "That is the four-stroke arrangement. Most small two-strokes have no separate oil system."
              },
              {
                "text": "They require oil to be mixed into the fuel for lubrication",
                "explanation": "Correct! Many small two-stroke engines are lubricated by oil mixed directly into the gasoline, which is why chainsaw and trimmer fuel is a gas-and-oil mix.",
                "correct": true
              },
              {
                "text": "They cannot run without spark plugs",
                "explanation": "This option confuses the ignition question with the stroke-count question - and small gasoline two-strokes do use spark plugs, so needing one is not what sets two-strokes apart from four-strokes."
              }
            ]
          },
          {
            "id": "AS1-007",
            "text": "An engine has a compression ratio of 9 to 1. What does this mean?",
            "options": [
              {
                "text": "The engine produces 9 units of power for every 1 unit of fuel",
                "explanation": "Compression ratio describes volume, not a power-to-fuel relationship. Fuel efficiency is a separate measurement."
              },
              {
                "text": "The air-fuel mixture is squeezed to one ninth of its original volume",
                "explanation": "Correct! Compression ratio compares the cylinder volume with the piston at the bottom of its stroke to the volume with the piston at the top. At 9 to 1, the mixture is compressed into one ninth of the space it started in.",
                "correct": true
              },
              {
                "text": "The crankshaft turns 9 times for every turn of the camshaft",
                "explanation": "The crankshaft-to-camshaft relationship in a four-stroke engine is always 2 to 1, and it has nothing to do with compression ratio."
              },
              {
                "text": "The engine has 9 cylinders and 1 camshaft",
                "explanation": "Compression ratio says nothing about the number of cylinders or camshafts - it is purely a comparison of volumes inside one cylinder."
              }
            ]
          },
          {
            "id": "AS1-008",
            "text": "What is the main job of the flywheel?",
            "options": [
              {
                "text": "To open and close the valves at the correct times",
                "explanation": "Valve timing is the camshaft's job. The flywheel has no lobes and does not touch the valves."
              },
              {
                "text": "To ignite the air-fuel mixture in the cylinder",
                "explanation": "Ignition is the spark plug's job in a gasoline engine. The flywheel is a mechanical part with no role in lighting the mixture."
              },
              {
                "text": "To inject fuel into the cylinder under high pressure",
                "explanation": "Fuel delivery is handled by the fuel system - injectors or, on older engines, a carburetor - not by the flywheel."
              },
              {
                "text": "To store rotating energy and smooth out the engine between power strokes",
                "explanation": "Correct! The flywheel is a heavy disc on the end of the crankshaft. Its momentum keeps the engine turning smoothly through the strokes that do not produce power.",
                "correct": true
              }
            ]
          }
        ],
        "quizConfig": {
          "questionsPerQuiz": 6
        }
      },
      {
        "id": "AS-2",
        "title": "Engine Support Systems",
        "description": "Learn the five support systems that keep an engine running: fuel, ignition, cooling, lubrication, and exhaust.",
        "lesson": {
          "intro": "An engine cannot run on its own. It depends on a team of support systems that feed it fuel, fire the spark, keep it cool, keep it slippery, and carry away the waste gases. The ASVAB loves to ask what each part does and what happens when it fails, so mastering these five systems is one of the fastest ways to pick up points on the Auto and Shop section.",
          "concepts": [
            {
              "title": "Fuel System: Getting Gas to the Engine",
              "content": "The fuel system stores gasoline and delivers it to the engine in the right amount. Fuel sits in the fuel tank, and a fuel pump pushes it through fuel lines toward the engine. Along the way, a fuel filter traps dirt and rust so debris cannot clog the small passages ahead. Older engines used a carburetor, a mechanical device that mixes fuel with air using engine vacuum. Modern engines use fuel injection, where injectors spray a precise mist of fuel controlled by a computer, which gives better fuel economy, easier starting, and lower emissions than a carburetor."
            },
            {
              "title": "Ignition System: Firing the Spark",
              "content": "The ignition system creates the electrical spark that ignites the air and fuel mixture in a gasoline engine. The battery supplies low-voltage electrical power, typically 12 volts in a car. The ignition coil is a transformer that steps that low voltage up to tens of thousands of volts. That high voltage jumps the gap at the tip of each spark plug, creating the spark that fires the cylinder. Ignition timing means the spark must arrive at exactly the right moment near the top of the compression stroke; if timing is off, the engine loses power, runs rough, or may knock."
            },
            {
              "title": "Cooling System: Controlling Engine Heat",
              "content": "Burning fuel makes an engine extremely hot, and the cooling system carries that heat away so parts do not warp or seize. A water pump circulates coolant, a mixture of water and antifreeze, through passages in the engine block called water jackets. The hot coolant then flows to the radiator, where air passing through thin fins carries the heat away. The thermostat is a temperature-controlled valve that stays closed when the engine is cold so it warms up quickly, then opens to let coolant flow to the radiator. A thermostat stuck closed causes overheating, while one stuck open keeps the engine running too cold."
            },
            {
              "title": "Lubrication System: Reducing Friction and Wear",
              "content": "Metal parts sliding against metal parts would quickly destroy themselves without oil. The lubrication system stores oil in the oil pan at the bottom of the engine, and the oil pump forces it through passages to the bearings, camshaft, and other moving parts. The oil filter removes dirt and metal particles as the oil circulates. Oil also helps cool the engine and carries away contaminants. Viscosity describes how thick an oil is and how easily it flows; in a rating like 10W-30, the W stands for winter, and the first number describes cold-weather flow while the second describes thickness at operating temperature."
            },
            {
              "title": "Exhaust System: Removing Waste Gases",
              "content": "After combustion, the burned gases must leave the engine, and the exhaust system carries them safely away while cutting noise and pollution. The exhaust manifold bolts to the engine and collects gases from all the cylinders into one pipe. From there the gases pass through the catalytic converter, which uses a chemical reaction to change harmful pollutants like carbon monoxide and unburned fuel into less harmful gases. Next comes the muffler, whose job is to quiet the loud pulses of exhaust noise. Finally the tailpipe releases the gases behind the vehicle, away from the passengers."
            }
          ],
          "examples": [
            {
              "problem": "ASVAB-style question: Which component increases the battery voltage high enough to fire the spark plugs?",
              "steps": [
                "Recall the path of ignition electricity: battery, then coil, then spark plugs.",
                "The battery only supplies about 12 volts, which is far too weak to jump a spark plug gap.",
                "The ignition coil is a transformer that steps 12 volts up to tens of thousands of volts.",
                "That high voltage travels to the spark plugs, where it jumps the gap and ignites the fuel mixture.",
                "So the answer is the ignition coil."
              ],
              "tip": "On the ASVAB, remember the ignition chain in order: battery (low voltage), coil (steps it up), spark plug (delivers the spark)."
            },
            {
              "problem": "ASVAB-style question: A car overheats shortly after start-up even though it is full of coolant. A stuck-closed thermostat is suspected. Why would that cause overheating?",
              "steps": [
                "Recall the thermostat's job: it blocks coolant flow to the radiator when the engine is cold, then opens once the engine reaches operating temperature.",
                "If the thermostat sticks closed, hot coolant stays trapped in the engine and never reaches the radiator.",
                "The radiator is where heat leaves the system, so blocked flow means the heat has nowhere to go.",
                "Engine temperature keeps climbing, and the engine overheats even with plenty of coolant.",
                "So a stuck-closed thermostat causes overheating; a stuck-open one causes the opposite problem, an engine that runs too cold."
              ],
              "tip": "Pair the failure with its result: stuck closed equals overheating, stuck open equals running too cold. The ASVAB tests this pairing often."
            },
            {
              "problem": "ASVAB-style question: In a motor oil rated 10W-30, what does the rating describe?",
              "steps": [
                "The rating describes viscosity, which is how thick the oil is and how easily it flows.",
                "The W stands for winter, not weight.",
                "The number before the W, 10, describes how the oil flows when cold: lower means it flows more easily in cold weather.",
                "The second number, 30, describes the oil's thickness at normal engine operating temperature.",
                "So 10W-30 is a multi-grade oil that flows like a thin oil when cold but protects like a thicker oil when hot."
              ],
              "tip": "Memorize: viscosity means resistance to flow, and W means winter. Thicker oil has a higher viscosity number."
            }
          ],
          "summary": "Every gasoline engine relies on five support systems: fuel delivers the gas, ignition fires the spark, cooling removes heat, lubrication fights friction, and exhaust carries away waste gases. For each system, know the main parts in order and what happens when a part fails. If you can trace fuel from tank to injector, electricity from battery to spark plug, coolant from pump to radiator, oil from pan to bearings, and exhaust from manifold to tailpipe, you are ready for these questions."
        },
        "questions": [
          {
            "id": "AS2-001",
            "text": "What is the main purpose of the fuel filter?",
            "options": [
              {
                "text": "To mix fuel with air before combustion",
                "explanation": "Mixing fuel with air is the job of the carburetor or fuel injectors, not the filter."
              },
              {
                "text": "To trap dirt and debris before fuel reaches the engine",
                "explanation": "Correct! The fuel filter screens out dirt, rust, and other particles so they cannot clog the carburetor or fuel injectors.",
                "correct": true
              },
              {
                "text": "To pump fuel from the tank to the engine",
                "explanation": "Moving the fuel is the fuel pump's job. The filter only cleans the fuel as it passes through."
              },
              {
                "text": "To store extra fuel for cold starts",
                "explanation": "Fuel is stored in the fuel tank. The filter holds almost no fuel; it simply cleans what flows through it."
              }
            ]
          },
          {
            "id": "AS2-002",
            "text": "Compared with a carburetor, a fuel injection system primarily offers which advantage?",
            "options": [
              {
                "text": "It eliminates the need for a fuel pump",
                "explanation": "This sounds like a simplification, but fuel injection actually requires a fuel pump to pressurize the fuel."
              },
              {
                "text": "It removes the need for spark plugs",
                "explanation": "Spark plugs belong to the ignition system. Gasoline engines need them whether they use injection or a carburetor."
              },
              {
                "text": "More precise fuel metering for better efficiency and lower emissions",
                "explanation": "Correct! Fuel injectors spray an exact, computer-controlled amount of fuel, which improves fuel economy, starting, and emissions compared with a carburetor.",
                "correct": true
              },
              {
                "text": "It lets the engine run without a fuel filter",
                "explanation": "Injectors have tiny openings that clog easily, so fuel injection systems still depend on a clean fuel filter."
              }
            ]
          },
          {
            "id": "AS2-003",
            "text": "Which component steps up the battery's low voltage to the high voltage needed at the spark plugs?",
            "options": [
              {
                "text": "The alternator",
                "explanation": "The alternator recharges the battery and powers accessories while the engine runs; it does not create spark voltage."
              },
              {
                "text": "The starter motor",
                "explanation": "The starter cranks the engine to get it turning, but it plays no role in producing the spark."
              },
              {
                "text": "The fuel injector",
                "explanation": "The injector delivers fuel, not electricity. It is part of the fuel system, not the ignition system."
              },
              {
                "text": "The ignition coil",
                "explanation": "Correct! The ignition coil is a transformer that converts the battery's roughly 12 volts into tens of thousands of volts to jump the spark plug gap.",
                "correct": true
              }
            ]
          },
          {
            "id": "AS2-004",
            "text": "If a thermostat sticks in the closed position, what is the most likely result?",
            "options": [
              {
                "text": "The engine overheats because coolant cannot reach the radiator",
                "explanation": "Correct! A closed thermostat blocks coolant flow to the radiator, trapping heat in the engine until it overheats.",
                "correct": true
              },
              {
                "text": "The engine runs too cold and takes longer to warm up",
                "explanation": "This is the symptom of a thermostat stuck open, which lets coolant circulate constantly and keeps the engine below normal temperature."
              },
              {
                "text": "The oil pressure drops to zero",
                "explanation": "Oil pressure comes from the lubrication system's oil pump, which works independently of the thermostat."
              },
              {
                "text": "The battery stops charging",
                "explanation": "Charging is handled by the alternator in the electrical system; the thermostat only controls coolant flow."
              }
            ]
          },
          {
            "id": "AS2-005",
            "text": "What does the viscosity rating of a motor oil describe?",
            "options": [
              {
                "text": "The amount of detergent additives in the oil",
                "explanation": "Oils do contain additives, but the viscosity number does not measure them; it measures flow."
              },
              {
                "text": "The oil's thickness and resistance to flow",
                "explanation": "Correct! Viscosity is a measure of how thick an oil is and how easily it flows; higher numbers mean thicker oil.",
                "correct": true
              },
              {
                "text": "How many miles the oil lasts before a change",
                "explanation": "Change intervals depend on driving conditions and oil quality, not on the viscosity rating printed on the bottle."
              },
              {
                "text": "The oil's boiling temperature",
                "explanation": "It is easy to link oil ratings to temperature limits, but viscosity describes flow behavior, not the boiling point."
              }
            ]
          },
          {
            "id": "AS2-006",
            "text": "In the oil rating 10W-30, what does the letter W stand for?",
            "options": [
              {
                "text": "Weight",
                "explanation": "This is the most common wrong guess because people say oil weight, but the W officially stands for something else."
              },
              {
                "text": "Warranty",
                "explanation": "Oil ratings have nothing to do with warranties; the letter describes a testing condition."
              },
              {
                "text": "Winter",
                "explanation": "Correct! The W stands for winter, and the number before it describes how easily the oil flows in cold temperatures.",
                "correct": true
              },
              {
                "text": "Wear",
                "explanation": "Reducing wear is what oil does, but the W in the rating refers to cold-weather performance, not wear protection."
              }
            ]
          },
          {
            "id": "AS2-007",
            "text": "Which exhaust component reduces harmful pollutants by chemically changing them into less harmful gases?",
            "options": [
              {
                "text": "The muffler",
                "explanation": "The muffler is in the exhaust system, but its job is to reduce noise, not pollution."
              },
              {
                "text": "The catalytic converter",
                "explanation": "Correct! The catalytic converter uses chemical reactions to convert pollutants such as carbon monoxide and unburned fuel into less harmful gases.",
                "correct": true
              },
              {
                "text": "The exhaust manifold",
                "explanation": "The manifold simply collects exhaust gases from the cylinders into one pipe; it does not clean them."
              },
              {
                "text": "The tailpipe",
                "explanation": "The tailpipe just releases the gases behind the vehicle after the other components have done their work."
              }
            ]
          },
          {
            "id": "AS2-008",
            "text": "Which component circulates coolant through the engine and radiator?",
            "options": [
              {
                "text": "The oil pump",
                "explanation": "The oil pump circulates engine oil for lubrication, not coolant. Watch out for pump mix-ups on the test."
              },
              {
                "text": "The thermostat",
                "explanation": "The thermostat acts like a valve that opens and closes, but it does not push the coolant through the system."
              },
              {
                "text": "The radiator cap",
                "explanation": "The radiator cap holds pressure in the cooling system, which raises the coolant's boiling point, but it does not move the coolant."
              },
              {
                "text": "The water pump",
                "explanation": "Correct! The water pump forces coolant through the engine's water jackets and out to the radiator, keeping the heat moving away from the engine.",
                "correct": true
              }
            ]
          }
        ],
        "quizConfig": {
          "questionsPerQuiz": 6
        }
      },
      {
        "id": "AS-3",
        "title": "Electrical and Starting Systems",
        "description": "Learn how the battery, starter, and alternator work together to start the engine and keep everything powered, and how to diagnose common electrical problems.",
        "lesson": {
          "intro": "Every crank of the key and every glowing dash light depends on the vehicle's electrical system. The ASVAB loves to ask how the battery, starter, and alternator work together, and these are also the systems most likely to leave a vehicle dead in a parking lot. Master this chapter and you will pick up easy points on test day and real-world skills you can use immediately.",
          "concepts": [
            {
              "title": "The 12-Volt Battery",
              "content": "The battery is the vehicle's electrical storage tank. A standard automotive battery is a 12-volt lead-acid battery made of six cells, each producing about 2.1 volts, so a fully charged battery actually reads around 12.6 volts. Inside, lead plates sit in an electrolyte solution of sulfuric acid and water, and a chemical reaction between them produces electricity. The battery's main job is to supply the large burst of current needed to crank the starter motor, and it also powers lights and accessories when the engine is off. A rating called cold cranking amps (CCA) tells you how much current the battery can deliver in cold weather, when engines are hardest to start."
            },
            {
              "title": "Starter Motor and Solenoid",
              "content": "The starter is a powerful electric motor that spins the engine fast enough for it to fire and run on its own. Because the starter draws hundreds of amps, the ignition switch cannot handle that current directly. Instead, turning the key sends a small signal current to the solenoid, which acts as a heavy-duty relay: it closes the high-current circuit from the battery to the starter and also pushes the starter's small drive gear (the pinion) into mesh with the engine's flywheel ring gear. Once the engine starts, the drive gear pulls back so the running engine does not spin the starter to destruction. A rapid clicking sound when you turn the key usually means the solenoid is working but the battery is too weak to turn the starter."
            },
            {
              "title": "Alternator and the Charging System",
              "content": "Once the engine is running, the alternator takes over as the vehicle's power source. Driven by a belt from the engine, the alternator generates alternating current (AC) and converts it to direct current (DC) using diodes in a rectifier, because the battery and the vehicle's circuits run on DC. The alternator recharges the battery after starting and powers the lights, radio, and other accessories while you drive. A voltage regulator keeps the charging output at roughly 13.5 to 14.5 volts so the battery is not overcharged or undercharged. If the alternator fails, the vehicle runs off the battery alone until it drains, which is why a dead alternator often shows up first as dimming lights and a battery warning light."
            },
            {
              "title": "Fuses, Relays, and Circuit Protection",
              "content": "Fuses are the electrical system's safety devices. Each fuse contains a thin metal strip that melts and breaks the circuit if current rises above the fuse's rating, protecting the wiring from overheating and fire. Fuses are rated in amps, and you should always replace a blown fuse with one of the same rating, because a bigger fuse can let the wiring burn before it blows. Relays are electrically operated switches that let a small control current from a switch operate a high-current device like headlights, a fuel pump, or a horn. If a fuse for the same circuit keeps blowing, that points to a short circuit or overloaded component that needs to be found and fixed, not a bigger fuse."
            },
            {
              "title": "Common Problems and Safe Jump-Starting",
              "content": "Most no-start electrical problems trace back to a dead battery, corroded battery terminals, or a blown fuse. Corrosion looks like white, green, or bluish powder on the terminals and adds resistance that can block current even when the battery is good; cleaning with a wire brush and a baking soda and water solution usually fixes it. To jump-start safely, connect the cables in this order: red clamp to the dead battery's positive terminal, red clamp to the good battery's positive terminal, black clamp to the good battery's negative terminal, and finally the black clamp to a bare metal ground on the dead vehicle's engine block, away from the battery. That last ground connection keeps any spark away from the battery, which can give off flammable hydrogen gas. Disconnect in the reverse order once the dead vehicle is running."
            }
          ],
          "examples": [
            {
              "problem": "ASVAB-style question: When the ignition key is turned to START, the driver hears a single click but the engine does not crank. The headlights shine brightly. What is the most likely cause?",
              "steps": [
                "Step 1: Sort the clues. Bright headlights tell you the battery has a good charge, so a dead battery is unlikely.",
                "Step 2: Think about what the click means. The click is the solenoid trying to engage, so the small control circuit from the key is working.",
                "Step 3: Ask what comes after the solenoid. If the solenoid clicks but the engine never turns, the high-current path or the starter motor itself is the weak link.",
                "Step 4: Conclusion: with a strong battery and a clicking solenoid, the most likely cause is a faulty starter motor or a bad high-current connection to it."
              ],
              "tip": "Use the headlights as a quick battery test in these questions: bright lights point away from the battery, dim or dead lights point toward the battery or its connections."
            },
            {
              "problem": "ASVAB-style question: A vehicle starts fine in the morning, but while driving the dash lights dim, the battery warning light comes on, and the engine eventually dies. Which component has most likely failed?",
              "steps": [
                "Step 1: Note that the vehicle started normally, so the battery had enough charge at first.",
                "Step 2: Recall who powers the vehicle while driving. Once the engine runs, the alternator should supply electricity and recharge the battery.",
                "Step 3: Match the symptoms. Dimming lights and a battery warning light while driving mean the vehicle is draining the battery instead of charging it.",
                "Step 4: Conclusion: the alternator (or its drive belt) has failed, so the vehicle ran on battery power alone until the battery went flat."
              ],
              "tip": "Trouble at start-up points to the battery or starter; trouble that develops while driving points to the alternator and charging system."
            },
            {
              "problem": "ASVAB-style question: A 15-amp fuse for the taillight circuit blows. The driver replaces it with a 30-amp fuse, and it does not blow. Why is this dangerous?",
              "steps": [
                "Step 1: Remember what a fuse does. It is sized to melt before the circuit's wiring overheats.",
                "Step 2: Consider the wiring. The taillight wiring was chosen to safely carry about 15 amps, not 30.",
                "Step 3: See the danger. With a 30-amp fuse, a fault can push far more current through the wires than they can handle before the fuse blows.",
                "Step 4: Conclusion: the oversized fuse lets the wiring overheat, which can melt insulation and start a fire. The right fix is to find why the 15-amp fuse blew and repair that fault."
              ],
              "tip": "On the ASVAB, any answer that involves installing a larger fuse or bypassing a fuse is almost always the wrong or unsafe choice."
            }
          ],
          "summary": "The battery stores 12 volts of chemical energy to crank the starter, the solenoid switches that heavy current and engages the starter gear, and the alternator recharges the battery and powers everything once the engine runs. Fuses and relays protect and control the circuits, so never oversize a fuse. When troubleshooting, use the symptoms: dim lights and clicking point to the battery or connections, while problems that appear during driving point to the alternator."
        },
        "questions": [
          {
            "id": "AS3-001",
            "text": "A standard automotive battery contains six cells. What voltage does a fully charged 12-volt battery actually measure?",
            "options": [
              {
                "text": "Exactly 12.0 volts",
                "explanation": "Tempting because we call it a 12-volt battery, but that is a nominal label. A battery resting at 12.0 volts is actually partly discharged."
              },
              {
                "text": "About 6 volts",
                "explanation": "This confuses the number of cells with the voltage. Each of the six cells produces about 2.1 volts, and they add together."
              },
              {
                "text": "About 12.6 volts",
                "explanation": "Correct! Six cells at roughly 2.1 volts each add up to about 12.6 volts when the battery is fully charged.",
                "correct": true
              },
              {
                "text": "About 14.5 volts",
                "explanation": "This is the typical charging system output while the engine is running, not the battery's resting voltage."
              }
            ]
          },
          {
            "id": "AS3-002",
            "text": "What is the main job of the starter solenoid?",
            "options": [
              {
                "text": "It acts as a heavy-duty switch that sends battery current to the starter and engages the starter gear",
                "explanation": "Correct! The solenoid closes the high-current circuit to the starter motor and pushes the drive gear into mesh with the flywheel.",
                "correct": true
              },
              {
                "text": "It converts AC to DC for the battery",
                "explanation": "That is the job of the diodes in the alternator's rectifier, not the solenoid."
              },
              {
                "text": "It keeps the charging voltage between 13.5 and 14.5 volts",
                "explanation": "That describes the voltage regulator in the charging system, not the solenoid."
              },
              {
                "text": "It spins the engine directly to start it",
                "explanation": "The starter motor spins the engine. The solenoid only switches power to the starter and engages its gear."
              }
            ]
          },
          {
            "id": "AS3-003",
            "text": "Once the engine is running, which component supplies electrical power to the vehicle and recharges the battery?",
            "options": [
              {
                "text": "The battery",
                "explanation": "Easy to pick because the battery powers everything before start-up, but while the engine runs the battery is being recharged, not doing the supplying."
              },
              {
                "text": "The starter motor",
                "explanation": "The starter only works during cranking. Once the engine fires, the starter disengages completely."
              },
              {
                "text": "The ignition switch",
                "explanation": "The ignition switch only controls circuits with a small signal current. It does not generate any power."
              },
              {
                "text": "The alternator",
                "explanation": "Correct! The belt-driven alternator generates electricity while the engine runs, powering the accessories and recharging the battery.",
                "correct": true
              }
            ]
          },
          {
            "id": "AS3-004",
            "text": "The alternator produces alternating current, but the vehicle's electrical system needs direct current. What converts the AC to DC?",
            "options": [
              {
                "text": "The voltage regulator",
                "explanation": "Close, since it is part of the charging system, but the regulator controls how much voltage is produced. It does not change AC into DC."
              },
              {
                "text": "Diodes in the rectifier",
                "explanation": "Correct! Diodes allow current to flow in only one direction, so the rectifier assembly converts the alternator's AC output into DC.",
                "correct": true
              },
              {
                "text": "The battery cells",
                "explanation": "The battery stores and releases DC, but it cannot convert AC. Feeding it raw AC would not charge it properly."
              },
              {
                "text": "The starter solenoid",
                "explanation": "The solenoid is just a heavy-duty switch for the starting circuit and has nothing to do with the charging system."
              }
            ]
          },
          {
            "id": "AS3-005",
            "text": "A fuse protects a circuit by doing which of the following when too much current flows?",
            "options": [
              {
                "text": "Its thin metal strip melts and opens the circuit",
                "explanation": "Correct! The fuse element is designed to melt at its rated current, breaking the circuit before the wiring overheats.",
                "correct": true
              },
              {
                "text": "It slows the current down to a safe level",
                "explanation": "This sounds reasonable, but a fuse is not a current limiter. It either passes current normally or fails completely open."
              },
              {
                "text": "It stores the extra electricity until it is needed",
                "explanation": "That describes a battery or capacitor. A fuse cannot store energy."
              },
              {
                "text": "It switches the circuit over to a backup wire",
                "explanation": "There is no backup path. When a fuse blows, the circuit is simply dead until the fuse is replaced."
              }
            ]
          },
          {
            "id": "AS3-006",
            "text": "A 10-amp fuse for a circuit keeps blowing. What is the correct action?",
            "options": [
              {
                "text": "Install a 25-amp fuse so it stops blowing",
                "explanation": "Tempting because it stops the symptom, but an oversized fuse lets the wiring carry more current than it can handle, risking melted insulation and fire."
              },
              {
                "text": "Wrap the fuse contacts in foil to keep the circuit working",
                "explanation": "This bypasses the protection entirely and is even more dangerous than an oversized fuse."
              },
              {
                "text": "Find and repair the short circuit or overload, then install another 10-amp fuse",
                "explanation": "Correct! A repeatedly blowing fuse is a symptom of a fault in the circuit. Fix the cause, then use a fuse of the original rating.",
                "correct": true
              },
              {
                "text": "Disconnect the battery ground cable while driving",
                "explanation": "This does not address the fault, and disconnecting the battery on a running vehicle can damage electronic components."
              }
            ]
          },
          {
            "id": "AS3-007",
            "text": "Turning the key produces a rapid clicking sound and the engine does not crank. The dash lights are dim. What is the most likely cause?",
            "options": [
              {
                "text": "A blown headlight fuse",
                "explanation": "A blown fuse would kill one circuit entirely. It would not cause clicking and dim dash lights across the vehicle."
              },
              {
                "text": "A weak or discharged battery",
                "explanation": "Correct! Rapid clicking means the solenoid engages but there is not enough current to spin the starter, and dim dash lights confirm low battery power.",
                "correct": true
              },
              {
                "text": "A failed alternator only, with a fully charged battery",
                "explanation": "A fully charged battery would still crank the engine even if the alternator were dead. The dim lights show the battery itself is low."
              },
              {
                "text": "Worn spark plugs",
                "explanation": "Worn plugs can cause misfires or hard starting, but the starter would still crank the engine normally. This problem is electrical supply, not ignition."
              }
            ]
          },
          {
            "id": "AS3-008",
            "text": "When jump-starting a vehicle, where should the final cable clamp be connected?",
            "options": [
              {
                "text": "To the dead battery's negative terminal",
                "explanation": "This is the tempting textbook-sounding spot, but connecting the last clamp at the battery can spark right next to flammable hydrogen gas the battery may give off."
              },
              {
                "text": "To the dead battery's positive terminal",
                "explanation": "The positive terminals are connected first with the red cable, not last, and never with the black ground cable."
              },
              {
                "text": "To the good battery's positive terminal",
                "explanation": "This is one of the first connections in the sequence, made with the red cable, not the final one."
              },
              {
                "text": "To a bare metal ground on the dead vehicle's engine, away from the battery",
                "explanation": "Correct! Making the final connection on the engine block away from the battery keeps any spark away from hydrogen gas the battery can release.",
                "correct": true
              }
            ]
          }
        ],
        "quizConfig": {
          "questionsPerQuiz": 6
        }
      },
      {
        "id": "AS-4",
        "title": "Brakes, Suspension, and Drivetrain",
        "description": "Learn how a vehicle stops, rides smoothly, steers straight, and delivers engine power to the wheels.",
        "lesson": {
          "intro": "An engine makes power, but that power is useless until it reaches the wheels, and dangerous unless you can stop it. This chapter covers the systems that control a vehicle: brakes that stop it, suspension that keeps the tires planted, steering that points it, and the drivetrain that moves it. These topics show up constantly on the Auto Information portion of the ASVAB, and the good news is they follow simple, logical rules you can master quickly.",
          "concepts": [
            {
              "title": "Hydraulic Brakes: Pressure Does the Work",
              "content": "Modern brakes are hydraulic, which means they use fluid pressure instead of cables or rods to apply braking force. When you press the brake pedal, a piston in the master cylinder pushes brake fluid through steel lines to each wheel. Because liquid does not compress, the pressure you create at the pedal arrives at the wheels almost instantly and with multiplied force. Brake fluid must be kept clean and full because it absorbs moisture over time, and water in the fluid can boil under hard braking and cause a spongy pedal or brake fade. A low fluid level or air trapped in the lines also makes the pedal feel soft, which is why mechanics bleed brakes to remove air."
            },
            {
              "title": "Disc vs Drum Brakes",
              "content": "There are two common brake designs. Disc brakes use a caliper that squeezes flat friction pads against a spinning rotor, much like squeezing a spinning plate between your fingers. Drum brakes use curved friction shoes that press outward against the inside of a rotating drum. Disc brakes cool better and resist fade, so they are used on the front wheels of nearly all vehicles, where most braking force is needed. Drum brakes are cheaper and are still found on the rear wheels of some vehicles. Remember the vocabulary: pads go with discs and rotors, shoes go with drums."
            },
            {
              "title": "ABS: Anti-lock Braking",
              "content": "An anti-lock braking system, or ABS, prevents the wheels from locking up and skidding during hard braking. Wheel speed sensors watch each wheel, and if one is about to stop turning while the vehicle is still moving, the ABS computer rapidly releases and reapplies brake pressure to that wheel, many times per second. A rolling tire grips the road better than a skidding one, so ABS lets the driver keep steering control during a panic stop. When ABS activates, the driver may feel a pulsing in the pedal, and that is normal. The correct technique with ABS is to press the pedal firmly and hold it, not to pump it."
            },
            {
              "title": "Suspension and Steering: Springs, Shocks, and Alignment",
              "content": "The suspension connects the wheels to the body and keeps the tires pressed against the road over bumps. Springs, which may be coil springs or leaf springs, support the vehicle weight and absorb bumps. Shock absorbers dampen the bouncing of the springs so the vehicle settles quickly instead of bobbing down the road; worn shocks cause excessive bouncing. A strut combines a shock absorber and a coil spring into one compact assembly. Wheel alignment describes the angles of the wheels: toe is whether the front edges of the tires point inward or outward when viewed from above, and camber is the inward or outward tilt of the top of the tire when viewed from the front. Bad alignment causes uneven tire wear and a vehicle that pulls to one side."
            },
            {
              "title": "The Drivetrain: From Engine to Wheels",
              "content": "The drivetrain carries engine power to the wheels. In a manual transmission vehicle, a clutch lets the driver connect and disconnect the engine from the transmission so gears can be changed; an automatic transmission uses a fluid coupling called a torque converter and shifts gears on its own. The transmission provides different gear ratios, giving high force for starting off and efficient cruising at speed. In a rear-wheel drive vehicle, a driveshaft carries power from the transmission back to the differential, a gearbox that turns the power ninety degrees, splits it between the two axles, and allows the outer wheel to spin faster than the inner wheel in turns. Front-wheel drive vehicles combine the transmission and differential into one unit called a transaxle, while four-wheel drive and all-wheel drive systems use a transfer case or extra differentials to power all four wheels for better traction."
            }
          ],
          "examples": [
            {
              "problem": "A driver notices the brake pedal feels soft and spongy and travels farther than normal before the brakes grab. What is the most likely cause?",
              "steps": [
                "Recall how hydraulic brakes work: the pedal pushes fluid, and fluid does not compress, so a healthy system feels firm.",
                "Ask what could make the pedal feel soft. Something in the system must be compressing or leaking.",
                "Air compresses easily, so air trapped in the brake lines is the classic cause of a spongy pedal. A fluid leak or very low fluid can produce the same symptom.",
                "Worn pads or a stuck caliper would cause noise or pulling, not a spongy pedal, so the best answer is air in the hydraulic lines."
              ],
              "tip": "On the ASVAB, spongy or soft pedal almost always points to air in the brake lines or low fluid. Firm pedal problems point to mechanical parts like pads and rotors."
            },
            {
              "problem": "In a rear-wheel drive car making a turn, the outside rear wheel must travel farther than the inside wheel. Which component makes this possible?",
              "steps": [
                "Trace the power path for rear-wheel drive: engine, transmission, driveshaft, then a gearbox at the rear axle.",
                "In a turn, the outer wheel covers a longer arc than the inner wheel, so the two drive wheels must be allowed to rotate at different speeds.",
                "The component that splits power between the two axles while letting them turn at different speeds is the differential.",
                "The driveshaft only carries power rearward, and the transmission only changes gear ratios, so the answer is the differential."
              ],
              "tip": "Differential and different come from the same root. If a question mentions wheels turning at different speeds in a corner, the answer is the differential."
            },
            {
              "problem": "After hitting a bump, a truck continues to bounce up and down several times before settling. Which part has most likely failed?",
              "steps": [
                "Separate the two jobs in the suspension: springs support the weight and absorb the bump, while shock absorbers dampen the bouncing afterward.",
                "The truck still absorbed the bump and did not sag, so the springs are doing their job.",
                "The problem is that the bouncing continues instead of settling quickly, which is exactly what shock absorbers are supposed to prevent.",
                "Worn or leaking shock absorbers are the most likely cause."
              ],
              "tip": "A quick memory hook: springs spring, shocks stop the springing. Repeated bouncing means bad shocks; sagging on one corner means a bad spring."
            }
          ],
          "summary": "Brakes use incompressible hydraulic fluid to multiply pedal force, with pads on discs, shoes in drums, and ABS preventing skids. Springs carry the load while shocks stop the bounce, and alignment angles like toe and camber keep tires wearing evenly. Power flows from the engine through the clutch or torque converter, the transmission, the driveshaft, and the differential to the axles, and knowing that path in order will earn you points on test day."
        },
        "questions": [
          {
            "id": "AS4-001",
            "text": "In a hydraulic brake system, which component converts the driver's pedal force into fluid pressure?",
            "options": [
              {
                "text": "The brake caliper",
                "explanation": "The caliper is at the wheel end of the system. It receives fluid pressure and squeezes the pads against the rotor, but it does not create the pressure."
              },
              {
                "text": "The master cylinder",
                "explanation": "Correct! When the driver presses the pedal, a piston in the master cylinder pushes brake fluid into the lines, creating the hydraulic pressure that applies the brakes at each wheel.",
                "correct": true
              },
              {
                "text": "The brake rotor",
                "explanation": "The rotor is the spinning disc the pads grip. It handles friction and heat, not fluid pressure."
              },
              {
                "text": "The wheel speed sensor",
                "explanation": "Wheel speed sensors are part of the ABS. They only report how fast each wheel is turning and have nothing to do with generating pressure."
              }
            ]
          },
          {
            "id": "AS4-002",
            "text": "Which pair correctly matches brake friction parts to their brake type?",
            "options": [
              {
                "text": "Shoes with disc brakes, pads with drum brakes",
                "explanation": "This is the classic reversed answer the test hopes you will pick. It swaps the two terms."
              },
              {
                "text": "Pads with drum brakes, rotors with shoes",
                "explanation": "Pads do not belong in drum brakes, and rotors are the discs themselves, not friction material for shoes."
              },
              {
                "text": "Pads with disc brakes, shoes with drum brakes",
                "explanation": "Correct! Disc brakes squeeze flat pads against a rotor, while drum brakes push curved shoes outward against the inside of a drum.",
                "correct": true
              },
              {
                "text": "Shoes with both disc and drum brakes",
                "explanation": "Shoes are only used in drum brakes. Disc brakes always use flat friction pads held by a caliper."
              }
            ]
          },
          {
            "id": "AS4-003",
            "text": "What is the main purpose of an anti-lock braking system (ABS)?",
            "options": [
              {
                "text": "To make the vehicle stop in a shorter distance on dry pavement in all cases",
                "explanation": "This is tempting because ABS often helps, but its primary job is not shorter stops. On some loose surfaces stopping distance can even increase slightly."
              },
              {
                "text": "To reduce wear on the brake pads",
                "explanation": "ABS does nothing to slow pad wear. Pad wear depends on driving habits and brake use."
              },
              {
                "text": "To boost pedal force so the driver does not have to press as hard",
                "explanation": "That describes the power brake booster, a separate vacuum or hydraulic assist device, not ABS."
              },
              {
                "text": "To prevent the wheels from locking so the driver keeps steering control",
                "explanation": "Correct! ABS rapidly releases and reapplies brake pressure to keep the wheels rolling instead of skidding, because a rolling tire grips and steers better than a locked one.",
                "correct": true
              }
            ]
          },
          {
            "id": "AS4-004",
            "text": "A vehicle bounces excessively and continues to rock after going over a bump. The most likely worn component is the:",
            "options": [
              {
                "text": "Shock absorbers",
                "explanation": "Correct! Shock absorbers dampen the motion of the springs. When they wear out, the springs keep oscillating and the vehicle bounces repeatedly after bumps.",
                "correct": true
              },
              {
                "text": "Coil springs",
                "explanation": "A broken or weak spring makes the vehicle sag or sit low on one corner. The springs are what cause bouncing, not what stop it."
              },
              {
                "text": "Brake pads",
                "explanation": "Worn pads cause squealing or longer stops. They have no effect on how the body moves over bumps."
              },
              {
                "text": "Differential",
                "explanation": "The differential splits power between the drive wheels. It is part of the drivetrain and has nothing to do with ride motion."
              }
            ]
          },
          {
            "id": "AS4-005",
            "text": "When viewed from the front of the vehicle, the inward or outward tilt of the top of a tire is called:",
            "options": [
              {
                "text": "Toe",
                "explanation": "Toe is measured looking down from above and describes whether the front edges of the tires point in or out, not how the tire tilts."
              },
              {
                "text": "Camber",
                "explanation": "Correct! Camber is the tilt of the tire from vertical as seen from the front. Too much camber in either direction wears one edge of the tread.",
                "correct": true
              },
              {
                "text": "Torque",
                "explanation": "Torque is twisting force, a measure of engine output or bolt tightening. It is not an alignment angle."
              },
              {
                "text": "Backlash",
                "explanation": "Backlash is the small clearance between meshing gear teeth, a gear term rather than a wheel alignment angle."
              }
            ]
          },
          {
            "id": "AS4-006",
            "text": "In a manual transmission vehicle, what does the clutch do?",
            "options": [
              {
                "text": "It multiplies engine torque using fluid",
                "explanation": "Using fluid to transfer and multiply torque describes the torque converter in an automatic transmission, not a manual clutch."
              },
              {
                "text": "It splits power between the left and right wheels",
                "explanation": "Splitting power between the drive wheels is the job of the differential, not the clutch."
              },
              {
                "text": "It connects and disconnects the engine from the transmission so gears can be changed",
                "explanation": "Correct! Pressing the clutch pedal separates the engine from the transmission, interrupting power flow so the driver can shift gears smoothly.",
                "correct": true
              },
              {
                "text": "It locks the transmission in park",
                "explanation": "A parking pawl or parking brake holds a stopped vehicle. The clutch cannot lock anything; it only couples or uncouples the engine."
              }
            ]
          },
          {
            "id": "AS4-007",
            "text": "In a rear-wheel drive car, which component carries power from the transmission to the rear differential?",
            "options": [
              {
                "text": "The axle shafts",
                "explanation": "Axle shafts run from the differential out to each wheel. They are the last link, not the connection back from the transmission."
              },
              {
                "text": "The transfer case",
                "explanation": "A transfer case appears in four-wheel drive vehicles to split power between front and rear. A basic rear-wheel drive car does not have one."
              },
              {
                "text": "The driveshaft",
                "explanation": "Correct! The driveshaft is the long rotating shaft that runs under the vehicle, carrying power from the transmission back to the differential at the rear axle.",
                "correct": true
              },
              {
                "text": "The timing chain",
                "explanation": "The timing chain lives inside the engine and links the crankshaft to the camshaft. It never leaves the engine."
              }
            ]
          },
          {
            "id": "AS4-008",
            "text": "Which statement about drive configurations is TRUE?",
            "options": [
              {
                "text": "Front-wheel drive vehicles typically combine the transmission and differential into a single transaxle",
                "explanation": "Correct! With the engine and drive wheels at the same end, front-wheel drive vehicles package the transmission and differential together in one unit called a transaxle.",
                "correct": true
              },
              {
                "text": "Rear-wheel drive vehicles do not need a differential",
                "explanation": "Every configuration with two driven wheels on an axle needs a differential so the wheels can turn at different speeds in corners. Rear-wheel drive cars have one at the rear axle."
              },
              {
                "text": "Four-wheel drive vehicles use one wheel to power the other three",
                "explanation": "This may sound plausible, but four-wheel drive delivers engine power to all four wheels through a transfer case and differentials; no wheel powers another wheel."
              },
              {
                "text": "A transfer case is standard equipment on all front-wheel drive cars",
                "explanation": "Transfer cases belong to four-wheel drive and all-wheel drive systems. A plain front-wheel drive car sends power only to the front wheels and has no transfer case."
              }
            ]
          }
        ],
        "quizConfig": {
          "questionsPerQuiz": 6
        }
      },
      {
        "id": "AS-5",
        "title": "Hand Tools and Power Tools",
        "description": "Learn to identify the major families of hand and power tools - wrenches, screwdrivers, pliers, hammers, saws, files, and drills - and match the right tool to the job.",
        "lesson": {
          "intro": "Walk into any motor pool or shop and you will see the same core tools, because each one was designed to do a specific job well. The Shop Information portion of the ASVAB loves to ask which tool fits which task, so learning to recognize tools and their purposes is some of the easiest points you can earn. This chapter gives you a guided tour of the toolbox, family by family.",
          "concepts": [
            {
              "title": "The Wrench Family: Gripping Nuts and Bolts",
              "content": "Wrenches turn nuts and bolts, and each style trades speed for grip. An open-end wrench has U-shaped jaws that slide onto a fastener from the side, which is handy in tight spots but grips only two flats and can slip. A box-end wrench fully surrounds the fastener, gripping all six corners, so it is much less likely to round off a tight nut. A socket wrench uses a ratcheting handle with interchangeable sockets, letting you turn a fastener quickly without lifting the tool off after each swing. A torque wrench tightens a fastener to a precise, measured amount of twisting force, which matters on parts like cylinder head bolts or wheel lug nuts. Allen wrenches, also called hex keys, are L-shaped bars that fit into fasteners with six-sided recessed heads."
            },
            {
              "title": "Screwdrivers: Match the Tip to the Screw",
              "content": "A screwdriver only works well when its tip matches the screw head. Flat-head, also called slotted, screwdrivers fit screws with a single straight slot. Phillips screwdrivers have a cross-shaped tip that fits the X-shaped recess in Phillips screws, and the cross shape helps keep the tip centered. Using a tip that is too small or the wrong type strips the screw head, meaning the recess gets torn up so no driver can grip it. The rule is simple: use the largest tip that fully fills the screw recess, and push in firmly while you turn."
            },
            {
              "title": "The Pliers Family: Gripping, Bending, and Holding",
              "content": "Pliers grip, bend, and hold objects, and the family has several specialists. Slip-joint pliers are the common general-purpose pliers with a pivot that slides between two positions so the jaws can open wider. Needle-nose pliers have long, thin, pointed jaws for reaching into tight spaces and gripping small parts or bending wire. Channel-lock style pliers, properly called tongue-and-groove pliers, have angled jaws and multiple adjustment channels so they can grip large pipes and fittings. Locking pliers, often called by the brand name Vise-Grips, clamp onto an object and lock in place, working like a hand-held vise that frees up your hands. Remember that pliers grip - they should not be used as a wrench on good nuts and bolts because their teeth chew up the corners."
            },
            {
              "title": "Hammers: Striking Tools for Different Materials",
              "content": "Hammers are matched to what they strike. The claw hammer is the carpenter's tool: one face drives nails and the curved claw on the back pulls them out of wood. The ball-peen hammer is the metalworker's hammer, with a flat face for striking punches and chisels and a rounded peen end for shaping and peening metal, such as rounding over a rivet. A sledgehammer is a heavy, long-handled hammer swung with two hands for demolition and driving stakes. A mallet has a soft head of rubber, wood, or plastic, used when you need to strike a surface without denting or marring it, like tapping a wood joint together or seating a hubcap."
            },
            {
              "title": "Saws: Which Blade Cuts What",
              "content": "Saw questions usually come down to matching the saw to the material or the type of cut. In woodworking, a crosscut saw cuts across the grain of the wood, while a rip saw cuts along, or with, the grain and has fewer, more aggressive, chisel-like teeth. A hacksaw has a fine-toothed replaceable blade held in a frame and is the standard saw for cutting metal, such as pipe, bolts, and bar stock. A coping saw has a very thin blade in a deep U-shaped frame, made for cutting tight curves and intricate shapes in wood. A miter saw, whether a hand saw used with a miter box or a power version, cuts precise angles, such as the 45 degree cuts needed for picture frames and trim molding."
            },
            {
              "title": "Files, Chisels, Drills, and Measuring Tools",
              "content": "Files smooth and shape material by shaving off small amounts with rows of hardened teeth; they cut on the push stroke, so lift the file on the return. Chisels are struck with a hammer to cut material: wood chisels have a sharp beveled edge for shaping wood, while cold chisels are all-steel tools for cutting unheated metal. Drills spin bits to bore holes: twist bits handle wood and metal, spade bits bore large holes in wood fast, and masonry bits with hardened carbide tips handle brick and concrete. For measuring and marking, the tape measure gives length, the square checks and marks 90 degree angles, and the level uses a bubble in a liquid-filled vial to show whether a surface is level, meaning horizontal, or plumb, meaning vertical. A center punch makes a small dimple in metal so a drill bit starts exactly where you want it instead of wandering. The common thread through this whole chapter is matching the tool to the job - the right tool works better and keeps you and the workpiece safe."
            }
          ],
          "examples": [
            {
              "problem": "ASVAB-style question: A mechanic must tighten cylinder head bolts to exactly the amount of force specified by the engine manufacturer. Which tool should be used?",
              "steps": [
                "Identify the key requirement in the question: the bolts must be tightened to a precise, specified amount of force, not just made tight.",
                "Think through the wrench family. Open-end, box-end, and socket wrenches all tighten fasteners, but none of them measures how much force you are applying.",
                "Recall that a torque wrench is the one wrench designed to measure and limit twisting force, often clicking or reading out when the set value is reached.",
                "Choose the torque wrench as the answer."
              ],
              "tip": "Whenever a question mentions a specification, an exact amount of tightness, or manufacturer settings, the answer is almost always the torque wrench."
            },
            {
              "problem": "ASVAB-style question: Which saw is best suited for cutting a curved decorative shape in a thin piece of wood?",
              "steps": [
                "Note the two requirements: the cut is curved, and the material is thin wood.",
                "Eliminate the straight-cut saws. Crosscut and rip saws have wide blades that cannot turn, and a hacksaw is meant for metal.",
                "Recall that cutting curves requires a very thin, narrow blade that can change direction as it cuts.",
                "The coping saw, with its thin blade held in a deep U-shaped frame, is built exactly for tight curves in wood, so it is the answer."
              ],
              "tip": "Match blade shape to cut shape: thin narrow blades like the coping saw follow curves, while wide stiff blades keep cuts straight."
            },
            {
              "problem": "ASVAB-style question: Before drilling a hole in a steel plate, a machinist strikes a small dimple at the marked spot. What tool makes this dimple, and why?",
              "steps": [
                "Picture the problem: a spinning drill bit touching smooth steel tends to skate sideways away from the mark before it bites.",
                "Recall the marking tools from this chapter: tape measure, square, level, and punch.",
                "The center punch is the pointed tool struck with a hammer to make a small dimple in metal.",
                "The dimple cradles the tip of the drill bit so it starts cutting exactly on the mark instead of wandering, so the answer is the center punch."
              ],
              "tip": "Punch questions are about drill accuracy on metal. If the question mentions keeping a drill bit from wandering or walking, think center punch."
            }
          ],
          "summary": "Every tool family has specialists: box-end and socket wrenches grip fasteners securely, a torque wrench measures tightening force, each saw matches a material or cut shape, and hammers are chosen by what they strike. On the ASVAB, read the job described in the question first, then pick the tool designed for exactly that job. Knowing these matchups cold turns Shop Information questions into quick, confident points."
        },
        "questions": [
          {
            "id": "AS5-001",
            "text": "Which wrench is LEAST likely to slip and round off the corners of a tight nut?",
            "options": [
              {
                "text": "Open-end wrench",
                "explanation": "An open-end wrench is easy to slide onto a nut from the side, but it grips only two flats of the nut, so it is the wrench most likely to slip under heavy force."
              },
              {
                "text": "Box-end wrench",
                "explanation": "Correct! A box-end wrench completely surrounds the nut and grips all six corners, giving it the most secure hold and the least chance of slipping or rounding the fastener.",
                "correct": true
              },
              {
                "text": "Adjustable wrench",
                "explanation": "An adjustable wrench is convenient because it fits many sizes, but its movable jaw can flex and loosen, making it more likely to slip than a fixed wrench."
              },
              {
                "text": "Pipe wrench",
                "explanation": "A pipe wrench has aggressive teeth made to bite into round pipe. Using it on a nut chews up the corners rather than protecting them."
              }
            ]
          },
          {
            "id": "AS5-002",
            "text": "A repair manual says a wheel lug nut must be tightened to a specific amount of force. Which tool should be used?",
            "options": [
              {
                "text": "Socket wrench with a long handle",
                "explanation": "A long handle gives you plenty of leverage to make the nut very tight, but it gives no way to measure how much force you are applying."
              },
              {
                "text": "Box-end wrench",
                "explanation": "A box-end wrench grips the nut securely, but like most wrenches it cannot tell you when you have reached the specified tightness."
              },
              {
                "text": "Torque wrench",
                "explanation": "Correct! A torque wrench measures the twisting force applied to a fastener and signals when the preset value is reached, which is exactly what a manufacturer specification requires.",
                "correct": true
              },
              {
                "text": "Locking pliers",
                "explanation": "Locking pliers clamp onto objects to hold them; their teeth would damage the lug nut and they cannot measure force at all."
              }
            ]
          },
          {
            "id": "AS5-003",
            "text": "Which pliers are best for gripping a small wire connector deep inside a tight space?",
            "options": [
              {
                "text": "Slip-joint pliers",
                "explanation": "Slip-joint pliers are good general-purpose grippers, but their short, wide jaws cannot reach into cramped spaces."
              },
              {
                "text": "Tongue-and-groove (channel-lock) pliers",
                "explanation": "These pliers are built for gripping large items like pipes and fittings; they are too bulky for delicate work in a confined area."
              },
              {
                "text": "Locking pliers",
                "explanation": "Locking pliers clamp and hold like a vise, which is useful, but their jaws are broad and they are not designed for reaching small parts in tight quarters."
              },
              {
                "text": "Needle-nose pliers",
                "explanation": "Correct! Needle-nose pliers have long, thin, pointed jaws made precisely for reaching into tight spots and gripping small parts and wires.",
                "correct": true
              }
            ]
          },
          {
            "id": "AS5-004",
            "text": "A ball-peen hammer is most commonly used for which type of work?",
            "options": [
              {
                "text": "Driving and pulling nails in wood framing",
                "explanation": "Driving and pulling nails is the job of the claw hammer, which has a curved claw on the back specifically for removing nails."
              },
              {
                "text": "Metalworking tasks such as striking chisels and shaping metal",
                "explanation": "Correct! The ball-peen hammer is the metalworker's hammer: its flat face strikes punches and cold chisels, and its rounded peen end shapes and peens metal, such as rounding rivets.",
                "correct": true
              },
              {
                "text": "Tapping parts together without marring the surface",
                "explanation": "Striking a surface without denting it calls for a mallet, which has a soft rubber, wood, or plastic head. A steel ball-peen face would leave marks."
              },
              {
                "text": "Breaking up concrete and driving stakes",
                "explanation": "Heavy demolition and stake driving are jobs for a sledgehammer, a large two-handed hammer with a long handle."
              }
            ]
          },
          {
            "id": "AS5-005",
            "text": "Which saw should be used to cut a steel bolt down to a shorter length?",
            "options": [
              {
                "text": "Coping saw",
                "explanation": "A coping saw has a thin blade for cutting curves in wood; its blade is not made to stand up to cutting steel."
              },
              {
                "text": "Rip saw",
                "explanation": "A rip saw cuts wood along the grain with large chisel-like teeth. Those teeth would dull almost instantly on steel."
              },
              {
                "text": "Hacksaw",
                "explanation": "Correct! The hacksaw holds a fine-toothed metal-cutting blade in a rigid frame and is the standard hand saw for cutting bolts, pipe, and other metal stock.",
                "correct": true
              },
              {
                "text": "Crosscut saw",
                "explanation": "A crosscut saw is a wood saw designed to cut across the grain of lumber, not through metal."
              }
            ]
          },
          {
            "id": "AS5-006",
            "text": "What is the main difference between a crosscut saw and a rip saw?",
            "options": [
              {
                "text": "A crosscut saw cuts across the wood grain, while a rip saw cuts along the grain",
                "explanation": "Correct! Crosscut saws have teeth shaped to slice cleanly across the grain, while rip saws have fewer, chisel-like teeth that cut efficiently along, or with, the grain.",
                "correct": true
              },
              {
                "text": "A crosscut saw cuts metal, while a rip saw cuts wood",
                "explanation": "Both crosscut and rip saws are wood saws. The common hand saw for metal is the hacksaw."
              },
              {
                "text": "A crosscut saw cuts curves, while a rip saw cuts straight lines",
                "explanation": "Both saws have wide blades meant for straight cuts. Cutting curves in wood is the job of a coping saw with its thin, narrow blade."
              },
              {
                "text": "A crosscut saw is powered, while a rip saw is a hand tool",
                "explanation": "Both terms describe the tooth design and cutting direction, not the power source. Either style of cut can be made by hand saws or power saws."
              }
            ]
          },
          {
            "id": "AS5-007",
            "text": "Why does a machinist use a center punch on a piece of metal before drilling?",
            "options": [
              {
                "text": "To harden the metal so the drill cuts faster",
                "explanation": "A punch does not harden metal in any useful way for drilling; it simply displaces a small dimple of material at the mark."
              },
              {
                "text": "To measure the exact depth the hole should be drilled",
                "explanation": "A punch cannot measure depth. Hole depth is controlled with a depth stop or by measuring the bit, not by punching."
              },
              {
                "text": "To make a dimple that keeps the drill bit from wandering off the mark",
                "explanation": "Correct! The small dimple made by a center punch cradles the tip of the drill bit so it starts cutting exactly on the marked spot instead of skating across the smooth metal.",
                "correct": true
              },
              {
                "text": "To check whether the surface is level before drilling",
                "explanation": "Checking whether a surface is level is the job of a level with its bubble vial, not a punch."
              }
            ]
          },
          {
            "id": "AS5-008",
            "text": "Which tool has a soft head and is used to strike parts together without damaging their surfaces?",
            "options": [
              {
                "text": "Claw hammer",
                "explanation": "A claw hammer has a hard steel face for driving nails; striking a finished surface with it would leave dents."
              },
              {
                "text": "Sledgehammer",
                "explanation": "A sledgehammer delivers heavy two-handed blows for demolition and driving stakes. It is far too harsh for delicate assembly work."
              },
              {
                "text": "Cold chisel",
                "explanation": "A cold chisel is not a striking tool at all - it is the tool that gets struck by a hammer in order to cut unheated metal."
              },
              {
                "text": "Mallet",
                "explanation": "Correct! A mallet has a soft head of rubber, wood, or plastic, so it can tap parts into place - like wood joints or trim pieces - without denting or marring the surface.",
                "correct": true
              }
            ]
          }
        ],
        "quizConfig": {
          "questionsPerQuiz": 6
        }
      },
      {
        "id": "AS-6",
        "title": "Fasteners, Materials, and Shop Processes",
        "description": "Learn how bolts, screws, nuts, rivets, and welds hold things together, which metals are used where, and the shop processes and safety habits every technician relies on.",
        "lesson": {
          "intro": "Almost everything in a vehicle or a workshop is held together by fasteners or joined by heat, so knowing your bolts from your screws is real-world power. The ASVAB Auto and Shop section loves questions about fasteners, metals, and basic shop processes because they show you can think like a mechanic. Master this chapter and you will pick up some of the easiest points on the whole test.",
          "concepts": [
            {
              "title": "Bolts, Screws, and Studs",
              "content": "A bolt passes through a hole in the parts being joined and is tightened with a nut on the other end, so the bolt itself usually does not cut threads into the material. A screw, by contrast, threads directly into the material or into a threaded hole, holding by its own threads without needing a nut. A stud is a rod threaded on both ends with no head at all: one end screws permanently into a part, and the other end takes a nut. Studs are common on engine blocks, where exhaust manifolds and cylinder heads are clamped down over them. If you remember bolt-plus-nut, screw-into-material, and stud-threaded-both-ends, you can answer most fastener identification questions."
            },
            {
              "title": "Nuts and Washers",
              "content": "A nut is the internally threaded partner that tightens onto a bolt or stud to clamp parts together. Washers go under the nut or bolt head and come in two main types you must keep straight. A flat washer spreads the clamping load over a wider area so the fastener does not dig into or crush the surface. A lock washer, often a split spring ring or a toothed star shape, digs in and keeps tension on the joint so vibration cannot loosen the nut. Special nuts help too: a castle nut has slots for a cotter pin so it physically cannot spin off, and a nylon insert lock nut grips the bolt threads to resist vibration."
            },
            {
              "title": "Thread Basics: Pitch, Taps, and Dies",
              "content": "Threads are the spiral ridges that let fasteners grip, and pitch describes their spacing. In the inch system, threads are counted per inch, so coarse threads have fewer threads per inch and fine threads have more; in metric, pitch is the distance in millimeters between adjacent threads. A thread pitch gauge lets you match an unknown fastener to the right nut or hole. Two cutting tools matter here and are a classic ASVAB pair: a tap cuts internal threads inside a drilled hole, while a die cuts external threads on the outside of a rod or bolt. Remember it this way: you tap into a hole, and a die wraps around a rod."
            },
            {
              "title": "Rivets, and Nails Versus Screws",
              "content": "A rivet is a permanent fastener: a metal pin is inserted through the parts, and its tail is deformed or bucked over so it cannot come back out, which is why removing a rivet means drilling it out. Rivets are strong in shear and are used in aircraft skins, ductwork, and sheet metal. Nails are driven by a hammer and hold mostly by friction, which makes them fast to install but easier to pull out. Screws hold by their threads gripping the material, so they resist pulling out far better than nails and can be removed and reinstalled without destroying the joint. When a question asks which fastener has the best withdrawal or holding power in wood, the answer is the screw."
            },
            {
              "title": "Joining Metal: Welding, Brazing, and Soldering",
              "content": "Welding, brazing, and soldering all join metal, but the key difference is temperature and whether the base metal melts. In welding, the base metals themselves melt and fuse together, often with added filler, producing the strongest joint. In brazing and soldering, only the filler metal melts and flows into the joint, while the base metals stay solid; brazing uses a higher temperature filler such as a brass alloy, and soldering uses a low melting filler, commonly a tin based alloy used for electrical connections and copper plumbing. Flux is used in these processes to clean the metal surfaces and block oxidation so the filler can bond properly. Ranked from hottest and strongest to coolest: welding, then brazing, then soldering."
            },
            {
              "title": "Common Metals: Ferrous and Non-Ferrous",
              "content": "Ferrous metals contain iron, which makes them strong and usually magnetic but prone to rust; steel, which is iron alloyed with carbon, is the workhorse ferrous metal for frames, tools, and bolts. Non-ferrous metals contain no significant iron, so they resist rust and are generally not magnetic. Aluminum is light, corrosion resistant, and used for wheels, engine parts, and aircraft. Copper is an outstanding electrical conductor, which is why wiring is made from it, and brass is an alloy of copper and zinc that machines easily and resists corrosion, making it common in plumbing fittings and decorative hardware. A quick magnet test in the shop usually separates ferrous from non-ferrous parts, though a few stainless steels are exceptions to the rule."
            }, {
            "title": "Shop Processes and Safety Basics",
            "content": "A few habits separate clean work from ruined parts. Before driving a screw into wood or drilling a large hole in metal, drill a small pilot hole first: it guides the bit or screw, prevents splitting, and keeps the fastener centered. Sandpaper is numbered by grit: low numbers like 60 or 80 are coarse and remove material fast, while high numbers like 220 and up are fine and leave a smooth finish, so you work from coarse to fine. And any time you cut, grind, or hammer, wear eye protection; flying chips cause some of the most common and most preventable shop injuries."
          }
          ],
          "examples": [
            {
              "problem": "ASVAB-style question: A fastener is threaded on both ends and has no head. One end is screwed into an engine block and a nut is tightened on the other end. What is this fastener called?",
              "steps": [
                "Start by eliminating what it cannot be. A bolt has a head on one end, so a headless fastener is not a bolt.",
                "A screw also has a head and threads directly into material by itself, so that does not match either.",
                "Threaded on both ends, no head, one end fixed in the part and the other end taking a nut is the exact definition of a stud.",
                "Answer: it is a stud. Studs are common on engine blocks and exhaust manifolds because they give parts a fixed alignment point."
              ],
              "tip": "On the test, the phrase threaded on both ends is practically a flashing sign that says stud."
            },
            {
              "problem": "ASVAB-style question: A mechanic needs to cut new internal threads in a hole that was just drilled in a steel plate. Which tool should be used?",
              "steps": [
                "Identify what kind of threads are needed. The threads go inside a hole, so they are internal threads.",
                "Recall the tap and die pair: a tap cuts internal threads in a hole, and a die cuts external threads on a rod or bolt.",
                "Since the job is inside a drilled hole, the correct tool is a tap, turned with a tap wrench and usually with cutting oil.",
                "Answer: a tap. If the question had asked about threading the outside of a metal rod, the answer would be a die."
              ],
              "tip": "Memory hook: you tap INto a hole. Tap equals internal, die equals external."
            },
            {
              "problem": "ASVAB-style question: Which metal joining process melts only a low temperature filler metal, leaves the base metals solid, and is commonly used for electrical connections?",
              "steps": [
                "Compare the three joining processes. Welding melts the base metals themselves, so it is out because the question says the base metals stay solid.",
                "Brazing keeps the base metals solid but uses a high temperature filler, so it does not fit the low temperature clue.",
                "Soldering uses a filler that melts at a low temperature, flows into the joint, and is the standard method for joining electrical wires and circuit connections.",
                "Answer: soldering. The mention of electrical connections plus low heat points straight to it."
              ],
              "tip": "Rank them by heat: welding is hottest, brazing is in the middle, soldering is coolest. Electrical work almost always means soldering."
            }
          ],
          "summary": "Fasteners come down to a few clean definitions: bolts take nuts, screws grip by their own threads, studs are threaded on both ends, and lock washers fight vibration while flat washers spread the load. Metal joining is a heat ladder from soldering to brazing to welding, and metals split into ferrous kinds that contain iron and rust versus non-ferrous kinds like aluminum, copper, and brass. Add smart habits like drilling pilot holes, choosing the right sanding grit, and wearing eye protection, and you are thinking like a shop professional."
        },
        "questions": [
          {
            "id": "AS6-001",
            "text": "What is the main difference between a bolt and a screw?",
            "options": [
              {
                "text": "A bolt is always larger than a screw",
                "explanation": "Size is not the defining difference. Bolts and screws both come in many sizes, from tiny to very large."
              },
              {
                "text": "A bolt is typically used with a nut, while a screw threads into the material itself",
                "explanation": "Correct! A bolt passes through the parts and is clamped by a nut, while a screw holds by threading directly into the material or a threaded hole.",
                "correct": true
              },
              {
                "text": "A screw is always made of steel, while a bolt can be any metal",
                "explanation": "Both bolts and screws are made from many materials, including steel, brass, and aluminum. Material does not define them."
              },
              {
                "text": "A bolt has no threads",
                "explanation": "Bolts are definitely threaded; the threads are what the nut tightens onto. A fastener with no threads would be more like a pin or rivet."
              }
            ]
          },
          {
            "id": "AS6-002",
            "text": "Which tool is used to cut internal threads inside a drilled hole?",
            "options": [
              {
                "text": "A die",
                "explanation": "This is the classic mix-up. A die cuts external threads on the outside of a rod or bolt, not inside a hole."
              },
              {
                "text": "A reamer",
                "explanation": "A reamer smooths and enlarges a hole to a precise size, but it does not cut threads."
              },
              {
                "text": "A tap",
                "explanation": "Correct! A tap is turned into a drilled hole to cut internal threads. Remember: tap for internal, die for external.",
                "correct": true
              },
              {
                "text": "A countersink",
                "explanation": "A countersink cuts a cone shaped recess so a screw head sits flush with the surface; it does not cut threads."
              }
            ]
          },
          {
            "id": "AS6-003",
            "text": "What is the main purpose of a lock washer?",
            "options": [
              {
                "text": "To spread the clamping load over a wider surface area",
                "explanation": "That describes a flat washer. It protects the surface, but it does not stop loosening."
              },
              {
                "text": "To make the bolt easier to tighten",
                "explanation": "Washers do not really ease tightening; a lock washer actually adds grip and spring tension rather than reducing effort."
              },
              {
                "text": "To seal the joint against water leaks",
                "explanation": "Sealing is the job of gaskets or sealing washers with rubber, not a standard split or toothed lock washer."
              },
              {
                "text": "To keep the nut from loosening due to vibration",
                "explanation": "Correct! A lock washer keeps spring tension on the joint or bites into the surfaces so vibration cannot back the nut off.",
                "correct": true
              }
            ]
          },
          {
            "id": "AS6-004",
            "text": "In welding, brazing, and soldering, which process actually melts the base metals being joined?",
            "options": [
              {
                "text": "Welding",
                "explanation": "Correct! Welding fuses the base metals by melting them together, often with filler metal added, making the strongest joint of the three.",
                "correct": true
              },
              {
                "text": "Brazing",
                "explanation": "In brazing, only the filler metal melts and flows into the joint; the base metals stay solid. It is tempting because brazing does use high heat."
              },
              {
                "text": "Soldering",
                "explanation": "Soldering uses the lowest heat of the three, and only the solder melts. The base metals never melt."
              },
              {
                "text": "All three melt the base metals equally",
                "explanation": "Only one of the three melts the base metals. Brazing and soldering melt just the filler while the base metals remain solid."
              }
            ]
          },
          {
            "id": "AS6-005",
            "text": "What is the purpose of flux in soldering and brazing?",
            "options": [
              {
                "text": "To cool the joint down after heating",
                "explanation": "Flux does not cool anything; the joint cools naturally in the air after the heat source is removed."
              },
              {
                "text": "To add extra strength by hardening inside the joint",
                "explanation": "The strength comes from the filler metal bonding to the base metal. Flux residue is actually cleaned off afterward, not left in for strength."
              },
              {
                "text": "To clean the metal surfaces and prevent oxidation so the filler metal can bond",
                "explanation": "Correct! Flux removes oxides and keeps oxygen away from the hot metal, letting the melted filler flow and stick properly.",
                "correct": true
              },
              {
                "text": "To color the joint so the technician can inspect it",
                "explanation": "Flux is not a marking or inspection dye; its job happens chemically during heating, not visually afterward."
              }
            ]
          },
          {
            "id": "AS6-006",
            "text": "Which of the following metals is ferrous?",
            "options": [
              {
                "text": "Aluminum",
                "explanation": "Aluminum contains no iron, which is why it is light, non-magnetic, and resists rust. It is non-ferrous."
              },
              {
                "text": "Steel",
                "explanation": "Correct! Steel is iron alloyed with carbon, so it is ferrous: strong and magnetic, but it will rust without protection.",
                "correct": true
              },
              {
                "text": "Brass",
                "explanation": "Brass is an alloy of copper and zinc with no iron, so it is non-ferrous. That is why it resists corrosion so well."
              },
              {
                "text": "Copper",
                "explanation": "Copper is a non-ferrous metal prized for conducting electricity; it contains no iron and does not rust the way steel does."
              }
            ]
          },
          {
            "id": "AS6-007",
            "text": "Why does a carpenter drill a pilot hole before driving a screw into hardwood?",
            "options": [
              {
                "text": "To make the screw hold less tightly so it can be removed later",
                "explanation": "A properly sized pilot hole barely reduces holding power, since the threads still bite into solid wood. Making removal easier is not the goal."
              },
              {
                "text": "To prevent the wood from splitting and make the screw easier to drive",
                "explanation": "Correct! A pilot hole gives the screw shank a path, so the wood fibers are not forced apart and split, and the screw drives in with much less effort.",
                "correct": true
              },
              {
                "text": "Because screws cannot enter wood without a hole the same size as the screw",
                "explanation": "Screws can enter wood without any hole at all in soft material, and a pilot hole is drilled smaller than the screw so the threads still grip."
              },
              {
                "text": "To create space for glue",
                "explanation": "Pilot holes are about preventing splits and easing driving, not about glue. Glue is applied to the joint faces, not stored in the screw hole."
              }
            ]
          },
          {
            "id": "AS6-008",
            "text": "When sanding a rough piece of wood to a smooth finish, how should sandpaper grits be used?",
            "options": [
              {
                "text": "Start with a fine grit and finish with a coarse grit",
                "explanation": "This is backwards. Finishing with coarse paper would leave deep scratches all over the surface you just smoothed."
              },
              {
                "text": "Use only the finest grit from start to finish",
                "explanation": "Fine grit removes material very slowly, so smoothing rough wood with it alone would take forever and clog the paper. You need coarse grit first."
              },
              {
                "text": "Grit numbers do not matter as long as you sand with pressure",
                "explanation": "Grit number matters a lot: it tells you how coarse the abrasive is. Heavy pressure with the wrong grit just gouges the surface."
              },
              {
                "text": "Start with a coarse grit, a lower number, and work up to a fine grit, a higher number",
                "explanation": "Correct! Lower grit numbers mean coarser paper that removes material fast; you then step up through higher numbers so each finer grit erases the scratches from the one before.",
                "correct": true
              }
            ]
          }
        ],
        "quizConfig": {
          "questionsPerQuiz": 6
        }
      }
    ]
  }
};
