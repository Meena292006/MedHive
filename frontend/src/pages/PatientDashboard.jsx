import { useState, useEffect } from "react";
import { api } from "../api/api";
import { mlApi } from "../api/mlApi";
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
import FavoriteIcon from "@mui/icons-material/Favorite";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import ThermometerIcon from "@mui/icons-material/LocalHospital";
import HealingIcon from "@mui/icons-material/Healing";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import HomeIcon from "@mui/icons-material/Home";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

export default function PatientDashboard() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.displayName || user?.email?.split('@')[0] || "");
  const [phone, setPhone] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
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
      // First, get predictions from ML service
      const mlResponse = await mlApi.post("/predict", {
        symptoms: symptoms
      });

      // Transform ML response to expected format
      const predictions = mlResponse.data.top_predictions.map(p => ({
        disease: p.disease,
        probability: p.probability
      }));

      // Determine priority based on top prediction
      const topProbability = predictions[0]?.probability || 0;
      const priority = topProbability > 70 ? "HIGH" : "LOW";

      const resultData = {
        predictions: predictions,
        matched: mlResponse.data.matched,
        priority: priority
      };

      // Save to backend
      await api.post("/cases/submit", {
        patient: name || "Anonymous",
        phone: phone || "N/A",
        symptoms,
        predictions: predictions,
        risk_score: topProbability,
        priority: priority
      });

      setResult(resultData);
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
          <FavoriteIcon sx={{ fontSize: 120, color: theme.palette.error.main }} />
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
          <MonitorHeartIcon sx={{ fontSize: 100, color: theme.palette.primary.main }} />
        </motion.div>

        {/* Breathing Thermometer */}
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
          <ThermometerIcon sx={{ fontSize: 80, color: theme.palette.primary.main }} />
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
          <HealingIcon sx={{ fontSize: 90, color: theme.palette.secondary.main }} />
        </motion.div>
      </Box>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <Box sx={{ mb: 5, mt: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="caption" sx={{
              color: theme.palette.primary.main,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              fontWeight: 700,
              background: theme.gradients.linear,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Personal Health Assistant
            </Typography>
            <Typography variant="h4" sx={{
              fontWeight: 800,
              color: '#FFFFFF',
              mt: 0.5
            }}>
              MedHive Health Assistant
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label="AI-Powered"
              size="small"
              sx={{
                bgcolor: theme.palette.primary.light,
                color: theme.palette.primary.main,
                border: `1px solid ${theme.palette.divider}`,
                fontWeight: 600
              }}
            />
            <Chip
              label="HIPAA Compliant"
              size="small"
              sx={{
                bgcolor: `rgba(59, 130, 246, 0.1)`,
                color: theme.palette.primary.main,
                border: `1px solid rgba(59, 130, 246, 0.2)`,
                fontWeight: 600
              }}
            />
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(42, 144, 184, 0.05)',
                      '& fieldset': {
                        borderColor: 'rgba(42, 144, 184, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                      '& input': {
                        color: theme.palette.text.primary,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: theme.palette.text.secondary,
                      '&.Mui-focused': {
                        color: theme.palette.primary.main,
                      },
                    },
                  }}
                />

                <TextField
                  label="Contact Number"
                  fullWidth
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. +1 234 567 890"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(42, 144, 184, 0.05)',
                      '& fieldset': {
                        borderColor: 'rgba(42, 144, 184, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                      '& input': {
                        color: theme.palette.text.primary,
                      },
                      '& input::placeholder': {
                        color: '#4A5568',
                        opacity: 0.7,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: theme.palette.text.secondary,
                      '&.Mui-focused': {
                        color: theme.palette.primary.main,
                      },
                    },
                  }}
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
                  sx={{
                    py: 2,
                    fontWeight: 800,
                    borderRadius: 3,
                    background: theme.gradients.linear,
                    '&:hover': {
                      background: theme.gradients.linear,
                      boxShadow: `0 8px 32px ${theme.palette.primary.light}`,
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {loading ? "Analyzing..." : "Run AI Diagnosis"}
                </Button>
              </Stack>
            </CardContent>
          </AnimatedCard>

        </Grid>

        <Grid item xs={12} md={7}>
          <AnimatePresence mode="wait">
            {!result && !loading && activeStep < 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <AnimatedCard>
                  <CardContent sx={{ p: 6, textAlign: 'center' }}>
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <HomeIcon sx={{ fontSize: 80, color: '#2A90B8', mb: 3, opacity: 0.7 }} />
                    </motion.div>
                    <Typography variant="h5" sx={{
                      color: '#FFFFFF',
                      fontWeight: 800,
                      mb: 2
                    }}>
                      Welcome to MedHive AI
                    </Typography>
                    <Typography variant="body1" sx={{
                      color: '#FFFFFF',
                      opacity: 0.9,
                      mb: 4,
                      maxWidth: 400,
                      mx: 'auto'
                    }}>
                      Follow the guided steps to get AI-powered health insights. Your privacy and data security are our top priorities.
                    </Typography>
                    <Stack direction="row" spacing={2} justifyContent="center">
                      <Chip
                        label="🔒 HIPAA Compliant"
                        sx={{
                          bgcolor: `rgba(59, 130, 246, 0.1)`,
                          color: theme.palette.primary.main,
                          fontWeight: 600
                        }}
                      />
                      <Chip
                        label="🤖 AI-Powered"
                        sx={{
                          bgcolor: 'rgba(42, 144, 184, 0.1)',
                          color: '#2A90B8',
                          fontWeight: 600
                        }}
                      />
                    </Stack>
                  </CardContent>
                </AnimatedCard>
              </motion.div>
            )}

            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AnimatedCard>
                  <CardContent sx={{ p: 6, textAlign: 'center' }}>
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <LocalHospitalIcon sx={{ fontSize: 80, color: '#2A90B8', mb: 3 }} />
                    </motion.div>
                    <Typography variant="h5" sx={{
                      color: '#FFFFFF',
                      fontWeight: 800,
                      mb: 2
                    }}>
                      Analyzing Your Symptoms
                    </Typography>
                    <Typography variant="body1" sx={{
                      color: '#FFFFFF',
                      opacity: 0.9,
                      mb: 4
                    }}>
                      MedHive AI is processing your information with advanced machine learning algorithms...
                    </Typography>
                    <Box sx={{ width: '100%', mb: 3 }}>
                      <LinearProgress
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: theme.palette.primary.main,
                          '& .MuiLinearProgress-bar': {
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>
                    <Stack spacing={1}>
                      <Typography variant="body2" sx={{ color: theme.palette.primary.main, opacity: 0.7 }}>
                        ✓ Validating symptoms
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.palette.primary.main, opacity: 0.7 }}>
                        ⏳ Analyzing patterns
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.palette.primary.main, opacity: 0.5 }}>
                        ○ Generating insights
                      </Typography>
                    </Stack>
                  </CardContent>
                </AnimatedCard>
              </motion.div>
            )}

            {result && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <AnimatedCard>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <CheckCircleIcon sx={{ color: '#2A90B8', mr: 2, fontSize: 32 }} />
                      <Typography variant="h5" sx={{
                        color: '#FFFFFF',
                        fontWeight: 800
                      }}>
                        AI Diagnostic Results
                      </Typography>
                    </Box>

                    <Typography variant="body1" sx={{
                      color: theme.palette.primary.main,
                      opacity: 0.8,
                      mb: 4
                    }}>
                      Based on your symptoms, here are the most likely conditions. Please consult a healthcare professional for proper diagnosis.
                    </Typography>

                    <Stack spacing={3}>
                      {result.predictions?.map((p, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                        >
                          <Box sx={{
                            p: 3,
                            borderRadius: 4,
                            background: i === 0
                              ? theme.gradients.linear
                              : 'rgba(255, 255, 255, 0.05)',
                            border: `1px solid ${theme.palette.primary.main}40`,
                            color: '#FFFFFF',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            boxShadow: i === 0 ? `0 8px 32px ${theme.palette.primary.light}` : 'none',
                            position: 'relative',
                            overflow: 'hidden'
                          }}>
                            {i === 0 && (
                              <Box sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: 100,
                                height: 100,
                                background: `radial-gradient(circle, ${theme.palette.secondary.main}20 0%, transparent 70%)`,
                                borderRadius: '50%',
                                transform: 'translate(30px, -30px)'
                              }} />
                            )}

                            <Box sx={{ flex: 1, zIndex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="h6" sx={{
                                  fontWeight: 800,
                                  mr: 2
                                }}>
                                  {p.disease || p.label}
                                </Typography>
                                {i === 0 && (
                                  <Chip
                                    label="Most Likely"
                                    size="small"
                                    sx={{
                                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                                      color: 'white',
                                      fontWeight: 600,
                                      fontSize: '0.7rem'
                                    }}
                                  />
                                )}
                              </Box>
                              <Typography variant="caption" sx={{
                                opacity: 0.9,
                                fontSize: '0.8rem',
                                color: '#FFFFFF'
                              }}>
                                AI Confidence Score
                              </Typography>
                            </Box>

                            <Box sx={{ textAlign: 'right', zIndex: 1 }}>
                              <Typography variant="h3" sx={{
                                fontWeight: 900,
                                fontSize: '2.5rem',
                                lineHeight: 1,
                                color: i === 0 ? 'white' : theme.palette.primary.main
                              }}>
                                {p.probability}%
                              </Typography>
                              <Typography variant="caption" sx={{
                                opacity: 0.9,
                                fontSize: '0.7rem',
                                color: '#FFFFFF'
                              }}>
                                Probability
                              </Typography>
                            </Box>
                          </Box>
                        </motion.div>
                      ))}
                    </Stack>

                    <Box sx={{ mt: 4, p: 3, borderRadius: 3, bgcolor: `rgba(59, 130, 246, 0.05)`, border: `1px solid rgba(59, 130, 246, 0.2)` }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <WarningIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: 20 }} />
                        <Typography variant="subtitle2" sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                          Important Medical Disclaimer
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', opacity: 0.9, fontSize: '0.8rem' }}>
                        This AI analysis is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.
                      </Typography>
                    </Box>

                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setActiveStep(0);
                          setResult(null);
                        }}
                        sx={{
                          flex: 1,
                          borderColor: theme.palette.primary.main,
                          color: theme.palette.primary.main,
                          '&:hover': {
                            borderColor: theme.palette.primary.dark,
                            color: theme.palette.primary.dark,
                          },
                        }}
                      >
                        New Diagnosis
                      </Button>
                      <Button
                        variant="contained"
                        sx={{
                          flex: 1,
                          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                          '&:hover': {
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                            transform: 'translateY(-1px)',
                          },
                        }}
                      >
                        Share Results
                      </Button>
                    </Box>
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
