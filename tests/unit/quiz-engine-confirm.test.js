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
