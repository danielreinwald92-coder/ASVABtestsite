// Page logic for results.html
// Externalized from an inline <script> (CSP script-src hardening).
// Functions stay top-level (not IIFE-wrapped) so unit tests can invoke them
// directly. Inline on* attributes were replaced with addEventListener wiring
// at the end of this file.
// Loaded at end of <body> after js/auth.js, js/test-config.js, js/scoring.js.
function loadResults() {
  try {
    const resultsRaw = localStorage.getItem('quizResults');

    if (!resultsRaw) {
      document.getElementById('scoreMessage').textContent = 'No results found';
      document.getElementById('scoreDescription').textContent = 'Please take a practice test first.';
      return;
    }

    const results = JSON.parse(resultsRaw);
    console.log('Parsed results:', results);

    const userName = localStorage.getItem('asvabUserName') || 'Test Taker';

    if (!results || typeof results !== 'object') {
      document.getElementById('scoreMessage').textContent = 'Invalid results data';
      document.getElementById('scoreDescription').textContent = 'Please retake the practice test.';
      return;
    }

  document.getElementById('userName').textContent = userName;

  // Handle null AFQT (single section tests): show practice score, not a percentile
  const hasAFQT = typeof results.afqt === 'number';
  const displayScore = hasAFQT ? results.afqt : (results.score || 0);
  document.getElementById('afqtScore').textContent = displayScore;
  if (hasAFQT) {
    document.getElementById('afqtLabel').textContent = 'Estimated AFQT Score';
    document.getElementById('afqtPercentile').textContent = `${results.afqt}${getOrdinalSuffix(results.afqt)} Percentile`;
  } else {
    document.getElementById('afqtLabel').textContent = 'Practice Score';
    document.getElementById('afqtPercentile').textContent = `${results.score}% Correct — single-section practice, not an AFQT estimate`;
  }
  document.getElementById('correctCount').textContent = results.correct || 0;
  document.getElementById('incorrectCount').textContent = results.incorrect || 0;

  const minutes = Math.floor(results.timeUsed / 60);
  const seconds = results.timeUsed % 60;
  document.getElementById('timeUsed').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  // AFQT-based messaging only when we have a real AFQT estimate.
  // For single-section practice, use raw % with neutral copy (no eligibility claims).
  const afqt = hasAFQT ? results.afqt : results.score;
  let message, description;

  if (!hasAFQT) {
    if (afqt >= 80) {
      message = "Strong Section Practice";
      description = "Great work on this section. Take a full AFQT practice test to see your estimated enlistment score.";
    } else if (afqt >= 60) {
      message = "Solid Progress";
      description = "Good practice on this section. Review the topics below and try a full AFQT practice test next.";
    } else {
      message = "Keep Practicing";
      description = "Review the study guide for this section, then try again. A full AFQT practice test will give you an estimated enlistment score.";
    }
  } else if (afqt >= 93) {
    message = "Outstanding Performance!";
    description = "You're in the top tier! You qualify for virtually all military occupations. Contact a recruiter to schedule your official test.";
  } else if (afqt >= 65) {
    message = "Excellent Work!";
    description = "You're well above the minimum requirements and qualify for many career fields. A recruiter can help you explore your options.";
  } else if (afqt >= 50) {
    message = "Great Job!";
    description = "You're above average and eligible for enlistment. A recruiter can discuss which jobs match your score.";
  } else if (afqt >= 31) {
    message = "You're Eligible!";
    description = "You meet the minimum AFQT requirement for enlistment. A recruiter can explain your options and help you prepare for the official test.";
  } else if (afqt >= 21) {
    message = "Almost There";
    description = "You're close to the minimum score of 31. Focus on the sections below and retake the practice test.";
  } else {
    message = "Keep Practicing";
    description = "Review the study guide and focus on the sections marked below. You can improve with dedicated practice.";
  }

  document.getElementById('scoreMessage').textContent = message;
  document.getElementById('scoreDescription').textContent = description;

  // Update recruiter section messaging only when we have a real AFQT estimate
  if (hasAFQT && afqt >= 31) {
    document.querySelector('.recruiter-content h3').textContent = "Ready to Take the Next Step?";
    document.querySelector('.recruiter-content p').textContent = "Connect with a recruiter to schedule your official ASVAB and discuss career opportunities that match your score.";
  }

  // Render section breakdown
  renderSectionBreakdown(results.sectionResults);

  // Render line scores for full tests
  if (results.testType === 'full') {
    renderLineScores(results.sectionResults);
  }

  // Render answer review
  renderAnswerReview(results.sectionResults);

  } catch (error) {
    console.error('Error loading results:', error);
    document.getElementById('scoreMessage').textContent = 'Error loading results';
    document.getElementById('scoreDescription').textContent = 'Please try taking the test again. Error: ' + error.message;
  }
}

function renderSectionBreakdown(sectionResults) {
  if (!sectionResults || Object.keys(sectionResults).length === 0) return;

  const container = document.getElementById('sectionBreakdown');
  const grid = document.getElementById('breakdownGrid');

  container.style.display = 'block';

  const sectionNames = {
    'AR': 'Arithmetic Reasoning',
    'WK': 'Word Knowledge',
    'PC': 'Paragraph Comprehension',
    'MK': 'Mathematics Knowledge',
    'GS': 'General Science',
    'AS': 'Auto & Shop',
    'MC': 'Mechanical Comprehension',
    'EI': 'Electronics Information'
  };

  let html = '';
  for (const [code, data] of Object.entries(sectionResults)) {
    const percent = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
    const needsWork = percent < 70;
    const statusClass = needsWork ? 'needs-work' : 'good';
    const name = sectionNames[code] || data.name || code;

    html += `
      <div class="breakdown-item ${statusClass}">
        <span class="breakdown-section-name">${name}</span>
        <span class="breakdown-score">${data.correct} of ${data.total} correct</span>
        <div class="breakdown-bar">
          <div class="breakdown-fill" style="width: ${percent}%"></div>
        </div>
      </div>
    `;
  }

  grid.innerHTML = html;
}

function renderLineScores(sectionResults) {
  if (!sectionResults) return;

  const container = document.getElementById('lineScores');
  const grid = document.getElementById('lineScoresGrid');

  const lineScores = MissionASVABScoring.calculateLineScores(sectionResults);
  if (!lineScores) return;

  container.style.display = 'block';

  let html = '';
  for (const [code, data] of Object.entries(lineScores)) {
    // Skip if score is 0 (missing required sections)
    if (data.score === 0) continue;


    const scoreClass = data.score >= 110 ? 'high' : data.score >= 90 ? 'medium' : 'low';
    html += `
      <div class="line-score-card ${scoreClass}">
        <div class="line-score-code">${code}</div>
        <div class="line-score-value">${data.score}</div>
        <div class="line-score-name">${data.name}</div>
      </div>
    `;
  }

  grid.innerHTML = html;
}

let allReviewQuestions = [];

function renderAnswerReview(sectionResults) {
  if (!sectionResults || Object.keys(sectionResults).length === 0) return;

  const container = document.getElementById('answerReview');
  const list = document.getElementById('reviewQuestionsList');

  container.style.display = 'block';

  const sectionNames = {
    'AR': 'Arithmetic Reasoning',
    'WK': 'Word Knowledge',
    'PC': 'Paragraph Comprehension',
    'MK': 'Mathematics Knowledge',
    'GS': 'General Science',
    'AS': 'Auto & Shop',
    'MC': 'Mechanical Comprehension',
    'EI': 'Electronics Information'
  };

  const letters = ['A', 'B', 'C', 'D'];
  allReviewQuestions = [];
  let questionNum = 1;

  for (const [code, data] of Object.entries(sectionResults)) {
    if (!data.questions) continue;

    data.questions.forEach(q => {
      allReviewQuestions.push({
        num: questionNum++,
        section: code,
        sectionName: sectionNames[code] || code,
        ...q
      });
    });
  }

  renderFilteredQuestions('all');

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderFilteredQuestions(e.target.dataset.filter);
    });
  });
}

function renderFilteredQuestions(filter) {
  const list = document.getElementById('reviewQuestionsList');
  const letters = ['A', 'B', 'C', 'D'];

  let filtered = allReviewQuestions;
  if (filter === 'incorrect') {
    filtered = allReviewQuestions.filter(q => !q.isCorrect);
  } else if (filter === 'correct') {
    filtered = allReviewQuestions.filter(q => q.isCorrect);
  }

  if (filtered.length === 0) {
    list.innerHTML = `<div class="no-questions-message">No ${filter === 'incorrect' ? 'incorrect' : 'correct'} answers to show.</div>`;
    return;
  }

  let html = '';
  filtered.forEach(q => {
    const statusClass = q.isCorrect ? 'correct' : 'incorrect';
    const statusText = q.isCorrect ? 'Correct' : 'Incorrect';

    html += `
      <div class="review-question ${statusClass}">
        <div class="review-question-header">
          <span class="review-question-number">${q.sectionName} - Question ${q.num}</span>
          <span class="review-question-status ${statusClass}">${statusText}</span>
        </div>
        <div class="review-question-text">${q.text}</div>
        <div class="review-options">
    `;

    q.options.forEach((opt, idx) => {
      let optionClass = '';
      let indicator = '';

      if (idx === q.correctAnswer) {
        optionClass = 'correct-answer';
        indicator = '✓ Correct';
      }
      if (idx === q.userAnswer && !q.isCorrect) {
        optionClass = 'user-answer incorrect';
        indicator = '✗ Your answer';
      } else if (idx === q.userAnswer && q.isCorrect) {
        optionClass = 'correct-answer';
        indicator = '✓ Your answer';
      }

      html += `
        <div class="review-option ${optionClass}">
          <span class="option-letter">${letters[idx]}</span>
          <span class="option-text">${opt}</span>
          ${indicator ? `<span class="option-indicator">${indicator}</span>` : ''}
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
  });

  list.innerHTML = html;
}

function toggleAnswerReview() {
  const list = document.getElementById('reviewQuestionsList');
  const btn = document.getElementById('reviewToggleBtn');

  if (list.classList.contains('visible')) {
    list.classList.remove('visible');
    btn.textContent = 'Show All Answers ▼';
  } else {
    list.classList.add('visible');
    btn.textContent = 'Hide Answers ▲';
  }
}

function getOrdinalSuffix(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

document.addEventListener('DOMContentLoaded', loadResults);

// Show auth-appropriate CTA
getSession().then(session => {
  if (session) {
    document.getElementById('dashboardBtn').style.display = 'inline-flex';
    document.getElementById('homeBtn').style.display = 'none';
    checkPendingResultSync();
  } else {
    document.getElementById('signupBtn').style.display = 'inline-flex';
  }
});

function checkPendingResultSync() {
  const raw = localStorage.getItem('pendingTestResult');
  if (!raw) return;
  let pending;
  try { pending = JSON.parse(raw); } catch (_) { localStorage.removeItem('pendingTestResult'); return; }
  if (!pending || !pending.payload) { localStorage.removeItem('pendingTestResult'); return; }
  showSaveBanner('Your results could not be saved to your account. Click retry to try again.');
  document.getElementById('retrySaveBtn').onclick = async () => {
    const btn = document.getElementById('retrySaveBtn');
    btn.disabled = true; btn.textContent = 'Retrying...';
    try {
      const { error } = await getClient().from('test_results').insert(pending.payload);
      if (error) {
        showSaveBanner('Retry failed: ' + error.message);
        btn.disabled = false; btn.textContent = 'Retry';
      } else {
        localStorage.removeItem('pendingTestResult');
        document.getElementById('saveStatusBanner').style.display = 'none';
      }
    } catch (err) {
      showSaveBanner('Retry failed: ' + (err.message || 'Network error'));
      btn.disabled = false; btn.textContent = 'Retry';
    }
  };
}

function showSaveBanner(text) {
  document.getElementById('saveStatusText').textContent = text;
  document.getElementById('saveStatusBanner').style.display = 'block';
}

function toggleRecruiterForm() {
  const form = document.getElementById('recruiterForm');
  const btn = document.querySelector('.recruiter-toggle');
  if (form.style.display === 'none') {
    form.style.display = 'block';
    btn.textContent = 'Hide Form';
  } else {
    form.style.display = 'none';
    btn.textContent = 'Connect with a Recruiter';
  }
}

function submitRecruiterRequest(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('.form-submit');

  // Honeypot: real users never fill the hidden "company" field. If it's
  // populated, silently pretend success and send nothing.
  const honeypot = form.elements.company ? form.elements.company.value : '';
  if (honeypot) {
    form.reset();
    document.getElementById('recruiterForm').style.display = 'none';
    document.querySelector('.recruiter-toggle').textContent = 'Connect with a Recruiter';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Submitting...';

  const results = JSON.parse(localStorage.getItem('quizResults')) || {};
  const consentEl = form.querySelector('.consent-label');
  const data = {
    name: form.elements.name.value,
    email: form.elements.email.value,
    phone: form.elements.phone.value,
    message: form.elements.message.value,
    source: 'results',
    practiceScore: results.afqt || null,
    consentText: consentEl ? consentEl.textContent.trim().replace(/\s+/g, ' ') : '',
    consentTimestamp: new Date().toISOString()
  };

  // The endpoint is a CORS-opaque Apps Script /exec (returns a 302 we can't
  // read), so this is intentionally fire-and-forget — we never inspect the
  // response. An AbortController gives us a real failure path for timeouts.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  fetch('https://script.google.com/macros/s/AKfycbxsUDFUQYOTvbSsbXEfdZxz_1-kp8iA1yM24alVMwEZVo8jJsla_-lPgZUccSEqYBH2ow/exec', {
    method: 'POST',
    body: JSON.stringify(data),
    signal: controller.signal
  })
  .then(() => {
    alert('Thank you! A recruiter will contact you soon to discuss your score and options.');
    form.reset();
    document.getElementById('recruiterForm').style.display = 'none';
    document.querySelector('.recruiter-toggle').textContent = 'Connect with a Recruiter';
  })
  .catch(() => {
    alert('Something went wrong. Please try again.');
  })
  .finally(() => {
    clearTimeout(timeout);
    btn.disabled = false;
    btn.textContent = 'Submit Request';
  });
}

// Wire up controls that previously used inline on* attributes.
(function wireResultsControls() {
  const reviewToggleBtn = document.getElementById('reviewToggleBtn');
  if (reviewToggleBtn) reviewToggleBtn.addEventListener('click', toggleAnswerReview);
  const recruiterToggle = document.querySelector('.recruiter-toggle');
  if (recruiterToggle) recruiterToggle.addEventListener('click', toggleRecruiterForm);
  const recruiterForm = document.querySelector('.recruiter-form');
  if (recruiterForm) recruiterForm.addEventListener('submit', submitRecruiterRequest);
})();
