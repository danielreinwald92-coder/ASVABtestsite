const { test, expect } = require('@playwright/test');

const SERVED_PAGES = [
  '/',
  '/select-test.html',
  '/test-intro.html',
  '/quiz.html',
  '/results.html',
  '/dashboard.html',
  '/study-guide.html',
  '/about.html',
  '/admin.html',
  '/login.html',
  '/register.html',
  '/reset-password.html',
  '/faq.html',
  '/asvab-scores.html',
  '/asvab-math-formulas.html',
  '/asvab-word-list.html',
  '/asvab-study-plan.html',
  '/asvab-arithmetic-reasoning.html',
  '/asvab-word-knowledge.html',
  '/asvab-paragraph-comprehension.html',
  '/asvab-mathematics-knowledge.html',
  '/asvab-general-science.html',
  '/asvab-electronics-information.html',
  '/asvab-auto-and-shop.html',
  '/asvab-mechanical-comprehension.html',
  '/asvab-score-calculator.html',
  '/resources.html',
  '/asvab-score-requirements.html',
  '/asvab-gt-score.html',
  '/army-asvab-scores.html',
  '/air-force-asvab-scores.html',
  '/navy-asvab-scores.html',
  '/marine-corps-asvab-scores.html',
  '/coast-guard-asvab-scores.html',
  '/my-options.html'
];

// Every generated job page (scripts/build-job-pages.js) joins the smoke run.
const fs = require('fs');
const path = require('path');
const jobsDir = path.resolve(__dirname, '..', '..', 'jobs');
if (fs.existsSync(jobsDir)) {
  for (const f of fs.readdirSync(jobsDir).sort()) if (f.endsWith('.html')) SERVED_PAGES.push('/jobs/' + f);
}

const SUPABASE_STUB = `
(function () {
  function query() {
    return {
      select: function () { return this; },
      insert: function () { return Promise.resolve({ data: null, error: null }); },
      update: function () { return this; },
      delete: function () { return this; },
      eq: function () { return this; },
      order: function () { return this; },
      range: function () { return this; },
      single: function () { return Promise.resolve({ data: null, error: null }); },
      then: function (resolve) { return Promise.resolve({ data: [], error: null, count: 0 }).then(resolve); }
    };
  }
  var fakeSupabase = {
    createClient: function () {
      return {
        auth: {
          getSession: function () { return Promise.resolve({ data: { session: null } }); },
          onAuthStateChange: function () { return { data: { subscription: { unsubscribe: function () {} } } }; },
          signInWithPassword: function () { return Promise.resolve({ data: null, error: null }); },
          signUp: function () { return Promise.resolve({ data: null, error: null }); },
          signOut: function () { return Promise.resolve({ error: null }); },
          resetPasswordForEmail: function () { return Promise.resolve({ error: null }); },
          updateUser: function () { return Promise.resolve({ error: null }); }
        },
        from: function () { return query(); },
        rpc: function () { return Promise.resolve({ data: null, error: null }); }
      };
    }
  };
  // Keep the guest seam stable even after the real, SRI-verified UMD bundle
  // executes. The network resource still loads so CSP + integrity are tested.
  Object.defineProperty(window, 'supabase', {
    configurable: false,
    get: function () { return fakeSupabase; },
    set: function () {}
  });
})();`;

async function isolateExternalServices(page) {
  await page.addInitScript(SUPABASE_STUB);
  await page.route('**/_vercel/insights/script.js', (route) => route.fulfill({
    status: 200,
    contentType: 'application/javascript',
    body: ''
  }));
}

function collectBrowserErrors(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  return errors;
}

test('all served pages load under the production CSP without browser errors', async ({ browser }) => {
  for (const route of SERVED_PAGES) {
    const page = await browser.newPage({ serviceWorkers: 'block' });
    await isolateExternalServices(page);
    const errors = collectBrowserErrors(page);
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(response, `${route} should return a response`).not.toBeNull();
    expect(response.status(), `${route} should return HTTP 200`).toBe(200);
    await page.waitForTimeout(50);
    expect(errors, `${route} emitted browser errors`).toEqual([]);
    await page.close();
  }
});

test('guest completes an AFQT practice test and reaches numeric results', async ({ page }) => {
  await isolateExternalServices(page);
  const errors = collectBrowserErrors(page);

  await page.goto('/select-test.html');
  await page.getByLabel('Your Name').fill('Practice Tester');
  await page.locator('.test-type-card[data-type="quick"]').click();
  await expect(page.locator('#startBtn')).toBeEnabled();
  await page.locator('#startBtn').click();

  await expect(page).toHaveURL(/test-intro\.html$/);
  await expect(page.locator('#questionCount')).toHaveText('55');
  await expect(page.locator('#timeLimit')).toHaveText('122');
  await page.locator('#acknowledge').check();
  await page.locator('#startBtn').click();

  await expect(page).toHaveURL(/quiz\.html$/);
  for (let answered = 0; answered < 55; answered++) {
    await page.locator('.answer-option').first().click();
    if (answered === 54) {
      page.once('dialog', (dialog) => dialog.accept());
      await Promise.all([
        page.waitForURL(/results\.html$/),
        page.locator('#nextBtn').click()
      ]);
    } else {
      await page.locator('#nextBtn').click();
    }
  }

  await expect(page.locator('#afqtLabel')).toHaveText('Estimated AFQT Score');
  const score = Number(await page.locator('#afqtScore').textContent());
  expect(Number.isInteger(score)).toBe(true);
  expect(score).toBeGreaterThanOrEqual(1);
  expect(score).toBeLessThanOrEqual(99);
  expect(errors).toEqual([]);
});

test('guest completes the 20-question APT-style predictor and sees a predicted AFQT range', async ({ page }) => {
  await isolateExternalServices(page);
  const errors = collectBrowserErrors(page);

  await page.goto('/select-test.html');
  await page.getByLabel('Your Name').fill('Predictor Tester');
  await page.locator('.test-type-card[data-type="apt"]').click();
  await expect(page.locator('#startBtn')).toHaveText('Start AFQT Predictor');
  await page.locator('#startBtn').click();

  await expect(page).toHaveURL(/test-intro\.html$/);
  await expect(page.locator('#questionCount')).toHaveText('20');
  await expect(page.locator('#timeLimit')).toHaveText('25');
  await expect(page.locator('#aptNotice')).toBeVisible();
  await page.locator('#acknowledge').check();
  await page.locator('#startBtn').click();

  await expect(page).toHaveURL(/quiz\.html$/);
  for (let answered = 0; answered < 20; answered++) {
    await page.locator('.answer-option').first().click();
    if (answered === 19) {
      page.once('dialog', (dialog) => dialog.accept());
      await Promise.all([
        page.waitForURL(/results\.html$/),
        page.locator('#nextBtn').click()
      ]);
    } else {
      await page.locator('#nextBtn').click();
    }
  }

  await expect(page.locator('#afqtLabel')).toHaveText('Predicted AFQT (APT-Style)');
  await expect(page.locator('#afqtPercentile')).toContainText('likely range');
  const score = Number(await page.locator('#afqtScore').textContent());
  expect(score).toBeGreaterThanOrEqual(1);
  expect(score).toBeLessThanOrEqual(99);

  // AFQT-only result: the job options card leads to branch eligibility.
  await expect(page.locator('#jobOptionsCta')).toBeVisible();
  await expect(page.locator('#jobOptionsTitle')).toContainText('branches');
  await page.locator('#jobOptionsCta a').click();
  await expect(page).toHaveURL(/my-options\.html$/);
  await expect(page.locator('.opt-chip')).toHaveCount(5);
  await expect(page.locator('.opt-tab')).toHaveCount(5);
  await expect(page.locator('#optSource')).toContainText('APT-Style AFQT Predictor');
  await page.locator('#opt-tab-navy').click();
  await expect(page.locator('#opt-panel-navy')).toBeVisible();
  await expect(page.locator('#opt-panel-army')).toBeHidden();
  expect(errors).toEqual([]);
});

test('score calculator shows job matches for entered standard scores', async ({ page }) => {
  await isolateExternalServices(page);
  const errors = collectBrowserErrors(page);
  await page.goto('/asvab-score-calculator.html');
  for (const [code, v] of [['AR', 55], ['MK', 55], ['WK', 55], ['PC', 55], ['GS', 55], ['EI', 55], ['AS', 55], ['MC', 55]]) {
    await page.locator('#ss' + code).fill(String(v));
  }
  await page.getByRole('button', { name: 'Calculate My Scores' }).click();
  await expect(page.locator('#calcJobs')).toBeVisible();
  await expect(page.locator('#calcJobsView .opt-qualify .opt-job').first()).toBeVisible();
  await page.locator('#calcJobFilter').fill('68W');
  await expect(page.locator('#calcJobsView .opt-job:visible')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('my-options without a saved result offers a test and the calculator', async ({ page }) => {
  await isolateExternalServices(page);
  await page.goto('/my-options.html');
  await expect(page.locator('#optEmpty')).toBeVisible();
  await expect(page.locator('#optSummary')).toBeHidden();
});

test('guest diagnostic finishes in 18 questions and yields a personalized mission without an AFQT claim', async ({ page }) => {
  await isolateExternalServices(page);
  const errors = collectBrowserErrors(page);

  await page.goto('/select-test.html');
  await page.getByLabel('Your Name').fill('New Student');
  await expect(page.locator('.test-type-card[data-type="diagnostic"]')).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator('#pickerSummary')).toContainText('18 questions in 4 sections, 20 minutes');
  await page.locator('#startBtn').click();

  await expect(page).toHaveURL(/test-intro\.html$/);
  await expect(page.locator('#questionCount')).toHaveText('18');
  await expect(page.locator('#timeLimit')).toHaveText('20');
  await expect(page.locator('#diagnosticNotice')).toBeVisible();
  await page.locator('#acknowledge').check();
  await page.locator('#startBtn').click();

  await expect(page).toHaveURL(/quiz\.html$/);
  for (let answered = 0; answered < 18; answered++) {
    await page.locator('.answer-option').first().click();
    if (answered === 17) {
      page.once('dialog', (dialog) => dialog.accept());
      await Promise.all([
        page.waitForURL(/results\.html$/),
        page.locator('#nextBtn').click()
      ]);
    } else {
      await page.locator('#nextBtn').click();
    }
  }

  await expect(page.locator('#afqtLabel')).toHaveText('Starting-Point Diagnostic');
  await expect(page.locator('#afqtPercentile')).toContainText('not an AFQT percentile');
  await expect(page.locator('#missionPanel')).toBeVisible();
  await expect(page.locator('#missionStartBtn')).toHaveAttribute('href', /study-guide\.html\?section=/);
  expect(errors).toEqual([]);
});
