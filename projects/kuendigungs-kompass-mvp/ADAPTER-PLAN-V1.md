# Kündigungs-Kompass MVP — Adapter Plan V1

Stand: 2026-03-21
Status: Block 3 Vorarbeit

## Ziel
Den ersten Implementierungsschnitt so klein halten, dass daraus schnell produktionsnahe Integrationscode entstehen kann.

---

## 1. Erster technischer Schnitt
Nicht sofort Frontend bauen.
Zuerst drei kleine Adapter-Schichten:

1. `normalizeQuestionnaireInput(rawInput)`
2. `projectResultForTier(result, { tier })`
3. `renderProductResult(projectedResult, { tier })`

Damit entsteht ein klarer Pfad:
```text
Fragebogen / API Input
→ normalizeQuestionnaireInput
→ buildResult
→ projectResultForTier
→ renderProductResult
→ Frontend / API Response
```

---

## 2. Adapter 1 — Input Normalization
### Aufgabe
Fragebogen-/Form-Input in ein Engine-taugliches `answers`-Objekt überführen.

### Muss können
- leere Strings abfangen
- Multi-Select zu Arrays machen
- Checkbox-/Boolean-Werte normieren
- Datumsfelder als ISO-Strings weiterreichen
- unbekannte Werte nicht still in `false` verwandeln

### Nicht tun
- keine Track-Entscheidung
- keine Produktstufenlogik
- keine Copy

---

## 3. Adapter 2 — Result Projection
### Aufgabe
Aus dem vollständigen Result die produktspezifische Sicht ableiten.

### Signatur-Vorschlag
```js
projectResultForTier(result, { tier: 'preview' | 'base' | 'upgrade' })
```

### Muss können
- für `preview` stark kürzen
- für `base` Hauptauswertung freigeben
- für `upgrade` zusätzliche Tiefe sichtbar machen
- interne Felder wie `statementLedger` unterdrücken

---

## 4. Adapter 3 — Product Render
### Aufgabe
Die projektierten Daten in produktnahe Text- oder UI-Blöcke übersetzen.

### Signatur-Vorschlag
```js
renderProductResult(projected, { tier: 'preview' | 'base' | 'upgrade' })
```

### Muss können
- Reihenfolge konsistent halten
- Copy-Tier sauber anwenden
- keinen neuen Fachinhalt erfinden

---

## 5. Empfohlene Dateistruktur für Block 3
```text
src/
  adapters/
    normalizeInput.js
    projectResultForTier.js
    renderProductResult.js
```

Optional später:
```text
src/
  presenters/
    preview.js
    base.js
    upgrade.js
```

Aber für den ersten Block lieber kompakt bleiben.

---

## 6. Erste technische Done-When-Kriterien
### Input Normalization
- rohe Formdaten werden stabil in `answers` übersetzt
- keine stillen Bedeutungsverschiebungen durch Defaults

### Result Projection
- Preview/Base/Upgrade folgen exakt `OUTPUT-TIERS-V1.md`
- `statementLedger` bleibt intern

### Product Render
- Reihenfolge und Blocktiefe folgen `RESULT-COPY-V2.md`
- Output bleibt ruhig, klar und nicht überladen

---

## 7. Nächster praktischer Schritt
Als Erstes `projectResultForTier()` bauen.

Warum genau das zuerst:
- kleinster sauberer Hebel
- macht die Produktgrenze direkt testbar
- reduziert späteren UI-/Frontend-Streit erheblich
