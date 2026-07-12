const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { loadEngine, fakeDoc } = require('../helpers/engine.js');

const root = path.resolve(__dirname, '..', '..');

// Question text/options are first-party data, but 5 MK questions legitimately
// contain raw < > (e.g. "x < 6") and today render only via HTML-parser
// leniency; a quote in an option would corrupt the aria-label attribute.
// Escape at render time in both places that inject bank content.

test('quiz renderQuestion escapes question text and options', () => {
  const doc = fakeDoc();
  doc._els.questionNumber = { textContent: '' };
  doc._els.questionText = { innerHTML: '' };
  doc._els.progressFill = { style: {} };
  doc._els.progressCount = { textContent: '' };
  doc._els.answersContainer = { innerHTML: '', setAttribute() {} };
  const sandbox = loadEngine({
    document: doc,
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  });
  const engine = new sandbox.QuizEngine();
  engine.mode = 'timed';
  engine.sectionRanges = [{ code: 'MK', name: 'MK', start: 0, end: 1, timeLimit: 60 }];
  engine.quizData = { questions: [{
    id: 1, sectionCode: 'MK', sectionName: 'MK',
    text: 'Solve: x < 6 & y > "2"\nSecond line',
    options: ['x <b', 'a & b', 'plain', '"quoted"'],
    correct: 2,
  }] };
  engine.currentQuestion = 0;
  engine.answers = {};
  engine.flagged = new Set();
  engine.renderQuestion();

  assert.ok(doc._els.questionText.innerHTML.includes('x &lt; 6 &amp; y &gt; &quot;2&quot;'),
    `text not escaped: ${doc._els.questionText.innerHTML}`);
  assert.ok(doc._els.questionText.innerHTML.includes('<br>'), 'newlines still become <br>');
  const opts = doc._els.answersContainer.innerHTML;
  assert.ok(opts.includes('x &lt;b'), 'option < escaped');
  assert.ok(!opts.includes('x <b'), 'raw < must not reach the DOM');
  assert.ok(opts.includes('a &amp; b'), 'option & escaped');
  assert.ok(!opts.includes('aria-label="Option D: "quoted"'), 'quotes must not break the aria-label attribute');
});

test('results review renderer escapes question text and options', () => {
  const src = fs.readFileSync(path.join(root, 'js/page-results.js'), 'utf8');
  function extractFn(name) {
    const start = src.indexOf('function ' + name + '(');
    if (start < 0) return null;
    let depth = 0, i = src.indexOf('{', start);
    for (; i < src.length; i++) {
      if (src[i] === '{') depth++;
      else if (src[i] === '}' && --depth === 0) break;
    }
    return src.slice(start, i + 1);
  }
  const fnSrc = extractFn('renderFilteredQuestions');
  assert.ok(fnSrc, 'renderFilteredQuestions not found');
  const helperSrc = extractFn('escReview') || '';

  const list = { innerHTML: '' };
  const sandbox = {
    console, JSON, String, Array, Object,
    document: { getElementById: (id) => (id === 'reviewQuestionsList' ? list : null) },
    currentReviewFilter: 'all',
    allReviewQuestions: [{
      num: 1, section: 'MK', sectionName: 'Math <b>', id: 'MK042', originalId: 'MK042',
      text: 'If x < 6 & "y" > 2', options: ['x <b', 'a & b', 'c', 'd'],
      userAnswer: 0, correctAnswer: 1, isCorrect: false,
    }],
    questionExplanations: {},
    reportedQuestionIds: new Set(),
  };
  vm.createContext(sandbox);
  vm.runInContext(
    helperSrc + '\n' + fnSrc + '\ncurrentReviewFilter = "all";\nrenderFilteredQuestions("all");',
    sandbox
  );
  assert.ok(list.innerHTML.includes('x &lt; 6 &amp; &quot;y&quot; &gt; 2'),
    `review text not escaped: ${list.innerHTML.slice(0, 300)}`);
  assert.ok(list.innerHTML.includes('x &lt;b'), 'review option < escaped');
  assert.ok(!list.innerHTML.includes('x <b'), 'raw < must not reach the review DOM');
});
