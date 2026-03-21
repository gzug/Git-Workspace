# Kündigungs-Kompass MVP — Datumslogik V1

Stand: 2026-03-21

## Ziel
Die Datumslogik soll für den MVP **konkreten Nutzwert** bringen, ohne in eine fehleranfällige Volljuristen-Engine auszuarten.

## Grundsatz
Nur Fristen mit **klarer, direkt modellierbarer Datengrundlage** werden in V1 konkret berechnet.
Alles andere bleibt bewusst als textliche Priorisierungslogik sichtbar.

## V1 — konkret berechnen
### 1. Kündigungsschutzklage / 3-Wochen-Frist
Wenn `termination_access_date` vorhanden ist:
- berechne das Ziel-Datum als `termination_access_date + 21 Tage`
- zeige dieses Datum zusätzlich zur allgemeinen Formulierung an

Warum diese Frist zuerst:
- fachlich zentral
- Datengrundlage im Modell vorhanden
- hoher Nutzwert
- relativ geringe Interpretationskomplexität im Vergleich zu anderen Fristen

## V1 — noch nicht konkret berechnen
### Arbeitsuchendmeldung
Bleibt vorerst textlich, weil für die exakte Berechnung zusätzliche Fallkontexte fehlen, z. B.:
- wann die Kenntnis des Endes genau vorlag
- ob die 3-Monats-Grenze schon unterschritten war
- welcher Auslöser operativ als Startzeitpunkt gilt

### Arbeitslosmeldung
Bleibt vorerst textlich/regelbasiert, weil der MVP hier aktuell eher den Pflichtcharakter und die Priorität markieren soll als einen komplizierten Fristenkalender aufzubauen.

## Render-Regel V1
Konkrete Datumsberechnung wird nicht als juristische Gewissheit verkauft, sondern als **operative Orientierung**.

Beispielton:
- "regelmäßig innerhalb von 3 Wochen nach Zugang der schriftlichen Kündigung"
- ergänzt um: "ausgehend vom angegebenen Zugangsdatum: bis DD.MM.YYYY"

## Guardrails
- keine Sonderfall-Ausnahmen stillschweigend einrechnen
- keine Feiertags-/Wochenendlogik behaupten, solange sie nicht sauber modelliert ist
- konkrete Datumsangaben nur dort, wo die Eingabedaten dafür ausreichen
- keine scheinexakten Daten für Arbeitsuchend- oder Arbeitslosmeldung aus unvollständigen Inputs ableiten

## Done-When
- Engine kann für Fälle mit `termination_access_date` ein konkretes Klageprüfungsdatum ausgeben
- bestehende Fixtures und Render-Tests bleiben grün
- die konkrete Datumsangabe erscheint als Zusatz zur allgemeinen Fristlogik, nicht als Ersatz
