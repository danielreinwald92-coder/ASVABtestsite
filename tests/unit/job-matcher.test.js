'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const M = require('../../js/job-matcher.js');

const AVG = { GS: 50, AR: 50, WK: 50, PC: 50, MK: 50, EI: 50, AS: 50, MC: 50, VE: 50 };
const ctx = (ss, afqt = 50) => M.context({ ss, afqt });

test('single composite rule: qualifies at the minimum, close within the gap, notYet beyond it', () => {
  const job = { rule: [[{ c: 'ST', min: 100 }]] };
  assert.strictEqual(M.evaluateJob('army', job, ctx(AVG)).status, 'qualifies');
  const close = M.evaluateJob('army', { rule: [[{ c: 'ST', min: 106 }]] }, ctx(AVG));
  assert.strictEqual(close.status, 'close');
  assert.strictEqual(close.gap, 6);
  assert.strictEqual(M.evaluateJob('army', { rule: [[{ c: 'ST', min: 125 }]] }, ctx(AVG)).status, 'notYet');
});

test('OR paths: any met path qualifies; the closest path sets the gap (Army 91B)', () => {
  const r91B = [[{ c: 'MM', min: 92 }], [{ c: 'MM', min: 87 }, { c: 'GT', min: 85 }]];
  assert.strictEqual(M.evaluateJob('army', { rule: r91B }, ctx(AVG)).status, 'qualifies');
  const low = Object.assign({}, AVG, { AS: 35, MC: 35, EI: 35 });
  const res = M.evaluateJob('army', { rule: r91B }, ctx(low));
  assert.ok(['close', 'notYet'].includes(res.status));
  assert.strictEqual(res.path, 1, 'the MM 87 + GT 85 path is closer');
});

test('AND terms sum their shortfalls', () => {
  const job = { rule: [[{ c: 'GT', min: 103 }, { c: 'ST', min: 104 }]] };
  const res = M.evaluateJob('army', job, ctx(AVG));
  assert.strictEqual(res.gap, 7);
  assert.strictEqual(res.status, 'close');
});

test('Navy/CG sums use rounded standard scores, weights, and sub-minimums', () => {
  const hm = { rule: [[{ sum: { VE: 1, AR: 1, MK: 1, GS: 1 }, min: 208 }], [{ sum: { AR: 1, PC: 1, MK: 1 }, min: 156 }]] };
  const ss = Object.assign({}, AVG, { AR: 52.4, PC: 53.6 }); // rounds to 52 + 54 + 50 = 156
  assert.strictEqual(M.evaluateJob('navy', hm, ctx(ss)).status, 'qualifies');
  const cwt = { rule: [[{ sum: { AR: 1, MK: 2, GS: 1 }, min: 200 }, { sum: { MC: 1 }, min: 51 }]] };
  const r = M.evaluateJob('navy', cwt, ctx(AVG));
  assert.strictEqual(r.gap, 1);
});

test('paths needing a test we do not give are skipped, never judged', () => {
  const bm = { rule: [[{ sum: { VE: 1, AR: 1, MK: 1, AS: 1 }, min: 163 }], [{ sum: { MK: 1, AS: 1, AO: 1 }, min: 126 }]] };
  assert.strictEqual(M.evaluateJob('navy', bm, ctx(AVG)).status, 'qualifies');
  const onlyOther = { rule: [[{ test: 'PSM', min: 75 }]] };
  assert.strictEqual(M.evaluateJob('air-force', onlyOther, ctx(AVG)).status, 'other');
  const mixed = { rule: [[{ test: 'PSM', min: 26 }, { c: 'G', min: 53 }], [{ c: 'G', min: 55 }]] };
  const res = M.evaluateJob('air-force', mixed, ctx(AVG));
  assert.strictEqual(res.status, 'close');
  assert.strictEqual(res.alsoOther, true);
});

test('missing sections give unknown (AFQT-only tests), but AFQT-section jobs still match', () => {
  const afqtOnly = { AR: 50, WK: 50, PC: 50, MK: 50, VE: 50 };
  assert.strictEqual(M.evaluateJob('army', { rule: [[{ c: 'ST', min: 90 }]] }, ctx(afqtOnly)).status, 'unknown');
  assert.strictEqual(M.evaluateJob('army', { rule: [[{ c: 'GT', min: 95 }]] }, ctx(afqtOnly)).status, 'qualifies');
  assert.strictEqual(M.evaluateJob('coast-guard', { rule: [[{ sum: { VE: 1, AR: 1 }, min: 95 }]] }, ctx(afqtOnly)).status, 'qualifies');
  assert.strictEqual(M.evaluateJob('air-force', { rule: [[{ c: 'A', min: 40 }]] }, ctx(afqtOnly)).status, 'qualifies');
});

test('AFQT floors inside rules and the branch minimum both gate qualification', () => {
  const job = { rule: [[{ sum: { VE: 1, AR: 1 }, min: 90 }, { afqt: 65 }]] };
  assert.strictEqual(M.evaluateJob('coast-guard', job, ctx(AVG, 70)).status, 'qualifies');
  assert.notStrictEqual(M.evaluateJob('coast-guard', job, ctx(AVG, 40)).status, 'qualifies');
  const data = {
    ORDER: ['army'],
    BRANCHES: { army: { name: 'Army', afqtMin: 31, jobs: [{ code: 'X', rule: [[{ c: 'GT', min: 80 }]] }] } }
  };
  const low = M.matchAll(data, { ss: AVG, afqt: 20 });
  assert.strictEqual(low.branches.army.meetsAfqt, false);
  assert.strictEqual(low.branches.army.qualifies.length, 0);
  assert.strictEqual(low.branches.army.notYet[0].afqtShort, true);
  assert.strictEqual(M.matchAll(data, { ss: AVG, afqt: 50 }).branches.army.qualifies.length, 1);
});

test('study suggestion names the weakest section inside the short formula (VE -> WK)', () => {
  const ss = Object.assign({}, AVG, { GS: 40, WK: 45, VE: 45 });
  const res = M.evaluateJob('army', { rule: [[{ c: 'ST', min: 110 }]] }, ctx(ss));
  assert.strictEqual(res.study, 'GS');
  const res2 = M.evaluateJob('navy', { rule: [[{ sum: { VE: 1, AR: 1 }, min: 120 }]] }, ctx(Object.assign({}, AVG, { WK: 41, VE: 44 })));
  assert.strictEqual(res2.study, 'WK');
});

test('rule text reads plainly', () => {
  assert.strictEqual(M.ruleText([[{ c: 'MM', min: 92 }], [{ c: 'MM', min: 87 }, { c: 'GT', min: 85 }]]),
    'MM 92, or MM 87 and GT 85');
  assert.strictEqual(M.ruleText([[{ sum: { AR: 1, MK: 2, GS: 1 }, min: 255 }]]), 'AR + 2MK + GS = 255');
  assert.strictEqual(M.ruleText([]), 'No line score required');
  assert.deepStrictEqual(M.otherTests([[{ sum: { MK: 1, AO: 1 }, min: 1 }], [{ test: 'DLAB', min: 110 }]]),
    ['Assembling Objects', 'DLAB']);
});

test('flipping any section upward never lowers a job status (monotonic)', () => {
  const order = { notYet: 0, close: 1, qualifies: 2 };
  const jobs = [
    { rule: [[{ c: 'ST', min: 104 }]] }, { rule: [[{ c: 'GT', min: 100 }, { c: 'SC', min: 101 }]] }
  ];
  for (const s of ['GS', 'AR', 'MK', 'EI', 'AS', 'MC', 'VE']) {
    for (const job of jobs) {
      const a = M.evaluateJob('army', job, ctx(AVG)).status;
      const b = M.evaluateJob('army', job, ctx(Object.assign({}, AVG, { [s]: 56 }))).status;
      assert.ok(order[b] >= order[a], `${s}: ${a} -> ${b}`);
    }
  }
});
