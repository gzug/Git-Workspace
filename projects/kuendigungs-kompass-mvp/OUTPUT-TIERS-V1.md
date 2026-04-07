# Kündigungs-Kompass — Output Tiers V1

Stand: 2026-03-21
Status: Block 2 Arbeitsentscheid

## Ziel
Die Trennung zwischen Preview, Basis und Upgrade wird direkt an den vorhandenen Result-Blöcken festgemacht.
So bleibt die spätere Integration einfach und die Produktgrenze ist nicht bloß Copy, sondern strukturell klar.

---

## 1. Prinzip
Die Engine baut weiterhin **ein vollständiges internes Result-Objekt**.
Die Produktstufen entscheiden nur, **welche Blöcke daraus sichtbar werden** und in welcher Tiefe.

Vorteile:
- keine doppelte Fachlogik
- keine zweite Regelwelt für Paid vs. Free
- Produktgrenze liegt im Rendering / Exposure, nicht im Kernmodell

---

## 2. Stufe A — Preview
### Zweck
- schnelle Orientierung
- sinnvolle Kaufvorschau
- kein künstliches Aushungern

### Sichtbar
- `caseSnapshot.headline`
- erste `topActions[0]`
- erste kritische Deadline **oder** erstes Risiko
- 1 kurzer Vertrauenshinweis

### Versteckt
- vollständige `topActions`
- vollständige `deadlines`
- `documentChecklist`
- `advisorQuestions`
- `opportunities`
- `statementLedger`

### Produktregel
Preview zeigt genug, um den Wert zu verstehen, aber nicht genug, um das volle Produkt zu ersetzen.

---

## 3. Stufe B — Basis (29 €)
### Zweck
Eigenständig nützliche Hauptauswertung.

### Sichtbar
- `caseSnapshot`
- `topActions`
- `deadlines`
- `riskFlags`
- `redFlags`
- `documentChecklist`
- `disclaimers`

### Optional sichtbar
- `synthesisDecision.reasoning` **nicht standardmäßig**
- `opportunities` nur wenn sie sehr klar und knapp sind; für Launch V1 eher weglassen

### Versteckt
- `advisorQuestions`
- `statementLedger`
- interne Debug-/Export-Strukturen

### Kernversprechen der Basis
- Was ist jetzt wichtig?
- Welche Frist oder Gefahr darf ich nicht übersehen?
- Welche Unterlagen sollte ich sofort sichern?

---

## 4. Stufe C — Upgrade (+49 €)
### Zweck
Bessere Umsetzungs- und Gesprächsvorbereitung.

### Sichtbar
Alles aus der Basis plus:
- `synthesisDecision.reasoning`
- `advisorQuestions`
- `opportunities` (vorsichtig, nur wenn sinnvoll)

### Zusätzlich im Rendering erlaubt
- stärkere Strukturierung als Beratungs-Spickzettel
- kompakter "Warum dieser Fokus"-Block
- ruhigere Tiefeneinordnung der nächsten Schritte

### Weiterhin versteckt
- `statementLedger`
- rohe Rule-/Effect-Daten
- interne Klassen oder Guardrail-Mechanik

### Kernversprechen des Upgrades
- nicht nur wissen, was zu tun ist
- sondern deutlich besser vorbereitet in den nächsten Termin, das nächste Gespräch oder die nächste Entscheidung gehen

---

## 5. Was für die erste Integration daraus folgt
### Render-Modi
Für die technische Integration reichen zunächst drei Produkt-Render-Modi:
1. `preview`
2. `base`
3. `upgrade`

Diese Modi können intern auf dem bestehenden Result aufsetzen.

### Minimale technische Vertragsidee
```js
presentResult(result, { tier: 'preview' | 'base' | 'upgrade' })
```

Oder, falls textlich gerendert wird:
```js
renderProductResult(result, { tier: 'preview' | 'base' | 'upgrade' })
```

---

## 6. Klare Produktgrenze je Feld
| Feld / Block | Preview | Basis | Upgrade |
|---|---:|---:|---:|
| `caseSnapshot.headline` | ja | ja | ja |
| `caseSnapshot.situation` | eher nein | ja | ja |
| `synthesisDecision.reasoning` | nein | nein | ja |
| `topActions` | nur 1 | ja | ja |
| `deadlines` | max 1 | ja | ja |
| `riskFlags` | max 1 | ja | ja |
| `redFlags` | nein | ja | ja |
| `documentChecklist` | nein | ja | ja |
| `advisorQuestions` | nein | nein | ja |
| `opportunities` | nein | eher nein | optional ja |
| `disclaimers` | 1 kurz | ja | ja |
| `statementLedger` | nein | nein | nein |

---

## 7. Guardrails für die Produkttrennung
- Basis darf **nicht absichtlich unbrauchbar** gemacht werden
- Upgrade darf **nicht bloß längere Copy** sein
- Preview darf Wert zeigen, aber nicht die komplette Nutzleistung gratis ausrollen
- `statementLedger` bleibt intern, auch im Upgrade

---

## 8. Done-When
- jede Produktstufe ist an konkrete Result-Blöcke gebunden
- Adapter und Frontend können ohne neue Fachentscheidungen darauf aufbauen
- Paid-Grenze ist technisch renderbar, nicht bloß marketingseitig behauptet
