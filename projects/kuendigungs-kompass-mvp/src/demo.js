const fs = require('fs');
const path = require('path');
const { buildResult, renderResult } = require('./engine');
const { getQuestionnaireFlowState } = require('./flow/questionnaireFlow');

const inputFile = process.argv[2];
if (!inputFile) {
  console.error('Usage: node src/demo.js <input-json-path>');
  process.exit(1);
}

const absolute = path.resolve(process.cwd(), inputFile);
const input = JSON.parse(fs.readFileSync(absolute, 'utf8'));
const flowState = getQuestionnaireFlowState(input);
const result = buildResult(input);

console.log(JSON.stringify({ flowState, result }, null, 2));
console.log('\n---\n');
console.log(renderResult(result, 'standard'));
