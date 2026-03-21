const fs = require('fs');
const path = require('path');
const { buildQuestionnaireResultView } = require('./runtime/buildQuestionnaireResultView');

const inputFile = process.argv[2];
const requestedTier = process.argv[3] || 'base';

if (!inputFile) {
  console.error('Usage: node src/demo.js <input-json-path> [preview|base|upgrade]');
  process.exit(1);
}

const absolute = path.resolve(process.cwd(), inputFile);
const input = JSON.parse(fs.readFileSync(absolute, 'utf8'));
const view = buildQuestionnaireResultView(input, { tier: requestedTier });

console.log(JSON.stringify(view, null, 2));

if (view.rendered) {
  console.log('\n---\n');
  console.log(view.rendered);
}
