// Sets the current year into any element with id="year".
// Replaces inline `document.write(new Date().getFullYear())` so the page
// needs no inline script (CSP script-src hardening).
(function () {
  function setYear() {
    var el = document.getElementById('year');
    if (el) {
      el.textContent = new Date().getFullYear();
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setYear);
  } else {
    setYear();
  }
})();
