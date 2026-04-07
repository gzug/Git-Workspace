# Kündigungs-Kompass — Launch Hardening Done

Status: Gate-Definition

## GO nur wenn alles erfüllt ist

### 1. Heikle Pfade sind stabil und regressionsfest
- [ ] Fristenlogik erzeugt keine falsche Sicherheit
- [ ] Arbeitsuchend vs. arbeitslos bleibt fachlich und sprachlich sauber getrennt
- [ ] Unknown-/Pflichtfeld-/Widerspruchsfälle landen konservativ richtig
- [ ] repräsentative Härtefälle sind in Tests / Snapshots abgesichert
- [ ] kein offener reproduzierbarer Drift zwischen Doku, Runtime, Fixtures und Render

### 2. Runtime ist operativ beobachtbar
- [ ] `ready`, `incomplete`, `render-fallback`, `error` sind sauber getrennt
- [ ] kanonischer Runtime-Emissionspunkt liefert verwertbare Event-Felder
- [ ] Flow-Abbrüche sind grob beobachtbar
- [ ] Render-Fallbacks und Error-Codes verschwinden nicht still
- [ ] bei Fehlverhalten gibt es ein klares Stop-/Rollback-Signal

### 3. Oberfläche verrät die Fachlogik nicht mehr
- [ ] Preview / Base / Upgrade zeigen dieselbe Prioritätshierarchie
- [ ] Fristen, Eskalation und Guardrails bleiben sichtbar
- [ ] keine irreführende Fristpanik in angekündigten / unklaren Fällen
- [ ] kein Widerspruch zwischen kurzer Karte und voller Ansicht
- [ ] die wichtigsten Ergebnisfälle lesen sich ruhig, klar und belastbar

## GO
- [ ] relevante Test-Suite grün
- [ ] keine offenen kritischen Frist- oder Routingfehler
- [ ] kein offener Blindflug im Monitoring-Minimum

## NO-GO, wenn eines davon zutrifft
- [ ] falsches Fristdatum reproduzierbar
- [ ] falsches Track-Routing reproduzierbar
- [ ] Red-Flag-/Sonderfall landet sichtbar im falschen Standardpfad
- [ ] wiederholter `render-fallback` ohne eingegrenzte Ursache
- [ ] sichtbarer Drift zwischen Fixture, Runtime und UI
- [ ] Monitoring-Minimum fehlt oder ist operativ blind

## Minimale Evidenz
- `test-launch-hardening-anchors.js`
- `test-launch-hardening-done.js`
- `test-fixtures.js`
- `test-render-product-tiers.js`
- `test-questionnaire-result-view.js`
- `E2E-REALITY-CHECK-V1.md`
- `MONITORING-ANALYTICS-V1.md`
- `SOFT-LAUNCH-CHECKLIST-V1.md`
