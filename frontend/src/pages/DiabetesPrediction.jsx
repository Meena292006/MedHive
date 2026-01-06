import { useState } from "react";
import { mlApi } from "../api/mlApi";
import DashboardLayout from "../components/DashboardLayout";
import {
    Button, TextField, Card, CardContent, Typography,
    Grid, Box,
} from "@mui/material";
import WaterDropIcon from "@mui/icons-material/WaterDropRounded";

export default function DiabetesPrediction() {
    const [formData, setFormData] = useState({
        Pregnancies: "6", Glucose: "148", BloodPressure: "72", SkinThickness: "35",
        Insulin: "0", BMI: "33.6", DiabetesPedigreeFunction: "0.627", Age: "50"
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

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

    return (
        <DashboardLayout>
            <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
                <WaterDropIcon sx={{ fontSize: 40, color: "secondary.main" }} />
                <Typography variant="h4" fontWeight={800}> Diabetes Analysis</Typography>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent sx={{ p: 4 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={6}><TextField fullWidth label="Pregnancies" name="Pregnancies" type="number" onChange={handleChange} /></Grid>
                                <Grid item xs={6}><TextField fullWidth label="Glucose" name="Glucose" type="number" onChange={handleChange} /></Grid>
                                <Grid item xs={6}><TextField fullWidth label="Blood Pressure" name="BloodPressure" type="number" onChange={handleChange} /></Grid>
                                <Grid item xs={6}><TextField fullWidth label="Skin Thickness" name="SkinThickness" type="number" onChange={handleChange} /></Grid>
                                <Grid item xs={6}><TextField fullWidth label="Insulin" name="Insulin" type="number" onChange={handleChange} /></Grid>
                                <Grid item xs={6}><TextField fullWidth label="BMI" name="BMI" type="number" onChange={handleChange} /></Grid>
                                <Grid item xs={6}><TextField fullWidth label="Diabetes Pedigree Function" name="DiabetesPedigreeFunction" type="number" onChange={handleChange} /></Grid>
                                <Grid item xs={6}><TextField fullWidth label="Age" name="Age" type="number" onChange={handleChange} /></Grid>

                                <Grid item xs={12}>
                                    <Button variant="contained" fullWidth size="large" onClick={submit} disabled={loading}>
                                        {loading ? "Analyzing..." : "Predict Diabetes Risk"}
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    {result && (
                        <Card sx={{ bgcolor: result.is_danger ? "#FFF5F5" : "#F0FFF4", border: 1, borderColor: result.is_danger ? "error.main" : "success.main" }}>
                            <CardContent sx={{ textAlign: 'center', p: 4 }}>
                                <Typography variant="h5" fontWeight={700} color={result.is_danger ? "error" : "success.main"}>
                                    {result.prediction}
                                </Typography>
                                <Typography variant="h3" fontWeight={800} sx={{ my: 2 }}>
                                    {result.probability}%
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Confidence Score
                                </Typography>
                            </CardContent>
                        </Card>
                    )}
                </Grid>
            </Grid>
        </DashboardLayout>
    );
}
