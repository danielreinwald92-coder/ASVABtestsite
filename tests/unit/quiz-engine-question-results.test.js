const { test } = require('node:test');
const assert = require('node:assert');
const { loadEngine, fakeDoc } = require('../helpers/engine.js');

// 4.1 / Task 6 — submitQuiz persists a COMPACT per-question results array
// ({id, section, correct, difficulty}) to test_results, with NO question text/options.
test('submit inserts compact question_results with the session user id and no text/options', async () => {
  const document = fakeDoc();
  document._els['nextBtn'] = { disabled: false };

  let insertedPayload = null;
  const client = {
    from() {
      return { insert: async (payload) => { insertedPayload = payload; return { error: null }; } };
    }
  };

  const sandbox = loadEngine({
    document,
    window: { location: { href: '' } },
    localStorage: { setItem() {}, removeItem() {} },
    sessionStorage: { removeItem() {} },
    MissionASVABConfig: { getTestTypeFromSections: () => 'afqt' },
    MissionASVABScoring: {
      // No AFQT_SECTIONS test-config gate to satisfy here (this engine's
      // testSections is just ['AR','WK']) — getScoreDetails itself gates on
      // the 4 AFQT codes, so this fixture (AR/WK only) stays ungated -> null.
      getScoreDetails: () => null,
      calculateLineScores: () => ({ GT: 110 }),
    },
    getClient: () => client,
    getSession: async () => ({ user: { id: 'user-123' } }),
  });

  const engine = new sandbox.QuizEngine();
  engine.testSections = ['AR', 'WK'];
  engine.timeRemaining = 50;
  engine.quizData = {
    section: 'Arithmetic Reasoning',
    sectionCode: 'AR',
    timeLimit: 100,
    questions: [
      { id: 1, sectionCode: 'AR', sectionName: 'AR', text: 'q1', options: ['a', 'b'], correct: 0, difficulty: 2 },
      { id: 2, sectionCode: 'AR', sectionName: 'AR', text: 'q2', options: ['a', 'b'], correct: 1, difficulty: 4 },
      { id: 3, sectionCode: 'WK', sectionName: 'WK', text: 'q3', options: ['a', 'b'], correct: 0, difficulty: 3 },
    ],
  };
  engine.answers = { 1: 0, 2: 0, 3: 0 }; // q1 right, q2 wrong, q3 right

  await engine.submitQuiz();

  assert.ok(insertedPayload, 'insert was called');
  assert.strictEqual(insertedPayload.user_id, 'user-123', 'insert uses session user id (RLS)');

  const qr = insertedPayload.question_results;
  assert.ok(Array.isArray(qr), 'question_results is an array');
  assert.strictEqual(qr.length, 3);

  // Shape: exactly {id, section, correct, difficulty}; nothing else (no text/options).
  for (const item of qr) {
    assert.deepStrictEqual(Object.keys(item).sort(), ['correct', 'difficulty', 'id', 'section']);
    assert.strictEqual('text' in item, false);
    assert.strictEqual('options' in item, false);
  }

  const byId = (id) => qr.find(q => q.id === id);
  assert.deepEqual({ ...byId(1) }, { id: 1, section: 'AR', correct: true, difficulty: 2 });
  assert.deepEqual({ ...byId(2) }, { id: 2, section: 'AR', correct: false, difficulty: 4 });
  assert.deepEqual({ ...byId(3) }, { id: 3, section: 'WK', correct: true, difficulty: 3 });

  // section_scores: {correct,total} only here — getScoreDetails returned null
  // (this fixture doesn't include all 4 AFQT sections), so no theta/sem/ss.
  assert.deepEqual({ ...insertedPayload.section_scores.AR }, { correct: 1, total: 2 });
  assert.deepEqual({ ...insertedPayload.section_scores.WK }, { correct: 1, total: 1 });

  assert.strictEqual(insertedPayload.scoring_version, 'irt-v2');

  // Stringified payload must not leak any question text.
  const json = JSON.stringify(insertedPayload);
  assert.strictEqual(json.includes('q1'), false, 'no question text in payload');
  assert.strictEqual(json.includes('options'), false, 'no options key in payload');
});
