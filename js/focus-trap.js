/*
 * focus-trap.js — shared modal focus management.
 *
 * FocusTrap.activate(modalEl, opts) — call after a modal is shown:
 *   - remembers the element that had focus (opts.trigger, else the current
 *     activeElement) so it can be restored later;
 *   - moves focus into the modal (opts.initialFocus, else first focusable);
 *   - traps Tab/Shift+Tab within the modal while it is open;
 *   - on Escape, calls opts.onEscape() if given, otherwise releases the trap.
 *
 * FocusTrap.release(modalEl) — call when the modal is hidden: removes the
 *   keydown listener and restores focus to the remembered trigger.
 *
 * Declared as a top-level `var` (no IIFE wrapper around the export) so the same
 * file works as a browser global AND inside the test runner's vm sandbox.
 */
var FocusTrap = (function () {
  var FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), ' +
    'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function focusables(container) {
    return Array.prototype.slice.call(container.querySelectorAll(FOCUSABLE))
      .filter(function (el) {
        // Visible, or the currently-focused element (jsdom has no layout, so
        // offsetParent is null there — the activeElement fallback keeps tests
        // and real browsers consistent).
        return el.offsetParent !== null || el === document.activeElement;
      });
  }

  function activate(modalEl, opts) {
    opts = opts || {};
    if (!modalEl) return;

    // If re-activated while already open (e.g. content re-rendered in place),
    // drop the stale listener but keep the original trigger to restore focus to.
    if (modalEl.__ftKeydown) {
      document.removeEventListener('keydown', modalEl.__ftKeydown);
      modalEl.__ftKeydown = null;
    }
    modalEl.__ftTrigger = modalEl.__ftTrigger || opts.trigger || document.activeElement;

    var initial = opts.initialFocus || focusables(modalEl)[0];
    if (initial && initial.focus) initial.focus();

    function onKeydown(e) {
      if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault();
        if (typeof opts.onEscape === 'function') opts.onEscape();
        else release(modalEl);
        return;
      }
      if (e.key === 'Tab') {
        var f = focusables(modalEl);
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
    }

    modalEl.__ftKeydown = onKeydown;
    document.addEventListener('keydown', onKeydown);
  }

  function release(modalEl) {
    if (!modalEl) return;
    if (modalEl.__ftKeydown) {
      document.removeEventListener('keydown', modalEl.__ftKeydown);
      modalEl.__ftKeydown = null;
    }
    var trigger = modalEl.__ftTrigger;
    modalEl.__ftTrigger = null;
    if (trigger && trigger.focus) {
      // A clicked table row may not be natively focusable; make it programmatically
      // focusable so focus can return to where the modal was opened from.
      if (trigger.tabIndex < 0 && !trigger.hasAttribute('tabindex')) {
        trigger.setAttribute('tabindex', '-1');
      }
      trigger.focus();
    }
  }

  return { activate: activate, release: release, focusables: focusables };
})();
