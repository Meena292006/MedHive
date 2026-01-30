const db = require("../config/db");

// Doctor sends prescription
exports.sendPrescription = (req, res) => {
  try {
    const { caseId, patientUid, message } = req.body;

    db.prepare(`
      INSERT INTO prescriptions (case_id, patient_uid, doctor_uid, message)
      VALUES (?, ?, ?, ?)
    `).run(
      caseId,
      patientUid,
      req.user.uid,
      message
    );

    res.json({ message: "Prescription sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send prescription" });
  }
};

// Patient fetches own prescriptions
exports.getMyPrescriptions = (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT * FROM prescriptions
      WHERE patient_uid = ?
      ORDER BY created_at DESC
    `).all(req.user.uid);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch prescriptions" });
  }
};
