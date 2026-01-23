const router = require("express").Router();
const controller = require("../controllers/caseController");
const { verifyToken } = require("../middleware/authMiddleware");

router.use(verifyToken);

router.post("/submit", controller.submitCase);
router.post("/save", controller.savePrediction);
router.get("/", controller.getAllCases);

module.exports = router;
