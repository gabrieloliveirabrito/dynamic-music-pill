#!/bin/bash

set -euo pipefail

mkdir -p logs
SHELL_NAME=bash

dbus-run-session $SHELL_NAME -c '
set -euo pipefail

KEEP_EXTENSIONS=(
#	"debuglogging@jonathan.jdoda.ca"
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

START=$(date +%s.%N)

gnome-shell --wayland --devkit &
SHELL_PID=$!

while [ ! -S "$XDG_RUNTIME_DIR/wayland-1" ]; do
    sleep 0.1
done

END=$(date +%s.%N)

echo "Startup: $(echo "$END - $START" | bc)s"

#WAYLAND_DISPLAY=wayland-1 gnome-extensions-app &

wait $SHELL_PID
' 2>&1 | tee logs/full.log | grep --line-buffered -E '\[DMP\]|Dynamic Music Pill|dynamic-music-pill@andbal|JS ERROR|Exception' | tee logs/filtered.log