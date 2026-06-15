// Recruiter-form logic for index.html
// Externalized from an inline <script> (CSP script-src hardening).
// Functions remain top-level (not IIFE-wrapped) so they stay reachable for
// unit tests that invoke them directly. Inline on* attributes were replaced
// with addEventListener wiring below.
function toggleRecruiterForm() {
  const form = document.getElementById('recruiterForm');
  const btn = document.querySelector('.recruiter-toggle');
  if (form.style.display === 'none') {
    form.style.display = 'block';
    btn.textContent = 'Hide Form';
  } else {
    form.style.display = 'none';
    btn.textContent = 'Request Recruiter Contact';
  }
}

function submitRecruiterRequest(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('.form-submit');

  // Honeypot: real users never fill the hidden "company" field. If it's
  // populated, silently pretend success and send nothing.
  const honeypot = form.elements.company ? form.elements.company.value : '';
  if (honeypot) {
    form.reset();
    document.getElementById('recruiterForm').style.display = 'none';
    document.querySelector('.recruiter-toggle').textContent = 'Request Recruiter Contact';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Submitting...';

  const consentEl = form.querySelector('.consent-label');
  const data = {
    name: form.elements.name.value,
    email: form.elements.email.value,
    phone: form.elements.phone.value,
    message: form.elements.message.value,
    source: 'homepage',
    practiceScore: null,
    consentText: consentEl ? consentEl.textContent.trim().replace(/\s+/g, ' ') : '',
    consentTimestamp: new Date().toISOString()
  };

  // The endpoint is a CORS-opaque Apps Script /exec (returns a 302 we can't
  // read), so this is intentionally fire-and-forget — we never inspect the
  // response. An AbortController gives us a real failure path for timeouts.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  fetch('https://script.google.com/macros/s/AKfycbxsUDFUQYOTvbSsbXEfdZxz_1-kp8iA1yM24alVMwEZVo8jJsla_-lPgZUccSEqYBH2ow/exec', {
    method: 'POST',
    body: JSON.stringify(data),
    signal: controller.signal
  })
  .then(() => {
    alert('Thank you! A recruiter will contact you soon.');
    form.reset();
    document.getElementById('recruiterForm').style.display = 'none';
    document.querySelector('.recruiter-toggle').textContent = 'Request Recruiter Contact';
  })
  .catch(() => {
    alert('Something went wrong. Please try again.');
  })
  .finally(() => {
    clearTimeout(timeout);
    btn.disabled = false;
    btn.textContent = 'Submit Request';
  });
}

(function wireRecruiterForm() {
  const toggle = document.querySelector('.recruiter-toggle');
  if (toggle) toggle.addEventListener('click', toggleRecruiterForm);
  const form = document.querySelector('.recruiter-form');
  if (form) form.addEventListener('submit', submitRecruiterRequest);
})();
