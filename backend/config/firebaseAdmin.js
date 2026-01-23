const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

const serviceAccountPath = path.join(__dirname, "firebase-service-account.json");

if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} else {
    console.warn("⚠️ Firebase service account file not found. Token verification will be disabled until 'backend/config/firebase-service-account.json' is provided.");
    // Initialize with dummy data or minimal config to prevent crashes if possible, 
    // but usually admin.credential.applicationDefault() or cert is needed.
    // For now, we'll just not initialize and check for initialization in middleware.
}

module.exports = admin;
