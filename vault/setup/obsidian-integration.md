# Obsidian-Integration

## Ziel

Obsidian dient in diesem Workspace als **menschliche Oberfläche auf bestehende Markdown-Strukturen**.
Es ist **nicht** das primäre Betriebsgehirn des Agenten und **nicht** eine zweite Wahrheitsquelle.

## Geltungsbereich

Sinnvoll in Obsidian:
- `vault/` → Runbooks, kuratiertes Wissen, Entscheidungen, Setup
- `memory/notes/` → thematische Arbeitsnotizen
- optional lesend/editierend: `MEMORY.md` und `memory/daily/`

Bewusst nicht "obsidianisieren":
- Agenten-Betriebslogik
- Scheduler-/Cron-Logik
- versteckte Plugin-Abhängigkeiten
- doppelte Datenhaltung derselben Inhalte an mehreren Orten

## Minimaler Setup-Stand

- Workspace ist als lokaler Obsidian-Vault registriert
- `.obsidian/app.json` vorhanden
- Attachments landen unter `vault/attachments`
- Skill `obsidian` ist aktiviert
- `obsidian-cli` ist installiert

## Getestete Kernfunktionen

- Vault-Erkennung / Default-Vault
- Listing des Vault-Inhalts
- Notiz erstellen
- Notiz lesen
- Notiz umbenennen/verschieben
- Notiz löschen

## Bekannte Grenze

`obsidian-cli search-content` versucht standardmäßig eine Obsidian-URI zu öffnen. Das ist für terminalseitige Checks nicht ideal und kein guter Kernpfad für Agentenarbeit. Für den Agenten bleiben direkte Dateioperationen und `read`/`write` die robustere Basis.

## Arbeitsprinzip

Obsidian ist hier vor allem:
- Lese- und Navigationsoberfläche für Y.
- Kurationshilfe für strukturierte Markdown-Inhalte
- gute Oberfläche für `vault/`-Inhalte, Runbooks, Entscheidungen und Setup-Notizen

Bewusst nicht als Standardziel in Obsidian pflegen:
- `memory/daily/`
- operative Zwischenstände in `memory/notes/`
- `projects/` als Arbeitsartefakte
- Agenten-/Scheduler-/Script-Logik

Der Agent arbeitet weiter primär dateibasiert.
wn-Inhalte

Der Agent arbeitet weiter primär dateibasiert.
