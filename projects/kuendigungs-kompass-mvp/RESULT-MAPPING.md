# Kündigungs-Kompass MVP — Result Mapping

Stand: 2026-03-22
Status: aktiv

## Zweck
Diese Datei beschreibt die operative Logik, wie aus Antworten und Rule-Effects ein priorisiertes Result entsteht.

Kein Code, keine Engine-Architektur — nur Mapping-Regeln mit Umsetzungswert.

## Grundprinzip
Pipeline:
1. Antworten einsammeln
2. Rules evaluieren
3. `primaryTrack` eindeutig wählen
4. Result-Blöcke priorisiert befüllen
5. Copy-Layer und Render-Ansicht daraus ableiten

Wichtig:
- nicht jede ausgelöste Regel wird 1:1 sichtbar
- der Output priorisiert, verdichtet und entdoppelt
- Routing / Frist / Guardrail geht vor Copy / Layout / Nice-to-have

## Mapping von Effect-Typen auf Result-Blöcke
| Effect-Type | Result-Block |
|---|---|
| `immediateAction` | `topActions` |
| `deadlineAlert` | `deadlines` |
| `riskFlag` | `riskFlags` |
| `warning` | `riskFlags` oder `topActions` |
| `manualReview` | `redFlags` |
| `documentPrompt` | `documentChecklist` |
| `advisorQuestion` | `advisorQuestions` |
| `opportunityFlag` | `opportunities` |
| `disclaimer` | `disclaimers` oder `statementLedger.notUsedYet` |

## Sonderregel für `warning`
`warning` wird nicht blind gerendert.

- hat die Aussage klaren Handlungscharakter → `topActions`
- ist sie primär Gefahr-/Kontextsignal → `riskFlags`
- bei Unsicherheit konservativ lieber `riskFlags` als künstlicher Handlungsdruck

Beispiele:
- `do-not-sign-immediately` → `topActions`
- `release-is-not-everything` → `riskFlags`

## Blockregeln
### `topActions`
Quellen:
- `immediateAction`
- ausgewählte `warning`
- klar ableitbare Red-Flag-Folgen nur wenn operativ eindeutig

Regeln:
- Standardansicht: max. **3 Hauptaktionen**
- To-do #1 muss die priorisierte Hauptaktion sein
- keine konkurrierenden CTAs auf gleichem Niveau
- Handlung zuerst, Grund danach

### `deadlines`
Quellen:
- `deadlineAlert`

Regeln:
- kritische Fristen stehen vor allen nachrangigen Info-Blöcken
- valide Fristdaten nur bei belastbarer Datengrundlage
- fehlendes/unsicheres Zugangsdatum → kein scheinpräzises Klagefrist-Datum
- Arbeitsuchend- und Arbeitslosmeldung logisch getrennt halten
- Arbeitsuchendmeldung nie als stiller Ersatz für Arbeitslosmeldung rendern
- wenn beide offen und relevant sind, dürfen beide sichtbar werden; keine künstliche Zusammenführung

### `riskFlags`
Quellen:
- `riskFlag`
- nicht-handlungsorientierte `warning`

Regeln:
- Standardansicht: max. **3 zentrale Risiko-Signale**
- Risiko ohne Handlungsoption neutraler formulieren, nicht aufpumpen
- Sperrzeit-Dauer nicht als Deadline-Element missbrauchen

### `redFlags`
Quellen:
- `manualReview`
- fehlende routing-kritische Angaben, wenn sie Red-Flag-Charakter haben

Regeln:
- Red Flags sind Eskalationssignale, keine Paniktexte
- lieber 1 sauberer Eskalationsblock als 4 halbe Signale
- Red Flag darf nie im Standard-Risiko-Rauschen untergehen

### `documentChecklist`
Quellen:
- `documentPrompt`
- fallbezogene Ableitung aus dem Case-Bild

Regeln:
- Dokumente nach Handlungswert priorisieren
- Kündigungsschreiben fehlt → nicht nur Dokumentenblock, sondern ggf. To-do-/Guardrail-Relevanz
- Standardblock nicht künstlich aufblasen

### `advisorQuestions`
Quellen:
- `advisorQuestion`
- abgeleitet aus Track und Red Flags

Regeln:
- Standardansicht: max. 3 Fragen
- nur fallspezifisch, keine generischen Platzhalterfragen
- im Standard-Niedrigrisiko-Fall eher weglassen oder kollabieren

### `opportunities`
Regeln:
- nur wenn sie keine Fristen, Risiken oder Guardrails verdrängen
- im Standard-Kündigungs-Track eher klein halten
- beim noch nicht unterschriebenen Aufhebungsvertrag deutlich relevanter

### `disclaimers` und Grenzbenennung
Regeln:
- Disclaimer einmalig und ruhig
- Grenzbenennung inline an relevanter Stelle, nicht gesammelt als Entschuldigungspaket
- `do-not-use-yet` nie prominent in Nutzeroutput rendern

## Bildung der `primaryTrack`
Prioritätsreihenfolge:
1. `special-case-review`
2. `contract-do-not-sign`
3. `alg1-risk-first`
4. `deadline-first`
5. `prepare-advice`

Regel:
- Sonderfall-/Schutzthemen gewinnen vor Standardoptimierung
- Vertrag vor Unterschrift gewinnt vor allgemeiner Deadline-Logik
- Fallback nicht aus Bequemlichkeit, sondern nur wenn die höheren Tracks wirklich nicht greifen

## `caseSnapshot`-Regeln
### `headline`
- aus `primaryTrack` plus dringendstem Nutzensignal ableiten
- keine Behördenüberschrift
- keine beruhigende oder warnende Leere

### `situation`
- 1 Satz reicht
- Falltyp + wichtiger Status + ggf. Sonderfall
- kein Rechtsjargon, keine Mehrdeutigkeit bei fehlenden Fakten

### `riskLevel`
Nur intern/technisch sinnvoll.
Nicht als UI-Label ausspielen.

## Ergebnisreihenfolge in der Standardansicht
1. Headline / Einordnung
2. TopActions
3. Deadlines
4. RiskFlags
5. RedFlags
6. DocumentChecklist
7. AdvisorQuestions
8. Opportunities
9. Disclaimer

## Deduplizierung
- kein doppelter Inhalt in mehreren Blöcken ohne Grund
- bewusste Dopplung nur dort, wo sie Orientierung stärkt, z. B. Frist im To-do + Fristenblock
- gleiche Aussage nicht wortgleich in mehreren Blöcken wiederholen

## Harte Mapping-Guardrails
- kein Klagefrist-Block bei Aufhebungsvertrag
- Red Flag muss in Eskalation sichtbar werden
- keine Abfindungs-/Wirksamkeits-/Erfolgssicherheit
- kein Standardtrack als stiller Ersatz für unbekanntes Routing
- keine technischen Statusbegriffe in die UI leaken
