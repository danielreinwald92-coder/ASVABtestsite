// Top ad banner (Google AdSense). Does nothing until both IDs are set, so the
// banner and its note stay hidden. To turn ads on: paste the publisher ID
// (ca-pub-...) and the display-ad slot ID from AdSense below, add ads.txt at
// the site root, and turn OFF "Auto ads" in AdSense so Google doesn't insert
// extra ads elsewhere. Slot markup comes from scripts/sync-site-chrome.js.
(function () {
  'use strict';
  var ADSENSE_CLIENT = ''; // e.g. 'ca-pub-1234567890123456'
  var ADSENSE_SLOT = '';   // e.g. '1234567890'

  var box = document.querySelector('[data-ad-top]');
  if (!box || !ADSENSE_CLIENT || !ADSENSE_SLOT) return;
  var slot = box.querySelector('.ad-top-slot');
  if (!slot) return;

  var ins = document.createElement('ins');
  ins.className = 'adsbygoogle';
  ins.style.display = 'block';
  ins.setAttribute('data-ad-client', ADSENSE_CLIENT);
  ins.setAttribute('data-ad-slot', ADSENSE_SLOT);
  ins.setAttribute('data-ad-format', 'horizontal');
  ins.setAttribute('data-full-width-responsive', 'true');
  slot.appendChild(ins);

  var s = document.createElement('script');
  s.async = true;
  s.crossOrigin = 'anonymous';
  s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(ADSENSE_CLIENT);
  // Show the reserved space now (no layout jump when the ad arrives); if the
  // ad script is blocked or offline, collapse the whole banner and its note.
  box.hidden = false;
  s.onerror = function () { box.hidden = true; };
  document.head.appendChild(s);
  (window.adsbygoogle = window.adsbygoogle || []).push({});
})();
