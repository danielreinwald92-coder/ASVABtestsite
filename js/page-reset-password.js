// Page logic for reset-password.html
// Externalized from an inline <script> (CSP script-src hardening).
// Loaded at end of <body> after js/auth.js (provides getClient).
(function () {
  // Track whether the recovery event fired before the timeout
  let recoveryEventFired = false;

  getClient().auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') {
      recoveryEventFired = true;
      document.getElementById('checkingLink').style.display = 'none';
      document.getElementById('resetForm').style.display = 'block';
      document.getElementById('invalidLink').style.display = 'none';
    }
  });

  // Give the recovery event a generous window (slow connections) before
  // declaring the link invalid; the "checking" message shows in the meantime.
  setTimeout(() => {
    if (!recoveryEventFired) {
      document.getElementById('checkingLink').style.display = 'none';
      document.getElementById('resetForm').style.display = 'none';
      document.getElementById('invalidLink').style.display = 'block';
    }
  }, 4000);

  document.getElementById('passwordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('updateBtn');
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.style.display = 'none';

    const newPass = document.getElementById('newPassword').value;
    const confirmPass = document.getElementById('confirmPassword').value;

    if (newPass !== confirmPass) {
      errorMsg.textContent = 'Passwords do not match.';
      errorMsg.style.display = 'block';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Updating...';

    const { error } = await getClient().auth.updateUser({ password: newPass });

    if (error) {
      errorMsg.textContent = error.message;
      errorMsg.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Update Password';
      return;
    }
    btn.textContent = 'Password Updated ✓';
    const successMsg = document.createElement('p');
    successMsg.style.cssText = 'color: #27ae60; font-size: 0.875rem; margin-top: 1rem;';
    successMsg.textContent = 'Password updated successfully. Redirecting to dashboard...';
    btn.after(successMsg);
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 2000);
  });
})();
