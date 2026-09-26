// Job matcher: standard scores + AFQT -> which military jobs a person may
// qualify for, is close to, or needs more sections for. Pure functions only
// (no DOM, no storage) so it runs in the browser, the page generator and tests.
//
// A job rule (js/job-requirements.js) is an OR of paths; each path is an AND
// of terms:
//   { c: 'ST', min: 101 }                       branch composite (Army/AF/Marines)
//   { sum: { VE: 1, AR: 1, MK: 2 }, min: 255 }  sum of standard scores (Navy/CG)
//   { afqt: 65 }                                AFQT percentile floor
//   { test: 'DLAB', min: 110 }                  a test Mission ASVAB does not give
(function (root) {
  const B = root.MissionASVABBranchComposites ||
    (typeof module !== 'undefined' && module.exports ? require('./branch-composites.js') : null);

  // Inputs inside a Navy sum that are not part of our test (Assembling
  // Objects, Coding Speed, the Cyber Test).
  const UNTESTED_INPUTS = ['AO', 'CS', 'CT'];
  const TEST_NAMES = {
    AO: 'Assembling Objects', CS: 'Coding Speed', CT: 'Cyber Test', TAPAS: 'TAPAS', PSM: 'PSM',
    DLAB: 'DLAB', EDPT: 'EDPT', ICTL: 'ICTL', NAPT: 'NAPT', TWO_FACTOR: 'TAPAS 2-factor'
  };
  // "Close" = the best path is short by at most this many points in total.
  const CLOSE_GAP = 10;

  function termValue(term, ctx, branch) {
    if (term.test) return { kind: 'other' };
    if (term.afqt !== undefined) {
      return Number.isFinite(ctx.afqt) ? { kind: 'value', value: ctx.afqt, min: term.afqt } : { kind: 'missing' };
    }
    if (term.c) {
      const v = (ctx.comp[branch] || {})[term.c];
      return Number.isFinite(v) ? { kind: 'value', value: v, min: term.min } : { kind: 'missing' };
    }
    if (term.sum) {
      let total = 0;
      let missing = false;
      for (const k of Object.keys(term.sum)) {
        if (UNTESTED_INPUTS.includes(k)) return { kind: 'other' };
        if (!Number.isFinite(ctx.r[k])) missing = true;
        else total += term.sum[k] * ctx.r[k];
      }
      return missing ? { kind: 'missing' } : { kind: 'value', value: total, min: term.min };
    }
    return { kind: 'other' };
  }

  function evalPath(path, ctx, branch) {
    let gap = 0;
    let worst = null;
    let status = 'value';
    const values = [];
    for (const term of path) {
      const v = termValue(term, ctx, branch);
      if (v.kind === 'other') return { status: 'other' };
      if (v.kind === 'missing') { status = 'missing'; continue; }
      const short = Math.max(0, v.min - v.value);
      values.push({ term, value: v.value, short });
      gap += short;
      if (short > 0 && (!worst || short > worst.short)) worst = { term, short };
    }
    if (status === 'missing') return { status: 'missing' };
    return { status: gap === 0 ? 'met' : 'short', gap, worst, values };
  }

  function termSections(term, branch) {
    if (term.c) return ((B.INGREDIENTS[branch] || {})[term.c]) || [];
    if (term.sum) return Object.keys(term.sum).filter((k) => !UNTESTED_INPUTS.includes(k));
    return [];
  }

  // The section inside the shortfall's formula with the most room to grow
  // (lowest standard score). VE is studied through Word Knowledge.
  function studySection(term, ctx, branch) {
    const secs = termSections(term, branch);
    let best = null;
    for (const s of secs) {
      const v = s === 'VE' ? ctx.r.WK !== undefined ? ctx.r.WK : ctx.r.VE : ctx.r[s];
      if (!Number.isFinite(v)) continue;
      if (!best || v < best.v) best = { s: s === 'VE' ? 'WK' : s, v };
    }
    return best ? best.s : null;
  }

  // status: qualifies | close | notYet | unknown (needs sections we lack) |
  //         other (every way in needs a test we do not give)
  function evaluateJob(branch, job, ctx) {
    const rule = job.rule || [];
    if (!rule.length) return { status: 'qualifies', gap: 0 };
    const paths = rule.map((p) => evalPath(p, ctx, branch));
    const met = paths.findIndex((p) => p.status === 'met');
    if (met >= 0) return { status: 'qualifies', gap: 0, path: met, values: paths[met].values };
    let best = null;
    paths.forEach((p, i) => {
      if (p.status === 'short' && (!best || p.gap < best.gap)) best = Object.assign({ path: i }, p);
    });
    const alsoOther = paths.some((p) => p.status === 'other');
    if (best) {
      return {
        status: best.gap <= CLOSE_GAP ? 'close' : 'notYet',
        gap: best.gap,
        path: best.path,
        values: best.values,
        worst: best.worst.term,
        study: studySection(best.worst.term, ctx, branch),
        alsoOther
      };
    }
    if (paths.some((p) => p.status === 'missing')) return { status: 'unknown', alsoOther };
    return { status: 'other' };
  }

  // scores: { ss: { GS, AR, WK, PC, MK, EI, AS, MC, VE }, afqt: percentile|null }
  function context(scores) {
    const ss = (scores && scores.ss) || {};
    return {
      r: B.rounded(ss),
      afqt: scores && Number.isFinite(scores.afqt) ? scores.afqt : null,
      comp: { army: B.army(ss), 'air-force': B.airForce(ss), 'marine-corps': B.marines(ss) }
    };
  }

  function matchBranch(key, branch, ctx) {
    const out = {
      key, name: branch.name, afqtMin: branch.afqtMin,
      meetsAfqt: ctx.afqt === null ? null : ctx.afqt >= branch.afqtMin,
      composites: ctx.comp[key] || null,
      qualifies: [], close: [], notYet: [], unknown: [], other: []
    };
    for (const job of branch.jobs) {
      const res = evaluateJob(key, job, ctx);
      const entry = Object.assign({ job }, res);
      if (out.meetsAfqt === false && (res.status === 'qualifies' || res.status === 'close')) {
        entry.status = 'notYet';
        entry.afqtShort = true;
      }
      out[entry.status].push(entry);
    }
    out.close.sort((a, b) => a.gap - b.gap);
    return out;
  }

  function matchAll(data, scores) {
    const ctx = context(scores);
    const branches = {};
    for (const key of data.ORDER) branches[key] = matchBranch(key, data.BRANCHES[key], ctx);
    return { afqt: ctx.afqt, branches };
  }

  // --- Plain-language rule text (pages and the options view) ---
  function sumText(sum) {
    return Object.keys(sum).map((k) => (sum[k] === 1 ? '' : sum[k]) + k).join(' + ');
  }

  function termText(term) {
    if (term.c) return `${term.c} ${term.min}`;
    if (term.sum) return `${sumText(term.sum)} = ${term.min}`;
    if (term.afqt !== undefined) return `AFQT ${term.afqt}`;
    if (term.test) return `${TEST_NAMES[term.test] || term.test}${term.min ? ' ' + term.min : ''}`;
    return '';
  }

  function ruleText(rule) {
    if (!rule || !rule.length) return 'No line score required';
    return rule.map((p) => p.map(termText).join(' and ')).join(', or ');
  }

  // Every non-ASVAB test any path mentions (for "may also require" notes).
  function otherTests(rule) {
    const set = new Set();
    for (const p of rule || []) {
      for (const t of p) {
        if (t.test) set.add(TEST_NAMES[t.test] || t.test);
        if (t.sum) Object.keys(t.sum).filter((k) => UNTESTED_INPUTS.includes(k)).forEach((k) => set.add(TEST_NAMES[k]));
      }
    }
    return [...set];
  }

  // The lowest single-composite minimum on a job (for sorting / cards).
  function composites(rule) {
    const set = new Set();
    for (const p of rule || []) for (const t of p) if (t.c) set.add(t.c);
    return [...set];
  }

  const api = { CLOSE_GAP, UNTESTED_INPUTS, TEST_NAMES, context, evaluateJob, matchBranch, matchAll, termText, ruleText, otherTests, composites, studySection };
  root.MissionASVABJobMatcher = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
