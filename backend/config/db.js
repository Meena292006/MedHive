const Database = require("better-sqlite3");
const db = new Database("medhive.db");

/* ================= USERS ================= */

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

db.prepare(`CREATE INDEX IF NOT EXISTS idx_users_uid ON users(uid)`).run();
db.prepare(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`).run();
db.prepare(`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`).run();

/* ================= CASES ================= */

db.prepare(`
CREATE TABLE IF NOT EXISTS cases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_uid TEXT,
  patient_name TEXT,
  symptoms TEXT,
  predictions TEXT,
  priority TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_uid) REFERENCES users(uid)
)
`).run();

db.prepare(`CREATE INDEX IF NOT EXISTS idx_cases_patient_uid ON cases(patient_uid)`).run();
db.prepare(`CREATE INDEX IF NOT EXISTS idx_cases_created_at ON cases(created_at)`).run();

/* ================= PRESCRIPTIONS ================= */

db.prepare(`
CREATE TABLE IF NOT EXISTS prescriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  case_id INTEGER,
  patient_uid TEXT,
  doctor_uid TEXT,
  message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (case_id) REFERENCES cases (id),
  FOREIGN KEY (patient_uid) REFERENCES users(uid),
  FOREIGN KEY (doctor_uid) REFERENCES users(uid)
)
`).run();

db.prepare(`CREATE INDEX IF NOT EXISTS idx_prescriptions_case_id ON prescriptions(case_id)`).run();
db.prepare(`CREATE INDEX IF NOT EXISTS idx_prescriptions_patient_uid ON prescriptions(patient_uid)`).run();
db.prepare(`CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor_uid ON prescriptions(doctor_uid)`).run();

module.exports = db;
