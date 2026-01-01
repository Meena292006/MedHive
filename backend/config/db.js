const Database = require("better-sqlite3");
const db = new Database("medhive.db");

db.prepare(`
CREATE TABLE IF NOT EXISTS cases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_name TEXT,
  symptoms TEXT,
  predictions TEXT,
  risk_score INTEGER,
  priority TEXT,
  status TEXT DEFAULT 'PENDING',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS prescriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  case_id INTEGER,
  doctor_name TEXT,
  medicines TEXT,
  recommendations TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`).run();

module.exports = db;
