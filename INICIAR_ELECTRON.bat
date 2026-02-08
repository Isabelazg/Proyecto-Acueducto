@echo off
chcp 65001 > nul
echo ============================================
echo    ACUEDUCTO - Modo Desarrollo Electron
echo ============================================
echo.

echo Iniciando aplicación en modo desarrollo...
echo.
echo NOTA: El backend se iniciará automáticamente
echo       Presiona Ctrl+C para detener
echo.

call npm run electron-dev
