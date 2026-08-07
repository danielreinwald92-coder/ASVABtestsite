const test = require('node:test');
const assert = require('node:assert');
const IRT = require('../../js/irt.js');
const PARAMS = require('../../js/irt-params.js');

function mulberry32(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Synthetic pool mirroring a section's real tag mix; runs the same
// select-max-info / answer / Owen-update loop the engine uses.
function simulate(code, nItems, poolTags, simulees, rand) {
  const items = poolTags.map((tag, i) => PARAMS.getItemParams(code, tag, `${code}_sim_${i}`));
  const trueThetas = [];
  const estThetas = [];
  for (let s = 0; s < simulees; s++) {
    const u1 = Math.max(rand(), 1e-9);
    const theta = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * rand()); // Box-Muller N(0,1)
    const state = { mean: 0, variance: 1 };
    const used = new Set();
    const records = [];
    for (let k = 0; k < nItems; k++) {
      const ranked = items.map((it, idx) => [used.has(idx) ? -1 : IRT.fisherInfo(state.mean, it), idx])
        .filter((r) => r[0] >= 0).sort((a, b) => b[0] - a[0]);
      const pick = ranked[Math.floor(rand() * Math.min(5, ranked.length))][1];
      used.add(pick);
      const correct = rand() < IRT.p3pl(theta, items[pick]);
      Object.assign(state, IRT.owenUpdate(state, items[pick], correct));
      records.push({ a: items[pick].a, b: items[pick].b, c: items[pick].c, correct });
    }
    trueThetas.push(theta);
    estThetas.push(IRT.mapEstimate(records).theta);
  }
  const n = simulees;
  const mx = trueThetas.reduce((a, v) => a + v, 0) / n;
  const my = estThetas.reduce((a, v) => a + v, 0) / n;
  let sxx = 0; let syy = 0; let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (trueThetas[i] - mx) ** 2;
    syy += (estThetas[i] - my) ** 2;
    sxy += (trueThetas[i] - mx) * (estThetas[i] - my);
  }
  return { corr: sxy / Math.sqrt(sxx * syy), bias: my - mx };
}

// Tag mixes approximating the real pools (AR 122: 14/40/40/23/5; PC 85: 7/42/31/5/0).
function tags(counts) {
  const out = [];
  counts.forEach((c, i) => { for (let k = 0; k < c; k++) out.push(i + 1); });
  return out;
}

test('AR (15 items): recovered theta correlates >= 0.90 with truth, |bias| <= 0.08', () => {
  const r = simulate('AR', 15, tags([14, 40, 40, 23, 5]), 500, mulberry32(42));
  assert.ok(r.corr >= 0.90, `corr ${r.corr}`);
  assert.ok(Math.abs(r.bias) <= 0.08, `bias ${r.bias}`);
});

test('PC (10 items): recovered theta correlates >= 0.85 with truth', () => {
  const r = simulate('PC', 10, tags([7, 42, 31, 5, 0]), 500, mulberry32(43));
  assert.ok(r.corr >= 0.85, `corr ${r.corr}`);
  assert.ok(Math.abs(r.bias) <= 0.10, `bias ${r.bias}`);
});
