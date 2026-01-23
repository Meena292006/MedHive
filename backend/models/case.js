const db = require("../config/db");

exports.createCase = (data) => {
  db.prepare(`
    INSERT INTO cases
    (user_id, patient_name, phone, type, symptoms, predictions, risk_score, priority)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    data.userId,
    data.patient,
    data.phone,
    data.type || 'SYMPTOMS',
    JSON.stringify(data.symptoms),
    JSON.stringify(data.predictions),
    data.riskScore,
    data.priority
  );
};

exports.getAllCases = () => {
  return db.prepare(`
    SELECT * FROM cases
    ORDER BY created_at DESC
  `).all();
};

exports.getCasesByUser = (userId) => {
  return db.prepare(`
    SELECT * FROM cases
    WHERE user_id = ?
    ORDER BY created_at DESC
  `).all(userId);
};

exports.findSimilarCases = (symptoms) => {
  const all = db.prepare(`SELECT * FROM cases`).all();

  return all.filter(c => {
    const s = JSON.parse(c.symptoms);
    return symptoms.some(sym => s.includes(sym));
  });
};

exports.updateStatus = (caseId, status) => {
  db.prepare(`
    UPDATE cases SET status=? WHERE id=?
  `).run(status, caseId);
};
