#!/usr/bin/env bash
set -euo pipefail

EXT_NAME="dynamic-music-pill@andbal"
BUILD_DIR="dist-extension"
ZIP_NAME="$EXT_NAME.zip"

rm -rf "$BUILD_DIR" "$ZIP_NAME"
mkdir -p "$BUILD_DIR"

# 1. build TS
pnpm build

# 2. copiar só o necessário
cp metadata.json "$BUILD_DIR/"
cp extension.js "$BUILD_DIR/"
cp prefs.js "$BUILD_DIR/"
cp flake.lock "$BUILD_DIR/"
cp flake.nix "$BUILD_DIR/"
cp LICENSE "$BUILD_DIR/"
cp README.md "$BUILD_DIR/"
cp stylesheet.css "$BUILD_DIR/"

cp -r ui "$BUILD_DIR/" 2>/dev/null || true
cp -r schemas "$BUILD_DIR/" 2>/dev/null || true
cp -r dist "$BUILD_DIR/" 2>/dev/null || true
cp -r locale "$BUILD_DIR/" 2>/dev/null || true
cp -r po "$BUILD_DIR/" 2>/dev/null || true
cp -r schemas "$BUILD_DIR/" 2>/dev/null || true

# 3. zip final
cd "$BUILD_DIR"
zip -r "../$ZIP_NAME" .
cd ..

echo "Build done: $ZIP_NAME"