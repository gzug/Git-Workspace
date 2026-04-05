const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { buildResult, renderResult } = require('./src/engine');
const { buildQuestionnaireResultView } = require('./src/runtime/buildQuestionnaireResultView');

const ROOT = __dirname;

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function deadlineByLabel(result, label) {
  return (result.deadlines || []).find((item) => item.label === label) || null;
}

function run() {
  const agencyCase = readJson('examples/inputs/01-kuendigung-arbeitslosmeldung-offen.input.json');

  const weekendDeadlineCase = {
    ...clone(agencyCase),
    termination_access_date: '2026-03-21',
    employment_end_date: '2026-04-30',
    already_unemployed_now: false,
    unemployment_registered: true,
    jobseeker_registered: false,
    primary_goal: 'protect_deadlines',
  };

  const weekendResult = buildResult(weekendDeadlineCase);
  const lawsuitDeadline = deadlineByLabel(weekendResult, 'Kündigungsschutzklage prüfen');
  const weekendRendered = renderResult(weekendResult, 'standard');

  assert.equal(weekendResult.synthesisDecision.primaryTrack, 'deadline-first');
  assert.ok(lawsuitDeadline);
  assert.ok(lawsuitDeadline.timing.includes('13.04.2026'));
  assert.ok(lawsuitDeadline.note.includes('nächste Werktag mitgeprüft werden'));
  assert.ok(lawsuitDeadline.note.includes('Landesfeiertage'));
  assert.ok(weekendRendered.includes('Kündigungsschutzklage prüfen: regelmäßig innerhalb von 3 Wochen nach Zugang der schriftlichen Kündigung (ausgehend vom angegebenen Zugangsdatum: bis 13.04.2026)'));

  const agencyResult = buildResult(agencyCase);
  const agencyRendered = renderResult(agencyResult, 'standard');
  const agencyTopActionLabels = agencyResult.topActions.map((item) => item.label);
  const agencyDeadlineLabels = agencyResult.deadlines.map((item) => item.label);
  const agencyRiskLabels = agencyResult.riskFlags.map((item) => item.label);

  assert.deepEqual(agencyTopActionLabels.slice(0, 2), [
    'Arbeitslosmeldung sofort prüfen oder nachholen',
    'Arbeitsuchendmeldung ebenfalls sofort prüfen oder nachholen',
  ]);
  assert.ok(agencyDeadlineLabels.includes('Arbeitslosmeldung'));
  assert.ok(agencyDeadlineLabels.includes('Arbeitsuchendmeldung'));
  assert.ok(agencyRiskLabels.includes('Offene Arbeitslosmeldung kann den Leistungsstart erschweren'));
  assert.ok(agencyRiskLabels.includes('Offene Arbeitsuchendmeldung kann Nachteile auslösen'));
  assert.ok(agencyRendered.includes('Arbeitslosmeldung: spätestens am ersten Tag der Arbeitslosigkeit; wenn noch offen, jetzt sofort prüfen'));
  assert.ok(agencyRendered.includes('Arbeitsuchendmeldung: spätestens 3 Monate vor Ende, sonst innerhalb von 3 Tagen nach Kenntnis'));
  assert.ok(!agencyRendered.includes('Agentur-Meldungen:'));

  const incompleteView = buildQuestionnaireResultView({
    case_entry: 'termination_received',
    employment_end_date: '2026-04-30',
    jobseeker_registered: false,
    already_unemployed_now: false,
    agreement_present: false,
    release_status: 'no',
  }, { tier: 'upgrade' });

  assert.equal(incompleteView.status, 'incomplete');
  assert.equal(incompleteView.tier, 'upgrade');
  assert.ok(incompleteView.missingAnswers.some((item) => item.id === 'termination_access_date'));
  assert.ok(incompleteView.message.includes('Wann ist dir die schriftliche Kündigung zugegangen?'));
  assert.ok(!('result' in incompleteView));
  assert.ok(!('projected' in incompleteView));
  assert.equal(incompleteView.telemetry.status, 'incomplete');
  assert.equal(incompleteView.telemetry.primaryTrack, null);

  console.log('All launch hardening anchor tests passed.');
}

run();
