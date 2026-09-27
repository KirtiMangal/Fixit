@echo off
title FixIt - FastAPI AI Service (Port 8000)
echo ========================================================
echo   Starting FixIt AI Diagnosis Service (FastAPI)
echo ========================================================
cd /d "%~dp0ai-service"
if exist ".venv\Scripts\python.exe" (
    ".venv\Scripts\python.exe" -m uvicorn app.main:app --port 8000 --reload
) else (
    python -m uvicorn app.main:app --port 8000 --reload
)
pause
