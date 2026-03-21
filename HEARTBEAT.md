# HEARTBEAT.md — Wiederkehrende Checks

_Dieses File steuert was ich proaktiv tue. Leer = ich tue nichts beim Heartbeat._
_Heartbeat-Modell: möglichst günstiges Modell (lokal via Ollama) verwenden — nicht GPT-5.4 verschwenden._

## Aktive Checks (2–4x täglich, rotierend)

### Memory-Pflege (jeden 2. Tag)
- Lese memory/daily/ der letzten 2 Tage
- Prüfe ob Entscheidungen oder Einsichten für MEMORY.md relevant sind
- Update MEMORY.md wenn ja — kein Update wenn nichts Neues

### Kündigungs-Kompass Status (1x pro Tag)
- Check projects/kuendigungs-kompass-mvp/ auf offene TODOs
- Falls offene Punkte: kurze Statusnotiz in memory/daily/YYYY-MM-DD.md

### Workspace-Hygiene (1x pro Woche, montags)
- Alte leere Dateien identifizieren
- memory/daily/ Einträge älter als 14 Tage prüfen: Was davon in MEMORY.md promoten?

## Wann SCHWEIGE ich?
- Zwischen 23:00 und 08:00 Uhr (Europe/Berlin) — außer bei expliziter Dringlichkeit
- Wenn Y. Hatabi gerade aktiv schreibt
- Wenn ich in den letzten 30 Minuten schon gecheckt habe
- Wenn nichts Neues vorliegt — dann: HEARTBEAT_OK

## Heartbeat vs. Cron

**Heartbeat:** Mehrere Checks gebatcht, Kontext aus letzten Nachrichten nutzbar, kleine Zeitdrift okay.
**Cron:** Für exakte Zeitpunkte ("täglich 09:00"), isolierte Tasks, andere Modelle.

---
_Dieses File klein halten. Alles was hier steht verbrennt bei jedem Heartbeat Token._