const axios = require("axios");
const Case = require("../models/case");

exports.submitCase = async (req, res) => {
  const { patient, symptoms, type } = req.body;

  let riskScore = 0;
  let predictions = [];
  let priority = "NORMAL";

  if (type === "SYMPTOMS" || !type) {
    const mlRes = await axios.post(
      "http://127.0.0.1:8000/predict",
      { symptoms }
    );
    predictions = mlRes.data.top_predictions || [];
    if (predictions.length > 0) {
      riskScore = Math.min(100, Math.round(predictions[0].probability * 10));
    }
    priority = mlRes.data.priority || (riskScore > 60 ? "HIGH" : "NORMAL");
  }

  Case.createCase({
    patient,
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
    predictions
  });
};

exports.savePrediction = (req, res) => {
  const { patient, type, result, probability, is_danger } = req.body;

  Case.createCase({
    patient,
    type,
    symptoms: [], // Features could go here if needed
    predictions: [{ label: result, probability }],
    riskScore: probability,
    priority: is_danger ? "HIGH" : "NORMAL"
  });

  res.json({ message: "Prediction saved to reports" });
};

exports.getAllCases = (req, res) => {
  res.json(Case.getAllCases());
};
