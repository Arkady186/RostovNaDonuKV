@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Запуск сайта КВАДРАТ: http://localhost:3000
node server.js
pause
