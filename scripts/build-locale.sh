#!/usr/bin/env bash
set -euo pipefail

if ! command -v msgfmt >/dev/null 2>&1; then
  echo "error: msgfmt not found (install gettext)" >&2
  exit 1
fi

root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"

shopt -s nullglob
po_files=(po/*.po)

if ((${#po_files[@]} == 0)); then
  echo "warning: no po/*.po files found" >&2
  exit 0
fi

for po_file in "${po_files[@]}"; do
  lang="$(basename "$po_file" .po)"
  out_dir="locale/${lang}/LC_MESSAGES"
  out_file="${out_dir}/dynamic-music-pill.mo"

  mkdir -p "$out_dir"
  msgfmt "$po_file" -o "$out_file"
  echo "locale: ${lang} -> ${out_file}"
done
