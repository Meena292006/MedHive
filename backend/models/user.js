const db = require("../config/db");

exports.createUser = (name, email, role) => {
  return db.prepare(
    "INSERT INTO users (name, email, role) VALUES (?, ?, ?)"
  ).run(name, email, role);
};

exports.getDoctors = () => {
  return db.prepare(
    "SELECT * FROM users WHERE role='doctor'"
  ).all();
};
