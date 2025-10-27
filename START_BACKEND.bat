@echo off
echo ===========================================
echo AUTOILTY Backend Server Startup Script
echo ===========================================
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js from https://nodejs.org/
    echo Then restart this script.
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js found
node --version
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ERROR: package.json not found
    echo.
    echo Make sure you're running this script from the backend folder
    echo Or navigate to: cd backend
    echo.
    pause
    exit /b 1
)

echo [OK] Backend folder detected
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] Dependencies not installed yet
    echo Installing dependencies...
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo ERROR: npm install failed!
        echo.
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependencies installed successfully
    echo.
)

REM Check if .env exists
if not exist ".env" (
    echo [WARNING] .env file not found
    echo Creating from template...
    copy .env.example .env
    echo.
    echo [!] IMPORTANT: Please edit .env file with your configuration
    echo     - Set MONGODB_URI
    echo     - Set JWT_SECRET
    echo.
    pause
)

echo Starting backend server...
echo.
echo Backend will run at: http://localhost:5000
echo Health check: http://localhost:5000/api/health
echo.
echo Press Ctrl+C to stop the server
echo.
echo ===========================================
echo.

REM Start the server
call npm start

