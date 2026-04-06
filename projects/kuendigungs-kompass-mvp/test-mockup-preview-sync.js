const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const ROOT = __dirname;
const MOCKUP_PATH = path.join(ROOT, 'mockup/static-result-mockup.html');
const SNAPSHOT_DIR = path.join(ROOT, 'examples/render-snapshots');

function extractDataObject(html) {
  const match = html.match(/const DATA = (\{[\s\S]*?\n    \};)\n\n    const CASE_ORDER =/);
  if (!match) {
    throw new Error('Could not extract DATA object from static-result-mockup.html');
  }

  const script = `${match[0].replace(/\n\n    const CASE_ORDER =[\s\S]*$/, '')}\nDATA;`;
  return vm.runInNewContext(script, {});
}

function readText(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8').trim();
}

function run() {
  const html = fs.readFileSync(MOCKUP_PATH, 'utf8');
  const data = extractDataObject(html);

  const cases = [
    {
      mockupId: 'announced',
      snapshot: '05-kuendigung-nur-angekuendigt.preview.txt',
    },
    {
      mockupId: 'signed',
      snapshot: '04-vertrag-bereits-unterschrieben.preview.txt',
    },
    {
      mockupId: 'mixed',
      snapshot: '06-mehrere-eingaenge-gleichzeitig.preview.txt',
    },
  ];

  for (const testCase of cases) {
    const mockupCase = data[testCase.mockupId];
    assert.ok(mockupCase, `Missing mockup case: ${testCase.mockupId}`);
    assert.ok(Array.isArray(mockupCase.preview), `Mockup preview must be an array for ${testCase.mockupId}`);

    const mockupPreview = mockupCase.preview.join('\n').trim();
    const snapshotPreview = readText(path.join('examples/render-snapshots', testCase.snapshot));

    assert.equal(
      mockupPreview,
      snapshotPreview,
      `Mockup preview drift for ${testCase.mockupId} (${testCase.snapshot})`,
    );
  }

  console.log('Static mockup preview sync tests passed.');
}

run();
