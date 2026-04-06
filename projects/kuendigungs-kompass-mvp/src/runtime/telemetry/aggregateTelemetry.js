const fs = require('fs');
const path = require('path');

function increment(bucket, key) {
  if (!key) return;
  bucket[key] = (bucket[key] || 0) + 1;
}

function sortCounts(bucket, limit = Infinity) {
  return Object.entries(bucket)
    .sort((a, b) => (b[1] - a[1]) || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([key, count]) => ({ key, count }));
}

function buildStopSignals(summary, options = {}) {
  const renderFallbackStopCount = Number.isInteger(options.renderFallbackStopCount)
    ? options.renderFallbackStopCount
    : 2;
  const errorStopCount = Number.isInteger(options.errorStopCount)
    ? options.errorStopCount
    : 1;

  const renderFallbackCount = summary.countsByStatus['render-fallback'] || 0;
  const errorCount = summary.countsByStatus.error || 0;

  return {
    renderFallbackStopCount,
    errorStopCount,
    repeatedRenderFallback: renderFallbackCount >= renderFallbackStopCount,
    errorsPresent: errorCount >= errorStopCount,
    invalidTelemetryLines: summary.invalidLineCount > 0,
    monitoringBlind: summary.totalEvents === 0,
    requiresAttention: (
      renderFallbackCount >= renderFallbackStopCount
      || errorCount >= errorStopCount
      || summary.invalidLineCount > 0
      || summary.totalEvents === 0
    ),
  };
}

function emptySummary(filePath, topLimit, options = {}) {
  const summary = {
    filePath,
    totalEvents: 0,
    invalidLineCount: 0,
    countsByStatus: {},
    countsByPrimaryTrack: {},
    errorCodeCounts: {},
    topNextQuestionKeys: [],
    topLimit,
  };

  return {
    ...summary,
    stopSignals: buildStopSignals(summary, options),
  };
}

function aggregateTelemetry(options = {}) {
  const filePath = options.filePath || path.join(process.cwd(), 'telemetry.ndjson');
  const fsImpl = options.fsImpl || fs;
  const topLimit = Number.isInteger(options.topLimit) ? options.topLimit : 5;

  let content;
  try {
    content = fsImpl.readFileSync(filePath, 'utf8');
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return emptySummary(filePath, topLimit, options);
    }
    throw error;
  }

  const countsByStatus = {};
  const countsByPrimaryTrack = {};
  const errorCodeCounts = {};
  const nextQuestionCounts = {};
  let totalEvents = 0;
  let invalidLineCount = 0;

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;

    let event;
    try {
      event = JSON.parse(line);
    } catch (error) {
      invalidLineCount += 1;
      continue;
    }

    totalEvents += 1;
    increment(countsByStatus, event.status);
    increment(countsByPrimaryTrack, event.primaryTrack);
    increment(errorCodeCounts, event.errorCode);
    increment(nextQuestionCounts, event.flowAbandonment?.nextQuestionKey);
  }

  const summary = {
    filePath,
    totalEvents,
    invalidLineCount,
    countsByStatus,
    countsByPrimaryTrack,
    errorCodeCounts,
    topNextQuestionKeys: sortCounts(nextQuestionCounts, topLimit),
    topLimit,
  };

  return {
    ...summary,
    stopSignals: buildStopSignals(summary, options),
  };
}

module.exports = {
  aggregateTelemetry,
  buildStopSignals,
};

if (require.main === module) {
  const summary = aggregateTelemetry({ filePath: process.argv[2] });
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}
