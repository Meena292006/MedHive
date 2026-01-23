const router = require("express").Router();
const Case = require("../models/case");
const { verifyToken, isDoctor } = require("../middleware/authMiddleware");

router.use(verifyToken);
router.use(isDoctor);

router.get("/all-patients", (req, res) => {
    res.json(Case.getAllCases());
});

module.exports = router;
