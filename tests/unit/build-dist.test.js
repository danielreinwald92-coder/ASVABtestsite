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

test('stamp-assets --paths serves hashed copies at immutable /v/<hash>/ paths', () => {
  const os = require('os');
  const { execFileSync } = require('child_process');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'stamp-'));
  fs.mkdirSync(path.join(dir, 'js'));
  fs.mkdirSync(path.join(dir, 'jobs'));
  fs.writeFileSync(path.join(dir, 'js', 'a.js'), 'console.log(1);');
  fs.writeFileSync(path.join(dir, 'index.html'), '<script src="js/a.js"></script><script src="js/missing.js"></script>');
  fs.writeFileSync(path.join(dir, 'jobs', 'x.html'), '<script src="js/a.js"></script>');
  fs.writeFileSync(path.join(dir, 'service-worker.js'), "const P = ['/js/a.js'];");
  execFileSync(process.execPath, [path.join(__dirname, '../../scripts/stamp-assets.js'), dir, '--paths'], { stdio: 'ignore' });
  const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
  const m = html.match(/src="v\/([0-9a-f]{10})\/js\/a\.js"/);
  assert.ok(m, html);
  assert.match(html, /src="js\/missing\.js"/);
  assert.strictEqual(fs.readFileSync(path.join(dir, 'v', m[1], 'js', 'a.js'), 'utf8'), 'console.log(1);');
  assert.ok(fs.existsSync(path.join(dir, 'js', 'a.js')), 'original path kept for dynamic loads');
  assert.match(fs.readFileSync(path.join(dir, 'jobs', 'x.html'), 'utf8'), new RegExp(`v/${m[1]}/js/a\\.js`));
  assert.match(fs.readFileSync(path.join(dir, 'service-worker.js'), 'utf8'), new RegExp(`'/v/${m[1]}/js/a\\.js'`));
  const headers = buildHeaders(JSON.parse(fs.readFileSync(path.join(__dirname, '../../vercel.json'), 'utf8')));
  assert.match(headers, /\n\/v\/\*\n {2}Cache-Control: public, max-age=31536000, immutable/);
  fs.rmSync(dir, { recursive: true, force: true });
});
