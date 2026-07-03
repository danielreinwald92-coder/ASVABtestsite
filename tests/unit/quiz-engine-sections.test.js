const { test } = require('node:test');
const assert = require('node:assert');
const { loadEngine, fakeDoc } = require('../helpers/engine.js');

// A fake QuizManager whose adaptive selector honors the usedIds set, so we can
// assert recent-seen ids are excluded.
function fakeQuizManager(poolIds) {
  return {
    getSectionInfo: (code) => ({ name: code, timeLimit: 600, questionsPerTest: poolIds.length }),
    getAdaptiveQuestionPool: () => ({ ids: poolIds.slice() }),
    selectNextAdaptiveQuestion: (pool, ability, usedIds) => {
      const q = pool.ids.find((id) => !usedIds.has(id));
      return q ? { id: q, difficulty: 3, text: 't', options: ['a', 'b', 'c', 'd'], correct: 0 } : null;
    },
    shuffleQuestionOptions: (q) => ({ text: q.text, options: q.options, correct: q.correct }),
    updateAbilityLevel: (lvl) => lvl,
  };
}

test('materializeSlot excludes recent-seen ids, then relaxes when exhausted', () => {
  const recent = { AR: ['AR1', 'AR2'] };
  const sandbox = loadEngine({
    document: fakeDoc(),
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    QuizManager: fakeQuizManager(['AR1', 'AR2', 'AR3']),
    MissionASVABRecentSeen: { getRecent: (c) => recent[c] || [], record() {} },
  });
  const engine = new sandbox.QuizEngine();
  engine.quizData = { questions: [{ id: 1, sectionCode: 'AR', sectionName: 'AR' }, { id: 2, sectionCode: 'AR', sectionName: 'AR' }] };
  engine.questionPools = { AR: { ids: ['AR1', 'AR2', 'AR3'] } };
  engine.abilityLevels = { AR: 3 };
  engine.usedQuestionIds = new Set();

  engine.materializeSlot(0); // should skip AR1/AR2 → AR3
  assert.strictEqual(engine.quizData.questions[0].originalId, 'AR3');

  engine.materializeSlot(1); // AR3 used; recent AR1/AR2 excluded → null → relax to AR1
  assert.strictEqual(engine.quizData.questions[1].originalId, 'AR1');
});
