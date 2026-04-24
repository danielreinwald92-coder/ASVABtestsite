// Assembling Objects Visual Questions
// SVG-based questions matching real ASVAB AO section format

const AOVisualQuestions = [
  // Type 1: Connector Questions - Connect point A to point B
  {
    id: "AOV001",
    type: "connector",
    difficulty: 2,
    prompt: "In the figure below, point A on the square should connect to point B on the circle. Which answer shows the correct connection?",
    shapes: {
      svg: `<svg viewBox="0 0 200 100" class="ao-question-svg">
        <rect x="20" y="25" width="50" height="50" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <circle cx="30" cy="50" r="4" fill="#d4a853"/>
        <text x="30" y="42" text-anchor="middle" font-size="10" fill="#d4a853" font-weight="bold">A</text>
        <circle cx="150" cy="50" r="25" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <circle cx="150" cy="75" r="4" fill="#d4a853"/>
        <text x="158" y="78" font-size="10" fill="#d4a853" font-weight="bold">B</text>
      </svg>`
    },
    options: [
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <rect x="25" y="25" width="30" height="30" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <circle cx="60" cy="60" r="15" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <circle cx="25" cy="40" r="3" fill="#d4a853"/>
        <circle cx="60" cy="75" r="3" fill="#d4a853"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <rect x="25" y="35" width="30" height="30" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <circle cx="70" cy="50" r="15" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <circle cx="25" cy="50" r="3" fill="#d4a853"/>
        <circle cx="70" cy="65" r="3" fill="#d4a853"/>
        <line x1="25" y1="50" x2="70" y2="65" stroke="#d4a853" stroke-width="1.5"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <rect x="35" y="35" width="30" height="30" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <circle cx="50" cy="50" r="20" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <rect x="20" y="20" width="30" height="30" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <circle cx="65" cy="65" r="15" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <circle cx="35" cy="50" r="3" fill="#d4a853"/>
        <circle cx="65" cy="50" r="3" fill="#d4a853"/>
        <line x1="35" y1="50" x2="65" y2="50" stroke="#d4a853" stroke-width="1.5"/>
      </svg>`
    ],
    correct: 1
  },
  {
    id: "AOV002",
    type: "connector",
    difficulty: 2,
    prompt: "Point A on the triangle connects to point B on the rectangle. Which shows the correct connection?",
    shapes: {
      svg: `<svg viewBox="0 0 200 100" class="ao-question-svg">
        <polygon points="40,75 65,25 90,75" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <circle cx="65" cy="25" r="4" fill="#d4a853"/>
        <text x="65" y="18" text-anchor="middle" font-size="10" fill="#d4a853" font-weight="bold">A</text>
        <rect x="120" y="30" width="60" height="40" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <circle cx="120" cy="50" r="4" fill="#d4a853"/>
        <text x="112" y="53" font-size="10" fill="#d4a853" font-weight="bold">B</text>
      </svg>`
    },
    options: [
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <polygon points="30,70 50,30 70,70" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <rect x="35" y="40" width="30" height="20" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <polygon points="20,80 40,40 60,80" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <rect x="50" y="35" width="35" height="25" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <circle cx="40" cy="40" r="3" fill="#d4a853"/>
        <circle cx="50" cy="48" r="3" fill="#d4a853"/>
        <line x1="40" y1="40" x2="50" y2="48" stroke="#d4a853" stroke-width="1.5"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <polygon points="50,20 70,60 30,60" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <rect x="25" y="65" width="50" height="20" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <polygon points="60,30 80,70 40,70" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <rect x="15" y="40" width="30" height="20" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <circle cx="60" cy="30" r="3" fill="#d4a853"/>
        <circle cx="15" cy="50" r="3" fill="#d4a853"/>
        <line x1="60" y1="30" x2="15" y2="50" stroke="#d4a853" stroke-width="1.5"/>
      </svg>`
    ],
    correct: 1
  },
  {
    id: "AOV003",
    type: "connector",
    difficulty: 3,
    prompt: "Point A on the pentagon connects to point B on the star. Which shows the correct connection?",
    shapes: {
      svg: `<svg viewBox="0 0 200 100" class="ao-question-svg">
        <polygon points="45,20 70,35 62,65 28,65 20,35" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <circle cx="62" cy="65" r="4" fill="#d4a853"/>
        <text x="70" y="68" font-size="10" fill="#d4a853" font-weight="bold">A</text>
        <polygon points="150,25 156,45 178,45 160,57 167,78 150,65 133,78 140,57 122,45 144,45" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <circle cx="133" cy="78" r="4" fill="#d4a853"/>
        <text x="125" y="85" font-size="10" fill="#d4a853" font-weight="bold">B</text>
      </svg>`
    },
    options: [
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <polygon points="30,25 45,35 40,55 20,55 15,35" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <polygon points="70,20 74,32 87,32 77,40 81,53 70,45 59,53 63,40 53,32 66,32" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <circle cx="40" cy="55" r="3" fill="#d4a853"/>
        <circle cx="59" cy="53" r="3" fill="#d4a853"/>
        <line x1="40" y1="55" x2="59" y2="53" stroke="#d4a853" stroke-width="1.5"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <polygon points="25,40 40,50 35,70 15,70 10,50" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <polygon points="70,30 74,42 87,42 77,50 81,63 70,55 59,63 63,50 53,42 66,42" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <polygon points="50,15 65,25 60,45 40,45 35,25" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <polygon points="50,55 54,67 67,67 57,75 61,88 50,80 39,88 43,75 33,67 46,67" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <circle cx="60" cy="45" r="3" fill="#d4a853"/>
        <circle cx="50" cy="55" r="3" fill="#d4a853"/>
        <line x1="60" y1="45" x2="50" y2="55" stroke="#d4a853" stroke-width="1.5"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <polygon points="70,30 85,40 80,60 60,60 55,40" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <polygon points="30,50 34,62 47,62 37,70 41,83 30,75 19,83 23,70 13,62 26,62" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`
    ],
    correct: 0
  },

  // Type 2: Puzzle Assembly Questions
  {
    id: "AOV004",
    type: "puzzle",
    difficulty: 2,
    prompt: "Which answer shows the pieces assembled into a complete square?",
    shapes: {
      svg: `<svg viewBox="0 0 200 100" class="ao-question-svg">
        <polygon points="20,30 50,30 20,60" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <polygon points="60,30 90,30 90,60" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <polygon points="100,60 130,60 130,30" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <polygon points="140,60 170,60 140,30" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`
    },
    options: [
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <rect x="25" y="25" width="50" height="50" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <line x1="25" y1="25" x2="75" y2="75" stroke="#1e3a5f" stroke-width="1" stroke-dasharray="3"/>
        <line x1="75" y1="25" x2="25" y2="75" stroke="#1e3a5f" stroke-width="1" stroke-dasharray="3"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <polygon points="25,50 50,25 75,50 50,75" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <polygon points="30,30 70,30 70,50 50,70 30,50" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <polygon points="25,35 50,25 75,35 75,65 50,75 25,65" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`
    ],
    correct: 0
  },
  {
    id: "AOV005",
    type: "puzzle",
    difficulty: 2,
    prompt: "Which answer shows these pieces forming a complete circle?",
    shapes: {
      svg: `<svg viewBox="0 0 200 100" class="ao-question-svg">
        <path d="M 30 50 A 20 20 0 0 1 70 50" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <path d="M 90 50 A 20 20 0 0 1 130 50" fill="none" stroke="#1e3a5f" stroke-width="2" transform="rotate(180 110 50)"/>
      </svg>`
    },
    options: [
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <ellipse cx="50" cy="50" rx="30" ry="20" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <circle cx="50" cy="50" r="25" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <line x1="50" y1="25" x2="50" y2="75" stroke="#1e3a5f" stroke-width="1" stroke-dasharray="3"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <path d="M 25 50 A 25 25 0 0 1 75 50" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <path d="M 75 55 A 25 25 0 0 1 25 55" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <rect x="30" y="30" width="40" height="40" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`
    ],
    correct: 1
  },
  {
    id: "AOV006",
    type: "puzzle",
    difficulty: 3,
    prompt: "Which answer shows the L-shaped pieces forming a complete rectangle?",
    shapes: {
      svg: `<svg viewBox="0 0 200 100" class="ao-question-svg">
        <polygon points="20,20 50,20 50,40 30,40 30,60 20,60" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <polygon points="70,40 100,40 100,60 80,60 80,80 70,80" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`
    },
    options: [
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <rect x="25" y="30" width="50" height="40" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <line x1="45" y1="30" x2="45" y2="70" stroke="#1e3a5f" stroke-width="1" stroke-dasharray="3"/>
        <line x1="25" y1="50" x2="75" y2="50" stroke="#1e3a5f" stroke-width="1" stroke-dasharray="3"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <polygon points="25,25 75,25 75,50 50,50 50,75 25,75" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <rect x="30" y="25" width="40" height="50" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <polygon points="25,35 50,25 75,35 75,65 50,75 25,65" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`
    ],
    correct: 0
  },
  {
    id: "AOV007",
    type: "connector",
    difficulty: 3,
    prompt: "Point A on the hexagon connects to point B on the oval. Which shows the correct connection?",
    shapes: {
      svg: `<svg viewBox="0 0 200 100" class="ao-question-svg">
        <polygon points="45,20 70,20 82,50 70,80 45,80 33,50" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <circle cx="82" cy="50" r="4" fill="#d4a853"/>
        <text x="90" y="53" font-size="10" fill="#d4a853" font-weight="bold">A</text>
        <ellipse cx="150" cy="50" rx="30" ry="20" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <circle cx="120" cy="50" r="4" fill="#d4a853"/>
        <text x="112" y="53" font-size="10" fill="#d4a853" font-weight="bold">B</text>
      </svg>`
    },
    options: [
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <polygon points="30,30 45,30 52,50 45,70 30,70 23,50" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <ellipse cx="70" cy="50" rx="18" ry="12" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <polygon points="25,35 40,35 47,50 40,65 25,65 18,50" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <ellipse cx="68" cy="50" rx="18" ry="12" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <circle cx="47" cy="50" r="3" fill="#d4a853"/>
        <circle cx="50" cy="50" r="3" fill="#d4a853"/>
        <line x1="47" y1="50" x2="50" y2="50" stroke="#d4a853" stroke-width="1.5"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <polygon points="55,25 70,25 77,45 70,65 55,65 48,45" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <ellipse cx="30" cy="60" rx="15" ry="10" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <polygon points="20,40 35,40 42,55 35,70 20,70 13,55" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <ellipse cx="65" cy="40" rx="20" ry="14" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <circle cx="42" cy="55" r="3" fill="#d4a853"/>
        <circle cx="45" cy="40" r="3" fill="#d4a853"/>
        <line x1="42" y1="55" x2="45" y2="40" stroke="#d4a853" stroke-width="1.5"/>
      </svg>`
    ],
    correct: 1
  },
  {
    id: "AOV008",
    type: "puzzle",
    difficulty: 3,
    prompt: "Which shows the triangular pieces assembled into a hexagon?",
    shapes: {
      svg: `<svg viewBox="0 0 250 100" class="ao-question-svg">
        <polygon points="20,50 35,25 50,50" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <polygon points="60,50 75,25 90,50" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <polygon points="100,50 115,25 130,50" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <polygon points="140,50 155,75 170,50" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <polygon points="180,50 195,75 210,50" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <polygon points="220,50 235,75 250,50" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`
    },
    options: [
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <polygon points="50,15 80,32 80,68 50,85 20,68 20,32" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <line x1="50" y1="15" x2="50" y2="50" stroke="#1e3a5f" stroke-width="1" stroke-dasharray="3"/>
        <line x1="80" y1="32" x2="50" y2="50" stroke="#1e3a5f" stroke-width="1" stroke-dasharray="3"/>
        <line x1="80" y1="68" x2="50" y2="50" stroke="#1e3a5f" stroke-width="1" stroke-dasharray="3"/>
        <line x1="50" y1="85" x2="50" y2="50" stroke="#1e3a5f" stroke-width="1" stroke-dasharray="3"/>
        <line x1="20" y1="68" x2="50" y2="50" stroke="#1e3a5f" stroke-width="1" stroke-dasharray="3"/>
        <line x1="20" y1="32" x2="50" y2="50" stroke="#1e3a5f" stroke-width="1" stroke-dasharray="3"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <polygon points="50,20 75,35 75,65 50,80 25,65 25,35" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <polygon points="50,20 85,50 50,80 15,50" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <circle cx="50" cy="50" r="30" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`
    ],
    correct: 0
  },
  {
    id: "AOV009",
    type: "connector",
    difficulty: 2,
    prompt: "Point A on the diamond connects to point B on the arrow. Which shows the correct connection?",
    shapes: {
      svg: `<svg viewBox="0 0 200 100" class="ao-question-svg">
        <polygon points="50,20 80,50 50,80 20,50" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <circle cx="80" cy="50" r="4" fill="#d4a853"/>
        <text x="88" y="53" font-size="10" fill="#d4a853" font-weight="bold">A</text>
        <polygon points="120,50 150,30 150,40 180,40 180,60 150,60 150,70" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <circle cx="120" cy="50" r="4" fill="#d4a853"/>
        <text x="112" y="53" font-size="10" fill="#d4a853" font-weight="bold">B</text>
      </svg>`
    },
    options: [
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <polygon points="35,30 50,50 35,70 20,50" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <polygon points="55,50 70,40 70,45 85,45 85,55 70,55 70,60" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <circle cx="50" cy="50" r="3" fill="#d4a853"/>
        <circle cx="55" cy="50" r="3" fill="#d4a853"/>
        <line x1="50" y1="50" x2="55" y2="50" stroke="#d4a853" stroke-width="1.5"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <polygon points="50,20 65,50 50,80 35,50" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <polygon points="50,50 65,40 65,45 80,45 80,55 65,55 65,60" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <polygon points="30,35 45,50 30,65 15,50" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <polygon points="60,50 75,35 75,42 90,42 90,58 75,58 75,65" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <polygon points="70,25 85,50 70,75 55,50" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <polygon points="15,50 30,40 30,45 45,45 45,55 30,55 30,60" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`
    ],
    correct: 0
  },
  {
    id: "AOV010",
    type: "puzzle",
    difficulty: 4,
    prompt: "Which shows these curved pieces forming a complete ring/donut shape?",
    shapes: {
      svg: `<svg viewBox="0 0 200 100" class="ao-question-svg">
        <path d="M 30 50 A 20 20 0 0 1 70 50 L 60 50 A 10 10 0 0 0 40 50 Z" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <path d="M 100 50 A 20 20 0 0 1 140 50 L 130 50 A 10 10 0 0 0 110 50 Z" fill="none" stroke="#1e3a5f" stroke-width="2" transform="rotate(180 120 50)"/>
      </svg>`
    },
    options: [
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <circle cx="50" cy="50" r="30" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <circle cx="50" cy="50" r="15" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <circle cx="50" cy="50" r="25" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <ellipse cx="50" cy="50" rx="35" ry="25" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <ellipse cx="50" cy="50" rx="15" ry="10" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <path d="M 25 50 A 25 25 0 0 1 75 50" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <path d="M 35 50 A 15 15 0 0 1 65 50" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`
    ],
    correct: 0
  },
  {
    id: "AOV011",
    type: "connector",
    difficulty: 4,
    prompt: "Point A on the crescent connects to point B on the cross. Which shows the correct connection?",
    shapes: {
      svg: `<svg viewBox="0 0 200 100" class="ao-question-svg">
        <path d="M 30 50 A 25 25 0 1 1 30 51 M 45 50 A 15 15 0 1 0 45 51" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <circle cx="55" cy="50" r="4" fill="#d4a853"/>
        <text x="63" y="53" font-size="10" fill="#d4a853" font-weight="bold">A</text>
        <polygon points="150,25 160,25 160,40 175,40 175,50 160,50 160,65 150,65 150,50 135,50 135,40 150,40" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <circle cx="135" cy="45" r="4" fill="#d4a853"/>
        <text x="127" y="48" font-size="10" fill="#d4a853" font-weight="bold">B</text>
      </svg>`
    },
    options: [
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <path d="M 20 50 A 18 18 0 1 1 20 51 M 30 50 A 10 10 0 1 0 30 51" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <polygon points="65,30 72,30 72,40 82,40 82,47 72,47 72,57 65,57 65,47 55,47 55,40 65,40" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <circle cx="38" cy="50" r="3" fill="#d4a853"/>
        <circle cx="55" cy="43" r="3" fill="#d4a853"/>
        <line x1="38" y1="50" x2="55" y2="43" stroke="#d4a853" stroke-width="1.5"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <path d="M 60 50 A 15 15 0 1 1 60 51 M 68 50 A 8 8 0 1 0 68 51" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <polygon points="25,35 32,35 32,45 42,45 42,52 32,52 32,62 25,62 25,52 15,52 15,45 25,45" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <path d="M 30 40 A 15 15 0 1 1 30 41 M 38 40 A 8 8 0 1 0 38 41" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <polygon points="65,40 72,40 72,50 82,50 82,57 72,57 72,67 65,67 65,57 55,57 55,50 65,50" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <path d="M 50 30 A 20 20 0 1 1 50 31 M 50 40 A 10 10 0 1 0 50 41" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <polygon points="50,60 55,60 55,70 65,70 65,75 55,75 55,85 50,85 50,75 40,75 40,70 50,70" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`
    ],
    correct: 0
  },
  {
    id: "AOV012",
    type: "puzzle",
    difficulty: 3,
    prompt: "Which shows the four pieces assembled into a complete cross/plus shape?",
    shapes: {
      svg: `<svg viewBox="0 0 220 100" class="ao-question-svg">
        <polygon points="20,30 40,30 40,50 20,50" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <polygon points="60,30 80,30 80,50 60,50" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <polygon points="100,40 120,40 110,60" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <polygon points="140,60 160,60 150,40" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <rect x="180" y="35" width="20" height="30" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`
    },
    options: [
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <polygon points="40,20 60,20 60,40 80,40 80,60 60,60 60,80 40,80 40,60 20,60 20,40 40,40" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <polygon points="35,25 65,25 65,35 75,35 75,65 65,65 65,75 35,75 35,65 25,65 25,35 35,35" fill="none" stroke="#1e3a5f" stroke-width="2"/>
        <line x1="50" y1="25" x2="50" y2="75" stroke="#1e3a5f" stroke-width="1" stroke-dasharray="3"/>
        <line x1="25" y1="50" x2="75" y2="50" stroke="#1e3a5f" stroke-width="1" stroke-dasharray="3"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <rect x="30" y="30" width="40" height="40" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`,
      `<svg viewBox="0 0 100 100" class="ao-option-svg">
        <polygon points="50,15 85,50 50,85 15,50" fill="none" stroke="#1e3a5f" stroke-width="2"/>
      </svg>`
    ],
    correct: 0
  }
];

// Function to get visual AO questions
function getVisualAOQuestions() {
  return AOVisualQuestions;
}

// Replace text-based AO questions with visual ones
function replaceAOWithVisuals(quizData) {
  if (!quizData.questions) return quizData;

  const visualQuestions = getVisualAOQuestions();
  let visualIndex = 0;

  quizData.questions = quizData.questions.map(q => {
    if (q.sectionCode === 'AO' && visualIndex < visualQuestions.length) {
      const visual = visualQuestions[visualIndex];
      visualIndex++;
      return {
        ...q,
        id: q.id,
        text: visual.prompt,
        visualType: visual.type,
        shapeSvg: visual.shapes.svg,
        options: visual.options,
        correct: visual.correct,
        difficulty: visual.difficulty,
        isVisual: true
      };
    }
    return q;
  });

  return quizData;
}

// Export for use
window.AOVisualQuestions = AOVisualQuestions;
window.getVisualAOQuestions = getVisualAOQuestions;
window.replaceAOWithVisuals = replaceAOWithVisuals;
