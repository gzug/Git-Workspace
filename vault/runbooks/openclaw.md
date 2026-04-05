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


## 7. Wenn GPT-5.4 mit 401 / "authentication token invalidated" ausfällt

_Trat auf: 2026-03-25, ca. 02:00 Uhr MEZ_

Symptom:
- Agent tippt, aber keine Antwort
- Log: `status: 401`, `Your authentication token has been invalidated`
- provider: `openai-codex`, model: `gpt-5.4`

Ursache:
- ChatGPT OAuth-Token abgelaufen oder invalidiert
- Passiert nach längerem Betrieb ohne Re-Auth

Fix (3 Schritte):
1. Im Terminal: `openclaw onboard`
2. Provider `OpenAI` → `OpenAI Codex (ChatGPT OAuth)` wählen
3. Browser-Login bei OpenAI durchführen, Redirect-URL zurück ins Terminal
4. `openclaw gateway restart`
5. Dashboard neu laden: `http://127.0.0.1:18789/Users/shashko/.openclaw/workspace/?token=TOKEN`

Fallback während Fix:
```bash
openclaw config set agents.defaults.model.primary ollama/qwen3:8b
openclaw config set agents.defaults.model.fallbacks '[]'
openclaw gateway restart
```
→ Danach wieder zurücksetzen auf `openai-codex/gpt-5.4`

Präventiv:
- Token läuft ~2 Tage nach Ausstellung ab
- Ggf. regelmäßiges `openclaw onboard` einplanen

## 8. Wenn Nerve-Dashboard nicht erreichbar (token_mismatch)

Symptom:
- Browser zeigt "Your authentication token has been invalidated"
- Log: `reason=token_mismatch`

Fix:
1. Im Terminal: `openclaw config get gateway.auth.token` → Token kopieren
2. Browser: `http://127.0.0.1:18789/Users/shashko/.openclaw/workspace/?token=TOKEN_HIER`
3. Alternativ: anderen Browser / Incognito-Fenster verwenden
4. Wenn Token nach `openclaw onboard` geändert: alten Token im Dashboard-Settings-Feld ersetzen

Fall: Workspace-Pfad-Fehler nach onboard:
- Fehler: `ENOENT: no such file or directory, mkdir '/Benutzer:innen'`
- Ursache: macOS-Lokalisierung des Home-Pfades
- Fix: `openclaw config set workspace ~/.openclaw/workspace` → `openclaw gateway restart`

## 9. Wenn qwen3:8b als Fallback zu lange denkt (Extended Thinking)

Symptom:
- Modell wechselt auf qwen3:8b (nach GPT-5.4 Auth-Fehler)
- "Thinking" zeigt 3-5+ Minuten, "last update" wächst ohne Tokens
- Session "steckt fest"

Ursache:
- qwen3:8b startet Extended-Thinking-Modus der sehr lang dauern kann
- Abhilfe: Effort auf "low" setzen BEVOR die Anfrage gesendet wird

Fix:
1. Stop-Button klicken
2. Effort-Dropdown (Toolbar) auf "low" setzen
3. Modell auf qwen3:8b belassen
4. Anfrage erneut senden (kurz und direkt)

Präventiv:
- Bei qwen3:8b immer Effort: low wählen
- Anfragen kurz und präzise formulieren (keine mehrteiligen Aufgaben)
- Bei File-Erstellung: eine Datei pro Request

## 10. Beobachtung 2026-03-25: File-Creation bei langen Tasks

Beobachtung:
- Auch 'minimal' und 'low' Effort triggert Extended Thinking bei komplexen Tasks
- gpt-5.4 (codex) zeigt dasselbe Verhalten wie qwen3:8b
- Für File-Erstellung: kompletten Inhalt im Request mitgeben + "DONE danach"
- Erwartete Dauer: 3-5 Minuten bis DONE
- Stop-Button funktioniert bei Extended Thinking manchmal nicht

Best Practice für File-Creation:
1. Vollständigen Dateiinhalt als Markdown im Request mitgeben
2. Klares Ende: "Datei JETZT schreiben. DONE danach."
3. Nicht unterbrechen — warten bis DONE
4. Eine Datei pro Request (nicht mehrere gleichzeitig)
5. Nach Fertigstellung: workspace refreshen um neue Datei zu sehen


---

## 10. Sandbox-Image fehlt + Auth-Profile fehlen — Vollständiger Fix-Plan

### Was passiert (Fehlerbild)

```
openai-codex/gpt-5.4: Sandbox image not found
ollama/qwen3:8b: No API key found for provider "ollama"
```

Bedeutung:
- Das Docker/Sandbox-Image für den Codex-Runner ist nicht gebaut oder gelöscht
- Der main-Agent hat keine auth-profiles.json in seinem Agent-Verzeichnis
- Folge: BEIDE Modelle schlagen fehl, Agent läuft in ERROR

### Warum das passiert (Architektur-Erklärung)

OpenClaw trennt zwei Ausführungsebenen:

1. GATEWAY-EBENE (~/.openclaw/)
   Der OpenClaw-Gateway-Prozess läuft auf dem macOS-Host.
   Er hat Zugriff auf: Filesystem, Netzwerk, lokale Tools.
   Auth-Profile liegen hier global: ~/.openclaw/auth-profiles.json

2. AGENT-SANDBOX-EBENE (~/.openclaw/agents/main/agent/)
   Jeder Agent läuft isoliert in einem Docker-Container (Sandbox).
   Die Sandbox hat KEINEN direkten Host-Zugriff.
   Der Agent braucht eine EIGENE auth-profiles.json in seinem Verzeichnis.
   Das Sandbox-Image muss lokal vorhanden sein (gebaut oder gepullt).

Das ist der Grund warum der healthcheck-CRON meldet:
"Diese Session hat nur Sandbox-Zugriff, kein read-only Zugriff auf den Host"

### Fix-Plan: Schritt für Schritt

STUFE 1 — Sandbox-Image bauen (einmalig, ~5-15 Minuten)

```bash
# Terminal öffnen auf Mac mini
# Option A: Image neu bauen (braucht Docker Desktop laufend)
openclaw sandbox build

# Option B: Image pullen falls Registry existiert
openclaw sandbox pull

# Prüfen ob Docker läuft:
docker info

# Prüfen ob Image vorhanden:
docker images | grep openclaw
```

Erwartetes Ergebnis: Image mit Tag openclaw-sandbox:latest vorhanden

STUFE 2 — Auth-Profile in Agent-Verzeichnis kopieren

```bash
# Pfad prüfen ob Verzeichnis existiert:
ls ~/.openclaw/agents/main/agent/

# Falls nicht vorhanden:
mkdir -p ~/.openclaw/agents/main/agent

# Auth-Profile aus globalem Verzeichnis kopieren:
cp ~/.openclaw/auth-profiles.json ~/.openclaw/agents/main/agent/auth-profiles.json

# Inhalt prüfen (muss ollama-Eintrag enthalten):
cat ~/.openclaw/agents/main/agent/auth-profiles.json
```

Erwartetes Ergebnis: JSON mit Einträgen für ollama und openai-codex

STUFE 3 — GPT Pro OAuth Token erneuern

```bash
# OAuth-Flow starten (Browser-Tab öffnet sich):
openclaw onboard

# Mit ChatGPT Pro-Account einloggen wenn Browser-Tab erscheint
# Token wird automatisch in ~/.openclaw/auth-profiles.json gespeichert
# DANACH: Auth-Profile erneut in Agent-Verzeichnis kopieren (Stufe 2 wiederholen)
```

STUFE 4 — Ollama sicherstellen

```bash
# Prüfen ob Ollama läuft:
ollama list

# Falls qwen3:8b nicht vorhanden:
ollama pull qwen3:8b

# Ollama-Service Status:
curl http://localhost:11434/api/tags
```

STUFE 5 — Gateway neu starten

In Nerve-UI:
→ Zahnrad-Icon (oben rechts) → "Restart" bei Gateway Service

Oder per Terminal:
```bash
openclaw gateway restart
# oder:
pkill -f openclaw && openclaw gateway start
```

STUFE 6 — Verifizieren

```bash
# Logs live beobachten:
openclaw logs --follow

# Erfolg: keine 401-Fehler, kein "Sandbox image not found"
# Nerve-UI: Agent wechselt von ERROR zu IDLE
```

### Dauerhafter Fix: Auth-Profile automatisch synchronisieren

Problem: Nach jedem openclaw onboard muss auth-profiles.json manuell kopiert werden.
Lösung: Symlink statt Kopie — dann synchronisiert sich die Datei automatisch.

```bash
# EINMALIG: Datei löschen und durch Symlink ersetzen
rm ~/.openclaw/agents/main/agent/auth-profiles.json
ln -s ~/.openclaw/auth-profiles.json ~/.openclaw/agents/main/agent/auth-profiles.json

# Prüfen:
ls -la ~/.openclaw/agents/main/agent/auth-profiles.json
# Erwartete Ausgabe: ... -> /Users/shashko/.openclaw/auth-profiles.json
```

Nach diesem Schritt: onboard einmal ausführen = Token gilt automatisch auch für Agent.

### Docker-Sandbox stabil halten (Prävention)

Warum verschwinden Sandbox-Images?
- Docker Desktop: "Clean / Prune unused images" löscht auch openclaw-images
- Mac-Neustart + Docker-Neustart: Images bleiben, Container werden neu erstellt
- macOS-Update: kann Docker-Daten zurücksetzen

Präventiv:
```bash
# Image als "protected" taggen (verhindert automatisches Löschen durch Prune):
docker tag openclaw-sandbox:latest openclaw-sandbox:stable

# Image exportieren als Backup:
docker save openclaw-sandbox:latest > ~/openclaw-sandbox-backup.tar

# Bei Verlust wiederherstellen:
docker load < ~/openclaw-sandbox-backup.tar
```

### Schnell-Referenz (täglich)

Wenn Agent in ERROR und Modelle schlagen fehl:
```
1. docker info          ← läuft Docker?
2. docker images | grep openclaw  ← Image vorhanden?
3. ollama list          ← qwen3:8b vorhanden?
4. openclaw sandbox build  ← falls Image fehlt
5. cp auth fix          ← Auth-Symlink gesetzt?
6. Gateway Restart in Nerve
7. openclaw logs --follow  ← Fehler lesen
```

---
_Letzte Änderung: 2026-03-25 | Autor: Claude/Comet | Priorität: KRITISCH_

---
## Phase 2: Docker-Container-Isolation (diese Woche)
_Ziel: OpenClaw in isoliertem Container laufen lassen. Keine lokalen Konflikte mehr._

### Warum Docker?
- Token-Konflikte durch isolierte Umgebung verhindern
- Reproduzierbares Setup: einmal konfiguriert, immer gleich
- Einfaches Reset: Container loeschen = sauberer Neustart
- Mehrere OpenClaw-Versionen parallel testbar

### .env Datei fuer API Keys (~/.openclaw/.env)
OPENAI_API_KEY=sk-...
FALLBACK_MODEL=claude-3-5-sonnet
TELEGRAM_BOT_TOKEN=...

### Auto-Token-Refresh
In Nerve CRONS eintragen (taeglicher Check um 8 Uhr):
openclaw token:check ODER openclaw onboard neu starten

### Fallback bei GPT 401
1. Claude als primaeres Modell in Nerve Settings aktivieren
2. Fehler wird automatisch geloggt
3. Nach naechstem Token-Refresh: GPT wieder aktivieren

### Phase 3: Monitoring + Alerts (naechste Woche)
- Healthcheck-Agent prueft Sandbox alle 6h
- Telegram-Alert bei Fehler
- Weekly: Token-Status, Fehlerrate, Kosten

---
_Update 2026-03-25 | Phase 2+3 Docker-Plan ergaenzt | Autor: Claude/Comet_