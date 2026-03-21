# Examples / Fixtures

Diese JSON-Dateien sind die maschinenlesbaren Golden Outputs für den Kündigungs-Kompass MVP.

## Dateien

### Expected Results
- `01-kuendigung-arbeitslosmeldung-offen.result.json`
- `02-aufhebungsvertrag-nicht-unterschrieben.result.json`
- `03-kuendigung-sonderfall.result.json`

### Inputs
- `inputs/01-kuendigung-arbeitslosmeldung-offen.input.json`
- `inputs/02-aufhebungsvertrag-nicht-unterschrieben.input.json`
- `inputs/03-kuendigung-sonderfall.input.json`

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
