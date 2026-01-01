@echo off
chcp 65001 >nul
title Construcción del Sistema

echo ========================================
echo   Construyendo Sistema de Acueducto
echo   (Esto puede tardar varios minutos)
echo ========================================
echo.

REM Verificar Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no está instalado.
    echo Este paso solo lo hace el desarrollador.
    pause
    exit /b 1
)

echo [1/5] Instalando dependencias del frontend...
cd /d "%~dp0frontend"
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Falló instalación frontend
    pause
    exit /b 1
)

echo.
echo [2/5] Construyendo frontend para producción...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Falló construcción del frontend
    pause
    exit /b 1
)

echo.
echo [3/5] Copiando archivos al backend...
cd /d "%~dp0"
if exist "backend\public" rmdir /s /q "backend\public"
xcopy /E /I /Y "frontend\dist" "backend\public"

echo.
echo [4/5] Instalando dependencias del backend...
cd /d "%~dp0backend"
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Falló instalación backend
    pause
    exit /b 1
)

echo.
echo [5/5] Creando ejecutable Windows...
echo (Esto puede tardar 3-5 minutos)
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Falló creación del ejecutable
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ¡Construcción completada! ✓
echo   
echo   Se creó: Acueducto.exe
echo   
echo   PARA ENTREGAR AL USUARIO:
echo   1. Copia Acueducto.exe
echo   2. Copia la carpeta backend\public
echo   3. Incluye INICIAR.bat
echo   
echo   El usuario NO necesita instalar nada
echo ========================================
echo.

pause
