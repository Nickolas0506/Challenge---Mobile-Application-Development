@echo off
cd /d "%~dp0"
title SOLIN - Expo + QR
echo.
echo  Abrindo Expo com TUNNEL (melhor para iPhone)...
start "SOLIN Expo" cmd /k "cd /d %~dp0 && npx expo start --tunnel --go"
echo  Aguarde aparecer "Tunnel ready" na outra janela.
echo.
timeout /t 12 /nobreak >nul
echo  Abrindo pagina do QR...
start "SOLIN QR" cmd /k "cd /d %~dp0 && node servidor-ios.js"
echo.
echo  Pronto. Escaneie o QR em http://localhost:5500
pause
