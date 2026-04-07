# Kündigungs-Kompass — Projektstatus

Stand: 2026-04-06
Status: aktiv

## Kurzstatus
Der Kündigungs-Kompass ist kein loses Konzept mehr, sondern ein **testbarer Runtime-Pfad** mit:
- stabilisierter Kernlogik
- Ergebnis-Views
- Produktstufen (`preview`, `base`, `upgrade`)
- Fallback-Zuständen (`ready`, `incomplete`, `render-fallback`, `error`)
- 7 Fixture-Paaren
- ersten textuellen Render-Snapshots
- Launch-Hardening-Artefakten

**Blöcke 1–3** (Core Stabilization, Product Output, Integration) sind im Wesentlichen erledigt.
**Aktiver Schwerpunkt ist Block 4: Launch Hardening.**

## Aktiver Fokus
1. Launch-Hardening-Go/No-Go jetzt gegen explizite Exit-Kriterien statt Bauchgefühl fahren (`LAUNCH-HARDENING-DONE.md`)
2. Drift zwischen Runtime, Fixtures, Snapshots, Mockup und Steuerdoku weiter klein halten
3. Monitoring-/Telemetry-Felder für den späteren UI/API-Anschluss andockbar halten
4. UI/API-Caller bis auf Weiteres bewusst dünn halten: direkter Aufruf von `buildQuestionnaireResultView(..., { onEvent })`, kein zusätzlicher Systemlayer auf Verdacht

## Größte aktuelle Risiken
- Drift zwischen Research, Doku, Fixtures und Runtime
- Scheingenauigkeit bei Fristen, KSchG-Aussagen, Sperrzeit, Abfindung oder Erfolgsaussagen
- zu breite Ausdehnung vor sauberer Launch-Härtung
- Happy-Path-Gefühl statt belastbarer Routing-/Fallback-/Guardrail-Reife

## Was bereits belastbar steht
### Core / Stabilität
- Mini-Testkonzept steht
- alle 7 Fixture-Paare im Testlauf
- Mehrfachfall (`06-mehrere-eingaenge-gleichzeitig`) in Engine und Tests nachgeschärft
- Render-Assertions für `short`, `standard`, `advice`
- erste Datumslogik eingebaut
- Doku ↔ Runtime mehrfach synchronisiert

### Produkt / Output
- Ergebnisstruktur V1 steht
- Copy-Layer geschärft
- Preview / Base / Upgrade klarer getrennt
- Basisinfos sollen vollständig handlungsfähig bleiben; Tiefe/Werkzeuge sind Upgrade-Material

### Integration
- Input-Adapter gebaut
- Output-Adapter gebaut
- Fragebogen-Flow implementiert
- Ergebnisansicht implementiert
- Fallback-/Fehlerverhalten vorhanden
- `src/runtime/buildQuestionnaireResultView.js` verbindet Flow → Normalisierung → Engine → Tier-Projektion → Rendering
- neuer dünner lokaler Webcaller vorhanden: `src/web/server.js` + `src/web/public/*`
- die Web-Version nutzt bewusst keinen zusätzlichen Systemlayer, sondern ruft direkt den bestehenden Runtime-Entry auf
- Demo-Fälle aus `examples/inputs/` sind direkt in der Web-Oberfläche ladbar
- Web-Caller-UX für Launch-Hardening weiter geschärft: `incomplete` zeigt jetzt fehlende Pflichtangaben explizit mit Sprung-CTA; `render-fallback` wird sichtbar als nutzbarer Struktur-Fallback markiert statt still wie `ready` auszusehen
- zusätzlicher ruhiger Vertrauens-/Orientierungsblock im Web-Caller vorhanden: klare Einordnung der ersten Website-Version, lokaler Datenhaltung, Quellenprinzip und neutraler Platzhalter-Footer statt erfundener Vertrauenssignale
- Web-Härtungstests gehen jetzt über Smoke hinaus: `test-web-app.js` prüft zusätzlich einen synthetischen `render-fallback`-API-Pfad, den `bad_request`-Pfad bei kaputtem JSON und die neuen Vertrauens-/Footer-Blöcke in der ausgelieferten HTML-Datei

### Launch Hardening
- `LAUNCH-HARDENING-V1.md`
- `LAUNCH-HARDENING-DONE.md`
- `E2E-REALITY-CHECK-V1.md`
- `MONITORING-ANALYTICS-V1.md`
- `SOFT-LAUNCH-CHECKLIST-V1.md`
- telemetry-taugliche Summary-Felder im Runtime-Layer
- kanonischer Runtime-Emissionspunkt vorhanden: `buildQuestionnaireResultView(..., { onEvent })` emittiert jetzt pro View genau ein strukturiertes `questionnaire_result_view_built`-Event
- dünner V1-Telemetrie-Anschluss liegt jetzt außerhalb des Runtime-Cores: `src/runtime/telemetry/emitResultViewEvent.js`, `fileTelemetrySink.js`, `aggregateTelemetry.js`
- kleinster Dev-Hook dafür ist jetzt real nutzbar: `src/demo.js --telemetry-out <path>`; lokales Prüf-Runbook liegt unter `vault/runbooks/kk-telemetry-dev.md`
- zusätzlich existiert jetzt ein echter dünner lokaler Web-Caller: `src/web/server.js --port 3090 [--telemetry-out <path>]`
- der Web-Caller nutzt denselben Runtime-Entry, zeigt die echten Flow-Screens, rendert strukturierte Ergebnisse und kann Demo-Fälle direkt laden
- `test-web-app.js` prüft Bootstrap, API-View und statische Web-Auslieferung als Smoke-Test
- `aggregateTelemetry.js` liefert jetzt zusätzlich minimale `stopSignals` (`repeatedRenderFallback`, `errorsPresent`, `invalidTelemetryLines`, `monitoringBlind`, `requiresAttention`) statt Stop-/Rollback-Hinweise nur implizit in Rohzählungen zu verstecken
- `INTEGRATION-CONTRACT-V1.md` ist jetzt auf den aktuellen Runtime-/Telemetry-Stand gezogen; V1-Entscheid: künftiger UI/API-Anschluss bleibt ein dünner Adapter über `buildQuestionnaireResultView(..., { onEvent })`, ohne neuen äußeren Systemlayer
- `incomplete` trägt zusätzlich anonymen Flow-Abbruchkontext (`lastQuestionKey`, `nextQuestionKey`, `trackContext`, `hadRedFlag`, `hadKnownDeadlineDate`) für Soft-Launch-Monitoring
- sichtbarer Output für Kernfälle weiter geschärft: action-orientierte Agentur-Labels, scanbarere Preview-Fristen, klarere angekündigt-Kündigung-Headline, `Besonders wichtig` vor `Risiken`
- statisches Sicht-Mockup für Ergebnisprüfung vorhanden: `mockup/static-result-mockup.html`
- die drei im Mockup gezeigten Preview-Fälle (`announced`, `signed`, `mixed`) sind jetzt zusätzlich gegen die echten Render-Snapshots abgesichert: `test-mockup-preview-sync.js`
- der Base-Mockup-Fall `announced` ist nachgezogen und jetzt ebenfalls gegen den echten Base-Snapshot abgesichert: `test-mockup-base-announced-sync.js`
- der Base-Mockup-Fall `signed` ist jetzt ebenfalls auf Snapshot-Stand gezogen und testlich abgesichert: `test-mockup-base-signed-sync.js`
- der Base-Mockup-Fall `mixed` ist jetzt ebenfalls auf Snapshot-Stand gezogen und testlich abgesichert: `test-mockup-base-mixed-sync.js`
- `alg1-risk-first` ist jetzt als echter Pfad der ersten Version abgesichert: angekündigte Beendigung + ALG-I-Fokus rendert nicht mehr still in `prepare-advice`, sondern als eigener Track mit Fixture- und Snapshot-Abdeckung
- `test-launch-hardening-anchors.js` sichert 11 zentrale Drift-Anker
- `test-launch-hardening-done.js` bündelt die Exit-Gate-Prüfung über Regressionssicherheit, Observability und UI-Konsistenz

## Inhaltlich stabile Entscheidungen
Diese Punkte nicht leichtfertig wieder aufreißen:
- deadline-first / risk-first statt feature-lastig
- keine Scheinsicherheit bei Wirksamkeit, Abfindung, Sperrzeit oder Klageerfolg
- ohne schriftliche Kündigung keine künstliche 3-Wochen-Panik
- Sonderfälle eskalieren statt weichzeichnen
- Basis muss vollständig handlungsfähig bleiben; Risiko-/Eskalationshinweise nie hinter Upgrade
- Track-Explosion vermeiden; nur echte Routing-Unterschiede rechtfertigen neue Tracks

## Nächster sinnvoller Hebel
Nicht wieder breit konzipieren.
Der nächste Hebel ist **konservative Launch-Härtung**:
- Routing robuster
- Fristen konservativer
- Snapshots gezielter
- Guardrails schärfer

## Wiedereinstieg: zuerst lesen
1. `projects/kuendigungs-kompass-mvp/PROJECT-STATUS.md`
2. `projects/kuendigungs-kompass-mvp/EXECUTION-BOARD.md`
3. danach nur blockrelevante Dateien, aktuell vor allem:
   - `projects/kuendigungs-kompass-mvp/INTEGRATION-CONTRACT-V1.md`
   - `projects/kuendigungs-kompass-mvp/DATE-LOGIC-MVP.md`
   - `projects/kuendigungs-kompass-mvp/SNAPSHOT-ANCHORS-V1.md`
   - `projects/kuendigungs-kompass-mvp/MONITORING-ANALYTICS-V1.md`
   - `projects/kuendigungs-kompass-mvp/LAUNCH-HARDENING-V1.md`
4. `README.md` ist nur Intro; `HANDOFF-COMPACT-2026-03-22.md` ist historischer Kontext, kein Pflicht-Einstieg
5. Führender Copy-Stand im Root ist jetzt `RESULT-COPY-V2.md`; der ältere Copy-Stand liegt nur noch unter `archive/review-docs/`

## Kurzfazit
Das Projekt ist fachlich und technisch weit genug, dass nicht neue Feature-Fläche der Engpass ist, sondern **Drift-Kontrolle, Guardrails und Launch-Reife**.
