@echo off
cd /d "%~dp0"
title SOLIN
echo.
echo  [1] Abrindo Expo (NAO feche a janela preta)...
start "SOLIN - Expo" cmd /k "cd /d %~dp0 && npm start"
echo  Aguardando Metro (15 seg)...
timeout /t 15 /nobreak >nul
echo.
echo  [2] Gerando pagina com QR...
node gerar-pagina-qr.js
echo.
echo  Pronto. Escaneie o QR na pagina que abriu.
echo  iPhone e PC na mesma Wi-Fi.
pause
