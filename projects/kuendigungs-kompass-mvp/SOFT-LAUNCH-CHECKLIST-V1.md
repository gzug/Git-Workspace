# Kündigungs-Kompass MVP — Soft-Launch-Checkliste V1

Stand: 2026-03-22

## Go / No-Go vor Soft Launch

### A. Runtime-Stabilität
- [ ] alle vorhandenen Tests grün
- [ ] alle 6 Fixture-Paare grün
- [ ] Routing-kritische Pfade bewusst geprüft
- [ ] `ready`, `incomplete`, `render-fallback`, `error` bewusst geprüft
- [ ] unbekannte Tier-Angabe fällt kontrolliert auf `base` zurück

### B. Fachliche Guardrails
- [ ] keine Aussage zu garantierter Unwirksamkeit
- [ ] keine Abfindungs-Scheinsicherheit
- [ ] keine Sperrzeit-Scheingenauigkeit
- [ ] keine Klageerfolgs-Scheinsicherheit
- [ ] Sonderfallindikatoren eskalieren statt weichzuzeichnen
- [ ] ohne schriftliche Kündigung keine künstliche Klagefrist-Panik
- [ ] unsichere Datumsangaben erzeugen keine falsche Präzision

### C. Produktlogik
- [ ] `preview`, `base`, `upgrade` inhaltlich sauber getrennt
- [ ] wichtigste To-dos stehen vor Erklärtext
- [ ] Copy wirkt ruhig, klar und nicht alarmistisch
- [ ] technische Zustände oder interne Begriffe leaken nicht in die UI

### D. Fallbacks
- [ ] unvollständige Eingaben führen zu feldspezifischem Hinweis
- [ ] technischer Fehler führt zu ruhigem Neuversuch-Fallback
- [ ] Teilergebnis wird genutzt, wenn es fachlich vertretbar ist
- [ ] Fallback-Matrix ist gesehen, nicht nur gedacht

### E. Monitoring
- [ ] mindestens Status, Error-Code, Track und Warning-Count werden sichtbar
- [ ] ein kanonischer Runtime-Emissionspunkt ist angeschlossen (`buildQuestionnaireResultView(..., { onEvent })`)
- [ ] Render-Fallbacks sind auffindbar
- [ ] Fehler verschwinden nicht still
- [ ] anonyme Flow-Abbrüche können grob beobachtet werden

### F. Ops / Rollback
- [ ] klar, wie Launch gestoppt wird
- [ ] klar, wie auf letzte stabile Version zurückgegangen wird
- [ ] klar, wer den Stop auslöst und nach welchem Signal
- [ ] minimales Fehler-Protokoll ist definiert
- [ ] bekannte Fehlergrenze ist dokumentiert

## Stop-Signale nach Launch
- falsches Fristdatum oder falsches Routing
- wiederholte `render-fallback`-Fälle
- sichtbare Drift zwischen Fixture und Runtime
- Sonderfälle landen in falschen Tracks
- Fragebogen produziert unerwartet viele `incomplete`-Abbrüche oder häuft sich an denselben `nextQuestionKey`
- unerklärliche `error`-Häufung

## Minimaler Rollback-Gedanke
Wenn der MVP live angeschlossen ist und Guardrails oder Rendering sichtbar kippen:
1. neuen Traffic stoppen
2. betroffenen Pfad deaktivieren oder auf letzte stabile Version zurückgehen
3. betroffene Fälle aus Logs/Monitoring clustern
4. erst nach reproduzierbarer Ursache wieder freigeben

## Minimale Ops-Reaktion bei kritischem Fehler
1. Schweregrad klassifizieren
2. kritischen Pfad stoppen oder konservativ absichern
3. Reproduktionsweg + betroffene Inputs dokumentieren
4. Korrektur vor oder gleichzeitig mit Kommunikation
5. erst dann Wiederfreigabe prüfen
