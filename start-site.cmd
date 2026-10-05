@echo off
setlocal
cd /d "%~dp0"
set "CI=true"

if not exist "dist\index.html" (
  echo [ERROR] dist\index.html was not found.
  echo Run pnpm build once after installing dependencies, then try again.
  pause
  exit /b 1
)

echo Starting website at http://localhost:5173/
echo Keep this window open while viewing the site.
set "PYTHON_EXE=C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
if not exist "%PYTHON_EXE%" (
  where python >nul 2>nul
  if errorlevel 1 (
    echo [ERROR] Python was not found.
    echo Install Python 3 or run this from Codex, then try again.
    pause
    exit /b 1
  )
  set "PYTHON_EXE=python"
)
"%PYTHON_EXE%" -m http.server 5173 --bind 127.0.0.1 --directory dist
