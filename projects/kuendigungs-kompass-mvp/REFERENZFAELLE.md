# Kündigungs-Kompass — Referenzfälle V2

Ziel dieser Referenzfälle: den operativen V2-Stand gegen realistische Nutzerantworten spiegeln, ohne neue Scope-Baustellen aufzumachen.

## Kurzfazit vorab

- Das V2-Schema trägt die drei Kernfälle bereits weitgehend.
- Für die fachlich wichtige Unterscheidung **Arbeitsuchendmeldung vs. Arbeitslosmeldung** war ein kleines Zusatzmodul sinnvoll.
- Größere Schema-Erweiterungen sind für diesen Block **nicht nötig**.

---

## Referenzfall 1 — Kündigung erhalten, schon arbeitslos, Arbeitslosmeldung noch offen

### Realistische Beispielantworten

```json
{
  "case_entry": "termination_received",
  "termination_access_date": "2026-03-18",
  "employment_end_date": "2026-03-20",
  "jobseeker_registered": false,
  "already_unemployed_now": true,
  "unemployment_registered": false,
  "agreement_present": false,
  "release_status": "no",
  "special_protection_indicator": ["none_known"],
  "documents_secured": ["termination_letter", "employment_contract"],
  "primary_goal": "protect_deadlines"
}
```

### Soll-Output auf Basis von `result.schema.json`

- `caseSnapshot.headline`: Fokus auf **Fristen und Agentur-Meldungen sofort absichern**
- `caseSnapshot.riskLevel`: `high`
- `synthesisDecision.primaryTrack`: `deadline-first`
- `synthesisDecision.confidenceClass`: `mvp-reliable`

#### Erwartete `topActions`
1. **Arbeitslosmeldung sofort prüfen oder nachholen**
2. **Arbeitsuchendmeldung ebenfalls sofort prüfen/nachholen**
3. **3-Wochen-Frist für Kündigungsschutzklage prüfen**

#### Erwartete `deadlines`
- Arbeitslosmeldung: spätestens am ersten Tag der Arbeitslosigkeit, jetzt sofort prüfen
- Arbeitsuchendmeldung: spätestens 3 Monate vorher, sonst innerhalb von 3 Tagen nach Kenntnis
- Kündigungsschutzklage: regelmäßig innerhalb von 3 Wochen nach Zugang der schriftlichen Kündigung
- die beiden Agentur-Meldungen bleiben als getrennte Pflichtschritte sichtbar und dürfen nicht zu einem Sammelblock verschmelzen

#### Erwartete `riskFlags`
- Fristversäumnis bei Agentur-Meldungen
- Verlust von Handlungsoptionen bei verspäteter Klageprüfung

#### Erwartete `redFlags`
- keine zwingend erforderlich, solange kein Sonderfallindikator vorliegt

#### Erwartete `documentChecklist`
- Kündigungsschreiben
- Arbeitsvertrag
- Lohnunterlagen

---

## Referenzfall 2 — Aufhebungsvertrag liegt vor, noch nicht unterschrieben, Ende in 2 Monaten

### Realistische Beispielantworten

```json
{
  "case_entry": "settlement_offered",
  "employment_end_date": "2026-05-31",
  "jobseeker_registered": false,
  "already_unemployed_now": false,
  "agreement_present": true,
  "agreement_already_signed": false,
  "release_status": "yes_irrevocable",
  "special_protection_indicator": ["none_known"],
  "documents_secured": ["agreement_draft", "employment_contract", "salary_docs"],
  "primary_goal": "protect_alg1"
}
```

### Soll-Output auf Basis von `result.schema.json`

- `caseSnapshot.headline`: Fokus auf **ALG-I-Risiko und Vertragsunterschrift stoppen**
- `caseSnapshot.riskLevel`: `high`
- `synthesisDecision.primaryTrack`: `contract-do-not-sign`
- `synthesisDecision.confidenceClass`: `mvp-reliable`

#### Erwartete `topActions`
1. **Aufhebungsvertrag nicht vorschnell unterschreiben**
2. **Arbeitsuchendmeldung sofort prüfen oder nachholen**
3. **Unterlagen und Fragen für Beratung bündeln**

#### Erwartete `deadlines`
- Arbeitsuchendmeldung mit 3-Monate-/3-Tage-Logik
- kein Arbeitslosmeldungs-Deadline-Block, weil noch nicht arbeitslos

#### Erwartete `riskFlags`
- Sperrzeit-/Ruhensrisiko bei einvernehmlicher Beendigung
- Freistellung beendet nicht automatisch alle To-dos

#### Erwartete `redFlags`
- keine zwingend, solange nichts unterschrieben und kein Schutzindikator vorliegt

#### Erwartete `documentChecklist`
- Vertragsentwurf
- Arbeitsvertrag
- Lohnunterlagen
- Infos zu Freistellung / Urlaub / Restansprüchen

---

## Referenzfall 3 — Kündigung plus Sonderfallindikator, Nutzer unsicher bei Schutzlage

### Realistische Beispielantworten

```json
{
  "case_entry": "termination_received",
  "termination_access_date": "2026-03-19",
  "employment_end_date": "2026-06-30",
  "jobseeker_registered": true,
  "already_unemployed_now": false,
  "agreement_present": false,
  "release_status": "unknown",
  "special_protection_indicator": ["pregnancy_or_maternity", "unsure"],
  "documents_secured": ["termination_letter", "employment_contract", "salary_docs"],
  "primary_goal": "prepare_advice"
}
```

### Soll-Output auf Basis von `result.schema.json`

- `caseSnapshot.headline`: Fokus auf **Sonderfall sofort separat prüfen**
- `caseSnapshot.riskLevel`: `high`
- `synthesisDecision.primaryTrack`: `special-case-review`
- `synthesisDecision.confidenceClass`: `cautious-check`

#### Erwartete `topActions`
1. **3-Wochen-Frist für Kündigungsschutzklage prüfen**
2. **Sonderfall / Schutzlage individuell prüfen lassen**
3. **Unterlagen für Beratung vollständig sichern**

#### Erwartete `deadlines`
- Kündigungsschutzklage innerhalb von 3 Wochen nach Zugang prüfen
- Arbeitsuchendmeldung nicht als To-do, weil schon erledigt

#### Erwartete `riskFlags`
- möglicher Sonderkündigungsschutz / heikler Sonderfall
- Freistellungs-/Kontextfragen nur vorsichtig einordnen

#### Erwartete `redFlags`
- möglicher besonderer Schutz
- Empfehlung zur qualifizierten Beratung / Anwalt / Gewerkschaft

#### Erwartete `documentChecklist`
- Kündigungsschreiben
- Arbeitsvertrag
- Lohnunterlagen
- ggf. Nachweise zum Schutzstatus

---

## Schema-Check

### Reicht das bestehende V2-Schema?

**Ja, fast vollständig.**

Die Referenzfälle lassen sich mit den vorhandenen Blöcken sauber abbilden:
- `synthesisDecision` für die Leitlogik
- `topActions` für konkrete Priorisierung
- `deadlines` für Fristen
- `riskFlags` und `redFlags` für Risiko vs. Eskalation
- `statementLedger` für fachliche Hygiene

### Minimale Nachschärfung, die wirklich nötig war

Nicht das Result-Schema, sondern der **Frage-/Regel-Layer** brauchte eine kleine Ergänzung:
- `already_unemployed_now`
- `unemployment_registered`

Damit wird die Arbeitslosmeldung als **eigenes Mini-Modul** nur dann aktiviert, wenn sie tatsächlich relevant ist.
Gleichzeitig bleibt die Arbeitsuchendmeldung ein getrennter Schritt und wird nicht still durch die spätere Arbeitslosmeldung ersetzt.

### Was bewusst nicht ergänzt wurde

- keine neue Result-Sektion nur für Agentur-Themen
- keine gesonderte Conversion- oder Funnel-Logik
- keine Detailmodellierung zu Sperrzeit, Ruhen, Anfechtung oder Sonderkündigungsschutz
