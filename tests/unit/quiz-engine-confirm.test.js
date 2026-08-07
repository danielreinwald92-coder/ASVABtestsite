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

// Task 9 review fix — the unanswered-question submit warning must only claim
// the IRT "random guess" penalty for CAT modes (quick/full, not tutor, not
// diagnostic). Tutor and diagnostic sessions score by simple percent-correct
// (quiz-engine.js submitQuiz), so an unanswered question there gets no
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
  });

  const engine = new sandbox.QuizEngine();
  engine.quizData = {
    questions: [
      { id: 1, sectionCode: 'AR', sectionName: 'AR' },
      { id: 2, sectionCode: 'AR', sectionName: 'AR' },
    ],
  };
  engine.answers = { 1: 0 }; // question 2 is unanswered
  Object.assign(engine, engineOverrides);

  engine.showSubmitConfirm();
  return message;
}

test('CAT mode submit warning claims the random-guess IRT penalty', () => {
  // Default engine state (mode 'timed', testKind 'custom') is CAT-scored.
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
