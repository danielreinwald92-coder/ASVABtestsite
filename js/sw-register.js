// Registers the app-shell service worker. Guarded by feature detection and
// deferred to window load so it never blocks first paint. Registration failure
// is non-fatal — the site works fine without offline support.
(function () {
  'use strict';
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;

  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/service-worker.js').catch(function (err) {
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('Service worker registration failed:', err);
      }
    });
  });
})();
