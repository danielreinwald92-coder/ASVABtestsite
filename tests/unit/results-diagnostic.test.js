const { test } = require('node:test');
const assert = require('node:assert');
const { runPageScript, makeLocalStorage } = require('../helpers/load.js');

function diagnosticResults(extra) {
  return Object.assign({
    clientResultId: 'result-diagnostic-1',
    testType: 'diagnostic', mode: 'timed', score: 50, afqt: null,
    correct: 9, incorrect: 9, timeUsed: 600, completedAt: '2026-07-19T12:00:00Z',
    sectionResults: {
      AR: { name: 'Arithmetic Reasoning', correct: 2, total: 4, questions: [] },
      WK: { name: 'Word Knowledge', correct: 3, total: 6, questions: [] },
      PC: { name: 'Paragraph Comprehension', correct: 2, total: 4, questions: [] },
      MK: { name: 'Mathematics Knowledge', correct: 2, total: 4, questions: [] }
    }
  }, extra || {});
}

function renderDiagnostic(results) {
  const mission = {
    clientId: 'mission-v1-result-diagnostic-1', version: 1,
    sourceResultClientId: 'result-diagnostic-1', status: 'not_started',
    title: 'Build Arithmetic Reasoning', summary: 'Review ratios, then complete the checkpoint.',
    evidenceNote: 'Selected from your section performance.', estimatedMinutes: 18,
    priorities: [{ name: 'Arithmetic Reasoning', reason: '2 of 4 correct.' }],
    target: { kind: 'lesson_quiz', section: 'AR', chapterId: 'AR-1', url: 'study-guide.html?section=AR&chapter=AR-1' }
  };
  const storage = makeLocalStorage({ quizResults: JSON.stringify(results), asvabUserName: 'Taylor' });
  const { document, sandbox } = runPageScript('results.html', 'renderTodaysMission', {
    localStorage: storage,
    globals: {
      MissionASVABMissions: {
        ENABLED: true, VERSION: 1,
        resultClientId: () => 'result-diagnostic-1',
        validateTarget: () => true,
        targetUrl: () => 'study-guide.html?section=AR&chapter=AR-1&mission=mission-v1-result-diagnostic-1',
        buildMission: () => mission
      },
      MissionASVABMissionProgress: {
        getCurrentLocalMission: () => null,
        saveLocalMission: () => mission,
        setMissionStatus: () => Promise.resolve({ ok: true })
      },
      setupShareResult: () => {},
      loadExplanations: async () => ({})
    }
  });

  sandbox.loadResults();
  return document;
}

test('legacy diagnostic results (no AFQT) render percent-correct copy and a visible mission', () => {
  const document = renderDiagnostic(diagnosticResults());
  assert.strictEqual(document.getElementById('afqtLabel').textContent, 'Diagnostic: Percent Correct');
  assert.match(document.getElementById('afqtPercentile').textContent, /not an AFQT score/i);
  assert.match(document.getElementById('afqtScore').textContent, /%$/);
  assert.strictEqual(document.getElementById('scoreMessage').textContent, 'Your Starting Point Is Ready');
  assert.strictEqual(document.getElementById('missionPanel').style.display, 'block');
});

test('diagnostic results with an AFQT estimate show it as the headline with a wide-range note', () => {
  const document = renderDiagnostic(diagnosticResults({ afqt: 42, afqtBand: { low: 27, high: 57 } }));
  assert.strictEqual(document.getElementById('afqtLabel').textContent, 'Estimated AFQT (Diagnostic)');
  assert.strictEqual(document.getElementById('afqtScore').textContent, '42');
  assert.match(document.getElementById('afqtPercentile').textContent, /42nd Percentile · likely range 27-57\. Based on 18 questions/);
  assert.strictEqual(document.getElementById('scoreMessage').textContent, 'Your Starting Point Is Ready');
  assert.strictEqual(document.getElementById('missionPanel').style.display, 'block');
});
