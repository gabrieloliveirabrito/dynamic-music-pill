#!/bin/bash
set -euo pipefail

KEEP_EXTENSIONS=(
    "dash-to-dock@micxgx.gmail.com"
    "dynamic-music-pill@andbal"
)

for ext in $(gnome-extensions list); do
    gnome-extensions disable "$ext"
done

sleep 0.5

for ext in "${KEEP_EXTENSIONS[@]}"; do
    gnome-extensions enable "$ext"
done

#export DBUS_PARENT='unix:path=/run/user/1000/bus'
export DEV_MODE=1

gnome-shell --wayland --devkit