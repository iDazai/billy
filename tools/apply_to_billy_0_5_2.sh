#!/usr/bin/env bash
set -euo pipefail

SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_DIR="${1:-.}"
MANIFEST="$TARGET_DIR/custom_components/bill_tracker/manifest.json"

if [[ ! -f "$MANIFEST" ]]; then
  echo "Target does not look like a Billy repository: $MANIFEST is missing" >&2
  exit 1
fi

python3 - "$MANIFEST" <<'PY'
import json, sys
version = json.load(open(sys.argv[1], encoding='utf-8')).get('version')
if version not in {'0.5.2', '0.6.0'}:
    raise SystemExit(f'Expected Billy 0.5.2 (or an already-applied 0.6.0), found {version!r}')
PY

cp -R "$SOURCE_DIR/custom_components/bill_tracker/." "$TARGET_DIR/custom_components/bill_tracker/"
cp "$SOURCE_DIR/README-0.6.0.md" "$TARGET_DIR/README-0.6.0.md"
cp "$SOURCE_DIR/CHANGELOG-0.6.0.md" "$TARGET_DIR/CHANGELOG-0.6.0.md"
mkdir -p "$TARGET_DIR/docs"
cp "$SOURCE_DIR/docs/AUTOMATIC_PARSING.md" "$TARGET_DIR/docs/AUTOMATIC_PARSING.md"

echo "Billy 0.6.0 files applied to $TARGET_DIR"
