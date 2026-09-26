// Account link in the shared site nav/footer (markup from
// scripts/sync-site-chrome.js). Pages without the Supabase client still know
// whether someone is signed in by the persisted session key, so the link
// reads "My dashboard" instead of "Log in" without loading supabase-js.
(function () {
  function signedIn() {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && /^sb-.*-auth-token$/.test(k) && localStorage.getItem(k)) return true;
      }
    } catch (_) { /* storage blocked: treat as signed out */ }
    return false;
  }
  function apply() {
    if (!signedIn()) return;
    document.querySelectorAll('[data-nav-account]').forEach((a) => {
      a.href = 'dashboard.html';
      a.textContent = 'My dashboard';
      if (/dashboard\.html$/.test(location.pathname)) a.setAttribute('aria-current', 'page');
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
})();
