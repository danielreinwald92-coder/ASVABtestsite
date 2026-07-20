const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { loadDom, runPageScript, makeLocalStorage, rootDir } = require('../helpers/load.js');
const { loadEngine } = require('../helpers/engine.js');

// 3.3(a) — select-test.html test-type cards are keyboard operable.
test('select-test: test-type cards get role/tabindex and respond to Enter', () => {
  // SP2: the page moved from radio-card-only selection to the practice hub
  // (section checklist + preset cards). The cards remain keyboard-operable radios;
  // this test still verifies that. Anchor on a function in the rewritten file and
  // give the mocks what the hub wiring reads.
  const AFQT = ['AR', 'WK', 'PC', 'MK'];
  const FULL = ['GS', 'AR', 'WK', 'PC', 'MK', 'EI', 'AS', 'MC'];
  const config = {
    getSectionsForType: (t) => (t === 'full' ? FULL.slice() : AFQT.slice()),
    getTestTypeFromSections: (s) => {
      if (s.length === AFQT.length && AFQT.every((c, i) => s[i] === c)) return 'afqt';
      if (s.length === FULL.length && FULL.every((c, i) => s[i] === c)) return 'full';
      return s.length === 1 ? 'single' : 'custom';
    },
  };
  const { dom, document } = runPageScript('select-test.html', 'syncPickerUI', {
    localStorage: makeLocalStorage(),
    globals: {
      sessionStorage: makeLocalStorage(),
      MissionASVABConfig: config,
      QuizManager: { getSectionInfo: (c) => ({ name: c, questionsPerTest: 10, timeLimit: 600 }) },
    },
  });

  // Radiogroup container present (static markup).
  const grid = document.querySelector('.test-type-grid');
  assert.strictEqual(grid.getAttribute('role'), 'radiogroup');

  const cards = [...document.querySelectorAll('.test-type-card')];
  assert.ok(cards.length >= 2, 'expected at least two test-type cards');
  for (const card of cards) {
    assert.strictEqual(card.getAttribute('tabindex'), '0', 'card should be focusable');
    assert.strictEqual(card.getAttribute('role'), 'radio', 'card should be a radio');
    assert.ok(card.hasAttribute('aria-checked'), 'card should expose aria-checked');
  }

  const full = document.querySelector('.test-type-card[data-type="full"]');
  const quick = document.querySelector('.test-type-card[data-type="quick"]');
  const diagnostic = document.querySelector('.test-type-card[data-type="diagnostic"]');
  assert.strictEqual(diagnostic.classList.contains('selected'), true, 'diagnostic selected by default');

  // Enter on the "full" card selects it.
  full.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  assert.strictEqual(full.classList.contains('selected'), true, 'Enter selects the full card');
  assert.strictEqual(full.getAttribute('aria-checked'), 'true');
  assert.strictEqual(diagnostic.classList.contains('selected'), false, 'previous selection cleared');
  assert.strictEqual(quick.classList.contains('selected'), false, 'other presets remain cleared');
});

// 3.3(b) — quiz answer options rendered by the engine are keyboard operable.
function buildQuizDom() {
  const html = `<!doctype html><html><body>
    <div id="questionNumber"></div>
    <h2 id="questionText"></h2>
    <div id="progressFill"></div>
    <div id="progressCount"></div>
    <div class="answers-container" id="answersContainer"></div>
    <button id="prevBtn"></button>
    <button id="nextBtn"></button>
  </body></html>`;
  const { JSDOM } = require('jsdom');
  return new JSDOM(html);
}

function makeEngine(dom) {
  const document = dom.window.document;
  const sandbox = loadEngine({
    document,
    window: dom.window,
    sessionStorage: makeLocalStorage(),
    localStorage: makeLocalStorage(),
  });
  const engine = new sandbox.QuizEngine();
  engine.testSections = ['AR'];
  engine.currentQuestion = 0;
  engine.answers = {};
  engine.flagged = new Set();
  engine.quizData = {
    section: 'Arithmetic Reasoning',
    sectionCode: 'AR',
    questions: [
      { id: 1, sectionCode: 'AR', sectionName: 'AR', text: 'Q1', options: ['a', 'b', 'c', 'd'], correct: 0 },
      { id: 2, sectionCode: 'AR', sectionName: 'AR', text: 'Q2', options: ['a', 'b', 'c', 'd'], correct: 1 },
    ],
  };
  return { engine, document };
}

test('quiz: engine renders answer options with radiogroup/radio/tabindex semantics', () => {
  const dom = buildQuizDom();
  const { engine, document } = makeEngine(dom);
  engine.renderQuestion();

  const container = document.getElementById('answersContainer');
  assert.strictEqual(container.getAttribute('role'), 'radiogroup');

  const options = [...container.querySelectorAll('.answer-option')];
  assert.strictEqual(options.length, 4);
  for (const opt of options) {
    assert.strictEqual(opt.getAttribute('role'), 'radio');
    assert.strictEqual(opt.getAttribute('tabindex'), '0');
    assert.ok(opt.hasAttribute('aria-checked'));
  }
});

test('quiz: Enter on a focused answer option selects it without advancing', () => {
  const dom = buildQuizDom();
  const { engine, document } = makeEngine(dom);
  engine.bindEvents();
  engine.renderQuestion();

  const firstOption = document.querySelector('.answer-option[data-index="2"]');
  firstOption.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

  // The answer for the current question is recorded...
  assert.strictEqual(engine.answers[1], 2, 'Enter selected the focused option');
  // ...and stopPropagation prevented the document-level Enter -> nextQuestion.
  assert.strictEqual(engine.currentQuestion, 0, 'should not advance to next question');
});

// 3.3(c) — mobile menu closes on Escape and returns focus to the hamburger.
function runMobileMenu(htmlFile) {
  const { dom, document } = loadDom(htmlFile);
  const src = fs.readFileSync(path.join(rootDir, 'js/mobile-menu.js'), 'utf8');
  const sandbox = { document, window: dom.window, console };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox, { filename: 'js/mobile-menu.js' });
  // jsdom parses with readyState 'loading', so init() is deferred to
  // DOMContentLoaded; fire it so the menu wiring is active.
  document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
  return { dom, document };
}

for (const page of ['index.html', 'about.html', 'study-guide.html']) {
  test(`mobile menu (${page}): Escape closes and restores focus to hamburger`, () => {
    const { dom, document } = runMobileMenu(page);
    const menu = document.getElementById('mobile-menu');
    const hamburger = document.querySelector('.hamburger');
    assert.ok(menu && hamburger, 'menu + hamburger present');

    hamburger.click();
    assert.strictEqual(menu.classList.contains('open'), true, 'hamburger opens the menu');
    assert.strictEqual(hamburger.getAttribute('aria-expanded'), 'true');

    document.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    assert.strictEqual(menu.classList.contains('open'), false, 'Escape closes the menu');
    assert.strictEqual(hamburger.getAttribute('aria-expanded'), 'false');
    assert.strictEqual(document.activeElement, hamburger, 'focus returns to hamburger');
  });
}
