// ASVAB Study Course Data — technical sections (GS / AS / MC / EI).
// Same shape as js/courses.js; lazy-loaded after it by
// js/page-study-guide.js and merged into `courses` via Object.assign.
// Contract enforced by scripts/validate-site.js and
// tests/unit/courses-tech.test.js.

const coursesTech = {
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
