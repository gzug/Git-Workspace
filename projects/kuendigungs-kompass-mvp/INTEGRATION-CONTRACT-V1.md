# Kündigungs-Kompass MVP — Integration Contract V1

Stand: 2026-03-21
Status: Vorarbeit für Block 3

## Ziel
Den Übergang von Fragebogen → Engine → Produktausgabe so klar definieren, dass der nächste Implementierungsblock ohne neue Produktdebatten starten kann.

---

## 1. Input-Vertrag
### Erwarteter Input an die Engine
Die Engine erwartet ein flaches `answers`-Objekt.

Beispiel:
```json
{
  "case_entry": "termination_received",
  "termination_access_date": "2026-03-18",
  "employment_end_date": "2026-03-20",
  "jobseeker_registered": false,
  "already_unemployed_now": true,
  "unemployment_registered": false,
  "agreement_present": false,
  "release_status": "no",
  "special_protection_indicator": ["none_known"],
  "documents_secured": ["termination_letter", "employment_contract"],
  "primary_goal": "protect_deadlines"
}
```

### Verantwortlichkeit des Input-Adapters
Der Adapter vor der Engine übernimmt:
- Typnormalisierung
- Multi-Select → Arrays
- leere Werte sauber als `null` / `[]`
- keine impliziten `false`, wenn die Antwort in Wahrheit unbekannt ist
- Datumswerte als ISO-Strings

### Nicht Aufgabe des Input-Adapters
- fachliche Priorisierung
- Track-Wahl
- Produktstufenlogik
- Copy-Entscheidungen

---

## 2. Engine-Vertrag
### Engine liefert
Ein vollständiges `result` im V2-Schema.

Kernfunktion:
```js
buildResult(answers)
```

Optional intern:
- `evaluateRules(answers)`
- `selectPrimaryTrack(...)`
- `renderResult(...)`

### Engine-Verantwortung
- Regelmatch
- Priorisierung
- Result-Building
- Guardrails im Ergebnis
- Deadline-/Risk-/Red-Flag-Struktur

### Nicht Aufgabe der Engine
- Paywall-Logik
- Preview/Basis/Upgrade-Sichtbarkeit
- finaler Frontend-Text je Produktstufe
- Payment / Session / Funnel-Steuerung

---

## 3. Output-/Product-Adapter
### Aufgabe
Aus einem vollständigen `result` eine produktspezifische Sicht ableiten.

### Empfohlene Signatur
```js
projectResultForTier(result, { tier: 'preview' | 'base' | 'upgrade' })
```

Alternative bei rein textlicher Ausspielung:
```js
renderProductResult(result, { tier: 'preview' | 'base' | 'upgrade' })
```

### Verhalten je Stufe
#### `preview`
- Headline
- erste TopAction
- erste kritische Deadline oder erstes Risiko
- kurzer Hinweis

#### `base`
- Headline + Situation
- TopActions
- Deadlines
- RiskFlags
- RedFlags
- DocumentChecklist
- Disclaimers

#### `upgrade`
- alles aus Base
- plus `synthesisDecision.reasoning`
- plus `advisorQuestions`
- plus vorsichtige `opportunities`

---

## 4. Render-Vertrag
### Technischer Grundsatz
Die Render-Schicht darf **keine neue Fachlogik erfinden**.
Sie darf:
- auswählen
- kürzen
- umsortieren innerhalb der freigegebenen Struktur
- zu Klartext formulieren

Sie darf nicht:
- Track-Wahl überschreiben
- Red Flags entfernen, wenn sie in Base/Upgrade vorgesehen sind
- Guardrails weichzeichnen

---

## 5. Fehler- und Fallback-Vertrag
### Wenn Input unvollständig ist
- Engine soll möglichst sinnvolle Red Flags oder fehlende Angaben markieren
- Adapter soll keine stillen Defaults erfinden

### Wenn Produktstufe unbekannt ist
- harter Fehler oder definierter Fallback auf `base`
- aber nicht stillschweigend auf Preview degradieren

### Wenn Rendern fehlschlägt
- strukturiertes Result behalten
- Text-Render als austauschbare Schicht behandeln

---

## 6. Minimale Implementierungsreihenfolge für Block 3
1. `projectResultForTier()`
2. Preview-Output
3. Base-Output
4. Upgrade-Output
5. erst danach UI-/Frontend-Anschluss

---

## 7. Done-When
- Input-, Engine- und Output-Verantwortung sind sauber getrennt
- Dev kann Adapter bauen, ohne neue Produktfragen zu erfinden
- Produktstufen sind technisch abbildbar auf dem bestehenden Result-Modell
