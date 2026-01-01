const Prescription = require("../models/prescription");
const Case = require("../models/case");

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
