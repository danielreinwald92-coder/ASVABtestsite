'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { translateSource, buildHeaders } = require('../../scripts/build-dist.js');

test('vercel.json sources translate to Cloudflare _headers paths', () => {
  assert.deepStrictEqual(translateSource('/(.*)'), ['/*']);
  assert.deepStrictEqual(translateSource('/(quiz|results)\\.html'), ['/quiz.html', '/results.html']);
  assert.deepStrictEqual(translateSource('/(js|css)/(.*)'), ['/js/*', '/css/*']);
});

test('every vercel.json header rule (except query-conditional) reaches _headers', () => {
  const v = JSON.parse(fs.readFileSync(path.join(__dirname, '../../vercel.json'), 'utf8'));
  const out = buildHeaders(v);
  for (const rule of v.headers.filter((r) => !r.has)) {
    for (const h of rule.headers) assert.ok(out.includes(`${h.key}: ${h.value}`), h.key);
  }
  assert.match(out, /^\/\*\n/);
});
