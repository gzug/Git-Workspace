# Kündigungs-Kompass – MVP-Struktur

Dieses Verzeichnis enthält die erste Datenbasis für den MVP des **Kündigungs-Kompass**.

## Dateien

- `questions.schema.json` – Struktur und Beispiel-Fragen für den 2–3-Minuten-Fragebogen
- `rules.schema.json` – einfache Regelbasis für Risiken, Fristen, Warnhinweise, Chancen und nächste Schritte
- `result.schema.json` – Struktur für die persönliche Auswertung und den priorisierten Plan

## Wie die Dateien zusammenspielen

1. Der Nutzer beantwortet adaptive Fragen aus `questions.schema.json`.
2. Die Antworten werden gegen Regeln aus `rules.schema.json` ausgewertet.
3. Daraus entsteht ein personalisierter Output in der Form von `result.schema.json`.

## Produktlogik im MVP

Der MVP soll **keine Rechtsberatung** simulieren, sondern:

- Sofortmaßnahmen sichtbar machen
- kritische Fristen priorisieren
- typische Fehler verhindern
- relevante Chancen wie Weiterbildung oder Förderthemen markieren
- auf Beratungsgespräche vorbereiten

## Beispiel-Flow

### Fall
Nutzer hat einen **Aufhebungsvertrag** vorliegen und ist **noch nicht arbeitssuchend gemeldet**.

### Erwartete Logik
- `questions` erfassen Vertragslage, Meldestatus, Enddatum und Ziele.
- `rules` setzen einen **kritischen Risikoflag** für vorschnelle Unterschrift und einen **Sofortschritt** für die Meldung.
- `result` priorisiert:
  1. Arbeitsuchendmeldung prüfen/nachholen
  2. Aufhebungsvertrag nicht vorschnell unterschreiben
  3. Unterlagen und Fragen für Agentur / Anwalt / Gewerkschaft vorbereiten

## Annahmen dieser V1

- Fokus nur auf Deutschland
- Fokus nur auf Arbeitnehmer:innen
- MVP deckt Kündigung erhalten und Aufhebungsvertrag angeboten ab
- komplexe Sonderfälle werden nur als Prüfhinweis markiert
- Preis-/Funnel-Logik ist bewusst noch nicht in diesen Dateien modelliert
