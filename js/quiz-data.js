// ASVAB Practice Test Question Database
// Based on CAT-ASVAB (Computer Adaptive Test) structure
// Question pools are larger than test requirements to enable randomization

const asvabData = {
  // Test configuration matching CAT-ASVAB
  sections: {
    GS: {
      name: "General Science",
      code: "GS",
      description: "Tests knowledge of physical, earth, and biological sciences",
      questionsPerTest: 15,
      timeLimit: 10 * 60, // 10 minutes
      inAFQT: false
    },
    AR: {
      name: "Arithmetic Reasoning",
      code: "AR",
      description: "Word problems requiring mathematical operations",
      questionsPerTest: 15,
      timeLimit: 55 * 60, // 55 minutes
      inAFQT: true
    },
    WK: {
      name: "Word Knowledge",
      code: "WK",
      description: "Vocabulary and word meanings",
      questionsPerTest: 15,
      timeLimit: 9 * 60, // 9 minutes
      inAFQT: true
    },
    PC: {
      name: "Paragraph Comprehension",
      code: "PC",
      description: "Reading comprehension and passage analysis",
      questionsPerTest: 10,
      timeLimit: 27 * 60, // 27 minutes
      inAFQT: true
    },
    MK: {
      name: "Mathematics Knowledge",
      code: "MK",
      description: "Math concepts including algebra and geometry",
      questionsPerTest: 15,
      timeLimit: 23 * 60, // 23 minutes
      inAFQT: true
    },
    EI: {
      name: "Electronics Information",
      code: "EI",
      description: "Electrical principles, circuits, and devices",
      questionsPerTest: 15,
      timeLimit: 10 * 60, // 10 minutes
      inAFQT: false
    },
    AS: {
      name: "Auto & Shop Information",
      code: "AS",
      description: "Automotive systems and shop tools/practices",
      questionsPerTest: 10,
      timeLimit: 7 * 60, // 7 minutes
      inAFQT: false
    },
    MC: {
      name: "Mechanical Comprehension",
      code: "MC",
      description: "Mechanical principles, leverage, gears, and pulleys",
      questionsPerTest: 15,
      timeLimit: 22 * 60, // 22 minutes
      inAFQT: false
    },
    AO: {
      name: "Assembling Objects",
      code: "AO",
      description: "Spatial reasoning and shape assembly",
      questionsPerTest: 15,
      timeLimit: 17 * 60, // 17 minutes
      inAFQT: false
    }
  },

  // Question pools by section
  questions: {
    // ========================================
    // GENERAL SCIENCE (GS) - 30 questions
    // ========================================
    GS: [
      {
        id: "GS001",
        text: "What is the primary function of red blood cells?",
        options: ["Fight infection", "Carry oxygen", "Clot blood", "Produce antibodies"],
        correct: 1
      },
      {
        id: "GS002",
        text: "Which planet is closest to the Sun?",
        options: ["Venus", "Mercury", "Mars", "Earth"],
        correct: 1
      },
      {
        id: "GS003",
        text: "What type of rock is formed from cooled magma or lava?",
        options: ["Sedimentary", "Metamorphic", "Igneous", "Ite"],
        correct: 2
      },
      {
        id: "GS004",
        text: "The process by which plants convert sunlight into energy is called:",
        options: ["Respiration", "Photosynthesis", "Fermentation", "Oxidation"],
        correct: 1
      },
      {
        id: "GS005",
        text: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correct: 2
      },
      {
        id: "GS006",
        text: "Which organ in the human body produces insulin?",
        options: ["Liver", "Kidney", "Pancreas", "Stomach"],
        correct: 2
      },
      {
        id: "GS007",
        text: "What is the smallest unit of matter that retains the properties of an element?",
        options: ["Molecule", "Atom", "Electron", "Proton"],
        correct: 1
      },
      {
        id: "GS008",
        text: "The Earth's atmosphere is primarily composed of:",
        options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
        correct: 2
      },
      {
        id: "GS009",
        text: "What type of wave is sound?",
        options: ["Electromagnetic", "Transverse", "Longitudinal", "Radio"],
        correct: 2
      },
      {
        id: "GS010",
        text: "Which blood type is considered the universal donor?",
        options: ["A", "B", "AB", "O negative"],
        correct: 3
      },
      {
        id: "GS011",
        text: "What is the hardest natural substance on Earth?",
        options: ["Quartz", "Topaz", "Diamond", "Corundum"],
        correct: 2
      },
      {
        id: "GS012",
        text: "The ozone layer protects Earth from:",
        options: ["Meteors", "Ultraviolet radiation", "Radio waves", "Infrared light"],
        correct: 1
      },
      {
        id: "GS013",
        text: "What is the process called when a solid changes directly to a gas?",
        options: ["Evaporation", "Condensation", "Sublimation", "Deposition"],
        correct: 2
      },
      {
        id: "GS014",
        text: "Which part of the cell contains genetic material?",
        options: ["Cytoplasm", "Nucleus", "Mitochondria", "Ribosome"],
        correct: 1
      },
      {
        id: "GS015",
        text: "What is the SI unit of force?",
        options: ["Watt", "Joule", "Newton", "Pascal"],
        correct: 2
      },
      {
        id: "GS016",
        text: "How many chromosomes do humans have in each cell?",
        options: ["23", "46", "44", "48"],
        correct: 1
      },
      {
        id: "GS017",
        text: "What causes tides in the ocean?",
        options: ["Wind patterns", "Earth's rotation", "Gravitational pull of the Moon", "Underwater earthquakes"],
        correct: 2
      },
      {
        id: "GS018",
        text: "Which vitamin is produced when skin is exposed to sunlight?",
        options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin E"],
        correct: 2
      },
      {
        id: "GS019",
        text: "What is the pH of pure water?",
        options: ["0", "7", "14", "1"],
        correct: 1
      },
      {
        id: "GS020",
        text: "The Richter scale measures:",
        options: ["Wind speed", "Earthquake magnitude", "Temperature", "Radiation levels"],
        correct: 1
      },
      {
        id: "GS021",
        text: "Which gas do plants absorb from the atmosphere during photosynthesis?",
        options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
        correct: 2
      },
      {
        id: "GS022",
        text: "What is the largest organ in the human body?",
        options: ["Liver", "Brain", "Skin", "Heart"],
        correct: 2
      },
      {
        id: "GS023",
        text: "Light travels fastest through which medium?",
        options: ["Water", "Glass", "Air", "Vacuum"],
        correct: 3
      },
      {
        id: "GS024",
        text: "What type of blood vessel carries blood away from the heart?",
        options: ["Veins", "Capillaries", "Arteries", "Lymph vessels"],
        correct: 2
      },
      {
        id: "GS025",
        text: "The periodic table organizes elements by their:",
        options: ["Atomic number", "Weight", "Color", "Discovery date"],
        correct: 0
      },
      {
        id: "GS026",
        text: "What is the freezing point of water in Celsius?",
        options: ["32°", "0°", "-32°", "100°"],
        correct: 1
      },
      {
        id: "GS027",
        text: "Which layer of the Earth is liquid?",
        options: ["Inner core", "Outer core", "Mantle", "Crust"],
        correct: 1
      },
      {
        id: "GS028",
        text: "What is the function of white blood cells?",
        options: ["Carry oxygen", "Fight infection", "Clot blood", "Transport nutrients"],
        correct: 1
      },
      {
        id: "GS029",
        text: "Sound cannot travel through:",
        options: ["Water", "Steel", "Air", "Vacuum"],
        correct: 3
      },
      {
        id: "GS030",
        text: "What is the chemical formula for water?",
        options: ["H2O", "CO2", "NaCl", "O2"],
        correct: 0
      }
    ],

    // ========================================
    // ARITHMETIC REASONING (AR) - 35 questions
    // ========================================
    AR: [
      {
        id: "AR001",
        text: "A store sells apples for $0.75 each. How much would 8 apples cost?",
        options: ["$5.00", "$6.00", "$6.50", "$7.00"],
        correct: 1
      },
      {
        id: "AR002",
        text: "If a car travels 240 miles in 4 hours, what is its average speed in miles per hour?",
        options: ["50 mph", "55 mph", "60 mph", "65 mph"],
        correct: 2
      },
      {
        id: "AR003",
        text: "A carpenter needs to cut a board into pieces that are each 2¾ feet long. If the original board is 16½ feet long, how many complete pieces can be cut?",
        options: ["4 pieces", "6 pieces", "7 pieces", "8 pieces"],
        correct: 1
      },
      {
        id: "AR004",
        text: "If 15% of a number is 45, what is the number?",
        options: ["200", "250", "275", "300"],
        correct: 3
      },
      {
        id: "AR005",
        text: "A worker earns $18.50 per hour. How much does she earn in a 40-hour week?",
        options: ["$700", "$720", "$740", "$760"],
        correct: 2
      },
      {
        id: "AR006",
        text: "A rectangle has a length of 12 feet and a width of 8 feet. What is its perimeter?",
        options: ["96 feet", "20 feet", "40 feet", "80 feet"],
        correct: 2
      },
      {
        id: "AR007",
        text: "If a shirt originally costs $45 and is on sale for 20% off, what is the sale price?",
        options: ["$9", "$25", "$36", "$40"],
        correct: 2
      },
      {
        id: "AR008",
        text: "A tank can hold 150 gallons of water. If it is currently 2/3 full, how many gallons of water are in the tank?",
        options: ["50 gallons", "75 gallons", "100 gallons", "125 gallons"],
        correct: 2
      },
      {
        id: "AR009",
        text: "John has 3 times as many marbles as Mike. If they have 48 marbles together, how many does John have?",
        options: ["12", "16", "32", "36"],
        correct: 3
      },
      {
        id: "AR010",
        text: "A bus travels 45 miles in 1 hour and 15 minutes. What is its average speed?",
        options: ["30 mph", "36 mph", "40 mph", "45 mph"],
        correct: 1
      },
      {
        id: "AR011",
        text: "If 5 workers can complete a job in 12 days, how many days would it take 10 workers to complete the same job?",
        options: ["4 days", "6 days", "8 days", "24 days"],
        correct: 1
      },
      {
        id: "AR012",
        text: "A pizza is cut into 8 equal slices. If Tom eats 3 slices and Jerry eats 2 slices, what fraction of the pizza remains?",
        options: ["1/8", "1/4", "3/8", "5/8"],
        correct: 2
      },
      {
        id: "AR013",
        text: "The sum of two consecutive odd numbers is 56. What is the larger number?",
        options: ["27", "28", "29", "31"],
        correct: 2
      },
      {
        id: "AR014",
        text: "A bicycle wheel has a diameter of 26 inches. Approximately how far does the bicycle travel in one complete rotation? (Use π ≈ 3.14)",
        options: ["41 inches", "52 inches", "82 inches", "163 inches"],
        correct: 2
      },
      {
        id: "AR015",
        text: "If gas costs $3.50 per gallon and a car gets 28 miles per gallon, how much would it cost to drive 196 miles?",
        options: ["$17.50", "$24.50", "$28.00", "$49.00"],
        correct: 1
      },
      {
        id: "AR016",
        text: "A rope 72 feet long is cut into two pieces. One piece is twice as long as the other. How long is the shorter piece?",
        options: ["18 feet", "24 feet", "36 feet", "48 feet"],
        correct: 1
      },
      {
        id: "AR017",
        text: "Sarah scored 85, 92, and 78 on her first three tests. What score does she need on her fourth test to have an average of 85?",
        options: ["80", "82", "85", "88"],
        correct: 2
      },
      {
        id: "AR018",
        text: "A train leaves Station A at 9:00 AM traveling at 60 mph. Another train leaves Station B at 10:00 AM traveling toward Station A at 80 mph. If the stations are 280 miles apart, at what time will the trains meet?",
        options: ["11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM"],
        correct: 1
      },
      {
        id: "AR019",
        text: "If a square has a perimeter of 48 inches, what is its area?",
        options: ["96 sq in", "144 sq in", "192 sq in", "576 sq in"],
        correct: 1
      },
      {
        id: "AR020",
        text: "A store marks up items by 40% over cost. If a jacket sells for $84, what was the store's cost?",
        options: ["$50", "$55", "$60", "$65"],
        correct: 2
      },
      {
        id: "AR021",
        text: "A soldier runs 2 miles in 14 minutes. At this pace, how long would it take to run 5 miles?",
        options: ["28 minutes", "30 minutes", "35 minutes", "40 minutes"],
        correct: 2
      },
      {
        id: "AR022",
        text: "A recruiter needs to process 180 applications. If she processes 12 applications per hour, how many hours will it take?",
        options: ["12 hours", "15 hours", "16 hours", "18 hours"],
        correct: 1
      },
      {
        id: "AR023",
        text: "Three soldiers share the cost of supplies equally. If the total cost is $47.25, how much does each soldier pay?",
        options: ["$14.75", "$15.25", "$15.75", "$16.25"],
        correct: 2
      },
      {
        id: "AR024",
        text: "A military vehicle uses 8 gallons of fuel every 100 miles. How many gallons are needed for a 350-mile trip?",
        options: ["24 gallons", "28 gallons", "32 gallons", "35 gallons"],
        correct: 1
      },
      {
        id: "AR025",
        text: "If a base has 1,250 personnel and 30% are officers, how many enlisted personnel are there?",
        options: ["375", "625", "875", "1,000"],
        correct: 2
      },
      {
        id: "AR026",
        text: "A supply room has 420 items. After using 1/4 of the items and receiving a shipment of 80 more, how many items are there?",
        options: ["315", "395", "420", "500"],
        correct: 1
      },
      {
        id: "AR027",
        text: "A helicopter flies at 150 mph. How far can it travel in 2 hours and 20 minutes?",
        options: ["300 miles", "320 miles", "350 miles", "370 miles"],
        correct: 2
      },
      {
        id: "AR028",
        text: "A rectangular barracks measures 40 feet by 25 feet. What is the area in square feet?",
        options: ["130 sq ft", "650 sq ft", "1,000 sq ft", "1,500 sq ft"],
        correct: 2
      },
      {
        id: "AR029",
        text: "If ammunition costs $0.35 per round, how much do 500 rounds cost?",
        options: ["$150", "$175", "$200", "$225"],
        correct: 1
      },
      {
        id: "AR030",
        text: "A patrol covers 18 miles in 3 hours walking and 45 miles in 1 hour driving. What is the total distance covered?",
        options: ["51 miles", "58 miles", "63 miles", "66 miles"],
        correct: 2
      },
      {
        id: "AR031",
        text: "A water tank loses 5% of its water each day to evaporation. If it starts with 400 gallons, how much remains after one day?",
        options: ["360 gallons", "380 gallons", "395 gallons", "400 gallons"],
        correct: 1
      },
      {
        id: "AR032",
        text: "A soldier's monthly pay is $2,400. If taxes take 22%, what is the take-home pay?",
        options: ["$1,728", "$1,848", "$1,872", "$1,920"],
        correct: 2
      },
      {
        id: "AR033",
        text: "Three trucks can carry 15 tons each. How many trips are needed to transport 120 tons?",
        options: ["2 trips", "3 trips", "4 trips", "8 trips"],
        correct: 1
      },
      {
        id: "AR034",
        text: "A mission is scheduled to start at 0600 hours and last 8 hours 45 minutes. At what time will it end?",
        options: ["1345 hours", "1445 hours", "1500 hours", "1545 hours"],
        correct: 1
      },
      {
        id: "AR035",
        text: "If the ratio of officers to enlisted is 1:8 and there are 72 enlisted personnel, how many officers are there?",
        options: ["6", "8", "9", "12"],
        correct: 2
      }
    ],

    // ========================================
    // WORD KNOWLEDGE (WK) - 35 questions
    // ========================================
    WK: [
      {
        id: "WK001",
        text: "Small most nearly means:",
        options: ["Sturdy", "Round", "Tiny", "Angry"],
        correct: 2
      },
      {
        id: "WK002",
        text: "The word 'obsolete' most nearly means:",
        options: ["Damaged", "Outdated", "Expensive", "Complicated"],
        correct: 1
      },
      {
        id: "WK003",
        text: "Verify most nearly means:",
        options: ["Confirm", "Deny", "Suspect", "Question"],
        correct: 0
      },
      {
        id: "WK004",
        text: "The word 'hazardous' most nearly means:",
        options: ["Safe", "Dangerous", "Helpful", "Common"],
        correct: 1
      },
      {
        id: "WK005",
        text: "Illuminate most nearly means:",
        options: ["Darken", "Light up", "Cover", "Reveal"],
        correct: 1
      },
      {
        id: "WK006",
        text: "The word 'persevere' most nearly means:",
        options: ["Give up", "Continue", "Rest", "Complain"],
        correct: 1
      },
      {
        id: "WK007",
        text: "Conceal most nearly means:",
        options: ["Show", "Find", "Hide", "Destroy"],
        correct: 2
      },
      {
        id: "WK008",
        text: "The word 'mandatory' most nearly means:",
        options: ["Optional", "Required", "Suggested", "Preferred"],
        correct: 1
      },
      {
        id: "WK009",
        text: "Deficient most nearly means:",
        options: ["Adequate", "Excessive", "Lacking", "Perfect"],
        correct: 2
      },
      {
        id: "WK010",
        text: "The word 'proficient' most nearly means:",
        options: ["Skilled", "Beginner", "Careless", "Uncertain"],
        correct: 0
      },
      {
        id: "WK011",
        text: "Altercation most nearly means:",
        options: ["Agreement", "Dispute", "Change", "Solution"],
        correct: 1
      },
      {
        id: "WK012",
        text: "The word 'meticulous' most nearly means:",
        options: ["Careless", "Careful", "Quick", "Lazy"],
        correct: 1
      },
      {
        id: "WK013",
        text: "Fortify most nearly means:",
        options: ["Weaken", "Strengthen", "Abandon", "Ignore"],
        correct: 1
      },
      {
        id: "WK014",
        text: "The word 'terminate' most nearly means:",
        options: ["Begin", "Continue", "End", "Pause"],
        correct: 2
      },
      {
        id: "WK015",
        text: "Negligent most nearly means:",
        options: ["Careful", "Attentive", "Careless", "Responsible"],
        correct: 2
      },
      {
        id: "WK016",
        text: "The word 'scrutinize' most nearly means:",
        options: ["Examine closely", "Ignore", "Accept", "Reject"],
        correct: 0
      },
      {
        id: "WK017",
        text: "Collaborate most nearly means:",
        options: ["Compete", "Work together", "Separate", "Disagree"],
        correct: 1
      },
      {
        id: "WK018",
        text: "The word 'expedite' most nearly means:",
        options: ["Delay", "Speed up", "Cancel", "Complicate"],
        correct: 1
      },
      {
        id: "WK019",
        text: "Formidable most nearly means:",
        options: ["Weak", "Impressive", "Simple", "Small"],
        correct: 1
      },
      {
        id: "WK020",
        text: "The word 'relinquish' most nearly means:",
        options: ["Keep", "Take", "Give up", "Find"],
        correct: 2
      },
      {
        id: "WK021",
        text: "Diligent most nearly means:",
        options: ["Lazy", "Hardworking", "Careless", "Slow"],
        correct: 1
      },
      {
        id: "WK022",
        text: "The word 'subordinate' most nearly means:",
        options: ["Superior", "Equal", "Lower in rank", "Leader"],
        correct: 2
      },
      {
        id: "WK023",
        text: "Feasible most nearly means:",
        options: ["Impossible", "Possible", "Difficult", "Easy"],
        correct: 1
      },
      {
        id: "WK024",
        text: "The word 'reprimand' most nearly means:",
        options: ["Praise", "Scold", "Reward", "Ignore"],
        correct: 1
      },
      {
        id: "WK025",
        text: "Comprehensive most nearly means:",
        options: ["Limited", "Partial", "Complete", "Simple"],
        correct: 2
      },
      {
        id: "WK026",
        text: "The word 'diminish' most nearly means:",
        options: ["Increase", "Decrease", "Maintain", "Double"],
        correct: 1
      },
      {
        id: "WK027",
        text: "Imminent most nearly means:",
        options: ["Distant", "Unlikely", "About to happen", "Past"],
        correct: 2
      },
      {
        id: "WK028",
        text: "The word 'resilient' most nearly means:",
        options: ["Fragile", "Bounces back", "Weak", "Static"],
        correct: 1
      },
      {
        id: "WK029",
        text: "Apprehend most nearly means:",
        options: ["Release", "Capture", "Ignore", "Forget"],
        correct: 1
      },
      {
        id: "WK030",
        text: "The word 'deteriorate' most nearly means:",
        options: ["Improve", "Worsen", "Stay same", "Enhance"],
        correct: 1
      },
      {
        id: "WK031",
        text: "Commend most nearly means:",
        options: ["Criticize", "Praise", "Ignore", "Punish"],
        correct: 1
      },
      {
        id: "WK032",
        text: "The word 'substantial' most nearly means:",
        options: ["Small", "Considerable", "Worthless", "Invisible"],
        correct: 1
      },
      {
        id: "WK033",
        text: "Alleviate most nearly means:",
        options: ["Worsen", "Relieve", "Cause", "Ignore"],
        correct: 1
      },
      {
        id: "WK034",
        text: "The word 'adhere' most nearly means:",
        options: ["Separate", "Stick to", "Reject", "Avoid"],
        correct: 1
      },
      {
        id: "WK035",
        text: "Exemplary most nearly means:",
        options: ["Poor", "Outstanding", "Average", "Ordinary"],
        correct: 1
      }
    ],

    // ========================================
    // PARAGRAPH COMPREHENSION (PC) - 25 questions
    // ========================================
    PC: [
      {
        id: "PC001",
        text: "Read the passage: 'The Army Physical Fitness Test (APFT) measures a soldier's physical conditioning. The test consists of push-ups, sit-ups, and a two-mile run. Each event is scored on a scale, and soldiers must meet minimum standards based on their age and gender.'\n\nWhat is the main purpose of the APFT?",
        options: ["To punish soldiers", "To measure physical conditioning", "To determine rank", "To qualify for special forces"],
        correct: 1
      },
      {
        id: "PC002",
        text: "Read the passage: 'Military time uses a 24-hour clock system. Unlike civilian time, which uses AM and PM, military time numbers hours from 00 to 23. For example, 1:00 PM in civilian time is 1300 hours in military time.'\n\nAccording to the passage, what would 3:00 PM be in military time?",
        options: ["0300 hours", "1500 hours", "1800 hours", "2100 hours"],
        correct: 1
      },
      {
        id: "PC003",
        text: "Read the passage: 'Camouflage patterns help military personnel blend into their environment. Desert camouflage uses tan and brown colors, while woodland patterns feature green, brown, and black. The right pattern depends on the terrain where operations occur.'\n\nWhat determines which camouflage pattern should be used?",
        options: ["Personal preference", "The terrain", "Military rank", "Time of year"],
        correct: 1
      },
      {
        id: "PC004",
        text: "Read the passage: 'Boot camp, or basic training, transforms civilians into soldiers. Recruits learn military customs, physical fitness, and basic combat skills. The training is intentionally challenging to prepare recruits for the demands of military service.'\n\nWhy is basic training described as challenging?",
        options: ["To discourage enlistment", "To prepare recruits for military demands", "To reduce the number of soldiers", "To save money on training"],
        correct: 1
      },
      {
        id: "PC005",
        text: "Read the passage: 'The chain of command is the line of authority in a military organization. Orders flow downward from higher ranks to lower ranks, while reports and information flow upward. This structure ensures clear communication and accountability.'\n\nIn which direction do orders flow in the chain of command?",
        options: ["Upward", "Downward", "Sideways", "In all directions equally"],
        correct: 1
      },
      {
        id: "PC006",
        text: "Read the passage: 'Night vision devices amplify available light to allow users to see in darkness. These devices collect tiny amounts of light from stars, the moon, or ambient sources and intensify it electronically. Modern military operations often occur at night, making this technology essential.'\n\nHow do night vision devices work?",
        options: ["They generate their own light", "They amplify available light", "They use radar", "They detect heat"],
        correct: 1
      },
      {
        id: "PC007",
        text: "Read the passage: 'The Geneva Conventions establish rules for the treatment of wounded soldiers and prisoners of war. These international agreements protect individuals who are not participating in combat. All major military forces are expected to follow these conventions.'\n\nWho do the Geneva Conventions protect?",
        options: ["Only officers", "Active combatants", "Non-participants in combat", "Only civilians"],
        correct: 2
      },
      {
        id: "PC008",
        text: "Read the passage: 'Military ranks indicate a service member's level of responsibility and authority. Enlisted ranks range from Private to Sergeant Major, while officer ranks range from Second Lieutenant to General. Higher ranks typically require more experience and education.'\n\nWhat do military ranks indicate?",
        options: ["Age only", "Height and weight", "Responsibility and authority", "Years of service only"],
        correct: 2
      },
      {
        id: "PC009",
        text: "Read the passage: 'Reconnaissance missions gather information about enemy forces and terrain. Soldiers on these missions observe and report rather than engage in combat. The intelligence collected helps commanders make informed decisions about operations.'\n\nWhat is the primary purpose of reconnaissance?",
        options: ["To engage the enemy", "To gather information", "To deliver supplies", "To train new soldiers"],
        correct: 1
      },
      {
        id: "PC010",
        text: "Read the passage: 'Military vehicles are designed for specific purposes. Tanks provide heavy firepower and protection, while Humvees offer mobility and versatility. Helicopters enable rapid deployment and medical evacuation. Each vehicle type plays a unique role in military operations.'\n\nAccording to the passage, what advantage do helicopters provide?",
        options: ["Heavy firepower", "Protection", "Rapid deployment", "Cost savings"],
        correct: 2
      },
      {
        id: "PC011",
        text: "Read the passage: 'The buddy system pairs soldiers together for safety and support. Each soldier is responsible for watching out for their partner. This system ensures that no one faces dangerous situations alone and that help is always nearby.'\n\nWhat is the purpose of the buddy system?",
        options: ["To reduce costs", "To ensure safety and support", "To create competition", "To speed up training"],
        correct: 1
      },
      {
        id: "PC012",
        text: "Read the passage: 'Field rations, known as MREs (Meals Ready to Eat), provide nutrition in combat situations. Each MRE contains approximately 1,200 calories and includes an entrée, side dish, dessert, and accessories. MREs can be eaten cold or heated with a flameless heater.'\n\nHow many calories does an MRE contain?",
        options: ["About 800", "About 1,200", "About 2,000", "About 500"],
        correct: 1
      },
      {
        id: "PC013",
        text: "Read the passage: 'Communication security, or COMSEC, protects military communications from enemy interception. Encryption codes messages so that only authorized personnel can read them. Changing codes frequently prevents enemies from breaking the encryption.'\n\nWhy are encryption codes changed frequently?",
        options: ["To confuse friendly forces", "To save money", "To prevent enemies from breaking encryption", "To test new systems"],
        correct: 2
      },
      {
        id: "PC014",
        text: "Read the passage: 'A military deployment may last from a few months to over a year. During deployment, service members are stationed away from their home base, often in foreign countries. Families must adapt to the absence of their loved one during this time.'\n\nWhat challenge do families face during deployment?",
        options: ["Increased income", "Adapting to absence", "More free time", "Fewer responsibilities"],
        correct: 1
      },
      {
        id: "PC015",
        text: "Read the passage: 'First aid training teaches soldiers to treat injuries in the field. Stopping severe bleeding and treating shock are critical skills. Quick action in the minutes after an injury can save lives before medical professionals arrive.'\n\nAccording to the passage, why is quick action important?",
        options: ["To avoid paperwork", "To save lives before help arrives", "To impress commanders", "To earn medals"],
        correct: 1
      },
      {
        id: "PC016",
        text: "Read the passage: 'The military uses the phonetic alphabet to ensure clear communication. Each letter has a corresponding word, such as Alpha for A, Bravo for B, and Charlie for C. This system prevents confusion between similar-sounding letters like B and D.'\n\nWhat is the purpose of the phonetic alphabet?",
        options: ["To create secret codes", "To prevent confusion between letters", "To communicate faster", "To test intelligence"],
        correct: 1
      },
      {
        id: "PC017",
        text: "Read the passage: 'Physical training, or PT, is a daily requirement in the military. Regular exercise maintains combat readiness and reduces injuries. Most units conduct PT in the early morning before other duties begin.'\n\nWhen do most units conduct PT?",
        options: ["In the evening", "During lunch", "In the early morning", "On weekends only"],
        correct: 2
      },
      {
        id: "PC018",
        text: "Read the passage: 'The GI Bill provides educational benefits to veterans. This program helps service members pay for college, vocational training, or other education after leaving the military. Many veterans credit the GI Bill with helping them transition to civilian careers.'\n\nWhat benefit does the GI Bill provide?",
        options: ["Housing assistance", "Educational benefits", "Health care", "Retirement pay"],
        correct: 1
      },
      {
        id: "PC019",
        text: "Read the passage: 'Military bases operate like small cities. They contain housing, stores, medical facilities, and recreation centers. Many families live on base, creating a close-knit community of military personnel and their dependents.'\n\nHow are military bases described in the passage?",
        options: ["Like small cities", "Like vacation resorts", "Like factories", "Like schools"],
        correct: 0
      },
      {
        id: "PC020",
        text: "Read the passage: 'Situational awareness means understanding your environment and potential threats. Soldiers must constantly observe their surroundings and anticipate danger. This awareness can mean the difference between life and death in combat situations.'\n\nWhat does situational awareness help soldiers do?",
        options: ["Relax more", "Anticipate danger", "Follow orders better", "Save money"],
        correct: 1
      },
      {
        id: "PC021",
        text: "Read the passage: 'Military dogs serve alongside human soldiers in various roles. They detect explosives, track enemy combatants, and provide security. These highly trained animals form strong bonds with their handlers and are considered valuable members of military units.'\n\nWhat roles do military dogs perform?",
        options: ["Entertainment only", "Detecting explosives and tracking", "Carrying supplies", "Medical assistance"],
        correct: 1
      },
      {
        id: "PC022",
        text: "Read the passage: 'Drill and ceremony instill discipline and teamwork in military units. Marching in formation requires each soldier to move in coordination with others. These exercises may seem repetitive, but they build the habits of following orders precisely.'\n\nWhat is the purpose of drill and ceremony?",
        options: ["Entertainment", "Physical fitness", "Instilling discipline and teamwork", "Punishment"],
        correct: 2
      },
      {
        id: "PC023",
        text: "Read the passage: 'The Code of Conduct guides American soldiers if captured by the enemy. It requires service members to resist enemy exploitation and maintain loyalty to fellow prisoners. The code has six articles that establish expectations for prisoners of war.'\n\nHow many articles does the Code of Conduct have?",
        options: ["Three", "Six", "Ten", "Twelve"],
        correct: 1
      },
      {
        id: "PC024",
        text: "Read the passage: 'Military logistics involves moving supplies, equipment, and personnel to where they are needed. Without effective logistics, combat units cannot function. Ammunition, food, fuel, and medical supplies must reach troops at the right time and place.'\n\nWhat happens without effective logistics?",
        options: ["Units receive extra supplies", "Combat units cannot function", "Training improves", "Costs decrease"],
        correct: 1
      },
      {
        id: "PC025",
        text: "Read the passage: 'Veterans Day honors all who have served in the military, while Memorial Day specifically remembers those who died in service. Both holidays recognize the sacrifices made by military personnel. Veterans Day is observed on November 11th each year.'\n\nWhat is the difference between Veterans Day and Memorial Day?",
        options: ["They are the same", "Veterans Day honors all who served; Memorial Day honors those who died", "Memorial Day is for officers only", "Veterans Day is for Navy only"],
        correct: 1
      }
    ],

    // ========================================
    // MATHEMATICS KNOWLEDGE (MK) - 35 questions
    // ========================================
    MK: [
      {
        id: "MK001",
        text: "Solve for x: 2x + 5 = 15",
        options: ["x = 5", "x = 10", "x = 7", "x = 3"],
        correct: 0
      },
      {
        id: "MK002",
        text: "What is the area of a triangle with base 8 and height 6?",
        options: ["48 square units", "24 square units", "14 square units", "28 square units"],
        correct: 1
      },
      {
        id: "MK003",
        text: "What is the square root of 144?",
        options: ["14", "12", "11", "13"],
        correct: 1
      },
      {
        id: "MK004",
        text: "Simplify: 3(x + 4) - 2x",
        options: ["x + 12", "5x + 4", "x + 4", "5x + 12"],
        correct: 0
      },
      {
        id: "MK005",
        text: "What is 3/4 expressed as a decimal?",
        options: ["0.34", "0.75", "0.25", "0.50"],
        correct: 1
      },
      {
        id: "MK006",
        text: "If a circle has a radius of 7, what is its diameter?",
        options: ["3.5", "7", "14", "21"],
        correct: 2
      },
      {
        id: "MK007",
        text: "What is the value of 5²?",
        options: ["10", "15", "25", "125"],
        correct: 2
      },
      {
        id: "MK008",
        text: "Solve for x: x/4 = 12",
        options: ["x = 3", "x = 8", "x = 48", "x = 16"],
        correct: 2
      },
      {
        id: "MK009",
        text: "What is the perimeter of a rectangle with length 10 and width 6?",
        options: ["16", "32", "60", "120"],
        correct: 1
      },
      {
        id: "MK010",
        text: "Simplify: (2³) × (2²)",
        options: ["2⁵", "2⁶", "4⁵", "8"],
        correct: 0
      },
      {
        id: "MK011",
        text: "What is 15% of 80?",
        options: ["8", "12", "15", "20"],
        correct: 1
      },
      {
        id: "MK012",
        text: "If angle A = 45° and angle B = 90°, what is angle C in a triangle?",
        options: ["45°", "55°", "35°", "65°"],
        correct: 0
      },
      {
        id: "MK013",
        text: "What is the least common multiple (LCM) of 4 and 6?",
        options: ["2", "12", "24", "10"],
        correct: 1
      },
      {
        id: "MK014",
        text: "Solve: -3 + (-7) = ?",
        options: ["-10", "-4", "4", "10"],
        correct: 0
      },
      {
        id: "MK015",
        text: "What is the volume of a cube with sides of length 3?",
        options: ["9", "18", "27", "81"],
        correct: 2
      },
      {
        id: "MK016",
        text: "Factor: x² - 9",
        options: ["(x + 3)(x + 3)", "(x - 3)(x - 3)", "(x + 3)(x - 3)", "(x + 9)(x - 1)"],
        correct: 2
      },
      {
        id: "MK017",
        text: "What is the slope of the line y = 3x + 5?",
        options: ["5", "3", "-3", "8"],
        correct: 1
      },
      {
        id: "MK018",
        text: "Convert 0.25 to a fraction in lowest terms:",
        options: ["1/4", "25/100", "2/8", "1/2"],
        correct: 0
      },
      {
        id: "MK019",
        text: "What is the greatest common factor (GCF) of 24 and 36?",
        options: ["6", "12", "4", "18"],
        correct: 1
      },
      {
        id: "MK020",
        text: "In a right triangle, if one leg is 3 and the other is 4, what is the hypotenuse?",
        options: ["5", "6", "7", "12"],
        correct: 0
      },
      {
        id: "MK021",
        text: "What is 2/3 + 1/6?",
        options: ["3/9", "5/6", "3/6", "1/2"],
        correct: 1
      },
      {
        id: "MK022",
        text: "Solve for x: 3x - 7 = 14",
        options: ["x = 7", "x = 3", "x = 21", "x = 4"],
        correct: 0
      },
      {
        id: "MK023",
        text: "What is the circumference of a circle with diameter 10? (Use π = 3.14)",
        options: ["31.4", "62.8", "15.7", "78.5"],
        correct: 0
      },
      {
        id: "MK024",
        text: "Simplify: √50",
        options: ["5√2", "10√5", "25", "2√5"],
        correct: 0
      },
      {
        id: "MK025",
        text: "What is (-4) × (-3)?",
        options: ["-12", "-7", "7", "12"],
        correct: 3
      },
      {
        id: "MK026",
        text: "If f(x) = 2x + 3, what is f(4)?",
        options: ["8", "11", "14", "9"],
        correct: 1
      },
      {
        id: "MK027",
        text: "What is the area of a circle with radius 5? (Use π = 3.14)",
        options: ["15.7 sq units", "31.4 sq units", "78.5 sq units", "157 sq units"],
        correct: 2
      },
      {
        id: "MK028",
        text: "Solve: 4² + 3² = ?",
        options: ["14", "25", "7", "49"],
        correct: 1
      },
      {
        id: "MK029",
        text: "What is 5/8 as a percentage?",
        options: ["58%", "62.5%", "80%", "0.625%"],
        correct: 1
      },
      {
        id: "MK030",
        text: "Solve for x: 2(x - 3) = 10",
        options: ["x = 8", "x = 5", "x = 6.5", "x = 4"],
        correct: 0
      },
      {
        id: "MK031",
        text: "What is the mean of 4, 8, 6, 12, and 10?",
        options: ["6", "8", "10", "7"],
        correct: 1
      },
      {
        id: "MK032",
        text: "An angle measuring 180° is called a:",
        options: ["Right angle", "Acute angle", "Obtuse angle", "Straight angle"],
        correct: 3
      },
      {
        id: "MK033",
        text: "What is 10³?",
        options: ["30", "100", "1,000", "10,000"],
        correct: 2
      },
      {
        id: "MK034",
        text: "Solve: |−8| = ?",
        options: ["-8", "8", "0", "±8"],
        correct: 1
      },
      {
        id: "MK035",
        text: "If two angles are complementary and one measures 35°, what does the other measure?",
        options: ["145°", "55°", "35°", "125°"],
        correct: 1
      }
    ],

    // ========================================
    // ELECTRONICS INFORMATION (EI) - 30 questions
    // ========================================
    EI: [
      {
        id: "EI001",
        text: "What unit is used to measure electrical resistance?",
        options: ["Volts", "Amperes", "Ohms", "Watts"],
        correct: 2
      },
      {
        id: "EI002",
        text: "In a series circuit, if one bulb burns out, what happens to the others?",
        options: ["They get brighter", "They go out", "Nothing changes", "They dim slightly"],
        correct: 1
      },
      {
        id: "EI003",
        text: "What is the formula for Ohm's Law?",
        options: ["V = IR", "P = IV", "V = I/R", "R = VI"],
        correct: 0
      },
      {
        id: "EI004",
        text: "Which component stores electrical energy in an electric field?",
        options: ["Resistor", "Capacitor", "Inductor", "Transistor"],
        correct: 1
      },
      {
        id: "EI005",
        text: "What is the unit of electrical power?",
        options: ["Volt", "Ampere", "Ohm", "Watt"],
        correct: 3
      },
      {
        id: "EI006",
        text: "Current flows from:",
        options: ["Positive to negative", "Negative to positive", "Both directions equally", "Neither direction"],
        correct: 0
      },
      {
        id: "EI007",
        text: "What does a fuse do in a circuit?",
        options: ["Increases current", "Stores energy", "Protects from overcurrent", "Measures voltage"],
        correct: 2
      },
      {
        id: "EI008",
        text: "In a parallel circuit, if one path is broken:",
        options: ["All current stops", "Current continues in other paths", "Voltage increases", "Resistance doubles"],
        correct: 1
      },
      {
        id: "EI009",
        text: "What is the symbol for a battery in a circuit diagram?",
        options: ["Circle with X", "Long and short parallel lines", "Triangle", "Square with arrow"],
        correct: 1
      },
      {
        id: "EI010",
        text: "AC stands for:",
        options: ["Additional Current", "Alternating Current", "Ampere Circuit", "Automatic Current"],
        correct: 1
      },
      {
        id: "EI011",
        text: "A transformer is used to:",
        options: ["Store electricity", "Change voltage levels", "Measure current", "Create resistance"],
        correct: 1
      },
      {
        id: "EI012",
        text: "What material is the best conductor of electricity?",
        options: ["Rubber", "Glass", "Copper", "Wood"],
        correct: 2
      },
      {
        id: "EI013",
        text: "A diode allows current to flow in:",
        options: ["Both directions", "One direction only", "No direction", "Alternating directions"],
        correct: 1
      },
      {
        id: "EI014",
        text: "What is the standard household voltage in the United States?",
        options: ["220 volts", "120 volts", "50 volts", "240 volts"],
        correct: 1
      },
      {
        id: "EI015",
        text: "If voltage is 12V and resistance is 4Ω, what is the current?",
        options: ["48A", "3A", "16A", "8A"],
        correct: 1
      },
      {
        id: "EI016",
        text: "A ground wire is typically what color?",
        options: ["Black", "White", "Red", "Green or bare copper"],
        correct: 3
      },
      {
        id: "EI017",
        text: "What device converts AC to DC?",
        options: ["Transformer", "Rectifier", "Capacitor", "Inductor"],
        correct: 1
      },
      {
        id: "EI018",
        text: "What is the purpose of an insulator?",
        options: ["Conduct electricity", "Prevent current flow", "Store energy", "Increase voltage"],
        correct: 1
      },
      {
        id: "EI019",
        text: "LED stands for:",
        options: ["Low Energy Device", "Light Emitting Diode", "Linear Electric Diode", "Long Emission Device"],
        correct: 1
      },
      {
        id: "EI020",
        text: "Total resistance in a series circuit is:",
        options: ["Less than smallest resistor", "Sum of all resistors", "Product of all resistors", "Average of all resistors"],
        correct: 1
      },
      {
        id: "EI021",
        text: "What measures electrical current?",
        options: ["Voltmeter", "Ammeter", "Ohmmeter", "Wattmeter"],
        correct: 1
      },
      {
        id: "EI022",
        text: "A short circuit occurs when:",
        options: ["Resistance is very high", "Current bypasses the load", "Voltage is too low", "The circuit is open"],
        correct: 1
      },
      {
        id: "EI023",
        text: "What component amplifies electrical signals?",
        options: ["Resistor", "Capacitor", "Transistor", "Inductor"],
        correct: 2
      },
      {
        id: "EI024",
        text: "The frequency of AC power in the US is:",
        options: ["50 Hz", "60 Hz", "100 Hz", "120 Hz"],
        correct: 1
      },
      {
        id: "EI025",
        text: "Static electricity is caused by:",
        options: ["Moving electrons", "Transfer of electrons", "Magnetic fields", "Chemical reactions"],
        correct: 1
      },
      {
        id: "EI026",
        text: "What color is the hot wire in standard US wiring?",
        options: ["White", "Green", "Black", "Blue"],
        correct: 2
      },
      {
        id: "EI027",
        text: "A circuit breaker serves the same purpose as a:",
        options: ["Switch", "Fuse", "Capacitor", "Battery"],
        correct: 1
      },
      {
        id: "EI028",
        text: "Electromagnetic waves include all EXCEPT:",
        options: ["Radio waves", "Sound waves", "Light waves", "X-rays"],
        correct: 1
      },
      {
        id: "EI029",
        text: "Power (watts) equals:",
        options: ["Voltage × Current", "Voltage ÷ Current", "Current ÷ Resistance", "Resistance × Current"],
        correct: 0
      },
      {
        id: "EI030",
        text: "A multimeter can measure all EXCEPT:",
        options: ["Voltage", "Current", "Resistance", "Weight"],
        correct: 3
      }
    ],

    // ========================================
    // AUTO & SHOP INFORMATION (AS) - 25 questions
    // ========================================
    AS: [
      {
        id: "AS001",
        text: "What part of the engine compresses the air-fuel mixture?",
        options: ["Crankshaft", "Camshaft", "Piston", "Valve"],
        correct: 2
      },
      {
        id: "AS002",
        text: "Which tool is used to measure inside diameters?",
        options: ["Ruler", "Calipers", "Tape measure", "Square"],
        correct: 1
      },
      {
        id: "AS003",
        text: "What does the alternator do?",
        options: ["Starts the engine", "Charges the battery", "Controls fuel flow", "Filters oil"],
        correct: 1
      },
      {
        id: "AS004",
        text: "A Phillips head screwdriver has a tip shaped like a:",
        options: ["Flat line", "Square", "Cross/plus sign", "Hexagon"],
        correct: 2
      },
      {
        id: "AS005",
        text: "What system cools the engine?",
        options: ["Exhaust system", "Cooling system", "Fuel system", "Electrical system"],
        correct: 1
      },
      {
        id: "AS006",
        text: "What tool is used to tighten bolts to a specific torque?",
        options: ["Socket wrench", "Torque wrench", "Adjustable wrench", "Pipe wrench"],
        correct: 1
      },
      {
        id: "AS007",
        text: "The spark plug ignites the fuel mixture in which engine type?",
        options: ["Diesel", "Electric", "Gasoline", "Steam"],
        correct: 2
      },
      {
        id: "AS008",
        text: "What PPE should be worn when grinding metal?",
        options: ["Earplugs only", "Gloves only", "Safety glasses", "Hard hat"],
        correct: 2
      },
      {
        id: "AS009",
        text: "What part transfers power from the transmission to the wheels?",
        options: ["Clutch", "Drive shaft", "Starter", "Radiator"],
        correct: 1
      },
      {
        id: "AS010",
        text: "A hacksaw is primarily used to cut:",
        options: ["Wood", "Metal", "Plastic only", "Fabric"],
        correct: 1
      },
      {
        id: "AS011",
        text: "What does the catalytic converter do?",
        options: ["Increases horsepower", "Reduces emissions", "Filters fuel", "Cools exhaust"],
        correct: 1
      },
      {
        id: "AS012",
        text: "Which type of wrench has an adjustable jaw?",
        options: ["Box wrench", "Crescent wrench", "Socket wrench", "Combination wrench"],
        correct: 1
      },
      {
        id: "AS013",
        text: "Brake fluid should be what color when fresh?",
        options: ["Red", "Green", "Clear to light yellow", "Black"],
        correct: 2
      },
      {
        id: "AS014",
        text: "What is the purpose of a center punch?",
        options: ["Cutting metal", "Making starter holes", "Measuring depth", "Bending wire"],
        correct: 1
      },
      {
        id: "AS015",
        text: "The differential allows the wheels to:",
        options: ["Stop quickly", "Turn at different speeds", "Go in reverse", "Save fuel"],
        correct: 1
      },
      {
        id: "AS016",
        text: "What type of joint allows two shafts to connect at an angle?",
        options: ["Ball joint", "Universal joint", "Weld joint", "Rivet joint"],
        correct: 1
      },
      {
        id: "AS017",
        text: "A micrometer measures:",
        options: ["Voltage", "Weight", "Precise thickness", "Temperature"],
        correct: 2
      },
      {
        id: "AS018",
        text: "What component stores pressurized fuel?",
        options: ["Carburetor", "Fuel tank", "Fuel rail", "Fuel pump"],
        correct: 2
      },
      {
        id: "AS019",
        text: "What is the purpose of anti-freeze?",
        options: ["Lubricates engine", "Prevents coolant from freezing", "Cleans fuel injectors", "Charges battery"],
        correct: 1
      },
      {
        id: "AS020",
        text: "A ball-peen hammer is typically used for:",
        options: ["Woodworking", "Metalworking", "Masonry", "Plumbing"],
        correct: 1
      },
      {
        id: "AS021",
        text: "What part of the braking system applies pressure to the brake pads?",
        options: ["Master cylinder", "Brake caliper", "Brake rotor", "Brake line"],
        correct: 1
      },
      {
        id: "AS022",
        text: "What does OBD stand for in automotive diagnostics?",
        options: ["Original Brake Design", "On-Board Diagnostics", "Oil Bypass Device", "Outer Body Design"],
        correct: 1
      },
      {
        id: "AS023",
        text: "A tap is used to:",
        options: ["Cut external threads", "Cut internal threads", "Measure threads", "Clean threads"],
        correct: 1
      },
      {
        id: "AS024",
        text: "What maintains constant engine speed regardless of load?",
        options: ["Thermostat", "Governor", "Carburetor", "Alternator"],
        correct: 1
      },
      {
        id: "AS025",
        text: "When soldering, what removes oxidation from the metal surface?",
        options: ["Solder", "Flux", "Heat", "Wire brush"],
        correct: 1
      }
    ],

    // ========================================
    // MECHANICAL COMPREHENSION (MC) - 35 questions
    // ========================================
    MC: [
      {
        id: "MC001",
        text: "If Gear A turns clockwise, which direction does Gear B (meshed with Gear A) turn?",
        options: ["Clockwise", "Counter-clockwise", "Same as Gear A", "Gears don't mesh"],
        correct: 1
      },
      {
        id: "MC002",
        text: "Which class of lever has the fulcrum between the effort and the load?",
        options: ["First class", "Second class", "Third class", "Fourth class"],
        correct: 0
      },
      {
        id: "MC003",
        text: "A pulley system with 4 supporting ropes provides a mechanical advantage of:",
        options: ["2", "4", "8", "16"],
        correct: 1
      },
      {
        id: "MC004",
        text: "As the cross-sectional area of a pipe decreases, what happens to fluid velocity?",
        options: ["Decreases", "Stays the same", "Increases", "Stops flowing"],
        correct: 2
      },
      {
        id: "MC005",
        text: "A lever arm that is longer requires:",
        options: ["More force", "Less force", "Same force", "No force"],
        correct: 1
      },
      {
        id: "MC006",
        text: "What type of simple machine is a doorknob?",
        options: ["Lever", "Pulley", "Wheel and axle", "Inclined plane"],
        correct: 2
      },
      {
        id: "MC007",
        text: "If a 20-tooth gear drives a 40-tooth gear, the output speed will be:",
        options: ["Doubled", "Halved", "Same", "Quadrupled"],
        correct: 1
      },
      {
        id: "MC008",
        text: "What happens to pressure when the same force is applied over a larger area?",
        options: ["Increases", "Decreases", "Stays the same", "Becomes zero"],
        correct: 1
      },
      {
        id: "MC009",
        text: "A ramp is an example of which simple machine?",
        options: ["Lever", "Pulley", "Inclined plane", "Screw"],
        correct: 2
      },
      {
        id: "MC010",
        text: "In a hydraulic system, pressure is:",
        options: ["Greatest near the pump", "Transmitted equally in all directions", "Greatest at the outlet", "Variable throughout"],
        correct: 1
      },
      {
        id: "MC011",
        text: "A screw is a type of:",
        options: ["Lever", "Inclined plane wrapped around a cylinder", "Pulley", "Wheel and axle"],
        correct: 1
      },
      {
        id: "MC012",
        text: "The center of gravity of an object is the point where:",
        options: ["It is heaviest", "All weight appears to concentrate", "It is lightest", "It cannot balance"],
        correct: 1
      },
      {
        id: "MC013",
        text: "A wheelbarrow is an example of which class lever?",
        options: ["First class", "Second class", "Third class", "Not a lever"],
        correct: 1
      },
      {
        id: "MC014",
        text: "If a force of 10 N is applied to a surface area of 2 m², what is the pressure?",
        options: ["20 Pa", "5 Pa", "12 Pa", "8 Pa"],
        correct: 1
      },
      {
        id: "MC015",
        text: "Belt drives are used to:",
        options: ["Increase friction", "Transfer rotational motion", "Create heat", "Store energy"],
        correct: 1
      },
      {
        id: "MC016",
        text: "What happens to an object's potential energy as it is raised higher?",
        options: ["Decreases", "Stays the same", "Increases", "Becomes kinetic"],
        correct: 2
      },
      {
        id: "MC017",
        text: "A block and tackle with 3 pulleys provides a mechanical advantage of approximately:",
        options: ["1", "2", "3", "6"],
        correct: 2
      },
      {
        id: "MC018",
        text: "Friction between two surfaces generally:",
        options: ["Increases motion", "Opposes motion", "Has no effect", "Creates energy"],
        correct: 1
      },
      {
        id: "MC019",
        text: "In a gear train, the gear attached to the power source is called the:",
        options: ["Driven gear", "Idler gear", "Driver gear", "Output gear"],
        correct: 2
      },
      {
        id: "MC020",
        text: "What force keeps an object moving in a circle?",
        options: ["Gravity", "Centripetal force", "Friction", "Thrust"],
        correct: 1
      },
      {
        id: "MC021",
        text: "A wedge is a combination of:",
        options: ["Two levers", "Two inclined planes", "A pulley and lever", "A wheel and screw"],
        correct: 1
      },
      {
        id: "MC022",
        text: "Water pressure at the bottom of a tank is determined by the:",
        options: ["Tank width", "Water depth", "Tank material", "Water temperature"],
        correct: 1
      },
      {
        id: "MC023",
        text: "If you double the speed of an object, its kinetic energy:",
        options: ["Doubles", "Triples", "Quadruples", "Stays the same"],
        correct: 2
      },
      {
        id: "MC024",
        text: "A cam converts:",
        options: ["Linear motion to rotary motion", "Rotary motion to linear motion", "Energy to mass", "Heat to motion"],
        correct: 1
      },
      {
        id: "MC025",
        text: "Torque is calculated by multiplying force by:",
        options: ["Velocity", "Distance from pivot", "Mass", "Time"],
        correct: 1
      },
      {
        id: "MC026",
        text: "An object floats when its density is:",
        options: ["Greater than the fluid", "Equal to the fluid", "Less than the fluid", "Zero"],
        correct: 2
      },
      {
        id: "MC027",
        text: "Springs store energy in which form?",
        options: ["Kinetic", "Thermal", "Potential", "Chemical"],
        correct: 2
      },
      {
        id: "MC028",
        text: "A crank converts:",
        options: ["Linear to rotary motion", "Rotary to linear motion", "Either direction", "Neither"],
        correct: 2
      },
      {
        id: "MC029",
        text: "Ball bearings reduce:",
        options: ["Speed", "Power", "Friction", "Torque"],
        correct: 2
      },
      {
        id: "MC030",
        text: "The fulcrum of a pair of scissors is located:",
        options: ["At the tips", "At the pivot point", "On the handles", "There is no fulcrum"],
        correct: 1
      },
      {
        id: "MC031",
        text: "Mechanical advantage is the ratio of:",
        options: ["Input to output speed", "Output force to input force", "Weight to mass", "Distance to time"],
        correct: 1
      },
      {
        id: "MC032",
        text: "A worm gear system provides:",
        options: ["High speed, low torque", "Low speed, high torque", "Equal speed and torque", "Variable output"],
        correct: 1
      },
      {
        id: "MC033",
        text: "In a vacuum, all objects fall at:",
        options: ["Different rates based on mass", "The same rate", "Different rates based on shape", "No rate (they float)"],
        correct: 1
      },
      {
        id: "MC034",
        text: "A flywheel is used to:",
        options: ["Start engines", "Store rotational energy", "Reduce speed", "Increase friction"],
        correct: 1
      },
      {
        id: "MC035",
        text: "Pneumatic systems use what medium to transmit force?",
        options: ["Oil", "Electricity", "Compressed air", "Water"],
        correct: 2
      }
    ],

    // ========================================
    // ASSEMBLING OBJECTS (AO) - 30 questions
    // (Text-based descriptions - actual test uses images)
    // ========================================
    AO: [
      {
        id: "AO001",
        text: "A square and a circle are shown separately. Which answer shows them correctly connected at point A (marked on the square) to point B (marked on the circle)?",
        options: ["Circle attached to square's corner", "Circle attached to square's center edge", "Circle attached to square's center", "Circle overlapping square"],
        correct: 1
      },
      {
        id: "AO002",
        text: "Four triangular pieces are shown separately. Which answer shows them assembled into a square?",
        options: ["Four triangles forming a square with all points meeting at center", "Triangles stacked on top of each other", "Triangles arranged in a line", "Triangles overlapping randomly"],
        correct: 0
      },
      {
        id: "AO003",
        text: "A pentagon has point A marked on one edge. A triangle has point B marked on one edge. Which shows A and B connected?",
        options: ["Triangle inside pentagon", "Triangle touching pentagon at one point", "Shapes completely separate", "Shapes completely overlapped"],
        correct: 1
      },
      {
        id: "AO004",
        text: "An L-shaped piece and a rectangular piece are shown. Which answer shows them combined to form a complete square?",
        options: ["L-shape with rectangle filling the gap", "Rectangle on top of L-shape", "L-shape rotated with rectangle", "Pieces side by side"],
        correct: 0
      },
      {
        id: "AO005",
        text: "Two irregular curved shapes are shown. Point A on shape 1 connects to point B on shape 2. Which shows the correct assembly?",
        options: ["Shapes forming a circle when connected", "Shapes at 90 degrees", "Shapes parallel", "Shapes opposite directions"],
        correct: 0
      },
      {
        id: "AO006",
        text: "A hexagon and a triangle are shown with connection points A and B. Which shows proper connection?",
        options: ["Triangle inside hexagon", "Triangle attached to hexagon edge at marked points", "Shapes overlapping", "Shapes not touching"],
        correct: 1
      },
      {
        id: "AO007",
        text: "Five puzzle pieces are shown. Which answer shows them assembled into a rectangle?",
        options: ["Pieces forming solid rectangle", "Pieces with gaps", "Pieces overlapping", "Pieces in a line"],
        correct: 0
      },
      {
        id: "AO008",
        text: "A star shape has point A marked. A circle has point B marked. Which shows correct connection at the marked points?",
        options: ["Circle in star center", "Circle touching star point where A meets B", "Circle around star", "Circle below star"],
        correct: 1
      },
      {
        id: "AO009",
        text: "Three rectangular pieces of different sizes are shown. Which shows them assembled into an L-shape?",
        options: ["All three forming L-shape", "Two forming L, one separate", "Stacked rectangles", "Three in a row"],
        correct: 0
      },
      {
        id: "AO010",
        text: "Two trapezoids are shown with connection points. Which shows them assembled into a hexagon?",
        options: ["Trapezoids forming hexagon", "Trapezoids forming rectangle", "Trapezoids side by side", "Trapezoids overlapping"],
        correct: 0
      },
      {
        id: "AO011",
        text: "A square with point A and an oval with point B are shown. Which connects A to B correctly?",
        options: ["Oval overlapping square", "Oval touching square at marked points", "Oval inside square", "Oval separate from square"],
        correct: 1
      },
      {
        id: "AO012",
        text: "Four identical right triangles are shown. Which shows them assembled into a square?",
        options: ["Triangles meeting at center to form square", "Triangles in a line", "Triangles stacked", "Triangles as a larger triangle"],
        correct: 0
      },
      {
        id: "AO013",
        text: "A crescent shape and a circle are shown with connection points A and B. Which shows correct connection?",
        options: ["Circle inside crescent curve", "Circle touching crescent at marked points", "Circle behind crescent", "Shapes not connected"],
        correct: 1
      },
      {
        id: "AO014",
        text: "Two T-shaped pieces are shown. Which shows them assembled into a plus/cross shape?",
        options: ["T-shapes forming plus sign", "T-shapes side by side", "T-shapes overlapping", "T-shapes at angle"],
        correct: 0
      },
      {
        id: "AO015",
        text: "A diamond and a rectangle have points A and B marked. Which shows them connected at these points?",
        options: ["Rectangle through diamond", "Diamond touching rectangle at marked points", "Diamond inside rectangle", "Shapes separate"],
        correct: 1
      },
      {
        id: "AO016",
        text: "Six triangular pieces are shown. Which shows them assembled into a hexagon?",
        options: ["Triangles forming hexagon with points meeting at center", "Triangles in a row", "Triangles overlapping", "Triangles forming circle"],
        correct: 0
      },
      {
        id: "AO017",
        text: "An arrow shape and a square have connection points. Which shows proper assembly?",
        options: ["Arrow inside square", "Arrow attached to square at marked points", "Arrow pointing away from square", "Shapes overlapping completely"],
        correct: 1
      },
      {
        id: "AO018",
        text: "Three pieces form a puzzle. Which assembled shape is a perfect circle?",
        options: ["Three curved pieces forming complete circle", "Three pieces with gaps", "Three pieces forming oval", "Three pieces forming square"],
        correct: 0
      },
      {
        id: "AO019",
        text: "A heart shape and a triangle have points A and B marked. Which connects them correctly?",
        options: ["Triangle in heart center", "Triangle touching heart at marked points", "Triangle overlapping heart", "Shapes not touching"],
        correct: 1
      },
      {
        id: "AO020",
        text: "Four L-shaped pieces are shown. Which shows them assembled into a square with a square hole in the center?",
        options: ["L-shapes forming square frame", "L-shapes forming solid square", "L-shapes in a line", "L-shapes stacked"],
        correct: 0
      },
      {
        id: "AO021",
        text: "A semicircle and a rectangle have connection points. Which shows correct assembly?",
        options: ["Semicircle on rectangle forming dome shape", "Shapes touching at marked points", "Semicircle inside rectangle", "Shapes overlapping"],
        correct: 1
      },
      {
        id: "AO022",
        text: "Three parallelograms are shown. Which shows them assembled into a hexagon?",
        options: ["Parallelograms forming hexagon", "Parallelograms in a row", "Parallelograms stacked", "Parallelograms forming triangle"],
        correct: 0
      },
      {
        id: "AO023",
        text: "A lightning bolt shape and an oval have points A and B. Which shows correct connection?",
        options: ["Oval around lightning bolt", "Shapes touching at marked points", "Lightning bolt inside oval", "Shapes separate"],
        correct: 1
      },
      {
        id: "AO024",
        text: "Two curved pieces are shown. Which shows them assembled into a complete ring/donut shape?",
        options: ["Curves forming complete ring", "Curves overlapping", "Curves side by side", "Curves stacked"],
        correct: 0
      },
      {
        id: "AO025",
        text: "An octagon and a square have connection points A and B. Which shows correct connection?",
        options: ["Square inside octagon", "Shapes touching at marked points", "Octagon inside square", "Shapes completely overlapped"],
        correct: 1
      },
      {
        id: "AO026",
        text: "Four identical pieces are shown. Which shows them assembled into a pinwheel pattern?",
        options: ["Pieces forming pinwheel with rotation symmetry", "Pieces in a line", "Pieces stacked", "Pieces random arrangement"],
        correct: 0
      },
      {
        id: "AO027",
        text: "A cross shape and a diamond have points A and B marked. Which connects them correctly?",
        options: ["Diamond in cross center", "Shapes touching at marked points A and B", "Diamond around cross", "Shapes not touching"],
        correct: 1
      },
      {
        id: "AO028",
        text: "Five pentagon pieces are shown. Which shows them assembled to form a larger pentagon?",
        options: ["Pentagons forming larger pentagon", "Pentagons forming circle", "Pentagons in a line", "Pentagons random pattern"],
        correct: 0
      },
      {
        id: "AO029",
        text: "A teardrop shape and a triangle have connection points. Which shows correct assembly?",
        options: ["Triangle inside teardrop", "Shapes touching at marked points", "Teardrop inside triangle", "Shapes overlapping"],
        correct: 1
      },
      {
        id: "AO030",
        text: "Eight triangular pieces are shown. Which shows them assembled into an octagon?",
        options: ["Triangles forming octagon", "Triangles forming square", "Triangles in a line", "Triangles forming star"],
        correct: 0
      }
    ]
  }
};

// Utility functions for quiz management
const QuizManager = {
  // Shuffle array using Fisher-Yates algorithm
  shuffleArray: function(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  // Get random questions for a section
  getRandomQuestions: function(sectionCode, count) {
    const questions = asvabData.questions[sectionCode];
    if (!questions) return [];

    const numQuestions = count || asvabData.sections[sectionCode].questionsPerTest;
    const shuffled = this.shuffleArray(questions);
    return shuffled.slice(0, Math.min(numQuestions, shuffled.length));
  },

  // Get section info
  getSectionInfo: function(sectionCode) {
    return asvabData.sections[sectionCode] || null;
  },

  // Get all AFQT sections
  getAFQTSections: function() {
    return Object.keys(asvabData.sections).filter(code =>
      asvabData.sections[code].inAFQT
    );
  },

  // Get all section codes
  getAllSectionCodes: function() {
    return Object.keys(asvabData.sections);
  },

  // Generate a complete test with randomized questions
  generateTest: function(sectionCodes) {
    const test = {
      generatedAt: new Date().toISOString(),
      sections: {}
    };

    const codes = sectionCodes || this.getAllSectionCodes();

    codes.forEach(code => {
      const sectionInfo = this.getSectionInfo(code);
      if (sectionInfo) {
        test.sections[code] = {
          ...sectionInfo,
          questions: this.getRandomQuestions(code)
        };
      }
    });

    return test;
  },

  // Generate AFQT-only test
  generateAFQTTest: function() {
    return this.generateTest(this.getAFQTSections());
  },

  // Shuffle answer options for a question (and track correct answer)
  shuffleQuestionOptions: function(question) {
    const shuffled = { ...question };
    const options = [...question.options];
    const correctAnswer = options[question.correct];

    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    // Find new position of correct answer
    shuffled.options = options;
    shuffled.correct = options.indexOf(correctAnswer);

    return shuffled;
  },

  // Get questions with shuffled options
  getRandomQuestionsWithShuffledOptions: function(sectionCode, count) {
    const questions = this.getRandomQuestions(sectionCode, count);
    return questions.map(q => this.shuffleQuestionOptions(q));
  },

  // Get total question count for a section
  getTotalQuestionCount: function(sectionCode) {
    return asvabData.questions[sectionCode]?.length || 0;
  },

  // Get summary statistics
  getStatistics: function() {
    const stats = {
      totalQuestions: 0,
      sections: {}
    };

    Object.keys(asvabData.questions).forEach(code => {
      const count = asvabData.questions[code].length;
      stats.sections[code] = {
        name: asvabData.sections[code].name,
        questionPool: count,
        questionsPerTest: asvabData.sections[code].questionsPerTest,
        inAFQT: asvabData.sections[code].inAFQT
      };
      stats.totalQuestions += count;
    });

    return stats;
  }
};

// Legacy compatibility - single section format for existing quiz.html
function getQuizDataForSection(sectionCode) {
  const section = asvabData.sections[sectionCode];
  const questions = QuizManager.getRandomQuestionsWithShuffledOptions(sectionCode);

  return {
    section: section.name,
    sectionCode: section.code,
    timeLimit: section.timeLimit,
    questions: questions.map((q, index) => ({
      id: index + 1,
      text: q.text,
      options: q.options,
      correct: q.correct
    }))
  };
}

// Store globally for access
window.asvabData = asvabData;
window.QuizManager = QuizManager;
window.getQuizDataForSection = getQuizDataForSection;

// Legacy support - create quizData for existing code
window.quizData = getQuizDataForSection('AR');
