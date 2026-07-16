@echo off
title Iniciar Casita Hub
echo ===================================================
echo             INICIANDO CASITA HUB
echo ===================================================
echo.
echo 1. Comprobando si el servidor ya esta corriendo...
netstat -ano | findstr :3001 > nul
if %errorlevel% equ 0 (
    echo [OK] El servidor ya esta activo en el puerto 3001.
) else (
    echo [!] Iniciando servidor Express...
    start /b cmd /c "set Path=C:\Program Files\nodejs;%%Path%% && node server.js"
    timeout /t 3 /nobreak > nul
)
echo.
echo 2. Iniciando tunel seguro de ngrok...
echo Si ngrok da error, asegúrate de haber descargado "ngrok.exe" en "C:\ngrok\"
echo.
C:\ngrok\ngrok.exe http --domain=lubricate-deserve-landmark.ngrok-free.dev 3001
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] No se pudo iniciar ngrok. Comprueba si:
    echo  - ngrok.exe esta en C:\ngrok\ngrok.exe
    echo  - Has configurado tu token con: C:\ngrok\ngrok.exe config add-authtoken TU_TOKEN
    echo.
    pause
)
