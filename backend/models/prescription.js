const db = require("../config/db");

exports.addPrescription = (data) => {
  db.prepare(`
    INSERT INTO prescriptions
    (case_id, doctor_name, medicines, recommendations)
    VALUES (?, ?, ?, ?)
  `).run(
    data.caseId,
    data.doctor,
    data.medicines,
    data.recommendations
  );
};

exports.getByCaseId = (caseId) => {
  return db.prepare(`
    SELECT * FROM prescriptions WHERE case_id=?
  `).all(caseId);
};
