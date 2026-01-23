const db = require("../config/db");

try {
    console.log("Attempting to drop 'users' table...");
    db.prepare("DROP TABLE IF EXISTS users").run();
    console.log("'users' table dropped successfully.");

    // Re-run the table creation logic from db.js (conceptually)
    // Or just let the server restart handle it, but since server is already running, 
    // we should recreate it here to be safe and immediate.

    console.log("Recreating 'users' table with new schema...");
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
    console.log("'users' table recreated successfully.");

} catch (error) {
    console.error("Error resetting users table:", error.message);
}
