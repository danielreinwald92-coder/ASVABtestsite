'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const rootPages = fs.readdirSync(root)
  .filter((f) => f.endsWith('.html') && !f.startsWith('preview-'));

function listFrom(source, marker) {
  const m = source.match(new RegExp(marker + '\\s*=\\s*\\[([^\\]]+)\\]'));
  assert.ok(m, `found ${marker} list`);
  return [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
}

test('every served root page is covered by the inline-JS gate', () => {
  const listed = listFrom(read('scripts/check-no-inline-js.js'), 'SERVED_PAGES');
  for (const page of rootPages) assert.ok(listed.includes(page), `${page} in gate list`);
});

test('every served root page is covered by the e2e smoke list', () => {
  const listed = listFrom(read('tests/e2e/public-flow.spec.js'), 'SERVED_PAGES')
    .map((r) => (r === '/' ? 'index.html' : r.replace(/^\//, '')));
  for (const page of rootPages) assert.ok(listed.includes(page), `${page} in e2e list`);
});

// Pages served with an X-Robots-Tag: noindex header (vercel.json).
function noindexPages() {
  const cfg = JSON.parse(read('vercel.json'));
  const rules = cfg.headers.filter((h) =>
    h.headers.some((x) => x.key === 'X-Robots-Tag' && /noindex/.test(x.value)));
  return rootPages.filter((p) => rules.some((r) => new RegExp('^' + r.source + '$').test('/' + p)));
}

test('app pages are noindexed by header and not blocked in robots.txt', () => {
  const noindex = noindexPages();
  for (const p of ['quiz.html', 'results.html', 'dashboard.html', 'login.html', 'register.html',
    'reset-password.html', 'admin.html', 'test-intro.html']) {
    assert.ok(noindex.includes(p), `${p} has a noindex header`);
  }
  const robots = read('robots.txt');
  for (const p of noindex) {
    assert.ok(!new RegExp('^Disallow:\\s*/' + p.replace('.', '\\.'), 'm').test(robots),
      `${p} must stay crawlable so its noindex header is seen`);
  }
});

test('sitemap covers exactly the indexable pages and every URL resolves', () => {
  const sitemap = read('sitemap.xml');
  const noindex = noindexPages();
  const urls = [...sitemap.matchAll(/<loc>https:\/\/www\.missionasvab\.org\/([^<]*)<\/loc>/g)]
    .map((m) => m[1] === '' ? 'index.html' : m[1]);
  for (const u of urls) {
    assert.ok(fs.existsSync(path.join(root, u)), `${u} exists`);
    assert.ok(!noindex.includes(u), `${u} is noindex and must not be in the sitemap`);
  }
  const indexable = rootPages.filter((p) => !noindex.includes(p));
  for (const p of indexable) assert.ok(urls.includes(p), `${p} in sitemap`);
});

test('every sitemap page has full share metadata and valid JSON-LD', () => {
  const sitemap = read('sitemap.xml');
  const urls = [...sitemap.matchAll(/<loc>https:\/\/www\.missionasvab\.org\/([^<]*)<\/loc>/g)]
    .map((m) => m[1] === '' ? 'index.html' : m[1]);
  for (const u of urls) {
    const html = read(u);
    for (const needle of ['name="description"', 'rel="canonical"', 'property="og:image"',
      'name="twitter:card"', 'rel="icon"']) {
      assert.ok(html.includes(needle), `${u} has ${needle}`);
    }
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      const parsed = JSON.parse(m[1]);
      assert.ok(parsed['@context'], `${u} JSON-LD has @context`);
    }
  }
});

test('og-image asset exists', () => {
  assert.ok(fs.existsSync(path.join(root, 'og-image.png')));
});
