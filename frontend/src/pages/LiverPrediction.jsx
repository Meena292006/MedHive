import { useState } from "react";
import { mlApi } from "../api/mlApi";
import DashboardLayout from "../components/DashboardLayout";
import AnimatedCard from "../components/AnimatedCard";
import {
  Button, TextField, Card, CardContent, Typography,
  Grid, Box, FormControl, InputLabel, Select, MenuItem, useTheme, Avatar, LinearProgress
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import ScienceIcon from "@mui/icons-material/ScienceRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircleRounded";
import WarningIcon from "@mui/icons-material/WarningRounded";

export default function LiverPrediction() {
  const [formData, setFormData] = useState({
    age: "45",
    gender: "1",
    total_bilirubin: "1.8",
    direct_bilirubin: "0.6",
    alkaline_phosphotase: "210",
    alt: "65",
    ast: "58",
    total_proteins: "6.5",
    albumin: "3.2",
    ag_ratio: "0.9"
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
        age: parseInt(formData.age) || 0,
        gender: parseInt(formData.gender),
        total_bilirubin: parseFloat(formData.total_bilirubin) || 0,
        direct_bilirubin: parseFloat(formData.direct_bilirubin) || 0,
        alkaline_phosphotase: parseInt(formData.alkaline_phosphotase) || 0,
        alt: parseInt(formData.alt) || 0,
        ast: parseInt(formData.ast) || 0,
        total_proteins: parseFloat(formData.total_proteins) || 0,
        albumin: parseFloat(formData.albumin) || 0,
        ag_ratio: parseFloat(formData.ag_ratio) || 0
      };

      const res = await mlApi.post("/predict/liver", payload);
      setResult(res.data);
    } catch (err) {
      alert("Prediction failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "Age", name: "age", type: "number" },
    { label: "Gender", name: "gender", type: "select", options: [{ value: 1, label: "Male" }, { value: 0, label: "Female" }] },
    { label: "Total Bilirubin", name: "total_bilirubin", type: "number" },
    { label: "Direct Bilirubin", name: "direct_bilirubin", type: "number" },
    { label: "Alkaline Phosphotase", name: "alkaline_phosphotase", type: "number" },
    { label: "ALT", name: "alt", type: "number" },
    { label: "AST", name: "ast", type: "number" },
    { label: "Total Proteins", name: "total_proteins", type: "number" },
    { label: "Albumin", name: "albumin", type: "number" },
    { label: "A/G Ratio", name: "ag_ratio", type: "number" },
  ];

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
            <Avatar sx={{ bgcolor: theme.palette.success.main, width: 56, height: 56, boxShadow: `0 10px 30px ${theme.palette.success.main}40` }}>
              <ScienceIcon />
            </Avatar>
          </motion.div>
          <Box>
            <Typography variant="h4" fontWeight={800}>
              Liver Disease Analysis
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Comprehensive liver function assessment
            </Typography>
          </Box>
        </Box>
      </motion.div>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <AnimatedCard delay={0.2}>
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={3}>
                {fields.map((field, idx) => (
                  <Grid item xs={6} key={field.name}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                    >
                      {field.type === "select" ? (
                        <FormControl fullWidth>
                          <InputLabel>{field.label}</InputLabel>
                          <Select name={field.name} value={formData[field.name]} label={field.label} onChange={handleChange}>
                            {field.options.map(opt => (
                              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <TextField fullWidth label={field.label} name={field.name} value={formData[field.name]} onChange={handleChange} />
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
                      variant="contained"
                      fullWidth
                      size="large"
                      onClick={submit}
                      disabled={loading}
                      sx={{
                        py: 1.8,
                        background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        boxShadow: `0 10px 30px ${theme.palette.success.main}40`,
                        "&:hover": {
                          boxShadow: `0 15px 40px ${theme.palette.success.main}60`,
                        },
                      }}
                    >
                      {loading ? "Analyzing..." : "Predict Liver Disease Risk"}
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
                      <ScienceIcon sx={{ fontSize: 60, color: theme.palette.success.main, mb: 2 }} />
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
                    bgcolor: result.is_danger
                      ? `linear-gradient(135deg, ${theme.palette.error.light}10, ${theme.palette.error.light}05)`
                      : `linear-gradient(135deg, ${theme.palette.success.light}10, ${theme.palette.success.light}05)`,
                    border: 2,
                    borderColor: result.is_danger ? "error.main" : "success.main",
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
                          bgcolor: result.is_danger ? "error.main" : "success.main",
                          boxShadow: `0 10px 30px ${result.is_danger ? theme.palette.error.main : theme.palette.success.main}40`,
                        }}
                      >
                        {result.is_danger ? <WarningIcon sx={{ fontSize: 40 }} /> : <CheckCircleIcon sx={{ fontSize: 40 }} />}
                      </Avatar>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Typography variant="h5" fontWeight={700}
                        color={result.is_danger ? "error" : "success.main"} sx={{ mb: 2 }}>
                        {result.prediction}
                      </Typography>
                    </motion.div>

                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      <Typography variant="h2" fontWeight={800} sx={{ my: 2, color: result.is_danger ? "error.main" : "success.main" }}>
                        {result.probability}%
                      </Typography>
                    </motion.div>

                    <Typography color="text.secondary" fontWeight={600}>
                      Confidence Score
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
