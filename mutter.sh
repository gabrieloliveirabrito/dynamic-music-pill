#!/bin/bash

set -euo pipefail

mkdir -p logs
SHELL_NAME=bash

cat > "$XDG_RUNTIME_DIR/dynamic-music-pill.env" <<EOF
DBUS_PARENT=$DBUS_SESSION_BUS_ADDRESS
DEV_MODE=1
EOF

dbus-run-session $SHELL_NAME -c './runner.sh'