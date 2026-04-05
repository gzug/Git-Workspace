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
  assert.equal(normalized.agreement_already_signed, false);
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

  const sparse = normalizeQuestionnaireInput({});
  assert.deepEqual(sparse.special_protection_indicator, []);
  assert.deepEqual(sparse.documents_secured, []);

  console.log('All input normalization tests passed.');
}

run();
