# Accounts, Dashboard & Lead Generation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Supabase-backed user accounts, a smart progress dashboard, and a private admin/lead view to Mission ASVAB while preserving full guest functionality.

**Architecture:** Static HTML/JS pages on Vercel with Supabase JS SDK loaded via CDN. Auth is email+password via Supabase Auth. User profiles and test results stored in Supabase Postgres with Row Level Security. No backend server required — all queries run client-side against the user's own JWT.

**Tech Stack:** Supabase JS v2 (CDN), Supabase Auth, Supabase Postgres (RLS), vanilla JS, existing navy/gold CSS design system

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `js/auth.js` | Create | Supabase client singleton, session helpers, auth guards |
| `js/dashboard.js` | Create | Dashboard data fetching, suggestion algorithm, SVG chart, history table |
| `js/admin.js` | Create | Admin data fetching, filters, CSV export |
| `register.html` | Create | Account creation form |
| `login.html` | Create | Sign in + forgot password |
| `reset-password.html` | Create | New password form after reset email |
| `dashboard.html` | Create | User progress hub (4 zones) |
| `admin.html` | Create | Private lead/admin view |
| `index.html` | Modify | Auth-aware nav (Login/Sign Up CTAs, user name when logged in) |
| `js/quiz-engine.js` | Modify | Save test results to Supabase after localStorage save |
| `results.html` | Modify | "View My Progress" CTA (logged in) + guest account prompt |

---

## Task 1: Supabase Project Setup

**Files:**
- No code files — manual steps in Supabase dashboard

- [ ] **Step 1: Create a Supabase project**

  Go to https://supabase.com, sign in, click "New Project". Name it `mission-asvab`. Choose the region closest to your users (US East or US West). Save the database password somewhere secure.

- [ ] **Step 2: Run the schema SQL**

  In your Supabase project, go to **SQL Editor → New Query**. Paste and run this entire block:

  ```sql
  -- Profiles table (extends auth.users)
  create table public.profiles (
    id uuid references auth.users(id) on delete cascade primary key,
    email text not null,
    name text not null,
    age integer,
    education text,
    zipcode text,
    test_date date,
    is_admin boolean not null default false,
    created_at timestamptz not null default now()
  );

  -- Test results table
  create table public.test_results (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    test_type text not null,
    afqt_score integer,
    section_scores jsonb,
    line_scores jsonb,
    taken_at timestamptz not null default now()
  );

  -- Enable RLS
  alter table public.profiles enable row level security;
  alter table public.test_results enable row level security;

  -- Profiles: own row only
  create policy "profiles_select_own" on public.profiles
    for select using (auth.uid() = id);
  create policy "profiles_insert_own" on public.profiles
    for insert with check (auth.uid() = id);
  create policy "profiles_update_own" on public.profiles
    for update using (auth.uid() = id);

  -- Profiles: admin can select all
  create policy "profiles_select_admin" on public.profiles
    for select using (
      exists (
        select 1 from public.profiles p
        where p.id = auth.uid() and p.is_admin = true
      )
    );

  -- Test results: own rows only
  create policy "results_select_own" on public.test_results
    for select using (auth.uid() = user_id);
  create policy "results_insert_own" on public.test_results
    for insert with check (auth.uid() = user_id);

  -- Test results: admin can select all
  create policy "results_select_admin" on public.test_results
    for select using (
      exists (
        select 1 from public.profiles p
        where p.id = auth.uid() and p.is_admin = true
      )
    );

  -- Auto-create profile on signup
  create or replace function public.handle_new_user()
  returns trigger language plpgsql security definer as $$
  begin
    insert into public.profiles (id, email, name)
    values (
      new.id,
      new.email,
      coalesce(new.raw_user_meta_data->>'name', 'Test Taker')
    );
    return new;
  end;
  $$;

  create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
  ```

- [ ] **Step 3: Get your API keys**

  In your Supabase project go to **Settings → API**. Copy:
  - **Project URL** (e.g. `https://abcdefgh.supabase.co`)
  - **anon / public key** (safe to embed in frontend — protected by RLS)

  You will paste these into `js/auth.js` in Task 2.

- [ ] **Step 4: Configure auth redirect URLs**

  In Supabase go to **Authentication → URL Configuration**. Set:
  - **Site URL:** `https://your-vercel-domain.vercel.app` (or `http://localhost:3000` for local dev)
  - **Redirect URLs:** add `https://your-vercel-domain.vercel.app/reset-password.html`

- [ ] **Step 5: Verify tables exist**

  In Supabase go to **Table Editor**. You should see `profiles` and `test_results` with their columns. If either is missing, re-run Step 2.

---

## Task 2: Create `js/auth.js`

**Files:**
- Create: `js/auth.js`

- [ ] **Step 1: Create the file**

  Create `js/auth.js` with this content — replace the two placeholder strings with your real values from Task 1 Step 3:

  ```javascript
  const SUPABASE_URL = 'YOUR_SUPABASE_URL';
  const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

  // Singleton client — call getClient() everywhere instead of creating new instances
  let _client = null;
  function getClient() {
    if (!_client) {
      _client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return _client;
  }

  async function getSession() {
    const { data } = await getClient().auth.getSession();
    return data.session;
  }

  async function getProfile() {
    const session = await getSession();
    if (!session) return null;
    const { data } = await getClient()
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    return data;
  }

  // Redirect to login.html if not authenticated
  async function requireAuth() {
    const session = await getSession();
    if (!session) {
      window.location.href = 'login.html';
      return null;
    }
    return session;
  }

  // Redirect to login.html if not admin
  async function requireAdmin() {
    const profile = await getProfile();
    if (!profile || !profile.is_admin) {
      window.location.href = 'login.html';
      return null;
    }
    return profile;
  }

  async function signOut() {
    await getClient().auth.signOut();
    window.location.href = 'index.html';
  }

  // Update nav to show user name and Dashboard link if logged in
  async function applyAuthNav() {
    const session = await getSession();
    const navCta = document.querySelector('.nav-cta');
    const mobileMenuCta = document.querySelector('.mobile-menu-cta');
    const navLinks = document.querySelector('.nav-links');
    const mobileMenuLinks = document.querySelector('.mobile-menu-links');

    if (session) {
      const profile = await getProfile();
      const displayName = profile ? profile.name.split(' ')[0] : 'Account';

      if (navCta) {
        navCta.textContent = 'Dashboard';
        navCta.href = 'dashboard.html';
      }
      if (mobileMenuCta) {
        mobileMenuCta.textContent = 'Dashboard';
        mobileMenuCta.href = 'dashboard.html';
      }
      // Add sign out link to nav
      if (navLinks) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="dashboard.html" style="color: var(--gold-500); font-weight: 600;">${displayName}</a>`;
        navLinks.appendChild(li);
      }
      if (mobileMenuLinks) {
        const a = document.createElement('a');
        a.href = 'dashboard.html';
        a.textContent = `My Dashboard (${displayName})`;
        mobileMenuLinks.appendChild(a);
      }
    } else {
      // Guest state — add Login link
      if (navLinks) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="login.html">Log In</a>`;
        navLinks.appendChild(li);
      }
      if (mobileMenuLinks) {
        const a = document.createElement('a');
        a.href = 'login.html';
        a.textContent = 'Log In';
        mobileMenuLinks.appendChild(a);
      }
      if (navCta) {
        navCta.textContent = 'Sign Up Free';
        navCta.href = 'register.html';
      }
      if (mobileMenuCta) {
        mobileMenuCta.textContent = 'Sign Up Free';
        mobileMenuCta.href = 'register.html';
      }
    }
  }
  ```

- [ ] **Step 2: Verify the Supabase CDN URL is correct**

  The CDN script tag you will add to every auth-aware page is:
  ```html
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  ```
  This exposes `window.supabase` globally. `auth.js` must be loaded after this tag.

- [ ] **Step 3: Commit**

  ```bash
  git add js/auth.js
  git commit -m "feat: add Supabase auth client and session helpers"
  ```

---

## Task 3: Create `register.html`

**Files:**
- Create: `register.html`

- [ ] **Step 1: Create the file**

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Account — Mission ASVAB</title>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
      :root {
        --navy-900: #0a1628; --navy-800: #132039; --navy-700: #1e3a5f;
        --navy-600: #2d5a87; --gold-500: #d4a853; --gold-400: #e8c17a;
        --cream-100: #faf8f5; --cream-200: #f2efe8;
        --white: #ffffff; --text-primary: #0a1628; --text-secondary: #4a5568;
      }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'DM Sans', sans-serif; background: var(--cream-100); color: var(--text-primary); min-height: 100vh; display: flex; flex-direction: column; }
      nav { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 5%; background: var(--white); border-bottom: 1px solid var(--cream-200); }
      .logo { font-family: 'Cormorant Garamond', serif; font-size: 1.75rem; font-weight: 700; color: var(--navy-900); text-decoration: none; }
      .logo span { color: var(--gold-500); }
      main { flex: 1; display: flex; align-items: center; justify-content: center; padding: 3rem 1rem; }
      .auth-card { background: var(--white); border-radius: 16px; padding: 2.5rem; width: 100%; max-width: 460px; box-shadow: 0 4px 24px rgba(10,22,40,0.08); }
      h1 { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; }
      .subtitle { color: var(--text-secondary); margin-bottom: 2rem; font-size: 0.95rem; }
      .form-group { margin-bottom: 1.25rem; }
      label { display: block; font-weight: 600; font-size: 0.875rem; margin-bottom: 0.4rem; color: var(--navy-800); }
      .optional { font-weight: 400; color: var(--text-secondary); font-size: 0.8rem; margin-left: 0.25rem; }
      input, select { width: 100%; padding: 0.75rem 1rem; border: 1.5px solid var(--cream-200); border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; color: var(--text-primary); background: var(--white); transition: border-color 0.2s; }
      input:focus, select:focus { outline: none; border-color: var(--navy-600); }
      .btn-primary { width: 100%; padding: 0.875rem; background: var(--navy-900); color: var(--white); border: none; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 600; cursor: pointer; margin-top: 0.5rem; transition: background 0.2s; }
      .btn-primary:hover { background: var(--navy-700); }
      .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
      .error-msg { color: #c0392b; font-size: 0.875rem; margin-top: 1rem; display: none; }
      .success-msg { color: #27ae60; font-size: 0.875rem; margin-top: 1rem; display: none; }
      .login-link { text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: var(--text-secondary); }
      .login-link a { color: var(--navy-700); font-weight: 600; text-decoration: none; }
      .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    </style>
  </head>
  <body>
    <nav>
      <a href="index.html" class="logo">Mission <span>ASVAB</span></a>
    </nav>
    <main>
      <div class="auth-card">
        <h1>Create your account</h1>
        <p class="subtitle">Free forever. No payment required.</p>
        <form id="registerForm">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" id="name" placeholder="Jane Smith" required autocomplete="name">
          </div>
          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" placeholder="jane@example.com" required autocomplete="email">
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" placeholder="At least 8 characters" required minlength="8" autocomplete="new-password">
          </div>
          <div class="form-group">
            <label for="education">Education Level</label>
            <select id="education" required>
              <option value="" disabled selected>Select your education level</option>
              <option value="Some High School">Some High School</option>
              <option value="High School Diploma / GED">High School Diploma / GED</option>
              <option value="Some College">Some College</option>
              <option value="College Graduate">College Graduate</option>
              <option value="Graduate Degree">Graduate Degree</option>
            </select>
          </div>
          <div class="row-2">
            <div class="form-group">
              <label for="age">Age <span class="optional">(optional)</span></label>
              <input type="number" id="age" placeholder="17" min="14" max="42">
            </div>
            <div class="form-group">
              <label for="zipcode">ZIP Code <span class="optional">(optional)</span></label>
              <input type="text" id="zipcode" placeholder="90210" maxlength="10">
            </div>
          </div>
          <button type="submit" class="btn-primary" id="submitBtn">Create Account</button>
          <p class="error-msg" id="errorMsg"></p>
          <p class="success-msg" id="successMsg"></p>
        </form>
        <p class="login-link">Already have an account? <a href="login.html">Log in</a></p>
      </div>
    </main>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="js/auth.js"></script>
    <script>
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

        const client = getClient();
        const { data, error } = await client.auth.signUp({
          email,
          password,
          options: { data: { name } }
        });

        if (error) {
          errorMsg.textContent = error.message;
          errorMsg.style.display = 'block';
          btn.disabled = false;
          btn.textContent = 'Create Account';
          return;
        }

        // Update profile with additional fields (trigger created the row)
        if (data.user) {
          const updates = { name, education };
          if (ageVal) updates.age = parseInt(ageVal, 10);
          if (zipcode) updates.zipcode = zipcode;
          await client.from('profiles').update(updates).eq('id', data.user.id);
        }

        successMsg.textContent = 'Account created! Check your email to confirm, then log in.';
        successMsg.style.display = 'block';
        btn.textContent = 'Account Created';
      });
    </script>
  </body>
  </html>
  ```

- [ ] **Step 2: Verify registration flow**

  Run `npx serve .` and open `http://localhost:3000/register.html`. Fill out the form and submit. In Supabase dashboard → **Authentication → Users** you should see the new user. In **Table Editor → profiles** the row should exist with name and education populated.

- [ ] **Step 3: Commit**

  ```bash
  git add register.html
  git commit -m "feat: add registration page"
  ```

---

## Task 4: Create `login.html`

**Files:**
- Create: `login.html`

- [ ] **Step 1: Create the file**

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Log In — Mission ASVAB</title>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
      :root {
        --navy-900: #0a1628; --navy-800: #132039; --navy-700: #1e3a5f;
        --navy-600: #2d5a87; --gold-500: #d4a853;
        --cream-100: #faf8f5; --cream-200: #f2efe8;
        --white: #ffffff; --text-primary: #0a1628; --text-secondary: #4a5568;
      }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'DM Sans', sans-serif; background: var(--cream-100); color: var(--text-primary); min-height: 100vh; display: flex; flex-direction: column; }
      nav { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 5%; background: var(--white); border-bottom: 1px solid var(--cream-200); }
      .logo { font-family: 'Cormorant Garamond', serif; font-size: 1.75rem; font-weight: 700; color: var(--navy-900); text-decoration: none; }
      .logo span { color: var(--gold-500); }
      main { flex: 1; display: flex; align-items: center; justify-content: center; padding: 3rem 1rem; }
      .auth-card { background: var(--white); border-radius: 16px; padding: 2.5rem; width: 100%; max-width: 420px; box-shadow: 0 4px 24px rgba(10,22,40,0.08); }
      h1 { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; }
      .subtitle { color: var(--text-secondary); margin-bottom: 2rem; font-size: 0.95rem; }
      .form-group { margin-bottom: 1.25rem; }
      label { display: block; font-weight: 600; font-size: 0.875rem; margin-bottom: 0.4rem; color: var(--navy-800); }
      input { width: 100%; padding: 0.75rem 1rem; border: 1.5px solid var(--cream-200); border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; transition: border-color 0.2s; }
      input:focus { outline: none; border-color: var(--navy-600); }
      .btn-primary { width: 100%; padding: 0.875rem; background: var(--navy-900); color: var(--white); border: none; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.2s; }
      .btn-primary:hover { background: var(--navy-700); }
      .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
      .forgot-link { text-align: right; margin-top: -0.75rem; margin-bottom: 1.25rem; }
      .forgot-link button { background: none; border: none; color: var(--navy-600); font-size: 0.85rem; cursor: pointer; padding: 0; font-family: 'DM Sans', sans-serif; }
      .error-msg { color: #c0392b; font-size: 0.875rem; margin-top: 1rem; display: none; }
      .success-msg { color: #27ae60; font-size: 0.875rem; margin-top: 1rem; display: none; }
      .bottom-link { text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: var(--text-secondary); }
      .bottom-link a { color: var(--navy-700); font-weight: 600; text-decoration: none; }
      #forgotSection { display: none; }
    </style>
  </head>
  <body>
    <nav>
      <a href="index.html" class="logo">Mission <span>ASVAB</span></a>
    </nav>
    <main>
      <div class="auth-card">
        <!-- Sign in form -->
        <div id="loginSection">
          <h1>Welcome back</h1>
          <p class="subtitle">Log in to view your progress dashboard.</p>
          <form id="loginForm">
            <div class="form-group">
              <label for="email">Email Address</label>
              <input type="email" id="email" required autocomplete="email">
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" required autocomplete="current-password">
            </div>
            <div class="forgot-link">
              <button type="button" id="showForgotBtn">Forgot password?</button>
            </div>
            <button type="submit" class="btn-primary" id="loginBtn">Log In</button>
            <p class="error-msg" id="loginError"></p>
          </form>
          <p class="bottom-link">Don't have an account? <a href="register.html">Sign up free</a></p>
        </div>

        <!-- Forgot password form -->
        <div id="forgotSection">
          <h1>Reset password</h1>
          <p class="subtitle">Enter your email and we'll send you a reset link.</p>
          <form id="forgotForm">
            <div class="form-group">
              <label for="resetEmail">Email Address</label>
              <input type="email" id="resetEmail" required autocomplete="email">
            </div>
            <button type="submit" class="btn-primary" id="resetBtn">Send Reset Link</button>
            <p class="error-msg" id="resetError"></p>
            <p class="success-msg" id="resetSuccess"></p>
          </form>
          <p class="bottom-link"><a href="#" id="backToLoginBtn">Back to log in</a></p>
        </div>
      </div>
    </main>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="js/auth.js"></script>
    <script>
      // If already logged in, go to dashboard
      getSession().then(session => {
        if (session) window.location.href = 'dashboard.html';
      });

      document.getElementById('showForgotBtn').addEventListener('click', () => {
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
      });
    </script>
  </body>
  </html>
  ```

- [ ] **Step 2: Verify login flow**

  Open `http://localhost:3000/login.html`. Log in with the account you created in Task 3. You should be redirected to `dashboard.html` (which doesn't exist yet — a 404 is fine at this stage). Verify the forgot password form toggles correctly.

- [ ] **Step 3: Commit**

  ```bash
  git add login.html
  git commit -m "feat: add login page with forgot password toggle"
  ```

---

## Task 5: Create `reset-password.html`

**Files:**
- Create: `reset-password.html`

- [ ] **Step 1: Create the file**

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password — Mission ASVAB</title>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
      :root {
        --navy-900: #0a1628; --navy-700: #1e3a5f; --navy-600: #2d5a87;
        --gold-500: #d4a853; --cream-100: #faf8f5; --cream-200: #f2efe8;
        --white: #ffffff; --text-primary: #0a1628; --text-secondary: #4a5568;
      }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'DM Sans', sans-serif; background: var(--cream-100); color: var(--text-primary); min-height: 100vh; display: flex; flex-direction: column; }
      nav { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 5%; background: var(--white); border-bottom: 1px solid var(--cream-200); }
      .logo { font-family: 'Cormorant Garamond', serif; font-size: 1.75rem; font-weight: 700; color: var(--navy-900); text-decoration: none; }
      .logo span { color: var(--gold-500); }
      main { flex: 1; display: flex; align-items: center; justify-content: center; padding: 3rem 1rem; }
      .auth-card { background: var(--white); border-radius: 16px; padding: 2.5rem; width: 100%; max-width: 420px; box-shadow: 0 4px 24px rgba(10,22,40,0.08); }
      h1 { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; }
      .subtitle { color: var(--text-secondary); margin-bottom: 2rem; font-size: 0.95rem; }
      .form-group { margin-bottom: 1.25rem; }
      label { display: block; font-weight: 600; font-size: 0.875rem; margin-bottom: 0.4rem; color: var(--navy-900); }
      input { width: 100%; padding: 0.75rem 1rem; border: 1.5px solid var(--cream-200); border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; transition: border-color 0.2s; }
      input:focus { outline: none; border-color: var(--navy-600); }
      .btn-primary { width: 100%; padding: 0.875rem; background: var(--navy-900); color: var(--white); border: none; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.2s; }
      .btn-primary:hover { background: var(--navy-700); }
      .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
      .error-msg { color: #c0392b; font-size: 0.875rem; margin-top: 1rem; display: none; }
      .invalid-link { text-align: center; padding: 2rem 0; }
      .invalid-link p { color: var(--text-secondary); margin-bottom: 1rem; }
      .invalid-link a { color: var(--navy-700); font-weight: 600; text-decoration: none; }
    </style>
  </head>
  <body>
    <nav>
      <a href="index.html" class="logo">Mission <span>ASVAB</span></a>
    </nav>
    <main>
      <div class="auth-card">
        <div id="resetForm">
          <h1>Set new password</h1>
          <p class="subtitle">Choose a strong password for your account.</p>
          <form id="passwordForm">
            <div class="form-group">
              <label for="newPassword">New Password</label>
              <input type="password" id="newPassword" placeholder="At least 8 characters" required minlength="8" autocomplete="new-password">
            </div>
            <div class="form-group">
              <label for="confirmPassword">Confirm Password</label>
              <input type="password" id="confirmPassword" required minlength="8" autocomplete="new-password">
            </div>
            <button type="submit" class="btn-primary" id="updateBtn">Update Password</button>
            <p class="error-msg" id="errorMsg"></p>
          </form>
        </div>
        <div id="invalidLink" class="invalid-link" style="display:none;">
          <p>This reset link is invalid or has expired.</p>
          <a href="login.html">Back to log in</a>
        </div>
      </div>
    </main>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="js/auth.js"></script>
    <script>
      // Supabase puts the recovery token in the URL hash on redirect
      getClient().auth.onAuthStateChange(async (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          // Session is now active — show the form
          document.getElementById('resetForm').style.display = 'block';
          document.getElementById('invalidLink').style.display = 'none';
        }
      });

      // If no recovery token after a moment, show invalid state
      setTimeout(() => {
        getSession().then(session => {
          if (!session) {
            document.getElementById('resetForm').style.display = 'none';
            document.getElementById('invalidLink').style.display = 'block';
          }
        });
      }, 1500);

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
        window.location.href = 'dashboard.html';
      });
    </script>
  </body>
  </html>
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add reset-password.html
  git commit -m "feat: add password reset page"
  ```

---

## Task 6: Update `index.html` nav

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add Supabase scripts before `</body>`**

  In `index.html`, find the closing `</body>` tag and add these two lines just before it:

  ```html
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="js/auth.js"></script>
    <script>applyAuthNav();</script>
  </body>
  ```

- [ ] **Step 2: Update the hero badge**

  Find this line:
  ```html
  <div class="hero-badge">100% Free • No Registration Required</div>
  ```

  Replace with:
  ```html
  <div class="hero-badge">100% Free • Track Your Progress with a Free Account</div>
  ```

- [ ] **Step 3: Add a soft Sign Up CTA to the hero buttons**

  Find:
  ```html
  <div class="hero-cta-group">
    <a href="select-test.html" class="btn-primary">Start Practicing</a>
    <a href="about.html" class="btn-secondary">Learn About the ASVAB</a>
  </div>
  ```

  Replace with:
  ```html
  <div class="hero-cta-group">
    <a href="select-test.html" class="btn-primary">Start Practicing</a>
    <a href="register.html" class="btn-secondary" id="heroSignupBtn">Create Free Account</a>
  </div>
  ```

  Then in the existing `<script>applyAuthNav();</script>` block, expand it:
  ```html
  <script>
    applyAuthNav();
    // If logged in, swap the hero signup CTA to point to dashboard
    getSession().then(session => {
      const btn = document.getElementById('heroSignupBtn');
      if (btn && session) {
        btn.textContent = 'My Dashboard';
        btn.href = 'dashboard.html';
      }
    });
  </script>
  ```

- [ ] **Step 4: Verify**

  Open `http://localhost:3000`. When logged out: nav shows "Log In" link and "Sign Up Free" button. When logged in (open dev tools and confirm there's a Supabase session): nav shows the user's first name and "Dashboard" button.

- [ ] **Step 5: Commit**

  ```bash
  git add index.html
  git commit -m "feat: update index nav with auth-aware CTAs"
  ```

---

## Task 7: Update `quiz-engine.js` to save results to Supabase

**Files:**
- Modify: `js/quiz-engine.js`

- [ ] **Step 1: Find the result-saving block**

  In `js/quiz-engine.js`, locate this line (around line 508):
  ```javascript
  localStorage.setItem('quizResults', JSON.stringify(quizResults));
  ```

- [ ] **Step 2: Add Supabase save after the localStorage line**

  Replace that single line with:
  ```javascript
  localStorage.setItem('quizResults', JSON.stringify(quizResults));

  // Save to Supabase if user is logged in (fire-and-forget, don't block redirect)
  this.saveResultsToSupabase(quizResults);
  ```

- [ ] **Step 3: Add the `saveResultsToSupabase` method to the QuizEngine class**

  Find the `bindEvents()` method. Add this new method just before it:

  ```javascript
  async saveResultsToSupabase(quizResults) {
    if (typeof getClient !== 'function') return;
    const session = await getSession();
    if (!session) return;

    const lineScores = MissionASVABScoring.calculateLineScores(quizResults.sectionResults);

    await getClient().from('test_results').insert({
      user_id: session.user.id,
      test_type: quizResults.testType || 'afqt',
      afqt_score: quizResults.afqt,
      section_scores: quizResults.sectionResults,
      line_scores: lineScores
    });
  }
  ```

- [ ] **Step 4: Add the Supabase scripts to `quiz.html`**

  Open `quiz.html`. Find the `<script src="js/quiz-engine.js"></script>` tag. Add the Supabase scripts just before it:

  ```html
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="js/auth.js"></script>
  <script src="js/quiz-engine.js"></script>
  ```

- [ ] **Step 5: Verify**

  Take a short practice test while logged in. After it completes, check Supabase **Table Editor → test_results**. A new row should appear with your `user_id`, `afqt_score`, and `section_scores` populated.

- [ ] **Step 6: Commit**

  ```bash
  git add js/quiz-engine.js quiz.html
  git commit -m "feat: save test results to Supabase when user is logged in"
  ```

---

## Task 8: Update `results.html` CTAs

**Files:**
- Modify: `results.html`

- [ ] **Step 1: Add Supabase scripts**

  In `results.html`, find the `<script src="js/test-config.js"></script>` line. Add the Supabase scripts before it:

  ```html
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="js/auth.js"></script>
  ```

- [ ] **Step 2: Update the CTA section**

  Find:
  ```html
  <div class="cta-section">
    <a href="select-test.html" class="cta-btn cta-primary">Take Another Test →</a>
    <a href="index.html" class="cta-btn cta-secondary">Back to Home</a>
  </div>
  ```

  Replace with:
  ```html
  <div class="cta-section">
    <a href="select-test.html" class="cta-btn cta-primary">Take Another Test →</a>
    <a href="dashboard.html" class="cta-btn cta-secondary" id="dashboardBtn" style="display:none;">View My Progress</a>
    <a href="register.html" class="cta-btn cta-secondary" id="signupBtn" style="display:none;">Save Progress — Sign Up Free</a>
    <a href="index.html" class="cta-btn cta-secondary" id="homeBtn">Back to Home</a>
  </div>
  ```

- [ ] **Step 3: Add auth CTA logic**

  At the bottom of the existing inline `<script>` block in `results.html`, add:

  ```javascript
  // Show auth-appropriate CTA
  getSession().then(session => {
    if (session) {
      document.getElementById('dashboardBtn').style.display = 'inline-flex';
      document.getElementById('homeBtn').style.display = 'none';
    } else {
      document.getElementById('signupBtn').style.display = 'inline-flex';
    }
  });
  ```

- [ ] **Step 4: Verify**

  Complete a test while logged out — you should see "Save Progress — Sign Up Free". Complete a test while logged in — you should see "View My Progress".

- [ ] **Step 5: Commit**

  ```bash
  git add results.html
  git commit -m "feat: add auth-aware CTAs to results page"
  ```

---

## Task 9: Create `js/dashboard.js`

**Files:**
- Create: `js/dashboard.js`

- [ ] **Step 1: Create the file with data-fetching and the suggestion algorithm**

  ```javascript
  async function loadDashboard() {
    const session = await requireAuth();
    if (!session) return;

    const client = getClient();

    // Fetch profile and results in parallel
    const [profileRes, resultsRes] = await Promise.all([
      client.from('profiles').select('*').eq('id', session.user.id).single(),
      client.from('test_results')
        .select('*')
        .eq('user_id', session.user.id)
        .order('taken_at', { ascending: false })
    ]);

    const profile = profileRes.data;
    const results = resultsRes.data || [];

    document.getElementById('userName').textContent = profile ? profile.name.split(' ')[0] : 'There';

    if (results.length === 0) {
      showWelcomeState();
      return;
    }

    hideWelcomeState();
    renderScoreSummary(results);
    renderProgressChart(results);
    renderSectionBreakdown(results);
    renderFocusPanel(results);
    renderTestHistory(results);
  }

  function showWelcomeState() {
    document.getElementById('welcomeState').style.display = 'block';
    document.getElementById('dashboardContent').style.display = 'none';
  }

  function hideWelcomeState() {
    document.getElementById('welcomeState').style.display = 'none';
    document.getElementById('dashboardContent').style.display = 'block';
  }

  function renderScoreSummary(results) {
    const latest = results[0];
    const previous = results[1];

    document.getElementById('latestAfqt').textContent = latest.afqt_score !== null ? latest.afqt_score : '—';
    document.getElementById('latestDate').textContent = formatDate(latest.taken_at);

    if (previous && latest.afqt_score !== null && previous.afqt_score !== null) {
      const delta = latest.afqt_score - previous.afqt_score;
      const deltaEl = document.getElementById('scoreDelta');
      if (delta > 0) {
        deltaEl.textContent = `↑ ${delta} points since last test`;
        deltaEl.style.color = '#27ae60';
      } else if (delta < 0) {
        deltaEl.textContent = `↓ ${Math.abs(delta)} points since last test`;
        deltaEl.style.color = '#c0392b';
      } else {
        deltaEl.textContent = 'No change since last test';
        deltaEl.style.color = 'var(--text-secondary)';
      }
      deltaEl.style.display = 'block';
    }
  }

  function renderProgressChart(results) {
    const container = document.getElementById('progressChart');
    // Need at least 2 data points for a line chart
    const afqtResults = results.filter(r => r.afqt_score !== null);

    if (afqtResults.length < 2) {
      container.innerHTML = '<p style="text-align:center; color:var(--text-secondary); padding: 2rem 0;">Take another test to see your score trend.</p>';
      return;
    }

    const data = afqtResults.slice().reverse(); // oldest first
    const scores = data.map(r => r.afqt_score);
    const minScore = Math.max(0, Math.min(...scores) - 10);
    const maxScore = Math.min(99, Math.max(...scores) + 10);
    const W = 500, H = 180, PAD_X = 40, PAD_Y = 30;
    const chartW = W - PAD_X * 2;
    const chartH = H - PAD_Y * 2;
    const xStep = chartW / (data.length - 1);
    const yRange = maxScore - minScore || 1;

    const points = data.map((r, i) => {
      const x = PAD_X + i * xStep;
      const y = PAD_Y + chartH - ((r.afqt_score - minScore) / yRange) * chartH;
      return { x, y, score: r.afqt_score, date: formatDate(r.taken_at) };
    });

    const polyline = points.map(p => `${p.x},${p.y}`).join(' ');

    const dots = points.map(p => `
      <circle cx="${p.x}" cy="${p.y}" r="5" fill="var(--gold-500)" stroke="var(--white)" stroke-width="2">
        <title>${p.score}th percentile — ${p.date}</title>
      </circle>
    `).join('');

    const labels = points.map((p, i) => {
      // Show label for first, last, and every 3rd point to avoid crowding
      if (i === 0 || i === points.length - 1 || i % 3 === 0) {
        return `<text x="${p.x}" y="${H - 5}" text-anchor="middle" font-size="10" fill="var(--text-secondary)">${formatDateShort(data[i].taken_at)}</text>`;
      }
      return '';
    }).join('');

    container.innerHTML = `
      <svg viewBox="0 0 ${W} ${H}" style="width:100%; height:auto; overflow:visible;">
        <polyline points="${polyline}" fill="none" stroke="var(--navy-600)" stroke-width="2.5" stroke-linejoin="round"/>
        ${dots}
        ${labels}
        <text x="${PAD_X - 8}" y="${PAD_Y}" text-anchor="end" font-size="10" fill="var(--text-secondary)">${maxScore}</text>
        <text x="${PAD_X - 8}" y="${PAD_Y + chartH}" text-anchor="end" font-size="10" fill="var(--text-secondary)">${minScore}</text>
      </svg>
    `;
  }

  const SECTION_NAMES = { AR: 'Arithmetic Reasoning', MK: 'Math Knowledge', WK: 'Word Knowledge', PC: 'Paragraph Comprehension' };
  const AFQT_SECTIONS = ['AR', 'MK', 'WK', 'PC'];

  function getSectionScore(sectionResults, code) {
    const s = sectionResults && sectionResults[code];
    if (!s || !s.total) return null;
    return Math.round((s.correct / s.total) * 100);
  }

  function renderSectionBreakdown(results) {
    const container = document.getElementById('sectionCards');
    const latest = results[0];
    const previous = results[1];

    container.innerHTML = AFQT_SECTIONS.map(code => {
      const score = getSectionScore(latest.section_scores, code);
      if (score === null) return '';

      const prevScore = previous ? getSectionScore(previous.section_scores, code) : null;
      let trendArrow = '', trendColor = 'var(--text-secondary)';
      if (prevScore !== null) {
        const diff = score - prevScore;
        if (diff > 0) { trendArrow = ' ↑'; trendColor = '#27ae60'; }
        else if (diff < 0) { trendArrow = ' ↓'; trendColor = '#c0392b'; }
        else { trendArrow = ' →'; }
      }

      let band = score >= 70 ? 'green' : score >= 50 ? 'yellow' : 'red';
      const bandColors = { green: '#27ae60', yellow: '#e67e22', red: '#c0392b' };

      return `
        <div class="section-card">
          <div class="section-card-name">${SECTION_NAMES[code]}</div>
          <div class="section-card-score" style="color: ${bandColors[band]}">${score}%</div>
          <div class="section-card-trend" style="color: ${trendColor}">${trendArrow || '—'}</div>
        </div>
      `;
    }).join('');
  }

  function computeFocusSections(results) {
    const latest = results[0];
    const previous = results.length > 1 ? results[1] : null;

    const scored = AFQT_SECTIONS
      .map(code => {
        const score = getSectionScore(latest.section_scores, code);
        if (score === null) return null;
        const prevScore = previous ? getSectionScore(previous.section_scores, code) : null;
        const trend = prevScore !== null ? score - prevScore : 0;
        return { code, score, trend };
      })
      .filter(Boolean);

    // Sort: lowest score first, then worst trend (most negative) as tiebreaker
    scored.sort((a, b) => {
      if (a.score !== b.score) return a.score - b.score;
      return a.trend - b.trend;
    });

    return scored.slice(0, 2);
  }

  function renderFocusPanel(results) {
    const panel = document.getElementById('focusPanel');
    const focus = computeFocusSections(results);

    if (focus.length === 0) {
      panel.style.display = 'none';
      return;
    }

    const messages = focus.map(f => {
      const name = SECTION_NAMES[f.code];
      const hasTrend = results.length > 1;
      const isDropping = f.trend < 0;

      if (hasTrend && isDropping) {
        return `<strong>${name}</strong> has dropped in your recent tests and is your weakest area.`;
      } else if (f.score < 50) {
        return `<strong>${name}</strong> is your lowest-scoring section at ${f.score}%.`;
      } else {
        return `<strong>${name}</strong> has room to improve (${f.score}%).`;
      }
    });

    const focusNames = focus.map(f => SECTION_NAMES[f.code]).join(' and ');
    const suggestion = messages.join(' ') + ` Focus on ${focusNames} before your next test.`;

    panel.innerHTML = `
      <div class="focus-label">Focus This Week</div>
      <p class="focus-text">${suggestion}</p>
      <a href="study-guide.html" class="focus-cta">Go to Study Guide →</a>
    `;
    panel.style.display = 'block';
  }

  let historyPage = 0;
  const HISTORY_PAGE_SIZE = 10;
  let _allResults = []; // cache for pagination

  function renderTestHistory(results) {
    _allResults = results; // keep in sync
    const container = document.getElementById('historyTable');
    const page = results.slice(historyPage * HISTORY_PAGE_SIZE, (historyPage + 1) * HISTORY_PAGE_SIZE);

    const rows = page.map((r, i) => {
      const globalIdx = historyPage * HISTORY_PAGE_SIZE + i;
      const sectionDetail = r.section_scores
        ? AFQT_SECTIONS.map(code => {
            const score = getSectionScore(r.section_scores, code);
            return score !== null ? `<span>${SECTION_NAMES[code]}: <strong>${score}%</strong></span>` : '';
          }).filter(Boolean).join(' &nbsp;|&nbsp; ')
        : '';

      return `
        <tr class="history-row" data-idx="${globalIdx}">
          <td>${formatDate(r.taken_at)}</td>
          <td>${r.test_type === 'full' ? 'Full Assessment' : 'AFQT'}</td>
          <td>${r.afqt_score !== null ? r.afqt_score + 'th %ile' : '—'}</td>
          <td><button class="expand-btn" onclick="toggleHistoryDetail(${globalIdx})">▾</button></td>
        </tr>
        <tr class="history-detail" id="detail-${globalIdx}" style="display:none;">
          <td colspan="4"><div class="detail-sections">${sectionDetail}</div></td>
        </tr>
      `;
    }).join('');

    container.innerHTML = `
      <table class="history-tbl">
        <thead><tr><th>Date</th><th>Type</th><th>AFQT</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      ${results.length > HISTORY_PAGE_SIZE ? `
        <div class="history-pagination">
          <button onclick="changeHistoryPage(-1)" ${historyPage === 0 ? 'disabled' : ''}>← Previous</button>
          <span>Page ${historyPage + 1} of ${Math.ceil(results.length / HISTORY_PAGE_SIZE)}</span>
          <button onclick="changeHistoryPage(1)" ${(historyPage + 1) * HISTORY_PAGE_SIZE >= results.length ? 'disabled' : ''}>Next →</button>
        </div>
      ` : ''}
    `;
  }

  function toggleHistoryDetail(idx) {
    const row = document.getElementById(`detail-${idx}`);
    row.style.display = row.style.display === 'none' ? 'table-row' : 'none';
  }

  function changeHistoryPage(dir) {
    historyPage += dir;
    renderTestHistory(_allResults); // re-slice cached data, no extra network call
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function formatDateShort(iso) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add js/dashboard.js
  git commit -m "feat: add dashboard data logic and suggestion algorithm"
  ```

---

## Task 10: Create `dashboard.html`

**Files:**
- Create: `dashboard.html`

- [ ] **Step 1: Create the file**

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Dashboard — Mission ASVAB</title>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
      :root {
        --navy-900: #0a1628; --navy-800: #132039; --navy-700: #1e3a5f;
        --navy-600: #2d5a87; --gold-500: #d4a853; --gold-400: #e8c17a;
        --cream-100: #faf8f5; --cream-200: #f2efe8;
        --white: #ffffff; --text-primary: #0a1628; --text-secondary: #4a5568;
      }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'DM Sans', sans-serif; background: var(--cream-100); color: var(--text-primary); }
      nav { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 5%; background: var(--white); border-bottom: 1px solid var(--cream-200); }
      .logo { font-family: 'Cormorant Garamond', serif; font-size: 1.75rem; font-weight: 700; color: var(--navy-900); text-decoration: none; }
      .logo span { color: var(--gold-500); }
      .nav-right { display: flex; align-items: center; gap: 1.5rem; }
      .nav-right a { color: var(--text-secondary); text-decoration: none; font-size: 0.95rem; }
      .sign-out-btn { background: none; border: 1.5px solid var(--cream-200); border-radius: 8px; padding: 0.5rem 1rem; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; cursor: pointer; color: var(--text-secondary); }
      .sign-out-btn:hover { border-color: var(--navy-600); color: var(--navy-700); }
      main { max-width: 900px; margin: 0 auto; padding: 2.5rem 1.5rem; }
      .page-heading { font-family: 'Cormorant Garamond', serif; font-size: 2.25rem; font-weight: 700; margin-bottom: 2rem; }
      .page-heading span { color: var(--gold-500); }

      /* Welcome state */
      .welcome-state { background: var(--white); border-radius: 16px; padding: 3rem 2rem; text-align: center; }
      .welcome-state h2 { font-family: 'Cormorant Garamond', serif; font-size: 1.75rem; margin-bottom: 1rem; }
      .welcome-state p { color: var(--text-secondary); margin-bottom: 2rem; max-width: 480px; margin-left: auto; margin-right: auto; }
      .welcome-form { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
      .welcome-form label { font-weight: 600; font-size: 0.875rem; align-self: flex-start; max-width: 300px; width: 100%; }
      .welcome-form input { width: 100%; max-width: 300px; padding: 0.75rem 1rem; border: 1.5px solid var(--cream-200); border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; }
      .btn-primary { display: inline-block; padding: 0.875rem 2rem; background: var(--navy-900); color: var(--white); border: none; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 600; cursor: pointer; text-decoration: none; transition: background 0.2s; }
      .btn-primary:hover { background: var(--navy-700); }
      .skip-link { font-size: 0.875rem; color: var(--text-secondary); background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; }

      /* Dashboard content */
      #dashboardContent { display: none; }

      /* Zone 1: Score summary */
      .score-summary { background: var(--navy-900); color: var(--white); border-radius: 16px; padding: 2rem 2.5rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 2.5rem; }
      .afqt-big { font-size: 4rem; font-weight: 700; font-family: 'Cormorant Garamond', serif; color: var(--gold-400); line-height: 1; }
      .afqt-big-label { font-size: 0.875rem; opacity: 0.7; margin-top: 0.25rem; }
      .score-meta { flex: 1; }
      .score-meta-date { font-size: 0.9rem; opacity: 0.7; margin-bottom: 0.5rem; }
      .score-delta { font-size: 1rem; font-weight: 600; display: none; }
      .take-test-btn { background: var(--gold-500); color: var(--navy-900); padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 0.95rem; white-space: nowrap; }
      .take-test-btn:hover { background: var(--gold-400); }

      /* Zone 2: Chart */
      .section-card-container { background: var(--white); border-radius: 16px; padding: 1.75rem; margin-bottom: 1.5rem; }
      .section-title { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 700; margin-bottom: 1.25rem; }
      #progressChart { min-height: 100px; }

      /* Zone 3: Section breakdown */
      .section-cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.25rem; }
      @media (min-width: 600px) { .section-cards { grid-template-columns: repeat(4, 1fr); } }
      .section-card { background: var(--cream-100); border-radius: 12px; padding: 1.25rem 1rem; text-align: center; }
      .section-card-name { font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.5rem; }
      .section-card-score { font-size: 1.75rem; font-weight: 700; font-family: 'Cormorant Garamond', serif; }
      .section-card-trend { font-size: 1rem; margin-top: 0.25rem; }

      /* Focus panel */
      #focusPanel { background: var(--navy-800); color: var(--white); border-radius: 12px; padding: 1.25rem 1.5rem; margin-top: 1rem; display: none; }
      .focus-label { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--gold-400); margin-bottom: 0.5rem; }
      .focus-text { font-size: 0.95rem; line-height: 1.6; margin-bottom: 0.75rem; }
      .focus-cta { color: var(--gold-400); text-decoration: none; font-weight: 600; font-size: 0.9rem; }

      /* Zone 4: History */
      .history-tbl { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
      .history-tbl th { text-align: left; padding: 0.6rem 1rem; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-secondary); border-bottom: 1px solid var(--cream-200); }
      .history-tbl td { padding: 0.75rem 1rem; border-bottom: 1px solid var(--cream-200); }
      .expand-btn { background: none; border: none; cursor: pointer; font-size: 1rem; color: var(--text-secondary); }
      .detail-sections { padding: 0.5rem 0; display: flex; flex-wrap: wrap; gap: 0.75rem; font-size: 0.875rem; color: var(--text-secondary); }
      .history-pagination { display: flex; justify-content: space-between; align-items: center; padding: 1rem 0 0; font-size: 0.9rem; }
      .history-pagination button { background: none; border: 1.5px solid var(--cream-200); border-radius: 8px; padding: 0.4rem 1rem; cursor: pointer; font-family: 'DM Sans', sans-serif; }
      .history-pagination button:disabled { opacity: 0.4; cursor: not-allowed; }
    </style>
  </head>
  <body>
    <nav>
      <a href="index.html" class="logo">Mission <span>ASVAB</span></a>
      <div class="nav-right">
        <a href="select-test.html">Practice Tests</a>
        <a href="study-guide.html">Study Guide</a>
        <button class="sign-out-btn" onclick="signOut()">Sign Out</button>
      </div>
    </nav>

    <main>
      <h1 class="page-heading">Welcome back, <span id="userName">...</span></h1>

      <!-- Welcome state: shown when no tests yet -->
      <div id="welcomeState" style="display:none;">
        <div class="welcome-state">
          <h2>Let's get your baseline score</h2>
          <p>Take a diagnostic practice test to see where you stand. Your scores will be tracked here so you can see your improvement over time.</p>
          <div class="welcome-form">
            <label for="testDateInput">When do you plan to take the ASVAB? <span style="font-weight:400; color: var(--text-secondary);">(optional)</span></label>
            <input type="date" id="testDateInput">
            <a href="select-test.html" class="btn-primary" id="diagnosticBtn">Take Your Diagnostic Test →</a>
            <button class="skip-link" onclick="hideWelcomeState()">Skip for now</button>
          </div>
        </div>
      </div>

      <!-- Main dashboard content -->
      <div id="dashboardContent">
        <!-- Zone 1: Score Summary -->
        <div class="score-summary">
          <div>
            <div class="afqt-big" id="latestAfqt">—</div>
            <div class="afqt-big-label">AFQT Percentile</div>
          </div>
          <div class="score-meta">
            <div class="score-meta-date" id="latestDate"></div>
            <div class="score-delta" id="scoreDelta"></div>
          </div>
          <a href="select-test.html" class="take-test-btn">Take Another Test</a>
        </div>

        <!-- Zone 2: Progress Chart -->
        <div class="section-card-container">
          <div class="section-title">Score Progress</div>
          <div id="progressChart"></div>
        </div>

        <!-- Zone 3: Section Breakdown -->
        <div class="section-card-container">
          <div class="section-title">Section Breakdown</div>
          <div class="section-cards" id="sectionCards"></div>
          <div id="focusPanel"></div>
        </div>

        <!-- Zone 4: Test History -->
        <div class="section-card-container">
          <div class="section-title">Test History</div>
          <div id="historyTable"></div>
        </div>
      </div>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="js/auth.js"></script>
    <script src="js/dashboard.js"></script>
    <script>
      // Save test date if set before going to test
      document.getElementById('diagnosticBtn').addEventListener('click', async (e) => {
        const testDate = document.getElementById('testDateInput').value;
        if (testDate) {
          const session = await getSession();
          if (session) {
            await getClient().from('profiles').update({ test_date: testDate }).eq('id', session.user.id);
          }
        }
      });

      loadDashboard();
    </script>
  </body>
  </html>
  ```

- [ ] **Step 2: Verify the full dashboard flow**

  1. Log in and go to `dashboard.html` with no test results — the welcome state should appear.
  2. Click "Take Your Diagnostic Test" — you should land on `select-test.html`.
  3. Complete a test, return to `dashboard.html` — the dashboard content should load with Zone 1 score summary populated.
  4. Complete a second test — the delta indicator and chart line should appear.

- [ ] **Step 3: Commit**

  ```bash
  git add dashboard.html js/dashboard.js
  git commit -m "feat: add user dashboard with score summary, chart, and suggestions"
  ```

---

## Task 11: Create `js/admin.js`

**Files:**
- Create: `js/admin.js`

- [ ] **Step 1: Create the file**

  ```javascript
  let allUsers = [];
  let filteredUsers = [];

  async function loadAdmin() {
    const profile = await requireAdmin();
    if (!profile) return;

    const client = getClient();

    // Fetch all profiles + aggregate test_results per user
    const { data: profiles } = await client
      .from('profiles')
      .select('*, test_results(afqt_score, taken_at)')
      .order('created_at', { ascending: false });

    allUsers = (profiles || []).map(p => {
      const tests = p.test_results || [];
      const bestAfqt = tests.length > 0
        ? Math.max(...tests.map(t => t.afqt_score).filter(s => s !== null))
        : null;
      return {
        id: p.id,
        name: p.name,
        email: p.email,
        age: p.age,
        education: p.education,
        zipcode: p.zipcode,
        created_at: p.created_at,
        testCount: tests.length,
        bestAfqt: isFinite(bestAfqt) ? bestAfqt : null
      };
    });

    renderStats();
    applyFilters();
  }

  function renderStats() {
    const now = new Date();
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

    document.getElementById('statTotal').textContent = allUsers.length;
    document.getElementById('statNewThisWeek').textContent =
      allUsers.filter(u => new Date(u.created_at) >= weekAgo).length;
    document.getElementById('statActive').textContent =
      allUsers.filter(u => u.testCount > 0).length;

    const afqtScores = allUsers.map(u => u.bestAfqt).filter(s => s !== null);
    document.getElementById('statAvgAfqt').textContent =
      afqtScores.length > 0
        ? Math.round(afqtScores.reduce((a, b) => a + b, 0) / afqtScores.length)
        : '—';
  }

  function applyFilters() {
    const fromDate = document.getElementById('filterFrom').value;
    const toDate = document.getElementById('filterTo').value;
    const education = document.getElementById('filterEducation').value;
    const zip = document.getElementById('filterZip').value.trim().toLowerCase();
    const minTests = parseInt(document.getElementById('filterMinTests').value, 10) || 0;

    filteredUsers = allUsers.filter(u => {
      if (fromDate && new Date(u.created_at) < new Date(fromDate)) return false;
      if (toDate && new Date(u.created_at) > new Date(toDate + 'T23:59:59')) return false;
      if (education && u.education !== education) return false;
      if (zip && !(u.zipcode || '').toLowerCase().startsWith(zip)) return false;
      if (u.testCount < minTests) return false;
      return true;
    });

    renderTable();
  }

  function renderTable() {
    const tbody = document.getElementById('adminTableBody');

    if (filteredUsers.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 2rem; color: var(--text-secondary);">No users match these filters.</td></tr>';
      document.getElementById('filteredCount').textContent = '0 users';
      return;
    }

    document.getElementById('filteredCount').textContent = `${filteredUsers.length} user${filteredUsers.length !== 1 ? 's' : ''}`;

    tbody.innerHTML = filteredUsers.map(u => `
      <tr>
        <td>${escHtml(u.name)}</td>
        <td>${escHtml(u.email)}</td>
        <td>${u.age || '—'}</td>
        <td>${escHtml(u.education || '—')}</td>
        <td>${escHtml(u.zipcode || '—')}</td>
        <td>${formatDate(u.created_at)}</td>
        <td>${u.testCount}</td>
        <td>${u.bestAfqt !== null ? u.bestAfqt + 'th %ile' : '—'}</td>
      </tr>
    `).join('');
  }

  function exportCsv() {
    const headers = ['Name', 'Email', 'Age', 'Education', 'ZIP', 'Joined', 'Tests Taken', 'Best AFQT'];
    const rows = filteredUsers.map(u => [
      csvCell(u.name),
      csvCell(u.email),
      u.age || '',
      csvCell(u.education || ''),
      csvCell(u.zipcode || ''),
      formatDate(u.created_at),
      u.testCount,
      u.bestAfqt !== null ? u.bestAfqt : ''
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mission-asvab-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function csvCell(val) {
    const s = String(val);
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add js/admin.js
  git commit -m "feat: add admin data logic with filters and CSV export"
  ```

---

## Task 12: Create `admin.html`

**Files:**
- Create: `admin.html`

- [ ] **Step 1: Create the file**

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin — Mission ASVAB</title>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
      :root {
        --navy-900: #0a1628; --navy-800: #132039; --navy-700: #1e3a5f;
        --navy-600: #2d5a87; --gold-500: #d4a853;
        --cream-100: #faf8f5; --cream-200: #f2efe8;
        --white: #ffffff; --text-primary: #0a1628; --text-secondary: #4a5568;
      }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'DM Sans', sans-serif; background: var(--cream-100); color: var(--text-primary); }
      nav { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 5%; background: var(--white); border-bottom: 1px solid var(--cream-200); }
      .logo { font-family: 'Cormorant Garamond', serif; font-size: 1.75rem; font-weight: 700; color: var(--navy-900); text-decoration: none; }
      .logo span { color: var(--gold-500); }
      .admin-badge { font-size: 0.75rem; font-weight: 700; background: var(--navy-900); color: var(--gold-500); padding: 0.25rem 0.75rem; border-radius: 99px; letter-spacing: 0.08em; text-transform: uppercase; }
      .sign-out-btn { background: none; border: 1.5px solid var(--cream-200); border-radius: 8px; padding: 0.5rem 1rem; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; cursor: pointer; }

      main { max-width: 1100px; margin: 0 auto; padding: 2.5rem 1.5rem; }
      h1 { font-family: 'Cormorant Garamond', serif; font-size: 2.25rem; font-weight: 700; margin-bottom: 2rem; }

      /* Stats */
      .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 2rem; }
      @media (min-width: 640px) { .stats-grid { grid-template-columns: repeat(4, 1fr); } }
      .stat-card { background: var(--white); border-radius: 12px; padding: 1.25rem 1.5rem; }
      .stat-value { font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; font-weight: 700; color: var(--navy-900); line-height: 1; }
      .stat-label { font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem; }

      /* Filters */
      .filters { background: var(--white); border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-end; }
      .filter-group { display: flex; flex-direction: column; gap: 0.35rem; min-width: 140px; }
      .filter-group label { font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); }
      .filter-group input, .filter-group select { padding: 0.6rem 0.75rem; border: 1.5px solid var(--cream-200); border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; }
      .filter-actions { display: flex; gap: 0.75rem; align-items: center; }
      .btn-primary { padding: 0.65rem 1.25rem; background: var(--navy-900); color: var(--white); border: none; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 600; cursor: pointer; }
      .btn-export { padding: 0.65rem 1.25rem; background: var(--gold-500); color: var(--navy-900); border: none; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 600; cursor: pointer; }

      /* Table */
      .table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
      .table-count { font-size: 0.875rem; color: var(--text-secondary); }
      .table-wrap { background: var(--white); border-radius: 12px; overflow-x: auto; }
      table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
      th { text-align: left; padding: 0.75rem 1rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-secondary); border-bottom: 1px solid var(--cream-200); white-space: nowrap; }
      td { padding: 0.75rem 1rem; border-bottom: 1px solid var(--cream-200); }
      tr:last-child td { border-bottom: none; }
      tr:hover td { background: var(--cream-100); }
    </style>
  </head>
  <body>
    <nav>
      <a href="index.html" class="logo">Mission <span>ASVAB</span></a>
      <div style="display:flex; align-items:center; gap:1rem;">
        <span class="admin-badge">Admin</span>
        <button class="sign-out-btn" onclick="signOut()">Sign Out</button>
      </div>
    </nav>

    <main>
      <h1>Leads & Registrations</h1>

      <!-- Summary Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value" id="statTotal">—</div>
          <div class="stat-label">Total Users</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" id="statNewThisWeek">—</div>
          <div class="stat-label">New This Week</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" id="statActive">—</div>
          <div class="stat-label">Took a Test</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" id="statAvgAfqt">—</div>
          <div class="stat-label">Avg. Best AFQT</div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters">
        <div class="filter-group">
          <label>Joined From</label>
          <input type="date" id="filterFrom">
        </div>
        <div class="filter-group">
          <label>Joined To</label>
          <input type="date" id="filterTo">
        </div>
        <div class="filter-group">
          <label>Education</label>
          <select id="filterEducation">
            <option value="">All</option>
            <option>Some High School</option>
            <option>High School Diploma / GED</option>
            <option>Some College</option>
            <option>College Graduate</option>
            <option>Graduate Degree</option>
          </select>
        </div>
        <div class="filter-group">
          <label>ZIP Code</label>
          <input type="text" id="filterZip" placeholder="e.g. 902">
        </div>
        <div class="filter-group">
          <label>Min Tests Taken</label>
          <input type="number" id="filterMinTests" placeholder="0" min="0" style="width:100px;">
        </div>
        <div class="filter-actions">
          <button class="btn-primary" onclick="applyFilters()">Apply</button>
          <button class="btn-export" onclick="exportCsv()">Export CSV</button>
        </div>
      </div>

      <!-- Table -->
      <div class="table-header">
        <span class="table-count" id="filteredCount"></span>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Age</th><th>Education</th>
              <th>ZIP</th><th>Joined</th><th>Tests</th><th>Best AFQT</th>
            </tr>
          </thead>
          <tbody id="adminTableBody">
            <tr><td colspan="8" style="text-align:center; padding:2rem; color:var(--text-secondary);">Loading...</td></tr>
          </tbody>
        </table>
      </div>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="js/auth.js"></script>
    <script src="js/admin.js"></script>
    <script>loadAdmin();</script>
  </body>
  </html>
  ```

- [ ] **Step 2: Set yourself as admin**

  In Supabase **Table Editor → profiles**, find your row and set `is_admin = true`. Save.

- [ ] **Step 3: Verify admin page**

  Go to `http://localhost:3000/admin.html`. You should see your stats, your own user row, and the export button. Log out and try to visit `admin.html` — you should be redirected to `login.html`.

- [ ] **Step 4: Commit**

  ```bash
  git add admin.html js/admin.js
  git commit -m "feat: add admin lead view with filters and CSV export"
  ```

---

## Task 13: Configure Supabase Email Templates

**Files:**
- No code files — manual steps in Supabase dashboard

- [ ] **Step 1: Customize the confirmation email**

  In Supabase go to **Authentication → Email Templates → Confirm signup**. Replace the subject and body:

  **Subject:** `Confirm your Mission ASVAB account`

  **Body (HTML):**
  ```html
  <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #faf8f5; padding: 2rem; border-radius: 12px;">
    <h2 style="font-family: Georgia, serif; color: #0a1628; margin-bottom: 0.5rem;">Mission <span style="color: #d4a853;">ASVAB</span></h2>
    <h3 style="color: #0a1628; margin-bottom: 1rem;">Confirm your account</h3>
    <p style="color: #4a5568; margin-bottom: 1.5rem;">Click the button below to confirm your email address and start tracking your ASVAB prep progress.</p>
    <a href="{{ .ConfirmationURL }}" style="display: inline-block; background: #0a1628; color: #ffffff; padding: 0.875rem 2rem; border-radius: 8px; text-decoration: none; font-weight: 600;">Confirm Email Address</a>
    <p style="color: #4a5568; font-size: 0.8rem; margin-top: 1.5rem;">If you didn't create an account, you can ignore this email.</p>
  </div>
  ```

- [ ] **Step 2: Customize the password reset email**

  In Supabase go to **Authentication → Email Templates → Reset password**. Replace:

  **Subject:** `Reset your Mission ASVAB password`

  **Body (HTML):**
  ```html
  <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #faf8f5; padding: 2rem; border-radius: 12px;">
    <h2 style="font-family: Georgia, serif; color: #0a1628; margin-bottom: 0.5rem;">Mission <span style="color: #d4a853;">ASVAB</span></h2>
    <h3 style="color: #0a1628; margin-bottom: 1rem;">Reset your password</h3>
    <p style="color: #4a5568; margin-bottom: 1.5rem;">Click the button below to set a new password for your account.</p>
    <a href="{{ .ConfirmationURL }}" style="display: inline-block; background: #0a1628; color: #ffffff; padding: 0.875rem 2rem; border-radius: 8px; text-decoration: none; font-weight: 600;">Reset Password</a>
    <p style="color: #4a5568; font-size: 0.8rem; margin-top: 1.5rem;">If you didn't request a password reset, you can ignore this email.</p>
  </div>
  ```

- [ ] **Step 3: Verify reset email**

  Go to `http://localhost:3000/login.html`, use "Forgot password?" with your email. Check your inbox — the branded email should arrive within a minute. Click the link — you should land on `reset-password.html` with the new password form showing.

---

## Task 14: Final QA & Deploy

- [ ] **Step 1: Run full end-to-end flow as a new user**

  1. Open `index.html` in an incognito window
  2. Click "Create Free Account" → fill form → confirm email → log in
  3. Welcome screen appears → take a diagnostic test → return to dashboard → Zone 1 shows score
  4. Take a second test → Zone 2 chart appears with two points, Zone 3 shows focus suggestion
  5. Go to `results.html` → "View My Progress" button is visible

- [ ] **Step 2: Run flow as a guest**

  Open `index.html` without logging in. Take a test. On `results.html` the "Save Progress — Sign Up Free" button should appear. "View My Progress" should NOT appear.

- [ ] **Step 3: Run admin flow**

  Visit `admin.html` while logged in as admin. Stats populate, user rows show, CSV export downloads a valid file. Log out and visit `admin.html` — redirects to login.

- [ ] **Step 4: Run the validator**

  ```bash
  node scripts/validate-site.js
  ```
  Expected: no errors. Fix any reported issues before deploying.

- [ ] **Step 5: Deploy**

  ```bash
  git push
  ```
  Vercel auto-deploys on push to main. After deploy, update Supabase **Authentication → URL Configuration → Site URL** to your production Vercel URL.

- [ ] **Step 6: Smoke test production**

  Register a new account on the live site. Confirm email. Log in. Take a test. Verify it saves to Supabase and shows on the dashboard.
