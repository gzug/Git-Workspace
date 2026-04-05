const assert = require('assert');
const { normalizeQuestionnaireInput } = require('./src/adapters/normalizeInput');

function run() {
  const raw = {
    case_entry: 'termination_received',
    termination_access_date: '2026-03-18',
    jobseeker_registered: 'false',
    already_unemployed_now: 'true',
    unemployment_registered: '',
    agreement_present: 'no',
    agreement_already_signed: 'false',
    special_protection_indicator: 'unsure',
    documents_secured: '',
    primary_goal: 'protect_deadlines',
  };

  const normalized = normalizeQuestionnaireInput(raw);

  assert.equal(normalized.case_entry, 'termination_received');
  assert.equal(normalized.termination_access_date, '2026-03-18');
  assert.equal(normalized.jobseeker_registered, false);
  assert.equal(normalized.already_unemployed_now, true);
  assert.equal(normalized.unemployment_registered, null);
  assert.equal(normalized.agreement_present, false);
  assert.equal(normalized.agreement_already_signed, null);
  assert.deepEqual(normalized.special_protection_indicator, ['unsure']);
  assert.deepEqual(normalized.documents_secured, []);
  assert.equal(normalized.primary_goal, 'protect_deadlines');

  const unknownLiterals = normalizeQuestionnaireInput({
    termination_access_date: 'unknown',
    employment_end_date: ' unknown ',
    jobseeker_registered: 'unknown',
  });
  assert.equal(unknownLiterals.termination_access_date, null);
  assert.equal(unknownLiterals.employment_end_date, null);
  assert.equal(unknownLiterals.jobseeker_registered, null);

  const invalidTypedValues = normalizeQuestionnaireInput({
    termination_access_date: '2026-99-99',
    employment_end_date: '18.03.2026',
    jobseeker_registered: 'maybe',
    already_unemployed_now: '1',
  });
  assert.equal(invalidTypedValues.termination_access_date, null);
  assert.equal(invalidTypedValues.employment_end_date, null);
  assert.equal(invalidTypedValues.jobseeker_registered, null);
  assert.equal(invalidTypedValues.already_unemployed_now, null);

  const invalidOptionValues = normalizeQuestionnaireInput({
    case_entry: 'weird',
    release_status: 'banana',
    primary_goal: 'rocket',
    special_protection_indicator: ['none_known', 'banana', 'unsure'],
    documents_secured: ['termination_letter', 'bogus'],
  });
  assert.equal(invalidOptionValues.case_entry, null);
  assert.equal(invalidOptionValues.release_status, null);
  assert.equal(invalidOptionValues.primary_goal, null);
  assert.deepEqual(invalidOptionValues.special_protection_indicator, ['unsure']);
  assert.deepEqual(invalidOptionValues.documents_secured, ['termination_letter']);

  const contradictoryMultiSelectValues = normalizeQuestionnaireInput({
    special_protection_indicator: ['none_known', 'pregnancy_or_maternity'],
    documents_secured: ['none_yet', 'termination_letter', 'salary_docs'],
  });
  assert.deepEqual(contradictoryMultiSelectValues.special_protection_indicator, ['pregnancy_or_maternity']);
  assert.deepEqual(contradictoryMultiSelectValues.documents_secured, ['termination_letter', 'salary_docs']);

  const crossFieldGuardrails = normalizeQuestionnaireInput({
    case_entry: 'termination_announced_only',
    termination_access_date: '2026-03-18',
    agreement_present: false,
    agreement_already_signed: true,
  });
  assert.equal(crossFieldGuardrails.termination_access_date, null);
  assert.equal(crossFieldGuardrails.agreement_present, true);
  assert.equal(crossFieldGuardrails.agreement_already_signed, true);

  const staleAgencyFlag = normalizeQuestionnaireInput({
    already_unemployed_now: false,
    unemployment_registered: true,
  });
  assert.equal(staleAgencyFlag.already_unemployed_now, false);
  assert.equal(staleAgencyFlag.unemployment_registered, null);

  const irrelevantAgreementFlag = normalizeQuestionnaireInput({
    agreement_present: false,
    agreement_already_signed: false,
  });
  assert.equal(irrelevantAgreementFlag.agreement_present, false);
  assert.equal(irrelevantAgreementFlag.agreement_already_signed, null);

  const sparse = normalizeQuestionnaireInput({});
  assert.deepEqual(sparse.special_protection_indicator, []);
  assert.deepEqual(sparse.documents_secured, []);

  console.log('All input normalization tests passed.');
}

run();
