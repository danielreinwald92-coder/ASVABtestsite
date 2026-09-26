'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { build } = require('../../scripts/build-section-guides.js');

const root = path.resolve(__dirname, '..', '..');

test('generated section guide pages are in sync with course and question data', () => {
  for (const { file, html } of build()) {
    const current = fs.readFileSync(path.join(root, file), 'utf8');
    assert.strictEqual(current, html, `${file} is stale; run node scripts/build-section-guides.js`);
  }
});

test('each guide has 10 answered sample questions and never publishes tag-5 items', () => {
  const vm = require('vm');
  const { pickSamples, ORDER } = require('../../scripts/build-section-guides.js');
  const sb = {}; sb.window = sb; sb.globalThis = sb; vm.createContext(sb);
  vm.runInContext(fs.readFileSync(path.join(root, 'js/section-config.js'), 'utf8'), sb);
  vm.runInContext(fs.readFileSync(path.join(root, 'js/quiz-data.js'), 'utf8'), sb);
  for (const code of ORDER) {
    const picks = pickSamples(sb.asvabData.questions[code]);
    assert.strictEqual(new Set(picks.map((q) => q.id)).size, 10, `${code} has 10 distinct samples`);
    for (const q of picks) assert.ok(q.difficulty < 5, `${q.id} is a tag-5 item and must stay unpublished`);
  }
  for (const { file, html } of build()) {
    assert.strictEqual((html.match(/class="guide-question"/g) || []).length, 10, `${file} question count`);
    assert.strictEqual((html.match(/<details class="guide-answer">/g) || []).length, 10, `${file} answers`);
  }
});
