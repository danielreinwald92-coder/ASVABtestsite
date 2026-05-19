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
