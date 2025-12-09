@echo off
echo.
echo ========================================
echo   Starting StockLens Application
echo ========================================
echo.

cd /d "%~dp0"

echo [1/2] Starting Frontend Server...
start "StockLens Frontend" cmd /k "npm start"

timeout /t 2 /nobreak >nul

echo [2/2] Opening Browser...
timeout /t 15 /nobreak >nul
start http://localhost:3000

echo.
echo ========================================
echo   StockLens is Starting!
echo   URL: http://localhost:3000
echo ========================================
echo.
echo Press any key to close this window...
pause >nul
