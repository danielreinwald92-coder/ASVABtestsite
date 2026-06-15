// 3.4 — focus management for the admin user modal and dashboard account modal.
// Each modal should, on open, move focus to its close button; close on Escape;
// and restore focus to the element that opened it.
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { JSDOM } = require('jsdom');

const rootDir = path.resolve(__dirname, '..', '..');

// Build a vm sandbox sharing a jsdom document, load focus-trap.js followed by a
// page script, and append a hook to expose/seed the page module's internals.
function loadPage(htmlFile, pageScript, append) {
  const html = fs.readFileSync(path.join(rootDir, htmlFile), 'utf8');
  const dom = new JSDOM(html, { pretendToBeVisual: true });
  const sandbox = {
    document: dom.window.document,
    window: dom.window,
    console,
    setTimeout, clearTimeout, setInterval, clearInterval,
    Promise, Date, JSON, Math, RegExp, Error,
    String, Number, Boolean, Object, Array,
    parseInt, parseFloat, isNaN, isFinite,
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);

  const ft = fs.readFileSync(path.join(rootDir, 'js/focus-trap.js'), 'utf8');
  vm.runInContext(ft, sandbox, { filename: 'js/focus-trap.js' });

  const src = fs.readFileSync(path.join(rootDir, pageScript), 'utf8');
  vm.runInContext(`${src}\n${append || ''}`, sandbox, { filename: pageScript });

  return { dom, document: dom.window.document, window: dom.window, sandbox };
}

function pressEscape(dom, document) {
  document.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
}

test('admin user modal: open focuses close button, Escape closes + restores trigger', () => {
  const { dom, document, sandbox } = loadPage(
    'admin.html',
    'js/admin.js',
    'this.__seed = function (users, adminId) { allUsers = users; currentAdminId = adminId; };'
  );

  sandbox.__seed(
    [{
      id: 'u1', name: 'Pat Lead', email: 'pat@example.com', age: 20,
      education: 'Some College', zipcode: '90210', is_admin: false,
      created_at: '2026-01-01T00:00:00Z', test_date: null,
      tests: [], testCount: 0, bestAfqt: null, lastTestAt: null, lastSignInAt: null
    }],
    'admin-self'
  );

  // A focusable trigger to restore to (stands in for the clicked table row).
  const trigger = document.createElement('button');
  trigger.textContent = 'open';
  document.body.appendChild(trigger);
  trigger.focus();
  assert.strictEqual(document.activeElement, trigger);

  sandbox.openUserModal('u1');

  const modal = document.getElementById('userModal');
  const closeBtn = modal.querySelector('.modal-close');
  assert.strictEqual(modal.classList.contains('open'), true, 'modal is open');
  assert.strictEqual(document.activeElement, closeBtn, 'focus moved to close button');
  assert.ok(modal.contains(document.activeElement), 'focus is inside the modal');

  pressEscape(dom, document);
  assert.strictEqual(modal.classList.contains('open'), false, 'Escape closed the modal');
  assert.strictEqual(document.activeElement, trigger, 'focus restored to the trigger');
});

test('dashboard account modal: open focuses close button, Escape closes + restores trigger', () => {
  const { dom, document, sandbox } = loadPage(
    'dashboard.html',
    'js/dashboard.js',
    'this.__seed = function (profile, session) { _currentProfile = profile; _currentSession = session; };'
  );

  sandbox.__seed({ name: 'Pat', age: 20, zipcode: '90210', education: 'Some College' },
    { user: { id: 'me', email: 'pat@example.com' } });

  const trigger = document.querySelector('.account-btn');
  assert.ok(trigger, 'account button present');
  trigger.focus();
  assert.strictEqual(document.activeElement, trigger);

  sandbox.openAccountModal();

  const overlay = document.getElementById('accOverlay');
  const closeBtn = overlay.querySelector('.acc-close');
  assert.strictEqual(overlay.classList.contains('open'), true, 'modal is open');
  assert.strictEqual(document.activeElement, closeBtn, 'focus moved to close button');
  assert.ok(overlay.contains(document.activeElement), 'focus is inside the modal');

  pressEscape(dom, document);
  assert.strictEqual(overlay.classList.contains('open'), false, 'Escape closed the modal');
  assert.strictEqual(document.activeElement, trigger, 'focus restored to the trigger');
});
