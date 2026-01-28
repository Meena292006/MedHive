import { useState, useEffect } from "react";
import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import SymptomSelect from "../components/SymptomSelect";
import AnimatedCard from "../components/AnimatedCard";
import { StatCard } from "../components/AnalyticsCard";
import {
  Button, TextField, Card, CardContent, Typography,
  Grid, Chip, Box, LinearProgress, useTheme, Avatar, Stack,
  Stepper, Step, StepLabel, IconButton, Tooltip
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import PersonIcon from "@mui/icons-material/PersonRounded";
import MedicalServicesIcon from "@mui/icons-material/MedicalServicesRounded";
import CoronavirusIcon from "@mui/icons-material/CoronavirusRounded";
import TrendingUpIcon from "@mui/icons-material/TrendingUpRounded";
import AssessmentIcon from "@mui/icons-material/AssessmentRounded";
import HistoryIcon from "@mui/icons-material/HistoryRounded";

export default function PatientDashboard() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.displayName || user?.email?.split('@')[0] || "");
  const [phone, setPhone] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [myHistory, setMyHistory] = useState([]);
  const theme = useTheme();

  const steps = ['Personal Info', 'Select Symptoms', 'AI Diagnosis'];

  useEffect(() => {
  }, []);

  useEffect(() => {
    if (user && !name) {
      setName(user.displayName || user.email?.split('@')[0] || "");
    }
  }, [user]);

  const submit = async () => {
    if (symptoms.length === 0) return;

    setLoading(true);
    try {
      const res = await api.post("/cases/submit", {
        patient: name || "Anonymous",
        phone: phone || "N/A",
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
        style={{ position: 'relative', zIndex: 1 }}
      >
        <Box sx={{ mb: 5, mt: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700 }}>
              Personal Health Record
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.text.primary, mt: 0.5 }}>
              Patient Health Portal
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
                sx={{ minHeight: 140, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
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

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={result ? 5 : 7}>
          <AnimatedCard delay={0.2}>
            <CardContent sx={{ p: 4 }}>
              <Stack spacing={3}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main, color: "white", mr: 2 }}>
                    <PersonIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight={700}>New Diagnosis</Typography>
                </Box>

                <TextField
                  label="Display Name"
                  fullWidth
                  value={name}
                  onChange={e => setName(e.target.value)}
                />

                <TextField
                  label="Contact Number"
                  fullWidth
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. +1 234 567 890"
                />

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Select Symptoms</Typography>
                  <SymptomSelect value={symptoms} setValue={setSymptoms} />
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={submit}
                  disabled={loading}
                  sx={{ py: 2, fontWeight: 800, borderRadius: 3 }}
                >
                  {loading ? "Analyzing..." : "Run AI Diagnosis"}
                </Button>
              </Stack>
            </CardContent>
          </AnimatedCard>

        </Grid>

        <Grid item xs={12} md={7}>
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 4, border: '1px dashed grey' }}>
                <Typography color="text.secondary">Run a diagnosis to see results</Typography>
              </Box>
            )}

            {loading && (
              <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
                <Typography mb={2}>Analyzing data with MedHive AI...</Typography>
                <LinearProgress />
              </Card>
            )}

            {result && !loading && (
              <AnimatedCard>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" fontWeight={800} mb={3}>AI Diagnostic Result</Typography>
                  <Stack spacing={2}>
                    {result.predictions.map((p, i) => (
                      <Box key={i} sx={{ p: 3, borderRadius: 4, bgcolor: i === 0 ? 'primary.main' : 'rgba(0,0,0,0.02)', color: i === 0 ? 'white' : 'text.primary', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="h6" fontWeight={800}>{p.disease || p.label}</Typography>
                          <Typography variant="caption" sx={{ opacity: 0.8 }}>Condition Detected</Typography>
                        </Box>
                        <Typography variant="h4" fontWeight={900}>{p.probability}%</Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </AnimatedCard>
            )}
          </AnimatePresence>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
