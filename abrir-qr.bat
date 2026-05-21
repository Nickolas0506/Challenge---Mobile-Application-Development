@echo off
cd /d "%~dp0"
title SOLIN - Servidor QR
echo.
echo  Abrindo http://localhost:5500 ...
echo  Mantenha esta janela aberta.
echo  Terminal separado: npm start
echo.
node servidor-ios.js
