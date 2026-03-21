# Example Pairs

Diese Datei koppelt die Input-Fixtures mit den erwarteten Result-Fixtures.

## Paar 1

- **Input:** `inputs/01-kuendigung-arbeitslosmeldung-offen.input.json`
- **Expected Result:** `01-kuendigung-arbeitslosmeldung-offen.result.json`
- **Track:** `deadline-first`
- **Zweck:** prüft Trennung von Arbeitsuchendmeldung und Arbeitslosmeldung plus Kündigungsfrist

## Paar 2

- **Input:** `inputs/02-aufhebungsvertrag-nicht-unterschrieben.input.json`
- **Expected Result:** `02-aufhebungsvertrag-nicht-unterschrieben.result.json`
- **Track:** `contract-do-not-sign`
- **Zweck:** prüft Vertragsstopp, ALG-I-Risiko und Priorisierung vor Detailausbau

## Paar 3

- **Input:** `inputs/03-kuendigung-sonderfall.input.json`
- **Expected Result:** `03-kuendigung-sonderfall.result.json`
- **Track:** `special-case-review`
- **Zweck:** prüft Eskalation bei Sonderfallindikator bei gleichzeitigem Fristdruck

## Operative Nutzung

Ein späterer Mapper ist für ein Fixture-Paar korrekt, wenn mindestens Folgendes stabil stimmt:

1. `synthesisDecision.primaryTrack`
2. `caseSnapshot.headline`
3. Reihenfolge und Kerninhalt von `topActions`
4. kritische `deadlines`
5. Trennung von `riskFlags` und `redFlags`
6. keine verbotenen Aussagen aus `notUsedYet`

Wenn nur Formulierungen leicht abweichen, aber Priorisierung und Struktur stabil sind, ist das eher ein Copy-Thema als ein Logikfehler.
