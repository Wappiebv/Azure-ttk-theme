@echo off
REM CRM System Launcher for Windows

echo ==========================================
echo    Beautiful CRM System - Launcher
echo ==========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH.
    echo Please install Python 3 to run the CRM system.
    pause
    exit /b 1
)

echo Python found!
python --version
echo.

REM Check if user wants to load sample data
if not exist "crm_data.json" (
    echo No existing CRM data found.
    echo.
    set /p LOAD_SAMPLE="Would you like to load sample data for demonstration? (y/n): "
    if /i "%LOAD_SAMPLE%"=="y" (
        if exist "sample_crm_data.json" (
            copy sample_crm_data.json crm_data.json >nul
            echo Sample data loaded successfully!
            echo.
        ) else (
            echo Sample data file not found. Starting with empty database.
            echo.
        )
    )
)

echo Starting CRM System...
echo.
echo Login credentials:
echo   Admin: username=admin, password=admin123
echo   Sales: username=sales, password=sales123
echo.

REM Run the CRM application
python crm_app.py

pause
