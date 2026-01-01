@echo off
chcp 65001 >nul
echo ========================================
echo   Preparando paquete para usuario
echo ========================================
echo.

REM Crear carpeta para distribución
set DIST_FOLDER=Acueducto_Portable
if exist "%DIST_FOLDER%" rmdir /s /q "%DIST_FOLDER%"
mkdir "%DIST_FOLDER%"

echo [1/3] Copiando ejecutable...
copy "Acueducto.exe" "%DIST_FOLDER%\"

echo [2/3] Copiando interfaz web...
xcopy /E /I /Y "backend\public" "%DIST_FOLDER%\public"

echo [3/3] Copiando archivos de usuario...
copy "INICIAR.bat" "%DIST_FOLDER%\"
copy "INSTRUCCIONES.md" "%DIST_FOLDER%\"

echo.
echo ========================================
echo   ¡Paquete listo! ✓
echo   
echo   Carpeta creada: %DIST_FOLDER%
echo   
echo   Comprime esa carpeta y entrégala
echo   al usuario. NO necesita instalar nada.
echo ========================================
echo.

pause
