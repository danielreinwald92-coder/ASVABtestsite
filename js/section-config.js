// ASVAB Section Metadata — single source of truth
// Per-section config (name, code, description, questionsPerTest, timeLimit, inAFQT)
// matching CAT-ASVAB (Computer Adaptive Test) structure.
// Consumed via window.SECTION_CONFIG (also exposed as asvabData.sections by quiz-data.js).
(function (global) {
  const SECTION_CONFIG = {
    GS: {
      name: "General Science",
      code: "GS",
      description: "Tests knowledge of physical, earth, and biological sciences",
      questionsPerTest: 15,
      timeLimit: 12 * 60, // 12 minutes
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
      timeLimit: 31 * 60, // 31 minutes
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
    }
  };

  global.SECTION_CONFIG = SECTION_CONFIG;
  global.asvabSections = SECTION_CONFIG;
})(typeof window !== 'undefined' ? window : this);
