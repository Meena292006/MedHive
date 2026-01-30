const db = require("../config/db");

exports.createPrescription = ({ caseId, patientUid, doctorUid, message }) => {
  return db.prepare(`
    INSERT INTO prescriptions
    (case_id, patient_uid, doctor_uid, message)
    VALUES (?, ?, ?, ?)
  `).run(caseId, patientUid, doctorUid, message);
};

exports.getByPatient = (patientUid) => {
  return db.prepare(`
    SELECT *
    FROM prescriptions
    WHERE patient_uid = ?
    ORDER BY created_at DESC
  `).all(patientUid);
};

exports.getByCase = (caseId) => {
  return db.prepare(`
    SELECT *
    FROM prescriptions
    WHERE case_id = ?
    ORDER BY created_at ASC
  `).all(caseId);
};
