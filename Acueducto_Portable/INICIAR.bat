@echo off
chcp 65001 >nul
title Sistema de Gestión de Acueducto

echo ========================================
echo   Sistema de Gestión de Acueducto
echo ========================================
echo.
echo Iniciando servidor...
echo.

REM Verificar que el ejecutable existe
if not exist "%~dp0Acueducto.exe" (
    echo [ERROR] No se encuentra Acueducto.exe
    echo Por favor asegúrate de tener el archivo en esta carpeta.
    pause
    exit /b 1
)

echo ========================================
echo   Servidor iniciado correctamente
echo   
echo   Abre tu navegador en:
echo   http://localhost:3001
echo   
echo   Presiona Ctrl+C para detener
echo ========================================
echo.

REM Abrir navegador automáticamente después de 2 segundos
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:3001"

REM Ejecutar el servidor
"%~dp0Acueducto.exe"

pause
