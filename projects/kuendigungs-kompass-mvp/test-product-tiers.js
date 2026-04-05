const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { buildResult } = require('./src/engine');
const { projectResultForTier } = require('./src/adapters/projectResultForTier');

const ROOT = __dirname;
const SAMPLE_INPUT = 'examples/inputs/06-mehrere-eingaenge-gleichzeitig.input.json';

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'));
}

const input = readJson(SAMPLE_INPUT);
const result = buildResult(input);

function run() {
  const preview = projectResultForTier(result, { tier: 'preview' });
  assert.equal(preview.tier, 'preview');
  assert.deepEqual(Object.keys(preview).sort(), ['caseSnapshot', 'deadline', 'disclaimer', 'riskFlag', 'tier', 'topAction'].sort());
  assert.equal(preview.caseSnapshot.headline, result.caseSnapshot.headline);
  assert.equal(preview.topAction.label, result.topActions[0].label);
  assert.equal(preview.deadline.label, result.deadlines[0].label);
  assert.equal(preview.disclaimer, result.opportunities[0].description);
  assert.equal(preview.riskFlag.label, result.riskFlags[0].label);

  const base = projectResultForTier(result, { tier: 'base' });
  assert.equal(base.tier, 'base');
  assert.equal(base.caseSnapshot.headline, result.caseSnapshot.headline);
  assert.equal(base.topActions.length, result.topActions.length);
  assert.equal(base.deadlines.length, result.deadlines.length);
  assert.equal(base.riskFlags.length, result.riskFlags.length);
  assert.equal(base.redFlags.length, result.redFlags.length);
  assert.equal(base.documentChecklist.length, result.documentChecklist.length);
  assert.ok(!('advisorQuestions' in base));
  assert.ok(!('statementLedger' in base));
  assert.ok(!('opportunities' in base));

  const upgrade = projectResultForTier(result, { tier: 'upgrade' });
  assert.equal(upgrade.tier, 'upgrade');
  assert.equal(upgrade.synthesisDecision.reasoning, result.synthesisDecision.reasoning);
  assert.equal(upgrade.advisorQuestions.length, result.advisorQuestions.length);
  assert.equal(upgrade.opportunities.length, result.opportunities.length);
  assert.ok(!('statementLedger' in upgrade));

  assert.throws(() => projectResultForTier(result, { tier: 'weird' }), /Unknown result tier/);

  console.log('All product tier tests passed.');
}

run();
