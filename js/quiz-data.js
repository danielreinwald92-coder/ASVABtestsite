// ASVAB Practice Test Question Database
// Based on CAT-ASVAB (Computer Adaptive Test) structure
// Question pools are larger than test requirements to enable randomization

const asvabData = {
  // Test configuration matching CAT-ASVAB.
  // Single source of truth: js/section-config.js (window.SECTION_CONFIG),
  // which must load before this file on every page that uses quiz-data.js.
  sections: (typeof window !== 'undefined' ? window : this).SECTION_CONFIG,

  // Question pools by section
  questions: {
    // ========================================
    // GENERAL SCIENCE (GS) - 30 questions
    // Difficulty: 1=easy, 2=medium-easy, 3=medium, 4=medium-hard, 5=hard
    // ========================================
    GS: [
      {
        id: "GS001",
        text: "What is the primary function of red blood cells?",
        options: ["Fight infection", "Carry oxygen", "Clot blood", "Produce antibodies"],
        correct: 1,
        difficulty: 1
      },
      {
        id: "GS002",
        text: "Which planet is closest to the Sun?",
        options: ["Venus", "Mercury", "Mars", "Earth"],
        correct: 1,
        difficulty: 1
      },
      {
        id: "GS003",
        text: "What type of rock is formed from cooled magma or lava?",
        options: ["Sedimentary", "Metamorphic", "Igneous", "Ite (Crystal)"],
        correct: 2,
        difficulty: 2
      },
      {
        id: "GS004",
        text: "The process by which plants convert sunlight into energy is called:",
        options: ["Respiration", "Photosynthesis", "Fermentation", "Oxidation"],
        correct: 1,
        difficulty: 1
      },
      {
        id: "GS005",
        text: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correct: 2,
        difficulty: 2
      },
      {
        id: "GS006",
        text: "Which organ in the human body produces insulin?",
        options: ["Liver", "Kidney", "Pancreas", "Stomach"],
        correct: 2,
        difficulty: 3
      },
      {
        id: "GS007",
        text: "What is the smallest unit of matter that retains the properties of an element?",
        options: ["Molecule", "Atom", "Electron", "Proton"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "GS008",
        text: "The Earth's atmosphere is primarily composed of:",
        options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
        correct: 2,
        difficulty: 3
      },
      {
        id: "GS009",
        text: "What type of wave is sound?",
        options: ["Electromagnetic", "Transverse", "Longitudinal", "Radio"],
        correct: 2,
        difficulty: 4
      },
      {
        id: "GS010",
        text: "Which blood type is considered the universal donor?",
        options: ["A", "B", "AB", "O negative"],
        correct: 3,
        difficulty: 3
      },
      {
        id: "GS011",
        text: "What is the hardest natural substance on Earth?",
        options: ["Quartz", "Topaz", "Diamond", "Corundum"],
        correct: 2,
        difficulty: 1
      },
      {
        id: "GS012",
        text: "The ozone layer protects Earth from:",
        options: ["Meteors", "Ultraviolet radiation", "Radio waves", "Infrared light"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "GS013",
        text: "What is the process called when a solid changes directly to a gas?",
        options: ["Evaporation", "Condensation", "Sublimation", "Deposition"],
        correct: 2,
        difficulty: 4
      },
      {
        id: "GS014",
        text: "Which part of the cell contains genetic material?",
        options: ["Cytoplasm", "Nucleus", "Mitochondria", "Ribosome"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "GS015",
        text: "What is the SI unit of force?",
        options: ["Watt", "Joule", "Newton", "Pascal"],
        correct: 2,
        difficulty: 3
      },
      {
        id: "GS016",
        text: "How many chromosomes do humans have in each cell?",
        options: ["23", "46", "44", "48"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "GS017",
        text: "What causes tides in the ocean?",
        options: ["Wind patterns", "Earth's rotation", "Gravitational pull of the Moon", "Underwater earthquakes"],
        correct: 2,
        difficulty: 2
      },
      {
        id: "GS018",
        text: "Which vitamin is produced when skin is exposed to sunlight?",
        options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin E"],
        correct: 2,
        difficulty: 2
      },
      {
        id: "GS019",
        text: "What is the pH of pure water?",
        options: ["0", "7", "14", "1"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "GS020",
        text: "The Richter scale measures:",
        options: ["Wind speed", "Earthquake magnitude", "Temperature", "Radiation levels"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "GS021",
        text: "Which gas do plants absorb from the atmosphere during photosynthesis?",
        options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
        correct: 2,
        difficulty: 1
      },
      {
        id: "GS022",
        text: "What is the largest organ in the human body?",
        options: ["Liver", "Brain", "Skin", "Heart"],
        correct: 2,
        difficulty: 2
      },
      {
        id: "GS023",
        text: "Light travels fastest through which medium?",
        options: ["Water", "Glass", "Air", "Vacuum"],
        correct: 3,
        difficulty: 4
      },
      {
        id: "GS024",
        text: "What type of blood vessel carries blood away from the heart?",
        options: ["Veins", "Capillaries", "Arteries", "Lymph vessels"],
        correct: 2,
        difficulty: 2
      },
      {
        id: "GS025",
        text: "The periodic table organizes elements by their:",
        options: ["Atomic number", "Weight", "Color", "Discovery date"],
        correct: 0,
        difficulty: 3
      },
      {
        id: "GS026",
        text: "What is the freezing point of water in Celsius?",
        options: ["32°", "0°", "-32°", "100°"],
        correct: 1,
        difficulty: 1
      },
      {
        id: "GS027",
        text: "Which layer of the Earth is liquid?",
        options: ["Inner core", "Outer core", "Mantle", "Crust"],
        correct: 1,
        difficulty: 4
      },
      {
        id: "GS028",
        text: "What is the function of white blood cells?",
        options: ["Carry oxygen", "Fight infection", "Clot blood", "Transport nutrients"],
        correct: 1,
        difficulty: 1
      },
      {
        id: "GS029",
        text: "Sound cannot travel through:",
        options: ["Water", "Steel", "Air", "Vacuum"],
        correct: 3,
        difficulty: 3
      },
      {
        id: "GS030",
        text: "What is the chemical formula for water?",
        options: ["H2O", "CO2", "NaCl", "O2"],
        correct: 0,
        difficulty: 1
      }
    ],

    // ========================================
    // ARITHMETIC REASONING (AR) - 63 questions
    // ========================================
    AR: [
      {
        id: "AR001",
        text: "A store sells apples for $0.75 each. How much would 8 apples cost?",
        options: ["$5.00", "$6.00", "$6.50", "$7.00"],
        correct: 1,
        difficulty: 1
      },
      {
        id: "AR002",
        text: "If a car travels 240 miles in 4 hours, what is its average speed in miles per hour?",
        options: ["50 mph", "55 mph", "60 mph", "65 mph"],
        correct: 2,
        difficulty: 1
      },
      {
        id: "AR003",
        text: "A carpenter needs to cut a board into pieces that are each 2¾ feet long. If the original board is 16½ feet long, how many complete pieces can be cut?",
        options: ["4 pieces", "6 pieces", "7 pieces", "8 pieces"],
        correct: 1,
        difficulty: 4
      },
      {
        id: "AR004",
        text: "If 15% of a number is 45, what is the number?",
        options: ["200", "250", "275", "300"],
        correct: 3,
        difficulty: 3
      },
      {
        id: "AR005",
        text: "A worker earns $18.50 per hour. How much does she earn in a 40-hour week?",
        options: ["$700", "$720", "$740", "$760"],
        correct: 2,
        difficulty: 2
      },
      {
        id: "AR006",
        text: "A rectangle has a length of 12 feet and a width of 8 feet. What is its perimeter?",
        options: ["96 feet", "20 feet", "40 feet", "80 feet"],
        correct: 2,
        difficulty: 1
      },
      {
        id: "AR007",
        text: "If a shirt originally costs $45 and is on sale for 20% off, what is the sale price?",
        options: ["$9", "$25", "$36", "$40"],
        correct: 2,
        difficulty: 2
      },
      {
        id: "AR008",
        text: "A tank can hold 150 gallons of water. If it is currently 2/3 full, how many gallons of water are in the tank?",
        options: ["50 gallons", "75 gallons", "100 gallons", "125 gallons"],
        correct: 2,
        difficulty: 2
      },
      {
        id: "AR009",
        text: "John has 3 times as many marbles as Mike. If they have 48 marbles together, how many does John have?",
        options: ["12", "16", "32", "36"],
        correct: 3,
        difficulty: 3
      },
      {
        id: "AR010",
        text: "A bus travels 45 miles in 1 hour and 15 minutes. What is its average speed?",
        options: ["30 mph", "36 mph", "40 mph", "45 mph"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "AR011",
        text: "If 5 workers can complete a job in 12 days, how many days would it take 10 workers to complete the same job?",
        options: ["4 days", "6 days", "8 days", "24 days"],
        correct: 1,
        difficulty: 4
      },
      {
        id: "AR012",
        text: "A pizza is cut into 8 equal slices. If Tom eats 3 slices and Jerry eats 2 slices, what fraction of the pizza remains?",
        options: ["1/8", "1/4", "3/8", "5/8"],
        correct: 2,
        difficulty: 2
      },
      {
        id: "AR013",
        text: "The sum of two consecutive odd numbers is 56. What is the larger number?",
        options: ["27", "28", "29", "31"],
        correct: 2,
        difficulty: 4
      },
      {
        id: "AR014",
        text: "A bicycle wheel has a diameter of 26 inches. Approximately how far does the bicycle travel in one complete rotation? (Use π ≈ 3.14)",
        options: ["41 inches", "52 inches", "82 inches", "163 inches"],
        correct: 2,
        difficulty: 3
      },
      {
        id: "AR015",
        text: "If gas costs $3.50 per gallon and a car gets 28 miles per gallon, how much would it cost to drive 196 miles?",
        options: ["$17.50", "$24.50", "$28.00", "$49.00"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "AR016",
        text: "A rope 72 feet long is cut into two pieces. One piece is twice as long as the other. How long is the shorter piece?",
        options: ["18 feet", "24 feet", "36 feet", "48 feet"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "AR017",
        text: "Sarah scored 85, 92, and 78 on her first three tests. What score does she need on her fourth test to have an average of 85?",
        options: ["80", "82", "85", "88"],
        correct: 2,
        difficulty: 4
      },
      {
        id: "AR018",
        text: "A train leaves Station A at 9:00 AM traveling at 60 mph. Another train leaves Station B at 10:00 AM traveling toward Station A at 80 mph. If the stations are 280 miles apart, at what time will the trains meet?",
        options: ["11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM"],
        correct: 1,
        difficulty: 5
      },
      {
        id: "AR019",
        text: "If a square has a perimeter of 48 inches, what is its area?",
        options: ["96 sq in", "144 sq in", "192 sq in", "576 sq in"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "AR020",
        text: "A store marks up items by 40% over cost. If a jacket sells for $84, what was the store's cost?",
        options: ["$50", "$55", "$60", "$65"],
        correct: 2,
        difficulty: 4
      },
      {
        id: "AR021",
        text: "A soldier runs 2 miles in 14 minutes. At this pace, how long would it take to run 5 miles?",
        options: ["28 minutes", "30 minutes", "35 minutes", "40 minutes"],
        correct: 2,
        difficulty: 2
      },
      {
        id: "AR022",
        text: "A recruiter needs to process 180 applications. If she processes 12 applications per hour, how many hours will it take?",
        options: ["12 hours", "15 hours", "16 hours", "18 hours"],
        correct: 1,
        difficulty: 1
      },
      {
        id: "AR023",
        text: "Three soldiers share the cost of supplies equally. If the total cost is $47.25, how much does each soldier pay?",
        options: ["$14.75", "$15.25", "$15.75", "$16.25"],
        correct: 2,
        difficulty: 2
      },
      {
        id: "AR024",
        text: "A military vehicle uses 8 gallons of fuel every 100 miles. How many gallons are needed for a 350-mile trip?",
        options: ["24 gallons", "28 gallons", "32 gallons", "35 gallons"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "AR025",
        text: "If a base has 1,250 personnel and 30% are officers, how many enlisted personnel are there?",
        options: ["375", "625", "875", "1,000"],
        correct: 2,
        difficulty: 3
      },
      {
        id: "AR026",
        text: "A supply room has 420 items. After using 1/4 of the items and receiving a shipment of 80 more, how many items are there?",
        options: ["315", "395", "420", "500"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "AR027",
        text: "A helicopter flies at 150 mph. How far can it travel in 2 hours and 20 minutes?",
        options: ["300 miles", "320 miles", "350 miles", "370 miles"],
        correct: 2,
        difficulty: 3
      },
      {
        id: "AR028",
        text: "A rectangular barracks measures 40 feet by 25 feet. What is the area in square feet?",
        options: ["130 sq ft", "650 sq ft", "1,000 sq ft", "1,500 sq ft"],
        correct: 2,
        difficulty: 1
      },
      {
        id: "AR029",
        text: "If ammunition costs $0.35 per round, how much do 500 rounds cost?",
        options: ["$150", "$175", "$200", "$225"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "AR030",
        text: "A patrol covers 18 miles in 3 hours walking and 45 miles in 1 hour driving. What is the total distance covered?",
        options: ["51 miles", "58 miles", "63 miles", "66 miles"],
        correct: 2,
        difficulty: 1
      },
      {
        id: "AR031",
        text: "A water tank loses 5% of its water each day to evaporation. If it starts with 400 gallons, how much remains after one day?",
        options: ["360 gallons", "380 gallons", "395 gallons", "400 gallons"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "AR032",
        text: "A soldier's monthly pay is $2,400. If taxes take 22%, what is the take-home pay?",
        options: ["$1,728", "$1,848", "$1,872", "$1,920"],
        correct: 2,
        difficulty: 3
      },
      {
        id: "AR033",
        text: "Three trucks can carry 15 tons each. How many trips are needed to transport 120 tons?",
        options: ["2 trips", "3 trips", "4 trips", "8 trips"],
        correct: 1,
        difficulty: 4
      },
      {
        id: "AR034",
        text: "A mission is scheduled to start at 0600 hours and last 8 hours 45 minutes. At what time will it end?",
        options: ["1345 hours", "1445 hours", "1500 hours", "1545 hours"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "AR035",
        text: "If the ratio of officers to enlisted is 1:8 and there are 72 enlisted personnel, how many officers are there?",
        options: ["6", "8", "9", "12"],
        correct: 2,
        difficulty: 3
      },
      {
        id: "AR036",
        text: "If 10 inches on a map represents an actual distance of 100 feet, then what actual distance does 25 inches on the map represent?",
        options: ["25 feet", "100 feet", "150 feet", "250 feet"],
        correct: 3,
        difficulty: 2
      },
      {
        id: "AR037",
        text: "Jill bought 9 bottles of juice for 12 people. How many bottles would she need for 8 people?",
        options: ["6", "8", "10", "12"],
        correct: 0,
        difficulty: 2
      },
      {
        id: "AR038",
        text: "A cleaning company charged $600 for cleaning 4,800 square feet. What would they charge for 12,000 square feet?",
        options: ["$950", "$1,200", "$1,400", "$1,500"],
        correct: 3,
        difficulty: 3
      },
      {
        id: "AR039",
        text: "Kelly's rent increased from $500 to $525 monthly. What percent increase is this?",
        options: ["0.5 percent", "5 percent", "10 percent", "12.5 percent"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "AR040",
        text: "Diane gets a haircut ($45) and color treatment ($150) at a salon. If she's expected to leave a 15% tip, how much should she leave?",
        options: ["$22.50", "$29.25", "$20.00", "$224.25"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "AR041",
        text: "Oscar purchased a hat on sale for $5.06. The original price was $9.20. What percentage discount was the sale price?",
        options: ["4.5%", "41.4%", "45%", "55%"],
        correct: 2,
        difficulty: 3
      },
      {
        id: "AR042",
        text: "Maya purchased a boat for $18,340. Its value depreciated 15% in the first year. What was it worth at year's end?",
        options: ["$2,751", "$21,091", "$12,227", "$15,589"],
        correct: 3,
        difficulty: 4
      },
      {
        id: "AR043",
        text: "Of 200 conference attendees, 53 percent were women. How many women attended?",
        options: ["94", "212", "53", "106"],
        correct: 3,
        difficulty: 2
      },
      {
        id: "AR044",
        text: "Captain Mike leaves the dock at 10:00 a.m. and travels down the river at 55 miles per hour. How far will he have traveled by 5:00 p.m.?",
        options: ["330 miles", "275 miles", "380 miles", "385 miles"],
        correct: 3,
        difficulty: 2
      },
      {
        id: "AR045",
        text: "Delia walks at 2.5 mph for 12 minutes. How far has she traveled?",
        options: ["0.2 miles", "0.5 miles", "2 miles", "4.8 miles"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "AR046",
        text: "If a car travels 360 kilometers in 5 hours, how many kilometers will it travel in 9 hours at the same speed?",
        options: ["72", "288", "620", "648"],
        correct: 3,
        difficulty: 2
      },
      {
        id: "AR047",
        text: "Sofia drives 70 km/h for 2 hours, then 63 km/h for 5 hours. What was her average speed over the 7-hour period?",
        options: ["64 km/h", "65 km/h", "66 km/h", "67 km/h"],
        correct: 1,
        difficulty: 4
      },
      {
        id: "AR048",
        text: "Mia earns $8.10 per hour and worked 40 hours. Charlotte earns $10.80 per hour. How many hours would Charlotte need to work to equal Mia's earnings?",
        options: ["25", "27", "28", "30"],
        correct: 3,
        difficulty: 3
      },
      {
        id: "AR049",
        text: "Two pizza ovens exist. Oven #1 burns three times as many pizzas as Oven #2. If a total of 12 pizzas were burned on Saturday, how many did Oven #2 burn?",
        options: ["2", "3", "4", "5"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "AR051",
        text: "Paul invests $2,000 at 4 percent annual interest. How much interest does he earn in one year?",
        options: ["$160", "$80", "$120", "$800"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "AR052",
        text: "A vehicle worth $8,000 depreciates 15% each year for 2 years. After two years, how much is the vehicle worth?",
        options: ["$5,440", "$5,780", "$6,400", "$6,800"],
        correct: 1,
        difficulty: 4
      },
      {
        id: "AR053",
        text: "Given 2 pints per quart and 4 quarts per gallon, how many pints are in 2 gallons?",
        options: ["32 pints", "16 pints", "8 pints", "4 pints"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "AR054",
        text: "Sergeant Jeffries walked 1.2 miles. With 5,280 feet per mile, how many feet did he walk?",
        options: ["7,392 ft", "1,056 ft", "5,780 ft", "6,336 ft"],
        correct: 3,
        difficulty: 2
      },
      {
        id: "AR055",
        text: "Stephen needs 5 gallons of lemonade. His bucket contains 3.5 gallons. How many pints must he add to fill it?",
        options: ["6", "8", "10", "12"],
        correct: 3,
        difficulty: 3
      },
      {
        id: "AR056",
        text: "A radar system beeps once every second. How many times will it beep in 3 days?",
        options: ["10,800", "86,400", "129,600", "259,200"],
        correct: 3,
        difficulty: 4
      },
      {
        id: "AR057",
        text: "A phone company charges $2 for the first five minutes and 30 cents per minute thereafter. If Malik makes a 25-minute call, what is the total cost?",
        options: ["$8.00", "$8.50", "$9.00", "$9.50"],
        correct: 0,
        difficulty: 3
      },
      {
        id: "AR058",
        text: "Five years ago, Amy was three times as old as Mike. If Mike is 10 years old now, how old is Amy?",
        options: ["15", "20", "25", "30"],
        correct: 1,
        difficulty: 4
      },
      {
        id: "AR059",
        text: "A bag contains 8 pennies, 5 dimes, and 7 nickels. What's the probability of randomly selecting a dime?",
        options: ["1/20", "1/4", "1/3", "3/10"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "AR060",
        text: "Aisha wants to paint a room's walls. Each gallon covers 110 square feet. The walls are: two at 10x10 feet and two at 10x15 feet. How many 1-gallon buckets are needed?",
        options: ["4", "5", "9", "10"],
        correct: 1,
        difficulty: 4
      },
      {
        id: "AR061",
        text: "Kendra earns $12/hour with 1.5x pay for overtime. She worked 40 hours plus 4 overtime hours. What are her total earnings?",
        options: ["$552", "$528", "$480", "$500"],
        correct: 0,
        difficulty: 3
      },
      {
        id: "AR062",
        text: "If 45 gallons of water pass through a pipe in 9 seconds, how many gallons pass through in 4 seconds?",
        options: ["15 gallons", "20 gallons", "25 gallons", "36 gallons"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "AR063",
        text: "A store sells pencils for $0.25 each or a pack of 12 for $2.50. How much do you save by buying the pack instead of 12 individual pencils?",
        options: ["$0.25", "$0.50", "$0.75", "$1.00"],
        correct: 1,
        difficulty: 2
      },
      // Ratios and Proportions
      {
        id: "AR064",
        text: "The ratio of men to women in a training class is 5:3. If there are 40 men, how many women are in the class?",
        options: ["15", "24", "30", "35"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "AR065",
        text: "A recipe calls for flour and sugar in a ratio of 4:1. If you use 12 cups of flour, how many cups of sugar do you need?",
        options: ["2", "3", "4", "6"],
        correct: 1,
        difficulty: 1
      },
      {
        id: "AR066",
        text: "On a map, 2 inches represents 50 miles. How many miles does 7 inches represent?",
        options: ["150 miles", "175 miles", "200 miles", "250 miles"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "AR067",
        text: "The ratio of sergeants to privates is 2:9. If there are 99 total personnel, how many are sergeants?",
        options: ["11", "18", "22", "81"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "AR068",
        text: "A car uses 3 gallons of gas for every 90 miles. How many gallons will it need for 450 miles?",
        options: ["12 gallons", "15 gallons", "18 gallons", "20 gallons"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "AR069",
        text: "If 8 workers can complete a task in 6 days, how many workers are needed to complete it in 4 days?",
        options: ["10", "11", "12", "14"],
        correct: 2,
        difficulty: 4
      },
      // Percentages (discounts, tax, tips, percent change)
      {
        id: "AR070",
        text: "A jacket originally priced at $120 is marked down 25%. What is the sale price?",
        options: ["$30", "$85", "$90", "$95"],
        correct: 2,
        difficulty: 2
      },
      {
        id: "AR071",
        text: "A server receives an 18% tip on a $65 bill. How much is the tip?",
        options: ["$9.75", "$10.40", "$11.70", "$13.00"],
        correct: 2,
        difficulty: 2
      },
      {
        id: "AR072",
        text: "A computer's price increased from $800 to $920. What is the percent increase?",
        options: ["12%", "13%", "15%", "18%"],
        correct: 2,
        difficulty: 3
      },
      {
        id: "AR073",
        text: "An item costs $45 before tax. If the sales tax is 8%, what is the total cost?",
        options: ["$48.00", "$48.60", "$49.20", "$53.00"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "AR074",
        text: "A store sells an item for $63, which includes a 40% markup over cost. What was the original cost?",
        options: ["$37.80", "$42.00", "$45.00", "$50.40"],
        correct: 2,
        difficulty: 4
      },
      {
        id: "AR075",
        text: "Last year a company had 250 employees. This year it has 300. What is the percent increase?",
        options: ["15%", "17%", "20%", "25%"],
        correct: 2,
        difficulty: 3
      },
      // Distance/Rate/Time Problems
      {
        id: "AR076",
        text: "A cyclist travels 48 miles in 3 hours. At this rate, how long will it take to travel 80 miles?",
        options: ["4 hours", "4.5 hours", "5 hours", "5.5 hours"],
        correct: 2,
        difficulty: 2
      },
      {
        id: "AR077",
        text: "Two cars start from the same point traveling in opposite directions. One goes 55 mph and the other 65 mph. How far apart are they after 3 hours?",
        options: ["330 miles", "360 miles", "390 miles", "420 miles"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "AR078",
        text: "A plane flies 1,200 miles with a tailwind in 3 hours. On the return trip against the wind, it takes 4 hours. What is the plane's speed in still air?",
        options: ["300 mph", "325 mph", "350 mph", "400 mph"],
        correct: 2,
        difficulty: 5
      },
      {
        id: "AR079",
        text: "A runner completes a 10-mile race in 1 hour and 40 minutes. What was her average speed in mph?",
        options: ["5 mph", "6 mph", "7 mph", "8 mph"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "AR080",
        text: "A train leaves at 8:15 AM traveling at 75 mph. At what time will it arrive at a station 225 miles away?",
        options: ["10:45 AM", "11:00 AM", "11:15 AM", "11:30 AM"],
        correct: 2,
        difficulty: 3
      },
      {
        id: "AR081",
        text: "A delivery truck averages 45 mph including stops. How long will a 315-mile route take?",
        options: ["6 hours", "7 hours", "8 hours", "9 hours"],
        correct: 1,
        difficulty: 2
      },
      // Work Problems (two workers, pipes filling tanks)
      {
        id: "AR082",
        text: "Worker A can paint a house in 6 days. Worker B can paint it in 4 days. Working together, how many days will it take?",
        options: ["2 days", "2.4 days", "3 days", "5 days"],
        correct: 1,
        difficulty: 4
      },
      {
        id: "AR083",
        text: "Pipe A fills a tank in 8 hours. Pipe B fills it in 12 hours. How long to fill the tank with both pipes open?",
        options: ["4 hours", "4.8 hours", "5 hours", "6 hours"],
        correct: 1,
        difficulty: 4
      },
      {
        id: "AR084",
        text: "A crew of 6 can dig a trench in 10 hours. How long would it take 4 workers to dig the same trench?",
        options: ["12 hours", "13 hours", "14 hours", "15 hours"],
        correct: 3,
        difficulty: 3
      },
      {
        id: "AR085",
        text: "Machine A produces 100 parts in 5 hours. Machine B produces 100 parts in 4 hours. How many parts can both machines produce together in 2 hours?",
        options: ["80 parts", "90 parts", "100 parts", "120 parts"],
        correct: 1,
        difficulty: 4
      },
      {
        id: "AR086",
        text: "One pipe fills a pool in 10 hours while a drain empties it in 15 hours. If both are open, how long to fill the pool?",
        options: ["25 hours", "30 hours", "35 hours", "40 hours"],
        correct: 1,
        difficulty: 5
      },
      {
        id: "AR087",
        text: "Two mechanics together complete a repair in 3 hours. One mechanic alone takes 5 hours. How long would the other mechanic take alone?",
        options: ["6 hours", "7 hours", "7.5 hours", "8 hours"],
        correct: 2,
        difficulty: 5
      },
      // Age Problems
      {
        id: "AR088",
        text: "Tom is twice as old as Jerry. In 6 years, Tom will be 1.5 times as old as Jerry. How old is Jerry now?",
        options: ["6", "10", "12", "14"],
        correct: 0,
        difficulty: 4
      },
      {
        id: "AR089",
        text: "A father is 4 times as old as his son. In 20 years, he will be twice as old. How old is the son now?",
        options: ["8", "10", "12", "15"],
        correct: 1,
        difficulty: 4
      },
      {
        id: "AR090",
        text: "Maria is 6 years older than Lisa. The sum of their ages is 34. How old is Maria?",
        options: ["14", "17", "20", "23"],
        correct: 2,
        difficulty: 2
      },
      {
        id: "AR091",
        text: "Three years ago, Kevin was half his current age. How old is Kevin now?",
        options: ["3", "5", "6", "9"],
        correct: 2,
        difficulty: 3
      },
      {
        id: "AR092",
        text: "The sum of a mother's and daughter's ages is 50. The mother is 20 years older than the daughter. How old is the daughter?",
        options: ["12", "15", "18", "20"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "AR093",
        text: "In 5 years, Jake will be 3 times as old as he was 5 years ago. How old is Jake now?",
        options: ["8", "10", "12", "15"],
        correct: 1,
        difficulty: 4
      },
      // Money/Cost Problems
      {
        id: "AR094",
        text: "A book costs $24 and a magazine costs $6. If you buy 3 books and 5 magazines, what is the total cost?",
        options: ["$87", "$96", "$102", "$108"],
        correct: 2,
        difficulty: 1
      },
      {
        id: "AR095",
        text: "Maria bought 4 shirts at $18 each and returned one for a refund. She also bought a $45 jacket. How much did she spend?",
        options: ["$81", "$90", "$99", "$117"],
        correct: 2,
        difficulty: 2
      },
      {
        id: "AR096",
        text: "Tickets cost $12 for adults and $7 for children. A family buys 2 adult and 4 children tickets. What is the total?",
        options: ["$48", "$52", "$56", "$60"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "AR097",
        text: "A phone plan costs $35 per month plus $0.10 per text over 500 texts. If James sent 780 texts, what is his bill?",
        options: ["$58", "$61", "$63", "$78"],
        correct: 2,
        difficulty: 3
      },
      {
        id: "AR098",
        text: "Sarah earns $2,400 monthly. She spends 30% on rent and 15% on food. How much money remains?",
        options: ["$1,080", "$1,200", "$1,320", "$1,440"],
        correct: 2,
        difficulty: 3
      },
      {
        id: "AR099",
        text: "A cable company charges $50 installation plus $75 monthly. What is the total cost for one year of service?",
        options: ["$850", "$900", "$950", "$1,000"],
        correct: 2,
        difficulty: 2
      },
      // Mixture Problems
      {
        id: "AR100",
        text: "A 40-gallon solution is 15% acid. How many gallons of acid does it contain?",
        options: ["4 gallons", "5 gallons", "6 gallons", "8 gallons"],
        correct: 2,
        difficulty: 2
      },
      {
        id: "AR101",
        text: "How many liters of a 20% salt solution must be added to 10 liters of a 50% salt solution to get a 30% solution?",
        options: ["15 liters", "18 liters", "20 liters", "25 liters"],
        correct: 2,
        difficulty: 5
      },
      {
        id: "AR102",
        text: "A chemist mixes 6 liters of 25% acid with 4 liters of 45% acid. What is the concentration of the mixture?",
        options: ["30%", "33%", "35%", "37%"],
        correct: 1,
        difficulty: 4
      },
      {
        id: "AR103",
        text: "A coffee blend uses beans that cost $8/lb and $12/lb in a ratio of 3:2. What is the cost per pound of the blend?",
        options: ["$9.00", "$9.60", "$10.00", "$10.40"],
        correct: 1,
        difficulty: 4
      },
      {
        id: "AR104",
        text: "A grocer mixes 20 lbs of nuts worth $5/lb with 30 lbs worth $8/lb. What is the price per pound of the mixture?",
        options: ["$6.40", "$6.60", "$6.80", "$7.00"],
        correct: 2,
        difficulty: 3
      },
      {
        id: "AR105",
        text: "A bartender mixes 2 quarts of juice costing $3/quart with 3 quarts costing $5/quart. What is the cost per quart of the mixture?",
        options: ["$3.80", "$4.00", "$4.20", "$4.40"],
        correct: 2,
        difficulty: 3
      },
      // Simple Interest
      {
        id: "AR106",
        text: "If $5,000 is invested at 6% simple annual interest, how much interest is earned in 2 years?",
        options: ["$300", "$500", "$600", "$800"],
        correct: 2,
        difficulty: 2
      },
      {
        id: "AR107",
        text: "How much must be invested at 4% simple interest to earn $240 in interest over 3 years?",
        options: ["$1,800", "$2,000", "$2,200", "$2,400"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "AR108",
        text: "A loan of $3,000 at 8% simple annual interest is repaid after 18 months. What is the total amount repaid?",
        options: ["$3,240", "$3,360", "$3,480", "$3,720"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "AR109",
        text: "An account earns $180 interest in one year at 5% simple interest. What was the principal?",
        options: ["$2,400", "$3,000", "$3,600", "$4,000"],
        correct: 2,
        difficulty: 3
      },
      {
        id: "AR110",
        text: "At what simple interest rate will $2,500 earn $375 in 3 years?",
        options: ["4%", "5%", "6%", "7%"],
        correct: 1,
        difficulty: 4
      },
      {
        id: "AR111",
        text: "A CD pays 3% simple interest annually. If you invest $8,000, what is the total value after 4 years?",
        options: ["$8,640", "$8,800", "$8,960", "$9,120"],
        correct: 2,
        difficulty: 3
      },
      // Unit Conversions
      {
        id: "AR112",
        text: "How many inches are in 4.5 feet?",
        options: ["48 inches", "52 inches", "54 inches", "56 inches"],
        correct: 2,
        difficulty: 1
      },
      {
        id: "AR113",
        text: "A container holds 3 gallons. How many cups is this? (1 gallon = 16 cups)",
        options: ["36 cups", "42 cups", "48 cups", "64 cups"],
        correct: 2,
        difficulty: 2
      },
      {
        id: "AR114",
        text: "An athlete runs 5 kilometers. How many meters is this?",
        options: ["50 meters", "500 meters", "5,000 meters", "50,000 meters"],
        correct: 2,
        difficulty: 1
      },
      {
        id: "AR115",
        text: "A package weighs 72 ounces. How many pounds is this?",
        options: ["3.5 lbs", "4 lbs", "4.5 lbs", "5 lbs"],
        correct: 2,
        difficulty: 2
      },
      {
        id: "AR116",
        text: "A hike is 8 miles. How many yards is this? (1 mile = 1,760 yards)",
        options: ["12,080 yards", "13,280 yards", "14,080 yards", "15,680 yards"],
        correct: 2,
        difficulty: 3
      },
      {
        id: "AR117",
        text: "A recipe calls for 2.5 liters of water. How many milliliters is this?",
        options: ["250 mL", "1,250 mL", "2,500 mL", "25,000 mL"],
        correct: 2,
        difficulty: 1
      },
      // Basic Operations Word Problems
      {
        id: "AR118",
        text: "A company shipped 450 packages on Monday and 380 on Tuesday. How many packages were shipped in total?",
        options: ["730", "820", "830", "930"],
        correct: 2,
        difficulty: 1
      },
      {
        id: "AR119",
        text: "A warehouse has 1,250 boxes. If 475 are shipped out, how many remain?",
        options: ["675", "725", "775", "825"],
        correct: 2,
        difficulty: 1
      },
      {
        id: "AR120",
        text: "A theater has 24 rows with 32 seats each. How many total seats are there?",
        options: ["648", "728", "768", "864"],
        correct: 2,
        difficulty: 1
      },
      {
        id: "AR121",
        text: "A charity divides $4,560 equally among 12 organizations. How much does each receive?",
        options: ["$360", "$370", "$380", "$390"],
        correct: 2,
        difficulty: 2
      },
      {
        id: "AR122",
        text: "A bakery makes 840 muffins and packs them in boxes of 6. How many boxes are needed?",
        options: ["120", "130", "140", "150"],
        correct: 2,
        difficulty: 2
      },
      {
        id: "AR123",
        text: "A tank holds 500 gallons. If it is filled at a rate of 25 gallons per minute, how long does it take to fill?",
        options: ["15 minutes", "18 minutes", "20 minutes", "25 minutes"],
        correct: 2,
        difficulty: 2
      }
    ],

    // ========================================
    // WORD KNOWLEDGE (WK) - 65 questions
    // ========================================
    WK: [
      {
        id: "WK001",
        text: "Small most nearly means:",
        options: ["Sturdy", "Round", "Tiny", "Angry"],
        correct: 2,
        difficulty: 1
      },
      {
        id: "WK002",
        text: "The word 'obsolete' most nearly means:",
        options: ["Damaged", "Outdated", "Expensive", "Complicated"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK003",
        text: "Verify most nearly means:",
        options: ["Confirm", "Deny", "Suspect", "Question"],
        correct: 0,
        difficulty: 2
      },
      {
        id: "WK004",
        text: "The word 'hazardous' most nearly means:",
        options: ["Safe", "Dangerous", "Helpful", "Common"],
        correct: 1,
        difficulty: 1
      },
      {
        id: "WK005",
        text: "Illuminate most nearly means:",
        options: ["Darken", "Light up", "Cover", "Reveal"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK006",
        text: "The word 'persevere' most nearly means:",
        options: ["Give up", "Continue", "Rest", "Complain"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK007",
        text: "Conceal most nearly means:",
        options: ["Show", "Find", "Hide", "Destroy"],
        correct: 2,
        difficulty: 1
      },
      {
        id: "WK008",
        text: "The word 'mandatory' most nearly means:",
        options: ["Optional", "Required", "Suggested", "Preferred"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK009",
        text: "Deficient most nearly means:",
        options: ["Adequate", "Excessive", "Lacking", "Perfect"],
        correct: 2,
        difficulty: 3
      },
      {
        id: "WK010",
        text: "The word 'proficient' most nearly means:",
        options: ["Skilled", "Beginner", "Careless", "Uncertain"],
        correct: 0,
        difficulty: 2
      },
      {
        id: "WK011",
        text: "Altercation most nearly means:",
        options: ["Agreement", "Dispute", "Change", "Solution"],
        correct: 1,
        difficulty: 4
      },
      {
        id: "WK012",
        text: "The word 'meticulous' most nearly means:",
        options: ["Careless", "Careful", "Quick", "Lazy"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK013",
        text: "Fortify most nearly means:",
        options: ["Weaken", "Strengthen", "Abandon", "Ignore"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK014",
        text: "The word 'terminate' most nearly means:",
        options: ["Begin", "Continue", "End", "Pause"],
        correct: 2,
        difficulty: 1
      },
      {
        id: "WK015",
        text: "Negligent most nearly means:",
        options: ["Careful", "Attentive", "Careless", "Responsible"],
        correct: 2,
        difficulty: 3
      },
      {
        id: "WK016",
        text: "The word 'scrutinize' most nearly means:",
        options: ["Examine closely", "Ignore", "Accept", "Reject"],
        correct: 0,
        difficulty: 4
      },
      {
        id: "WK017",
        text: "Collaborate most nearly means:",
        options: ["Compete", "Work together", "Separate", "Disagree"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK018",
        text: "The word 'expedite' most nearly means:",
        options: ["Delay", "Speed up", "Cancel", "Complicate"],
        correct: 1,
        difficulty: 4
      },
      {
        id: "WK019",
        text: "Formidable most nearly means:",
        options: ["Weak", "Impressive", "Simple", "Small"],
        correct: 1,
        difficulty: 4
      },
      {
        id: "WK020",
        text: "The word 'relinquish' most nearly means:",
        options: ["Keep", "Take", "Give up", "Find"],
        correct: 2,
        difficulty: 4
      },
      {
        id: "WK021",
        text: "Diligent most nearly means:",
        options: ["Lazy", "Hardworking", "Careless", "Slow"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK022",
        text: "The word 'subordinate' most nearly means:",
        options: ["Superior", "Equal", "Lower in rank", "Leader"],
        correct: 2,
        difficulty: 3
      },
      {
        id: "WK023",
        text: "Feasible most nearly means:",
        options: ["Impossible", "Possible", "Difficult", "Easy"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK024",
        text: "The word 'reprimand' most nearly means:",
        options: ["Praise", "Scold", "Reward", "Ignore"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK025",
        text: "Comprehensive most nearly means:",
        options: ["Limited", "Partial", "Complete", "Simple"],
        correct: 2,
        difficulty: 3
      },
      {
        id: "WK026",
        text: "The word 'diminish' most nearly means:",
        options: ["Increase", "Decrease", "Maintain", "Double"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK027",
        text: "Imminent most nearly means:",
        options: ["Distant", "Unlikely", "About to happen", "Past"],
        correct: 2,
        difficulty: 4
      },
      {
        id: "WK028",
        text: "The word 'resilient' most nearly means:",
        options: ["Fragile", "Bounces back", "Weak", "Static"],
        correct: 1,
        difficulty: 4
      },
      {
        id: "WK029",
        text: "Apprehend most nearly means:",
        options: ["Release", "Capture", "Ignore", "Forget"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK030",
        text: "The word 'deteriorate' most nearly means:",
        options: ["Improve", "Worsen", "Stay same", "Enhance"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK031",
        text: "Commend most nearly means:",
        options: ["Criticize", "Praise", "Ignore", "Punish"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK032",
        text: "The word 'substantial' most nearly means:",
        options: ["Small", "Considerable", "Worthless", "Invisible"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK033",
        text: "Alleviate most nearly means:",
        options: ["Worsen", "Relieve", "Cause", "Ignore"],
        correct: 1,
        difficulty: 4
      },
      {
        id: "WK034",
        text: "The word 'adhere' most nearly means:",
        options: ["Separate", "Stick to", "Reject", "Avoid"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK035",
        text: "Exemplary most nearly means:",
        options: ["Poor", "Outstanding", "Average", "Ordinary"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK036",
        text: "Antagonize most nearly means:",
        options: ["Embarrass", "Struggle", "Provoke", "Worship"],
        correct: 2,
        difficulty: 3
      },
      {
        id: "WK037",
        text: "Wilted most nearly means:",
        options: ["Left", "Limp", "Budding", "Requested"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK038",
        text: "His record provides no reason for apprehension. Apprehension most nearly means:",
        options: ["Anxiety", "Change", "Enjoyment", "Endorsement"],
        correct: 0,
        difficulty: 3
      },
      {
        id: "WK039",
        text: "Quiver most nearly means:",
        options: ["Shake", "Dance", "Rest", "Run"],
        correct: 0,
        difficulty: 2
      },
      {
        id: "WK040",
        text: "The teenager abandoned his job because he found it to be onerous. Onerous most nearly means:",
        options: ["Frightening", "Pointless", "Burdensome", "Boring"],
        correct: 2,
        difficulty: 4
      },
      {
        id: "WK041",
        text: "Disparate most nearly means:",
        options: ["Different", "Dull", "Untrustworthy", "Unspeakable"],
        correct: 0,
        difficulty: 4
      },
      {
        id: "WK042",
        text: "She did not condone his insubordination. Condone most nearly means:",
        options: ["Condemn", "Appreciate", "Excuse", "Report"],
        correct: 2,
        difficulty: 3
      },
      {
        id: "WK043",
        text: "The new senator was a man of candor. Candor most nearly means:",
        options: ["Duplicity", "Corruption", "Honesty", "Attractiveness"],
        correct: 2,
        difficulty: 3
      },
      {
        id: "WK044",
        text: "Contrived most nearly means:",
        options: ["Artificial", "Real", "Confusing", "Alarming"],
        correct: 0,
        difficulty: 3
      },
      {
        id: "WK045",
        text: "I paid a nominal amount of money to join the club. Nominal most nearly means:",
        options: ["Huge", "Unreasonable", "Arbitrary", "Small"],
        correct: 3,
        difficulty: 3
      },
      {
        id: "WK046",
        text: "Clandestine most nearly means:",
        options: ["Iconic", "Faction", "Riveting", "Covert"],
        correct: 3,
        difficulty: 4
      },
      {
        id: "WK047",
        text: "The fetid liquid soaked through my shoes. Fetid most nearly means:",
        options: ["Putrid", "Oily", "Mysterious", "Flammable"],
        correct: 0,
        difficulty: 4
      },
      {
        id: "WK048",
        text: "Instigate most nearly means:",
        options: ["Restrict", "Initiate", "Force", "Investigate"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK049",
        text: "Our relationship was ephemeral. Ephemeral most nearly means:",
        options: ["Superficial", "Respectful", "Deep", "Fleeting"],
        correct: 3,
        difficulty: 4
      },
      {
        id: "WK050",
        text: "Abrogate most nearly means:",
        options: ["Advocate", "Rebel", "Repeal", "Answer"],
        correct: 2,
        difficulty: 5
      },
      {
        id: "WK051",
        text: "The decision was not based on any empirical evidence. Empirical most nearly means:",
        options: ["Observational", "Theoretical", "Irrefutable", "Questionable"],
        correct: 0,
        difficulty: 4
      },
      {
        id: "WK052",
        text: "Deference most nearly means:",
        options: ["Divergence", "Tranquility", "Respect", "Inaccuracy"],
        correct: 2,
        difficulty: 3
      },
      {
        id: "WK053",
        text: "Legitimate most nearly means:",
        options: ["Secret", "Lawful", "Selfish", "Phony"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK054",
        text: "My speech got little applause from the apathetic audience. Apathetic most nearly means:",
        options: ["Indifferent", "Strange", "Hateful", "Empathetic"],
        correct: 0,
        difficulty: 3
      },
      {
        id: "WK055",
        text: "There is camaraderie within the small groups at our church. Camaraderie most nearly means:",
        options: ["Competition", "Levity", "Apprehension", "Companionship"],
        correct: 3,
        difficulty: 3
      },
      {
        id: "WK056",
        text: "Amiable most nearly means:",
        options: ["Hostile", "Friendly", "Cautious", "Uncertain"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK057",
        text: "Inevitable most nearly means:",
        options: ["Avoidable", "Certain", "Unlikely", "Possible"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK058",
        text: "Hostile most nearly means:",
        options: ["Welcoming", "Neutral", "Unfriendly", "Helpful"],
        correct: 2,
        difficulty: 1
      },
      {
        id: "WK059",
        text: "Procrastinate most nearly means:",
        options: ["Finish", "Delay", "Hurry", "Organize"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK060",
        text: "Versatile most nearly means:",
        options: ["Rigid", "Limited", "Adaptable", "Specialized"],
        correct: 2,
        difficulty: 3
      },
      {
        id: "WK061",
        text: "Elated most nearly means:",
        options: ["Depressed", "Jubilant", "Calm", "Nervous"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK062",
        text: "Immaculate most nearly means:",
        options: ["Dirty", "Spotless", "Ordinary", "Damaged"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK063",
        text: "Infiltrate most nearly means:",
        options: ["Exit", "Guard", "Expose", "Penetrate"],
        correct: 3,
        difficulty: 3
      },
      {
        id: "WK064",
        text: "Intrepid most nearly means:",
        options: ["Fearless", "Cautious", "Nervous", "Weak"],
        correct: 0,
        difficulty: 3
      },
      {
        id: "WK065",
        text: "Tenacious most nearly means:",
        options: ["Weak", "Flexible", "Persistent", "Careless"],
        correct: 2,
        difficulty: 3
      },
      {
        id: "WK066",
        text: "Arduous most nearly means:",
        options: ["Easy", "Difficult", "Quick", "Pleasant"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK067",
        text: "Benevolent most nearly means:",
        options: ["Cruel", "Kind", "Selfish", "Angry"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK068",
        text: "Candid most nearly means:",
        options: ["Secretive", "Honest", "Shy", "Confused"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK069",
        text: "Deter most nearly means:",
        options: ["Encourage", "Discourage", "Help", "Attract"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK070",
        text: "Elusive most nearly means:",
        options: ["Obvious", "Hard to catch", "Friendly", "Loud"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK071",
        text: "Frugal most nearly means:",
        options: ["Wasteful", "Thrifty", "Generous", "Careless"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK072",
        text: "Gregarious most nearly means:",
        options: ["Shy", "Sociable", "Angry", "Quiet"],
        correct: 1,
        difficulty: 4
      },
      {
        id: "WK073",
        text: "Hinder most nearly means:",
        options: ["Help", "Obstruct", "Encourage", "Support"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK075",
        text: "Jovial most nearly means:",
        options: ["Sad", "Cheerful", "Serious", "Quiet"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK076",
        text: "Keen most nearly means:",
        options: ["Dull", "Sharp", "Slow", "Weak"],
        correct: 1,
        difficulty: 1
      },
      {
        id: "WK077",
        text: "Lethargic most nearly means:",
        options: ["Energetic", "Sluggish", "Alert", "Active"],
        correct: 1,
        difficulty: 4
      },
      {
        id: "WK078",
        text: "Mundane most nearly means:",
        options: ["Exciting", "Ordinary", "Unusual", "Thrilling"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK079",
        text: "Nimble most nearly means:",
        options: ["Clumsy", "Agile", "Slow", "Heavy"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK080",
        text: "Ominous most nearly means:",
        options: ["Cheerful", "Threatening", "Harmless", "Bright"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK081",
        text: "Prudent most nearly means:",
        options: ["Reckless", "Wise", "Careless", "Foolish"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK082",
        text: "Quell most nearly means:",
        options: ["Increase", "Suppress", "Encourage", "Start"],
        correct: 1,
        difficulty: 4
      },
      {
        id: "WK084",
        text: "Serene most nearly means:",
        options: ["Chaotic", "Peaceful", "Loud", "Angry"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK085",
        text: "Tacit most nearly means:",
        options: ["Spoken", "Unspoken", "Loud", "Written"],
        correct: 1,
        difficulty: 4
      },
      {
        id: "WK086",
        text: "Ubiquitous most nearly means:",
        options: ["Rare", "Everywhere", "Hidden", "Unique"],
        correct: 1,
        difficulty: 5
      },
      {
        id: "WK087",
        text: "Vindicate most nearly means:",
        options: ["Blame", "Clear of blame", "Punish", "Accuse"],
        correct: 1,
        difficulty: 4
      },
      {
        id: "WK088",
        text: "Wary most nearly means:",
        options: ["Trusting", "Cautious", "Bold", "Reckless"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK089",
        text: "Zeal most nearly means:",
        options: ["Apathy", "Enthusiasm", "Boredom", "Laziness"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK090",
        text: "Abate most nearly means:",
        options: ["Increase", "Decrease", "Remain", "Worsen"],
        correct: 1,
        difficulty: 4
      },
      {
        id: "WK091",
        text: "Concise most nearly means:",
        options: ["Lengthy", "Brief", "Confusing", "Detailed"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK092",
        text: "Denounce most nearly means:",
        options: ["Praise", "Condemn", "Support", "Accept"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK093",
        text: "Eloquent most nearly means:",
        options: ["Inarticulate", "Well-spoken", "Silent", "Confused"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK095",
        text: "Gaunt most nearly means:",
        options: ["Plump", "Thin", "Healthy", "Strong"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK097",
        text: "Impede most nearly means:",
        options: ["Assist", "Block", "Speed up", "Allow"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK098",
        text: "Jeopardy most nearly means:",
        options: ["Safety", "Danger", "Security", "Protection"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK099",
        text: "Kindle most nearly means:",
        options: ["Extinguish", "Ignite", "Cool", "Dampen"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK100",
        text: "Lucid most nearly means:",
        options: ["Confusing", "Clear", "Vague", "Murky"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK101",
        text: "Meager most nearly means:",
        options: ["Abundant", "Scarce", "Generous", "Plentiful"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK102",
        text: "Novice most nearly means:",
        options: ["Expert", "Beginner", "Master", "Professional"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK104",
        text: "Plausible most nearly means:",
        options: ["Unbelievable", "Believable", "False", "Ridiculous"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK105",
        text: "Quarantine most nearly means:",
        options: ["Release", "Isolate", "Free", "Connect"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK106",
        text: "Rectify most nearly means:",
        options: ["Worsen", "Correct", "Ignore", "Break"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK107",
        text: "Sparse most nearly means:",
        options: ["Dense", "Scattered", "Thick", "Crowded"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK108",
        text: "Terse most nearly means:",
        options: ["Lengthy", "Brief", "Wordy", "Elaborate"],
        correct: 1,
        difficulty: 4
      },
      {
        id: "WK109",
        text: "Uniform most nearly means:",
        options: ["Varied", "Consistent", "Different", "Random"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK111",
        text: "Wane most nearly means:",
        options: ["Grow", "Decrease", "Increase", "Expand"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK112",
        text: "Yield most nearly means:",
        options: ["Resist", "Surrender", "Fight", "Oppose"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK113",
        text: "Zealous most nearly means:",
        options: ["Indifferent", "Passionate", "Calm", "Apathetic"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK114",
        text: "Abolish most nearly means:",
        options: ["Create", "Eliminate", "Begin", "Start"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK115",
        text: "Blatant most nearly means:",
        options: ["Subtle", "Obvious", "Hidden", "Secret"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK116",
        text: "Comply most nearly means:",
        options: ["Refuse", "Obey", "Reject", "Resist"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK118",
        text: "Enhance most nearly means:",
        options: ["Worsen", "Improve", "Damage", "Reduce"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK119",
        text: "Futile most nearly means:",
        options: ["Useful", "Useless", "Helpful", "Effective"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK120",
        text: "Grueling most nearly means:",
        options: ["Easy", "Exhausting", "Simple", "Light"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK121",
        text: "Hasty most nearly means:",
        options: ["Slow", "Quick", "Careful", "Deliberate"],
        correct: 1,
        difficulty: 1
      },
      {
        id: "WK122",
        text: "Impartial most nearly means:",
        options: ["Biased", "Fair", "Prejudiced", "One-sided"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK123",
        text: "Jubilant most nearly means:",
        options: ["Sad", "Joyful", "Angry", "Depressed"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK124",
        text: "Knack most nearly means:",
        options: ["Inability", "Talent", "Weakness", "Failure"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK125",
        text: "Liable most nearly means:",
        options: ["Exempt", "Responsible", "Free", "Innocent"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK126",
        text: "Moderate most nearly means:",
        options: ["Extreme", "Average", "Excessive", "Intense"],
        correct: 1,
        difficulty: 1
      },
      {
        id: "WK127",
        text: "Negate most nearly means:",
        options: ["Confirm", "Cancel out", "Agree", "Support"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK128",
        text: "Obscure most nearly means:",
        options: ["Clear", "Unclear", "Obvious", "Visible"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK129",
        text: "Ponder most nearly means:",
        options: ["Ignore", "Think about", "Forget", "Dismiss"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK130",
        text: "Reluctant most nearly means:",
        options: ["Eager", "Unwilling", "Ready", "Enthusiastic"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK131",
        text: "Supplement most nearly means:",
        options: ["Replace", "Add to", "Remove", "Subtract"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK132",
        text: "Trivial most nearly means:",
        options: ["Important", "Unimportant", "Serious", "Significant"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK133",
        text: "Utter most nearly means:",
        options: ["Partial", "Complete", "Slight", "Minimal"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK134",
        text: "Vague most nearly means:",
        options: ["Clear", "Unclear", "Specific", "Precise"],
        correct: 1,
        difficulty: 1
      },
      {
        id: "WK135",
        text: "Wholesome most nearly means:",
        options: ["Harmful", "Healthy", "Dangerous", "Toxic"],
        correct: 1,
        difficulty: 1
      },
      {
        id: "WK136",
        text: "Adjacent most nearly means:",
        options: ["Far", "Next to", "Distant", "Remote"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK137",
        text: "Brevity most nearly means:",
        options: ["Length", "Shortness", "Duration", "Extension"],
        correct: 1,
        difficulty: 4
      },
      {
        id: "WK138",
        text: "Coerce most nearly means:",
        options: ["Ask nicely", "Force", "Suggest", "Request"],
        correct: 1,
        difficulty: 4
      },
      {
        id: "WK139",
        text: "Deviate most nearly means:",
        options: ["Follow", "Stray from", "Conform", "Obey"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK140",
        text: "Erratic most nearly means:",
        options: ["Steady", "Unpredictable", "Consistent", "Regular"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK141",
        text: "Fluctuate most nearly means:",
        options: ["Stay constant", "Vary", "Remain stable", "Fix"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK142",
        text: "Grave most nearly means:",
        options: ["Trivial", "Serious", "Minor", "Light"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK143",
        text: "Hypothesis most nearly means:",
        options: ["Fact", "Theory", "Proof", "Certainty"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK144",
        text: "Integrate most nearly means:",
        options: ["Separate", "Combine", "Divide", "Split"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK145",
        text: "Justify most nearly means:",
        options: ["Accuse", "Defend", "Blame", "Criticize"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK146",
        text: "Laborious most nearly means:",
        options: ["Easy", "Difficult", "Quick", "Simple"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK147",
        text: "Malicious most nearly means:",
        options: ["Kind", "Harmful", "Gentle", "Friendly"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK148",
        text: "Notable most nearly means:",
        options: ["Ordinary", "Remarkable", "Common", "Average"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK149",
        text: "Optimum most nearly means:",
        options: ["Worst", "Best", "Average", "Poor"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK150",
        text: "Precede most nearly means:",
        options: ["Follow", "Come before", "Come after", "Trail"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK151",
        text: "Perpetual most nearly means:",
        options: ["Temporary", "Constant", "Brief", "Short"],
        correct: 1,
        difficulty: 4
      },
      {
        id: "WK152",
        text: "Rebuke most nearly means:",
        options: ["Praise", "Criticize", "Compliment", "Honor"],
        correct: 1,
        difficulty: 4
      },
      {
        id: "WK153",
        text: "Sustain most nearly means:",
        options: ["End", "Maintain", "Stop", "Finish"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "WK154",
        text: "Tangible most nearly means:",
        options: ["Abstract", "Touchable", "Invisible", "Imaginary"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "WK155",
        text: "Unanimous most nearly means:",
        options: ["Divided", "In complete agreement", "Split", "Partial"],
        correct: 1,
        difficulty: 3
      }
    ],

    // ========================================
    // PARAGRAPH COMPREHENSION (PC) - 85 questions
    // Topics: Science, History, Technology, Social Studies, Health/Medicine, Military/Civic, Nature/Environment
    // Question Types: Main Idea, Detail, Inference, Vocabulary in Context
    // ========================================
    PC: [
      {
        id: "PC001",
        text: "Read the passage: 'The Army Physical Fitness Test (APFT) measures a soldier's physical conditioning. The test consists of push-ups, sit-ups, and a two-mile run. Each event is scored on a scale, and soldiers must meet minimum standards based on their age and gender.'\n\nWhat is the main purpose of the APFT?",
        options: ["To punish soldiers", "To measure physical conditioning", "To determine rank", "To qualify for special forces"],
        correct: 1, difficulty: 2
      },
      {
        id: "PC002",
        text: "Read the passage: 'Military time uses a 24-hour clock system. Unlike civilian time, which uses AM and PM, military time numbers hours from 00 to 23. For example, 1:00 PM in civilian time is 1300 hours in military time.'\n\nAccording to the passage, what would 3:00 PM be in military time?",
        options: ["0300 hours", "1500 hours", "1800 hours", "2100 hours"],
        correct: 1, difficulty: 2
      },
      {
        id: "PC003",
        text: "Read the passage: 'Camouflage patterns help military personnel blend into their environment. Desert camouflage uses tan and brown colors, while woodland patterns feature green, brown, and black. The right pattern depends on the terrain where operations occur.'\n\nWhat determines which camouflage pattern should be used?",
        options: ["Personal preference", "The terrain", "Military rank", "Time of year"],
        correct: 1, difficulty: 2
      },
      {
        id: "PC004",
        text: "Read the passage: 'Boot camp, or basic training, transforms civilians into soldiers. Recruits learn military customs, physical fitness, and basic combat skills. The training is intentionally challenging to prepare recruits for the demands of military service.'\n\nWhy is basic training described as challenging?",
        options: ["To discourage enlistment", "To prepare recruits for military demands", "To reduce the number of soldiers", "To save money on training"],
        correct: 1, difficulty: 2
      },
      {
        id: "PC005",
        text: "Read the passage: 'The chain of command is the line of authority in a military organization. Orders flow downward from higher ranks to lower ranks, while reports and information flow upward. This structure ensures clear communication and accountability.'\n\nIn which direction do orders flow in the chain of command?",
        options: ["Upward", "Downward", "Sideways", "In all directions equally"],
        correct: 1, difficulty: 2
      },
      {
        id: "PC006",
        text: "Read the passage: 'Night vision devices amplify available light to allow users to see in darkness. These devices collect tiny amounts of light from stars, the moon, or ambient sources and intensify it electronically. Modern military operations often occur at night, making this technology essential.'\n\nHow do night vision devices work?",
        options: ["They generate their own light", "They amplify available light", "They use radar", "They detect heat"],
        correct: 1, difficulty: 3
      },
      {
        id: "PC007",
        text: "Read the passage: 'The Geneva Conventions establish rules for the treatment of wounded soldiers and prisoners of war. These international agreements protect individuals who are not participating in combat. All major military forces are expected to follow these conventions.'\n\nWho do the Geneva Conventions protect?",
        options: ["Only officers", "Active combatants", "Non-participants in combat", "Only civilians"],
        correct: 2, difficulty: 3
      },
      {
        id: "PC008",
        text: "Read the passage: 'Military ranks indicate a service member's level of responsibility and authority. Enlisted ranks range from Private to Sergeant Major, while officer ranks range from Second Lieutenant to General. Higher ranks typically require more experience and education.'\n\nWhat do military ranks indicate?",
        options: ["Age only", "Height and weight", "Responsibility and authority", "Years of service only"],
        correct: 2, difficulty: 2
      },
      {
        id: "PC009",
        text: "Read the passage: 'Reconnaissance missions gather information about enemy forces and terrain. Soldiers on these missions observe and report rather than engage in combat. The intelligence collected helps commanders make informed decisions about operations.'\n\nWhat is the primary purpose of reconnaissance?",
        options: ["To engage the enemy", "To gather information", "To deliver supplies", "To train new soldiers"],
        correct: 1, difficulty: 2
      },
      {
        id: "PC010",
        text: "Read the passage: 'Military vehicles are designed for specific purposes. Tanks provide heavy firepower and protection, while Humvees offer mobility and versatility. Helicopters enable rapid deployment and medical evacuation. Each vehicle type plays a unique role in military operations.'\n\nAccording to the passage, what advantage do helicopters provide?",
        options: ["Heavy firepower", "Protection", "Rapid deployment", "Cost savings"],
        correct: 2, difficulty: 3
      },
      {
        id: "PC011",
        text: "Read the passage: 'The buddy system pairs soldiers together for safety and support. Each soldier is responsible for watching out for their partner. This system ensures that no one faces dangerous situations alone and that help is always nearby.'\n\nWhat is the purpose of the buddy system?",
        options: ["To reduce costs", "To ensure safety and support", "To create competition", "To speed up training"],
        correct: 1, difficulty: 1
      },
      {
        id: "PC012",
        text: "Read the passage: 'Field rations, known as MREs (Meals Ready to Eat), provide nutrition in combat situations. Each MRE contains approximately 1,200 calories and includes an entrée, side dish, dessert, and accessories. MREs can be eaten cold or heated with a flameless heater.'\n\nHow many calories does an MRE contain?",
        options: ["About 800", "About 1,200", "About 2,000", "About 500"],
        correct: 1, difficulty: 2
      },
      {
        id: "PC013",
        text: "Read the passage: 'Communication security, or COMSEC, protects military communications from enemy interception. Encryption codes messages so that only authorized personnel can read them. Changing codes frequently prevents enemies from breaking the encryption.'\n\nWhy are encryption codes changed frequently?",
        options: ["To confuse friendly forces", "To save money", "To prevent enemies from breaking encryption", "To test new systems"],
        correct: 2, difficulty: 3
      },
      {
        id: "PC014",
        text: "Read the passage: 'A military deployment may last from a few months to over a year. During deployment, service members are stationed away from their home base, often in foreign countries. Families must adapt to the absence of their loved one during this time.'\n\nWhat challenge do families face during deployment?",
        options: ["Increased income", "Adapting to absence", "More free time", "Fewer responsibilities"],
        correct: 1, difficulty: 2
      },
      {
        id: "PC015",
        text: "Read the passage: 'First aid training teaches soldiers to treat injuries in the field. Stopping severe bleeding and treating shock are critical skills. Quick action in the minutes after an injury can save lives before medical professionals arrive.'\n\nAccording to the passage, why is quick action important?",
        options: ["To avoid paperwork", "To save lives before help arrives", "To impress commanders", "To earn medals"],
        correct: 1, difficulty: 2
      },
      {
        id: "PC016",
        text: "Read the passage: 'The military uses the phonetic alphabet to ensure clear communication. Each letter has a corresponding word, such as Alpha for A, Bravo for B, and Charlie for C. This system prevents confusion between similar-sounding letters like B and D.'\n\nWhat is the purpose of the phonetic alphabet?",
        options: ["To create secret codes", "To prevent confusion between letters", "To communicate faster", "To test intelligence"],
        correct: 1, difficulty: 2
      },
      {
        id: "PC017",
        text: "Read the passage: 'Physical training, or PT, is a daily requirement in the military. Regular exercise maintains combat readiness and reduces injuries. Most units conduct PT in the early morning before other duties begin.'\n\nWhen do most units conduct PT?",
        options: ["In the evening", "During lunch", "In the early morning", "On weekends only"],
        correct: 2, difficulty: 1
      },
      {
        id: "PC018",
        text: "Read the passage: 'The GI Bill provides educational benefits to veterans. This program helps service members pay for college, vocational training, or other education after leaving the military. Many veterans credit the GI Bill with helping them transition to civilian careers.'\n\nWhat benefit does the GI Bill provide?",
        options: ["Housing assistance", "Educational benefits", "Health care", "Retirement pay"],
        correct: 1, difficulty: 2
      },
      {
        id: "PC019",
        text: "Read the passage: 'Military bases operate like small cities. They contain housing, stores, medical facilities, and recreation centers. Many families live on base, creating a close-knit community of military personnel and their dependents.'\n\nHow are military bases described in the passage?",
        options: ["Like small cities", "Like vacation resorts", "Like factories", "Like schools"],
        correct: 0, difficulty: 1
      },
      {
        id: "PC020",
        text: "Read the passage: 'Situational awareness means understanding your environment and potential threats. Soldiers must constantly observe their surroundings and anticipate danger. This awareness can mean the difference between life and death in combat situations.'\n\nWhat does situational awareness help soldiers do?",
        options: ["Relax more", "Anticipate danger", "Follow orders better", "Save money"],
        correct: 1, difficulty: 3
      },
      {
        id: "PC021",
        text: "Read the passage: 'Military dogs serve alongside human soldiers in various roles. They detect explosives, track enemy combatants, and provide security. These highly trained animals form strong bonds with their handlers and are considered valuable members of military units.'\n\nWhat roles do military dogs perform?",
        options: ["Entertainment only", "Detecting explosives and tracking", "Carrying supplies", "Medical assistance"],
        correct: 1, difficulty: 2
      },
      {
        id: "PC022",
        text: "Read the passage: 'Drill and ceremony instill discipline and teamwork in military units. Marching in formation requires each soldier to move in coordination with others. These exercises may seem repetitive, but they build the habits of following orders precisely.'\n\nWhat is the purpose of drill and ceremony?",
        options: ["Entertainment", "Physical fitness", "Instilling discipline and teamwork", "Punishment"],
        correct: 2, difficulty: 3
      },
      {
        id: "PC023",
        text: "Read the passage: 'The Code of Conduct guides American soldiers if captured by the enemy. It requires service members to resist enemy exploitation and maintain loyalty to fellow prisoners. The code has six articles that establish expectations for prisoners of war.'\n\nHow many articles does the Code of Conduct have?",
        options: ["Three", "Six", "Ten", "Twelve"],
        correct: 1, difficulty: 2
      },
      {
        id: "PC024",
        text: "Read the passage: 'Military logistics involves moving supplies, equipment, and personnel to where they are needed. Without effective logistics, combat units cannot function. Ammunition, food, fuel, and medical supplies must reach troops at the right time and place.'\n\nWhat happens without effective logistics?",
        options: ["Units receive extra supplies", "Combat units cannot function", "Training improves", "Costs decrease"],
        correct: 1, difficulty: 3
      },
      {
        id: "PC025",
        text: "Read the passage: 'Veterans Day honors all who have served in the military, while Memorial Day specifically remembers those who died in service. Both holidays recognize the sacrifices made by military personnel. Veterans Day is observed on November 11th each year.'\n\nWhat is the difference between Veterans Day and Memorial Day?",
        options: ["They are the same", "Veterans Day honors all who served; Memorial Day honors those who died", "Memorial Day is for officers only", "Veterans Day is for Navy only"],
        correct: 1, difficulty: 3
      },
      // NEW: Science, History, and General Interest Passages
      {
        id: "PC026",
        text: "Read the passage: 'The eastern part of Texas will ambush the senses of all who enter it with preconceptions of sand and cacti around every bend. It has a look and atmosphere that does not fit the boots-and-saddle image of the state.'\n\nThe author implies that the look and atmosphere of east Texas does NOT resemble that of the:",
        options: ["marshlands", "mountains", "seashore", "desert"],
        correct: 3, difficulty: 3
      },
      {
        id: "PC027",
        text: "Read the passage: 'A thin transparent layer of oxide protects the metal titanium against corrosion. The same thin layer attracts artists interested in making their art with the help of technology. By using heat or electricity, an artist can thicken the oxide layer and thereby turn the metal a range of vivid colors.'\n\nAccording to the passage, some artists work with titanium because it:",
        options: ["is transparent", "does not corrode", "generates its own heat", "can assume a variety of colors"],
        correct: 3, difficulty: 3
      },
      {
        id: "PC028",
        text: "Read the passage: 'They returned to the beach, where blankets spotted the slope to the water. An advancing wall of clouds, black and gray, darkening the expanse of ground beneath, approached from the west. To the east and above them, the sky remained clear, the sun warm, as if collaborating in the deception.'\n\nThe 'deception' referred to in the passage is that:",
        options: ["there is no storm approaching", "the sky is clear in the east", "it is too cold to swim", "the sun is warm"],
        correct: 0, difficulty: 4
      },
      {
        id: "PC029",
        text: "Read the passage: 'The orientation of a large expanse of glass in a house is important. Improperly positioned, it can cost precious fuel dollars, whereas good orientation can minimize heat lost in the winter and gained in the summer. The best direction to face is south, to make good use of solar energy.'\n\nAccording to the passage, large expanses of glass should be positioned to:",
        options: ["take advantage of summer sunlight", "control heat gain and loss", "shield the house from the low winter sun", "avoid blockage of sunlight by an overhanging roof"],
        correct: 1, difficulty: 3
      },
      {
        id: "PC030",
        text: "Read the passage: 'Nations are political and military units, but they are not necessarily the most important units in economic life, nor are they very much alike in any economic sense. All that nations really have in common is the political aspect of their sovereignty. Indeed, the failure of national governments to control economic forces suggests that nations are irrelevant to promoting economic success.'\n\nAccording to the paragraph, the economic power of nations is:",
        options: ["controlled by political and military success", "the basis of their political success", "limited to a few powerful nations", "relatively unimportant"],
        correct: 3, difficulty: 4
      },
      {
        id: "PC031",
        text: "Read the passage: 'A lamb's thick winter coat keeps it warm during the cold winter months. In spring, farmers shear the sheep, removing the wool in a single piece called a fleece. This fleece is then cleaned, combed, and spun into yarn that is used to make clothing and blankets.'\n\nWhy are sheep sheared?",
        options: ["Because they get too hot in summer", "So we can use the wool to make clothes", "The sheep's coat is dangerous to them", "They look better without their coat"],
        correct: 1, difficulty: 2
      },
      {
        id: "PC032",
        text: "Read the passage: 'DNA stands for deoxyribonucleic acid. It has proteins attached to it and exists in the form of chromosomes. DNA in chromosomes contains the information that determines all of the physical characteristics that were inherited from the previous generation, from a strawberry's shape to the color of your eyes.'\n\nThis author implies that:",
        options: ["Species are subdivisions of a genus", "Strawberries are organisms", "DNA is only found in organisms' parents", "All species have similar physical characteristics"],
        correct: 1, difficulty: 3
      },
      {
        id: "PC033",
        text: "Read the passage: 'The Mississippi River is key to New Orleans' flavor and pizzazz. Its muddy water once carried jazz musicians upriver to Memphis and St. Louis, and the city's famous cuisine owes much to the fresh seafood that travels its currents from the Gulf of Mexico.'\n\nSome people believe New Orleans' atmosphere comes primarily from:",
        options: ["Jazz music", "Its unique food", "The Mississippi River", "The history of its swamp"],
        correct: 2, difficulty: 2
      },
      {
        id: "PC034",
        text: "Read the passage: 'American Sign Language (ASL) is a conceptual language, and the way ideas are expressed differs from English. In ASL, the most important concept comes first, followed by supporting details. This is unlike English, which often places the subject at the beginning regardless of importance.'\n\nThis author implies that:",
        options: ["English can never be conceptual", "Every language should have the same syntax", "American Sign Language has incorrect syntax", "English doesn't always begin with what is most important"],
        correct: 3, difficulty: 3
      },
      {
        id: "PC035",
        text: "Read the passage: 'While some playwrights are known for writing essays defending their own work or criticizing the efforts of rivals, Arthur Miller wrote thoughtful analyses of the theater as an art form. His essays examine the nature of tragedy, the role of the common man in drama, and the relationship between theater and society.'\n\nMiller's essays differ from other playwrights' in that:",
        options: ["Miller's essays are more recent", "Miller's essays are not self-serving", "Miller's essays have had more influence", "Miller wrote about European theater"],
        correct: 1, difficulty: 4
      },
      {
        id: "PC036",
        text: "Read the passage: 'Although much about dolphin communication remains a mystery, researchers have made significant discoveries. Dolphins use clicks for echolocation, similar to sonar, which helps them navigate and find food. However, scientists recently discovered that dolphins also produce distinct whistles that may serve as individual identifiers.'\n\nWhistles are significant because they:",
        options: ["Show dolphins express emotion", "Prompt questions about communication complexity", "Aid navigation and hunting", "Aren't used for dolphin communication"],
        correct: 1, difficulty: 4
      },
      {
        id: "PC037",
        text: "Read the passage: 'Although much about dolphin communication remains a mystery, researchers have made significant discoveries. Dolphins use clicks for echolocation, similar to sonar, which helps them navigate and find food. These sonic cues are similar to the ones used by other animal species like bats.'\n\nThe most reasonable inference is that:",
        options: ["Dolphins aren't the only vocal communicating species", "Dolphins never use clicks for communication", "Dolphins are more intelligent than other species", "Dolphins frequently communicate locations"],
        correct: 0, difficulty: 3
      },
      {
        id: "PC038",
        text: "Read the passage: 'An industry trade association found that more than 13,000 martial arts schools exist in the United States with nearly 6 million active members. Of the 13,000 schools, nearly 7,000 offered tae kwon do lessons.'\n\nAccording to this passage, how many people actively participated in martial arts lessons?",
        options: ["13,000", "7,000", "6 million", "It can't be determined"],
        correct: 2, difficulty: 2
      },
      {
        id: "PC039",
        text: "Read the passage: 'In the 18th century, the British Royal Navy had difficulty finding enough sailors. Young men found near seaports could be kidnapped, drugged, or otherwise hauled aboard a ship and made to work doing menial chores. This practice was known as being \"pressed\" into service.'\n\nIn this passage, pressed means:",
        options: ["hired", "ironed", "enticed", "forced"],
        correct: 3, difficulty: 2
      },
      {
        id: "PC040",
        text: "Read the passage: 'Statistics show that twenty-five percent of all automobile thefts occur when the doors of a car are left unlocked. An additional fifteen percent happen when keys are left in the ignition. These preventable thefts suggest that car owners can significantly reduce their risk by taking simple precautions.'\n\nTo prevent auto theft, it's a person's responsibility to:",
        options: ["leave the doors unlocked", "never be in a rush", "prevent the opportunity", "be willing to perform a citizen's arrest"],
        correct: 2, difficulty: 3
      },
      {
        id: "PC041",
        text: "Read the passage: 'Sir Edmund Hillary was the first man to successfully complete the ascent to the peak of Mount Everest in May 1953. He was accompanied by Tenzing Norgay, a Sherpa mountaineer from Nepal. Their achievement marked one of the greatest moments in exploration history.'\n\nWho accompanied Sir Edmund Hillary on his historic climb?",
        options: ["Another British climber", "Tenzing Norgay", "A team of scientists", "He climbed alone"],
        correct: 1, difficulty: 1
      },
      {
        id: "PC042",
        text: "Read the passage: 'Photosynthesis is the process by which plants convert sunlight into energy. During this process, plants absorb carbon dioxide from the air and release oxygen as a byproduct. Without photosynthesis, most life on Earth could not exist as we know it.'\n\nWhat do plants release during photosynthesis?",
        options: ["Carbon dioxide", "Nitrogen", "Oxygen", "Hydrogen"],
        correct: 2, difficulty: 1
      },
      {
        id: "PC043",
        text: "Read the passage: 'The Great Wall of China was built over many centuries by various Chinese dynasties. Its primary purpose was to protect the Chinese empire from invasions by nomadic groups from the north. The wall stretches over 13,000 miles, making it one of the most impressive engineering feats in human history.'\n\nWhat was the main purpose of the Great Wall of China?",
        options: ["To display Chinese wealth", "To protect against invasions", "To mark territorial boundaries", "To provide a trade route"],
        correct: 1, difficulty: 2
      },
      {
        id: "PC044",
        text: "Read the passage: 'The human brain weighs approximately three pounds and contains about 86 billion neurons. These neurons form trillions of connections called synapses, which allow us to think, remember, and perform complex tasks. Despite representing only 2% of body weight, the brain uses about 20% of the body's energy.'\n\nWhat percentage of the body's energy does the brain use?",
        options: ["2%", "10%", "20%", "86%"],
        correct: 2, difficulty: 2
      },
      {
        id: "PC045",
        text: "Read the passage: 'The Industrial Revolution began in Britain in the late 18th century and fundamentally changed how goods were produced. Factories replaced small workshops, and machines replaced hand tools. While this transformation brought economic growth, it also created harsh working conditions for many laborers, including children.'\n\nThe author's tone regarding the Industrial Revolution is:",
        options: ["entirely positive", "entirely negative", "balanced, acknowledging both benefits and drawbacks", "indifferent"],
        correct: 2, difficulty: 3
      },
      // NEW: Diverse PC Questions (Science, History, Technology, Health, Nature, Social Studies)
      {
        id: "PC046",
        text: "Read the passage and answer the question.\n\nThe human immune system is a complex network of cells, tissues, and organs that work together to defend the body against harmful pathogens. White blood cells, also called leukocytes, are the primary defenders in this system. They circulate through the bloodstream and lymphatic system, constantly searching for and destroying bacteria, viruses, and other foreign invaders.\n\nWhat is the main function of white blood cells?",
        options: ["To carry oxygen throughout the body", "To defend the body against pathogens", "To regulate body temperature", "To produce hormones"],
        correct: 1, difficulty: 2
      },
      {
        id: "PC047",
        text: "Read the passage and answer the question.\n\nCoral reefs are among the most diverse ecosystems on Earth, supporting approximately 25% of all marine species despite covering less than 1% of the ocean floor. These underwater structures are built by tiny animals called coral polyps, which secrete calcium carbonate to form hard skeletons. When polyps die, their skeletons remain, and new polyps build on top of them.\n\nAccording to the passage, what percentage of the ocean floor do coral reefs cover?",
        options: ["25%", "Less than 1%", "50%", "10%"],
        correct: 1, difficulty: 2
      },
      {
        id: "PC048",
        text: "Read the passage and answer the question.\n\nSound travels at different speeds depending on the medium through which it passes. In air at room temperature, sound travels at approximately 343 meters per second. However, sound travels much faster through water and even faster through steel. This is because sound waves travel more efficiently through denser materials where molecules are closer together.\n\nThe author implies that:",
        options: ["Sound cannot travel through steel", "Denser materials slow down sound", "Molecular proximity affects sound speed", "Air is the best conductor of sound"],
        correct: 2, difficulty: 3
      },
      {
        id: "PC049",
        text: "Read the passage and answer the question.\n\nGravity is often misunderstood as a force that only pulls things downward. In reality, gravity is a mutual attraction between any two objects with mass. The Earth pulls on you, but you also pull on the Earth with equal force. The reason you move toward the Earth rather than the Earth moving toward you is simply because the Earth's mass is so much greater.\n\nWhat is the main idea of this passage?",
        options: ["Gravity only affects heavy objects", "Gravity is a one-way force", "Gravity is a mutual attraction between objects with mass", "The Earth has no gravitational effect on humans"],
        correct: 2, difficulty: 3
      },
      {
        id: "PC050",
        text: "Read the passage and answer the question.\n\nThe water cycle describes the continuous movement of water on, above, and below the surface of the Earth. Water evaporates from oceans, lakes, and rivers, rises into the atmosphere where it condenses into clouds, and eventually falls back to Earth as precipitation. This cycle is driven primarily by solar energy and gravity.\n\nWhat two forces drive the water cycle?",
        options: ["Wind and pressure", "Solar energy and gravity", "Temperature and humidity", "Magnetism and friction"],
        correct: 1, difficulty: 2
      },
      {
        id: "PC051",
        text: "Read the passage and answer the question.\n\nEarthquakes occur when tectonic plates, massive slabs of rock that make up the Earth's outer layer, suddenly shift along fault lines. The energy released by this movement travels through the ground as seismic waves. While most earthquakes are too small to be felt by humans, major earthquakes can cause devastating damage to buildings and infrastructure.\n\nThe word 'devastating' most nearly means:",
        options: ["minor", "destructive", "temporary", "invisible"],
        correct: 1, difficulty: 2
      },
      {
        id: "PC052",
        text: "Read the passage and answer the question.\n\nThe Louisiana Purchase of 1803 doubled the size of the United States overnight. President Thomas Jefferson negotiated the purchase of approximately 828,000 square miles of territory from France for about $15 million. This acquisition not only provided access to the Mississippi River and the port of New Orleans but also opened the way for westward expansion.\n\nAccording to the passage, what was one benefit of the Louisiana Purchase?",
        options: ["It reduced the national debt", "It provided access to the Mississippi River", "It ended conflicts with Native Americans", "It established trade with China"],
        correct: 1, difficulty: 2
      },
      {
        id: "PC053",
        text: "Read the passage and answer the question.\n\nThe Civil Rights Movement of the 1950s and 1960s was characterized by both legal challenges and grassroots activism. While landmark Supreme Court cases like Brown v. Board of Education challenged segregation through the courts, ordinary citizens participated in sit-ins, boycotts, and marches. This combination ultimately led to significant legislative changes.\n\nWhat is the main point of this passage?",
        options: ["The Civil Rights Movement relied solely on court cases", "Protests were ineffective during the Civil Rights era", "Both legal challenges and activism contributed to change", "The Civil Rights Act was passed in 1950"],
        correct: 2, difficulty: 3
      },
      {
        id: "PC054",
        text: "Read the passage and answer the question.\n\nThe Battle of Midway in June 1942 is often considered the turning point of the Pacific War during World War II. American codebreakers had deciphered Japanese naval communications, allowing the U.S. Navy to anticipate the attack and prepare an ambush. In the ensuing battle, American forces sank four Japanese aircraft carriers while losing only one of their own.\n\nAccording to the passage, what advantage helped American forces at Midway?",
        options: ["Superior numbers of ships", "Better weather conditions", "Knowledge from deciphered communications", "More experienced pilots"],
        correct: 2, difficulty: 3
      },
      {
        id: "PC055",
        text: "Read the passage and answer the question.\n\nThe Berlin Airlift of 1948-1949 was a remarkable logistical achievement during the early Cold War. When the Soviet Union blocked all land and water routes to West Berlin, the United States and its allies responded by flying in supplies. Over the course of nearly a year, cargo planes made over 270,000 flights, delivering food and fuel to more than two million West Berliners.\n\nThe author implies that the Berlin Airlift was:",
        options: ["a failure that weakened Western resolve", "an impressive organizational accomplishment", "a minor incident in Cold War history", "supported by the Soviet Union"],
        correct: 1, difficulty: 3
      },
      {
        id: "PC056",
        text: "Read the passage and answer the question.\n\nThe ancient Romans developed a sophisticated system of roads that connected their vast empire. These roads, built with multiple layers of stone and gravel, were designed to last for centuries. The expression 'all roads lead to Rome' reflects the fact that this road network radiated outward from the capital city, facilitating trade, communication, and military movement.\n\nWhat was the purpose of the Roman road system?",
        options: ["To provide employment for workers", "To facilitate trade, communication, and military movement", "To mark territorial boundaries", "To prevent flooding"],
        correct: 1, difficulty: 2
      },
      {
        id: "PC057",
        text: "Read the passage and answer the question.\n\nThe Black Death, which swept through Europe between 1347 and 1351, killed an estimated one-third of the continent's population. With fewer workers available, surviving peasants could demand higher wages. The labor shortage also accelerated the decline of feudalism and contributed to significant changes in European society.\n\nAccording to the passage, one consequence of the Black Death was:",
        options: ["Population growth in Europe", "Lower wages for workers", "Increased bargaining power for surviving peasants", "The strengthening of feudalism"],
        correct: 2, difficulty: 3
      },
      {
        id: "PC058",
        text: "Read the passage and answer the question.\n\nArtificial intelligence (AI) refers to computer systems designed to perform tasks that typically require human intelligence. These tasks include visual perception, speech recognition, decision-making, and language translation. While AI has made remarkable progress, current systems are considered 'narrow AI' because they excel at specific tasks but lack general intelligence.\n\nThe term 'narrow AI' refers to systems that:",
        options: ["have human-like general intelligence", "are physically small", "excel at specific tasks only", "are no longer being developed"],
        correct: 2, difficulty: 3
      },
      {
        id: "PC059",
        text: "Read the passage and answer the question.\n\nGlobal Positioning System (GPS) technology relies on a network of at least 24 satellites orbiting the Earth. A GPS receiver calculates its position by measuring the time it takes for signals to arrive from multiple satellites. By knowing the exact position of each satellite and the time delay of each signal, the receiver can determine its location with remarkable accuracy.\n\nHow does a GPS receiver determine its location?",
        options: ["By receiving signals from ground stations", "By measuring signal delays from multiple satellites", "By connecting to cellular networks", "By using magnetic compasses"],
        correct: 1, difficulty: 3
      },
      {
        id: "PC060",
        text: "Read the passage and answer the question.\n\nThe invention of the printing press by Johannes Gutenberg around 1440 revolutionized the spread of information. Before the printing press, books had to be copied by hand, making them expensive and rare. Gutenberg's movable type technology allowed books to be produced quickly and affordably, democratizing access to knowledge.\n\nThe word 'democratizing' most nearly means:",
        options: ["restricting", "complicating", "making widely available", "politicizing"],
        correct: 2, difficulty: 3
      },
      {
        id: "PC061",
        text: "Read the passage and answer the question.\n\nThe United States Constitution establishes a system of checks and balances among the three branches of government. The legislative branch makes laws, the executive branch enforces them, and the judicial branch interprets them. Each branch has specific powers that allow it to limit the actions of the other branches.\n\nWhat is the main purpose of checks and balances?",
        options: ["To speed up the legislative process", "To prevent any single branch from becoming too powerful", "To reduce the size of government", "To eliminate the need for elections"],
        correct: 1, difficulty: 2
      },
      {
        id: "PC062",
        text: "Read the passage and answer the question.\n\nSupply and demand is a fundamental economic principle that explains how prices are determined in a market. When demand for a product exceeds supply, prices tend to rise. Conversely, when supply exceeds demand, prices typically fall. This dynamic interaction helps allocate resources efficiently in a market economy.\n\nAccording to the passage, what happens when supply exceeds demand?",
        options: ["Prices rise", "Prices fall", "Prices remain stable", "Production stops"],
        correct: 1, difficulty: 2
      },
      {
        id: "PC063",
        text: "Read the passage and answer the question.\n\nUrbanization, the movement of people from rural areas to cities, has accelerated dramatically over the past century. In 1900, only about 15% of the world's population lived in urban areas. Today, more than half of all humans live in cities. Cities offer economic opportunities, educational institutions, and cultural amenities that attract people from the countryside.\n\nThe author implies that urbanization is:",
        options: ["decreasing worldwide", "driven partly by economic opportunities", "harmful to economic development", "limited to developed countries"],
        correct: 1, difficulty: 3
      },
      {
        id: "PC064",
        text: "Read the passage and answer the question.\n\nVaccines work by training the immune system to recognize and fight specific pathogens. When a vaccine is administered, it introduces a weakened or inactivated form of the pathogen, or just a piece of it. The immune system responds by producing antibodies. If the person is later exposed to the actual pathogen, their immune system can quickly neutralize it.\n\nWhat is the main idea of this passage?",
        options: ["Vaccines contain dangerous pathogens", "Vaccines weaken the immune system", "Vaccines train the immune system to fight specific diseases", "Vaccines are only effective for children"],
        correct: 2, difficulty: 2
      },
      {
        id: "PC065",
        text: "Read the passage and answer the question.\n\nSleep is essential for physical and mental health. During sleep, the body repairs tissues, consolidates memories, and releases hormones that regulate growth and appetite. Chronic sleep deprivation has been linked to numerous health problems, including obesity, diabetes, and cardiovascular disease. Most adults need seven to nine hours of sleep per night.\n\nAccording to the passage, how many hours of sleep do most adults need?",
        options: ["Four to five hours", "Five to six hours", "Seven to nine hours", "Ten to twelve hours"],
        correct: 2, difficulty: 1
      },
      {
        id: "PC066",
        text: "Read the passage and answer the question.\n\nAntibiotics are medications that kill or inhibit the growth of bacteria. However, overuse and misuse of antibiotics have led to the emergence of antibiotic-resistant bacteria, sometimes called 'superbugs.' When antibiotics are used inappropriately, bacteria can develop resistance, making future infections harder to treat.\n\nThe word 'inhibit' most nearly means:",
        options: ["encourage", "prevent", "observe", "multiply"],
        correct: 1, difficulty: 2
      },
      {
        id: "PC067",
        text: "Read the passage and answer the question.\n\nThe human heart beats approximately 100,000 times per day, pumping about 2,000 gallons of blood through the body. This blood delivers oxygen and nutrients to cells while removing waste products like carbon dioxide. Regular cardiovascular exercise strengthens the heart muscle and reduces the risk of heart disease.\n\nWhat benefit does cardiovascular exercise provide?",
        options: ["It weakens the heart muscle", "It strengthens the heart and reduces disease risk", "It slows blood circulation", "It increases carbon dioxide levels"],
        correct: 1, difficulty: 2
      },
      {
        id: "PC068",
        text: "Read the passage and answer the question.\n\nThe Selective Service System requires nearly all male U.S. citizens and immigrants to register within 30 days of their 18th birthday. While there has been no draft since 1973, registration ensures that the country can quickly mobilize a military force if a national emergency requires it.\n\nAccording to the passage, when must male citizens register for Selective Service?",
        options: ["At age 16", "At age 21", "Within 30 days of turning 18", "When they graduate high school"],
        correct: 2, difficulty: 2
      },
      {
        id: "PC069",
        text: "Read the passage and answer the question.\n\nRainforests, despite covering only about 6% of Earth's land surface, contain more than half of the world's plant and animal species. These ecosystems play a crucial role in regulating global climate by absorbing carbon dioxide and releasing oxygen. Deforestation threatens biodiversity and contributes to climate change.\n\nWhat is the main point of this passage?",
        options: ["Rainforests cover most of Earth's surface", "Rainforests are important for biodiversity and climate", "Deforestation has no environmental impact", "Rainforests contain few plant species"],
        correct: 1, difficulty: 2
      },
      {
        id: "PC070",
        text: "Read the passage and answer the question.\n\nMigration patterns of birds have fascinated scientists for centuries. Many species travel thousands of miles between their breeding grounds and winter habitats, navigating using a combination of the Earth's magnetic field, the position of the sun and stars, and visual landmarks. Climate change is altering these ancient patterns.\n\nHow do birds navigate during migration?",
        options: ["Using GPS technology", "Following other animals", "Using magnetic field, celestial bodies, and landmarks", "By swimming through ocean currents"],
        correct: 2, difficulty: 3
      },
      {
        id: "PC071",
        text: "Read the passage and answer the question.\n\nWetlands, including marshes, swamps, and bogs, provide numerous ecological services. They filter pollutants from water, reduce flooding by absorbing excess rainwater, and provide habitat for countless species of fish, birds, and other wildlife. Despite their importance, more than half of the original wetlands in the United States have been lost.\n\nThe word 'ecological' most nearly means:",
        options: ["economic", "political", "environmental", "historical"],
        correct: 2, difficulty: 2
      },
      {
        id: "PC072",
        text: "Read the passage and answer the question.\n\nPolar bears are uniquely adapted to life in the Arctic. Their white fur provides camouflage against snow and ice, while a thick layer of blubber insulates them from freezing temperatures. Polar bears are excellent swimmers and can travel long distances between ice floes in search of their primary prey, seals.\n\nAccording to the passage, what is the primary prey of polar bears?",
        options: ["Fish", "Seals", "Penguins", "Whales"],
        correct: 1, difficulty: 1
      },
      {
        id: "PC073",
        text: "Read the passage and answer the question.\n\nThe periodic table organizes elements based on their atomic structure and chemical properties. Elements in the same column, called a group, share similar characteristics because they have the same number of electrons in their outer shell. The noble gases in Group 18 are highly stable because their outer electron shells are full.\n\nWhy are noble gases highly stable?",
        options: ["They have no electrons", "Their outer electron shells are full", "They are heavier than other elements", "They exist only at high temperatures"],
        correct: 1, difficulty: 3
      },
      {
        id: "PC074",
        text: "Read the passage and answer the question.\n\nPhotosynthesis is the process by which plants, algae, and some bacteria convert light energy into chemical energy stored in glucose. This process takes place primarily in the chloroplasts of plant cells, which contain the green pigment chlorophyll. Chlorophyll absorbs light from the sun, which powers the chemical reactions.\n\nWhat role does chlorophyll play in photosynthesis?",
        options: ["It stores glucose", "It absorbs light energy", "It releases carbon dioxide", "It produces water"],
        correct: 1, difficulty: 2
      },
      {
        id: "PC075",
        text: "Read the passage and answer the question.\n\nThe Manhattan Project was a secret research program during World War II that developed the first nuclear weapons. Led by physicist J. Robert Oppenheimer, the project employed over 125,000 workers at multiple sites across the United States. The first successful test occurred in New Mexico on July 16, 1945.\n\nWho led the Manhattan Project?",
        options: ["Albert Einstein", "J. Robert Oppenheimer", "Harry Truman", "Enrico Fermi"],
        correct: 1, difficulty: 2
      },
      {
        id: "PC076",
        text: "Read the passage and answer the question.\n\nThe Silk Road was not a single road but a network of trade routes connecting China to the Mediterranean world for over 1,500 years. Besides silk, merchants transported spices, precious metals, and other goods. Perhaps more importantly, the Silk Road facilitated the exchange of ideas, religions, and technologies between civilizations.\n\nThe author implies that the Silk Road's most significant contribution was:",
        options: ["transporting silk to Europe", "generating wealth for merchants", "facilitating cultural and intellectual exchange", "establishing military alliances"],
        correct: 2, difficulty: 4
      },
      {
        id: "PC077",
        text: "Read the passage and answer the question.\n\nCloud computing allows users to access computing resources, such as storage, processing power, and software, over the internet rather than from local computers. This model offers several advantages: businesses can scale their resources up or down as needed, avoid large upfront investments in hardware, and access their data from anywhere.\n\nWhat is one advantage of cloud computing mentioned in the passage?",
        options: ["It eliminates the need for the internet", "It requires large upfront investments", "Businesses can scale resources as needed", "Data can only be accessed from one location"],
        correct: 2, difficulty: 2
      },
      {
        id: "PC078",
        text: "Read the passage and answer the question.\n\nRenewable energy sources, including solar, wind, and hydroelectric power, generate electricity without depleting natural resources or producing greenhouse gas emissions. While these technologies have become increasingly cost-competitive with fossil fuels, challenges remain. Solar and wind power are intermittent, generating electricity only when the sun shines or the wind blows.\n\nThe word 'intermittent' most nearly means:",
        options: ["constant", "powerful", "irregular or occasional", "expensive"],
        correct: 2, difficulty: 3
      },
      {
        id: "PC079",
        text: "Read the passage and answer the question.\n\nThe Electoral College is the system used to elect the President of the United States. Rather than directly electing the president, voters in each state choose electors who then cast votes for president. A candidate needs 270 of the 538 total electoral votes to win the presidency.\n\nHow many electoral votes does a candidate need to win the presidency?",
        options: ["218", "270", "435", "538"],
        correct: 1, difficulty: 2
      },
      {
        id: "PC080",
        text: "Read the passage and answer the question.\n\nInflation refers to the general increase in prices over time, which reduces the purchasing power of money. Moderate inflation is considered normal in a healthy economy, but high inflation can be harmful, eroding savings and making it difficult for people to plan for the future. Central banks use monetary policy to manage inflation.\n\nWhat effect does inflation have on the purchasing power of money?",
        options: ["It increases purchasing power", "It reduces purchasing power", "It has no effect on purchasing power", "It stabilizes purchasing power"],
        correct: 1, difficulty: 2
      },
      {
        id: "PC081",
        text: "Read the passage and answer the question.\n\nDehydration occurs when the body loses more fluids than it takes in. Even mild dehydration can cause fatigue, headaches, and difficulty concentrating. During physical activity or in hot weather, the body loses water through sweat. Thirst is not always a reliable indicator of dehydration, as it often develops after the body is already significantly dehydrated.\n\nThe author implies that:",
        options: ["Thirst always indicates the need for water", "People should drink only when thirsty", "People should drink fluids before feeling thirsty", "Dehydration only occurs during exercise"],
        correct: 2, difficulty: 3
      },
      {
        id: "PC082",
        text: "Read the passage and answer the question.\n\nMental health is as important as physical health, yet it often receives less attention. Conditions like depression and anxiety affect millions of people worldwide. Treatment options include therapy, medication, and lifestyle changes such as regular exercise, adequate sleep, and social connection. Early intervention typically leads to better outcomes.\n\nWhat is the main idea of this passage?",
        options: ["Mental health conditions are rare", "Physical health is more important than mental health", "Mental health is important and treatable", "Medication is the only treatment for mental illness"],
        correct: 2, difficulty: 2
      },
      {
        id: "PC083",
        text: "Read the passage and answer the question.\n\nBees play a crucial role in food production through pollination. As bees collect nectar from flowers, pollen sticks to their bodies and is transferred to other flowers, enabling plants to reproduce. Approximately one-third of the food we eat depends on pollination by bees and other insects.\n\nWhat percentage of human food depends on pollination by bees and other insects?",
        options: ["About 10%", "About one-third", "About half", "Nearly all"],
        correct: 1, difficulty: 2
      },
      {
        id: "PC084",
        text: "Read the passage and answer the question.\n\nThe ocean covers more than 70% of Earth's surface, yet more than 80% of it remains unexplored. The deep ocean presents extreme challenges for exploration, including crushing pressure, complete darkness, and near-freezing temperatures. Despite these difficulties, scientists continue to discover new species in the deep sea.\n\nThe author implies that:",
        options: ["The ocean is completely explored", "Deep sea exploration is easy", "Many ocean species are yet to be discovered", "The ocean is shrinking"],
        correct: 2, difficulty: 3
      },
      {
        id: "PC085",
        text: "Read the passage and answer the question.\n\nThe assembly line, pioneered by Henry Ford in the early 20th century, revolutionized manufacturing. By breaking down production into simple, repetitive tasks performed by specialized workers, Ford dramatically reduced the time required to build an automobile. The Model T, which took over 12 hours to assemble before, could be completed in just 93 minutes afterward.\n\nAccording to the passage, how long did it take to assemble a Model T after the assembly line was introduced?",
        options: ["Over 12 hours", "About 6 hours", "93 minutes", "24 hours"],
        correct: 2, difficulty: 2
      }
    ],

    // ========================================
    // MATHEMATICS KNOWLEDGE (MK) - 67 questions
    // ========================================
    MK: [
      {
        id: "MK001",
        text: "Solve for x: 2x + 5 = 15",
        options: ["x = 5", "x = 10", "x = 7", "x = 3"],
        correct: 0, difficulty: 1
      },
      {
        id: "MK002",
        text: "What is the area of a triangle with base 8 and height 6?",
        options: ["48 square units", "24 square units", "14 square units", "28 square units"],
        correct: 1, difficulty: 2
      },
      {
        id: "MK003",
        text: "What is the square root of 144?",
        options: ["14", "12", "11", "13"],
        correct: 1, difficulty: 1
      },
      {
        id: "MK004",
        text: "Simplify: 3(x + 4) - 2x",
        options: ["x + 12", "5x + 4", "x + 4", "5x + 12"],
        correct: 0, difficulty: 2
      },
      {
        id: "MK005",
        text: "What is 3/4 expressed as a decimal?",
        options: ["0.34", "0.75", "0.25", "0.50"],
        correct: 1, difficulty: 1
      },
      {
        id: "MK006",
        text: "If a circle has a radius of 7, what is its diameter?",
        options: ["3.5", "7", "14", "21"],
        correct: 2, difficulty: 1
      },
      {
        id: "MK007",
        text: "What is the value of 5²?",
        options: ["10", "15", "25", "125"],
        correct: 2, difficulty: 1
      },
      {
        id: "MK008",
        text: "Solve for x: x/4 = 12",
        options: ["x = 3", "x = 8", "x = 48", "x = 16"],
        correct: 2, difficulty: 1
      },
      {
        id: "MK009",
        text: "What is the perimeter of a rectangle with length 10 and width 6?",
        options: ["16", "32", "60", "120"],
        correct: 1, difficulty: 1
      },
      {
        id: "MK010",
        text: "Simplify: (2³) × (2²)",
        options: ["2⁵", "2⁶", "4⁵", "8"],
        correct: 0, difficulty: 3
      },
      {
        id: "MK011",
        text: "What is 15% of 80?",
        options: ["8", "12", "15", "20"],
        correct: 1, difficulty: 2
      },
      {
        id: "MK012",
        text: "If angle A = 45° and angle B = 90°, what is angle C in a triangle?",
        options: ["45°", "55°", "35°", "65°"],
        correct: 0, difficulty: 2
      },
      {
        id: "MK013",
        text: "What is the least common multiple (LCM) of 4 and 6?",
        options: ["2", "12", "24", "10"],
        correct: 1, difficulty: 2
      },
      {
        id: "MK014",
        text: "Solve: -3 + (-7) = ?",
        options: ["-10", "-4", "4", "10"],
        correct: 0, difficulty: 1
      },
      {
        id: "MK015",
        text: "What is the volume of a cube with sides of length 3?",
        options: ["9", "18", "27", "81"],
        correct: 2, difficulty: 2
      },
      {
        id: "MK016",
        text: "Factor: x² - 9",
        options: ["(x + 3)(x + 3)", "(x - 3)(x - 3)", "(x + 3)(x - 3)", "(x + 9)(x - 1)"],
        correct: 2, difficulty: 3
      },
      {
        id: "MK017",
        text: "What is the slope of the line y = 3x + 5?",
        options: ["5", "3", "-3", "8"],
        correct: 1, difficulty: 2
      },
      {
        id: "MK018",
        text: "Convert 0.25 to a fraction in lowest terms:",
        options: ["1/4", "25/100", "2/8", "1/2"],
        correct: 0, difficulty: 1
      },
      {
        id: "MK019",
        text: "What is the greatest common factor (GCF) of 24 and 36?",
        options: ["6", "12", "4", "18"],
        correct: 1, difficulty: 2
      },
      {
        id: "MK020",
        text: "In a right triangle, if one leg is 3 and the other is 4, what is the hypotenuse?",
        options: ["5", "6", "7", "12"],
        correct: 0, difficulty: 2
      },
      {
        id: "MK021",
        text: "What is 2/3 + 1/6?",
        options: ["3/9", "5/6", "3/6", "1/2"],
        correct: 1, difficulty: 2
      },
      {
        id: "MK022",
        text: "Solve for x: 3x - 7 = 14",
        options: ["x = 7", "x = 3", "x = 21", "x = 4"],
        correct: 0, difficulty: 1
      },
      {
        id: "MK023",
        text: "What is the circumference of a circle with diameter 10? (Use π = 3.14)",
        options: ["31.4", "62.8", "15.7", "78.5"],
        correct: 0, difficulty: 2
      },
      {
        id: "MK024",
        text: "Simplify: √50",
        options: ["5√2", "10√5", "25", "2√5"],
        correct: 0, difficulty: 4
      },
      {
        id: "MK025",
        text: "What is (-4) × (-3)?",
        options: ["-12", "-7", "7", "12"],
        correct: 3, difficulty: 1
      },
      {
        id: "MK026",
        text: "If f(x) = 2x + 3, what is f(4)?",
        options: ["8", "11", "14", "9"],
        correct: 1, difficulty: 2
      },
      {
        id: "MK027",
        text: "What is the area of a circle with radius 5? (Use π = 3.14)",
        options: ["15.7 sq units", "31.4 sq units", "78.5 sq units", "157 sq units"],
        correct: 2, difficulty: 2
      },
      {
        id: "MK028",
        text: "Solve: 4² + 3² = ?",
        options: ["14", "25", "7", "49"],
        correct: 1, difficulty: 1
      },
      {
        id: "MK029",
        text: "What is 5/8 as a percentage?",
        options: ["58%", "62.5%", "80%", "0.625%"],
        correct: 1, difficulty: 2
      },
      {
        id: "MK030",
        text: "Solve for x: 2(x - 3) = 10",
        options: ["x = 8", "x = 5", "x = 6.5", "x = 4"],
        correct: 0, difficulty: 2
      },
      {
        id: "MK031",
        text: "What is the mean of 4, 8, 6, 12, and 10?",
        options: ["6", "8", "10", "7"],
        correct: 1, difficulty: 2
      },
      {
        id: "MK032",
        text: "An angle measuring 180° is called a:",
        options: ["Right angle", "Acute angle", "Obtuse angle", "Straight angle"],
        correct: 3, difficulty: 2
      },
      {
        id: "MK033",
        text: "What is 10³?",
        options: ["30", "100", "1,000", "10,000"],
        correct: 2, difficulty: 1
      },
      {
        id: "MK034",
        text: "Solve: |−8| = ?",
        options: ["-8", "8", "0", "±8"],
        correct: 1, difficulty: 1
      },
      {
        id: "MK035",
        text: "If two angles are complementary and one measures 35°, what does the other measure?",
        options: ["145°", "55°", "35°", "125°"],
        correct: 1, difficulty: 2
      },
      {
        id: "MK036",
        text: "Solve for x: x + 9 = 13",
        options: ["3", "4", "5", "13"],
        correct: 1,
        difficulty: 1
      },
      {
        id: "MK037",
        text: "Solve for x: 3(x + 1) = 5(x - 2) + 7",
        options: ["-2", "2", "1/2", "3"],
        correct: 3,
        difficulty: 3
      },
      {
        id: "MK038",
        text: "Solve: 2x - 3 = x + 7",
        options: ["10", "6", "21", "-10"],
        correct: 0,
        difficulty: 2
      },
      {
        id: "MK039",
        text: "Solve: 12x + 6 = 8x + 10",
        options: ["x = 1", "x = 2", "x = 4", "x = 6"],
        correct: 0,
        difficulty: 2
      },
      {
        id: "MK040",
        text: "If 3(x - 4) = 18, what is the value of x?",
        options: ["3/2", "22/3", "6", "10"],
        correct: 3,
        difficulty: 2
      },
      {
        id: "MK041",
        text: "If 6w + 4 = 8w, then 4w =",
        options: ["1", "2", "4", "8"],
        correct: 3,
        difficulty: 3
      },
      {
        id: "MK042",
        text: "If 3 + y >= 13, what is the value of y?",
        options: ["Greater than or equal to 10", "Less than or equal to 10", "Exactly 10", "6"],
        correct: 0,
        difficulty: 2
      },
      {
        id: "MK043",
        text: "(4x + 2)(x + 1) =",
        options: ["5x + 3", "4x² + 6x + 2", "4x + 2x + 2", "4x² + 2"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "MK044",
        text: "Factor: x² - 5x + 6",
        options: ["(x - 6)(x + 1)", "3(x - 2)(x - 3)", "x(x - 2) - 3(x - 3)", "(x - 2)(x - 3)"],
        correct: 3,
        difficulty: 3
      },
      {
        id: "MK045",
        text: "Factor: 36x² - 49y²",
        options: ["(6x + 7y)(6x - 7y)", "(6x)(6x)(7y)(7y)", "(6x + 6x)(7y - 7y)", "(6x³)(7y³)"],
        correct: 0,
        difficulty: 4
      },
      {
        id: "MK046",
        text: "Factor: y² - 16y + 48",
        options: ["(y - 1)(y + 48)", "(y - 4)(y - 12)", "(y - 4)(y + 4)", "(y + 1)(y - 16)"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "MK047",
        text: "Simplify: (7y² + 3xy - 9) - (2y² + 3xy - 5)",
        options: ["5y² - 4", "9y² + 6xy - 14", "5y² + 4", "5y² + 6xy - 14"],
        correct: 0,
        difficulty: 3
      },
      {
        id: "MK048",
        text: "Simplify: 3x + 2 - (4x - 6)",
        options: ["-x + 8", "-x - 8", "x + 8", "x - 8"],
        correct: 0,
        difficulty: 2
      },
      {
        id: "MK049",
        text: "Simplify: (x⁶)(x⁵)",
        options: ["2x¹¹", "2x³⁰", "x¹¹", "x³⁰"],
        correct: 2,
        difficulty: 2
      },
      {
        id: "MK050",
        text: "x¹² / x⁴ =",
        options: ["x⁻⁴", "x⁸", "x¹⁸", "x⁻¹⁶"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "MK051",
        text: "y³ × y² × y⁻³ =",
        options: ["y²", "y⁻¹⁸", "y⁸", "y²³"],
        correct: 0,
        difficulty: 3
      },
      {
        id: "MK052",
        text: "If 5¹¹ = 5² × 5ᵐ, what is the value of m?",
        options: ["3", "5.5", "9", "12.5"],
        correct: 2,
        difficulty: 3
      },
      {
        id: "MK053",
        text: "Solve: (-3)³ =",
        options: ["9", "-9", "27", "-27"],
        correct: 3,
        difficulty: 2
      },
      {
        id: "MK054",
        text: "6.6 × 10⁻⁴ =",
        options: ["0.000066", "0.00066", "0.0066", "0.066"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "MK055",
        text: "What is the value if x = 2 and y = 4? 2x³ × y²",
        options: ["52", "106", "256", "512"],
        correct: 2,
        difficulty: 3
      },
      {
        id: "MK056",
        text: "Evaluate: √(6² + 8²)",
        options: ["7", "14", "10", "100"],
        correct: 2,
        difficulty: 2
      },
      {
        id: "MK057",
        text: "What is the value of: √(25 + 144)",
        options: ["60", "17", "13", "11"],
        correct: 2,
        difficulty: 2
      },
      {
        id: "MK058",
        text: "The cube root of 27 =",
        options: ["3", "4", "5", "2.25"],
        correct: 0,
        difficulty: 2
      },
      {
        id: "MK059",
        text: "A rectangle is cut in half to create two squares, each with area 25. What is the perimeter of the original rectangle?",
        options: ["20", "25", "30", "50"],
        correct: 2,
        difficulty: 3
      },
      {
        id: "MK060",
        text: "A circle has a radius of 15 feet. What is most nearly its circumference?",
        options: ["30 feet", "25 feet", "94 feet", "150 feet"],
        correct: 2,
        difficulty: 2
      },
      {
        id: "MK061",
        text: "At 3 p.m., the angle between the hands of the clock is:",
        options: ["90 degrees", "180 degrees", "120 degrees", "360 degrees"],
        correct: 0,
        difficulty: 2
      },
      {
        id: "MK062",
        text: "Volume of a rectangular box with dimensions 3 cm × 4 cm × 5 cm =",
        options: ["12 cm³", "15 cm³", "20 cm³", "60 cm³"],
        correct: 3,
        difficulty: 1
      },
      {
        id: "MK063",
        text: "Simplify: 6!",
        options: ["120", "720", "360", "24"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "MK064",
        text: "If n is a positive integer divisible by 7, and n < 70, what is the greatest possible value of n?",
        options: ["49", "56", "63", "69"],
        correct: 2,
        difficulty: 2
      },
      {
        id: "MK065",
        text: "Evaluate: 26 - 7(3 + 5) / 4 + 2",
        options: ["14", "16.67", "23", "40"],
        correct: 0,
        difficulty: 4
      },
      {
        id: "MK066",
        text: "3² + 4(5 - 2) =",
        options: ["21", "36", "39", "40"],
        correct: 0,
        difficulty: 2
      },
      {
        id: "MK067",
        text: "Factor: 4y(3x + 2) - 2(3x + 2)",
        options: ["(4y - 2)(3x + 2)", "(3x - 2)(4y + 2)", "(4y + 2)(6x)", "(3x + 2)(4y + 2)"],
        correct: 0,
        difficulty: 4
      },
      // NEW MK QUESTIONS (MK068-MK132) - 65 questions
      {
        id: "MK068",
        text: "Solve for x: 5x - 8 = 27",
        options: ["x = 7", "x = 4", "x = 19", "x = 35"],
        correct: 0,
        difficulty: 1
      },
      {
        id: "MK069",
        text: "Solve for y: 4y + 12 = 36",
        options: ["y = 12", "y = 6", "y = 8", "y = 48"],
        correct: 1,
        difficulty: 1
      },
      {
        id: "MK070",
        text: "Solve for x: 2x + 3x - 5 = 25",
        options: ["x = 4", "x = 5", "x = 6", "x = 30"],
        correct: 2,
        difficulty: 2
      },
      {
        id: "MK071",
        text: "Simplify: 4(2x - 5) + 3x",
        options: ["11x - 20", "8x - 5", "11x - 5", "5x - 20"],
        correct: 0,
        difficulty: 2
      },
      {
        id: "MK072",
        text: "Solve for x: x/5 + 3 = 7",
        options: ["x = 2", "x = 20", "x = 50", "x = 35"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "MK073",
        text: "What is the value of 7²?",
        options: ["14", "21", "49", "343"],
        correct: 2,
        difficulty: 1
      },
      {
        id: "MK074",
        text: "Simplify: (3⁴) ÷ (3²)",
        options: ["3²", "3⁶", "3⁸", "9"],
        correct: 0,
        difficulty: 2
      },
      {
        id: "MK075",
        text: "What is √196?",
        options: ["12", "13", "14", "16"],
        correct: 2,
        difficulty: 2
      },
      {
        id: "MK076",
        text: "Simplify: √72",
        options: ["6√2", "8√2", "9√2", "36√2"],
        correct: 0,
        difficulty: 3
      },
      {
        id: "MK077",
        text: "What is 2⁻³?",
        options: ["-6", "-8", "1/8", "8"],
        correct: 2,
        difficulty: 3
      },
      {
        id: "MK078",
        text: "What is 2/5 + 1/3?",
        options: ["3/8", "11/15", "3/15", "7/15"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "MK079",
        text: "What is 5/6 - 1/4?",
        options: ["4/2", "7/12", "1/3", "4/6"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "MK080",
        text: "Convert 0.625 to a fraction in lowest terms:",
        options: ["5/8", "625/1000", "3/5", "6/10"],
        correct: 0,
        difficulty: 2
      },
      {
        id: "MK081",
        text: "What is 3/8 × 4/5?",
        options: ["12/40", "3/10", "7/13", "12/13"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "MK082",
        text: "What is 2/3 ÷ 4/9?",
        options: ["8/27", "3/2", "6/12", "2/3"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "MK083",
        text: "If two angles are supplementary and one measures 65°, what does the other measure?",
        options: ["25°", "115°", "65°", "90°"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "MK084",
        text: "The sum of angles in a triangle is:",
        options: ["90°", "180°", "270°", "360°"],
        correct: 1,
        difficulty: 1
      },
      {
        id: "MK085",
        text: "An isosceles triangle has two equal angles of 55° each. What is the third angle?",
        options: ["55°", "70°", "90°", "125°"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "MK086",
        text: "If two angles are complementary and one is 28°, what is the other?",
        options: ["62°", "152°", "72°", "28°"],
        correct: 0,
        difficulty: 1
      },
      {
        id: "MK087",
        text: "A triangle has angles of 40° and 75°. What is the third angle?",
        options: ["65°", "55°", "115°", "45°"],
        correct: 0,
        difficulty: 1
      },
      {
        id: "MK088",
        text: "What is the area of a rectangle with length 12 and width 7?",
        options: ["38 square units", "84 square units", "19 square units", "96 square units"],
        correct: 1,
        difficulty: 1
      },
      {
        id: "MK089",
        text: "What is the area of a triangle with base 10 and height 9?",
        options: ["90 square units", "45 square units", "19 square units", "50 square units"],
        correct: 1,
        difficulty: 1
      },
      {
        id: "MK090",
        text: "What is the area of a circle with radius 6? (Use π = 3.14)",
        options: ["18.84 sq units", "37.68 sq units", "113.04 sq units", "56.52 sq units"],
        correct: 2,
        difficulty: 2
      },
      {
        id: "MK091",
        text: "A square has an area of 64 square feet. What is the length of one side?",
        options: ["8 feet", "16 feet", "32 feet", "4 feet"],
        correct: 0,
        difficulty: 2
      },
      {
        id: "MK092",
        text: "What is the area of a trapezoid with bases 8 and 12, and height 5?",
        options: ["50 square units", "100 square units", "40 square units", "60 square units"],
        correct: 0,
        difficulty: 3
      },
      {
        id: "MK093",
        text: "What is the perimeter of a square with side length 9?",
        options: ["18", "27", "36", "81"],
        correct: 2,
        difficulty: 1
      },
      {
        id: "MK094",
        text: "What is the circumference of a circle with radius 8? (Use π = 3.14)",
        options: ["25.12", "50.24", "200.96", "16"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "MK095",
        text: "A triangle has sides of 7, 8, and 9. What is its perimeter?",
        options: ["24", "56", "504", "15"],
        correct: 0,
        difficulty: 1
      },
      {
        id: "MK096",
        text: "What is the perimeter of a rectangle with length 15 and width 8?",
        options: ["23", "46", "120", "92"],
        correct: 1,
        difficulty: 1
      },
      {
        id: "MK097",
        text: "What is the volume of a rectangular prism with length 6, width 4, and height 3?",
        options: ["13 cubic units", "48 cubic units", "72 cubic units", "24 cubic units"],
        correct: 2,
        difficulty: 2
      },
      {
        id: "MK098",
        text: "What is the volume of a cube with sides of 5?",
        options: ["15", "25", "125", "625"],
        correct: 2,
        difficulty: 1
      },
      {
        id: "MK099",
        text: "A cylinder has radius 3 and height 7. What is its volume? (Use π = 3.14)",
        options: ["65.94 cu units", "131.88 cu units", "197.82 cu units", "263.76 cu units"],
        correct: 2,
        difficulty: 3
      },
      {
        id: "MK100",
        text: "What is the volume of a sphere with radius 3? (V = 4/3 πr³, π = 3.14)",
        options: ["37.68 cu units", "113.04 cu units", "28.26 cu units", "84.78 cu units"],
        correct: 1,
        difficulty: 4
      },
      {
        id: "MK101",
        text: "Evaluate: 8 + 4 × 3",
        options: ["36", "20", "15", "24"],
        correct: 1,
        difficulty: 1
      },
      {
        id: "MK102",
        text: "Evaluate: 24 ÷ 6 + 2 × 5",
        options: ["14", "30", "7", "22"],
        correct: 0,
        difficulty: 2
      },
      {
        id: "MK103",
        text: "Evaluate: (15 - 3) × 2 + 8",
        options: ["32", "28", "36", "44"],
        correct: 0,
        difficulty: 2
      },
      {
        id: "MK104",
        text: "Evaluate: 5² - 3 × 4 + 2",
        options: ["90", "15", "13", "40"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "MK105",
        text: "Evaluate: 48 ÷ (4 + 2) × 3",
        options: ["24", "6", "36", "8"],
        correct: 0,
        difficulty: 3
      },
      {
        id: "MK106",
        text: "Solve: x + 5 > 12. What values satisfy this inequality?",
        options: ["x > 7", "x < 7", "x > 17", "x < 17"],
        correct: 0,
        difficulty: 2
      },
      {
        id: "MK107",
        text: "Solve: 3x - 4 ≤ 11",
        options: ["x ≤ 5", "x ≥ 5", "x ≤ 7/3", "x ≥ 7/3"],
        correct: 0,
        difficulty: 2
      },
      {
        id: "MK108",
        text: "Solve: 2x + 6 < 18",
        options: ["x < 6", "x > 6", "x < 12", "x > 12"],
        correct: 0,
        difficulty: 2
      },
      {
        id: "MK109",
        text: "If -2x > 8, then:",
        options: ["x > 4", "x < 4", "x > -4", "x < -4"],
        correct: 3,
        difficulty: 3
      },
      {
        id: "MK110",
        text: "What is the mean of 12, 18, 22, 24, and 24?",
        options: ["18", "20", "22", "24"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "MK111",
        text: "What is the median of 5, 8, 12, 15, 20?",
        options: ["8", "12", "15", "11"],
        correct: 1,
        difficulty: 1
      },
      {
        id: "MK112",
        text: "What is the mode of: 3, 5, 7, 5, 9, 5, 11?",
        options: ["3", "5", "7", "9"],
        correct: 1,
        difficulty: 1
      },
      {
        id: "MK113",
        text: "The median of 8, 3, 10, 7, 5, 12 is:",
        options: ["7", "7.5", "8", "10"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "MK114",
        text: "What is the range of: 4, 9, 15, 21, 28?",
        options: ["15", "21", "24", "28"],
        correct: 2,
        difficulty: 1
      },
      {
        id: "MK115",
        text: "Express 4,500,000 in scientific notation:",
        options: ["4.5 × 10⁵", "4.5 × 10⁶", "45 × 10⁵", "0.45 × 10⁷"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "MK116",
        text: "Express 0.0023 in scientific notation:",
        options: ["2.3 × 10⁻²", "2.3 × 10⁻³", "23 × 10⁻⁴", "0.23 × 10⁻²"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "MK117",
        text: "What is 3.2 × 10⁴ in standard form?",
        options: ["320", "3,200", "32,000", "320,000"],
        correct: 2,
        difficulty: 2
      },
      {
        id: "MK118",
        text: "(2 × 10³) × (4 × 10²) =",
        options: ["8 × 10⁵", "8 × 10⁶", "6 × 10⁵", "6 × 10⁶"],
        correct: 0,
        difficulty: 3
      },
      {
        id: "MK119",
        text: "Factor: x² + 7x + 12",
        options: ["(x + 3)(x + 4)", "(x + 2)(x + 6)", "(x + 1)(x + 12)", "(x - 3)(x - 4)"],
        correct: 0,
        difficulty: 2
      },
      {
        id: "MK120",
        text: "Factor: x² - 25",
        options: ["(x + 5)(x + 5)", "(x - 5)(x - 5)", "(x + 5)(x - 5)", "(x + 25)(x - 1)"],
        correct: 2,
        difficulty: 2
      },
      {
        id: "MK121",
        text: "Factor: 2x² + 8x",
        options: ["2x(x + 4)", "2(x² + 4x)", "x(2x + 8)", "4x(x + 2)"],
        correct: 0,
        difficulty: 2
      },
      {
        id: "MK122",
        text: "Factor: x² - 8x + 15",
        options: ["(x - 3)(x - 5)", "(x + 3)(x + 5)", "(x - 1)(x - 15)", "(x + 3)(x - 5)"],
        correct: 0,
        difficulty: 3
      },
      {
        id: "MK123",
        text: "Solve for x: 7x + 2 = 4x + 17",
        options: ["x = 5", "x = 3", "x = 19/3", "x = 15/11"],
        correct: 0,
        difficulty: 2
      },
      {
        id: "MK124",
        text: "Simplify: 2(3x + 4) - 5(x - 1)",
        options: ["x + 13", "11x + 3", "x + 3", "11x + 13"],
        correct: 0,
        difficulty: 3
      },
      {
        id: "MK125",
        text: "What is 4⁰?",
        options: ["0", "1", "4", "Undefined"],
        correct: 1,
        difficulty: 1
      },
      {
        id: "MK126",
        text: "What is (5²)³?",
        options: ["5⁵", "5⁶", "5⁸", "15²"],
        correct: 1,
        difficulty: 3
      },
      {
        id: "MK127",
        text: "What is 7/8 as a decimal?",
        options: ["0.78", "0.875", "0.857", "0.7"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "MK128",
        text: "In a right triangle, one leg is 5 and the hypotenuse is 13. What is the other leg?",
        options: ["8", "10", "12", "18"],
        correct: 2,
        difficulty: 3
      },
      {
        id: "MK129",
        text: "What is 40% of 75?",
        options: ["25", "30", "35", "40"],
        correct: 1,
        difficulty: 2
      },
      {
        id: "MK130",
        text: "An exterior angle of a regular hexagon measures:",
        options: ["60°", "120°", "45°", "90°"],
        correct: 0,
        difficulty: 3
      },
      {
        id: "MK131",
        text: "Simplify: (4x³y²)(3xy⁴)",
        options: ["12x⁴y⁶", "12x³y⁸", "7x⁴y⁶", "12x⁴y⁸"],
        correct: 0,
        difficulty: 3
      },
      {
        id: "MK132",
        text: "If the area of a circle is 100π square units, what is the radius?",
        options: ["5 units", "10 units", "25 units", "50 units"],
        correct: 1,
        difficulty: 3
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
        correct: 2, difficulty: 1
      },
      {
        id: "EI002",
        text: "In a series circuit, if one bulb burns out, what happens to the others?",
        options: ["They get brighter", "They go out", "Nothing changes", "They dim slightly"],
        correct: 1, difficulty: 2
      },
      {
        id: "EI003",
        text: "What is the formula for Ohm's Law?",
        options: ["V = IR", "P = IV", "V = I/R", "R = VI"],
        correct: 0, difficulty: 2
      },
      {
        id: "EI004",
        text: "Which component stores electrical energy in an electric field?",
        options: ["Resistor", "Capacitor", "Inductor", "Transistor"],
        correct: 1, difficulty: 2
      },
      {
        id: "EI005",
        text: "What is the unit of electrical power?",
        options: ["Volt", "Ampere", "Ohm", "Watt"],
        correct: 3, difficulty: 1
      },
      {
        id: "EI006",
        text: "Current flows from:",
        options: ["Positive to negative", "Negative to positive", "Both directions equally", "Neither direction"],
        correct: 0, difficulty: 2
      },
      {
        id: "EI007",
        text: "What does a fuse do in a circuit?",
        options: ["Increases current", "Stores energy", "Protects from overcurrent", "Measures voltage"],
        correct: 2, difficulty: 1
      },
      {
        id: "EI008",
        text: "In a parallel circuit, if one path is broken:",
        options: ["All current stops", "Current continues in other paths", "Voltage increases", "Resistance doubles"],
        correct: 1, difficulty: 2
      },
      {
        id: "EI009",
        text: "What is the symbol for a battery in a circuit diagram?",
        options: ["Circle with X", "Long and short parallel lines", "Triangle", "Square with arrow"],
        correct: 1, difficulty: 2
      },
      {
        id: "EI010",
        text: "AC stands for:",
        options: ["Additional Current", "Alternating Current", "Ampere Circuit", "Automatic Current"],
        correct: 1, difficulty: 1
      },
      {
        id: "EI011",
        text: "A transformer is used to:",
        options: ["Store electricity", "Change voltage levels", "Measure current", "Create resistance"],
        correct: 1, difficulty: 2
      },
      {
        id: "EI012",
        text: "What material is the best conductor of electricity?",
        options: ["Rubber", "Glass", "Copper", "Wood"],
        correct: 2, difficulty: 1
      },
      {
        id: "EI013",
        text: "A diode allows current to flow in:",
        options: ["Both directions", "One direction only", "No direction", "Alternating directions"],
        correct: 1, difficulty: 2
      },
      {
        id: "EI014",
        text: "What is the standard household voltage in the United States?",
        options: ["220 volts", "120 volts", "50 volts", "240 volts"],
        correct: 1, difficulty: 1
      },
      {
        id: "EI015",
        text: "If voltage is 12V and resistance is 4Ω, what is the current?",
        options: ["48A", "3A", "16A", "8A"],
        correct: 1, difficulty: 2
      },
      {
        id: "EI016",
        text: "A ground wire is typically what color?",
        options: ["Black", "White", "Red", "Green or bare copper"],
        correct: 3, difficulty: 2
      },
      {
        id: "EI017",
        text: "What device converts AC to DC?",
        options: ["Transformer", "Rectifier", "Capacitor", "Inductor"],
        correct: 1, difficulty: 3
      },
      {
        id: "EI018",
        text: "What is the purpose of an insulator?",
        options: ["Conduct electricity", "Prevent current flow", "Store energy", "Increase voltage"],
        correct: 1, difficulty: 1
      },
      {
        id: "EI019",
        text: "LED stands for:",
        options: ["Low Energy Device", "Light Emitting Diode", "Linear Electric Diode", "Long Emission Device"],
        correct: 1, difficulty: 1
      },
      {
        id: "EI020",
        text: "Total resistance in a series circuit is:",
        options: ["Less than smallest resistor", "Sum of all resistors", "Product of all resistors", "Average of all resistors"],
        correct: 1, difficulty: 2
      },
      {
        id: "EI021",
        text: "What measures electrical current?",
        options: ["Voltmeter", "Ammeter", "Ohmmeter", "Wattmeter"],
        correct: 1, difficulty: 1
      },
      {
        id: "EI022",
        text: "A short circuit occurs when:",
        options: ["Resistance is very high", "Current bypasses the load", "Voltage is too low", "The circuit is open"],
        correct: 1, difficulty: 2
      },
      {
        id: "EI023",
        text: "What component amplifies electrical signals?",
        options: ["Resistor", "Capacitor", "Transistor", "Inductor"],
        correct: 2, difficulty: 2
      },
      {
        id: "EI024",
        text: "The frequency of AC power in the US is:",
        options: ["50 Hz", "60 Hz", "100 Hz", "120 Hz"],
        correct: 1, difficulty: 2
      },
      {
        id: "EI025",
        text: "Static electricity is caused by:",
        options: ["Moving electrons", "Transfer of electrons", "Magnetic fields", "Chemical reactions"],
        correct: 1, difficulty: 3
      },
      {
        id: "EI026",
        text: "What color is the hot wire in standard US wiring?",
        options: ["White", "Green", "Black", "Blue"],
        correct: 2, difficulty: 2
      },
      {
        id: "EI027",
        text: "A circuit breaker serves the same purpose as a:",
        options: ["Switch", "Fuse", "Capacitor", "Battery"],
        correct: 1, difficulty: 1
      },
      {
        id: "EI028",
        text: "Electromagnetic waves include all EXCEPT:",
        options: ["Radio waves", "Sound waves", "Light waves", "X-rays"],
        correct: 1, difficulty: 3
      },
      {
        id: "EI029",
        text: "Power (watts) equals:",
        options: ["Voltage × Current", "Voltage ÷ Current", "Current ÷ Resistance", "Resistance × Current"],
        correct: 0, difficulty: 2
      },
      {
        id: "EI030",
        text: "A multimeter can measure all EXCEPT:",
        options: ["Voltage", "Current", "Resistance", "Weight"],
        correct: 3, difficulty: 1
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
        correct: 2, difficulty: 2
      },
      {
        id: "AS002",
        text: "Which tool is used to measure inside diameters?",
        options: ["Ruler", "Calipers", "Tape measure", "Square"],
        correct: 1, difficulty: 2
      },
      {
        id: "AS003",
        text: "What does the alternator do?",
        options: ["Starts the engine", "Charges the battery", "Controls fuel flow", "Filters oil"],
        correct: 1, difficulty: 2
      },
      {
        id: "AS004",
        text: "A Phillips head screwdriver has a tip shaped like a:",
        options: ["Flat line", "Square", "Cross/plus sign", "Hexagon"],
        correct: 2, difficulty: 1
      },
      {
        id: "AS005",
        text: "What system cools the engine?",
        options: ["Exhaust system", "Cooling system", "Fuel system", "Electrical system"],
        correct: 1, difficulty: 1
      },
      {
        id: "AS006",
        text: "What tool is used to tighten bolts to a specific torque?",
        options: ["Socket wrench", "Torque wrench", "Adjustable wrench", "Pipe wrench"],
        correct: 1, difficulty: 2
      },
      {
        id: "AS007",
        text: "The spark plug ignites the fuel mixture in which engine type?",
        options: ["Diesel", "Electric", "Gasoline", "Steam"],
        correct: 2, difficulty: 2
      },
      {
        id: "AS008",
        text: "What PPE should be worn when grinding metal?",
        options: ["Earplugs only", "Gloves only", "Safety glasses", "Hard hat"],
        correct: 2, difficulty: 1
      },
      {
        id: "AS009",
        text: "What part transfers power from the transmission to the wheels?",
        options: ["Clutch", "Drive shaft", "Starter", "Radiator"],
        correct: 1, difficulty: 2
      },
      {
        id: "AS010",
        text: "A hacksaw is primarily used to cut:",
        options: ["Wood", "Metal", "Plastic only", "Fabric"],
        correct: 1, difficulty: 1
      },
      {
        id: "AS011",
        text: "What does the catalytic converter do?",
        options: ["Increases horsepower", "Reduces emissions", "Filters fuel", "Cools exhaust"],
        correct: 1, difficulty: 2
      },
      {
        id: "AS012",
        text: "Which type of wrench has an adjustable jaw?",
        options: ["Box wrench", "Crescent wrench", "Socket wrench", "Combination wrench"],
        correct: 1, difficulty: 2
      },
      {
        id: "AS013",
        text: "Brake fluid should be what color when fresh?",
        options: ["Red", "Green", "Clear to light yellow", "Black"],
        correct: 2, difficulty: 3
      },
      {
        id: "AS014",
        text: "What is the purpose of a center punch?",
        options: ["Cutting metal", "Making starter holes", "Measuring depth", "Bending wire"],
        correct: 1, difficulty: 2
      },
      {
        id: "AS015",
        text: "The differential allows the wheels to:",
        options: ["Stop quickly", "Turn at different speeds", "Go in reverse", "Save fuel"],
        correct: 1, difficulty: 3
      },
      {
        id: "AS016",
        text: "What type of joint allows two shafts to connect at an angle?",
        options: ["Ball joint", "Universal joint", "Weld joint", "Rivet joint"],
        correct: 1, difficulty: 3
      },
      {
        id: "AS017",
        text: "A micrometer measures:",
        options: ["Voltage", "Weight", "Precise thickness", "Temperature"],
        correct: 2, difficulty: 2
      },
      {
        id: "AS018",
        text: "What component stores pressurized fuel?",
        options: ["Carburetor", "Fuel tank", "Fuel rail", "Fuel pump"],
        correct: 2, difficulty: 3
      },
      {
        id: "AS019",
        text: "What is the purpose of anti-freeze?",
        options: ["Lubricates engine", "Prevents coolant from freezing", "Cleans fuel injectors", "Charges battery"],
        correct: 1, difficulty: 1
      },
      {
        id: "AS020",
        text: "A ball-peen hammer is typically used for:",
        options: ["Woodworking", "Metalworking", "Masonry", "Plumbing"],
        correct: 1, difficulty: 2
      },
      {
        id: "AS021",
        text: "What part of the braking system applies pressure to the brake pads?",
        options: ["Master cylinder", "Brake caliper", "Brake rotor", "Brake line"],
        correct: 1, difficulty: 2
      },
      {
        id: "AS022",
        text: "What does OBD stand for in automotive diagnostics?",
        options: ["Original Brake Design", "On-Board Diagnostics", "Oil Bypass Device", "Outer Body Design"],
        correct: 1, difficulty: 2
      },
      {
        id: "AS023",
        text: "A tap is used to:",
        options: ["Cut external threads", "Cut internal threads", "Measure threads", "Clean threads"],
        correct: 1, difficulty: 3
      },
      {
        id: "AS024",
        text: "What maintains constant engine speed regardless of load?",
        options: ["Thermostat", "Governor", "Carburetor", "Alternator"],
        correct: 1, difficulty: 3
      },
      {
        id: "AS025",
        text: "When soldering, what removes oxidation from the metal surface?",
        options: ["Solder", "Flux", "Heat", "Wire brush"],
        correct: 1, difficulty: 2
      },
      {
        id: "AS026",
        text: "What is the correct order of strokes in a four-stroke engine cycle?",
        options: ["Compression, intake, exhaust, power", "Intake, power, compression, exhaust", "Intake, compression, power, exhaust", "Power, intake, compression, exhaust"],
        correct: 2, difficulty: 1
      },
      {
        id: "AS027",
        text: "During which stroke does combustion force the piston down and produce usable work?",
        options: ["Power stroke", "Intake stroke", "Exhaust stroke", "Compression stroke"],
        correct: 0, difficulty: 1
      },
      {
        id: "AS028",
        text: "Which engine component converts the up-and-down motion of the pistons into rotary motion?",
        options: ["Camshaft", "Crankshaft", "Cylinder head", "Rocker arm"],
        correct: 1, difficulty: 2
      },
      {
        id: "AS029",
        text: "What is the primary function of the camshaft in a four-stroke engine?",
        options: ["Store rotational energy between power strokes", "Transfer combustion force to the crankshaft", "Seal the combustion chamber", "Open and close the intake and exhaust valves at the proper times"],
        correct: 3, difficulty: 2
      },
      {
        id: "AS030",
        text: "What is the main purpose of the piston rings?",
        options: ["Seal combustion pressure in the cylinder and control oil on the cylinder wall", "Connect the piston to the connecting rod", "Reduce the compression ratio of the engine", "Time the opening of the valves"],
        correct: 0, difficulty: 2
      },
      {
        id: "AS031",
        text: "Engine displacement is best defined as the",
        options: ["volume of the combustion chamber with the piston at top dead center", "distance the crankshaft throw travels in one revolution", "total volume swept by all pistons moving from bottom dead center to top dead center", "amount of fuel the engine burns per cycle"],
        correct: 2, difficulty: 3
      },
      {
        id: "AS032",
        text: "The compression ratio of an engine compares the cylinder volume with the piston at bottom dead center to the",
        options: ["engine's total displacement", "volume remaining with the piston at top dead center", "volume of the intake manifold", "stroke length of the piston"],
        correct: 1, difficulty: 3
      },
      {
        id: "AS033",
        text: "In a four-stroke engine, how many complete crankshaft revolutions are required to produce one power stroke in a cylinder?",
        options: ["One-half", "One", "Four", "Two"],
        correct: 3, difficulty: 3
      },
      {
        id: "AS034",
        text: "How is the fuel ignited in a diesel engine?",
        options: ["By the heat of highly compressed air when fuel is injected", "By a spark plug firing near top dead center", "By a glow plug firing on every power stroke", "By a magneto-driven ignition coil"],
        correct: 0, difficulty: 3
      },
      {
        id: "AS035",
        text: "The flywheel on the end of the crankshaft serves mainly to",
        options: ["increase the engine's compression ratio", "cool the crankshaft during operation", "store rotational energy and smooth out the pulses between power strokes", "adjust valve clearance automatically"],
        correct: 2, difficulty: 4
      },
      {
        id: "AS036",
        text: "Compared with a four-stroke engine, a two-stroke engine of the same size and speed",
        options: ["produces a power stroke only every fourth crankshaft revolution", "produces a power stroke on every crankshaft revolution", "requires twice as many valves per cylinder", "cannot run without a camshaft"],
        correct: 1, difficulty: 4
      },
      {
        id: "AS037",
        text: "In a four-stroke engine, the camshaft is driven by the crankshaft at what speed?",
        options: ["The same speed as the crankshaft", "Twice crankshaft speed", "One-quarter crankshaft speed", "One-half crankshaft speed"],
        correct: 3, difficulty: 5
      },
      {
        id: "AS038",
        text: "What is the main advantage of electronic fuel injection over a carburetor?",
        options: ["It eliminates the need for a fuel pump", "It meters fuel more precisely for better efficiency and emissions", "It allows the engine to run without a battery", "It requires no air filter"],
        correct: 1, difficulty: 2
      },
      {
        id: "AS039",
        text: "What is the purpose of the fuel filter?",
        options: ["To cool the fuel before it reaches the engine", "To increase fuel pressure to the injectors", "To remove dirt and contaminants from the fuel", "To measure how much fuel enters the engine"],
        correct: 2, difficulty: 1
      },
      {
        id: "AS040",
        text: "In most modern fuel-injected vehicles, where is the electric fuel pump located?",
        options: ["Inside the fuel tank", "On the side of the engine block", "Inside the intake manifold", "Next to the radiator"],
        correct: 0, difficulty: 3
      },
      {
        id: "AS041",
        text: "What does the ignition coil do?",
        options: ["It stores extra fuel for cold starts", "It regulates the charging system voltage", "It turns the engine over during starting", "It steps up battery voltage to the high voltage needed to fire the spark plugs"],
        correct: 3, difficulty: 2
      },
      {
        id: "AS042",
        text: "In an older engine with a distributor, what is the distributor's job?",
        options: ["To distribute fuel evenly to each cylinder", "To route high-voltage current to each spark plug in the correct firing order", "To distribute oil to the valve train", "To split battery power between the lights and the starter"],
        correct: 1, difficulty: 2
      },
      {
        id: "AS043",
        text: "If a spark plug gap is set too wide, what is the most likely result?",
        options: ["Misfiring, because a higher voltage is needed to jump the gap", "The engine will run too cool", "The battery will overcharge", "Fuel pressure will drop"],
        correct: 0, difficulty: 3
      },
      {
        id: "AS044",
        text: "A standard automotive battery is rated at 12 volts. How is this voltage produced?",
        options: ["By one large 12-volt cell", "By twelve 1-volt cells connected in series", "By six 2-volt cells connected in series", "By two 6-volt cells connected in parallel"],
        correct: 2, difficulty: 1
      },
      {
        id: "AS045",
        text: "When you turn the key to start the engine, what does the starter solenoid do?",
        options: ["It sprays extra fuel into the cylinders", "It advances the ignition timing", "It disconnects the alternator from the battery", "It closes a high-current circuit and pushes the starter pinion into the flywheel ring gear"],
        correct: 3, difficulty: 3
      },
      {
        id: "AS046",
        text: "What is the key difference between an alternator and an older DC generator?",
        options: ["An alternator produces alternating current that is converted to DC by diodes", "An alternator runs only when the engine is off", "A generator produces higher voltage than an alternator", "An alternator charges the battery with alternating current directly"],
        correct: 0, difficulty: 4
      },
      {
        id: "AS047",
        text: "A fuse in a circuit blows repeatedly. What does this most likely indicate?",
        options: ["The battery is undercharged", "The fuse rating is too high for the circuit", "The circuit is drawing too much current, often due to a short", "The alternator belt is loose"],
        correct: 2, difficulty: 3
      },
      {
        id: "AS048",
        text: "In American Wire Gauge (AWG) sizing for automotive wiring, a lower gauge number means the wire is:",
        options: ["Longer", "Thicker and able to carry more current", "Thinner and used for high-current loads", "Insulated with a higher temperature rating"],
        correct: 1, difficulty: 4
      },
      {
        id: "AS049",
        text: "What is the main job of the radiator?",
        options: ["To pressurize the engine oil", "To store extra coolant for the heater", "To filter dirt out of the coolant", "To transfer heat from the coolant to the outside air"],
        correct: 3, difficulty: 1
      },
      {
        id: "AS050",
        text: "If the thermostat sticks closed, what will most likely happen?",
        options: ["The engine will overheat because coolant cannot circulate through the radiator", "The engine will run too cold and never reach operating temperature", "The heater will blow hot air constantly", "Oil pressure will rise sharply"],
        correct: 0, difficulty: 2
      },
      {
        id: "AS051",
        text: "How is the water pump in most engines driven?",
        options: ["By its own electric motor in all vehicles", "By exhaust gas pressure", "By a belt turned by the engine's crankshaft", "By vacuum from the intake manifold"],
        correct: 2, difficulty: 3
      },
      {
        id: "AS052",
        text: "Why is engine coolant normally mixed as roughly 50 percent antifreeze and 50 percent water instead of using pure antifreeze?",
        options: ["Pure antifreeze would corrode the radiator instantly", "The mixture transfers heat better than pure antifreeze and still gives freeze and boil protection", "Water is needed to lubricate the water pump seals", "Pure antifreeze evaporates too quickly"],
        correct: 1, difficulty: 3
      },
      {
        id: "AS053",
        text: "What is the primary function of engine oil?",
        options: ["To seal the combustion chamber against coolant leaks", "To increase compression in the cylinders", "To keep the fuel system clean", "To reduce friction between moving metal parts"],
        correct: 3, difficulty: 2
      },
      {
        id: "AS054",
        text: "In a motor oil rated 10W-30, what does the number before the W indicate?",
        options: ["The oil's viscosity, or flow resistance, at cold winter temperatures", "The oil's weight in ounces per quart", "The maximum engine horsepower the oil supports", "The number of miles between oil changes, in thousands"],
        correct: 0, difficulty: 4
      },
      {
        id: "AS055",
        text: "Where does the oil pump draw its oil from, and how is maximum oil pressure limited?",
        options: ["From the radiator, limited by the thermostat", "From the valve cover, limited by the PCV valve", "From a pickup tube in the oil pan, limited by a pressure relief valve", "From the oil filter, limited by the dipstick tube"],
        correct: 2, difficulty: 4
      },
      {
        id: "AS056",
        text: "What happens if the oil filter becomes completely clogged while the engine is running?",
        options: ["The engine immediately loses all oil pressure and seizes", "A bypass valve opens so unfiltered oil continues to reach the engine", "The oil pump shuts off automatically to protect the filter", "Oil is rerouted through the coolant passages"],
        correct: 1, difficulty: 5
      },
      {
        id: "AS057",
        text: "Which type of brake uses a caliper to squeeze friction pads against a rotating rotor?",
        options: ["Disc brake", "Drum brake", "Parking brake", "Band brake"],
        correct: 0, difficulty: 1
      },
      {
        id: "AS058",
        text: "In the tire size marking P215/60R16, the letter R indicates that the tire is:",
        options: ["Reinforced", "Rated for rain", "Radial construction", "A racing tire"],
        correct: 2, difficulty: 1
      },
      {
        id: "AS059",
        text: "The main job of the brake master cylinder is to:",
        options: ["Store extra brake pads", "Convert pedal force into hydraulic pressure", "Cool the brake fluid", "Adjust the parking brake cable"],
        correct: 1, difficulty: 2
      },
      {
        id: "AS060",
        text: "The primary purpose of an anti-lock braking system (ABS) is to:",
        options: ["Shorten the life of the brake pads", "Increase engine braking on hills", "Apply the brakes automatically in traffic", "Prevent wheel lockup so the driver keeps steering control"],
        correct: 3, difficulty: 2
      },
      {
        id: "AS061",
        text: "The main function of a shock absorber is to:",
        options: ["Dampen the bouncing motion of the springs", "Support the weight of the vehicle", "Keep the wheels aligned", "Limit the steering angle"],
        correct: 0, difficulty: 2
      },
      {
        id: "AS062",
        text: "Camber is the alignment angle that describes:",
        options: ["The difference in distance between the fronts and rears of the tires", "The rearward tilt of the steering axis", "The inward or outward tilt of the top of the wheel, viewed from the front", "How far the steering wheel can turn"],
        correct: 2, difficulty: 3
      },
      {
        id: "AS063",
        text: "Tie rods in the steering system connect the:",
        options: ["Brake caliper to the rotor", "Steering linkage to the steering knuckles at the wheels", "Transmission to the driveshaft", "Coil springs to the frame"],
        correct: 1, difficulty: 3
      },
      {
        id: "AS064",
        text: "In a vehicle with a manual transmission, the clutch is used to:",
        options: ["Lock the rear wheels when parking", "Multiply engine torque at high speed", "Pump transmission fluid to the gears", "Connect and disconnect the engine from the transmission"],
        correct: 3, difficulty: 3
      },
      {
        id: "AS065",
        text: "Constant velocity (CV) joints are most commonly found on the axle shafts of:",
        options: ["Front-wheel-drive cars", "Rear-wheel-drive trucks with solid axles", "Trailer axles", "Motorcycles"],
        correct: 0, difficulty: 3
      },
      {
        id: "AS066",
        text: "In a four-wheel-drive vehicle, the transfer case is the component that:",
        options: ["Stores the spare tire", "Changes the engine firing order", "Splits engine power between the front and rear axles", "Holds the transmission fluid filter"],
        correct: 2, difficulty: 4
      },
      {
        id: "AS067",
        text: "A brake pedal that feels soft or spongy when pressed is most often caused by:",
        options: ["New brake pads that are too thick", "Air trapped in the hydraulic brake lines", "A parking brake that is adjusted too tight", "Tires that are overinflated"],
        correct: 1, difficulty: 4
      },
      {
        id: "AS068",
        text: "In an automatic transmission, the torque converter performs which function that a clutch performs in a manual transmission?",
        options: ["It selects the correct gear ratio", "It cools the transmission fluid", "It engages the reverse band", "It couples and uncouples the engine and transmission"],
        correct: 3, difficulty: 5
      },
      {
        id: "AS069",
        text: "Compared to an open-end wrench, a box-end wrench is less likely to slip because it:",
        options: ["has longer handles for more leverage", "completely surrounds the head of the fastener", "grips only two flats of the fastener", "is made of softer steel that molds to the bolt"],
        correct: 1, difficulty: 2
      },
      {
        id: "AS070",
        text: "The main advantage of a socket wrench with a ratchet handle is that it:",
        options: ["can turn a fastener without being lifted off and repositioned", "fits both metric and SAE fasteners with one socket", "automatically limits torque to prevent overtightening", "works on damaged or rounded fastener heads"],
        correct: 0, difficulty: 2
      },
      {
        id: "AS071",
        text: "An Allen wrench is designed to turn fasteners that have:",
        options: ["a slotted head", "a square recess in the head", "a hexagonal recess in the head", "a cross-shaped recess in the head"],
        correct: 2, difficulty: 1
      },
      {
        id: "AS072",
        text: "Needle-nose pliers are best suited for:",
        options: ["gripping large pipes and round stock", "cutting heavy-gauge bolts", "clamping parts together while glue dries", "gripping and bending small wires in confined spaces"],
        correct: 3, difficulty: 1
      },
      {
        id: "AS073",
        text: "Channel-lock (tongue-and-groove) pliers are useful because their jaws:",
        options: ["lock closed and stay clamped by themselves", "adjust to several widths to grip different-sized objects", "are insulated for electrical work", "cut through hardened steel wire"],
        correct: 1, difficulty: 2
      },
      {
        id: "AS074",
        text: "What feature distinguishes vise-grip (locking) pliers from ordinary pliers?",
        options: ["They clamp onto the work and stay locked without hand pressure", "They have replaceable cutting blades", "Their jaws are made of plastic to prevent marring", "They can measure the diameter of the object gripped"],
        correct: 0, difficulty: 3
      },
      {
        id: "AS075",
        text: "A rip saw is designed to cut wood:",
        options: ["across the grain", "at a 45-degree miter angle", "along the direction of the grain", "in tight curves and circles"],
        correct: 2, difficulty: 3
      },
      {
        id: "AS076",
        text: "Which saw is best for cutting intricate curves and shapes in thin wood, such as molding?",
        options: ["Rip saw", "Coping saw", "Hacksaw", "Crosscut saw"],
        correct: 1, difficulty: 3
      },
      {
        id: "AS077",
        text: "A miter box is used with a saw to:",
        options: ["hold round stock while it is cut lengthwise", "keep the blade cool during long cuts", "sharpen the saw teeth at the correct angle", "guide the blade for accurate angle cuts, such as 45 degrees"],
        correct: 3, difficulty: 4
      },
      {
        id: "AS078",
        text: "A hand plane is used primarily to:",
        options: ["shave thin layers from a wood surface to smooth or flatten it", "bore clean holes through hardwood", "drive chisels with controlled blows", "scrape rust and paint from metal"],
        correct: 0, difficulty: 2
      },
      {
        id: "AS079",
        text: "A countersink bit is used to:",
        options: ["enlarge a hole to its final diameter", "cut internal threads in a drilled hole", "cut a cone-shaped recess so a screw head sits flush with the surface", "drill pilot holes in masonry"],
        correct: 2, difficulty: 4
      },
      {
        id: "AS080",
        text: "A cold chisel is designed to cut or shear:",
        options: ["wood joints and mortises", "unheated metal, such as rivet heads and rusted bolts", "brick and concrete block", "plastic pipe and tubing"],
        correct: 1, difficulty: 3
      },
      {
        id: "AS081",
        text: "The main difference between a bolt and a screw is that a bolt is normally:",
        options: ["threaded along its entire length", "made of harder steel than any screw", "turned into a hole it cuts itself", "inserted through parts and tightened with a nut"],
        correct: 3, difficulty: 3
      },
      {
        id: "AS082",
        text: "A stud differs from a common bolt in that a stud:",
        options: ["has threads on both ends but no head", "is always shorter than one inch", "cannot accept a nut", "has left-hand threads on both ends"],
        correct: 0, difficulty: 4
      },
      {
        id: "AS083",
        text: "Compared to a flat washer, the main purpose of a lock washer is to:",
        options: ["spread the clamping load over a wider area", "prevent the nut or bolt from loosening under vibration", "seal the joint against water and oil", "insulate the fastener electrically"],
        correct: 1, difficulty: 3
      },
      {
        id: "AS084",
        text: "The thread pitch of a metric fastener is the:",
        options: ["diameter of the bolt shank", "depth of each thread groove", "distance from one thread to the next", "total number of threads on the bolt"],
        correct: 2, difficulty: 4
      },
      {
        id: "AS085",
        text: "Rivets are best described as fasteners that:",
        options: ["permanently join parts and must be drilled out to remove", "can be unscrewed and reused many times", "hold parts by spring tension only", "melt to form a bond between two metals"],
        correct: 0, difficulty: 2
      },
      {
        id: "AS086",
        text: "What is the key difference between welding and brazing?",
        options: ["Brazing produces a stronger joint than welding in all cases", "Welding works only on aluminum, while brazing works only on steel", "Welding requires no heat, while brazing does", "Welding melts and fuses the base metals, while brazing melts only a filler metal"],
        correct: 3, difficulty: 5
      },
      {
        id: "AS087",
        text: "A castellated (castle) nut is designed to be secured with a:",
        options: ["second jam nut tightened against it", "cotter pin passed through slots in the nut and a hole in the bolt", "drop of thread-locking adhesive", "lock washer placed under the nut"],
        correct: 1, difficulty: 5
      },
      {
        id: "AS088",
        text: "Screws generally hold better than nails in wood because screws:",
        options: ["grip the wood fibers with their threads", "are always longer than nails", "are driven in faster than nails", "compress the wood less when installed"],
        correct: 0, difficulty: 1
      },
      {
        id: "AS089",
        text: "Which tool is used to measure the small clearance between two parts, such as a spark plug gap?",
        options: ["Dial caliper", "Feeler gauge", "Depth micrometer", "Steel rule"],
        correct: 1, difficulty: 1
      },
      {
        id: "AS090",
        text: "On a standard tape measure, the smallest markings on the inch scale usually divide each inch into 16 parts. Each of these smallest divisions equals:",
        options: ["1/8 inch", "1/32 inch", "1/16 inch", "1/10 inch"],
        correct: 2, difficulty: 1
      },
      {
        id: "AS091",
        text: "A vernier caliper can typically take which measurements?",
        options: ["Outside, inside, and depth measurements", "Outside measurements only", "Angles and tapers", "Surface flatness"],
        correct: 0, difficulty: 2
      },
      {
        id: "AS092",
        text: "Which of the following metals is ferrous?",
        options: ["Aluminum", "Brass", "Copper", "Steel"],
        correct: 3, difficulty: 2
      },
      {
        id: "AS093",
        text: "What is the main purpose of drilling a pilot hole before driving a wood screw?",
        options: ["To keep the wood from splitting and guide the screw", "To make the screw hold more tightly", "To countersink the screw head", "To harden the surrounding wood fibers"],
        correct: 0, difficulty: 2
      },
      {
        id: "AS094",
        text: "Annealing is a heat-treatment process used to:",
        options: ["Increase the hardness of steel", "Add a rust-resistant coating", "Soften metal and relieve internal stresses", "Bond two metals together"],
        correct: 2, difficulty: 3
      },
      {
        id: "AS095",
        text: "After steel has been hardened by quenching, it is usually tempered in order to:",
        options: ["Make it even harder", "Reduce brittleness while keeping most of the hardness", "Restore it to its fully soft condition", "Increase its electrical conductivity"],
        correct: 1, difficulty: 3
      },
      {
        id: "AS096",
        text: "Which tool is used to cut external threads on the outside of a metal rod?",
        options: ["Tap", "Reamer", "Broach", "Die"],
        correct: 3, difficulty: 3
      },
      {
        id: "AS097",
        text: "A machinist checking a rotating shaft for runout would most likely use a:",
        options: ["Dial indicator", "Feeler gauge", "Combination square", "Torque wrench"],
        correct: 0, difficulty: 3
      },
      {
        id: "AS098",
        text: "Brass is an alloy made primarily of:",
        options: ["Copper and tin", "Iron and carbon", "Copper and zinc", "Aluminum and magnesium"],
        correct: 2, difficulty: 4
      },
      {
        id: "AS099",
        text: "Before mounting a new wheel on a bench grinder, you should tap it lightly and listen for a clear ring. This ring test is done to:",
        options: ["Check that the wheel is properly balanced", "Detect cracks that could make the wheel shatter at speed", "Confirm the abrasive grit size is correct", "Measure the hardness of the bonding material"],
        correct: 1, difficulty: 4
      },
      {
        id: "AS100",
        text: "A shop attempts to harden a piece of low-carbon steel by heating it red hot and quenching it in water, but the part remains relatively soft. The most likely reason is that:",
        options: ["The water was too cold to quench properly", "Quenching only works on non-ferrous metals", "The part was heated for too short a time", "The steel does not contain enough carbon to harden significantly"],
        correct: 3, difficulty: 5
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
        correct: 1, difficulty: 1
      },
      {
        id: "MC002",
        text: "Which class of lever has the fulcrum between the effort and the load?",
        options: ["First class", "Second class", "Third class", "Fourth class"],
        correct: 0, difficulty: 2
      },
      {
        id: "MC003",
        text: "A pulley system with 4 supporting ropes provides a mechanical advantage of:",
        options: ["2", "4", "8", "16"],
        correct: 1, difficulty: 2
      },
      {
        id: "MC004",
        text: "As the cross-sectional area of a pipe decreases, what happens to fluid velocity?",
        options: ["Decreases", "Stays the same", "Increases", "Stops flowing"],
        correct: 2, difficulty: 3
      },
      {
        id: "MC005",
        text: "A lever arm that is longer requires:",
        options: ["More force", "Less force", "Same force", "No force"],
        correct: 1, difficulty: 1
      },
      {
        id: "MC006",
        text: "What type of simple machine is a doorknob?",
        options: ["Lever", "Pulley", "Wheel and axle", "Inclined plane"],
        correct: 2, difficulty: 2
      },
      {
        id: "MC007",
        text: "If a 20-tooth gear drives a 40-tooth gear, the output speed will be:",
        options: ["Doubled", "Halved", "Same", "Quadrupled"],
        correct: 1, difficulty: 2
      },
      {
        id: "MC008",
        text: "What happens to pressure when the same force is applied over a larger area?",
        options: ["Increases", "Decreases", "Stays the same", "Becomes zero"],
        correct: 1, difficulty: 2
      },
      {
        id: "MC009",
        text: "A ramp is an example of which simple machine?",
        options: ["Lever", "Pulley", "Inclined plane", "Screw"],
        correct: 2, difficulty: 1
      },
      {
        id: "MC010",
        text: "In a hydraulic system, pressure is:",
        options: ["Greatest near the pump", "Transmitted equally in all directions", "Greatest at the outlet", "Variable throughout"],
        correct: 1, difficulty: 3
      },
      {
        id: "MC011",
        text: "A screw is a type of:",
        options: ["Lever", "Inclined plane wrapped around a cylinder", "Pulley", "Wheel and axle"],
        correct: 1, difficulty: 3
      },
      {
        id: "MC012",
        text: "The center of gravity of an object is the point where:",
        options: ["It is heaviest", "All weight appears to concentrate", "It is lightest", "It cannot balance"],
        correct: 1, difficulty: 2
      },
      {
        id: "MC013",
        text: "A wheelbarrow is an example of which class lever?",
        options: ["First class", "Second class", "Third class", "Not a lever"],
        correct: 1, difficulty: 2
      },
      {
        id: "MC014",
        text: "If a force of 10 N is applied to a surface area of 2 m², what is the pressure?",
        options: ["20 Pa", "5 Pa", "12 Pa", "8 Pa"],
        correct: 1, difficulty: 2
      },
      {
        id: "MC015",
        text: "Belt drives are used to:",
        options: ["Increase friction", "Transfer rotational motion", "Create heat", "Store energy"],
        correct: 1, difficulty: 1
      },
      {
        id: "MC016",
        text: "What happens to an object's potential energy as it is raised higher?",
        options: ["Decreases", "Stays the same", "Increases", "Becomes kinetic"],
        correct: 2, difficulty: 1
      },
      {
        id: "MC017",
        text: "A block and tackle with 3 pulleys provides a mechanical advantage of approximately:",
        options: ["1", "2", "3", "6"],
        correct: 2, difficulty: 2
      },
      {
        id: "MC018",
        text: "Friction between two surfaces generally:",
        options: ["Increases motion", "Opposes motion", "Has no effect", "Creates energy"],
        correct: 1, difficulty: 1
      },
      {
        id: "MC019",
        text: "In a gear train, the gear attached to the power source is called the:",
        options: ["Driven gear", "Idler gear", "Driver gear", "Output gear"],
        correct: 2, difficulty: 2
      },
      {
        id: "MC020",
        text: "What force keeps an object moving in a circle?",
        options: ["Gravity", "Centripetal force", "Friction", "Thrust"],
        correct: 1, difficulty: 2
      },
      {
        id: "MC021",
        text: "A wedge is a combination of:",
        options: ["Two levers", "Two inclined planes", "A pulley and lever", "A wheel and screw"],
        correct: 1, difficulty: 2
      },
      {
        id: "MC022",
        text: "Water pressure at the bottom of a tank is determined by the:",
        options: ["Tank width", "Water depth", "Tank material", "Water temperature"],
        correct: 1, difficulty: 2
      },
      {
        id: "MC023",
        text: "If you double the speed of an object, its kinetic energy:",
        options: ["Doubles", "Triples", "Quadruples", "Stays the same"],
        correct: 2, difficulty: 3
      },
      {
        id: "MC024",
        text: "A cam converts:",
        options: ["Linear motion to rotary motion", "Rotary motion to linear motion", "Energy to mass", "Heat to motion"],
        correct: 1, difficulty: 3
      },
      {
        id: "MC025",
        text: "Torque is calculated by multiplying force by:",
        options: ["Velocity", "Distance from pivot", "Mass", "Time"],
        correct: 1, difficulty: 2
      },
      {
        id: "MC026",
        text: "An object floats when its density is:",
        options: ["Greater than the fluid", "Equal to the fluid", "Less than the fluid", "Zero"],
        correct: 2, difficulty: 2
      },
      {
        id: "MC027",
        text: "Springs store energy in which form?",
        options: ["Kinetic", "Thermal", "Potential", "Chemical"],
        correct: 2, difficulty: 1
      },
      {
        id: "MC028",
        text: "A crank converts:",
        options: ["Linear to rotary motion", "Rotary to linear motion", "Either direction", "Neither"],
        correct: 2, difficulty: 2
      },
      {
        id: "MC029",
        text: "Ball bearings reduce:",
        options: ["Speed", "Power", "Friction", "Torque"],
        correct: 2, difficulty: 1
      },
      {
        id: "MC030",
        text: "The fulcrum of a pair of scissors is located:",
        options: ["At the tips", "At the pivot point", "On the handles", "There is no fulcrum"],
        correct: 1, difficulty: 1
      },
      {
        id: "MC031",
        text: "Mechanical advantage is the ratio of:",
        options: ["Input to output speed", "Output force to input force", "Weight to mass", "Distance to time"],
        correct: 1, difficulty: 2
      },
      {
        id: "MC032",
        text: "A worm gear system provides:",
        options: ["High speed, low torque", "Low speed, high torque", "Equal speed and torque", "Variable output"],
        correct: 1, difficulty: 3
      },
      {
        id: "MC033",
        text: "In a vacuum, all objects fall at:",
        options: ["Different rates based on mass", "The same rate", "Different rates based on shape", "No rate (they float)"],
        correct: 1, difficulty: 2
      },
      {
        id: "MC034",
        text: "A flywheel is used to:",
        options: ["Start engines", "Store rotational energy", "Reduce speed", "Increase friction"],
        correct: 1, difficulty: 2
      },
      {
        id: "MC035",
        text: "Pneumatic systems use what medium to transmit force?",
        options: ["Oil", "Electricity", "Compressed air", "Water"],
        correct: 2, difficulty: 2
      },
      {
        id: "MC036",
        text: "A toolbox sits on the bed of a pickup truck. When the driver brakes hard, the toolbox slides toward the front of the truck. What best explains this?",
        options: ["The brakes push the toolbox forward", "Gravity pulls the toolbox toward the cab", "The toolbox tends to keep moving forward due to inertia", "Air pressure builds up behind the toolbox"],
        correct: 2, difficulty: 1
      },
      {
        id: "MC037",
        text: "Two movers push on a crate. One pushes with 300 N to the right and the other pushes with 200 N to the left. What is the net force on the crate?",
        options: ["100 N to the right", "500 N to the right", "100 N to the left", "0 N"],
        correct: 0, difficulty: 2
      },
      {
        id: "MC038",
        text: "An astronaut travels from Earth to the Moon, where gravity is weaker. Compared to on Earth, on the Moon the astronaut has:",
        options: ["less mass and less weight", "the same mass but less weight", "the same mass and the same weight", "less mass but the same weight"],
        correct: 1, difficulty: 1
      },
      {
        id: "MC039",
        text: "A swimmer pushes backward against the pool wall with her feet and glides forward. According to Newton's third law, what force propels her forward?",
        options: ["The buoyant force of the water", "Her own muscular force acting on her body", "Friction between her feet and the wall", "The wall pushing forward on her feet"],
        correct: 3, difficulty: 2
      },
      {
        id: "MC040",
        text: "A soldier finds it takes a hard shove to get a heavy footlocker sliding across the floor, but once it is moving, a smaller push keeps it going. Why?",
        options: ["Static friction is greater than kinetic friction", "Kinetic friction is greater than static friction", "The footlocker loses weight once it starts moving", "The normal force decreases while the footlocker moves"],
        correct: 0, difficulty: 3
      },
      {
        id: "MC041",
        text: "A 40 N toolbox rests on a level workbench. What is the normal force the bench exerts on the toolbox?",
        options: ["0 N", "20 N upward", "40 N upward", "40 N downward"],
        correct: 2, difficulty: 1
      },
      {
        id: "MC042",
        text: "A 20 N lantern hangs motionless from a single rope attached to the ceiling. What is the tension in the rope?",
        options: ["10 N", "20 N", "40 N", "0 N"],
        correct: 1, difficulty: 2
      },
      {
        id: "MC043",
        text: "A cargo truck travels down a straight, level highway at a constant 55 miles per hour. What can you conclude about the net force acting on the truck?",
        options: ["It points forward, in the direction of motion", "It points backward, opposing the motion", "It equals the truck's weight", "It is zero"],
        correct: 3, difficulty: 3
      },
      {
        id: "MC044",
        text: "A mechanic pushes a 10 kg cart with a net force of 20 N. What is the cart's acceleration?",
        options: ["2 meters per second squared", "200 meters per second squared", "0.5 meters per second squared", "30 meters per second squared"],
        correct: 0, difficulty: 3
      },
      {
        id: "MC045",
        text: "Two tow cables pull on a stuck vehicle at right angles to each other, one with 30 N and the other with 40 N. What is the magnitude of the combined force on the vehicle?",
        options: ["70 N", "50 N", "35 N", "10 N"],
        correct: 1, difficulty: 5
      },
      {
        id: "MC046",
        text: "Two convoy trucks each travel at a steady 45 miles per hour, but one heads north and the other heads east. Which statement is correct?",
        options: ["They have the same velocity but different speeds", "They have the same speed and the same velocity", "They have different speeds and different velocities", "They have the same speed but different velocities"],
        correct: 3, difficulty: 2
      },
      {
        id: "MC047",
        text: "A motorcycle speeds up from 20 meters per second to 30 meters per second in 5 seconds. What is its average acceleration?",
        options: ["10 meters per second squared", "6 meters per second squared", "2 meters per second squared", "50 meters per second squared"],
        correct: 2, difficulty: 2
      },
      {
        id: "MC048",
        text: "A roller coaster car is released from the top of the first hill and rolls to the bottom. Ignoring friction, where is its kinetic energy greatest and its potential energy least?",
        options: ["At the bottom of the hill", "At the top of the hill", "Exactly halfway down the hill", "Kinetic and potential energy stay constant the whole way"],
        correct: 0, difficulty: 4
      },
      {
        id: "MC049",
        text: "A wrecking ball swings back and forth on a cable like a pendulum. Ignoring air resistance, at what point in the swing is the ball moving fastest?",
        options: ["At the highest point of the swing", "At the lowest point of the swing", "Halfway between the highest and lowest points", "Its speed is the same everywhere in the swing"],
        correct: 1, difficulty: 3
      },
      {
        id: "MC050",
        text: "A supply clerk lifts a 60 N ammo can straight up 2 m onto a shelf, then carries it 10 m down a level hallway at constant height. How much work does the clerk do against gravity?",
        options: ["600 J", "720 J", "120 J", "620 J"],
        correct: 2, difficulty: 4
      },
      {
        id: "MC051",
        text: "In the scientific sense, which of these people is doing mechanical work on the object mentioned?",
        options: ["A guard standing still while holding a rifle", "A student leaning against a wall that does not move", "A clerk holding a box steady at waist height", "A soldier dragging a duffel bag across the floor"],
        correct: 3, difficulty: 3
      },
      {
        id: "MC052",
        text: "A hoist does 300 J of work raising an engine block in 6 seconds. What is the power output of the hoist?",
        options: ["1800 W", "50 W", "300 W", "6 W"],
        correct: 1, difficulty: 3
      },
      {
        id: "MC053",
        text: "A 1000 kg truck moves at 5 meters per second, and a 500 kg car moves at 12 meters per second. Which vehicle has more momentum?",
        options: ["The car, because its momentum is 6000 kg x m/s versus 5000 kg x m/s", "The truck, because it has twice the mass", "They have equal momentum", "Neither has momentum unless it is accelerating"],
        correct: 0, difficulty: 4
      },
      {
        id: "MC054",
        text: "Two soldiers each carry an identical 200 N pack up the same flight of stairs. One takes 10 seconds and the other takes 20 seconds. Which statement is true?",
        options: ["The faster soldier does twice the work", "The slower soldier develops more power", "They do the same work, but the faster soldier develops more power", "They develop the same power, but the faster soldier does less work"],
        correct: 2, difficulty: 4
      },
      {
        id: "MC055",
        text: "Identical crates slide from the same height to the floor down two frictionless ramps, one steep and one shallow. How do their speeds compare at the bottom?",
        options: ["The crate on the steep ramp arrives moving faster", "The crate on the shallow ramp arrives moving faster", "Neither crate gains any speed without friction", "Both crates arrive at the same speed"],
        correct: 3, difficulty: 5
      },
      {
        id: "MC056",
        text: "A soldier uses a crowbar to pry the lid off a supply crate. The distance from the pivot point to his hands is 60 inches, and the distance from the pivot to the lid is 5 inches. What is the mechanical advantage of the crowbar?",
        options: ["5", "55", "12", "65"],
        correct: 2, difficulty: 2
      },
      {
        id: "MC057",
        text: "A 120-pound child sits 6 feet from the center pivot of a seesaw. How far from the pivot must an 80-pound child sit on the other side to balance it?",
        options: ["6 feet", "9 feet", "4 feet", "8 feet"],
        correct: 1, difficulty: 3
      },
      {
        id: "MC058",
        text: "When sweeping with a broom, your top hand stays fixed as a pivot while your lower hand pushes the handle, and the broom head moves along the floor. Because the effort is applied between the fulcrum and the load, a broom used this way is a:",
        options: ["First-class lever", "Second-class lever", "Wheel and axle", "Third-class lever"],
        correct: 3, difficulty: 3
      },
      {
        id: "MC059",
        text: "A mechanic uses a pry bar to lift a 200-pound engine block. The load sits 1 foot from the fulcrum and the mechanic pushes 4 feet from the fulcrum. Ignoring the bar's weight, how much force must the mechanic apply?",
        options: ["50 pounds", "200 pounds", "100 pounds", "800 pounds"],
        correct: 0, difficulty: 2
      },
      {
        id: "MC060",
        text: "A loading ramp is 12 feet long and rises 3 feet to the bed of a truck. Ignoring friction, how much force is needed to push a 400-pound barrel up the ramp?",
        options: ["400 pounds", "33 pounds", "100 pounds", "133 pounds"],
        correct: 2, difficulty: 3
      },
      {
        id: "MC061",
        text: "A carpenter has two steel wedges of the same width for splitting logs. Compared to a short, blunt wedge, a longer and thinner wedge will:",
        options: ["Require more driving force", "Require less driving force", "Split the log with fewer hammer blows regardless of force", "Provide no mechanical advantage"],
        correct: 1, difficulty: 1
      },
      {
        id: "MC062",
        text: "A well uses a windlass: a crank handle turns in a circle with a 10-inch radius, winding rope around an axle with a 2-inch radius. What force on the handle is needed to raise a 150-pound bucket of water?",
        options: ["30 pounds", "75 pounds", "150 pounds", "15 pounds"],
        correct: 0, difficulty: 4
      },
      {
        id: "MC063",
        text: "A fishing rod has a mechanical advantage of less than 1, meaning the angler must apply more force than the weight of the fish. Why is this design still useful?",
        options: ["It reduces the total work needed to land the fish", "It changes the direction of the applied force", "It multiplies the angler's force at the tip", "It moves the rod tip faster and farther than the angler's hand moves"],
        correct: 3, difficulty: 4
      },
      {
        id: "MC064",
        text: "A single fixed pulley is mounted at the top of a flagpole to raise the flag. What advantage does this pulley provide?",
        options: ["It doubles the lifting force", "It changes the direction of the pull, letting you pull down to lift the flag up", "It cuts the rope distance pulled in half", "It reduces the work required to raise the flag"],
        correct: 1, difficulty: 1
      },
      {
        id: "MC065",
        text: "A rigger attaches a single movable pulley to a 100-pound crate, runs the rope up over an anchor point, and pulls. Ignoring friction, how much force must the rigger apply to lift the crate?",
        options: ["100 pounds", "25 pounds", "50 pounds", "200 pounds"],
        correct: 2, difficulty: 2
      },
      {
        id: "MC066",
        text: "A mechanic hoists a 500-pound engine using a block and tackle in which 5 rope strands support the movable block. Ignoring friction, how much force must the mechanic pull with?",
        options: ["100 pounds", "500 pounds", "125 pounds", "250 pounds"],
        correct: 0, difficulty: 2
      },
      {
        id: "MC067",
        text: "A pulley system has a mechanical advantage of 4. To raise a pallet of gear 3 feet, how much rope must be pulled through the system?",
        options: ["3 feet", "4 feet", "7 feet", "12 feet"],
        correct: 3, difficulty: 3
      },
      {
        id: "MC068",
        text: "A mechanic wants to lift an engine with half the force of its weight while pulling the rope downward toward the shop floor. Which setup accomplishes both goals?",
        options: ["A single fixed pulley on the ceiling", "A single movable pulley on the engine with the rope pulled straight up", "A movable pulley on the engine plus a fixed pulley on the ceiling", "Two fixed pulleys on the ceiling"],
        correct: 2, difficulty: 4
      },
      {
        id: "MC069",
        text: "A block and tackle has an ideal mechanical advantage of 4, but because of friction a rigger must pull with 125 pounds to lift a 400-pound load. What is the efficiency of the system?",
        options: ["100 percent", "80 percent", "75 percent", "31 percent"],
        correct: 1, difficulty: 4
      },
      {
        id: "MC070",
        text: "A rigger is counting rope strands to find the mechanical advantage of a block and tackle. Which strand should NOT be counted?",
        options: ["The free end pulled downward off the fixed upper block", "Any strand attached to the movable block", "Any strand passing under a sheave in the movable block", "The strand tied off to the movable block's hook"],
        correct: 0, difficulty: 3
      },
      {
        id: "MC071",
        text: "A block and tackle with 4 supporting strands is only 75 percent efficient because of friction. How much force is actually needed to lift a 600-pound engine?",
        options: ["150 pounds", "450 pounds", "112 pounds", "200 pounds"],
        correct: 3, difficulty: 5
      },
      {
        id: "MC072",
        text: "A sailor lifts a 240-pound crate by pulling with only 40 pounds of force on a frictionless block and tackle. How many rope strands must be supporting the movable block?",
        options: ["4", "6", "8", "5"],
        correct: 1, difficulty: 3
      },
      {
        id: "MC073",
        text: "A 12-tooth gear on a motor shaft meshes directly with a 36-tooth gear on an output shaft. Compared to the motor shaft, the output shaft turns:",
        options: ["Three times as fast, with one-third the torque", "At the same speed, with three times the torque", "One-third as fast, with three times the torque", "One-third as fast, with one-third the torque"],
        correct: 2, difficulty: 2
      },
      {
        id: "MC074",
        text: "Three gears are meshed in a row: Gear A drives Gear B, and Gear B drives Gear C. If Gear A rotates clockwise, Gear C rotates:",
        options: ["Clockwise", "Counterclockwise", "In alternating directions", "It depends on the tooth counts of the gears"],
        correct: 0, difficulty: 2
      },
      {
        id: "MC075",
        text: "A 20-tooth gear turning at 120 RPM drives a 60-tooth gear. How fast does the 60-tooth gear turn?",
        options: ["360 RPM", "40 RPM", "60 RPM", "20 RPM"],
        correct: 1, difficulty: 3
      },
      {
        id: "MC076",
        text: "A belt connects a 4-inch diameter pulley on a motor to an 8-inch diameter pulley on a fan. If the motor pulley spins at 400 RPM, the fan pulley spins at:",
        options: ["800 RPM", "400 RPM", "100 RPM", "200 RPM"],
        correct: 3, difficulty: 3
      },
      {
        id: "MC077",
        text: "On a bicycle, a 48-tooth chainring at the pedals is connected by a chain to a 16-tooth sprocket on the rear wheel. For each full turn of the pedals, the rear wheel makes:",
        options: ["3 turns", "One-third of a turn", "16 turns", "1 turn"],
        correct: 0, difficulty: 3
      },
      {
        id: "MC078",
        text: "In an engine, a rotating cam pushes against a follower that opens a valve. What determines how far and when the follower rises?",
        options: ["The weight of the follower", "The speed of the camshaft only", "The shape of the cam lobe", "The strength of the valve spring"],
        correct: 2, difficulty: 2
      },
      {
        id: "MC079",
        text: "A mechanic applies a 25-pound force at the end of a wrench handle 2 feet from the center of a bolt, pulling at a right angle to the handle. How much torque is applied to the bolt?",
        options: ["12.5 pound-feet", "50 pound-feet", "27 pound-feet", "25 pound-feet"],
        correct: 1, difficulty: 1
      },
      {
        id: "MC080",
        text: "In a two-stage gear train, a 12-tooth gear drives a 36-tooth gear. On the same shaft as the 36-tooth gear is a 15-tooth gear, which drives a 45-tooth output gear. If the input shaft turns at 900 RPM, the output gear turns at:",
        options: ["300 RPM", "450 RPM", "225 RPM", "100 RPM"],
        correct: 3, difficulty: 4
      },
      {
        id: "MC081",
        text: "A mechanic cannot loosen a rusted bolt with a wrench, so he slips a length of pipe over the wrench handle to extend it and pulls with the same force at the end of the pipe. This works because the pipe:",
        options: ["Increases the lever arm, so the same force produces more torque", "Increases the force he applies to the handle", "Reduces the friction between the bolt and its threads", "Changes the direction of the applied force"],
        correct: 0, difficulty: 4
      },
      {
        id: "MC082",
        text: "A spring stretches 1 inch when a 5-pound weight is hung from it. According to Hooke's law, if a 10-pound weight is hung instead, the spring will stretch about:",
        options: ["1 inch", "2 inches", "4 inches", "Half an inch"],
        correct: 1, difficulty: 2
      },
      {
        id: "MC083",
        text: "Two identical springs are connected end to end (in series), and a weight is hung from the bottom spring. Compared to hanging the same weight from just one of the springs, the total stretch is:",
        options: ["Half as much, because the springs share the load", "The same, because the weight has not changed", "Four times as much", "Twice as much, because each spring feels the full weight and stretches fully"],
        correct: 3, difficulty: 4
      },
      {
        id: "MC084",
        text: "Two steel plates are bolted together, and the plates are pulled in opposite directions so they try to slide past each other across the bolt. The bolt is primarily loaded in:",
        options: ["Tension", "Compression", "Shear", "Torsion"],
        correct: 2, difficulty: 3
      },
      {
        id: "MC085",
        text: "A wooden beam rests on supports at both ends, and a heavy load sits at the center. As the beam sags under the load, the bottom surface of the beam is in:",
        options: ["Tension, because it is being stretched", "Compression, because it is being squeezed", "Shear, because the layers slide apart", "No stress, because the supports carry the load"],
        correct: 0, difficulty: 3
      },
      {
        id: "MC086",
        text: "A cast iron bracket snaps suddenly under an overload without visibly bending first, while a steel bracket of the same size bends noticeably before it fails. The cast iron behaves this way because it is:",
        options: ["Ductile", "Brittle", "Elastic", "Corrosion resistant"],
        correct: 1, difficulty: 3
      },
      {
        id: "MC087",
        text: "Builders add diagonal braces to a rectangular gate frame, dividing it into triangles. Why are triangles used to stiffen structures?",
        options: ["Triangles weigh less than other shapes", "Triangles look more finished", "A triangle cannot change shape without changing the length of a side", "Triangles hold more material than rectangles"],
        correct: 2, difficulty: 1
      },
      {
        id: "MC088",
        text: "A 12-foot plank rests on a support at each end. A worker places a 300-pound crate 3 feet from the left support (9 feet from the right support). Which support carries more of the crate's weight?",
        options: ["The right support, because the plank tips toward it", "Both supports carry 150 pounds each", "Neither, because the plank carries the weight", "The left support, because the crate is closer to it"],
        correct: 3, difficulty: 4
      },
      {
        id: "MC089",
        text: "A single spring stretches 2 inches under a 10-pound load. Two of these identical springs are hung side by side (in parallel) and together support a 30-pound load shared equally. How far does each spring stretch?",
        options: ["6 inches", "3 inches", "2 inches", "1.5 inches"],
        correct: 1, difficulty: 5
      },
      {
        id: "MC090",
        text: "A mechanic presses down on the small piston of a closed hydraulic system. According to Pascal's principle, the pressure created is:",
        options: ["Felt only at the small piston", "Strongest at the bottom of the fluid and zero at the top", "Transmitted equally in all directions throughout the fluid", "Converted into heat before reaching the large piston"],
        correct: 2, difficulty: 1
      },
      {
        id: "MC091",
        text: "A hydraulic jack has an input piston with an area of 2 square inches and an output piston with an area of 20 square inches. If a worker pushes on the input piston with 50 pounds of force, how much force does the output piston deliver?",
        options: ["50 pounds", "500 pounds", "1,000 pounds", "5 pounds"],
        correct: 1, difficulty: 2
      },
      {
        id: "MC092",
        text: "A 120-pound toolbox rests on a bench, and its base contacts the bench over an area of 4 square inches. What pressure does the toolbox exert on the bench?",
        options: ["30 psi", "480 psi", "124 psi", "116 psi"],
        correct: 0, difficulty: 1
      },
      {
        id: "MC093",
        text: "Two open water tanks sit side by side. Tank A is narrow and 10 feet deep; Tank B is very wide but only 5 feet deep. Compared with the bottom of Tank B, the water pressure at the bottom of Tank A is:",
        options: ["Lower, because Tank A holds less total water", "The same, because both tanks are open to the air", "Lower, because pressure depends on tank width", "Higher, because pressure depends on the depth of the water"],
        correct: 3, difficulty: 2
      },
      {
        id: "MC094",
        text: "A solid steel bar sinks, yet a steel ship weighing thousands of tons floats. The ship floats because:",
        options: ["The paint and coatings on the hull are lighter than water", "Its hollow hull shape displaces a weight of water equal to the ship's weight", "Salt water pushes up harder on large objects than on small ones", "Moving through the water generates lift under the hull"],
        correct: 1, difficulty: 3
      },
      {
        id: "MC095",
        text: "A soldier uses a siphon hose to move fuel from a drum into a can sitting on the ground below it. Partway through, someone lifts the can up onto a table and the flow stops. Why?",
        options: ["The hose was not wide enough to keep the fuel moving", "Lifting the can heated the fuel and blocked the hose with vapor", "The outlet end was raised so it was no longer below the fuel level in the drum", "The fuel ran out of momentum after flowing for several minutes"],
        correct: 2, difficulty: 4
      },
      {
        id: "MC096",
        text: "Which type of pump moves fluid by trapping a fixed volume of liquid and then forcing that volume out with each cycle?",
        options: ["A positive displacement pump", "A centrifugal pump", "A venturi eductor", "A cooling fan"],
        correct: 0, difficulty: 3
      },
      {
        id: "MC097",
        text: "A machine designer must lift very heavy loads with precise, steady motion. She chooses a hydraulic system instead of a pneumatic one mainly because:",
        options: ["Compressed air is far more expensive than hydraulic oil", "Air transmits pressure in only one direction", "Hydraulic systems never leak", "Liquids are nearly incompressible, so the motion is firm and precise"],
        correct: 3, difficulty: 2
      },
      {
        id: "MC098",
        text: "In a hydraulic press, the input piston has an area of 2 square inches and the output piston has an area of 10 square inches. If the input piston is pushed down 10 inches, how far does the output piston rise?",
        options: ["10 inches", "2 inches", "50 inches", "5 inches"],
        correct: 1, difficulty: 4
      },
      {
        id: "MC099",
        text: "An empty raft weighs 200 pounds. To float while carrying a 300-pound load of gear, the raft must displace water weighing at least:",
        options: ["500 pounds", "300 pounds", "200 pounds", "100 pounds"],
        correct: 0, difficulty: 3
      },
      {
        id: "MC100",
        text: "A forklift is stable while its load sits near the ground. As the operator raises the same load high on the mast, the forklift becomes easier to tip over because:",
        options: ["The load gets heavier as it rises", "The tires lose air pressure under the shifting load", "The combined center of gravity rises, so a smaller lean moves it outside the wheelbase", "The hydraulic lift removes weight from the rear wheels only"],
        correct: 2, difficulty: 2
      },
      {
        id: "MC101",
        text: "During hard braking, a car with antilock brakes stops shorter on dry pavement than the same car with its wheels locked and skidding. The main reason is that:",
        options: ["Locked wheels make the car lighter on its tires", "Skidding tires melt and become perfectly smooth", "The antilock pump pushes the car backward", "Static friction between a rolling tire and the road is greater than the kinetic friction of a skidding tire"],
        correct: 3, difficulty: 3
      },
      {
        id: "MC102",
        text: "A technician packs grease into the wheel bearings of a trailer before a long haul. The main job of the grease is to:",
        options: ["Glue the bearing rollers firmly to the axle", "Keep a thin film between the moving metal surfaces, cutting friction, wear, and heat", "Add weight to the hub so the wheel spins more smoothly", "Soften the metal so the rollers can reshape themselves"],
        correct: 1, difficulty: 3
      },
      {
        id: "MC103",
        text: "A basement sump pump has a check valve installed in its vertical discharge pipe. What does this one-way valve accomplish?",
        options: ["It keeps the water in the pipe from draining back into the sump pit each time the pump shuts off", "It lets the operator adjust the pump's flow rate by hand", "It filters sand and grit out of the water before it leaves the pit", "It increases the water pressure produced by the pump"],
        correct: 0, difficulty: 4
      },
      {
        id: "MC104",
        text: "A machinist must install a metal collar so tightly on a shaft that it will not slip, without using bolts or welds. A common method is to heat the collar before sliding it onto the shaft because:",
        options: ["Heat softens the shaft so the collar can bite into it", "Hot metal becomes magnetic and clings to the shaft", "The heat burns off oil so glue will stick better", "The heated collar expands, slips over the shaft easily, then shrinks tight as it cools"],
        correct: 3, difficulty: 4
      },
      {
        id: "MC105",
        text: "A crane lifts a 2,000-pound load hanging 30 feet from its pivot point. A counterweight is mounted 10 feet from the pivot on the opposite side. Ignoring the crane's own weight, what is the minimum counterweight needed to keep the crane from tipping toward the load?",
        options: ["2,000 pounds", "667 pounds", "6,000 pounds", "60,000 pounds"],
        correct: 2, difficulty: 5
      }
    ],
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

  // Get questions by difficulty level
  getQuestionsByDifficulty: function(sectionCode, difficulty) {
    const questions = asvabData.questions[sectionCode];
    if (!questions) return [];
    return questions.filter(q => q.difficulty === difficulty);
  },

  // Get random questions for a section (non-adaptive fallback)
  getRandomQuestions: function(sectionCode, count) {
    const questions = asvabData.questions[sectionCode];
    if (!questions) return [];

    const numQuestions = count || asvabData.sections[sectionCode].questionsPerTest;
    const shuffled = this.shuffleArray(questions);
    return shuffled.slice(0, Math.min(numQuestions, shuffled.length));
  },

  // ADAPTIVE: Build initial question pool with difficulty distribution
  getAdaptiveQuestionPool: function(sectionCode, count) {
    const questions = asvabData.questions[sectionCode];
    if (!questions) return [];

    const numQuestions = count || asvabData.sections[sectionCode].questionsPerTest;

    // Group by difficulty
    const byDifficulty = {1: [], 2: [], 3: [], 4: [], 5: []};
    questions.forEach(q => {
      const diff = q.difficulty || 3;
      if (byDifficulty[diff]) byDifficulty[diff].push({...q});
    });

    // Shuffle each pool
    Object.keys(byDifficulty).forEach(d => {
      byDifficulty[d] = this.shuffleArray(byDifficulty[d]);
    });

    return { byDifficulty, numQuestions, sectionCode };
  },

  // ADAPTIVE: Select next question based on current ability estimate
  selectNextAdaptiveQuestion: function(pool, abilityLevel, usedIds) {
    // abilityLevel: 1-5 scale, starts at 3
    // Select from difficulty matching ability, +/- 1 level
    const targetDiffs = [abilityLevel];
    if (abilityLevel > 1) targetDiffs.push(abilityLevel - 1);
    if (abilityLevel < 5) targetDiffs.push(abilityLevel + 1);

    // Try target difficulties first
    for (const diff of targetDiffs) {
      const available = pool.byDifficulty[diff]?.filter(q => !usedIds.has(q.id));
      if (available && available.length > 0) {
        return available[0];
      }
    }

    // Fallback: any unused question
    for (let d = 1; d <= 5; d++) {
      const available = pool.byDifficulty[d]?.filter(q => !usedIds.has(q.id));
      if (available && available.length > 0) {
        return available[0];
      }
    }

    return null;
  },

  // Calculate new ability level based on answer
  updateAbilityLevel: function(currentLevel, wasCorrect, questionDifficulty) {
    // Simple IRT-like update
    if (wasCorrect) {
      // Correct answer: increase ability, more if question was hard
      if (questionDifficulty >= currentLevel) {
        return Math.min(5, currentLevel + 0.5);
      }
      return Math.min(5, currentLevel + 0.25);
    } else {
      // Wrong answer: decrease ability, more if question was easy
      if (questionDifficulty <= currentLevel) {
        return Math.max(1, currentLevel - 0.5);
      }
      return Math.max(1, currentLevel - 0.25);
    }
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
