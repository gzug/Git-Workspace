# Kündigungs-Kompass MVP — Projektstatus

Stand: 2026-03-21

## Wo wir gerade stehen

Der MVP wurde von einem generischen Schema-Set auf einen **deadline-first / risk-first V2-Stand** umgebaut.

Bereits fertig:
- `questions.schema.json` auf Flow-V2 umgestellt
- `rules.schema.json` um Frist-, Vertrags-, ALG-I- und Eskalationslogik erweitert
- `result.schema.json` um `synthesisDecision`, `topActions`, `riskFlags`, `redFlags`, `documentChecklist`, `statementLedger` erweitert
- `V2-DECISIONS.md` dokumentiert Leitentscheidungen und Guardrails
- `RESULT-COPY.md` als Copy-Layer je `primaryTrack`
- `REFERENZFAELLE.md` + Golden Outputs / Fixtures aufgebaut
- `MAPPING-RENDERING-V1.md` + `MAPPING-CONFIG-V1.json` definieren Mapping-, Konflikt- und Render-Logik
- **kleiner Engine-Layer ist gebaut** unter `src/engine/index.js`
- Demo-Runner existiert unter `src/demo.js`

## Was der Engine-Layer jetzt kann

Die Minimal-Engine implementiert genau 4 Funktionen:
- `evaluateRules`
- `buildResult`
- `selectPrimaryTrack`
- `renderResult`

Aktueller Charakter:
- deterministisch
- leichtgewichtig
- MVP-orientiert
- keine schwere Architektur
- `do-not-use-yet` wird nicht normal ausgespielt, bleibt aber im Ledger sichtbar

## Wichtige inhaltliche Entscheidungen

- **Sonderfälle eskalieren** statt falsch vereinfachen
- **Noch nicht unterschriebener Vertrag** hat operativ Vorrang vor bloßem ALG-I-Risiko-Scoring → deshalb oft `contract-do-not-sign`
- **Ohne schriftliche Kündigung** keine künstliche 3-Wochen-Panik
- **Arbeitsuchendmeldung ≠ Arbeitslosmeldung** bleibt explizit getrennt
- keine Abfindungsversprechen, keine Erfolgswahrscheinlichkeiten, keine Wirksamkeitsbehauptungen

## Was bereits validiert ist

Die vorhandenen Beispiel-/Golden-Fälle laufen gegen den Engine-Layer brauchbar:
- `deadline-first`
- `contract-do-not-sign`
- `special-case-review`
- `prepare-advice`
- Sonderfall „Vertrag bereits unterschrieben“

Track, Headline und Top-Priorisierung sind für die Kernfälle stimmig.

## Offene Schwächen / bekannte Grenzen

- Runtime zieht die aktuelle operative Logik teils aus den `example`-Blöcken der JSON-Schemas, weil die Dateien formal Schemas und keine reinen Runtime-Configs sind
- noch keine automatischen Snapshot-/Fixture-Tests
- noch kein Adapter an UI / API / Formular-Flow
- Render-Output ist funktional, aber noch kein finaler Produkt-Polish
- keine echte Datumsberechnung für konkrete Fristdaten, nur textliche Priorisierungslogik

## Nächster sinnvoller Schritt

**Als Nächstes Snapshot-/Fixture-Tests bauen.**

Warum zuerst das:
- schützt die Golden Outputs vor Drift
- stabilisiert Mapping, Track-Wahl und Priorisierung
- macht spätere Refactors sicherer
- verhindert, dass ein UI-Adapter auf weichem Boden gebaut wird

## Danach

1. Snapshot-/Fixture-Tests für Inputs → Result
2. optional Render-Tests für Short / Standard / Advice
3. erst dann leichter Adapter für Frontend oder API

## Konkret empfohlene To-dos

### Jetzt
- Test-Ordner anlegen
- Fixtures aus `examples/inputs/*.input.json` gegen `examples/*.result.json` prüfen
- mindestens vergleichen:
  - `synthesisDecision.primaryTrack`
  - `caseSnapshot.headline`
  - erste `topActions`
  - kritische `deadlines`
  - Trennung `riskFlags` vs `redFlags`
  - Unterdrückung von `do-not-use-yet`

### Danach
- entscheiden, ob Tests streng auf Vollobjekt gehen oder erst auf stabile Teilmengen
- dann kleinen Adapter bauen, der Fragebogen-Antworten direkt in `buildResult()` einspeist

## Relevante Dateien für den Wiedereinstieg

Unbedingt zuerst lesen:
- `projects/kuendigungs-kompass-mvp/PROJECT-STATUS.md`
- `projects/kuendigungs-kompass-mvp/V2-DECISIONS.md`
- `projects/kuendigungs-kompass-mvp/MAPPING-RENDERING-V1.md`
- `projects/kuendigungs-kompass-mvp/src/engine/index.js`
- `projects/kuendigungs-kompass-mvp/examples/PAIRS.md`

## Letzte Commits

- `cdffe67` — Add MVP mapping and rendering spec for Kündigungs-Kompass
- `ad7f2eb` — Implement Kündigungs-Kompass MVP engine layer

## Arbeitsmodus für den nächsten Block

Nicht wieder ins Schema-Design abdriften.

Fokus halten auf:
- Test-Stabilität
- Output-Konsistenz
- dann Integration
