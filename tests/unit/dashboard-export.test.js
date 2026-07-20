const { test } = require('node:test');
const assert = require('node:assert');
const { runPageScript, flush } = require('../helpers/load.js');

// 4.5 — user-initiated data export on the dashboard. Drives the real shipped
// js/dashboard.js exportUserData() against a jsdom dashboard.html DOM, mocking
// getSession()/getClient()/Blob/URL seams and capturing the download anchor.

function makeClient(profile, results, missions = []) {
  return {
    from: (tbl) => {
      if (tbl === 'profiles') {
        return { select: () => ({ eq: () => ({ single: async () => ({ data: profile, error: null }) }) }) };
      }
      const data = tbl === 'study_missions' ? missions : results;
      return { select: () => ({ eq: async () => ({ data, error: null }) }) };
    }
  };
}

test('export builds a JSON blob + download anchor with profile, results, and missions', async () => {
  const profile = { id: 'u9', name: 'Pat Recruit', age: 22 };
  const results = [
    { id: 'r1', afqt_score: 55, test_type: 'afqt' },
    { id: 'r2', afqt_score: 61, test_type: 'full' }
  ];
  const missions = [{ client_id: 'mission-v1-result-1', status: 'completed' }];

  let capturedBlob = null;
  const FakeBlob = class { constructor(parts, opts) { this.parts = parts; this.type = opts && opts.type; } };
  const URLMock = {
    createObjectURL: (b) => { capturedBlob = b; return 'blob:fake-url'; },
    revokeObjectURL: () => {}
  };

  const { document, sandbox } = runPageScript('dashboard.html', 'exportUserData', {
    getSession: async () => ({ user: { id: 'u9', email: 'pat@example.test' } }),
    getClient: () => makeClient(profile, results, missions),
    globals: { Blob: FakeBlob, URL: URLMock }
  });

  // Capture any <a> created during export. Stub click() to avoid jsdom trying
  // to navigate to the blob: URL (real browsers honor the download attribute).
  const createdAnchors = [];
  let clicked = 0;
  const origCreate = document.createElement.bind(document);
  document.createElement = (tag) => {
    const el = origCreate(tag);
    if (String(tag).toLowerCase() === 'a') {
      el.click = () => { clicked++; };
      createdAnchors.push(el);
    }
    return el;
  };

  await sandbox.exportUserData();
  await flush();

  assert.ok(capturedBlob, 'a Blob should be created');
  assert.strictEqual(capturedBlob.type, 'application/json');

  const payload = JSON.parse(capturedBlob.parts.join(''));
  assert.strictEqual(payload.profile.name, 'Pat Recruit');
  assert.strictEqual(payload.account.email, 'pat@example.test');
  assert.strictEqual(payload.test_results.length, 2);
  assert.strictEqual(payload.test_results[1].afqt_score, 61);
  assert.strictEqual(payload.study_missions.length, 1);
  assert.strictEqual(payload.study_missions[0].status, 'completed');

  assert.strictEqual(createdAnchors.length, 1, 'one download anchor created');
  const a = createdAnchors[0];
  assert.strictEqual(a.href, 'blob:fake-url');
  assert.ok(/^mission-asvab-data-\d{4}-\d{2}-\d{2}\.json$/.test(a.download), 'download filename has date');
  assert.strictEqual(clicked, 1, 'the download anchor was clicked');
});

test('export is a no-op when there is no session', async () => {
  let called = false;
  const { sandbox } = runPageScript('dashboard.html', 'exportUserData', {
    getSession: async () => null,
    getClient: () => { called = true; return makeClient(null, []); },
    globals: { Blob: class {}, URL: { createObjectURL: () => '', revokeObjectURL: () => {} } }
  });

  await sandbox.exportUserData();
  await flush();
  assert.strictEqual(called, false, 'should not query the client without a session');
});
