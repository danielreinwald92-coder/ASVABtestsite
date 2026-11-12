#!/usr/bin/env node
'use strict';
/**
 * Cloudflare build: copies only the served files into dist/, translates the
 * vercel.json headers into a Cloudflare `_headers` file (vercel.json stays the
 * single source of truth), strips the Vercel-only analytics tag, and
 * content-hashes js/css references via stamp-assets.js.
 * Run after the gates: node scripts/build-dist.js
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

// Every root entry must be explicitly served or explicitly excluded, so a new
// file is never silently dropped (or a private one silently published).
const SERVED_DIRS = ['css', 'icons', 'jobs', 'js'];
const SERVED_FILES = ['llms.txt', 'manifest.json', 'og-image.png', 'robots.txt', 'service-worker.js', 'sitemap.xml'];
const EXCLUDED = new Set(['.claude', '.git', '.github', '.gitignore', '.mcp.json', '.superpowers', '.vercel',
  '.vercelignore', '.wrangler', 'AGENTS.md', 'CLAUDE.md', 'LICENSE', 'STUDY-GUIDE-PLAN.md', 'dist', 'docs',
  'node_modules', 'package-lock.json', 'package.json', 'playwright.config.js', 'scripts', 'supabase',
  'test-results', 'tests', 'vercel.json', 'wrangler.jsonc', '.DS_Store']);
const isServedHtml = (name) => name.endsWith('.html') && !name.startsWith('preview-');

// "/(a|b)\\.html" -> ["/a.html", "/b.html"]; "/(.*)" -> ["/*"]
function translateSource(src) {
  let s = src.replace(/\(\.\*\)/g, '*').replace(/\\\./g, '.');
  const m = s.match(/\(([^()]+)\)/);
  if (m) return m[1].split('|').flatMap((alt) => translateSource(s.replace(m[0], alt)));
  if (/[()|\\^$+?\[\]]/.test(s)) throw new Error(`Cannot translate vercel.json source: ${src}`);
  return [s];
}

function buildHeaders(vercel) {
  const blocks = [];
  for (const rule of vercel.headers || []) {
    if (rule.has || rule.missing) continue; // query-conditional rules have no _headers equivalent
    for (const p of translateSource(rule.source)) {
      blocks.push([p, ...rule.headers.map((h) => `  ${h.key}: ${h.value}`)].join('\n'));
    }
  }
  return blocks.join('\n\n') + '\n';
}

const VERCEL_ANALYTICS_RE = /[ \t]*<script defer src="\/_vercel\/insights\/script\.js"><\/script>\r?\n?/g;

function main() {
  const unknown = fs.readdirSync(root).filter((n) =>
    !EXCLUDED.has(n) && !SERVED_DIRS.includes(n) && !SERVED_FILES.includes(n) && !isServedHtml(n) && !n.startsWith('preview-'));
  if (unknown.length) throw new Error(`build-dist: classify these root entries in scripts/build-dist.js: ${unknown.join(', ')}`);

  fs.rmSync(dist, { recursive: true, force: true });
  fs.mkdirSync(dist);
  for (const d of SERVED_DIRS) fs.cpSync(path.join(root, d), path.join(dist, d), { recursive: true });
  for (const f of SERVED_FILES) fs.copyFileSync(path.join(root, f), path.join(dist, f));
  for (const f of fs.readdirSync(root).filter(isServedHtml)) fs.copyFileSync(path.join(root, f), path.join(dist, f));

  const html = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? html(path.join(dir, e.name)) : e.name.endsWith('.html') ? [path.join(dir, e.name)] : []);
  for (const f of html(dist)) {
    const t = fs.readFileSync(f, 'utf8');
    const out = t.replace(VERCEL_ANALYTICS_RE, '');
    if (out !== t) fs.writeFileSync(f, out);
  }

  const vercel = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
  fs.writeFileSync(path.join(dist, '_headers'), buildHeaders(vercel));
  // Workers assets with html_handling "none" do not map "/" to index.html.
  fs.writeFileSync(path.join(dist, '_redirects'), '/ /index.html 200\n');

  execFileSync(process.execPath, [path.join(__dirname, 'stamp-assets.js'), dist], { stdio: 'inherit' });
  console.log('build-dist: dist/ ready');
}

if (require.main === module) main();
module.exports = { translateSource, buildHeaders };
