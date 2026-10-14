@echo off
cd /d "%~dp0"
echo =========================================================
echo   Dispatch ^& Delivery Management System
echo   URL:        http://127.0.0.1:5000
echo   Staff Login: http://127.0.0.1:5000/staff/login
echo =========================================================
echo.
.venv\Scripts\python.exe app.py
pause
