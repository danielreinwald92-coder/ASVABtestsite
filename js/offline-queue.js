// Offline test-result queue flusher.
//
// quiz-engine.js queues a test result to localStorage when a Supabase insert
// fails (offline or transient error). This module drains that queue back to
// Supabase: on page load and whenever connectivity returns (`online` event),
// provided a session exists. Results are dequeued ONLY after a confirmed
// successful insert, so nothing is lost or double-inserted.
//
// Storage keys:
//   pendingTestResults  — array of { payload, error, queuedAt } (current)
//   pendingTestResult   — legacy single object (migrated into the array)
(function () {
  'use strict';

  const QUEUE_KEY = 'pendingTestResults';
  const LEGACY_KEY = 'pendingTestResult';

  function readQueue() {
    try {
      const raw = localStorage.getItem(QUEUE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (_) {
      return [];
    }
  }

  function writeQueue(arr) {
    try {
      if (!arr || arr.length === 0) {
        localStorage.removeItem(QUEUE_KEY);
      } else {
        localStorage.setItem(QUEUE_KEY, JSON.stringify(arr));
      }
    } catch (_) {
      // Quota/serialization error — nothing actionable client-side.
    }
  }

  // Fold any legacy single-result key into the array queue.
  function migrateLegacy() {
    let legacy = null;
    try {
      legacy = localStorage.getItem(LEGACY_KEY);
    } catch (_) {
      return;
    }
    if (!legacy) return;
    try {
      const entry = JSON.parse(legacy);
      const queue = readQueue();
      queue.push(entry);
      writeQueue(queue);
    } catch (_) {
      // Corrupt legacy entry — drop it.
    }
    try {
      localStorage.removeItem(LEGACY_KEY);
    } catch (_) {}
  }

  function isOffline() {
    return (
      typeof navigator !== 'undefined' &&
      navigator &&
      navigator.onLine === false
    );
  }

  // Minimal, self-contained user-visible confirmation. Only runs in a real DOM.
  function showFlushToast(count) {
    try {
      if (typeof document === 'undefined' || !document.body) return;
      const el = document.createElement('div');
      el.setAttribute('role', 'status');
      el.textContent =
        count === 1
          ? 'Saved 1 offline test result to your account.'
          : 'Saved ' + count + ' offline test results to your account.';
      el.style.position = 'fixed';
      el.style.left = '50%';
      el.style.bottom = '20px';
      el.style.transform = 'translateX(-50%)';
      el.style.background = '#132039';
      el.style.color = '#f0d69b';
      el.style.padding = '10px 16px';
      el.style.borderRadius = '8px';
      el.style.fontSize = '14px';
      el.style.zIndex = '9999';
      el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
      document.body.appendChild(el);
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 5000);
    } catch (_) {}
  }

  // Re-entrancy guard: flush is wired to `load`, `online`, AND post-submit —
  // overlapping runs would each read the same queue and double-insert.
  let _flushing = false;

  // Drain the queue to Supabase. No-op (and non-throwing) when there is no
  // client, no session, the browser reports it is offline, or a flush is
  // already in flight.
  async function flushPendingTestResults() {
    if (_flushing) {
      return { flushed: 0, remaining: readQueue().length, reason: 'in-flight' };
    }
    _flushing = true;
    try {
      migrateLegacy();

      const queue = readQueue();
      if (queue.length === 0) return { flushed: 0, remaining: 0 };

      if (typeof getClient !== 'function' || typeof getSession !== 'function') {
        return { flushed: 0, remaining: queue.length, reason: 'no-client' };
      }
      if (isOffline()) {
        return { flushed: 0, remaining: queue.length, reason: 'offline' };
      }

      let session;
      try {
        session = await getSession();
      } catch (_) {
        return { flushed: 0, remaining: queue.length, reason: 'no-session' };
      }
      if (!session) {
        return { flushed: 0, remaining: queue.length, reason: 'no-session' };
      }

      // Dequeue per entry, immediately after its confirmed insert: if the page
      // navigates away mid-flush, already-inserted entries must not be re-run
      // on the next load (that produced duplicate test_results rows).
      const pending = queue.slice();
      const failed = [];
      let flushed = 0;
      while (pending.length > 0) {
        const entry = pending.shift();
        const payload = entry && entry.payload ? entry.payload : entry;
        let ok = false;
        try {
          const { error } = await getClient().from('test_results').insert(payload);
          ok = !error || error.code === '23505';
        } catch (_) {
          ok = false;
        }
        if (ok) {
          flushed += 1;
        } else {
          failed.push(entry); // keep on failure — never drop unsent results
        }
        writeQueue(failed.concat(pending));
      }

      if (flushed > 0) showFlushToast(flushed);
      return { flushed, remaining: failed.length };
    } finally {
      _flushing = false;
    }
  }

  // Expose for tests and other modules.
  if (typeof window !== 'undefined') {
    window.flushPendingTestResults = flushPendingTestResults;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.flushPendingTestResults = flushPendingTestResults;
  }

  // Auto-wire in the browser: flush on load and whenever connectivity returns.
  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('load', function () {
      flushPendingTestResults();
    });
    window.addEventListener('online', function () {
      flushPendingTestResults();
    });
  }
})();
