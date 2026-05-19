async function loadDashboard() {
  const session = await requireAuth();
  if (!session) return;

  const client = getClient();

  // Fetch profile and results in parallel
  const [profileRes, resultsRes] = await Promise.all([
    client.from('profiles').select('*').eq('id', session.user.id).single(),
    client.from('test_results')
      .select('*')
      .eq('user_id', session.user.id)
      .order('taken_at', { ascending: false })
  ]);

  const profile = profileRes.data;
  const results = resultsRes.data || [];

  document.getElementById('userName').textContent = profile ? profile.name.split(' ')[0] : 'There';

  if (results.length === 0) {
    showWelcomeState();
    return;
  }

  hideWelcomeState();
  renderScoreSummary(results);
  renderProgressChart(results);
  renderSectionBreakdown(results);
  renderFocusPanel(results);
  renderTestHistory(results);
}

function showWelcomeState() {
  document.getElementById('welcomeState').style.display = 'block';
  document.getElementById('dashboardContent').style.display = 'none';
}

function hideWelcomeState() {
  document.getElementById('welcomeState').style.display = 'none';
  document.getElementById('dashboardContent').style.display = 'block';
}

function renderScoreSummary(results) {
  const latest = results[0];
  const previous = results[1];

  document.getElementById('latestAfqt').textContent = latest.afqt_score !== null ? latest.afqt_score : '—';
  document.getElementById('latestDate').textContent = formatDate(latest.taken_at);

  if (previous && latest.afqt_score !== null && previous.afqt_score !== null) {
    const delta = latest.afqt_score - previous.afqt_score;
    const deltaEl = document.getElementById('scoreDelta');
    if (delta > 0) {
      deltaEl.textContent = `↑ ${delta} points since last test`;
      deltaEl.style.color = '#27ae60';
    } else if (delta < 0) {
      deltaEl.textContent = `↓ ${Math.abs(delta)} points since last test`;
      deltaEl.style.color = '#c0392b';
    } else {
      deltaEl.textContent = 'No change since last test';
      deltaEl.style.color = 'var(--text-secondary)';
    }
    deltaEl.style.display = 'block';
  }
}

function renderProgressChart(results) {
  const container = document.getElementById('progressChart');
  // Need at least 2 data points for a line chart
  const afqtResults = results.filter(r => r.afqt_score !== null);

  if (afqtResults.length < 2) {
    container.innerHTML = '<p style="text-align:center; color:var(--text-secondary); padding: 2rem 0;">Take another test to see your score trend.</p>';
    return;
  }

  const data = afqtResults.slice().reverse(); // oldest first
  const scores = data.map(r => r.afqt_score);
  const minScore = Math.max(0, Math.min(...scores) - 10);
  const maxScore = Math.min(99, Math.max(...scores) + 10);
  const W = 500, H = 180, PAD_X = 40, PAD_Y = 30;
  const chartW = W - PAD_X * 2;
  const chartH = H - PAD_Y * 2;
  const xStep = chartW / (data.length - 1);
  const yRange = maxScore - minScore || 1;

  const points = data.map((r, i) => {
    const x = PAD_X + i * xStep;
    const y = PAD_Y + chartH - ((r.afqt_score - minScore) / yRange) * chartH;
    return { x, y, score: r.afqt_score, date: formatDate(r.taken_at) };
  });

  const polyline = points.map(p => `${p.x},${p.y}`).join(' ');

  const dots = points.map(p => `
    <circle cx="${p.x}" cy="${p.y}" r="5" fill="var(--gold-500)" stroke="var(--white)" stroke-width="2">
      <title>${p.score}th percentile — ${p.date}</title>
    </circle>
  `).join('');

  const labels = points.map((p, i) => {
    // Show label for first, last, and every 3rd point to avoid crowding
    if (i === 0 || i === points.length - 1 || i % 3 === 0) {
      return `<text x="${p.x}" y="${H - 5}" text-anchor="middle" font-size="10" fill="var(--text-secondary)">${formatDateShort(data[i].taken_at)}</text>`;
    }
    return '';
  }).join('');

  container.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" style="width:100%; height:auto; overflow:visible;">
      <polyline points="${polyline}" fill="none" stroke="var(--navy-600)" stroke-width="2.5" stroke-linejoin="round"/>
      ${dots}
      ${labels}
      <text x="${PAD_X - 8}" y="${PAD_Y}" text-anchor="end" font-size="10" fill="var(--text-secondary)">${maxScore}</text>
      <text x="${PAD_X - 8}" y="${PAD_Y + chartH}" text-anchor="end" font-size="10" fill="var(--text-secondary)">${minScore}</text>
    </svg>
  `;
}

const SECTION_NAMES = { AR: 'Arithmetic Reasoning', MK: 'Math Knowledge', WK: 'Word Knowledge', PC: 'Paragraph Comprehension' };
const AFQT_SECTIONS = ['AR', 'MK', 'WK', 'PC'];

function getSectionScore(sectionResults, code) {
  const s = sectionResults && sectionResults[code];
  if (!s || !s.total) return null;
  return Math.round((s.correct / s.total) * 100);
}

function renderSectionBreakdown(results) {
  const container = document.getElementById('sectionCards');
  const latest = results[0];
  const previous = results[1];

  container.innerHTML = AFQT_SECTIONS.map(code => {
    const score = getSectionScore(latest.section_scores, code);
    if (score === null) return '';

    const prevScore = previous ? getSectionScore(previous.section_scores, code) : null;
    let trendArrow = '', trendColor = 'var(--text-secondary)';
    if (prevScore !== null) {
      const diff = score - prevScore;
      if (diff > 0) { trendArrow = ' ↑'; trendColor = '#27ae60'; }
      else if (diff < 0) { trendArrow = ' ↓'; trendColor = '#c0392b'; }
      else { trendArrow = ' →'; }
    }

    let band = score >= 70 ? 'green' : score >= 50 ? 'yellow' : 'red';
    const bandColors = { green: '#27ae60', yellow: '#e67e22', red: '#c0392b' };

    return `
      <div class="section-card">
        <div class="section-card-name">${SECTION_NAMES[code]}</div>
        <div class="section-card-score" style="color: ${bandColors[band]}">${score}%</div>
        <div class="section-card-trend" style="color: ${trendColor}">${trendArrow || '—'}</div>
      </div>
    `;
  }).join('');
}

function computeFocusSections(results) {
  const latest = results[0];
  const previous = results.length > 1 ? results[1] : null;

  const scored = AFQT_SECTIONS
    .map(code => {
      const score = getSectionScore(latest.section_scores, code);
      if (score === null) return null;
      const prevScore = previous ? getSectionScore(previous.section_scores, code) : null;
      const trend = prevScore !== null ? score - prevScore : 0;
      return { code, score, trend };
    })
    .filter(Boolean);

  // Sort: lowest score first, then worst trend (most negative) as tiebreaker
  scored.sort((a, b) => {
    if (a.score !== b.score) return a.score - b.score;
    return a.trend - b.trend;
  });

  return scored.slice(0, 2);
}

function renderFocusPanel(results) {
  const panel = document.getElementById('focusPanel');
  const focus = computeFocusSections(results);

  if (focus.length === 0) {
    panel.style.display = 'none';
    return;
  }

  const messages = focus.map(f => {
    const name = SECTION_NAMES[f.code];
    const hasTrend = results.length > 1;
    const isDropping = f.trend < 0;

    if (hasTrend && isDropping) {
      return `<strong>${name}</strong> has dropped in your recent tests and is your weakest area.`;
    } else if (f.score < 50) {
      return `<strong>${name}</strong> is your lowest-scoring section at ${f.score}%.`;
    } else {
      return `<strong>${name}</strong> has room to improve (${f.score}%).`;
    }
  });

  const focusNames = focus.map(f => SECTION_NAMES[f.code]).join(' and ');
  const suggestion = messages.join(' ') + ` Focus on ${focusNames} before your next test.`;

  panel.innerHTML = `
    <div class="focus-label">Focus This Week</div>
    <p class="focus-text">${suggestion}</p>
    <a href="study-guide.html" class="focus-cta">Go to Study Guide →</a>
  `;
  panel.style.display = 'block';
}

let historyPage = 0;
const HISTORY_PAGE_SIZE = 10;
let _allResults = []; // cache for pagination

function renderTestHistory(results) {
  _allResults = results; // keep in sync
  const container = document.getElementById('historyTable');
  const page = results.slice(historyPage * HISTORY_PAGE_SIZE, (historyPage + 1) * HISTORY_PAGE_SIZE);

  const rows = page.map((r, i) => {
    const globalIdx = historyPage * HISTORY_PAGE_SIZE + i;
    const sectionDetail = r.section_scores
      ? AFQT_SECTIONS.map(code => {
          const score = getSectionScore(r.section_scores, code);
          return score !== null ? `<span>${SECTION_NAMES[code]}: <strong>${score}%</strong></span>` : '';
        }).filter(Boolean).join(' &nbsp;|&nbsp; ')
      : '';

    return `
      <tr class="history-row" data-idx="${globalIdx}">
        <td>${formatDate(r.taken_at)}</td>
        <td>${r.test_type === 'full' ? 'Full Assessment' : 'AFQT'}</td>
        <td>${r.afqt_score !== null ? r.afqt_score + 'th %ile' : '—'}</td>
        <td><button class="expand-btn" onclick="toggleHistoryDetail(${globalIdx})">▾</button></td>
      </tr>
      <tr class="history-detail" id="detail-${globalIdx}" style="display:none;">
        <td colspan="4"><div class="detail-sections">${sectionDetail}</div></td>
      </tr>
    `;
  }).join('');

  container.innerHTML = `
    <table class="history-tbl">
      <thead><tr><th>Date</th><th>Type</th><th>AFQT</th><th></th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    ${results.length > HISTORY_PAGE_SIZE ? `
      <div class="history-pagination">
        <button onclick="changeHistoryPage(-1)" ${historyPage === 0 ? 'disabled' : ''}>← Previous</button>
        <span>Page ${historyPage + 1} of ${Math.ceil(results.length / HISTORY_PAGE_SIZE)}</span>
        <button onclick="changeHistoryPage(1)" ${(historyPage + 1) * HISTORY_PAGE_SIZE >= results.length ? 'disabled' : ''}>Next →</button>
      </div>
    ` : ''}
  `;
}

function toggleHistoryDetail(idx) {
  const row = document.getElementById(`detail-${idx}`);
  row.style.display = row.style.display === 'none' ? 'table-row' : 'none';
}

function changeHistoryPage(dir) {
  historyPage += dir;
  renderTestHistory(_allResults); // re-slice cached data, no extra network call
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateShort(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
