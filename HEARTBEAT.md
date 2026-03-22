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
- Nicht melden, wenn nur Rohverlauf oder schwache Notizpflege möglich wäre

### 2. Kündigungs-Kompass Status (1x pro Tag)
- Check `projects/kuendigungs-kompass-mvp/`
- Suche nur nach klarer Drift, offenen P0/P1-Lücken, Blockern, fehlendem Anschluss im aktiven Fokusblock oder Launch-Hardening-Risiken
- Keine Meldung bei bloßen Ideen, netten Verbesserungen oder späterem Nice-to-have
- Falls etwas offen ist: kurze Statusnotiz in `memory/daily/YYYY-MM-DD.md`

### 3. Workspace-Hygiene (montags)
- Nur aufräumrelevante Funde beachten, die Wiederanlaufkosten, Verwirrung oder Drift erzeugen
- `memory/daily/` älter als 14 Tage nur auf MEMORY-würdige Punkte prüfen
- Keine Hygiene-Meldung nur weil etwas alt, unschön oder theoretisch optimierbar ist

## Meldeschwelle
Heartbeat meldet nur bei:
- neuem oder verschärftem Risiko
- klarer Drift
- gescheitertem Automatismus
- echter P0/P1-Lücke
- konkretem nächsten Schritt mit Hebel

Heartbeat meldet nicht bei:
- bloßen Möglichkeiten
- allgemeinen Ideen
- schwachen Hygiene-Funden
- theoretischen Verbesserungen ohne akuten Nutzen

## Prioritätslogik bei mehreren Funden
1. Risiko oder Drift
2. Blocker
3. aktiver Projektengpass
4. dauerhafte Memory-/Entscheidungspflege
5. Hygiene zuletzt

## Wann ich schweige

- Zwischen 23:00 und 08:00 Uhr (Europe/Berlin), außer bei klarer Dringlichkeit
- Wenn Y. Hatabi gerade aktiv schreibt
- Wenn ich in den letzten 30 Minuten schon gecheckt habe
- Wenn nichts Neues vorliegt
- Wenn ein Fund zwar existiert, aber die Meldeschwelle nicht sauber erreicht

Dann antworte ich exakt: `HEARTBEAT_OK`

## Anti-Aktionismus-Regel
Heartbeat ist kein Vorwand, neue Nebenprojekte zu eröffnen.
Ein Fund ist nicht automatisch eine Meldung.
Eine Auffälligkeit ist nicht automatisch ein Arbeitsauftrag.
Wenn kein klarer Hebel oder kein sauberes Risiko vorliegt: still bleiben.

## Heartbeat-Ausgabeformat bei Fund

Wenn ich etwas finde, dann knapp in dieser Reihenfolge:
1. Was ist neu oder relevant?
2. Warum ist es wichtig?
3. Was ist der nächste konkrete Schritt?

Nur das Wichtigste melden.
Nicht mehrere mittelwichtige Funde aufstapeln, wenn ein Hauptfund reicht.

## Heartbeat vs. Cron

**Heartbeat:** gebatchte Mini-Prüfungen mit leichtem Kontext.
**Cron:** exakte Zeitpunkte, isolierte Aufgaben, Erinnerungen.

---
_Dieses File klein halten. Alles hier kostet bei jedem Heartbeat Kontext._