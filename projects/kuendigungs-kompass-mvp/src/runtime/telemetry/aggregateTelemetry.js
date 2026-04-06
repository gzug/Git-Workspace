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

function emptySummary(filePath, topLimit) {
  return {
    filePath,
    totalEvents: 0,
    invalidLineCount: 0,
    countsByStatus: {},
    countsByPrimaryTrack: {},
    errorCodeCounts: {},
    topNextQuestionKeys: [],
    topLimit,
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
      return emptySummary(filePath, topLimit);
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

  return {
    filePath,
    totalEvents,
    invalidLineCount,
    countsByStatus,
    countsByPrimaryTrack,
    errorCodeCounts,
    topNextQuestionKeys: sortCounts(nextQuestionCounts, topLimit),
    topLimit,
  };
}

module.exports = {
  aggregateTelemetry,
};

if (require.main === module) {
  const summary = aggregateTelemetry({ filePath: process.argv[2] });
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}
