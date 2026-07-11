const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..', '..');

function extractFn(source, name) {
  const start = source.indexOf('function ' + name + '(');
  assert.ok(start >= 0, `could not find ${name}`);
  let depth = 0, i = source.indexOf('{', start);
  for (; i < source.length; i++) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}' && --depth === 0) break;
  }
  return source.slice(start, i + 1);
}

const src = fs.readFileSync(path.join(root, 'js/dashboard.js'), 'utf8');

test('ordinal produces correct English suffixes for percentiles', () => {
  const sandbox = { console };
  vm.createContext(sandbox);
  vm.runInContext(extractFn(src, 'ordinal') + '\nthis.__fn = ordinal;', sandbox);
  assert.strictEqual(sandbox.__fn(91), '91st');
  assert.strictEqual(sandbox.__fn(62), '62nd');
  assert.strictEqual(sandbox.__fn(73), '73rd');
  assert.strictEqual(sandbox.__fn(11), '11th');
  assert.strictEqual(sandbox.__fn(12), '12th');
  assert.strictEqual(sandbox.__fn(13), '13th');
  assert.strictEqual(sandbox.__fn(50), '50th');
});

test('history and chart no longer hardcode a "th" suffix', () => {
  assert.ok(!src.includes("'th %ile'"), 'history row still hardcodes th %ile');
  assert.ok(!src.includes('}th percentile'), 'chart tooltip still hardcodes th');
});
