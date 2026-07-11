// Page logic for results.html
// Externalized from an inline <script> (CSP script-src hardening).
// Functions stay top-level (not IIFE-wrapped) so unit tests can invoke them
// directly. Inline on* attributes were replaced with addEventListener wiring
// at the end of this file.
// Loaded at end of <body> after js/auth.js, js/test-config.js, js/scoring.js.
// Visiting results.html with nothing to show: hide the score chrome (which
// would otherwise render "Great work" and "--" placeholders) and leave one
// clear message + the "Take Another Test" nav CTA.
function showEmptyResultsState(title, detail) {
  const hide = (el) => { if (el) el.style.display = 'none'; };
  const badge = document.querySelector('.completion-badge');
  if (badge) badge.textContent = 'No Results';
  hide(document.querySelector('.greeting'));
  hide(document.getElementById('userName'));
  hide(document.querySelector('.afqt-section'));
  hide(document.querySelector('.stats-row'));
  hide(document.querySelector('.recruiter-section'));
  const msg = document.getElementById('scoreMessage');
  if (msg) msg.textContent = title;
  const desc = document.getElementById('scoreDescription');
  if (desc) desc.textContent = detail;
}

function loadResults() {
  try {
    const resultsRaw = localStorage.getItem('quizResults');

    if (!resultsRaw) {
      showEmptyResultsState('No results yet', 'Take a practice test to see your score breakdown here.');
      return;
    }

    const results = JSON.parse(resultsRaw);
    console.log('Parsed results:', results);

    const userName = localStorage.getItem('asvabUserName') || 'Test Taker';

    if (!results || typeof results !== 'object') {
      showEmptyResultsState('Invalid results data', 'Please retake the practice test.');
      return;
    }

  document.getElementById('userName').textContent = userName;

  // Test type used when a user reports a question (4.3 — report-a-question).
  reviewTestType = results.testType || null;

  // Handle null AFQT (single section tests): show practice score, not a percentile
  const hasAFQT = typeof results.afqt === 'number';
  const isTutor = results.mode === 'tutor';
  const displayScore = hasAFQT ? results.afqt : (results.score || 0);
  document.getElementById('afqtScore').textContent = displayScore;
  if (hasAFQT) {
    document.getElementById('afqtLabel').textContent = 'Estimated AFQT Score';
    document.getElementById('afqtPercentile').textContent = `${results.afqt}${getOrdinalSuffix(results.afqt)} Percentile`;
  } else if (isTutor) {
    document.getElementById('afqtLabel').textContent = 'Tutor Practice';
    document.getElementById('afqtPercentile').textContent = `${results.score}% correct — untimed practice with explanations`;
  } else {
    document.getElementById('afqtLabel').textContent = 'Practice Score';
    document.getElementById('afqtPercentile').textContent = `${results.score}% Correct — single-section practice, not an AFQT estimate`;
  }
  document.getElementById('correctCount').textContent = results.correct || 0;
  document.getElementById('incorrectCount').textContent = results.incorrect || 0;

  const minutes = Math.floor(results.timeUsed / 60);
  const seconds = results.timeUsed % 60;
  const timeUsedEl = document.getElementById('timeUsed');
  timeUsedEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  // Tutor mode is untimed — a "Time Used 0:00" stat is meaningless noise.
  if (isTutor) {
    const timeCard = timeUsedEl.closest && timeUsedEl.closest('.stat-card');
    if (timeCard) timeCard.style.display = 'none';
  }

  // Keep the greeting honest — "Great work," over a below-minimum score reads wrong.
  const greetingEl = document.querySelector('.greeting');
  if (greetingEl && !isTutor) {
    const headline = hasAFQT ? results.afqt : (results.score || 0);
    if (headline < (hasAFQT ? 31 : 50)) greetingEl.textContent = 'Test complete,';
  }

  // AFQT-based messaging only when we have a real AFQT estimate.
  // For single-section practice, use raw % with neutral copy (no eligibility claims).
  const afqt = hasAFQT ? results.afqt : results.score;
  let message, description;

  if (isTutor) {
    message = 'Practice Complete';
    description = 'Review each question below with its explanation. Weak areas from this session feed your study plan. Take a timed test when you want an AFQT estimate.';
  } else if (!hasAFQT) {
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
    description = "Based on this practice estimate, you're in the top tier and would likely qualify for virtually all military occupations. Only the official ASVAB counts — a recruiter can help you schedule it.";
  } else if (afqt >= 65) {
    message = "Excellent Work!";
    description = "This practice estimate puts you well above the minimum requirements — a score like this on the official test would open many career fields. A recruiter can help you explore your options.";
  } else if (afqt >= 50) {
    message = "Great Job!";
    description = "This practice estimate is above average and above the enlistment minimum. Keep it up — only the official ASVAB determines eligibility. A recruiter can discuss which jobs match scores in this range.";
  } else if (afqt >= 31) {
    message = "On Track to Qualify";
    description = "Based on this practice estimate, you'd likely meet the Army's minimum AFQT requirement of 31 — but it's close, so keep practicing to build a safety margin. Only the official ASVAB determines eligibility.";
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

  // Prepare the shareable result card (locally generated; no PII, no upload).
  setupShareResult(results, hasAFQT, isTutor);

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

// SP1 — explanation map (lazy-loaded) + the filter currently shown, so we can
// re-render in place once explanations arrive.
let questionExplanations = {};
let currentReviewFilter = 'all';

// 4.3 — report-a-question state. `reviewTestType` is the overall test type of
// the results being reviewed; `reportedQuestionIds` is a client-side rate-limit
// so the same question can't be reported twice in one session.
let reviewTestType = null;
const reportedQuestionIds = new Set();

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

  // SP1 — pull in explanations without blocking the initial review render, then
  // re-render the current filter so the 💡 blocks appear.
  if (typeof loadExplanations === 'function') {
    loadExplanations().then((map) => {
      questionExplanations = map || {};
      renderFilteredQuestions(currentReviewFilter);
    });
  }
}

function renderFilteredQuestions(filter) {
  currentReviewFilter = filter;
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
    `;

    // 4.3 — per-question "Report" control. Only when the question has an id we
    // can reference. Uses data-* hooks wired by a delegated listener (no inline
    // on* handlers — CSP/inline-JS gate).
    if (q.id) {
      const reported = reportedQuestionIds.has(q.id);
      html += `
        <div class="review-report" data-qid="${q.id}" data-section="${q.section || ''}">
          ${reported
            ? '<span class="report-done">Reported ✓</span>'
            : '<button type="button" class="report-btn" data-action="report-question">Report this question</button>'}
        </div>
      `;
    }

    // SP1 — explanation block (first-party static content; renders only when loaded).
    const explanation = questionExplanations[q.originalId];
    if (explanation) {
      html += `
        <div class="review-explanation">
          <span class="review-explanation-label">💡 Explanation</span>
          <p class="review-explanation-text">${explanation}</p>
        </div>
      `;
    }

    html += `
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

// ---------------------------------------------------------------------------
// 4.3 — report-a-question on the review list (RLS-protected insert).
// ---------------------------------------------------------------------------
const REPORT_REASONS = [
  'Incorrect answer',
  'Typo or unclear wording',
  'Confusing or ambiguous question',
  'Other'
];

// Delegated click handler for the report controls inside the review list.
async function onReportListClick(e) {
  if (!e.target || !e.target.closest) return;

  const reasonBtn = e.target.closest('[data-action="report-reason"]');
  if (reasonBtn) return submitReport(reasonBtn);

  const cancelBtn = e.target.closest('[data-action="report-cancel"]');
  if (cancelBtn) return closeReportMenu(cancelBtn);

  const reportBtn = e.target.closest('[data-action="report-question"]');
  if (reportBtn) return openReportMenu(reportBtn);
}

async function openReportMenu(reportBtn) {
  const wrap = reportBtn.closest('.review-report');
  if (!wrap) return;
  const qid = wrap.dataset.qid;
  if (!qid || reportedQuestionIds.has(qid)) return;

  const session = await getSession();
  if (!session) {
    wrap.innerHTML =
      '<span class="report-note">Please <a href="login.html">sign in</a> to report a question.</span>';
    return;
  }

  const options = REPORT_REASONS.map(
    (r) => `<button type="button" class="report-reason-btn" data-action="report-reason" data-reason="${r}">${r}</button>`
  ).join('');

  wrap.innerHTML = `
    <div class="report-menu">
      <span class="report-menu-label">Why are you reporting this question?</span>
      <div class="report-reasons">${options}</div>
      <textarea class="report-details" rows="2" maxlength="500" placeholder="Optional details (what's wrong?)"></textarea>
      <div class="report-menu-actions">
        <button type="button" class="report-cancel-btn" data-action="report-cancel">Cancel</button>
      </div>
      <div class="report-msg" role="status"></div>
    </div>
  `;
}

function closeReportMenu(cancelBtn) {
  const wrap = cancelBtn.closest('.review-report');
  if (!wrap) return;
  wrap.innerHTML =
    '<button type="button" class="report-btn" data-action="report-question">Report this question</button>';
}

async function submitReport(reasonBtn) {
  const wrap = reasonBtn.closest('.review-report');
  if (!wrap) return;
  const qid = wrap.dataset.qid;
  const section = wrap.dataset.section || null;
  const reason = reasonBtn.dataset.reason || 'Other';
  if (!qid || reportedQuestionIds.has(qid)) return;

  const detailsEl = wrap.querySelector('.report-details');
  const details = detailsEl && detailsEl.value.trim() ? detailsEl.value.trim() : null;
  const msgEl = wrap.querySelector('.report-msg');

  const session = await getSession();
  if (!session) {
    wrap.innerHTML =
      '<span class="report-note">Please <a href="login.html">sign in</a> to report a question.</span>';
    return;
  }

  // Disable reason buttons while the insert is in flight (double-submit guard).
  wrap.querySelectorAll('[data-action="report-reason"]').forEach((b) => { b.disabled = true; });
  if (msgEl) msgEl.textContent = 'Submitting…';

  try {
    const { error } = await getClient()
      .from('question_reports')
      .insert({
        user_id: session.user.id,
        question_id: qid,
        test_type: reviewTestType,
        reason,
        details
      });

    if (error) {
      if (msgEl) msgEl.textContent = 'Could not submit report: ' + error.message;
      wrap.querySelectorAll('[data-action="report-reason"]').forEach((b) => { b.disabled = false; });
      return;
    }

    reportedQuestionIds.add(qid);
    wrap.innerHTML = '<span class="report-done">Reported ✓</span>';
  } catch (err) {
    if (msgEl) msgEl.textContent = 'Could not submit report: ' + (err.message || 'Network error');
    wrap.querySelectorAll('[data-action="report-reason"]').forEach((b) => { b.disabled = false; });
  }
}

// Build the share payload from already-computed scores and reveal the button.
// Uses only score data — never the user's name — matching share-card.js.
function setupShareResult(results, hasAFQT, isTutor) {
  const btn = document.getElementById('shareResultBtn');
  if (!btn || typeof MissionASVABShareCard === 'undefined') return;

  let lineScores = [];
  if (results.testType === 'full' && typeof MissionASVABScoring !== 'undefined') {
    const ls = MissionASVABScoring.calculateLineScores(results.sectionResults);
    if (ls) {
      lineScores = Object.entries(ls)
        .filter(([, d]) => d && d.score > 0)
        .map(([code, d]) => ({ code, score: d.score }));
    }
  }

  let dateStr = '';
  try { dateStr = new Date().toLocaleDateString(); } catch (e) { dateStr = ''; }

  const payload = {
    mode: hasAFQT ? 'timed' : (isTutor ? 'tutor' : 'practice'),
    afqtPercentile: hasAFQT ? results.afqt : undefined,
    lineScores: lineScores,
    dateStr: dateStr
  };

  btn.hidden = false;
  btn.addEventListener('click', () => MissionASVABShareCard.renderAndShare(payload));
}

// Wire up controls that previously used inline on* attributes.
(function wireResultsControls() {
  const reviewToggleBtn = document.getElementById('reviewToggleBtn');
  if (reviewToggleBtn) reviewToggleBtn.addEventListener('click', toggleAnswerReview);
  const recruiterToggle = document.querySelector('.recruiter-toggle');
  if (recruiterToggle) recruiterToggle.addEventListener('click', toggleRecruiterForm);
  const recruiterForm = document.querySelector('.recruiter-form');
  if (recruiterForm) recruiterForm.addEventListener('submit', submitRecruiterRequest);
  // 4.3 — delegated report controls (rendered into the review list dynamically).
  const reviewList = document.getElementById('reviewQuestionsList');
  if (reviewList) reviewList.addEventListener('click', onReportListClick);
})();
