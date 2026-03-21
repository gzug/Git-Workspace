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
  const readyView = buildQuestionnaireResultView(completeInput, { tier: 'upgrade' });

  assert.equal(readyView.status, 'ready');
  assert.equal(readyView.tier, 'upgrade');
  assert.equal(readyView.flowState.isComplete, true);
  assert.ok(readyView.result);
  assert.ok(readyView.projected);
  assert.ok(typeof readyView.rendered === 'string');
  assert.ok(readyView.rendered.includes('Warum dieser Fokus:'));

  const incompleteView = buildQuestionnaireResultView({
    case_entry: 'termination_received',
    agreement_present: false,
    already_unemployed_now: false,
    release_status: 'no',
  }, { tier: 'base' });

  assert.equal(incompleteView.status, 'incomplete');
  assert.equal(incompleteView.flowState.isComplete, false);
  assert.equal(incompleteView.flowState.nextScreen.id, 'time-critical-basics');
  assert.ok(incompleteView.missingAnswers.some((item) => item.id === 'termination_access_date'));
  assert.ok(incompleteView.message.includes('Für die Auswertung fehlt noch:'));

  const unknownTierView = buildQuestionnaireResultView(completeInput, { tier: 'vip' });
  assert.equal(unknownTierView.status, 'ready');
  assert.equal(unknownTierView.tier, 'base');
  assert.ok(unknownTierView.warnings.some((warning) => warning.includes('Unknown tier "vip"')));
  assert.ok(unknownTierView.rendered.includes('Nächste Schritte:'));

  const invalidInputView = buildQuestionnaireResultView(null, { tier: 'base' });
  assert.equal(invalidInputView.status, 'error');
  assert.equal(invalidInputView.error.code, 'invalid_input');

  const renderFallbackView = buildQuestionnaireResultView(completeInput, {
    tier: 'base',
    renderFn: () => {
      throw new Error('Synthetic render failure');
    },
  });

  assert.equal(renderFallbackView.status, 'render-fallback');
  assert.equal(renderFallbackView.error.code, 'render_failed');
  assert.equal(renderFallbackView.rendered, null);
  assert.ok(renderFallbackView.result);
  assert.ok(renderFallbackView.projected);

  console.log('All questionnaire result view tests passed.');
}

run();
