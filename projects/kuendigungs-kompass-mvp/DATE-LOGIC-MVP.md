# Kündigungs-Kompass MVP — Datumslogik V1

Stand: 2026-03-22

## Ziel
Die Datumslogik soll für den MVP **konkreten Nutzwert** bringen, ohne in eine fehleranfällige Volljuristen-Engine auszuarten.

## Grundsatz
Nur Fristen mit **klarer, direkt modellierbarer Datengrundlage** werden konkret berechnet.
Alles andere bleibt bewusst als textliche Priorisierungslogik oder konservativer Hinweis sichtbar.

## Leitregeln
- lieber ehrliche Unklarheit als falsche Präzision
- konkrete Daten nur bei ausreichender Datengrundlage
- Unsicherheit sichtbar machen, nicht verstecken
- keine individuellen Rechtsaussagen aus unvollständigen Daten ableiten

## V1 — konkret berechnen
### 1. Kündigungsschutzklage / 3-Wochen-Frist
Wenn `termination_access_date` belastbar vorhanden ist:
- berechne `termination_access_date + 21 Tage`
- wenn das Fristende auf Samstag oder Sonntag fällt: auf den nächsten Werktag verschieben
- bundeseinheitliche Feiertage dürfen berücksichtigt werden, wenn sie sicher modelliert sind
- bei möglichem Landesfeiertag: **nicht automatisch verschieben**, sondern Prüfhinweis ausgeben

### 2. Arbeitslosmeldung
Wenn das Ende des Arbeitsverhältnisses belastbar vorhanden ist:
- konkretes Datum für die Arbeitslosmeldung nur dort zeigen, wo die Regel ohne zusätzliche Unsicherheit ableitbar bleibt
- im Zweifel Pflichtcharakter textlich priorisieren statt falsche Genauigkeit erzeugen

## V1 — nicht oder nur konservativ berechnen
### Arbeitsuchendmeldung
Nicht aggressiv scheinpräzise berechnen, wenn unklar ist:
- wann die Kenntnis des Endes belastbar vorlag
- welcher Auslöser operativ gilt
- ob die 3-Monats-Schwelle bereits unterschritten war

Stattdessen:
- wenn sicher ableitbar → konkrete Frist
- sonst → relative Formulierung + klarer nächster Schritt

### Sperrzeit / Abfindung / Wirksamkeit / Klageerfolg
Nicht berechnen.
Nur konservative Hinweise oder explizite Grenzbenennung.

## Render-Regeln
### Bei vollständiger Datengrundlage
- konkretes Datum direkt im To-do und/oder Fristenblock zeigen
- keine unnötigen Unsicherheitsmarker

### Bei unvollständiger oder unsicherer Datengrundlage
- Grund der Unsicherheit nennen
- relative Formulierung oder Unvollständigkeits-Marker verwenden
- nächsten sinnvollen Schritt zeigen

## Beispielton
- „Ausgehend vom angegebenen Zugangsdatum: bis DD.MM.YYYY“
- „Für die genaue Frist fehlt noch das Zugangsdatum.“
- „Prüfe, ob an diesem Tag in deinem Bundesland ein Feiertag liegt.“

## Guardrails
- keine Sonderfall-Ausnahmen stillschweigend einrechnen
- keine Landesfeiertage ohne sichere Grundlage automatisch einrechnen
- keine konkreten Daten aus geschätzten Eingaben als Gewissheit darstellen
- keine scheinexakten Daten für Arbeitsuchend- oder Arbeitslosmeldung aus unvollständigen Inputs ableiten
- keine Aussagen zu KSchG, Abfindung, Sperrzeit oder Klageerfolg mit Scheingenauigkeit koppeln

## Test- und Drift-Schutz
Besonders absichern:
- Klagefrist-Berechnung bei belastbarem Zugangsdatum
- Verhalten bei unsicherem oder fehlendem Zugangsdatum
- Wochenendverschiebung
- bundeseinheitliche Feiertage, falls modelliert
- keine automatische Landesfeiertags-Verschiebung ohne Prüfhinweis

## Done-When
- Engine kann für belastbare Kündigungsfälle ein konkretes Klagefrist-Datum ausgeben
- Wochenendlogik ist sauber modelliert
- Feiertagsverhalten ist konservativ statt scheinpräzise
- Arbeitsuchendmeldung wird nicht aggressiv überberechnet
- bestehende Fixtures und Render-Tests bleiben grün
- die konkrete Datumsangabe erscheint als Zusatz zur allgemeinen Fristlogik, nicht als Ersatz
