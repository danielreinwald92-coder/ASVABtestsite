const { test } = require('node:test');
const assert = require('node:assert');
const { loadEngine, fakeDoc } = require('../helpers/engine.js');

// 4.1 — submitQuiz persists a COMPACT per-question results array
// ({id, section, correct}) to test_results, with NO question text/options.
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
    MissionASVABScoring: { calculateAFQTEstimate: () => 42, calculateLineScores: () => ({ GT: 110 }) },
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
      { id: 1, sectionCode: 'AR', sectionName: 'AR', text: 'q1', options: ['a', 'b'], correct: 0 },
      { id: 2, sectionCode: 'AR', sectionName: 'AR', text: 'q2', options: ['a', 'b'], correct: 1 },
      { id: 3, sectionCode: 'WK', sectionName: 'WK', text: 'q3', options: ['a', 'b'], correct: 0 },
    ],
  };
  engine.answers = { 1: 0, 2: 0, 3: 0 }; // q1 right, q2 wrong, q3 right

  await engine.submitQuiz();

  assert.ok(insertedPayload, 'insert was called');
  assert.strictEqual(insertedPayload.user_id, 'user-123', 'insert uses session user id (RLS)');

  const qr = insertedPayload.question_results;
  assert.ok(Array.isArray(qr), 'question_results is an array');
  assert.strictEqual(qr.length, 3);

  // Shape: exactly {id, section, correct}; nothing else (no text/options).
  for (const item of qr) {
    assert.deepStrictEqual(Object.keys(item).sort(), ['correct', 'id', 'section']);
    assert.strictEqual('text' in item, false);
    assert.strictEqual('options' in item, false);
  }

  const byId = (id) => qr.find(q => q.id === id);
  assert.deepEqual({ ...byId(1) }, { id: 1, section: 'AR', correct: true });
  assert.deepEqual({ ...byId(2) }, { id: 2, section: 'AR', correct: false });
  assert.deepEqual({ ...byId(3) }, { id: 3, section: 'WK', correct: true });

  // section_scores unchanged: still {correct,total} only.
  assert.deepEqual({ ...insertedPayload.section_scores.AR }, { correct: 1, total: 2 });
  assert.deepEqual({ ...insertedPayload.section_scores.WK }, { correct: 1, total: 1 });

  // Stringified payload must not leak any question text.
  const json = JSON.stringify(insertedPayload);
  assert.strictEqual(json.includes('q1'), false, 'no question text in payload');
  assert.strictEqual(json.includes('options'), false, 'no options key in payload');
});
