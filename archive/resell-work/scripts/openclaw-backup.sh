#!/usr/bin/env bash
set -euo pipefail

TS="$(date +%Y-%m-%d_%H-%M-%S)"
BASE="$HOME/.openclaw/backups/$TS"
mkdir -p "$BASE"

echo "==> Backup nach: $BASE"

# 1) Agents separat sichern
if [ -d "$HOME/.openclaw/agents" ]; then
  tar -czf "$BASE/agents.tar.gz" -C "$HOME/.openclaw" agents
  echo "[ok] agents.tar.gz"
fi

# 2) Wichtige Top-Level-Dateien sichern, falls vorhanden
mkdir -p "$BASE/top"
for f in config.toml config.json settings.json; do
  if [ -f "$HOME/.openclaw/$f" ]; then
    cp "$HOME/.openclaw/$f" "$BASE/top/"
    echo "[ok] $f"
  fi
done

# 3) OpenClaw-Backup mit Verify
if command -v openclaw >/dev/null 2>&1; then
  (
    cd "$BASE"
    openclaw backup create --verify
  )
  echo "[ok] openclaw backup create --verify"
fi

# 4) Einfache Integritätsprüfung
for f in "$BASE"/*.tar.gz; do
  [ -f "$f" ] || continue
  gzip -t "$f"
  echo "[ok] geprüft: $(basename "$f")"
done

# 5) Nur die letzten 7 Backups behalten
cd "$HOME/.openclaw/backups"
ls -1dt */ 2>/dev/null | tail -n +8 | xargs -I{} rm -rf "{}" || true

echo "==> Fertig"
echo "$BASE"
