@echo off
echo ====================================================
echo Starting EcoTrack AI - Indian Tricolor Waste Platform
echo ====================================================
python app.py
if %ERRORLEVEL% NEQ 0 (
    echo Python command failed, trying Python launcher...
    py app.py
)
pause
