const test = require('node:test');
const assert = require('node:assert');
const IRT = require('../../js/irt.js');

const ITEM = { a: 1, b: 0, c: 0.2 };

test('p3pl at theta=b returns c + (1-c)/2', () => {
  assert.ok(Math.abs(IRT.p3pl(0, ITEM) - 0.6) < 1e-9);
});

test('p3pl is increasing in theta and bounded (c, 1)', () => {
  let prev = 0;
  for (let t = -4; t <= 4; t += 0.5) {
    const p = IRT.p3pl(t, ITEM);
    assert.ok(p > ITEM.c && p < 1 && p > prev);
    prev = p;
  }
});

test('fisherInfo peaks near b', () => {
  const atB = IRT.fisherInfo(0, ITEM);
  assert.ok(atB > IRT.fisherInfo(-2, ITEM));
  assert.ok(atB > IRT.fisherInfo(2.5, ITEM));
});

// Hand-computed from the Owen equations (spec §6) with state {0,1}, item {1,0,0.2}:
// xi = 0, phi(0)=0.3989423, Phi(0)=0.5, P*=0.6, zeta=0.6, shrink=0.5.
test('owenUpdate correct: hand-computed anchor', () => {
  const s = IRT.owenUpdate({ mean: 0, variance: 1 }, ITEM, true);
  assert.ok(Math.abs(s.mean - 0.37610) < 1e-4, `mean ${s.mean}`);
  assert.ok(Math.abs(s.variance - 0.85853) < 1e-4, `variance ${s.variance}`);
});

test('owenUpdate incorrect: hand-computed anchor', () => {
  const s = IRT.owenUpdate({ mean: 0, variance: 1 }, ITEM, false);
  assert.ok(Math.abs(s.mean - (-0.56418)) < 1e-4, `mean ${s.mean}`);
  assert.ok(Math.abs(s.variance - 0.68170) < 1e-4, `variance ${s.variance}`);
});

test('owenUpdate properties: correct raises mean, incorrect lowers mean and variance', () => {
  for (const b of [-1.5, 0, 1.5]) {
    const item = { a: 1.3, b, c: 0.18 };
    const up = IRT.owenUpdate({ mean: 0, variance: 1 }, item, true);
    const down = IRT.owenUpdate({ mean: 0, variance: 1 }, item, false);
    // Correct responses: mean always rises
    assert.ok(up.mean > 0);
    // Incorrect responses: mean always drops and variance always shrinks
    assert.ok(down.mean < 0 && down.variance < 1);
  }
  // Correct responses at/below mean: variance shrinks
  for (const b of [-1.5, 0]) {
    const item = { a: 1.3, b, c: 0.18 };
    const up = IRT.owenUpdate({ mean: 0, variance: 1 }, item, true);
    assert.ok(up.variance < 1, `b=${b}: variance should shrink`);
  }
  // Correct response on much-harder item (b=1.5): variance can rise due to
  // guessing-mixture effect (c>0 creates ambiguity: lucky guess vs. truly able)
  const hard = IRT.owenUpdate({ mean: 0, variance: 1 }, { a: 1.3, b: 1.5, c: 0.18 }, true);
  assert.ok(hard.variance > 1, `hard.variance should exceed prior (1.0), got ${hard.variance}`);
});

test('owenUpdate: correct on hard item moves mean more than correct on easy item', () => {
  const hard = IRT.owenUpdate({ mean: 0, variance: 1 }, { a: 1, b: 1.5, c: 0.2 }, true);
  const easy = IRT.owenUpdate({ mean: 0, variance: 1 }, { a: 1, b: -1.5, c: 0.2 }, true);
  assert.ok(hard.mean > easy.mean);
});

test('mapEstimate: empty input returns prior', () => {
  assert.deepStrictEqual(IRT.mapEstimate([]), { theta: 0, sem: 1 });
});

test('mapEstimate: all correct is high but prior-regressed; all wrong is low', () => {
  const items = Array.from({ length: 15 }, (_, i) => ({ a: 1.3, b: -1 + i * 0.15, c: 0.18 }));
  const allRight = IRT.mapEstimate(items.map((it) => ({ ...it, correct: true })));
  const allWrong = IRT.mapEstimate(items.map((it) => ({ ...it, correct: false })));
  assert.ok(allRight.theta > 1.2 && allRight.theta < 4);
  assert.ok(allWrong.theta < -1.2 && allWrong.theta > -4);
  assert.ok(Number.isFinite(allRight.sem) && allRight.sem > 0);
});

test('mapEstimate: sem shrinks as items are added', () => {
  const mk = (n) => Array.from({ length: n }, (_, i) => ({ a: 1.3, b: (i % 5) - 2, c: 0.18, correct: i % 2 === 0 }));
  assert.ok(IRT.mapEstimate(mk(15)).sem < IRT.mapEstimate(mk(5)).sem);
});

test('mapEstimate is monotone: flipping a response to correct never lowers theta', () => {
  const items = Array.from({ length: 10 }, (_, i) => ({ a: 1.2, b: -1.5 + i * 0.3, c: 0.2, correct: i < 5 }));
  const base = IRT.mapEstimate(items).theta;
  const flipped = items.map((it, i) => (i === 7 ? { ...it, correct: true } : it));
  assert.ok(IRT.mapEstimate(flipped).theta >= base);
});
