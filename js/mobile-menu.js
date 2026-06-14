/*
 * mobile-menu.js — accessible mobile navigation menu.
 * Shared by index.html, study-guide.html, about.html.
 * Adds: open/close via hamburger + close button, Escape to close,
 * a basic focus trap while open, and focus return to the hamburger on close.
 */
(function () {
  function init() {
    var menu = document.getElementById('mobile-menu');
    if (!menu) return;
    var hamburger = document.querySelector('.hamburger');
    var closeBtn = menu.querySelector('.mobile-menu-close');

    function focusables() {
      return Array.prototype.slice.call(
        menu.querySelectorAll('a[href], button:not([disabled])')
      ).filter(function (el) {
        return el.offsetParent !== null || el === document.activeElement;
      });
    }

    function openMenu() {
      menu.classList.add('open');
      if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
      if (closeBtn) closeBtn.focus();
    }

    function closeMenu() {
      menu.classList.remove('open');
      if (hamburger) {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.focus();
      }
    }

    if (hamburger) hamburger.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    document.addEventListener('keydown', function (e) {
      if (!menu.classList.contains('open')) return;

      if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault();
        closeMenu();
        return;
      }

      if (e.key === 'Tab') {
        var f = focusables();
        if (!f.length) return;
        var first = f[0];
        var last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
