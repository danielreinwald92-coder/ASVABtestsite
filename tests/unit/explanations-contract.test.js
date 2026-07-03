const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..', '..');

function loadData() {
  const ctx = { console, window: {} };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  for (const f of ['js/section-config.js', 'js/quiz-data.js', 'js/explanations.js']) {
    vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
  }
  return {
    questions: ctx.window.asvabData.questions,
    explanations: ctx.window.QUIZ_EXPLANATIONS,
  };
}

test('every explanation key maps to a real question id (no orphans)', () => {
  const { questions, explanations } = loadData();
  const ids = new Set();
  for (const list of Object.values(questions)) list.forEach((q) => ids.add(q.id));
  for (const key of Object.keys(explanations)) {
    assert.ok(ids.has(key), `explanation for unknown question id "${key}"`);
  }
});

test('every explanation is within the length bounds (40–600 chars)', () => {
  const { explanations } = loadData();
  for (const [id, text] of Object.entries(explanations)) {
    assert.strictEqual(typeof text, 'string', `${id} explanation must be a string`);
    assert.ok(text.length >= 40, `${id} explanation too short (${text.length} chars)`);
    assert.ok(text.length <= 600, `${id} explanation too long (${text.length} chars)`);
  }
});

test('every question in the bank has an explanation (full coverage)', () => {
  const { questions, explanations } = loadData();
  for (const list of Object.values(questions)) {
    for (const q of list) {
      assert.ok(explanations[q.id] && explanations[q.id].length > 0,
        `${q.id} is missing an explanation`);
    }
  }
});

test('explanations are HTML-safe single lines (rendered via innerHTML unescaped)', () => {
  const { explanations } = loadData();
  for (const [id, text] of Object.entries(explanations)) {
    assert.ok(!/[<>&]/.test(text), `${id} must not contain <, > or &`);
    assert.ok(!/[\n\r]/.test(text), `${id} must be a single line`);
  }
});
