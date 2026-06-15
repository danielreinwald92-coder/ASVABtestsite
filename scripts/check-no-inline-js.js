#!/usr/bin/env node
'use strict';

// Inline-JS gate: scans the 12 served HTML pages and fails (exit nonzero)
// if any page contains inline JavaScript that would require the CSP to keep
// `script-src 'unsafe-inline'`. Specifically it flags:
//   (a) any inline event-handler attribute (onclick, onsubmit, oninput, ...)
//   (b) any non-empty <script> block that has NO `src` attribute, unless the
//       script type is a non-executable data block (e.g. application/ld+json).
//
// preview-*.html pages are NOT served and are intentionally ignored.

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const SERVED_PAGES = [
  'index.html',
  'about.html',
  'study-guide.html',
  'quiz.html',
  'results.html',
  'select-test.html',
  'dashboard.html',
  'test-intro.html',
  'admin.html',
  'login.html',
  'register.html',
  'reset-password.html'
];

// Script `type` values that are non-executable data blocks and therefore
// allowed to be inline (they do not run as JS and are unaffected by CSP
// script-src directives in a way that needs 'unsafe-inline').
const ALLOWED_INLINE_SCRIPT_TYPES = new Set([
  'application/ld+json',
  'application/json',
  'text/template',
  'text/html'
]);

function snippet(text, index, len = 80) {
  const start = Math.max(0, index - 10);
  const raw = text.slice(start, start + len).replace(/\s+/g, ' ').trim();
  return raw.length > len ? raw.slice(0, len) + '…' : raw;
}

// Find inline on* event-handler attributes. Matches `onclick=`, `onsubmit=`,
// etc. We require a word boundary before `on` and a letter after it, then `=`.
function findInlineHandlers(html) {
  const offenders = [];
  const re = /\son([a-zA-Z]+)\s*=\s*["']?/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    // Skip things that are not DOM event handlers but happen to match,
    // e.g. nothing common; the leading whitespace + `on<word>=` is specific
    // enough for HTML attributes. Report the handler name.
    offenders.push({
      type: `on${m[1]}=`,
      snippet: snippet(html, m.index, 90)
    });
  }
  return offenders;
}

// Find inline <script> blocks (no src) that contain executable JS.
function findInlineScripts(html) {
  const offenders = [];
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const attrs = m[1] || '';
    const body = m[2] || '';

    // Has a src attribute -> external script, allowed.
    if (/\bsrc\s*=/i.test(attrs)) {
      continue;
    }

    // Empty / whitespace-only body -> harmless.
    if (body.trim() === '') {
      continue;
    }

    // Allowed non-executable type?
    const typeMatch = attrs.match(/\btype\s*=\s*["']?([^"'\s>]+)/i);
    const type = typeMatch ? typeMatch[1].toLowerCase() : '';
    if (type && ALLOWED_INLINE_SCRIPT_TYPES.has(type)) {
      continue;
    }

    offenders.push({
      type: type ? `inline <script type="${type}">` : 'inline <script>',
      snippet: snippet(body, 0, 90)
    });
  }
  return offenders;
}

let totalOffenders = 0;
const filesWithOffenders = [];

for (const page of SERVED_PAGES) {
  const filePath = path.join(rootDir, page);
  if (!fs.existsSync(filePath)) {
    console.error(`MISSING served page: ${page}`);
    totalOffenders += 1;
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf8');
  const offenders = [...findInlineHandlers(html), ...findInlineScripts(html)];

  if (offenders.length > 0) {
    filesWithOffenders.push(page);
    totalOffenders += offenders.length;
    console.error(`\n✖ ${page} (${offenders.length} inline-JS offender(s)):`);
    for (const o of offenders) {
      console.error(`    [${o.type}]  ${o.snippet}`);
    }
  }
}

console.error('');
if (totalOffenders > 0) {
  console.error(
    `Inline-JS gate FAILED: ${totalOffenders} offender(s) across ` +
      `${filesWithOffenders.length} page(s): ${filesWithOffenders.join(', ')}`
  );
  process.exit(1);
}

console.log('Inline-JS gate passed: no inline JS in the 12 served pages.');
process.exit(0);
