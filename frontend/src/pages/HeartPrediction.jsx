import { useState } from "react";
import { mlApi } from "../api/mlApi";
import DashboardLayout from "../components/DashboardLayout";
import AnimatedCard from "../components/AnimatedCard";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  Avatar,
  LinearProgress
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import FavoriteIcon from "@mui/icons-material/FavoriteRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircleRounded";
import WarningIcon from "@mui/icons-material/WarningRounded";

export default function HeartPrediction() {
  const [formData, setFormData] = useState({
    age: "57",
    sex: "1",
    cp: "0",
    trestbps: "140",
    chol: "241",
    fbs: "0",
    restecg: "1",
    thalach: "123",
    exang: "1",
    oldpeak: "0.2",
    slope: "1",
    ca: "0",
    thal: "2"
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    setLoading(true);
    setResult(null);

    try {
      const payload = {
        age: Number(formData.age),
        sex: Number(formData.sex),
        cp: Number(formData.cp),
        trestbps: Number(formData.trestbps),
        chol: Number(formData.chol),
        fbs: Number(formData.fbs),
        restecg: Number(formData.restecg),
        thalach: Number(formData.thalach),
        exang: Number(formData.exang),
        oldpeak: Number(formData.oldpeak),
        slope: Number(formData.slope),
        ca: Number(formData.ca),
        thal: Number(formData.thal)
      };

      const res = await mlApi.post("/predict/heart", payload);

      const backendDanger = res.data.is_danger;
      const rawLabel = res.data.raw_model_label;
      const labelText = res.data.prediction;

      const isDanger = typeof backendDanger === "boolean"
        ? backendDanger
        : rawLabel === 1 ||
          (labelText && labelText.toLowerCase().includes("disease")) ||
          res.data.probability >= 40;

      setResult({
        isDanger,
        probability: res.data.probability ?? 0,
        riskLevel: res.data.risk_level,
        label: labelText || (isDanger ? "High Risk of Heart Disease" : "Low Risk / Normal")
      });
    } catch (err) {
      alert(
        "Prediction failed\n" +
          (err.response?.data?.detail || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Avatar sx={{ bgcolor: theme.palette.error.main, width: 56, height: 56, boxShadow: `0 10px 30px ${theme.palette.error.main}40` }}>
              <FavoriteIcon />
            </Avatar>
          </motion.div>
          <Box>
            <Typography variant="h4" fontWeight={800}>
              Heart Disease Analysis
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Comprehensive cardiovascular risk assessment
            </Typography>
          </Box>
        </Box>
      </motion.div>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <AnimatedCard delay={0.2}>
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={3}>
                {[
                  { label: "Age", name: "age", type: "number" },
                  { label: "Sex", name: "sex", type: "select", options: [{ value: 1, label: "Male" }, { value: 0, label: "Female" }] },
                  { label: "Chest Pain Type", name: "cp", type: "select", options: [
                    { value: 0, label: "Typical Angina" },
                    { value: 1, label: "Atypical Angina" },
                    { value: 2, label: "Non-anginal Pain" },
                    { value: 3, label: "Asymptomatic" }
                  ]},
                  { label: "Resting BP (mm Hg)", name: "trestbps", type: "number" },
                  { label: "Cholesterol (mg/dl)", name: "chol", type: "number" },
                  { label: "Fasting Blood Sugar", name: "fbs", type: "select", options: [
                    { value: 1, label: "High (>120)" },
                    { value: 0, label: "Normal" }
                  ]},
                  { label: "Resting ECG", name: "restecg", type: "select", options: [
                    { value: 0, label: "Normal" },
                    { value: 1, label: "ST-T Abnormality" },
                    { value: 2, label: "LV Hypertrophy" }
                  ]},
                  { label: "Max Heart Rate (thalach)", name: "thalach", type: "number" },
                  { label: "Exercise Angina", name: "exang", type: "select", options: [
                    { value: 1, label: "Yes" },
                    { value: 0, label: "No" }
                  ]},
                  { label: "ST Depression (oldpeak)", name: "oldpeak", type: "number" },
                  { label: "Slope", name: "slope", type: "select", options: [
                    { value: 0, label: "Upsloping" },
                    { value: 1, label: "Flat" },
                    { value: 2, label: "Downsloping" }
                  ]},
                  { label: "Major Vessels (ca)", name: "ca", type: "select", options: [
                    { value: 0, label: "0" },
                    { value: 1, label: "1" },
                    { value: 2, label: "2" },
                    { value: 3, label: "3" }
                  ]},
                  { label: "Thalassemia", name: "thal", type: "select", options: [
                    { value: 0, label: "Normal" },
                    { value: 1, label: "Fixed Defect" },
                    { value: 2, label: "Reversible Defect" }
                  ]},
                ].map((field, idx) => (
                  <Grid item xs={6} key={field.name}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                    >
                      {field.type === "select" ? (
                        <FormControl fullWidth>
                          <InputLabel>{field.label}</InputLabel>
                          <Select name={field.name} value={formData[field.name]} onChange={handleChange}>
                            {field.options.map(opt => (
                              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <TextField
                          fullWidth
                          label={field.label}
                          name={field.name}
                          type={field.type}
                          value={formData[field.name]}
                          onChange={handleChange}
                        />
                      )}
                    </motion.div>
                  </Grid>
                ))}

                <Grid item xs={12}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      fullWidth
                      size="large"
                      variant="contained"
                      onClick={submit}
                      disabled={loading}
                      sx={{
                        py: 1.8,
                        background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        boxShadow: `0 10px 30px ${theme.palette.error.main}40`,
                        "&:hover": {
                          boxShadow: `0 15px 40px ${theme.palette.error.main}60`,
                        },
                      }}
                    >
                      {loading ? "Analyzing..." : "Predict Heart Risk"}
                    </Button>
                  </motion.div>
                </Grid>
              </Grid>
            </CardContent>
          </AnimatedCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card sx={{ borderRadius: 4, overflow: "hidden" }}>
                  <CardContent sx={{ p: 4, textAlign: "center" }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <FavoriteIcon sx={{ fontSize: 60, color: theme.palette.error.main, mb: 2 }} />
                    </motion.div>
                    <LinearProgress sx={{ borderRadius: 2, height: 8, mt: 2 }} />
                    <Typography sx={{ mt: 2, color: "text.secondary" }}>Analyzing...</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {result && !loading && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <AnimatedCard
                  sx={{
                    border: 2,
                    borderColor: result.isDanger ? "error.main" : "success.main",
                    background: result.isDanger
                      ? `linear-gradient(135deg, ${theme.palette.error.light}10, ${theme.palette.error.light}05)`
                      : `linear-gradient(135deg, ${theme.palette.success.light}10, ${theme.palette.success.light}05)`,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <CardContent sx={{ textAlign: "center", p: 4 }}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    >
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          mx: "auto",
                          mb: 2,
                          bgcolor: result.isDanger ? "error.main" : "success.main",
                          boxShadow: `0 10px 30px ${result.isDanger ? theme.palette.error.main : theme.palette.success.main}40`,
                        }}
                      >
                        {result.isDanger ? <WarningIcon sx={{ fontSize: 40 }} /> : <CheckCircleIcon sx={{ fontSize: 40 }} />}
                      </Avatar>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Typography variant="h6" fontWeight={700} color={result.isDanger ? "error" : "success.main"} sx={{ mb: 2 }}>
                        {result.label}
                      </Typography>
                    </motion.div>

                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      <Typography variant="h2" fontWeight={900} sx={{ my: 2, color: result.isDanger ? "error.main" : "success.main" }}>
                        {result.probability}%
                      </Typography>
                    </motion.div>

                    <Typography color="text.secondary" fontWeight={600}>
                      Prediction Confidence
                    </Typography>
                  </CardContent>
                </AnimatedCard>
              </motion.div>
            )}
          </AnimatePresence>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
