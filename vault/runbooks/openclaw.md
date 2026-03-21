# OpenClaw Runbook

## 1. Wenn Telegram hängt
Prüfen:
- Läuft der OpenClaw-Agent / LaunchAgent?
- Gibt es frische Polling-/Timeout-Fehler?
- Funktioniert das Dashboard lokal?
- Funktioniert eine Modellprobe?

Aktion:
- Dienst neu starten
- danach Testnachricht senden
- nur frische Fehler werten, keine Altlogs

## 2. Wenn Modellantworten ausbleiben
Prüfen:
- Primary-Modell erreichbar?
- Fallback-Modelle erreichbar?
- Rate-Limit / Auth-Fehler in Logs?
- Netzwerkproblem oder Providerproblem?

Aktion:
- kurze Modellprobe
- bei Fehler Fallback prüfen
- bei Auth/Ratelimit Ursache notieren, nicht raten

## 3. Wenn Memory Search nicht sauber arbeitet
Prüfen:
- Ollama läuft?
- Embedding-Modell vorhanden?
- frische Memory-Fehler in Logs?

Aktion:
- Ollama prüfen
- Embedding-Modell prüfen
- nur reproduzierbare Fehler eskalieren

## 4. Wenn status/doctor Warnungen zeigt
Regel:
- Diagnosewarnung ist nicht automatisch Produktionsfehler

Fragen:
- Funktioniert Telegram praktisch?
- Funktionieren Modellprobes?
- Gibt es echten User-Impact?

Wenn nein:
- als Beobachtung notieren
- nicht unnötig umbauen

## 5. Standard-Reihenfolge bei Problemen
1. Reproduzierbar?
2. Frisch?
3. User-Impact?
4. Kleine reversible Maßnahme
5. Verifikation
6. Kurz dokumentieren

## 6. Nach jeder echten Störung notieren
- Datum
- Symptom
- Ursache sicher / unsicher
- Maßnahme
- Ergebnis
- offener Beobachtungspunkt

## Modell-Fallback bei Codex-Ausfall
- Primary (codex/gpt-5.4) nicht erreichbar → OpenClaw wechselt automatisch auf Fallback 1
- Fallback 1: ollama/qwen2.5-coder:7b (Coding-Aufgaben)
- Fallback 2: ollama/qwen3:8b (allgemein)
- Manuelle Verifikation: oc-status zeigt aktives Modell
- Bei totalem Ausfall: oc-recover ausführen
