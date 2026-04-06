const fs = require('fs');
const path = require('path');
const { buildQuestionnaireResultView } = require('./runtime/buildQuestionnaireResultView');
const { createFileTelemetrySink } = require('./runtime/telemetry/fileTelemetrySink');

function parseArgs(argv = []) {
  const positionals = [];
  let telemetryOut = null;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--telemetry-out') {
      telemetryOut = argv[index + 1] || null;
      index += 1;
      continue;
    }

    positionals.push(arg);
  }

  return {
    inputFile: positionals[0] || null,
    requestedTier: positionals[1] || 'base',
    telemetryOut,
  };
}

const { inputFile, requestedTier, telemetryOut } = parseArgs(process.argv.slice(2));

if (!inputFile) {
  console.error('Usage: node src/demo.js <input-json-path> [preview|base|upgrade] [--telemetry-out <path>]');
  process.exit(1);
}

const absolute = path.resolve(process.cwd(), inputFile);
const input = JSON.parse(fs.readFileSync(absolute, 'utf8'));
const onEvent = telemetryOut
  ? createFileTelemetrySink({ filePath: path.resolve(process.cwd(), telemetryOut) })
  : undefined;
const view = buildQuestionnaireResultView(input, { tier: requestedTier, onEvent });

console.log(JSON.stringify(view, null, 2));

if (view.rendered) {
  console.log('\n---\n');
  console.log(view.rendered);
}

if (telemetryOut) {
  console.error(`Telemetry appended to ${path.resolve(process.cwd(), telemetryOut)}`);
}
