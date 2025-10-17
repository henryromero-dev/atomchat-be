#!/bin/sh

echo "Starting AtomChat Backend..."
echo "Environment: ${NODE_ENV:-development}"
echo "Port: ${PORT:-3000}"
echo "Firebase Project ID: ${FIREBASE_PROJECT_ID:-not-set}"

SERVICE_ACCOUNT_PATH="${GOOGLE_APPLICATION_CREDENTIALS:-/run/secrets/firebase-service-account.json}"

if [ ! -f "$SERVICE_ACCOUNT_PATH" ]; then
    echo "ERROR: firebase-service-account.json not found at $SERVICE_ACCOUNT_PATH"
    echo "Hint: mount the credential and set GOOGLE_APPLICATION_CREDENTIALS to its path."
    exit 1
fi

export GOOGLE_APPLICATION_CREDENTIALS="$SERVICE_ACCOUNT_PATH"

if [ -z "$FIREBASE_PROJECT_ID" ]; then
    echo "ERROR: FIREBASE_PROJECT_ID environment variable is required!"
    exit 1
fi

if [ -z "$JWT_SECRET" ]; then
    echo "ERROR: JWT_SECRET environment variable is required!"
    exit 1
fi

echo "All checks passed. Starting server..."

exec node dist/index.js
