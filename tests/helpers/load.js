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
  if (includeData) files.push('js/quiz-data.js');
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

module.exports = { rootDir, loadScripts, loadCore, loadDom };
