# TOOLS.md — Lokale Umgebung & Setup-Notizen
_Dieses File beschreibt die konkrete Infrastruktur dieses Mac mini. Nur hier, nicht in Skills._

## Hauptsystem

- **Gerät:** Mac mini (Apple Silicon, arm64)
- **Chip:** Apple M4
- **Unified Memory:** 16 GB
- **OS:** macOS 26.4
- **Benutzer:** shashko
- **Hostname:** Mac-mini-von-Shashko
- **Node:** v24.12.0 via nvm

## OpenClaw

- **Version:** 2026.3.23-2
- **Gateway:** `ws://127.0.0.1:18789` (Loopback only)
- **Dashboard:** `http://127.0.0.1:18789/Users/shashko/.openclaw/workspace/`
- **Config:** `~/.openclaw/openclaw.json`
- **Workspace:** `~/.openclaw/workspace/` (dieses Repo)
- **Gateway-Service:** LaunchAgent (`~/Library/LaunchAgents/ai.openclaw.gateway.plist`)
- **Logs:** `/tmp/openclaw/openclaw-YYYY-MM-DD.log`

## Nerve UI

- **URL:** `http://localhost:3080`
- **Version:** V1.5.2
- **Auth:** Token (gleicher Token wie Gateway)
- **Browser:** Chrome (primär)

## Modelle

### Primär
- **openai-codex/gpt-5.4** via ChatGPT Pro OAuth
  - Token: wird über `openclaw onboard` verwaltet
  - Bei 401/Auth-Problemen: Runbook `vault/runbooks/openclaw-auth.md` nutzen

### Fallback (lokal via Ollama)
- **ollama/qwen3:8b** — aktiver Fallback / Heartbeat; immer mit Effort `low`
- **ollama/gemma4:e4b** — lokaler Kandidat für einfache Tasks / Vorarbeit; aktuell nicht als produktiver Standard-Worker freigegeben
- **ollama/qwen2.5-coder:7b** — Code-Fokus für klar eingegrenzte Vorarbeit
- **nomic-embed-text:latest** — Memory-Embeddings
- **Ollama-Endpoint:** `http://localhost:11434`

## Kanäle

- **Telegram:** @Selo_Abi_bot (läuft, Polling-Stalls beobachten)
- **Tailscale:** deaktiviert
- **WhatsApp/Discord/Signal:** nicht konfiguriert

## Backups

- **Lokal:** `/Users/shashko/Backups/mac-mini/` (manuell durch Y.)
- **Cloud:** manuell, kein Automation-Setup

## Sicherheit

- **Sandbox:** off (Docker nicht installiert, bewusste Entscheidung)
- **Gateway:** Loopback-only, kein externer Zugriff
- **Tailscale:** deaktiviert
- **Exec-Approval:** seit 2026-04-05 für trusted owner workflow gelockert (`tools.exec.ask=off`, `tools.exec.security=full`); Arbeitsregel bleibt trotzdem: keine destruktiven oder extern wirksamen Aktionen ohne klare Freigabe

## Nützliche Befehle

```bash
# Gateway neu starten
openclaw gateway restart

# Status überblick
openclaw status

# Logs live verfolgen
openclaw logs --follow

# GPT-Auth erneuern (bei 401) — siehe auch vault/runbooks/openclaw-auth.md
openclaw onboard

# Config validieren
openclaw config validate

# Nerve öffnen
open http://localhost:3080
```

---
_Zuletzt aktualisiert: 2026-04-05_