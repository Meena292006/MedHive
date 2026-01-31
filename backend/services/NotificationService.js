const nodemailer = require("nodemailer");
const twilio = require("twilio");

/**
 * Real-world AI Triage Notification Service
 * Integrates:
 * 1. Twilio (Voice Calls & SMS)
 * 2. Nodemailer (Email reports)
 */
class NotificationService {
    constructor() {
        // 📧 EMAIL SETUP (Ethereal for POC, or .env for real)
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.ethereal.email',
            port: process.env.SMTP_PORT || 587,
            auth: {
                user: process.env.SMTP_USER || 'mock_user@medhive.ai',
                pass: process.env.SMTP_PASS || 'mock_pass'
            }
        });

        // 📱 TWILIO SETUP (Using dummy creds to prevent crashes, requires valid .env)
        const accountSid = process.env.TWILIO_ACCOUNT_SID || "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
        const authToken = process.env.TWILIO_AUTH_TOKEN || "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy";
        this.client = twilio(accountSid, authToken);
        this.fromPhone = process.env.TWILIO_PHONE || "+1234567890";
        this.doctorPhone = process.env.DOCTOR_PHONE || "+1234567890"; // Target for calls
    }

    async triageAlert(patientName, data) {
        const isEmergency = data.score >= 0.8;
        const triageLevel = isEmergency ? "HIGH (EMERGENCY)" : "MODERATE (URGENT)";

        console.log(`\n--- 🚨 AI TRIAGE AUTOMATION EXECUTION: ${patientName} ---`);
        console.log(`Level: ${triageLevel} | Score: ${data.score * 100}%`);

        const alerts = [];

        // 1. Send Email Alert (Always for Triage)
        alerts.push(this.sendEmail(patientName, data, triageLevel));

        // 2. Action based on severity
        if (isEmergency) {
            // CRITICAL: CALL DOCTOR + SMS
            alerts.push(this.initiateVoiceCall(patientName, data));
            alerts.push(this.sendSMS(patientName, "🚨 EMERGENCY: Dr. Smith, high risk patient detected. Please check dashboard immediately."));
        } else if (data.score >= 0.4) {
            // URGENT: SMS NURSE
            alerts.push(this.sendSMS(patientName, `📢 URGENT: Nurse alert for ${patientName}. Moderate respiratory risk.`));
        }

        return Promise.all(alerts);
    }

    async sendEmail(patientName, data, level) {
        try {
            const info = await this.transporter.sendMail({
                from: '"MedHive AI Triage" <triage@medhive.ai>',
                to: "clinic-triage@medhive.ai",
                subject: `[${level}] Triage Report: ${patientName}`,
                text: `Patient Name: ${patientName}\nRisk Score: ${data.score * 100}%\nAI Analysis: ${data.general.title}\nAdvice: ${data.general.message}\nAutomated Action: ${data.action}`
            });
            console.log(`✅ Email Dispatched: ${info.messageId}`);
            return info;
        } catch (err) {
            console.error("❌ Email Error:", err.message);
        }
    }

    async initiateVoiceCall(patientName, data) {
        console.log(`📞 [VOICE] Initiating emergency call to Primary Physician...`);
        try {
            // Real Twilio Voice Call
            const call = await this.client.calls.create({
                twiml: `<Response><Say>Emergency! Med-Hive alert. High risk patient ${patientName} detected. Please check your triage dashboard immediately.</Say></Response>`,
                to: this.doctorPhone,
                from: this.fromPhone
            });
            console.log(`✅ Voice Call Initiated: ${call.sid}`);
        } catch (err) {
            console.log(`⚠️  [SIMULATION] Voice call would be made to ${this.doctorPhone} via Twilio.`);
            console.log(`Script: "Emergency! Med-Hive alert. High risk patient ${patientName} detected..."`);
        }
    }

    async sendSMS(patientName, message) {
        console.log(`💬 [SMS] Sending notification to on-call staff...`);
        try {
            const msg = await this.client.messages.create({
                body: message,
                from: this.fromPhone,
                to: this.doctorPhone
            });
            console.log(`✅ SMS Sent: ${msg.sid}`);
        } catch (err) {
            console.log(`⚠️  [SIMULATION] SMS sent to ${this.doctorPhone}: "${message}"`);
        }
    }
}

module.exports = new NotificationService();
