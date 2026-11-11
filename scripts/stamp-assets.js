#!/usr/bin/env node
'use strict';
/**
 * Build-time cache busting. Runs in the Vercel buildCommand AFTER the gates and
 * rewrites the deploy output only (never commit the result):
 *   src="js/x.js" / href="css/x.css"  ->  ...?v=<content hash>
 * in every served HTML page and in service-worker.js PRECACHE_URLS.
 * vercel.json gives `?v=` asset URLs a 1-year immutable Cache-Control, so a
 * browser never re-requests an unchanged file; a changed file gets a new hash.
 * Usage: node scripts/stamp-assets.js [rootDir]   (--dry-run to only report)
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.resolve(process.argv.find((a, i) => i > 1 && !a.startsWith('--')) || '.');
const dryRun = process.argv.includes('--dry-run');
const hashes = new Map();

function hashFor(rel) {
  if (!hashes.has(rel)) {
    const file = path.join(root, rel);
    hashes.set(rel, fs.existsSync(file)
      ? crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0, 10)
      : null);
  }
  return hashes.get(rel);
}

// Matches a local js/ or css/ reference with no query string yet.
const ASSET_RE = /((?:src|href)=["'])(\/?)((?:js|css)\/[A-Za-z0-9._\/-]+\.(?:js|css))(["'])/g;
const SW_RE = /(['"])(\/)((?:js|css)\/[A-Za-z0-9._\/-]+\.(?:js|css))(['"])/g;

function stamp(text, re) {
  let n = 0;
  const out = text.replace(re, (m, pre, slash, rel, post) => {
    const h = hashFor(rel);
    if (!h) return m;
    n++;
    return `${pre}${slash}${rel}?v=${h}${post}`;
  });
  return { out, n };
}

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (e.isDirectory()) return e.name === 'jobs' ? htmlFiles(path.join(dir, e.name)) : [];
    return e.name.endsWith('.html') ? [path.join(dir, e.name)] : [];
  });
}

let total = 0;
for (const file of htmlFiles(root)) {
  const { out, n } = stamp(fs.readFileSync(file, 'utf8'), ASSET_RE);
  if (n && !dryRun) fs.writeFileSync(file, out);
  total += n;
}
const sw = path.join(root, 'service-worker.js');
if (fs.existsSync(sw)) {
  const { out, n } = stamp(fs.readFileSync(sw, 'utf8'), SW_RE);
  if (n && !dryRun) fs.writeFileSync(sw, out);
  total += n;
}
console.log(`stamp-assets: ${dryRun ? 'would stamp' : 'stamped'} ${total} asset references`);
