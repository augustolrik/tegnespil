@echo off
setlocal
cd /d "%~dp0"
title TegneSpil - klasseserver

set "NODE=%USERPROFILE%\tools\node-v24.17.0-win-x64\node.exe"
if not exist "%NODE%" set "NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not exist "%NODE%" set "NODE=node.exe"
if not exist "%NODE%" (
  echo.
  echo Jeg kan ikke finde Node.js, som klasseserveren bruger.
  echo Kontakt laereren eller aabn TegneSpil i Codex igen.
  echo.
  pause
  exit /b 1
)

echo.
echo TegneSpil klasseserver starter nu.
echo Lad dette vindue vaere aabent, mens eleverne spiller.
echo.
echo Aabn paa denne computer: http://localhost:8787/online
echo Elever bruger knappen "Spil med klassen" paa den normale TegneSpil-side.
echo.
"%NODE%" tools\teacher_sync_server.mjs

echo.
echo Klasseserveren er stoppet.
pause
