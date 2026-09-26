// Auth-aware nav logic for index.html
// Externalized from an inline <script> (CSP script-src hardening).
// Loaded after js/auth.js, which provides applyAuthNav() and getSession().
(function () {
  applyAuthNav();
  getSession().then(session => {
    const fine = document.getElementById('heroFine');
    if (fine && session) {
      fine.textContent = 'Signed in. Your scores save automatically. ';
      const link = document.createElement('a');
      link.href = 'dashboard.html';
      link.textContent = 'Go to my dashboard';
      fine.appendChild(link);
    }
  });
})();
