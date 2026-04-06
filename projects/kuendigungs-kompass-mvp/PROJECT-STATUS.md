# Kündigungs-Kompass MVP — Projektstatus

Stand: 2026-04-05
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
4. Erst danach echten UI/API- und Soft-Launch-Anschluss weiterziehen

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
- `incomplete` trägt zusätzlich anonymen Flow-Abbruchkontext (`lastQuestionKey`, `nextQuestionKey`, `trackContext`, `hadRedFlag`, `hadKnownDeadlineDate`) für Soft-Launch-Monitoring
- sichtbarer Output für Kernfälle weiter geschärft: action-orientierte Agentur-Labels, scanbarere Preview-Fristen, klarere angekündigt-Kündigung-Headline, `Besonders wichtig` vor `Risiken`
- statisches Sicht-Mockup für Ergebnisprüfung vorhanden: `mockup/static-result-mockup.html`
- `alg1-risk-first` ist jetzt als echter MVP-Pfad abgesichert: angekündigte Beendigung + ALG-I-Fokus rendert nicht mehr still in `prepare-advice`, sondern als eigener Track mit Fixture- und Snapshot-Abdeckung
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
   - `projects/kuendigungs-kompass-mvp/DATE-LOGIC-MVP.md`
   - `projects/kuendigungs-kompass-mvp/SNAPSHOT-ANCHORS-V1.md`
   - `projects/kuendigungs-kompass-mvp/MONITORING-ANALYTICS-V1.md`
   - `projects/kuendigungs-kompass-mvp/LAUNCH-HARDENING-V1.md`
4. `README.md` ist nur Intro; `HANDOFF-COMPACT-2026-03-22.md` ist historischer Kontext, kein Pflicht-Einstieg
5. Führender Copy-Stand im Root ist jetzt `RESULT-COPY-V2.md`; der ältere Copy-Stand liegt nur noch unter `archive/review-docs/`

## Kurzfazit
Das Projekt ist fachlich und technisch weit genug, dass nicht neue Feature-Fläche der Engpass ist, sondern **Drift-Kontrolle, Guardrails und Launch-Reife**.
