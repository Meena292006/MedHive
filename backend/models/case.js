const db = require("../config/db");

/**
 * CREATE CASE (report)
 * patientUid MUST be Firebase UID
 */
exports.createCase = (data) => {
  return db.prepare(`
    INSERT INTO cases
    (patient_uid, patient_name, symptoms, predictions, priority)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    data.patientUid,
    data.patient,
    JSON.stringify(data.symptoms || []),
    JSON.stringify(data.predictions || []),
    data.priority || "LOW"
  );
};

/**
 * 🚫 REMOVE / DO NOT USE FOR PATIENT
 * Admin / Doctor only
 */
exports.getAllCases = () => {
  return db.prepare(`
    SELECT * FROM cases
    ORDER BY created_at DESC
  `).all();
};

/**
 * ✅ ONLY fetch logged-in user's cases
 */
exports.getCasesByUser = (patientUid) => {
  return db.prepare(`
    SELECT *
    FROM cases
    WHERE patient_uid = ?
    ORDER BY created_at DESC
  `).all(patientUid);
};
