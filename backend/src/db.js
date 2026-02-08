const path = require("path");
const fs = require("fs");
const initSqlJs = require("sql.js");

// Determinar la ubicación de la base de datos
const dbFile = process.env.NODE_ENV === 'production'
  ? path.join(path.dirname(process.execPath), "data.db")
  : path.resolve(__dirname, "..", "data.db");

let db = null;

// Inicializar sql.js de forma síncrona usando una promesa
async function initDb() {
  const SQL = await initSqlJs();
  
  // Cargar base de datos existente o crear una nueva
  if (fs.existsSync(dbFile)) {
    const buffer = fs.readFileSync(dbFile);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  
  // Habilitar foreign keys
  db.run("PRAGMA foreign_keys = ON");
  
  return db;
}

// Función para guardar la base de datos en disco
function saveDb() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbFile, buffer);
  }
}

// Wrapper para ejecutar queries y auto-guardar
const dbProxy = {
  prepare: (sql) => {
    if (!db) throw new Error("Database not initialized");
    const stmt = db.prepare(sql);
    return {
      run: (...params) => {
        const result = stmt.run(params);
        saveDb();
        return result;
      },
      get: (...params) => {
        stmt.bind(params);
        const hasRow = stmt.step();
        if (!hasRow) return undefined;
        const row = stmt.getAsObject();
        stmt.reset();
        return row;
      },
      all: (...params) => {
        stmt.bind(params);
        const rows = [];
        while (stmt.step()) {
          rows.push(stmt.getAsObject());
        }
        stmt.reset();
        return rows;
      }
    };
  },
  exec: (sql) => {
    if (!db) throw new Error("Database not initialized");
    db.run(sql);
    saveDb();
  }
};

async function initSchema() {
  await initDb();
  
  dbProxy.exec(`
    CREATE TABLE IF NOT EXISTS person (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      active INTEGER NOT NULL DEFAULT 1,
      monthly_fee INTEGER,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS monthly_fee (
      period TEXT PRIMARY KEY,
      amount INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS payment (
      id TEXT PRIMARY KEY,
      person_id TEXT NOT NULL,
      period TEXT NOT NULL,
      amount INTEGER NOT NULL,
      paid_at TEXT NOT NULL,
      note TEXT,
      FOREIGN KEY (person_id) REFERENCES person(id) ON DELETE CASCADE,
      UNIQUE (person_id, period)
    );

    CREATE TABLE IF NOT EXISTS expense (
      id TEXT PRIMARY KEY,
      period TEXT NOT NULL,
      amount INTEGER NOT NULL,
      description TEXT NOT NULL,
      spent_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS other_income (
      id TEXT PRIMARY KEY,
      period TEXT NOT NULL,
      amount INTEGER NOT NULL,
      description TEXT NOT NULL,
      received_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_payment_period ON payment(period);
    CREATE INDEX IF NOT EXISTS idx_payment_person ON payment(person_id);
    CREATE INDEX IF NOT EXISTS idx_expense_period ON expense(period);
    CREATE INDEX IF NOT EXISTS idx_person_active ON person(active);
  `);
}

// Exportar tanto la promesa de inicialización como el proxy
const dbReady = initSchema();

module.exports = { db: dbProxy, dbReady, saveDb };
