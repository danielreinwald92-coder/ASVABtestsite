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
loadScript('js/quiz-data.js', context);
loadScript('js/courses.js', context, 'this.courses = courses;');

const config = context.window.MissionASVABConfig;
const scoring = context.window.MissionASVABScoring;
const quizManager = context.window.QuizManager;
const asvabData = context.window.asvabData;
const courses = context.courses;

assert(config, 'MissionASVABConfig failed to load');
assert(scoring, 'MissionASVABScoring failed to load');
assert(quizManager, 'QuizManager failed to load');
assert(asvabData, 'asvabData failed to load');
assert(courses, 'courses failed to load');

assert(
  JSON.stringify(config.getSectionsForType('quick')) === JSON.stringify(['AR', 'WK', 'PC', 'MK']),
  'Quick AFQT section contract changed'
);
assert(
  JSON.stringify(config.getSectionsForType('full')) === JSON.stringify(['GS', 'AR', 'WK', 'PC', 'MK', 'EI', 'AS', 'MC']),
  'Full ASVAB section contract changed'
);

for (const [code, section] of Object.entries(asvabData.sections)) {
  const questions = asvabData.questions[code] || [];
  assert(questions.length >= section.questionsPerTest, `${code} does not have enough questions`);

  const ids = new Set();
  for (const question of questions) {
    assert(!ids.has(question.id), `${code} duplicate question id ${question.id}`);
    ids.add(question.id);
    assert(question.text, `${question.id} missing text`);
    assert(Array.isArray(question.options) && question.options.length === 4, `${question.id} must have 4 options`);
    assert(Number.isInteger(question.correct) && question.correct >= 0 && question.correct < 4, `${question.id} has invalid correct index`);
  }
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
