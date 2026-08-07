// Task 6: CAT answer locking, forward-only navigation, and v2 result payloads.
const { test } = require('node:test');
const assert = require('node:assert');
const { loadCore } = require('../helpers/load.js');
const { loadEngine, fakeDoc } = require('../helpers/engine.js');

function memSessionStorage() {
  const store = {};
  return {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    _store: store,
  };
}

// A minimal manually-built two-section (AR/WK) engine with pre-materialized
// content, so locking/navigation can be tested without the real question bank.
function twoSectionEngine() {
  const sandbox = loadEngine({
    document: fakeDoc(),
    sessionStorage: memSessionStorage(),
  });
  const engine = new sandbox.QuizEngine();
  engine.mode = 'timed';
  engine.testKind = 'quick';
  engine.testSections = ['AR', 'WK'];
  engine.quizData = {
    section: 'AFQT Practice Test', sectionCode: 'AR,WK', timeLimit: 100,
    questions: [
      { id: 1, sectionCode: 'AR', sectionName: 'AR', originalId: 'AR1', text: 'q1', options: ['a', 'b', 'c', 'd'], correct: 0, difficulty: 3 },
      { id: 2, sectionCode: 'AR', sectionName: 'AR', originalId: 'AR2', text: 'q2', options: ['a', 'b', 'c', 'd'], correct: 1, difficulty: 3 },
      { id: 3, sectionCode: 'WK', sectionName: 'WK', originalId: 'WK1', text: 'q3', options: ['a', 'b', 'c', 'd'], correct: 0, difficulty: 3 },
      { id: 4, sectionCode: 'WK', sectionName: 'WK', originalId: 'WK2', text: 'q4', options: ['a', 'b', 'c', 'd'], correct: 1, difficulty: 3 },
    ],
  };
  engine.buildSectionRanges();
  engine.activeSectionIndex = 0;
  engine.currentQuestion = 0;
  engine.answers = {};
  engine.abilityState = { AR: { mean: 0, variance: 1 }, WK: { mean: 0, variance: 1 } };
  engine.renderQuestion = () => {};
  engine.renderNavigator = () => {};
  engine.updateSectionHeader = () => {};
  return engine;
}

// --- 1. isCatMode() -----------------------------------------------------

test('isCatMode is true for quick/full timed tests, false for tutor and diagnostic', () => {
  const sandbox = loadEngine({ document: fakeDoc(), sessionStorage: memSessionStorage() });
  const engine = new sandbox.QuizEngine();
  engine.mode = 'timed';
  engine.testKind = 'quick';
  assert.strictEqual(engine.isCatMode(), true, 'quick + timed is CAT');

  engine.testKind = 'full';
  assert.strictEqual(engine.isCatMode(), true, 'full + timed is CAT');

  engine.mode = 'tutor';
  assert.strictEqual(engine.isCatMode(), false, 'tutor is never CAT');

  engine.mode = 'timed';
  engine.testKind = 'diagnostic';
  assert.strictEqual(engine.isCatMode(), false, 'diagnostic is never CAT');
});

// --- 2. Answer locking + forward-only navigation ------------------------

test('CAT mode locks an answer on nextQuestion: a back-reference selectAnswer and a backward goToQuestion are both refused', () => {
  const engine = twoSectionEngine();
  assert.strictEqual(engine.isCatMode(), true);

  engine.selectAnswer(0); // answer q1
  assert.strictEqual(engine.answers[1], 0);
  assert.strictEqual(engine.lockedAnswers.has(1), false, 'not locked until the user advances');

  engine.nextQuestion(); // locks q1, advances to q2
  assert.strictEqual(engine.currentQuestion, 1);
  assert.strictEqual(engine.lockedAnswers.has(1), true, 'locked on advance');

  // Simulate a reference back to the now-locked question and attempt to
  // change the answer — must be refused.
  engine.currentQuestion = 0;
  engine.selectAnswer(1);
  assert.strictEqual(engine.answers[1], 0, 'locked answer cannot be changed');

  // goToQuestion must not move backward in CAT mode either.
  engine.currentQuestion = 1;
  engine.goToQuestion(0);
  assert.strictEqual(engine.currentQuestion, 1, 'goToQuestion refuses to move backward in CAT mode');
});

// --- 3. Owen update timing ------------------------------------------------

test('Owen interim ability updates at lock time (nextQuestion), not at select time, in CAT mode', () => {
  const { context } = loadCore();
  const engine = (() => {
    const sandbox = loadEngine({
      document: fakeDoc(),
      sessionStorage: memSessionStorage(),
      MissionASVABIRT: context.window.MissionASVABIRT,
      MissionASVABIRTParams: context.window.MissionASVABIRTParams,
    });
    const e = new sandbox.QuizEngine();
    e.mode = 'timed';
    e.testKind = 'quick';
    e.testSections = ['AR', 'WK'];
    e.quizData = {
      section: 'x', sectionCode: 'AR,WK', timeLimit: 100,
      questions: [
        { id: 1, sectionCode: 'AR', sectionName: 'AR', originalId: 'AR1', text: 'q1', options: ['a', 'b', 'c', 'd'], correct: 0, difficulty: 3 },
        { id: 2, sectionCode: 'AR', sectionName: 'AR', originalId: 'AR2', text: 'q2', options: ['a', 'b', 'c', 'd'], correct: 1, difficulty: 3 },
      ],
    };
    e.buildSectionRanges();
    e.activeSectionIndex = 0;
    e.currentQuestion = 0;
    e.answers = {};
    e.abilityState = { AR: { mean: 0, variance: 1 } };
    e.renderQuestion = () => {};
    e.renderNavigator = () => {};
    e.updateSectionHeader = () => {};
    return e;
  })();

  engine.selectAnswer(0); // correct answer
  assert.strictEqual(engine.abilityState.AR.mean, 0, 'unchanged immediately after selectAnswer');
  assert.strictEqual(engine.abilityState.AR.variance, 1, 'unchanged immediately after selectAnswer');

  engine.nextQuestion(); // locks q1 -> Owen update fires here
  assert.notStrictEqual(engine.abilityState.AR.mean, 0, 'mean moved after lock');
  assert.ok(engine.abilityState.AR.variance < 1, `variance should decrease after lock, got ${engine.abilityState.AR.variance}`);
});

// --- 4. Diagnostic navigation is untouched -------------------------------

test('diagnostic mode still allows goToQuestion to move backward (isCatMode is false)', () => {
  const sandbox = loadEngine({ document: fakeDoc(), sessionStorage: memSessionStorage() });
  const engine = new sandbox.QuizEngine();
  engine.mode = 'timed';
  engine.testKind = 'diagnostic';
  engine.testSections = ['AR'];
  engine.quizData = {
    section: 'Starting-Point Diagnostic', sectionCode: 'AR', timeLimit: 100,
    questions: [
      { id: 1, sectionCode: 'AR', sectionName: 'AR', originalId: 'AR1', text: 'q1', options: ['a', 'b', 'c', 'd'], correct: 0 },
      { id: 2, sectionCode: 'AR', sectionName: 'AR', originalId: 'AR2', text: 'q2', options: ['a', 'b', 'c', 'd'], correct: 1 },
    ],
  };
  engine.buildSectionRanges();
  engine.activeSectionIndex = 0;
  engine.answers = { 1: 0, 2: 1 };
  engine.currentQuestion = 1;
  engine.renderQuestion = () => {};

  assert.strictEqual(engine.isCatMode(), false);
  engine.goToQuestion(0);
  assert.strictEqual(engine.currentQuestion, 0, 'diagnostic can still navigate backward');
});

// --- lockedAnswers persistence (mirrors tutorRevealed) -------------------

test('lockedAnswers persists through saveState -> loadSavedState, same as tutorRevealed', () => {
  const sessionStorage = memSessionStorage();
  const quizData = {
    section: 'x', sectionCode: 'AR', timeLimit: 100,
    questions: [
      { id: 1, sectionCode: 'AR', sectionName: 'AR', originalId: 'AR1', text: 'q1', options: ['a', 'b', 'c', 'd'], correct: 0, difficulty: 3 },
      { id: 2, sectionCode: 'AR', sectionName: 'AR', originalId: 'AR2', text: 'q2', options: ['a', 'b', 'c', 'd'], correct: 1, difficulty: 3 },
    ],
  };

  const s1 = loadEngine({ document: fakeDoc(), sessionStorage });
  const e1 = new s1.QuizEngine();
  e1.mode = 'timed';
  e1.testKind = 'quick';
  e1.testSections = ['AR'];
  e1.quizData = quizData;
  e1.buildSectionRanges();
  e1.answers = { 1: 0 };
  e1.currentQuestion = 0;
  e1.abilityState = { AR: { mean: 0, variance: 1 } };
  e1.renderQuestion = () => {};
  e1.lockCurrentAnswer();
  assert.ok(e1.lockedAnswers.has(1), 'locked before save');
  e1.saveState();
  sessionStorage.setItem('generatedTest', JSON.stringify(quizData));

  const s2 = loadEngine({
    document: fakeDoc(),
    sessionStorage,
    QuizManager: {
      getSectionInfo: (code) => ({ name: code, timeLimit: 100, questionsPerTest: 2 }),
      getAdaptiveQuestionPool: () => ({ byDifficulty: {} }),
    },
  });
  const e2 = new s2.QuizEngine();
  e2.mode = 'timed';
  e2.testSections = ['AR'];
  const restored = e2.loadSavedState();
  assert.strictEqual(restored, true);
  assert.ok(e2.lockedAnswers.has(1), 'lockedAnswers restored after resume');
});

// --- 5. Submit produces the v2 payload -----------------------------------

function driveToCompletion(engine) {
  engine.renderQuestion = () => {};
  engine.renderNavigator = () => {};
  engine.updateSectionHeader = () => {};
  engine.startTimer = () => {};
  const total = engine.quizData.questions.length;
  for (let i = 0; i < total; i++) {
    engine.currentQuestion = i;
    engine.materializeSlot(i);
    const q = engine.quizData.questions[i];
    engine.selectAnswer(q.correct);
    engine.lockCurrentAnswer(); // same lock nextQuestion()/advanceSection() would apply
  }
}

function quickSubmitHarness(sections) {
  const { config, scoring, context } = loadCore();
  const testConfig = JSON.stringify({ type: sections.length > 4 ? 'full' : 'quick', sections, mode: 'timed' });
  const stored = {};
  const document = fakeDoc();
  document._els.nextBtn = { disabled: false };
  const sandbox = loadEngine({
    document,
    URLSearchParams,
    window: { location: { search: '', href: '' } },
    localStorage: { setItem: (k, v) => { stored[k] = v; }, removeItem() {} },
    sessionStorage: {
      getItem: (key) => (key === 'testConfig' ? testConfig : null),
      setItem() {}, removeItem() {}
    },
    MissionASVABConfig: config,
    MissionASVABScoring: scoring,
    QuizManager: context.window.QuizManager,
    MissionASVABIRT: context.window.MissionASVABIRT,
    MissionASVABIRTParams: context.window.MissionASVABIRTParams,
  });
  const engine = new sandbox.QuizEngine();
  engine.loadTestConfig();
  engine.generateNewTest();
  engine.saveResultsToSupabase = async () => ({ skipped: true });
  return { engine, stored };
}

test('submitting a completed AFQT (4-section) quick test produces scoringVersion, a valid afqtBand, and per-section theta/sem/ss', async () => {
  const { engine, stored } = quickSubmitHarness(['AR', 'WK', 'PC', 'MK']);
  driveToCompletion(engine);
  await engine.submitQuiz();

  const results = JSON.parse(stored.quizResults);
  assert.strictEqual(results.scoringVersion, 'irt-v2');
  assert.ok(results.afqtBand, 'afqtBand present');
  assert.ok(
    results.afqtBand.low <= results.afqt && results.afqt <= results.afqtBand.high,
    `expected afqt (${results.afqt}) within band [${results.afqtBand.low}, ${results.afqtBand.high}]`
  );

  const codes = Object.keys(results.sectionResults);
  assert.deepStrictEqual(codes.sort(), ['AR', 'MK', 'PC', 'WK']);
  for (const [code, data] of Object.entries(results.sectionResults)) {
    assert.ok(Number.isFinite(data.theta), `${code} theta finite`);
    assert.ok(Number.isFinite(data.sem), `${code} sem finite`);
    assert.ok(Number.isFinite(data.ss), `${code} ss finite`);
    data.questions.forEach((q) => {
      assert.ok(q.difficulty >= 1 && q.difficulty <= 5, `${code} question difficulty in range, got ${q.difficulty}`);
      assert.strictEqual(q.answered, true);
    });
  }
});

test('submitting a completed full (8-section) test surfaces theta/sem/ss for all 8 section codes', async () => {
  const { engine, stored } = quickSubmitHarness(['GS', 'AR', 'WK', 'PC', 'MK', 'EI', 'AS', 'MC']);
  driveToCompletion(engine);
  await engine.submitQuiz();

  const results = JSON.parse(stored.quizResults);
  const codes = Object.keys(results.sectionResults);
  assert.deepStrictEqual(codes.sort(), ['AR', 'AS', 'EI', 'GS', 'MC', 'MK', 'PC', 'WK']);
  for (const [code, data] of Object.entries(results.sectionResults)) {
    assert.ok(Number.isFinite(data.theta), `${code} theta finite`);
    assert.ok(Number.isFinite(data.sem), `${code} sem finite`);
    assert.ok(Number.isFinite(data.ss), `${code} ss finite`);
  }
});

// --- 6. Unanswered handling routes through the penalty table -------------

function manualEngineWithSections(sectionSpecs) {
  const { config, scoring } = loadCore();
  const stored = {};
  const document = fakeDoc();
  document._els.nextBtn = { disabled: false };
  const sandbox = loadEngine({
    document,
    window: { location: { href: '' } },
    localStorage: { setItem: (k, v) => { stored[k] = v; }, removeItem() {} },
    sessionStorage: { setItem() {}, removeItem() {}, getItem: () => null },
    MissionASVABConfig: config,
    MissionASVABScoring: scoring,
  });
  const engine = new sandbox.QuizEngine();
  engine.mode = 'timed';
  engine.testKind = 'quick';
  engine.testSections = sectionSpecs.map((s) => s.code);
  let id = 0;
  const questions = [];
  sectionSpecs.forEach((spec) => {
    for (let i = 0; i < spec.count; i++) {
      id++;
      questions.push({
        id, sectionCode: spec.code, sectionName: spec.code,
        originalId: `${spec.code}${i + 1}`, text: `${spec.code} question ${i + 1}`,
        options: ['a', 'b', 'c', 'd'], correct: 0, difficulty: 3,
      });
    }
  });
  engine.quizData = {
    section: 'AFQT Practice Test', sectionCode: sectionSpecs.map((s) => s.code).join(','),
    timeLimit: 100, questions,
  };
  engine.answers = {};
  engine.timeRemaining = 50;
  engine.materializeSlot = () => {}; // content is already fully pre-set above
  engine.saveResultsToSupabase = async () => ({ skipped: true });
  return { engine, stored };
}

test('a section with 5 unreached slots reports unanswered:5, marks those records answered:false, and AFQT still scores via the penalty path', async () => {
  const { engine, stored } = manualEngineWithSections([
    { code: 'AR', count: 3 }, { code: 'WK', count: 5 }, { code: 'PC', count: 3 }, { code: 'MK', count: 3 },
  ]);
  // Answer everything except WK — simulates running out of time before WK.
  engine.quizData.questions.forEach((q) => {
    if (q.sectionCode !== 'WK') engine.answers[q.id] = q.correct;
  });

  await engine.submitQuiz();

  const results = JSON.parse(stored.quizResults);
  const wk = results.sectionResults.WK;
  assert.strictEqual(wk.unanswered, 5);
  assert.strictEqual(wk.questions.length, 5);
  wk.questions.forEach((q) => assert.strictEqual(q.answered, false));
  assert.ok(Number.isFinite(results.afqt), `AFQT should compute via the penalty path, got ${results.afqt}`);
});

// --- 7. Coordinator fix-loop: prevQuestion() forward-only guard ----------
// (Critical 1) prevQuestion() is reachable directly via the ArrowLeft keyboard
// shortcut, bypassing both the hidden Prev button and goToQuestion()'s guard.
// The regression must drive currentQuestion forward through the real
// navigation API (nextQuestion), not by assigning engine.currentQuestion
// directly — that's exactly how the original hole passed review unnoticed.

test('prevQuestion() is a no-op in CAT mode after advancing via the real nextQuestion() API', () => {
  const engine = twoSectionEngine();
  engine.selectAnswer(0);
  engine.nextQuestion(); // real navigation: locks q1, advances currentQuestion to 1
  assert.strictEqual(engine.currentQuestion, 1);

  engine.prevQuestion(); // simulates the ArrowLeft keyboard shortcut
  assert.strictEqual(engine.currentQuestion, 1, 'prevQuestion must not move backward in CAT mode');
});

test('prevQuestion() still moves backward for a non-CAT sectioned test (diagnostic)', () => {
  const sandbox = loadEngine({ document: fakeDoc(), sessionStorage: memSessionStorage() });
  const engine = new sandbox.QuizEngine();
  engine.mode = 'timed';
  engine.testKind = 'diagnostic';
  engine.testSections = ['AR'];
  engine.quizData = {
    section: 'Starting-Point Diagnostic', sectionCode: 'AR', timeLimit: 100,
    questions: [
      { id: 1, sectionCode: 'AR', sectionName: 'AR', originalId: 'AR1', text: 'q1', options: ['a', 'b', 'c', 'd'], correct: 0 },
      { id: 2, sectionCode: 'AR', sectionName: 'AR', originalId: 'AR2', text: 'q2', options: ['a', 'b', 'c', 'd'], correct: 1 },
    ],
  };
  engine.buildSectionRanges();
  engine.activeSectionIndex = 0;
  engine.answers = { 1: 0, 2: 1 };
  engine.currentQuestion = 1;
  engine.renderQuestion = () => {};

  assert.strictEqual(engine.isCatMode(), false);
  engine.prevQuestion();
  assert.strictEqual(engine.currentQuestion, 0, 'diagnostic prevQuestion still works');
});

// --- 8. Coordinator fix-loop: a throwing getScoreDetails must not lose the result ---
// (Important 2) getScoreDetails throws on a missing/corrupt penalty-table entry
// by design (scoring.js). That must never abort submitQuiz before quizResults is
// saved and the redirect fires — the user's finished test must not vanish.

test('submitQuiz still saves quizResults and navigates to results.html even if getScoreDetails throws', async () => {
  const stored = {};
  const document = fakeDoc();
  document._els.nextBtn = { disabled: false };
  const win = { location: { href: '' } };
  const sandbox = loadEngine({
    document,
    window: win,
    localStorage: { setItem: (k, v) => { stored[k] = v; }, removeItem() {} },
    sessionStorage: { setItem() {}, removeItem() {}, getItem: () => null },
    MissionASVABConfig: { getTestTypeFromSections: () => 'afqt' },
    MissionASVABScoring: {
      getScoreDetails: () => { throw new Error('missing incomplete-test penalty for WK unanswered=5'); },
      calculateLineScores: () => null,
    },
  });
  const engine = new sandbox.QuizEngine();
  engine.mode = 'timed';
  engine.testKind = 'quick';
  engine.testSections = ['AR', 'WK', 'PC', 'MK'];
  engine.quizData = {
    section: 'AFQT Practice Test', sectionCode: 'AR,WK,PC,MK', timeLimit: 100,
    questions: [
      { id: 1, sectionCode: 'AR', sectionName: 'AR', originalId: 'AR1', text: 'q1', options: ['a', 'b', 'c', 'd'], correct: 0, difficulty: 3 },
      { id: 2, sectionCode: 'WK', sectionName: 'WK', originalId: 'WK1', text: 'q2', options: ['a', 'b', 'c', 'd'], correct: 0, difficulty: 3 },
      { id: 3, sectionCode: 'PC', sectionName: 'PC', originalId: 'PC1', text: 'q3', options: ['a', 'b', 'c', 'd'], correct: 0, difficulty: 3 },
      { id: 4, sectionCode: 'MK', sectionName: 'MK', originalId: 'MK1', text: 'q4', options: ['a', 'b', 'c', 'd'], correct: 0, difficulty: 3 },
    ],
  };
  engine.answers = { 1: 0, 2: 0, 3: 0, 4: 0 };
  engine.timeRemaining = 50;
  engine.materializeSlot = () => {};
  engine.saveResultsToSupabase = async () => ({ skipped: true });

  await assert.doesNotReject(() => engine.submitQuiz());

  assert.ok(stored.quizResults, 'quizResults was still persisted despite the throw');
  const results = JSON.parse(stored.quizResults);
  assert.strictEqual(results.afqt, null, 'AFQT falls back to unavailable rather than losing the result');
  assert.strictEqual(results.correct, 4, 'the rest of the result is intact');
  assert.strictEqual(win.location.href, 'results.html', 'still navigates to results');
});

// --- 9. Coordinator fix-loop: flag button is a dead affordance in CAT mode ---
// (Important 3) A flagged question can never be revisited in CAT mode
// (forward-only navigation), so the flag button must be hidden there — but
// stay visible in tutor/diagnostic, where flag-and-come-back is meaningful.

function fullRenderDom() {
  const doc = fakeDoc();
  const mk = () => ({ textContent: '', innerHTML: '', style: {}, setAttribute() {}, classList: { add() {}, remove() {} } });
  Object.assign(doc._els, {
    questionNumber: mk(), questionText: mk(), progressFill: mk(), progressCount: mk(),
    answersContainer: mk(), prevBtn: mk(), nextBtn: mk(), flagBtn: mk(),
  });
  return doc;
}

function renderableSingleQuestionEngine(doc) {
  const sandbox = loadEngine({ document: doc, sessionStorage: memSessionStorage() });
  const engine = new sandbox.QuizEngine();
  engine.mode = 'timed';
  engine.testKind = 'quick';
  engine.testSections = ['AR'];
  engine.quizData = {
    section: 'AFQT Practice Test', sectionCode: 'AR', timeLimit: 100,
    questions: [
      { id: 1, sectionCode: 'AR', sectionName: 'AR', originalId: 'AR1', text: 'q1', options: ['a', 'b', 'c', 'd'], correct: 0, difficulty: 3 },
    ],
  };
  engine.buildSectionRanges();
  engine.activeSectionIndex = 0;
  engine.currentQuestion = 0;
  engine.answers = {};
  engine.materializeSlot = () => {};
  engine.updateSectionHeader = () => {};
  engine.updateNavigator = () => {};
  return engine;
}

test('flag button is hidden in CAT mode, visible in diagnostic and tutor', () => {
  const doc = fullRenderDom();
  const engine = renderableSingleQuestionEngine(doc);

  assert.strictEqual(engine.isCatMode(), true);
  engine.renderQuestion();
  assert.strictEqual(doc._els.flagBtn.style.display, 'none', 'hidden in CAT mode');

  engine.testKind = 'diagnostic';
  engine.renderQuestion();
  assert.notStrictEqual(doc._els.flagBtn.style.display, 'none', 'visible in diagnostic');

  engine.testKind = 'quick';
  engine.mode = 'tutor';
  engine.renderQuestion();
  assert.notStrictEqual(doc._els.flagBtn.style.display, 'none', 'visible in tutor');
});

// --- 10. Coordinator fix-loop: inert backward nav dots are an a11y trap ---
// (Important 4) In CAT mode goToQuestion() refuses to move backward, so a
// nav dot for an already-passed question must not present as an interactive
// control (role="button" tabindex="0") that silently does nothing on activation.

function catEngineTwoAR() {
  const doc = fakeDoc();
  doc._els.navigatorGrid = { innerHTML: '' };
  const sandbox = loadEngine({ document: doc, sessionStorage: memSessionStorage() });
  const engine = new sandbox.QuizEngine();
  engine.mode = 'timed';
  engine.testKind = 'quick';
  engine.testSections = ['AR'];
  engine.quizData = {
    section: 'x', sectionCode: 'AR', timeLimit: 100,
    questions: [
      { id: 1, sectionCode: 'AR', sectionName: 'AR', originalId: 'AR1', text: 'q1', options: ['a', 'b', 'c', 'd'], correct: 0, difficulty: 3 },
      { id: 2, sectionCode: 'AR', sectionName: 'AR', originalId: 'AR2', text: 'q2', options: ['a', 'b', 'c', 'd'], correct: 1, difficulty: 3 },
    ],
  };
  engine.buildSectionRanges();
  engine.activeSectionIndex = 0;
  engine.answers = {};
  engine.flagged = new Set();
  return { engine, doc };
}

function dotFor(html, idx) {
  const m = html.match(new RegExp(`<div class="[^"]*" data-index="${idx}"[^>]*>`));
  assert.ok(m, `dot for index ${idx} found`);
  return m[0];
}

test('CAT mode navigator: already-passed dots drop role/tabindex and gain aria-disabled; the current dot stays interactive', () => {
  const { engine, doc } = catEngineTwoAR();
  engine.answers = { 1: 0 };
  engine.currentQuestion = 1; // simulates having locked/advanced past question 1
  engine.renderNavigator();
  const html = doc._els.navigatorGrid.innerHTML;

  const dot0 = dotFor(html, 0); // already passed — inert
  assert.ok(!dot0.includes('role="button"'), 'passed dot has no role=button');
  assert.ok(!dot0.includes('tabindex="0"'), 'passed dot has no tabindex');
  assert.ok(dot0.includes('aria-disabled="true"'), 'passed dot is marked aria-disabled');

  const dot1 = dotFor(html, 1); // current — still interactive
  assert.ok(dot1.includes('role="button"'), 'current dot is still interactive');
  assert.ok(dot1.includes('tabindex="0"'), 'current dot is still interactive');
  assert.ok(!dot1.includes('aria-disabled'), 'current dot is not disabled');
});

test('non-CAT (diagnostic) navigator: dots stay fully interactive everywhere', () => {
  const { engine, doc } = catEngineTwoAR();
  engine.testKind = 'diagnostic';
  engine.answers = { 1: 0 };
  engine.currentQuestion = 1;
  assert.strictEqual(engine.isCatMode(), false);
  engine.renderNavigator();
  const html = doc._els.navigatorGrid.innerHTML;

  const dot0 = dotFor(html, 0);
  assert.ok(dot0.includes('role="button"') && dot0.includes('tabindex="0"'), 'diagnostic dots remain fully interactive');
  assert.ok(!dot0.includes('aria-disabled'), 'diagnostic dots are never disabled');
});
