# Kündigungs-Kompass MVP — Mini-Testkonzept

Stand: 2026-03-21

## Ziel
Die Tests sollen **Logik-Drift früh sichtbar machen**, ohne bei jeder kleinen Copy-Änderung unnötig rot zu werden.

## 1. Was strikt stabil sein muss
Diese Felder gelten als **logikkritisch** und sollen in Fixture-Tests hart geprüft werden:

1. `resultVersion`
2. `synthesisDecision.primaryTrack`
3. `caseSnapshot.headline`
4. Kernreihenfolge der `topActions` (mindestens erste Aktion, bei kritischen Fällen die ersten 2–3)
5. Labels der kritischen `deadlines`
6. Trennung `riskFlags` vs `redFlags`
7. Guardrails:
   - keine `do-not-use-yet`-Aussagen im normalen Nutzertext
   - keine verbotenen Aussagen zu Abfindung, garantierter Wirksamkeit oder sicheren Erfolgswahrscheinlichkeiten

## 2. Was flexibel bleiben darf
Diese Bereiche dürfen sich sprachlich ändern, ohne automatisch als Logikfehler zu gelten:

- längere `why`-/Beschreibungstexte
- Detailformulierungen in `disclaimers`
- nichtkritische Reihenfolge untergeordneter Dokumente
- Ledger-Texte, solange die Klassenlogik intakt bleibt

## 3. Was als echter Logikfehler zählt
Ein Test soll als **fachlich rot** gelten, wenn mindestens eines davon passiert:

- der `primaryTrack` kippt ungewollt
- die falsche erste Priorität in `topActions` erscheint
- kritische Deadlines verschwinden oder inhaltlich falsch gruppiert werden
- Red Flags zu Risk Flags verwässern oder umgekehrt
- Guardrails im Nutzeroutput brechen

## 4. Fixture-Teststrategie
### Stufe A — strukturstabile Assertions
Für jedes Golden Pair prüfen:
- `resultVersion`
- `primaryTrack`
- `headline`
- erste `topAction`
- Deadline-Labels
- Red-Flag-Labels

### Stufe B — fallbezogene Zusatzassertions
Je Fall können zusätzliche Prüfungen definiert werden, wenn genau dort die Produktlogik hängt.

Beispiele:
- Trennung von Arbeitsuchend- und Arbeitslosmeldung
- Sonderfall-Eskalation trotz laufender Klagefrist
- Vertragswarnung vor allgemeiner ALG-I-Logik
- Mehrfachfall priorisiert nicht zu grob auf Standard-Sonderfall zurück

## 5. Render-Teststrategie
Jeder View (`short`, `standard`, `advice`) bekommt Mindestregeln:

### `short`
- enthält Headline
- enthält wichtigsten nächsten Schritt
- enthält erste kritische Deadline, wenn vorhanden
- bleibt kurz und ohne Ledger-Ausgabe

### `standard`
- Reihenfolge bleibt: Headline → Einordnung → TopActions → Deadlines → Risiken → RedFlags → Unterlagen → Hinweise
- `do-not-use-yet` taucht nicht auf
- Red Flags nur wenn vorhanden

### `advice`
- enthält `synthesisDecision.reasoning`
- enthält Fragen für Beratung
- priorisiert Fristen und Eskalation vor Nebeninformationen

## 6. Pair-6-Sonderregel
Der Mehrfachfall (`06-mehrere-eingaenge-gleichzeitig`) ist aktuell ein **Drift-Indikator**.

Das Paar darf nicht stillschweigend ignoriert werden.
Für Pair 6 gilt:
- es muss im Testlauf enthalten sein
- die Abweichung zwischen Fixture und Engine muss explizit entschieden werden
- danach entweder Engine oder Fixture an die beschlossene Logik anpassen

## 7. Done-When für Block 1 Testhärtung
- alle dokumentierten Golden Pairs laufen automatisch
- Pair 6 ist nicht mehr außerhalb des Testlaufs
- Render-Tests decken alle Views ab
- relevante Änderungen an Track, TopActions oder Deadlines machen mindestens einen Test rot
