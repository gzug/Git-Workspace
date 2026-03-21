# Kündigungs-Kompass — Execution Board

Stand: 2026-03-21
Status: aktiv

## Kurzdiagnose
Der Kündigungs-Kompass ist fachlich stark vorbereitet, aber noch nicht launchfähig.
Die Hauptlücken liegen aktuell in **vollständiger Testhärtung**, **konkreter Datumslogik**, **Produktintegration** und **Launch-Ops**.

---

## Block 1 — Core Stabilization
**Owner-Rollen:** Logic Architect, Dev/Engine, QA
**Ziel:** Engine, Fixtures und Render-Logik technisch belastbar machen.

### Task 1.1 — Mini-Testkonzept festziehen
- Status: erledigt
- Priorität: P0
- Ziel:
  - festlegen, welche Felder strikt stabil sein müssen
  - Copy-Drift von Logikfehlern trennen
  - Render-Reihenfolge absichern
- Done-When:
  - Testregeln sind als Dokument vorhanden
  - die Regeln lassen sich direkt in Fixture-/Render-Tests übersetzen

### Task 1.2 — Pair-6-Testlücke schließen
- Status: erledigt
- Priorität: P0
- Befund:
  - `examples/PAIRS.md` dokumentiert 6 Paare
  - `test-fixtures.js` prüft aktuell nur 5
  - Pair 6 schlägt fachlich gegen die aktuelle Engine aus
- Done-When:
  - Pair 6 ist im automatischen Testlauf enthalten
  - Abweichung ist entweder bewusst neu definiert oder durch Code/Fixture bereinigt

### Task 1.3 — Render-Tests ergänzen
- Status: erledigt
- Priorität: P1
- Ziel:
  - `short`, `standard`, `advice` gegen Mindestregeln absichern
- Done-When:
  - für jeden View existieren harte Assertions
  - Reihenfolge und Guardrails sind abgesichert

### Task 1.4 — Datumslogik-MVP definieren
- Status: erledigt
- Priorität: P1
- Ziel:
  - textliche Fristpriorisierung um konkrete MVP-relevante Datumslogik ergänzen
- Done-When:
  - Engine kann relevante Fristdaten für Kernfälle konsistent berechnen oder markieren
  - Tests decken mindestens die Kernpfade ab

### Task 1.5 — Doku ↔ Runtime Drift bereinigen
- Status: erledigt
- Priorität: P0
- Aktueller Befund:
  - bei Pair 6 weicht die Engine deutlich vom dokumentierten Sollbild ab
- Done-When:
  - dokumentierter Projektstand, Fixtures und Runtime zeigen dieselbe operative Logik

---

## Block 2 — Product Output
**Owner-Rollen:** Product, Copy/UX, Risk Reviewer
**Ziel:** Ergebnis für echte Nutzer verständlich und vertrauenswürdig machen.

### Task 2.1 — Ergebnisstruktur V1 finalisieren
- Status: in Arbeit
- Priorität: P0
- Done-When:
  - Headline, Einordnung, To-dos, Fristen, Risiken, Unterlagen und Disclaimer sind final geordnet

### Task 2.2 — Copy-Layer schärfen
- Status: offen
- Priorität: P1
- Done-When:
  - jeder Track hat klare, ruhige und konsistente Nutzertexte

### Task 2.3 — Free/Paid-Grenze definieren
- Status: offen
- Priorität: P1
- Done-When:
  - Basis-Auswertung und Upgrade sind inhaltlich sauber getrennt

---

## Block 3 — Integration
**Owner-Rollen:** Dev/Integration, Frontend/Funnel
**Ziel:** aus Spec und Engine einen echten Produktflow machen.

### Task 3.1 — Input-Adapter bauen
- Status: offen
- Priorität: P0

### Task 3.2 — Output-Adapter bauen
- Status: offen
- Priorität: P0

### Task 3.3 — Fragebogen-Flow implementieren
- Status: offen
- Priorität: P1

### Task 3.4 — Ergebnisansicht implementieren
- Status: offen
- Priorität: P1

### Task 3.5 — Fehler- und Fallback-Handling
- Status: offen
- Priorität: P1

---

## Block 4 — Launch Hardening
**Owner-Rollen:** QA, Product, Ops
**Ziel:** kontrolliert live-fähig werden.

### Task 4.1 — End-to-End-Realitätscheck
- Status: offen
- Priorität: P0

### Task 4.2 — Monitoring und Error Logging
- Status: offen
- Priorität: P1

### Task 4.3 — Minimal-Analytics
- Status: offen
- Priorität: P2

### Task 4.4 — Soft-Launch-Checkliste und Rollback
- Status: offen
- Priorität: P0

---

## Aktueller Fokus
1. Product Output finalisieren
2. Free/Paid-Grenze und Offer-Logik sauber entscheiden
3. danach Input-/Output-Adapter vorbereiten
4. UI-Polish weiter hinter Stabilität halten
