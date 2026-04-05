# Kündigungs-Kompass MVP — E2E-Realitätscheck V1

Stand: 2026-03-22

## Ziel
Den gesamten Pfad **vom Rohinput bis zur nutzbaren Ergebnisansicht** unter realistischen MVP-Bedingungen gegenzuprüfen.

## Prüfebenen
1. Input-Normalisierung
2. Fragebogen-Flow / Missing-State
3. Engine / strukturierter Result-Build
4. Tier-Projektion (`preview`, `base`, `upgrade`)
5. Rendering / Fallback
6. Monitoring-taugliche Metadaten

## Pflichtfälle
### 1. Kündigung + Arbeitslosmeldung offen
Erwartung:
- `ready`
- Track `deadline-first`
- kritische Deadline vorhanden
- Arbeitsuchend- und Arbeitslosmeldung bleiben logisch getrennt

### 2. Aufhebungsvertrag noch nicht unterschrieben
Erwartung:
- `ready`
- Track `contract-do-not-sign`
- Vertragsrisiko vor Nice-to-have
- kein weichgespülter Standardpfad

### 3. Kündigung + Sonderfallindikator
Erwartung:
- `ready`
- Track `special-case-review`
- Red Flag sichtbar
- keine Standardisierung des Sonderfalls

### 4. Vertrag bereits unterschrieben
Erwartung:
- `ready`
- kein Track `contract-do-not-sign`
- Fokus auf Folgen / Fristen / Prüfung

### 5. Kündigung nur angekündigt
Erwartung:
- `ready`
- keine künstliche 3-Wochen-Panik
- Arbeitsuchendmeldung / Vorbereitung sichtbar
- Schriftform-Hinweis statt Scheinsicherheit

### 6. Mehrfachfall
Erwartung:
- `ready`
- mehrere Risikotreiber sichtbar
- keine pseudo-klare Einspurigkeit

### 7. Unvollständige Eingabe
Erwartung:
- `incomplete`
- fehlende Fragen konkret benannt
- nächster Screen bestimmbar
- Teilergebnis nur dort, wo fachlich vertretbar

### 8. Unbekannte Produktstufe
Erwartung:
- Fallback auf `base`
- Warning gesetzt
- keine harte Fehlersituation

### 9. Renderfehler
Erwartung:
- `render-fallback`
- strukturiertes Result bleibt erhalten
- Renderfehler wird sichtbar markiert

### 10. Invalides Input-Objekt
Erwartung:
- `error`
- klarer Error-Code
- kein stilles Weiterrechnen

## Zusätzliche Drift-Kritikfälle
Diese Pfade sind für Launch-Reife besonders wichtig:
- belastbares Zugangsdatum → konkretes Klagefrist-Datum
- unsicheres/fehlendes Zugangsdatum → kein falsches konkretes Datum
- Wochenende am Fristende → saubere Verschiebung
- möglicher Landesfeiertag → Prüfhinweis statt stiller automatischer Verschiebung
- Red Flag aktiv + fehlende Detailantwort → konservativer Eskalationspfad
- ungültige Datums- oder Bool-Eingaben → Normalisierung auf `null` und kontrollierter `incomplete`-Pfad statt falschem `ready`
- widersprüchliche Multi-Select-Kombinationen (`none_known` + echter Sonderfall, `none_yet` + konkrete Unterlagen) → konservativ entkoppeln statt still gemischt weiterzurechnen
- angekündigte Kündigung + versehentlich gesetztes Zugangsdatum → keine künstliche Klagefrist rechnen
- bereits unterschriebener Vertrag → Vertragsstatus intern konsistent halten, auch wenn Rohinput widersprüchlich kommt
- Arbeitslosmeldungs-Flag ohne echte aktuelle Arbeitslosigkeit → als irrelevanten Altwert neutralisieren statt mitschleppen
- reiner Vertragsfall ohne Kündigungs-Einstieg → kein stiller Klagefrist-Pfad nur wegen mitgeliefertem Zugangsdatum

## Testarten nach Risiko
### Snapshot-geeignet
- Fristen-Outputs
- zentrale Renderblöcke mit stabiler Copy-Struktur
- Mehrfachfälle mit Guardrail-Reihenfolge
- Trennung von Arbeitsuchendmeldung vs. Arbeitslosmeldung bei offenen Agentur-Schritten
- konservative Unknown-/Pflichtfeld-Fälle mit sichtbarer Unsicherheitsbegründung

### Assertion-geeignet
- Track-Wahl
- Fallback-Zustände
- Warning-Setzung
- Tier-Fallbacks
- konditionale Bausteinaktivierung

## Done-When
- diese Fälle sind durch Testcode oder klar reproduzierbare Demo-Aufrufe abgedeckt
- Routing-kritische Pfade wurden bewusst gesehen
- Ergebniszustände und Fehlermodi sind stabil
- Doku, Fixtures und Runtime laufen nicht auseinander
- Drift-anfällige Datums- und Red-Flag-Fälle sind nicht nur implizit, sondern aktiv abgesichert
