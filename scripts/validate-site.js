const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.resolve(__dirname, '..');

function loadScript(file, context, append = '') {
  const source = fs.readFileSync(path.join(rootDir, file), 'utf8');
  vm.runInContext(`${source}\n${append}`, context, { filename: file });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const context = {
  console,
  window: {}
};
context.globalThis = context;
vm.createContext(context);

loadScript('js/test-config.js', context);
loadScript('js/scoring.js', context);
loadScript('js/section-config.js', context);
loadScript('js/quiz-data.js', context);
loadScript('js/explanations.js', context);
loadScript('js/courses.js', context, 'this.courses = courses;');
loadScript('js/courses-tech.js', context, 'this.coursesTech = coursesTech;');

const config = context.window.MissionASVABConfig;
const scoring = context.window.MissionASVABScoring;
const quizManager = context.window.QuizManager;
const asvabData = context.window.asvabData;
const courses = context.courses;
const coursesTech = context.coursesTech;

assert(config, 'MissionASVABConfig failed to load');
assert(scoring, 'MissionASVABScoring failed to load');
assert(quizManager, 'QuizManager failed to load');
assert(asvabData, 'asvabData failed to load');
assert(courses, 'courses failed to load');
assert(coursesTech, 'coursesTech failed to load');
// Mirror the study-guide merge so the course-shape checks below cover both bundles.
Object.assign(courses, coursesTech);

assert(
  JSON.stringify(config.getSectionsForType('quick')) === JSON.stringify(['AR', 'WK', 'PC', 'MK']),
  'Quick AFQT section contract changed'
);
assert(
  JSON.stringify(config.getSectionsForType('full')) === JSON.stringify(['GS', 'AR', 'WK', 'PC', 'MK', 'EI', 'AS', 'MC']),
  'Full ASVAB section contract changed'
);

// Pool-size ratchet (SP4): pools may only grow. Raise a section's floor in the
// same branch that ships its content expansion.
const POOL_MINIMUMS = { WK: 148, PC: 85, AR: 122, MK: 132, GS: 105, EI: 105, AS: 100, MC: 105 };

for (const [code, section] of Object.entries(asvabData.sections)) {
  const questions = asvabData.questions[code] || [];
  assert(questions.length >= section.questionsPerTest, `${code} does not have enough questions`);
  assert(questions.length >= POOL_MINIMUMS[code], `${code} pool shrank below its ratchet (${questions.length} < ${POOL_MINIMUMS[code]})`);

  const ids = new Set();
  for (const question of questions) {
    assert(!ids.has(question.id), `${code} duplicate question id ${question.id}`);
    ids.add(question.id);
    assert(question.text, `${question.id} missing text`);
    assert(Array.isArray(question.options) && question.options.length === 4, `${question.id} must have 4 options`);
    assert(Number.isInteger(question.correct) && question.correct >= 0 && question.correct < 4, `${question.id} has invalid correct index`);
  }
}

// --- Explanation contract (SP1) ---------------------------------------------
// Full-bank enforcement (all Phase C batches landed): every question has a
// non-empty explanation; no orphans; length bounds; and the values are
// HTML-safe (rendered via innerHTML in the review/tutor panels without escaping,
// so a literal <, > or & would break rendering).
const explanations = context.window.QUIZ_EXPLANATIONS || {};

const allQuestionIds = new Set();
for (const list of Object.values(asvabData.questions)) {
  list.forEach((q) => allQuestionIds.add(q.id));
}
for (const [key, text] of Object.entries(explanations)) {
  assert(allQuestionIds.has(key), `explanation for unknown question id ${key}`);
  assert(typeof text === 'string' && text.length >= 40 && text.length <= 600,
    `explanation ${key} must be a 40–600 char string`);
  assert(!/[<>&]/.test(text), `explanation ${key} must not contain <, > or & (HTML-unsafe)`);
  assert(!/[\n\r]/.test(text), `explanation ${key} must be a single line`);
}
for (const id of allQuestionIds) {
  assert(explanations[id] && explanations[id].length > 0,
    `${id} is missing an explanation`);
}

for (const [courseCode, course] of Object.entries(courses)) {
  assert(Array.isArray(course.chapters) && course.chapters.length > 0, `${courseCode} has no chapters`);

  for (const chapter of course.chapters) {
    assert(chapter.id && chapter.title, `${courseCode} has a chapter missing id/title`);
    assert(chapter.lesson, `${chapter.id} missing lesson`);
    assert(chapter.quizConfig, `${chapter.id} missing quiz config`);
    assert(chapter.questions.length >= chapter.quizConfig.questionsPerQuiz, `${chapter.id} has fewer questions than quiz size`);

    for (const question of chapter.questions) {
      const options = question.options || [];
      const correctCount = options.filter((option) => option.correct).length;

      assert(options.length === 4, `${chapter.id}/${question.id} must have 4 options`);
      assert(correctCount === 1, `${chapter.id}/${question.id} must have exactly one correct answer`);

      for (const option of options) {
        assert(option.text, `${chapter.id}/${question.id} option missing text`);
        assert(option.explanation, `${chapter.id}/${question.id} option missing explanation`);
        assert(!(option.correct === false && /Correct!/i.test(option.explanation)), `${chapter.id}/${question.id} wrong option says Correct`);
      }
    }
  }
}

const perfectSectionResults = {};
for (const code of config.getSectionsForType('full')) {
  const section = asvabData.sections[code];
  perfectSectionResults[code] = {
    correct: section.questionsPerTest,
    total: section.questionsPerTest
  };
}

assert(scoring.calculateAFQTEstimate(perfectSectionResults) === 99, 'Perfect AFQT should clamp to 99');
assert(Object.keys(scoring.calculateLineScores(perfectSectionResults)).length === 10, 'Full test should produce 10 line scores');

console.log('Validation passed');
