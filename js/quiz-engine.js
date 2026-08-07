// Quiz Engine - Handles all quiz functionality

// Bank content is first-party, but some questions legitimately contain < > &
// (e.g. "x < 6") and options are also interpolated into an aria-label
// attribute — escape everything at render time.
function escQuiz(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function createClientResultId(completedAt) {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  } catch (_) {}
  return 'result-' + String(completedAt || Date.now()).replace(/[^0-9]/g, '') + '-' +
    Math.random().toString(36).slice(2, 10);
}

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
    this.testKind = 'custom';
    this.sectionOverrides = {};

    // Adaptive testing state
    this.abilityState = {}; // Owen Bayesian interim ability per section: {mean, variance}
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

    // Tutor mode: untimed, instant feedback + explanation. Set in loadTestConfig().
    this.mode = 'timed';
    this.tutorRevealed = new Set(); // slot ids whose feedback has been shown
    this.lockedAnswers = new Set(); // CAT modes: slot ids whose answer is final

    // SP2 per-section timing (timed mode only). Ranges are [{code,name,start,end,timeLimit}].
    this.sectionRanges = [];
    this.activeSectionIndex = 0;
    this.sectionTimeRemaining = 0;
    this.completedSections = new Set();
  }

  init() {
    // Load test configuration
    this.loadTestConfig();

    // No config and no URL params (e.g. Back button after submitting): only an
    // intact in-progress test can supply the sections. Otherwise send the user
    // to test selection instead of silently starting a test they never asked for.
    if (!this.testSections) {
      if (!this.loadSavedState()) {
        window.location.replace('select-test.html');
        return;
      }
    } else if (!this.loadSavedState()) {
      // Generate fresh randomized questions for this test session
      this.generateNewTest();
    }

    this.startTime = Date.now();
    this.renderQuestion();
    this.renderNavigator();
    this.maybeStartTimer();
    this.bindEvents();
    this.updateSectionHeader();
    if (this.mode === 'tutor') {
      this.applyTutorChrome();
      this.explanations = {};
      if (typeof loadExplanations === 'function') {
        loadExplanations().then((map) => {
          this.explanations = map || {};
          this.renderQuestion(); // refresh if the user is already on a revealed slot
        });
      }
    }
  }

  loadTestConfig() {
    // Check URL params first
    const urlParams = new URLSearchParams(window.location.search);
    const sectionParam = urlParams.get('section');
    const typeParam = urlParams.get('type');
    const modeParam = urlParams.get('mode');

    // Load saved test config from session storage
    const savedConfig = sessionStorage.getItem('testConfig');

    // A corrupt saved config (quota-truncated write, other tab) must degrade
    // to "no config" — init() then redirects to select-test.html.
    let config = null;
    if (savedConfig) {
      try { config = JSON.parse(savedConfig); } catch (_) { config = null; }
    }

    if (config && config.sections) {
      this.testSections = config.sections;
    } else if (sectionParam) {
      this.testSections = sectionParam.split(',');
    } else if (typeParam === 'afqt') {
      this.testSections = MissionASVABConfig.getSectionsForType('quick');
    } else if (typeParam === 'full') {
      this.testSections = MissionASVABConfig.getSectionsForType('full');
    } else if (typeParam === 'diagnostic') {
      this.testSections = MissionASVABConfig.getSectionsForType('diagnostic');
    } else {
      this.testSections = null; // no config — init() redirects to select-test.html
    }

    // Tutor mode comes from the URL param, falling back to the saved config.
    const configApi = typeof MissionASVABConfig !== 'undefined' ? MissionASVABConfig : null;
    const derivedType = this.testSections && configApi && configApi.getTestTypeFromSections
      ? configApi.getTestTypeFromSections(this.testSections)
      : (this.testSections && this.testSections.length === 1 ? 'single' : 'custom');
    this.testKind = (config && config.type) || typeParam || derivedType;
    const preset = configApi && configApi.TEST_CONFIGS && configApi.TEST_CONFIGS[this.testKind];
    this.sectionOverrides = (config && config.sectionOverrides) || (preset && preset.sectionOverrides) || {};
    const cfgMode = (config && config.mode) || null;
    this.mode = this.testKind !== 'diagnostic' && (modeParam === 'tutor' || cfgMode === 'tutor') ? 'tutor' : 'timed';
  }

  generateNewTest() {
    // True CAT-style: allocate empty slots per section. The actual question for
    // each slot is selected on first reach using the current ability level,
    // so wrong/right answers steer subsequent question difficulty.
    const slots = [];
    let totalTimeLimit = 0;
    let slotId = 0;

    this.testSections.forEach(sectionCode => {
      const baseInfo = QuizManager.getSectionInfo(sectionCode);
      const sectionInfo = baseInfo ? { ...baseInfo, ...(this.sectionOverrides[sectionCode] || {}) } : null;
      if (!sectionInfo) return;

      this.abilityState[sectionCode] = { mean: 0, variance: 1 };
      this.questionPools[sectionCode] = QuizManager.getAdaptiveQuestionPool(sectionCode);

      for (let i = 0; i < sectionInfo.questionsPerTest; i++) {
        slotId++;
        slots.push({
          id: slotId,
          sectionCode: sectionCode,
          sectionName: sectionInfo.name,
          targetDifficulty: Array.isArray(sectionInfo.difficultyPlan) ? sectionInfo.difficultyPlan[i] : null,
          sectionTimeLimit: sectionInfo.timeLimit
          // Question content (text/options/correct/originalId/difficulty)
          // is filled in by materializeSlot() on first navigation.
        });
      }
      totalTimeLimit += sectionInfo.timeLimit;
    });

    this.quizData = {
      section: this.testKind === 'diagnostic'
        ? 'Starting-Point Diagnostic'
        : this.testSections.length === 1
        ? QuizManager.getSectionInfo(this.testSections[0])?.name
        : (MissionASVABConfig.getTestTypeFromSections(this.testSections) === 'afqt'
          ? 'AFQT Practice Test'
          : 'Full ASVAB Practice Test'),
      sectionCode: this.testSections.join(','),
      timeLimit: totalTimeLimit,
      testKind: this.testKind,
      sectionTimeLimits: Object.fromEntries(this.testSections.map((code) => {
        const base = QuizManager.getSectionInfo(code) || {};
        const override = this.sectionOverrides[code] || {};
        return [code, override.timeLimit || base.timeLimit || 0];
      })),
      questions: slots
    };

    this.timeRemaining = this.quizData.timeLimit;

    // SP2: set up the per-section timer/navigation model.
    this.buildSectionRanges();
    this.activeSectionIndex = 0;
    this.completedSections = new Set();
    this.currentQuestion = 0;
    this.sectionTimeRemaining = (this.isSectioned() && this.sectionRanges.length)
      ? this.sectionRanges[0].timeLimit
      : this.timeRemaining;

    this.saveGeneratedTest();
  }

  // Timed tests are sectioned; tutor mode is a single free-navigation span.
  isSectioned() {
    return this.mode !== 'tutor';
  }

  // CAT (Computer Adaptive Test) modes are the sectioned, timed, non-diagnostic
  // tests (quick/full/custom) — real CAT-ASVAB rules apply: answers lock on
  // advance and navigation is forward-only. Tutor (instant feedback) and the
  // diagnostic (fixed difficulty plan, free review) are excluded.
  isCatMode() {
    return this.isSectioned() && this.mode !== 'tutor' && this.testKind !== 'diagnostic';
  }

  // The incomplete-test random-guess penalty (scoring.js sectionAbility, via
  // getScoreDetails or the single-section wrapper) only ever runs for: the
  // full AFQT four (quick/full/any custom superset that includes them — the
  // hasAll gate in getScoreDetails), or exactly one section (the single-
  // section path added for spec §10). Tutor and diagnostic never score via
  // IRT; a "custom" multi-section subset missing the AFQT four never does
  // either — those unanswered items just get zero credit, same as tutor/
  // diagnostic. isCatMode() alone over-claims for that last case, so
  // showSubmitConfirm's copy uses this narrower check instead.
  appliesGuessPenalty() {
    if (this.mode === 'tutor' || this.testKind === 'diagnostic') return false;
    const sections = this.testSections || [];
    if (sections.length === 1) return true;
    return MissionASVABConfig.AFQT_SECTIONS.every((code) => sections.includes(code));
  }

  // Finalize the current answer: in CAT modes an answer becomes immutable when
  // the user advances (like the real CAT-ASVAB), and the interim Owen ability
  // for the section updates at that moment.
  lockCurrentAnswer() {
    const q = this.quizData.questions[this.currentQuestion];
    if (!q || this.answers[q.id] === undefined || this.lockedAnswers.has(q.id)) return;
    this.lockedAnswers.add(q.id);
    this.updateInterimAbility(q);
  }

  // Owen Bayesian interim ability update for one answered question. Shared by
  // the CAT lock path (lockCurrentAnswer) and tutor's reveal-time update
  // (selectAnswer) — same idiom as materializeSlot for reaching optional globals.
  updateInterimAbility(q) {
    const code = q.sectionCode || this.testSections[0];
    const IRT = (typeof MissionASVABIRT !== 'undefined') ? MissionASVABIRT
      : (typeof window !== 'undefined' ? window.MissionASVABIRT : null);
    const P = (typeof MissionASVABIRTParams !== 'undefined') ? MissionASVABIRTParams
      : (typeof window !== 'undefined' ? window.MissionASVABIRTParams : null);
    if (!IRT || !P || !this.abilityState[code]) return;
    const item = P.getItemParams(code, q.difficulty || 3, q.originalId || q.id);
    this.abilityState[code] = IRT.owenUpdate(this.abilityState[code], item, this.answers[q.id] === q.correct);
  }

  // Derive contiguous per-section slot ranges from the generated questions.
  buildSectionRanges() {
    const ranges = [];
    const qs = (this.quizData && this.quizData.questions) || [];
    let i = 0;
    while (i < qs.length) {
      const code = qs[i].sectionCode;
      const start = i;
      while (i < qs.length && qs[i].sectionCode === code) i++;
      // QuizManager is always present on the quiz page; guard so a resume path
      // never hard-crashes if it is unavailable (same idiom as materializeSlot).
      const info = (typeof QuizManager !== 'undefined') ? QuizManager.getSectionInfo(code) : null;
      const savedTime = this.quizData && this.quizData.sectionTimeLimits && this.quizData.sectionTimeLimits[code];
      ranges.push({
        code,
        name: (info && info.name) || (qs[start] && qs[start].sectionName) || code,
        start,
        end: i,
        timeLimit: savedTime || (info && info.timeLimit) || 0,
      });
    }
    this.sectionRanges = ranges;
  }

  // The active slot range: the current section when sectioned, else the whole test.
  getActiveRange() {
    if (this.isSectioned() && this.sectionRanges.length) {
      return this.sectionRanges[this.activeSectionIndex];
    }
    return { start: 0, end: (this.quizData && this.quizData.questions.length) || 0 };
  }

  // Move to the next section (by finishing early or by timer expiry). On the
  // final section, submit. Unused time on an early advance is removed from the
  // total budget so timeUsed reflects real elapsed time.
  advanceSection(reason) {
    // A section can also end via time-out with a selected-but-not-yet-locked
    // answer on the current slot (the user never clicked Next) — lock it now
    // so it isn't lost from ability estimation. No-op if already locked/empty.
    this.lockCurrentAnswer();

    clearInterval(this.timerInterval);
    this.timerInterval = null;
    this.completedSections.add(this.activeSectionIndex);
    const prevRange = this.sectionRanges[this.activeSectionIndex];

    if (this.activeSectionIndex >= this.sectionRanges.length - 1) {
      this.announceSectionTransition(prevRange, null, reason);
      this.submitQuiz();
      return;
    }

    if (this.sectionTimeRemaining > 0) {
      this.timeRemaining -= this.sectionTimeRemaining;
    }
    this.activeSectionIndex++;
    const range = this.sectionRanges[this.activeSectionIndex];
    this.sectionTimeRemaining = range.timeLimit;
    this.currentQuestion = range.start;
    this._warned10 = false;
    this._warned5 = false;

    this.saveState();
    this.renderQuestion();
    this.renderNavigator();
    this.updateSectionHeader();
    this.announceSectionTransition(prevRange, range, reason);
    this.startTimer();
  }

  // Tell the user why the page just jumped to a new section: an aria-live
  // announcement plus a transient on-screen toast (time-outs are otherwise
  // silent and disorienting, especially on mobile where the header is compact).
  announceSectionTransition(prevRange, nextRange, reason) {
    const prevName = (prevRange && prevRange.name) || 'this section';
    let msg;
    if (nextRange) {
      msg = (reason === 'time' ? `Time's up for ${prevName}. ` : `${prevName} complete. `) +
        `Now starting: ${nextRange.name}.`;
    } else {
      msg = reason === 'time' ? `Time's up for ${prevName}. Submitting your test.` : '';
    }
    if (!msg) return;
    const liveEl = document.getElementById('timerLive');
    if (liveEl) liveEl.textContent = msg;

    // Visual toast (skipped in non-DOM test environments).
    if (typeof document.createElement === 'function' && document.body) {
      const toast = document.createElement('div');
      toast.className = 'section-toast';
      toast.textContent = msg;
      document.body.appendChild(toast);
      setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 5000);
    }
  }

  // Resolve an empty slot into a concrete question using the current interim
  // theta (diagnostic slots use their fixed targetDifficulty instead). Called
  // lazily on first render of each slot.
  materializeSlot(index) {
    const slot = this.quizData?.questions?.[index];
    if (!slot || slot.text !== undefined) return; // missing or already materialized

    // Pool may be missing after reload — rebuild from data if needed.
    if (!this.questionPools[slot.sectionCode]) {
      this.questionPools[slot.sectionCode] = QuizManager.getAdaptiveQuestionPool(slot.sectionCode);
    }
    const state = this.abilityState[slot.sectionCode] ||
      (this.abilityState[slot.sectionCode] = { mean: 0, variance: 1 });

    // SP2: also avoid questions the user saw in recent tests (on-device). If the
    // filtered pool can't supply one, relax to the session-used set so a test
    // always fills (thin non-AFQT pools).
    const excluded = new Set(this.usedQuestionIds);
    const RS = (typeof MissionASVABRecentSeen !== 'undefined') ? MissionASVABRecentSeen
      : (typeof window !== 'undefined' ? window.MissionASVABRecentSeen : null);
    if (RS && typeof RS.getRecent === 'function') {
      RS.getRecent(slot.sectionCode).forEach((id) => excluded.add(id));
    }
    const pick = (excludedSet) => slot.targetDifficulty
      ? QuizManager.selectNextAdaptiveQuestion(this.questionPools[slot.sectionCode], slot.targetDifficulty, excludedSet)
      : QuizManager.selectMaxInfoQuestion(this.questionPools[slot.sectionCode], slot.sectionCode, state.mean, excludedSet);
    let question = pick(excluded);
    if (!question) question = pick(this.usedQuestionIds);
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
      // Corrupt state (quota-truncated write, another tab) → discard and
      // regenerate rather than crashing init with a blank quiz page.
      let state = null, savedQuizData = null;
      try {
        state = JSON.parse(savedState);
        savedQuizData = JSON.parse(savedTest);
      } catch (_) {
        sessionStorage.removeItem('generatedTest');
        sessionStorage.removeItem('quizState');
        return false;
      }
      // SP2: the timer/navigation model changed. Discard any pre-SP2 in-progress
      // state (no schemaV) and regenerate a fresh test rather than migrate it.
      if (!state || state.schemaV !== 2 || !savedQuizData || !Array.isArray(savedQuizData.questions)) {
        sessionStorage.removeItem('generatedTest');
        sessionStorage.removeItem('quizState');
        return false;
      }
      this.quizData = savedQuizData;
      this.testKind = savedQuizData.testKind || this.testKind;
      this.answers = state.answers || {};
      this.flagged = new Set(state.flagged || []);
      this.currentQuestion = state.currentQuestion || 0;
      this.timeRemaining = state.timeRemaining || this.quizData.timeLimit;
      this.abilityState = state.abilityState || {};
      this.usedQuestionIds = new Set(state.usedQuestionIds || []);
      // Tutor reveal/lock state must survive a refresh or resume, or previously
      // answered questions would lose their feedback and become re-answerable.
      this.tutorRevealed = new Set(state.tutorRevealed || []);
      // CAT answer locks must survive a refresh too, for the same reason.
      this.lockedAnswers = new Set(state.lockedAnswers || []);

      // SP2 section state.
      this.buildSectionRanges();
      // Resume without a testConfig (defensive): reconstruct sections from the
      // saved test itself so the pool rebuild below still works.
      if (!this.testSections || !this.testSections.length) {
        this.testSections = this.sectionRanges.map((r) => r.code);
      }
      this.activeSectionIndex = state.activeSectionIndex || 0;
      this.sectionTimeRemaining = (typeof state.sectionTimeRemaining === 'number')
        ? state.sectionTimeRemaining
        : ((this.sectionRanges[this.activeSectionIndex] && this.sectionRanges[this.activeSectionIndex].timeLimit) || this.timeRemaining);
      this.completedSections = new Set(state.completedSections || []);

      // Rebuild question pools (not persisted — large; selectNextAdaptiveQuestion
      // filters by usedQuestionIds so reshuffled pool order is harmless).
      this.testSections.forEach(code => {
        if (!this.questionPools[code]) {
          this.questionPools[code] = QuizManager.getAdaptiveQuestionPool(code);
        }
        if (this.abilityState[code] === undefined) {
          this.abilityState[code] = { mean: 0, variance: 1 };
        }
      });
      return true;
    }
    return false;
  }

  saveState() {
    const state = {
      schemaV: 2, // SP2: bump so pre-SP2 in-progress states are discarded on resume
      answers: this.answers,
      flagged: Array.from(this.flagged),
      currentQuestion: this.currentQuestion,
      timeRemaining: this.timeRemaining,
      abilityState: this.abilityState,
      usedQuestionIds: Array.from(this.usedQuestionIds),
      tutorRevealed: Array.from(this.tutorRevealed),
      lockedAnswers: Array.from(this.lockedAnswers),
      activeSectionIndex: this.activeSectionIndex,
      sectionTimeRemaining: this.sectionTimeRemaining,
      completedSections: Array.from(this.completedSections),
      testKind: this.testKind,
    };
    sessionStorage.setItem('quizState', JSON.stringify(state));
    this._lastSaveAt = Date.now();
  }

  startTimer() {
    this.updateTimerDisplay();
    this.timerInterval = setInterval(() => {
      // Sectioned (timed) tests run a per-section clock; both the section clock
      // and the total budget tick down together.
      if (this.isSectioned()) this.sectionTimeRemaining--;
      this.timeRemaining--;
      this.updateTimerDisplay();

      // Debounce: only persist every N seconds (navigation/answer events flush immediately)
      const now = Date.now();
      if (now - this._lastSaveAt >= this._timerSaveIntervalMs) {
        this.saveState();
      }

      if (this.isSectioned() && this.sectionTimeRemaining <= 0) {
        // Section time up → lock it and advance (advanceSection submits if last).
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.advanceSection('time');
        return;
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

  // Timed tests run the clock; tutor mode never does (no time pressure, no auto-submit).
  maybeStartTimer() {
    if (this.mode === 'tutor') return;
    this.startTimer();
  }

  // Hide timer UI and relabel for tutor mode. Uses optional chaining because
  // these elements may be absent in tests.
  applyTutorChrome() {
    const timer = document.querySelector && document.querySelector('.quiz-timer');
    if (timer) timer.style.display = 'none';
    const title = document.querySelector && document.querySelector('.quiz-title');
    if (title) title.textContent = 'Tutor Mode: Untimed Practice';
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
    const remaining = Math.max(0, this.isSectioned() ? this.sectionTimeRemaining : this.timeRemaining);
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    const timerDisplayEl = document.getElementById('timerDisplay');
    if (timerDisplayEl) timerDisplayEl.textContent = display;

    // Warning colors + screen-reader announcements (color alone is not accessible)
    const timerEl = document.querySelector('.quiz-timer');
    const liveEl = document.getElementById('timerLive');
    if (timerEl) {
      // Per-section warnings (sections range from 6–55 min; warn near the end).
      if (remaining <= 30) {
        timerEl.style.background = '#c53030';
        if (!this._warned5 && liveEl) {
          liveEl.textContent = '30 seconds left in this section';
          this._warned5 = true;
        }
      } else if (remaining <= 60) {
        timerEl.style.background = '#b45309';
        if (!this._warned10 && liveEl) {
          liveEl.textContent = '1 minute left in this section';
          this._warned10 = true;
        }
      } else {
        timerEl.style.background = '';
      }
    }
  }

  updateSectionHeader() {
    const header = document.querySelector('.quiz-section');
    if (!header) return;

    if (this.isSectioned() && this.sectionRanges.length) {
      const range = this.sectionRanges[this.activeSectionIndex];
      header.textContent = this.sectionRanges.length > 1
        ? `Section ${this.activeSectionIndex + 1} of ${this.sectionRanges.length}: ${range.name}`
        : range.name;
      return;
    }

    // Tutor / fallback: the current question's section name, else the test name.
    const question = this.quizData.questions[this.currentQuestion];
    header.textContent = (question && question.sectionName) || this.quizData.section;
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

    questionTextEl.innerHTML = escQuiz(question.text).replace(/\n/g, '<br>');

    // Update progress
    const progress = (questionNum / totalQuestions) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('progressCount').textContent = `${questionNum} / ${totalQuestions}`;

    // Render answer options
    const container = document.getElementById('answersContainer');
    const letters = ['A', 'B', 'C', 'D'];

    container.setAttribute('role', 'radiogroup');
    container.setAttribute('aria-label', `Answer options for question ${questionNum}`);
    const revealed = this.mode === 'tutor' && this.tutorRevealed.has(question.id);
    container.innerHTML = question.options.map((option, idx) => {
      const isSelected = this.answers[question.id] === idx;
      const safeOption = escQuiz(option);
      let revealClass = '';
      if (revealed) {
        if (idx === question.correct) revealClass = ' reveal-correct';
        else if (isSelected) revealClass = ' reveal-incorrect';
      }
      return `
        <div class="answer-option ${isSelected ? 'selected' : ''}${revealClass}" data-index="${idx}" role="radio" tabindex="0" aria-checked="${isSelected}" aria-label="Option ${letters[idx]}: ${safeOption}. Press ${letters[idx]} to select.">
          <span class="answer-letter" aria-hidden="true">${letters[idx]}</span>
          <span class="answer-text">${safeOption}</span>
          <span class="keyboard-hint" aria-hidden="true">Press ${letters[idx]}</span>
        </div>
      `;
    }).join('');

    // Tutor feedback panel (present only on quiz.html; guarded for tests).
    const feedback = document.getElementById('tutorFeedback');
    if (feedback) {
      if (revealed) {
        const correct = this.answers[question.id] === question.correct;
        const explanation = (this.explanations && this.explanations[question.originalId]) || '';
        feedback.className = 'tutor-feedback ' + (correct ? 'is-correct' : 'is-incorrect');
        feedback.innerHTML = `
          <div class="tutor-verdict">${correct ? '✓ Correct' : '✗ Not quite'}</div>
          ${explanation ? `<p class="tutor-explanation">${explanation}</p>` : ''}
        `;
        feedback.hidden = false;
      } else {
        feedback.hidden = true;
        feedback.innerHTML = '';
      }
    }

    // Update flag button. Hidden entirely in CAT mode: navigation is
    // forward-only there, so a flagged question can never be revisited — the
    // affordance would be dead. Stays visible in tutor/diagnostic, where
    // flag-and-come-back is still meaningful.
    const flagBtn = document.getElementById('flagBtn');
    if (flagBtn) {
      if (this.isCatMode()) {
        flagBtn.style.display = 'none';
      } else {
        flagBtn.style.display = '';
        if (this.flagged.has(question.id)) {
          flagBtn.classList.add('flagged');
          flagBtn.innerHTML = '<span>🚩</span> Flagged';
        } else {
          flagBtn.classList.remove('flagged');
          flagBtn.innerHTML = '<span>🚩</span> Flag for Review';
        }
      }
    }

    // Update nav buttons. In sectioned (timed) mode Prev cannot cross into a
    // completed section, so hide it at the section floor — not just at slot 0 —
    // to avoid a visible-but-inert button on the first question of each section.
    // CAT modes hide it everywhere: navigation is forward-only, same as the
    // real CAT-ASVAB (no reviewing or changing a locked answer).
    const prevBtn = document.getElementById('prevBtn');
    if (prevBtn) {
      const atFloor = this.isSectioned()
        ? this.currentQuestion === this.getActiveRange().start
        : this.currentQuestion === 0;
      prevBtn.style.visibility = (atFloor || this.isCatMode()) ? 'hidden' : 'visible';
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

    // Sectioned tests show only the active section; tutor shows the whole test.
    const range = this.isSectioned()
      ? this.getActiveRange()
      : { start: 0, end: this.quizData.questions.length };

    let html = '';
    for (let idx = range.start; idx < range.end; idx++) {
      const q = this.quizData.questions[idx];
      const classes = ['nav-dot'];
      if (idx === this.currentQuestion) classes.push('current');
      if (this.mode === 'tutor' && this.tutorRevealed.has(q.id)) {
        classes.push(this.answers[q.id] === q.correct ? 'nav-correct' : 'nav-incorrect');
      } else if (this.answers[q.id] !== undefined) {
        classes.push('answered');
      }
      if (this.flagged.has(q.id)) classes.push('flagged');
      const sectionAttr = q.sectionCode ? `data-section="${q.sectionCode}"` : '';
      const num = idx - range.start + 1;
      const state = this.answers[q.id] !== undefined ? ', answered' : ', unanswered';
      const current = idx === this.currentQuestion ? ' aria-current="true"' : '';
      // CAT mode: a dot for an already-passed question is visually useful
      // (progress at a glance) but functionally inert — goToQuestion() refuses
      // to move backward — so it must not be a focusable/interactive target.
      // Leaving role="button" tabindex="0" on it would be an a11y trap: a
      // keyboard/AT user reaches a "button" that silently does nothing.
      const inert = this.isCatMode() && idx < this.currentQuestion;
      const interactiveAttrs = inert ? ' aria-disabled="true"' : ' role="button" tabindex="0"';
      html += `<div class="${classes.join(' ')}" data-index="${idx}" ${sectionAttr}${interactiveAttrs} aria-label="Question ${num}${state}"${current}>${num}</div>`;
    }
    grid.innerHTML = html;
  }

  updateNavigator() {
    this.renderNavigator();
  }

  selectAnswer(index) {
    // Tutor mode: once feedback is revealed the answer is final (changing it
    // would be meaningless after seeing the key).
    if (this.mode === 'tutor') {
      const cur = this.quizData.questions[this.currentQuestion];
      if (cur && this.tutorRevealed.has(cur.id)) return;
    }
    // CAT modes: once locked (the user has advanced past this question), the
    // answer is final — mirrors real CAT-ASVAB behavior. Non-CAT sectioned
    // navigation (diagnostic) still allows changing an answer freely.
    if (this.isCatMode() && this.lockedAnswers.has(this.quizData.questions[this.currentQuestion].id)) return;

    const question = this.quizData.questions[this.currentQuestion];
    this.answers[question.id] = index;

    // Mark revealed BEFORE persisting so a refresh right after answering keeps
    // the reveal/lock for this question (saveState serializes tutorRevealed).
    // Tutor mode also updates the interim Bayesian ability estimate right here
    // (instant feedback IS this mode's lock moment, and re-answering after
    // reveal is already blocked above, so this naturally only fires once).
    // CAT modes instead update at answer-lock time — see lockCurrentAnswer(),
    // called from nextQuestion()/advanceSection()/submitQuiz().
    if (this.mode === 'tutor') {
      this.tutorRevealed.add(question.id);
      this.updateInterimAbility(question);
    }
    this.hideAnswerRequired();
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

    // Sectioned tests: can only move within the active section.
    if (this.isSectioned()) {
      const range = this.getActiveRange();
      if (index < range.start || index >= range.end) return;
    }

    // Can only go to answered questions or the current question.
    const targetQuestion = this.quizData.questions[index];
    if (index > this.currentQuestion && this.answers[targetQuestion.id] === undefined) {
      return;
    }

    // CAT modes: navigation is forward-only — a locked answer can't be
    // revisited via the question navigator either.
    if (this.isCatMode() && index < this.currentQuestion) return;

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

    // Lock the just-answered question before moving on — Owen's interim
    // ability updates here in CAT modes (see lockCurrentAnswer()).
    if (this.isCatMode()) this.lockCurrentAnswer();

    if (this.isSectioned()) {
      const range = this.getActiveRange();
      if (this.currentQuestion < range.end - 1) {
        this.currentQuestion++;
        this.saveState();
        this.renderQuestion();
      } else if (this.activeSectionIndex >= this.sectionRanges.length - 1) {
        this.showSubmitConfirm(); // last question of the last section
      } else {
        this.advanceSection(); // finished this section early
      }
      return;
    }

    // Tutor / non-sectioned: free navigation across the whole test.
    if (this.currentQuestion < this.quizData.questions.length - 1) {
      this.currentQuestion++;
      this.saveState();
      this.renderQuestion();
    } else {
      this.showSubmitConfirm();
    }
  }

  showAnswerRequired() {
    const container = document.getElementById('answersContainer');
    if (container) {
      container.classList.add('shake');
      setTimeout(() => container.classList.remove('shake'), 500);
    }
    // A shake alone is cryptic (and invisible to screen readers) — say why.
    const msg = document.getElementById('answerRequiredMsg');
    if (msg) msg.hidden = false;
    const liveEl = document.getElementById('timerLive');
    if (liveEl) liveEl.textContent = 'Choose an answer to continue. On the real ASVAB you must answer every question before moving on.';
  }

  hideAnswerRequired() {
    const msg = document.getElementById('answerRequiredMsg');
    if (msg) msg.hidden = true;
  }

  prevQuestion() {
    // CAT modes: navigation is forward-only. The Prev button is hidden and
    // goToQuestion() already refuses to move backward, but this method is also
    // reachable directly via the ArrowLeft keyboard shortcut (bindEvents),
    // which bypasses both — so it needs its own guard.
    if (this.isCatMode()) return;
    const min = this.isSectioned() ? this.getActiveRange().start : 0;
    if (this.currentQuestion > min) {
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
      const subject = unanswered > 1 ? `${unanswered} questions weren't` : `${unanswered} question wasn't`;
      // The random-guess penalty only applies when IRT scoring will actually
      // run the incomplete-test penalty table (scoring.js sectionAbility) —
      // the full AFQT four, a full test, or single-section practice (see
      // appliesGuessPenalty()). Tutor, the diagnostic, and other custom
      // section subsets score by simple percent-correct (see submitQuiz), so
      // an unanswered question there just gets zero credit — see the
      // matching results.html copy in page-results.js's formatUnansweredNote
      // for the same distinction.
      message += this.appliesGuessPenalty()
        ? `\n\n⚠️ ${subject} answered. Your score will be adjusted as if ${unanswered > 1 ? 'they were' : 'it was'} a random guess.`
        : `\n\n⚠️ ${subject} answered. ${unanswered > 1 ? 'They' : 'It'} will get no credit.`;
    }
    if (flaggedCount > 0 && !this.isSectioned()) {
      message += `\n\n🚩 You have ${flaggedCount} flagged question${flaggedCount > 1 ? 's' : ''} for review. Cancel to go back to them.`;
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

    // Lock whatever the user was looking at when they hit submit — if they
    // selected an answer but never clicked Next, it must still count.
    this.lockCurrentAnswer();

    clearInterval(this.timerInterval);

    // Materialize any slots the user never reached so scoring and the review
    // page have complete question content. Unreached slots stay unanswered —
    // excluded from ability estimation and covered by the incomplete-test
    // penalty table instead (see js/penalty-table.js, js/scoring.js).
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
      const answered = this.answers[q.id] !== undefined;
      const userAnswer = this.answers[q.id];
      const isCorrect = userAnswer === q.correct;
      if (isCorrect) totalCorrect++;

      const sectionCode = q.sectionCode || this.quizData.sectionCode;
      if (!sectionResults[sectionCode]) {
        sectionResults[sectionCode] = {
          name: q.sectionName || this.quizData.section,
          correct: 0,
          total: 0,
          unanswered: 0,
          questions: []
        };
      }

      sectionResults[sectionCode].total++;
      if (isCorrect) sectionResults[sectionCode].correct++;
      if (!answered) sectionResults[sectionCode].unanswered++;

      sectionResults[sectionCode].questions.push({
        id: q.id,
        originalId: q.originalId,
        text: q.text,
        options: q.options,
        userAnswer: userAnswer,
        correctAnswer: q.correct,
        isCorrect: isCorrect,
        difficulty: q.difficulty || 3,
        answered: answered
      });
    });

    const totalQuestions = this.quizData.questions.length;
    const totalTime = this.quizData.timeLimit - this.timeRemaining;
    const score = Math.round((totalCorrect / totalQuestions) * 100);

    // Full IRT scoring: percentile + confidence band + per-section theta/sem/ss.
    // getScoreDetails itself gates on all four AFQT sections being present and
    // scoreable — same "AFQT is only valid with all four AFQT sections" rule as
    // before. Tutor sessions and diagnostics never score (preserved exactly).
    let details = null;
    if (this.mode !== 'tutor' && this.testKind !== 'diagnostic' &&
      typeof MissionASVABScoring !== 'undefined' && MissionASVABScoring.getScoreDetails) {
      try {
        details = MissionASVABScoring.getScoreDetails(sectionResults);
      } catch (e) {
        // scoring.js deliberately throws on a missing/corrupt incomplete-test
        // penalty entry rather than silently mis-scoring — but that must never
        // cost the user their finished test. Log it, fall back to "AFQT
        // unavailable" (same as the null-gate cases below), and keep going so
        // the result still saves and the user still reaches the results page.
        console.error('MissionASVABScoring.getScoreDetails threw during scoring:', e);
        details = null;
      }
    }

    // Single-section practice never has all 4 AFQT sections, so getScoreDetails
    // above is always null for it — but spec §10 still wants the section's own
    // standard score added (headline stays % correct; no AFQT/percentile,
    // which still requires the full AFQT set). Same MAP+SS routing as
    // getScoreDetails, via the single-section wrapper.
    let singleSectionDetails = null;
    if (!details && this.mode !== 'tutor' && this.testKind !== 'diagnostic' &&
      this.testSections && this.testSections.length === 1 &&
      typeof MissionASVABScoring !== 'undefined' && MissionASVABScoring.getSingleSectionDetails) {
      try {
        singleSectionDetails = MissionASVABScoring.getSingleSectionDetails(sectionResults, this.testSections[0]);
      } catch (e) {
        // Same rationale as the getScoreDetails guard above: never let a
        // scoring bug strand the user after state has already been cleared.
        console.error('MissionASVABScoring.getSingleSectionDetails threw during scoring:', e);
        singleSectionDetails = null;
      }
    }

    // Surface each scored section's theta/sem/ss onto its sectionResults entry
    // (4 AFQT codes for an AFQT practice test, or all 8 for a full test —
    // details.sections already reflects whichever set was scoreable; a single
    // scored section for single-section practice).
    if (details) {
      Object.keys(details.sections).forEach((code) => {
        if (!sectionResults[code]) return;
        const s = details.sections[code];
        sectionResults[code].theta = Math.round(s.theta * 100) / 100;
        sectionResults[code].sem = Math.round(s.sem * 100) / 100;
        sectionResults[code].ss = Math.round(s.ss);
      });
    } else if (singleSectionDetails) {
      const code = this.testSections[0];
      if (sectionResults[code]) {
        sectionResults[code].theta = Math.round(singleSectionDetails.theta * 100) / 100;
        sectionResults[code].sem = Math.round(singleSectionDetails.sem * 100) / 100;
        sectionResults[code].ss = Math.round(singleSectionDetails.ss);
      }
    }

    const afqtEstimate = details ? details.percentile : null;
    const afqtBand = details ? details.band : null;

    // Store results
    const completedAt = new Date().toISOString();
    const quizResults = {
      clientResultId: createClientResultId(completedAt),
      testType: this.testKind === 'diagnostic'
        ? 'diagnostic'
        : MissionASVABConfig.getTestTypeFromSections(this.testSections),
      section: this.quizData.section,
      sectionCode: this.quizData.sectionCode,
      mode: this.mode,
      sections: this.testSections,
      sectionResults: sectionResults,
      totalQuestions: totalQuestions,
      correct: totalCorrect,
      incorrect: totalQuestions - totalCorrect,
      score: score,
      afqt: afqtEstimate,
      afqtBand: afqtBand,
      scoringVersion: 'irt-v2',
      timeUsed: totalTime,
      timeLimit: this.quizData.timeLimit,
      completedAt: completedAt
    };

    localStorage.setItem('quizResults', JSON.stringify(quizResults));

    // SP2: remember the bank questions shown this test so retakes avoid them.
    const RS = (typeof MissionASVABRecentSeen !== 'undefined') ? MissionASVABRecentSeen
      : (typeof window !== 'undefined' ? window.MissionASVABRecentSeen : null);
    if (RS && typeof RS.record === 'function') {
      const bySection = {};
      this.quizData.questions.forEach((q) => {
        if (q.originalId && q.sectionCode) {
          (bySection[q.sectionCode] = bySection[q.sectionCode] || []).push(q.originalId);
        }
      });
      Object.keys(bySection).forEach((code) => {
        try { RS.record(code, bySection[code]); } catch (_) {}
      });
    }

    sessionStorage.removeItem('quizState');
    sessionStorage.removeItem('generatedTest');
    sessionStorage.removeItem('testConfig');

    const saved = await this.saveResultsToSupabase(quizResults);
    if (saved && saved.ok && saved.userId) {
      quizResults.ownerUserId = saved.userId;
      localStorage.setItem('quizResults', JSON.stringify(quizResults));
    }

    window.location.href = 'results.html';
  }

  async saveResultsToSupabase(quizResults) {
    if (typeof getClient !== 'function') return { skipped: true };
    const session = await getSession();
    if (!session) return { skipped: true };

    let lineScores = null;
    if (quizResults.mode !== 'tutor' && quizResults.testType !== 'diagnostic') {
      try {
        lineScores = MissionASVABScoring.calculateLineScores(quizResults.sectionResults);
      } catch (e) {
        // calculateLineScores deliberately throws on a missing/corrupt
        // incomplete-test penalty entry (scoring.js sectionAbility) — same as
        // the getScoreDetails guard in submitQuiz. By this point quizState/
        // generatedTest/testConfig are already cleared and the local result
        // is already saved, so a throw here must not strand the user on a
        // dead quiz page — log it and save with line_scores omitted instead.
        console.error('MissionASVABScoring.calculateLineScores threw during save:', e);
        lineScores = null;
      }
    }
    const strippedSections = {};
    // Compact per-question results: id + section + correct + difficulty only
    // (NO text/options), so the mistake history stays small. Powers weak-area
    // aggregation (see js/weak-areas.js) and (with difficulty) future re-scoring.
    const questionResults = [];
    if (quizResults.sectionResults) {
      for (const [code, data] of Object.entries(quizResults.sectionResults)) {
        strippedSections[code] = { correct: data.correct, total: data.total };
        // theta/sem/ss are only present for sections the IRT pipeline actually
        // scored (see submitQuiz) — omit them entirely rather than write nulls.
        if (typeof data.theta === 'number') strippedSections[code].theta = data.theta;
        if (typeof data.sem === 'number') strippedSections[code].sem = data.sem;
        if (typeof data.ss === 'number') strippedSections[code].ss = data.ss;
        (data.questions || []).forEach(q => {
          questionResults.push({
            id: q.originalId || q.id,
            section: code,
            correct: !!q.isCorrect,
            difficulty: q.difficulty || 3
          });
        });
      }
    }
    const payload = {
      user_id: session.user.id,
      client_result_id: quizResults.clientResultId,
      test_type: quizResults.testType || 'afqt',
      mode: quizResults.mode || 'timed',
      afqt_score: quizResults.afqt,
      section_scores: strippedSections,
      line_scores: lineScores,
      question_results: questionResults,
      scoring_version: 'irt-v2',
      taken_at: quizResults.completedAt
    };

    try {
      const { error } = await getClient().from('test_results').insert(payload);
      if (error && error.code !== '23505') {
        console.error('Supabase insert error:', error);
        this._queuePendingResult(payload, error.message);
        return { ok: false, error: error.message };
      }
      // We just confirmed connectivity — drain any previously queued results.
      if (typeof flushPendingTestResults === 'function') {
        try { flushPendingTestResults(); } catch (_) {}
      }
      return { ok: true, duplicate: !!error, userId: session.user.id };
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
        const option = e.target.closest && e.target.closest('.answer-option');
        if (!option) return;
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          e.stopPropagation();
          this.selectAnswer(parseInt(option.dataset.index));
          return;
        }
        // Radio pattern: arrows move focus BETWEEN OPTIONS while an option is
        // focused (the document-level arrow handler would otherwise hijack
        // ArrowRight to jump to the next question mid-choice).
        if (['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(e.key)) {
          e.preventDefault();
          e.stopPropagation();
          const options = Array.from(answersContainer.querySelectorAll('.answer-option'));
          const i = options.indexOf(option);
          const delta = (e.key === 'ArrowDown' || e.key === 'ArrowRight') ? 1 : -1;
          const next = options[(i + delta + options.length) % options.length];
          if (next && next.focus) next.focus();
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
      navigatorGrid.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
        const dot = e.target.closest && e.target.closest('.nav-dot');
        if (dot) {
          e.preventDefault();
          e.stopPropagation();
          this.goToQuestion(parseInt(dot.dataset.index));
        }
      });
    }

    // Keyboard navigation. Ignore keys typed into form fields so a future
    // input on this page can never silently change answers.
    document.addEventListener('keydown', (e) => {
      const t = e.target;
      if (t && typeof t.closest === 'function' && t.closest('input, textarea, select, [contenteditable]')) return;
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
        if (confirm('Exit the test? Your progress is saved in this browser tab. You can resume from the practice test page as long as you don\'t close the tab.')) {
          this.saveState();
          window.location.href = 'select-test.html';
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
