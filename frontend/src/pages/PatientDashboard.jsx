import { useState } from "react";
import { api } from "../api/api";
import DashboardLayout from "../components/DashboardLayout";
import SymptomSelect from "../components/SymptomSelect";
import {
  Button, TextField, Card, CardContent, Typography,
  Grid, Chip, Box, Divider, LinearProgress, useTheme, Avatar
} from "@mui/material";
import PersonIcon from "@mui/icons-material/PersonRounded";
import MedicalServicesIcon from "@mui/icons-material/MedicalServicesRounded";
import CoronavirusIcon from "@mui/icons-material/CoronavirusRounded";

export default function PatientDashboard() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

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
      <Box sx={{ mb: 5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700 }}>
            Dashboard
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.text.primary, mt: 0.5 }}>
            Patient Health Prediction System
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          {/* Placeholder for future top-bar actions */}
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* LEFT COLUMN: PATIENT INFO & SYMPTOMS */}
        <Grid item xs={12} md={5} lg={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar sx={{ bgcolor: theme.palette.primary.light, color: "white", mr: 2 }}>
                  <PersonIcon />
                </Avatar>
                <Typography variant="h6" fontWeight={700}>
                  Patient Details
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <TextField
                  label="Full Name"
                  fullWidth
                  variant="outlined"
                  placeholder="e.g. Sarah Johnson"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Contact Number"
                  fullWidth
                  variant="outlined"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: theme.palette.text.primary }}>
                    Reported Symptoms
                  </Typography>
                  <SymptomSelect value={symptoms} setValue={setSymptoms} />
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={submit}
                  disabled={loading}
                  sx={{
                    mt: 2,
                    py: 1.8,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    fontWeight: "bold",
                    fontSize: "1rem"
                  }}
                >
                  {loading ? "Analyzing Vitals..." : "Run Diagnosis"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* RIGHT COLUMN: AI PREDICTIONS */}
        <Grid item xs={12} md={7} lg={8}>
          {loading && (
            <Box sx={{ width: '100%', mt: 4 }}>
              <LinearProgress sx={{ borderRadius: 2, height: 8, bgcolor: theme.palette.grey[200], '& .MuiLinearProgress-bar': { borderRadius: 2, bgcolor: theme.palette.primary.main } }} />
              <Typography align="center" sx={{ mt: 2, color: theme.palette.text.secondary }}>Running AI Analysis...</Typography>
            </Box>
          )}

          {result && !loading && (
            <Card sx={{ height: "100%", overflow: "visible" }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar sx={{ bgcolor: theme.palette.success.light, color: "white", mr: 2, width: 48, height: 48 }}>
                      <MedicalServicesIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        Clinical Insights
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        AI-Powered Assessment
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={`Risk Level: ${result.priority}`}
                    color={getPriorityColor(result.priority)}
                    variant="filled"
                    sx={{ fontWeight: "800", borderRadius: "8px", px: 1 }}
                  />
                </Box>

                <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary, mb: 3, fontWeight: 500 }}>
                  Based on the symptoms provided, the AI model has identified the following potential conditions:
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {result.predictions.map((p, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        p: 3,
                        borderRadius: "16px",
                        backgroundColor: idx === 0 ? "rgba(67, 24, 255, 0.04)" : "white",
                        border: idx === 0 ? `1px solid ${theme.palette.primary.light}` : `1px solid ${theme.palette.grey[200]}`,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        transition: "transform 0.2s",
                        "&:hover": {
                          transform: "scale(1.01)",
                          boxShadow: "0px 10px 20px rgba(0,0,0,0.05)"
                        }
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{
                          width: 40, height: 40, borderRadius: "50%",
                          bgcolor: idx === 0 ? theme.palette.primary.light : theme.palette.grey[100],
                          color: "white", display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                          {/* Simple index or icon */}
                          <Typography variant="h6" sx={{ fontSize: "0.9rem", color: idx === 0 ? "white" : theme.palette.text.secondary }}>{idx + 1}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="body1" fontWeight={700} sx={{ color: theme.palette.text.primary, fontSize: "1.05rem" }}>
                            {p.disease}
                          </Typography>
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
                            Condition Detected
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="h5" fontWeight="800" sx={{ color: idx === 0 ? theme.palette.primary.main : theme.palette.text.primary }}>
                          {p.probability}%
                        </Typography>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>Confidence</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                {result.predictions.length === 0 && (
                  <Box sx={{ p: 4, textAlign: "center", bgcolor: theme.palette.background.default, borderRadius: 2 }}>
                    <Typography variant="body1" color="text.secondary" sx={{ fontStyle: "italic" }}>
                      No specific conditions matched. Please monitor the patient for new symptoms.
                    </Typography>
                  </Box>
                )}

              </CardContent>
            </Card>
          )}

          {!result && !loading && (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: theme.palette.text.secondary,
                border: `2px dashed ${theme.palette.grey[300]}`,
                borderRadius: "20px",
                minHeight: 400,
                opacity: 0.7
              }}
            >
              <CoronavirusIcon sx={{ fontSize: 60, color: theme.palette.grey[300], mb: 2 }} />
              <Typography variant="h6" fontWeight={500}>
                Enter symptoms to generate a diagnosis
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
