#!/usr/bin/env node
'use strict';
// Generates one static, crawlable guide page per ASVAB section
// (asvab-<slug>.html): section facts, the full study-course lessons from
// js/courses.js / js/courses-tech.js, and 10 sample questions with answers
// and explanations from js/quiz-data.js / js/explanations.js. No page JS
// beyond the shared helpers (answers use <details>), so it is CSP-safe.
//
//   node scripts/build-section-guides.js          # write the pages
//   node scripts/build-section-guides.js --check  # exit 1 if any page is stale
//
// Re-run after editing course lessons, section copy below, or the sample
// question picks; tests/unit/section-guides.test.js fails when pages drift.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { syncPage } = require('./sync-site-chrome.js');

const root = path.resolve(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

function loadData() {
  const sb = {};
  sb.globalThis = sb;
  sb.window = sb;
  vm.createContext(sb);
  vm.runInContext(read('js/section-config.js'), sb);
  vm.runInContext(read('js/quiz-data.js'), sb);
  vm.runInContext(read('js/explanations.js'), sb);
  vm.runInContext(read('js/courses.js') + '\nthis.courses = courses;', sb);
  vm.runInContext(read('js/courses-tech.js') + '\nthis.coursesTech = coursesTech;', sb);
  return {
    sections: sb.SECTION_CONFIG,
    bank: sb.asvabData.questions,
    explanations: sb.QUIZ_EXPLANATIONS,
    courses: Object.assign({}, sb.courses, sb.coursesTech),
  };
}

// Hand-written, fact-checked section copy. Counts and times come from
// section-config.js (the official CAT-ASVAB table) at build time.
const SECTION_COPY = {
  AR: {
    slug: 'arithmetic-reasoning',
    what: 'Arithmetic Reasoning (AR) is the word-problem section: rates and distance, percents and interest, ratios, averages, work problems, and everyday money math. You set up the problem from a short story, then do the arithmetic by hand. No calculator is allowed.',
    usedFor: 'AR is one of the four AFQT sections, so it directly decides whether you can enlist. It also feeds the Army GT, CL, CO, EL, FA, and SC line scores.',
    tips: [
      'Write down what the question actually asks before you calculate. Many wrong choices are the answer to a different question, like the discount instead of the sale price.',
      'Estimate first. If the answer must be a little under $50, you can cross out choices that are far away before doing exact math.',
      'Percent changes do not add. A 20% raise followed by a 20% cut leaves you below where you started.',
      'For average speed over a round trip, divide total distance by total time. Never average the two speeds.'
    ],
  },
  WK: {
    slug: 'word-knowledge',
    what: 'Word Knowledge (WK) is a vocabulary test. Each question gives a word, alone or in a short sentence, and asks which choice most nearly means the same thing.',
    usedFor: 'WK combines with Paragraph Comprehension into your Verbal Expression (VE) score, which counts twice in the AFQT formula. WK carries more weight than PC inside VE.',
    tips: [
      'Cross out the antonym first. Test writers almost always include the opposite meaning as a trap.',
      'Break unfamiliar words into roots and prefixes: bene (good), mal (bad), dict (say), anti (against).',
      'Watch for look-alike words. Enervate means weaken, not energize.',
      'With about 36 seconds per question, answer and move on. Long hesitation rarely helps on vocabulary.'
    ],
  },
  PC: {
    slug: 'paragraph-comprehension',
    what: 'Paragraph Comprehension (PC) gives you a short passage and asks about its main idea, a stated detail, an inference, the author\'s purpose or tone, or the meaning of a word in context.',
    usedFor: 'PC combines with Word Knowledge into Verbal Expression (VE), which counts twice in the AFQT formula.',
    tips: [
      'Read the question before the passage so you know what you are hunting for.',
      'The best answer must be supported by the passage itself. A choice that is true in real life but not in the text is a trap.',
      'For main-idea questions, reject choices that cover only one sentence (too narrow) or go beyond the passage (too broad).',
      'Qualifiers matter. Words like only, always, less than, and even when often decide the answer.'
    ],
  },
  MK: {
    slug: 'mathematics-knowledge',
    what: 'Mathematics Knowledge (MK) tests high-school math directly: algebra, equations and inequalities, exponents and roots, factoring, geometry (area, perimeter, volume, angles, triangles, circles), and basic probability. No calculator is allowed.',
    usedFor: 'MK is one of the four AFQT sections. It also feeds the Army CL, EL, FA, GM, and ST line scores.',
    tips: [
      'Memorize the core formulas. The real test gives you none of them.',
      'Plug the answer choices back in when an equation looks messy. One of the four has to work.',
      'Check for extraneous answers. A value that makes a denominator zero is never a solution.',
      'When a figure is scaled by k, areas scale by k squared and volumes by k cubed.'
    ],
  },
  GS: {
    slug: 'general-science',
    what: 'General Science (GS) covers life science (cells, body systems, ecology), earth and space science (weather, geology, the solar system), and physical science (matter, chemistry basics, energy).',
    usedFor: 'GS is not part of the AFQT, but it feeds the Army EL, GM, and ST line scores that qualify you for technical jobs.',
    tips: [
      'Focus on core vocabulary: the names of body systems, rock types, cloud types, and states of matter.',
      'Units give clues. If an answer choice has the wrong unit for the quantity asked, eliminate it.',
      'With about 48 seconds per question, skip nothing but do not overthink. GS rewards recall more than reasoning.'
    ],
  },
  EI: {
    slug: 'electronics-information',
    what: 'Electronics Information (EI) covers electrical current, voltage, resistance, Ohm\'s law, series and parallel circuits, common components, and electrical safety.',
    usedFor: 'EI is not part of the AFQT, but it feeds the Army EL, GM, and MM line scores.',
    tips: [
      'Know Ohm\'s law cold: voltage equals current times resistance, and power equals voltage times current.',
      'Resistors in series add. In parallel, the total resistance is always smaller than the smallest single resistor.',
      'Learn the common schematic symbols and what each component does.'
    ],
  },
  AS: {
    slug: 'auto-and-shop',
    what: 'Auto and Shop Information (AS) covers how vehicle systems work (engine, fuel, cooling, brakes, electrical) and the correct use of common tools, fasteners, and shop practices. The real CAT-ASVAB splits this into separate Auto and Shop subtests. Mission ASVAB practices them as one combined section using the Auto Information limits (10 questions, 7 minutes); the real Shop Information subtest adds 10 more questions in 6 minutes.',
    usedFor: 'AS is not part of the AFQT, but it feeds the Army CO, GM, MM, OF, and SC line scores.',
    tips: [
      'Learn the four-stroke cycle in order: intake, compression, power, exhaust.',
      'Match each tool to its job: which saw, wrench, or file is right for a given material and task.',
      'Symptom questions reward system thinking. Trace the problem back to the system that causes it.'
    ],
  },
  MC: {
    slug: 'mechanical-comprehension',
    what: 'Mechanical Comprehension (MC) tests basic physics and simple machines: levers, pulleys, gears, inclined planes, force and work, pressure, and how structures carry loads.',
    usedFor: 'MC is not part of the AFQT, but it feeds the Army CO, FA, MM, OF, SC, and ST line scores.',
    tips: [
      'Mechanical advantage trades force for distance. If a machine halves the force you need, you move it twice as far.',
      'For gears, meshed neighbors turn in opposite directions, and a smaller gear spins faster than a larger one.',
      'For levers, force times distance from the fulcrum balances on both sides.'
    ],
  },
};

const ORDER = ['AR', 'WK', 'PC', 'MK', 'GS', 'EI', 'AS', 'MC'];

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Ten sample questions: difficulty 2-4 only (the top-end tag-5 items stay
// unpublished so they remain informative in the adaptive tests), spread
// evenly across the id-sorted pool so the pick is stable as pools grow at the end.
function pickSamples(pool) {
  const eligible = pool.filter((q) => q.difficulty >= 2 && q.difficulty <= 4)
    .sort((a, b) => a.id.localeCompare(b.id));
  const out = [];
  const step = eligible.length / 10;
  for (let i = 0; i < 10; i++) out.push(eligible[Math.floor(i * step)]);
  return out;
}

function renderText(text) {
  return String(text).split(/\n\n+/).map((para) => `<p>${esc(para).replace(/\n/g, '<br>')}</p>`).join('\n          ');
}

function renderLesson(chapter, n) {
  const l = chapter.lesson;
  const visual = (x) => (x.svg ? `<div class="guide-visual">${x.svg}</div>` : (x.diagram ? `<pre class="guide-diagram">${esc(x.diagram)}</pre>` : ''));
  const concepts = l.concepts.map((c) => `
        <div class="guide-concept">
          <h4>${esc(c.title)}</h4>
          <p>${esc(c.content)}</p>
          ${visual(c)}
        </div>`).join('');
  const examples = (l.examples || []).map((ex) => `
        <div class="guide-example">
          <p class="guide-example-label">Worked example</p>
          <p class="guide-example-problem">${esc(ex.problem)}</p>
          ${visual(ex)}
          <ol>
            ${(ex.steps || []).map((s) => `<li>${esc(s)}</li>`).join('\n            ')}
          </ol>
          ${ex.tip ? `<p class="guide-tip"><strong>Tip:</strong> ${esc(ex.tip)}</p>` : ''}
        </div>`).join('');
  return `
      <article class="guide-chapter" id="${esc(chapter.id)}">
        <h3><span class="guide-chapter-num">Lesson ${n}</span> ${esc(chapter.title)}</h3>
        <p class="guide-intro">${esc(l.intro)}</p>${concepts}${examples}
        <p class="guide-summary"><strong>Key takeaway:</strong> ${esc(l.summary)}</p>
      </article>`;
}

function renderQuestion(q, n, explanations) {
  const letters = ['A', 'B', 'C', 'D'];
  return `
      <div class="guide-question">
        <p class="guide-q-num">Question ${n}</p>
        <div class="guide-q-text">
          ${renderText(q.text)}
        </div>
        <ol class="guide-options" type="A">
          ${q.options.map((o) => `<li>${esc(o)}</li>`).join('\n          ')}
        </ol>
        <details class="guide-answer">
          <summary>Show answer</summary>
          <p><strong>Answer: ${letters[q.correct]}. ${esc(q.options[q.correct])}</strong></p>
          <p>${esc(explanations[q.id] || '')}</p>
        </details>
      </div>`;
}

function page(code, data) {
  const copy = SECTION_COPY[code];
  const info = data.sections[code];
  const course = data.courses[code];
  const minutes = Math.round(info.timeLimit / 60);
  const secsPer = Math.round(info.timeLimit / info.questionsPerTest);
  const file = `asvab-${copy.slug}.html`;
  const url = `https://www.missionasvab.org/${file}`;
  const title = `ASVAB ${info.name} Practice Test and Study Guide | Mission ASVAB`;
  const description = `Free ASVAB ${info.name} (${code}) guide: what the section tests, ${info.questionsPerTest} questions in ${minutes} minutes on the CAT-ASVAB, full lessons with worked examples, and 10 practice questions with answers.`;
  const samples = pickSamples(data.bank[code]);
  const others = ORDER.filter((c) => c !== code)
    .map((c) => `<a href="asvab-${SECTION_COPY[c].slug}.html">${esc(data.sections[c].name)}</a>`).join(' · ');
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished: '2026-09-26',
    dateModified: '2026-09-26',
    author: { '@type': 'Organization', name: 'Mission ASVAB', url: 'https://www.missionasvab.org/' },
    publisher: { '@type': 'Organization', name: 'Mission ASVAB', url: 'https://www.missionasvab.org/' },
  }, null, 2).replace(/\n/g, '\n  ');

  return `<!DOCTYPE html>
<!-- GENERATED by scripts/build-section-guides.js - edit the generator or the source data, not this file. -->
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${url}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="Mission ASVAB">
  <meta property="og:image" content="https://www.missionasvab.org/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Mission ASVAB - free ASVAB practice tests and study tools">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="https://www.missionasvab.org/og-image.png">
  <link rel="icon" href="icons/icon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Chakra+Petch:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/shared.css">
  <link rel="stylesheet" href="css/section-guide.css">
  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#0a1628">
  <script type="application/ld+json">
  ${jsonLd}
  </script>
</head>
<body>
  <!-- site-nav -->
  <!-- /site-nav -->

  <header class="hero">
    <p class="hero-eyebrow">SECTION GUIDE - ${esc(code)}</p>
    <h1>ASVAB ${esc(info.name)}</h1>
    <p>What it tests, how it is scored, full lessons, and 10 practice questions with answers</p>
  </header>

  <main class="content">
    <section class="section">
      <h2>What ${esc(code)} Tests</h2>
      <p>${esc(copy.what)}</p>
      <table class="score-table guide-facts">
        <tbody>
          <tr><th scope="row">Scored questions (CAT-ASVAB)</th><td>${info.questionsPerTest}</td></tr>
          <tr><th scope="row">Time limit</th><td>${minutes} minutes (about ${secsPer} seconds per question)</td></tr>
          <tr><th scope="row">Part of the AFQT?</th><td>${info.inAFQT ? 'Yes' : 'No'}</td></tr>
        </tbody>
      </table>
      <p>${esc(copy.usedFor)} See <a href="asvab-scores.html">ASVAB scores explained</a> for how section scores become your AFQT and line scores.</p>
    </section>

    <section class="section">
      <h2>How to Score Higher</h2>
      <ul>
        ${copy.tips.map((t) => `<li>${esc(t)}</li>`).join('\n        ')}
      </ul>
    </section>

    <section class="section">
      <h2>${esc(info.name)} Lessons</h2>
      <p>${esc(String(course.description || '').replace(/([^.!?])$/, '$1.'))} Each lesson below is also in the interactive <a href="study-guide.html">study guide</a>, where you can take a quiz to check yourself.</p>
      <nav class="guide-toc" aria-label="Lessons">
        <ol>
          ${course.chapters.map((ch) => `<li><a href="#${esc(ch.id)}">${esc(ch.title)}</a></li>`).join('\n          ')}
        </ol>
      </nav>${course.chapters.map((ch, i) => renderLesson(ch, i + 1)).join('')}
    </section>

    <section class="section">
      <h2>${esc(code)} Practice Questions</h2>
      <p>Try each question before opening the answer. On the real CAT-ASVAB the questions adapt to you, so a timed, adaptive <a href="select-test.html">practice test</a> is the best way to check your level.</p>${samples.map((q, i) => renderQuestion(q, i + 1, data.explanations)).join('')}
    </section>

    <div class="cta-section">
      <h3>Test Yourself Under Real Conditions</h3>
      <p>Take a timed, adaptive ${esc(info.name)} section, the 20-question AFQT Predictor, or a full AFQT practice test. Free, no account needed.</p>
      <a href="select-test.html" class="cta-btn">Take a Practice Test</a>
    </div>

    <p class="guide-others">Other section guides: ${others}</p>
  </main>

  <!-- site-footer -->
  <!-- /site-footer -->
  <script src="js/year.js"></script>
  <script src="js/mobile-menu.js"></script>
  <script src="js/site-nav.js"></script>
<script defer src="/_vercel/insights/script.js"></script>
  <script src="js/sw-register.js"></script>
</body>
</html>
`;
}

function build() {
  const data = loadData();
  return ORDER.map((code) => {
    const file = `asvab-${SECTION_COPY[code].slug}.html`;
    return { file, html: syncPage(file, page(code, data)) };
  });
}

module.exports = { build, SECTION_COPY, ORDER, pickSamples };

if (require.main === module) {
  const check = process.argv.includes('--check');
  let stale = 0;
  for (const { file, html } of build()) {
    const target = path.join(root, file);
    const current = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : null;
    if (current === html) continue;
    if (check) { console.error(`stale: ${file}`); stale++; } else { fs.writeFileSync(target, html); console.log(`wrote ${file}`); }
  }
  if (check && stale) process.exit(1);
}
