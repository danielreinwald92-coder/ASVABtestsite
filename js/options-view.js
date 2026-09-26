// Renders "your military job options" from standard scores + AFQT. Shared by
// my-options.html (latest practice result) and the score calculator (typed-in
// scores). Pure HTML-string rendering plus one delegated event binder; the
// matching itself lives in js/job-matcher.js.
(function (root) {
  const M = root.MissionASVABJobMatcher;
  const DATA = root.MissionASVABJobs;

  const GUIDE = {
    AR: ['asvab-arithmetic-reasoning.html', 'Arithmetic Reasoning'],
    WK: ['asvab-word-knowledge.html', 'Word Knowledge'],
    PC: ['asvab-paragraph-comprehension.html', 'Paragraph Comprehension'],
    MK: ['asvab-mathematics-knowledge.html', 'Mathematics Knowledge'],
    GS: ['asvab-general-science.html', 'General Science'],
    EI: ['asvab-electronics-information.html', 'Electronics Information'],
    AS: ['asvab-auto-and-shop.html', 'Auto and Shop'],
    MC: ['asvab-mechanical-comprehension.html', 'Mechanical Comprehension']
  };

  // Long lists show this many, then a "Show N more" disclosure.
  const SHOW_FIRST = 12;

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function slugify(s) {
    return String(s).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  // Must match scripts/build-job-pages.js jobFile()/branchFile().
  function jobHref(key, job) {
    return job.featured ? `jobs/${key}-${slugify(job.code)}-${slugify(job.title)}.html` : `${key}-asvab-scores.html`;
  }

  // Standard scores + AFQT from a saved practice result (quizResults).
  // Returns null when the result has no AFQT (diagnostic, single section, tutor).
  function scoresFromResults(results) {
    const S = root.MissionASVABScoring;
    if (!results || !S || results.testType === 'diagnostic' || typeof results.afqt !== 'number') return null;
    const details = S.getScoreDetails(results.sectionResults);
    if (!details) return null;
    const ss = {};
    Object.keys(details.sections).forEach((k) => { ss[k] = details.sections[k].ss; });
    ss.VE = details.ve.ss;
    return { ss, afqt: results.afqt, full: Object.keys(details.sections).length === 8 };
  }

  function valueText(v) {
    const t = v.term;
    if (t.c) return `${t.c} ${v.value}`;
    if (t.afqt !== undefined) return `AFQT ${v.value}`;
    return `${M.termText(t).replace(/ = \d+$/, '')} = ${v.value}`;
  }

  function jobLine(key, entry, extra) {
    const j = entry.job;
    const yours = (entry.values || []).map(valueText).join(', ');
    return `<li class="opt-job" data-search="${esc((j.code + ' ' + j.title + ' ' + j.category).toLowerCase())}">
        <a class="opt-job-name" href="${esc(jobHref(key, j))}"><span class="opt-job-code">${esc(j.code)}</span> ${esc(j.title)}</a>
        <span class="opt-job-req">Needs ${esc(M.ruleText(j.rule))}${yours ? ` · You: ${esc(yours)}` : ''}</span>${extra || ''}
      </li>`;
  }

  function closeExtra(entry) {
    const g = GUIDE[entry.study];
    const what = entry.worst && entry.worst.c ? entry.worst.c : 'this score';
    return `<span class="opt-job-gap">${entry.gap} point${entry.gap === 1 ? '' : 's'} short on ${esc(what)}.${g ? ` <a href="${g[0]}">Study ${esc(g[1])}</a>` : ''}</span>`;
  }

  function group(key, title, entries, opts) {
    if (!entries.length) return '';
    const line = (e) => jobLine(key, e, opts.extra ? opts.extra(e) : '');
    let listHtml = `<ul class="opt-list">${entries.slice(0, SHOW_FIRST).map(line).join('')}</ul>`;
    if (!opts.collapsed && entries.length > SHOW_FIRST) {
      const rest = entries.length - SHOW_FIRST;
      listHtml += `<details class="opt-more"><summary>Show ${rest} more</summary><ul class="opt-list">${entries.slice(SHOW_FIRST).map(line).join('')}</ul></details>`;
    } else if (opts.collapsed) {
      listHtml = `<ul class="opt-list">${entries.map(line).join('')}</ul>`;
    }
    if (opts.collapsed) {
      return `<details class="opt-group opt-${opts.cls}"><summary>${esc(title)} (${entries.length})</summary>${opts.note ? `<p class="opt-note">${opts.note}</p>` : ''}${listHtml}</details>`;
    }
    return `<section class="opt-group opt-${opts.cls}"><h3>${esc(title)} (${entries.length})</h3>${opts.note ? `<p class="opt-note">${opts.note}</p>` : ''}${listHtml}</section>`;
  }

  function compositeStrip(key, b) {
    const comp = b.composites;
    if (!comp || !Object.keys(comp).length) return '';
    const names = DATA.BRANCHES[key].composites || {};
    const unit = key === 'air-force' ? ' (percentile)' : '';
    return `<p class="opt-composites">Your estimated ${esc(DATA.BRANCHES[key].name)} scores${unit}: ${Object.keys(comp).map((c) => `<span title="${esc(names[c] || c)}"><strong>${esc(c)}</strong> ${comp[c]}</span>`).join(' ')}</p>`;
  }

  function panel(key, b, opts) {
    const meta = DATA.BRANCHES[key];
    let afqtLine = '';
    if (b.meetsAfqt === false) {
      afqtLine = `<p class="opt-afqt opt-afqt-below">Your AFQT is below the ${esc(meta.name)} minimum of ${meta.afqtMin}. Raising your AFQT opens every job below. <a href="asvab-study-plan.html">See the study plan</a></p>`;
    }
    const unknownNote = opts.full ? '' : 'These jobs need General Science, Electronics, Auto and Shop, or Mechanical Comprehension scores. <a href="select-test.html">Take the Full Test</a> to see where you stand.';
    return `<div class="opt-panel" role="tabpanel" id="opt-panel-${key}" aria-labelledby="opt-tab-${key}" data-branch="${key}"${opts.active ? '' : ' hidden'}>
      ${compositeStrip(key, b)}
      ${afqtLine}
      ${group(key, 'You may qualify', b.qualifies, { cls: 'qualify' })}
      ${group(key, 'Close to qualifying', b.close, { cls: 'close', extra: closeExtra })}
      ${b.qualifies.length + b.close.length === 0 && b.meetsAfqt !== false ? '<p class="opt-note">No matches yet in this branch. Keep practicing: small gains in the right sections open jobs quickly.</p>' : ''}
      ${group(key, opts.full ? 'Need a score we could not estimate' : 'Take the Full Test to see these', b.unknown, { cls: 'unknown', collapsed: true, note: unknownNote })}
      ${group(key, 'Not yet', b.notYet, { cls: 'notyet', collapsed: true })}
      ${group(key, 'Need a separate test', b.other, { cls: 'other', collapsed: true, note: 'These jobs are scored with a test given apart from the ASVAB, such as TAPAS or the DLAB.' })}
      <p class="opt-branch-link"><a href="${key}-asvab-scores.html">All ${meta.jobs.length} ${esc(meta.name)} jobs and their requirements</a></p>
    </div>`;
  }

  // scores: { ss, afqt, full }. Returns the full options markup.
  function render(scores, opts) {
    opts = opts || {};
    const result = M.matchAll(DATA, scores);
    const keys = DATA.ORDER;
    const chips = keys.map((k) => {
      const b = result.branches[k];
      const ok = b.meetsAfqt;
      return `<li class="opt-chip ${ok ? 'opt-chip-ok' : 'opt-chip-below'}"><strong>${esc(b.name)}</strong> ${ok ? 'Meets minimum AFQT' : 'Below minimum AFQT'} (${b.afqtMin})</li>`;
    }).join('');
    const tabs = keys.map((k, i) => {
      const b = result.branches[k];
      return `<button type="button" role="tab" class="opt-tab" id="opt-tab-${k}" aria-controls="opt-panel-${k}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-branch="${k}">${esc(b.name)} <span class="opt-tab-count">${b.qualifies.length}</span></button>`;
    }).join('');
    const panels = keys.map((k, i) => panel(k, result.branches[k], { active: i === 0, full: scores.full })).join('');
    return {
      result,
      html: `<ul class="opt-chips" aria-label="Minimum AFQT by branch">${chips}</ul>
    <label class="job-filter opt-filter" for="${opts.filterId || 'optFilter'}">Find a job <input type="search" id="${opts.filterId || 'optFilter'}" placeholder="Try a code, title, or field" autocomplete="off"></label>
    <div class="opt-tabs" role="tablist" aria-label="Branches">${tabs}</div>
    ${panels}
    <p class="job-recruiter">Requirements change often. For the exact requirements for your situation, talk to a local recruiter.</p>`
    };
  }

  function counts(result) {
    let qualifies = 0; let close = 0; let branchesMet = 0;
    for (const k of Object.keys(result.branches)) {
      const b = result.branches[k];
      qualifies += b.qualifies.length;
      close += b.close.length;
      if (b.meetsAfqt) branchesMet++;
    }
    return { qualifies, close, branchesMet, branches: Object.keys(result.branches).length };
  }

  // Tabs (arrow keys per the WAI tabs pattern) + the job filter.
  function bind(container) {
    const tabs = Array.from(container.querySelectorAll('.opt-tab'));
    function select(tab) {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const p = container.querySelector('#' + t.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
      });
    }
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', (e) => {
        let n = null;
        if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') n = tabs[0];
        if (e.key === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n); n.focus(); }
      });
    });
    const input = container.querySelector('.opt-filter input');
    if (input) {
      input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        container.querySelectorAll('.opt-job').forEach((li) => {
          li.hidden = !!q && (li.getAttribute('data-search') || '').indexOf(q) === -1;
        });
        if (q) container.querySelectorAll('details.opt-group, details.opt-more').forEach((d) => { d.open = true; });
      });
    }
  }

  const api = { render, bind, counts, scoresFromResults, jobHref };
  root.MissionASVABOptionsView = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
