// Page logic for login.html
// Externalized from an inline <script> (CSP script-src hardening).
// Loaded at end of <body> after js/auth.js (provides getSession/getClient).
(function () {
  // If already logged in, go to dashboard
  (async () => {
    const session = await getSession();
    if (session) window.location.href = 'dashboard.html';
  })();

  document.getElementById('showForgotBtn').addEventListener('click', () => {
    const loginEmail = document.getElementById('email').value.trim();
    if (loginEmail) document.getElementById('resetEmail').value = loginEmail;
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('forgotSection').style.display = 'block';
  });

  document.getElementById('backToLoginBtn').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('forgotSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'block';
  });

  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('loginBtn');
    const errorMsg = document.getElementById('loginError');
    errorMsg.style.display = 'none';
    btn.disabled = true;
    btn.textContent = 'Logging in...';

    const email = document.getElementById('email').value.trim();
    const { error } = await getClient().auth.signInWithPassword({
      email,
      password: document.getElementById('password').value
    });

    if (error) {
      errorMsg.textContent = (typeof friendlyAuthError === 'function') ? friendlyAuthError(error) : error.message;
      errorMsg.style.display = 'block';
      // Unconfirmed accounts are a dead end without a resend path.
      const resendRow = document.getElementById('resendConfirmRow');
      if (resendRow) resendRow.hidden = !/email not confirmed/i.test(error.message || '');
      btn.disabled = false;
      btn.textContent = 'Log In';
      return;
    }
    window.location.href = 'dashboard.html';
  });

  const resendBtn = document.getElementById('resendConfirmBtn');
  if (resendBtn) {
    resendBtn.addEventListener('click', async () => {
      const email = document.getElementById('email').value.trim();
      const msg = document.getElementById('resendConfirmMsg');
      if (!email) return;
      resendBtn.disabled = true;
      resendBtn.textContent = 'Sending…';
      const { error } = await getClient().auth.resend({ type: 'signup', email });
      msg.textContent = error
        ? ((typeof friendlyAuthError === 'function') ? friendlyAuthError(error) : error.message)
        : 'Confirmation email sent — check your inbox and spam folder.';
      msg.style.display = 'block';
      msg.style.color = error ? '#c0392b' : '#27ae60';
      resendBtn.textContent = 'Resend confirmation email';
      setTimeout(() => { resendBtn.disabled = false; }, 15000);
    });
  }

  document.getElementById('forgotForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('resetBtn');
    const errorMsg = document.getElementById('resetError');
    const successMsg = document.getElementById('resetSuccess');
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';
    btn.disabled = true;
    btn.textContent = 'Sending...';

    const redirectTo = window.location.origin + '/reset-password.html';
    const { error } = await getClient().auth.resetPasswordForEmail(
      document.getElementById('resetEmail').value.trim(),
      { redirectTo }
    );

    if (error) {
      errorMsg.textContent = (typeof friendlyAuthError === 'function') ? friendlyAuthError(error) : error.message;
      errorMsg.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Send Reset Link';
      return;
    }
    successMsg.textContent = 'If an account exists with this email, a reset link is on its way — check your inbox and spam folder.';
    successMsg.style.display = 'block';
    btn.textContent = 'Email Sent';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'Resend Link';
    }, 30000);
  });
})();
