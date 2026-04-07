# Kündigungs-Kompass — Mini-Testkonzept

Stand: 2026-03-22
Status: aktiv

## Ziel
Tests sollen **Logik-Drift früh sichtbar machen**, ohne bei kleinen Copy-Änderungen unnötig rot zu werden.

## Was strikt stabil sein muss
Diese Bereiche gelten als logikkritisch:
1. `synthesisDecision.primaryTrack`
2. Guardrails bei Red Flags, Verträgen und unsicheren Fristen
3. erste Priorität in `topActions`
4. kritische `deadlines`
5. Trennung `riskFlags` vs `redFlags`
6. kein verbotener Nutzeroutput zu Abfindung, Wirksamkeit, Klageerfolg, sicherer Sperrzeit
7. kein Klagefrist-Datum ohne belastbares Zugangsdatum

## Was flexibler bleiben darf
- längere Beschreibungstexte
- Detailformulierungen in Disclaimer/Grenztexten
- nichtkritische Reihenfolge untergeordneter Dokumente
- Copy-Feinschliff ohne Logikänderung

## Was als echter Logikfehler zählt
Ein Test ist fachlich rot, wenn:
- `primaryTrack` ungewollt kippt
- To-do #1 ungewollt kippt
- kritische Frist verschwindet oder falsch erscheint
- Sonderfall nicht eskaliert
- Aufhebungsvertrag wie Kündigung behandelt wird
- fehlender Input zu stiller Scheinsicherheit führt
- Guardrails im Nutzeroutput brechen

## Testarten
### Struktur-Assertions
Prüfen:
- `primaryTrack`
- wichtige Block-Existenz oder Block-Abwesenheit
- TopAction #1
- Fristdatum vorhanden / nicht vorhanden
- Red-Flag-/Eskalationsblock vorhanden

### Snapshot-Tests
Geeignet für:
- Fristen-Outputs
- zentrale Mehrfachfälle
- Track-spezifische Renderstruktur
- Guardrail-sensitive Blöcke

### Manuelle Reviews
Bleiben sinnvoll für:
- Tonalität
- Blockreihenfolge-Feinschliff
- Layout-/Copy-Wahrnehmung

## Mindest-Assertions mit Hebel
- Red Flag → Eskalationsblock vorhanden
- Aufhebungsvertrag → kein Klagefrist-Block
- valides Zugangsdatum → Klagefrist-Datum vorhanden
- unknown Zugangsdatum → kein Klagefrist-Datum
- Klagefrist-Datum > Zugangsdatum
- Disclaimer/Grenzblock nicht leer

## Render-Mindestregeln
### `short`
- enthält Headline
- enthält To-do #1
- enthält erste kritische Frist, wenn vorhanden

### `standard`
- Reihenfolge bleibt: Headline → TopActions → Deadlines → Risks → RedFlags → Unterlagen → Hinweise
- `do-not-use-yet` taucht nicht auf

### `advice`
- enthält Begründung / Beratungsfragen nur nachrangig zu Fristen und Eskalation

## Pair-6-Sonderregel
Der Mehrfachfall bleibt Drift-Indikator.
Er darf nicht still aus dem Testfokus fallen.

## Done-When
- alle Golden Pairs laufen automatisch
- Routing-, Frist- und Guardrail-Drift macht mindestens einen Test rot
- Copy-Feinschliff macht nicht unnötig fachliche Tests kaputt
