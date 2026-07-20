// Personalized study recommendation engine for Mission ASVAB.
// Pure and DOM/storage-free: given one completed result plus completed chapter
// ids, it returns a deterministic, content-validated "Today's Mission".
(function (root) {
  'use strict';

  const VERSION = 1;
  const ENABLED = true;
  const SECTION_ORDER = ['AR', 'MK', 'WK', 'PC', 'GS', 'EI', 'AS', 'MC'];
  const SECTION_NAMES = {
    AR: 'Arithmetic Reasoning', MK: 'Mathematics Knowledge', WK: 'Word Knowledge',
    PC: 'Paragraph Comprehension', GS: 'General Science', EI: 'Electronics Information',
    AS: 'Auto & Shop Information', MC: 'Mechanical Comprehension'
  };

  // Lightweight allowlist mirrored from courses.js + courses-tech.js. Results
  // must not load the ~large course bundles merely to choose a valid target.
  const CONTENT_CATALOG = {
    AR: [
      ['AR-1', 'Ratios & Proportions'], ['AR-2', 'Percentages'],
      ['AR-3', 'Distance, Rate & Time'], ['AR-4', 'Work Problems'],
      ['AR-5', 'Statistics Basics']
    ],
    MK: [
      ['MK-1', 'Solving Equations'], ['MK-2', 'Exponents & Radicals'],
      ['MK-3', 'FOIL & Factoring'], ['MK-4', 'Pythagorean Theorem'],
      ['MK-5', 'Area & Perimeter'], ['MK-6', 'Inequalities']
    ],
    WK: [
      ['WK-1', 'Prefixes'], ['WK-2', 'Roots'], ['WK-3', 'Suffixes'],
      ['WK-4', 'Test Strategy & High-Frequency Words']
    ],
    PC: [
      ['PC-1', 'Finding the Main Idea'], ['PC-2', 'Finding Details'],
      ['PC-3', 'Making Inferences'], ['PC-4', 'Vocabulary in Context']
    ],
    GS: [
      ['GS-1', 'Life Science: The Human Body'],
      ['GS-2', 'Life Science: Cells, Genetics, and Ecology'],
      ['GS-3', 'Earth Science'], ['GS-4', 'Space Science'],
      ['GS-5', 'Physical Science: Motion, Energy, and Waves'],
      ['GS-6', 'Chemistry Basics']
    ],
    EI: [
      ['EI-1', 'Electricity Fundamentals'], ['EI-2', 'Series and Parallel Circuits'],
      ['EI-3', 'Electronic Components'], ['EI-4', 'Reading Schematics and Wiring'],
      ['EI-5', 'AC, DC, and Electrical Power'],
      ['EI-6', 'Magnetism, Motors, and Electrical Safety']
    ],
    AS: [
      ['AS-1', 'Engine Basics'], ['AS-2', 'Engine Support Systems'],
      ['AS-3', 'Electrical and Starting Systems'],
      ['AS-4', 'Brakes, Suspension, and Drivetrain'],
      ['AS-5', 'Hand Tools and Power Tools'],
      ['AS-6', 'Fasteners, Materials, and Shop Processes']
    ],
    MC: [
      ['MC-1', 'Forces and Motion'], ['MC-2', 'Levers and Simple Machines'],
      ['MC-3', 'Pulleys and Mechanical Advantage'],
      ['MC-4', 'Gears, Wheels, and Torque'],
      ['MC-5', 'Fluids and Hydraulics'],
      ['MC-6', 'Springs, Structures, and Materials']
    ]
  };

  function hashString(value) {
    let h = 2166136261;
    const str = String(value || '');
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(36);
  }

  function resultClientId(results) {
    if (results && results.clientResultId) return String(results.clientResultId);
    const parts = [
      results && results.completedAt,
      results && results.testType,
      results && results.totalQuestions,
      results && results.correct
    ];
    return 'legacy-' + hashString(parts.join('|'));
  }

  function missionClientId(results) {
    return 'mission-v' + VERSION + '-' + resultClientId(results);
  }

  function answeredCount(section) {
    if (!section) return 0;
    if (Array.isArray(section.questions)) {
      return section.questions.filter((q) => q && q.userAnswer !== undefined && q.userAnswer !== null).length;
    }
    return Number(section.total) || 0;
  }

  function buildPriorities(sectionResults, limit) {
    const rows = [];
    for (const code of SECTION_ORDER) {
      const section = sectionResults && sectionResults[code];
      if (!section || !Number(section.total)) continue;
      const total = Number(section.total);
      const correct = Math.max(0, Math.min(total, Number(section.correct) || 0));
      const answered = Math.max(0, Math.min(total, answeredCount(section)));
      const misses = total - correct;
      const accuracy = Math.round((correct / total) * 100);
      const answerRate = answered / total;
      const limited = answered < Math.min(4, total) || answerRate < 0.6;
      let level = 'maintenance';
      let reason;

      if (limited) {
        level = 'limited';
        reason = `You answered ${answered} of ${total}; more practice is needed before calling this a confirmed weakness.`;
      } else if (misses >= 2 && accuracy < 70) {
        level = 'focus';
        reason = `${correct} of ${total} correct makes this the clearest area to strengthen.`;
      } else if (misses >= 2) {
        level = 'review';
        reason = `${correct} of ${total} correct; a short review can turn those misses into reliable points.`;
      } else if (misses === 1) {
        level = 'watch';
        reason = `${correct} of ${total} correct. One miss is not a confirmed weakness, but it is worth a quick review.`;
      } else {
        reason = `${correct} of ${total} correct. Keep this strength fresh with a short maintenance session.`;
      }

      rows.push({
        code, name: SECTION_NAMES[code] || code, correct, total, answered,
        misses, accuracy, limited, level, reason,
        order: SECTION_ORDER.indexOf(code)
      });
    }

    rows.sort((a, b) => {
      if (a.limited !== b.limited) return a.limited ? 1 : -1;
      if (a.accuracy !== b.accuracy) return a.accuracy - b.accuracy;
      if (a.misses !== b.misses) return b.misses - a.misses;
      if (a.answered !== b.answered) return b.answered - a.answered;
      return a.order - b.order;
    });
    return rows.slice(0, Math.max(1, Number(limit) || 3)).map((row) => {
      const copy = { ...row };
      delete copy.order;
      return copy;
    });
  }

  function chooseChapter(code, completedChapterIds, seed) {
    const chapters = CONTENT_CATALOG[code] || [];
    if (!chapters.length) return null;
    const completed = completedChapterIds && typeof completedChapterIds === 'object'
      ? completedChapterIds : {};
    const next = chapters.find((chapter) => !completed[chapter[0]]);
    const chosen = next || chapters[parseInt(hashString(seed), 36) % chapters.length];
    return { id: chosen[0], title: chosen[1] };
  }

  function buildTarget(sectionCode, chapter, missionId) {
    if (!sectionCode || !chapter) return null;
    return {
      kind: 'lesson_quiz',
      section: sectionCode,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      url: 'study-guide.html?section=' + encodeURIComponent(sectionCode) +
        '&chapter=' + encodeURIComponent(chapter.id) +
        '&mission=' + encodeURIComponent(missionId)
    };
  }

  function validateTarget(target) {
    if (!target || target.kind !== 'lesson_quiz') return false;
    const chapters = CONTENT_CATALOG[target.section] || [];
    return chapters.some((chapter) => chapter[0] === target.chapterId);
  }

  function targetUrl(target, missionId) {
    if (!validateTarget(target)) return null;
    const chapter = { id: target.chapterId, title: target.chapterTitle || '' };
    return buildTarget(target.section, chapter, missionId).url;
  }

  function buildMission(results, options) {
    if (!ENABLED || !results || typeof results !== 'object') return null;
    const priorities = buildPriorities(results.sectionResults, 3);
    if (!priorities.length) return null;

    const opts = options || {};
    const id = missionClientId(results);
    const primary = priorities[0];
    const chapter = chooseChapter(primary.code, opts.completedChapters, id);
    const target = buildTarget(primary.code, chapter, id);
    if (!validateTarget(target)) return null;

    const totalAnswered = priorities.reduce((sum, p) => sum + p.answered, 0);
    const totalSeen = priorities.reduce((sum, p) => sum + p.total, 0);
    const limitedEvidence = totalAnswered < Math.min(8, totalSeen) || priorities.every((p) => p.limited);
    const strong = priorities.every((p) => p.accuracy >= 80 && !p.limited);
    const now = results.completedAt || new Date().toISOString();

    let title = `Build ${primary.name}`;
    let summary = `Review “${chapter.title},” then complete its short checkpoint.`;
    if (limitedEvidence) {
      title = `Establish your ${primary.name} baseline`;
      summary = `Start with “${chapter.title}.” More practice will make future recommendations more precise.`;
    } else if (strong) {
      title = `Keep ${primary.name} mission-ready`;
      summary = `Use “${chapter.title}” as a maintenance review and checkpoint.`;
    }

    return {
      clientId: id,
      version: VERSION,
      sourceResultClientId: resultClientId(results),
      sourceCompletedAt: results.completedAt || null,
      testType: results.testType || 'practice',
      status: 'not_started',
      primarySection: primary.code,
      title,
      summary,
      evidenceNote: limitedEvidence
        ? 'This is an early signal, not a confirmed weakness.'
        : `Selected from your ${primary.correct}-of-${primary.total} performance in ${primary.name}.`,
      estimatedMinutes: 18,
      activityType: 'lesson_quiz',
      priorities,
      target,
      createdAt: now,
      updatedAt: now,
      startedAt: null,
      completedAt: null,
      ownerUserId: results.ownerUserId || null
    };
  }

  const api = {
    VERSION, ENABLED, SECTION_NAMES, SECTION_ORDER, CONTENT_CATALOG,
    resultClientId, missionClientId, buildPriorities, chooseChapter,
    validateTarget, targetUrl, buildMission
  };
  root.MissionASVABMissions = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
