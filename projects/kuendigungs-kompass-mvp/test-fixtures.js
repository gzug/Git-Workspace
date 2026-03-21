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

    for (const view of ['short', 'standard', 'advice']) {
      const rendered = renderResult(actual, view);
      assert.ok(typeof rendered === 'string' && rendered.length > 20);
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
