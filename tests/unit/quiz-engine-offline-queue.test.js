const { test } = require('node:test');
const assert = require('node:assert');
const { loadEngine } = require('../helpers/engine.js');

function makeLocalStorage(initial = {}) {
  const store = { ...initial };
  return {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; }
  };
}

function newEngine(localStorage) {
  const sandbox = loadEngine({ localStorage });
  return new sandbox.QuizEngine();
}

test('_queuePendingResult appends to the pendingTestResults array', () => {
  const ls = makeLocalStorage();
  const engine = newEngine(ls);

  engine._queuePendingResult({ user_id: 'u1', afqt_score: 10 }, 'err1');
  engine._queuePendingResult({ user_id: 'u1', afqt_score: 20 }, 'err2');

  const queue = JSON.parse(ls.getItem('pendingTestResults'));
  assert.strictEqual(queue.length, 2, 'both results queued');
  assert.strictEqual(queue[0].payload.afqt_score, 10);
  assert.strictEqual(queue[1].payload.afqt_score, 20);
});

test('_queuePendingResult migrates a legacy single pendingTestResult key', () => {
  const ls = makeLocalStorage({
    pendingTestResult: JSON.stringify({ payload: { user_id: 'u1', afqt_score: 5 }, queuedAt: 'x' })
  });
  const engine = newEngine(ls);

  engine._queuePendingResult({ user_id: 'u1', afqt_score: 99 }, 'err');

  assert.strictEqual(ls.getItem('pendingTestResult'), null, 'legacy key removed');
  const queue = JSON.parse(ls.getItem('pendingTestResults'));
  assert.strictEqual(queue.length, 2, 'legacy + new entry');
  assert.strictEqual(queue[0].payload.afqt_score, 5, 'legacy migrated first');
  assert.strictEqual(queue[1].payload.afqt_score, 99);
});
