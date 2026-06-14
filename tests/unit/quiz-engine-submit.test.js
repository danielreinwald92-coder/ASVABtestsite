const { test } = require('node:test');
const assert = require('node:assert');
const { loadEngine, fakeDoc } = require('../helpers/engine.js');

// 2.5 — submitQuiz must not double-submit (double-click or timer-expiry race).
test('submitQuiz invokes the underlying save at most once when called twice rapidly', async () => {
  const document = fakeDoc();
  const nextBtn = { disabled: false };
  document._els['nextBtn'] = nextBtn;

  const sandbox = loadEngine({
    document,
    window: { location: { href: '' } },
    localStorage: { setItem() {}, removeItem() {} },
    sessionStorage: { removeItem() {} },
    MissionASVABConfig: { getTestTypeFromSections: () => 'afqt' },
    MissionASVABScoring: { calculateAFQTEstimate: () => null, calculateLineScores: () => ({}) },
  });

  const engine = new sandbox.QuizEngine();
  engine.testSections = ['AR'];
  engine.timeRemaining = 50;
  engine.quizData = {
    section: 'Arithmetic Reasoning',
    sectionCode: 'AR',
    timeLimit: 100,
    questions: [
      { id: 1, sectionCode: 'AR', sectionName: 'AR', text: 'q', options: ['a', 'b'], correct: 0 },
    ],
  };
  engine.answers = { 1: 0 };

  let saveCalls = 0;
  engine.saveResultsToSupabase = async () => {
    saveCalls++;
  };

  await Promise.all([engine.submitQuiz(), engine.submitQuiz()]);

  assert.strictEqual(saveCalls, 1, `expected 1 save, got ${saveCalls}`);
  assert.strictEqual(nextBtn.disabled, true, 'submit button should be disabled');
});
