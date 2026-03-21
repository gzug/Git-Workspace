# Kündigungs-Kompass MVP — E2E-Realitätscheck V1

Stand: 2026-03-21

## Ziel
Den gesamten Pfad **vom Rohinput bis zur nutzbaren Ergebnisansicht** unter realistischen MVP-Bedingungen gegenzuprüfen.

## Prüfebenen
1. Input-Normalisierung
2. Fragebogen-Flow / Missing-State
3. Engine / strukturierter Result-Build
4. Tier-Projektion (`preview`, `base`, `upgrade`)
5. Rendering / Fallback
6. Monitoring-taugliche Metadaten

---

## Pflichtfälle

### 1. Kündigung + Arbeitslosmeldung offen
Erwartung:
- `ready`
- Track `deadline-first`
- kritische Deadline vorhanden
- Agentur-Meldung bleibt sichtbar getrennt

### 2. Aufhebungsvertrag noch nicht unterschrieben
Erwartung:
- `ready`
- Track `contract-do-not-sign`
- keine weichgespülte Standard-Beruhigung
- Vertragsrisiko vor Nice-to-have

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
- Fokus auf Vorbereitung / frühe Agentur-Themen

### 6. Mehrfachfall
Erwartung:
- `ready`
- mehrerer Risikotreiber sichtbar
- keine pseudo-klare Einspurigkeit

### 7. Unvollständige Eingabe
Erwartung:
- `incomplete`
- fehlende Fragen konkret benannt
- nächster Screen bestimmbar

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

---

## Done-When
- diese Fälle sind durch Testcode oder klar reproduzierbare Demo-Aufrufe abgedeckt
- Ergebniszustände und Fehlermodi sind stabil
- Runtime, Doku und Fixtures laufen nicht auseinander
