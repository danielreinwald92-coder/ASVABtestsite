const { test } = require('node:test');
const assert = require('node:assert');
const { loadScripts } = require('../helpers/load.js');

const { window } = loadScripts(['js/mission-recommendations.js']);
const M = window.MissionASVABMissions;

function result(scores, extra = {}) {
  const sectionResults = {};
  for (const [code, pair] of Object.entries(scores)) {
    const [correct, total, answered = total] = pair;
    sectionResults[code] = {
      correct, total,
      questions: Array.from({ length: total }, (_, i) => ({
        userAnswer: i < answered ? 0 : undefined
      }))
    };
  }
  return {
    clientResultId: 'result-123', completedAt: '2026-07-19T12:00:00.000Z',
    testType: 'afqt', sectionResults, ...extra
  };
}

test('ranks the clearest section weakness and chooses a real unfinished chapter', () => {
  const mission = M.buildMission(result({ AR: [6, 15], MK: [12, 15], WK: [13, 15], PC: [9, 10] }), {
    completedChapters: { 'AR-1': true }
  });
  assert.strictEqual(mission.primarySection, 'AR');
  assert.strictEqual(mission.priorities[0].level, 'focus');
  assert.strictEqual(mission.target.chapterId, 'AR-2');
  assert.ok(M.validateTarget(mission.target));
  assert.match(mission.target.url, /chapter=AR-2/);
  const tampered = { ...mission.target, url: 'javascript:alert(1)' };
  assert.match(M.targetUrl(tampered, mission.clientId), /^study-guide\.html\?section=AR&chapter=AR-2&mission=/);
});

test('one miss is not labeled a confirmed weakness', () => {
  const priorities = M.buildPriorities(result({ WK: [14, 15] }).sectionResults, 3);
  assert.strictEqual(priorities[0].level, 'watch');
  assert.match(priorities[0].reason, /not a confirmed weakness/i);
});

test('limited answers produce an honest early-signal mission', () => {
  const mission = M.buildMission(result({ AR: [2, 15, 3], MK: [1, 15, 2] }));
  assert.match(mission.evidenceNote, /early signal/i);
  assert.match(mission.summary, /More practice/i);
});

test('strong and perfect results still produce maintenance work', () => {
  const mission = M.buildMission(result({ AR: [15, 15], MK: [15, 15], WK: [15, 15], PC: [10, 10] }));
  assert.match(mission.title, /mission-ready/i);
  assert.strictEqual(mission.status, 'not_started');
  assert.ok(mission.target.chapterId);
});

test('mission id and target remain stable for the same result', () => {
  const r = result({ AR: [8, 15], MK: [10, 15] });
  const a = M.buildMission(r, { completedChapters: {} });
  const b = M.buildMission(r, { completedChapters: {} });
  assert.strictEqual(a.clientId, b.clientId);
  assert.strictEqual(a.target.url, b.target.url);
});
