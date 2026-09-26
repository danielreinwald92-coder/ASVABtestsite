#!/usr/bin/env node
'use strict';
// Re-fits the per-section discrimination scale (A_SCALE in js/irt-params.js)
// from Mission ASVAB's own responses. Offline tool; not part of the build.
//
// 1. Export compact per-test counts with this read-only SQL (Supabase SQL
//    editor or MCP), one row per section, and save each row's `data` value to
//    <dir>/<SECTION>.txt:
//
//    with r as (
//      select t.id tid, q->>'section' sec, (q->>'difficulty')::int d, (q->>'correct')::boolean c
//      from test_results t, jsonb_array_elements(t.question_results) q
//      where t.question_results is not null and t.mode = 'timed' and q ? 'difficulty'
//        and q->>'section' in ('AR','WK','PC','MK')
//        -- WK items were rewritten 2026-09-26: for WK keep only newer rows
//        and (q->>'section' <> 'WK' or t.taken_at >= '2026-09-27')
//    ), g as (
//      select sec, tid, string_agg(d || ':' || n || ':' || k, ',' order by d) cells
//      from (select sec, tid, d, count(*) n, sum(c::int) k from r group by sec, tid, d) x
//      group by sec, tid
//    )
//    select sec, count(*) records, string_agg(cells, '|') data from g group by sec order by sec;
//
// 2. node scripts/calibration/fit-discrimination.js <dir>
//
// Model: marginal ML over theta ~ N(mu, 1) with the official pool a, b(tag), c
// (irt-params.js SECTION_IRT/DIFF_OFFSET), estimating mu and one multiplicative
// scale on a per section. Prints the estimate and a bootstrap 10-90% range.
// The scale is computed against the OFFICIAL a (A_SCALE is ignored here).
const fs = require('fs');
const path = require('path');
const IRT = require('../../js/irt.js');
const P = require('../../js/irt-params.js');

const dir = process.argv[2];
if (!dir) { console.error('usage: fit-discrimination.js <dir with AR.txt WK.txt PC.txt MK.txt>'); process.exit(1); }

const Q = [];
for (let i = 0; i < 41; i++) { const z = -4 + i * 0.2; Q.push([z, Math.exp(-z * z / 2)]); }
const W = Q.reduce((s, q) => s + q[1], 0);
Q.forEach((q) => { q[1] /= W; });

function officialItem(sec, d) {
  const s = P.SECTION_IRT[sec];
  return { a: s.a, b: s.bMean + (P.DIFF_OFFSET[d] || 0) * s.bSD, c: s.c };
}

function logLik(recs, sec, scale, mu) {
  let L = 0;
  for (const r of recs) {
    let lik = 0;
    for (const [z, w] of Q) {
      let l = 1;
      for (const [d, n, k] of r) {
        const it = officialItem(sec, d);
        const p = IRT.p3pl(mu + z, { a: it.a * scale, b: it.b, c: it.c });
        l *= Math.pow(p, k) * Math.pow(1 - p, n - k);
      }
      lik += w * l;
    }
    L += Math.log(lik);
  }
  return L;
}

function fit(recs, sec) {
  let best = [-Infinity, 1, 0];
  for (let la = -1.6; la <= 0.4; la += 0.05) {
    for (let mu = -1; mu <= 1; mu += 0.1) {
      const v = logLik(recs, sec, Math.exp(la), mu);
      if (v > best[0]) best = [v, Math.exp(la), mu];
    }
  }
  return best[1];
}

let seed = 5;
const rnd = () => { seed = (seed * 1103515245 + 12345) >>> 0; return seed / 4294967296; };
for (const sec of ['AR', 'WK', 'PC', 'MK']) {
  const file = path.join(dir, `${sec}.txt`);
  if (!fs.existsSync(file)) { console.log(`${sec}: no data file`); continue; }
  const recs = fs.readFileSync(file, 'utf8').trim().split('|')
    .map((r) => r.split(',').map((c) => c.split(':').map(Number)));
  const est = fit(recs, sec);
  const boots = [];
  for (let b = 0; b < 30; b++) boots.push(fit(recs.map(() => recs[Math.floor(rnd() * recs.length)]), sec));
  boots.sort((x, y) => x - y);
  console.log(`${sec}: scale ${est.toFixed(2)} (bootstrap 10-90%: ${boots[3].toFixed(2)}-${boots[26].toFixed(2)}), ${recs.length} records; current A_SCALE ${P.A_SCALE[sec] || 1}`);
}
