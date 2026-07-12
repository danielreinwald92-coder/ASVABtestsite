let allUsers = [];
let filteredUsers = [];
let currentAdminId = null;
let sortKey = 'created_at';
let sortDir = 'desc';

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
  currentAdminId = profile.id;

  const client = getClient();

  const [profilesRes, signinsRes] = await Promise.all([
    client.from('profiles')
      .select('*, test_results(id, test_type, afqt_score, section_scores, line_scores, taken_at)')
      .order('created_at', { ascending: false }),
    client.rpc('admin_user_signins')
  ]);

  const signinMap = new Map();
  for (const row of signinsRes.data || []) {
    signinMap.set(row.user_id, row.last_sign_in_at);
  }

  allUsers = (profilesRes.data || []).map(p => {
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
      is_admin: p.is_admin,
      created_at: p.created_at,
      test_date: p.test_date,
      tests,
      testCount: tests.length,
      bestAfqt,
      lastTestAt,
      lastSignInAt: signinMap.get(p.id) || null
    };
  });

  bindStaticHandlers();
  renderStats();
  applyFilters();
}

// Bound exactly once: loadAdmin() re-runs after every admin action (toggle
// admin, delete tests/user), and re-binding here used to stack duplicate
// listeners — sort clicks fired twice (flipping back), search ran N times.
let _handlersBound = false;
function bindStaticHandlers() {
  if (_handlersBound) return;
  _handlersBound = true;
  bindSortHandlers();
  bindLiveSearch();
  bindRowClicks();
}

function bindSortHandlers() {
  document.querySelectorAll('#adminTableHead th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      if (sortKey === key) {
        sortDir = sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        sortKey = key;
        sortDir = (key === 'created_at' || key === 'lastTestAt' || key === 'lastSignInAt' || key === 'testCount' || key === 'bestAfqt') ? 'desc' : 'asc';
      }
      renderTable();
    });
  });
}

function bindLiveSearch() {
  document.getElementById('filterSearch').addEventListener('input', applyFilters);
}

// Delegated row-click handler (replaces inline onclick on each <tr>, which
// helps future CSP work and avoids injecting raw ids into markup).
function bindRowClicks() {
  document.getElementById('adminTableBody').addEventListener('click', (e) => {
    const row = e.target.closest('tr[data-id]');
    if (row) openUserModal(row.dataset.id, row);
  });
}

// Delegated handlers for the modal action buttons rendered into
// #userModalContent (previously inline onclick attributes). Bound once at the
// document level so it survives innerHTML re-renders.
document.addEventListener('click', (e) => {
  const btn = e.target.closest && e.target.closest('.btn-action[data-action]');
  if (!btn) return;
  const id = btn.dataset.id;
  switch (btn.dataset.action) {
    case 'toggle-admin':
      toggleAdminFlag(id, btn.dataset.makeAdmin === 'true');
      break;
    case 'delete-tests':
      confirmDeleteTests(id);
      break;
    case 'delete-user':
      confirmDeleteUser(id);
      break;
  }
});

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
  const search = document.getElementById('filterSearch').value.trim().toLowerCase();
  const fromDate = document.getElementById('filterFrom').value;
  const toDate = document.getElementById('filterTo').value;
  const education = document.getElementById('filterEducation').value;
  const zip = document.getElementById('filterZip').value.trim().toLowerCase();
  const minTests = parseInt(document.getElementById('filterMinTests').value, 10) || 0;

  filteredUsers = allUsers.filter(u => {
    if (search) {
      const hay = `${u.name || ''} ${u.email || ''}`.toLowerCase();
      if (!hay.includes(search)) return false;
    }
    if (fromDate && new Date(u.created_at) < new Date(fromDate)) return false;
    if (toDate && new Date(u.created_at) > new Date(toDate + 'T23:59:59')) return false;
    if (education && u.education !== education) return false;
    if (zip && !(u.zipcode || '').toLowerCase().startsWith(zip)) return false;
    if (u.testCount < minTests) return false;
    return true;
  });

  renderTable();
}

function compareValues(a, b, key) {
  let va = a[key], vb = b[key];
  if (key === 'created_at' || key === 'lastTestAt' || key === 'lastSignInAt') {
    va = va ? new Date(va).getTime() : -Infinity;
    vb = vb ? new Date(vb).getTime() : -Infinity;
  } else if (key === 'name' || key === 'email') {
    va = (va || '').toLowerCase();
    vb = (vb || '').toLowerCase();
  } else {
    if (va == null) va = -Infinity;
    if (vb == null) vb = -Infinity;
  }
  if (va < vb) return -1;
  if (va > vb) return 1;
  return 0;
}

function renderTable() {
  const tbody = document.getElementById('adminTableBody');

  document.querySelectorAll('#adminTableHead .sort-ind').forEach(el => { el.textContent = ''; });
  document.querySelectorAll('#adminTableHead th.sortable').forEach(th => { th.setAttribute('aria-sort', 'none'); });
  const ind = document.querySelector(`#adminTableHead .sort-ind[data-for="${sortKey}"]`);
  if (ind) ind.textContent = sortDir === 'asc' ? '▲' : '▼';
  const activeTh = document.querySelector(`#adminTableHead th.sortable[data-sort="${sortKey}"]`);
  if (activeTh) activeTh.setAttribute('aria-sort', sortDir === 'asc' ? 'ascending' : 'descending');

  const sorted = filteredUsers.slice().sort((a, b) => {
    const cmp = compareValues(a, b, sortKey);
    return sortDir === 'asc' ? cmp : -cmp;
  });

  if (sorted.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; padding: 2rem; color: var(--text-secondary);">No users match these filters.</td></tr>';
    document.getElementById('filteredCount').textContent = '0 users';
    return;
  }

  document.getElementById('filteredCount').textContent = `${sorted.length} user${sorted.length !== 1 ? 's' : ''}`;

  tbody.innerHTML = sorted.map(u => `
    <tr data-id="${escHtml(u.id)}" class="user-row" style="cursor:pointer;">
      <td>${escHtml(u.name || '—')}${u.is_admin ? '<span class="admin-badge-mini">Admin</span>' : ''}</td>
      <td>${escHtml(u.email)}</td>
      <td>${escHtml(String(u.age || '—'))}</td>
      <td>${escHtml(u.education || '—')}</td>
      <td>${escHtml(u.zipcode || '—')}</td>
      <td>${formatDate(u.created_at)}</td>
      <td>${u.testCount}</td>
      <td>${u.bestAfqt !== null ? u.bestAfqt + 'th %ile' : '—'}</td>
      <td>${u.lastTestAt ? formatDate(u.lastTestAt) : '—'}</td>
      <td>${u.lastSignInAt ? formatRelative(u.lastSignInAt) : 'never'}</td>
    </tr>
  `).join('');
}

function openUserModal(userId, triggerEl) {
  const user = allUsers.find(u => u.id === userId);
  if (!user) return;

  // Remember what to restore focus to once the modal closes (the clicked row,
  // or whatever currently has focus, e.g. an action button on re-open).
  const trigger = triggerEl || document.activeElement;

  const tests = user.tests;
  const latest = tests[0];
  const oldest = tests[tests.length - 1];

  let improvement = '';
  if (tests.length >= 2 && latest && oldest && latest.afqt_score != null && oldest.afqt_score != null) {
    const diff = latest.afqt_score - oldest.afqt_score;
    const cls = diff > 0 ? 'trend-up' : diff < 0 ? 'trend-down' : 'trend-flat';
    const sign = diff > 0 ? '+' : '';
    improvement = `<span class="${cls}">${sign}${diff}</span>`;
  } else {
    improvement = '<span class="trend-flat">—</span>';
  }

  const isSelf = user.id === currentAdminId;
  const adminToggleLabel = user.is_admin ? 'Revoke admin' : 'Grant admin';

  const content = document.getElementById('userModalContent');
  content.innerHTML = `
    <h2>${escHtml(user.name || user.email)}${user.is_admin ? '<span class="admin-badge-mini">Admin</span>' : ''}</h2>
    <div class="sub">
      ${escHtml(user.email)} &nbsp;·&nbsp;
      Joined ${formatDate(user.created_at)}
      ${user.lastSignInAt ? ' · Last login ' + formatRelative(user.lastSignInAt) : ''}
      ${user.test_date ? ' · Target test date: ' + formatDate(user.test_date) : ''}
    </div>

    <div class="modal-stats">
      <div class="modal-stat"><div class="v">${user.testCount}</div><div class="l">Tests Taken</div></div>
      <div class="modal-stat"><div class="v">${user.bestAfqt !== null ? user.bestAfqt : '—'}</div><div class="l">Best AFQT %ile</div></div>
      <div class="modal-stat"><div class="v">${latest && latest.afqt_score != null ? latest.afqt_score : '—'}</div><div class="l">Latest AFQT %ile</div></div>
      <div class="modal-stat"><div class="v">${improvement}</div><div class="l">First → Latest</div></div>
    </div>

    ${tests.length === 0 ? `
      <div class="empty-note">This user has not completed any tests yet.</div>
    ` : `
      <h3>Test History</h3>
      <table class="attempts-table">
        <thead><tr><th>Date</th><th>Type</th><th>AFQT %ile</th><th>Sections</th></tr></thead>
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
      <div class="section-grid">${renderScoreGrid(latest.section_scores, SECTION_LABELS)}</div>

      ${latest.line_scores && Object.keys(latest.line_scores).length > 0 ? `
        <h3>Latest Test — Army Line Scores</h3>
        <div class="section-grid">${renderScoreGrid(latest.line_scores, LINE_LABELS)}</div>
      ` : ''}
    `}

    <div class="modal-actions">
      ${isSelf ? '' : `<button class="btn-action" data-action="toggle-admin" data-id="${escHtml(user.id)}" data-make-admin="${!user.is_admin}">${adminToggleLabel}</button>`}
      ${tests.length > 0 ? `<button class="btn-action danger" data-action="delete-tests" data-id="${escHtml(user.id)}">Delete test history</button>` : ''}
      ${isSelf ? '' : `<button class="btn-action danger" data-action="delete-user" data-id="${escHtml(user.id)}">Delete user</button>`}
    </div>
    <div class="action-status" id="actionStatus"></div>
  `;

  const modal = document.getElementById('userModal');
  modal.classList.add('open');
  if (typeof FocusTrap !== 'undefined') {
    FocusTrap.activate(modal, {
      trigger,
      initialFocus: modal.querySelector('.modal-close'),
      onEscape: closeUserModal
    });
  }
}

function closeUserModal() {
  const modal = document.getElementById('userModal');
  modal.classList.remove('open');
  if (typeof FocusTrap !== 'undefined') FocusTrap.release(modal);
}

function setActionStatus(msg, cls) {
  const el = document.getElementById('actionStatus');
  if (!el) return;
  el.textContent = msg;
  el.className = 'action-status' + (cls ? ' ' + cls : '');
}

async function toggleAdminFlag(userId, makeAdmin) {
  setActionStatus('Updating…');
  const { error } = await getClient().rpc('admin_set_is_admin', { target_id: userId, val: makeAdmin });
  if (error) {
    setActionStatus(error.message, 'err');
    return;
  }
  setActionStatus(makeAdmin ? 'Granted admin.' : 'Revoked admin.', 'ok');
  await loadAdmin();
  setTimeout(() => openUserModal(userId), 100);
}

async function confirmDeleteTests(userId) {
  if (!confirm('Delete ALL test history for this user? This cannot be undone.')) return;
  setActionStatus('Deleting…');
  const { data, error } = await getClient().rpc('admin_delete_user_tests', { target_id: userId });
  if (error) {
    setActionStatus(error.message, 'err');
    return;
  }
  setActionStatus(`Deleted ${data} test result${data === 1 ? '' : 's'}.`, 'ok');
  await loadAdmin();
  setTimeout(() => openUserModal(userId), 100);
}

async function confirmDeleteUser(userId) {
  const user = allUsers.find(u => u.id === userId);
  const label = user ? (user.name || user.email) : 'this user';
  if (!confirm(`Permanently delete ${label}? Their account and all test history will be removed. This cannot be undone.`)) return;
  setActionStatus('Deleting…');
  const { error } = await getClient().rpc('admin_delete_user', { target_id: userId });
  if (error) {
    setActionStatus(error.message, 'err');
    return;
  }
  closeUserModal();
  await loadAdmin();
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
    let display = '—';
    if (v && typeof v === 'object') {
      if (v.correct != null && v.total != null) {
        const pct = v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0;
        display = `${v.correct}/${v.total} · ${pct}%`;
      } else if (v.score != null) {
        display = String(v.score);
      } else if (v.raw != null) {
        display = String(v.raw);
      }
    } else if (v != null) {
      display = String(v);
    }
    return `
      <div class="section-pill">
        <div class="code">${escHtml(k)}</div>
        <div class="val">${escHtml(display)}${labels[k] ? ' · ' + escHtml(labels[k]) : ''}</div>
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
  const headers = ['Name', 'Email', 'Age', 'Education', 'ZIP', 'Joined', 'Tests Taken', 'Best AFQT', 'Last Test', 'Last Login', 'Admin'];
  const rows = filteredUsers.map(u => [
    csvCell(u.name),
    csvCell(u.email),
    csvCell(String(u.age || '')),
    csvCell(u.education || ''),
    csvCell(u.zipcode || ''),
    formatDate(u.created_at),
    csvCell(String(u.testCount)),
    u.bestAfqt !== null ? u.bestAfqt : '',
    u.lastTestAt ? formatDate(u.lastTestAt) : '',
    u.lastSignInAt ? formatDate(u.lastSignInAt) : '',
    u.is_admin ? 'yes' : 'no'
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
  let s = String(val);
  // Neutralize spreadsheet formula injection: a user who registers with a
  // name like =HYPERLINK(...) would otherwise execute when the export is
  // opened in Excel/Sheets.
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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

function formatRelative(iso) {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const sec = Math.round((now - then) / 1000);
  if (sec < 60) return 'just now';
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.round(hr / 24);
  if (d < 30) return `${d}d ago`;
  return formatDate(iso);
}

// Escape-to-close is handled by FocusTrap while the modal is open (see
// openUserModal), which also restores focus to the triggering element.
