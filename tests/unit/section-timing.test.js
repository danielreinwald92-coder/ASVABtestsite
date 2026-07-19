const { test } = require('node:test');
const assert = require('node:assert');
const { loadCore } = require('../helpers/load.js');

// 2.7 — Mathematics Knowledge section is allotted 31 minutes (spec decision).
test('MK section timeLimit is 31 minutes', () => {
  const { asvabData } = loadCore();
  assert.strictEqual(asvabData.sections.MK.timeLimit, 31 * 60);
});

// Official CAT-ASVAB table: 15 scored GS questions receive 12 minutes when
// tryout questions are not present.
test('GS section timeLimit is 12 minutes', () => {
  const { asvabData } = loadCore();
  assert.strictEqual(asvabData.sections.GS.timeLimit, 12 * 60);
});
