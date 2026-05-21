@echo off
cd /d "%~dp0"
title SOLIN
echo Abrindo Expo...
start "SOLIN Expo" cmd /k "cd /d %~dp0 && npm start"
timeout /t 10 /nobreak >nul
echo Abrindo QR na tela...
node servidor-ios.js
