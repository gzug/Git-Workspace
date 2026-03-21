#!/usr/bin/env bash
set -euo pipefail

DIR="$HOME/.openclaw/workspace/handoffs"
mkdir -p "$DIR"

FILE="$DIR/handoff_$(date +%Y-%m-%d_%H-%M-%S).md"
cp "$HOME/.openclaw/workspace/HANDOFF_TEMPLATE.md" "$FILE"

echo "$FILE"
