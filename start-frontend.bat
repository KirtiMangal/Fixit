@echo off
title FixIt - React Frontend (Port 5173)
echo ========================================================
echo   Starting FixIt Frontend (Vite + React 18)
echo ========================================================
cd /d "%~dp0frontend"
call npm run dev
pause
