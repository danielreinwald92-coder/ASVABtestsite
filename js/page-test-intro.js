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

    const activeConfig = MissionASVABConfig.getTestConfig(testType);
    const totalTimeMinutes = Math.ceil(details.totalTimeSeconds / 60);

    document.getElementById('testBadge').textContent = activeConfig.label;
    document.getElementById('sectionTitle').textContent = activeConfig.title;
    document.getElementById('sectionDesc').textContent = activeConfig.description;
    document.getElementById('sectionCode').textContent = activeConfig.sectionCode;

    document.getElementById('questionCount').textContent = details.totalQuestions;
    document.getElementById('timeLimit').textContent = totalTimeMinutes;
  }

  loadTestInfo();

  function updateButtonState() {
    startBtn.disabled = !checkbox.checked;
  }

  checkbox.addEventListener('change', updateButtonState);

  startBtn.addEventListener('click', () => {
    if (!startBtn.disabled) {
      window.location.href = 'quiz.html';
    }
  });

  // Allow Enter key to start if ready
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !startBtn.disabled) {
      startBtn.click();
    }
  });
})();
