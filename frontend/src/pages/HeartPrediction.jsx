import { useState, useEffect } from "react";
import { mlApi } from "../api/mlApi";
import { api } from "../api/api";
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
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import FavoriteIcon from "@mui/icons-material/FavoriteRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircleRounded";
import WarningIcon from "@mui/icons-material/WarningRounded";
import RestaurantIcon from "@mui/icons-material/RestaurantRounded";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenterRounded";
import LocalHospitalIcon from "@mui/icons-material/LocalHospitalRounded";
import InfoIcon from "@mui/icons-material/InfoRounded";
import ScienceIcon from "@mui/icons-material/ScienceRounded";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafetyRounded";
import CloseIcon from "@mui/icons-material/Close";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import HealingIcon from "@mui/icons-material/Healing";
import { useAuth } from "../context/AuthContext";

export default function HeartPrediction() {
  const { user } = useAuth();
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

      const finalResult = {
        isDanger,
        probability: res.data.probability ?? 0,
        riskLevel: res.data.risk_level,
        label: labelText || (isDanger ? "High Risk of Heart Disease" : "Low Risk / Normal"),
        recommendations: res.data.recommendations
      };

      setResult(finalResult);

      // Save to Reports
      try {
        await api.post("/cases/save", {
          patient: user?.displayName || user?.email?.split('@')[0] || "Patient", // In a real app, this would be the logged-in user's name
          type: "HEART",
          result: finalResult.label,
          probability: finalResult.probability,
          is_danger: finalResult.isDanger
        });
      } catch (saveErr) {
        console.error("Failed to save report:", saveErr);
      }
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
      {/* Animated Background Illustrations */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        background: theme.gradients.main,
      }}>
        {/* Floating Heart */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            top: '20%',
            right: '10%',
            opacity: 0.15
          }}
        >
          <FavoriteIcon sx={{ fontSize: 120, color: theme.palette.primary.main }} />
        </motion.div>

        {/* Pulsing Lungs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            bottom: '30%',
            left: '15%'
          }}
        >
          <MonitorHeartIcon sx={{ fontSize: 100, color: theme.palette.secondary.main }} />
        </motion.div>

        {/* Breathing ECG Waveform */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [-2, 2, -2]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            top: '40%',
            left: '5%',
            opacity: 0.1
          }}
        >
          <HealingIcon sx={{ fontSize: 80, color: theme.palette.primary.main }} />
        </motion.div>

        {/* Healing Cross */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '20%',
            opacity: 0.12
          }}
        >
          <HealthAndSafetyIcon sx={{ fontSize: 90, color: theme.palette.primary.main }} />
        </motion.div>
      </Box>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <Box sx={{ mb: 4, mt: 4, display: "flex", alignItems: "center", gap: 4 }}>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 56, height: 56, boxShadow: `0 10px 30px ${theme.palette.primary.main}40` }}>
              <FavoriteIcon />
            </Avatar>
          </motion.div>
          <Box>
            <Typography variant="h4" fontWeight={800} sx={{
              background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Heart Disease Analysis
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, color: theme.palette.text.secondary, fontWeight: 600 }}>
              Comprehensive cardiovascular risk assessment
            </Typography>
          </Box>
        </Box>
      </motion.div>


      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <AnimatedCard delay={0.2}>
            <CardContent sx={{ p: 4 }}>
              <Box
                sx={{
                  /* DEFAULT */
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.divider,
                  },

                  /* HOVER */
                  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                  },

                  /* FOCUS */
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                    borderWidth: 2,
                  },

                  /* FOCUS GLOW */
                  "& .MuiOutlinedInput-root.Mui-focused": {
                    boxShadow: `0 0 0 3px ${theme.palette.primary.main}40`,
                  },

                  /* LABEL */
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <Grid container spacing={3}>
                  {[
                    { label: "Age", name: "age", type: "number" },
                    { label: "Sex", name: "sex", type: "select", options: [{ value: 1, label: "Male" }, { value: 0, label: "Female" }] },
                    {
                      label: "Chest Pain Type", name: "cp", type: "select", options: [
                        { value: 0, label: "Typical Angina" },
                        { value: 1, label: "Atypical Angina" },
                        { value: 2, label: "Non-anginal Pain" },
                        { value: 3, label: "Asymptomatic" }
                      ]
                    },
                    { label: "Resting BP (mm Hg)", name: "trestbps", type: "number" },
                    { label: "Cholesterol (mg/dl)", name: "chol", type: "number" },
                    {
                      label: "Fasting Blood Sugar", name: "fbs", type: "select", options: [
                        { value: 1, label: "High (>120)" },
                        { value: 0, label: "Normal" }
                      ]
                    },
                    {
                      label: "Resting ECG", name: "restecg", type: "select", options: [
                        { value: 0, label: "Normal" },
                        { value: 1, label: "ST-T Abnormality" },
                        { value: 2, label: "LV Hypertrophy" }
                      ]
                    },
                    { label: "Max Heart Rate (thalach)", name: "thalach", type: "number" },
                    {
                      label: "Exercise Angina", name: "exang", type: "select", options: [
                        { value: 1, label: "Yes" },
                        { value: 0, label: "No" }
                      ]
                    },
                    { label: "ST Depression (oldpeak)", name: "oldpeak", type: "number" },
                    {
                      label: "Slope", name: "slope", type: "select", options: [
                        { value: 0, label: "Upsloping" },
                        { value: 1, label: "Flat" },
                        { value: 2, label: "Downsloping" }
                      ]
                    },
                    {
                      label: "Major Vessels (ca)", name: "ca", type: "select", options: [
                        { value: 0, label: "0" },
                        { value: 1, label: "1" },
                        { value: 2, label: "2" },
                        { value: 3, label: "3" }
                      ]
                    },
                    {
                      label: "Thalassemia", name: "thal", type: "select", options: [
                        { value: 0, label: "Normal" },
                        { value: 1, label: "Fixed Defect" },
                        { value: 2, label: "Reversible Defect" }
                      ]
                    },
                  ].map((field, idx) => (
                    <Grid item xs={6} key={field.name}>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                      >
                        {field.type === "select" ? (
                          <FormControl fullWidth color="primary">
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
                            color="primary"
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
                          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                          fontWeight: 700,
                          fontSize: "1.1rem",
                          boxShadow: `0 10px 30px ${theme.palette.primary.main}40`,
                          "&:hover": {
                            boxShadow: `0 15px 40px ${theme.palette.primary.main}60`,
                          },
                        }}
                      >
                        {loading ? "Analyzing..." : "Predict Heart Risk"}
                      </Button>
                    </motion.div>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </AnimatedCard>
        </Grid>

      </Grid>

      <AnimatePresence mode="wait">
        {result && !loading && (
          <Box sx={{
            mt: 8,
            mb: 6,
            p: { xs: 4, md: 8 },
            borderRadius: 8,
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            {/* Prediction Cards Grid - Full Width 6 per row on large, 3 on med */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
              {[
                { label: "Possible Conditions", value: result.label, color: theme.palette.primary.main },
                { label: "Severity Level", value: result.isDanger ? 'High' : 'Low', color: result.isDanger ? theme.palette.secondary.main : theme.palette.primary.main },
                { label: "Risk Score", value: `${result.probability}%`, color: theme.palette.secondary.main },
                { label: "AI Confidence", value: "High", color: theme.palette.primary.main },
                { label: "Recommended Action", value: result.isDanger ? 'Consult Doctor' : 'Monitor Health', color: theme.palette.secondary.main },
                { label: "Next Steps", value: result.isDanger ? 'Schedule Checkup' : 'Continue Monitoring', color: theme.palette.primary.main },
              ].map((card, idx) => (
                <Grid item xs={12} sm={4} md={2} key={idx}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card sx={{
                      borderRadius: 0,
                      background: `${card.color}DA`,
                      backdropFilter: 'blur(20px)',
                      border: `1px solid rgba(255,255,255,0.1)`,
                      boxShadow: `0 8px 32px rgba(0,0,0,0.2)`,
                      color: 'white',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      minHeight: 110
                    }}>
                      <CardContent sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1, color: 'white', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                          {card.label}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.9rem' }}>
                          {card.value}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {/* Main Result Card - Full Width */}
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <AnimatedCard
                sx={{
                  borderRadius: 0,
                  border: 2,
                  borderColor: result.isDanger ? theme.palette.primary.main : theme.palette.secondary.main,
                  background: theme.palette.secondary.main,
                  backdropFilter: 'blur(20px)',
                  position: "relative",
                  overflow: "hidden",
                  color: 'white',
                  mb: 4
                }}
              >
                <CardContent sx={{ textAlign: "center", p: 6 }}>
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
                        bgcolor: result.isDanger ? theme.palette.primary.main : theme.palette.secondary.main,
                        boxShadow: `0 10px 30px rgba(0,0,0,0.2)`,
                      }}
                    >
                      {result.isDanger ? <WarningIcon sx={{ fontSize: 40 }} /> : <CheckCircleIcon sx={{ fontSize: 40 }} />}
                    </Avatar>
                  </motion.div>

                  <Typography variant="h4" fontWeight={800} sx={{ mb: 1, color: 'white' }}>
                    {result.label}
                  </Typography>

                  <Typography variant="h2" fontWeight={900} sx={{ my: 2, color: 'white' }}>
                    {result.probability}%
                  </Typography>

                  <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
                    Confidence Score
                  </Typography>
                </CardContent>
              </AnimatedCard>
            </motion.div>

            {result.recommendations && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{ marginTop: '24px' }}
              >
                <Card sx={{ borderRadius: 0, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" fontWeight={800} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                      <HealthAndSafetyIcon color="primary" /> Suggested Action Plan
                    </Typography>

                    <Box sx={{
                      p: 2.5, mb: 3, borderRadius: 0,
                      bgcolor: result.isDanger ? 'rgba(211, 47, 47, 0.05)' : 'rgba(46, 125, 50, 0.05)',
                      borderLeft: `5px solid ${result.isDanger ? theme.palette.error.main : theme.palette.success.main}`,
                      color: result.isDanger ? 'error.main' : 'success.main',
                      display: 'flex', alignItems: 'center', gap: 2,
                      boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                    }}>
                      <LocalHospitalIcon />
                      <Typography fontWeight={800} sx={{ fontSize: '1rem' }}>{result.recommendations.medical_advice}</Typography>
                    </Box>

                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
                          <RestaurantIcon fontSize="small" color="primary" /> Diet
                        </Typography>
                        <Box sx={{ pl: 1 }}>
                          {result.recommendations.diet?.map((item, i) => (
                            <Typography key={i} variant="body2" sx={{ mb: 0.8, display: 'flex', alignItems: 'start', gap: 1 }}>
                              <span style={{ color: theme.palette.primary.main }}>•</span> {item}
                            </Typography>
                          ))}
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
                          <FitnessCenterIcon fontSize="small" color="primary" /> Activity
                        </Typography>
                        <Box sx={{ pl: 1 }}>
                          {result.recommendations.exercise?.map((item, i) => (
                            <Typography key={i} variant="body2" sx={{ mb: 0.8, display: 'flex', alignItems: 'start', gap: 1 }}>
                              <span style={{ color: theme.palette.primary.main }}>•</span> {item}
                            </Typography>
                          ))}
                        </Box>
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'start', gap: 2 }}>
                      <InfoIcon color="warning" sx={{ mt: 0.5 }} />
                      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontStyle: 'italic', lineHeight: 1.5 }}>
                        {result.recommendations.disclaimer}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </Box>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
