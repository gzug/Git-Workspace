const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { buildResult } = require('./src/engine');
const { projectResultForTier } = require('./src/adapters/projectResultForTier');
const { renderProductResult } = require('./src/adapters/renderProductResult');

const ROOT = __dirname;
const SAMPLE_INPUT = 'examples/inputs/06-mehrere-eingaenge-gleichzeitig.input.json';

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'));
}

const input = readJson(SAMPLE_INPUT);
const result = buildResult(input);

function run() {
  const preview = projectResultForTier(result, { tier: 'preview' });
  const base = projectResultForTier(result, { tier: 'base' });
  const upgrade = projectResultForTier(result, { tier: 'upgrade' });

  const previewText = renderProductResult(preview, { tier: 'preview' });
  assert.ok(previewText.includes(`Dein Fokus jetzt: ${result.caseSnapshot.headline}`));
  assert.ok(previewText.includes(`Wichtigster nächster Schritt: ${result.topActions[0].label}`));
  assert.ok(!previewText.includes('Unterlagen:'));
  assert.ok(!previewText.includes('Fragen für Beratung:'));

  const baseText = renderProductResult(base, { tier: 'base' });
  assert.ok(baseText.startsWith(result.caseSnapshot.headline));
  assert.ok(baseText.includes('Nächste Schritte:'));
  assert.ok(baseText.includes('Fristen:'));
  assert.ok(baseText.includes('Unterlagen:'));
  assert.ok(baseText.includes('Hinweise:'));
  assert.ok(!baseText.includes('Warum dieser Fokus:'));
  assert.ok(!baseText.includes('Fragen für Beratung:'));
  assert.ok(!baseText.includes('Chancen:'));

  const upgradeText = renderProductResult(upgrade, { tier: 'upgrade' });
  assert.ok(upgradeText.includes(`Warum dieser Fokus: ${result.synthesisDecision.reasoning}`));
  assert.ok(upgradeText.includes('Fragen für Beratung:'));
  assert.ok(upgradeText.includes('Hinweise:'));

  assert.ok(!/statementLedger|do-not-use-yet/.test(previewText));
  assert.ok(!/statementLedger|do-not-use-yet/.test(baseText));
  assert.ok(!/statementLedger|do-not-use-yet/.test(upgradeText));

  assert.throws(() => renderProductResult(base, { tier: 'weird' }), /Unknown render tier/);

  console.log('All product render tests passed.');
}

run();
