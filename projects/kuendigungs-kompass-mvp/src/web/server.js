const http = require('http');
const fs = require('fs');
const path = require('path');
const { buildQuestionnaireResultView } = require('../runtime/buildQuestionnaireResultView');
const { createFileTelemetrySink } = require('../runtime/telemetry/fileTelemetrySink');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const PUBLIC_DIR = path.join(__dirname, 'public');
const EXAMPLES_DIR = path.join(PROJECT_ROOT, 'examples', 'inputs');
const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 3090;
const MAX_BODY_BYTES = 256 * 1024;
const TIER_OPTIONS = ['preview', 'base', 'upgrade'];

const EXAMPLE_LABELS = {
  '01-kuendigung-arbeitslosmeldung-offen.input.json': 'Kündigung erhalten · Arbeitslosmeldung offen',
  '02-aufhebungsvertrag-nicht-unterschrieben.input.json': 'Aufhebungsvertrag angeboten · noch nicht unterschrieben',
  '03-kuendigung-sonderfall.input.json': 'Kündigung · möglicher Sonderfall',
  '04-vertrag-bereits-unterschrieben.input.json': 'Aufhebungsvertrag bereits unterschrieben',
  '05-kuendigung-nur-angekuendigt.input.json': 'Kündigung nur angekündigt',
  '06-mehrere-eingaenge-gleichzeitig.input.json': 'Mehrere Eingänge gleichzeitig',
  '07-angekuendigt-alg1-risiko.input.json': 'Angekündigte Beendigung · ALG-I-Risiko',
};

function isPlainObject(value) {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function parseArgs(argv = []) {
  const args = {
    host: DEFAULT_HOST,
    port: DEFAULT_PORT,
    telemetryOut: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1] || null;

    if (arg === '--host' && next) {
      args.host = next;
      index += 1;
      continue;
    }

    if (arg === '--port' && next) {
      args.port = Number.parseInt(next, 10) || DEFAULT_PORT;
      index += 1;
      continue;
    }

    if (arg === '--telemetry-out' && next) {
      args.telemetryOut = next;
      index += 1;
    }
  }

  return args;
}

function getContentType(filePath) {
  if (filePath.endsWith('.html')) return 'text/html; charset=utf-8';
  if (filePath.endsWith('.js')) return 'application/javascript; charset=utf-8';
  if (filePath.endsWith('.css')) return 'text/css; charset=utf-8';
  if (filePath.endsWith('.json')) return 'application/json; charset=utf-8';
  return 'text/plain; charset=utf-8';
}

function sendJson(response, statusCode, payload) {
  const body = JSON.stringify(payload, null, 2);
  response.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  });
  response.end(body);
}

function sendText(response, statusCode, text) {
  response.writeHead(statusCode, {
    'content-type': 'text/plain; charset=utf-8',
    'cache-control': 'no-store',
  });
  response.end(text);
}

function sendFile(response, filePath) {
  try {
    const body = fs.readFileSync(filePath);
    response.writeHead(200, {
      'content-type': getContentType(filePath),
      'cache-control': 'no-store',
    });
    response.end(body);
  } catch (error) {
    sendText(response, 404, 'Not found');
  }
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;

    request.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error('Request body too large.'));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });

    request.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8').trim();
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(new Error('Invalid JSON body.'));
      }
    });

    request.on('error', reject);
  });
}

function buildExampleCases() {
  if (!fs.existsSync(EXAMPLES_DIR)) return [];

  return fs.readdirSync(EXAMPLES_DIR)
    .filter((fileName) => fileName.endsWith('.json'))
    .sort()
    .map((fileName) => {
      const absolute = path.join(EXAMPLES_DIR, fileName);
      const answers = JSON.parse(fs.readFileSync(absolute, 'utf8'));

      return {
        id: fileName.replace(/\.input\.json$/, ''),
        label: EXAMPLE_LABELS[fileName] || fileName,
        fileName,
        answers,
      };
    });
}

function buildViewPayload(body = {}, onEvent) {
  const answers = isPlainObject(body.answers) ? body.answers : {};
  const tier = typeof body.tier === 'string' ? body.tier : 'base';
  return buildQuestionnaireResultView(answers, { tier, onEvent });
}

function buildBootstrapPayload(onEvent) {
  return {
    app: {
      name: 'Kündigungs-Kompass',
      subtitle: 'Vorzeigbarer Launch-V1-Webcaller auf dem echten Runtime-Pfad',
    },
    defaultTier: 'base',
    tierOptions: TIER_OPTIONS,
    initialView: buildQuestionnaireResultView({}, { tier: 'base', onEvent }),
    examples: buildExampleCases(),
  };
}

function createTelemetrySink(telemetryOut) {
  if (!telemetryOut) return undefined;
  return createFileTelemetrySink({
    filePath: path.resolve(PROJECT_ROOT, telemetryOut),
  });
}

function createWebServer(options = {}) {
  const onEvent = options.onEvent;

  return http.createServer(async (request, response) => {
    const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
    const pathname = url.pathname;

    if (request.method === 'GET' && pathname === '/healthz') {
      sendJson(response, 200, { ok: true });
      return;
    }

    if (request.method === 'GET' && pathname === '/api/bootstrap') {
      sendJson(response, 200, buildBootstrapPayload(onEvent));
      return;
    }

    if (request.method === 'POST' && pathname === '/api/view') {
      try {
        const body = await readRequestBody(request);
        sendJson(response, 200, buildViewPayload(body, onEvent));
      } catch (error) {
        sendJson(response, 400, {
          status: 'error',
          error: {
            code: 'bad_request',
            message: error.message,
          },
        });
      }
      return;
    }

    if (request.method === 'GET' && (pathname === '/' || pathname === '/index.html')) {
      sendFile(response, path.join(PUBLIC_DIR, 'index.html'));
      return;
    }

    if (request.method === 'GET' && (pathname === '/app.js' || pathname === '/styles.css')) {
      const safePath = pathname.replace(/^\//, '');
      sendFile(response, path.join(PUBLIC_DIR, safePath));
      return;
    }

    sendText(response, 404, 'Not found');
  });
}

if (require.main === module) {
  const { host, port, telemetryOut } = parseArgs(process.argv.slice(2));
  const onEvent = createTelemetrySink(telemetryOut);
  const server = createWebServer({ onEvent });

  server.listen(port, host, () => {
    console.log(`Kündigungs-Kompass Web läuft auf http://${host}:${port}`);
    if (telemetryOut) {
      console.log(`Telemetrie schreibt nach ${path.resolve(PROJECT_ROOT, telemetryOut)}`);
    }
  });
}

module.exports = {
  DEFAULT_HOST,
  DEFAULT_PORT,
  buildBootstrapPayload,
  buildExampleCases,
  buildViewPayload,
  createTelemetrySink,
  createWebServer,
  parseArgs,
};
