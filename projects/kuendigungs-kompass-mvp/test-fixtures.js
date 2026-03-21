const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { buildResult, renderResult } = require('./src/engine');

const ROOT = __dirname;
const PAIRS = [
  ['examples/inputs/01-kuendigung-arbeitslosmeldung-offen.input.json', 'examples/01-kuendigung-arbeitslosmeldung-offen.result.json'],
  ['examples/inputs/02-aufhebungsvertrag-nicht-unterschrieben.input.json', 'examples/02-aufhebungsvertrag-nicht-unterschrieben.result.json'],
  ['examples/inputs/03-kuendigung-sonderfall.input.json', 'examples/03-kuendigung-sonderfall.result.json'],
  ['examples/inputs/04-vertrag-bereits-unterschrieben.input.json', 'examples/04-vertrag-bereits-unterschrieben.result.json'],
  ['examples/inputs/05-kuendigung-nur-angekuendigt.input.json', 'examples/05-kuendigung-nur-angekuendigt.result.json'],
  ['examples/inputs/06-mehrere-eingaenge-gleichzeitig.input.json', 'examples/06-mehrere-eingaenge-gleichzeitig.result.json'],
];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'));
}

function labels(items = []) {
  return items.map((item) => item.label);
}

function strings(items = []) {
  return items.map((item) => typeof item === 'string' ? item : JSON.stringify(item));
}

let failures = 0;

for (const [inputPath, expectedPath] of PAIRS) {
  const input = readJson(inputPath);
  const expected = readJson(expectedPath);
  const actual = buildResult(input);
  const name = path.basename(expectedPath);
  const actualDeadlineLabels = labels(actual.deadlines);
  const expectedDeadlineLabels = labels(expected.deadlines);
  const actualRedFlags = labels(actual.redFlags);
  const expectedRedFlags = labels(expected.redFlags);

  try {
    assert.equal(actual.resultVersion, 'v2');
    assert.equal(actual.synthesisDecision.primaryTrack, expected.synthesisDecision.primaryTrack);
    assert.equal(actual.caseSnapshot.headline, expected.caseSnapshot.headline);
    assert.equal(actual.topActions[0]?.label, expected.topActions[0]?.label);
    assert.deepEqual(actualDeadlineLabels, expectedDeadlineLabels);
    assert.deepEqual(actualRedFlags, expectedRedFlags);

    assert.ok(!strings(actual.disclaimers).some((x) => /Abfindungswahrscheinlichkeiten|Erfolgswahrscheinlichkeit/.test(x)));
    assert.ok(Array.isArray(actual.statementLedger.notUsedYet));

    const shortRendered = renderResult(actual, 'short');
    const standardRendered = renderResult(actual, 'standard');
    const adviceRendered = renderResult(actual, 'advice');

    for (const rendered of [shortRendered, standardRendered, adviceRendered]) {
      assert.ok(typeof rendered === 'string' && rendered.length > 20);
      assert.ok(!/do-not-use-yet|Erfolgswahrscheinlichkeit|Abfindungswahrscheinlichkeiten/.test(rendered));
    }

    assert.ok(shortRendered.includes(`Dein Fokus jetzt: ${actual.caseSnapshot.headline}`));
    assert.ok(shortRendered.includes(`Wichtigster nächster Schritt: ${actual.topActions[0]?.label}`));

    assert.ok(standardRendered.indexOf('Nächste Schritte:') > -1);
    assert.ok(standardRendered.indexOf('Fristen:') > standardRendered.indexOf('Nächste Schritte:'));
    if (actual.riskFlags.length > 0) {
      assert.ok(standardRendered.indexOf('Risiken:') > standardRendered.indexOf('Fristen:'));
    }
    if (actual.redFlags.length > 0) {
      assert.ok(standardRendered.indexOf('Red Flags:') > standardRendered.indexOf('Risiken:'));
    }
    assert.ok(standardRendered.indexOf('Unterlagen:') > standardRendered.indexOf('Fristen:'));
    assert.ok(standardRendered.indexOf('Hinweise:') > standardRendered.indexOf('Unterlagen:'));

    assert.ok(adviceRendered.includes(`Warum dieser Fokus: ${actual.synthesisDecision.reasoning}`));
    assert.ok(adviceRendered.indexOf('Fragen für Beratung:') > adviceRendered.indexOf('Unterlagen:'));
    assert.ok(adviceRendered.indexOf('Hinweise:') > adviceRendered.indexOf('Fragen für Beratung:'));

    console.log(`PASS ${name}`);
  } catch (error) {
    failures += 1;
    console.error(`FAIL ${name}`);
    console.error(error.message);
    console.error('actual track:', actual.synthesisDecision.primaryTrack);
    console.error('actual headline:', actual.caseSnapshot.headline);
    console.error('actual topActions:', labels(actual.topActions));
    console.error('actual deadlines:', actualDeadlineLabels);
    console.error('actual redFlags:', actualRedFlags);
  }
}

if (failures > 0) {
  console.error(`\n${failures} fixture test(s) failed.`);
  process.exit(1);
}

console.log('\nAll fixture tests passed.');
