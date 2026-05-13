#!/usr/bin/env bash
# ==================================================================
# MSM Photo Tagger — batch
# Iterates msm-summer-2026-dfw/gallery/manifest.json, calls
# /.netlify/functions/msm-photo-tag for any photo missing `tags`,
# and writes results back to the manifest.
#
# Usage:
#   ADMIN_KEY=xxx SITE_URL=https://burnsbuilt.co \
#     tools/msm-tag-photos.sh
#
# Optional flags:
#   --force       re-tag photos that already have tags
#   --limit N     tag at most N photos (default: all)
# ==================================================================
set -euo pipefail

ADMIN_KEY="${ADMIN_KEY:-}"
SITE_URL="${SITE_URL:-https://burnsbuilt.co}"
MANIFEST="msm-summer-2026-dfw/gallery/manifest.json"
FORCE=0
LIMIT=999

while [[ $# -gt 0 ]]; do
  case "$1" in
    --force) FORCE=1; shift ;;
    --limit) LIMIT="$2"; shift 2 ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

if [[ -z "$ADMIN_KEY" ]]; then
  echo "Error: ADMIN_KEY env var required" >&2; exit 1
fi
if [[ ! -f "$MANIFEST" ]]; then
  echo "Error: $MANIFEST not found (run from repo root)" >&2; exit 1
fi
command -v jq >/dev/null || { echo "jq required (brew install jq)" >&2; exit 1; }

ENDPOINT="$SITE_URL/.netlify/functions/msm-photo-tag"
TOTAL=$(jq '.photos | length' "$MANIFEST")
echo "Manifest has $TOTAL photos. Tagging…"

TAGGED=0
for ((i=0; i<TOTAL && TAGGED<LIMIT; i++)); do
  SRC=$(jq -r ".photos[$i].src" "$MANIFEST")
  HAS_TAGS=$(jq -r ".photos[$i].tags // empty" "$MANIFEST")
  if [[ -n "$HAS_TAGS" && "$FORCE" == "0" ]]; then
    echo "  [$((i+1))/$TOTAL] $SRC — already tagged (skip)"
    continue
  fi
  PHOTO_URL="$SITE_URL/msm-summer-2026-dfw/gallery/$SRC"
  echo "  [$((i+1))/$TOTAL] $SRC — tagging…"
  RESPONSE=$(curl -sS -X POST "$ENDPOINT" \
    -H "Content-Type: application/json" \
    -H "X-Admin-Key: $ADMIN_KEY" \
    -d "{\"url\":\"$PHOTO_URL\"}")
  OK=$(echo "$RESPONSE" | jq -r '.ok // false')
  if [[ "$OK" != "true" ]]; then
    echo "    ⚠ failed: $(echo "$RESPONSE" | jq -r '.error // "unknown"')"
    continue
  fi
  TAGS=$(echo "$RESPONSE" | jq '.tags')
  # Inject tags back into manifest
  TMP=$(mktemp)
  jq ".photos[$i].tags = $TAGS" "$MANIFEST" > "$TMP" && mv "$TMP" "$MANIFEST"
  CAPTION=$(echo "$TAGS" | jq -r '.caption')
  echo "    ✓ $CAPTION"
  TAGGED=$((TAGGED+1))
done

echo ""
echo "Tagged $TAGGED photo(s). Manifest updated: $MANIFEST"
