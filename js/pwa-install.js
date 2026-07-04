// Dismissible PWA install prompt. Captures beforeinstallprompt, shows a custom
// banner, and remembers dismissal so it never re-nags. iOS Safari (no event)
// gets a one-line "Add to Home Screen" hint. All feature-detected and
// storage-safe. Wired from js/page-dashboard.js via MissionASVABInstall.init.
(function (root) {
  'use strict';

  var DISMISS_KEY = 'missionasvab.sp3.installDismissed';

  function dismissed() {
    try { return window.localStorage.getItem(DISMISS_KEY) === '1'; } catch (e) { return false; }
  }
  function setDismissed() {
    try { window.localStorage.setItem(DISMISS_KEY, '1'); } catch (e) { /* ignore */ }
  }

  function isStandalone() {
    try {
      return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
        window.navigator.standalone === true;
    } catch (e) { return false; }
  }

  function isIOS() {
    return /iP(hone|ad|od)/.test(window.navigator.userAgent || '') && !window.MSStream;
  }

  function init(banner) {
    if (!banner || typeof document === 'undefined') return;
    if (dismissed() || isStandalone()) return;

    var deferred = null;

    function show(html) {
      banner.innerHTML = '';
      var msg = document.createElement('span');
      msg.className = 'install-banner-text';
      msg.textContent = html;
      banner.appendChild(msg);

      if (deferred) {
        var installBtn = document.createElement('button');
        installBtn.type = 'button';
        installBtn.className = 'install-banner-btn';
        installBtn.textContent = 'Install';
        installBtn.addEventListener('click', function () {
          banner.hidden = true;
          deferred.prompt();
          if (deferred.userChoice && deferred.userChoice.then) {
            deferred.userChoice.then(function () { deferred = null; });
          }
        });
        banner.appendChild(installBtn);
      }

      var closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'install-banner-dismiss';
      closeBtn.setAttribute('aria-label', 'Dismiss');
      closeBtn.textContent = 'Not now';
      closeBtn.addEventListener('click', function () {
        setDismissed();
        banner.hidden = true;
      });
      banner.appendChild(closeBtn);

      banner.hidden = false;
    }

    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      deferred = e;
      if (!dismissed()) show('Add Mission ASVAB to your home screen for quick practice.');
    });

    window.addEventListener('appinstalled', function () {
      setDismissed();
      banner.hidden = true;
    });

    // iOS never fires beforeinstallprompt; offer a manual hint once.
    if (isIOS()) {
      show('Add Mission ASVAB to your home screen: tap Share, then Add to Home Screen.');
    }
  }

  root.MissionASVABInstall = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.MissionASVABInstall;
})(typeof window !== 'undefined' ? window : this);
