// Registers the app-shell service worker. Guarded by feature detection and
// deferred to window load so it never blocks first paint. Registration failure
// is non-fatal — the site works fine without offline support.
//
// Only registered on the test/study app pages (where offline support matters),
// or when this browser already has the worker (to keep it updated). Installing
// precaches the whole app shell, so registering on every SEO/guide/job page
// made each one-page visitor download ~45 files they never use — each one a
// billed Vercel CDN request.
(function () {
  'use strict';
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;

  var APP_PAGES = ['select-test', 'test-intro', 'quiz', 'results', 'dashboard', 'study-guide', 'my-options'];

  function isAppPage(pathname) {
    var page = String(pathname || '').split('/').pop().replace(/\.html$/, '');
    return APP_PAGES.indexOf(page) !== -1;
  }

  if (!navigator.serviceWorker.controller && !isAppPage(window.location.pathname)) return;

  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/service-worker.js').catch(function (err) {
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('Service worker registration failed:', err);
      }
    });
  });
})();
