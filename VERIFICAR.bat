@echo off
chcp 65001 > nul
echo ============================================
echo    VERIFICACIÓN DE ENTORNO - Acueducto
echo ============================================
echo.

echo Verificando instalación de Node.js...
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js no está instalado
    echo    Descarga desde: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✅ Node.js instalado:
    node --version
)

echo.
echo Verificando instalación de npm...
npm --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm no está instalado
    pause
    exit /b 1
) else (
    echo ✅ npm instalado:
    npm --version
)

echo.
echo Verificando estructura de carpetas...
if not exist "frontend" (
    echo ❌ Carpeta frontend no encontrada
    pause
    exit /b 1
) else (
    echo ✅ Carpeta frontend existe
)

if not exist "backend" (
    echo ❌ Carpeta backend no encontrada
    pause
    exit /b 1
) else (
    echo ✅ Carpeta backend existe
)

if not exist "main.js" (
    echo ❌ Archivo main.js no encontrado
    pause
    exit /b 1
) else (
    echo ✅ Archivo main.js existe
)

echo.
echo Verificando dependencias instaladas...
if not exist "node_modules" (
    echo ⚠️  Dependencias raíz no instaladas
    echo    Ejecuta: INSTALAR_DEPENDENCIAS.bat
) else (
    echo ✅ Dependencias raíz instaladas
)

if not exist "frontend\node_modules" (
    echo ⚠️  Dependencias frontend no instaladas
    echo    Ejecuta: INSTALAR_DEPENDENCIAS.bat
) else (
    echo ✅ Dependencias frontend instaladas
)

if not exist "backend\node_modules" (
    echo ⚠️  Dependencias backend no instaladas
    echo    Ejecuta: INSTALAR_DEPENDENCIAS.bat
) else (
    echo ✅ Dependencias backend instaladas
)

echo.
echo ============================================
echo    RESUMEN
echo ============================================
echo.
echo Si todas las verificaciones pasaron:
echo   1. Ejecuta COMPILAR_ELECTRON.bat
echo   2. El ejecutable se generará en dist\
echo.
echo Si falta algo:
echo   1. Ejecuta INSTALAR_DEPENDENCIAS.bat primero
echo.
pause
