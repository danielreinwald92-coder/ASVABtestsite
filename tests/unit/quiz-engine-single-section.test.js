const { test } = require('node:test');
const assert = require('node:assert');
const { loadEngine, fakeDoc } = require('../helpers/engine.js');

// Final-review fix 2 (single-section standard score, spec §10) — single-
// section timed practice never has all 4 AFQT sections, so getScoreDetails
// always returns null for it (see quiz-engine-afqt-gate.test.js). submitQuiz
// now separately calls MissionASVABScoring.getSingleSectionDetails for
// exactly that case and stamps theta/sem/ss onto the section's stored entry,
// the same way the AFQT/full-test path already does — page-results.js's
// formatSectionScoreLine renders the SS with no further changes.
function engineFor(sections, engineOverrides = {}, scoringOverrides = {}) {
  const stored = {};
  const win = { location: { href: '' } };
  const sandbox = loadEngine({
    document: fakeDoc(),
    window: win,
    console: { error() {}, log() {}, warn() {} },
    localStorage: { setItem: (k, v) => { stored[k] = v; }, removeItem() {} },
    sessionStorage: { removeItem() {}, setItem() {} },
    MissionASVABConfig: { AFQT_SECTIONS: ['AR', 'WK', 'PC', 'MK'], getTestTypeFromSections: () => 'single' },
    MissionASVABScoring: Object.assign({
      getScoreDetails: () => null, // a single-section test never has all 4 AFQT sections
      getSingleSectionDetails: (sectionResults, code) => {
        if (!sectionResults[code]) return null;
        return { theta: 0.42, sem: 0.91, ss: 55.3 };
      },
      calculateLineScores: () => null,
    }, scoringOverrides),
  });
  const engine = new sandbox.QuizEngine();
  engine.mode = 'timed';
  engine.testKind = 'single';
  engine.testSections = sections;
  engine.quizData = {
    section: 'Arithmetic Reasoning', sectionCode: sections.join(','), timeLimit: 100,
    questions: sections.flatMap((s) => [1, 2].map((n) => ({
      id: `${s}${n}`, originalId: `${s}${n}`, sectionCode: s, sectionName: s,
      text: 'q', options: ['a', 'b', 'c', 'd'], correct: 0,
    }))),
  };
  engine.answers = {};
  engine.quizData.questions.forEach((q) => { engine.answers[q.id] = 0; });
  engine.timeRemaining = 40;
  engine.saveResultsToSupabase = async () => ({ skipped: true });
  engine.materializeSlot = () => {};
  Object.assign(engine, engineOverrides);
  return { engine, stored, win };
}

test('single-section timed practice stamps theta/sem/ss onto the section and keeps afqt null', () => {
  const { engine, stored } = engineFor(['AR']);
  return engine.submitQuiz().then(() => {
    const results = JSON.parse(stored.quizResults);
    assert.strictEqual(results.afqt, null, 'single-section practice never gets an AFQT percentile');
    assert.strictEqual(typeof results.score, 'number', 'the % headline is still present');
    const ar = results.sectionResults.AR;
    assert.strictEqual(ar.theta, 0.42);
    assert.strictEqual(ar.sem, 0.91);
    assert.strictEqual(ar.ss, 55); // Math.round(55.3)
  });
});

test('single-section TUTOR practice does not stamp theta/sem/ss (tutor never scores via IRT)', () => {
  const { engine, stored } = engineFor(['AR'], { mode: 'tutor' });
  return engine.submitQuiz().then(() => {
    const results = JSON.parse(stored.quizResults);
    const ar = results.sectionResults.AR;
    assert.strictEqual('theta' in ar, false);
    assert.strictEqual('ss' in ar, false);
  });
});

test('a multi-section custom subset (not AFQT/full/single) does not call the single-section wrapper', () => {
  const { engine, stored } = engineFor(['AR', 'GS'], { testKind: 'custom' });
  return engine.submitQuiz().then(() => {
    const results = JSON.parse(stored.quizResults);
    assert.strictEqual('theta' in results.sectionResults.AR, false);
    assert.strictEqual('theta' in results.sectionResults.GS, false);
  });
});

test('a getSingleSectionDetails throw is caught, and the save/redirect flow still completes', () => {
  const { engine, stored, win } = engineFor(['AR'], {}, {
    getSingleSectionDetails: () => { throw new Error('boom'); },
  });

  return engine.submitQuiz().then(() => {
    const results = JSON.parse(stored.quizResults);
    assert.strictEqual('theta' in results.sectionResults.AR, false, 'no stamping happened after the throw');
    assert.strictEqual(win.location.href, 'results.html', 'the redirect still happens after the throw');
  });
});

test('a getSingleSectionDetails throw is logged via console.error', () => {
  const loggedMessages = [];
  const stored = {};
  const win = { location: { href: '' } };
  const sandbox = loadEngine({
    document: fakeDoc(),
    window: win,
    console: { error: (...args) => { loggedMessages.push(args.join(' ')); }, log() {}, warn() {} },
    localStorage: { setItem: (k, v) => { stored[k] = v; }, removeItem() {} },
    sessionStorage: { removeItem() {}, setItem() {} },
    MissionASVABConfig: { AFQT_SECTIONS: ['AR', 'WK', 'PC', 'MK'], getTestTypeFromSections: () => 'single' },
    MissionASVABScoring: {
      getScoreDetails: () => null,
      getSingleSectionDetails: () => { throw new Error('boom'); },
      calculateLineScores: () => null,
    },
  });
  const engine = new sandbox.QuizEngine();
  engine.mode = 'timed';
  engine.testKind = 'single';
  engine.testSections = ['AR'];
  engine.quizData = {
    section: 'Arithmetic Reasoning', sectionCode: 'AR', timeLimit: 100,
    questions: [{ id: 1, originalId: 'AR1', sectionCode: 'AR', sectionName: 'AR', text: 'q', options: ['a', 'b', 'c', 'd'], correct: 0 }],
  };
  engine.answers = { 1: 0 };
  engine.timeRemaining = 40;
  engine.saveResultsToSupabase = async () => ({ skipped: true });
  engine.materializeSlot = () => {};

  return engine.submitQuiz().then(() => {
    assert.ok(loggedMessages.some((m) => m.includes('getSingleSectionDetails')),
      'expected the throw to be logged via console.error');
  });
});
