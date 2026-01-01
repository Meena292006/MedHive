const router = require("express").Router();
const User = require("../models/user");

router.post("/register", (req, res) => {
  const { name, email, role } = req.body;
  User.createUser(name, email, role);
  res.json({ message: "User registered" });
});

module.exports = router;
