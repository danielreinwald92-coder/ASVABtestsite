// Page logic for my-options.html: reads the latest practice result on this
// device and renders the job options view (js/options-view.js).
(function () {
  const V = window.MissionASVABOptionsView;
  const view = document.getElementById('optView');
  const empty = document.getElementById('optEmpty');
  if (!V || !view || !empty) return;

  const TEST_NAMES = { full: 'Full Army Assessment', quick: 'AFQT Practice Test', apt: 'APT-Style AFQT Predictor' };

  function showEmpty(title, text) {
    if (title) document.getElementById('optEmptyTitle').textContent = title;
    if (text) document.getElementById('optEmptyText').textContent = text;
    empty.hidden = false;
  }

  let results = null;
  try { results = JSON.parse(localStorage.getItem('quizResults') || 'null'); } catch (_) { results = null; }
  if (!results) { showEmpty(); return; }

  if (results.testType === 'diagnostic') {
    showEmpty('Your Diagnostic Does Not Estimate an AFQT',
      'The starting-point diagnostic sets study priorities but does not estimate an AFQT, so it cannot match jobs. Take the AFQT practice test or the full practice test to see your options.');
    return;
  }

  const scores = V.scoresFromResults(results);
  if (!scores) {
    showEmpty('This Test Does Not Estimate an AFQT',
      'Single-section and tutor practice do not estimate an AFQT, so they cannot match jobs. Take the AFQT practice test or the full practice test to see your options.');
    return;
  }

  const out = V.render(scores);
  view.innerHTML = out.html;
  V.bind(view);

  const c = V.counts(out.result);
  document.getElementById('optAfqt').textContent = scores.afqt;
  document.getElementById('optAfqtLabel').textContent = results.testType === 'apt' ? 'Predicted AFQT' : 'Estimated AFQT';
  document.getElementById('optQualifyCount').textContent = c.qualifies;
  document.getElementById('optCloseCount').textContent = c.close;
  document.getElementById('optSummary').hidden = false;

  const src = document.getElementById('optSource');
  const name = TEST_NAMES[results.testType] || 'practice test';
  let when = '';
  if (results.completedAt) {
    const d = new Date(results.completedAt);
    if (!isNaN(d)) when = ' on ' + d.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  }
  src.textContent = 'Based on your ' + name + when + '.' +
    (scores.full ? '' : ' This test covers the AFQT sections only, so the full practice test will show many more jobs.');
  src.hidden = false;
})();
