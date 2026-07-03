const { test } = require('node:test');
const assert = require('node:assert');
const { loadEngine, fakeDoc } = require('../helpers/engine.js');

function tutorSandbox(search) {
  // Plan intent: engine reads mode/section from the URL search string. The vm
  // sandbox lacks the browser globals the real loadTestConfig() relies on
  // (URLSearchParams + window.location), so supply them here. Production code is
  // unchanged and still reads window.location.search exactly as the plan wrote it.
  const location = { search };
  return loadEngine({
    URLSearchParams,
    document: fakeDoc(),
    location,
    window: { location },
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  });
}

test('engine reads mode=tutor from the URL', () => {
  const sandbox = tutorSandbox('?mode=tutor&section=AR');
  const engine = new sandbox.QuizEngine();
  engine.loadTestConfig();
  assert.strictEqual(engine.mode, 'tutor');
});

test('engine defaults to timed mode with no mode param', () => {
  const sandbox = tutorSandbox('?section=AR');
  const engine = new sandbox.QuizEngine();
  engine.loadTestConfig();
  assert.strictEqual(engine.mode, 'timed');
});

test('startTimer is skipped in tutor mode', () => {
  const sandbox = tutorSandbox('?mode=tutor&section=AR');
  const engine = new sandbox.QuizEngine();
  engine.mode = 'tutor';
  let started = false;
  engine.startTimer = () => { started = true; };
  engine.maybeStartTimer();
  assert.strictEqual(started, false);
});

test('startTimer runs in timed mode', () => {
  const sandbox = tutorSandbox('?section=AR');
  const engine = new sandbox.QuizEngine();
  engine.mode = 'timed';
  let started = false;
  engine.startTimer = () => { started = true; };
  engine.maybeStartTimer();
  assert.strictEqual(started, true);
});

test('selecting an answer in tutor mode reveals it and locks re-answers', () => {
  const sandbox = loadEngine({
    document: fakeDoc(),
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  });
  const engine = new sandbox.QuizEngine();
  engine.mode = 'tutor';
  engine.quizData = { questions: [{ id: 1, originalId: 'AR001', sectionCode: 'AR', correct: 2, difficulty: 3 }] };
  engine.answers = {};
  engine.currentQuestion = 0;
  let renders = 0;
  engine.renderQuestion = () => { renders++; };

  engine.selectAnswer(0); // wrong
  assert.strictEqual(engine.answers[1], 0, 'answer recorded');
  assert.ok(engine.tutorRevealed.has(1), 'slot marked revealed');

  engine.selectAnswer(2); // attempt to change after reveal — must be ignored
  assert.strictEqual(engine.answers[1], 0, 'answer stays locked after reveal');
});

test('timed mode still allows changing an answer', () => {
  const sandbox = loadEngine({
    document: fakeDoc(),
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  });
  const engine = new sandbox.QuizEngine();
  engine.mode = 'timed';
  engine.quizData = { questions: [{ id: 1, originalId: 'AR001', sectionCode: 'AR', correct: 2, difficulty: 3 }] };
  engine.answers = {};
  engine.currentQuestion = 0;
  engine.renderQuestion = () => {};
  engine.selectAnswer(0);
  engine.selectAnswer(3);
  assert.strictEqual(engine.answers[1], 3, 'timed answers remain changeable');
});

test('tutor submit stores mode=tutor with a null AFQT', () => {
  const stored = {};
  const sandbox = loadEngine({
    document: fakeDoc(),
    // submitQuiz() ends with window.location.href = 'results.html'; supply the
    // browser global (matches tests/unit/quiz-engine-submit.test.js). Production
    // is unchanged. The quizResults are written to localStorage before that line.
    window: { location: { href: '' } },
    localStorage: { setItem: (k, v) => { stored[k] = v; }, removeItem() {} },
    sessionStorage: { removeItem() {}, setItem() {} },
    MissionASVABConfig: { getTestTypeFromSections: () => 'custom' },
    MissionASVABScoring: { calculateAFQTEstimate: () => 62, calculateLineScores: () => ({}) },
  });
  const engine = new sandbox.QuizEngine();
  engine.mode = 'tutor';
  engine.testSections = ['AR'];
  engine.quizData = {
    section: 'Arithmetic Reasoning', sectionCode: 'AR', timeLimit: 0,
    questions: [{ id: 1, originalId: 'AR001', sectionCode: 'AR', sectionName: 'Arithmetic Reasoning', text: 'q', options: ['a','b','c','d'], correct: 1 }],
  };
  engine.answers = { 1: 1 };
  engine.timeRemaining = 0;
  engine.saveResultsToSupabase = async () => ({ skipped: true });
  engine.materializeSlot = () => {};

  return engine.submitQuiz().then(() => {
    const results = JSON.parse(stored.quizResults);
    assert.strictEqual(results.mode, 'tutor');
    assert.strictEqual(results.afqt, null, 'tutor sessions carry no AFQT');
  });
});

test('timed submit still computes an AFQT', () => {
  const stored = {};
  const sandbox = loadEngine({
    document: fakeDoc(),
    window: { location: { href: '' } },
    localStorage: { setItem: (k, v) => { stored[k] = v; }, removeItem() {} },
    sessionStorage: { removeItem() {}, setItem() {} },
    MissionASVABConfig: { getTestTypeFromSections: () => 'afqt' },
    MissionASVABScoring: { calculateAFQTEstimate: () => 62, calculateLineScores: () => ({}) },
  });
  const engine = new sandbox.QuizEngine();
  engine.mode = 'timed';
  engine.testSections = ['AR', 'WK', 'PC', 'MK'];
  engine.quizData = { section: 'AR', sectionCode: 'AR', timeLimit: 100,
    questions: [{ id: 1, originalId: 'AR001', sectionCode: 'AR', sectionName: 'AR', text: 'q', options: ['a','b','c','d'], correct: 1 }] };
  engine.answers = { 1: 1 };
  engine.timeRemaining = 40;
  engine.saveResultsToSupabase = async () => ({ skipped: true });
  engine.materializeSlot = () => {};

  return engine.submitQuiz().then(() => {
    const results = JSON.parse(stored.quizResults);
    assert.strictEqual(results.mode, 'timed');
    assert.strictEqual(results.afqt, 62);
  });
});

// Regression: tutorRevealed must survive a save/resume cycle, or a refresh mid-
// session drops the answer-lock and feedback for already-answered questions.
test('tutorRevealed persists through saveState -> loadSavedState', () => {
  const store = {};
  const sessionStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
  };
  const quizData = {
    section: 'AR', sectionCode: 'AR', timeLimit: 0,
    questions: [{ id: 1, originalId: 'AR001', sectionCode: 'AR', correct: 2 }],
  };

  // First engine: reveal a slot in tutor mode, then persist.
  const s1 = loadEngine({ document: fakeDoc(), sessionStorage });
  const e1 = new s1.QuizEngine();
  e1.mode = 'tutor';
  e1.quizData = quizData;
  e1.answers = { 1: 0 };
  e1.currentQuestion = 0;
  e1.renderQuestion = () => {};
  e1.selectAnswer(0); // reveals slot 1
  assert.ok(e1.tutorRevealed.has(1), 'slot revealed before save');
  store.generatedTest = JSON.stringify(quizData); // loadSavedState needs both keys

  // Second engine (simulated refresh): restore and confirm the lock is back.
  const s2 = loadEngine({ document: fakeDoc(), sessionStorage });
  const e2 = new s2.QuizEngine();
  e2.mode = 'tutor';
  e2.testSections = ['AR'];
  e2.questionPools = { AR: [] };
  const restored = e2.loadSavedState();
  assert.strictEqual(restored, true, 'saved state should load');
  assert.ok(e2.tutorRevealed.has(1), 'tutorRevealed restored after resume');

  // And the answer stays locked.
  e2.renderQuestion = () => {};
  e2.selectAnswer(1);
  assert.strictEqual(e2.answers[1], 0, 'restored reveal keeps the answer locked');
});
