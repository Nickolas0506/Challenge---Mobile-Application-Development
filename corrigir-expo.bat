@echo off
cd /d "%~dp0"
echo Limpando cache que quebra o tunnel...
if exist "node_modules\@expo\.ngrok-YlmZD292" rd /s /q "node_modules\@expo\.ngrok-YlmZD292"
for /d %%D in ("node_modules\@expo\.ngrok-*") do rd /s /q "%%D" 2>nul
if exist ".expo" rd /s /q ".expo"
echo.
echo Reinstalando dependencias...
call npm install
echo.
echo Pronto. Agora rode: npm start
pause
