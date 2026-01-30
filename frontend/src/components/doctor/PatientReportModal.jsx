import { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent,
  TextField, Button, Box, Alert
} from "@mui/material";
import { api } from "../../api/api";

export default function PatientReportModal({ open, handleClose, patientCase }) {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  if (!patientCase) return null;

  const sendPrescription = async () => {
    try {
      setError("");
      setSuccess("");

      console.log('Sending prescription:', {
        caseId: patientCase?.id,
        patientUid: patientCase?.patient_uid,
        message: message,
        fullPatientCase: patientCase
      });

      await api.post("/prescriptions/send", {
        caseId: patientCase.id,
        patientUid: patientCase.patient_uid,
        message: message
      });

      setSuccess("Prescription sent to patient");
      setMessage("");
    } catch (e) {
      setError("Failed to send prescription");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Prescription – {patientCase.patient_name}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <strong>Condition:</strong> {patientCase.type}<br />
          <strong>Risk:</strong> {patientCase.priority}
        </Box>

        <TextField
          label="Write Prescription"
          multiline
          rows={4}
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Medicines, dosage, precautions..."
        />

        {success && <Alert sx={{ mt: 2 }} severity="success">{success}</Alert>}
        {error && <Alert sx={{ mt: 2 }} severity="error">{error}</Alert>}

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={handleClose} sx={{ mr: 2 }}>
            Close
          </Button>
          <Button
            variant="contained"
            disabled={!message}
            onClick={sendPrescription}
          >
            Send
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
