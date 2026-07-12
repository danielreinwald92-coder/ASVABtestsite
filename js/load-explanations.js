// Lazy loader for js/explanations.js. Injects the script once (same-origin, so
// allowed by the strict CSP script-src 'self') and caches the promise. Resolves
// to the QUIZ_EXPLANATIONS map, or {} if the script is missing/fails — callers
// degrade gracefully (no explanation block rendered).
(function (root) {
  let _promise = null;

  function loadExplanations() {
    if (root.QUIZ_EXPLANATIONS) return Promise.resolve(root.QUIZ_EXPLANATIONS);
    if (_promise) return _promise;

    // On failure, clear the cached promise so a later call retries instead of
    // pinning an empty map for the whole session (flaky mobile networks).
    // `failed` handles onerror firing synchronously, before `_promise` is set.
    let failed = false;
    const p = new Promise((resolve) => {
      try {
        const s = root.document.createElement('script');
        s.src = 'js/explanations.js';
        s.onload = () => resolve(root.QUIZ_EXPLANATIONS || {});
        s.onerror = () => { failed = true; _promise = null; resolve({}); };
        root.document.head.appendChild(s);
      } catch (_) {
        failed = true;
        resolve({});
      }
    });
    _promise = failed ? null : p;
    return p;
  }

  root.loadExplanations = loadExplanations;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadExplanations };
  }
})(typeof window !== 'undefined' ? window : this);
