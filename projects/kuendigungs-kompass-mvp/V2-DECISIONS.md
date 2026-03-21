# Kündigungs-Kompass MVP — V2 Decisions

## Was entschieden wurde

1. **Flow-V2 ist deadline-first statt feature-first.**
   Der MVP startet nicht mehr mit breitem Kontext, sondern mit den wenigen Fragen, die sofort Fristen, ALG-I-Risiken und Vertragsgefahren aktivieren.

2. **Regeln werden in drei Aussageklassen getrennt.**
   - `mvp-reliable` = belastbar genug für den MVP
   - `cautious-check` = nur als vorsichtiger Prüfhinweis
   - `do-not-use-yet` = vorerst nicht in Nutzerkommunikation ausspielen

3. **Die Synthese bekommt einen expliziten Entscheidungsanker.**
   Das Ergebnis soll nicht nur sammeln, sondern einen `primaryTrack` festlegen, z. B. `deadline-first`, `alg1-risk-first`, `special-case-review`.

4. **Abfindung/Conversion bleiben außerhalb des Kernmodells.**
   Kein Scope-Drift in Richtung Verhandlungssimulation, Erfolgsversprechen oder Funnel-Logik.

5. **Sonderfälle werden nicht „mitgelöst“, sondern eskaliert.**
   Hinweise auf besonderen Schutz, unterschriebene Verträge oder unklare Schutzlagen erzeugen Red Flags bzw. Manual Review statt Pseudo-Sicherheit.

## Offene Risiken

- **Arbeitslosmeldung vs. Arbeitsuchendmeldung** ist fachlich wichtig, aber im aktuellen Frageset nur indirekt modelliert. Für den nächsten Block sauber ergänzen, ohne den Flow aufzublähen.
- **Freistellung** ist für den MVP nur grob als Kontext erfasst. Detaillogik zu widerruflich/unwiderruflich, Urlaub, Anrechnung etc. bewusst noch nicht modelliert.
- **Sonderkündigungsschutz** ist nur als Indikator erfasst, nicht als verlässliche Rechtsprüfung.
- **Abwicklungsvertrag vs. Aufhebungsvertrag** wird operativ zusammengeführt. Für spätere Präzision kann die Unterscheidung relevant werden.
- **Bildungsgutschein** bleibt bewusst nachrangig. Nur Chance, kein Kernversprechen.

## Neues V2-Datenmodell

### questions.schema.json
- `flowVersion`
- Fragen mit `stage`, `category`, `decisionRole`, `summaryUse`, `askIf`, optional `redFlagIfMissing`
- Flow-Stufen: `entry`, `triage`, `deadline-check`, `contract-check`, `risk-check`, `supporting-context`, `goals`

### rules.schema.json
- `rulesVersion`
- Regeln mit `stage`, `outcomeType`, `ruleClass`
- Effects mit `statementClass` und `evidenceSource`
- Neue Wirkungstypen: `immediateAction`, `deadlineAlert`, `manualReview`, `documentPrompt`, `advisorQuestion`

### result.schema.json
- `resultVersion`
- `caseSnapshot`
- `synthesisDecision` als explizite Leitentscheidung
- getrennte Blöcke für `topActions`, `deadlines`, `riskFlags`, `redFlags`, `documentChecklist`
- `statementLedger` trennt belastbar / vorsichtiger Prüfhinweis / vorerst nicht verwenden

## Änderungen an den drei Dateien

### questions.schema.json
- von einfacher Fragenliste auf **flow-orientierte Entscheidungsfragen** umgebaut
- Fokus auf: schriftliche Kündigung, Zugang, Enddatum, Arbeitsuchendmeldung, Vertragslage, Unterschrift, Sonderfallindikatoren, Unterlagen, Primärziel
- Conversion-/Nice-to-have-Fragen bewusst nicht aufgenommen

### rules.schema.json
- von generischen Effekten auf **steuerbare V2-Entscheidungslogik** erweitert
- explizit modelliert: Fristschutz, ALG-I-Risiko, Vertragswarnung, Sonderfall-Eskalation, Dokumentenprompt, Opportunity nur vorsichtig
- `do-not-use-yet` für Abfindungsversprechen als Guardrail eingebaut

### result.schema.json
- von Listen-Output auf **entscheidungsorientiertes Ergebnisbild** umgestellt
- zentrale Neuerung: `synthesisDecision`
- zusätzliche Red-Flag-Ebene und Aussage-Ledger für fachliche Hygiene

## Fachliche Kernprüfung / Red-Flag-Prüfung zentraler Aussagen

### Belastbar für MVP
- **Arbeitsuchendmeldung:** möglichst sofort, spätestens 3 Monate vor Ende des Arbeitsverhältnisses; bei später Kenntnis innerhalb von 3 Tagen. Quelle: Bundesagentur für Arbeit.
- **Arbeitsuchendmeldung ersetzt nicht Arbeitslosmeldung.** Quelle: Bundesagentur für Arbeit.
- **Kündigungsschutzklage:** regelmäßig 3 Wochen ab Zugang der schriftlichen Kündigung. Quelle: § 4 KSchG; bestätigt auch auf BA-Seite.
- **Mitwirkung an der Beendigung (z. B. Aufhebungsvertrag) kann Folgen für Arbeitslosengeld / Sperrzeit haben.** Quelle: Bundesagentur für Arbeit.

### Vorsichtiger Prüfhinweis
- **Freistellung ändert nicht automatisch alle Pflichten**, aber die konkrete Rechtsfolge hängt am Einzelfall.
- **Besonderer Schutz / Sonderkündigungsschutz** darf nur als Eskalationshinweis laufen, nicht als Feststellung.
- **Bildungsgutschein** nur als mögliche Anschlusschance; Voraussetzungen sind individuell und beratungsgebunden.

### Vorerst nicht verwenden
- Abfindungshöhen, Erfolgswahrscheinlichkeiten oder Verhandlungschancen.
- Pauschale Aussagen zur Wirksamkeit einer Kündigung.
- Konkrete Rechtsfolgen bereits unterschriebener Verträge ohne Einzelfallprüfung.

## Empfehlung für den nächsten Block

1. **Arbeitslosmeldung** sauber als eigenes, aber kurzes Modul ergänzen.
2. **Result-Texte / Copy-Layer** auf Basis des V2-Schemas schreiben.
3. **Beispieldatensätze** für 3 Kernfälle anlegen:
   - Kündigung erhalten, Frist offen
   - Aufhebungsvertrag vorliegend, noch nicht unterschrieben
   - Sonderfall / Schutzindikator → Eskalation
4. Danach erst technische Mapping-Logik oder UI diskutieren.
