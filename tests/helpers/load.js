// Test helpers for loading the site's plain-JS globals into an isolated
// `vm` context, plus loading a page's DOM via jsdom for DOM-contract tests.
//
// The vm-loading approach mirrors scripts/validate-site.js exactly: each js
// file is read from disk and executed in a sandbox whose `window` object the
// IIFE modules attach their public API to (e.g. window.MissionASVABScoring).
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { JSDOM } = require('jsdom');

const rootDir = path.resolve(__dirname, '..', '..');

/**
 * Load one or more js/*.js files into a fresh vm context and return the
 * sandbox. Each entry may be a string (file path relative to repo root) or an
 * object `{ file, append }` where `append` is extra source appended after the
 * file (used to surface non-window globals, e.g. `this.courses = courses;`).
 *
 * @param {(string|{file:string, append?:string})[]} files
 * @returns {object} the vm sandbox/context (has `.window` and any captured globals)
 */
function loadScripts(files) {
  const context = {
    console,
    window: {}
  };
  context.globalThis = context;
  vm.createContext(context);

  for (const entry of files) {
    const file = typeof entry === 'string' ? entry : entry.file;
    const append = typeof entry === 'string' ? '' : (entry.append || '');
    const source = fs.readFileSync(path.join(rootDir, file), 'utf8');
    vm.runInContext(`${source}\n${append}`, context, { filename: file });
  }

  return context;
}

/**
 * Convenience loader for the core scoring/config/data globals the site uses.
 * Mirrors the load order in scripts/validate-site.js.
 *
 * @param {object} [opts]
 * @param {boolean} [opts.includeData=true]  load js/quiz-data.js (asvabData)
 * @param {boolean} [opts.includeCourses=false] load js/courses.js (courses)
 * @returns {{context:object, config:object, scoring:object, asvabData:object, courses:object}}
 */
function loadCore(opts = {}) {
  const { includeData = true, includeCourses = false } = opts;

  const files = ['js/test-config.js', 'js/scoring.js'];
  if (includeData) files.push('js/section-config.js', 'js/quiz-data.js');
  if (includeCourses) files.push({ file: 'js/courses.js', append: 'this.courses = courses;' });

  const context = loadScripts(files);
  return {
    context,
    config: context.window.MissionASVABConfig,
    scoring: context.window.MissionASVABScoring,
    asvabData: context.window.asvabData,
    courses: context.courses
  };
}

/**
 * Load an HTML page from the repo root via jsdom for DOM-contract assertions.
 * Scripts are NOT executed (runScripts is left default/disabled) so this is
 * safe and fast for pure markup/id checks.
 *
 * @param {string} htmlFile  path relative to repo root, e.g. 'quiz.html'
 * @returns {{dom:JSDOM, document:Document, window:Window}}
 */
function loadDom(htmlFile) {
  const html = fs.readFileSync(path.join(rootDir, htmlFile), 'utf8');
  const dom = new JSDOM(html);
  return {
    dom,
    document: dom.window.document,
    window: dom.window
  };
}

/**
 * A minimal in-memory localStorage stand-in for jsdom-free script execution.
 */
function makeLocalStorage(initial = {}) {
  const store = { ...initial };
  return {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { for (const k of Object.keys(store)) delete store[k]; }
  };
}

/**
 * Load an HTML page via jsdom and execute ONE of its inline <script> blocks
 * (the first script without a `src` attribute whose text contains `match`)
 * inside a controllable vm sandbox. This lets us drive event handlers defined
 * in page-level inline scripts while mocking out browser/Supabase seams
 * (getClient, getSession, fetch, window.location, localStorage, alert).
 *
 * The jsdom `document` is shared into the sandbox so real DOM events work.
 *
 * @param {string} htmlFile          page path relative to repo root
 * @param {string} match             substring identifying the inline script
 * @param {object} [env]             overrides: getClient, getSession, fetch,
 *                                   alert, localStorage, location
 * @returns {{dom, document, window, sandbox}}
 */
function runPageScript(htmlFile, match, env = {}) {
  const { dom, document } = loadDom(htmlFile);

  // Prefer an inline <script> whose text matches (legacy pages), then fall
  // back to externalized page logic in local `js/*.js` files referenced via
  // `<script src>` (CSP hardening moved inline blocks into js/page-*.js).
  const inlineScripts = [...document.querySelectorAll('script:not([src])')];
  const inlineEl = inlineScripts.find((s) => s.textContent.includes(match));

  let scriptSource = null;
  if (inlineEl) {
    scriptSource = inlineEl.textContent;
  } else {
    const externalScripts = [...document.querySelectorAll('script[src]')];
    for (const s of externalScripts) {
      const src = s.getAttribute('src');
      // Only consider local same-origin scripts (skip CDNs / absolute URLs).
      if (!src || /^(https?:)?\/\//.test(src)) continue;
      const filePath = path.join(rootDir, src.replace(/^\//, ''));
      if (!fs.existsSync(filePath)) continue;
      const source = fs.readFileSync(filePath, 'utf8');
      if (source.includes(match)) {
        scriptSource = source;
        break;
      }
    }
  }

  if (scriptSource === null) {
    throw new Error(`runPageScript: no inline or external script in ${htmlFile} matching ${JSON.stringify(match)}`);
  }

  const win = {
    location: env.location || { href: '', origin: 'https://example.test' },
    addEventListener: () => {},
    document
  };

  const sandbox = {
    document,
    window: win,
    console,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    setImmediate,
    queueMicrotask,
    Promise, Date, JSON, Math, RegExp, Error,
    String, Number, Boolean, Object, Array,
    parseInt, parseFloat, isNaN, isFinite,
    AbortController, AbortSignal,
    navigator: { userAgent: 'node' },
    localStorage: env.localStorage || makeLocalStorage(),
    alert: env.alert || (() => {}),
    fetch: env.fetch,
    getClient: env.getClient || (() => { throw new Error('getClient not mocked'); }),
    getSession: env.getSession || (async () => null),
    ...(env.globals || {})
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(scriptSource, sandbox, { filename: htmlFile });

  return { dom, document, window: win, sandbox };
}

/**
 * Flush pending microtasks/macrotasks so awaited mock promises settle.
 */
function flush(times = 3) {
  let p = Promise.resolve();
  for (let i = 0; i < times; i++) {
    p = p.then(() => new Promise((r) => setImmediate(r)));
  }
  return p;
}

module.exports = { rootDir, loadScripts, loadCore, loadDom, runPageScript, flush, makeLocalStorage };
