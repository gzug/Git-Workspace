# Kündigungs-Kompass MVP — Leitentscheidungen

Stand: 2026-03-22
Status: aktiv

## Zweck
Diese Datei hält nur die **noch geltenden Leitentscheidungen** fest, die für Mapping, Rendering, Guardrails und Launch-Reife wichtig sind.

## Geltende Kernentscheidungen
1. **Deadline-first statt feature-first.**
   Der MVP priorisiert Fristen, Meldungen, Guardrails und nächste Schritte vor Tiefe, Feature-Fläche oder Conversion.

2. **Sonderfälle werden eskaliert, nicht „mitgelöst“.**
   Red Flags und Schutzindikatoren erzeugen Eskalation oder konservative Prüfung statt Pseudo-Sicherheit.

3. **Basis muss vollständig handlungsfähig bleiben.**
   Fristen, To-do #1, Eskalationshinweise und Grenzbenennung gehören in die Basis — nie hinter Upgrade.

4. **Upgrade ergänzt Werkzeuge, nicht Basis-Wahrheit.**
   Saubere Upgrade-Kandidaten sind Export, personalisierte Dokumente, strukturierte Beratungsvorbereitung und spätere Erinnerungsfunktionen.

5. **Unknown ist sicherer als Raten.**
   Fehlende oder unsichere Inputs dürfen keine stillen `nein`-Defaults oder Standard-Tracks erzeugen, wenn daraus schädliches Fehlrouting entsteht.

6. **Keine Scheingenauigkeit bei juristisch riskanten Aussagen.**
   Keine sichere Aussage zu Wirksamkeit, Abfindung, Sperrzeit, Klageerfolg oder vergleichbaren Einzelfallthemen.

7. **Track-Explosion vermeiden.**
   Eigene Tracks nur bei fundamental anderer Fristenlogik oder primärer Handlungskette; alles andere sind Bausteine, Flags oder Guardrails.

## Derzeit relevante offene Spannungen
- Arbeitslosmeldung vs. Arbeitsuchendmeldung muss logisch und sprachlich sauber getrennt bleiben.
- Feiertags-/Wochenendlogik nur dort automatisieren, wo sie konservativ belastbar ist.
- Aufhebungsvertrag bereits unterschrieben bleibt vorerst Baustein-Variante statt dritter Volltrack.
- Freistellung bleibt in V1 relevant, aber nicht tief ausmodelliert.

## Nicht wieder aufreißen ohne guten Grund
- Fristdaten als Basis-Pflicht
- Eskalations-Block bei Red Flag als Basis-Pflicht
- keine Frist- oder Angst-Dringlichkeit als Upsell-Druckmittel
- keine KSchG-/Sperrzeit-/Abfindungs-Scheinsicherheit
- keine technischen Begriffe wie `primaryTrack`, `riskLevel`, `incomplete` in der UI

## Aktive Prüfkriterien für neue Entscheidungen
Eine neue Produktentscheidung ist nur sinnvoll, wenn sie mindestens eines davon verbessert:
- Routing-Sicherheit
- Fristen-Sicherheit
- Guardrail-Klarheit
- Launch-Reife
- echte Handlungsfähigkeit der Basis

Wenn sie nur mehr Text, mehr Feature-Fläche oder mehr Komplexität bringt, ist sie in V1 verdächtig.
