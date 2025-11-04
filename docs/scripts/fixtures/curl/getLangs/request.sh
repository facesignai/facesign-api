#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DOCS_DIR="$(cd "$SCRIPT_DIR/../../../../" && pwd)"

if [ -f "$DOCS_DIR/.env.local" ]; then
  set -a; source "$DOCS_DIR/.env.local"; set +a
elif [ -f "$DOCS_DIR/.env" ]; then
  set -a; source "$DOCS_DIR/.env"; set +a
fi

BASE_URL="${FACESIGN_DEV_API_URL:-https://api.dev.facesign.ai}"
API_KEY="${FACESIGN_DEV_API_KEY:-}"
[ -z "$API_KEY" ] && { echo "FACESIGN_DEV_API_KEY is required" >&2; exit 1; }

HTTP_CODE=$(curl -sS -o "$SCRIPT_DIR/response.json" -w "%{http_code}" \
  -X GET "$BASE_URL/langs" \
  -H "Authorization: Bearer $API_KEY")

printf '{"status": %s, "timestamp": "%s"}\n' "$HTTP_CODE" "$(date -u +%FT%TZ)" > "$SCRIPT_DIR/meta.json"
