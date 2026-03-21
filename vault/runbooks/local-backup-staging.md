# Local Backup Staging

Ziel: wichtige lokale Daten des Mac mini an **einem festen Sammelort** ablegen, damit sie danach manuell in Cloud oder externe Ablage kopiert werden können.

## Sammelpfad

`/Users/shashko/Backups/mac-mini/`

## Struktur

- `openclaw/`
  - `.openclaw/` → OpenClaw-Runtime + Config (ohne volatile Session-/Run-Verzeichnisse)
  - `workspace/` → Workspace-Snapshot
- `system-state/`
  - Host-/Versions-/Statusdateien
  - OpenClaw Status / Audit / Update / Doctor
  - Time Machine / FileVault / Firewall / Softwareupdate-Status
- `exports/YYYY-MM-DD/`
  - komprimierte Archive für manuelles Wegkopieren

## Automatik

Script:
- `scripts/local_backup_staging.sh`

Cron:
- `backup:local-staging`
- täglich um 10:20 Europe/Berlin

## Manueller Lauf

```bash
zsh /Users/shashko/.openclaw/workspace/scripts/local_backup_staging.sh
```

## Zweck

Das ist **kein echtes Offsite-Backup**. Es ist ein lokaler, sauber strukturierter **Staging-Bereich** für spätere manuelle Replikation.

## Wichtig

Wenn der interne Speicher des Mac mini ausfällt, ist auch dieser Staging-Bereich weg. Deshalb regelmäßig extern/cloud wegkopieren.
