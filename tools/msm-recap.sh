#!/usr/bin/env bash
# ==================================================================
# MSM Recap Writer — calls Gemini, appends to recaps/manifest.json
#
# Usage:
#   ADMIN_KEY=xxx SITE_URL=https://burnsbuilt.co \
#     tools/msm-recap.sh \
#       --team1 "Aledo Bearcats 12U" \
#       --team2 "DFW Stallions 12U" \
#       --score1 6 --score2 4 \
#       --division 12U \
#       --round "pool play" \
#       --notes "Optional notes about standout plays."
# ==================================================================
set -euo pipefail

ADMIN_KEY="${ADMIN_KEY:-}"
SITE_URL="${SITE_URL:-https://burnsbuilt.co}"
MANIFEST="msm-summer-2026-dfw/recaps/manifest.json"
TEAM1=""; TEAM2=""; SCORE1=""; SCORE2=""; DIVISION=""; ROUND=""; NOTES=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --team1)    TEAM1="$2"; shift 2 ;;
    --team2)    TEAM2="$2"; shift 2 ;;
    --score1)   SCORE1="$2"; shift 2 ;;
    --score2)   SCORE2="$2"; shift 2 ;;
    --division) DIVISION="$2"; shift 2 ;;
    --round)    ROUND="$2"; shift 2 ;;
    --notes)    NOTES="$2"; shift 2 ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

[[ -z "$ADMIN_KEY" ]] && { echo "Error: ADMIN_KEY env var required" >&2; exit 1; }
[[ -z "$TEAM1" || -z "$TEAM2" || -z "$SCORE1" || -z "$SCORE2" ]] && {
  echo "Error: --team1, --team2, --score1, --score2 are required" >&2; exit 1
}
command -v jq >/dev/null || { echo "jq required (brew install jq)" >&2; exit 1; }

PAYLOAD=$(jq -n \
  --arg t1 "$TEAM1" --arg t2 "$TEAM2" \
  --argjson s1 "$SCORE1" --argjson s2 "$SCORE2" \
  --arg div "$DIVISION" --arg rnd "$ROUND" --arg notes "$NOTES" \
  '{team1:$t1, team2:$t2, score1:$s1, score2:$s2, division:$div, round:$rnd, notes:$notes}')

echo "Drafting recap…"
RESPONSE=$(curl -sS -X POST "$SITE_URL/.netlify/functions/msm-recap" \
  -H "Content-Type: application/json" \
  -H "X-Admin-Key: $ADMIN_KEY" \
  -d "$PAYLOAD")

OK=$(echo "$RESPONSE" | jq -r '.ok // false')
if [[ "$OK" != "true" ]]; then
  echo "❌ Failed: $(echo "$RESPONSE" | jq -r '.error // "unknown"')" >&2; exit 1
fi

TITLE=$(echo "$RESPONSE" | jq -r '.title')
RECAP=$(echo "$RESPONSE" | jq -r '.recap')
SCORE=$(echo "$RESPONSE" | jq -r '.meta.score')

echo ""
echo "✓ Drafted: $TITLE"
echo "  $RECAP"
echo ""

# Append to manifest
NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
ENTRY=$(jq -n \
  --arg title "$TITLE" --arg recap "$RECAP" --arg score "$SCORE" \
  --arg div "$DIVISION" --arg rnd "$ROUND" --arg now "$NOW" \
  '{title:$title, recap:$recap, score:$score, division:$div, round:$rnd, posted_at:$now}')

TMP=$(mktemp)
jq ".recaps += [$ENTRY]" "$MANIFEST" > "$TMP" && mv "$TMP" "$MANIFEST"
echo "Appended to $MANIFEST"
