const { test } = require('node:test');
const assert = require('node:assert');
const { loadCore } = require('../helpers/load.js');

// 2.7 — Mathematics Knowledge section is allotted 31 minutes (spec decision).
test('MK section timeLimit is 31 minutes', () => {
  const { asvabData } = loadCore();
  assert.strictEqual(asvabData.sections.MK.timeLimit, 31 * 60);
});
