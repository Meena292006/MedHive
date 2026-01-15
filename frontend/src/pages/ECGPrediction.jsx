import { useState } from "react";
import { mlApi } from "../api/mlApi";
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
  LinearProgress
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import FavoriteIcon from "@mui/icons-material/FavoriteRounded";
import CloudUploadIcon from "@mui/icons-material/CloudUploadRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircleRounded";
import WarningIcon from "@mui/icons-material/WarningRounded";

export default function ECGPrediction() {
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
    } catch (err) {
      console.error(err);
      alert("ECG prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const isDisease = result?.prediction === "Disease";

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
              ECG Scan Analysis
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
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
                    background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    boxShadow: `0 10px 30px ${theme.palette.error.main}40`,
                    "&:hover": {
                      boxShadow: `0 15px 40px ${theme.palette.error.main}60`,
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

        <Box sx={{ width: { xs: "100%", md: 400 } }}>
          <AnimatePresence mode="wait">
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
                    bgcolor: isDisease
                      ? `linear-gradient(135deg, ${theme.palette.error.light}10, ${theme.palette.error.light}05)`
                      : `linear-gradient(135deg, ${theme.palette.success.light}10, ${theme.palette.success.light}05)`,
                    border: 2,
                    borderColor: isDisease ? "error.main" : "success.main",
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
                          bgcolor: isDisease ? "error.main" : "success.main",
                          boxShadow: `0 10px 30px ${isDisease ? theme.palette.error.main : theme.palette.success.main}40`,
                        }}
                      >
                        {isDisease ? <WarningIcon sx={{ fontSize: 40 }} /> : <CheckCircleIcon sx={{ fontSize: 40 }} />}
                      </Avatar>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Typography
                        variant="h5"
                        fontWeight={700}
                        color={isDisease ? "error.main" : "success.main"}
                        sx={{ mb: 2 }}
                      >
                        {result.prediction}
                      </Typography>
                    </motion.div>

                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      <Typography variant="h2" fontWeight={900} sx={{ my: 2, color: isDisease ? "error.main" : "success.main" }}>
                        {result.confidence}%
                      </Typography>
                    </motion.div>

                    <Typography color="text.secondary" fontWeight={600}>
                      Model Confidence
                    </Typography>
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
            )}
          </AnimatePresence>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
