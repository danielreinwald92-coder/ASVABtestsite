const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { loadDom } = require('../helpers/load.js');

const rootDir = path.resolve(__dirname, '..', '..');

// Load weak-areas.js + dashboard.js into a vm sandbox that shares a real jsdom
// document, so we can drive renderFocusPanel/computeFocusSections directly.
function loadDashboard() {
  const { document, window } = loadDom('dashboard.html');
  const sandbox = {
    console,
    document,
    window,
    URLSearchParams,
    Math, JSON, Date, Object, Array, String, Number, Boolean,
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  for (const file of ['js/weak-areas.js', 'js/dashboard.js']) {
    const src = fs.readFileSync(path.join(rootDir, file), 'utf8');
    vm.runInContext(src, sandbox, { filename: file });
  }
  // In a browser window === globalThis, so weak-areas.js's window assignment is
  // a true global. jsdom's window is a separate object, so bridge it explicitly.
  sandbox.MissionASVABWeakAreas = window.MissionASVABWeakAreas;
  return { sandbox, document };
}

// 4.2(b) — focus panel renders from HISTORICAL aggregation across all tests.
test('focus panel ranks weakest sections across ALL tests, not just the latest', () => {
  const { sandbox, document } = loadDashboard();

  // Latest test (index 0): WK is worst on that single test.
  // But across history, AR is genuinely the weakest section.
  const results = [
    { taken_at: '2026-06-10', section_scores: { AR: { correct: 8, total: 10 }, WK: { correct: 3, total: 10 }, MK: { correct: 9, total: 10 }, PC: { correct: 9, total: 10 } } },
    { question_results: [
      { id: 1, section: 'AR', correct: false }, { id: 2, section: 'AR', correct: false },
      { id: 3, section: 'AR', correct: false }, { id: 4, section: 'AR', correct: false },
      { id: 5, section: 'WK', correct: true }, { id: 6, section: 'WK', correct: true },
    ] },
    { section_scores: { AR: { correct: 1, total: 10 } } },
  ];

  const focus = sandbox.computeFocusSections(results);
  // AR aggregate: (8 + 0 + 1)/(10 + 4 + 10) = 9/24 ≈ 38% → weakest overall.
  assert.strictEqual(focus[0].code, 'AR', 'AR is weakest across history');

  sandbox.renderFocusPanel(results);
  const panel = document.getElementById('focusPanel');
  assert.notStrictEqual(panel.style.display, 'none', 'panel is visible');

  // Practice button targets the weakest sections via the test-start mechanism.
  const btn = panel.querySelector('[data-action="practice-weak-areas"]');
  assert.ok(btn, 'practice button rendered');
  assert.ok(btn.dataset.sections.split(',').includes('AR'), 'targets AR');

  // Study plan links to the weakest section deep link, weakest first.
  const firstPlanLink = panel.querySelector('.study-plan-list a.study-plan-section');
  assert.ok(firstPlanLink, 'study plan rendered');
  assert.strictEqual(firstPlanLink.getAttribute('href'), 'study-guide.html?section=AR');
});

test('focus panel hides gracefully when there are zero tests', () => {
  const { sandbox, document } = loadDashboard();
  assert.deepEqual(sandbox.computeFocusSections([]), []);
  sandbox.renderFocusPanel([]);
  const panel = document.getElementById('focusPanel');
  assert.strictEqual(panel.style.display, 'none', 'panel hidden with no data');
});

test('startWeakAreaPractice seeds testConfig and navigates like select-test', () => {
  const { sandbox } = loadDashboard();

  const store = {};
  const removed = [];
  sandbox.sessionStorage = {
    setItem: (k, v) => { store[k] = v; },
    removeItem: (k) => { removed.push(k); },
    getItem: (k) => store[k] || null,
  };
  sandbox.localStorage = {
    setItem: (k, v) => { store[k] = v; },
    removeItem: (k) => { removed.push(k); },
    getItem: (k) => store[k] || null,
  };
  sandbox.window = { location: { href: '' } };

  sandbox.startWeakAreaPractice('AR,MK');

  assert.deepEqual(JSON.parse(store.testConfig), { sections: ['AR', 'MK'], mode: 'tutor' });
  assert.strictEqual(store.testType, 'custom');
  assert.strictEqual(sandbox.window.location.href, 'test-intro.html');
});
