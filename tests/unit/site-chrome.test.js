'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { syncPage, PAGES, GUIDES, RESOURCES, PRACTICE } = require('../../scripts/sync-site-chrome.js');

const root = path.resolve(__dirname, '..', '..');

test('every page carries the current shared nav/footer (run scripts/sync-site-chrome.js)', () => {
  for (const page of Object.keys(PAGES)) {
    const src = fs.readFileSync(path.join(root, page), 'utf8');
    assert.strictEqual(syncPage(page, src), src, `${page} site chrome is stale`);
  }
});

test('the footer links to every public page and every link resolves', () => {
  const hrefs = [...PRACTICE, ...RESOURCES, ...GUIDES].map(([h]) => h);
  for (const h of hrefs) assert.ok(fs.existsSync(path.join(root, h)), `${h} exists`);
  const indexable = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8')
    .match(/<loc>https:\/\/www\.missionasvab\.org\/([^<]*)<\/loc>/g)
    .map((m) => m.replace(/<\/?loc>/g, '').replace('https://www.missionasvab.org/', '') || 'index.html');
  // Branch and job pages are reached through the "Jobs by ASVAB score" hub,
  // which is itself in the footer.
  const hub = fs.readFileSync(path.join(root, 'asvab-score-requirements.html'), 'utf8');
  for (const page of indexable) {
    if (page === 'index.html') continue;
    if (/-asvab-scores\.html$/.test(page) || page.startsWith('jobs/')) {
      assert.ok(hub.includes(`href="${page}"`) || page.startsWith('jobs/'), `${page} is linked from the jobs hub`);
      continue;
    }
    assert.ok(hrefs.includes(page), `${page} is indexable but missing from the site footer`);
  }
});

test('each page marks itself as the current page in the menu', () => {
  for (const [page, kind] of Object.entries(PAGES)) {
    if (kind !== 'full' || page === 'index.html') continue;
    const src = fs.readFileSync(path.join(root, page), 'utf8');
    if (!['test-intro.html', 'results.html', 'login.html', 'register.html', 'reset-password.html'].includes(page)) {
      const underJobs = page === 'my-options.html' || /-asvab-scores\.html$/.test(page);
      assert.ok(src.includes(`href="${page}" aria-current="page"`) || page === 'resources.html' && src.includes('aria-current="page"') ||
        underJobs && src.includes('href="asvab-score-requirements.html" aria-current="true"'),
        `${page} is not marked current`);
    }
  }
});
