# Kündigungs-Kompass MVP — Mapping & Rendering V1

Ziel dieses Blocks: aus Antworten + Rules + Result-Schema + Copy-Layer einen **klaren, deterministischen MVP-Output** bauen, ohne sofort eine schwere End-to-End-Implementation zu erzwingen.

---

## 1. Operatives Ziel

Die Engine soll in 4 Schritten arbeiten:

1. **Antworten gegen Regeln auswerten**
2. **Result-Blöcke deterministisch befüllen**
3. **`primaryTrack` eindeutig wählen**
4. **je nach Ansicht (short / standard / advice) rendern**

Dabei gilt:
- lieber nachvollziehbar als „smart"
- lieber wenige harte Prioritäten als diffuse Scorings
- Sonderfälle eskalieren statt künstlich glätten

---

## 2. Pipeline in der richtigen Reihenfolge

### Schritt A — Input normalisieren

Aus dem Fragebogen entsteht ein flaches `answers`-Objekt, z. B.:

```json
{
  "case_entry": "multiple",
  "termination_access_date": "2026-03-18",
  "employment_end_date": "2026-04-30",
  "jobseeker_registered": false,
  "already_unemployed_now": false,
  "agreement_present": true,
  "agreement_already_signed": false,
  "release_status": "yes_irrevocable",
  "special_protection_indicator": ["unsure"],
  "documents_secured": ["agreement_draft", "employment_contract"],
  "primary_goal": "protect_alg1"
}
```

Normalisierung:
- fehlende Multi-Selects → `[]`
- fehlende Booleans nur dann `null`, nicht automatisch `false`
- Datumsfelder als ISO-Strings behalten
- `none_yet` / `none_known` als echte Signale behandeln, nicht wegfiltern

---

### Schritt B — Rules evaluieren

Jede Regel erzeugt bei Match **Effects**.

Engine-Output intern:

```json
{
  "matchedRules": ["jobseeker-registration-missing", "agreement-not-signed-yet"],
  "effects": [
    { "type": "deadlineAlert", "payload": { "id": "jobseeker-registration-deadline", "label": "..." } },
    { "type": "immediateAction", "payload": { "id": "complete-jobseeker-registration", "label": "..." } },
    { "type": "warning", "payload": { "id": "do-not-sign-immediately", "label": "..." } }
  ]
}
```

Wichtig:
- noch **kein Rendering** in diesem Schritt
- Effects bleiben zunächst roh und nachvollziehbar
- `do-not-use-yet` wird geloggt, aber nicht nutzerseitig ausgespielt

---

### Schritt C — Effects in Result-Blöcke mappen

Die Result-Struktur wird **nicht frei generiert**, sondern blockweise aus Rules aufgebaut.

#### Mapping-Tabelle

| Effect-Type | Result-Block |
|---|---|
| `immediateAction` | `topActions` |
| `deadlineAlert` | `deadlines` |
| `riskFlag` | `riskFlags` |
| `warning` | `riskFlags` oder `topActions` je nach Handlungscharakter |
| `manualReview` | `redFlags` |
| `documentPrompt` | `documentChecklist` |
| `advisorQuestion` | `advisorQuestions` |
| `opportunityFlag` | `opportunities` |
| `disclaimer` | `disclaimers` oder `statementLedger.notUsedYet` |

#### Sonderregel für `warning`

`warning` ist absichtlich unscharf und muss operationalisiert werden:

- hat Payload einen klaren Handlungsappell → zusätzlich als `topAction` zulässig
- ist es primär ein Gefahrenhinweis → `riskFlags`
- bei MVP zuerst konservativ behandeln:
  - `do-not-sign-immediately` → `topActions`
  - `release-is-not-everything` → `riskFlags`

---

## 3. Block-spezifische Mapping-Regeln

### 3.1 `topActions`

Quellen:
- `immediateAction`
- ausgewählte `warning`
- optionale abgeleitete Aktionen aus Red Flags nur dann, wenn sie operativ klar sind

Regeln:
- sortieren nach `priority` aufsteigend
- bei gleicher Priorität nach Severity der auslösenden Rule: `critical > high > medium > low`
- harte Obergrenze in Standardansicht: **3 Hauptaktionen**
- Duplikate per `payload.id` oder sehr ähnlichem `label` zusammenführen

Mapping-Feldlogik:
- `label` ← `payload.label`
- `why` ← `payload.why` oder `payload.description`
- `timing` ← `payload.timing` falls vorhanden, sonst aus Severity ableiten
- `statementClass` ← `payload.statementClass`

Timing-Fallback:
- `critical` → `sofort`
- `high` → `heute`
- `medium` → `zeitnah`
- `low` → `mit einplanen`

---

### 3.2 `deadlines`

Quellen:
- `deadlineAlert`

Regeln:
- immer nach `importance` und dann zeitlicher Dringlichkeit sortieren
- `critical` Deadlines stehen immer vor allen anderen Info-Blöcken
- wenn `termination_access_date` existiert, Klagefenster prominent halten, selbst wenn keine Wirksamkeitsbewertung erfolgt

Importance-Mapping aus Rule-Severity:
- `critical` → `critical`
- `high` → `high`
- `medium` / `low` → `medium`

Felder:
- `label` ← `payload.label`
- `timing` ← `payload.timing`
- `note` ← `payload.description` oder `payload.audienceNote`
- `statementClass` ← `payload.statementClass`

---

### 3.3 `riskFlags`

Quellen:
- `riskFlag`
- nicht-handlungsorientierte `warning`

Regeln:
- nicht mehr als **3 zentrale Risk Flags** in Standardansicht
- Severity aus Rule übernehmen
- keine doppelte Ausgabe von inhaltlich identischen Risiken

Felder:
- `label` ← `payload.label`
- `description` ← `payload.description`
- `severity` ← Rule-Severity
- `statementClass` ← `payload.statementClass`

---

### 3.4 `redFlags`

Quellen:
- `manualReview`
- offene Pflichtfelder mit `redFlagIfMissing = true`, wenn sie für den Fall eigentlich nötig wären

Regeln:
- Red Flags sind **Eskalationssignale**, keine Paniktexte
- jeder Red Flag braucht einen klaren Eskalationsgrund
- in MVP lieber 1 sauberer Red Flag als 4 halbe

Felder:
- `label` ← `payload.label`
- `whyEscalated` ← `payload.description` oder aus Missing-Data-Hinweis abgeleitet
- `recommendedEscalation` ← `payload.escalateIf` oder Standardtext

Standardtext Fallback:
- `Individuelle Prüfung mit qualifizierter Beratung`

---

### 3.5 `documentChecklist`

Quellen:
- `documentPrompt`
- optional direkte Antwortauswertung aus `documents_secured`

MVP-Regel:
- nicht nur Regel-Effekte nutzen, sondern zusätzlich aus dem Fallbild eine kleine Baseline-Liste ableiten

Empfohlene Baseline:
- bei Kündigungsfall → `Kündigungsschreiben`
- bei Vertragsfall → `Aufhebungs-/Abwicklungsvertrag oder Entwurf`
- immer sinnvoll → `Arbeitsvertrag`
- bei Unklarheit zu Vergütung/Ansprüchen → `Lohnunterlagen`

Status-Regel:
- in `documents_secured` enthalten → `already-secured`
- für Fall relevant, aber nicht gesichert → `secure-now`
- hilfreich, aber nicht zentral → `optional`

---

### 3.6 `advisorQuestions`

Quellen:
- `advisorQuestion`
- abgeleitet aus Track und Red Flags

MVP-Regel:
- Standardansicht: max. 3 Fragen
- Beratungsansicht: bis zu 5 Fragen

Fallback-Fragen pro Falltyp:
- Kündigung: „Welche Fristen laufen konkret ab Zugang der Kündigung?“
- Vertrag: „Welche Folgen hätte dieser Vertrag für ALG I und Handlungsspielraum?“
- Sonderfall: „Gibt es Hinweise auf besonderen Schutz oder erhöhten Prüfbedarf?“

---

### 3.7 `opportunities`

Quellen:
- `opportunityFlag`

Regeln:
- nur nachrangig ausspielen
- nur `cautious-check`-Ton
- nie vor Fristen, Risiken oder TopActions platzieren

---

### 3.8 `disclaimers` und `statementLedger`

#### `disclaimers`
Nutzerseitig sichtbar, kurz und sparsam.

Empfehlung:
- 2 bis 3 Disclaimers maximal
- Standard-Fallbacks aus `result.schema.json`-Beispiel übernehmen

#### `statementLedger`
Interner Hygiene- und Transparenzblock, optional auch für Debug / Export.

Befüllung:
- `mvpReliable` ← alle ausgespielten Aussagen mit `mvp-reliable`
- `cautiousChecks` ← alle ausgespielten Aussagen mit `cautious-check`
- `notUsedYet` ← alle gematchten, aber bewusst unterdrückten `do-not-use-yet`

Wichtig:
- `do-not-use-yet` darf im Ledger auftauchen
- `do-not-use-yet` darf **nicht** im normalen Nutzertext aktiv erscheinen

---

## 4. Track-Auswahl (`primaryTrack`) — deterministisch statt fuzzy

Track-Wahl ist eine **eigene Syntheseentscheidung** nach der Rule-Auswertung.

### Prioritätsreihenfolge

1. `special-case-review`
2. `contract-do-not-sign`
3. `alg1-risk-first`
4. `deadline-first`
5. `prepare-advice`

### Auswahlregeln

#### A. `special-case-review`
Wenn mindestens eine Bedingung erfüllt ist:
- `manualReview` aus Sonderfall-/Schutzlogik aktiv
- `special_protection_indicator` enthält etwas außer `none_known`
- kritisches Pflichtfeld fehlt und blockiert saubere Standard-Einordnung
- Vertrag bereits unterschrieben **und** Sonderfall/Unklarheit liegt vor

#### B. `contract-do-not-sign`
Wenn:
- `agreement_present = true`
- `agreement_already_signed = false`

und kein höherer Sonderfall-Track greift.

#### C. `alg1-risk-first`
Wenn mindestens eins zutrifft:
- `jobseeker_registered = false`
- `already_unemployed_now = true` und `unemployment_registered = false`
- `riskFlag` mit ALG-I-Bezug aus Vertragslogik aktiv
- `primary_goal = protect_alg1` und dazu passende Risikosignale liegen vor

#### D. `deadline-first`
Wenn:
- kritische Fristen aktiv sind
- aber weder Sonderfall noch Vertragswarnung noch dominantes ALG-I-Risiko überwiegen
- `primary_goal = protect_deadlines` verstärkt diesen Track

#### E. `prepare-advice`
Fallback, wenn:
- kein dominanter Fristen-/Vertrags-/ALG-I-Track greift
- oder der Fall vor allem auf Strukturierung und Beratungsvorbereitung hinausläuft

---

## 5. Konfliktauflösung

Konflikte sind im MVP normal. Wichtig ist, **eine** Leitspur zu wählen und den Rest als Nebenlagen sichtbar zu halten.

### Konfliktprinzip

- **Track = Hauptfokus**
- andere relevante Signale bleiben in `topActions`, `deadlines`, `riskFlags`, `redFlags` sichtbar
- nicht versuchen, alles in den Track-Namen zu pressen

### Typische Konflikte

#### Fall 1 — Vertrag liegt vor + Meldung fehlt
- Track: `contract-do-not-sign` **oder** `alg1-risk-first`?
- Regel: wenn der kritische Hebel die noch offene Unterschrift ist → `contract-do-not-sign`
- wenn Vertrag nicht akut zur Entscheidung steht, aber Meldungen schon brennen → `alg1-risk-first`

Operative Default-Regel für MVP:
- **nicht unterschriebenen Vertrag höher gewichten** als fehlende Meldung, weil ein falscher Vertrag irreversibler ist
- Meldung bleibt dann `topAction` Nr. 1 oder Nr. 2

#### Fall 2 — Sonderfallindikator + laufende Frist
- Track: `special-case-review`
- Frist trotzdem oben in `deadlines`
- keine Standardisierung des Sonderfalls

#### Fall 3 — Keine harte Eskalation, aber vieles unklar
- Track: `prepare-advice`
- Output fokussiert Unterlagen, Fragen, Fristen

---

## 6. Render-Logik je Ansicht

### A. Short View

Ziel: sofortige Orientierung

Struktur:
1. `headline`
2. wichtigster nächster Schritt (`topActions[0]`)
3. erste kritische Deadline, wenn vorhanden

Maximal:
- 1 Headline
- 1 Action
- 1 Deadline
- 1 kurzer Risikohinweis optional

---

### B. Standard View

Ziel: Hauptausgabe des MVP

Reihenfolge:
1. Headline
2. Kurz-Einordnung (Track-Template + `caseSnapshot.situation`)
3. Top 3 Schritte
4. Kritische Fristen
5. Risiken
6. Red Flags nur wenn vorhanden
7. Unterlagen
8. kurzer Disclaimer-Block

Regel:
- keine Opportunities oberhalb von Risiken oder Red Flags
- keine Ledger-Ausgabe im Standardtext

---

### C. Advice View

Ziel: Vorbereitung auf Anwalt / Gewerkschaft / Agentur

Reihenfolge:
1. Headline
2. Warum dieser Track gewählt wurde (`synthesisDecision.reasoning`)
3. TopActions
4. Deadlines
5. RedFlags
6. Dokumente
7. AdvisorQuestions
8. Disclaimer

---

## 7. Headline-Logik

Headline kommt **nicht** aus freier Generierung, sondern aus 3 Schichten:

1. Track-Headline aus `RESULT-COPY.md`
2. optional angepasst durch Fallkontext
3. fallback auf `caseSnapshot.headline`

Empfehlung für MVP:
- Track-Template bevorzugen
- `caseSnapshot.headline` als berechnetes Ergebnis speichern
- Rendering nutzt gespeicherten Headline-Wert

---

## 8. Minimaler Synthese-Builder für `caseSnapshot`

### `caseSnapshot.headline`
Aus Track-Template ableiten

### `caseSnapshot.situation`
2-teilige Verdichtung aus:
- Case Entry / Vertrag / Meldestatus
- ggf. Sonderfall- oder Fristenhinweis

Beispiel:
- „Dir liegt ein Aufhebungsvertrag vor und du bist noch nicht arbeitssuchend gemeldet. Zusätzlich gibt es Hinweise, dass dein Fall nicht nur als Standardfall behandelt werden sollte.“

### `caseSnapshot.riskLevel`
Vereinfachte Regel:
- `high` → irgendeine kritische Deadline, Red Flag oder Vertrags-/ALG-I-Kernwarnung aktiv
- `medium` → mindestens eine High-Severity-Regel, aber keine kritische Eskalation
- `low` → nur Vorbereitung/Opportunity ohne akute Fristen/Risiken

### `caseSnapshot.primaryGoal`
Direkt aus Antwortfeld `primary_goal` übernehmen, wenn vorhanden

---

## 9. Was bewusst noch NICHT in V1 gehört

Nicht jetzt einbauen:
- schweres Punktesystem
- probabilistische Gewichtung
- NLP-Generierung für alle Texte
- juristische Einzelfallsubsumtion
- Abfindungsrechner
- komplexe Freistellungslogik
- automatische Datumsberechnung mit Sonderausnahmen

Der MVP braucht zuerst:
- nachvollziehbare Regeln
- saubere Priorisierung
- robuste Guardrails
- klaren Render-Output

---

## 10. Empfohlene nächste Implementation

Wenn der nächste Block in Code geht, dann in genau dieser Reihenfolge:

1. `evaluateRules(answers, rules)`
2. `buildResult(answers, matchedEffects)`
3. `selectPrimaryTrack(answers, matchedRules, partialResult)`
4. `renderResult(result, view = "standard")`

Empfohlene Dateistruktur:

```text
src/
  engine/
    evaluateRules.ts
    buildResult.ts
    selectPrimaryTrack.ts
    renderResult.ts
  config/
    mapping.ts
    trackPriority.ts
```

---

## 11. Harte MVP-Guardrails

Immer einhalten:
- `do-not-use-yet` niemals normal ausspielen
- Sonderfälle eskalieren statt glätten
- Fristen vor Opportunities
- klare To-dos vor erklärender Prosa
- keine Wirksamkeits- oder Erfolgsversprechen
- keine Abfindungswahrscheinlichkeiten

---

## 12. Kurzfazit

Der richtige nächste Schritt ist **nicht** mehr Schema-Design, sondern ein kleiner deterministischer Orchestrierungs-Layer:

- Rules matchen
- Result-Blöcke befüllen
- `primaryTrack` wählen
- in 3 Ansichten rendern

Genau das reicht für den operativen MVP.
