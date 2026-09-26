const { test } = require('node:test');
const assert = require('node:assert');
const { loadCore } = require('../helpers/load.js');
const { loadEngine, fakeDoc } = require('../helpers/engine.js');

// APT-style AFQT Predictor: 20 adaptive items (5 per AFQT area), scored by the
// same IRT pipeline as the full AFQT practice.

test('APT preset is 20 questions across AR/WK/PC/MK in 25 minutes', () => {
  const { config, context } = loadCore();
  const apt = config.getTestConfig('apt');
  const details = config.getTestDetails('apt', context.window.QuizManager);
  assert.deepStrictEqual([...apt.sections], ['AR', 'WK', 'PC', 'MK']);
  assert.strictEqual(details.totalQuestions, 20);
  assert.strictEqual(details.totalTimeSeconds, 25 * 60);
  for (const code of apt.sections) assert.strictEqual(apt.sectionOverrides[code].questionsPerTest, 5);
});

function aptEngine({ answerCorrect, unansweredPerSection = 0 }) {
  const { config, scoring, context } = loadCore();
  const stored = {};
  const apt = config.getTestConfig('apt');
  const testConfig = JSON.stringify({
    type: 'apt', sections: apt.sections, mode: 'tutor', sectionOverrides: apt.sectionOverrides
  });
  const sandbox = loadEngine({
    document: fakeDoc(),
    URLSearchParams,
    window: { location: { search: '', href: '' } },
    localStorage: { setItem: (k, v) => { stored[k] = v; }, removeItem() {} },
    sessionStorage: { getItem: (k) => (k === 'testConfig' ? testConfig : null), setItem() {}, removeItem() {} },
    MissionASVABConfig: config,
    MissionASVABScoring: scoring,
    QuizManager: context.window.QuizManager,
    getSession: async () => null,
  });
  const engine = new sandbox.QuizEngine();
  engine.loadTestConfig();
  engine.generateNewTest();
  const seen = {};
  engine.quizData.questions.forEach((q, i) => {
    q.text = `Question ${i + 1}`;
    q.originalId = `${q.sectionCode}X${i}`;
    q.options = ['A', 'B', 'C', 'D'];
    q.correct = 0;
    q.difficulty = 3;
    seen[q.sectionCode] = (seen[q.sectionCode] || 0) + 1;
    if (seen[q.sectionCode] > 5 - unansweredPerSection) return; // left blank
    engine.answers[q.id] = answerCorrect(i) ? 0 : 1;
  });
  engine.materializeSlot = () => {};
  return { engine, stored };
}

test('APT is always timed and adaptive, even if tutor was requested', () => {
  const { engine } = aptEngine({ answerCorrect: () => true });
  assert.strictEqual(engine.testKind, 'apt');
  assert.strictEqual(engine.mode, 'timed');
  assert.strictEqual(engine.quizData.questions.length, 20);
  assert.strictEqual(engine.quizData.section, 'AFQT Predictor');
  assert.strictEqual(engine.isCatMode(), true);
});

test('APT submit stores testType apt with an AFQT prediction and a likely range', async () => {
  const { engine, stored } = aptEngine({ answerCorrect: (i) => i % 2 === 0 });
  await engine.submitQuiz();
  const results = JSON.parse(stored.quizResults);
  assert.strictEqual(results.testType, 'apt');
  assert.strictEqual(typeof results.afqt, 'number');
  assert.ok(results.afqtBand.low <= results.afqt && results.afqt <= results.afqtBand.high);
});

test('APT with unanswered items scores through the length-5 penalty table', async () => {
  const { engine, stored } = aptEngine({ answerCorrect: () => true, unansweredPerSection: 2 });
  await engine.submitQuiz();
  const results = JSON.parse(stored.quizResults);
  assert.strictEqual(typeof results.afqt, 'number', 'an incomplete APT must still score');
  const complete = aptEngine({ answerCorrect: () => true });
  await complete.engine.submitQuiz();
  assert.ok(results.afqt < JSON.parse(complete.stored.quizResults).afqt,
    'leaving items blank must cost more than answering them correctly');
});

test('a 5-item section yields a wider likely range than a 15-item section', () => {
  const { scoring } = loadCore();
  const section = (n, total) => ({
    total, correct: n, unanswered: 0,
    questions: Array.from({ length: total }, (_, i) => ({ id: i, difficulty: 3, isCorrect: i < n, answered: true })),
  });
  const short = scoring.getScoreDetails({ AR: section(3, 5), WK: section(3, 5), PC: section(3, 5), MK: section(3, 5) });
  const long = scoring.getScoreDetails({ AR: section(9, 15), WK: section(9, 15), PC: section(6, 10), MK: section(9, 15) });
  assert.ok(short.band.high - short.band.low > long.band.high - long.band.low);
});
