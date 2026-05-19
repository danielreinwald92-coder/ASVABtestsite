let allUsers = [];
let filteredUsers = [];

const SECTION_LABELS = {
  WK: 'Word Knowledge', PC: 'Paragraph Comp', AR: 'Arithmetic Reasoning',
  MK: 'Math Knowledge', GS: 'General Science', AI: 'Auto Info',
  SI: 'Shop Info', MC: 'Mechanical Comp', EI: 'Electronics Info', AS: 'Auto & Shop'
};

const LINE_LABELS = {
  GT: 'General Technical', CL: 'Clerical', CO: 'Combat',
  EL: 'Electronics', FA: 'Field Artillery', GM: 'General Maintenance',
  MM: 'Mechanical Maint', OF: 'Operators & Food', SC: 'Surveillance & Comms',
  ST: 'Skilled Technical'
};

async function loadAdmin() {
  const profile = await requireAdmin();
  if (!profile) return;

  const client = getClient();

  const { data: profiles } = await client
    .from('profiles')
    .select('*, test_results(id, test_type, afqt_score, section_scores, line_scores, taken_at)')
    .order('created_at', { ascending: false });

  allUsers = (profiles || []).map(p => {
    const tests = (p.test_results || []).slice().sort(
      (a, b) => new Date(b.taken_at) - new Date(a.taken_at)
    );
    const afqtScores = tests.map(t => t.afqt_score).filter(s => s !== null && s !== undefined);
    const bestAfqt = afqtScores.length > 0 ? Math.max(...afqtScores) : null;
    const lastTestAt = tests.length > 0 ? tests[0].taken_at : null;

    return {
      id: p.id,
      name: p.name,
      email: p.email,
      age: p.age,
      education: p.education,
      zipcode: p.zipcode,
      created_at: p.created_at,
      test_date: p.test_date,
      tests,
      testCount: tests.length,
      bestAfqt,
      lastTestAt
    };
  });

  renderStats();
  applyFilters();
}

function renderStats() {
  const now = new Date();
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

  document.getElementById('statTotal').textContent = allUsers.length;
  document.getElementById('statNewThisWeek').textContent =
    allUsers.filter(u => new Date(u.created_at) >= weekAgo).length;
  document.getElementById('statActive').textContent =
    allUsers.filter(u => u.testCount > 0).length;

  const afqtScores = allUsers.map(u => u.bestAfqt).filter(s => s !== null);
  document.getElementById('statAvgAfqt').textContent =
    afqtScores.length > 0
      ? Math.round(afqtScores.reduce((a, b) => a + b, 0) / afqtScores.length)
      : '—';
}

function applyFilters() {
  const fromDate = document.getElementById('filterFrom').value;
  const toDate = document.getElementById('filterTo').value;
  const education = document.getElementById('filterEducation').value;
  const zip = document.getElementById('filterZip').value.trim().toLowerCase();
  const minTests = parseInt(document.getElementById('filterMinTests').value, 10) || 0;

  filteredUsers = allUsers.filter(u => {
    if (fromDate && new Date(u.created_at) < new Date(fromDate)) return false;
    if (toDate && new Date(u.created_at) > new Date(toDate + 'T23:59:59')) return false;
    if (education && u.education !== education) return false;
    if (zip && !(u.zipcode || '').toLowerCase().startsWith(zip)) return false;
    if (u.testCount < minTests) return false;
    return true;
  });

  renderTable();
}

function renderTable() {
  const tbody = document.getElementById('adminTableBody');

  if (filteredUsers.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding: 2rem; color: var(--text-secondary);">No users match these filters.</td></tr>';
    document.getElementById('filteredCount').textContent = '0 users';
    return;
  }

  document.getElementById('filteredCount').textContent = `${filteredUsers.length} user${filteredUsers.length !== 1 ? 's' : ''}`;

  tbody.innerHTML = filteredUsers.map(u => `
    <tr onclick="openUserModal('${u.id}')">
      <td>${escHtml(u.name)}</td>
      <td>${escHtml(u.email)}</td>
      <td>${escHtml(String(u.age || '—'))}</td>
      <td>${escHtml(u.education || '—')}</td>
      <td>${escHtml(u.zipcode || '—')}</td>
      <td>${formatDate(u.created_at)}</td>
      <td>${u.testCount}</td>
      <td>${u.bestAfqt !== null ? u.bestAfqt + 'th %ile' : '—'}</td>
      <td>${u.lastTestAt ? formatDate(u.lastTestAt) : '—'}</td>
    </tr>
  `).join('');
}

function openUserModal(userId) {
  const user = allUsers.find(u => u.id === userId);
  if (!user) return;

  const tests = user.tests;
  const latest = tests[0];
  const oldest = tests[tests.length - 1];

  let improvement = '';
  if (tests.length >= 2 && latest.afqt_score != null && oldest.afqt_score != null) {
    const diff = latest.afqt_score - oldest.afqt_score;
    const cls = diff > 0 ? 'trend-up' : diff < 0 ? 'trend-down' : 'trend-flat';
    const sign = diff > 0 ? '+' : '';
    improvement = `<span class="${cls}">${sign}${diff}</span>`;
  } else {
    improvement = '<span class="trend-flat">—</span>';
  }

  const content = document.getElementById('userModalContent');
  content.innerHTML = `
    <h2>${escHtml(user.name || user.email)}</h2>
    <div class="sub">
      ${escHtml(user.email)} &nbsp;·&nbsp;
      Joined ${formatDate(user.created_at)}
      ${user.test_date ? ' · Target test date: ' + formatDate(user.test_date) : ''}
    </div>

    <div class="modal-stats">
      <div class="modal-stat">
        <div class="v">${user.testCount}</div>
        <div class="l">Tests Taken</div>
      </div>
      <div class="modal-stat">
        <div class="v">${user.bestAfqt !== null ? user.bestAfqt : '—'}</div>
        <div class="l">Best AFQT %ile</div>
      </div>
      <div class="modal-stat">
        <div class="v">${latest && latest.afqt_score != null ? latest.afqt_score : '—'}</div>
        <div class="l">Latest AFQT %ile</div>
      </div>
      <div class="modal-stat">
        <div class="v">${improvement}</div>
        <div class="l">First → Latest</div>
      </div>
    </div>

    ${tests.length === 0 ? `
      <div class="empty-note">This user has not completed any tests yet.</div>
    ` : `
      <h3>Test History</h3>
      <table class="attempts-table">
        <thead>
          <tr><th>Date</th><th>Type</th><th>AFQT %ile</th><th>Sections</th></tr>
        </thead>
        <tbody>
          ${tests.map(t => `
            <tr>
              <td>${formatDateTime(t.taken_at)}</td>
              <td>${escHtml(formatTestType(t.test_type))}</td>
              <td>${t.afqt_score != null ? t.afqt_score : '—'}</td>
              <td>${sectionSummary(t.section_scores)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <h3>Latest Test — Section Detail</h3>
      <div class="section-grid">
        ${renderScoreGrid(latest.section_scores, SECTION_LABELS)}
      </div>

      ${latest.line_scores && Object.keys(latest.line_scores).length > 0 ? `
        <h3>Latest Test — Army Line Scores</h3>
        <div class="section-grid">
          ${renderScoreGrid(latest.line_scores, LINE_LABELS)}
        </div>
      ` : ''}
    `}
  `;

  document.getElementById('userModal').classList.add('open');
}

function closeUserModal() {
  document.getElementById('userModal').classList.remove('open');
}

function renderScoreGrid(scores, labels) {
  if (!scores || typeof scores !== 'object') {
    return '<div class="empty-note" style="grid-column:1/-1;">No data</div>';
  }
  const keys = Object.keys(scores);
  if (keys.length === 0) {
    return '<div class="empty-note" style="grid-column:1/-1;">No data</div>';
  }
  return keys.map(k => {
    const v = scores[k];
    const display = (v && typeof v === 'object') ? (v.score ?? v.raw ?? v.correct ?? JSON.stringify(v)) : v;
    return `
      <div class="section-pill">
        <div class="code">${escHtml(k)}</div>
        <div class="val">${escHtml(String(display ?? '—'))}${labels[k] ? ' · ' + escHtml(labels[k]) : ''}</div>
      </div>
    `;
  }).join('');
}

function sectionSummary(scores) {
  if (!scores || typeof scores !== 'object') return '—';
  const keys = Object.keys(scores);
  if (keys.length === 0) return '—';
  return escHtml(keys.join(', '));
}

function formatTestType(t) {
  if (!t) return '—';
  if (t.toLowerCase().includes('afqt')) return 'Quick AFQT';
  if (t.toLowerCase().includes('full')) return 'Full Assessment';
  return t;
}

function exportCsv() {
  const headers = ['Name', 'Email', 'Age', 'Education', 'ZIP', 'Joined', 'Tests Taken', 'Best AFQT', 'Last Test'];
  const rows = filteredUsers.map(u => [
    csvCell(u.name),
    csvCell(u.email),
    csvCell(String(u.age || '')),
    csvCell(u.education || ''),
    csvCell(u.zipcode || ''),
    formatDate(u.created_at),
    csvCell(String(u.testCount)),
    u.bestAfqt !== null ? u.bestAfqt : '',
    u.lastTestAt ? formatDate(u.lastTestAt) : ''
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mission-asvab-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function csvCell(val) {
  const s = String(val);
  return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateTime(iso) {
  return new Date(iso).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit'
  });
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeUserModal();
});
