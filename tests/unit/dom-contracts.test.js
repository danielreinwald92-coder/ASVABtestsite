const {test} = require('node:test');
const assert = require('node:assert');
const {loadDom} = require('../helpers/load.js');

function assertIds(document, page, ids) {
  for (const id of ids) {
    assert.ok(
      document.getElementById(id) !== null,
      `${page}: expected element #${id} to exist`,
    );
  }
}

// quiz.html — IDs collected from js/quiz-engine.js getElementById() calls.
test('quiz.html exposes the IDs quiz-engine.js depends on', () => {
  const {document} = loadDom('quiz.html');
  assertIds(document, 'quiz.html', [
    'answersContainer',
    'flagBtn',
    'navigatorGrid',
    'nextBtn',
    'prevBtn',
    'progressCount',
    'progressFill',
    'questionNumber',
    'questionText',
    'quitBtn',
    'timerDisplay',
    'timerLive',
  ]);
  // querySelector targets used by quiz-engine.js
  assert.ok(document.querySelector('.quiz-section'), 'quiz.html: missing .quiz-section');
  assert.ok(document.querySelector('.quiz-timer'), 'quiz.html: missing .quiz-timer');
});

test('dashboard.html exposes diagnostic + test-date controls', () => {
  const {document} = loadDom('dashboard.html');
  assertIds(document, 'dashboard.html', ['diagnosticBtn', 'testDateInput']);
});

test('results.html exposes AFQT score elements', () => {
  const {document} = loadDom('results.html');
  assertIds(document, 'results.html', ['afqtScore', 'afqtLabel', 'afqtPercentile']);
});

test('results.html no longer ships a recruiter contact form', () => {
  const {document} = loadDom('results.html');
  assert.strictEqual(document.querySelector('.recruiter-section'), null);
  assert.strictEqual(document.querySelector('input[name="phone"]'), null);
});

test('register.html exposes the IDs its inline script references', () => {
  const {document} = loadDom('register.html');
  assertIds(document, 'register.html', [
    'age',
    'education',
    'email',
    'errorMsg',
    'name',
    'password',
    'registerForm',
    'submitBtn',
    'successMsg',
    'zipcode',
  ]);
});

test('login.html exposes the IDs its inline script references', () => {
  const {document} = loadDom('login.html');
  assertIds(document, 'login.html', [
    'backToLoginBtn',
    'email',
    'forgotForm',
    'forgotSection',
    'loginBtn',
    'loginError',
    'loginForm',
    'loginSection',
    'password',
    'resetBtn',
    'resetEmail',
    'resetError',
    'resetSuccess',
    'showForgotBtn',
  ]);
});
