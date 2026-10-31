#!/bin/sh
# ----------------------------------------------------------------------------
# Root Maven Wrapper Shell Script (PeerLearn Platform)
# ----------------------------------------------------------------------------
DIRNAME=$(dirname "$0")

if [ -f "$DIRNAME/spring-boot-backend/mvnw" ]; then
    chmod +x "$DIRNAME/spring-boot-backend/mvnw"
    cd "$DIRNAME/spring-boot-backend" && exec ./mvnw "$@"
elif command -v mvn >/dev/null 2>&1; then
    exec mvn "$@"
else
    echo "[PeerLearn] Error: spring-boot-backend/mvnw not found."
    exit 1
fi
