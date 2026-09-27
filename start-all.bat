@echo off
title FixIt - Full Stack Launcher
echo ========================================================
echo   Launching FixIt Platform (Backend, Frontend, AI)
echo ========================================================
echo.

echo [1/3] Starting Spring Boot Backend on http://localhost:8080 ...
start "FixIt Backend (Port 8080)" cmd /k ""%~dp0start-backend.bat""

timeout /t 3 /nobreak >nul

echo [2/3] Starting FastAPI AI Service on http://localhost:8000 ...
start "FixIt AI Service (Port 8000)" cmd /k ""%~dp0start-ai.bat""

timeout /t 2 /nobreak >nul

echo [3/3] Starting React Frontend on http://localhost:5173 ...
start "FixIt Frontend (Port 5173)" cmd /k ""%~dp0start-frontend.bat""

echo.
echo ========================================================
echo   All 3 services are launching in separate windows!
echo   Frontend:  http://localhost:5173
echo   Backend:   http://localhost:8080
echo   AI Docs:   http://localhost:8000/docs
echo ========================================================
