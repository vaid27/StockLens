@echo off
echo ========================================
echo   StockLens + Sentio AI Startup
echo ========================================
echo.

REM Check if backend dependencies are installed
if not exist "backend\venv" (
    echo Creating Python virtual environment...
    cd backend
    python -m venv venv
    call venv\Scripts\activate
    pip install -r requirements.txt
    cd ..
) else (
    echo Python virtual environment found.
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing Node dependencies...
    call npm install
) else (
    echo Node dependencies found.
)

echo.
echo ========================================
echo   Starting Backend Server...
echo ========================================
start cmd /k "cd backend && venv\Scripts\activate && python server.py"

timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo   Starting Frontend Server...
echo ========================================
start cmd /k "npm start"

echo.
echo ========================================
echo   Both servers are starting!
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo ========================================
echo.
pause
