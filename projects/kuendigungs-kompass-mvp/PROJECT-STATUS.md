# Kündigungs-Kompass MVP — Projektstatus

Stand: 2026-04-05
Status: aktiv

## Kurzstatus
Der Kündigungs-Kompass ist kein loses Konzept mehr, sondern ein **testbarer Runtime-Pfad** mit:
- stabilisierter Kernlogik
- Ergebnis-Views
- Produktstufen (`preview`, `base`, `upgrade`)
- Fallback-Zuständen (`ready`, `incomplete`, `render-fallback`, `error`)
- 6 Fixture-Paaren
- ersten textuellen Render-Snapshots
- Launch-Hardening-Artefakten

**Blöcke 1–3** (Core Stabilization, Product Output, Integration) sind im Wesentlichen erledigt.
**Aktiver Schwerpunkt ist Block 4: Launch Hardening.**

## Aktiver Fokus
1. KSchG-Wochenendlogik und konservative Feiertagshinweise sauber in Engine, Doku und Fixtures ziehen
2. Arbeitslosmeldung vs. Arbeitsuchendmeldung logisch und sprachlich final trennen
3. Snapshot-/Drift-Abdeckung gezielt auf repräsentative Fälle ausbauen
4. Sonderfall-/Pflichtfeld-/Unknown-Logik nachschärfen
5. Typed-Input-Guardrails gegen falsches `ready` absichern
6. Erst danach UI/API- und Soft-Launch-Schicht weiterziehen

## Größte aktuelle Risiken
- Drift zwischen Research, Doku, Fixtures und Runtime
- Scheingenauigkeit bei Fristen, KSchG-Aussagen, Sperrzeit, Abfindung oder Erfolgsaussagen
- zu breite Ausdehnung vor sauberer Launch-Härtung
- Happy-Path-Gefühl statt belastbarer Routing-/Fallback-/Guardrail-Reife

## Was bereits belastbar steht
### Core / Stabilität
- Mini-Testkonzept steht
- alle 6 Fixture-Paare im Testlauf
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
- `E2E-REALITY-CHECK-V1.md`
- `MONITORING-ANALYTICS-V1.md`
- `SOFT-LAUNCH-CHECKLIST-V1.md`
- telemetry-taugliche Summary-Felder im Runtime-Layer
- erste Render-Snapshots für den Mehrfachfall
- `test-launch-hardening-anchors.js` sichert jetzt 9 zentrale Drift-Anker: Wochenend-Klagefrist, Agentur-Meldungs-Trennung, `incomplete` statt falschem `ready`, Typed-Input-Guardrails gegen ungültige Datums-/Bool-Werte, widerspruchsarme Multi-Select-Normalisierung (`none_known` / `none_yet`), Cross-Field-Guardrails für angekündigte Kündigung ohne echte Zugangsfrist, konsistente Vertragsflags bei bereits unterschriebenem Vertrag, Neutralisierung irrelevanter Arbeitslosmeldungs-Flags außerhalb echter Arbeitslosigkeit sowie kein falscher Klagefrist-Pfad in reinen Vertragsfällen

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
1. `projects/kuendigungs-kompass-mvp/EXECUTION-BOARD.md`
2. `projects/kuendigungs-kompass-mvp/PROJECT-STATUS.md`
3. `projects/kuendigungs-kompass-mvp/DOC-STRUCTURE-NOTES.md`
4. `projects/kuendigungs-kompass-mvp/EXECUTION-PLAN-2026-04-05.md`
5. `projects/kuendigungs-kompass-mvp/DATE-LOGIC-MVP.md`
6. `projects/kuendigungs-kompass-mvp/SNAPSHOT-ANCHORS-V1.md`
7. `projects/kuendigungs-kompass-mvp/LAUNCH-HARDENING-V1.md`
8. danach gezielt betroffene Projektdateien oder Runtime-Dateien

## Kurzfazit
Das Projekt ist fachlich und technisch weit genug, dass nicht neue Feature-Fläche der Engpass ist, sondern **Drift-Kontrolle, Guardrails und Launch-Reife**.
