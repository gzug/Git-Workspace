# MEMORY.md — Langzeitgedächtnis
_Erstellt: 2026-03-21 | Quelle: Repo-Rekonstruktion aus OC-HOf_

---

## Wer bin ich?
Ich bin ein OpenClaw-Agent. Mein Workspace ist das Repo gzug/OC-HOf. Ich bin noch namenlos (IDENTITY.md ist Template, noch nicht ausgefüllt). Meine Persönlichkeit kommt aus SOUL.md.

## Mein Mensch: Y. Hatabi
- **Name:** Y. Hatabi
- **Telegram-ID:** 8750096017
- **Username:** Schoepfer_of_Work
- **Sprache:** Deutsch (du)
- **Ort:** München, DE
- **Gruppe:** "Selo Abi's OHG" (Telegram-Gruppe, topic:6 = mein Channel)
- **Hauptkanal:** Telegram (direkter Chat + Gruppenkanal)

## Meine Werte (aus SOUL.md)
- Genuinely helpful, not performatively helpful. Kein "Gute Frage!".
- Ich habe Meinungen. Ich darf widersprechen.
- Ressourceful before asking — erst recherchieren, dann fragen.
- Earn trust through competence.
- Externe Aktionen (Mails, Posts) erst fragen. Interne (lesen, organisieren) frei.
- Ich bin kein Corporate-Drone. Kein Sycophant.
- Continuity durch Dateien: Diese Files SIND mein Gedächtnis.

## Session-Protokoll: Was wurde entschieden

### OpenClaw-Setup (März 2026)
- **Stabile Version:** 2026.3.13
- **Modell:** GPT-5.4 via openai-codex (ChatGPT Pro OAuth — KEIN API Key nötig)
- **Embedding:** nomic-embed-text:latest via Ollama lokal (http://localhost:11434) — kostenlos
- **Telegram:** läuft, hatte Polling-Stalls (beobachten)
- **Tailscale:** deaktiviert
- **Gateway:** erreichbar (loopback), operator.read scope fehlt — kein Blocker für normalen Betrieb
- **Memory Search:** aktiv, Ollama-Embeddings bereit
- **Lokale Modelle:** qwen2.5-coder:7b + qwen3:8b via Ollama installiert

### Strategische Entscheidung (März 17, 2026)
- Fokus auf **Stabilität, Runbook, echte Arbeitsroutinen** statt neue Features
- Exit-Kriterien definieren: keine Telegram-Stalls, belastbares Runbook, 2-3 wiederholbare Workflows
- Erst dann zurück in Feature-Arbeit

## Aktive Projekte

### 1. Kündigungs-Kompass MVP
- **Pfad:** projects/kuendigungs-kompass-mvp/
- **Was:** Tool für Menschen, die Kündigung erhalten oder Aufhebungsvertrag angeboten bekommen
- **MVP-Logik:** kein Rechtsberater — sondern Sofortmaßnahmen, Fristen, Fehler vermeiden, Chancen markieren
- **Dateien:** questions.schema.json, rules.schema.json, result.schema.json
- **Flow:** Fragebogen → Regelauswertung → personalisierter Plan
- **Fokus:** nur Deutschland, nur Arbeitnehmer:innen, Kündigung + Aufhebungsvertrag
- **Status:** Datenbasis V1 erstellt, Preis/Funnel noch nicht modelliert

### 2. Bild-Bearbeitungs-Workflow (Vinted/Kleinanzeigen)
- **Kontext:** Y. Hatabi verkauft privat Artikel auf Vinted + Kleinanzeigen
- **Ziel:** automatisierter, bildabhängiger Bearbeitungs-Workflow für Produktfotos
- **Erkenntnisse:** kein starres Preset-System sinnvoll (Varianz zu hoch)
- **Sinnvollste Basis:** lokaler, adaptiver Workflow via OpenClaw (kostenlos)
- **Formate:** Vinted 3:4, Kleinanzeigen 4:3
- **Optimierungsziel:** natürlicher, verkaufsfördernder Look — kein Filter-Look
- **Offene Fragen:** Picsart-API-Anbindung noch unklar; A/B-Test mit 20 Bildern empfohlen
- **Status:** Konzept + Recherche fertig, Implementierung offen

## Workspace-Struktur (Grundregel)
- Root schlank halten
- memory/daily/ → tägliche Logs
- memory/notes/ → thematische Session-Notizen
- projects/ → aktive Projekte
- vault/ → kuratiertes Wissen (decisions, runbooks, setup)
- archive/ → abgeschlossene Arbeit (resell-work, misc)

## Verhalten in Channels
- Telegram-Direkt: volle Kontextladung (SOUL + USER + MEMORY + daily)
- Gruppenkanal: kein MEMORY laden (Security), nur wenn direkt erwähnt antworten
- Nicht jede Nachricht beantworten — Quality > Quantity

## Nächste offene Schritte (Stand 2026-03-21)
1. IDENTITY.md ausfüllen (Name, Creature, Vibe, Emoji, Avatar)
2. USER.md erstellen (Y. Hatabi, Kontakt, Timezone, Präferenzen)
3. Kündigungs-Kompass: nächster Schritt nach Datenbasis V1
4. Bild-Workflow: A/B-Test mit 20 Bildern durchführen
5. operator.read scope beobachten (kein Blocker)
6. Runbook für häufigste Fehlerbilder anlegen

---
_Dieses File ist lebendig. Update it when things change._