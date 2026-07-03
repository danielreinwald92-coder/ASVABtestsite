// Page logic for select-test.html
// Externalized from an inline <script> (CSP script-src hardening).
// Loaded at end of <body> after test-config.js / section-config.js / quiz-data.js.
(function () {
  // Clear any previous test session when visiting this page
  // This ensures users always get a fresh test
  sessionStorage.removeItem('quizState');
  sessionStorage.removeItem('generatedTest');
  sessionStorage.removeItem('testConfig');

  let selectedType = 'quick';
  const nameInput = document.getElementById('userName');
  const startBtn = document.getElementById('startBtn');
  const quickSections = document.getElementById('quickSections');
  const fullSections = document.getElementById('fullSections');

  // Load saved name
  const savedName = localStorage.getItem('asvabUserName');
  if (savedName) nameInput.value = savedName;

  // Test type selection
  function selectTestTypeCard(card) {
    document.querySelectorAll('.test-type-card').forEach(c => {
      c.classList.remove('selected');
      c.setAttribute('aria-checked', 'false');
    });
    card.classList.add('selected');
    card.setAttribute('aria-checked', 'true');
    selectedType = card.dataset.type;

    // Toggle section display
    if (selectedType === 'full') {
      quickSections.style.display = 'none';
      fullSections.style.display = 'block';
    } else {
      quickSections.style.display = 'block';
      fullSections.style.display = 'none';
    }
    updateStartButton();
  }

  document.querySelectorAll('.test-type-card').forEach(card => {
    // Make the clickable cards keyboard-operable
    card.setAttribute('role', 'radio');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-checked', card.classList.contains('selected') ? 'true' : 'false');
    card.addEventListener('click', () => selectTestTypeCard(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        selectTestTypeCard(card);
      }
    });
  });

  // Name input
  nameInput.addEventListener('input', updateStartButton);

  function updateStartButton() {
    const nameValid = nameInput.value.trim().length >= 2;
    startBtn.disabled = !nameValid;

    if (selectedType === 'full') {
      const details = MissionASVABConfig.getTestDetails('full', QuizManager);
      startBtn.textContent = `${MissionASVABConfig.getTestConfig('full').startButtonText} (${details.totalQuestions} questions)`;
    } else {
      const details = MissionASVABConfig.getTestDetails('quick', QuizManager);
      startBtn.textContent = `${MissionASVABConfig.getTestConfig('quick').startButtonText} (${details.totalQuestions} questions)`;
    }
  }

  // Initial update
  updateStartButton();

  // Start test
  startBtn.addEventListener('click', () => {
    if (startBtn.disabled) return;

    localStorage.setItem('asvabUserName', nameInput.value.trim());
    localStorage.setItem('testType', selectedType);

    // Clear any previous test state and set up new test
    sessionStorage.removeItem('quizState');
    sessionStorage.removeItem('generatedTest');

    // Store test configuration
    const sections = MissionASVABConfig.getSectionsForType(selectedType);
    const tutorEl = document.getElementById('tutorToggle');
    const mode = tutorEl && tutorEl.checked ? 'tutor' : 'timed';
    sessionStorage.setItem('testConfig', JSON.stringify({ sections: sections, mode: mode }));

    window.location.href = 'test-intro.html';
  });
})();
