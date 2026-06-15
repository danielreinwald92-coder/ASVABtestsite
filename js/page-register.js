// Page logic for register.html
// Externalized from an inline <script> (CSP script-src hardening).
// Loaded at end of <body> after js/auth.js (provides getSession/getClient).
(function () {
  // Redirect to dashboard if already logged in
  (async () => {
    const session = await getSession();
    if (session) window.location.href = 'dashboard.html';
  })();

  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const errorMsg = document.getElementById('errorMsg');
    const successMsg = document.getElementById('successMsg');
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';
    btn.disabled = true;
    btn.textContent = 'Creating account...';

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const education = document.getElementById('education').value;
    const ageVal = document.getElementById('age').value;
    const zipcode = document.getElementById('zipcode').value.trim();

    const failWith = (msg) => {
      errorMsg.textContent = msg;
      errorMsg.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Create Account';
    };

    const ageNum = parseInt(ageVal, 10);
    if (isNaN(ageNum) || ageNum < 14 || ageNum > 42) {
      return failWith('Please enter a valid age (14–42).');
    }
    if (!education) {
      return failWith('Please select your education level.');
    }
    if (!/^[0-9]{5}(-[0-9]{4})?$/.test(zipcode)) {
      return failWith('Please enter a valid US ZIP code.');
    }

    const client = getClient();
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });

    if (error) {
      return failWith(error.message);
    }

    let profileSaveFailed = false;
    if (data.user) {
      const { error: profileError } = await client.from('profiles')
        .update({ name, education, age: ageNum, zipcode })
        .eq('id', data.user.id);
      if (profileError) {
        console.error('Profile update error:', profileError);
        profileSaveFailed = true;
      }
    }

    btn.textContent = 'Account Created ✓';
    if (data.session) {
      successMsg.textContent = profileSaveFailed
        ? 'Account created, but saving your details failed — you can update them in your dashboard. Loading…'
        : 'Account created! Loading your dashboard...';
      successMsg.style.display = 'block';
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
    } else {
      successMsg.textContent = profileSaveFailed
        ? 'Account created, but saving your details failed — you can update them after you log in. Check your email to confirm, then log in.'
        : 'Account created! Check your email to confirm, then log in.';
      successMsg.style.display = 'block';
      setTimeout(() => { window.location.href = 'login.html'; }, 2500);
    }
  });
})();
