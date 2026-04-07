# Kündigungs-Kompass — Mapping & Rendering V1

Stand: 2026-03-22
Status: aktiv

## Ziel
Aus Antworten + Rules + Result-Schema + Copy-Layer einen klaren, deterministischen Output der ersten Version bauen, ohne künstliche Smartness oder schweres Scoring.

## Operative Prinzipien
- lieber nachvollziehbar als clever
- lieber wenige harte Prioritäten als diffuse Scorings
- Sonderfälle eskalieren statt glätten
- Unknown vor stiller Fehlklassifikation
- Rendering folgt Priorität, nicht umgekehrt

## Pipeline
### Schritt A — Input normalisieren
- fehlende Multi-Selects → `[]`
- fehlende Bool-Werte nur dann `null`/`unknown`, nicht automatisch `false`
- Datumsfelder als ISO-Strings behalten
- `none_yet` / `none_known` nicht wegfiltern
- sensible `unknown`-Fälle aktiv erhalten, wenn Raten schädlicher wäre

### Schritt B — Rules evaluieren
- Rules erzeugen rohe Effects
- noch kein Rendering
- `do-not-use-yet` nur intern halten

### Schritt C — Effects in Result-Blöcke mappen
- blockweise, deterministisch
- keine freie Textsynthese als Ersatz für Mapping-Regeln

### Schritt D — `primaryTrack` wählen
- eindeutig
- konservativ
- ohne stillen Default auf Standardfälle, wenn Routing unklar bleibt

### Schritt E — View rendern
- `short`, `standard`, `advice`
- Prioritäten und Guardrails bleiben view-übergreifend stabil

## Normalisierungs-Defaults
Sichere Defaults:
- fehlendes optionales Feld → `unknown`, nicht `nein`
- unbekannter Track → expliziter Fallback-State, nicht Standardtrack
- fehlendes Zugangsdatum → kein Klagefrist-Datum

Gefährliche Defaults vermeiden:
- Red Flag = `nein` bei fehlender Antwort
- KSchG = `ja` bei fehlender Betriebsgröße
- Standard-Kündigungstrack bei unklarem Vertragstyp

## Rendering-Regeln nach Kritikalität
### Immer sichtbar
- To-do #1
- Fristdaten mit belastbarer Grundlage
- Eskalations-Block bei Red Flag
- notwendige Grenzbenennung

### Fallabhängig sichtbar
- weitere To-dos
- Risiken
- Unterlagen
- Beratungsfragen
- Chancen

### Nie als stiller Ersatz für Guardrails
- Upgrade-Elemente
- zusätzliche Erklärungen
- Layout-/Copy-Spielereien

## Fallback-Regeln
### `incomplete`
- feldspezifisch benennen, was fehlt
- Teilergebnis nur, wenn fachlich vertretbar
- keine technischen Zustände in UI

### `render-fallback`
- strukturiertes Result bleibt erhalten
- sichtbarer, aber ruhiger Fallback

### `error`
- kein stilles Weiterrechnen
- ruhige Fehlerkommunikation + Neuversuch

## Assertions mit hohem Hebel
Mindestens diese Logik muss hart abgesichert bleiben:
- Red Flag → Eskalationsblock vorhanden
- Aufhebungsvertrag → kein Klagefrist-Block
- valides Zugangsdatum → Klagefrist-Datum vorhanden
- fehlendes/unknown Zugangsdatum → kein Klagefrist-Datum
- Klagefrist-Datum liegt nach Zugangsdatum
- Disclaimer/Grenzblock vorhanden und nicht leer

## View-Regeln
### `short`
- Headline
- To-do #1
- erste kritische Frist, wenn vorhanden
- kein überflüssiger Tiefenballast

### `standard`
- Headline / Einordnung
- TopActions
- Deadlines
- RiskFlags
- RedFlags
- DocumentChecklist
- Disclaimer

### `advice`
- wie `standard`, plus Begründung / Beratungsfragen / strukturierte Vorbereitung
- Fristen und Eskalation bleiben trotzdem vor Nebeninformationen

## Drift-Schutz
Besonders drift-anfällig:
- Track-Wahl
- Datumsberechnung
- Red-Flag-Aktivierung
- Teilergebnis vs. Total-Fallback
- Trennung von Basis-Pflicht und Upgrade-Zusatz

Wenn unklar ist, ob Rendering oder Mapping „schönere“ Ausgabe erlaubt:
- Routing / Frist / Guardrail gewinnt
- Design und Copy ordnen sich unter
