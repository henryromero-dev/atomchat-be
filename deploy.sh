#!/bin/bash

echo "🚀 Deploying AtomChat Backend with Docker..."

if [ ! -d "dist" ]; then
    echo "❌ Error: dist directory not found. Please run 'npm run build' first."
    exit 1
fi

if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found. Please copy env.example to .env and configure it."
    exit 1
fi

if [ ! -f "firebase-service-account.json" ]; then
    echo "❌ Error: firebase-service-account.json not found."
    exit 1
fi

echo "✅ All checks passed. Building Docker image..."

docker-compose build

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully!"
    echo "🚀 Starting services..."
    docker-compose up -d
    
    if [ $? -eq 0 ]; then
        echo "✅ Services started successfully!"
        echo "🌐 Backend is running on http://localhost:3000"
        echo "📊 Health check: http://localhost:3000/health"
        echo ""
        echo "📋 Useful commands:"
        echo "  - View logs: docker-compose logs -f atomchat-be"
        echo "  - Stop services: docker-compose down"
        echo "  - Restart: docker-compose restart atomchat-be"
    else
        echo "❌ Failed to start services"
        exit 1
    fi
else
    echo "❌ Failed to build Docker image"
    exit 1
fi
