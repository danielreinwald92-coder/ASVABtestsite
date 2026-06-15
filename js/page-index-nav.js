// Auth-aware nav logic for index.html
// Externalized from an inline <script> (CSP script-src hardening).
// Loaded after js/auth.js, which provides applyAuthNav() and getSession().
(function () {
  applyAuthNav();
  getSession().then(session => {
    const btn = document.getElementById('heroSignupBtn');
    if (btn && session) {
      btn.textContent = 'My Dashboard';
      btn.href = 'dashboard.html';
    }
  });
})();
