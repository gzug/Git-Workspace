const assert = require('assert');
const path = require('path');
const fs = require('fs');
const { createWebServer } = require('./src/web/server');

async function withServer(server, fn) {
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });

  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    await fn(baseUrl);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

async function runSmokeFlow() {
  await withServer(createWebServer(), async (baseUrl) => {
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
    assert.ok(html.includes('Demo-Fälle'));
    assert.ok(html.includes('Wofür diese erste Website-Version gedacht ist'));
    assert.ok(html.includes('Quellenprinzip'));
    assert.ok(html.includes('Impressum · Platzhalter'));
  });
}

async function runHardeningPaths() {
  await withServer(createWebServer({
    buildViewPayloadFn() {
      return {
        status: 'render-fallback',
        tier: 'base',
        requestedTier: 'base',
        warnings: ['Render failed for tier "base". Structured result kept as fallback.'],
        projected: {
          caseSnapshot: {
            headline: 'Fallback bleibt nutzbar',
            situation: 'Die strukturierte Auswertung ist trotz fehlender Textansicht vorhanden.',
          },
          topAction: {
            label: 'Sofort Fristen prüfen',
            why: 'Der heikle Pfad darf nicht nur als Fehler enden.',
          },
          topActions: [
            {
              label: 'Sofort Fristen prüfen',
              why: 'Der heikle Pfad darf nicht nur als Fehler enden.',
            },
          ],
          deadlines: [],
          redFlags: [],
          riskFlags: [],
          documentChecklist: [],
          advisorQuestions: [],
          opportunities: [],
          disclaimers: [],
        },
        rendered: null,
        error: {
          code: 'render_failed',
          message: 'synthetic render failure',
        },
        telemetry: {
          status: 'render-fallback',
          errorCode: 'render_failed',
        },
      };
    },
  }), async (baseUrl) => {
    const fallbackResponse = await fetch(`${baseUrl}/api/view`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ tier: 'base', answers: {} }),
    });

    assert.strictEqual(fallbackResponse.status, 200);
    const fallbackView = await fallbackResponse.json();
    assert.strictEqual(fallbackView.status, 'render-fallback');
    assert.strictEqual(fallbackView.error.code, 'render_failed');
    assert.strictEqual(fallbackView.rendered, null);
    assert.strictEqual(fallbackView.projected.topAction.label, 'Sofort Fristen prüfen');

    const invalidJsonResponse = await fetch(`${baseUrl}/api/view`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: '{invalid',
    });

    assert.strictEqual(invalidJsonResponse.status, 400);
    const invalidJsonPayload = await invalidJsonResponse.json();
    assert.strictEqual(invalidJsonPayload.status, 'error');
    assert.strictEqual(invalidJsonPayload.error.code, 'bad_request');
    assert.ok(invalidJsonPayload.error.message.includes('Invalid JSON body'));
  });
}

async function run() {
  await runSmokeFlow();
  await runHardeningPaths();
  console.log('Web app tests passed.');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
