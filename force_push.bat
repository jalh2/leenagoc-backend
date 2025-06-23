@echo off
setlocal

REM Check if a commit message was provided
if "%~1"=="" (
    echo Error: Please provide a commit message.
    echo Usage: force_push.bat "Your commit message"
    exit /b 1
)

set COMMIT_MESSAGE=%~1

echo ==================================================
echo WARNING: YOU ARE ABOUT TO FORCE PUSH TO 'main'.
echo This is a destructive operation and can overwrite
echo the remote history for your collaborators.
echo ==================================================
choice /c YN /m "Do you want to continue?"

if errorlevel 2 (
    echo Operation cancelled.
    exit /b 0
)

echo.
echo Staging all changes...
git add .
if %errorlevel% neq 0 (
    echo Failed to stage changes.
    exit /b 1
)

echo.
echo Committing changes with message: %COMMIT_MESSAGE%
git commit -m %COMMIT_MESSAGE%
if %errorlevel% neq 0 (
    echo Failed to commit. This might be because there are no changes to commit. Proceeding with push...
)

echo.
echo Force pushing to origin main...
git push --force origin main
if %errorlevel% neq 0 (
    echo Failed to force push.
    exit /b 1
)

echo.
echo Successfully force pushed to main.
endlocal
