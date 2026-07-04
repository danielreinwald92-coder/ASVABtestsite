// Derived study-streak logic. No storage — computed from the distinct local
// calendar days on which the user completed any test (timed or tutor).
// Consumed by the dashboard (js/page-dashboard.js). Pure + unit-tested
// (tests/unit/streak.test.js).
(function (root) {
  'use strict';

  // Convert a 'YYYY-MM-DD' local-day string to an integer day number so
  // consecutive calendar days differ by exactly 1 (DST-safe via UTC math).
  function toDayNumber(str) {
    var parts = str.split('-');
    var y = Number(parts[0]);
    var m = Number(parts[1]);
    var d = Number(parts[2]);
    return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
  }

  function computeStreak(dateStrings, todayStr) {
    var unique = Array.from(new Set(dateStrings));
    var days = unique.map(toDayNumber).sort(function (a, b) { return a - b; });
    if (days.length === 0) return { current: 0, longest: 0 };

    var longest = 1;
    var run = 1;
    for (var i = 1; i < days.length; i++) {
      run = days[i] === days[i - 1] + 1 ? run + 1 : 1;
      if (run > longest) longest = run;
    }

    var today = toDayNumber(todayStr);
    var last = days[days.length - 1];
    var current = 0;
    // The current streak is "alive" only if the most recent activity day is
    // today or yesterday (a day off today has not broken it yet).
    if (last === today || last === today - 1) {
      current = 1;
      for (var j = days.length - 1; j > 0; j--) {
        if (days[j] === days[j - 1] + 1) current++; else break;
      }
    }
    return { current: current, longest: longest };
  }

  root.MissionASVABStreak = { computeStreak: computeStreak };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.MissionASVABStreak;
})(typeof window !== 'undefined' ? window : this);
