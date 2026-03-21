# Kündigungs-Kompass MVP — Projektstatus

Stand: 2026-03-21

## Kurzstatus

Der Kündigungs-Kompass steht aktuell auf einem **operativ belastbaren V2-MVP-Zwischenstand**.

Der Kern ist nicht mehr nur Schema-Design, sondern bereits in vier Schichten angelegt:
- **Frage-/Entscheidungsmodell**
- **Regel- und Priorisierungslogik**
- **Result- und Copy-Layer**
- **erste Mapping-/Rendering- und Fixture-Struktur**

Das Projekt ist damit fachlich deutlich weiter als ein reines Konzept, aber noch **nicht als integriertes Produkt-Interface** angeschlossen.

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
- `test-fixtures.js`
- laut vorherigem Projektstand zusätzlich Engine-Layer unter `src/engine/`

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

### 2. Render-Snapshots für Endnutzertexte fehlen noch
Es gibt strukturierte Result-Fixtures, aber noch keine systematischen **textuellen Expected Outputs** pro View:
- short
- standard
- advice

### 3. Technischer Code-Stand muss gegen Doku stabil gehalten werden
Da parallel bereits technische Dateien existieren, muss beim nächsten Block geprüft werden:
- passt Runtime wirklich zu den neuen 6 Fixture-Paaren?
- deckt `test-fixtures.js` schon alle Fixtures ab?
- stimmt die aktuelle Track-Wahl mit den dokumentierten Golden Outputs überein?

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

### Mein aktueller offener Todo-Bereich

#### Priorität 1
- **Runtime/Engine gegen die 6 Fixture-Paare hart prüfen**
- `test-fixtures.js` auf den vollständigen Fixture-Stand bringen, falls Pair 6 oder neue Checks noch fehlen

#### Priorität 2
- **textuelle Render-Snapshots** definieren für:
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

1. bestehenden Code-/Engine-Stand kurz gegen Dokumentation prüfen
2. Fixture-Tests auf alle 6 Paare ziehen
3. Render-Snapshots für Short / Standard / Advice ergänzen
4. erst dann Adapter oder UI-Anschluss

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
