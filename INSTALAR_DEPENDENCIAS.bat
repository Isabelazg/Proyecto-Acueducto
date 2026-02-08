@echo off
chcp 65001 > nul
echo ============================================
echo    ACUEDUCTO - Instalación de Dependencias
echo ============================================
echo.

echo [1/3] Instalando dependencias de Electron...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error al instalar dependencias de Electron
    pause
    exit /b 1
)

echo.
echo [2/3] Instalando dependencias del Frontend...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error al instalar dependencias del frontend
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo [3/3] Instalando dependencias del Backend...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error al instalar dependencias del backend
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ✅ ¡Todas las dependencias instaladas correctamente!
echo.
pause
