// Cross-retake repeat avoidance (SP2). Tracks recently-shown bank question ids
// per section in localStorage so new tests can skip them. Capped so the exclusion
// set can never make a section unfillable; fully fail-safe (any storage error
// degrades to a no-op → repeats allowed, never a crash). On-device only.
(function (root) {
  const KEY = 'recentSeen:v1';

  function readAll() {
    try {
      const raw = root.localStorage.getItem(KEY);
      const obj = raw ? JSON.parse(raw) : {};
      return obj && typeof obj === 'object' ? obj : {};
    } catch (_) { return {}; }
  }
  function writeAll(obj) {
    try { root.localStorage.setItem(KEY, JSON.stringify(obj)); } catch (_) {}
  }
  function poolSize(code) {
    try { return (root.asvabData.questions[code] || []).length; } catch (_) { return 0; }
  }
  function perTest(code) {
    try { return (root.asvabData.sections[code].questionsPerTest) || 0; } catch (_) { return 0; }
  }
  // Leave at least questionsPerTest unseen so a test can always be built.
  function cap(code) {
    const c = poolSize(code) - perTest(code);
    return c > 0 ? c : 0;
  }

  function getRecent(code) {
    const all = readAll();
    return Array.isArray(all[code]) ? all[code].slice() : [];
  }

  function record(code, ids) {
    if (!code || !Array.isArray(ids) || ids.length === 0) return;
    const all = readAll();
    const merged = (Array.isArray(all[code]) ? all[code] : []).concat(ids);
    // Dedupe keeping most-recent occurrence, preserving order (most-recent last).
    const seen = new Set();
    const deduped = [];
    for (let i = merged.length - 1; i >= 0; i--) {
      if (!seen.has(merged[i])) { seen.add(merged[i]); deduped.unshift(merged[i]); }
    }
    const c = cap(code);
    all[code] = c > 0 ? deduped.slice(Math.max(0, deduped.length - c)) : [];
    writeAll(all);
  }

  const api = { getRecent, record };
  root.MissionASVABRecentSeen = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : this);
