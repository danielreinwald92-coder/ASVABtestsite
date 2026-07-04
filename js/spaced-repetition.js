// Spaced-repetition scheduler (SM-2-lite) + localStorage store for the study
// guide flashcards. On-device only (no account sync). Pure scheduler is
// unit-tested (tests/unit/spaced-repetition.test.js); SRStore is a thin,
// private-mode-safe localStorage wrapper.
(function (root) {
  'use strict';

  var MIN_EASE = 1.3;
  var START_EASE = 2.3;

  function epochDay(str) {
    var p = str.split('-');
    return Math.floor(Date.UTC(Number(p[0]), Number(p[1]) - 1, Number(p[2])) / 86400000);
  }
  function fromEpochDay(n) {
    var dt = new Date(n * 86400000);
    var y = dt.getUTCFullYear();
    var m = String(dt.getUTCMonth() + 1).padStart(2, '0');
    var d = String(dt.getUTCDate()).padStart(2, '0');
    return y + '-' + m + '-' + d;
  }
  function addDays(str, n) { return fromEpochDay(epochDay(str) + n); }

  // state = { reps, intervalDays, ease, due:'YYYY-MM-DD' }. null = brand-new.
  function review(state, grade, todayStr) {
    var reps = state ? state.reps : 0;
    var ease = state ? state.ease : START_EASE;
    var prev = state ? state.intervalDays : 0;
    var interval;

    if (grade === 'again') {
      reps = 0;
      ease = Math.max(MIN_EASE, ease - 0.2);
      interval = 1;
    } else if (grade === 'easy') {
      reps = reps + 1;
      ease = ease + 0.15;
      interval = Math.max(2, Math.round((prev || 1) * ease * 1.3));
    } else { // 'good'
      reps = reps + 1;
      interval = reps <= 1 ? 1 : Math.max(1, Math.round((prev || 1) * ease));
    }

    return { reps: reps, intervalDays: interval, ease: ease, due: addDays(todayStr, interval) };
  }

  function isDue(state, todayStr) {
    if (!state || !state.due) return true;
    return state.due <= todayStr; // lexicographic compare is valid for YYYY-MM-DD
  }

  function dueCount(states, todayStr) {
    var n = 0;
    var keys = Object.keys(states || {});
    for (var i = 0; i < keys.length; i++) {
      if (isDue(states[keys[i]], todayStr)) n++;
    }
    return n;
  }

  // Persistent per-deck store: { cardId: state }. Key namespaced by deck.
  function SRStore(deck) {
    this.key = 'missionasvab.sp3.sr.' + deck;
  }
  SRStore.prototype.load = function () {
    try {
      var raw = window.localStorage.getItem(this.key);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  };
  SRStore.prototype.save = function (states) {
    try { window.localStorage.setItem(this.key, JSON.stringify(states)); } catch (e) { /* ignore */ }
  };

  root.MissionASVABSR = {
    review: review, isDue: isDue, dueCount: dueCount, addDays: addDays, SRStore: SRStore
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.MissionASVABSR;
})(typeof window !== 'undefined' ? window : this);
