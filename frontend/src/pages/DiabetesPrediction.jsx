import { useState } from "react";
import { mlApi } from "../api/mlApi";
import { api } from "../api/api";
import DashboardLayout from "../components/DashboardLayout";
import AnimatedCard from "../components/AnimatedCard";
import {
    Button, TextField, Card, CardContent, Typography,
    Grid, Box, useTheme, Avatar, LinearProgress
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import WaterDropIcon from "@mui/icons-material/WaterDropRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircleRounded";
import WarningIcon from "@mui/icons-material/WarningRounded";
import RestaurantIcon from "@mui/icons-material/RestaurantRounded";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenterRounded";
import LocalHospitalIcon from "@mui/icons-material/LocalHospitalRounded";
import InfoIcon from "@mui/icons-material/InfoRounded";
import ScienceIcon from "@mui/icons-material/ScienceRounded";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafetyRounded";

export default function DiabetesPrediction() {
    const [formData, setFormData] = useState({
        Pregnancies: "6", Glucose: "148", BloodPressure: "72", SkinThickness: "35",
        Insulin: "0", BMI: "33.6", DiabetesPedigreeFunction: "0.627", Age: "50"
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
            const safeParseInt = (val) => isNaN(parseInt(val)) ? 0 : parseInt(val);
            const safeParseFloat = (val) => isNaN(parseFloat(val)) ? 0.0 : parseFloat(val);

            const payload = {
                Pregnancies: safeParseInt(formData.Pregnancies),
                Glucose: safeParseInt(formData.Glucose),
                BloodPressure: safeParseInt(formData.BloodPressure),
                SkinThickness: safeParseInt(formData.SkinThickness),
                Insulin: safeParseInt(formData.Insulin),
                BMI: safeParseFloat(formData.BMI),
                DiabetesPedigreeFunction: safeParseFloat(formData.DiabetesPedigreeFunction),
                Age: safeParseInt(formData.Age)
            };

            const res = await mlApi.post("/predict/diabetes", payload);
            setResult(res.data);

            // Save to Reports
            try {
                await api.post("/cases/save", {
                    patient: "Patient",
                    type: "DIABETES",
                    result: res.data.prediction,
                    probability: res.data.probability,
                    is_danger: res.data.is_danger
                });
            } catch (saveErr) {
                console.error("Failed to save report:", saveErr);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to get prediction. Please check your inputs and try again.\nError: " + (err.response?.data?.detail || err.message));
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { label: "Pregnancies", name: "Pregnancies", type: "number" },
        { label: "Glucose", name: "Glucose", type: "number" },
        { label: "Blood Pressure", name: "BloodPressure", type: "number" },
        { label: "Skin Thickness", name: "SkinThickness", type: "number" },
        { label: "Insulin", name: "Insulin", type: "number" },
        { label: "BMI", name: "BMI", type: "number" },
        { label: "Diabetes Pedigree Function", name: "DiabetesPedigreeFunction", type: "number" },
        { label: "Age", name: "Age", type: "number" },
    ];

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
        background: 'linear-gradient(135deg, #7F1D1D 0%, #B91C1C 100%)', // Deep wine red gradient
      }}>
        {/* Floating Glucose Molecule */}
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
            opacity: 0.1
          }}
        >
          <WaterDropIcon sx={{ fontSize: 120, color: '#EF4444' }} />
        </motion.div>

        {/* Pulsing Pancreas */}
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
          <ScienceIcon sx={{ fontSize: 100, color: '#F87171' }} />
        </motion.div>

        {/* Breathing Insulin */}
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
            opacity: 0.08
          }}
        >
          <HealthAndSafetyIcon sx={{ fontSize: 80, color: '#DC2626' }} />
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
            opacity: 0.06
          }}
        >
          <LocalHospitalIcon sx={{ fontSize: 90, color: '#B91C1C' }} />
        </motion.div>
      </Box>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Avatar sx={{ bgcolor: '#B91C1C', width: 56, height: 56, boxShadow: '0 10px 30px rgba(185, 28, 28, 0.4)' }}>
              <WaterDropIcon />
            </Avatar>
          </motion.div>
          <Box>
            <Typography variant="h4" fontWeight={800} sx={{ color: '#FECACA' }}>
              Diabetes Analysis
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, color: '#FCA5A5' }}>
              Advanced diabetes risk assessment with AI-powered insights
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
                                    borderColor: "rgba(239, 68, 68, 0.4)",
                                  },

                                  /* HOVER */
                                  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#F87171",
                                  },

                                  /* FOCUS */
                                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#EF4444",
                                    borderWidth: 2,
                                  },

                                  /* FOCUS GLOW */
                                  "& .MuiOutlinedInput-root.Mui-focused": {
                                    boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.25)",
                                  },

                                  /* LABEL */
                                  "& .MuiInputLabel-root.Mui-focused": {
                                    color: "#EF4444",
                                  },
                                }}
                            >
                                <Grid container spacing={3}>
                                    {fields.map((field, idx) => (
                                        <Grid item xs={6} key={field.name}>
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 + idx * 0.05 }}
                                            >
                                                <TextField
                                                    fullWidth
                                                    color="error"
                                                    label={field.label}
                                                    name={field.name}
                                                    type={field.type}
                                                    value={formData[field.name]}
                                                    onChange={handleChange}
                                                />
                                            </motion.div>
                                        </Grid>
                                    ))}

                                <Grid item xs={12}>
                                    <motion.div
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
                                                py: 1.8,
                                                background: 'linear-gradient(135deg, #B91C1C 0%, #EF4444 100%)',
                                                fontWeight: 700,
                                                fontSize: "1.1rem",
                                                boxShadow: '0 10px 30px rgba(185, 28, 28, 0.4)',
                                                "&:hover": {
                                                    boxShadow: '0 15px 40px rgba(185, 28, 28, 0.6)',
                                                },
                                            }}
                                        >
                                            {loading ? "Analyzing..." : "Predict Diabetes Risk"}
                                        </Button>
                                    </motion.div>
                                </Grid>
                            </Grid>
                            </Box>
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
                                            <WaterDropIcon sx={{ fontSize: 60, color: theme.palette.secondary.main, mb: 2 }} />
                                        </motion.div>
                                        <LinearProgress sx={{ borderRadius: 2, height: 8, mt: 2 }} />
                                        <Typography sx={{ mt: 2, color: "text.secondary" }}>Analyzing...</Typography>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {result && !loading && (
                            <Box>
                                {/* Prediction Cards */}
                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                  {/* Possible Conditions */}
                                  <Grid item xs={12} sm={6}>
                                    <motion.div
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: 0.1 }}
                                    >
                                      <Card sx={{
                                        borderRadius: 3,
                                        background: 'rgba(185, 28, 28, 0.9)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                        boxShadow: '0 8px 32px rgba(185, 28, 28, 0.3)',
                                        color: '#FECACA'
                                      }}>
                                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                          <Typography variant="h6" fontWeight={700} sx={{ mb: 1, color: '#FECACA' }}>
                                            Possible Conditions
                                          </Typography>
                                          <Typography variant="body2" sx={{ color: '#FCA5A5' }}>
                                            {result.prediction}
                                          </Typography>
                                        </CardContent>
                                      </Card>
                                    </motion.div>
                                  </Grid>

                                  {/* Severity Level */}
                                  <Grid item xs={12} sm={6}>
                                    <motion.div
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: 0.2 }}
                                    >
                                      <Card sx={{
                                        borderRadius: 3,
                                        background: result.is_danger ? 'rgba(127, 29, 29, 0.9)' : 'rgba(220, 38, 38, 0.9)',
                                        backdropFilter: 'blur(20px)',
                                        border: result.is_danger ? '1px solid rgba(127, 29, 29, 0.3)' : '1px solid rgba(220, 38, 38, 0.3)',
                                        boxShadow: result.is_danger ? '0 8px 32px rgba(127, 29, 29, 0.3)' : '0 8px 32px rgba(220, 38, 38, 0.3)',
                                        color: '#FECACA'
                                      }}>
                                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                          <Typography variant="h6" fontWeight={700} sx={{ mb: 1, color: '#FECACA' }}>
                                            Severity Level
                                          </Typography>
                                          <Typography variant="body2" sx={{ color: '#FCA5A5' }}>
                                            {result.is_danger ? 'High' : 'Low'}
                                          </Typography>
                                        </CardContent>
                                      </Card>
                                    </motion.div>
                                  </Grid>

                                  {/* Risk Score */}
                                  <Grid item xs={12} sm={6}>
                                    <motion.div
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: 0.3 }}
                                    >
                                      <Card sx={{
                                        borderRadius: 3,
                                        background: 'rgba(185, 28, 28, 0.9)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                        boxShadow: '0 8px 32px rgba(185, 28, 28, 0.3)',
                                        color: '#FECACA'
                                      }}>
                                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                          <Typography variant="h6" fontWeight={700} sx={{ mb: 1, color: '#FECACA' }}>
                                            Risk Score
                                          </Typography>
                                          <Typography variant="h4" fontWeight={900} sx={{ color: '#FECACA' }}>
                                            {result.probability}%
                                          </Typography>
                                        </CardContent>
                                      </Card>
                                    </motion.div>
                                  </Grid>

                                  {/* AI Confidence */}
                                  <Grid item xs={12} sm={6}>
                                    <motion.div
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: 0.4 }}
                                    >
                                      <Card sx={{
                                        borderRadius: 3,
                                        background: 'rgba(185, 28, 28, 0.9)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                        boxShadow: '0 8px 32px rgba(185, 28, 28, 0.3)',
                                        color: '#FECACA'
                                      }}>
                                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                          <Typography variant="h6" fontWeight={700} sx={{ mb: 1, color: '#FECACA' }}>
                                            AI Confidence
                                          </Typography>
                                          <Typography variant="body2" sx={{ color: '#FCA5A5' }}>
                                            High
                                          </Typography>
                                        </CardContent>
                                      </Card>
                                    </motion.div>
                                  </Grid>

                                  {/* Recommended Action */}
                                  <Grid item xs={12} sm={6}>
                                    <motion.div
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: 0.5 }}
                                    >
                                      <Card sx={{
                                        borderRadius: 3,
                                        background: 'rgba(185, 28, 28, 0.9)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                        boxShadow: '0 8px 32px rgba(185, 28, 28, 0.3)',
                                        color: '#FECACA'
                                      }}>
                                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                          <Typography variant="h6" fontWeight={700} sx={{ mb: 1, color: '#FECACA' }}>
                                            Recommended Action
                                          </Typography>
                                          <Typography variant="body2" sx={{ color: '#FCA5A5' }}>
                                            {result.is_danger ? 'Consult Doctor' : 'Monitor Health'}
                                          </Typography>
                                        </CardContent>
                                      </Card>
                                    </motion.div>
                                  </Grid>

                                  {/* Next Steps */}
                                  <Grid item xs={12} sm={6}>
                                    <motion.div
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: 0.6 }}
                                    >
                                      <Card sx={{
                                        borderRadius: 3,
                                        background: 'rgba(185, 28, 28, 0.9)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                        boxShadow: '0 8px 32px rgba(185, 28, 28, 0.3)',
                                        color: '#FECACA'
                                      }}>
                                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                          <Typography variant="h6" fontWeight={700} sx={{ mb: 1, color: '#FECACA' }}>
                                            Next Steps
                                          </Typography>
                                          <Typography variant="body2" sx={{ color: '#FCA5A5' }}>
                                            {result.is_danger ? 'Schedule Checkup' : 'Continue Monitoring'}
                                          </Typography>
                                        </CardContent>
                                      </Card>
                                    </motion.div>
                                  </Grid>
                                </Grid>

                                {/* Main Result Card */}
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.5, type: "spring", delay: 0.7 }}
                                >
                                    <AnimatedCard
                                        sx={{
                                            border: 2,
                                            borderColor: result.is_danger ? "#7F1D1D" : "#DC2626",
                                            background: 'rgba(185, 28, 28, 0.9)',
                                            backdropFilter: 'blur(20px)',
                                            position: "relative",
                                            overflow: "hidden",
                                            color: '#FECACA'
                                        }}
                                    >
                                        <CardContent sx={{ textAlign: 'center', p: 4 }}>
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                                            >
                                                <Avatar
                                                    sx={{
                                                        width: 80,
                                                        height: 80,
                                                        mx: "auto",
                                                        mb: 2,
                                                        bgcolor: result.is_danger ? "#7F1D1D" : "#DC2626",
                                                        boxShadow: `0 10px 30px ${result.is_danger ? 'rgba(127, 29, 29, 0.4)' : 'rgba(220, 38, 38, 0.4)'}`,
                                                    }}
                                                >
                                                    {result.is_danger ? <WarningIcon sx={{ fontSize: 40 }} /> : <CheckCircleIcon sx={{ fontSize: 40 }} />}
                                                </Avatar>
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.9 }}
                                            >
                                                <Typography variant="h5" fontWeight={700} sx={{ mb: 2, color: '#FECACA' }}>
                                                    {result.prediction}
                                                </Typography>
                                            </motion.div>

                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 1.0, type: "spring" }}
                                            >
                                                <Typography variant="h2" fontWeight={800} sx={{ my: 2, color: '#FECACA' }}>
                                                    {result.probability}%
                                                </Typography>
                                            </motion.div>

                                            <Typography sx={{ color: '#FCA5A5', fontWeight: 600 }}>
                                                Confidence Score
                                            </Typography>
                                        </CardContent>
                                    </AnimatedCard>
                                </motion.div>

                                {/* Recommendations Section */}
                                {result.recommendations && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        style={{ marginTop: '24px' }}
                                    >
                                        <Card sx={{ borderRadius: 4, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                            <CardContent sx={{ p: 4 }}>
                                                <Typography variant="h6" fontWeight={800} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                                    <HealthAndSafetyIcon color="primary" /> Suggested Action Plan
                                                </Typography>

                                                {/* Medical Advice Box */}
                                                <Box sx={{
                                                    p: 2.5, mb: 3, borderRadius: 2,
                                                    bgcolor: result.is_danger ? 'rgba(211, 47, 47, 0.05)' : 'rgba(46, 125, 50, 0.05)',
                                                    borderLeft: `5px solid ${result.is_danger ? theme.palette.error.main : theme.palette.success.main}`,
                                                    color: result.is_danger ? 'error.main' : 'success.main',
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
                                                            {result.recommendations.diet_plan && (
                                                                <Typography variant="body2" fontWeight={700} color="error.main" sx={{ mt: 1, p: 1.5, bgcolor: 'rgba(211, 47, 47, 0.08)', borderRadius: 1.5, border: '1px solid rgba(211, 47, 47, 0.2)' }}>
                                                                    {result.recommendations.diet_plan}
                                                                </Typography>
                                                            )}
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

                                                    {(result.recommendations.sample_medicines || result.recommendations.tests) && (
                                                        <Grid item xs={12}>
                                                            <Box sx={{ mt: 1, p: 2.5, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: 2, border: '1px dashed', borderColor: 'divider' }}>
                                                                <Grid container spacing={3}>
                                                                    {result.recommendations.sample_medicines && (
                                                                        <Grid item xs={12} sm={6}>
                                                                            <Typography variant="subtitle2" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, color: 'error.main' }}>
                                                                                <LocalHospitalIcon fontSize="small" /> Sample Medicines (Demo)
                                                                            </Typography>
                                                                            {result.recommendations.sample_medicines?.map((item, i) => (
                                                                                <Typography key={i} variant="caption" sx={{ display: 'block', mb: 0.5, opacity: 0.8 }}>• {item}</Typography>
                                                                            ))}
                                                                        </Grid>
                                                                    )}
                                                                    {result.recommendations.tests && (
                                                                        <Grid item xs={12} sm={6}>
                                                                            <Typography variant="subtitle2" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, color: 'secondary.main' }}>
                                                                                <ScienceIcon fontSize="small" /> Recommended Tests
                                                                            </Typography>
                                                                            {result.recommendations.tests?.map((item, i) => (
                                                                                <Typography key={i} variant="caption" sx={{ display: 'block', mb: 0.5, opacity: 0.8 }}>• {item}</Typography>
                                                                            ))}
                                                                        </Grid>
                                                                    )}
                                                                </Grid>
                                                            </Box>
                                                        </Grid>
                                                    )}
                                                </Grid>

                                                {/* Disclaimer */}
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
                </Grid>
            </Grid>
        </DashboardLayout>
    );
}
