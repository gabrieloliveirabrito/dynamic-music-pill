#!/bin/bash

set -euo pipefail

mkdir -p logs
SHELL_NAME=bash

dbus-run-session $SHELL_NAME -c './runner.sh'