# Kündigungs-Kompass MVP — Monitoring & Minimal-Analytics V1

Stand: 2026-03-22

## Ziel
Ein kleines, belastbares Beobachtungsmodell für den MVP schaffen — ohne direkt in schwere Analytics oder personenbezogene Auswertung abzurutschen.

## Monitoring-Minimum
### Technisch beobachten
- `status`: `ready` / `incomplete` / `render-fallback` / `error`
- `error.code`
- `tier.requested`
- `tier.resolved`
- `warnings_count`
- `missing_answers_count`
- `red_flags_count`
- `primary_track` (wenn `ready` / `render-fallback`)
- `risk_level` nur intern/technisch, nicht als UI-Label
- `top_actions_count`
- `deadlines_count`

### Produktseitig beobachten
- welche Tracks dominieren
- welche Fälle am häufigsten unvollständig bleiben
- wie oft unbekannte Tiers angefragt werden
- wie oft Render-Fallback auftritt
- wie oft Red Flags auftreten
- an welcher Frage der Flow am häufigsten abbricht
- ob Abbrüche vor allem bei Red-Flag-nahen oder deadline-relevanten Konstellationen passieren

## Nicht Ziel von V1
- individuelle Nutzerprofile
- personenbezogene Verlaufsanalyse
- Marketing-Tracking vor Runtime-Stabilität
- überfeine Event-Zerlegung

## Empfohlenes Event-Schema
### Kanonischer Runtime-Emissionspunkt
Der MVP hat jetzt einen einzigen andockbaren Emissionspunkt im Runtime-Layer:
- `buildQuestionnaireResultView(rawInput, { onEvent })`
- pro gebautem View genau **ein** Event-Payload
- aktueller Event-Name: `questionnaire_result_view_built`

### Event: `questionnaire_result_view_built`
Felder:
- `status`
- `requestedTier`
- `tier`
- `warningCount`
- `missingAnswersCount`
- `primaryTrack`
- `riskLevel`
- `topActionsCount`
- `deadlinesCount`
- `redFlagsCount`
- `errorCode`
- `flowAbandonment` (`null` außer bei `incomplete`)

### `flowAbandonment` bei `incomplete`
Nur anonym und minimal:
- `lastQuestionKey`
- `nextQuestionKey`
- `trackContext` wenn ableitbar
- `hadRedFlag`
- `hadKnownDeadlineDate`

### V1-Adapter für den lokalen Anschluss
- `src/runtime/telemetry/emitResultViewEvent.js` → dünner Mapper/Emitter für result-view-kompatible Payloads
- `src/runtime/telemetry/fileTelemetrySink.js` → schreibt pro Event eine JSON-Zeile in `telemetry.ndjson`
- `src/runtime/telemetry/aggregateTelemetry.js` → aggregiert Status, Tracks, Abbruchfragen und Error-Codes aus NDJSON und leitet daraus minimale `stopSignals` ab
- `src/demo.js --telemetry-out <path>` → kleinster Dev-Hook, um den Sink ohne UI/API-Anschluss real zu benutzen
- Runbook dafür: `vault/runbooks/kk-telemetry-dev.md`
- der Sink bleibt extern andockbar; `buildQuestionnaireResultView(..., { onEvent })` bleibt der einzige Runtime-Emissionspunkt

### `stopSignals` aus dem Aggregator
Der Aggregator hebt die wichtigsten Soft-Launch-Warnsignale in eine kleine, direkte Summary:
- `repeatedRenderFallback` → `true`, wenn `render-fallback` den Stop-Schwellenwert erreicht oder überschreitet (V1 default: 2)
- `errorsPresent` → `true`, wenn mindestens ein `error`-Event gesehen wurde (V1 default: 1)
- `invalidTelemetryLines` → `true`, wenn kaputte NDJSON-Zeilen auftauchen
- `monitoringBlind` → `true`, wenn überhaupt keine Events vorliegen
- `requiresAttention` → `true`, sobald eines dieser Warnsignale aktiv ist

Wichtig: Das ist bewusst kein neues Monitoring-System, sondern nur der kleinste maschinenlesbare Stop-/Rollback-Hinweis über den bestehenden NDJSON-Pfad.

### Später optional
- separates Event `questionnaire_flow_abandoned`, falls UI/API später lieber zwei Events statt eines kanonischen Payloads haben will
- separates Event `questionnaire_result_view_failed`, falls `status=error` im Hauptevent operativ nicht reicht

## Interpretationsregeln
- viele `incomplete` = Fragebogen oder Screen-Reihenfolge prüfen
- viele `render-fallback` = Rendering instabil
- viele `error` = Runtime- oder Adapterproblem
- viele `special-case-review` = Sonderfallabdeckung / Kommunikation prüfen
- viele unbekannte Tiers = UI/API schickt falsche Produktstufe
- viele Abbrüche an derselben Frage = Abbruchtreiber oder zu private / unklare / zu frühe Frage prüfen

## MVP-Regel
Lieber wenige, robuste Felder tracken als viele, unzuverlässige.
Monitoring dient hier zuerst der **Produktstabilität**, nicht der Optimierungsschleife.

## Datenschutzregel
- keine persönlichen Inhalte in Events
- keine Kontakt- oder Freitextdaten
- Abbruchtracking nur anonym und aggregierbar
