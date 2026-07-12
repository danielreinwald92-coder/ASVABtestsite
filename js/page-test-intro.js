// Page logic for test-intro.html
// Externalized from an inline <script> (CSP script-src hardening).
// Loaded at end of <body> after test-config.js / section-config.js / quiz-data.js,
// so all referenced DOM elements already exist when this runs.
(function () {
  const checkbox = document.getElementById('acknowledge');
  const startBtn = document.getElementById('startBtn');

  // Load test configuration from session storage (corrupt value → defaults).
  let testConfig = {};
  try {
    const parsed = JSON.parse(sessionStorage.getItem('testConfig') || '{}');
    if (parsed && typeof parsed === 'object') testConfig = parsed;
  } catch (_) { testConfig = {}; }
  const testType = localStorage.getItem('testType') || 'quick';
  const sections = testConfig.sections || MissionASVABConfig.getSectionsForType(testType);
  const mode = testConfig.mode === 'tutor' ? 'tutor' : 'timed';

  // Calculate actual test details from quiz data
  function loadTestInfo() {
    const details = sections.reduce((currentDetails, code) => {
      const sectionInfo = QuizManager.getSectionInfo(code);
      if (sectionInfo) {
        currentDetails.totalQuestions += sectionInfo.questionsPerTest;
        currentDetails.totalTimeSeconds += sectionInfo.timeLimit;
      }
      return currentDetails;
    }, { totalQuestions: 0, totalTimeSeconds: 0 });

    const totalTimeMinutes = Math.ceil(details.totalTimeSeconds / 60);
    const isPreset = testType === 'quick' || testType === 'full';

    if (isPreset) {
      const activeConfig = MissionASVABConfig.getTestConfig(testType);
      document.getElementById('testBadge').textContent = activeConfig.label;
      document.getElementById('sectionTitle').textContent = activeConfig.title;
      document.getElementById('sectionDesc').textContent = activeConfig.description;
      document.getElementById('sectionCode').textContent = activeConfig.sectionCode;
    } else {
      // Custom section practice — label from the actual selection.
      document.getElementById('testBadge').textContent = 'Custom Practice';
      document.getElementById('sectionTitle').textContent = sections.length === 1
        ? (QuizManager.getSectionInfo(sections[0]) || {}).name || 'Section Practice'
        : 'Custom Practice';
      document.getElementById('sectionDesc').textContent = 'Practice the sections you selected.';
      document.getElementById('sectionCode').textContent = sections.join(', ');
    }

    document.getElementById('questionCount').textContent = details.totalQuestions;
    document.getElementById('timeLimit').textContent = totalTimeMinutes;

    // Per-section plan: "122 minutes" alone misleads — the user actually gets
    // e.g. 9 minutes for WK, 55 for AR, each on its own clock.
    const plan = document.getElementById('sectionPlan');
    const planBody = document.getElementById('sectionPlanBody');
    if (plan && planBody && mode !== 'tutor' && sections.length > 1) {
      planBody.innerHTML = sections.map((code) => {
        const info = QuizManager.getSectionInfo(code);
        if (!info) return '';
        return `<tr><td>${info.name}</td><td>${info.questionsPerTest}</td><td>${Math.round(info.timeLimit / 60)}</td></tr>`;
      }).join('');
      plan.hidden = false;
    }

    if (mode === 'tutor') {
      const timeEl = document.getElementById('timeLimit');
      if (timeEl && timeEl.parentElement) timeEl.parentElement.style.display = 'none';
      const badge = document.getElementById('testBadge');
      if (badge) badge.textContent = 'Tutor Mode — Untimed';
      const rulesTimed = document.getElementById('rulesTimed');
      const rulesTutor = document.getElementById('rulesTutor');
      if (rulesTimed) rulesTimed.hidden = true;
      if (rulesTutor) rulesTutor.hidden = false;
    }
  }

  loadTestInfo();

  function updateButtonState() {
    startBtn.disabled = !checkbox.checked;
  }

  checkbox.addEventListener('change', updateButtonState);

  startBtn.addEventListener('click', () => {
    if (!startBtn.disabled) {
      window.location.href = mode === 'tutor' ? 'quiz.html?mode=tutor' : 'quiz.html';
    }
  });

  // Allow Enter key to start if ready
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !startBtn.disabled) {
      startBtn.click();
    }
  });
})();
