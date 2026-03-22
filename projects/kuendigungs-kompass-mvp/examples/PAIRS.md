# Example Pairs

Diese Datei koppelt die Input-Fixtures mit den erwarteten Result-Fixtures.

## Paar 1
- **Input:** `inputs/01-kuendigung-arbeitslosmeldung-offen.input.json`
- **Expected Result:** `01-kuendigung-arbeitslosmeldung-offen.result.json`
- **Track:** `deadline-first`
- **Zweck:** Trennung von Arbeitsuchendmeldung und Arbeitslosmeldung plus Kündigungsfrist

## Paar 2
- **Input:** `inputs/02-aufhebungsvertrag-nicht-unterschrieben.input.json`
- **Expected Result:** `02-aufhebungsvertrag-nicht-unterschrieben.result.json`
- **Track:** `contract-do-not-sign`
- **Zweck:** Vertragsstopp, ALG-I-Risiko und Priorisierung vor Detailausbau

## Paar 3
- **Input:** `inputs/03-kuendigung-sonderfall.input.json`
- **Expected Result:** `03-kuendigung-sonderfall.result.json`
- **Track:** `special-case-review`
- **Zweck:** Eskalation bei Sonderfallindikator trotz Fristdruck

## Paar 4
- **Input:** `inputs/04-vertrag-bereits-unterschrieben.input.json`
- **Expected Result:** `04-vertrag-bereits-unterschrieben.result.json`
- **Track:** `special-case-review`
- **Zweck:** Folgen-/Prüfpfad bei bereits unterschriebenem Vertrag statt stumpfer Nicht-unterschreiben-Logik

## Paar 5
- **Input:** `inputs/05-kuendigung-nur-angekuendigt.input.json`
- **Expected Result:** `05-kuendigung-nur-angekuendigt.result.json`
- **Track:** `prepare-advice`
- **Zweck:** ohne schriftliche Kündigung keine falsche 3-Wochen-Panik

## Paar 6
- **Input:** `inputs/06-mehrere-eingaenge-gleichzeitig.input.json`
- **Expected Result:** `06-mehrere-eingaenge-gleichzeitig.result.json`
- **Track:** `special-case-review`
- **Zweck:** Priorisierung bei überlagerten Risikotreibern

## Operative Nutzung
Ein Mapper ist für ein Fixture-Paar korrekt, wenn mindestens Folgendes stabil stimmt:
1. `synthesisDecision.primaryTrack`
2. `caseSnapshot.headline` oder gleichwertige Headline-Richtung
3. Reihenfolge und Kerninhalt von `topActions`
4. kritische `deadlines`
5. Trennung von `riskFlags` und `redFlags`
6. keine verbotenen Aussagen oder stillen Guardrail-Brüche

## Besonders kritisch prüfen
- kein Klagefrist-Block bei Aufhebungsvertrag
- Red Flag erzeugt sichtbare Eskalation
- fehlendes oder unsicheres Zugangsdatum erzeugt kein scheinpräzises Fristdatum
- Fristen- und Guardrail-Logik verdrängen sich nicht gegenseitig

Wenn nur Formulierungen leicht abweichen, Priorisierung und Guardrails aber stabil bleiben, ist das eher ein Copy-Thema als ein Logikfehler.
