const { test } = require('node:test');
const assert = require('node:assert');
const { JSDOM, VirtualConsole } = require('jsdom');
const { loadEngine } = require('../helpers/engine.js');

test('loadEngine does not auto-initialize a second quiz in jsdom tests', () => {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', (error) => errors.push(error));
  const dom = new JSDOM('<div id="questionText"></div>', { virtualConsole });

  loadEngine({ document: dom.window.document, window: dom.window });
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));

  assert.deepStrictEqual(errors, []);
});
