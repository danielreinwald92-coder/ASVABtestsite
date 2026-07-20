// Page logic for select-test.html (SP2 practice hub)
// Externalized from an inline <script> (CSP script-src hardening).
// Loaded at end of <body> after test-config.js / section-config.js / quiz-data.js.

// --- Pure helpers (unit-tested) ---------------------------------------------

// Canonical section order = the full-test order. Filtering it keeps any custom
// selection in the order getTestTypeFromSections expects (it is order-sensitive).
function orderSections(selected) {
  const canonical = MissionASVABConfig.getSectionsForType('full');
  const set = new Set(selected);
  return canonical.filter((code) => set.has(code));
}

// Map an ordered section list to the localStorage testType used by test-intro:
// quick (AFQT four) / full (all eight) / custom (anything else).
function deriveTestType(orderedSections) {
  const t = MissionASVABConfig.getTestTypeFromSections(orderedSections);
  if (t === 'afqt') return 'quick';
  if (t === 'full') return 'full';
  return 'custom';
}

// --- Page wiring ------------------------------------------------------------

(function () {
  // An in-progress test (this tab) gets a resume banner instead of a silent
  // wipe — starting a new test still clears it (see the start handler).
  const clearInProgress = () => {
    sessionStorage.removeItem('quizState');
    sessionStorage.removeItem('generatedTest');
    sessionStorage.removeItem('testConfig');
  };
  const resumeBanner = document.getElementById('resumeBanner');
  const hasInProgress = sessionStorage.getItem('quizState') &&
    sessionStorage.getItem('generatedTest') && sessionStorage.getItem('testConfig');
  if (hasInProgress && resumeBanner) {
    resumeBanner.hidden = false;
    document.getElementById('resumeBtn').addEventListener('click', () => {
      window.location.href = 'quiz.html';
    });
    document.getElementById('discardBtn').addEventListener('click', () => {
      clearInProgress();
      resumeBanner.hidden = true;
    });
  } else {
    clearInProgress();
  }

  const nameInput = document.getElementById('userName');
  const startBtn = document.getElementById('startBtn');
  const picker = document.getElementById('sectionPicker');
  const summary = document.getElementById('pickerSummary');
  const tutorEl = document.getElementById('tutorToggle');
  const tutorLabel = document.getElementById('tutorToggleLabel');

  const savedName = localStorage.getItem('asvabUserName');
  if (savedName) nameInput.value = savedName;

  // Selection state: start new students on the short diagnostic. Once a
  // checkbox is edited, the selection becomes custom instead of a preset.
  let activePreset = 'diagnostic';
  const selected = new Set(MissionASVABConfig.getSectionsForType(activePreset));

  // Build the section-picker rows from SECTION_CONFIG (full-test order).
  const allCodes = MissionASVABConfig.getSectionsForType('full');
  picker.innerHTML = allCodes.map((code) => {
    const info = QuizManager.getSectionInfo(code) || {};
    const mins = Math.round((info.timeLimit || 0) / 60);
    return `
      <label class="picker-row" data-code="${code}">
        <input type="checkbox" data-code="${code}">
        <span class="picker-name">${info.name || code}</span>
        <span class="picker-meta">${info.questionsPerTest || 0}q · ${mins}m</span>
      </label>`;
  }).join('');

  function syncPickerUI() {
    picker.querySelectorAll('.picker-row').forEach((row) => {
      const code = row.dataset.code;
      const box = row.querySelector('input');
      const on = selected.has(code);
      box.checked = on;
      row.classList.toggle('checked', on);
    });
    // Reflect selection on the preset cards.
    const ordered = orderSections(Array.from(selected));
    document.querySelectorAll('.test-type-card').forEach((c) => {
      const derived = deriveTestType(ordered);
      const isMatch = activePreset
        ? c.dataset.type === activePreset
        : ((derived === 'quick' && c.dataset.type === 'quick') ||
          (derived === 'full' && c.dataset.type === 'full'));
      c.classList.toggle('selected', isMatch);
      c.setAttribute('aria-checked', isMatch ? 'true' : 'false');
    });
    const isDiagnostic = activePreset === 'diagnostic';
    if (tutorEl) {
      if (isDiagnostic) tutorEl.checked = false;
      tutorEl.disabled = isDiagnostic;
    }
    if (tutorLabel) tutorLabel.classList.toggle('disabled', isDiagnostic);
    updateSummaryAndButton();
  }

  function updateSummaryAndButton() {
    const ordered = orderSections(Array.from(selected));
    let q = 0, secs = 0;
    ordered.forEach((code) => {
      const canResolvePresetSettings = typeof MissionASVABConfig.getSectionSettings === 'function';
      const info = activePreset && canResolvePresetSettings
        ? (MissionASVABConfig.getSectionSettings(activePreset, code, QuizManager) || {})
        : (QuizManager.getSectionInfo(code) || {});
      q += info.questionsPerTest || 0;
      secs += info.timeLimit || 0;
    });
    const tutor = tutorEl && tutorEl.checked;
    const timeStr = tutor ? 'untimed' : `${Math.ceil(secs / 60)} min`;
    const nameValid = nameInput.value.trim().length >= 2;
    summary.textContent = ordered.length
      ? `Selected: ${ordered.length} section${ordered.length > 1 ? 's' : ''} · ${q}q · ${timeStr}` +
        (nameValid ? '' : ' — enter your name above to start')
      : 'Select at least one section to begin.';
    startBtn.disabled = !nameValid || ordered.length === 0;
    const presetConfig = activePreset && typeof MissionASVABConfig.getTestConfig === 'function'
      ? MissionASVABConfig.getTestConfig(activePreset) : null;
    startBtn.textContent = ordered.length
      ? (presetConfig ? presetConfig.startButtonText : `Start Practice (${q} questions)`)
      : 'Start Practice';
  }

  // Preset cards set the selection to that preset's sections.
  document.querySelectorAll('.test-type-card').forEach((card) => {
    card.setAttribute('role', 'radio');
    card.setAttribute('tabindex', '0');
    const choose = () => {
      activePreset = card.dataset.type;
      selected.clear();
      MissionASVABConfig.getSectionsForType(card.dataset.type).forEach((c) => selected.add(c));
      syncPickerUI();
    };
    card.addEventListener('click', choose);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); choose(); }
    });
  });

  // Checkbox toggles edit the custom selection.
  picker.addEventListener('change', (e) => {
    const box = e.target.closest('input[data-code]');
    if (!box) return;
    const code = box.dataset.code;
    activePreset = null;
    if (box.checked) selected.add(code); else selected.delete(code);
    syncPickerUI();
  });

  nameInput.addEventListener('input', updateSummaryAndButton);
  if (tutorEl) tutorEl.addEventListener('change', updateSummaryAndButton);

  syncPickerUI();

  startBtn.addEventListener('click', () => {
    if (startBtn.disabled) return;
    const ordered = orderSections(Array.from(selected));
    if (!ordered.length) return;

    localStorage.setItem('asvabUserName', nameInput.value.trim());
    const testType = activePreset || deriveTestType(ordered);
    localStorage.setItem('testType', testType);

    sessionStorage.removeItem('quizState');
    sessionStorage.removeItem('generatedTest');
    const mode = testType !== 'diagnostic' && tutorEl && tutorEl.checked ? 'tutor' : 'timed';
    const presetConfig = activePreset && typeof MissionASVABConfig.getTestConfig === 'function'
      ? MissionASVABConfig.getTestConfig(activePreset) : null;
    sessionStorage.setItem('testConfig', JSON.stringify({
      type: testType,
      sections: ordered,
      mode: mode,
      sectionOverrides: presetConfig && presetConfig.sectionOverrides ? presetConfig.sectionOverrides : null
    }));

    window.location.href = 'test-intro.html';
  });
})();
