import { useState } from "react";
import { mlApi } from "../api/mlApi";
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
                        <Avatar sx={{ bgcolor: theme.palette.secondary.main, width: 56, height: 56, boxShadow: `0 10px 30px ${theme.palette.secondary.main}40` }}>
                            <WaterDropIcon />
                        </Avatar>
                    </motion.div>
                    <Box>
                        <Typography variant="h4" fontWeight={800}>Diabetes Analysis</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Advanced diabetes risk assessment
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
                                            <TextField
                                                fullWidth
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
                                                background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                                                fontWeight: 700,
                                                fontSize: "1.1rem",
                                                boxShadow: `0 10px 30px ${theme.palette.secondary.main}40`,
                                                "&:hover": {
                                                    boxShadow: `0 15px 40px ${theme.palette.secondary.main}60`,
                                                },
                                            }}
                                        >
                                            {loading ? "Analyzing..." : "Predict Diabetes Risk"}
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
                                            <WaterDropIcon sx={{ fontSize: 60, color: theme.palette.secondary.main, mb: 2 }} />
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
                                    <CardContent sx={{ textAlign: 'center', p: 4 }}>
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
                                            <Typography variant="h5" fontWeight={700} color={result.is_danger ? "error" : "success.main"} sx={{ mb: 2 }}>
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

                                        <Typography variant="body1" color="text.secondary" fontWeight={600}>
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
