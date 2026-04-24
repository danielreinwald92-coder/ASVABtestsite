// Quiz Engine - Handles all quiz functionality
class QuizEngine {
  constructor() {
    this.currentQuestion = 0;
    this.answers = {};
    this.flagged = new Set();
    this.startTime = null;
    this.timerInterval = null;
    this.quizData = null;
    this.timeRemaining = 0;
    this.testSections = [];

    // Adaptive testing state
    this.adaptiveMode = true; // Enable CAT-like adaptive testing
    this.abilityLevels = {}; // Track ability per section
    this.questionPools = {}; // Adaptive question pools per section
    this.usedQuestionIds = new Set(); // Track used questions
  }

  init() {
    // Load test configuration
    this.loadTestConfig();

    // Generate fresh randomized questions for this test session
    if (!this.loadSavedState()) {
      this.generateNewTest();
    }

    // Always apply visual AO replacements (in case loaded from session without visuals)
    if (typeof replaceAOWithVisuals === 'function' && this.quizData) {
      this.quizData = replaceAOWithVisuals(this.quizData);
    }

    this.startTime = Date.now();
    this.renderQuestion();
    this.renderNavigator();
    this.startTimer();
    this.bindEvents();
    this.updateSectionHeader();
  }

  loadTestConfig() {
    // Check URL params first
    const urlParams = new URLSearchParams(window.location.search);
    const sectionParam = urlParams.get('section');
    const typeParam = urlParams.get('type');

    // Load saved test config from session storage
    const savedConfig = sessionStorage.getItem('testConfig');

    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      this.testSections = config.sections || ['AR'];
    } else if (sectionParam) {
      this.testSections = sectionParam.split(',');
    } else if (typeParam === 'afqt') {
      this.testSections = QuizManager.getAFQTSections();
    } else if (typeParam === 'full') {
      this.testSections = QuizManager.getAllSectionCodes();
    } else {
      this.testSections = ['AR']; // Default to AR
    }
  }

  generateNewTest() {
    // Generate fresh randomized questions with adaptive difficulty
    const allQuestions = [];
    let totalTimeLimit = 0;

    this.testSections.forEach(sectionCode => {
      const sectionInfo = QuizManager.getSectionInfo(sectionCode);
      if (sectionInfo) {
        // Initialize adaptive state for this section
        this.abilityLevels[sectionCode] = 3; // Start at medium
        this.questionPools[sectionCode] = QuizManager.getAdaptiveQuestionPool(sectionCode);

        // Pre-select questions adaptively
        const numQuestions = sectionInfo.questionsPerTest;
        const sectionUsedIds = new Set();

        for (let i = 0; i < numQuestions; i++) {
          const ability = Math.round(this.abilityLevels[sectionCode]);
          const question = QuizManager.selectNextAdaptiveQuestion(
            this.questionPools[sectionCode],
            ability,
            sectionUsedIds
          );

          if (question) {
            sectionUsedIds.add(question.id);
            this.usedQuestionIds.add(question.id);

            // Shuffle options
            const shuffled = QuizManager.shuffleQuestionOptions(question);
            allQuestions.push({
              ...shuffled,
              sectionCode: sectionCode,
              sectionName: sectionInfo.name,
              difficulty: question.difficulty
            });

            // Simulate adaptive progression for initial generation
            // (Real adaptation happens during the test)
            if (i % 3 === 0) {
              // Every 3rd question, vary the ability slightly for distribution
              this.abilityLevels[sectionCode] += (Math.random() - 0.5);
              this.abilityLevels[sectionCode] = Math.max(1, Math.min(5, this.abilityLevels[sectionCode]));
            }
          }
        }

        totalTimeLimit += sectionInfo.timeLimit;
      }
    });

    // Reset ability levels for actual test taking
    this.testSections.forEach(code => {
      this.abilityLevels[code] = 3;
    });

    // Build quiz data object
    this.quizData = {
      section: this.testSections.length === 1
        ? QuizManager.getSectionInfo(this.testSections[0])?.name
        : (this.testSections.length === 4 && this.testSections.every(s => ['AR', 'WK', 'PC', 'MK'].includes(s))
          ? 'AFQT Practice Test'
          : 'Full ASVAB Practice Test'),
      sectionCode: this.testSections.join(','),
      timeLimit: totalTimeLimit,
      questions: allQuestions.map((q, idx) => ({
        id: idx + 1,
        originalId: q.id,
        text: q.text,
        options: q.options,
        correct: q.correct,
        sectionCode: q.sectionCode,
        sectionName: q.sectionName,
        difficulty: q.difficulty,
        isVisual: q.isVisual || false,
        shapeSvg: q.shapeSvg || null,
        visualType: q.visualType || null
      }))
    };

    // Replace AO text questions with visual versions if available
    if (typeof replaceAOWithVisuals === 'function') {
      this.quizData = replaceAOWithVisuals(this.quizData);
    }

    this.timeRemaining = this.quizData.timeLimit;

    // Save the generated test to session storage
    this.saveGeneratedTest();
  }

  saveGeneratedTest() {
    sessionStorage.setItem('generatedTest', JSON.stringify(this.quizData));
  }

  loadSavedState() {
    // Try to load an in-progress test
    const savedTest = sessionStorage.getItem('generatedTest');
    const savedState = sessionStorage.getItem('quizState');

    if (savedTest && savedState) {
      this.quizData = JSON.parse(savedTest);
      const state = JSON.parse(savedState);
      this.answers = state.answers || {};
      this.flagged = new Set(state.flagged || []);
      this.currentQuestion = state.currentQuestion || 0;
      this.timeRemaining = state.timeRemaining || this.quizData.timeLimit;
      return true;
    }
    return false;
  }

  saveState() {
    const state = {
      answers: this.answers,
      flagged: Array.from(this.flagged),
      currentQuestion: this.currentQuestion,
      timeRemaining: this.timeRemaining
    };
    sessionStorage.setItem('quizState', JSON.stringify(state));
  }

  startTimer() {
    this.updateTimerDisplay();
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      this.updateTimerDisplay();
      this.saveState();

      if (this.timeRemaining <= 0) {
        clearInterval(this.timerInterval);
        this.submitQuiz();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('timerDisplay').textContent = display;

    // Warning colors
    const timerEl = document.querySelector('.quiz-timer');
    if (timerEl) {
      if (this.timeRemaining <= 300) { // 5 minutes
        timerEl.style.background = '#c53030';
      } else if (this.timeRemaining <= 600) { // 10 minutes
        timerEl.style.background = '#b45309';
      }
    }
  }

  updateSectionHeader() {
    // Update header to show current section info
    const header = document.querySelector('.quiz-section');
    if (header) {
      const question = this.quizData.questions[this.currentQuestion];
      if (question && question.sectionName && this.testSections.length > 1) {
        header.textContent = `${question.sectionName} (${question.sectionCode})`;
      } else {
        header.textContent = this.quizData.section;
      }
    }
  }

  renderQuestion() {
    const question = this.quizData.questions[this.currentQuestion];
    const questionNum = this.currentQuestion + 1;
    const totalQuestions = this.quizData.questions.length;

    // Update section header for multi-section tests
    this.updateSectionHeader();

    // Update question number
    document.getElementById('questionNumber').textContent = `Question ${questionNum}`;

    // Update question text (handle multi-line for paragraph comprehension)
    const questionTextEl = document.getElementById('questionText');

    // Check if this is a visual AO question
    if (question.isVisual && question.shapeSvg) {
      questionTextEl.innerHTML = `
        <div class="ao-question-container">
          <p>${question.text}</p>
          ${question.shapeSvg}
        </div>
      `;
    } else {
      questionTextEl.innerHTML = question.text.replace(/\n/g, '<br>');
    }

    // Update progress
    const progress = (questionNum / totalQuestions) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('progressCount').textContent = `${questionNum} / ${totalQuestions}`;

    // Render answer options
    const container = document.getElementById('answersContainer');
    const letters = ['A', 'B', 'C', 'D'];

    // Visual options for AO questions
    if (question.isVisual) {
      container.innerHTML = question.options.map((option, idx) => {
        const isSelected = this.answers[question.id] === idx;
        return `
          <div class="answer-option visual-option ${isSelected ? 'selected' : ''}" data-index="${idx}">
            <span class="answer-letter">${letters[idx]}</span>
            <span class="answer-text">${option}</span>
            <span class="keyboard-hint">Press ${letters[idx]}</span>
          </div>
        `;
      }).join('');
    } else {
      container.innerHTML = question.options.map((option, idx) => {
        const isSelected = this.answers[question.id] === idx;
        return `
          <div class="answer-option ${isSelected ? 'selected' : ''}" data-index="${idx}">
            <span class="answer-letter">${letters[idx]}</span>
            <span class="answer-text">${option}</span>
            <span class="keyboard-hint">Press ${letters[idx]}</span>
          </div>
        `;
      }).join('');
    }

    // Update flag button
    const flagBtn = document.getElementById('flagBtn');
    if (flagBtn) {
      if (this.flagged.has(question.id)) {
        flagBtn.classList.add('flagged');
        flagBtn.innerHTML = '<span>🚩</span> Flagged';
      } else {
        flagBtn.classList.remove('flagged');
        flagBtn.innerHTML = '<span>🚩</span> Flag for Review';
      }
    }

    // Update nav buttons
    const prevBtn = document.getElementById('prevBtn');
    if (prevBtn) {
      prevBtn.style.visibility = this.currentQuestion === 0 ? 'hidden' : 'visible';
    }

    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
      if (this.currentQuestion === totalQuestions - 1) {
        nextBtn.textContent = 'Review & Submit';
        nextBtn.classList.add('submit');
      } else {
        nextBtn.innerHTML = 'Next Question';
        nextBtn.classList.remove('submit');
      }
    }

    // Update navigator
    this.updateNavigator();
  }

  renderNavigator() {
    const grid = document.getElementById('navigatorGrid');
    if (!grid) return;

    grid.innerHTML = this.quizData.questions.map((q, idx) => {
      const classes = ['nav-dot'];
      if (idx === this.currentQuestion) classes.push('current');
      if (this.answers[q.id] !== undefined) classes.push('answered');
      if (this.flagged.has(q.id)) classes.push('flagged');

      // Add section indicator for multi-section tests
      const sectionAttr = q.sectionCode ? `data-section="${q.sectionCode}"` : '';
      return `<div class="${classes.join(' ')}" data-index="${idx}" ${sectionAttr}>${idx + 1}</div>`;
    }).join('');
  }

  updateNavigator() {
    const dots = document.querySelectorAll('.nav-dot');
    dots.forEach((dot, idx) => {
      const question = this.quizData.questions[idx];
      dot.classList.remove('current', 'answered', 'flagged');
      if (idx === this.currentQuestion) dot.classList.add('current');
      if (this.answers[question.id] !== undefined) dot.classList.add('answered');
      if (this.flagged.has(question.id)) dot.classList.add('flagged');
    });
  }

  selectAnswer(index) {
    const question = this.quizData.questions[this.currentQuestion];
    const previousAnswer = this.answers[question.id];
    this.answers[question.id] = index;

    // Update adaptive ability tracking (for results analysis)
    if (this.adaptiveMode && previousAnswer === undefined) {
      const isCorrect = index === question.correct;
      const sectionCode = question.sectionCode || this.testSections[0];
      const difficulty = question.difficulty || 3;

      if (this.abilityLevels[sectionCode] !== undefined) {
        this.abilityLevels[sectionCode] = QuizManager.updateAbilityLevel(
          this.abilityLevels[sectionCode],
          isCorrect,
          difficulty
        );
      }
    }

    this.saveState();
    this.renderQuestion();
  }

  toggleFlag() {
    const question = this.quizData.questions[this.currentQuestion];
    if (this.flagged.has(question.id)) {
      this.flagged.delete(question.id);
    } else {
      this.flagged.add(question.id);
    }
    this.saveState();
    this.renderQuestion();
  }

  goToQuestion(index) {
    if (index >= 0 && index < this.quizData.questions.length) {
      this.currentQuestion = index;
      this.saveState();
      this.renderQuestion();
    }
  }

  nextQuestion() {
    if (this.currentQuestion < this.quizData.questions.length - 1) {
      this.currentQuestion++;
      this.saveState();
      this.renderQuestion();
    } else {
      this.showSubmitConfirm();
    }
  }

  prevQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
      this.saveState();
      this.renderQuestion();
    }
  }

  showSubmitConfirm() {
    const unanswered = this.quizData.questions.filter(q => this.answers[q.id] === undefined).length;
    const flaggedCount = this.flagged.size;

    let message = 'Are you sure you want to submit your test?';
    if (unanswered > 0) {
      message += `\n\n⚠️ You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}.`;
    }
    if (flaggedCount > 0) {
      message += `\n\n🚩 You have ${flaggedCount} flagged question${flaggedCount > 1 ? 's' : ''} for review.`;
    }

    if (confirm(message)) {
      this.submitQuiz();
    }
  }

  submitQuiz() {
    clearInterval(this.timerInterval);

    // Calculate results by section
    const sectionResults = {};
    let totalCorrect = 0;

    this.quizData.questions.forEach(q => {
      const userAnswer = this.answers[q.id];
      const isCorrect = userAnswer === q.correct;
      if (isCorrect) totalCorrect++;

      const sectionCode = q.sectionCode || this.quizData.sectionCode;
      if (!sectionResults[sectionCode]) {
        sectionResults[sectionCode] = {
          name: q.sectionName || this.quizData.section,
          correct: 0,
          total: 0,
          questions: []
        };
      }

      sectionResults[sectionCode].total++;
      if (isCorrect) sectionResults[sectionCode].correct++;

      sectionResults[sectionCode].questions.push({
        id: q.id,
        originalId: q.originalId,
        text: q.text,
        options: q.options,
        userAnswer: userAnswer,
        correctAnswer: q.correct,
        isCorrect: isCorrect
      });
    });

    const totalQuestions = this.quizData.questions.length;
    const totalTime = this.quizData.timeLimit - this.timeRemaining;
    const score = Math.round((totalCorrect / totalQuestions) * 100);

    // Calculate AFQT estimate if applicable
    let afqtEstimate = null;
    const afqtSections = ['AR', 'WK', 'PC', 'MK'];
    const hasAFQTSections = afqtSections.some(s => sectionResults[s]);

    if (hasAFQTSections) {
      // AFQT = 2(VE) + AR + MK where VE = WK + PC
      let arScore = sectionResults['AR'] ? (sectionResults['AR'].correct / sectionResults['AR'].total) * 100 : 0;
      let mkScore = sectionResults['MK'] ? (sectionResults['MK'].correct / sectionResults['MK'].total) * 100 : 0;
      let wkScore = sectionResults['WK'] ? (sectionResults['WK'].correct / sectionResults['WK'].total) * 100 : 0;
      let pcScore = sectionResults['PC'] ? (sectionResults['PC'].correct / sectionResults['PC'].total) * 100 : 0;

      // VE (Verbal Expression) combines WK and PC
      let veScore = (wkScore + pcScore) / 2;

      // Weighted AFQT calculation (simplified percentile estimate)
      let rawAFQT = (2 * veScore + arScore + mkScore) / 4;
      afqtEstimate = Math.min(99, Math.max(1, Math.round(rawAFQT)));
    }

    // Store results
    const quizResults = {
      testType: this.testSections.length === 1 ? 'single' : (this.testSections.length === 4 ? 'afqt' : 'full'),
      section: this.quizData.section,
      sectionCode: this.quizData.sectionCode,
      sections: this.testSections,
      sectionResults: sectionResults,
      totalQuestions: totalQuestions,
      correct: totalCorrect,
      incorrect: totalQuestions - totalCorrect,
      score: score,
      afqt: afqtEstimate,
      timeUsed: totalTime,
      timeLimit: this.quizData.timeLimit,
      completedAt: new Date().toISOString()
    };

    localStorage.setItem('quizResults', JSON.stringify(quizResults));

    // Clear session data so next test gets fresh questions
    sessionStorage.removeItem('quizState');
    sessionStorage.removeItem('generatedTest');
    sessionStorage.removeItem('testConfig');

    // Redirect to results
    window.location.href = 'results.html';
  }

  bindEvents() {
    // Answer selection
    const answersContainer = document.getElementById('answersContainer');
    if (answersContainer) {
      answersContainer.addEventListener('click', (e) => {
        const option = e.target.closest('.answer-option');
        if (option) {
          this.selectAnswer(parseInt(option.dataset.index));
        }
      });
    }

    // Navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const flagBtn = document.getElementById('flagBtn');

    if (prevBtn) prevBtn.addEventListener('click', () => this.prevQuestion());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextQuestion());
    if (flagBtn) flagBtn.addEventListener('click', () => this.toggleFlag());

    // Question navigator
    const navigatorGrid = document.getElementById('navigatorGrid');
    if (navigatorGrid) {
      navigatorGrid.addEventListener('click', (e) => {
        const dot = e.target.closest('.nav-dot');
        if (dot) {
          this.goToQuestion(parseInt(dot.dataset.index));
        }
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(key)) {
        this.selectAnswer(key.charCodeAt(0) - 65);
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        this.nextQuestion();
      } else if (e.key === 'ArrowLeft') {
        this.prevQuestion();
      } else if (e.key === 'f' || e.key === 'F') {
        this.toggleFlag();
      }
    });

    // Save & Exit
    const quitBtn = document.getElementById('quitBtn');
    if (quitBtn) {
      quitBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to exit? Your progress will be saved.')) {
          this.saveState();
          window.location.href = 'index.html';
        }
      });
    }
  }

  // Static method to start a new test (clears any saved state)
  static startNewTest(sections) {
    sessionStorage.removeItem('quizState');
    sessionStorage.removeItem('generatedTest');
    sessionStorage.setItem('testConfig', JSON.stringify({ sections: sections }));
  }
}

// Initialize quiz when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Only init if we're on the quiz page
  if (document.getElementById('questionText')) {
    window.quiz = new QuizEngine();
    window.quiz.init();
  }
});
