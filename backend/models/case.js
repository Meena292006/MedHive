const db = require("../config/db");

exports.createCase = (data) => {
  db.prepare(`
    INSERT INTO cases
    (patient_name, symptoms, predictions, risk_score, priority)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    data.patient,
    JSON.stringify(data.symptoms),
    JSON.stringify(data.predictions),
    data.riskScore,
    data.priority
  );
};

exports.getAllCases = () => {
  return db.prepare(`
    SELECT * FROM cases
    ORDER BY risk_score DESC, created_at DESC
  `).all();
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
