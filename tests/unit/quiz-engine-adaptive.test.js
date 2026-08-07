// Task 5: Owen Bayesian interim ability state + maximum-information item
// selection. Replaces the old 1-5 ability-ladder tests (superseded).
const { test } = require('node:test');
const assert = require('node:assert');
const { loadCore } = require('../helpers/load.js');
const { loadEngine, fakeDoc } = require('../helpers/engine.js');

// vm-sandbox objects aren't reference-equal to main-realm object literals
// even with identical shape (deepStrictEqual checks prototype identity
// across realms). JSON round-trip normalizes the realm, same idiom used in
// quiz-engine-sections.test.js.
function plain(x) {
  return JSON.parse(JSON.stringify(x));
}

// Build a real, fully-materialized quick-test engine (AR/WK/PC/MK), mirroring
// the pattern in tests/unit/diagnostic.test.js (loadCore for real
// QuizManager/IRT globals, loadEngine for the QuizEngine class).
function quickEngine() {
  const { config, scoring, context } = loadCore();
  const testConfig = JSON.stringify({ type: 'quick', sections: ['AR', 'WK', 'PC', 'MK'], mode: 'timed' });
  const sandbox = loadEngine({
    document: fakeDoc(),
    URLSearchParams,
    window: { location: { search: '', href: '' } },
    localStorage: { setItem() {}, removeItem() {} },
    sessionStorage: {
      getItem: (key) => (key === 'testConfig' ? testConfig : null),
      setItem() {}, removeItem() {}
    },
    MissionASVABConfig: config,
    MissionASVABScoring: scoring,
    QuizManager: context.window.QuizManager,
  });
  const engine = new sandbox.QuizEngine();
  engine.loadTestConfig();
  engine.generateNewTest();
  return engine;
}

test('starting a quick test initializes abilityState per section to {mean:0, variance:1}', () => {
  const engine = quickEngine();
  assert.deepStrictEqual(plain(engine.abilityState.AR), { mean: 0, variance: 1 });
  assert.deepStrictEqual(plain(engine.abilityState.WK), { mean: 0, variance: 1 });
  assert.deepStrictEqual(plain(engine.abilityState.PC), { mean: 0, variance: 1 });
  assert.deepStrictEqual(plain(engine.abilityState.MK), { mean: 0, variance: 1 });
  // The old ladder property is gone entirely.
  assert.strictEqual(engine.abilityLevels, undefined);
});

test('QuizManager.selectMaxInfoQuestion near theta 0 picks difficulty 2 or 3 for AR (20 draws)', () => {
  const { context } = loadCore();
  const QuizManager = context.window.QuizManager;
  const pool = QuizManager.getAdaptiveQuestionPool('AR');
  for (let i = 0; i < 20; i++) {
    const q = QuizManager.selectMaxInfoQuestion(pool, 'AR', 0, new Set());
    assert.ok(q, 'a question was selected');
    assert.ok([2, 3].includes(q.difficulty), `expected difficulty 2 or 3, got ${q.difficulty}`);
  }
});

test('QuizManager.selectMaxInfoQuestion with thetaMean=2.5 picks difficulty >= 3 for AR (20 draws)', () => {
  const { context } = loadCore();
  const QuizManager = context.window.QuizManager;
  const pool = QuizManager.getAdaptiveQuestionPool('AR');
  for (let i = 0; i < 20; i++) {
    const q = QuizManager.selectMaxInfoQuestion(pool, 'AR', 2.5, new Set());
    assert.ok(q, 'a question was selected');
    assert.ok(q.difficulty >= 3, `expected difficulty >= 3, got ${q.difficulty}`);
  }
});

test('QuizManager.selectMaxInfoQuestion never returns an excluded id', () => {
  const { context } = loadCore();
  const QuizManager = context.window.QuizManager;
  const pool = QuizManager.getAdaptiveQuestionPool('AR');
  const allIds = [];
  Object.keys(pool.byDifficulty).forEach((d) => pool.byDifficulty[d].forEach((q) => allIds.push(q.id)));

  // Exclude everything except one survivor: selectMaxInfoQuestion must return
  // exactly that survivor, proving the usedIds filter is structural (not luck).
  const survivor = allIds[0];
  const usedIds = new Set(allIds.filter((id) => id !== survivor));
  const q = QuizManager.selectMaxInfoQuestion(pool, 'AR', 0, usedIds);
  assert.strictEqual(q.id, survivor);

  // Also: excluding a single id from the full pool means it is never drawn.
  const oneExcluded = new Set([survivor]);
  for (let i = 0; i < 30; i++) {
    const picked = QuizManager.selectMaxInfoQuestion(pool, 'AR', 0, oneExcluded);
    assert.notStrictEqual(picked.id, survivor);
  }
});

test('QuizManager.selectMaxInfoQuestion returns null when the pool is exhausted', () => {
  const { context } = loadCore();
  const QuizManager = context.window.QuizManager;
  const pool = QuizManager.getAdaptiveQuestionPool('AR');
  const allIds = new Set();
  Object.keys(pool.byDifficulty).forEach((d) => pool.byDifficulty[d].forEach((q) => allIds.add(q.id)));
  assert.strictEqual(QuizManager.selectMaxInfoQuestion(pool, 'AR', 0, allIds), null);
});

test('QuizManager.selectMaxInfoQuestion degrades to the first candidate when IRT globals are missing', () => {
  const { context } = loadCore();
  const QuizManager = context.window.QuizManager;
  const pool = QuizManager.getAdaptiveQuestionPool('AR');
  const savedIRT = context.window.MissionASVABIRT;
  const savedParams = context.window.MissionASVABIRTParams;
  delete context.window.MissionASVABIRT;
  delete context.window.MissionASVABIRTParams;
  try {
    let expectedFirst = null;
    for (let d = 1; d <= 5 && !expectedFirst; d++) {
      if (pool.byDifficulty[d] && pool.byDifficulty[d].length) expectedFirst = pool.byDifficulty[d][0];
    }
    const q = QuizManager.selectMaxInfoQuestion(pool, 'AR', 0, new Set());
    assert.strictEqual(q.id, expectedFirst.id);
  } finally {
    context.window.MissionASVABIRT = savedIRT;
    context.window.MissionASVABIRTParams = savedParams;
  }
});

test('materializeSlot uses selectNextAdaptiveQuestion for diagnostic slots (targetDifficulty set)', () => {
  const calls = { adaptive: [], maxInfo: [] };
  const sandbox = loadEngine({
    document: fakeDoc(),
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    QuizManager: {
      getAdaptiveQuestionPool: () => ({ byDifficulty: {} }),
      selectNextAdaptiveQuestion: (pool, targetDifficulty) => {
        calls.adaptive.push(targetDifficulty);
        return { id: 'AR1', difficulty: targetDifficulty, text: 't', options: ['a', 'b', 'c', 'd'], correct: 0 };
      },
      selectMaxInfoQuestion: () => { calls.maxInfo.push(true); return null; },
      shuffleQuestionOptions: (q) => ({ text: q.text, options: q.options, correct: q.correct }),
    },
  });
  const engine = new sandbox.QuizEngine();
  engine.quizData = { questions: [{ id: 1, sectionCode: 'AR', sectionName: 'AR', targetDifficulty: 4 }] };
  engine.questionPools = { AR: { byDifficulty: {} } };
  engine.abilityState = {};
  engine.usedQuestionIds = new Set();

  engine.materializeSlot(0);

  assert.deepStrictEqual(calls.adaptive, [4]);
  assert.deepStrictEqual(calls.maxInfo, []);
  assert.strictEqual(engine.quizData.questions[0].difficulty, 4);
  // materializeSlot lazily initializes abilityState even on the diagnostic path.
  assert.deepStrictEqual(plain(engine.abilityState.AR), { mean: 0, variance: 1 });
});

test('materializeSlot uses selectMaxInfoQuestion with the current theta mean for adaptive slots', () => {
  const calls = [];
  const sandbox = loadEngine({
    document: fakeDoc(),
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    QuizManager: {
      getAdaptiveQuestionPool: () => ({ byDifficulty: {} }),
      selectNextAdaptiveQuestion: () => null,
      selectMaxInfoQuestion: (pool, sectionCode, thetaMean) => {
        calls.push([sectionCode, thetaMean]);
        return { id: 'AR2', difficulty: 3, text: 't', options: ['a', 'b', 'c', 'd'], correct: 0 };
      },
      shuffleQuestionOptions: (q) => ({ text: q.text, options: q.options, correct: q.correct }),
    },
  });
  const engine = new sandbox.QuizEngine();
  engine.quizData = { questions: [{ id: 1, sectionCode: 'AR', sectionName: 'AR' }] };
  engine.questionPools = { AR: { byDifficulty: {} } };
  engine.abilityState = { AR: { mean: 1.25, variance: 0.5 } };
  engine.usedQuestionIds = new Set();

  engine.materializeSlot(0);

  assert.deepStrictEqual(calls, [['AR', 1.25]]);
  assert.strictEqual(engine.quizData.questions[0].difficulty, 3);
});

// Task 6: in CAT mode the Owen update moves from select-time to lock-time
// (lockCurrentAnswer, called from nextQuestion()/advanceSection()/submitQuiz()).
// Re-answering before lock is still free; the lockedAnswers set is what makes
// the ability update itself first-(and-only)-time.
test('lockCurrentAnswer wires owenUpdate with the exact item-param mapping (real IRT + real AR pool), lock-once', () => {
  // Real IRT globals + real QuizManager (from loadCore), so the selected item
  // and its params are exactly what a live quiz would materialize — this is
  // an argument-mapping regression test, not just a "state changed" check.
  const { context } = loadCore();
  const IRT = context.window.MissionASVABIRT;
  const P = context.window.MissionASVABIRTParams;
  const QuizManager = context.window.QuizManager;

  const sandbox = loadEngine({
    document: fakeDoc(),
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    QuizManager,
    MissionASVABIRT: IRT,
    MissionASVABIRTParams: P,
  });
  const engine = new sandbox.QuizEngine();
  engine.mode = 'timed';
  engine.testKind = 'quick'; // CAT mode: isCatMode() === true
  engine.testSections = ['AR'];
  engine.quizData = { questions: [{ id: 1, sectionCode: 'AR', sectionName: 'AR' }] };
  engine.questionPools = { AR: QuizManager.getAdaptiveQuestionPool('AR') };
  engine.abilityState = { AR: { mean: 0, variance: 1 } };
  engine.usedQuestionIds = new Set();
  engine.answers = {};
  engine.currentQuestion = 0;
  engine.renderQuestion = () => {};

  // Materialize a real, max-info-selected AR item through the production path.
  engine.materializeSlot(0);
  const question = engine.quizData.questions[0];
  assert.ok(question.originalId, 'slot materialized with a real bank id');

  engine.selectAnswer(0);
  assert.deepStrictEqual(
    plain(engine.abilityState.AR), { mean: 0, variance: 1 },
    'selectAnswer alone must not update the interim ability in CAT mode'
  );

  // Re-answering before the lock is still free.
  const secondIndex = question.correct === 0 ? 1 : 0;
  engine.selectAnswer(secondIndex);
  assert.strictEqual(engine.answers[question.id], secondIndex, 'unlocked answer stays changeable');

  const isCorrect = secondIndex === question.correct;
  const expectedItem = P.getItemParams('AR', question.difficulty || 3, question.originalId || question.id);
  const expected = IRT.owenUpdate({ mean: 0, variance: 1 }, expectedItem, isCorrect);

  engine.lockCurrentAnswer();
  assert.deepStrictEqual(
    plain(engine.abilityState.AR),
    plain(expected),
    'abilityState.AR after lockCurrentAnswer must equal a direct owenUpdate call built from the same item/correctness mapping'
  );
  assert.ok(engine.lockedAnswers.has(question.id), 'question is locked');

  // Locking again (or trying to re-answer) must not run owenUpdate a second time.
  const afterLock = plain(engine.abilityState.AR);
  engine.lockCurrentAnswer();
  assert.deepStrictEqual(plain(engine.abilityState.AR), afterLock, 'idempotent re-lock');

  engine.selectAnswer(question.correct === 0 ? 1 : 0);
  assert.strictEqual(engine.answers[question.id], secondIndex, 'locked answer cannot be changed');
  assert.deepStrictEqual(plain(engine.abilityState.AR), afterLock, 'abilityState unchanged after a blocked re-answer attempt');
});

test('resuming a pre-deploy saved test (no abilityState) initializes {mean:0, variance:1} per section', () => {
  const { config, scoring, context } = loadCore();
  const savedTest = JSON.stringify({
    section: 'x', sectionCode: 'AR,WK', timeLimit: 90, testKind: 'quick',
    questions: [
      { id: 1, sectionCode: 'AR', sectionName: 'AR' }, { id: 2, sectionCode: 'AR', sectionName: 'AR' },
      { id: 3, sectionCode: 'WK', sectionName: 'WK' }, { id: 4, sectionCode: 'WK', sectionName: 'WK' },
    ]
  });
  // schemaV 2 state with no abilityState key (pre-Task-5 shape).
  const savedState = JSON.stringify({ schemaV: 2, answers: {}, currentQuestion: 0, timeRemaining: 90 });
  const store = { generatedTest: savedTest, quizState: savedState };
  const sandbox = loadEngine({
    document: fakeDoc(),
    sessionStorage: {
      getItem: (k) => store[k] || null,
      setItem: (k, v) => { store[k] = v; },
      removeItem: (k) => { delete store[k]; },
    },
    MissionASVABConfig: config,
    MissionASVABScoring: scoring,
    QuizManager: context.window.QuizManager,
  });
  const engine = new sandbox.QuizEngine();
  engine.testSections = ['AR', 'WK'];
  const ok = engine.loadSavedState();
  assert.strictEqual(ok, true);
  assert.deepStrictEqual(plain(engine.abilityState.AR), { mean: 0, variance: 1 });
  assert.deepStrictEqual(plain(engine.abilityState.WK), { mean: 0, variance: 1 });
});
