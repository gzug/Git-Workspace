#!/usr/bin/env bash
set -euo pipefail

LABEL="$(launchctl list | awk '/ai\.openclaw\.gateway/{print $3; exit}')"
WORKSPACE="$HOME/.openclaw/workspace"
LOGDIR="$HOME/.openclaw/logs"
HEARTBEAT="$WORKSPACE/HEARTBEAT.md"
HEALTHCHECK="$WORKSPACE/openclaw-healthcheck.py"

cmd="${1:-status}"

print_header() {
  echo "==> $1"
}

gateway_status() {
  if [ -n "${LABEL:-}" ]; then
    echo "gateway label: $LABEL"
    launchctl list | grep -i openclaw || true
  else
    echo "gateway label: nicht gefunden"
  fi
}

provider_status() {
  echo "search provider: $(openclaw config get tools.web.search.provider 2>/dev/null || echo unbekannt)"
}

run_healthcheck() {
  if [ -f "$HEALTHCHECK" ]; then
    python3 "$HEALTHCHECK" || true
  else
    echo "healthcheck: nicht gefunden ($HEALTHCHECK)"
  fi
}

telegram_log_check() {
  print_header "Telegram / Polling / Timeout Hinweise"
  if [ -d "$LOGDIR" ]; then
    grep -RinE 'telegram|poll|timeout|rate.?limit|429|auth|forbidden|unauthorized|stall' "$LOGDIR" 2>/dev/null | tail -n 30 || echo "keine Treffer"
  else
    echo "logdir nicht gefunden: $LOGDIR"
  fi
}

heartbeat_check() {
  print_header "Heartbeat"
  if [ -f "$HEARTBEAT" ]; then
    echo "datei: $HEARTBEAT"
    stat -f 'letzte aenderung: %Sm' -t '%Y-%m-%d %H:%M:%S' "$HEARTBEAT"
    echo "--- letzte zeilen ---"
    tail -n 20 "$HEARTBEAT" || true
  else
    echo "HEARTBEAT.md nicht gefunden"
  fi
}

recover_gateway() {
  print_header "Gateway Restart"
  if [ -n "${LABEL:-}" ]; then
    launchctl kickstart -k "gui/$(id -u)/$LABEL"
    echo "gateway neu gestartet"
    sleep 2
    gateway_status
    provider_status
    run_healthcheck
  else
    echo "kein Gateway-Label gefunden"
    exit 1
  fi
}

case "$cmd" in
  status)
    print_header "OpenClaw Status"
    gateway_status
    provider_status
    run_healthcheck
    ;;
  recover)
    recover_gateway
    ;;
  tg-check)
    telegram_log_check
    ;;
  hb-check)
    heartbeat_check
    ;;
  *)
    echo "nutzung: $0 {status|recover|tg-check|hb-check}"
    exit 1
    ;;
esac


oc-alert() {
  STATUS=$(~/.openclaw/workspace/openclaw-healthcheck.py 2>&1 | grep -i "problem\|error\|fail\|warning" | head -5)
  if [ -n "$STATUS" ]; then
    curl -s -X POST "https://api.telegram.org/bot8516375560:AAFlr77Qck0NcrXFhV8d8WEwqtAlm3AX5bw/sendMessage" \
      -d chat_id="8750096017" \
      -d text="⚠️ OpenClaw Alert: $STATUS" > /dev/null
  fi
}

oc-memlog() {
  LOGFILE="$HOME/.openclaw/workspace/memory/$(date +%Y-%m-%d).md"
  if [ ! -f "$LOGFILE" ]; then
    printf "# Memory Log $(date +%Y-%m-%d)\n\n## Erledigt heute\n–\n\n## Entscheidungen getroffen\n–\n\n## Offen / morgen\n–\n" > "$LOGFILE"
    echo "Memory-Log erstellt: $LOGFILE"
  else
    echo "Memory-Log existiert bereits: $LOGFILE"
  fi
}
