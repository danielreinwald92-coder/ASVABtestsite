// Local mission history plus optional Supabase synchronization. Anonymous
// students get the complete experience; signing in later imports the current
// result and local missions without sending question text, choices, or names.
(function (root) {
  'use strict';

  const MISSION_KEY = 'missionasvab.missions.v1';
  const RESULT_KEY = 'quizResults';
  const MAX_LOCAL_MISSIONS = 30;

  function storage() {
    try { return root.localStorage || localStorage; } catch (_) { return null; }
  }

  function readJson(key, fallback) {
    try {
      const raw = storage() && storage().getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) { return fallback; }
  }

  function writeJson(key, value) {
    try {
      if (storage()) storage().setItem(key, JSON.stringify(value));
      return true;
    } catch (_) { return false; }
  }

  function loadLocalMissions() {
    const value = readJson(MISSION_KEY, []);
    return Array.isArray(value) ? value.filter((m) => m && m.clientId) : [];
  }

  function saveLocalMission(mission) {
    if (!mission || !mission.clientId) return null;
    const all = loadLocalMissions();
    const index = all.findIndex((item) => item.clientId === mission.clientId);
    const copy = JSON.parse(JSON.stringify(mission));
    if (index >= 0) all[index] = { ...all[index], ...copy };
    else all.unshift(copy);
    all.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    writeJson(MISSION_KEY, all.slice(0, MAX_LOCAL_MISSIONS));
    return copy;
  }

  function getLocalMission(clientId) {
    return loadLocalMissions().find((m) => m.clientId === clientId) || null;
  }

  function getCurrentLocalMission(sourceResultClientId) {
    const all = loadLocalMissions();
    if (sourceResultClientId) {
      const match = all.find((m) => m.sourceResultClientId === sourceResultClientId);
      if (match) return match;
    }
    return all[0] || null;
  }

  function missionRow(mission, userId) {
    return {
      user_id: userId,
      client_id: mission.clientId,
      version: mission.version || 1,
      source_result_client_id: mission.sourceResultClientId || null,
      source_completed_at: mission.sourceCompletedAt || null,
      test_type: mission.testType || 'practice',
      status: mission.status || 'not_started',
      primary_section: mission.primarySection || null,
      title: mission.title,
      summary: mission.summary,
      evidence_note: mission.evidenceNote || null,
      estimated_minutes: mission.estimatedMinutes || null,
      activity_type: mission.activityType,
      target: mission.target || {},
      priority_sections: mission.priorities || [],
      started_at: mission.startedAt || null,
      completed_at: mission.completedAt || null,
      created_at: mission.createdAt || new Date().toISOString(),
      updated_at: mission.updatedAt || new Date().toISOString()
    };
  }

  function missionFromRow(row) {
    return {
      clientId: row.client_id,
      version: row.version,
      sourceResultClientId: row.source_result_client_id,
      sourceCompletedAt: row.source_completed_at,
      testType: row.test_type,
      status: row.status,
      primarySection: row.primary_section,
      title: row.title,
      summary: row.summary,
      evidenceNote: row.evidence_note,
      estimatedMinutes: row.estimated_minutes,
      activityType: row.activity_type,
      target: row.target || {},
      priorities: row.priority_sections || [],
      startedAt: row.started_at,
      completedAt: row.completed_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      ownerUserId: row.user_id
    };
  }

  function client() {
    try { return typeof getClient === 'function' ? getClient() : null; } catch (_) { return null; }
  }

  async function currentSession() {
    try { return typeof getSession === 'function' ? await getSession() : null; } catch (_) { return null; }
  }

  async function syncMission(mission, session) {
    const db = client();
    const active = session || await currentSession();
    if (!db || !active || !mission || !mission.clientId) return { skipped: true };
    if (mission.ownerUserId && mission.ownerUserId !== active.user.id) return { skipped: true, reason: 'other-owner' };

    const row = missionRow(mission, active.user.id);
    const { error } = await db.from('study_missions').upsert(row, { onConflict: 'user_id,client_id' });
    if (error) return { ok: false, error };
    mission.ownerUserId = active.user.id;
    saveLocalMission(mission);
    return { ok: true };
  }

  async function setMissionStatus(clientId, status) {
    const allowed = ['not_started', 'in_progress', 'completed'];
    if (!allowed.includes(status)) return { ok: false, reason: 'invalid-status' };
    const now = new Date().toISOString();
    let mission = getLocalMission(clientId);
    if (mission) {
      // Progress is monotonic. In particular, opening a completed mission for
      // review must not turn it back into "in progress" on this browser.
      const rank = { not_started: 0, in_progress: 1, completed: 2 };
      if ((rank[mission.status] || 0) > rank[status]) status = mission.status;
      mission.status = status;
      mission.updatedAt = now;
      if (status === 'in_progress' && !mission.startedAt) mission.startedAt = now;
      if (status === 'completed') {
        mission.startedAt = mission.startedAt || now;
        mission.completedAt = mission.completedAt || now;
      }
      saveLocalMission(mission);
    }

    const session = await currentSession();
    const db = client();
    if (!session || !db) return { ok: true, localOnly: true, mission };

    if (mission) return syncMission(mission, session);
    const updates = { status, updated_at: now };
    if (status === 'in_progress') updates.started_at = now;
    if (status === 'completed') {
      updates.started_at = now;
      updates.completed_at = now;
    }
    const { error } = await db.from('study_missions')
      .update(updates)
      .eq('user_id', session.user.id)
      .eq('client_id', clientId);
    return error ? { ok: false, error } : { ok: true };
  }

  function compactResultPayload(results, userId) {
    if (!results || !userId) return null;
    const sections = {};
    const questionResults = [];
    for (const [code, section] of Object.entries(results.sectionResults || {})) {
      sections[code] = { correct: section.correct || 0, total: section.total || 0 };
      (section.questions || []).forEach((q) => {
        questionResults.push({
          id: q.originalId || q.id,
          section: code,
          correct: !!q.isCorrect
        });
      });
    }
    let lineScores = null;
    try {
      if (results.mode !== 'tutor' && results.testType !== 'diagnostic' && root.MissionASVABScoring) {
        lineScores = root.MissionASVABScoring.calculateLineScores(results.sectionResults);
      }
    } catch (_) { lineScores = null; }
    return {
      user_id: userId,
      client_result_id: results.clientResultId,
      test_type: results.testType || 'practice',
      mode: results.mode || 'timed',
      afqt_score: typeof results.afqt === 'number' ? results.afqt : null,
      section_scores: sections,
      line_scores: lineScores,
      question_results: questionResults,
      taken_at: results.completedAt || new Date().toISOString()
    };
  }

  function isDuplicate(error) {
    return !!(error && (error.code === '23505' || /duplicate key/i.test(error.message || '')));
  }

  async function importLocalResult(session) {
    const results = readJson(RESULT_KEY, null);
    const db = client();
    if (!results || !results.clientResultId || !db || !session) return { skipped: true };
    if (results.ownerUserId && results.ownerUserId !== session.user.id) {
      return { skipped: true, reason: 'other-owner' };
    }
    if (results.ownerUserId === session.user.id) return { skipped: true, reason: 'already-owned' };

    const payload = compactResultPayload(results, session.user.id);
    const { error } = await db.from('test_results').insert(payload);
    if (error && !isDuplicate(error)) return { ok: false, error };
    results.ownerUserId = session.user.id;
    writeJson(RESULT_KEY, results);
    return { ok: true, duplicate: !!error };
  }

  async function syncLocalProgress(session) {
    const active = session || await currentSession();
    if (!active) return { skipped: true, reason: 'no-session' };
    const result = await importLocalResult(active);
    let synced = 0;
    let failed = 0;
    const missions = loadLocalMissions();
    for (const mission of missions) {
      if (mission.ownerUserId && mission.ownerUserId !== active.user.id) continue;
      const res = await syncMission(mission, active);
      if (res.ok) synced++; else if (!res.skipped) failed++;
    }
    // Pull server-authoritative state after writes. A database trigger keeps
    // completed/in-progress rows from regressing when an older device syncs.
    const remote = await fetchRemoteMissions(active);
    return { result, missionsSynced: synced, missionsFailed: failed, remote };
  }

  async function fetchRemoteMissions(session) {
    const active = session || await currentSession();
    const db = client();
    if (!active || !db) return { data: [], error: null };
    const { data, error } = await db.from('study_missions')
      .select('*')
      .eq('user_id', active.user.id)
      .order('created_at', { ascending: false });
    if (!error) (data || []).forEach((row) => saveLocalMission(missionFromRow(row)));
    return { data: (data || []).map(missionFromRow), error };
  }

  const api = {
    MISSION_KEY, loadLocalMissions, saveLocalMission, getLocalMission,
    getCurrentLocalMission, missionRow, missionFromRow, compactResultPayload,
    syncMission, setMissionStatus, importLocalResult, syncLocalProgress,
    fetchRemoteMissions, isDuplicate
  };
  root.MissionASVABMissionProgress = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
