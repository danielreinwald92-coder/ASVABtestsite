const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..', '..');
const SRC = fs.readFileSync(path.join(root, 'js/offline-queue.js'), 'utf8');

function makeLocalStorage(initial = {}) {
  const store = { ...initial };
  return {
    _store: store,
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; }
  };
}

function mockClient(inserts, behavior = () => ({ error: null })) {
  return () => ({
    from: () => ({
      insert: async (payload) => {
        inserts.push(payload);
        return behavior(payload);
      }
    })
  });
}

// Load js/offline-queue.js into an isolated vm sandbox with controllable seams.
function load({ localStorage, getClient, getSession, onLine = true, withClient = true }) {
  const sandbox = {
    console,
    setTimeout: () => 0,
    clearTimeout: () => {},
    localStorage,
    navigator: { onLine },
    window: { addEventListener: () => {} },
    document: undefined,
    Promise, JSON, Date, Array, Object, String, Number, Boolean
  };
  if (withClient) {
    sandbox.getClient = getClient || mockClient([]);
    sandbox.getSession = getSession || (async () => ({ user: { id: 'u1' } }));
  }
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(SRC, sandbox);
  return sandbox;
}

test('a queued result is flushed and removed on success', async () => {
  const ls = makeLocalStorage({
    pendingTestResults: JSON.stringify([
      { payload: { user_id: 'u1', afqt_score: 50 }, queuedAt: 'x' }
    ])
  });
  const inserts = [];
  const sandbox = load({ localStorage: ls, getClient: mockClient(inserts) });

  const res = await sandbox.flushPendingTestResults();

  assert.strictEqual(res.flushed, 1);
  assert.strictEqual(res.remaining, 0);
  assert.strictEqual(inserts.length, 1);
  assert.deepStrictEqual(inserts[0], { user_id: 'u1', afqt_score: 50 });
  assert.strictEqual(ls.getItem('pendingTestResults'), null, 'queue cleared on success');
});

test('flush is a no-op when there is no session', async () => {
  const queue = JSON.stringify([{ payload: { user_id: 'u1' }, queuedAt: 'x' }]);
  const ls = makeLocalStorage({ pendingTestResults: queue });
  const inserts = [];
  const sandbox = load({
    localStorage: ls,
    getClient: mockClient(inserts),
    getSession: async () => null
  });

  const res = await sandbox.flushPendingTestResults();

  assert.strictEqual(res.flushed, 0);
  assert.strictEqual(res.reason, 'no-session');
  assert.strictEqual(inserts.length, 0, 'no insert attempted');
  assert.strictEqual(ls.getItem('pendingTestResults'), queue, 'queue left intact');
});

test('flush is a no-op when the browser is offline', async () => {
  const queue = JSON.stringify([{ payload: { user_id: 'u1' }, queuedAt: 'x' }]);
  const ls = makeLocalStorage({ pendingTestResults: queue });
  const inserts = [];
  const sandbox = load({ localStorage: ls, getClient: mockClient(inserts), onLine: false });

  const res = await sandbox.flushPendingTestResults();

  assert.strictEqual(res.flushed, 0);
  assert.strictEqual(res.reason, 'offline');
  assert.strictEqual(inserts.length, 0);
  assert.strictEqual(ls.getItem('pendingTestResults'), queue, 'queue left intact');
});

test('flush is a no-op when no Supabase client is present', async () => {
  const queue = JSON.stringify([{ payload: { user_id: 'u1' }, queuedAt: 'x' }]);
  const ls = makeLocalStorage({ pendingTestResults: queue });
  const sandbox = load({ localStorage: ls, withClient: false });

  const res = await sandbox.flushPendingTestResults();

  assert.strictEqual(res.flushed, 0);
  assert.strictEqual(res.reason, 'no-client');
  assert.strictEqual(ls.getItem('pendingTestResults'), queue, 'queue left intact');
});

test('multiple queued results all flush and clear', async () => {
  const ls = makeLocalStorage({
    pendingTestResults: JSON.stringify([
      { payload: { user_id: 'u1', afqt_score: 40 }, queuedAt: 'a' },
      { payload: { user_id: 'u1', afqt_score: 55 }, queuedAt: 'b' },
      { payload: { user_id: 'u1', afqt_score: 70 }, queuedAt: 'c' }
    ])
  });
  const inserts = [];
  const sandbox = load({ localStorage: ls, getClient: mockClient(inserts) });

  const res = await sandbox.flushPendingTestResults();

  assert.strictEqual(res.flushed, 3);
  assert.strictEqual(res.remaining, 0);
  assert.strictEqual(inserts.length, 3);
  assert.strictEqual(ls.getItem('pendingTestResults'), null);
});

test('failed inserts are kept (not dropped, not double-inserted)', async () => {
  const ls = makeLocalStorage({
    pendingTestResults: JSON.stringify([
      { payload: { user_id: 'u1', afqt_score: 40 }, queuedAt: 'a' },
      { payload: { user_id: 'u1', afqt_score: 55 }, queuedAt: 'b' }
    ])
  });
  const inserts = [];
  // First insert fails, second succeeds.
  const client = mockClient(inserts, (p) =>
    p.afqt_score === 40 ? { error: { message: 'boom' } } : { error: null }
  );
  const sandbox = load({ localStorage: ls, getClient: client });

  const res = await sandbox.flushPendingTestResults();

  assert.strictEqual(res.flushed, 1);
  assert.strictEqual(res.remaining, 1);
  const left = JSON.parse(ls.getItem('pendingTestResults'));
  assert.strictEqual(left.length, 1);
  assert.strictEqual(left[0].payload.afqt_score, 40, 'the failed one is retained');
});

test('legacy single-key pendingTestResult is migrated and flushed', async () => {
  const ls = makeLocalStorage({
    pendingTestResult: JSON.stringify({ payload: { user_id: 'u1', afqt_score: 33 }, queuedAt: 'x' })
  });
  const inserts = [];
  const sandbox = load({ localStorage: ls, getClient: mockClient(inserts) });

  const res = await sandbox.flushPendingTestResults();

  assert.strictEqual(res.flushed, 1);
  assert.deepStrictEqual(inserts[0], { user_id: 'u1', afqt_score: 33 });
  assert.strictEqual(ls.getItem('pendingTestResult'), null, 'legacy key removed');
  assert.strictEqual(ls.getItem('pendingTestResults'), null, 'queue cleared');
});
