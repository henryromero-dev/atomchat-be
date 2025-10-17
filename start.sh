#!/bin/sh

echo "Starting AtomChat Backend..."
echo "Environment: ${NODE_ENV:-development}"
echo "Port: ${PORT:-3000}"
echo "Firebase Project ID: ${FIREBASE_PROJECT_ID:-not-set}"

if [ ! -f "/app/firebase-service-account.json" ]; then
    echo "ERROR: firebase-service-account.json not found!"
    exit 1
fi

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
