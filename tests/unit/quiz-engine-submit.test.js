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

// Final-review fix 1 — saveResultsToSupabase must guard the
// MissionASVABScoring.calculateLineScores call exactly like submitQuiz already
// guards getScoreDetails: scoring.js deliberately throws on a missing/corrupt
// incomplete-test penalty entry, and by the time saveResultsToSupabase runs,
// quizState/generatedTest/testConfig are already cleared — an unguarded throw
// here would strand the user on a dead quiz page. It must log and fall back to
// null line scores, and the save + redirect must still complete.
test('saveResultsToSupabase survives a calculateLineScores throw: logs, saves with null line_scores, and still redirects', async () => {
  const document = fakeDoc();
  document._els['nextBtn'] = { disabled: false };
  const win = { location: { href: '' } };

  let insertedPayload = null;
  const client = {
    from() {
      return { insert: async (payload) => { insertedPayload = payload; return { error: null }; } };
    }
  };

  const loggedMessages = [];

  const sandbox = loadEngine({
    document,
    window: win,
    console: { error: (...args) => { loggedMessages.push(args.join(' ')); }, log() {}, warn() {} },
    localStorage: { setItem() {}, removeItem() {} },
    sessionStorage: { removeItem() {} },
    MissionASVABConfig: { getTestTypeFromSections: () => 'full' },
    MissionASVABScoring: {
      getScoreDetails: () => null,
      calculateLineScores: () => { throw new Error('missing penalty entry'); },
    },
    getClient: () => client,
    getSession: async () => ({ user: { id: 'user-456' } }),
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

  await engine.submitQuiz();

  assert.ok(loggedMessages.some((m) => m.includes('calculateLineScores')),
    'expected the throw to be logged via console.error');
  assert.ok(insertedPayload, 'the insert still happened despite the throw');
  assert.strictEqual(insertedPayload.line_scores, null, 'line_scores falls back to null on a throw');
  assert.strictEqual(win.location.href, 'results.html', 'the redirect still happens after the throw');
});
