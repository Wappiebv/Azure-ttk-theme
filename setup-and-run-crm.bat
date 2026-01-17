@echo off
echo ========================================
echo  Audio CRM Setup and Launch
echo ========================================
echo.

echo Step 1: Checking out the correct branch...
git checkout claude/audio-crm-app-zWWvd
if %errorlevel% neq 0 (
    echo Error: Failed to checkout branch
    pause
    exit /b 1
)

echo.
echo Step 2: Pulling latest changes...
git pull origin claude/audio-crm-app-zWWvd
if %errorlevel% neq 0 (
    echo Error: Failed to pull changes
    pause
    exit /b 1
)

echo.
echo Step 3: Navigating to crm-audio folder...
cd crm-audio
if %errorlevel% neq 0 (
    echo Error: crm-audio folder not found
    echo Make sure you're in the Azure-ttk-theme directory
    pause
    exit /b 1
)

echo.
echo Step 4: Installing dependencies...
echo This may take a few minutes...
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo Starting development server...
echo The application will open at http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

call npm run dev
