#!/usr/bin/env bash
set -euo pipefail

if ! command -v glib-compile-schemas >/dev/null 2>&1; then
  echo "error: glib-compile-schemas not found (install glib2)" >&2
  exit 1
fi

root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"

if [[ ! -d schemas ]]; then
  echo "error: schemas/ directory not found" >&2
  exit 1
fi

glib-compile-schemas schemas/
echo "schema: schemas/gschemas.compiled"
