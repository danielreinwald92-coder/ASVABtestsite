// Lazy loader for js/explanations.js. Injects the script once (same-origin, so
// allowed by the strict CSP script-src 'self') and caches the promise. Resolves
// to the QUIZ_EXPLANATIONS map, or {} if the script is missing/fails — callers
// degrade gracefully (no explanation block rendered).
(function (root) {
  let _promise = null;

  function loadExplanations() {
    if (root.QUIZ_EXPLANATIONS) return Promise.resolve(root.QUIZ_EXPLANATIONS);
    if (_promise) return _promise;

    _promise = new Promise((resolve) => {
      try {
        const s = root.document.createElement('script');
        s.src = 'js/explanations.js';
        s.onload = () => resolve(root.QUIZ_EXPLANATIONS || {});
        s.onerror = () => resolve({});
        root.document.head.appendChild(s);
      } catch (_) {
        resolve({});
      }
    });
    return _promise;
  }

  root.loadExplanations = loadExplanations;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadExplanations };
  }
})(typeof window !== 'undefined' ? window : this);
