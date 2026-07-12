const { test } = require('node:test');
const assert = require('node:assert');
const { runPageScript, flush, makeLocalStorage } = require('../helpers/load.js');

// 2.9(b) — a failing profiles UPDATE after a successful signUp must surface a
// visible warning instead of silently succeeding.

function makeClient(profileResult, opts = {}) {
  const calls = { update: 0 };
  const client = {
    _calls: calls,
    auth: {
      signUp: async () => ({
        data: {
          user: { id: 'u1' },
          session: opts.noSession ? null : { access_token: 'x' }
        },
        error: null
      })
    },
    from: () => ({
      update: () => {
        calls.update++;
        return { eq: () => ({ select: async () => profileResult }) };
      }
    })
  };
  return client;
}

function fillForm(document) {
  document.getElementById('name').value = 'Jane Smith';
  document.getElementById('email').value = 'jane@example.com';
  document.getElementById('password').value = 'supersecret';
  document.getElementById('education').value = 'Some College';
  document.getElementById('age').value = '20';
  document.getElementById('zipcode').value = '90210';
}

test('register treats a 0-row profile update as a failure (RLS silently matches nothing)', async () => {
  // Supabase returns NO error for an update that matches 0 rows — without
  // .select() verification the user's details would vanish silently.
  const client = makeClient({ data: [], error: null });
  const { document } = runPageScript('register.html', 'registerForm', {
    location: { href: '', origin: 'https://example.test' },
    getSession: async () => null,
    getClient: () => client
  });

  fillForm(document);
  document.getElementById('registerForm').dispatchEvent(
    new document.defaultView.Event('submit', { bubbles: true, cancelable: true })
  );

  await flush();
  const success = document.getElementById('successMsg');
  assert.match(success.textContent, /saving your details failed/i);
});

test('register with email-confirmation flow (no session) stashes the profile for later instead of a doomed update', async () => {
  const client = makeClient({ data: [{ id: 'u1' }], error: null }, { noSession: true });
  const ls = makeLocalStorage();
  const { document } = runPageScript('register.html', 'registerForm', {
    location: { href: '', origin: 'https://example.test' },
    getSession: async () => null,
    getClient: () => client,
    localStorage: ls
  });

  fillForm(document);
  document.getElementById('registerForm').dispatchEvent(
    new document.defaultView.Event('submit', { bubbles: true, cancelable: true })
  );

  await flush();
  assert.strictEqual(client._calls.update, 0, 'no anon update attempted (it would match 0 rows)');
  const stashed = JSON.parse(ls.getItem('missionasvab.pendingProfile'));
  assert.strictEqual(stashed.name, 'Jane Smith');
  assert.strictEqual(stashed.age, 20);
  const success = document.getElementById('successMsg');
  assert.match(success.textContent, /Account created/i);
  assert.doesNotMatch(success.textContent, /failed/i);
});

test('register surfaces a visible warning when the profile update fails', async () => {
  const client = makeClient({ data: null, error: { message: 'rls denied' } });
  const { document } = runPageScript('register.html', 'registerForm', {
    location: { href: '', origin: 'https://example.test' },
    getSession: async () => null,
    getClient: () => client
  });

  fillForm(document);
  document.getElementById('registerForm').dispatchEvent(
    new document.defaultView.Event('submit', { bubbles: true, cancelable: true })
  );

  await flush();
  const success = document.getElementById('successMsg');
  assert.notStrictEqual(success.style.display, 'none', 'a message should be visible');
  assert.match(success.textContent, /saving your details failed/i);
});

test('register shows the normal success message when the profile update succeeds', async () => {
  const client = makeClient({ data: [{ id: 'u1' }], error: null });
  const { document } = runPageScript('register.html', 'registerForm', {
    location: { href: '', origin: 'https://example.test' },
    getSession: async () => null,
    getClient: () => client
  });

  fillForm(document);
  document.getElementById('registerForm').dispatchEvent(
    new document.defaultView.Event('submit', { bubbles: true, cancelable: true })
  );

  await flush();
  const success = document.getElementById('successMsg');
  assert.doesNotMatch(success.textContent, /failed/i);
  assert.match(success.textContent, /Account created/i);
});
