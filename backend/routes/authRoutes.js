const router = require("express").Router();
const authController = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

// Register or login with Firebase token
router.post("/register-or-login", authController.registerOrLogin);

// Get user profile (protected)
router.get("/profile", verifyToken, authController.getProfile);

// Update user role (protected)
router.put("/role", verifyToken, authController.updateRole);

// Legacy register endpoint for backward compatibility
router.post("/register", authController.register);

module.exports = router;
