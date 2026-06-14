const { test } = require('node:test');
const assert = require('node:assert');
const { runPageScript, flush } = require('../helpers/load.js');

function deferred() {
  let resolve;
  const promise = new Promise((r) => { resolve = r; });
  return { promise, resolve };
}

// 2.9(a) — diagnostic save awaits the profile update before navigating, and
// surfaces a visible error if the update fails.

test('diagnostic handler awaits the update before navigating', async () => {
  const d = deferred();
  const location = { href: '' };
  const updateCalls = [];
  const client = {
    from: () => ({
      update: (vals) => { updateCalls.push(vals); return { eq: () => d.promise }; }
    })
  };
  const { document } = runPageScript('dashboard.html', 'diagnosticBtn', {
    location,
    getSession: async () => ({ user: { id: 'u1' } }),
    getClient: () => client,
    globals: { loadDashboard: () => {} }
  });

  document.getElementById('testDateInput').value = '2026-09-01';
  document.getElementById('diagnosticBtn').dispatchEvent(
    new document.defaultView.MouseEvent('click', { bubbles: true, cancelable: true })
  );

  await flush();
  // update was invoked, but navigation must NOT have happened yet
  assert.strictEqual(updateCalls.length, 1);
  assert.strictEqual(updateCalls[0].test_date, '2026-09-01');
  assert.strictEqual(location.href, '', 'navigated before update resolved');

  d.resolve({ error: null });
  await flush();
  assert.strictEqual(location.href, 'select-test.html', 'did not navigate after success');
});

test('diagnostic handler surfaces a visible error on update failure', async () => {
  const location = { href: '' };
  const client = {
    from: () => ({ update: () => ({ eq: async () => ({ error: { message: 'db down' } }) }) })
  };
  const { document } = runPageScript('dashboard.html', 'diagnosticBtn', {
    location,
    getSession: async () => ({ user: { id: 'u1' } }),
    getClient: () => client,
    globals: { loadDashboard: () => {} }
  });

  document.getElementById('testDateInput').value = '2026-09-01';
  document.getElementById('diagnosticBtn').dispatchEvent(
    new document.defaultView.MouseEvent('click', { bubbles: true, cancelable: true })
  );

  await flush();
  const msg = document.getElementById('diagMsg');
  assert.notStrictEqual(msg.style.display, 'none', 'error message should be visible');
  assert.ok(msg.textContent.length > 0, 'error message should have text');
  assert.strictEqual(location.href, '', 'should not navigate after a surfaced error');
});
