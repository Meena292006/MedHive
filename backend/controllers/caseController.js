const axios = require("axios");
const Case = require("../models/case");

exports.submitCase = async (req, res) => {
  const { patient, phone, symptoms, type } = req.body;
  const userId = req.user.id;

  if (!userId) {
    return res.status(401).json({ message: "User not found in database" });
  }

  let riskScore = 0;
  let predictions = [];
  let priority = "NORMAL";
  let matched = 0;

  if (type === "SYMPTOMS" || !type) {
    try {
      console.log(`Sending symptoms to ML service: ${JSON.stringify(symptoms)}`);
      const mlRes = await axios.post(
        "http://127.0.0.1:8000/predict",
        { symptoms }
      );
      console.log("ML service response:", JSON.stringify(mlRes.data));

      predictions = mlRes.data.top_predictions || [];
      matched = mlRes.data.matched || 0;

      if (predictions.length > 0) {
        riskScore = Math.min(100, Math.round(predictions[0].probability * 10));
      }
      priority = mlRes.data.priority || (riskScore > 60 ? "HIGH" : "NORMAL");
    } catch (err) {
      console.error("ML Service error:", err.message);
      if (err.response) {
        console.error("ML Service error detail:", JSON.stringify(err.response.data));
      }
    }
  }

  Case.createCase({
    userId,
    patient,
    phone,
    type: type || "SYMPTOMS",
    symptoms,
    predictions,
    riskScore,
    priority
  });

  res.json({
    message: "Case submitted successfully",
    riskScore,
    priority,
    predictions,
    matched
  });
};

exports.savePrediction = (req, res) => {
  const { patient, type, result, probability, is_danger } = req.body;
  const userId = req.user.id;

  Case.createCase({
    userId,
    patient,
    phone: "", // Not applicable here usually but keeping schema consistent
    type,
    symptoms: [],
    predictions: [{ label: result, probability }],
    riskScore: probability,
    priority: is_danger ? "HIGH" : "NORMAL"
  });

  res.json({ message: "Prediction saved to reports" });
};

exports.getAllCases = (req, res) => {
  if (req.user.role === "doctor") {
    res.json(Case.getAllCases());
  } else {
    res.json(Case.getCasesByUser(req.user.id));
  }
};
