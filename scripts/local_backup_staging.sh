#!/bin/zsh
set -euo pipefail

STAMP="$(date +%F-%H%M%S)"
DATE_ONLY="$(date +%F)"
BASE="/Users/shashko/Backups/mac-mini"
OPENCLAW_DIR="$BASE/openclaw"
SYSTEM_DIR="$BASE/system-state"
EXPORTS_DIR="$BASE/exports/$DATE_ONLY"
TMP_DIR="$BASE/.tmp-$STAMP"
mkdir -p "$OPENCLAW_DIR" "$SYSTEM_DIR" "$EXPORTS_DIR" "$TMP_DIR"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

log() {
  printf '%s %s\n' "[$(date '+%F %T')]" "$*"
}

log "Starting local backup staging export"

# 1) OpenClaw runtime/config snapshot
mkdir -p "$TMP_DIR/openclaw"
rsync -a --delete \
  --exclude 'agents/*/sessions/' \
  --exclude 'agents/*/runs/' \
  --exclude 'logs/' \
  --exclude 'tmp/' \
  /Users/shashko/.openclaw/ "$TMP_DIR/openclaw/.openclaw/"

# 2) Workspace snapshot
rsync -a --delete \
  --exclude '.git/' \
  --exclude 'node_modules/' \
  --exclude '.DS_Store' \
  /Users/shashko/.openclaw/workspace/ "$TMP_DIR/openclaw/workspace/"

# 3) System-state artifacts
mkdir -p "$TMP_DIR/system-state"
{
  echo "created_at=$(date -Iseconds)"
  echo "host=$(scutil --get ComputerName 2>/dev/null || hostname)"
  echo "os=$(sw_vers -productName) $(sw_vers -productVersion) ($(sw_vers -buildVersion))"
  echo "kernel=$(uname -a)"
} > "$TMP_DIR/system-state/host-summary.txt"

openclaw status --deep > "$TMP_DIR/system-state/openclaw-status.txt" 2>&1 || true
openclaw security audit --deep > "$TMP_DIR/system-state/openclaw-security-audit.txt" 2>&1 || true
openclaw update status > "$TMP_DIR/system-state/openclaw-update-status.txt" 2>&1 || true
openclaw doctor --non-interactive > "$TMP_DIR/system-state/openclaw-doctor.txt" 2>&1 || true

tmutil destinationinfo > "$TMP_DIR/system-state/tmutil-destinationinfo.txt" 2>&1 || true
tmutil status > "$TMP_DIR/system-state/tmutil-status.txt" 2>&1 || true
fdesetup status > "$TMP_DIR/system-state/filevault-status.txt" 2>&1 || true
/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate > "$TMP_DIR/system-state/firewall-status.txt" 2>&1 || true
/usr/sbin/softwareupdate --schedule > "$TMP_DIR/system-state/softwareupdate-schedule.txt" 2>&1 || true

# 4) Move staged snapshots into canonical locations
rm -rf "$OPENCLAW_DIR/.openclaw" "$OPENCLAW_DIR/workspace"
mv "$TMP_DIR/openclaw/.openclaw" "$OPENCLAW_DIR/.openclaw"
mv "$TMP_DIR/openclaw/workspace" "$OPENCLAW_DIR/workspace"

mkdir -p "$SYSTEM_DIR"
rsync -a --delete "$TMP_DIR/system-state/" "$SYSTEM_DIR/"

# 5) Create portable export archive for manual upload/offload
ARCHIVE="$EXPORTS_DIR/mac-mini-backup-$STAMP.tar.gz"
tar -C "$BASE" -czf "$ARCHIVE" openclaw system-state

# 6) Retention: keep last 14 daily archives
find "$BASE/exports" -type f -name 'mac-mini-backup-*.tar.gz' -mtime +14 -delete 2>/dev/null || true

log "Backup staging export complete: $ARCHIVE"
echo "$ARCHIVE"
