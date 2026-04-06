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
  - `examples/PAIRS.md` dokumentiert inzwischen 7 Paare
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
- Status: erledigt
- Priorität: P0
- Done-When:
  - Headline, Einordnung, To-dos, Fristen, Risiken, Unterlagen und Disclaimer sind final geordnet

### Task 2.2 — Copy-Layer schärfen
- Status: erledigt
- Priorität: P1
- Done-When:
  - jeder Track hat klare, ruhige und konsistente Nutzertexte

### Task 2.3 — Free/Paid-Grenze definieren
- Status: erledigt
- Priorität: P1
- Done-When:
  - Basis-Auswertung und Upgrade sind inhaltlich sauber getrennt

---

## Block 3 — Integration
**Owner-Rollen:** Dev/Integration, Frontend/Funnel
**Ziel:** aus Spec und Engine einen echten Produktflow machen.

### Task 3.1 — Input-Adapter bauen
- Status: erledigt
- Priorität: P0

### Task 3.2 — Output-Adapter bauen
- Status: erledigt
- Priorität: P0

### Task 3.3 — Fragebogen-Flow implementieren
- Status: erledigt
- Priorität: P1

### Task 3.4 — Ergebnisansicht implementieren
- Status: erledigt
- Priorität: P1
- Ergebnis:
  - produktseitiger Runtime-Orchestrator verbindet jetzt Flow → Normalisierung → Engine → Tier-Projektion → Rendering
  - `src/runtime/buildQuestionnaireResultView.js` liefert einen klaren View-State für `ready`, `incomplete`, `render-fallback` und harte Fehler

### Task 3.5 — Fehler- und Fallback-Handling
- Status: erledigt
- Priorität: P1
- Ergebnis:
  - unvollständige Fragebögen werden nicht still weitergerechnet, sondern mit fehlenden Fragen und nächstem Screen zurückgegeben
  - unbekannte Produktstufen fallen kontrolliert auf `base` zurück und markieren das als Warning
  - Renderfehler behalten das strukturierte Result als Fallback, statt die komplette Auswertung wegzuwerfen

---

## Block 4 — Launch Hardening
**Owner-Rollen:** QA, Product, Ops
**Ziel:** kontrolliert live-fähig werden.

### Task 4.1 — End-to-End-Realitätscheck
- Status: in Arbeit
- Priorität: P0
- Ergebnis bisher:
  - `E2E-REALITY-CHECK-V1.md` definiert die Pflichtfälle und Done-When-Kriterien
  - Runtime-Result-View-Tests decken zentrale Zustände bereits technisch ab

### Task 4.2 — Monitoring und Error Logging
- Status: in Arbeit
- Priorität: P1
- Ergebnis bisher:
  - `MONITORING-ANALYTICS-V1.md` definiert das MVP-Monitoring-Minimum
  - `buildQuestionnaireResultView` liefert jetzt eine telemetry-taugliche Summary für `ready`, `incomplete`, `render-fallback` und `error`

### Task 4.3 — Minimal-Analytics
- Status: in Arbeit
- Priorität: P2
- Ergebnis bisher:
  - Analytics-Scope auf wenige belastbare Runtime-Felder eingegrenzt
  - noch nicht an ein echtes Persistenz-/Event-System angeschlossen

### Task 4.4 — Soft-Launch-Checkliste und Rollback
- Status: in Arbeit
- Priorität: P0
- Ergebnis bisher:
  - `SOFT-LAUNCH-CHECKLIST-V1.md` und `LAUNCH-HARDENING-V1.md` angelegt
  - Go/No-Go- und Stop-Signale sind jetzt dokumentiert

---

## Aktueller Fokus
1. End-to-End-Anschluss zwischen Flow, Engine und Produktausgabe weiter härten
2. Monitoring-/Telemetry-Felder an den späteren UI/API-Anschluss andockbar halten
3. Render-Snapshots gezielt ausbauen, wo Copy-Stabilität kritisch ist
4. UI-Polish weiter hinter Stabilität halten

---

## Steuerformat
### Now
- Launch-Hardening-Exit nicht mehr implizit behandeln, sondern gegen `LAUNCH-HARDENING-DONE.md` und den ausführbaren Gate-Test prüfen
- Steering-Doku, Runtime, Fixtures, Snapshots und statisches Mockup eng synchron halten

### Next
- späteren UI/API-Anschluss so vorbereiten, dass Monitoring-/Telemetry-Felder sauber andocken können
- Frontend-/Mockup-Weiterbau erst gegen grünes Hardening-Gate priorisieren

### Risks
- Main-Agent bleibt zu stark im Executor-Modus statt früh genug zu delegieren
- Drift zwischen Research, Doku, Fixtures und Runtime kann bei Launch-Hardening wieder wachsen
- Tunnelmodus kann Delegations- und Review-Chancen zu spät sichtbar machen

### Delegated
- Research-Intake und Batch-Verdichtung an `CleanUp` vorgesehen
- Drift-/Integritätsprüfungen können mit `skills/driftguard/` vorbereitet werden
- klar geschnittene spätere Coding-Blöcke können an `skills/dev-coding-agent/` gehen

### Waiting
- weitere Research-Batches von Y. für Feinschliff und Gegenprüfung
