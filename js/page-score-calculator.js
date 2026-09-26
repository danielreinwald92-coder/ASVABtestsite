// Page logic for asvab-score-calculator.html. Pure math lives in
// js/score-calculator.js; this file only reads the form and renders results.
(function () {
  const C = window.MissionASVABScoreCalculator;
  const form = document.getElementById('calcForm');
  const out = document.getElementById('calcResult');
  const fillBtn = document.getElementById('calcFillPractice');
  if (!C || !form || !out) return;

  const CODES = ['AR', 'MK', 'WK', 'PC', 'VE', 'GS', 'EI', 'AS', 'MC'];
  const NAMES = {
    AR: 'Arithmetic Reasoning', MK: 'Mathematics Knowledge', VE: 'Verbal Expression (or WK and PC)'
  };
  const LINE_NAMES = {
    GT: 'General Technical', CL: 'Clerical', CO: 'Combat', EL: 'Electronics', FA: 'Field Artillery',
    GM: 'General Maintenance', MM: 'Mechanical Maintenance', OF: 'Operators and Food',
    SC: 'Surveillance and Communications', ST: 'Skilled Technical'
  };

  function readInputs() {
    const inputs = {};
    CODES.forEach((code) => {
      const el = form.elements[code];
      const raw = el ? el.value.trim() : '';
      inputs[code] = raw === '' ? NaN : Math.round(Number(raw));
    });
    return inputs;
  }

  function render(result) {
    if (!result.ok) {
      if (jobsSection) jobsSection.hidden = true;
      out.innerHTML = '<p class="calc-error"></p>';
      out.firstChild.textContent = 'Enter a standard score from ' + C.MIN_SS + ' to ' + C.MAX_SS + ' for: ' +
        result.missing.map((c) => NAMES[c] || c).join(', ') + '.';
      return;
    }
    const pct = result.percentile;
    let html = '<div class="calc-headline">' +
      '<div class="calc-stat"><span class="v">' + pct + '</span><span class="l">AFQT percentile</span></div>' +
      '<div class="calc-stat"><span class="v">' + C.afqtCategory(pct) + '</span><span class="l">AFQT category</span></div>' +
      '<div class="calc-stat"><span class="v">' + result.afqts + '</span><span class="l">AFQT raw score (AR + MK + 2 × VE, with VE = ' + result.ve + ')</span></div>' +
      '</div>';
    if (result.lineScores) {
      html += '<table class="score-table"><thead><tr><th>Line score</th><th>Score</th></tr></thead><tbody>' +
        Object.keys(LINE_NAMES).map((k) => '<tr><td>' + k + ' - ' + LINE_NAMES[k] + '</td><td>' + result.lineScores[k] + '</td></tr>').join('') +
        '</tbody></table>';
    } else {
      html += '<p class="calc-note">Add GS, EI, AS, and MC to see all 10 Army line scores.</p>';
    }
    const J = window.MissionASVABJobs;
    if (J) {
      html += '<p class="calc-note">Minimum AFQT to enlist: ' +
        J.ORDER.map((k) => J.BRANCHES[k].name + ' ' + J.BRANCHES[k].afqtMin).join(', ') +
        '. Minimums change, so confirm with a recruiter.</p>';
    }
    out.innerHTML = html;
    renderJobs(result);
  }

  // Job matches for the entered scores (js/options-view.js).
  const jobsSection = document.getElementById('calcJobs');
  const jobsView = document.getElementById('calcJobsView');
  function renderJobs(result) {
    const V = window.MissionASVABOptionsView;
    if (!V || !jobsSection || !jobsView) return;
    const inputs = readInputs();
    const ss = { AR: inputs.AR, MK: inputs.MK, WK: inputs.WK, PC: inputs.PC, VE: result.ve };
    ['GS', 'EI', 'AS', 'MC'].forEach((c) => {
      if (Number.isFinite(inputs[c]) && inputs[c] >= C.MIN_SS && inputs[c] <= C.MAX_SS) ss[c] = inputs[c];
    });
    const full = ['GS', 'EI', 'AS', 'MC'].every((c) => Number.isFinite(ss[c]));
    jobsView.innerHTML = V.render({ ss, afqt: result.percentile, full }, { filterId: 'calcJobFilter' }).html;
    V.bind(jobsView);
    jobsSection.hidden = false;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    render(C.calculate(readInputs()));
  });

  // Offer the most recent practice result's per-section standard scores.
  let practice = null;
  try {
    const r = JSON.parse(localStorage.getItem('quizResults') || 'null');
    if (r && r.sectionResults) {
      const ss = {};
      Object.keys(r.sectionResults).forEach((code) => {
        const v = r.sectionResults[code] && r.sectionResults[code].ss;
        if (Number.isFinite(v)) ss[code] = v;
      });
      if (['AR', 'MK', 'WK', 'PC'].every((c) => Number.isFinite(ss[c]))) practice = ss;
    }
  } catch (_) { practice = null; }

  if (practice && fillBtn) {
    fillBtn.hidden = false;
    fillBtn.addEventListener('click', () => {
      CODES.forEach((code) => {
        const el = form.elements[code];
        if (el) el.value = Number.isFinite(practice[code]) ? String(Math.round(practice[code])) : '';
      });
      render(C.calculate(readInputs()));
    });
  }
})();
