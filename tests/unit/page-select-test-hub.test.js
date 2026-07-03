const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..', '..');

// Extract the two pure helpers from the shipped source and run them.
function loadHelpers() {
  const src = fs.readFileSync(path.join(root, 'js/page-select-test.js'), 'utf8');
  function extract(name) {
    const start = src.indexOf('function ' + name);
    assert.ok(start >= 0, 'missing ' + name);
    let depth = 0, i = src.indexOf('{', start);
    for (; i < src.length; i++) { if (src[i] === '{') depth++; else if (src[i] === '}' && --depth === 0) break; }
    return src.slice(start, i + 1);
  }
  const sandbox = {
    MissionASVABConfig: {
      getSectionsForType: (t) => ({ quick: ['AR', 'WK', 'PC', 'MK'], full: ['GS', 'AR', 'WK', 'PC', 'MK', 'EI', 'AS', 'MC'] }[t]),
      getTestTypeFromSections: (s) => {
        const q = ['AR', 'WK', 'PC', 'MK'], f = ['GS', 'AR', 'WK', 'PC', 'MK', 'EI', 'AS', 'MC'];
        if (s.length === q.length && q.every((c, i) => s[i] === c)) return 'afqt';
        if (s.length === f.length && f.every((c, i) => s[i] === c)) return 'full';
        return s.length === 1 ? 'single' : 'custom';
      },
    },
  };
  vm.createContext(sandbox);
  vm.runInContext(extract('orderSections') + '\n' + extract('deriveTestType') + '\nthis.orderSections=orderSections;this.deriveTestType=deriveTestType;', sandbox);
  return sandbox;
}

test('orderSections returns canonical (full) order regardless of input order', () => {
  const s = loadHelpers();
  assert.deepStrictEqual(s.orderSections(['MK', 'AR']), ['AR', 'MK']);
  assert.deepStrictEqual(s.orderSections(['MC', 'GS', 'AR']), ['GS', 'AR', 'MC']);
});

test('deriveTestType maps the AFQT four to quick, all eight to full, else custom', () => {
  const s = loadHelpers();
  assert.strictEqual(s.deriveTestType(['AR', 'WK', 'PC', 'MK']), 'quick');
  assert.strictEqual(s.deriveTestType(['GS', 'AR', 'WK', 'PC', 'MK', 'EI', 'AS', 'MC']), 'full');
  assert.strictEqual(s.deriveTestType(['WK']), 'custom');
  assert.strictEqual(s.deriveTestType(['AR', 'WK']), 'custom');
});
