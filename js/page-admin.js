// Page wiring for admin.html
// Externalized from inline <script> blocks (CSP script-src hardening).
// Loaded at end of <body> after js/auth.js, js/focus-trap.js and js/admin.js
// (which defines the global handler functions referenced below). Arrow wrappers
// defer name resolution so the functions resolve at click time.
(function () {
  const on = (sel, evt, fn) => {
    const el = document.querySelector(sel);
    if (el) el.addEventListener(evt, fn);
  };

  on('.sign-out-btn', 'click', () => signOut());
  on('.btn-primary', 'click', () => applyFilters());
  on('.btn-export', 'click', () => exportCsv());
  on('.modal-close', 'click', () => closeUserModal());

  const overlay = document.getElementById('userModal');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeUserModal();
    });
  }

  loadAdmin();
})();
