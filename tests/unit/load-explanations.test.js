const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..', '..');

function loadInSandbox(extraGlobals = {}) {
  const sandbox = Object.assign({ console }, extraGlobals);
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  const src = fs.readFileSync(path.join(root, 'js/load-explanations.js'), 'utf8');
  vm.runInContext(src, sandbox);
  return sandbox;
}

test('loadExplanations resolves immediately when QUIZ_EXPLANATIONS already present', async () => {
  const sandbox = loadInSandbox({ QUIZ_EXPLANATIONS: { AR001: 'because' } });
  const map = await sandbox.loadExplanations();
  assert.deepStrictEqual(map, { AR001: 'because' });
});

test('loadExplanations resolves {} when the injected script errors', async () => {
  // Fake document whose appended <script> immediately fires onerror.
  const fakeDoc = {
    head: { appendChild(node) { if (node.onerror) node.onerror(); } },
    createElement() { return { set src(v) {}, onload: null, onerror: null }; },
  };
  const sandbox = loadInSandbox({ document: fakeDoc });
  const map = await sandbox.loadExplanations();
  // Realm-normalize: the loader resolves {} inside the vm sandbox, whose
  // Object.prototype differs from this realm's, so a raw deepStrictEqual(map, {})
  // fails on prototype identity. Spread copies own props into a local object.
  assert.deepStrictEqual({ ...map }, {});
});

test('a failed load is retried on the next call (no session-sticky empty cache)', async () => {
  let attempts = 0;
  const fakeDoc = {
    head: {
      appendChild(node) {
        attempts++;
        if (attempts === 1) {
          if (node.onerror) node.onerror(); // transient network blip
        } else {
          this._sandbox.QUIZ_EXPLANATIONS = { AR001: 'because' };
          if (node.onload) node.onload();
        }
      },
    },
    createElement() { return { set src(v) {}, onload: null, onerror: null }; },
  };
  const sandbox = loadInSandbox({ document: fakeDoc });
  fakeDoc.head._sandbox = sandbox;
  const first = await sandbox.loadExplanations();
  assert.deepStrictEqual({ ...first }, {});
  const second = await sandbox.loadExplanations();
  assert.deepStrictEqual(second, { AR001: 'because' });
  assert.strictEqual(attempts, 2);
});

test('loadExplanations resolves the map when the injected script loads', async () => {
  const fakeDoc = {
    head: {
      appendChild(node) {
        // Simulate the script tag running explanations.js, then firing onload.
        this._sandbox.QUIZ_EXPLANATIONS = { MK009: 'x squared' };
        if (node.onload) node.onload();
      },
    },
    createElement() { return { set src(v) {}, onload: null, onerror: null }; },
  };
  const sandbox = loadInSandbox({ document: fakeDoc });
  fakeDoc.head._sandbox = sandbox;
  const map = await sandbox.loadExplanations();
  assert.deepStrictEqual(map, { MK009: 'x squared' });
});
