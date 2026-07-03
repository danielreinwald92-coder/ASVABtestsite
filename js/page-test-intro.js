// Page logic for test-intro.html
// Externalized from an inline <script> (CSP script-src hardening).
// Loaded at end of <body> after test-config.js / section-config.js / quiz-data.js,
// so all referenced DOM elements already exist when this runs.
(function () {
  const checkbox = document.getElementById('acknowledge');
  const startBtn = document.getElementById('startBtn');

  // Load test configuration from session storage
  const testConfig = JSON.parse(sessionStorage.getItem('testConfig') || '{}');
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

    if (mode === 'tutor') {
      const timeEl = document.getElementById('timeLimit');
      if (timeEl && timeEl.parentElement) timeEl.parentElement.style.display = 'none';
      const badge = document.getElementById('testBadge');
      if (badge) badge.textContent = 'Tutor Mode — Untimed';
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
