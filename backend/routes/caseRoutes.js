const router = require("express").Router();
const controller = require("../controllers/caseController");
const {
  verifyToken,
  isPatient,
  isDoctor
} = require("../middleware/authMiddleware");

/**
 * ===============================
 * PATIENT ROUTES
 * ===============================
 */

// Submit a new case (patient)
router.post(
  "/submit",
  verifyToken,
  isPatient,
  controller.submitCase
);

// 🔐 Patient can see ONLY their own cases
router.get(
  "/my-reports",
  verifyToken,
  isPatient,
  controller.getMyCases
);

/**
 * ===============================
 * DOCTOR ROUTES
 * ===============================
 */

// Doctor can see all cases
router.get(
  "/all",
  verifyToken,
  isDoctor,
  controller.getAllCases
);

module.exports = router;
