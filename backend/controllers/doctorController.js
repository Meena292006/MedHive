const Prescription = require("../models/prescription");
const Case = require("../models/case");

exports.getAllPatients = (req, res) => {
  try {
    const cases = Case.getAllCases();
    res.json(cases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch all patients" });
  }
};

exports.prescribe = (req, res) => {
  const { caseId, doctor, medicines, recommendations } = req.body;

  Prescription.addPrescription({
    caseId,
    doctor,
    medicines,
    recommendations
  });

  Case.updateStatus(caseId, "TREATED");

  res.json({
    message: "Prescription saved & case closed"
  });
};
