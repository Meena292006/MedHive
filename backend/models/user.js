const db = require("../config/db");

exports.createUser = (uid, name, email, role) => {
  return db.prepare(
    "INSERT INTO users (uid, name, email, role) VALUES (?, ?, ?, ?)"
  ).run(uid, name, email, role);
};

exports.findByUid = (uid) => {
  return db.prepare("SELECT * FROM users WHERE uid = ?").get(uid);
};

exports.findByEmail = (email) => {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email);
};

exports.updateRole = (uid, role) => {
  return db.prepare(
    "UPDATE users SET role = ? WHERE uid = ?"
  ).run(role, uid);
};

exports.getDoctors = () => {
  return db.prepare(
    "SELECT * FROM users WHERE role='doctor'"
  ).all();
};

exports.getPatients = () => {
  return db.prepare(
    "SELECT * FROM users WHERE role='patient'"
  ).all();
};

exports.getAllUsers = () => {
  return db.prepare("SELECT * FROM users").all();
};

exports.getUserStats = () => {
  const stats = db.prepare(`
    SELECT 
      role,
      COUNT(*) as count
    FROM users
    GROUP BY role
  `).all();

  return {
    total: stats.reduce((sum, s) => sum + s.count, 0),
    doctors: stats.find(s => s.role === 'doctor')?.count || 0,
    patients: stats.find(s => s.role === 'patient')?.count || 0
  };
};
