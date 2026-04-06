# HANDOFF.md — Übergabe an Coder

Status: **V1-Spezifikation, noch nicht aktiviert**

## Pflichtformat für Übergaben
Jeder Task an Coder soll mindestens diese Felder haben:

### 1. Ziel
Was soll am Ende sichtbar anders / besser / richtig sein?

### 2. Scope
Was ist Teil des Auftrags?

### 3. Betroffene Dateien
Konkrete Pfade oder klarer Dateibereich.

### 4. Nicht-Ziele
Was soll ausdrücklich **nicht** angefasst werden?

### 5. Akzeptanzkriterien
Woran erkennt Main eindeutig, dass der Slice fertig ist?

### 6. Tests / Validierung
Welche Tests sollen laufen?
Welche Sichtprüfung reicht, wenn es kein Testthema ist?

### 7. Rückgabeformat
Standard:
- Ergebnis
- geänderte Dateien
- Tests / Validierung
- offene Punkte / Risiken

---

## Minimales Übergabe-Template

```md
# Task für Coder

## Ziel
...

## Scope
...

## Betroffene Dateien
- ...
- ...

## Nicht-Ziele
- ...
- ...

## Akzeptanzkriterien
- ...
- ...

## Tests / Validierung
- ...

## Rückgabeformat
- kurze Ergebniszusammenfassung
- Dateiliste
- Teststatus
- offene Punkte
```

---

## Beispiel — guter Task-Schnitt

```md
## Ziel
Mache die sichtbaren Agentur-Labels im Kündigungs-Kompass action-orientiert.

## Scope
Nur sichtbare Labels / Rendertexte für Arbeitsuchendmeldung und Arbeitslosmeldung anpassen.
Tests, Fixtures und Snapshots konsistent nachziehen.

## Betroffene Dateien
- src/engine/index.js
- src/adapters/renderProductResult.js
- test-render-product-tiers.js
- test-fixtures.js
- test-launch-hardening-anchors.js
- examples/render-snapshots/*

## Nicht-Ziele
- keine Änderung der Fristenlogik
- keine Änderung der Routing-Logik
- keine neue Produktcopy außerhalb dieses Begriffsbereichs

## Akzeptanzkriterien
- Preview nutzt handlungsorientierte Labels
- Trennung arbeitssuchend vs. arbeitslos bleibt fachlich erhalten
- Tests laufen grün

## Tests / Validierung
- relevanter kompletter KK-Testlauf
```

## Beispiel — schlechter Task-Schnitt

Schlecht wäre:
- "Mach mal das Frontend schöner"
- "Bring die Website auf Launch-Niveau"
- "Räum da mal ein bisschen auf"

Warum schlecht:
- kein Scope
- keine Abbruchkante
- keine Review-Basis
- lädt stille Scope-Drift ein

## Eskalationsformat zurück an Main
Wenn Coder stoppen muss:

```md
Stop nötig.

Ursache:
...

Auswirkung:
...

Was ich sicher sagen kann:
...

Was Main entscheiden muss:
...

Bester nächster Schritt:
...
```

## Review-Hinweis für Main
Main reviewt gegen:
- Scope-Treue
- unnötige Seiteneffekte
- Teststatus
- fachliche / produktseitige Drift
