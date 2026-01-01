const axios = require("axios");
const Case = require("../models/case");

exports.submitCase = async (req, res) => {
  const { patient, symptoms } = req.body;

  const mlRes = await axios.post(
    "http://127.0.0.1:8000/predict",
    { symptoms }
  );

  const predictions = mlRes.data.top_predictions || [];

  let riskScore = 0;
  if (predictions.length > 0) {
    riskScore = Math.min(
      100,
      Math.round(predictions[0].probability * 10)
    );
  }

  const priority = mlRes.data.priority || (riskScore > 60 ? "HIGH" : "NORMAL");

  Case.createCase({
    patient,
    symptoms,
    predictions,
    riskScore,
    priority
  });

  const similarCases = Case.findSimilarCases(symptoms);

  res.json({
    message: "Case submitted successfully",
    riskScore,
    priority,
    predictions,
    similarPastCases: similarCases.slice(0, 3)
  });
};

exports.getAllCases = (req, res) => {
  res.json(Case.getAllCases());
};
