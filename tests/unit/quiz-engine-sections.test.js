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

function sectionedEngine() {
  const sandbox = loadEngine({
    document: fakeDoc(),
    sessionStorage: { _d: {}, getItem(k) { return this._d[k] || null; }, setItem(k, v) { this._d[k] = v; }, removeItem(k) { delete this._d[k]; } },
    QuizManager: {
      getSectionInfo: (code) => ({ AR: { name: 'AR', timeLimit: 60, questionsPerTest: 2 }, WK: { name: 'WK', timeLimit: 30, questionsPerTest: 2 } }[code]),
      getAdaptiveQuestionPool: () => ({ ids: [] }),
    },
  });
  const engine = new sandbox.QuizEngine();
  engine.mode = 'timed';
  engine.testSections = ['AR', 'WK'];
  engine.quizData = { section: 'x', sectionCode: 'AR,WK', timeLimit: 90, questions: [
    { id: 1, sectionCode: 'AR', sectionName: 'AR' }, { id: 2, sectionCode: 'AR', sectionName: 'AR' },
    { id: 3, sectionCode: 'WK', sectionName: 'WK' }, { id: 4, sectionCode: 'WK', sectionName: 'WK' },
  ] };
  return { sandbox, engine };
}

test('buildSectionRanges groups contiguous slots by section', () => {
  const { engine } = sectionedEngine();
  engine.buildSectionRanges();
  // JSON round-trip normalizes the vm-sandbox realm so deepStrictEqual compares
  // structure rather than the (cross-realm) Array prototype identity.
  const actual = JSON.parse(JSON.stringify(engine.sectionRanges.map((r) => [r.code, r.start, r.end, r.timeLimit])));
  assert.deepStrictEqual(actual, [['AR', 0, 2, 60], ['WK', 2, 4, 30]]);
});

test('isSectioned is false in tutor mode, true in timed mode', () => {
  const { engine } = sectionedEngine();
  assert.strictEqual(engine.isSectioned(), true);
  engine.mode = 'tutor';
  assert.strictEqual(engine.isSectioned(), false);
});

test('saveState/loadSavedState round-trips section state (schemaV 2)', () => {
  const { sandbox, engine } = sectionedEngine();
  engine.buildSectionRanges();
  engine.activeSectionIndex = 1;
  engine.sectionTimeRemaining = 17;
  engine.completedSections = new Set([0]);
  engine.currentQuestion = 2;
  engine.saveState();
  engine.quizData && sandbox.sessionStorage.setItem('generatedTest', JSON.stringify(engine.quizData));

  const e2 = new sandbox.QuizEngine();
  e2.mode = 'timed';
  e2.testSections = ['AR', 'WK'];
  const ok = e2.loadSavedState();
  assert.strictEqual(ok, true);
  assert.strictEqual(e2.activeSectionIndex, 1);
  assert.strictEqual(e2.sectionTimeRemaining, 17);
  assert.ok(e2.completedSections.has(0));
});

test('loadSavedState discards pre-SP2 state without schemaV', () => {
  const { sandbox, engine } = sectionedEngine();
  sandbox.sessionStorage.setItem('generatedTest', JSON.stringify(engine.quizData));
  sandbox.sessionStorage.setItem('quizState', JSON.stringify({ answers: {}, currentQuestion: 0 })); // no schemaV
  const e2 = new sandbox.QuizEngine();
  e2.testSections = ['AR', 'WK'];
  assert.strictEqual(e2.loadSavedState(), false);
});

test('advanceSection moves to the next section and resets its timer', () => {
  const { engine } = sectionedEngine();
  engine.buildSectionRanges();
  engine.activeSectionIndex = 0;
  engine.sectionTimeRemaining = 0;
  engine.currentQuestion = 1;
  engine.timeRemaining = 90;
  engine.renderQuestion = () => {}; engine.renderNavigator = () => {}; engine.updateSectionHeader = () => {}; engine.startTimer = () => {};
  engine.advanceSection();
  assert.strictEqual(engine.activeSectionIndex, 1);
  assert.strictEqual(engine.sectionTimeRemaining, 30, 'WK timeLimit');
  assert.strictEqual(engine.currentQuestion, 2, 'first WK slot');
  assert.ok(engine.completedSections.has(0));
});

test('advanceSection on the final section submits', () => {
  const { engine } = sectionedEngine();
  engine.buildSectionRanges();
  engine.activeSectionIndex = 1; // last
  let submitted = false;
  engine.submitQuiz = () => { submitted = true; };
  engine.advanceSection();
  assert.strictEqual(submitted, true);
});

test('early manual advance drops the unused section time from the total', () => {
  const { engine } = sectionedEngine();
  engine.buildSectionRanges();
  engine.activeSectionIndex = 0;
  engine.sectionTimeRemaining = 25; // finished AR early with 25s left
  engine.timeRemaining = 90;
  engine.renderQuestion = () => {}; engine.renderNavigator = () => {}; engine.updateSectionHeader = () => {}; engine.startTimer = () => {};
  engine.advanceSection();
  assert.strictEqual(engine.timeRemaining, 65, '90 - 25 unused');
});
