# Kündigungs-Kompass — Execution Plan

Stand: 2026-04-05
Status: aktiv

## Ausgangspunkt
Blöcke 1–3 sind im Wesentlichen durch. Der Engpass ist Launch Hardening:
- konservative Datumslogik
- saubere Trennung von Arbeitsuchendmeldung vs. Arbeitslosmeldung
- Drift-/Snapshot-Abdeckung
- Unknown-/Pflichtfeld-/Fallback-Härtung
- danach erst UI/API-/Soft-Launch-Anschluss

Der aktuelle Local-Worker-Test führt **nicht** zu einer sofort produktiven Delegationsroute über lokale Modelle. Deshalb wird der Plan nicht davon abhängig gemacht.

## Arbeitsprinzip für die nächste Strecke
- Main-Agent entscheidet, schneidet und nimmt fachkritische Endabnahme vor
- Delegation nur bei klar umrissenen, risikoarmen Blöcken
- lokale Modelle vorerst nicht als Standard-Arbeitspferd einplanen
- Projektfortschritt auf direkte Launch-Hardening-Hebel konzentrieren

## Jetzt → Nächste Schritte

### Phase 1 — Fristen- und Agentur-Logik härten
**Ziel:** die heikelsten fachlichen Driftfelder zuerst stabilisieren.

#### Main-Agent
1. `DATE-LOGIC-MVP.md` final auf konservative Aktivierungslogik prüfen
2. `RESULT-MAPPING.md` gegen die Trennung von Arbeitsuchendmeldung / Arbeitslosmeldung schärfen
3. Referenzfälle und Erwartungslogik gegen diese Trennung abgleichen
4. Guardrails für Unknown-/Pflichtfeldlogik explizit nachziehen

#### Delegierbar an Support-/Sub-Agenten
- strukturierte Diff-Prüfung: wo nennen Doku, Mapping, Referenzfälle und Copy die beiden Meldungen noch unsauber oder widersprüchlich?
- Vorschlagsliste für kleine, risikoarme Doku-Konsolidierungen

#### Nicht an lokale Modelle als Kernpfad geben
- finale juristisch sensible Formulierungsentscheidungen
- Fristenlogik-Festlegung
- Guardrail-Entscheidungen

### Phase 2 — Snapshot-/Drift-Abdeckung ausbauen
**Ziel:** wenige repräsentative Fälle statt breitem Testtheater.

#### Die 3 besten Ankerfälle
1. **Belastbares Zugangsdatum + Fristende am Wochenende**
   - prüft: Klagefrist-Berechnung + Wochenendverschiebung
2. **Kündigung erhalten, bereits arbeitslos, beide Agentur-Schritte offen**
   - prüft: saubere Trennung von Arbeitsuchendmeldung und Arbeitslosmeldung
3. **Unsicherer oder unvollständiger Fall mit fehlendem Pflichtfeld / Unknown**
   - prüft: konservatives Verhalten statt Scheingenauigkeit oder falschem Ready-Pfad

#### Main-Agent
- diese Anker fachlich definieren
- Snapshot-/Assertion-Ziele pro Fall festlegen
- Guardrail-Reihenfolge festziehen

#### Delegierbar an Coding-/Test-Agenten
- Snapshot-Testgerüste
- Assertion-Scaffolding
- Fixture-Dateien vorbereiten

### Phase 3 — Runtime- und Integrationshärtung
**Ziel:** reale Ergebniszustände robust halten.

#### Main-Agent
- prüfen, ob `ready` / `incomplete` / `render-fallback` / `error` fachlich sauber getrennt bleiben
- kontrollieren, dass unbekannte Tiers weiter sauber auf `base` zurückfallen
- prüfen, dass Red Flags nicht im Standardpfad untergehen

#### Delegierbar
- technische Testläufe und Fehlerfall-Scaffolds
- Sichtprüfung der telemetry-tauglichen Summary-Felder

### Phase 4 — Monitoring- und Soft-Launch-Vorbereitung
**Ziel:** Launch nicht blind fahren.

#### Main-Agent
- Monitoring-Minimum gegen aktuellen Runtime-Stand spiegeln
- Soft-Launch-Checkliste in echte Go/No-Go-Fragen übersetzen
- Stop-Signale für Frist-/Routing-Fehler scharf halten

#### Delegierbar
- Checklisten-Verdichtung
- technische Event-Feld-Prüfung
- Review auf Lücken zwischen Checkliste und Runtime-Metadaten

## Konkrete Reihenfolge für den nächsten produktiven Block
1. `RESULT-MAPPING.md` auf Agentur-Meldungs-Trennung schärfen
2. `REFERENZFAELLE.md` gegen diese Trennung und Unknown-/Pflichtfeldlogik spiegeln
3. 3 Drift-Ankerfälle als Test-/Snapshot-Ziele festziehen
4. erst dann Coding-/Fixture-/Snapshot-Umsetzung an delegierbare Agenten schneiden

## Delegationsmatrix
### Main-Agent behält
- Priorisierung
- Fristen-/Guardrail-Entscheidungen
- fachliche Endredaktion
- Launch-/Go-No-Go-Urteil

### Support-/Sub-Agenten können übernehmen
- Doku-Diffing
- Scaffolding für Tests / Snapshots
- Konsolidierungsentwürfe
- strukturierte Review-Listen

### Lokale Modelle vorerst nur optional / experimentell
- knappe Extraktion
- Rohtext-Verdichtung
- Entwurfslisten für klar abgegrenzte Nebentasks

Nicht als Standardpfad für:
- Fachlogik
- Fristenentscheidungen
- Risikoformulierung
- Launch-kritische Endoutputs

## Abbruchregel gegen Komplexitätsdrift
Wenn ein Local-Worker-Setup, Agent-Split oder Routing mehr Pflege kostet als der delegierte Nutzen bringt:
- zurück auf den einfacheren Pfad
- Main-Agent + klar geschnittene stabile Sub-Agenten bevorzugen

## Definition von Fortschritt
Fortschritt ist hier nicht mehr neue Fläche, sondern:
- weniger Drift
- konservativere Fristenlogik
- härtere Guardrails
- reproduzierbare Testanker
- klarere Launch-Entscheidbarkeit