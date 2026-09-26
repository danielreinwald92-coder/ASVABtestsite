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

// scoring.js's dep() resolver checks `root[name]` (this vm context's window)
// before falling back to CommonJS require(), so its IRT/params/penalty
// dependencies must be loaded as window globals before js/scoring.js runs.
loadScript('js/irt.js', context);
loadScript('js/irt-params.js', context);
loadScript('js/penalty-table.js', context);
loadScript('js/test-config.js', context);
loadScript('js/scoring.js', context);
loadScript('js/section-config.js', context);
loadScript('js/quiz-data.js', context);
loadScript('js/explanations.js', context);
loadScript('js/courses.js', context, 'this.courses = courses;');
loadScript('js/courses-tech.js', context, 'this.coursesTech = coursesTech;');
loadScript('js/mission-recommendations.js', context);

const config = context.window.MissionASVABConfig;
const scoring = context.window.MissionASVABScoring;
const quizManager = context.window.QuizManager;
const asvabData = context.window.asvabData;
const courses = context.courses;
const coursesTech = context.coursesTech;
const missions = context.window.MissionASVABMissions;
const irtParams = context.window.MissionASVABIRTParams;
const penaltyTable = context.window.MissionASVABPenalty;

assert(config, 'MissionASVABConfig failed to load');
assert(scoring, 'MissionASVABScoring failed to load');
assert(quizManager, 'QuizManager failed to load');
assert(asvabData, 'asvabData failed to load');
assert(courses, 'courses failed to load');
assert(coursesTech, 'coursesTech failed to load');
assert(missions, 'MissionASVABMissions failed to load');
assert(irtParams, 'MissionASVABIRTParams failed to load');
assert(penaltyTable, 'MissionASVABPenalty failed to load');
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
assert(
  JSON.stringify(config.getSectionsForType('diagnostic')) === JSON.stringify(['AR', 'WK', 'PC', 'MK']),
  'Diagnostic section contract changed'
);
const diagnostic = config.getTestConfig('diagnostic');
const diagnosticDetails = config.getTestDetails('diagnostic', quizManager);
assert(diagnosticDetails.totalQuestions === 18, 'Diagnostic must remain 18 questions');
assert(diagnosticDetails.totalTimeSeconds === 20 * 60, 'Diagnostic must remain 20 minutes');
for (const code of diagnostic.sections) {
  const settings = config.getSectionSettings('diagnostic', code, quizManager);
  assert(Array.isArray(settings.difficultyPlan), `${code} diagnostic difficulty plan missing`);
  assert(settings.difficultyPlan.length === settings.questionsPerTest,
    `${code} diagnostic difficulty plan must match its question count`);
}

// Pool-size ratchet (SP4): pools may only grow. Raise a section's floor in the
// same branch that ships its content expansion.
const POOL_MINIMUMS = { WK: 160, PC: 105, AR: 134, MK: 152, GS: 105, EI: 105, AS: 100, MC: 105 };

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
    // Distinct options: shuffleQuestionOptions relocates the key via indexOf on
    // the option TEXT, so a duplicated distractor would grade the wrong index.
    assert(new Set(question.options).size === 4, `${question.id} has duplicate option text`);
    assert(Number.isInteger(question.correct) && question.correct >= 0 && question.correct < 4, `${question.id} has invalid correct index`);
    // IRT v2 (Task 9): every question needs a difficulty band so
    // js/irt-params.js can look up item parameters (DIFF_OFFSET is keyed 1-5).
    assert(Number.isInteger(question.difficulty) && question.difficulty >= 1 && question.difficulty <= 5,
      `${question.id} difficulty must be an integer 1-5`);
  }
}

// --- IRT v2 parameter/penalty coverage (Task 9) -----------------------------
// scoring.js's sectionAbility()/getScoreDetails() index js/irt-params.js and
// js/penalty-table.js by section code (and, for the penalty table, by the
// exact 1..questionsPerTest unanswered count) with no fallback — a missing
// entry either throws (penalty) or silently produces NaN (params), so both
// are build-gated here rather than only discovered at score time.
const ALL_IRT_SECTIONS = ['GS', 'AR', 'WK', 'PC', 'MK', 'EI', 'AS', 'MC'];

for (const code of ALL_IRT_SECTIONS) {
  const s = irtParams.SECTION_IRT[code];
  assert(s, `SECTION_IRT missing ${code}`);
  assert(Number.isFinite(s.a) && Number.isFinite(s.bMean) && Number.isFinite(s.bSD) && Number.isFinite(s.c),
    `SECTION_IRT.${code} has a non-finite parameter`);

  // AS is scored via the degenerate asStandardScore() form (Segall eq. 2.4)
  // instead of an SS_TRANSFORM entry — see js/scoring.js sectionSS().
  if (code === 'AS') {
    assert(typeof irtParams.asStandardScore === 'function', 'asStandardScore missing for AS');
  } else {
    const t = irtParams.SS_TRANSFORM[code];
    assert(t, `SS_TRANSFORM missing ${code}`);
    assert(Number.isFinite(t.A) && Number.isFinite(t.B), `SS_TRANSFORM.${code} has non-finite A/B`);
  }
}
assert(typeof irtParams.veStandardScore === 'function', 'veStandardScore missing (VE = WK/PC composite)');

// afqtsToPercentile must stay a valid, monotone-nondecreasing percentile curve
// across the full plausible AFQTS domain (0..400) — a dip or an out-of-range
// value would silently mis-rank test-takers.
let prevPercentile = -Infinity;
for (let afqts = 0; afqts <= 400; afqts++) {
  const pct = irtParams.afqtsToPercentile(afqts);
  assert(Number.isInteger(pct) && pct >= 1 && pct <= 99,
    `afqtsToPercentile(${afqts}) must be an integer 1-99, got ${pct}`);
  assert(pct >= prevPercentile,
    `afqtsToPercentile must be non-decreasing (dropped to ${pct} at afqts=${afqts}, was ${prevPercentile})`);
  prevPercentile = pct;
}

// Every CAT-scored section needs a penalty[code][unanswered] entry for every
// unanswered count from 1 through its full questionsPerTest (the diagnostic's
// smaller per-section counts never reach the penalty table — see
// quiz-engine.js submitQuiz's testKind !== 'diagnostic' gate).
for (const code of ALL_IRT_SECTIONS) {
  const n = asvabData.sections[code].questionsPerTest;
  assert(penaltyTable[code], `penalty table missing section ${code}`);
  for (let unanswered = 1; unanswered <= n; unanswered++) {
    const entry = penaltyTable[code][unanswered];
    assert(entry, `penalty table missing ${code} unanswered=${unanswered}`);
    assert(Number.isFinite(entry.A) && Number.isFinite(entry.B),
      `penalty table ${code} unanswered=${unanswered} has non-finite A/B`);
  }
}

// Short scored presets (APT-style predictor) administer fewer items per
// section; scoring.js reads their penalty from penaltyTable.byLength[n][code].
for (const cfg of Object.values(config.TEST_CONFIGS)) {
  if (cfg.type === 'diagnostic' || !cfg.sectionOverrides) continue;
  for (const [code, o] of Object.entries(cfg.sectionOverrides)) {
    const n = o.questionsPerTest;
    if (!n || n === asvabData.sections[code].questionsPerTest) continue;
    const t = penaltyTable.byLength && penaltyTable.byLength[n] && penaltyTable.byLength[n][code];
    assert(t, `penalty table missing byLength ${n} ${code} (${cfg.type}); re-run scripts/generate-penalty-table.js`);
    for (let unanswered = 1; unanswered <= n; unanswered++) {
      assert(t[unanswered] && Number.isFinite(t[unanswered].A) && Number.isFinite(t[unanswered].B),
        `penalty table byLength ${n} ${code} unanswered=${unanswered} missing or non-finite`);
    }
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

// The lightweight recommendation catalog must exactly mirror real study
// chapters so a mission can never deep-link to missing or renamed content.
for (const [courseCode, course] of Object.entries(courses)) {
  const expected = course.chapters.map((chapter) => [chapter.id, chapter.title]);
  const catalog = missions.CONTENT_CATALOG[courseCode];
  assert(Array.isArray(catalog), `${courseCode} missing from mission content catalog`);
  assert(JSON.stringify(catalog) === JSON.stringify(expected),
    `${courseCode} mission catalog is out of sync with study chapters`);
}
assert(Object.keys(missions.CONTENT_CATALOG).length === Object.keys(courses).length,
  'Mission content catalog has an unknown section');

const perfectSectionResults = {};
for (const code of config.getSectionsForType('full')) {
  const section = asvabData.sections[code];
  const n = section.questionsPerTest;
  perfectSectionResults[code] = {
    correct: n,
    total: n,
    // IRT v2 scoring derives ability from per-question records, not just the
    // correct/total tally — a perfect score needs a perfect (all-correct)
    // question record set for MAP theta to land at the top of the scale.
    questions: Array.from({ length: n }, (_, i) => ({
      id: `${code}_${i}`, difficulty: (i % 5) + 1, isCorrect: true, answered: true
    }))
  };
}

assert(scoring.calculateAFQTEstimate(perfectSectionResults) === 99, 'Perfect AFQT should clamp to 99');

const perfectLineScores = scoring.calculateLineScores(perfectSectionResults);
assert(Object.keys(perfectLineScores).length === 10, 'Full test should produce 10 line scores');
for (const [code, entry] of Object.entries(perfectLineScores)) {
  assert(Number.isInteger(entry.score) && Number.isFinite(entry.score),
    `Line score ${code} must be a finite integer, got ${entry.score}`);
}

// ---- Military job requirements contract (js/job-requirements.js) ----
// Every branch and job carries a citable source; every rule uses only score
// codes that exist for that branch; copy follows the site rules (no em/en
// dashes, HTML-safe). Featured jobs get their own page, so they need copy.
const jobs = require(path.join(rootDir, 'js/job-requirements.js'));
const JOB_TERM_SECTIONS = new Set(['GS', 'AR', 'WK', 'PC', 'MK', 'EI', 'AS', 'MC', 'VE', 'AO', 'CS', 'CT']);
const JOB_TESTS = new Set(['AO', 'CS', 'CT', 'TAPAS', 'PSM', 'DLAB', 'EDPT', 'ICTL', 'NAPT', 'TWO_FACTOR']);
const COMPOSITE_CODES = {
  army: ['GT', 'CL', 'CO', 'EL', 'FA', 'GM', 'MM', 'OF', 'SC', 'ST'],
  'air-force': ['M', 'A', 'G', 'E'],
  'marine-corps': ['GT', 'MM', 'EL', 'CL'],
  navy: [],
  'coast-guard': []
};
const JOB_MINIMUMS = { army: 100, 'air-force': 80, navy: 60, 'marine-corps': 100, 'coast-guard': 15 };
function checkSource(src, where) {
  assert(src && typeof src.title === 'string' && src.title.length > 10, `${where}: source title`);
  assert(src && /^https:\/\//.test(src.url || ''), `${where}: source url must be https`);
  assert(src && typeof src.edition === 'string' && src.edition.length > 3, `${where}: source edition`);
  assert(src && /^\d{4}-\d{2}-\d{2}$/.test(src.asOf || ''), `${where}: source asOf must be YYYY-MM-DD`);
}
function checkText(value, where) {
  assert(!/[–—]/.test(value), `${where}: no em or en dashes in site copy`);
  assert(!/[<>&]/.test(value), `${where}: must be HTML-safe (no < > &)`);
}
assert(JSON.stringify(jobs.ORDER) === JSON.stringify(['army', 'air-force', 'navy', 'marine-corps', 'coast-guard']),
  'job-requirements ORDER must list the five branches');
for (const key of jobs.ORDER) {
  const b = jobs.BRANCHES[key];
  checkSource(b.source, key);
  assert(Number.isInteger(b.afqtMin) && b.afqtMin >= 10 && b.afqtMin <= 50, `${key}: afqtMin`);
  assert(b.jobs.length >= JOB_MINIMUMS[key], `${key}: job list shrank below ${JOB_MINIMUMS[key]} (${b.jobs.length})`);
  const featured = b.jobs.filter((j) => j.featured).length;
  assert(featured >= 15 && featured <= 25, `${key}: 15-25 featured jobs (has ${featured})`);
  const seen = new Set();
  for (const j of b.jobs) {
    const where = `${key} ${j.code}`;
    assert(!seen.has(j.code), `${where}: duplicate job code`);
    seen.add(j.code);
    for (const f of ['code', 'title', 'category']) {
      assert(typeof j[f] === 'string' && j[f].length > 0, `${where}: ${f}`);
      checkText(j[f], `${where} ${f}`);
    }
    for (const n of j.notes || []) checkText(n, `${where} note`);
    if (j.sourceOverride) checkSource(j.sourceOverride, where);
    if (j.featured) {
      assert(typeof j.about === 'string' && j.about.length >= 200 && j.about.length <= 600, `${where}: featured job needs 200-600 char about`);
      checkText(j.about, `${where} about`);
    }
    assert(Array.isArray(j.rule), `${where}: rule must be an array of paths`);
    for (const pathTerms of j.rule) {
      assert(Array.isArray(pathTerms) && pathTerms.length > 0, `${where}: each path needs terms`);
      for (const t of pathTerms) {
        if (t.c !== undefined) {
          assert(COMPOSITE_CODES[key].includes(t.c), `${where}: unknown ${key} composite ${t.c}`);
          assert(Number.isInteger(t.min) && t.min > 0, `${where}: composite min`);
        } else if (t.sum !== undefined) {
          const ks = Object.keys(t.sum);
          assert(ks.length > 0 && ks.every((k) => JOB_TERM_SECTIONS.has(k) && Number.isInteger(t.sum[k]) && t.sum[k] > 0),
            `${where}: sum uses unknown sections or weights`);
          assert(Number.isInteger(t.min) && t.min > 0, `${where}: sum min`);
        } else if (t.afqt !== undefined) {
          assert(Number.isInteger(t.afqt) && t.afqt > 0 && t.afqt < 100, `${where}: afqt floor`);
        } else if (t.test !== undefined) {
          assert(JOB_TESTS.has(t.test), `${where}: unknown test ${t.test}`);
        } else {
          assert(false, `${where}: unrecognised term ${JSON.stringify(t)}`);
        }
      }
    }
    if (!j.rule.length) assert((j.notes || []).length > 0, `${where}: a job with no score rule must explain why in notes`);
  }
}
for (const p of jobs.GT_PROGRAMS) {
  checkSource(p.source, `GT program ${p.name}`);
  checkText(p.text, `GT program ${p.name}`);
}

console.log('Validation passed');
