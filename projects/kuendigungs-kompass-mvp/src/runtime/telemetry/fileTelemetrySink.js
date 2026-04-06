const fs = require('fs');
const path = require('path');
const { buildResultViewEvent } = require('./emitResultViewEvent');

function createFileTelemetrySink(options = {}) {
  const filePath = options.filePath || path.join(process.cwd(), 'telemetry.ndjson');
  const fsImpl = options.fsImpl || fs;

  return function fileTelemetrySink(viewOrEvent) {
    try {
      const event = buildResultViewEvent(viewOrEvent);
      fsImpl.mkdirSync(path.dirname(filePath), { recursive: true });
      fsImpl.appendFileSync(filePath, `${JSON.stringify(event)}\n`, 'utf8');
      return true;
    } catch (error) {
      return false;
    }
  };
}

module.exports = {
  createFileTelemetrySink,
};
