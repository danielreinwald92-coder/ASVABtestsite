'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { build, sitemap, jobFile } = require('../../scripts/build-job-pages.js');
const DATA = require('../../js/job-requirements.js');

const root = path.resolve(__dirname, '..', '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

test('generated job pages and the sitemap block are in sync with js/job-requirements.js', () => {
  const pages = build();
  for (const { file, html } of pages) {
    assert.strictEqual(read(file), html, `${file} is stale; run node scripts/build-job-pages.js`);
  }
  const map = read('sitemap.xml');
  assert.strictEqual(map, sitemap(map, pages), 'sitemap.xml job block is stale');
  const expected = new Set(pages.map((p) => p.file));
  for (const f of fs.readdirSync(path.join(root, 'jobs'))) assert.ok(expected.has(`jobs/${f}`), `orphan jobs/${f}`);
});

test('every featured job has a page and the options view links to the same file', () => {
  global.window = undefined;
  require('../../js/job-matcher.js');
  const V = require('../../js/options-view.js');
  for (const key of DATA.ORDER) {
    for (const job of DATA.BRANCHES[key].jobs.filter((j) => j.featured)) {
      assert.ok(fs.existsSync(path.join(root, jobFile(key, job))), `${key} ${job.code} page`);
      assert.strictEqual(V.jobHref(key, job), jobFile(key, job), `${key} ${job.code} href`);
    }
  }
});

test('branch AFQT minimums on hand-written pages match the data file', () => {
  const min = (k) => DATA.BRANCHES[k].afqtMin;
  const scores = read('asvab-scores.html');
  for (const k of DATA.ORDER) {
    const re = new RegExp(`<a href="${k}-asvab-scores\\.html">[^<]+</a></td><td class="num">(\\d+)</td>`);
    const m = scores.match(re);
    assert.ok(m, `asvab-scores.html lists ${k}`);
    assert.strictEqual(Number(m[1]), min(k), `asvab-scores.html ${k} minimum`);
  }
  const faq = read('faq.html');
  const sentence = `31 for the Army, Navy, Air Force, and Marine Corps, and 32 for the Coast Guard`;
  assert.deepStrictEqual([min('army'), min('navy'), min('air-force'), min('marine-corps'), min('coast-guard')], [31, 31, 31, 31, 32],
    'data changed: update the FAQ, About and asvab-scores minimum copy');
  assert.strictEqual((faq.match(new RegExp(sentence, 'g')) || []).length, 2, 'FAQ answer and JSON-LD carry the current minimums');
  assert.ok(read('about.html').includes('Army (31), Navy (31), Air Force (31), Marine Corps (31), Coast Guard (32)'), 'About page minimums');
});

test('job pages carry a source line and the recruiter line, and no em dashes', () => {
  for (const { file, html } of build()) {
    assert.ok(html.includes('talk to a local recruiter'), `${file} recruiter line`);
    if (file.startsWith('jobs/') || /-asvab-scores\.html$/.test(file)) assert.ok(html.includes('class="job-source"'), `${file} source line`);
    const text = html.replace(/<[^>]+>/g, '');
    assert.ok(!/[–—]/.test(text), `${file} has an em or en dash`);
  }
});
