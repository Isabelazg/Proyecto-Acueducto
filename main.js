const { app, BrowserWindow } = require('electron');
const path = require('path');
const express = require('express');

let mainWindow;
let serverInstance;
const PORT = 3001;

// Función para crear el servidor backend
async function startBackendServer() {
  try {
    // Configurar variables de entorno
    process.env.NODE_ENV = 'production';
    
    // Importar y crear la aplicación Express
    const { createApp } = require('./backend/src/app');
    const expressApp = await createApp();
    
    // Iniciar el servidor
    return new Promise((resolve, reject) => {
      serverInstance = expressApp.listen(PORT, 'localhost', () => {
        console.log(`Backend iniciado en http://localhost:${PORT}`);
        resolve();
      });

      serverInstance.on('error', (error) => {
        console.error('Error al iniciar el servidor:', error);
        reject(error);
      });
    });
  } catch (error) {
    console.error('Error al crear el servidor:', error);
    throw error;
  }
}

// Función para crear la ventana principal
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      devTools: true // Cambiar a false en producción final
    },
    icon: path.join(__dirname, 'build', 'icon.png'),
    title: 'Acueducto - Sistema de Gestión',
    show: false,
    backgroundColor: '#ffffff'
  });

  // Mostrar ventana cuando esté lista
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Cargar la aplicación
  mainWindow.loadURL(`http://localhost:${PORT}`);

  // Abrir DevTools en desarrollo (comentar en producción)
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Manejar enlaces externos
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    require('electron').shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Inicializar la aplicación
app.whenReady().then(async () => {
  try {
    // Primero iniciar el backend
    await startBackendServer();
    
    // Esperar un momento para asegurar que el servidor esté listo
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Luego crear la ventana
    createWindow();
  } catch (error) {
    console.error('Error al inicializar la aplicación:', error);
    app.quit();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Limpiar al cerrar
app.on('window-all-closed', () => {
  if (serverInstance) {
    serverInstance.close(() => {
      console.log('Servidor backend cerrado');
    });
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  if (serverInstance) {
    serverInstance.close();
  }
});

// Manejar errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Error no capturado:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Promesa rechazada no manejada:', error);
});
