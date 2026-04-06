---
date: 2026-04-06
tags: [runbook, kuendigungs-kompass, telemetry, dev]
status: active
source: curated
---

# Kündigungs-Kompass — Dev-Telemetrie lokal prüfen

## Zweck
Lokal ohne UI/API-Anschluss prüfen, dass der Runtime-Event-Pfad tatsächlich in eine NDJSON-Datei schreibt und sich anschließend aggregieren lässt.

## Voraussetzungen
- im Projektordner arbeiten: `projects/kuendigungs-kompass-mvp/`
- Node verfügbar
- bestehende Testbasis grün

## 1. Eine frische Telemetrie-Datei anlegen
```bash
cd /Users/shashko/.openclaw/workspace/projects/kuendigungs-kompass-mvp
rm -f /tmp/kk-telemetry.ndjson
```

## 2. Beispiel-Fälle mit Dev-Hook laufen lassen
```bash
node src/demo.js examples/inputs/01-kuendigung-arbeitslosmeldung-offen.input.json base --telemetry-out /tmp/kk-telemetry.ndjson
node src/demo.js examples/inputs/05-kuendigung-nur-angekuendigt.input.json preview --telemetry-out /tmp/kk-telemetry.ndjson
```

Optional für einen `incomplete`-Fall:
```bash
node - <<'NODE'
const { buildQuestionnaireResultView } = require('./src/runtime/buildQuestionnaireResultView');
const { createFileTelemetrySink } = require('./src/runtime/telemetry/fileTelemetrySink');

const onEvent = createFileTelemetrySink({ filePath: '/tmp/kk-telemetry.ndjson' });
const view = buildQuestionnaireResultView({
  case_entry: 'termination_received',
  agreement_present: false,
  already_unemployed_now: false,
  release_status: 'no',
}, { tier: 'base', onEvent });

console.log(view.status);
NODE
```

## 3. Rohdatei prüfen
```bash
cat /tmp/kk-telemetry.ndjson
```

Erwartung:
- eine JSON-Zeile pro Event
- Felder wie `status`, `tier`, `primaryTrack`, `errorCode`, `flowAbandonment`
- keine personenbezogenen Inhalte

## 4. Aggregierte Sicht ziehen
```bash
node src/runtime/telemetry/aggregateTelemetry.js /tmp/kk-telemetry.ndjson
```

Erwartung im Summary-Output:
- `countsByStatus`
- `countsByPrimaryTrack`
- `topNextQuestionKeys`
- `errorCodeCounts`
- `invalidLineCount`

## 5. Wichtige Interpretationsregel
- viele `incomplete` mit demselben `nextQuestionKey` → wahrscheinlich Fragebogen-Reibung
- viele `render-fallback` → Rendering instabil
- viele `error` mit gleichem `errorCode` → Runtime-/Adapterproblem
- viele `special-case-review` → Sonderfallpfade und Eskalationskommunikation genauer beobachten

## Fehlertoleranz
- Wenn der File-Sink nicht schreiben kann, darf die Runtime trotzdem normal weiterlaufen.
- Wenn die NDJSON-Datei fehlt, liefert der Aggregator eine leere Summary statt eines Crashs.
- Ungültige Zeilen werden gezählt, aber nicht als Gesamtfehler behandelt.

## Relevante Dateien
- `src/demo.js`
- `src/runtime/telemetry/emitResultViewEvent.js`
- `src/runtime/telemetry/fileTelemetrySink.js`
- `src/runtime/telemetry/aggregateTelemetry.js`
- `test-runtime-telemetry.js`
