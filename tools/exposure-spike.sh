#!/usr/bin/env bash
# ============================================================
# Exposure Events API — spike / diagnostic script
# ============================================================
# Hits the Exposure Events API with proper HMAC-SHA256 signing
# and dumps the raw JSON response. Use this to verify creds work
# and to learn the shape of the response before wiring the UI.
#
# USAGE:
#   export EXPOSURE_API_KEY="your_key"
#   export EXPOSURE_SECRET_KEY="your_secret"
#   ./tools/exposure-spike.sh /api/v1/events
#   ./tools/exposure-spike.sh /api/v1/events/268807
#   ./tools/exposure-spike.sh /api/v1/events/268807/games
#   ./tools/exposure-spike.sh /api/v1/events/268807/standings
#   ./tools/exposure-spike.sh /api/v1/events/268807/divisions
#   ./tools/exposure-spike.sh /api/v1/events/268807/teams
#
# Requires: openssl, curl, jq (optional for pretty-print)
# ============================================================

set -euo pipefail

if [[ -z "${EXPOSURE_API_KEY:-}" ]] || [[ -z "${EXPOSURE_SECRET_KEY:-}" ]]; then
  echo "ERROR: Set EXPOSURE_API_KEY and EXPOSURE_SECRET_KEY before running." >&2
  echo ""
  echo "Get these from your Exposure Events director dashboard:" >&2
  echo "  https://exposureevents.com/  →  Director portal  →  API credentials" >&2
  exit 1
fi

PATH_ARG="${1:-/api/v1/events}"
METHOD="${METHOD:-GET}"
HOST="exposureevents.com"

# Timestamp in ISO 8601 with 7 fractional-second digits (matches Exposure example format)
# macOS date doesn't support %N — we synthesize fractional seconds via Python.
TIMESTAMP=$(python3 -c "from datetime import datetime,timezone; print(datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.') + f'{datetime.now(timezone.utc).microsecond * 10:07d}' + 'Z')")

# String-to-sign — Exposure docs require UPPER-CASE on the whole thing
STRING_TO_SIGN="${EXPOSURE_API_KEY}&${METHOD}&${TIMESTAMP}&${PATH_ARG}"
STRING_TO_SIGN_UPPER=$(echo -n "$STRING_TO_SIGN" | tr '[:lower:]' '[:upper:]')

# HMAC-SHA256 → base64
SIGNATURE=$(printf '%s' "$STRING_TO_SIGN_UPPER" | openssl dgst -sha256 -hmac "$EXPOSURE_SECRET_KEY" -binary | base64)

AUTH_HEADER="Authorization: ${EXPOSURE_API_KEY}.${SIGNATURE}"
URL="https://${HOST}${PATH_ARG}"

echo "── Request ──────────────────────────────────────"
echo "  METHOD:        $METHOD"
echo "  URL:           $URL"
echo "  Timestamp:     $TIMESTAMP"
echo "  String-to-sign (upper):"
echo "    $STRING_TO_SIGN_UPPER"
echo "  Auth header:   $AUTH_HEADER"
echo "─────────────────────────────────────────────────"
echo ""
echo "── Response ─────────────────────────────────────"
HTTP_CODE=$(curl -s -w "%{http_code}" -o /tmp/exposure-spike-body \
  -H "$AUTH_HEADER" \
  -H "Timestamp: $TIMESTAMP" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Host: $HOST" \
  -X "$METHOD" \
  "$URL")
echo "  HTTP $HTTP_CODE"
echo ""

if command -v jq >/dev/null 2>&1; then
  jq . /tmp/exposure-spike-body 2>/dev/null || cat /tmp/exposure-spike-body
else
  cat /tmp/exposure-spike-body
fi
echo ""
echo "─────────────────────────────────────────────────"

# Hint on common errors
if [[ "$HTTP_CODE" == "401" ]] || [[ "$HTTP_CODE" == "403" ]]; then
  echo ""
  echo "⚠  Auth failed. Things to check:"
  echo "   1. EXPOSURE_API_KEY and EXPOSURE_SECRET_KEY copied exactly (no trailing newline)"
  echo "   2. System clock is accurate — HMAC requests often reject if timestamp is >5min skew"
  echo "   3. The header name 'Timestamp' may differ — try 'X-Date' or 'Date' if 'Timestamp' fails"
  echo "   4. You may need a director-tier account, not a viewer account"
fi
