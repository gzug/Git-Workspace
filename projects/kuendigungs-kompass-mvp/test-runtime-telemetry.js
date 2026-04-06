const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('assert');
const { buildQuestionnaireResultView } = require('./src/runtime/buildQuestionnaireResultView');
const { buildResultViewEvent, emitResultViewEvent } = require('./src/runtime/telemetry/emitResultViewEvent');
const { createFileTelemetrySink } = require('./src/runtime/telemetry/fileTelemetrySink');
const { aggregateTelemetry } = require('./src/runtime/telemetry/aggregateTelemetry');

const ROOT = __dirname;

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'));
}

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'kk-telemetry-'));
}

function run() {
  const readyView = buildQuestionnaireResultView(
    readJson('examples/inputs/01-kuendigung-arbeitslosmeldung-offen.input.json'),
    { tier: 'upgrade' },
  );

  const builtEvent = buildResultViewEvent(readyView);
  assert.deepEqual(builtEvent, readyView.telemetry);

  const emitted = [];
  const emittedEvent = emitResultViewEvent(readyView, (event) => emitted.push(event));
  assert.deepEqual(emittedEvent, readyView.telemetry);
  assert.deepEqual(emitted[0], readyView.telemetry);

  const tempDir = makeTempDir();
  const filePath = path.join(tempDir, 'telemetry.ndjson');
  const sink = createFileTelemetrySink({ filePath });

  const hookedReadyView = buildQuestionnaireResultView(
    readJson('examples/inputs/01-kuendigung-arbeitslosmeldung-offen.input.json'),
    { tier: 'upgrade', onEvent: sink },
  );
  assert.equal(hookedReadyView.status, 'ready');

  const incompleteView = buildQuestionnaireResultView({
    case_entry: 'termination_received',
    agreement_present: false,
    already_unemployed_now: false,
    release_status: 'no',
  }, { tier: 'base' });
  assert.equal(sink(incompleteView), true);

  const demoReadyLine = JSON.parse(fs.readFileSync(filePath, 'utf8').trim().split(/\r?\n/)[0]);
  assert.equal(demoReadyLine.status, 'ready');
  assert.equal(demoReadyLine.primaryTrack, 'deadline-first');

  const manualErrorEvent = {
    event: 'questionnaire_result_view_built',
    generatedAt: '2026-04-06T02:00:00.000Z',
    status: 'error',
    requestedTier: 'base',
    tier: 'base',
    warningCount: 0,
    missingAnswersCount: 0,
    primaryTrack: null,
    riskLevel: null,
    topActionsCount: 0,
    deadlinesCount: 0,
    redFlagsCount: 0,
    errorCode: 'invalid_input',
    flowAbandonment: null,
  };
  assert.equal(sink(manualErrorEvent), true);

  const ndjson = fs.readFileSync(filePath, 'utf8').trim().split(/\r?\n/);
  assert.equal(ndjson.length, 3);
  assert.equal(JSON.parse(ndjson[0]).status, 'ready');
  assert.equal(JSON.parse(ndjson[1]).status, 'incomplete');
  assert.equal(JSON.parse(ndjson[2]).errorCode, 'invalid_input');

  fs.appendFileSync(filePath, '\nnot-json\n\n', 'utf8');
  const summary = aggregateTelemetry({ filePath, topLimit: 3 });
  assert.equal(summary.totalEvents, 3);
  assert.equal(summary.invalidLineCount, 1);
  assert.deepEqual(summary.countsByStatus, {
    ready: 1,
    incomplete: 1,
    error: 1,
  });
  assert.deepEqual(summary.countsByPrimaryTrack, {
    'deadline-first': 1,
  });
  assert.deepEqual(summary.errorCodeCounts, {
    invalid_input: 1,
  });
  assert.deepEqual(summary.topNextQuestionKeys, [
    { key: 'termination_access_date', count: 1 },
  ]);
  assert.deepEqual(summary.stopSignals, {
    renderFallbackStopCount: 2,
    errorStopCount: 1,
    repeatedRenderFallback: false,
    errorsPresent: true,
    invalidTelemetryLines: true,
    monitoringBlind: false,
    requiresAttention: true,
  });

  const missingSummary = aggregateTelemetry({ filePath: path.join(tempDir, 'missing.ndjson') });
  assert.equal(missingSummary.totalEvents, 0);
  assert.equal(missingSummary.invalidLineCount, 0);
  assert.deepEqual(missingSummary.countsByStatus, {});
  assert.deepEqual(missingSummary.stopSignals, {
    renderFallbackStopCount: 2,
    errorStopCount: 1,
    repeatedRenderFallback: false,
    errorsPresent: false,
    invalidTelemetryLines: false,
    monitoringBlind: true,
    requiresAttention: true,
  });

  const stopSignalPath = path.join(tempDir, 'stop-signals.ndjson');
  fs.writeFileSync(stopSignalPath, [
    JSON.stringify({ status: 'ready', primaryTrack: 'deadline-first', errorCode: null, flowAbandonment: null }),
    JSON.stringify({ status: 'render-fallback', primaryTrack: 'deadline-first', errorCode: 'render_failed', flowAbandonment: null }),
    JSON.stringify({ status: 'render-fallback', primaryTrack: 'deadline-first', errorCode: 'render_failed', flowAbandonment: null }),
  ].join('\n'));

  const stopSignalSummary = aggregateTelemetry({ filePath: stopSignalPath });
  assert.deepEqual(stopSignalSummary.stopSignals, {
    renderFallbackStopCount: 2,
    errorStopCount: 1,
    repeatedRenderFallback: true,
    errorsPresent: false,
    invalidTelemetryLines: false,
    monitoringBlind: false,
    requiresAttention: true,
  });

  const failingSink = createFileTelemetrySink({
    filePath: path.join(tempDir, 'will-not-write.ndjson'),
    fsImpl: {
      mkdirSync() {},
      appendFileSync() {
        throw new Error('disk full');
      },
    },
  });
  assert.equal(failingSink(readyView), false);

  console.log('Runtime telemetry utilities tests passed.');
}

run();
