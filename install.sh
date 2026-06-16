#!/usr/bin/env bash

EXT=dynamic-music-pill@andbal
DEST="$HOME/.local/share/gnome-shell/extensions/$EXT"

pnpm build

rm -rf "$DEST"

mkdir -p "$DEST"
rsync -a . "$DEST"

glib-compile-schemas "$DEST/schemas"

gnome-extensions disable "$EXT" 2>/dev/null
sleep 1
gnome-extensions enable "$EXT"

#gnome-session-quit --logout --no-prompt