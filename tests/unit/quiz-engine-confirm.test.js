const { test } = require('node:test');
const assert = require('node:assert');
const { loadEngine, fakeDoc } = require('../helpers/engine.js');

// 2.6 — last-question nextQuestion routes through the confirm step.
test('nextQuestion on the last question triggers the submit-confirm path', () => {
  const document = fakeDoc();
  let confirmCalled = false;
  const sandbox = loadEngine({
    document,
    confirm: () => {
      confirmCalled = true;
      return false; // decline → do not actually submit
    },
  });

  const engine = new sandbox.QuizEngine();
  engine.quizData = {
    questions: [{ id: 1, sectionCode: 'AR', sectionName: 'AR' }],
  };
  engine.answers = { 1: 0 };
  engine.currentQuestion = 0;

  let submitted = false;
  engine.submitQuiz = () => {
    submitted = true;
  };

  engine.nextQuestion();

  assert.strictEqual(confirmCalled, true, 'expected showSubmitConfirm to call confirm()');
  assert.strictEqual(submitted, false, 'declining confirm must not submit');
});

// 2.6 — startNewTest clears stale quizResults from localStorage.
test('startNewTest removes stale quizResults from localStorage', () => {
  const removed = [];
  const sandbox = loadEngine({
    localStorage: { removeItem: (k) => removed.push(k) },
    sessionStorage: { removeItem() {}, setItem() {} },
  });

  sandbox.QuizEngine.startNewTest(['AR']);

  assert.ok(removed.includes('quizResults'), 'expected quizResults to be removed');
});

// Task 9 review fix, narrowed by final-review fix 3 — the unanswered-question
// submit warning must only claim the IRT "random guess" penalty when
// appliesGuessPenalty() is true: the full AFQT four (quick/full/any custom
// superset containing them) or single-section practice — the only cases
// where scoring.js's incomplete-test penalty table actually runs (see
// js/scoring.js sectionAbility, getScoreDetails, getSingleSectionDetails).
// Tutor and diagnostic sessions score by simple percent-correct (quiz-
// engine.js submitQuiz), and so does a custom multi-section subset that
// doesn't include the full AFQT four — those unanswered questions get no
// credit, not a simulated random guess — see js/page-results.js's
// formatUnansweredNote for the matching results-page copy.
function unansweredConfirmMessage(engineOverrides) {
  const document = fakeDoc();
  let message = null;
  const sandbox = loadEngine({
    document,
    confirm: (msg) => {
      message = msg;
      return false; // decline → do not actually submit
    },
    MissionASVABConfig: { AFQT_SECTIONS: ['AR', 'WK', 'PC', 'MK'] },
  });

  const engine = new sandbox.QuizEngine();
  engine.quizData = {
    questions: [
      { id: 1, sectionCode: 'AR', sectionName: 'AR' },
      { id: 2, sectionCode: 'AR', sectionName: 'AR' },
    ],
  };
  engine.answers = { 1: 0 }; // question 2 is unanswered
  // Default: the full AFQT set, which genuinely runs the IRT penalty path.
  // Individual tests override testSections/mode/testKind to exercise the
  // other cases.
  engine.testSections = ['AR', 'WK', 'PC', 'MK'];
  Object.assign(engine, engineOverrides);

  engine.showSubmitConfirm();
  return message;
}

test('a full-AFQT-set submit warning claims the random-guess IRT penalty', () => {
  const message = unansweredConfirmMessage({});

  assert.match(message, /random guess/);
  assert.doesNotMatch(message, /no credit/);
});

test('tutor mode submit warning says unanswered questions get no credit, not a random guess', () => {
  const message = unansweredConfirmMessage({ mode: 'tutor' });

  assert.match(message, /no credit/);
  assert.doesNotMatch(message, /random guess/);
});

test('diagnostic submit warning says unanswered questions get no credit, not a random guess', () => {
  const message = unansweredConfirmMessage({ testKind: 'diagnostic' });

  assert.match(message, /no credit/);
  assert.doesNotMatch(message, /random guess/);
});

// Final-review fix 3 — a "custom" multi-section subset that does NOT include
// all 4 AFQT sections never runs through getScoreDetails (hasAll gate), so
// its unanswered items just get zero credit like tutor/diagnostic. isCatMode()
// alone would over-claim the random-guess penalty here; appliesGuessPenalty()
// must not.
test('a custom subset missing the AFQT four gets the honest "no credit" copy, not the random-guess claim', () => {
  const message = unansweredConfirmMessage({ testKind: 'custom', testSections: ['AR', 'GS'] });

  assert.match(message, /no credit/);
  assert.doesNotMatch(message, /random guess/);
});

// Final-review fix 2/3 — single-section timed practice now runs through
// getSingleSectionDetails (spec §10), which shares the same incomplete-test
// penalty path as getScoreDetails, so its submit warning must claim the
// random-guess penalty too.
test('single-section timed practice submit warning claims the random-guess IRT penalty', () => {
  const message = unansweredConfirmMessage({ testKind: 'single', testSections: ['AR'] });

  assert.match(message, /random guess/);
  assert.doesNotMatch(message, /no credit/);
});
