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
  sessionStorage.removeItem('quizState');
  sessionStorage.removeItem('generatedTest');
  sessionStorage.removeItem('testConfig');

  const nameInput = document.getElementById('userName');
  const startBtn = document.getElementById('startBtn');
  const picker = document.getElementById('sectionPicker');
  const summary = document.getElementById('pickerSummary');
  const tutorEl = document.getElementById('tutorToggle');

  const savedName = localStorage.getItem('asvabUserName');
  if (savedName) nameInput.value = savedName;

  // Selection state: a Set of section codes. Start from the quick preset.
  const selected = new Set(MissionASVABConfig.getSectionsForType('quick'));

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
    const type = deriveTestType(ordered);
    document.querySelectorAll('.test-type-card').forEach((c) => {
      const isMatch = (type === 'quick' && c.dataset.type === 'quick') ||
        (type === 'full' && c.dataset.type === 'full');
      c.classList.toggle('selected', isMatch);
      c.setAttribute('aria-checked', isMatch ? 'true' : 'false');
    });
    updateSummaryAndButton();
  }

  function updateSummaryAndButton() {
    const ordered = orderSections(Array.from(selected));
    let q = 0, secs = 0;
    ordered.forEach((code) => {
      const info = QuizManager.getSectionInfo(code) || {};
      q += info.questionsPerTest || 0;
      secs += info.timeLimit || 0;
    });
    const tutor = tutorEl && tutorEl.checked;
    const timeStr = tutor ? 'untimed' : `${Math.ceil(secs / 60)} min`;
    summary.textContent = ordered.length
      ? `Selected: ${ordered.length} section${ordered.length > 1 ? 's' : ''} · ${q}q · ${timeStr}`
      : 'Select at least one section to begin.';

    const nameValid = nameInput.value.trim().length >= 2;
    startBtn.disabled = !nameValid || ordered.length === 0;
    startBtn.textContent = ordered.length ? `Start Practice (${q} questions)` : 'Start Practice';
  }

  // Preset cards set the selection to that preset's sections.
  document.querySelectorAll('.test-type-card').forEach((card) => {
    card.setAttribute('role', 'radio');
    card.setAttribute('tabindex', '0');
    const choose = () => {
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
    localStorage.setItem('testType', deriveTestType(ordered));

    sessionStorage.removeItem('quizState');
    sessionStorage.removeItem('generatedTest');
    const mode = tutorEl && tutorEl.checked ? 'tutor' : 'timed';
    sessionStorage.setItem('testConfig', JSON.stringify({ sections: ordered, mode: mode }));

    window.location.href = 'test-intro.html';
  });
})();
