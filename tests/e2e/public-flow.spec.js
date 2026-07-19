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
  '/reset-password.html'
];

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
