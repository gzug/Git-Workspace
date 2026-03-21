# Kündigungs-Kompass MVP — Soft-Launch-Checkliste V1

Stand: 2026-03-21

## Go / No-Go vor Soft Launch

### A. Runtime-Stabilität
- [ ] alle vorhandenen Tests grün
- [ ] alle 6 Fixture-Paare grün
- [ ] `ready`, `incomplete`, `render-fallback`, `error` bewusst geprüft
- [ ] unbekannte Tier-Angabe fällt kontrolliert auf `base` zurück

### B. Fachliche Guardrails
- [ ] keine Aussage zu garantierter Unwirksamkeit
- [ ] keine Abfindungs-Scheinsicherheit
- [ ] keine Sperrzeit-Scheingenauigkeit
- [ ] Sonderfallindikatoren eskalieren statt weichzuzeichnen
- [ ] ohne schriftliche Kündigung keine künstliche Klagefrist-Panik

### C. Produktlogik
- [ ] `preview`, `base`, `upgrade` inhaltlich sauber getrennt
- [ ] wichtigste To-dos stehen vor Erklärtext
- [ ] Copy wirkt ruhig, klar und nicht alarmistisch

### D. Monitoring
- [ ] mindestens Status, Error-Code, Track und Warning-Count werden sichtbar
- [ ] Render-Fallbacks sind auffindbar
- [ ] Fehler verschwinden nicht still

### E. Rollback
- [ ] klar, wie Launch gestoppt wird
- [ ] klar, wie auf letzte stabile Version zurückgegangen wird
- [ ] klar, wer den Stop auslöst und nach welchem Signal

## Stop-Signale nach Launch
- wiederholte `render-fallback`-Fälle
- sichtbare Drift zwischen Fixture und Runtime
- Sonderfälle landen in falschen Tracks
- Fragebogen produziert unerwartet viele `incomplete`-Abbrüche
- unerklärliche `error`-Häufung

## Minimaler Rollback-Gedanke
Wenn der MVP live angeschlossen ist und Guardrails oder Rendering sichtbar kippen:
1. neuen Traffic stoppen
2. letzte stabile Version aktivieren
3. betroffene Fälle aus Logs/Monitoring clustern
4. erst nach reproduzierbarer Ursache wieder freigeben
