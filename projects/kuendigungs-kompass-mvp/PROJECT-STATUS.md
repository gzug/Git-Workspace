# Kündigungs-Kompass MVP — Projektstatus

Stand: 2026-03-21

## Kurzstatus

Der Kündigungs-Kompass steht aktuell auf einem **operativ belastbaren V2-MVP-Zwischenstand**.

Der Kern ist nicht mehr nur Schema-Design, sondern bereits in fünf Schichten angelegt:
- **Frage-/Entscheidungsmodell**
- **Regel- und Priorisierungslogik**
- **Result- und Copy-Layer**
- **Mapping-/Rendering- und Fixture-Struktur**
- **integrierter Runtime-Pfad vom Fragebogen bis zur Ergebnisansicht**

Das Projekt ist damit nicht mehr nur fachlich vorbereitet, sondern besitzt jetzt einen echten produktnahen Ergebnis-Flow mit klaren Fallback-Zuständen.

---

## Was fachlich entschieden und aufgebaut wurde

### 1. V2-Strategie

Der MVP läuft jetzt **deadline-first / risk-first** statt generisch oder feature-lastig.

Leitprinzipien:
- Fristen vor Nice-to-have
- Sonderfälle eskalieren statt weichzeichnen
- Vertragsrisiken klar priorisieren
- keine Scheinsicherheit bei Wirksamkeit, Abfindung oder Sonderkündigungsschutz
- keine Scope-Explosion in Conversion, Verhandlung oder juristische Detailsimulation

### 2. Result-Struktur

`result.schema.json` bildet inzwischen ein brauchbares V2-Ergebnisbild ab mit:
- `caseSnapshot`
- `synthesisDecision`
- `topActions`
- `deadlines`
- `riskFlags`
- `redFlags`
- `documentChecklist`
- `advisorQuestions`
- `opportunities`
- `disclaimers`
- `statementLedger`

### 3. Arbeitslosmeldung als Mini-Modul ergänzt

Die fachlich wichtige Trennung zwischen:
- **Arbeitsuchendmeldung** und
- **Arbeitslosmeldung**

wurde operativ ergänzt, ohne den Flow unnötig aufzublähen.

Dafür wurden im Frage-/Regellayer kleine Ergänzungen eingebaut:
- `already_unemployed_now`
- `unemployment_registered`

Damit wird die Arbeitslosmeldung nur dann aktiviert, wenn sie wirklich fallrelevant ist.

---

## Was im Projektordner inzwischen vorhanden ist

### Kern-Dokumente
- `README.md`
- `V2-DECISIONS.md`
- `PROJECT-STATUS.md`

### Schema-/Regelbasis
- `questions.schema.json`
- `rules.schema.json`
- `result.schema.json`

### Analyse- und Spezifikationslayer
- `REFERENZFAELLE.md`
- `RESULT-COPY.md`
- `RESULT-MAPPING.md`
- `MAPPING-RENDERING-V1.md`
- `MAPPING-CONFIG-V1.json`
- `GOLDEN-OUTPUTS.md`

### Fixture-/Beispiel-Layer
- `examples/*.result.json`
- `examples/inputs/*.input.json`
- `examples/PAIRS.md`
- `examples/README.md`

### Technischer Arbeitsstand
- `src/demo.js`
- `src/engine/`
- `src/adapters/`
- `src/flow/questionnaireFlow.js`
- `test-fixtures.js`
- `test-normalize-input.js`
- `test-product-tiers.js`
- `test-render-product-tiers.js`
- `test-questionnaire-flow.js`

---

## Was bereits konkret erarbeitet wurde

### A. Referenzfälle

Es gibt dokumentierte Referenzfälle mit realistischen Beispielantworten und Soll-Output.

Kernfälle:
1. Kündigung erhalten, schon arbeitslos, Arbeitslosmeldung offen
2. Aufhebungsvertrag liegt vor, noch nicht unterschrieben
3. Kündigung plus Sonderfallindikator

### B. Golden Outputs

Für die Kernfälle liegen vollständige Soll-Ergebnisse im Format von `result.schema.json` vor.

### C. JSON-Fixtures für End-to-End-Prüfung

Aktuell existieren **6 Fixture-Paare** aus Input und Expected Result.

#### Kernfälle
1. `01-kuendigung-arbeitslosmeldung-offen`
2. `02-aufhebungsvertrag-nicht-unterschrieben`
3. `03-kuendigung-sonderfall`

#### Edge Cases
4. `04-vertrag-bereits-unterschrieben`
5. `05-kuendigung-nur-angekuendigt`
6. `06-mehrere-eingaenge-gleichzeitig`

Diese Paare bilden aktuell den wichtigsten Prüfrahmen für Mapping, Priorisierung und Guardrails.

### D. Copy-Layer

Mit `RESULT-COPY.md` liegt ein klarer Antwortbaustein-Layer vor für:
- `deadline-first`
- `alg1-risk-first`
- `contract-do-not-sign`
- `special-case-review`
- `prepare-advice`

### E. Mapping-/Rendering-Spezifikation

Mit `RESULT-MAPPING.md`, `MAPPING-RENDERING-V1.md` und `MAPPING-CONFIG-V1.json` ist beschrieben:
- wie Rule-Effects auf Result-Blöcke gemappt werden
- wie `primaryTrack` gewählt wird
- wie Konflikte priorisiert werden
- wie Short / Standard / Advice gerendert werden sollen

---

## Inhaltlich stabiler aktueller Stand

Folgende inhaltliche Entscheidungen sind aktuell belastbar und sollten nicht leichtfertig wieder geöffnet werden:

- **Arbeitsuchendmeldung ersetzt nicht Arbeitslosmeldung**
- **ohne schriftliche Kündigung keine künstliche 3-Wochen-Panik**
- **noch nicht unterschriebener Vertrag priorisiert häufig `contract-do-not-sign`**
- **bereits unterschriebener Vertrag wird nicht mehr als Standard-Stopp-Fall behandelt**
- **Sonderfallindikatoren erzeugen Eskalation statt Pseudo-Klarheit**
- **`do-not-use-yet` bleibt unterdrückt und gehört höchstens ins Ledger**
- keine Aussagen zu Abfindungswahrscheinlichkeit, sicherer Unwirksamkeit oder garantiefreien Leistungsfolgen

---

## Was technisch bereits angedeutet oder vorhanden ist

Der Projektstand deutet darauf hin, dass ein kleiner Engine-/Render-Layer bereits existiert oder begonnen wurde.

Aus `PROJECT-STATUS.md`-Historie und vorhandenen Dateien ergibt sich:
- Fixture-Testskript `test-fixtures.js` ist vorhanden
- `src/demo.js` ist vorhanden
- Mapping-/Rendering-V1 ist dokumentiert
- ein Engine-Layer unter `src/engine/` wurde laut vorherigem Status bereits angelegt

Wichtig:
Der fachliche Dokumentationsstand ist aktuell **sicher belastbar**. Der technische Runtime-Stand sollte beim nächsten Block kurz gegengeprüft werden, damit Doku und tatsächlicher Code nicht auseinanderlaufen.

---

## Was aktuell gut abgedeckt ist

### Fachlogik
- Fristen
- Agentur-Meldungen
- Vertragsrisiken
- Sonderfall-Eskalation
- Unterlagen-/Beratungsvorbereitung

### Prüfbasis
- Kernfälle
- wichtige Randfälle
- Guardrails
- Track-Priorisierung
- strukturierte Sollbilder

### MVP-Fokus
- klar
- eng
- operativ
- ohne Conversion-Drift

---

## Offene Lücken / bekannte Grenzen

### 1. Noch kein final integrierter UI-/API-Anschluss
Der Projektstand ist stark in Logik und Spezifikation, aber noch nicht als echtes Produkt-Interface verdrahtet.
Ein erster technischer Fragebogen-Flow für Launch V1 ist jetzt jedoch im Runtime-Layer angelegt (`src/flow/questionnaireFlow.js`) und respektiert die Mindest-Screenlogik aus `FLOW-CONTRACT-V1.md`.

### 2. Render-Tests sind da, aber noch nicht final als textuelle Golden Snapshots ausgebaut
Es gibt jetzt harte Render-Assertions für:
- short
- standard
- advice

Was noch fehlt, sind echte **textuelle Golden Outputs pro View**, falls später stärker auf Copy-Stabilität getestet werden soll.

### 3. Technischer Code-Stand muss weiter gegen Doku stabil gehalten werden
Ein wichtiger Drift wurde bereits sichtbar gemacht und bereinigt:
- `test-fixtures.js` deckt jetzt alle 6 Fixture-Paare ab
- der Mehrfachfall (`06-mehrere-eingaenge-gleichzeitig`) wurde in der Engine explizit nachgezogen

Trotzdem bleibt dieser Bereich sensibel, weil Mehrfachfälle und Sonderlagen schnell wieder auseinanderlaufen können.

### 4. Keine tiefe Datumslogik
Fristen sind aktuell inhaltlich priorisiert und textlich beschrieben, aber noch nicht als konkrete Datumsberechnung mit Sonderregeln modelliert.

### 5. Einige juristische Randlagen bleiben bewusst außerhalb des MVP
Zum Beispiel:
- tiefe Freistellungslogik
- Anfechtungslogik bereits unterschriebener Verträge
- echte Wirksamkeitsprüfung von Kündigungen
- echte Sonderkündigungsschutz-Subsumtion
- Abfindungsberechnung oder Verhandlungssimulation

Das ist bewusst so und aktuell richtig.

---

## Aktueller Zwischenstand zu meinem Todo-Bereich

### Erledigt in diesem Arbeitsblock
- Arbeitslosmeldung als Mini-Modul in V2 integriert
- Referenzfälle dokumentiert
- Soll-Outputs für Kernfälle formuliert
- Result-Copy-Layer vorbereitet
- Result-Mapping-Spec ergänzt
- Golden Outputs dokumentiert
- Golden Outputs als JSON-Fixtures angelegt
- Input-Fixtures für End-to-End-Paare angelegt
- 3 zusätzliche Edge-Case-Fixtures ergänzt
- Projektstatus jetzt auf Gesamtstand aktualisiert
- Mini-Testkonzept dokumentiert (`TEST-CONCEPT.md`)
- Execution Board angelegt (`EXECUTION-BOARD.md`)
- `test-fixtures.js` auf alle 6 Fixture-Paare erweitert
- Render-Assertions für `short`, `standard` und `advice` ergänzt
- Engine für den Mehrfachfall `06-mehrere-eingaenge-gleichzeitig` nachgeschärft
- Externe Copy-Review sauber in Copy-Layer, Engine, Fixtures und Golden Outputs integriert
- Launch-Hardening-Rahmen angelegt: `LAUNCH-HARDENING-V1.md`, `E2E-REALITY-CHECK-V1.md`, `MONITORING-ANALYTICS-V1.md`, `SOFT-LAUNCH-CHECKLIST-V1.md`
- `buildQuestionnaireResultView` liefert jetzt telemetry-taugliche Summary-Felder für `ready`, `incomplete`, `render-fallback` und `error`

### Mein aktueller offener Todo-Bereich

#### Priorität 1
- **Datumslogik-MVP definieren und in die Engine schneiden**
- festlegen, welche Fristen für den ersten Launch konkret berechnet statt nur textlich beschrieben werden

#### Priorität 2
- optional echte **textuelle Golden Snapshots** definieren für:
  - Short View
  - Standard View
  - Advice View

#### Priorität 3
- erst danach leichten **UI-/API-Adapter** bauen oder konkretisieren

### Was ich gerade ausdrücklich nicht priorisieren würde
- neues Schema-Design
- Conversion-/Funnel-Themen
- tiefe Rechtslogik
- komplexe Datumsengine
- UI-Polish vor Teststabilität

---

## Empfohlene nächste Reihenfolge

1. Datumslogik-MVP für kritische Fristen definieren
2. danach optional textuelle Golden Snapshots pro View ergänzen
3. erst dann Adapter oder UI-Anschluss
4. UI-Polish bewusst hinter Test- und Integrationsstabilität halten

Das ist der sauberste Weg, um Drift zu vermeiden.

---

## Relevante Wiedereinstiegsdateien

Wenn jemand später wieder einsteigt, zuerst in dieser Reihenfolge lesen:

1. `projects/kuendigungs-kompass-mvp/PROJECT-STATUS.md`
2. `projects/kuendigungs-kompass-mvp/V2-DECISIONS.md`
3. `projects/kuendigungs-kompass-mvp/RESULT-MAPPING.md`
4. `projects/kuendigungs-kompass-mvp/RESULT-COPY.md`
5. `projects/kuendigungs-kompass-mvp/examples/PAIRS.md`
6. `projects/kuendigungs-kompass-mvp/MAPPING-RENDERING-V1.md`
7. danach erst technische Runtime-Dateien

---

## Letzte relevante Fortschritte in diesem Block

- Arbeitslosmeldungs-Modul ergänzt
- Referenzfälle und Copy-Layer ergänzt
- Mapping-Spec ergänzt
- Golden Outputs ergänzt
- JSON-Fixtures für Kernfälle ergänzt
- Edge-Case-Fixtures ergänzt
- Projektstatus auf Gesamtstand gebracht

## Kurzfazit

Der Kündigungs-Kompass ist aktuell **kein loses Ideenpaket mehr**, sondern ein klar strukturierter MVP-Baustein mit:
- stabiler V2-Logik,
- definierten Guardrails,
- Beispiel- und Fixture-Landschaft,
- dokumentierter Mapping-/Rendering-Idee,
- und klaren nächsten Schritten.

Der nächste echte Hebel ist jetzt **Test- und Render-Stabilität**, nicht weitere fachliche Ausdehnung.
ehnung.
