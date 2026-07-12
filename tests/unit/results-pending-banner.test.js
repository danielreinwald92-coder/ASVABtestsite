const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..', '..');

function extractFn(source, name) {
  const start = source.indexOf('function ' + name + '(');
  assert.ok(start >= 0, `could not find ${name}`);
  let depth = 0, i = source.indexOf('{', start);
  for (; i < source.length; i++) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}' && --depth === 0) break;
  }
  return source.slice(start, i + 1);
}

const src = fs.readFileSync(path.join(root, 'js/page-results.js'), 'utf8');

function makeSandbox(store) {
  const els = {
    saveStatusText: { textContent: '' },
    saveStatusBanner: { style: { display: 'none' } },
    retrySaveBtn: { disabled: false, textContent: 'Retry', onclick: null },
  };
  const sandbox = {
    console,
    localStorage: {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
    },
    document: { getElementById: (id) => els[id] || null },
    JSON,
  };
  sandbox._els = els;
  vm.createContext(sandbox);
  vm.runInContext(
    extractFn(src, 'showSaveBanner') + '\n' + extractFn(src, 'checkPendingResultSync') +
    '\nthis.__check = checkPendingResultSync;',
    sandbox
  );
  return sandbox;
}

test('save-failed banner appears for entries in the CURRENT queue key (pendingTestResults)', () => {
  const sandbox = makeSandbox({
    pendingTestResults: JSON.stringify([{ payload: { user_id: 'u1' }, queuedAt: 'x' }]),
  });
  sandbox.__check();
  assert.strictEqual(sandbox._els.saveStatusBanner.style.display, 'block',
    'banner must show when the engine-written queue key has entries');
});

test('no banner when the queue is empty', () => {
  const sandbox = makeSandbox({});
  sandbox.__check();
  assert.strictEqual(sandbox._els.saveStatusBanner.style.display, 'none');
});

test('retry drains the queue via flushPendingTestResults and hides the banner', async () => {
  const sandbox = makeSandbox({
    pendingTestResults: JSON.stringify([{ payload: { user_id: 'u1' }, queuedAt: 'x' }]),
  });
  let flushCalls = 0;
  sandbox.flushPendingTestResults = async () => { flushCalls++; return { flushed: 1, remaining: 0 }; };
  sandbox.__check();
  assert.strictEqual(typeof sandbox._els.retrySaveBtn.onclick, 'function');
  await sandbox._els.retrySaveBtn.onclick();
  assert.strictEqual(flushCalls, 1);
  assert.strictEqual(sandbox._els.saveStatusBanner.style.display, 'none');
});
