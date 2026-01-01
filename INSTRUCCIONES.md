# 🚀 Guía de Uso - Sistema de Acueducto

Esta guía te ayudará a usar el Sistema de Gestión de Acueducto en tu computadora.

## 📋 Requisitos

**¡NINGUNO!** No necesitas instalar nada. Todo está incluido.

## 📁 Archivos que Recibes

```
Acueducto/
├── Acueducto.exe        ← El programa principal
├── INICIAR.bat          ← Doble clic aquí para iniciar
├── INSTRUCCIONES.md     ← Este archivo
└── public/              ← Interfaz web (no tocar)
    └── ...
```

Además, cuando lo uses por primera vez se creará:
- `data.db` - Tu base de datos con toda la información

## ▶️ Usar la Aplicación

**Es muy simple:**

1. **Doble clic en `INICIAR.bat`**
2. Espera 2-3 segundos
3. Se abre automáticamente tu navegador en la aplicación
4. ¡Listo! 🎉

**Para cerrar:**
- Presiona `Ctrl + C` en la ventana negra
- O cierra directamente la ventana

## 🔒 Antivirus

Si Windows Defender o tu antivirus bloquea el programa:

1. Es normal (no reconoce el .exe porque es nuevo)
2. Agrega una excepción:
   - Windows Defender → Configuración → Virus y amenazas
   - Agregar o quitar exclusiones
   - Agregar la carpeta `Acueducto`

## 💾 Respaldo de Datos

**¡IMPORTANTE!** Tus datos están en: `data.db`

Para hacer respaldo:
1. Cierra la aplicación (Ctrl+C)
2. Copia el archivo `data.db` que está junto a `Acueducto.exe`
3. Guárdalo en un lugar seguro (USB, nube, otro disco)
4. Nómbralo con fecha: `data-2025-12-27.db`

Para restaurar un respaldo:
1. Cierra la aplicación
2. Reemplaza `data.db` con tu respaldo
3. Renombra el respaldo a `data.db`
4. Inicia de nuevo con `INICIAR.bat`

## 🔧 Solución de Problemas

### No se abre el navegador automáticamente
- Abre manualmente: http://localhost:3001

### Error "No se encuentra Acueducto.exe"
- Verifica que el archivo esté en la misma carpeta que `INICIAR.bat`

### Ventana se cierra inmediatamente
- Puede ser tu antivirus. Ver sección de Antivirus arriba

### Error "Puerto 3001 ya está en uso"
- Ya hay una instancia corriendo
- Cierra todas las ventanas negras
- Intenta de nuevo

### La aplicación se ve en blanco
- Verifica que la carpeta `public` esté completa
- Cierra y vuelve a abrir

## 🌐 Acceder desde Otros Dispositivos

Si quieres acceder desde otro computador/tablet en tu red local:

1. En el computador con el servidor, abre CMD y escribe: `ipconfig`
2. Busca tu dirección IPv4 (ej: 192.168.1.10)
3. Desde otro dispositivo, abre: `http://192.168.1.10:3001`

**Nota:** El computador con `Acueducto.exe` debe estar encendido y ejecutando.

## 📱 Uso en Tablet/Celular

La interfaz funciona en móviles:
1. El PC con el servidor debe estar encendido
2. Ambos en la misma red WiFi
3. Usa la IP del servidor (ver sección anterior)

## 🆕 Actualizar el Sistema

Si recibes una versión nueva:

1. **Respalda tu `data.db`** (muy importante!)
2. Reemplaza los archivos viejos con los nuevos:
   - `Acueducto.exe` 
   - `INICIAR.bat`
   - carpeta `public`
3. Copia tu `data.db` de vuelta
4. Ejecuta `INICIAR.bat`

## 📦 Mover a Otro Computador

Para usar en otro PC:

1. Copia toda la carpeta del programa
2. Incluye tu archivo `data.db` 
3. En el nuevo PC solo haz doble clic en `INICIAR.bat`
4. ¡Listo!

## 💡 Consejos

- **Haz respaldos semanales** de `data.db`
- Mantén la carpeta `public` completa
- No edites los archivos del programa
- Cierra correctamente con Ctrl+C

## 🆘 Soporte

Si tienes problemas:
1. Lee completamente esta guía
2. Verifica la sección de Solución de Problemas
3. Asegúrate que el antivirus no esté bloqueando
4. Intenta reiniciar el computador

---

**¡Listo para usar!** 🎊

Solo necesitas:
1. Doble clic en `INICIAR.bat`
2. Esperar a que se abra el navegador
3. Empezar a trabajar

**¡No necesitas instalar NADA!** ✨
