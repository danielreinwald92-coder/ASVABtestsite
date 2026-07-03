// Contract tests for js/courses-tech.js — the lazy course bundle for the
// technical sections (GS/AS/MC/EI) that merges into the base `courses`
// object from js/courses.js (see js/page-study-guide.js loadCourses()).
const test = require('node:test');
const assert = require('node:assert');
const { loadScripts } = require('../helpers/load');

function loadMerged() {
  const ctx = loadScripts([
    { file: 'js/courses.js', append: 'this.courses = courses;' },
    { file: 'js/courses-tech.js', append: 'this.coursesTech = coursesTech;' }
  ]);
  return ctx;
}

test('courses-tech contains only technical sections with valid renderer shape', () => {
  const ctx = loadMerged();
  const codes = Object.keys(ctx.coursesTech);
  assert.ok(codes.length > 0, 'coursesTech is empty');
  for (const [code, course] of Object.entries(ctx.coursesTech)) {
    assert.ok(['GS', 'AS', 'MC', 'EI'].includes(code), `unexpected course ${code}`);
    assert.ok(course.name && course.description && course.icon, `${code} missing card fields`);
    assert.ok(Array.isArray(course.chapters) && course.chapters.length >= 5, `${code} needs 5+ chapters`);
    for (const ch of course.chapters) {
      assert.ok(ch.id && ch.title && ch.description, `${code} chapter missing id/title/description`);
      assert.ok(ch.lesson && ch.lesson.intro && ch.lesson.summary, `${ch.id} missing lesson intro/summary`);
      assert.ok(Array.isArray(ch.lesson.concepts) && ch.lesson.concepts.length > 0, `${ch.id} has no concepts`);
      assert.ok(Array.isArray(ch.lesson.examples) && ch.lesson.examples.length > 0, `${ch.id} has no worked examples`);
      assert.ok(Array.isArray(ch.questions) && ch.questions.length >= ch.quizConfig.questionsPerQuiz,
        `${ch.id} has fewer questions than quiz size`);
    }
  }
});

test('merging courses-tech does not clobber the base courses', () => {
  const ctx = loadMerged();
  const merged = Object.assign({}, ctx.courses, ctx.coursesTech);
  for (const code of ['AR', 'MK', 'WK', 'PC']) {
    assert.ok(merged[code], `base course ${code} lost in merge`);
    assert.ok(merged[code].chapters.length > 0, `base course ${code} has no chapters after merge`);
  }
  const techCodes = Object.keys(ctx.coursesTech);
  assert.ok(techCodes.every((c) => merged[c] === ctx.coursesTech[c]), 'tech course not present after merge');
});
