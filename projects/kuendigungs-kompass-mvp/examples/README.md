# Examples / Fixtures

Diese JSON-Dateien sind die maschinenlesbaren Golden Outputs für den Kündigungs-Kompass.

## Dateien

### Expected Results
- `01-kuendigung-arbeitslosmeldung-offen.result.json`
- `02-aufhebungsvertrag-nicht-unterschrieben.result.json`
- `03-kuendigung-sonderfall.result.json`
- `04-vertrag-bereits-unterschrieben.result.json`
- `05-kuendigung-nur-angekuendigt.result.json`
- `06-mehrere-eingaenge-gleichzeitig.result.json`
- `07-angekuendigt-alg1-risiko.result.json`

### Inputs
- `inputs/01-kuendigung-arbeitslosmeldung-offen.input.json`
- `inputs/02-aufhebungsvertrag-nicht-unterschrieben.input.json`
- `inputs/03-kuendigung-sonderfall.input.json`
- `inputs/04-vertrag-bereits-unterschrieben.input.json`
- `inputs/05-kuendigung-nur-angekuendigt.input.json`
- `inputs/06-mehrere-eingaenge-gleichzeitig.input.json`
- `inputs/07-angekuendigt-alg1-risiko.input.json`

### Pairing
- `PAIRS.md`

## Zweck

Nutzen für:
- Snapshot-Tests
- Prompt-/Template-Vergleiche
- Mapping-Validierung
- spätere Render-Checks gegen feste Sollbilder

## Hinweis

Wenn die spätere Implementierung stark von diesen Fixtures abweicht, zuerst `RESULT-MAPPING.md` und `GOLDEN-OUTPUTS.md` prüfen — nicht sofort das Schema ändern.
