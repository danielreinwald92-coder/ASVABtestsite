const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { rootDir, makeLocalStorage } = require('../helpers/load.js');

function load(env = {}) {
  const localStorage = env.localStorage || makeLocalStorage();
  const window = { localStorage };
  const context = {
    window, localStorage, console, Date, JSON, Object, Array, String, Number,
    getSession: env.getSession || (async () => null),
    getClient: env.getClient || (() => null)
  };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(rootDir, 'js/mission-progress.js'), 'utf8'), context);
  return { api: window.MissionASVABMissionProgress, localStorage };
}

function mission() {
  return {
    clientId: 'mission-1', version: 1, sourceResultClientId: 'result-1',
    status: 'not_started', primarySection: 'AR', title: 'Build AR', summary: 'Study',
    activityType: 'lesson_quiz', target: { section: 'AR', chapterId: 'AR-1' },
    priorities: [], createdAt: '2026-07-19T12:00:00.000Z', updatedAt: '2026-07-19T12:00:00.000Z'
  };
}

test('local mission history upserts by client id instead of duplicating', () => {
  const { api } = load();
  api.saveLocalMission(mission());
  api.saveLocalMission({ ...mission(), status: 'in_progress' });
  const all = api.loadLocalMissions();
  assert.strictEqual(all.length, 1);
  assert.strictEqual(all[0].status, 'in_progress');
});

test('compact result payload uses bank ids and excludes answer content', () => {
  const { api } = load();
  const payload = api.compactResultPayload({
    clientResultId: 'result-1', testType: 'diagnostic', mode: 'timed', afqt: null,
    completedAt: '2026-07-19T12:00:00.000Z',
    sectionResults: { AR: { correct: 1, total: 2, questions: [
      { id: 1, originalId: 'AR042', isCorrect: true, text: 'private text', options: ['a'] },
      { id: 2, originalId: 'AR099', isCorrect: false, text: 'more private text', options: ['b'] }
    ] } }
  }, 'user-1');
  assert.deepEqual(payload.question_results.map((q) => q.id), ['AR042', 'AR099']);
  assert.strictEqual(payload.test_type, 'diagnostic');
  assert.strictEqual(payload.line_scores, null);
  assert.strictEqual(JSON.stringify(payload).includes('private text'), false);
  assert.strictEqual(JSON.stringify(payload).includes('options'), false);
});

test('guest result imports once and is then marked as owned', async () => {
  const localStorage = makeLocalStorage({ quizResults: JSON.stringify({
    clientResultId: 'result-1', testType: 'diagnostic', mode: 'timed', afqt: null,
    completedAt: '2026-07-19T12:00:00.000Z', sectionResults: {}
  }) });
  let inserts = 0;
  const db = { from: () => ({ insert: async () => { inserts++; return { error: null }; } }) };
  const { api } = load({ localStorage, getClient: () => db });
  const session = { user: { id: 'user-1' } };
  const first = await api.importLocalResult(session);
  const second = await api.importLocalResult(session);
  assert.strictEqual(first.ok, true);
  assert.strictEqual(second.skipped, true);
  assert.strictEqual(inserts, 1);
});

test('a completed local mission cannot regress when reopened for review', async () => {
  const localStorage = makeLocalStorage();
  const { api } = load({ localStorage });
  api.saveLocalMission({ ...mission(), status: 'completed', completedAt: '2026-07-19T13:00:00.000Z' });
  const result = await api.setMissionStatus('mission-1', 'in_progress');
  assert.strictEqual(result.ok, true);
  assert.strictEqual(api.getLocalMission('mission-1').status, 'completed');
  assert.strictEqual(api.getLocalMission('mission-1').completedAt, '2026-07-19T13:00:00.000Z');
});
