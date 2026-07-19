// Helpers for loading the QuizEngine class into an isolated vm context with
// caller-supplied browser-ish globals. Only the class declaration and a
// DOMContentLoaded registration run at load time, so undefined deps
// (QuizManager, getClient…) are harmless unless a tested method calls them.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..', '..');

function loadEngine(ctx = {}) {
  // Tests often pass a real jsdom document so instance methods can render into
  // it. Do not expose that document while evaluating quiz-engine.js, because
  // its production DOMContentLoaded hook would create and initialize a second,
  // uncontrolled QuizEngine when jsdom finishes loading. Install against a
  // no-op load-time document, then swap in the requested runtime document.
  const runtimeDocument = ctx.document;
  const sandbox = Object.assign(
    {
      console,
      setInterval: () => 1,
      clearInterval: () => {},
      setTimeout: () => 0,
    },
    ctx,
    { document: { addEventListener() {} } },
  );
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  const src = fs.readFileSync(path.join(root, 'js/quiz-engine.js'), 'utf8');
  vm.runInContext(src + '\nthis.QuizEngine = QuizEngine;', sandbox);
  if (runtimeDocument) sandbox.document = runtimeDocument;
  return sandbox;
}

function fakeDoc() {
  const listeners = {};
  return {
    hidden: false,
    _listeners: listeners,
    _els: {},
    addEventListener(type, fn) {
      (listeners[type] = listeners[type] || []).push(fn);
    },
    removeEventListener(type, fn) {
      const arr = listeners[type] || [];
      const i = arr.indexOf(fn);
      if (i >= 0) arr.splice(i, 1);
    },
    getElementById(id) {
      return this._els[id] || null;
    },
    querySelector() {
      return null;
    },
  };
}

module.exports = { loadEngine, fakeDoc };
