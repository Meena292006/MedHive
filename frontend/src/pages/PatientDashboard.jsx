import { useState } from "react";
import { api } from "../api/api";
import DashboardLayout from "../components/DashboardLayout";
import SymptomSelect from "../components/SymptomSelect";
import AnimatedCard from "../components/AnimatedCard";
import { StatCard } from "../components/AnalyticsCard";
import {
  Button, TextField, Card, CardContent, Typography,
  Grid, Chip, Box, LinearProgress, useTheme, Avatar
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import PersonIcon from "@mui/icons-material/PersonRounded";
import MedicalServicesIcon from "@mui/icons-material/MedicalServicesRounded";
import CoronavirusIcon from "@mui/icons-material/CoronavirusRounded";
import TrendingUpIcon from "@mui/icons-material/TrendingUpRounded";
import AssessmentIcon from "@mui/icons-material/AssessmentRounded";

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
    return priority === "HIGH" ? "error" : "success";
  };

  const matchedSymptoms = result?.matched || 0;
  const topPrediction = result?.predictions?.[0];

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 5, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700 }}>
              Dashboard
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.text.primary, mt: 0.5 }}>
              Patient Health Prediction System
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 1 }}>
              AI-Powered Clinical Decision Support
            </Typography>
          </Box>
        </Box>
      </motion.div>

      {/* Analytics Stats */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                label="Symptoms Matched"
                value={matchedSymptoms}
                icon={<AssessmentIcon />}
                color={theme.palette.primary.main}
                delay={0.1}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                label="Top Prediction"
                value={topPrediction?.probability || 0}
                icon={<TrendingUpIcon />}
                color={topPrediction?.probability > 50 ? theme.palette.error.main : theme.palette.success.main}
                delay={0.2}
                trendValue={`${topPrediction?.disease || "N/A"}`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                label="Risk Level"
                value={result.priority}
                icon={<MedicalServicesIcon />}
                color={result.priority === "HIGH" ? theme.palette.error.main : theme.palette.success.main}
                delay={0.3}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                label="Predictions"
                value={result.predictions?.length || 0}
                icon={<CoronavirusIcon />}
                color={theme.palette.info.main}
                delay={0.4}
              />
            </Grid>
          </Grid>
        </motion.div>
      )}

      <Grid container spacing={4}>
        {/* LEFT COLUMN: PATIENT INFO & SYMPTOMS */}
        <Grid item xs={12} md={5} lg={4}>
          <AnimatedCard delay={0.2} sx={{ height: "100%" }}>
            <CardContent sx={{ p: 4 }}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <Avatar sx={{ bgcolor: theme.palette.primary.main, color: "white", mr: 2, width: 56, height: 56, boxShadow: `0 10px 30px ${theme.palette.primary.main}40` }}>
                      <PersonIcon />
                    </Avatar>
                  </motion.div>
                  <Typography variant="h6" fontWeight={700}>
                    Patient Details
                  </Typography>
                </Box>
              </motion.div>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <TextField
                    label="Full Name"
                    fullWidth
                    variant="outlined"
                    placeholder="e.g. Sarah Johnson"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <TextField
                    label="Contact Number"
                    fullWidth
                    variant="outlined"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: theme.palette.text.primary }}>
                      Reported Symptoms
                    </Typography>
                    <SymptomSelect value={symptoms} setValue={setSymptoms} />
                  </Box>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
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
                      fontSize: "1rem",
                      boxShadow: `0 10px 30px ${theme.palette.primary.main}40`,
                      "&:hover": {
                        boxShadow: `0 15px 40px ${theme.palette.primary.main}60`,
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s",
                    }}
                  >
                    {loading ? "Analyzing Vitals..." : "Run Diagnosis"}
                  </Button>
                </motion.div>
              </Box>
            </CardContent>
          </AnimatedCard>
        </Grid>

        {/* RIGHT COLUMN: AI PREDICTIONS */}
        <Grid item xs={12} md={7} lg={8}>
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card sx={{ borderRadius: 4, overflow: "hidden" }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ textAlign: "center", mb: 3 }}>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <MedicalServicesIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />
                      </motion.div>
                    </Box>
                    <LinearProgress sx={{ borderRadius: 2, height: 8, bgcolor: theme.palette.grey[200], '& .MuiLinearProgress-bar': { borderRadius: 2, bgcolor: theme.palette.primary.main } }} />
                    <Typography align="center" sx={{ mt: 3, color: theme.palette.text.secondary, fontWeight: 600 }}>
                      Running AI Analysis...
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {result && !loading && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
              >
                <AnimatedCard sx={{ height: "100%", overflow: "visible" }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Avatar sx={{ bgcolor: theme.palette.success.main, color: "white", mr: 2, width: 56, height: 56, boxShadow: `0 10px 30px ${theme.palette.success.main}40` }}>
                            <MedicalServicesIcon />
                          </Avatar>
                        </motion.div>
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
                        sx={{ fontWeight: "800", borderRadius: "8px", px: 1, fontSize: "0.9rem" }}
                      />
                    </Box>

                    <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary, mb: 3, fontWeight: 500 }}>
                      Based on the symptoms provided, the AI model has identified the following potential conditions:
                    </Typography>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {result.predictions.map((p, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          whileHover={{ scale: 1.02, x: 5 }}
                        >
                          <Box
                            sx={{
                              p: 3,
                              borderRadius: "16px",
                              background: idx === 0
                                ? `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.primary.main}05)`
                                : "white",
                              border: idx === 0
                                ? `2px solid ${theme.palette.primary.main}`
                                : `1px solid ${theme.palette.grey[200]}`,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              transition: "all 0.3s",
                              position: "relative",
                              overflow: "hidden",
                              "&::before": idx === 0 ? {
                                content: '""',
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "4px",
                                height: "100%",
                                background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                              } : {},
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                              <Box sx={{
                                width: 48, height: 48, borderRadius: "50%",
                                bgcolor: idx === 0 ? theme.palette.primary.main : theme.palette.grey[100],
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: idx === 0 ? `0 8px 20px ${theme.palette.primary.main}40` : "none",
                              }}>
                                <Typography variant="h6" sx={{ fontSize: "1rem", color: idx === 0 ? "white" : theme.palette.text.secondary, fontWeight: 800 }}>
                                  {idx + 1}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="body1" fontWeight={700} sx={{ color: theme.palette.text.primary, fontSize: "1.1rem" }}>
                                  {p.disease}
                                </Typography>
                                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
                                  Condition Detected
                                </Typography>
                              </Box>
                            </Box>

                            <Box sx={{ textAlign: "right" }}>
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: idx * 0.1 + 0.3, type: "spring" }}
                              >
                                <Typography variant="h4" fontWeight="800" sx={{ color: idx === 0 ? theme.palette.primary.main : theme.palette.text.primary }}>
                                  {p.probability}%
                                </Typography>
                              </motion.div>
                              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                Confidence
                              </Typography>
                            </Box>
                          </Box>
                        </motion.div>
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
                </AnimatedCard>
              </motion.div>
            )}

            {!result && !loading && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
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
                    opacity: 0.7,
                    background: `linear-gradient(135deg, ${theme.palette.background.default}, ${theme.palette.background.paper})`,
                  }}
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <CoronavirusIcon sx={{ fontSize: 80, color: theme.palette.grey[300], mb: 2 }} />
                  </motion.div>
                  <Typography variant="h6" fontWeight={500}>
                    Enter symptoms to generate a diagnosis
                  </Typography>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
