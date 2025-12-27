require("dotenv/config");

const path = require("path");
const Database = require("better-sqlite3");

const dbFile = process.env.DB_FILE
  ? path.resolve(process.env.DB_FILE)
  : path.resolve(__dirname, "..", "data.db");

const db = new Database(dbFile);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

function initSchema() {
  db.exec(`
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

initSchema();

module.exports = { db };
