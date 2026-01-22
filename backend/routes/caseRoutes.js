const router = require("express").Router();
const controller = require("../controllers/caseController");

router.post("/submit", controller.submitCase);
router.post("/save", controller.savePrediction);
router.get("/", controller.getAllCases);

module.exports = router;
