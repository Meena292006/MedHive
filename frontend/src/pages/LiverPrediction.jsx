import { useState } from "react";
import { mlApi } from "../api/mlApi";
import DashboardLayout from "../components/DashboardLayout";
import AnimatedCard from "../components/AnimatedCard";
import {
  Button, TextField, Card, CardContent, Typography,
  Grid, Box, FormControl, InputLabel, Select, MenuItem, useTheme, Avatar, LinearProgress
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/api";
import ScienceIcon from "@mui/icons-material/ScienceRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircleRounded";
import WarningIcon from "@mui/icons-material/WarningRounded";

export default function LiverPrediction() {
  const { user } = useAuth();
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

      // Save to Reports
      try {
        await api.post("/cases/save", {
          patient: user?.displayName || user?.email?.split('@')[0] || "Patient",
          type: "LIVER",
          result: res.data.prediction,
          probability: res.data.probability,
          is_danger: res.data.is_danger
        });
      } catch (saveErr) {
        console.error("Failed to save report:", saveErr);
      }
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
        <Box sx={{ mb: 4, mt: 4, display: "flex", alignItems: "center", gap: 4 }}>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 56, height: 56, boxShadow: `0 10px 30px ${theme.palette.primary.main}40` }}>
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
              <Box
                sx={{
                  /* HOVER */
                  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.secondary.main,
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
                  {fields.map((field, idx) => (
                    <Grid item xs={6} key={field.name}>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                      >
                        {field.type === "select" ? (
                          <FormControl fullWidth color="error">
                            <InputLabel>{field.label}</InputLabel>
                            <Select name={field.name} value={formData[field.name]} label={field.label} onChange={handleChange}>
                              {field.options.map(opt => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        ) : (
                          <TextField fullWidth color="primary" label={field.label} name={field.name} value={formData[field.name]} onChange={handleChange} />
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
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          fontWeight: 700,
                          fontSize: "1.1rem",
                          boxShadow: `0 10px 30px ${theme.palette.primary.main}40`,
                          "&:hover": {
                            boxShadow: `0 15px 40px ${theme.palette.primary.main}60`,
                          },
                        }}
                      >
                        {loading ? "Analyzing..." : "Predict Liver Disease Risk"}
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
            {/* Prediction Cards Grid - Full Width */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
              {[
                { label: "Detected Condition", value: result.prediction, color: theme.palette.primary.main },
                { label: "Severity Level", value: result.is_danger ? 'High' : 'Low', color: result.is_danger ? theme.palette.secondary.main : theme.palette.primary.main },
                { label: "Confidence Score", value: `${result.probability}%`, color: theme.palette.secondary.main },
                { label: "AI Verification", value: "Verified", color: theme.palette.primary.main },
                { label: "Recommended Action", value: result.is_danger ? 'Consult Doctor' : 'Monitor Health', color: theme.palette.secondary.main },
                { label: "Next Steps", value: result.is_danger ? 'Schedule Tests' : 'Annual Checkup', color: theme.palette.primary.main },
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
                  borderColor: result.is_danger ? theme.palette.primary.main : theme.palette.success.main,
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
                        bgcolor: result.is_danger ? theme.palette.primary.main : theme.palette.success.main,
                        boxShadow: `0 10px 30px rgba(0,0,0,0.2)`,
                      }}
                    >
                      {result.is_danger ? <WarningIcon sx={{ fontSize: 40 }} /> : <CheckCircleIcon sx={{ fontSize: 40 }} />}
                    </Avatar>
                  </motion.div>

                  <Typography variant="h4" fontWeight={800} sx={{ mb: 1, color: 'white' }}>
                    {result.prediction}
                  </Typography>

                  <Typography variant="h2" fontWeight={800} sx={{ my: 2, color: 'white' }}>
                    {result.probability}%
                  </Typography>

                  <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
                    Confidence Score
                  </Typography>
                </CardContent>
              </AnimatedCard>
            </motion.div>
          </Box>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
