const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..', '..');

function extractFn(source, name) {
  const start = source.indexOf('function ' + name);
  assert.ok(start >= 0, `could not find ${name}`);
  let depth = 0, i = source.indexOf('{', start);
  for (; i < source.length; i++) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}' && --depth === 0) break;
  }
  return source.slice(start, i + 1);
}

const src = fs.readFileSync(path.join(root, 'js/dashboard.js'), 'utf8');

test('timedOnly keeps timed + legacy(undefined) rows, drops tutor rows', () => {
  const sandbox = { console };
  vm.createContext(sandbox);
  vm.runInContext(extractFn(src, 'timedOnly') + '\nthis.__fn = timedOnly;', sandbox);
  const rows = [
    { id: 'a', mode: 'timed' },
    { id: 'b', mode: 'tutor' },
    { id: 'c' }, // legacy row, no mode → treated as timed
  ];
  const out = sandbox.__fn(rows).map((r) => r.id);
  assert.deepStrictEqual(out, ['a', 'c']);
});
