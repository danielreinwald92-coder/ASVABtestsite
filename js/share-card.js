// Shareable score card. buildShareText is pure (no PII, unit-tested);
// renderAndShare draws a card to an offscreen canvas and uses the Web Share
// API with a PNG-download fallback. Everything is generated locally — nothing
// is uploaded. Consumed by the results page (js/page-results.js).
(function (root) {
  'use strict';

  var SITE = 'Mission ASVAB';

  function ordinal(n) {
    var mod100 = n % 100;
    if (mod100 >= 11 && mod100 <= 13) return n + 'th';
    switch (n % 10) {
      case 1: return n + 'st';
      case 2: return n + 'nd';
      case 3: return n + 'rd';
      default: return n + 'th';
    }
  }

  // Pure: reads ONLY mode/afqtPercentile/lineScores/dateStr. Never emits a
  // name or any other field, even if present on the result object.
  function buildShareText(result) {
    result = result || {};
    var lines = [];
    if (result.mode === 'timed' && typeof result.afqtPercentile === 'number') {
      lines.push('AFQT: ' + ordinal(result.afqtPercentile) + ' percentile');
      var ls = result.lineScores || [];
      for (var i = 0; i < ls.length && i < 3; i++) {
        if (ls[i] && ls[i].code != null && ls[i].score != null) {
          lines.push(ls[i].code + ' line score: ' + ls[i].score);
        }
      }
      return { title: 'My ASVAB practice result', lines: lines };
    }
    return {
      title: 'I practiced on ' + SITE,
      lines: ['Building toward my ASVAB goal', 'Practice test completed']
    };
  }

  function renderAndShare(result) {
    if (typeof document === 'undefined') return;
    var content = buildShareText(result);
    var size = 1080;
    var canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    var ctx = canvas.getContext && canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0a1628';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#d4a853';
    ctx.font = 'bold 64px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(SITE, size / 2, 180);

    ctx.fillStyle = '#ffffff';
    ctx.font = '40px sans-serif';
    ctx.fillText(content.title, size / 2, 300);

    ctx.font = 'bold 56px sans-serif';
    var y = 460;
    for (var i = 0; i < content.lines.length; i++) {
      ctx.fillText(content.lines[i], size / 2, y);
      y += 90;
    }

    ctx.fillStyle = '#9fb3c8';
    ctx.font = '32px sans-serif';
    if (result && result.dateStr) ctx.fillText(result.dateStr, size / 2, size - 160);
    ctx.fillText('Practice estimate - not an official score', size / 2, size - 100);

    canvas.toBlob(function (blob) {
      if (!blob) return;
      var file = null;
      try { file = new File([blob], 'mission-asvab-result.png', { type: 'image/png' }); } catch (e) { file = null; }
      if (file && navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
        navigator.share({ files: [file], title: content.title }).catch(function () { downloadBlob(blob); });
      } else {
        downloadBlob(blob);
      }
    }, 'image/png');
  }

  function downloadBlob(blob) {
    try {
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'mission-asvab-result.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    } catch (e) { /* ignore */ }
  }

  root.MissionASVABShareCard = { buildShareText: buildShareText, renderAndShare: renderAndShare };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.MissionASVABShareCard;
})(typeof window !== 'undefined' ? window : this);
