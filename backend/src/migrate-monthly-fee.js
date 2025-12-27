require("dotenv/config");
const path = require("path");
const Database = require("better-sqlite3");

const dbFile = process.env.DB_FILE
  ? path.resolve(process.env.DB_FILE)
  : path.resolve(__dirname, "..", "data.db");

console.log("Conectando a:", dbFile);
const db = new Database(dbFile);

try {
  // Verificar si la columna ya existe
  const columns = db.prepare("PRAGMA table_info(person)").all();
  const hasMonthlyFee = columns.some(col => col.name === 'monthly_fee');
  
  if (hasMonthlyFee) {
    console.log("✓ La columna monthly_fee ya existe");
  } else {
    console.log("Agregando columna monthly_fee a la tabla person...");
    db.prepare("ALTER TABLE person ADD COLUMN monthly_fee INTEGER").run();
    console.log("✓ Columna monthly_fee agregada exitosamente");
  }
  
  // Mostrar estructura actualizada
  const updatedColumns = db.prepare("PRAGMA table_info(person)").all();
  console.log("\nEstructura de la tabla person:");
  updatedColumns.forEach(col => {
    console.log(`  - ${col.name}: ${col.type}${col.notnull ? ' NOT NULL' : ''}${col.dflt_value ? ` DEFAULT ${col.dflt_value}` : ''}`);
  });
  
} catch (error) {
  console.error("Error:", error.message);
  process.exit(1);
} finally {
  db.close();
}
