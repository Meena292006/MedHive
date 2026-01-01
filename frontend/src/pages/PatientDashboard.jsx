import { useState } from "react";
import { api } from "../api/api";
import DashboardLayout from "../components/DashboardLayout";
import SymptomSelect from "../components/SymptomSelect";
import {
  Button, TextField, Card, CardContent, Typography,
  Grid, Chip, Box, Divider, LinearProgress
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

export default function PatientDashboard() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (symptoms.length === 0) return;

    setLoading(true);
    try {
      const res = await api.post("/cases/submit", {
        patient: name || "Anonymous",
        symptoms
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    return priority === "HIGH" ? "error" : "success"; // Red for High, Green for Normal
  };

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1e293b" }}>
          Patient Portal
        </Typography>
        <Typography variant="body1" sx={{ color: "#64748b" }}>
          Manage your health profile and run AI diagnostics.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* LEFT COLUMN: PATIENT INFO & SYMPTOMS */}
        <Grid item xs={12} md={5} lg={4}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PersonIcon sx={{ color: "#38bdf8", mr: 1, fontSize: 28 }} />
                <Typography variant="h6" fontWeight={600}>
                  Patient Details
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <TextField
                label="Full Name"
                fullWidth
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <TextField
                label="Contact Number"
                fullWidth
                variant="outlined"
                size="small"
                sx={{ mb: 3 }}
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />

              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Reported Symptoms
              </Typography>
              <SymptomSelect value={symptoms} setValue={setSymptoms} />

              <Button
                variant="contained"
                fullWidth
                onClick={submit}
                disabled={loading}
                sx={{
                  mt: 3,
                  py: 1.2,
                  backgroundColor: "#0ea5e9",
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "#0284c7" }
                }}
              >
                {loading ? "Analyzing..." : "Run AI Diagnosis"}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* RIGHT COLUMN: AI PREDICTIONS */}
        <Grid item xs={12} md={7} lg={8}>
          {loading && <LinearProgress sx={{ borderRadius: 2 }} />}

          {result && (
            <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <MedicalServicesIcon sx={{ color: "#10b981", mr: 1, fontSize: 28 }} />
                    <Typography variant="h6" fontWeight={600}>
                      AI Clinical Insights
                    </Typography>
                  </Box>
                  <Chip
                    label={`Priority: ${result.priority}`}
                    color={getPriorityColor(result.priority)}
                    variant="filled"
                    sx={{ fontWeight: "bold" }}
                  />
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Typography variant="subtitle1" sx={{ color: "#64748b", mb: 2 }}>
                  Based on the symptoms provided, the AI model has identified the following potential conditions:
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {result.predictions.map((p, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        p: 2,
                        border: "1px solid #e2e8f0",
                        borderRadius: 2,
                        backgroundColor: idx === 0 ? "#f0f9ff" : "white",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <Box>
                        <Typography variant="body1" fontWeight={600} sx={{ color: "#334155" }}>
                          {p.disease}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                          Confidence Score
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ color: "#0ea5e9" }}>
                          {p.probability}%
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                {result.predictions.length === 0 && (
                  <Typography variant="body1" color="text.secondary" sx={{ fontStyle: "italic", mt: 2 }}>
                    No specific conditions matched. Monitor patient for new symptoms.
                  </Typography>
                )}

              </CardContent>
            </Card>
          )}

          {!result && !loading && (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#cbd5e1",
                border: "2px dashed #e2e8f0",
                borderRadius: 3,
                minHeight: 300
              }}
            >
              <Typography variant="h6">
                Enter symptoms to generate a diagnosis
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
