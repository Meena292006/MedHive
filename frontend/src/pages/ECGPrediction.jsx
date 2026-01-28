import { useState } from "react";
import { mlApi } from "../api/mlApi";
import { api } from "../api/api";
import DashboardLayout from "../components/DashboardLayout";
import AnimatedCard from "../components/AnimatedCard";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  useTheme,
  Avatar,
  LinearProgress,
  Grid
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import FavoriteIcon from "@mui/icons-material/FavoriteRounded";
import { useAuth } from "../context/AuthContext";
import CloudUploadIcon from "@mui/icons-material/CloudUploadRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircleRounded";
import WarningIcon from "@mui/icons-material/WarningRounded";

export default function ECGPrediction() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const theme = useTheme();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const submit = async () => {
    if (!file) {
      alert("Please upload an ECG image");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await mlApi.post("/predict/ecg", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);

      // Save to Reports
      try {
        await api.post("/cases/save", {
          patient: user?.displayName || user?.email?.split('@')[0] || "Patient",
          type: "ECG",
          result: res.data.prediction,
          probability: res.data.confidence,
          is_danger: !res.data.prediction.toLowerCase().includes("normal")
        });
      } catch (saveErr) {
        console.error("Failed to save report:", saveErr);
      }
    } catch (err) {
      console.error(err);
      alert("ECG prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const isDisease =
    result &&
    !result.prediction.toLowerCase().includes("normal");


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
        {/* Floating ECG Wave */}
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
          <FavoriteIcon sx={{ fontSize: 120, color: theme.palette.primary.main }} />
        </motion.div>

        {/* Pulsing Heartbeat */}
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
          <CloudUploadIcon sx={{ fontSize: 100, color: theme.palette.secondary.main }} />
        </motion.div>

        {/* Breathing Medical Cross */}
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
          <CheckCircleIcon sx={{ fontSize: 80, color: theme.palette.primary.main }} />
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
          <WarningIcon sx={{ fontSize: 90, color: theme.palette.secondary.main }} />
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
              ECG Scan Analysis
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, color: theme.palette.text.secondary }}>
              AI-powered electrocardiogram interpretation
            </Typography>
          </Box>
        </Box>
      </motion.div>

      <Box sx={{ display: "flex", gap: 4, flexDirection: { xs: "column", md: "row" } }}>
        <Box sx={{ flex: 1 }}>
          <AnimatedCard delay={0.2}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Upload ECG Image
                </Typography>
                <Box
                  component="label"
                  htmlFor="ecg-upload"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 4,
                    border: `2px dashed ${theme.palette.primary.main}40`,
                    borderRadius: 4,
                    cursor: "pointer",
                    transition: "all 0.3s",
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                      bgcolor: `${theme.palette.primary.main}05`,
                    },
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <CloudUploadIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
                  </motion.div>
                  <Typography variant="body1" fontWeight={600} sx={{ mb: 1 }}>
                    Click to upload or drag and drop
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    PNG, JPG, JPEG up to 10MB
                  </Typography>
                  <input
                    id="ecg-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </Box>
              </Box>

              {preview && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    sx={{
                      mb: 3,
                      borderRadius: 3,
                      overflow: "hidden",
                      border: `2px solid ${theme.palette.divider}`,
                    }}
                  >
                    <img
                      src={preview}
                      alt="ECG Preview"
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                      }}
                    />
                  </Box>
                </motion.div>
              )}

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={submit}
                  disabled={loading || !file}
                  sx={{
                    py: 1.8,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    boxShadow: `0 10px 30px ${theme.palette.primary.main}40`,
                    "&:hover": {
                      boxShadow: `0 15px 40px ${theme.palette.primary.main}60`,
                    },
                    "&:disabled": {
                      opacity: 0.6,
                    },
                  }}
                >
                  {loading ? "Analyzing ECG..." : "Analyze ECG"}
                </Button>
              </motion.div>

              {loading && (
                <Box sx={{ mt: 3 }}>
                  <LinearProgress sx={{ borderRadius: 2, height: 8 }} />
                  <Typography align="center" sx={{ mt: 2, color: "text.secondary" }}>
                    Processing image with AI model...
                  </Typography>
                </Box>
              )}
            </CardContent>
          </AnimatedCard>
        </Box>
      </Box>

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
            {/* Prediction Cards Grid - Full Width */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
              {[
                { label: "Observed Rhythm", value: result.prediction, color: theme.palette.primary.main },
                { label: "Clinical Priority", value: isDisease ? 'Urgent' : 'Routine', color: isDisease ? theme.palette.secondary.main : theme.palette.primary.main },
                { label: "Analysis Confidence", value: `${result.confidence}%`, color: theme.palette.secondary.main },
                { label: "AI Interpretation", value: "Enhanced", color: theme.palette.primary.main },
                { label: "Action Plan", value: isDisease ? 'Consult Cardiologist' : 'Continue Monitoring', color: theme.palette.secondary.main },
                { label: "Next Follow-up", value: isDisease ? 'Immediate' : 'As Scheduled', color: theme.palette.primary.main },
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

            {/* Main Result Card */}
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
                  borderColor: isDisease ? theme.palette.primary.main : theme.palette.success.main,
                  background: theme.palette.secondary.main,
                  backdropFilter: 'blur(20px)',
                  position: "relative",
                  overflow: "hidden",
                  color: 'white'
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
                        bgcolor: isDisease ? theme.palette.primary.main : theme.palette.success.main,
                        boxShadow: `0 10px 30px rgba(0,0,0,0.2)`,
                      }}
                    >
                      {isDisease ? <WarningIcon sx={{ fontSize: 40 }} /> : <CheckCircleIcon sx={{ fontSize: 40 }} />}
                    </Avatar>
                  </motion.div>

                  <Typography variant="h4" fontWeight={800} sx={{ mb: 1, color: 'white' }}>
                    {result.prediction}
                  </Typography>

                  <Typography variant="h2" fontWeight={800} sx={{ my: 2, color: 'white' }}>
                    {result.confidence}%
                  </Typography>

                  <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
                    Model Confidence
                  </Typography>
                </CardContent>
              </AnimatedCard>
            </motion.div>
          </Box>
        )}
      </AnimatePresence>

      {
        !result && !loading && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card sx={{ borderRadius: 4, border: `2px dashed ${theme.palette.divider}` }}>
              <CardContent sx={{ p: 4, textAlign: "center", minHeight: 300, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FavoriteIcon sx={{ fontSize: 80, color: theme.palette.grey[300], mb: 2 }} />
                </motion.div>
                <Typography variant="h6" color="text.secondary" fontWeight={600}>
                  Upload an ECG image to get started
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        )
      }
    </DashboardLayout >
  );
}
