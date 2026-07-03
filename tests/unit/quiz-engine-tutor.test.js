const { test } = require('node:test');
const assert = require('node:assert');
const { loadEngine, fakeDoc } = require('../helpers/engine.js');

function tutorSandbox(search) {
  // Plan intent: engine reads mode/section from the URL search string. The vm
  // sandbox lacks the browser globals the real loadTestConfig() relies on
  // (URLSearchParams + window.location), so supply them here. Production code is
  // unchanged and still reads window.location.search exactly as the plan wrote it.
  const location = { search };
  return loadEngine({
    URLSearchParams,
    document: fakeDoc(),
    location,
    window: { location },
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  });
}

test('engine reads mode=tutor from the URL', () => {
  const sandbox = tutorSandbox('?mode=tutor&section=AR');
  const engine = new sandbox.QuizEngine();
  engine.loadTestConfig();
  assert.strictEqual(engine.mode, 'tutor');
});

test('engine defaults to timed mode with no mode param', () => {
  const sandbox = tutorSandbox('?section=AR');
  const engine = new sandbox.QuizEngine();
  engine.loadTestConfig();
  assert.strictEqual(engine.mode, 'timed');
});

test('startTimer is skipped in tutor mode', () => {
  const sandbox = tutorSandbox('?mode=tutor&section=AR');
  const engine = new sandbox.QuizEngine();
  engine.mode = 'tutor';
  let started = false;
  engine.startTimer = () => { started = true; };
  engine.maybeStartTimer();
  assert.strictEqual(started, false);
});

test('startTimer runs in timed mode', () => {
  const sandbox = tutorSandbox('?section=AR');
  const engine = new sandbox.QuizEngine();
  engine.mode = 'timed';
  let started = false;
  engine.startTimer = () => { started = true; };
  engine.maybeStartTimer();
  assert.strictEqual(started, true);
});
