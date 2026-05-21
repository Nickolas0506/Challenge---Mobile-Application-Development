@echo off
cd /d "%~dp0"
title SOLIN
echo.
echo  [1/2] Abrindo Expo (deixe esta janela aberta)...
start "SOLIN Expo" cmd /k "cd /d %~dp0 && npm start"
echo  Aguarde 12 segundos o Metro subir...
timeout /t 12 /nobreak >nul
echo.
echo  [2/2] Abrindo pagina do QR...
start "SOLIN QR" cmd /k "cd /d %~dp0 && npm run qr"
echo.
echo  Pronto:
echo  - Escaneie o QR no TERMINAL "SOLIN Expo", ou
echo  - Escaneie o QR em http://localhost:5500
echo  - iPhone e PC na mesma Wi-Fi
echo.
pause
