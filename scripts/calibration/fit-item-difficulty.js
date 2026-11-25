#!/usr/bin/env node
'use strict';
// Per-item difficulty calibration for the AFQT sections (AR, WK, PC, MK).
// Offline tool; not part of the build. Writes nothing unless --write is given.
//
// 1. Export every timed AFQT-section answer (read-only) to a JSON file:
//
//    supabase db query --remote=<ref> --read-only --output-format json "
//      select t.id tid, t.user_id uid, t.taken_at, q->>'section' s,
//             q->>'id' i, (q->>'correct')::boolean c
//      from test_results t, jsonb_array_elements(t.question_results) q
//      where t.mode = 'timed' and q->>'section' in ('AR','WK','PC','MK')
//        and q->>'id' is not null order by t.taken_at" > responses.json
//
// 2. node scripts/calibration/fit-item-difficulty.js responses.json            (fit + holdout report)
//    node scripts/calibration/fit-item-difficulty.js responses.json --write    (also rewrites the
//                                                     generated block in js/irt-params.js)
//
// Model (per section), fitted by marginal maximum likelihood with EM
// (Bock-Aitkin) over theta ~ N(mu, 1):
//   p = c + (1 - c) / (1 + exp(-1.702 * a * (theta - b_i)))
//   c       fixed at the official pool value (SECTION_IRT)
//   a       official pool a * one section scale s (estimated; replaces A_SCALE)
//   b_i     per item, with a normal prior centred on the item's difficulty
//           tag (b_tag = bMean + DIFF_OFFSET[tag] * bSD). The prior SD tau is
//           set by empirical Bayes, so items with few answers stay near their
//           tag and items with many answers move toward what the data say.
// Cleaning: legacy numeric ids (pre-July) are dropped; only each user's FIRST
// exposure to an item counts (retake memorisation would make items look easy);
// WK rows before 2026-09-27 are dropped (136 WK items were rewritten that day).
// The final b values are re-centred so the section's mean b equals the mean of
// its tag-based b: the fit re-orders difficulty within a section but does not
// move the overall score level, which only external (real-test) data can set.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const IRT = require('../../js/irt.js');
const P = require('../../js/irt-params.js');

const SECTIONS = ['AR', 'WK', 'PC', 'MK'];
const WK_SINCE = '2026-09-27';
const MIN_ANSWERS = 10; // items with fewer first-exposure answers keep their tag b

const file = process.argv[2];
const WRITE = process.argv.includes('--write');
const HOLDOUT = !process.argv.includes('--no-holdout');
if (!file) { console.error('usage: fit-item-difficulty.js <responses.json> [--write]'); process.exit(1); }

// ---- question bank ----
const sandbox = {};
sandbox.globalThis = sandbox;
sandbox.window = sandbox;
for (const f of ['js/section-config.js', 'js/quiz-data.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', '..', f), 'utf8'), sandbox);
}
const bank = sandbox.asvabData.questions;
const itemInfo = {};
for (const sec of SECTIONS) for (const q of bank[sec]) itemInfo[q.id] = { sec, tag: q.difficulty };

function tagB(sec, tag) {
  const s = P.SECTION_IRT[sec];
  return s.bMean + (P.DIFF_OFFSET[tag] !== undefined ? P.DIFF_OFFSET[tag] : 0) * s.bSD;
}

// ---- load + clean responses ----
const raw = JSON.parse(fs.readFileSync(file, 'utf8')).rows;
raw.sort((x, y) => (x.taken_at < y.taken_at ? -1 : x.taken_at > y.taken_at ? 1 : 0));
const seen = new Set();
const recMap = new Map(); // `${tid}|${sec}` -> { uid, sec, resp: [[id, y]] }
let dropped = { legacy: 0, wkOld: 0, repeat: 0 };
for (const r of raw) {
  const info = itemInfo[r.i];
  if (!info || info.sec !== r.s) { dropped.legacy++; continue; }
  if (r.s === 'WK' && r.taken_at < WK_SINCE) { dropped.wkOld++; continue; }
  const key = `${r.uid}|${r.i}`;
  if (seen.has(key)) { dropped.repeat++; continue; }
  seen.add(key);
  const rk = `${r.tid}|${r.s}`;
  if (!recMap.has(rk)) recMap.set(rk, { uid: r.uid, sec: r.s, resp: [] });
  recMap.get(rk).resp.push([r.i, r.c ? 1 : 0]);
}
const records = [...recMap.values()];
console.log(`responses ${raw.length}; dropped legacy-id ${dropped.legacy}, WK pre-rewrite ${dropped.wkOld}, repeat exposure ${dropped.repeat}; ${records.length} section records`);

// ---- quadrature ----
const NQ = 41;
const Z = [], ZW = [];
for (let i = 0; i < NQ; i++) { const z = -4 + i * 0.2; Z.push(z); ZW.push(Math.exp(-z * z / 2)); }
const zs = ZW.reduce((a, b) => a + b, 0);
for (let i = 0; i < NQ; i++) ZW[i] /= zs;

const p3 = (theta, a, b, c) => IRT.p3pl(theta, { a, b, c });

// Marginal log-likelihood of one record.
function recLogLik(resp, mu, aOf, bOf, c) {
  let lik = 0;
  for (let q = 0; q < NQ; q++) {
    const th = mu + Z[q];
    let l = 1;
    for (const [id, y] of resp) { const p = p3(th, aOf(id), bOf(id), c); l *= y ? p : 1 - p; }
    lik += ZW[q] * l;
  }
  return Math.log(Math.max(lik, 1e-300));
}

// Fit one section. tau = prior SD of b around the tag value.
function fitSection(sec, recs, tau, opts = {}) {
  const s = P.SECTION_IRT[sec];
  const c = s.c;
  const ids = [...new Set(recs.flatMap((r) => r.resp.map((x) => x[0])))];
  const b = {}, b0 = {}, n = {};
  for (const id of ids) { b0[id] = tagB(sec, itemInfo[id].tag); b[id] = b0[id]; n[id] = 0; }
  for (const r of recs) for (const [id] of r.resp) n[id]++;
  let scale = opts.fixedScale || P.A_SCALE[sec] || 1;
  let mu = 0;
  const aOf = () => s.a * scale;

  for (let iter = 0; iter < (opts.iters || 60); iter++) {
    // E-step: posterior weights per record over the quadrature nodes.
    const post = recs.map((r) => {
      const w = new Array(NQ);
      let tot = 0;
      for (let q = 0; q < NQ; q++) {
        const th = mu + Z[q];
        let l = ZW[q];
        for (const [id, y] of r.resp) { const p = p3(th, aOf(), b[id], c); l *= y ? p : 1 - p; }
        w[q] = l; tot += l;
      }
      for (let q = 0; q < NQ; q++) w[q] /= tot;
      return w;
    });
    // Expected counts per item per node: N (exposures) and R (correct).
    const Nq = {}, Rq = {};
    for (const id of ids) { Nq[id] = new Float64Array(NQ); Rq[id] = new Float64Array(NQ); }
    let muNum = 0;
    recs.forEach((r, k) => {
      const w = post[k];
      for (let q = 0; q < NQ; q++) muNum += w[q] * (mu + Z[q]);
      for (const [id, y] of r.resp) for (let q = 0; q < NQ; q++) { Nq[id][q] += w[q]; if (y) Rq[id][q] += w[q]; }
    });
    const newMu = muNum / recs.length;
    // M-step for each b: a few Newton steps on expected log-lik + normal prior.
    const D = 1.702;
    if (!opts.fixedB) {
      for (const id of ids) {
        let bi = b[id];
        for (let k = 0; k < 4; k++) {
          let g = -(bi - b0[id]) / (tau * tau), h = -1 / (tau * tau);
          const a = aOf();
          for (let q = 0; q < NQ; q++) {
            if (Nq[id][q] < 1e-12) continue;
            const th = mu + Z[q];
            const L = 1 / (1 + Math.exp(-D * a * (th - bi)));
            const p = c + (1 - c) * L;
            const dp = -(1 - c) * D * a * L * (1 - L); // dp/db
            const rq = Rq[id][q], nq = Nq[id][q];
            g += (rq / p - (nq - rq) / (1 - p)) * dp;
            h -= nq * dp * dp / (p * (1 - p)); // Fisher scoring
          }
          bi -= g / h;
          bi = Math.max(-4, Math.min(4, bi));
        }
        b[id] = bi;
      }
    }
    // M-step for the section scale: golden-section search on expected log-lik.
    if (!opts.fixedScale) {
      const ell = (sc) => {
        let L = 0;
        const a = s.a * sc;
        for (const id of ids) for (let q = 0; q < NQ; q++) {
          if (Nq[id][q] < 1e-12) continue;
          const p = p3(mu + Z[q], a, b[id], c);
          L += Rq[id][q] * Math.log(p) + (Nq[id][q] - Rq[id][q]) * Math.log(1 - p);
        }
        return L;
      };
      let lo = 0.1, hi = 1.6;
      for (let k = 0; k < 30; k++) {
        const m1 = lo + (hi - lo) * 0.382, m2 = lo + (hi - lo) * 0.618;
        if (ell(m1) < ell(m2)) lo = m1; else hi = m2;
      }
      scale = (lo + hi) / 2;
    }
    mu = newMu;
  }
  // Approximate posterior SE of each b from the final expected information.
  return { sec, b, b0, n, scale, mu, c, a: s.a * scale, ids };
}

// Re-centre: shift b (and mu) so the mean b over fitted items equals the mean
// tag b. Likelihood-invariant; keeps the overall score level where it was.
function recentre(fit) {
  const d = fit.ids.reduce((acc, id) => acc + (fit.b[id] - fit.b0[id]), 0) / fit.ids.length;
  for (const id of fit.ids) fit.b[id] -= d;
  fit.mu -= d;
  fit.shift = d;
  return fit;
}

// Empirical-Bayes tau: fit with a weak prior, then
// tau^2 = var(b_hat - b_tag) - mean(sampling variance), using items with
// enough answers for the sampling variance to be meaningful.
function chooseTau(sec, recs) {
  const weak = recentre(fitSection(sec, recs, 2.0, { iters: 40 }));
  const ids = weak.ids.filter((id) => weak.n[id] >= 30);
  const resid = ids.map((id) => weak.b[id] - weak.b0[id]);
  const mean = resid.reduce((a, b) => a + b, 0) / resid.length;
  const varR = resid.reduce((a, r) => a + (r - mean) * (r - mean), 0) / (resid.length - 1);
  // Sampling variance of b_hat ~ 1 / (n * avg info); approximate the average
  // item information at the population with a = weak.a.
  const a = weak.a, c = weak.c, D = 1.702;
  const sv = ids.map((id) => {
    let info = 0;
    for (let q = 0; q < NQ; q++) {
      const th = weak.mu + Z[q];
      const L = 1 / (1 + Math.exp(-D * a * (th - weak.b[id])));
      const p = c + (1 - c) * L;
      const dp = (1 - c) * D * a * L * (1 - L);
      info += ZW[q] * dp * dp / (p * (1 - p));
    }
    return 1 / (weak.n[id] * info);
  });
  const meanSV = sv.reduce((x, y) => x + y, 0) / sv.length;
  const tau2 = Math.max(0.04, varR - meanSV);
  return { tau: Math.sqrt(tau2), varR, meanSV, items: ids.length };
}

// ---- holdout split by user (deterministic hash) ----
function userBucket(uid) {
  let h = 2166136261;
  for (let i = 0; i < uid.length; i++) { h ^= uid.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h % 5; // bucket 0 = test (20%)
}

const out = {};
console.log('');
for (const sec of SECTIONS) {
  const recs = records.filter((r) => r.sec === sec);
  const train = recs.filter((r) => userBucket(r.uid) !== 0);
  const test = recs.filter((r) => userBucket(r.uid) === 0);
  const nResp = recs.reduce((a, r) => a + r.resp.length, 0);

  const llOf = (fit, bMap, scale) => {
    let L = 0, k = 0;
    const s = P.SECTION_IRT[sec];
    for (const r of test) {
      L += recLogLik(r.resp, fit.mu, () => s.a * scale, (id) => (bMap[id] !== undefined ? bMap[id] : tagB(sec, itemInfo[id].tag)), s.c);
      k += r.resp.length;
    }
    return L / k;
  };
  let llBase = null, llCal = null;
  if (HOLDOUT) {
    // Holdout comparison: fit on train only. Baseline = tag-based b with the
    // A_SCALE currently in js/irt-params.js (mu re-fitted).
    const tauTr = chooseTau(sec, train).tau;
    const baseTr = fitSection(sec, train, 1, { fixedB: true, fixedScale: P.A_SCALE[sec] || 1, iters: 15 });
    const calTr = recentre(fitSection(sec, train, tauTr));
    llBase = llOf(baseTr, {}, P.A_SCALE[sec] || 1);
    llCal = llOf(calTr, calTr.b, calTr.scale);
  }

  // Final fit on all data.
  const t = chooseTau(sec, recs);
  const fit = recentre(fitSection(sec, recs, t.tau));
  out[sec] = fit;
  const moved = fit.ids.filter((id) => fit.n[id] >= MIN_ANSWERS);
  const absMove = moved.map((id) => Math.abs(fit.b[id] - fit.b0[id]));
  absMove.sort((x, y) => x - y);
  console.log(`${sec}: ${recs.length} records, ${nResp} first-exposure answers, ${fit.ids.length}/${bank[sec].length} items seen`);
  console.log(`    tau ${t.tau.toFixed(2)} (resid var ${t.varR.toFixed(2)}, sampling var ${t.meanSV.toFixed(2)}, ${t.items} items with 30+ answers)`);
  console.log(`    section a scale ${fit.scale.toFixed(2)} (was ${P.A_SCALE[sec]}), mu ${fit.mu.toFixed(2)}, recentre shift ${fit.shift.toFixed(2)}`);
  console.log(`    |b - b_tag| median ${absMove[Math.floor(absMove.length / 2)].toFixed(2)}, 90th pct ${absMove[Math.floor(absMove.length * 0.9)].toFixed(2)} over ${moved.length} items with ${MIN_ANSWERS}+ answers`);
  if (HOLDOUT) console.log(`    HOLDOUT (${test.length} records, 20% of users): log-lik/answer current ${llBase.toFixed(4)} -> calibrated ${llCal.toFixed(4)} (${llCal > llBase ? 'better' : 'WORSE'})`);
}

if (WRITE) {
  const lines = [];
  for (const sec of SECTIONS) {
    const f = out[sec];
    const ids = f.ids.filter((id) => f.n[id] >= MIN_ANSWERS).sort();
    for (const id of ids) lines.push(`    ${id}: ${Math.round(f.b[id] * 100) / 100},`);
  }
  const scales = SECTIONS.map((sec) => `${sec}: ${out[sec].scale.toFixed(2)}`).join(', ');
  const target = path.join(__dirname, '..', '..', 'js', 'irt-params.js');
  let src = fs.readFileSync(target, 'utf8');
  const block = `  // BEGIN GENERATED CALIBRATION (scripts/calibration/fit-item-difficulty.js)\n` +
    `  const A_SCALE = { ${scales} };\n` +
    `  const CALIBRATED_B = {\n${lines.join('\n')}\n  };\n` +
    `  // END GENERATED CALIBRATION`;
  const re = /  \/\/ BEGIN GENERATED CALIBRATION[\s\S]*?  \/\/ END GENERATED CALIBRATION/;
  if (!re.test(src)) { console.error('generated-calibration markers not found in js/irt-params.js'); process.exit(1); }
  src = src.replace(re, block);
  fs.writeFileSync(target, src);
  console.log(`\nwrote ${lines.length} calibrated b values and A_SCALE { ${scales} } to js/irt-params.js`);
}
