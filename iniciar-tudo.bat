@echo off
cd /d "%~dp0"
start "Expo" cmd /k "npm run start:tunnel"
timeout /t 15 /nobreak >nul
start "QR" cmd /k "npm run qr"
