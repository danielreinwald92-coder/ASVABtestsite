// Homepage example result (index.html .report): one load sequence. CSS fills
// the bars and lands the jobs line once .play is set; this counts the numbers
// up. With reduced motion the final values simply stay as rendered.
(function () {
  const report = document.querySelector('.report');
  if (!report) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const counters = Array.from(report.querySelectorAll('[data-count]'));
  const DELAYS = [150, 1150]; // AFQT first, then the jobs count as its line lands
  counters.forEach(function (el, i) {
    const target = Number(el.getAttribute('data-count'));
    if (!Number.isFinite(target)) return;
    el.textContent = '0';
    const start = performance.now() + (DELAYS[i] || 0);
    const dur = 900;
    function tick(now) {
      const t = Math.min(1, Math.max(0, (now - start) / dur));
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
  report.classList.add('play');
})();
