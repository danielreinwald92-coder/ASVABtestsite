// Weak-area aggregation for Mission ASVAB.
// Pure, DOM-free functions that turn a user's test_results rows into per-section
// accuracy and a ranked list of the weakest sections. These power the dashboard
// focus panel, the "Practice my weak areas" quiz, and the study plan.
//
// Data sources, in preference order:
//   1. row.question_results: compact [{id, section, correct}] captured on submit
//      (js/quiz-engine.js, task 4.1). Most granular — aggregates every question.
//   2. row.section_scores: {CODE: {correct, total}} — used as a fallback for
//      older rows where question_results is null/missing.
(function (root) {
  // Build { CODE: { correct, total, accuracy } } across ALL supplied rows.
  // accuracy is an integer percent (0-100), or null if total is 0.
  function aggregateSectionAccuracy(results) {
    const agg = {};
    const bucket = (code) => (agg[code] || (agg[code] = { correct: 0, total: 0, accuracy: null }));

    (Array.isArray(results) ? results : []).forEach((row) => {
      if (!row) return;
      const qr = row.question_results;

      if (Array.isArray(qr) && qr.length) {
        // Granular path: one entry per answered question.
        qr.forEach((q) => {
          if (!q || !q.section) return;
          const b = bucket(q.section);
          b.total += 1;
          if (q.correct) b.correct += 1;
        });
      } else if (row.section_scores && typeof row.section_scores === 'object') {
        // Fallback path: section-level correct/total (older rows, null question_results).
        for (const [code, s] of Object.entries(row.section_scores)) {
          if (!s || typeof s.total !== 'number' || s.total <= 0) continue;
          const b = bucket(code);
          b.correct += (typeof s.correct === 'number' ? s.correct : 0);
          b.total += s.total;
        }
      }
    });

    for (const b of Object.values(agg)) {
      b.accuracy = b.total > 0 ? Math.round((b.correct / b.total) * 100) : null;
    }
    return agg;
  }

  // Rank sections weakest-first and return the top `n`.
  // opts.sections (optional) limits which section codes are considered.
  // Tiebreak: when accuracy ties, more attempts ranks as the weaker area
  // (more evidence the weakness is real).
  function weakestSections(results, n = 2, opts = {}) {
    const agg = aggregateSectionAccuracy(results);
    const only = opts && Array.isArray(opts.sections) ? opts.sections : null;

    const entries = Object.entries(agg).filter(([code, b]) => {
      if (b.total <= 0 || b.accuracy === null) return false;
      if (only && !only.includes(code)) return false;
      return true;
    });

    entries.sort((a, b) => {
      if (a[1].accuracy !== b[1].accuracy) return a[1].accuracy - b[1].accuracy;
      return b[1].total - a[1].total;
    });

    const limit = Number.isFinite(n) && n > 0 ? n : entries.length;
    return entries.slice(0, limit).map(([code, b]) => ({
      code,
      accuracy: b.accuracy,
      correct: b.correct,
      total: b.total
    }));
  }

  const api = { aggregateSectionAccuracy, weakestSections };
  root.MissionASVABWeakAreas = api;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
