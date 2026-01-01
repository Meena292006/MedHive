const router = require("express").Router();
const controller = require("../controllers/doctorController");

router.post("/prescribe", controller.prescribe);

module.exports = router;
