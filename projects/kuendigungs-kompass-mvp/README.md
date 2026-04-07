# Kündigungs-Kompass

Der Kündigungs-Kompass ist die erste Version für Menschen in Deutschland nach **Kündigung** oder bei **Aufhebungsvertrag**.
Er soll **Fristen priorisieren, typische Fehler vermeiden, Risiken sichtbar machen und nächste Schritte ordnen** — ohne Rechtsberatung zu simulieren.

## Aktueller Stand
Das Projekt hat bereits einen echten Runtime-Pfad:

```text
Fragebogen-Flow
→ Input-Normalisierung
→ Engine / Regel- und Priorisierungslogik
→ Projektion nach Produktstufe
→ Rendering zur Ergebnisansicht
```

Die operative Ergebnisansicht läuft über:
- `src/runtime/buildQuestionnaireResultView.js`

Der Runtime-Layer kennt kontrollierte Zustände wie:
- `ready`
- `incomplete`
- `render-fallback`
- `error`

## Produktprinzipien
Die erste Version soll:
- Sofortmaßnahmen sichtbar machen
- kritische Fristen priorisieren
- Scheingenauigkeit vermeiden
- Sonderfälle eskalieren statt weichzeichnen
- Beratung vorbereiten, aber nicht ersetzen

Die erste Version soll **nicht**:
- Rechtsberatung simulieren
- Wirksamkeit oder Klageerfolg prognostizieren
- Abfindung oder ALG-Höhe scheingenau berechnen
- in Conversion-/Feature-Fläche ausufern

## Produktstufen
- **Preview** → Orientierung + Blockstruktur + erste konkrete Sofortmaßnahme
- **Base** → vollständige handlungsfähige Basis-Auswertung
- **Upgrade** → Tiefe, Werkzeuge, Verhandlungshilfe, Export, spätere Zusatzhilfen

Wichtig:
- Alle gesetzlichen Fristen, primären To-dos und Risiko-/Eskalationshinweise bleiben in der Basis.
- Upgrade ergänzt Tiefe und Werkzeuge; es ersetzt keine Basis-Information.

## Projektstruktur
### Zentrale Projektdateien
- `EXECUTION-BOARD.md` → aktiver Arbeitsfokus, Risiken, Delegation, Waiting
- `PROJECT-STATUS.md` → kuratierter Gesamtstatus
- `FLOW-CONTRACT-V1.md` → Flow- und Fragebogenlogik
- `INTEGRATION-CONTRACT-V1.md` → aktueller Runtime-/Hook-Vertrag für den dünnen UI/API-Anschluss
- `DATE-LOGIC-MVP.md` → Datums- und Fristenlogik
- `LAUNCH-HARDENING-V1.md` → Launch-Härtung
- `E2E-REALITY-CHECK-V1.md` → Pflichtfälle / Reality Check
- `MONITORING-ANALYTICS-V1.md` → Monitoring-Minimum
- `SOFT-LAUNCH-CHECKLIST-V1.md` → Go/No-Go / Rollback
- `vault/runbooks/kk-telemetry-dev.md` → lokaler Dev-Hook + Auswertung für Telemetrie ohne UI/API-Anschluss

### Technische Kernbereiche
- `src/runtime/`
- `src/adapters/`
- `src/engine/`
- `src/flow/`
- `src/web/` → dünner lokaler Webcaller (`server.js` + statische UI unter `public/`)

## Lokale Web-Version starten
Für eine vorzeigbare nutzbare lokale Web-Version:

```bash
cd projects/kuendigungs-kompass-mvp
node src/web/server.js --port 3090
```

Dann im Browser öffnen:
- `http://127.0.0.1:3090`

Optional mit Telemetrie-Datei:

```bash
node src/web/server.js --port 3090 --telemetry-out tmp/web-telemetry.ndjson
```

Die Web-Version bleibt bewusst dünn:
- ruft direkt `buildQuestionnaireResultView(...)` auf
- zeigt die echten Flow-Screens
- rendert die strukturierten Ergebnisdaten für `preview` / `base` / `upgrade`
- lädt Demo-Fälle aus `examples/inputs/`
- markiert `render-fallback` explizit als weiter nutzbaren Struktur-Fallback
- zeigt bei `incomplete` die konkret fehlenden Pflichtangaben statt nur einen generischen Stopp-Zustand

### Prüfbasis
- `examples/PAIRS.md`
- `examples/inputs/`
- `examples/render-snapshots/`
- `test-fixtures.js`
- `test-normalize-input.js`
- `test-product-tiers.js`
- `test-render-product-tiers.js`
- `test-questionnaire-flow.js`
- `test-questionnaire-result-view.js`
- `test-launch-hardening-anchors.js`
- `test-launch-hardening-done.js`
- `test-runtime-telemetry.js`

## Aktueller Engpass
Nicht neue Features.
Der aktuelle Engpass ist **Launch Hardening**:
- Exit-Kriterien explizit gegen Go/No-Go-Gate prüfen
- Snapshot-/Drift-Abdeckung und Steuerdoku synchron halten
- Monitoring-/Telemetry-Anschluss für den späteren UI/API-Pfad sauber halten
- den UI/API-Caller bis auf Weiteres bewusst dünn halten: direkter Runtime-Aufruf plus optionaler `onEvent`-Hook, kein zusätzlicher Systemlayer auf Verdacht

## Wiedereinstieg
Kanonischer Einstieg: **`PROJECT-STATUS.md`**.

Wenn du neu oder nach Pause ins Projekt gehst, lies in dieser Reihenfolge:
1. `PROJECT-STATUS.md`
2. `EXECUTION-BOARD.md`
3. danach nur die für den aktuellen Block relevanten Dateien, z. B. `INTEGRATION-CONTRACT-V1.md`, `DATE-LOGIC-MVP.md`, `RESULT-MAPPING.md`, `MONITORING-ANALYTICS-V1.md`

`README.md` ist nur das kurze Projekt-Intro, nicht die führende Steuerdatei.

## Leitgedanke
Der Kündigungs-Kompass ist nur dann launch-reif, wenn **Routing, Guardrails, Fallbacks und Fristenlogik belastbar sind** — nicht schon dann, wenn der Happy Path hübsch aussieht.
