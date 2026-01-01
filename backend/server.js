const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/cases", require("./routes/caseRoutes"));
app.use("/api/doctor", require("./routes/doctorRoutes"));

app.get("/", (req, res) => {
  res.send("MedHive Backend Running");
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
