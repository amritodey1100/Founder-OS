@echo off
echo Starting Founder OS...
echo.

REM Start backend in new window
echo [1/2] Starting backend server...
start "Founder OS Backend" cmd /k "cd server && npm start"

REM Wait a moment for backend to initialize
timeout /t 3 /nobreak >nul

REM Start frontend in new window
echo [2/2] Starting frontend...
start "Founder OS Frontend" cmd /k "npm run dev"

echo.
echo ✅ Founder OS is starting!
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this window...
pause >nul
