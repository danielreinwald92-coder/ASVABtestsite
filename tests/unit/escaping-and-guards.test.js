const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { rootDir, runPageScript } = require('../helpers/load.js');

// 2.11(a) — escHtml + delegated (non-inline) admin row clicks.

// Load js/admin.js into a vm sandbox with a stub document so we can call its
// top-level functions directly. admin.js only touches `document` at load time
// to register a keydown listener, which the stub absorbs.
function loadAdmin(overrides = {}) {
  const els = {};
  const document = {
    addEventListener() {},
    getElementById(id) {
      if (!els[id]) els[id] = { innerHTML: '', textContent: '', style: {} };
      return els[id];
    },
    querySelector() { return null; },
    querySelectorAll() { return []; }
  };
  const sandbox = {
    console, document, window: {}, Date, Math, JSON, RegExp, String, Number,
    Array, Object, parseInt, isNaN, ...overrides
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  const src = fs.readFileSync(path.join(rootDir, 'js/admin.js'), 'utf8');
  // top-level `let` bindings (filteredUsers/sortKey/sortDir) aren't reachable as
  // sandbox properties, so expose a setter that lives in the same scope.
  const append = '\nthis.__render = function(users, key, dir){ filteredUsers = users; sortKey = key; sortDir = dir; renderTable(); };';
  vm.runInContext(src + append, sandbox);
  sandbox.__els = els;
  return sandbox;
}

test('escHtml escapes single quotes (and the other HTML-significant chars)', () => {
  const { escHtml } = loadAdmin();
  assert.strictEqual(escHtml("O'Brien"), 'O&#39;Brien');
  assert.strictEqual(escHtml(`<a href="x">'&`), '&lt;a href=&quot;x&quot;&gt;&#39;&amp;');
});

test('admin user rows use data-id and no inline onclick', () => {
  const sandbox = loadAdmin();
  sandbox.__render([{
    id: `a'b"c`, name: 'Bob', email: 'b@x.com', age: 20, education: 'HS',
    zipcode: '12345', created_at: '2026-01-01T00:00:00Z', testCount: 0,
    bestAfqt: null, lastTestAt: null, lastSignInAt: null, is_admin: false
  }], 'created_at', 'desc');
  const html = sandbox.__els.adminTableBody.innerHTML;

  assert.ok(!/onclick="openUserModal/.test(html), 'row must not use inline onclick');
  assert.ok(/data-id="/.test(html), 'row must carry a data-id');
  // the id is escaped (single quote + double quote)
  assert.ok(html.includes(`data-id="a&#39;b&quot;c"`), 'data-id must be HTML-escaped');
});

// 2.11(b) — submit double-click guard. Light check on login.html: submitting
// disables the button while the auth request is in flight.
test('login form disables its submit button while signing in', () => {
  let resolveSignIn;
  const client = {
    auth: { signInWithPassword: () => new Promise((r) => { resolveSignIn = r; }) }
  };
  const { document } = runPageScript('login.html', 'loginForm', {
    location: { href: '', origin: 'https://example.test' },
    getSession: async () => null,
    getClient: () => client
  });

  document.getElementById('email').value = 'a@b.com';
  document.getElementById('password').value = 'password1';
  document.getElementById('loginForm').dispatchEvent(
    new document.defaultView.Event('submit', { bubbles: true, cancelable: true })
  );

  assert.strictEqual(document.getElementById('loginBtn').disabled, true);
});
