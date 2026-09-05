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

test('sitemap covers exactly the indexable pages and every URL resolves', () => {
  const sitemap = read('sitemap.xml');
  const robots = read('robots.txt');
  const disallowed = [...robots.matchAll(/^Disallow:\s*\/(\S+)/gm)].map((m) => m[1]);
  const urls = [...sitemap.matchAll(/<loc>https:\/\/www\.missionasvab\.org\/([^<]*)<\/loc>/g)]
    .map((m) => m[1] === '' ? 'index.html' : m[1]);
  for (const u of urls) assert.ok(fs.existsSync(path.join(root, u)), `${u} exists`);
  const indexable = rootPages.filter((p) => !disallowed.includes(p));
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
