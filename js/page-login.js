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

    const { error } = await getClient().auth.signInWithPassword({
      email: document.getElementById('email').value.trim(),
      password: document.getElementById('password').value
    });

    if (error) {
      errorMsg.textContent = error.message;
      errorMsg.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Log In';
      return;
    }
    window.location.href = 'dashboard.html';
  });

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
      errorMsg.textContent = error.message;
      errorMsg.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Send Reset Link';
      return;
    }
    successMsg.textContent = 'Check your email for the reset link.';
    successMsg.style.display = 'block';
    btn.textContent = 'Email Sent';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'Resend Link';
    }, 30000);
  });
})();
