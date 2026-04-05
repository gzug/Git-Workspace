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
    termination_access_date: 'unknown',
    employment_end_date: '2026-04-30',
    jobseeker_registered: false,
    already_unemployed_now: false,
    agreement_present: false,
    release_status: 'no',
    special_protection_indicator: ['none_known'],
    primary_goal: 'protect_deadlines',
  }, { tier: 'upgrade' });

  assert.equal(incompleteView.status, 'incomplete');
  assert.equal(incompleteView.tier, 'upgrade');
  assert.equal(incompleteView.normalizedInput.termination_access_date, null);
  assert.ok(incompleteView.missingAnswers.some((item) => item.id === 'termination_access_date'));
  assert.ok(incompleteView.message.includes('Wann ist dir die schriftliche Kündigung zugegangen?'));
  assert.ok(!('result' in incompleteView));
  assert.ok(!('projected' in incompleteView));
  assert.equal(incompleteView.telemetry.status, 'incomplete');
  assert.equal(incompleteView.telemetry.primaryTrack, null);

  const invalidTypedView = buildQuestionnaireResultView({
    case_entry: 'termination_received',
    termination_access_date: '2026-99-99',
    employment_end_date: '2026-04-30',
    jobseeker_registered: 'maybe',
    already_unemployed_now: false,
    agreement_present: false,
    release_status: 'no',
    special_protection_indicator: ['none_known'],
    primary_goal: 'protect_deadlines',
  }, { tier: 'base' });

  assert.equal(invalidTypedView.status, 'incomplete');
  assert.equal(invalidTypedView.normalizedInput.termination_access_date, null);
  assert.equal(invalidTypedView.normalizedInput.jobseeker_registered, null);
  assert.ok(invalidTypedView.missingAnswers.some((item) => item.id === 'termination_access_date'));
  assert.ok(invalidTypedView.missingAnswers.some((item) => item.id === 'jobseeker_registered'));
  assert.ok(!('result' in invalidTypedView));
  assert.equal(invalidTypedView.telemetry.status, 'incomplete');

  const invalidOptionView = buildQuestionnaireResultView({
    case_entry: 'weird',
    termination_access_date: '2026-03-21',
    employment_end_date: '2026-04-30',
    jobseeker_registered: false,
    already_unemployed_now: false,
    agreement_present: false,
    release_status: 'banana',
    special_protection_indicator: ['none_known', 'bogus'],
    primary_goal: 'rocket',
    documents_secured: ['termination_letter', 'bogus'],
  }, { tier: 'base' });

  assert.equal(invalidOptionView.status, 'incomplete');
  assert.equal(invalidOptionView.normalizedInput.case_entry, null);
  assert.equal(invalidOptionView.normalizedInput.release_status, null);
  assert.equal(invalidOptionView.normalizedInput.primary_goal, null);
  assert.deepEqual(invalidOptionView.normalizedInput.special_protection_indicator, ['none_known']);
  assert.deepEqual(invalidOptionView.normalizedInput.documents_secured, ['termination_letter']);
  assert.ok(invalidOptionView.missingAnswers.some((item) => item.id === 'case_entry'));
  assert.ok(!('result' in invalidOptionView));
  assert.equal(invalidOptionView.telemetry.status, 'incomplete');

  const contradictoryMultiSelectView = buildQuestionnaireResultView({
    case_entry: 'termination_received',
    termination_access_date: '2026-03-21',
    employment_end_date: '2026-04-30',
    jobseeker_registered: false,
    already_unemployed_now: false,
    agreement_present: false,
    release_status: 'no',
    special_protection_indicator: ['none_known', 'pregnancy_or_maternity'],
    primary_goal: 'protect_deadlines',
    documents_secured: ['none_yet', 'termination_letter', 'salary_docs'],
  }, { tier: 'base' });

  assert.equal(contradictoryMultiSelectView.status, 'ready');
  assert.deepEqual(contradictoryMultiSelectView.normalizedInput.special_protection_indicator, ['pregnancy_or_maternity']);
  assert.deepEqual(contradictoryMultiSelectView.normalizedInput.documents_secured, ['termination_letter', 'salary_docs']);
  assert.equal(contradictoryMultiSelectView.result.synthesisDecision.primaryTrack, 'special-case-review');
  assert.ok(contradictoryMultiSelectView.result.documentChecklist.some((item) => item.label === 'Kündigungsschreiben' && item.status === 'already-secured'));
  assert.ok(contradictoryMultiSelectView.result.documentChecklist.some((item) => item.label === 'Lohnunterlagen' && item.status === 'already-secured'));

  const announcedOnlyView = buildQuestionnaireResultView({
    case_entry: 'termination_announced_only',
    termination_access_date: '2026-03-18',
    employment_end_date: '2026-04-30',
    jobseeker_registered: false,
    already_unemployed_now: false,
    agreement_present: false,
    release_status: 'no',
    special_protection_indicator: ['none_known'],
    documents_secured: ['employment_contract'],
    primary_goal: 'prepare_advice',
  }, { tier: 'base' });

  assert.equal(announcedOnlyView.status, 'ready');
  assert.equal(announcedOnlyView.normalizedInput.termination_access_date, null);
  assert.equal(announcedOnlyView.result.synthesisDecision.primaryTrack, 'prepare-advice');
  assert.ok(!announcedOnlyView.result.deadlines.some((item) => item.label === 'Kündigungsschutzklage prüfen'));
  assert.ok(!announcedOnlyView.rendered.includes('Kündigungsschutzklage prüfen'));

  const signedAgreementView = buildQuestionnaireResultView({
    case_entry: 'settlement_offered',
    employment_end_date: '2026-05-31',
    jobseeker_registered: false,
    already_unemployed_now: false,
    agreement_present: false,
    agreement_already_signed: true,
    release_status: 'yes_irrevocable',
    special_protection_indicator: ['none_known'],
    documents_secured: ['agreement_draft', 'employment_contract', 'salary_docs'],
    primary_goal: 'protect_alg1',
  }, { tier: 'base' });

  assert.equal(signedAgreementView.status, 'ready');
  assert.equal(signedAgreementView.normalizedInput.agreement_present, true);
  assert.equal(signedAgreementView.normalizedInput.agreement_already_signed, true);
  assert.equal(signedAgreementView.result.synthesisDecision.primaryTrack, 'special-case-review');
  assert.ok(signedAgreementView.result.documentChecklist.some((item) => item.label === 'Unterzeichneter Vertrag'));

  const settlementOnlyView = buildQuestionnaireResultView({
    case_entry: 'settlement_offered',
    termination_access_date: '2026-03-18',
    employment_end_date: '2026-05-31',
    jobseeker_registered: false,
    already_unemployed_now: false,
    agreement_present: true,
    agreement_already_signed: false,
    release_status: 'yes_irrevocable',
    special_protection_indicator: ['none_known'],
    documents_secured: ['agreement_draft', 'employment_contract'],
    primary_goal: 'protect_alg1',
  }, { tier: 'base' });

  assert.equal(settlementOnlyView.status, 'ready');
  assert.equal(settlementOnlyView.normalizedInput.termination_access_date, null);
  assert.equal(settlementOnlyView.result.synthesisDecision.primaryTrack, 'contract-do-not-sign');
  assert.ok(!settlementOnlyView.result.deadlines.some((item) => item.label === 'Kündigungsschutzklage prüfen'));
  assert.ok(!settlementOnlyView.rendered.includes('Kündigungsschutzklage prüfen'));

  const staleAgencyView = buildQuestionnaireResultView({
    case_entry: 'termination_received',
    termination_access_date: '2026-03-21',
    employment_end_date: '2026-04-30',
    jobseeker_registered: false,
    already_unemployed_now: false,
    unemployment_registered: true,
    agreement_present: false,
    release_status: 'no',
    special_protection_indicator: ['none_known'],
    documents_secured: ['termination_letter'],
    primary_goal: 'protect_deadlines',
  }, { tier: 'base' });

  assert.equal(staleAgencyView.status, 'ready');
  assert.equal(staleAgencyView.normalizedInput.unemployment_registered, null);
  assert.ok(!staleAgencyView.result.deadlines.some((item) => item.label === 'Arbeitslosmeldung'));
  assert.ok(!staleAgencyView.rendered.includes('Arbeitslosmeldung:'));

  console.log('All launch hardening anchor tests passed.');
}

run();
