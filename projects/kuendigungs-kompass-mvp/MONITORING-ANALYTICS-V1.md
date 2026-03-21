# Kündigungs-Kompass MVP — Monitoring & Minimal-Analytics V1

Stand: 2026-03-21

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
- `risk_level` (wenn verfügbar)

### Produktseitig beobachten
- welche Tracks dominieren
- welche Fälle am häufigsten unvollständig bleiben
- wie oft unbekannte Tiers angefragt werden
- wie oft Render-Fallback auftritt
- wie oft Red Flags auftreten

---

## Nicht Ziel von V1
- individuelle Nutzerprofile
- personenbezogene Verlaufsanalyse
- Marketing-Tracking vor Runtime-Stabilität
- überfeine Event-Zerlegung

---

## Empfohlenes Event-Schema

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

### Event: `questionnaire_result_view_failed`
Nur wenn wirklich nötig separat; sonst reicht `status=error` im Haupt-Event.

---

## Interpretationsregeln
- viele `incomplete` = Fragebogen oder Screen-Reihenfolge prüfen
- viele `render-fallback` = Rendering instabil
- viele `error` = Runtime- oder Adapterproblem
- viele `special-case-review` = Sonderfallabdeckung / Kommunikation prüfen
- viele unbekannte Tiers = UI/API schickt falsche Produktstufe

---

## MVP-Regel
Lieber wenige, robuste Felder tracken als viele, unzuverlässige. Monitoring dient hier zuerst der **Produktstabilität**, nicht der Optimierungsschleife.