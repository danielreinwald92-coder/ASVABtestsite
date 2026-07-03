const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..', '..');

function load(localStoreThrows = false) {
  const store = {};
  const localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { if (localStoreThrows) throw new Error('quota'); store[k] = String(v); },
  };
  const sandbox = {
    console, localStorage,
    // Minimal asvabData so cap = poolSize - questionsPerTest is computable.
    asvabData: {
      questions: { AS: Array.from({ length: 25 }, (_, i) => ({ id: 'AS' + i })) },
      sections: { AS: { questionsPerTest: 10 } },
    },
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(root, 'js/recent-seen.js'), 'utf8'), sandbox);
  return { api: sandbox.MissionASVABRecentSeen, store };
}

test('record then getRecent returns stored ids (most-recent last)', () => {
  const { api } = load();
  api.record('AS', ['AS1', 'AS2']);
  api.record('AS', ['AS3']);
  assert.deepStrictEqual([...api.getRecent('AS')], ['AS1', 'AS2', 'AS3']);
});

test('dedupes, keeping the most recent occurrence', () => {
  const { api } = load();
  api.record('AS', ['AS1', 'AS2']);
  api.record('AS', ['AS1']); // AS1 seen again → moves to the end, no dupe
  assert.deepStrictEqual([...api.getRecent('AS')], ['AS2', 'AS1']);
});

test('caps stored ids at poolSize - questionsPerTest (25 - 10 = 15)', () => {
  const { api } = load();
  const ids = Array.from({ length: 30 }, (_, i) => 'AS' + i);
  api.record('AS', ids);
  const kept = api.getRecent('AS');
  assert.strictEqual(kept.length, 15, 'must cap at 15');
  assert.strictEqual(kept[kept.length - 1], 'AS29', 'keeps the newest');
  assert.strictEqual(kept[0], 'AS15', 'drops the oldest');
});

test('getRecent is [] for an unknown section', () => {
  const { api } = load();
  assert.deepStrictEqual([...api.getRecent('WK')], []);
});

test('never throws when localStorage.setItem throws (quota)', () => {
  const { api } = load(true);
  assert.doesNotThrow(() => api.record('AS', ['AS1']));
  assert.deepStrictEqual([...api.getRecent('AS')], []); // nothing persisted, but no crash
});
