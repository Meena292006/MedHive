const Case = require("../models/case");

/**
 * ===============================

 * PATIENT
 * ===============================
 */

// Submit new case
exports.submitCase = (req, res) => {
  try {
    const result = Case.createCase({
      patientUid: req.user.uid,
      patient: req.body.patient,
      symptoms: req.body.symptoms,
      predictions: req.body.predictions,
      priority: req.body.priority
    });

    res.status(201).json({
      message: "Case submitted successfully",
      caseId: result.lastInsertRowid
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to submit case" });
  }
};

// 🔐 Patient sees ONLY their own cases
exports.getMyCases = (req, res) => {
  try {
    const cases = Case.getCasesByUser(req.user.uid);
    res.json(cases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch cases" });
  }
};

/**
 * ===============================
 * DOCTOR
 * ===============================
 */

// Doctor sees all cases
exports.getAllCases = (req, res) => {
  try {
    const cases = Case.getAllCases();
    res.json(cases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch all cases" });
  }
};
