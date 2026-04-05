_Lade diese Datei NUR im direkten Hauptkanal. Nicht in Gruppen. Sicherheitsregel._
_Bei jeder Session: lesen. Bei wichtigen Änderungen: updaten._

---

# MEMORY.md — Langzeitgedächtnis
_Erstellt: 2026-03-21 | Zuletzt aktualisiert: 2026-03-25 | Quelle: Repo-Rekonstruktion aus OC-HOf_

## Identität

### Wer bin ich?
Ich bin ein OpenClaw-Agent namens **Selo**. Mein Workspace ist das Repo `gzug/OC-HOf`. Meine Identität steht in `IDENTITY.md`, meine Haltung in `SOUL.md`.

### Wer ist mein Mensch?
- **Name:** Y. Hatabi
- **Telegram-ID:** 8750096017
- **Username:** Schoepfer_of_Work
- **Sprache:** Deutsch (du)
- **Ort:** München, DE
- **Hauptkanal:** Telegram Direkt
- **Gruppe:** "Selo Abi's OHG" (topic:6 = mein Channel)

## Dauerhafte Arbeitsprinzipien

- Direkt helfen, nicht performativ helfen
- Erst lesen, denken, prüfen — dann fragen
- Externe Aktionen nur mit expliziter Freigabe
- Workspace-Daten nie ungefragt in Gruppen teilen
- Qualität vor Reaktionszwang

## Setup & Betrieb

### OpenClaw-Setup (Stand 2026-03-25)
- **Version:** 2026.3.23-2
- **Hauptmodell:** GPT-5.4 via `openai-codex` (ChatGPT Pro OAuth) — Token 25.03. neu eingerichtet nach Auth-Fehler
- **Fallback-Modell:** `ollama/qwen3:8b` (lokal, aktiv als Backup)
- **Memory-Embeddings:** `nomic-embed-text:latest` via Ollama lokal (`http://localhost:11434`)
- **Lokale Modelle:** `qwen2.5-coder:7b`, `qwen3:8b`, `gemma4:e4b`
- **Telegram:** läuft (@Selo_Abi_bot), frühere Polling-Stalls beobachten
- **Tailscale:** deaktiviert
- **Gateway:** erreichbar über Loopback (127.0.0.1:18789); Sandbox-Mode = off
- **Nerve UI:** http://localhost:3080 (installiert, aktiv)
- **Memory Search:** aktiv und lokal funktionsfähig
- **Sandbox:** off (Docker nicht installiert, bewusste Entscheidung)

### Strategische Entscheidung
Fokus auf **Stabilität, Runbook und wiederholbare Arbeitsroutinen** statt auf neue Features. Erst wenn Betrieb und Kern-Workflows belastbar sind, wieder stärker in Feature-Arbeit gehen.

### Operative Präferenzen (Stand März/April 2026)
- Skill-Set bewusst schlank halten; aktiv priorisiert sind vor allem `github`, `coding-agent`, `summarize`, `healthcheck`, `session-logs`, `node-connect` und `gh-issues`.
- Monitoring und wiederkehrende Checks sollen standardmäßig **still** laufen und nur dann melden, wenn ein Fehler, Drift oder fehlgeschlagene Automatik Aufmerksamkeit braucht.
- Backup-Strategie vorerst pragmatisch: lokales Backup-Staging auf dem Mac mini unter `/Users/shashko/Backups/mac-mini/`, externe/cloud Ablage erfolgt manuell durch Y.
- Wenn ich Recherche- oder Nebenaufgaben an Y. delegiere, soll ich sie standardmäßig als **fertige, eng geführte Prompts** übergeben — inklusive Ziel, Scope, Quellenhygiene, gewünschtem Output-Format und klarer Struktur.
- Main arbeitet idealerweise als **Orchestrator zuerst**, nicht als Alles-selbst-Executor.
- Operatives Leitmodell: **Orchestrator first. Research on demand. Coding with constraints. Review as gate.**
- Das Main-Modell (`gpt-5.4`) ist vor allem für Planung, Priorisierung, Review, Qualitätskontrolle und Korrekturschleifen da — nicht dafür, jeden delegierbaren Block selbst auszuführen.
- Research-Agenten nur bei echter Wissenslücke, hoher Fehlstart-Gefahr oder externer Doku-/Quellenabhängigkeit einsetzen; Research darf kein Ritual werden.
- Coding-Agenten nur mit sauberem Task-Schnitt losschicken: Ziel, Scope, betroffene Dateien, Nicht-Ziele und Akzeptanzkriterien müssen vorab klar sein.
- Frischer Kontext pro Schritt ist gewollt: Sub-Agenten nur mit dem füttern, was sie für genau diesen Step brauchen; keine unnötigen Session-Dumps.
- `CleanUp` ist als Entlastungsrolle für Research-Intake, Verdichtung und leichte Hygiene vorgesehen.
- Heartbeat- und Monitoring-Logik sollen nur bei klarem Risiko, Drift, Blocker oder echtem Hebel aktiv melden.
- Antworten standardmäßig mit **Urteil zuerst**, Begründung danach; auf Relevanz minimieren, nur bei Bedarf ausführen.
- Vor Verweisen auf Memory-Dateien immer sauber trennen: stammt etwas aus gelesenen Files dieser Session oder nur aus aktuellem Gesprächskontext.
- Meta-Optimierung ist ein aktives Risiko: keine Infrastruktur- oder Agentenpolitur, wenn sie echte Projektarbeit verdrängt.
- WICHTIG: qwen3:8b immer mit Effort 'low' verwenden. Bei 'medium' oder höher triggert Extended Thinking und die Antwort dauert 3-10+ Minuten. Fix: Stop → Effort auf 'low' → Anfrage neu senden. Präventiv: kurze, direkte Anfragen stellen, eine Aufgabe pro Request.
- Stand 2026-04-05: `gemma4:e4b` ist lokal eingebunden, aber noch nicht als produktiver Standard-Worker freigegeben. Aktueller Befund: der delegierte Local-Worker-Pfad lieferte im Setup noch keinen belastbaren Output; Projektarbeit im Kündigungs-Kompass deshalb nicht an Local-Worker-Routing blockieren.

## Aktive Projektlage

### Kündigungs-Kompass MVP
- **Pfad:** `projects/kuendigungs-kompass-mvp/`
- **Ziel:** Sofortmaßnahmen, Fristen, Fehlervermeidung und Chancen für Menschen nach Kündigung oder Aufhebungsvertrag
- **Rahmen:** Deutschland, Arbeitnehmer:innen, kein Rechtsberater-Ersatz
- **Status:** Blöcke 1–3 (Core Stabilization, Product Output, Integration) durch; aktiver Schwerpunkt ist Block 4 **Launch Hardening**.
- **Aktueller Fokus:** konservative Fristenlogik, Arbeitslosmeldung vs. Arbeitsuchendmeldung sauber trennen, Snapshot-/Drift-Abdeckung ausbauen.

## Archivierte Projektlage

### Bild-Bearbeitungs-Workflow (Vinted/Kleinanzeigen)
- **Archivpfad:** `archive/resell-work/`
- **Kern-Erkenntnis:** kein starres Preset sinnvoll; adaptiver lokaler Workflow ist die beste Basis
- **Status:** Konzept und Recherche abgeschlossen, operatives Material archiviert

## Workspace-Regeln

- Root schlank halten
- `projects/` nur für aktive Arbeit
- `archive/` für inaktive oder abgeschlossene Arbeit
- `vault/` für kuratiertes Wissen und Runbooks
- `memory/daily/` für Tagesverläufe
- `memory/notes/` für Themenarbeit

## Aktuelle Risiken und Fokusgrenzen

- Drift zwischen Research, Doku, Fixtures und Runtime bleibt beim Kündigungs-Kompass ein zentrales Risiko.
- Scheingenauigkeit bei Fristen, KSchG-Aussagen, Abfindung, Sperrzeit oder Erfolgsprognosen aktiv vermeiden.
- Launch-Reife bedeutet nicht Happy-Path allein, sondern belastbare Routing-Logik, Guardrails, getestete Fallbacks.
- Nicht wieder breit neu konzipieren, wenn der aktive Tunnel konservative Launch-Härtung verlangt.
- GPT-5.4 OAuth-Token: neu eingerichtet 25.03.2026 — bei erneutem 401-Fehler sofort `openclaw onboard` wiederholen.

## Nächste offene Schritte (Stand 2026-03-25)
Stand: 2026-03-25 (Nachmittags-Session)

ERLEDIGT heute:
- AEO/GEO Deep-Dive + 5 Ratgeber-Outlines in AEO-SEO-STRATEGY-V1.md
- Docker-Plan Phase 2+3 in openclaw.md
- 4 neue Tasks im Board (Sandbox, SEO-Content, Rechts-Agent, DSGVO)

NOCH OFFEN (Prio-Reihenfolge):
1. openclaw sandbox build (Terminal) — BLOCKER fuer GPT-5.4
2. DSGVO-Checkliste vor Launch abarbeiten
3. KSchG-Wochenendlogik und Feiertagshinweise in Engine
4. Arbeitslosenmeldung vs. Arbeitsuchendmeldung trennen
5. 5 Ratgeber-Seiten Content schreiben (Outlines fertig)
6. Rechts-Agent V1 in Nerve aufsetzen
7. UI/API-Anschluss nach Fristenlogik-Fix
8. Memory-Pflege: Daily → MEMORY kuratieren

## Aktuelle Risiken & Blocker
- KRITISCH (Stand: 2026-03-25): OpenClaw nicht funktionstüchtig. Y. muss manuell ausführen wenn zurück: 1) openclaw sandbox build 2) mkdir -p ~/.openclaw/agents/main/agent && cp ~/.openclaw/auth-profiles.json ~/.openclaw/agents/main/agent/auth-profiles.json 3) Gateway Restart in Nerve Settings 4) openclaw onboard (GPT Pro OAuth). Danach: gpt-5.4 API-Key in Nerve Einstellungen erneuern (401-Fehler seit 2026-03-25).
