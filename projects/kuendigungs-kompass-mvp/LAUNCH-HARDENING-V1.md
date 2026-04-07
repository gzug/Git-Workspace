# Kündigungs-Kompass — Launch Hardening V1

Stand: 2026-03-22

## Ziel
Die erste Version soll nicht nur fachlich plausibel, sondern **kontrolliert live-fähig** werden.

Launch Hardening bedeutet hier bewusst **nicht**: große Produktfläche bauen.
Es bedeutet:
- den Runtime-Pfad gegen echte Nutzereingaben absichern
- Fehler früh sichtbar machen
- Rückfallverhalten klar definieren
- Soft Launch nur mit klarer Stop-/Go-Logik fahren
- bekannte Fehlergrenzen kennen, statt auf implizite Hoffnung zu bauen

## Reife-Kriterium
Launch-reif bedeutet nicht fehlerfrei.
Launch-reif bedeutet:
- bekannte Fehlergrenzen
- belastbare Routing-Logik
- definierte Guardrails
- getestete Fallbacks
- definierte Ops-Reaktion auf kritische Fehler

## 1. E2E-Realitätscheck
Vor einem Soft Launch muss der vollständige Pfad realistisch geprüft werden:
1. Fragebogen startet sauber
2. unvollständige Eingaben führen kontrolliert zu `incomplete`
3. vollständige Eingaben führen kontrolliert zu `ready`
4. Renderfehler führen kontrolliert zu `render-fallback`
5. harte Eingabefehler führen kontrolliert zu `error`
6. Produktstufen `preview`, `base`, `upgrade` liefern erwartbare Unterschiede

## 2. Monitoring-Minimum
Es muss sichtbar werden:
- wie oft `ready` / `incomplete` / `render-fallback` / `error` auftreten
- welche Error-Codes wirklich vorkommen
- welche Tiers angefragt werden
- welche Tracks dominieren
- wo Fallbacks oder Drift auftreten
- wo der Flow abbricht oder stecken bleibt

Nicht Ziel von V1:
- personenbezogene Speicherung
- tiefe User-Journey-Analytics
- Conversion-Optimierung vor Stabilität

## 3. Fehler-Schweregrade
Jeder gemeldete falsche Output wird zuerst klassifiziert:

### Kritisch
- falsches Fristdatum
- falsches Track-Routing
- Red Flag landet im falschen Standardpfad
- Guardrail fällt still weg

Reaktion:
- betroffenen Pfad stoppen, deaktivieren oder hart konservativ absichern
- nicht unter Last „schnell live patchen“
- erst reproduzieren, dann korrigieren, dann wieder freigeben

### Riskant
- scheingenaue Formulierung ohne direktes Fehlrouting
- falsche Gewichtung eines wichtigen Blocks
- riskante, aber nicht unmittelbar falsche Copy

Reaktion:
- schnell korrigieren
- falls nötig Marker/Guardrail ergänzen
- Runtime nicht unnötig abschalten, wenn Kernrouting korrekt bleibt

### Suboptimal
- schwache Copy
- fehlende Erklärung
- kleine Layout- oder Wahrnehmungsprobleme

Reaktion:
- planmäßig iterieren
- nicht mit Launch-Stop verwechseln

## 4. Soft-Launch-Stop-Regeln
Die erste Version sollte **nicht** still weiterlaufen, wenn:
- kritische Fehler sichtbar werden
- `render-fallback` wiederholt auftritt
- `incomplete` wie Flow-Drift statt normales Verhalten aussieht
- Red-Flag-Fälle in falschen Tracks landen
- Doku, Fixtures und Runtime sichtbar auseinanderlaufen

## 5. Soft-Launch-Go-Regeln
Ein Soft Launch ist vertretbar, wenn:
- Kern- und Edge-Fixtures grün sind
- Routing-kritische Pfade bewusst geprüft wurden
- Fallback-Matrix definiert und gesehen wurde
- Monitoring-Minimum angeschlossen ist
- Soft-Launch-Checkliste vorhanden ist
- Rollback und Ops-Reaktion klar definiert sind

## 6. Transparenz-Regel
- Nutzerbezogene Korrektur nur dort, wo falscher Output nachweislich ausgeliefert wurde und Kontakt möglich ist
- öffentliche Kommunikation nur bei breitem Scope oder sichtbarem Schaden
- keine öffentliche Selbstkritik ohne gleichzeitige oder vorherige Korrektur

## 7. Minimales Fehler-Protokoll
Jeder kritische Fehler braucht mindestens:
- Reproduktionsweg
- betroffene Input-Kombinationen
- Snapshot oder Beispiel des falschen Outputs
- Schweregrad
- Stop-/Weiterlauf-Entscheidung

## 8. Nächste Artefakte
Operativ dazugehörig:
1. `E2E-REALITY-CHECK-V1.md`
2. `MONITORING-ANALYTICS-V1.md`
3. `SOFT-LAUNCH-CHECKLIST-V1.md`

Zusammen bilden sie den kleinsten sinnvollen Launch-Hardening-Rahmen.
