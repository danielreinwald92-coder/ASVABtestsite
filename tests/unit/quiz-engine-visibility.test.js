const { test } = require('node:test');
const assert = require('node:assert');
const { loadEngine, fakeDoc } = require('../helpers/engine.js');

// 2.4 — visibilitychange handler must be registered exactly once even across
// repeated startTimer() invocations (which happen on tab re-show).
test('startTimer registers exactly one visibilitychange listener across many calls', () => {
  const document = fakeDoc();
  const sandbox = loadEngine({ document });
  const engine = new sandbox.QuizEngine();
  engine.timeRemaining = 100;

  engine.startTimer();
  engine.startTimer();
  engine.startTimer();

  const count = (document._listeners['visibilitychange'] || []).length;
  assert.strictEqual(count, 1, `expected 1 visibilitychange listener, got ${count}`);
});
