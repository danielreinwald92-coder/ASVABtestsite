const test = require('node:test');
const assert = require('node:assert');
const { loadScripts } = require('../helpers/load');

const ctx = loadScripts(['js/auth.js']);
const friendly = ctx.friendlyAuthError;

test('maps invalid credentials to plain-language guidance', () => {
  const msg = friendly({ message: 'Invalid login credentials' });
  assert.match(msg, /don.t match/i);
  assert.match(msg, /password/i);
  assert.doesNotMatch(msg, /credentials/i);
});

test('maps unconfirmed email to an explanation', () => {
  const msg = friendly({ message: 'Email not confirmed' });
  assert.match(msg, /confirm/i);
  assert.match(msg, /inbox|email/i);
});

test('maps rate-limit messages to a wait suggestion', () => {
  const msg = friendly({ message: 'For security purposes, you can only request this after 42 seconds.' });
  assert.match(msg, /42 seconds/);
  assert.match(msg, /wait/i);
});

test('maps already-registered to a log-in suggestion', () => {
  const msg = friendly({ message: 'User already registered' });
  assert.match(msg, /already/i);
  assert.match(msg, /log.?g?in/i);
});

test('maps expired session jargon on password reset', () => {
  const msg = friendly({ message: 'Auth session missing!' });
  assert.match(msg, /expired|new reset link/i);
  assert.doesNotMatch(msg, /Auth session/);
});

test('falls back to the raw message for unknown errors, and to a generic line for empty ones', () => {
  assert.strictEqual(friendly({ message: 'Some novel failure' }), 'Some novel failure');
  assert.match(friendly(null), /something went wrong/i);
});
