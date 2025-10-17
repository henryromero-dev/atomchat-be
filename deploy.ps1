Write-Host "🚀 Deploying AtomChat Backend with Docker..." -ForegroundColor Green

if (-not (Test-Path "dist")) {
    Write-Host "❌ Error: dist directory not found. Please run 'npm run build' first." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path ".env")) {
    Write-Host "❌ Error: .env file not found. Please copy env.example to .env and configure it." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "firebase-service-account.json")) {
    Write-Host "❌ Error: firebase-service-account.json not found." -ForegroundColor Red
    exit 1
}

Write-Host "✅ All checks passed. Building Docker image..." -ForegroundColor Green

docker-compose build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Docker image built successfully!" -ForegroundColor Green
    Write-Host "🚀 Starting services..." -ForegroundColor Green
    docker-compose up -d
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Services started successfully!" -ForegroundColor Green
        Write-Host "🌐 Backend is running on http://localhost:3000" -ForegroundColor Cyan
        Write-Host "📊 Health check: http://localhost:3000/health" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📋 Useful commands:" -ForegroundColor Yellow
        Write-Host "  - View logs: docker-compose logs -f atomchat-be" -ForegroundColor White
        Write-Host "  - Stop services: docker-compose down" -ForegroundColor White
        Write-Host "  - Restart: docker-compose restart atomchat-be" -ForegroundColor White
    } else {
        Write-Host "❌ Failed to start services" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Failed to build Docker image" -ForegroundColor Red
    exit 1
}
