const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { buildQuestionnaireResultView } = require('./src/runtime/buildQuestionnaireResultView');

const ROOT = __dirname;

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'));
}

function run() {
  const completeInput = readJson('examples/inputs/01-kuendigung-arbeitslosmeldung-offen.input.json');

  const readyEvents = [];
  const readyView = buildQuestionnaireResultView(completeInput, {
    tier: 'upgrade',
    onEvent: (event) => readyEvents.push(event),
  });

  assert.equal(readyView.status, 'ready');
  assert.equal(readyView.tier, 'upgrade');
  assert.equal(readyView.flowState.isComplete, true);
  assert.ok(readyView.result);
  assert.ok(readyView.projected);
  assert.ok(typeof readyView.rendered === 'string');
  assert.ok(readyView.rendered.includes('Warum dieser Fokus:'));
  assert.equal(readyView.telemetry.status, 'ready');
  assert.equal(readyView.telemetry.primaryTrack, 'deadline-first');
  assert.ok(typeof readyView.telemetry.generatedAt === 'string');
  assert.equal(readyView.telemetry.flowAbandonment, null);
  assert.equal(readyEvents.length, 1);
  assert.deepEqual(readyEvents[0], readyView.telemetry);

  const throwInHookView = buildQuestionnaireResultView(completeInput, {
    tier: 'base',
    onEvent: () => {
      throw new Error('sink failed');
    },
  });
  assert.equal(throwInHookView.status, 'ready');
  assert.ok(typeof throwInHookView.rendered === 'string');

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
  assert.equal(incompleteView.flowState.isComplete, false);
  assert.equal(incompleteView.flowState.nextScreen.id, 'time-critical-basics');
  assert.equal(incompleteView.flowState.nextQuestionId, 'termination_access_date');
  assert.equal(incompleteView.flowState.lastAnsweredQuestionId, 'case_entry');
  assert.ok(incompleteView.missingAnswers.some((item) => item.id === 'termination_access_date'));
  assert.ok(incompleteView.message.includes('Für die Auswertung fehlt noch:'));
  assert.equal(incompleteView.telemetry.status, 'incomplete');
  assert.ok(incompleteView.telemetry.missingAnswersCount >= 1);
  assert.equal(incompleteView.telemetry.flowAbandonment.lastQuestionKey, 'case_entry');
  assert.equal(incompleteView.telemetry.flowAbandonment.nextQuestionKey, 'termination_access_date');
  assert.equal(incompleteView.telemetry.flowAbandonment.trackContext, null);
  assert.equal(incompleteView.telemetry.flowAbandonment.hadRedFlag, true);
  assert.equal(incompleteView.telemetry.flowAbandonment.hadKnownDeadlineDate, false);
  assert.equal(incompleteEvents.length, 1);
  assert.deepEqual(incompleteEvents[0], incompleteView.telemetry);

  const unknownTierEvents = [];
  const unknownTierView = buildQuestionnaireResultView(completeInput, {
    tier: 'vip',
    onEvent: (event) => unknownTierEvents.push(event),
  });
  assert.equal(unknownTierView.status, 'ready');
  assert.equal(unknownTierView.tier, 'base');
  assert.ok(unknownTierView.warnings.some((warning) => warning.includes('Unknown tier "vip"')));
  assert.ok(unknownTierView.rendered.includes('Als Erstes:'));
  assert.equal(unknownTierEvents.length, 1);
  assert.equal(unknownTierEvents[0].warningCount, 1);
  assert.equal(unknownTierEvents[0].tier, 'base');

  const invalidInputEvents = [];
  const invalidInputView = buildQuestionnaireResultView(null, {
    tier: 'base',
    onEvent: (event) => invalidInputEvents.push(event),
  });
  assert.equal(invalidInputView.status, 'error');
  assert.equal(invalidInputView.error.code, 'invalid_input');
  assert.equal(invalidInputView.telemetry.status, 'error');
  assert.equal(invalidInputView.telemetry.errorCode, 'invalid_input');
  assert.equal(invalidInputEvents.length, 1);
  assert.deepEqual(invalidInputEvents[0], invalidInputView.telemetry);

  const buildErrorEvents = [];
  const buildErrorView = buildQuestionnaireResultView(completeInput, {
    tier: 'base',
    onEvent: (event) => buildErrorEvents.push(event),
    buildFn: () => {
      throw new Error('Synthetic build failure');
    },
  });

  assert.equal(buildErrorView.status, 'error');
  assert.equal(buildErrorView.error.code, 'build_result_failed');
  assert.equal(buildErrorView.error.message, 'Synthetic build failure');
  assert.equal(buildErrorView.telemetry.status, 'error');
  assert.equal(buildErrorView.telemetry.errorCode, 'build_result_failed');
  assert.ok(buildErrorView.normalizedInput);
  assert.ok(buildErrorView.flowState);
  assert.equal(buildErrorEvents.length, 1);
  assert.deepEqual(buildErrorEvents[0], buildErrorView.telemetry);

  const projectErrorEvents = [];
  const projectErrorView = buildQuestionnaireResultView(completeInput, {
    tier: 'base',
    onEvent: (event) => projectErrorEvents.push(event),
    projectFn: () => {
      throw new Error('Synthetic project failure');
    },
  });

  assert.equal(projectErrorView.status, 'error');
  assert.equal(projectErrorView.error.code, 'project_result_failed');
  assert.equal(projectErrorView.error.message, 'Synthetic project failure');
  assert.equal(projectErrorView.telemetry.status, 'error');
  assert.equal(projectErrorView.telemetry.errorCode, 'project_result_failed');
  assert.ok(projectErrorView.result);
  assert.ok(projectErrorView.normalizedInput);
  assert.ok(projectErrorView.flowState);
  assert.equal(projectErrorEvents.length, 1);
  assert.deepEqual(projectErrorEvents[0], projectErrorView.telemetry);

  const renderFallbackEvents = [];
  const renderFallbackView = buildQuestionnaireResultView(completeInput, {
    tier: 'base',
    onEvent: (event) => renderFallbackEvents.push(event),
    renderFn: () => {
      throw new Error('Synthetic render failure');
    },
  });

  assert.equal(renderFallbackView.status, 'render-fallback');
  assert.equal(renderFallbackView.error.code, 'render_failed');
  assert.equal(renderFallbackView.rendered, null);
  assert.ok(renderFallbackView.result);
  assert.ok(renderFallbackView.projected);
  assert.equal(renderFallbackView.telemetry.status, 'render-fallback');
  assert.equal(renderFallbackView.telemetry.errorCode, 'render_failed');
  assert.equal(renderFallbackEvents.length, 1);
  assert.deepEqual(renderFallbackEvents[0], renderFallbackView.telemetry);

  console.log('All questionnaire result view tests passed.');
}

run();
