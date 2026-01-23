const router = require("express").Router();
const Case = require("../models/case");
const { verifyToken, isPatient } = require("../middleware/authMiddleware");

router.use(verifyToken);
router.use(isPatient);

router.get("/my-reports", (req, res) => {
    res.json(Case.getCasesByUser(req.user.id));
});

module.exports = router;
