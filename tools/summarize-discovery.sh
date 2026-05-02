#!/usr/bin/env bash
# ==================================================================
# tools/summarize-discovery.sh
#
# Tiny CLI helper for the AI Discovery Summarizer Netlify Function.
# Prompts for the inputs, posts to the function, writes the four
# generated markdown files to clients/<slug>/ for you.
#
# USAGE (from repo root):
#   bash tools/summarize-discovery.sh
#
# REQUIREMENTS:
#   - ADMIN_KEY env var set (export ADMIN_KEY=...)
#     OR you'll be prompted for it once
#   - jq installed (brew install jq)
#   - curl (already on macOS)
#   - The transcript file ready as a plain text file
#
# ==================================================================

set -e

ENDPOINT="${BURNSBUILT_ENDPOINT:-https://burnsbuilt.co/.netlify/functions/discovery-summarizer}"

# ---- Auth ----
if [ -z "$ADMIN_KEY" ]; then
  read -srp "ADMIN_KEY: " ADMIN_KEY
  echo
fi
if [ -z "$ADMIN_KEY" ]; then
  echo "ERROR: ADMIN_KEY required (set it as env var or paste when prompted)"
  exit 1
fi

# ---- Required deps ----
if ! command -v jq &> /dev/null; then
  echo "ERROR: jq not installed. Run: brew install jq"
  exit 1
fi

# ---- Inputs ----
echo
echo "═══════════════════════════════════════════════════════════════"
echo "  BurnsBuilt — AI Discovery Summarizer"
echo "═══════════════════════════════════════════════════════════════"
echo

read -p "Client name (e.g. Aledo Coffee Co): " CLIENT_NAME
read -p "Client slug (e.g. aledo-coffee-x9k2): " CLIENT_SLUG
read -p "Package tier (e.g. Website Standard): " PACKAGE_TIER
read -p "Existing site URL (optional, press enter to skip): " EXISTING_URL
read -p "Path to call transcript file (or 'paste' to paste inline): " TRANSCRIPT_PATH

# Read transcript
if [ "$TRANSCRIPT_PATH" = "paste" ]; then
  echo
  echo "Paste the call transcript. Press Ctrl+D when done:"
  TRANSCRIPT=$(cat)
elif [ -f "$TRANSCRIPT_PATH" ]; then
  TRANSCRIPT=$(cat "$TRANSCRIPT_PATH")
else
  echo "ERROR: file not found: $TRANSCRIPT_PATH"
  exit 1
fi

# Optional intake form
read -p "Path to intake form JSON file (optional, press enter to skip): " INTAKE_PATH
if [ -n "$INTAKE_PATH" ] && [ -f "$INTAKE_PATH" ]; then
  INTAKE_JSON=$(cat "$INTAKE_PATH")
else
  INTAKE_JSON="{}"
fi

# ---- Build payload ----
PAYLOAD=$(jq -n \
  --arg name "$CLIENT_NAME" \
  --arg slug "$CLIENT_SLUG" \
  --arg tier "$PACKAGE_TIER" \
  --arg url "$EXISTING_URL" \
  --arg transcript "$TRANSCRIPT" \
  --argjson intake "$INTAKE_JSON" \
  '{
    client_name: $name,
    client_slug: $slug,
    package_tier: $tier,
    existing_site_url: $url,
    call_transcript: $transcript,
    intake_form: $intake
  }')

# ---- Call the function ----
echo
echo "→ Calling $ENDPOINT ..."
echo "  (Claude takes 15–45 seconds to generate all four docs)"

RESPONSE=$(curl -sS -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -H "X-Admin-Key: $ADMIN_KEY" \
  -d "$PAYLOAD")

# ---- Check for errors ----
if ! echo "$RESPONSE" | jq -e '.ok' > /dev/null 2>&1; then
  echo "ERROR — function returned:"
  echo "$RESPONSE" | jq .
  exit 1
fi

# ---- Save output ----
OUTDIR="clients/$CLIENT_SLUG"
mkdir -p "$OUTDIR"

echo "$RESPONSE" | jq -r '.docs.intake_md' > "$OUTDIR/00-intake.md"
echo "$RESPONSE" | jq -r '.docs.discovery_md' > "$OUTDIR/01-discovery.md"
echo "$RESPONSE" | jq -r '.docs.scope_md' > "$OUTDIR/02-scope.md"
echo "$RESPONSE" | jq -r '.docs.content_brief_md' > "$OUTDIR/03-content-brief.md"

# ---- Summary ----
echo
echo "═══════════════════════════════════════════════════════════════"
echo "✓ DONE — four docs written to $OUTDIR/"
echo "═══════════════════════════════════════════════════════════════"
echo
echo "Executive summary:"
echo "$RESPONSE" | jq -r '.executive_summary'
echo
echo "Red flags:"
echo "$RESPONSE" | jq -r '.red_flags[]?' | sed 's/^/  ⚠ /'
[ -z "$(echo "$RESPONSE" | jq -r '.red_flags[]?')" ] && echo "  (none)"
echo
echo "Next actions (next 48 hours):"
echo "$RESPONSE" | jq -r '.next_actions[]?' | nl -s ". " | sed 's/^/  /'
echo
echo "Files written:"
ls -la "$OUTDIR"/*.md
echo
echo "Email status: $(echo "$RESPONSE" | jq -r '.email')"
