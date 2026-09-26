const SUPABASE_URL = 'https://rcspwkmrtukblvvdifer.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjc3B3a21ydHVrYmx2dmRpZmVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxOTMzODksImV4cCI6MjA5NDc2OTM4OX0.9MraANb_EsQglZOHz7edSjAOy9JOXtReL6N48S-1dJA';

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

// Map raw Supabase auth errors to plain-language guidance a first-time user
// can act on. Falls back to the raw message for anything unrecognized.
function friendlyAuthError(error) {
  const raw = (error && error.message) ? String(error.message) : '';
  if (!raw) return 'Something went wrong. Please try again.';

  if (/invalid login credentials/i.test(raw)) {
    return "That email and password don't match. Double-check both, or use “Forgot password?” to reset it.";
  }
  if (/email not confirmed/i.test(raw)) {
    return "Your email hasn't been confirmed yet. Check your inbox (and spam folder) for the confirmation link, or resend it below.";
  }
  const rateMatch = raw.match(/after (\d+) seconds/i);
  if (rateMatch) {
    return `Too many attempts. Please wait ${rateMatch[1]} seconds and try again.`;
  }
  if (/already registered/i.test(raw)) {
    return 'An account with this email already exists. Try logging in instead, or reset your password if you forgot it.';
  }
  if (/auth session missing/i.test(raw)) {
    return 'Your reset link expired. Please request a new reset link from the log-in page.';
  }
  if (/password should be at least/i.test(raw)) {
    return 'Your password needs to be at least 8 characters long.';
  }
  return raw;
}

async function signOut() {
  await getClient().auth.signOut();
  window.location.href = 'index.html';
}

// Update nav to show user name and Dashboard link if logged in
// Nav account links are rendered by scripts/sync-site-chrome.js and switched
// to "My dashboard" by js/site-nav.js; this confirms with the live session
// (covers an expired token that js/site-nav.js still sees in storage).
async function applyAuthNav() {
  const session = await getSession();
  document.querySelectorAll('[data-nav-account]').forEach((a) => {
    a.href = session ? 'dashboard.html' : 'login.html';
    a.textContent = session ? 'My dashboard' : 'Log in';
  });
}
