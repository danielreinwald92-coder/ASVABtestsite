const { test } = require('node:test');
const assert = require('node:assert');
const { loadDom } = require('../helpers/load');
const { loadEngine, fakeDoc } = require('../helpers/engine.js');

// Keyboard access: interactive study-guide elements must be focusable and
// announce as buttons; quiz navigator dots must be reachable and labeled.

test('study-guide back buttons are keyboard-focusable buttons', () => {
  const { document } = loadDom('study-guide.html');
  const backBtns = [...document.querySelectorAll('.back-btn')];
  assert.ok(backBtns.length >= 4, 'expected several back buttons');
  for (const el of backBtns) {
    assert.strictEqual(el.getAttribute('role'), 'button', 'back-btn needs role=button');
    assert.strictEqual(el.getAttribute('tabindex'), '0', 'back-btn needs tabindex=0');
  }
});

test('study-guide flashcard is keyboard-flippable', () => {
  const { document } = loadDom('study-guide.html');
  const card = document.getElementById('flashcard');
  assert.strictEqual(card.getAttribute('role'), 'button');
  assert.strictEqual(card.getAttribute('tabindex'), '0');
  assert.ok(card.getAttribute('aria-label'), 'flashcard needs an aria-label');
});

test('study-guide page JS activates role=button elements on Enter/Space', () => {
  const fs = require('fs');
  const path = require('path');
  const src = fs.readFileSync(path.join(__dirname, '..', '..', 'js/page-study-guide.js'), 'utf8');
  assert.ok(/role="button"|role=.button./.test(src) && /keydown/.test(src),
    'page-study-guide.js must wire keyboard activation for role=button cards');
});

test('quiz navigator dots are keyboard-accessible with labels', () => {
  const doc = fakeDoc();
  doc._els.navigatorGrid = { innerHTML: '' };
  const sandbox = loadEngine({
    document: doc,
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  });
  const engine = new sandbox.QuizEngine();
  engine.mode = 'timed';
  engine.sectionRanges = [{ code: 'AR', name: 'AR', start: 0, end: 2, timeLimit: 60 }];
  engine.activeSectionIndex = 0;
  engine.currentQuestion = 0;
  engine.answers = { 1: 0 };
  engine.flagged = new Set();
  engine.quizData = { questions: [
    { id: 1, sectionCode: 'AR' }, { id: 2, sectionCode: 'AR' },
  ] };
  engine.renderNavigator();
  const html = doc._els.navigatorGrid.innerHTML;
  assert.ok(html.includes('role="button"'), 'dots need role=button');
  assert.ok(html.includes('tabindex="0"'), 'dots need tabindex=0');
  assert.ok(/aria-label="[^"]*[Qq]uestion 1/.test(html), 'dots need an aria-label naming the question');
  assert.ok(html.includes('aria-current="true"'), 'current dot needs aria-current');
});
