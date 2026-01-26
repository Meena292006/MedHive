import { useState, useEffect } from "react";
import { api } from "../api/api";
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
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [myHistory, setMyHistory] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();

  const steps = ['Personal Info', 'Select Symptoms', 'AI Diagnosis'];

  useEffect(() => {
    // Fetch patient's own history
    api.get("/cases").then(res => {
      setMyHistory(res.data);
    });
  }, []);

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
      // Refresh history after submission
      api.get("/cases").then(h => setMyHistory(h.data));
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
        background: 'linear-gradient(135deg, #7F1D1D 0%, #B91C1C 100%)', // Deep wine red gradient
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
            opacity: 0.1
          }}
        >
          <FavoriteIcon sx={{ fontSize: 120, color: '#EF4444' }} />
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
          <MonitorHeartIcon sx={{ fontSize: 100, color: '#F87171' }} />
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
            opacity: 0.08
          }}
        >
          <ThermometerIcon sx={{ fontSize: 80, color: '#DC2626' }} />
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
          <HealingIcon sx={{ fontSize: 90, color: '#B91C1C' }} />
        </motion.div>
      </Box>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <Box sx={{ mb: 5, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="caption" sx={{
              color: '#F87171',
              textTransform: "uppercase",
              letterSpacing: 1.5,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #B91C1C, #F87171)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Personal Health Assistant
            </Typography>
            <Typography variant="h4" sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #B91C1C, #F87171)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mt: 0.5
            }}>
              MedHive Symptom Checker
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label="AI-Powered"
              size="small"
              sx={{
                bgcolor: 'rgba(185, 28, 28, 0.2)',
                color: '#B91C1C',
                border: '1px solid rgba(185, 28, 28, 0.3)',
                fontWeight: 600
              }}
            />
            <Chip
              label="HIPAA Compliant"
              size="small"
              sx={{
                bgcolor: 'rgba(239, 68, 68, 0.2)',
                color: '#EF4444',
                border: '1px solid rgba(239, 68, 68, 0.3)',
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
        <Grid item xs={12} md={5}>
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
                      backgroundColor: 'rgba(185, 28, 28, 0.05)',
                      '& fieldset': {
                        borderColor: 'rgba(185, 28, 28, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#B91C1C',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#B91C1C',
                      },
                      '& input': {
                        color: '#B91C1C',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#EF4444',
                      '&.Mui-focused': {
                        color: '#B91C1C',
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
                      backgroundColor: 'rgba(185, 28, 28, 0.05)',
                      '& fieldset': {
                        borderColor: 'rgba(185, 28, 28, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#B91C1C',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#B91C1C',
                      },
                      '& input': {
                        color: '#B91C1C',
                      },
                      '& input::placeholder': {
                        color: '#F87171',
                        opacity: 0.7,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#EF4444',
                      '&.Mui-focused': {
                        color: '#B91C1C',
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
                    background: 'linear-gradient(135deg, #B91C1C 0%, #EF4444 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #B91C1C 0%, #EF4444 100%)',
                      boxShadow: '0 8px 32px rgba(185, 28, 28, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {loading ? "Analyzing..." : "Run AI Diagnosis"}
                </Button>
              </Stack>
            </CardContent>
          </AnimatedCard>

          <Box sx={{ mt: 4 }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight={800}>Recent Activity</Typography>
              <HistoryIcon color="action" />
            </Box>
            <Stack spacing={2}>
              {myHistory.slice(0, 5).map((h, i) => {
                let s = [];
                try { s = JSON.parse(h.symptoms); } catch (e) { }
                return (
                  <AnimatedCard key={h.id} delay={i * 0.1}>
                    <CardContent sx={{ py: 2, px: 3 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                        <Box>
                          <Typography variant="body2" fontWeight={800} color="primary">{h.patient_name || "Anonymous"}</Typography>
                          <Typography variant="caption" sx={{ display: 'block', opacity: 0.7 }}>{h.phone || "No Number"}</Typography>
                        </Box>
                        <Chip label={h.priority} color={h.priority === 'HIGH' ? 'error' : 'success'} size="small" sx={{ fontWeight: 800, height: 20, fontSize: '0.65rem' }} />
                      </Stack>
                      <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', display: 'block', mb: 0.5 }}>
                        Symptoms: {s.join(", ") || "None"}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.5 }}>
                        {new Date(h.created_at).toLocaleDateString()} • Case #{h.id}
                      </Typography>
                    </CardContent>
                  </AnimatedCard>
                );
              })}
            </Stack>
          </Box>
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
                      <HomeIcon sx={{ fontSize: 80, color: '#B91C1C', mb: 3, opacity: 0.7 }} />
                    </motion.div>
                    <Typography variant="h5" sx={{
                      color: '#B91C1C',
                      fontWeight: 700,
                      mb: 2
                    }}>
                      Welcome to MedHive AI
                    </Typography>
                    <Typography variant="body1" sx={{
                      color: '#EF4444',
                      opacity: 0.8,
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
                          bgcolor: 'rgba(185, 28, 28, 0.1)',
                          color: '#B91C1C',
                          fontWeight: 600
                        }}
                      />
                      <Chip
                        label="🤖 AI-Powered"
                        sx={{
                          bgcolor: 'rgba(239, 68, 68, 0.1)',
                          color: '#EF4444',
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
                      <LocalHospitalIcon sx={{ fontSize: 80, color: '#B91C1C', mb: 3 }} />
                    </motion.div>
                    <Typography variant="h5" sx={{
                      color: '#B91C1C',
                      fontWeight: 700,
                      mb: 2
                    }}>
                      Analyzing Your Symptoms
                    </Typography>
                    <Typography variant="body1" sx={{
                      color: '#EF4444',
                      opacity: 0.8,
                      mb: 4
                    }}>
                      MedHive AI is processing your information with advanced machine learning algorithms...
                    </Typography>
                    <Box sx={{ width: '100%', mb: 3 }}>
                      <LinearProgress
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: '#991B1B',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: 'linear-gradient(135deg, #B91C1C 0%, #EF4444 100%)',
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>
                    <Stack spacing={1}>
                      <Typography variant="body2" sx={{ color: '#EF4444', opacity: 0.7 }}>
                        ✓ Validating symptoms
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#EF4444', opacity: 0.7 }}>
                        ⏳ Analyzing patterns
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#EF4444', opacity: 0.5 }}>
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
                      <CheckCircleIcon sx={{ color: '#B91C1C', mr: 2, fontSize: 32 }} />
                      <Typography variant="h5" sx={{
                        color: '#B91C1C',
                        fontWeight: 800
                      }}>
                        AI Diagnostic Results
                      </Typography>
                    </Box>

                    <Typography variant="body1" sx={{
                      color: '#EF4444',
                      opacity: 0.8,
                      mb: 4
                    }}>
                      Based on your symptoms, here are the most likely conditions. Please consult a healthcare professional for proper diagnosis.
                    </Typography>

                    <Stack spacing={3}>
                      {result.predictions.map((p, i) => (
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
                              ? 'linear-gradient(135deg, #B91C1C 0%, #EF4444 100%)'
                              : 'rgba(185, 28, 28, 0.05)',
                            border: i === 0
                              ? '2px solid #B91C1C'
                              : '1px solid rgba(185, 28, 28, 0.2)',
                            color: i === 0 ? 'white' : '#B91C1C',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            boxShadow: i === 0 ? '0 8px 32px rgba(185, 28, 28, 0.3)' : 'none',
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
                                background: `radial-gradient(circle, rgba(156, 50, 50, 0.1) 0%, transparent 70%)`,
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
                                      bgcolor: 'rgba(255,255,255,0.2)',
                                      color: 'white',
                                      fontWeight: 600,
                                      fontSize: '0.7rem'
                                    }}
                                  />
                                )}
                              </Box>
                              <Typography variant="caption" sx={{
                                opacity: i === 0 ? 0.9 : 0.7,
                                fontSize: '0.8rem'
                              }}>
                                AI Confidence Score
                              </Typography>
                            </Box>

                            <Box sx={{ textAlign: 'right', zIndex: 1 }}>
                              <Typography variant="h3" sx={{
                                fontWeight: 900,
                                fontSize: '2.5rem',
                                lineHeight: 1
                              }}>
                                {p.probability}%
                              </Typography>
                              <Typography variant="caption" sx={{
                                opacity: i === 0 ? 0.9 : 0.7,
                                fontSize: '0.7rem'
                              }}>
                                Probability
                              </Typography>
                            </Box>
                          </Box>
                        </motion.div>
                      ))}
                    </Stack>

                    <Box sx={{ mt: 4, p: 3, borderRadius: 3, bgcolor: 'rgba(185, 28, 28, 0.05)', border: '1px solid rgba(185, 28, 28, 0.2)' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <WarningIcon sx={{ color: '#EF4444', mr: 1, fontSize: 20 }} />
                        <Typography variant="subtitle2" sx={{ color: '#B91C1C', fontWeight: 600 }}>
                          Important Medical Disclaimer
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#EF4444', opacity: 0.8, fontSize: '0.8rem' }}>
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
                          borderColor: '#EF4444',
                          color: '#EF4444',
                          '&:hover': {
                            borderColor: '#B91C1C',
                            color: '#B91C1C',
                          },
                        }}
                      >
                        New Diagnosis
                      </Button>
                      <Button
                        variant="contained"
                        sx={{
                          flex: 1,
                          background: 'linear-gradient(135deg, #B91C1C 0%, #EF4444 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #B91C1C 0%, #EF4444 100%)',
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
