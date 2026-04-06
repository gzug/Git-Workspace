const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { buildResult } = require('./src/engine');
const { buildQuestionnaireResultView } = require('./src/runtime/buildQuestionnaireResultView');
const { projectResultForTier } = require('./src/adapters/projectResultForTier');
const { renderProductResult } = require('./src/adapters/renderProductResult');

const ROOT = __dirname;

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'));
}

function assertCriterion1RegressionSafety() {
  const deadlineCase = buildResult(readJson('examples/inputs/01-kuendigung-arbeitslosmeldung-offen.input.json'));
  const deadlineLabels = deadlineCase.deadlines.map((item) => item.label);
  assert.equal(deadlineCase.synthesisDecision.primaryTrack, 'deadline-first');
  assert.ok(deadlineLabels.includes('Bei tatsächlicher Arbeitslosigkeit arbeitslos melden'));
  assert.ok(deadlineLabels.includes('Bei der Agentur für Arbeit arbeitssuchend melden'));
  assert.ok(deadlineCase.deadlines.some((item) => item.label === 'Kündigungsschutzklage prüfen' && item.timing.includes('08.04.2026')));

  const announcedCase = buildResult(readJson('examples/inputs/05-kuendigung-nur-angekuendigt.input.json'));
  assert.equal(announcedCase.synthesisDecision.primaryTrack, 'prepare-advice');
  assert.ok(!announcedCase.deadlines.some((item) => item.label === 'Kündigungsschutzklage prüfen'));
  assert.ok(announcedCase.deadlines.some((item) => item.label === 'Bei der Agentur für Arbeit arbeitssuchend melden'));
  assert.equal(announcedCase.topActions[0]?.label, 'Jetzt bei der Agentur für Arbeit arbeitssuchend melden oder Status prüfen');

  const mixedCase = buildResult(readJson('examples/inputs/06-mehrere-eingaenge-gleichzeitig.input.json'));
  assert.equal(mixedCase.synthesisDecision.primaryTrack, 'special-case-review');
  assert.equal(mixedCase.topActions[0]?.label, '3-Wochen-Frist für Kündigungsschutzklage sofort prüfen');
  assert.ok(mixedCase.redFlags.some((item) => item.label.includes('Mehrfachfall')));
}

function assertCriterion2Observability() {
  const eventKeys = [
    'status',
    'requestedTier',
    'tier',
    'warningCount',
    'missingAnswersCount',
    'primaryTrack',
    'riskLevel',
    'topActionsCount',
    'deadlinesCount',
    'redFlagsCount',
    'errorCode',
    'flowAbandonment',
  ];

  const readyEvents = [];
  const readyView = buildQuestionnaireResultView(
    readJson('examples/inputs/01-kuendigung-arbeitslosmeldung-offen.input.json'),
    { tier: 'upgrade', onEvent: (event) => readyEvents.push(event) },
  );

  assert.equal(readyView.status, 'ready');
  assert.equal(readyEvents.length, 1);
  for (const key of eventKeys) assert.ok(Object.prototype.hasOwnProperty.call(readyEvents[0], key));
  assert.equal(readyEvents[0].status, 'ready');
  assert.equal(readyEvents[0].primaryTrack, 'deadline-first');
  assert.equal(readyEvents[0].flowAbandonment, null);

  const incompleteEvents = [];
  const incompleteView = buildQuestionnaireResultView({
    case_entry: 'termination_received',
    agreement_present: false,
    already_unemployed_now: false,
    release_status: 'no',
  }, {
    tier: 'base',
    onEvent: (event) => incompleteEvents.push(event),
  });

  assert.equal(incompleteView.status, 'incomplete');
  assert.equal(incompleteEvents.length, 1);
  assert.equal(incompleteEvents[0].status, 'incomplete');
  assert.ok(incompleteEvents[0].flowAbandonment);
  assert.equal(incompleteEvents[0].flowAbandonment.lastQuestionKey, 'case_entry');
  assert.equal(incompleteEvents[0].flowAbandonment.nextQuestionKey, 'termination_access_date');

  const errorEvents = [];
  const errorView = buildQuestionnaireResultView(null, {
    tier: 'base',
    onEvent: (event) => errorEvents.push(event),
  });

  assert.equal(errorView.status, 'error');
  assert.equal(errorEvents.length, 1);
  assert.equal(errorEvents[0].status, 'error');
  assert.equal(errorEvents[0].errorCode, 'invalid_input');
}

function assertCriterion3UiConsistency() {
  const mixedResult = buildResult(readJson('examples/inputs/06-mehrere-eingaenge-gleichzeitig.input.json'));
  const mixedPreview = renderProductResult(projectResultForTier(mixedResult, { tier: 'preview' }), { tier: 'preview' });
  const mixedBase = renderProductResult(projectResultForTier(mixedResult, { tier: 'base' }), { tier: 'base' });
  const mixedUpgrade = renderProductResult(projectResultForTier(mixedResult, { tier: 'upgrade' }), { tier: 'upgrade' });

  assert.ok(mixedPreview.includes('Wichtigster nächster Schritt: 3-Wochen-Frist für Kündigungsschutzklage sofort prüfen'));
  assert.ok(mixedPreview.includes('Kritische Frist: Kündigungsschutzklage — bis 13.04.2026'));
  assert.ok(mixedPreview.includes('Reihenfolge jetzt: zuerst die Frist sichern, danach den heiklen Sonderfall sauber prüfen lassen.'));
  assert.ok(mixedBase.indexOf('Besonders wichtig:') < mixedBase.indexOf('Risiken:'));
  assert.ok(mixedUpgrade.indexOf('Besonders wichtig:') < mixedUpgrade.indexOf('Risiken:'));

  const announcedResult = buildResult(readJson('examples/inputs/05-kuendigung-nur-angekuendigt.input.json'));
  const announcedPreview = renderProductResult(projectResultForTier(announcedResult, { tier: 'preview' }), { tier: 'preview' });
  const announcedBase = renderProductResult(projectResultForTier(announcedResult, { tier: 'base' }), { tier: 'base' });

  assert.ok(announcedPreview.startsWith('Noch keine schriftliche Kündigung – jetzt die nächsten Schritte sauber vorbereiten'));
  assert.ok(announcedPreview.includes('Wichtigster nächster Schritt: Jetzt bei der Agentur für Arbeit arbeitssuchend melden oder Status prüfen'));
  assert.ok(announcedPreview.includes('Kritische Frist: Bei der Agentur für Arbeit arbeitssuchend melden — grundsätzlich bis 30.03.2026'));
  assert.ok(!announcedPreview.includes('Kritische Frist: Kündigungsschutzklage'));
  assert.ok(announcedBase.includes('Bei der Agentur für Arbeit arbeitssuchend melden:'));
}

function run() {
  assertCriterion1RegressionSafety();
  assertCriterion2Observability();
  assertCriterion3UiConsistency();
  console.log('Launch hardening done gate checks passed.');
}

run();
