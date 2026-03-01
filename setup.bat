@echo off
REM ========================================
REM Authentication System Setup Script
REM ========================================

echo.
echo ========================================
echo  Secure User Authentication System
echo  Setup & Startup Script
echo ========================================
echo.

REM Check if Docker is installed
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Docker is not installed or not in PATH
    echo Please install Docker from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo ✓ Docker detected
echo.

REM Check if Docker Compose is installed
where docker-compose >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Docker Compose is not installed
    echo Please install Docker Compose
    pause
    exit /b 1
)

echo ✓ Docker Compose detected
echo.

REM Display menu
:menu
echo ========================================
echo  What would you like to do?
echo ========================================
echo.
echo 1. Build and start services
echo 2. Start services (no rebuild)
echo 3. Stop services
echo 4. View logs (all services)
echo 5. View backend logs only
echo 6. View frontend logs only
echo 7. Remove everything (clean slate)
echo 8. Health check
echo 9. Exit
echo.

set /p choice="Enter your choice (1-9): "

if "%choice%"=="1" goto build_start
if "%choice%"=="2" goto start_only
if "%choice%"=="3" goto stop_services
if "%choice%"=="4" goto view_logs
if "%choice%"=="5" goto backend_logs
if "%choice%"=="6" goto frontend_logs
if "%choice%"=="7" goto clean_slate
if "%choice%"=="8" goto health_check
if "%choice%"=="9" goto exit_script

echo Invalid choice. Please try again.
echo.
goto menu

:build_start
echo.
echo Building and starting services...
echo This may take a few minutes on first run...
echo.
docker-compose up --build
echo.
echo Services are running!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo.
goto menu

:start_only
echo.
echo Starting services (no rebuild)...
echo.
docker-compose up
echo.
goto menu

:stop_services
echo.
echo Stopping services...
echo.
docker-compose down
echo.
echo Services stopped.
echo.
goto menu

:view_logs
echo.
echo Displaying logs (Ctrl+C to exit)...
echo.
docker-compose logs -f
echo.
goto menu

:backend_logs
echo.
echo Displaying backend logs (Ctrl+C to exit)...
echo.
docker-compose logs -f backend
echo.
goto menu

:frontend_logs
echo.
echo Displaying frontend logs (Ctrl+C to exit)...
echo.
docker-compose logs -f frontend
echo.
goto menu

:clean_slate
echo.
echo WARNING: This will remove all containers and database!
echo Are you sure? (y/n)
set /p confirm="Enter y to confirm: "
if /i "%confirm%"=="y" (
    echo.
    echo Removing all services and volumes...
    echo.
    docker-compose down -v
    echo.
    echo Clean slate complete!
    echo.
) else (
    echo Cancelled.
    echo.
)
goto menu

:health_check
echo.
echo Checking service health...
echo.

REM Check MongoDB
echo Checking MongoDB...
docker-compose exec -T mongo mongosh -u admin -p password123 --eval "db.adminCommand('ping')" >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ MongoDB: HEALTHY
) else (
    echo ✗ MongoDB: NOT HEALTHY
)

REM Check Backend
echo Checking Backend...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5000/api/health' -UseBasicParsing -TimeoutSec 5; if ($response.StatusCode -eq 200) { Write-Host '✓ Backend: HEALTHY' } else { Write-Host '✗ Backend: UNHEALTHY' } } catch { Write-Host '✗ Backend: NOT RESPONDING' }" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ✗ Backend: NOT RESPONDING
)

REM Check Frontend
echo Checking Frontend...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 5; if ($response.StatusCode -eq 200) { Write-Host '✓ Frontend: HEALTHY' } else { Write-Host '✗ Frontend: UNHEALTHY' } } catch { Write-Host '✗ Frontend: NOT RESPONDING' }" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ✗ Frontend: NOT RESPONDING
)

echo.
goto menu

:exit_script
echo.
echo Thank you for using the Authentication System!
echo.
echo Quick Links:
echo - Frontend: http://localhost:3000
echo - API Docs: API_REFERENCE.md
echo - Quick Start: QUICKSTART.md
echo.
exit /b 0
