_Lade diese Datei NUR im direkten Hauptkanal. Nicht in Gruppen. Sicherheitsregel._
_Bei jeder Session: lesen. Bei wichtigen Änderungen: updaten._

---

# MEMORY.md — Langzeitgedächtnis
_Erstellt: 2026-03-21 | Quelle: Repo-Rekonstruktion aus OC-HOf_

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

### OpenClaw-Setup (Stand März 2026)
- **Version:** 2026.3.13
- **Hauptmodell:** GPT-5.4 via `openai-codex` (ChatGPT Pro OAuth)
- **Memory-Embeddings:** `nomic-embed-text:latest` via Ollama lokal (`http://localhost:11434`)
- **Lokale Modelle:** `qwen2.5-coder:7b`, `qwen3:8b`
- **Telegram:** läuft, frühere Polling-Stalls beobachten
- **Tailscale:** deaktiviert
- **Gateway:** erreichbar über Loopback; `operator.read` fehlt, aber kein Betriebsblocker
- **Memory Search:** aktiv und lokal funktionsfähig

### Strategische Entscheidung
Fokus auf **Stabilität, Runbook und wiederholbare Arbeitsroutinen** statt auf neue Features. Erst wenn Betrieb und Kern-Workflows belastbar sind, wieder stärker in Feature-Arbeit gehen.

### Operative Präferenzen (Stand März 2026)
- Skill-Set bewusst schlank halten; aktiv priorisiert sind vor allem `github`, `coding-agent`, `summarize`, `healthcheck`, `session-logs`, `node-connect` und `gh-issues`.
- Monitoring und wiederkehrende Checks sollen standardmäßig **still** laufen und nur dann melden, wenn ein Fehler, Drift oder fehlgeschlagene Automatik Aufmerksamkeit braucht.
- Backup-Strategie vorerst pragmatisch: lokales Backup-Staging auf dem Mac mini unter `/Users/shashko/Backups/mac-mini/`, externe/cloud Ablage erfolgt manuell durch Y.
- Wenn ich Recherche- oder Nebenaufgaben an Y. delegiere, soll ich sie standardmäßig als **fertige, eng geführte Prompts** übergeben — inklusive Ziel, Scope, Quellenhygiene, gewünschtem Output-Format und klarer Struktur, damit die Rückgabe direkt in die Projektarbeit übersetzbar ist.
- Main arbeitet idealerweise als **Orchestrator zuerst**, nicht als Alles-selbst-Executor; Delegation soll früh geprüft und sauber geschnitten werden.
- `CleanUp` ist als Entlastungsrolle für Research-Intake, Verdichtung und leichte Hygiene vorgesehen; der Main-Agent soll Rohmaterial nicht unnötig selbst tragen.
- Heartbeat- und Monitoring-Logik sollen nur bei klarem Risiko, Drift, Blocker oder echtem Hebel aktiv melden — nicht bei bloßen Ideen oder schwachen Hygiene-Funden.
- Antworten standardmäßig auf die relevanten Infos minimieren; nur bei Bedarf ausführen.

## Aktive Projektlage

### Kündigungs-Kompass MVP
- **Pfad:** `projects/kuendigungs-kompass-mvp/`
- **Ziel:** Sofortmaßnahmen, Fristen, Fehlervermeidung und Chancen für Menschen nach Kündigung oder Aufhebungsvertrag
- **Rahmen:** Deutschland, Arbeitnehmer:innen, kein Rechtsberater-Ersatz
- **Status:** Blöcke 1–3 (Core Stabilization, Product Output, Integration) sind im Wesentlichen durch; aktiver Schwerpunkt ist Block 4 **Launch Hardening**.
- **Aktueller Fokus:** konservative Fristenlogik, Arbeitslosmeldung vs. Arbeitsuchendmeldung sauber trennen, Snapshot-/Drift-Abdeckung ausbauen, Sonderfall-/Pflichtfeld-/Unknown-Logik nachschärfen — erst danach UI/API- und Soft-Launch-Schicht weiterziehen.

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
- Launch-Reife bedeutet nicht Happy-Path allein, sondern belastbare Routing-Logik, Guardrails, getestete Fallbacks und definierte Ops-Reaktion.
- Nicht wieder breit neu konzipieren, wenn der aktive Tunnel konservative Launch-Härtung verlangt.

## Nächste offene Schritte (Stand 2026-03-22)
1. KSchG-Wochenendlogik und konservative Feiertagshinweise sauber in Engine, Doku und Fixtures ziehen
2. Arbeitslosmeldung vs. Arbeitsuchendmeldung logisch und sprachlich final trennen
3. Snapshot-/Drift-Abdeckung gezielt auf repräsentative Fälle ausbauen
4. Sonderfall-/Pflichtfeld-/Unknown-Logik produktseitig schärfen, ohne Scope-Explosion
5. Danach UI/API-Anschluss und Soft-Launch-Reife weiterziehen
6. `operator.read` beobachten — kein akuter Blocker, aber Diagnosezugriff eingeschränkt
7. Memory-Pflege konsequent von Daily → MEMORY kuratieren

---
_Dieses File ist kuratiert. Weniger, aber stabiler, ist besser._