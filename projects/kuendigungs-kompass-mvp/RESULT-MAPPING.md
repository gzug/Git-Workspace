# Kündigungs-Kompass MVP — Result Mapping

Ziel dieses Blocks: aus Antworten, Regeln und `result.schema.json` eine belastbare **Rendering-Logik für den MVP** ableiten.

Kein Code. Keine Engine-Architektur. Nur die operative Logik, die später implementiert werden soll.

---

## 1. Grundprinzip

Der MVP arbeitet in 4 Schritten:

1. **Antworten einsammeln**
2. **Regeln auslösen**
3. **Leitentscheidung (`synthesisDecision.primaryTrack`) bilden**
4. **Result-Objekt + Copy-Layer rendern**

Wichtig: Nicht jede ausgelöste Regel wird 1:1 sichtbar. Der Output muss **priorisieren, verdichten und entdoppeln**.

---

## 2. Zielbild für die Pipeline

### Input
- Nutzerantworten aus `questions.schema.json`

### Zwischenebene
- ausgelöste Rule-Effects aus `rules.schema.json`

### Output
- strukturiertes Ergebnis nach `result.schema.json`
- sprachliche Ausgabe nach `RESULT-COPY.md`

---

## 3. Mapping von Rule-Effects auf Result-Felder

## `immediateAction` → `topActions`

Mapping:
- `payload.label` → `topActions[].label`
- `payload.why` oder `payload.description` → `topActions[].why`
- `payload.priority` → `topActions[].priority`
- `payload.timing` → optional `topActions[].timing`
- `payload.statementClass` → `topActions[].statementClass`

Regel:
- Falls mehrere Actions denselben Zweck haben, nur die **klarste Nutzerformulierung** behalten.
- Maximal **3 TopActions** im Standard-Output.

## `warning` → meist `riskFlags`, in Ausnahmefällen `topActions`

Regel:
- Wenn die Aussage vor allem ein Risiko beschreibt → `riskFlags`
- Wenn die Aussage eine klare Handlungsanweisung ist, z. B. „nicht unterschreiben“ → zusätzlich oder stattdessen in `topActions`

Beispiel:
- „Nicht vorschnell unterschreiben“ sollte im MVP **als TopAction sichtbar** sein, nicht nur als abstrakte Warnung.

## `deadlineAlert` → `deadlines`

Mapping:
- `payload.label` → `deadlines[].label`
- `payload.timing` → `deadlines[].timing`
- `payload.description` → `deadlines[].note`
- Rule-Severity → `deadlines[].importance`
- `payload.statementClass` → `deadlines[].statementClass`

Severity-Mapping:
- `critical` → `critical`
- `high` → `high`
- `medium|low` → `medium`

## `riskFlag` → `riskFlags`

Mapping:
- `payload.label` → `riskFlags[].label`
- `payload.description` → `riskFlags[].description`
- Rule-Severity → `riskFlags[].severity`
- `payload.statementClass` → `riskFlags[].statementClass`

## `manualReview` → `redFlags`

Mapping:
- `payload.label` → `redFlags[].label`
- `payload.description` oder `payload.escalateIf` → `redFlags[].whyEscalated`
- Standardisierte Eskalation → `redFlags[].recommendedEscalation`

Standardisierte Eskalationsformulierung:
- „Qualifizierte individuelle Prüfung mit Anwalt, Gewerkschaft oder passender Beratungsstelle“

## `documentPrompt` → `documentChecklist`

Regel:
- Rule-Effekt kann generisch sein.
- Konkrete Dokumentliste soll zusätzlich aus **Antworten + Fallsituation** entstehen.

## `advisorQuestion` → `advisorQuestions`

Direktes Mapping, aber:
- max. **3–5 Fragen**
- keine Duplikate
- auf Falllogik priorisieren

## `opportunityFlag` → `opportunities`

Direktes Mapping mit Zurückhaltung.
Nur anzeigen, wenn:
- keine kritischeren Punkte verdrängt werden
- Aussageklasse `cautious-check` sauber sichtbar bleibt

## `disclaimer` → `disclaimers` oder `statementLedger.notUsedYet`

Regel:
- `mvp-reliable` / `cautious-check` → `disclaimers`
- `do-not-use-yet` → nicht prominent rendern, sondern in `statementLedger.notUsedYet`

---

## 4. Bildung der `synthesisDecision`

Die Leitentscheidung darf nicht frei formuliert werden. Sie braucht eine kleine Priorisierungslogik.

## Prioritätsreihenfolge

### Track 1 — `special-case-review`
Wenn mindestens eines gilt:
- `manualReview` wegen Sonderfall / Schutzindikator ausgelöst
- unterschriebener Vertrag plus unklare Folgen
- Schutzstatus unklar und Fristdruck hoch

Dann immer Vorrang vor Standard-Optimierung.

### Track 2 — `contract-do-not-sign`
Wenn gilt:
- Vertrag liegt vor
- noch nicht unterschrieben

Und kein stärkerer Sonderfall-Track darüber liegt.

### Track 3 — `alg1-risk-first`
Wenn gilt:
- fehlende Arbeitsuchendmeldung oder Arbeitslosmeldung
- vertragliche Mitwirkung mit ALG-I-Risiko
- finanzielle Nachteile sind gerade das dominanteste operative Risiko

### Track 4 — `deadline-first`
Wenn gilt:
- Kündigung ist zugegangen
- Fristthemen sind aktiv
- kein Vertrags- oder Sonderfallhebel ist vorrangig

### Track 5 — `prepare-advice`
Fallback, wenn:
- keine harte Frist dominiert
- kein Vertrag akut bremst
- kein Sonderfall Vorrang hat
- Beratungsvorbereitung gerade der sinnvollste nächste Schritt ist

---

## 5. Bildung von `caseSnapshot`

## `headline`
Nicht roh aus Regeln zusammensetzen.
Sondern:
- primär aus `primaryTrack`
- sekundär aus dem dringendsten Effekt

Beispiele:
- `deadline-first` → „Jetzt zuerst Fristen und Meldungen absichern“
- `contract-do-not-sign` → „Nichts vorschnell unterschreiben“
- `special-case-review` → „Dein Fall sollte nicht als Standardfall behandelt werden“

## `situation`
Kurzbeschreibung aus Kernantworten:
- Falltyp
- Status Agentur-Meldung
- Vertragsstatus
- Sonderfallhinweis

Formel:
- 1 Satz reicht
- kein Rechtsjargon
- keine Mehrdeutigkeit, wenn Fakten fehlen

## `riskLevel`
Vereinfachte Logik:
- `high`, wenn kritische Deadline oder kritisches Risiko oder Red Flag vorliegt
- `medium`, wenn nur mittlere Risiken / Vorbereitungsdruck bestehen
- `low`, nur wenn weder Fristdruck noch klare Risiken aktiv sind

Im aktuellen MVP werden die meisten echten Fälle operativ bei `medium` oder `high` landen.

---

## 6. Bildung der `documentChecklist`

Nicht nur aus Rules, sondern fallbezogen.

### Basislogik

#### Immer relevant bei Kündigung
- Kündigungsschreiben
- Arbeitsvertrag
- Lohnunterlagen

#### Zusätzlich relevant bei Vertrag
- Aufhebungs-/Abwicklungsvertrag oder Entwurf

#### Zusätzlich relevant bei Freistellung / Restansprüchen
- Freistellungsregelung
- Infos zu Urlaub / Überstunden / offenen Ansprüchen

#### Zusätzlich relevant bei Sonderfall
- Nachweise oder Unterlagen zum Schutzstatus, soweit vorhanden

### Status-Mapping
- in Antworten vorhanden → `already-secured`
- offensichtlich relevant, aber nicht vorhanden → `secure-now`
- hilfreich, aber nicht kritisch → `optional`

---

## 7. Deduplizierung und Priorisierung

Der MVP darf nicht alles zeigen, was fachlich wahr ist.
Er muss zeigen, was **jetzt handlungsrelevant** ist.

## Reihenfolge im Ergebnis

1. `headline`
2. `topActions`
3. `deadlines`
4. `riskFlags`
5. `redFlags`
6. `documentChecklist`
7. `advisorQuestions`
8. `opportunities`
9. `disclaimers`

## Harte Grenzen
- `topActions`: max. 3
- `deadlines`: max. 3
- `riskFlags`: max. 3
- `redFlags`: max. 2
- `advisorQuestions`: max. 5
- `opportunities`: max. 1 im MVP

---

## 8. Standardisierte Priorisierung für wiederkehrende Konflikte

### Konflikt: Vertrag liegt vor + Arbeitsuchendmeldung fehlt
Priorität:
1. nicht unterschreiben
2. Arbeitsuchendmeldung prüfen/nachholen
3. Unterlagen/Fragen bündeln

### Konflikt: Kündigung zugegangen + schon arbeitslos + Arbeitslosmeldung fehlt
Priorität:
1. Arbeitslosmeldung
2. Arbeitsuchendmeldung
3. Klagefrist prüfen

### Konflikt: Sonderfallindikator + Kündigung zugegangen
Priorität:
1. Klagefrist sichern
2. Sonderfall prüfen lassen
3. Unterlagen vollständig machen

---

## 9. Was die spätere Implementierung nicht tun soll

- nicht jeden Rule-Text direkt in den Nutzeroutput kippen
- nicht mehrere fast identische Agentur-Hinweise nebeneinander anzeigen
- nicht `statementLedger` mit Nutzertext verwechseln
- nicht aus `cautious-check` harte Aussagen machen
- nicht aus `do-not-use-yet` sichtbare Versprechen bauen

---

## 10. Operative Empfehlung

Für die technische Umsetzung reicht als nächster Schritt:

1. **ein kleines internes Mapping-Dokument** wie dieses
2. **3–5 Golden Outputs** auf Referenzfall-Basis
3. erst dann Rendering oder Prompt-Bausteine produktiv verdrahten

Nicht vorher in UI-Details abtauchen.
