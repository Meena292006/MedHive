const router = require("express").Router();
const controller = require("../controllers/prescriptionController");
const {
  verifyToken,
  isDoctor,
  isPatient
} = require("../middleware/authMiddleware");

// Doctor sends prescription
router.post("/send", verifyToken, isDoctor, controller.sendPrescription);

// Patient fetches own prescriptions
router.get("/my", verifyToken, isPatient, controller.getMyPrescriptions);

module.exports = router;
