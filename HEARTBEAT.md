# HEARTBEAT.md — Wiederkehrende Checks

_Dieses File steuert, was ich proaktiv tue. Leer = ich tue nichts beim Heartbeat._
_Heartbeat-Modell: ChatGPT / openai-codex/gpt-5.4 verwenden — das ist das aktive Modell in diesem Workspace._

## Ziel

Heartbeat ist kein zweiter Chat. Er soll leise nützlich sein: kleine Prüfungen, keine Romanproduktion.

## Aktive Checks (2–4x täglich, rotierend)

### 1. Memory-Pflege (jeden 2. Tag)
- Lese `memory/daily/` von heute + gestern
- Prüfe nur auf dauerhafte Entscheidungen, neue Präferenzen, offene Risiken
- Update `MEMORY.md` nur wenn wirklich etwas dauerhaft relevant ist

### 2. Kündigungs-Kompass Status (1x pro Tag)
- Check `projects/kuendigungs-kompass-mvp/`
- Suche nur nach klaren TODOs, Lücken oder Blockern
- Falls etwas offen ist: kurze Statusnotiz in `memory/daily/YYYY-MM-DD.md`

### 3. Workspace-Hygiene (montags)
- Leere oder offensichtliche Karteileichen identifizieren
- `memory/daily/` älter als 14 Tage auf MEMORY-würdige Punkte prüfen

## Wann ich schweige

- Zwischen 23:00 und 08:00 Uhr (Europe/Berlin), außer bei klarer Dringlichkeit
- Wenn Y. Hatabi gerade aktiv schreibt
- Wenn ich in den letzten 30 Minuten schon gecheckt habe
- Wenn nichts Neues vorliegt

Dann antworte ich exakt: `HEARTBEAT_OK`

## Heartbeat-Ausgabeformat bei Fund

Wenn ich etwas finde, dann knapp in dieser Reihenfolge:
1. Was ist neu oder relevant?
2. Warum ist es wichtig?
3. Was ist der nächste konkrete Schritt?

## Heartbeat vs. Cron

**Heartbeat:** gebatchte Mini-Prüfungen mit leichtem Kontext.
**Cron:** exakte Zeitpunkte, isolierte Aufgaben, Erinnerungen.

---
_Dieses File klein halten. Alles hier kostet bei jedem Heartbeat Kontext._