@echo off
chcp 65001 > nul
echo ============================================
echo    PRUEBA RÁPIDA - Aplicación Electron
echo ============================================
echo.

echo Verificando que el frontend esté compilado...
if not exist "backend\public\index.html" (
    echo ❌ Frontend no compilado
    echo    Ejecutando compilación...
    cd frontend
    call npm run build
    cd ..
    node scripts\copy-frontend.js
)

echo.
echo ✅ Frontend listo
echo.
echo Iniciando Electron en modo prueba...
echo Presiona Ctrl+C para detener
echo.

npm run electron-dev
