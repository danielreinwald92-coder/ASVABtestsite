/* Mission ASVAB service worker — app-shell offline support.
 *
 * CONSERVATIVE BY DESIGN. A misbehaving service worker can serve stale content
 * or break the live Supabase/CDN flow, so this worker:
 *   - uses a VERSIONED cache name (bump CACHE_VERSION to invalidate everything)
 *   - deletes old caches on activate
 *   - ONLY handles same-origin GET requests
 *   - network-first for navigations (HTML), cache-first for static assets
 *   - NEVER re-fetches a content-hashed (?v=<hash>) asset it already holds:
 *     those URLs are immutable, and every needless network fetch is a billed
 *     Vercel CDN request (the Hobby plan caps them at 1M/month)
 *   - NEVER touches cross-origin requests (Supabase *.supabase.co, jsDelivr,
 *     Google Fonts, Vercel insights) — they pass straight
 *     through to the network
 *   - NEVER caches/serves admin.html offline
 *   - NEVER touches non-GET requests (e.g. Supabase inserts)
 */
'use strict';

// Bump this string to invalidate the whole offline cache on the next visit.
// RELEASE STEP: bump on every deploy that changes an existing JS file —
// subresources are cache-first, so without a bump the first post-deploy load
// runs fresh HTML against stale cached JS.
const CACHE_VERSION = 'mission-asvab-v24';

// Small, maintainable core of STATIC same-origin assets that make up the app
// shell. Admin assets are intentionally excluded.
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/select-test.html',
  '/test-intro.html',
  '/quiz.html',
  '/results.html',
  '/dashboard.html',
  '/manifest.json',
  '/css/shared.css',
  '/css/home.css',
  // Core JS
  '/js/load-explanations.js',
  '/js/explanations.js',
  '/js/auth.js',
  '/js/sw-register.js',
  '/js/offline-queue.js',
  '/js/quiz-engine.js',
  '/js/recent-seen.js',
  '/js/irt.js',
  '/js/irt-params.js',
  '/js/penalty-table.js',
  '/js/scoring.js',
  '/js/branch-composites.js',
  '/js/job-requirements.js',
  '/js/job-matcher.js',
  '/js/options-view.js',
  '/js/quiz-data.js',
  '/js/section-config.js',
  '/js/test-config.js',
  '/js/mission-recommendations.js',
  '/js/mission-progress.js',
  // Page logic for offline-relevant pages
  '/js/page-index-nav.js',
  '/js/page-home-report.js',
  '/js/page-select-test.js',
  '/js/page-test-intro.js',
  '/js/page-results.js',
  '/js/page-dashboard.js',
  '/js/dashboard.js',
  '/js/weak-areas.js',
  // SP3 modules the dashboard/results pages load
  '/js/streak.js',
  '/js/study-plan.js',
  '/js/share-card.js',
  '/js/spaced-repetition.js',
  '/js/pwa-install.js',
  '/js/mobile-menu.js',
  '/js/focus-trap.js',
  '/js/year.js'
];

// True for build-stamped, content-hashed URLs (scripts/stamp-assets.js adds
// ?v=<hash>). Same URL => same bytes, so a cached copy is always current.
function isVersioned(url) {
  try {
    return new URL(url, self.location.origin).searchParams.has('v');
  } catch (_) {
    return false;
  }
}

// Best-effort precache: cache.addAll() rejects the whole batch if any one URL
// 404s, so add individually and swallow misses to stay resilient.
// Content-hashed assets are copied from an older cache (or the browser HTTP
// cache) when possible, so a CACHE_VERSION bump only downloads files whose
// content actually changed instead of the whole app shell again.
async function precache() {
  const cache = await caches.open(CACHE_VERSION);
  await Promise.all(
    PRECACHE_URLS.map(async (url) => {
      try {
        if (isVersioned(url)) {
          const prior = await caches.match(url);
          if (prior) {
            await cache.put(url, prior);
            return;
          }
          await cache.add(url);
        } else {
          await cache.add(new Request(url, { cache: 'reload' }));
        }
      } catch (_) {
        /* best effort */
      }
    })
  );
}

self.addEventListener('install', (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// admin.html must never be served from cache / available offline.
function isBypassed(url) {
  return url.pathname === '/admin.html' || url.pathname.endsWith('/admin.html');
}

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Never interfere with non-GET (e.g. Supabase inserts, form posts).
  if (req.method !== 'GET') return;

  let url;
  try {
    url = new URL(req.url);
  } catch (_) {
    return;
  }

  // Same-origin only. Cross-origin requests (Supabase, jsDelivr, Google Fonts,
  // Apps Script, Vercel insights) pass straight through to the network.
  if (url.origin !== self.location.origin) return;

  // Admin page is never cached or served offline.
  if (isBypassed(url)) return;

  const isNavigation =
    req.mode === 'navigate' ||
    (req.headers.get('accept') || '').includes('text/html');

  event.respondWith(isNavigation ? networkFirst(req) : cacheFirst(req));
});

// Network-first for navigations: always try the live page, fall back to cache
// only when offline. Keeps content fresh while still working offline.
async function networkFirst(req) {
  const cache = await caches.open(CACHE_VERSION);
  try {
    const res = await fetch(req);
    if (res && res.ok && res.type === 'basic') {
      cache.put(req, res.clone());
    }
    return res;
  } catch (_) {
    const cached = await cache.match(req);
    if (cached) return cached;
    const shell = await cache.match('/index.html');
    if (shell) return shell;
    return new Response('You are offline.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Cache-first for static assets. Unversioned assets (dynamically loaded
// scripts, manifest, icons) get a background refresh so a newer copy is picked
// up on the next load; content-hashed (?v=) assets never do — they cannot
// change, and each refresh would be a wasted CDN request on every page view.
// The versioned cache name stays the hard reset switch.
async function cacheFirst(req) {
  const cache = await caches.open(CACHE_VERSION);
  const cached = await cache.match(req);
  if (cached) {
    if (isVersioned(req.url)) return cached;
    fetch(req)
      .then((res) => {
        if (res && res.ok && res.type === 'basic') cache.put(req, res.clone());
      })
      .catch(() => {});
    return cached;
  }
  try {
    const res = await fetch(req);
    if (res && res.ok && res.type === 'basic') cache.put(req, res.clone());
    return res;
  } catch (_) {
    return new Response('', { status: 504 });
  }
}
