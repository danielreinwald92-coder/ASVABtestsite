const { test } = require('node:test');
const assert = require('node:assert');
const { loadEngine, fakeDoc } = require('../helpers/engine.js');

function engineFor(sections) {
  const stored = {};
  const sandbox = loadEngine({
    document: fakeDoc(),
    window: { location: { href: '' } },
    localStorage: { setItem: (k, v) => { stored[k] = v; }, removeItem() {} },
    sessionStorage: { removeItem() {}, setItem() {} },
    MissionASVABConfig: { AFQT_SECTIONS: ['AR', 'WK', 'PC', 'MK'], getTestTypeFromSections: () => 'custom' },
    MissionASVABScoring: { calculateAFQTEstimate: () => 55, calculateLineScores: () => null },
  });
  const engine = new sandbox.QuizEngine();
  engine.mode = 'timed';
  engine.testSections = sections;
  engine.quizData = {
    section: 'X', sectionCode: sections.join(','), timeLimit: 100,
    questions: sections.map((s, i) => ({ id: i + 1, originalId: s + '001', sectionCode: s, sectionName: s, text: 'q', options: ['a', 'b', 'c', 'd'], correct: 0 })),
  };
  engine.answers = {};
  engine.quizData.questions.forEach(q => { engine.answers[q.id] = 0; });
  engine.timeRemaining = 40;
  engine.saveResultsToSupabase = async () => ({ skipped: true });
  engine.materializeSlot = () => {};
  return { engine, stored };
}

test('AFQT is null for a custom subset missing an AFQT section', () => {
  const { engine, stored } = engineFor(['AR', 'WK', 'PC']); // missing MK
  return engine.submitQuiz().then(() => {
    assert.strictEqual(JSON.parse(stored.quizResults).afqt, null);
  });
});

test('AFQT is computed when all four AFQT sections are present', () => {
  const { engine, stored } = engineFor(['AR', 'WK', 'PC', 'MK']);
  return engine.submitQuiz().then(() => {
    assert.strictEqual(JSON.parse(stored.quizResults).afqt, 55);
  });
});

test('AFQT remains null for a diagnostic even with all four AFQT sections', () => {
  const { engine, stored } = engineFor(['AR', 'WK', 'PC', 'MK']);
  engine.testKind = 'diagnostic';
  return engine.submitQuiz().then(() => {
    const results = JSON.parse(stored.quizResults);
    assert.strictEqual(results.afqt, null);
    assert.strictEqual(results.testType, 'diagnostic');
  });
});
