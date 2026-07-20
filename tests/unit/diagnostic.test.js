const { test } = require('node:test');
const assert = require('node:assert');
const { loadCore } = require('../helpers/load.js');
const { loadEngine, fakeDoc } = require('../helpers/engine.js');

test('starting-point diagnostic is fixed at 18 questions and 20 minutes', () => {
  const { config, context } = loadCore();
  const details = config.getTestDetails('diagnostic', context.window.QuizManager);
  const diagnostic = config.getTestConfig('diagnostic');

  assert.deepStrictEqual([...diagnostic.sections], ['AR', 'WK', 'PC', 'MK']);
  assert.strictEqual(details.totalQuestions, 18);
  assert.strictEqual(details.totalTimeSeconds, 20 * 60);
  assert.deepStrictEqual(
    Array.from(diagnostic.sections, (code) => diagnostic.sectionOverrides[code].questionsPerTest),
    [4, 6, 4, 4]
  );
});

test('quiz engine materializes the diagnostic blueprint without producing AFQT', async () => {
  const { config, scoring, context } = loadCore();
  const stored = {};
  let insertedPayload = null;
  const diagnostic = config.getTestConfig('diagnostic');
  const testConfig = JSON.stringify({
    type: 'diagnostic', sections: diagnostic.sections, mode: 'timed',
    sectionOverrides: diagnostic.sectionOverrides
  });
  const sandbox = loadEngine({
    document: fakeDoc(),
    URLSearchParams,
    window: { location: { search: '', href: '' } },
    localStorage: {
      setItem: (key, value) => { stored[key] = value; },
      removeItem() {}
    },
    sessionStorage: {
      getItem: (key) => key === 'testConfig' ? testConfig : null,
      setItem() {}, removeItem() {}
    },
    MissionASVABConfig: config,
    MissionASVABScoring: scoring,
    QuizManager: context.window.QuizManager,
    getSession: async () => ({ user: { id: 'diagnostic-user' } }),
    getClient: () => ({
      from: () => ({ insert: async (payload) => {
        insertedPayload = payload;
        return { error: null };
      } })
    })
  });
  const engine = new sandbox.QuizEngine();

  engine.loadTestConfig();
  engine.generateNewTest();
  assert.strictEqual(engine.quizData.questions.length, 18);
  assert.strictEqual(engine.quizData.timeLimit, 20 * 60);
  assert.strictEqual(engine.quizData.testKind, 'diagnostic');
  assert.deepStrictEqual(
    Array.from(engine.quizData.questions, (q) => q.targetDifficulty),
    [2, 2, 3, 4, 2, 2, 3, 3, 3, 4, 2, 2, 3, 4, 2, 2, 3, 4]
  );

  // Keep submission deterministic: materialize every slot, answer it, and
  // verify that even a perfect diagnostic is not represented as an AFQT.
  engine.quizData.questions.forEach((question, index) => {
    question.text = `Question ${index + 1}`;
    question.originalId = `${question.sectionCode}${index + 1}`;
    question.options = ['A', 'B', 'C', 'D'];
    question.correct = 0;
    engine.answers[question.id] = 0;
  });
  engine.timeRemaining = 0;
  engine.materializeSlot = () => {};
  await engine.submitQuiz();

  const results = JSON.parse(stored.quizResults);
  assert.strictEqual(results.testType, 'diagnostic');
  assert.strictEqual(results.afqt, null);
  assert.strictEqual(results.score, 100);
  assert.strictEqual(insertedPayload.afqt_score, null);
  assert.strictEqual(insertedPayload.line_scores, null);
});
