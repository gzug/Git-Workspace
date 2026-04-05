# Kündigungs-Kompass MVP — Snapshot Anchors V1

Stand: 2026-04-05
Status: aktiv

## Ziel
Nicht viele Fälle snapshotten, sondern die wenigen, die echte Launch-Drift früh sichtbar machen.

## Anker 1 — Klagefrist mit Wochenendverschiebung
### Fallbild
- schriftliche Kündigung liegt vor
- `termination_access_date` ist belastbar
- Fristende landet rechnerisch auf Samstag oder Sonntag
- kein automatischer Landesfeiertags-Sonderfall

### Warum dieser Fall
- prüft die heikelste konkrete Datumslogik im MVP
- deckt Scheingenauigkeit besonders früh auf
- ist fachlich riskanter als reine Copy-Drift

### Snapshot soll prüfen
- konkretes Klagefrist-Datum wird gezeigt
- Wochenendverschiebung ist sichtbar korrekt
- kein übergriffiger Feiertagsautomatismus
- Ton bleibt ruhig, nicht alarmistisch

## Anker 2 — Beide Agentur-Schritte offen, aber logisch getrennt
### Fallbild
- Kündigung erhalten
- Ende des Arbeitsverhältnisses steht kurz bevor oder ist bereits erreicht
- Arbeitsuchendmeldung offen
- Arbeitslosmeldung offen oder sofort prüfbedürftig

### Warum dieser Fall
- hier driften Produktlogik und Copy besonders leicht ineinander
- zeigt, ob Arbeitsuchendmeldung und Arbeitslosmeldung sauber getrennt bleiben
- verhindert, dass ein Agentur-Schritt den anderen still ersetzt

### Snapshot soll prüfen
- beide Meldungen bleiben als getrennte Schritte erkennbar
- keine künstliche Verschmelzung zu einem Sammel-CTA
- keine falsche Datumspräzision bei unklarer Arbeitsuchend-Frist
- Arbeitslosmeldung wird als eigener zeitkritischer Schritt sichtbar, wenn sie wirklich fällig ist

## Anker 3 — Unknown-/Pflichtfeld-Fall mit konservativem Verhalten
### Fallbild
- mindestens ein routing- oder datumsrelevantes Pflichtfeld fehlt oder ist `unknown`
- fachlich wäre ein vorschnelles `ready` riskant
- kein harter technischer Fehler, aber unvollständige Datengrundlage

### Warum dieser Fall
- schützt gegen Happy-Path-Selbsttäuschung
- prüft, ob das System Unklarheit ehrlich zeigt statt sie weichzurechnen
- ist zentral für Launch-Reife, weil echte Nutzereingaben selten sauber vollständig sind

### Snapshot soll prüfen
- Unsicherheit wird sichtbar begründet
- kein falsches konkretes Fristdatum wird erzeugt
- `incomplete` oder konservativer Hinweis kippt nicht in einen zu glatten Ready-Pfad
- nächster sinnvoller Schritt bleibt klar benannt

## Testregel
Wenn diese drei Anker stabil sind, ist der MVP nicht fertig — aber deutlich launch-näher.
Wenn einer dieser drei Anker driftet, ist Launch-Hardening noch nicht belastbar genug.