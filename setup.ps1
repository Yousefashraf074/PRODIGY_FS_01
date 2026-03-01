# ========================================
# Authentication System Setup Script
# PowerShell Version
# ========================================

function Show-Banner {
    Clear-Host
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host " Secure User Authentication System" -ForegroundColor Cyan
    Write-Host " Setup & Startup Script" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
}

function Show-Menu {
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host " What would you like to do?" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor White
    Write-Host ""
    Write-Host "1. Build and start services" -ForegroundColor Yellow
    Write-Host "2. Start services (no rebuild)" -ForegroundColor Yellow
    Write-Host "3. Stop services" -ForegroundColor Yellow
    Write-Host "4. View logs (all services)" -ForegroundColor Yellow
    Write-Host "5. View backend logs only" -ForegroundColor Yellow
    Write-Host "6. View frontend logs only" -ForegroundColor Yellow
    Write-Host "7. View MongoDB logs only" -ForegroundColor Yellow
    Write-Host "8. Remove everything (clean slate)" -ForegroundColor Yellow
    Write-Host "9. Health check" -ForegroundColor Yellow
    Write-Host "10. Execute API test" -ForegroundColor Yellow
    Write-Host "11. Open browser" -ForegroundColor Yellow
    Write-Host "12. Exit" -ForegroundColor Yellow
    Write-Host ""
}

function Check-Docker {
    $dockerExists = $null -ne (Get-Command docker -ErrorAction SilentlyContinue)
    $composeExists = $null -ne (Get-Command docker-compose -ErrorAction SilentlyContinue)
    
    if (-not $dockerExists) {
        Write-Host "ERROR: Docker is not installed or not in PATH" -ForegroundColor Red
        Write-Host "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop" -ForegroundColor Red
        Write-Host ""
        Read-Host "Press Enter to exit"
        exit 1
    }
    
    Write-Host "✓ Docker detected" -ForegroundColor Green
    
    if (-not $composeExists) {
        Write-Host "ERROR: Docker Compose is not installed" -ForegroundColor Red
        Write-Host ""
        Read-Host "Press Enter to exit"
        exit 1
    }
    
    Write-Host "✓ Docker Compose detected" -ForegroundColor Green
    Write-Host ""
}

function Build-Start {
    Write-Host "Building and starting services..." -ForegroundColor Cyan
    Write-Host "This may take a few minutes on first run..." -ForegroundColor Yellow
    Write-Host ""
    
    docker-compose up --build
    
    Write-Host ""
    Write-Host "Services are running!" -ForegroundColor Green
    Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
    Write-Host "Backend: http://localhost:5000" -ForegroundColor Green
    Write-Host ""
}

function Start-Only {
    Write-Host "Starting services (no rebuild)..." -ForegroundColor Cyan
    Write-Host ""
    
    docker-compose up
    
    Write-Host ""
}

function Stop-Services {
    Write-Host "Stopping services..." -ForegroundColor Cyan
    Write-Host ""
    
    docker-compose down
    
    Write-Host ""
    Write-Host "Services stopped." -ForegroundColor Green
    Write-Host ""
}

function View-Logs {
    Write-Host "Displaying logs (Ctrl+C to exit)..." -ForegroundColor Cyan
    Write-Host ""
    
    docker-compose logs -f
    
    Write-Host ""
}

function View-BackendLogs {
    Write-Host "Displaying backend logs (Ctrl+C to exit)..." -ForegroundColor Cyan
    Write-Host ""
    
    docker-compose logs -f backend
    
    Write-Host ""
}

function View-FrontendLogs {
    Write-Host "Displaying frontend logs (Ctrl+C to exit)..." -ForegroundColor Cyan
    Write-Host ""
    
    docker-compose logs -f frontend
    
    Write-Host ""
}

function View-MongoLogs {
    Write-Host "Displaying MongoDB logs (Ctrl+C to exit)..." -ForegroundColor Cyan
    Write-Host ""
    
    docker-compose logs -f mongo
    
    Write-Host ""
}

function Clean-Slate {
    Write-Host "WARNING: This will remove all containers and database!" -ForegroundColor Red
    Write-Host ""
    
    $confirm = Read-Host "Are you sure? (y/n)"
    
    if ($confirm -eq "y" -or $confirm -eq "Y") {
        Write-Host ""
        Write-Host "Removing all services and volumes..." -ForegroundColor Yellow
        Write-Host ""
        
        docker-compose down -v
        
        Write-Host ""
        Write-Host "Clean slate complete!" -ForegroundColor Green
        Write-Host ""
    } else {
        Write-Host "Cancelled." -ForegroundColor Yellow
        Write-Host ""
    }
}

function Health-Check {
    Write-Host "Checking service health..." -ForegroundColor Cyan
    Write-Host ""
    
    # Check MongoDB
    Write-Host "Checking MongoDB..." -ForegroundColor White
    try {
        $result = docker-compose exec -T mongo mongosh -u admin -p password123 --eval "db.adminCommand('ping')" 2>$null
        Write-Host "✓ MongoDB: HEALTHY" -ForegroundColor Green
    } catch {
        Write-Host "✗ MongoDB: NOT HEALTHY" -ForegroundColor Red
    }
    
    # Check Backend
    Write-Host "Checking Backend..." -ForegroundColor White
    try {
        $response = Invoke-WebRequest -Uri 'http://localhost:5000/api/health' -UseBasicParsing -TimeoutSec 5 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "✓ Backend: HEALTHY" -ForegroundColor Green
        } else {
            Write-Host "✗ Backend: UNHEALTHY" -ForegroundColor Red
        }
    } catch {
        Write-Host "✗ Backend: NOT RESPONDING" -ForegroundColor Red
    }
    
    # Check Frontend
    Write-Host "Checking Frontend..." -ForegroundColor White
    try {
        $response = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 5 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "✓ Frontend: HEALTHY" -ForegroundColor Green
        } else {
            Write-Host "✗ Frontend: UNHEALTHY" -ForegroundColor Red
        }
    } catch {
        Write-Host "✗ Frontend: NOT RESPONDING" -ForegroundColor Red
    }
    
    Write-Host ""
}

function API-Test {
    Write-Host "Testing API endpoints..." -ForegroundColor Cyan
    Write-Host ""
    
    # Test health endpoint
    Write-Host "1. Testing health check..." -ForegroundColor White
    try {
        $response = Invoke-WebRequest -Uri 'http://localhost:5000/api/health' -UseBasicParsing -ErrorAction SilentlyContinue
        Write-Host "✓ Health check: OK" -ForegroundColor Green
        Write-Host $response.Content
    } catch {
        Write-Host "✗ Health check: FAILED" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "2. Testing registration..." -ForegroundColor White
    $email = "test_$(Get-Date -Format 'yyyyMMddHHmmss')@example.com"
    $userData = @{
        firstName = "Test"
        lastName = "User"
        email = $email
        password = "password123"
        confirmPassword = "password123"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-WebRequest -Uri 'http://localhost:5000/api/auth/register' `
            -Method POST `
            -Headers @{"Content-Type"="application/json"} `
            -Body $userData `
            -UseBasicParsing -ErrorAction SilentlyContinue
        Write-Host "✓ Registration: OK" -ForegroundColor Green
        
        $data = $response.Content | ConvertFrom-Json
        Write-Host "Token received: $($data.token.Substring(0, 20))..." -ForegroundColor Green
    } catch {
        Write-Host "✗ Registration: FAILED" -ForegroundColor Red
    }
    
    Write-Host ""
}

function Open-Browser {
    Write-Host "Opening browser..." -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "Opening frontend at http://localhost:3000" -ForegroundColor Green
    Start-Process "http://localhost:3000"
}

function Main-Loop {
    do {
        Show-Banner
        Show-Menu
        
        $choice = Read-Host "Enter your choice (1-12)"
        Write-Host ""
        
        switch ($choice) {
            "1" { Build-Start; Read-Host "Press Enter to continue" }
            "2" { Start-Only; Read-Host "Press Enter to continue" }
            "3" { Stop-Services; Read-Host "Press Enter to continue" }
            "4" { View-Logs; Read-Host "Press Enter to continue" }
            "5" { View-BackendLogs; Read-Host "Press Enter to continue" }
            "6" { View-FrontendLogs; Read-Host "Press Enter to continue" }
            "7" { View-MongoLogs; Read-Host "Press Enter to continue" }
            "8" { Clean-Slate; Read-Host "Press Enter to continue" }
            "9" { Health-Check; Read-Host "Press Enter to continue" }
            "10" { API-Test; Read-Host "Press Enter to continue" }
            "11" { Open-Browser; Read-Host "Press Enter to continue" }
            "12" { $continue = $false }
            default {
                Write-Host "Invalid choice. Please try again." -ForegroundColor Red
                Read-Host "Press Enter to continue"
            }
        }
    } while ($choice -ne "12")
    
    Show-Banner
    Write-Host "Thank you for using the Authentication System!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Quick Links:" -ForegroundColor Cyan
    Write-Host "- Frontend: http://localhost:3000" -ForegroundColor White
    Write-Host "- API Docs: API_REFERENCE.md" -ForegroundColor White
    Write-Host "- Quick Start: QUICKSTART.md" -ForegroundColor White
    Write-Host ""
}

# Main execution
Check-Docker
Main-Loop
