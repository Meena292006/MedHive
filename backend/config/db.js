const Database = require("better-sqlite3");
const db = new Database("medhive.db");

db.prepare(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  uid TEXT UNIQUE,
  name TEXT,
  email TEXT UNIQUE,
  role TEXT CHECK(role IN ('doctor', 'patient')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`).run();

// Add indexes for better performance
db.prepare(`CREATE INDEX IF NOT EXISTS idx_users_uid ON users(uid)`).run();
db.prepare(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`).run();
db.prepare(`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS cases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  patient_name TEXT,
  phone TEXT,
  type TEXT DEFAULT 'SYMPTOMS',
  symptoms TEXT,
  predictions TEXT,
  risk_score INTEGER,
  priority TEXT,
  status TEXT DEFAULT 'PENDING',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
)
`).run();

// Add indexes for cases table
db.prepare(`CREATE INDEX IF NOT EXISTS idx_cases_user_id ON cases(user_id)`).run();
db.prepare(`CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status)`).run();
db.prepare(`CREATE INDEX IF NOT EXISTS idx_cases_created_at ON cases(created_at)`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS prescriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  case_id INTEGER,
  doctor_name TEXT,
  medicines TEXT,
  recommendations TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (case_id) REFERENCES cases (id)
)
`).run();

// Add indexes for prescriptions table
db.prepare(`CREATE INDEX IF NOT EXISTS idx_prescriptions_case_id ON prescriptions(case_id)`).run();

module.exports = db;
