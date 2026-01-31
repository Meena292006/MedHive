const express = require("express");
const router = express.Router();
const axios = require("axios");

// ML Service URL (using port 5002 as confirmed working)
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:5002";
const notificationService = require("../services/NotificationService");

// Triage endpoint
router.post("/triage", async (req, res) => {
    const { symptoms, patientName } = req.body;
    const name = patientName || "Anonymous Patient";

    try {
        const mlResponse = await axios.post(`${ML_SERVICE_URL}/api/medalert/triage`, {
            symptoms: symptoms,
            patient_name: name
        });

        const data = mlResponse.data;

        // 🔥 REAL-TIME AI TRIAGE AUTOMATION (Emails, SMS, Voice Calls)
        await notificationService.triageAlert(name, data.advice);

        res.json(data);
    } catch (error) {
        console.error("Triage API Error:", error.message);
        res.status(500).json({ error: "Failed to process triage alert", details: error.message });
    }
});

// Proxy analysis to MedHive ML Service
router.post("/analyze", async (req, res) => {
    const { transcript, patientName } = req.body;
    try {
        const mlResponse = await axios.post(`${ML_SERVICE_URL}/analyze-speech`, {
            transcript
        });
        const advice = mlResponse.data.advice;
        await notificationService.triageAlert(patientName || "Anonymous Patient", advice);
        res.json({ advice });
    } catch (error) {
        console.error("Analysis Error:", error.message);
        res.status(500).json({ error: "Failed to analyze speech" });
    }
});

router.get("/history", async (req, res) => {
    res.json([]);
});

module.exports = router;
