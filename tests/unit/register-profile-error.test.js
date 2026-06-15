const { test } = require('node:test');
const assert = require('node:assert');
const { runPageScript, flush } = require('../helpers/load.js');

// 2.9(b) — a failing profiles UPDATE after a successful signUp must surface a
// visible warning instead of silently succeeding.

function makeClient(profileResult) {
  return {
    auth: {
      signUp: async () => ({
        data: { user: { id: 'u1' }, session: { access_token: 'x' } },
        error: null
      })
    },
    from: () => ({ update: () => ({ eq: async () => profileResult }) })
  };
}

function fillForm(document) {
  document.getElementById('name').value = 'Jane Smith';
  document.getElementById('email').value = 'jane@example.com';
  document.getElementById('password').value = 'supersecret';
  document.getElementById('education').value = 'Some College';
  document.getElementById('age').value = '20';
  document.getElementById('zipcode').value = '90210';
}

test('register surfaces a visible warning when the profile update fails', async () => {
  const client = makeClient({ error: { message: 'rls denied' } });
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
  const client = makeClient({ error: null });
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
