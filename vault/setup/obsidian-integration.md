# Obsidian-Integration

## Ziel

Obsidian dient in diesem Workspace als **menschliche Oberfläche auf bestehende Markdown-Strukturen**.
Es ist **nicht** das primäre Betriebsgehirn des Agenten und **nicht** eine zweite Wahrheitsquelle.

## Geltungsbereich

Der **gesamte Workspace** ist der Obsidian-Vault.
Das ist bewusst so gewählt: Mensch und Agent arbeiten auf denselben Dateien.

Sinnvoll in Obsidian:
- `vault/` → Runbooks, kuratiertes Wissen, Entscheidungen, Setup
- `memory/notes/` → thematische Arbeitsnotizen
- `MEMORY.md` → kuratiertes Langzeitgedächtnis
- `memory/daily/` → Tagesverlauf und Wiedereinstieg
- `projects/` → Einstieg über Projekt-Hubs und operative Artefakte

Bewusst nicht "obsidianisieren":
- Agenten-Betriebslogik
- Scheduler-/Cron-Logik
- versteckte Plugin-Abhängigkeiten
- doppelte Datenhaltung derselben Inhalte an mehreren Orten

## Minimaler Setup-Stand

- gesamter Workspace ist als lokaler Obsidian-Vault registriert
- `.obsidian/app.json` vorhanden
- Attachments landen unter `vault/attachments`
- `HOME.md` ist die empfohlene Startansicht
- Skill `obsidian` ist aktiviert
- `obsidian-cli` ist installiert

## Empfohlene Nutzung

### Startpunkt
- `HOME.md` öffnen
- von dort in `MEMORY.md`, heutige Daily Note, Runbooks oder aktive Projekte springen

### Favoriten
- `HOME.md`
- `MEMORY.md`
- aktuelle Daily Note
- `vault/runbooks/README.md`
- aktives Projekt-Hub

### Sidebar
- Dateibaum sichtbar
- Suche griffbereit
- Favoriten/Starred für die Kernnoten

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
- gute Oberfläche für `vault/`, `MEMORY.md`, Daily Notes und Projekt-Hubs

Der Agent arbeitet weiter primär dateibasiert.
