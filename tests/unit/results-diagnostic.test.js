const { test } = require('node:test');
const assert = require('node:assert');
const { runPageScript, makeLocalStorage } = require('../helpers/load.js');

test('diagnostic results render independent-practice copy and a visible mission', () => {
  const results = {
    clientResultId: 'result-diagnostic-1',
    testType: 'diagnostic', mode: 'timed', score: 50, afqt: null,
    correct: 9, incorrect: 9, timeUsed: 600, completedAt: '2026-07-19T12:00:00Z',
    sectionResults: {
      AR: { name: 'Arithmetic Reasoning', correct: 2, total: 4, questions: [] },
      WK: { name: 'Word Knowledge', correct: 3, total: 6, questions: [] },
      PC: { name: 'Paragraph Comprehension', correct: 2, total: 4, questions: [] },
      MK: { name: 'Mathematics Knowledge', correct: 2, total: 4, questions: [] }
    }
  };
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

  assert.strictEqual(document.getElementById('afqtLabel').textContent, 'Starting-Point Diagnostic');
  assert.match(document.getElementById('afqtPercentile').textContent, /not an AFQT percentile/i);
  assert.strictEqual(document.getElementById('scoreMessage').textContent, 'Your Starting Point Is Ready');
  assert.strictEqual(document.getElementById('missionPanel').style.display, 'block');
  assert.strictEqual(document.querySelector('.recruiter-section').style.display, 'none');
});
