const { test } = require('node:test');
const assert = require('node:assert');
const { runPageScript, flush, makeLocalStorage } = require('../helpers/load.js');

// 2.10 — recruiter form hardening, mirrored in index.html and results.html.
// The handler is fire-and-forget (CORS-opaque endpoint); we never read the
// response. We verify: honeypot blocks send, abort/network errors surface an
// error, the payload carries consentText + consentTimestamp, and the submit
// button is disabled while a request is in flight.

const PAGES = [
  { file: 'index.html', source: 'homepage' },
  { file: 'results.html', source: 'results' }
];

function setup(file, env) {
  const ctx = runPageScript(file, 'submitRecruiterRequest', {
    localStorage: makeLocalStorage({ quizResults: JSON.stringify({ afqt: 72 }) }),
    ...env
  });
  const form = ctx.document.querySelector('.recruiter-form');
  const btn = form.querySelector('.form-submit');
  const fire = () => ctx.sandbox.submitRecruiterRequest({ preventDefault() {}, target: form });
  return { ...ctx, form, btn, fire };
}

for (const { file, source } of PAGES) {
  test(`${file}: honeypot blocks the request and sends nothing`, () => {
    let fetchCalls = 0;
    const { form, fire } = setup(file, {
      fetch: () => { fetchCalls++; return Promise.resolve(); }
    });
    form.elements.company.value = 'Spammy Inc';
    fire();
    assert.strictEqual(fetchCalls, 0, 'fetch must not run when honeypot is filled');
  });

  test(`${file}: payload includes consentText + consentTimestamp and disables button in-flight`, async () => {
    let captured = null;
    let resolveFetch;
    const fetchPromise = new Promise((r) => { resolveFetch = r; });
    const { btn, fire } = setup(file, {
      fetch: (url, opts) => { captured = opts; return fetchPromise; }
    });

    fire();
    // in flight: button disabled, request issued
    assert.strictEqual(btn.disabled, true, 'button should be disabled while in flight');
    assert.ok(captured, 'fetch should have been called');
    assert.ok(captured.signal, 'fetch should pass an AbortController signal');

    const body = JSON.parse(captured.body);
    assert.strictEqual(body.source, source);
    assert.ok(body.consentText && body.consentText.length > 0, 'consentText must be present');
    assert.match(body.consentTimestamp, /^\d{4}-\d{2}-\d{2}T.*Z$/, 'consentTimestamp must be ISO');

    resolveFetch();
    await flush();
    assert.strictEqual(btn.disabled, false, 'button should re-enable after completion');
  });

  test(`${file}: a rejected/aborted request surfaces an error and re-enables the button`, async () => {
    let alerted = '';
    const { btn, fire } = setup(file, {
      alert: (m) => { alerted = m; },
      fetch: () => Promise.reject(Object.assign(new Error('aborted'), { name: 'AbortError' }))
    });

    fire();
    await flush();
    assert.match(alerted, /something went wrong/i, 'error path should alert the user');
    assert.strictEqual(btn.disabled, false, 'button should re-enable after error');
  });
}

test('results.html: payload carries the practice AFQT score', () => {
  let captured = null;
  const { fire } = setup('results.html', {
    fetch: (url, opts) => { captured = opts; return Promise.resolve(); }
  });
  fire();
  const body = JSON.parse(captured.body);
  assert.strictEqual(body.practiceScore, 72);
});
