const assert = require('assert');
const {
  getLaunchV1Screens,
  getNextIncompleteScreen,
  getQuestionnaireFlowState,
} = require('./src/flow/questionnaireFlow');

function screenQuestionIds(screen) {
  return screen.questions.map((question) => question.id);
}

function run() {
  const emptyScreens = getLaunchV1Screens({});
  assert.deepEqual(emptyScreens.map((screen) => screen.id), [
    'entry',
    'time-critical-basics',
    'contract-status',
    'risk-check',
    'preparation',
  ]);
  assert.deepEqual(screenQuestionIds(emptyScreens[0]), ['case_entry']);
  assert.deepEqual(screenQuestionIds(emptyScreens[1]), [
    'employment_end_date',
    'jobseeker_registered',
    'already_unemployed_now',
  ]);
  assert.deepEqual(screenQuestionIds(emptyScreens[2]), ['agreement_present', 'release_status']);
  assert.deepEqual(screenQuestionIds(emptyScreens[3]), ['special_protection_indicator']);
  assert.deepEqual(screenQuestionIds(emptyScreens[4]), ['documents_secured', 'primary_goal']);
  assert.equal(getNextIncompleteScreen({}).id, 'entry');

  const terminationFlow = getLaunchV1Screens({
    case_entry: 'termination_received',
    agreement_present: true,
    already_unemployed_now: true,
  });

  assert.deepEqual(screenQuestionIds(terminationFlow[1]), [
    'termination_access_date',
    'employment_end_date',
    'jobseeker_registered',
    'already_unemployed_now',
    'unemployment_registered',
  ]);
  assert.deepEqual(screenQuestionIds(terminationFlow[2]), [
    'agreement_present',
    'agreement_already_signed',
    'release_status',
  ]);

  const announcedOnlyFlow = getLaunchV1Screens({
    case_entry: 'termination_announced_only',
    agreement_present: false,
    already_unemployed_now: false,
  });

  assert.ok(!screenQuestionIds(announcedOnlyFlow[1]).includes('termination_access_date'));
  assert.ok(!screenQuestionIds(announcedOnlyFlow[1]).includes('unemployment_registered'));
  assert.ok(!screenQuestionIds(announcedOnlyFlow[2]).includes('agreement_already_signed'));

  const completedState = getQuestionnaireFlowState({
    case_entry: 'termination_received',
    termination_access_date: '2026-03-18',
    employment_end_date: '2026-03-31',
    jobseeker_registered: false,
    already_unemployed_now: true,
    unemployment_registered: false,
    agreement_present: true,
    agreement_already_signed: false,
    release_status: 'no',
    special_protection_indicator: ['none_known'],
    documents_secured: ['termination_letter'],
    primary_goal: 'protect_deadlines',
  });

  assert.equal(completedState.isComplete, true);
  assert.equal(completedState.nextScreen, null);
  assert.deepEqual(completedState.answeredQuestionIds.sort(), [
    'agreement_already_signed',
    'agreement_present',
    'already_unemployed_now',
    'case_entry',
    'documents_secured',
    'employment_end_date',
    'jobseeker_registered',
    'primary_goal',
    'release_status',
    'special_protection_indicator',
    'termination_access_date',
    'unemployment_registered',
  ]);

  console.log('All questionnaire flow tests passed.');
}

run();
