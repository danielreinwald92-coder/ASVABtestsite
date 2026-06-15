const { test } = require('node:test');
const assert = require('node:assert');
const { runPageScript, flush, makeLocalStorage } = require('../helpers/load.js');

// 4.3 — report-a-question on the results review list (RLS-protected insert).
// Drives the real shipped js/page-results.js against a jsdom results.html DOM,
// mocking getSession()/getClient() seams.

function quizResults() {
  return JSON.stringify({
    testType: 'afqt', // not 'full' so renderLineScores (needs scoring.js) is skipped
    afqt: 60,
    correct: 1,
    incorrect: 0,
    timeUsed: 120,
    sectionResults: {
      AR: {
        correct: 1,
        total: 1,
        questions: [{
          id: 'AR001',
          text: 'What is 2 + 2?',
          options: ['3', '4', '5', '6'],
          correctAnswer: 1,
          userAnswer: 1,
          isCorrect: true
        }]
      }
    }
  });
}

function clickEl(document, el) {
  el.dispatchEvent(new document.defaultView.MouseEvent('click', { bubbles: true, cancelable: true }));
}

test('reporting a question inserts a row with the right shape', async () => {
  const inserts = [];
  const client = {
    from: (tbl) => ({
      insert: (row) => { inserts.push({ tbl, row }); return Promise.resolve({ error: null }); }
    })
  };
  const { document, sandbox } = runPageScript('results.html', 'onReportListClick', {
    localStorage: makeLocalStorage({ quizResults: quizResults() }),
    getSession: async () => ({ user: { id: 'user-42' } }),
    getClient: () => client
  });

  sandbox.loadResults();
  await flush();

  // Open the report menu
  clickEl(document, document.querySelector('.report-btn'));
  await flush();

  const reasonBtn = document.querySelector('[data-action="report-reason"]');
  assert.ok(reasonBtn, 'reason menu should render after clicking report');

  // Add optional details, then pick a reason
  document.querySelector('.report-details').value = 'The wording is off';
  clickEl(document, reasonBtn);
  await flush();

  assert.strictEqual(inserts.length, 1, 'exactly one insert');
  assert.strictEqual(inserts[0].tbl, 'question_reports');
  const row = inserts[0].row;
  assert.strictEqual(row.user_id, 'user-42');
  assert.strictEqual(row.question_id, 'AR001');
  assert.strictEqual(row.test_type, 'afqt');
  assert.strictEqual(row.reason, reasonBtn.dataset.reason);
  assert.strictEqual(row.details, 'The wording is off');

  // Success state shown
  assert.ok(/Reported/.test(document.querySelector('.review-report').textContent));
});

test('double-report is prevented (no report control re-renders after success)', async () => {
  const inserts = [];
  const client = {
    from: () => ({ insert: (row) => { inserts.push(row); return Promise.resolve({ error: null }); } })
  };
  const { document, sandbox } = runPageScript('results.html', 'onReportListClick', {
    localStorage: makeLocalStorage({ quizResults: quizResults() }),
    getSession: async () => ({ user: { id: 'user-42' } }),
    getClient: () => client
  });

  sandbox.loadResults();
  await flush();
  clickEl(document, document.querySelector('.report-btn'));
  await flush();
  clickEl(document, document.querySelector('[data-action="report-reason"]'));
  await flush();
  assert.strictEqual(inserts.length, 1);

  // Re-render the review list: the already-reported question must show
  // "Reported ✓" with no report button to click again.
  sandbox.renderFilteredQuestions('all');
  assert.strictEqual(document.querySelector('.report-btn'), null, 'no report button after success');
  assert.ok(/Reported/.test(document.querySelector('.review-report').textContent));
  assert.strictEqual(inserts.length, 1, 'still only one insert');
});

test('not signed in: report prompts sign-in and does not insert', async () => {
  const inserts = [];
  const client = {
    from: () => ({ insert: (row) => { inserts.push(row); return Promise.resolve({ error: null }); } })
  };
  const { document, sandbox } = runPageScript('results.html', 'onReportListClick', {
    localStorage: makeLocalStorage({ quizResults: quizResults() }),
    getSession: async () => null,
    getClient: () => client
  });

  sandbox.loadResults();
  await flush();
  clickEl(document, document.querySelector('.report-btn'));
  await flush();

  assert.strictEqual(inserts.length, 0, 'no insert when signed out');
  assert.strictEqual(document.querySelector('[data-action="report-reason"]'), null, 'no reason menu');
  assert.ok(/sign in/i.test(document.querySelector('.review-report').textContent), 'shows sign-in prompt');
});
