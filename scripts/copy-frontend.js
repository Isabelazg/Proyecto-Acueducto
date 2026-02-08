const fs = require('fs-extra');
const path = require('path');

const source = path.join(__dirname, '..', 'frontend', 'dist');
const destination = path.join(__dirname, '..', 'backend', 'public');

console.log('📦 Copiando frontend compilado al backend...');
console.log(`Origen: ${source}`);
console.log(`Destino: ${destination}`);

// Limpiar carpeta de destino si existe
if (fs.existsSync(destination)) {
  console.log('🧹 Limpiando carpeta public...');
  fs.removeSync(destination);
}

// Crear carpeta de destino
fs.ensureDirSync(destination);

// Copiar archivos
try {
  fs.copySync(source, destination, {
    overwrite: true,
    filter: (src) => {
      // Excluir archivos innecesarios
      const relativePath = path.relative(source, src);
      if (relativePath === '.gitkeep' || relativePath === '.DS_Store') {
        return false;
      }
      return true;
    }
  });
  
  console.log('✅ Frontend copiado exitosamente');
  
  // Verificar que index.html existe
  const indexPath = path.join(destination, 'index.html');
  if (fs.existsSync(indexPath)) {
    console.log('✅ index.html encontrado');
  } else {
    console.error('❌ ERROR: index.html no encontrado');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error al copiar frontend:', error);
  process.exit(1);
}
