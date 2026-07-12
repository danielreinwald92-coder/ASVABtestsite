const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..', '..');

function extractFn(source, name) {
  const start = source.indexOf('async function ' + name + '(');
  const start2 = start >= 0 ? start : source.indexOf('function ' + name + '(');
  assert.ok(start2 >= 0, `could not find ${name}`);
  let depth = 0, i = source.indexOf('{', start2);
  for (; i < source.length; i++) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}' && --depth === 0) break;
  }
  return source.slice(start2, i + 1);
}

const src = fs.readFileSync(path.join(root, 'js/dashboard.js'), 'utf8');

function makeSandbox(store, updateResult) {
  const calls = [];
  const sandbox = {
    console,
    JSON,
    localStorage: {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
    },
    client: {
      from: () => ({
        update: (fields) => {
          calls.push(fields);
          return { eq: () => ({ select: async () => updateResult }) };
        },
      }),
    },
    _calls: calls,
  };
  vm.createContext(sandbox);
  vm.runInContext(extractFn(src, 'applyPendingProfile') + '\nthis.__fn = applyPendingProfile;', sandbox);
  return sandbox;
}

test('applyPendingProfile pushes a stashed registration profile and clears the stash', async () => {
  const store = { 'missionasvab.pendingProfile': JSON.stringify({ name: 'Jane', age: 20, education: 'Some College', zipcode: '30905' }) };
  const sandbox = makeSandbox(store, { data: [{ id: 'u1' }], error: null });
  await sandbox.__fn(sandbox.client, 'u1');
  assert.strictEqual(sandbox._calls.length, 1);
  assert.strictEqual(sandbox._calls[0].name, 'Jane');
  assert.ok(!('missionasvab.pendingProfile' in store), 'stash cleared after confirmed update');
});

test('applyPendingProfile keeps the stash when the update fails or matches 0 rows', async () => {
  const store = { 'missionasvab.pendingProfile': JSON.stringify({ name: 'Jane' }) };
  const sandbox = makeSandbox(store, { data: [], error: null });
  await sandbox.__fn(sandbox.client, 'u1');
  assert.ok('missionasvab.pendingProfile' in store, 'stash kept for a later retry');
});

test('applyPendingProfile is a no-op with nothing stashed', async () => {
  const sandbox = makeSandbox({}, { data: [{ id: 'u1' }], error: null });
  await sandbox.__fn(sandbox.client, 'u1');
  assert.strictEqual(sandbox._calls.length, 0);
});
