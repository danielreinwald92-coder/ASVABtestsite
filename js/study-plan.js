// Paced study-plan logic. Given days remaining until the user's test date and
// their weakest sections, returns a short phase-appropriate plan. Pure +
// unit-tested (tests/unit/study-plan.test.js). Consumed by the dashboard.
(function (root) {
  'use strict';

  var NAMES = {
    GS: 'General Science', AR: 'Arithmetic Reasoning', WK: 'Word Knowledge',
    PC: 'Paragraph Comprehension', MK: 'Mathematics Knowledge',
    EI: 'Electronics Information', AS: 'Auto & Shop Information',
    MC: 'Mechanical Comprehension'
  };

  function names(codes) {
    return (codes || []).map(function (c) { return NAMES[c] || c; });
  }

  function buildStudyPlan(opts) {
    var d = opts && opts.daysRemaining;
    var weak = names(opts && opts.weakSections).slice(0, 2);
    var weakPhrase = weak.length ? weak.join(' and ') : 'your weakest sections';

    if (d === null || d === undefined) {
      return {
        phase: 'none',
        headline: 'Set a test date to unlock a paced plan',
        items: [
          'Take a full practice test to find your baseline',
          'Add your test date in Account settings for a day-by-day plan'
        ]
      };
    }
    if (d > 21) {
      return {
        phase: 'foundation',
        headline: 'Build your foundation',
        items: [
          'Work broadly across all sections',
          'Read the study guides for the four AFQT sections: Arithmetic Reasoning, Math Knowledge, Word Knowledge, and Paragraph Comprehension',
          'Take a full practice test each week to track progress'
        ]
      };
    }
    if (d >= 7) {
      return {
        phase: 'focus',
        headline: 'Focus on your weak spots',
        items: [
          'Drill ' + weakPhrase + ' with section practice',
          'Review the answer explanation on every miss',
          'Take a full practice test mid-week'
        ]
      };
    }
    return {
      phase: 'sprint',
      headline: d < 0 ? 'Your test date has passed — update it in Account' : 'Final sprint',
      items: [
        'Take full timed practice tests to build stamina',
        'Do a light review of ' + weakPhrase,
        'Rest well the night before test day'
      ]
    };
  }

  root.MissionASVABStudyPlan = { buildStudyPlan: buildStudyPlan };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.MissionASVABStudyPlan;
})(typeof window !== 'undefined' ? window : this);
