let allUsers = [];
let filteredUsers = [];

async function loadAdmin() {
  const profile = await requireAdmin();
  if (!profile) return;

  const client = getClient();

  // Fetch all profiles + aggregate test_results per user
  const { data: profiles } = await client
    .from('profiles')
    .select('*, test_results(afqt_score, taken_at)')
    .order('created_at', { ascending: false });

  allUsers = (profiles || []).map(p => {
    const tests = p.test_results || [];
    const bestAfqt = tests.length > 0
      ? Math.max(...tests.map(t => t.afqt_score).filter(s => s !== null))
      : null;
    return {
      id: p.id,
      name: p.name,
      email: p.email,
      age: p.age,
      education: p.education,
      zipcode: p.zipcode,
      created_at: p.created_at,
      testCount: tests.length,
      bestAfqt: isFinite(bestAfqt) ? bestAfqt : null
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
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 2rem; color: var(--text-secondary);">No users match these filters.</td></tr>';
    document.getElementById('filteredCount').textContent = '0 users';
    return;
  }

  document.getElementById('filteredCount').textContent = `${filteredUsers.length} user${filteredUsers.length !== 1 ? 's' : ''}`;

  tbody.innerHTML = filteredUsers.map(u => `
    <tr>
      <td>${escHtml(u.name)}</td>
      <td>${escHtml(u.email)}</td>
      <td>${u.age || '—'}</td>
      <td>${escHtml(u.education || '—')}</td>
      <td>${escHtml(u.zipcode || '—')}</td>
      <td>${formatDate(u.created_at)}</td>
      <td>${u.testCount}</td>
      <td>${u.bestAfqt !== null ? u.bestAfqt + 'th %ile' : '—'}</td>
    </tr>
  `).join('');
}

function exportCsv() {
  const headers = ['Name', 'Email', 'Age', 'Education', 'ZIP', 'Joined', 'Tests Taken', 'Best AFQT'];
  const rows = filteredUsers.map(u => [
    csvCell(u.name),
    csvCell(u.email),
    u.age || '',
    csvCell(u.education || ''),
    csvCell(u.zipcode || ''),
    formatDate(u.created_at),
    u.testCount,
    u.bestAfqt !== null ? u.bestAfqt : ''
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
