const { test } = require('node:test');
const assert = require('node:assert');
const { loadEngine, fakeDoc } = require('../helpers/engine.js');

// Batch of first-time-user fixes: no-config redirect (back-button phantom test),
// negative-timer clamp, time-up announcement, typing-in-inputs keyboard guard,
// and a visible "answer required" message.

function emptyStorage() {
  return { _d: {}, getItem(k) { return this._d[k] || null; }, setItem(k, v) { this._d[k] = v; }, removeItem(k) { delete this._d[k]; } };
}

test('init redirects to select-test.html when there is no config, params, or saved state', () => {
  const replaced = [];
  const doc = fakeDoc();
  const sandbox = loadEngine({
    document: doc,
    sessionStorage: emptyStorage(),
    URLSearchParams,
    window: { location: { search: '', replace: (url) => replaced.push(url) } },
  });
  const engine = new sandbox.QuizEngine();
  engine.init();
  assert.deepStrictEqual([...replaced], ['select-test.html']);
});

test('init does NOT redirect when a section URL param is present', () => {
  const replaced = [];
  const doc = fakeDoc();
  const sandbox = loadEngine({
    document: doc,
    sessionStorage: emptyStorage(),
    URLSearchParams,
    window: { location: { search: '?section=AR', replace: (url) => replaced.push(url) } },
    QuizManager: {
      getSectionInfo: () => ({ name: 'AR', timeLimit: 60, questionsPerTest: 1 }),
      getAdaptiveQuestionPool: () => ({ ids: [] }),
    },
    MissionASVABConfig: { getSectionsForType: () => ['AR'], getTestTypeFromSections: () => 'custom' },
  });
  const engine = new sandbox.QuizEngine();
  // Stub the render pipeline — this test only cares about the redirect decision.
  engine.renderQuestion = () => {};
  engine.renderNavigator = () => {};
  engine.maybeStartTimer = () => {};
  engine.bindEvents = () => {};
  engine.updateSectionHeader = () => {};
  engine.init();
  assert.strictEqual(replaced.length, 0);
  assert.deepStrictEqual(JSON.parse(JSON.stringify(engine.testSections)), ['AR']);
});

test('corrupt sessionStorage never crashes init (falls back to redirect)', () => {
  const replaced = [];
  const storage = emptyStorage();
  storage.setItem('testConfig', '{corrupt json!!');
  storage.setItem('quizState', '{also corrupt');
  storage.setItem('generatedTest', 'nope');
  const sandbox = loadEngine({
    document: fakeDoc(),
    sessionStorage: storage,
    URLSearchParams,
    window: { location: { search: '', replace: (url) => replaced.push(url) } },
  });
  const engine = new sandbox.QuizEngine();
  assert.doesNotThrow(() => engine.init());
});

test('updateTimerDisplay clamps negative remaining time to 0:00', () => {
  const doc = fakeDoc();
  doc._els.timerDisplay = { textContent: '' };
  const sandbox = loadEngine({ document: doc, sessionStorage: emptyStorage() });
  const engine = new sandbox.QuizEngine();
  engine.mode = 'timed';
  engine.sectionRanges = [{ code: 'AR', name: 'AR', start: 0, end: 1, timeLimit: 60 }];
  engine.sectionTimeRemaining = -1;
  engine.updateTimerDisplay();
  assert.strictEqual(doc._els.timerDisplay.textContent, '0:00');
});

test('advanceSection on time expiry announces the transition via the live region', () => {
  const doc = fakeDoc();
  doc._els.timerLive = { textContent: '' };
  const sandbox = loadEngine({ document: doc, sessionStorage: emptyStorage() });
  const engine = new sandbox.QuizEngine();
  engine.mode = 'timed';
  engine.quizData = { questions: [
    { id: 1, sectionCode: 'AR', sectionName: 'Arithmetic Reasoning' },
    { id: 2, sectionCode: 'WK', sectionName: 'Word Knowledge' },
  ] };
  engine.sectionRanges = [
    { code: 'AR', name: 'Arithmetic Reasoning', start: 0, end: 1, timeLimit: 60 },
    { code: 'WK', name: 'Word Knowledge', start: 1, end: 2, timeLimit: 30 },
  ];
  engine.activeSectionIndex = 0;
  engine.sectionTimeRemaining = 0;
  engine.renderQuestion = () => {};
  engine.renderNavigator = () => {};
  engine.updateSectionHeader = () => {};
  engine.startTimer = () => {};
  engine.saveState = () => {};
  engine.advanceSection('time');
  const msg = doc._els.timerLive.textContent;
  assert.ok(/time/i.test(msg) && /Word Knowledge/.test(msg), `expected time-up announcement, got: ${msg}`);
});

test('letter shortcuts are ignored while typing in an input', () => {
  const doc = fakeDoc();
  const sandbox = loadEngine({ document: doc, sessionStorage: emptyStorage() });
  const engine = new sandbox.QuizEngine();
  let selected = null;
  engine.selectAnswer = (i) => { selected = i; };
  engine.bindEvents();
  const handler = doc._listeners.keydown[0];
  handler({ key: 'A', target: { closest: (sel) => (sel.includes('input') ? {} : null) } });
  assert.strictEqual(selected, null, 'selectAnswer should not fire for keys typed into an input');
  handler({ key: 'A', target: { closest: () => null } });
  assert.strictEqual(selected, 0, 'selectAnswer should still fire outside inputs');
});

test('showAnswerRequired reveals a visible message and announces it', () => {
  const doc = fakeDoc();
  doc._els.answersContainer = { classList: { add() {}, remove() {} } };
  doc._els.answerRequiredMsg = { hidden: true, textContent: '' };
  doc._els.timerLive = { textContent: '' };
  const sandbox = loadEngine({ document: doc, sessionStorage: emptyStorage() });
  const engine = new sandbox.QuizEngine();
  engine.showAnswerRequired();
  assert.strictEqual(doc._els.answerRequiredMsg.hidden, false);
  assert.ok(/answer/i.test(doc._els.timerLive.textContent));
});
