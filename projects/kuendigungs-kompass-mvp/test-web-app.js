const assert = require('assert');
const path = require('path');
const fs = require('fs');
const { createWebServer } = require('./src/web/server');

async function run() {
  const server = createWebServer();

  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });

  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    const healthResponse = await fetch(`${baseUrl}/healthz`);
    assert.strictEqual(healthResponse.status, 200);

    const bootstrapResponse = await fetch(`${baseUrl}/api/bootstrap`);
    assert.strictEqual(bootstrapResponse.status, 200);
    const bootstrap = await bootstrapResponse.json();

    assert.strictEqual(bootstrap.defaultTier, 'base');
    assert.strictEqual(bootstrap.initialView.status, 'incomplete');
    assert.strictEqual(bootstrap.initialView.flowState.nextScreen.id, 'entry');
    assert.ok(Array.isArray(bootstrap.examples));
    assert.ok(bootstrap.examples.length >= 7);

    const exampleInputPath = path.join(__dirname, 'examples', 'inputs', '01-kuendigung-arbeitslosmeldung-offen.input.json');
    const exampleInput = JSON.parse(fs.readFileSync(exampleInputPath, 'utf8'));

    const viewResponse = await fetch(`${baseUrl}/api/view`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        tier: 'base',
        answers: exampleInput,
      }),
    });

    assert.strictEqual(viewResponse.status, 200);
    const readyView = await viewResponse.json();
    assert.strictEqual(readyView.status, 'ready');
    assert.strictEqual(readyView.tier, 'base');
    assert.ok(readyView.rendered.includes('Als Erstes:'));

    const htmlResponse = await fetch(`${baseUrl}/`);
    assert.strictEqual(htmlResponse.status, 200);
    const html = await htmlResponse.text();
    assert.ok(html.includes('Kündigungs-Kompass'));

    console.log('Web app smoke tests passed.');
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
