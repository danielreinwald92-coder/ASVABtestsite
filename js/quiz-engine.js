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

    // State persistence: debounce writes instead of saving every timer tick
    this._lastSaveAt = 0;
    this._timerSaveIntervalMs = 10000;

    // Track whether timer warning thresholds have been announced for SR users
    this._warned10 = false;
    this._warned5 = false;

    // Single visibilitychange handler reference (bound once, see bindVisibilityHandler)
    this._visHandler = null;
    // Guard against double submission (double-click / timer-expiry race)
    this._isSubmitting = false;
  }

  init() {
    // Load test configuration
    this.loadTestConfig();

    // Generate fresh randomized questions for this test session
    if (!this.loadSavedState()) {
      this.generateNewTest();
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
      this.testSections = MissionASVABConfig.getSectionsForType('quick');
    } else if (typeParam === 'full') {
      this.testSections = MissionASVABConfig.getSectionsForType('full');
    } else {
      this.testSections = ['AR']; // Default to AR
    }
  }

  generateNewTest() {
    // True CAT-style: allocate empty slots per section. The actual question for
    // each slot is selected on first reach using the current ability level,
    // so wrong/right answers steer subsequent question difficulty.
    const slots = [];
    let totalTimeLimit = 0;
    let slotId = 0;

    this.testSections.forEach(sectionCode => {
      const sectionInfo = QuizManager.getSectionInfo(sectionCode);
      if (!sectionInfo) return;

      this.abilityLevels[sectionCode] = 3; // start at medium difficulty
      this.questionPools[sectionCode] = QuizManager.getAdaptiveQuestionPool(sectionCode);

      for (let i = 0; i < sectionInfo.questionsPerTest; i++) {
        slotId++;
        slots.push({
          id: slotId,
          sectionCode: sectionCode,
          sectionName: sectionInfo.name
          // Question content (text/options/correct/originalId/difficulty)
          // is filled in by materializeSlot() on first navigation.
        });
      }
      totalTimeLimit += sectionInfo.timeLimit;
    });

    this.quizData = {
      section: this.testSections.length === 1
        ? QuizManager.getSectionInfo(this.testSections[0])?.name
        : (MissionASVABConfig.getTestTypeFromSections(this.testSections) === 'afqt'
          ? 'AFQT Practice Test'
          : 'Full ASVAB Practice Test'),
      sectionCode: this.testSections.join(','),
      timeLimit: totalTimeLimit,
      questions: slots
    };

    this.timeRemaining = this.quizData.timeLimit;
    this.saveGeneratedTest();
  }

  // Resolve an empty slot into a concrete question using the current ability
  // level for that section. Called lazily on first render of each slot.
  materializeSlot(index) {
    const slot = this.quizData?.questions?.[index];
    if (!slot || slot.text !== undefined) return; // missing or already materialized

    // Pool may be missing after reload — rebuild from data if needed.
    if (!this.questionPools[slot.sectionCode]) {
      this.questionPools[slot.sectionCode] = QuizManager.getAdaptiveQuestionPool(slot.sectionCode);
    }
    if (this.abilityLevels[slot.sectionCode] === undefined) {
      this.abilityLevels[slot.sectionCode] = 3;
    }

    const ability = Math.max(1, Math.min(5, Math.round(this.abilityLevels[slot.sectionCode])));
    const question = QuizManager.selectNextAdaptiveQuestion(
      this.questionPools[slot.sectionCode],
      ability,
      this.usedQuestionIds
    );
    if (!question) return; // pool exhausted (shouldn't happen for production pools)

    this.usedQuestionIds.add(question.id);
    const shuffled = QuizManager.shuffleQuestionOptions(question);

    slot.originalId = question.id;
    slot.text = shuffled.text;
    slot.options = shuffled.options;
    slot.correct = shuffled.correct;
    slot.difficulty = question.difficulty;

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
      this.abilityLevels = state.abilityLevels || {};
      this.usedQuestionIds = new Set(state.usedQuestionIds || []);

      // Rebuild question pools (not persisted — large; selectNextAdaptiveQuestion
      // filters by usedQuestionIds so reshuffled pool order is harmless).
      this.testSections.forEach(code => {
        if (!this.questionPools[code]) {
          this.questionPools[code] = QuizManager.getAdaptiveQuestionPool(code);
        }
        if (this.abilityLevels[code] === undefined) {
          this.abilityLevels[code] = 3;
        }
      });
      return true;
    }
    return false;
  }

  saveState() {
    const state = {
      answers: this.answers,
      flagged: Array.from(this.flagged),
      currentQuestion: this.currentQuestion,
      timeRemaining: this.timeRemaining,
      abilityLevels: this.abilityLevels,
      usedQuestionIds: Array.from(this.usedQuestionIds)
    };
    sessionStorage.setItem('quizState', JSON.stringify(state));
    this._lastSaveAt = Date.now();
  }

  startTimer() {
    this.updateTimerDisplay();
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      this.updateTimerDisplay();

      // Debounce: only persist every N seconds (navigation/answer events flush immediately)
      const now = Date.now();
      if (now - this._lastSaveAt >= this._timerSaveIntervalMs) {
        this.saveState();
      }

      if (this.timeRemaining <= 0) {
        clearInterval(this.timerInterval);
        this.submitQuiz();
      }
    }, 1000);

    // Pause the timer when the tab is hidden so users aren't penalized for
    // switching tabs. Bound ONCE — startTimer() is re-invoked when the tab
    // becomes visible again, so re-binding here would accumulate listeners
    // (and could multi-fire submit on timer expiry).
    this.bindVisibilityHandler();
  }

  bindVisibilityHandler() {
    if (this._visHandler) return; // already registered
    this._visHandler = () => {
      if (document.hidden) {
        if (this.timerInterval) {
          clearInterval(this.timerInterval);
          this.timerInterval = null;
          this.saveState();
        }
      } else if (!this.timerInterval && this.timeRemaining > 0) {
        this.startTimer();
      }
    };
    document.addEventListener('visibilitychange', this._visHandler);
  }

  updateTimerDisplay() {
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    const timerDisplayEl = document.getElementById('timerDisplay');
    if (timerDisplayEl) timerDisplayEl.textContent = display;

    // Warning colors + screen-reader announcements (color alone is not accessible)
    const timerEl = document.querySelector('.quiz-timer');
    const liveEl = document.getElementById('timerLive');
    if (timerEl) {
      if (this.timeRemaining <= 300) { // 5 minutes
        timerEl.style.background = '#c53030';
        if (!this._warned5 && liveEl) {
          liveEl.textContent = '5 minutes remaining';
          this._warned5 = true;
        }
      } else if (this.timeRemaining <= 600) { // 10 minutes
        timerEl.style.background = '#b45309';
        if (!this._warned10 && liveEl) {
          liveEl.textContent = '10 minutes remaining';
          this._warned10 = true;
        }
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
    // Lazy-materialize the slot the user is about to see using the latest
    // ability level for that section.
    this.materializeSlot(this.currentQuestion);
    const question = this.quizData.questions[this.currentQuestion];
    const questionNum = this.currentQuestion + 1;
    const totalQuestions = this.quizData.questions.length;

    // Update section header for multi-section tests
    this.updateSectionHeader();

    // Update question number
    document.getElementById('questionNumber').textContent = `Question ${questionNum}`;

    // Update question text (handle multi-line for paragraph comprehension)
    const questionTextEl = document.getElementById('questionText');

    questionTextEl.innerHTML = question.text.replace(/\n/g, '<br>');

    // Update progress
    const progress = (questionNum / totalQuestions) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('progressCount').textContent = `${questionNum} / ${totalQuestions}`;

    // Render answer options
    const container = document.getElementById('answersContainer');
    const letters = ['A', 'B', 'C', 'D'];

    container.setAttribute('role', 'radiogroup');
    container.setAttribute('aria-label', `Answer options for question ${questionNum}`);
    container.innerHTML = question.options.map((option, idx) => {
      const isSelected = this.answers[question.id] === idx;
      return `
        <div class="answer-option ${isSelected ? 'selected' : ''}" data-index="${idx}" role="radio" tabindex="0" aria-checked="${isSelected}" aria-label="Option ${letters[idx]}: ${option}. Press ${letters[idx]} to select.">
          <span class="answer-letter" aria-hidden="true">${letters[idx]}</span>
          <span class="answer-text">${option}</span>
          <span class="keyboard-hint" aria-hidden="true">Press ${letters[idx]}</span>
        </div>
      `;
    }).join('');

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

    // Adaptive: update ability so the next unreached slot in this section
    // is materialized at the appropriate difficulty.
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
    if (index < 0 || index >= this.quizData.questions.length) return;

    // Can only go to answered questions or current question
    const targetQuestion = this.quizData.questions[index];
    if (index > this.currentQuestion && this.answers[targetQuestion.id] === undefined) {
      return;
    }

    this.currentQuestion = index;
    this.saveState();
    this.renderQuestion();
  }

  nextQuestion() {
    const question = this.quizData.questions[this.currentQuestion];
    if (this.answers[question.id] === undefined) {
      this.showAnswerRequired();
      return;
    }

    if (this.currentQuestion < this.quizData.questions.length - 1) {
      this.currentQuestion++;
      this.saveState();
      this.renderQuestion();
    } else {
      // Last question: route through the review/confirm step rather than
      // submitting immediately.
      this.showSubmitConfirm();
    }
  }

  showAnswerRequired() {
    const container = document.getElementById('answersContainer');
    container.classList.add('shake');
    setTimeout(() => container.classList.remove('shake'), 500);
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

  async submitQuiz() {
    // Guard against double submission: rapid double-click, or the timer-expiry
    // path firing while a manual submit is already in flight. saveResultsToSupabase
    // swallows errors and the flow always navigates to results, so we must NOT
    // reset this guard (doing so would re-enable a duplicate insert).
    if (this._isSubmitting) return;
    this._isSubmitting = true;

    // Disable the submit button in the DOM so the UI can't trigger a second submit.
    const submitBtn = document.getElementById('nextBtn');
    if (submitBtn) submitBtn.disabled = true;

    clearInterval(this.timerInterval);

    // Materialize any slots the user never reached so scoring and the review
    // page have complete question content. Unanswered slots stay unanswered
    // (treated as wrong, same as before).
    for (let i = 0; i < this.quizData.questions.length; i++) {
      if (this.quizData.questions[i].text === undefined) {
        this.materializeSlot(i);
      }
    }

    // Calculate results by section
    const sectionResults = {};
    let totalCorrect = 0;

    this.quizData.questions.forEach(q => {
      // Skip slots that couldn't be materialized (pool exhausted) — extremely rare.
      if (q.text === undefined) return;
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
    afqtEstimate = MissionASVABScoring.calculateAFQTEstimate(sectionResults);

    // Store results
    const quizResults = {
      testType: MissionASVABConfig.getTestTypeFromSections(this.testSections),
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

    sessionStorage.removeItem('quizState');
    sessionStorage.removeItem('generatedTest');
    sessionStorage.removeItem('testConfig');

    await this.saveResultsToSupabase(quizResults);

    window.location.href = 'results.html';
  }

  async saveResultsToSupabase(quizResults) {
    if (typeof getClient !== 'function') return { skipped: true };
    const session = await getSession();
    if (!session) return { skipped: true };

    const lineScores = MissionASVABScoring.calculateLineScores(quizResults.sectionResults);
    const strippedSections = {};
    // Compact per-question results: id + section + correct only (NO text/options),
    // so the mistake history stays small. Powers weak-area aggregation (see js/weak-areas.js).
    const questionResults = [];
    if (quizResults.sectionResults) {
      for (const [code, data] of Object.entries(quizResults.sectionResults)) {
        strippedSections[code] = { correct: data.correct, total: data.total };
        (data.questions || []).forEach(q => {
          questionResults.push({ id: q.id, section: code, correct: !!q.isCorrect });
        });
      }
    }
    const payload = {
      user_id: session.user.id,
      test_type: quizResults.testType || 'afqt',
      afqt_score: quizResults.afqt,
      section_scores: strippedSections,
      line_scores: lineScores,
      question_results: questionResults
    };

    try {
      const { error } = await getClient().from('test_results').insert(payload);
      if (error) {
        console.error('Supabase insert error:', error);
        this._queuePendingResult(payload, error.message);
        return { ok: false, error: error.message };
      }
      // We just confirmed connectivity — drain any previously queued results.
      if (typeof flushPendingTestResults === 'function') {
        try { flushPendingTestResults(); } catch (_) {}
      }
      return { ok: true };
    } catch (err) {
      console.error('Failed to save results to Supabase:', err);
      this._queuePendingResult(payload, err.message || 'Network error');
      return { ok: false, error: err.message || 'Network error' };
    }
  }

  _queuePendingResult(payload, errorMessage) {
    // Append to the array queue (supports multiple offline submits). Migrate a
    // legacy single-result key if present so nothing is lost. js/offline-queue.js
    // drains this queue on load and when connectivity returns.
    try {
      let queue = [];
      const raw = localStorage.getItem('pendingTestResults');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) queue = parsed;
      }
      const legacy = localStorage.getItem('pendingTestResult');
      if (legacy) {
        try { queue.push(JSON.parse(legacy)); } catch (_) {}
        localStorage.removeItem('pendingTestResult');
      }
      queue.push({
        payload,
        error: errorMessage,
        queuedAt: new Date().toISOString()
      });
      localStorage.setItem('pendingTestResults', JSON.stringify(queue));
    } catch (_) {
      // Quota or serialization error — nothing we can do client-side
    }
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
      // Keyboard activation for the focused answer option (Enter/Space).
      // stopPropagation so the document-level Enter handler does not also
      // advance to the next question while an option is focused.
      answersContainer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          const option = e.target.closest('.answer-option');
          if (option) {
            e.preventDefault();
            e.stopPropagation();
            this.selectAnswer(parseInt(option.dataset.index));
          }
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
    // Clear any prior result so a brand-new test never renders a stale score.
    localStorage.removeItem('quizResults');
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
