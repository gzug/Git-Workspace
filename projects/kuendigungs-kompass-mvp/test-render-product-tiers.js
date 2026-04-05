const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { buildResult } = require('./src/engine');
const { projectResultForTier } = require('./src/adapters/projectResultForTier');
const { renderProductResult } = require('./src/adapters/renderProductResult');

const ROOT = __dirname;
const SNAPSHOT_DIR = 'examples/render-snapshots';
const CASES = [
  '01-kuendigung-arbeitslosmeldung-offen',
  '02-aufhebungsvertrag-nicht-unterschrieben',
  '03-kuendigung-sonderfall',
  '05-kuendigung-nur-angekuendigt',
  '06-mehrere-eingaenge-gleichzeitig',
  '07-angekuendigt-alg1-risiko',
];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'));
}

function readText(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function runCase(name) {
  const input = readJson(`examples/inputs/${name}.input.json`);
  const result = buildResult(input);

  const preview = projectResultForTier(result, { tier: 'preview' });
  const base = projectResultForTier(result, { tier: 'base' });
  const upgrade = projectResultForTier(result, { tier: 'upgrade' });

  const previewText = renderProductResult(preview, { tier: 'preview' });
  assert.ok(previewText.includes(`Dein Fokus jetzt: ${result.caseSnapshot.headline}`));
  assert.ok(previewText.includes(`Wichtigster nächster Schritt: ${result.topActions[0].label}`));
  assert.ok(!previewText.includes('Unterlagen:'));
  assert.ok(!previewText.includes('Fragen für Beratung:'));
  assert.equal(previewText, readText(`${SNAPSHOT_DIR}/${name}.preview.txt`).trim());

  const baseText = renderProductResult(base, { tier: 'base' });
  assert.ok(baseText.startsWith(result.caseSnapshot.headline));
  assert.ok(baseText.includes('Nächste Schritte:'));
  assert.ok(baseText.includes('Fristen:') || result.deadlines.length === 0);
  assert.ok(baseText.includes('Unterlagen:'));
  assert.ok(baseText.includes('Hinweise:'));
  assert.ok(!baseText.includes('Warum dieser Fokus:'));
  assert.ok(!baseText.includes('Fragen für Beratung:'));
  assert.ok(!baseText.includes('Chancen:'));
  assert.equal(baseText, readText(`${SNAPSHOT_DIR}/${name}.base.txt`).trim());

  const upgradeText = renderProductResult(upgrade, { tier: 'upgrade' });
  assert.ok(upgradeText.includes(`Warum dieser Fokus: ${result.synthesisDecision.reasoning}`));
  assert.ok(upgradeText.includes('Fragen für Beratung:'));
  assert.ok(upgradeText.includes('Hinweise:'));
  assert.equal(upgradeText, readText(`${SNAPSHOT_DIR}/${name}.upgrade.txt`).trim());

  assert.ok(!/statementLedger|do-not-use-yet/.test(previewText));
  assert.ok(!/statementLedger|do-not-use-yet/.test(baseText));
  assert.ok(!/statementLedger|do-not-use-yet/.test(upgradeText));

  if (name === '01-kuendigung-arbeitslosmeldung-offen') {
    assert.ok(baseText.includes('Arbeitslosmeldung:'));
    assert.ok(baseText.includes('Arbeitsuchendmeldung:'));
    assert.ok(baseText.includes('Kündigungsschutzklage prüfen:'));
    assert.ok(previewText.includes('Arbeitslosmeldung —'));
  }

  if (name === '02-aufhebungsvertrag-nicht-unterschrieben') {
    assert.ok(!baseText.includes('Kündigungsschutzklage prüfen:'));
    assert.ok(!previewText.includes('Kündigungsschutzklage prüfen'));
    assert.ok(!baseText.includes('Arbeitslosmeldung:'));
    assert.ok(previewText.includes('Arbeitsuchendmeldung —'));
    assert.ok(baseText.includes('Aufhebungsvertrag nicht vorschnell unterschreiben'));
  }

  if (name === '03-kuendigung-sonderfall') {
    assert.ok(baseText.includes('Red Flags:'));
    assert.ok(baseText.includes('Möglicher besonderer Schutz oder Sonderfall'));
    assert.ok(baseText.includes('Kündigungsschutzklage prüfen:'));
    assert.ok(previewText.includes('Kündigungsschutzklage prüfen —'));
  }

  if (name === '05-kuendigung-nur-angekuendigt') {
    assert.ok(!baseText.includes('Kündigungsschutzklage prüfen:'));
    assert.ok(!previewText.includes('Kündigungsschutzklage prüfen'));
    assert.ok(baseText.includes('Arbeitsuchendmeldung:'));
    assert.ok(baseText.includes('Ohne schriftliche Kündigung soll der MVP keine Klagefrist fingieren.'));
  }

  if (name === '06-mehrere-eingaenge-gleichzeitig') {
    assert.ok(baseText.includes('bis 13.04.2026'));
    assert.ok(baseText.includes('Fällt das rechnerische Fristende auf Samstag oder Sonntag'));
    assert.ok(baseText.includes('Mögliche Landesfeiertage werden im MVP nicht automatisch berechnet'));
  }

  if (name === '07-angekuendigt-alg1-risiko') {
    assert.ok(previewText.includes('Arbeitslosengeld nicht in Gefahr gerät'));
    assert.ok(baseText.includes('Arbeitsuchendmeldung:'));
    assert.ok(baseText.includes('Offene Arbeitsuchendmeldung kann sich später beim Arbeitslosengeld auswirken'));
    assert.ok(!baseText.includes('Gut vorbereitet in den nächsten Schritt gehen'));
    assert.ok(upgradeText.includes('ALG-I-Risiken'));
  }
}

function run() {
  for (const name of CASES) runCase(name);
  assert.throws(() => renderProductResult({ tier: 'base' }, { tier: 'weird' }), /Unknown render tier/);
  console.log('All product render tests passed.');
}

run();
