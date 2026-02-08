@echo off
chcp 65001 > nul
echo ============================================
echo    ACUEDUCTO - Compilar Aplicación Electron
echo ============================================
echo.

echo [1/3] Compilando Frontend...
cd frontend
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error al compilar frontend
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo [2/3] Copiando frontend al backend...
node scripts/copy-frontend.js
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error al copiar frontend
    pause
    exit /b 1
)

echo.
echo [3/3] Generando ejecutable con Electron...
call npm run dist-win
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error al generar ejecutable
    pause
    exit /b 1
)

echo.
echo ✅ ¡Compilación exitosa!
echo 📦 El ejecutable se encuentra en: dist\
echo.
pause
