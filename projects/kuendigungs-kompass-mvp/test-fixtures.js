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
  ['examples/inputs/07-angekuendigt-alg1-risiko.input.json', 'examples/07-angekuendigt-alg1-risiko.result.json'],
];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'));
}

function labels(items = []) {
  return items.map((item) => item.label);
}

function compactDeadlines(items = []) {
  return items.map((item) => ({
    label: item.label,
    timing: item.timing,
    note: item.note,
  }));
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
  const actualDeadlineDetails = compactDeadlines(actual.deadlines);
  const expectedDeadlineDetails = compactDeadlines(expected.deadlines);
  const actualRedFlags = labels(actual.redFlags);
  const expectedRedFlags = labels(expected.redFlags);

  try {
    assert.equal(actual.resultVersion, 'v2');
    assert.equal(actual.synthesisDecision.primaryTrack, expected.synthesisDecision.primaryTrack);
    assert.equal(actual.caseSnapshot.headline, expected.caseSnapshot.headline);
    assert.equal(actual.topActions[0]?.label, expected.topActions[0]?.label);
    assert.deepEqual(actualDeadlineLabels, expectedDeadlineLabels);
    assert.deepEqual(actualDeadlineDetails, expectedDeadlineDetails);
    assert.deepEqual(actualRedFlags, expectedRedFlags);
    assert.deepEqual(actual.disclaimers, expected.disclaimers);
    assert.deepEqual(labels(actual.riskFlags), labels(expected.riskFlags));

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
    const stepsIndex = standardRendered.indexOf('Nächste Schritte:');
    const deadlinesIndex = standardRendered.indexOf('Fristen:');
    const risksIndex = standardRendered.indexOf('Risiken:');
    const redFlagsIndex = standardRendered.indexOf('Red Flags:');
    const documentsIndex = standardRendered.indexOf('Unterlagen:');

    if (actual.deadlines.length > 0) {
      assert.ok(deadlinesIndex > stepsIndex);
    } else {
      assert.equal(deadlinesIndex, -1);
    }
    if (actual.riskFlags.length > 0) {
      assert.ok(risksIndex > (deadlinesIndex > -1 ? deadlinesIndex : stepsIndex));
    }
    if (actual.redFlags.length > 0) {
      assert.ok(redFlagsIndex > (risksIndex > -1 ? risksIndex : stepsIndex));
    }
    assert.ok(documentsIndex > (redFlagsIndex > -1 ? redFlagsIndex : (risksIndex > -1 ? risksIndex : (deadlinesIndex > -1 ? deadlinesIndex : stepsIndex))));
    assert.ok(standardRendered.indexOf('Hinweise:') > standardRendered.indexOf('Unterlagen:'));

    assert.ok(adviceRendered.includes(`Warum dieser Fokus: ${actual.synthesisDecision.reasoning}`));
    assert.ok(adviceRendered.indexOf('Fragen für Beratung:') > adviceRendered.indexOf('Unterlagen:'));
    assert.ok(adviceRendered.indexOf('Hinweise:') > adviceRendered.indexOf('Fragen für Beratung:'));

    if (name.startsWith('01-')) {
      assert.ok(actualDeadlineLabels.includes('Arbeitslosmeldung'));
      assert.ok(actualDeadlineLabels.includes('Arbeitsuchendmeldung'));
      assert.ok(actual.riskFlags.some((item) => item.label === 'Offene Arbeitsuchendmeldung kann Nachteile auslösen'));
      assert.ok(actual.riskFlags.some((item) => item.label === 'Offene Arbeitslosmeldung kann den Leistungsstart erschweren'));
    }

    if (name.startsWith('02-')) {
      assert.equal(actual.synthesisDecision.primaryTrack, 'contract-do-not-sign');
      assert.ok(!actualDeadlineLabels.includes('Kündigungsschutzklage prüfen'));
      assert.ok(!standardRendered.includes('Kündigungsschutzklage prüfen'));
      assert.ok(!actualDeadlineLabels.includes('Arbeitslosmeldung'));
      assert.equal(actual.topActions[0]?.label, 'Aufhebungsvertrag nicht vorschnell unterschreiben');
      assert.ok(actual.disclaimers[0].includes('Arbeitsuchendmeldung = früher eigener Schritt'));
    }

    if (name.startsWith('03-')) {
      assert.equal(actual.synthesisDecision.primaryTrack, 'special-case-review');
      assert.ok(actual.redFlags.length > 0);
      assert.ok(standardRendered.includes('Red Flags:'));
      assert.ok(standardRendered.indexOf('Red Flags:') > standardRendered.indexOf('Risiken:'));
      assert.ok(standardRendered.indexOf('Red Flags:') < standardRendered.indexOf('Unterlagen:'));
      assert.ok(actualDeadlineLabels.includes('Kündigungsschutzklage prüfen'));
    }

    if (name.startsWith('04-')) {
      assert.equal(actual.synthesisDecision.primaryTrack, 'special-case-review');
      assert.equal(actual.deadlines.length, 0);
      assert.ok(!standardRendered.includes('Arbeitsuchendmeldung:'));
      assert.ok(actual.redFlags.some((item) => item.label === 'Bereits unterschriebener Beendigungsvertrag'));
    }

    if (name.startsWith('05-')) {
      assert.equal(actual.synthesisDecision.primaryTrack, 'prepare-advice');
      assert.ok(!actualDeadlineLabels.includes('Kündigungsschutzklage prüfen'));
      assert.ok(!standardRendered.includes('Kündigungsschutzklage prüfen'));
      assert.ok(actual.disclaimers.some((item) => item.includes('keine Klagefrist fingieren')));
      assert.equal(actual.topActions[0]?.label, 'Arbeitsuchendmeldung jetzt prüfen oder nachholen');
    }

    if (name.startsWith('07-')) {
      assert.equal(actual.synthesisDecision.primaryTrack, 'alg1-risk-first');
      assert.equal(actual.caseSnapshot.headline, 'Jetzt zuerst sicherstellen, dass dein Arbeitslosengeld nicht in Gefahr gerät');
      assert.ok(actualDeadlineLabels.includes('Arbeitsuchendmeldung'));
      assert.ok(!actualDeadlineLabels.includes('Kündigungsschutzklage prüfen'));
      assert.ok(actual.riskFlags.some((item) => item.label === 'Offene Arbeitsuchendmeldung kann sich später beim Arbeitslosengeld auswirken'));
      assert.ok(!standardRendered.includes('Gut vorbereitet in den nächsten Schritt gehen'));
      assert.ok(!adviceRendered.includes('Welche Schritte sollte ich jetzt schon vorbereiten, obwohl noch nichts Schriftliches vorliegt?'));
    }

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
