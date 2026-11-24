// study-guide.html ships static placeholder course cards so the grid has its
// final height before js/courses.js loads (prevents a large layout shift of
// the footer). They must match what page-study-guide.js renders, or the swap
// itself would shift the layout.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const { loadScripts } = require('../helpers/load');

test('static study-guide course cards match the course data', () => {
  const ctx = loadScripts([
    { file: 'js/courses.js', append: 'this.courses = courses;' },
    { file: 'js/courses-tech.js', append: 'this.coursesTech = coursesTech;' }
  ]);
  const all = Object.assign({}, ctx.courses, ctx.coursesTech);
  const html = fs.readFileSync(path.join(__dirname, '../../study-guide.html'), 'utf8');
  const doc = new JSDOM(html).window.document;
  const cards = [...doc.querySelectorAll('#course-grid .course-card')];
  assert.deepStrictEqual(cards.map((c) => c.dataset.course), ['AR', 'MK', 'WK', 'PC', 'GS', 'AS', 'MC', 'EI']);
  for (const card of cards) {
    const course = all[card.dataset.course];
    assert.ok(course, `no course data for ${card.dataset.course}`);
    assert.strictEqual(card.querySelector('h3').textContent, course.name);
    assert.strictEqual(card.querySelector('p').textContent, course.description);
    const n = course.chapters.length;
    assert.strictEqual(card.querySelector('.meta').textContent, `${n} chapters • 0/${n} completed`);
  }
});
