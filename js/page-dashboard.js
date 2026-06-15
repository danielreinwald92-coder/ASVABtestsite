// Page logic + event wiring for dashboard.html
// Externalized from an inline <script> (CSP script-src hardening).
// Loaded at end of <body> after js/auth.js, js/focus-trap.js and js/dashboard.js
// (which defines the global handler functions referenced below). Handlers are
// invoked via arrow wrappers so they resolve lazily at click time — this keeps
// unit tests that only stub loadDashboard() from throwing at wire time.
(function () {
  // Save test date if set before going to test
  const diagnosticBtn = document.getElementById('diagnosticBtn');
  if (diagnosticBtn) {
    diagnosticBtn.addEventListener('click', async (e) => {
      const testDate = document.getElementById('testDateInput').value;
      if (!testDate) return; // no date to save — let the link navigate normally
      e.preventDefault();
      const diagMsg = document.getElementById('diagMsg');
      diagMsg.style.display = 'none';
      const session = await getSession();
      if (session) {
        const { error } = await getClient()
          .from('profiles')
          .update({ test_date: testDate })
          .eq('id', session.user.id);
        if (error) {
          diagMsg.textContent = 'Could not save your test date. Please try again, or continue without saving.';
          diagMsg.style.display = 'block';
          return; // surface the error; user can retry or click again to proceed
        }
      }
      window.location.href = 'select-test.html';
    });
  }

  // Wire former inline on* handlers to their global functions (defined in
  // js/dashboard.js). Arrow wrappers defer name resolution until invocation.
  const on = (sel, evt, fn) => {
    const el = document.querySelector(sel);
    if (el) el.addEventListener(evt, fn);
  };

  on('.account-btn', 'click', () => openAccountModal());
  on('.sign-out-btn', 'click', () => signOut());
  on('.skip-link', 'click', () => skipWelcome());
  on('.acc-close', 'click', () => closeAccountModal());
  on('.del', 'click', () => confirmDeleteAccount());
  on('[data-action="export-data"]', 'click', () => exportUserData());
  on('#accProfileForm', 'submit', (e) => saveProfile(e));
  on('#accPasswordForm', 'submit', (e) => changePassword(e));

  const overlay = document.getElementById('accOverlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeAccountModal();
    });
  }

  // Delegated handlers for buttons rendered into #historyTable by dashboard.js
  // (previously inline onclick attributes in injected markup).
  document.addEventListener('click', (e) => {
    const expand = e.target.closest && e.target.closest('.expand-btn[data-idx]');
    if (expand) {
      toggleHistoryDetail(Number(expand.dataset.idx));
      return;
    }
    const pager = e.target.closest && e.target.closest('.history-pagebtn[data-dir]');
    if (pager) {
      changeHistoryPage(Number(pager.dataset.dir));
      return;
    }
    const practice = e.target.closest && e.target.closest('[data-action="practice-weak-areas"]');
    if (practice) {
      startWeakAreaPractice(practice.dataset.sections);
    }
  });

  loadDashboard();
})();
