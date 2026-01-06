import { useState } from "react";
import { mlApi } from "../api/mlApi";
import DashboardLayout from "../components/DashboardLayout";
import {
    Button, TextField, Card, CardContent, Typography,
    Grid, Box, Chip, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/FavoriteRounded";

export default function HeartPrediction() {
    const [formData, setFormData] = useState({
        age: "57", sex: "1", cp: "0", trestbps: "140", chol: "241",
        fbs: "0", restecg: "1", thalach: "123", exang: "1",
        oldpeak: "0.2", slope: "1", ca: "0", thal: "3"
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const submit = async () => {
        setLoading(true);
        setResult(null); // Clear previous result
        try {
            const safeParseInt = (val) => isNaN(parseInt(val)) ? 0 : parseInt(val);
            const safeParseFloat = (val) => isNaN(parseFloat(val)) ? 0.0 : parseFloat(val);

            const payload = {
                age: safeParseInt(formData.age),
                sex: safeParseInt(formData.sex),
                cp: safeParseInt(formData.cp),
                trestbps: safeParseInt(formData.trestbps),
                chol: safeParseInt(formData.chol),
                fbs: safeParseInt(formData.fbs),
                restecg: safeParseInt(formData.restecg),
                thalach: safeParseInt(formData.thalach),
                exang: safeParseInt(formData.exang),
                oldpeak: safeParseFloat(formData.oldpeak),
                slope: safeParseInt(formData.slope),
                ca: safeParseInt(formData.ca),
                thal: safeParseInt(formData.thal)
            };

            const res = await mlApi.post("/predict/heart", payload);
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
                <FavoriteIcon sx={{ fontSize: 40, color: "error.main" }} />
                <Typography variant="h4" fontWeight={800}> Heart Disease Analysis</Typography>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent sx={{ p: 4 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={6}><TextField fullWidth label="Age" name="age" type="number" onChange={handleChange} /></Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Sex</InputLabel>
                                        <Select name="sex" value={formData.sex} label="Sex" onChange={handleChange}>
                                            <MenuItem value={1}>Male</MenuItem>
                                            <MenuItem value={0}>Female</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Chest Pain Type (0-3)</InputLabel>
                                        <Select name="cp" value={formData.cp} label="Chest Pain Type (0-3)" onChange={handleChange}>
                                            <MenuItem value={0}>Typical Angina</MenuItem>
                                            <MenuItem value={1}>Atypical Angina</MenuItem>
                                            <MenuItem value={2}>Non-anginal Pain</MenuItem>
                                            <MenuItem value={3}>Asymptomatic</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}><TextField fullWidth label="Resting BP (mm Hg)" name="trestbps" type="number" onChange={handleChange} /></Grid>

                                <Grid item xs={6}><TextField fullWidth label="Cholesterol (mg/dl)" name="chol" type="number" onChange={handleChange} /></Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Fasting BS &gt; 120 mg/dl</InputLabel>
                                        <Select name="fbs" value={formData.fbs} label="Fasting BS > 120 mg/dl" onChange={handleChange}>
                                            <MenuItem value={1}>True</MenuItem>
                                            <MenuItem value={0}>False</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Resting ECG</InputLabel>
                                        <Select name="restecg" value={formData.restecg} label="Resting ECG" onChange={handleChange}>
                                            <MenuItem value={0}>Normal</MenuItem>
                                            <MenuItem value={1}>ST-T Wave Abnormality</MenuItem>
                                            <MenuItem value={2}>Left Ventricular Hypertrophy</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}><TextField fullWidth label="Max Heart Rate" name="thalach" type="number" onChange={handleChange} /></Grid>

                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Exercise Angina</InputLabel>
                                        <Select name="exang" value={formData.exang} label="Exercise Angina" onChange={handleChange}>
                                            <MenuItem value={1}>Yes</MenuItem>
                                            <MenuItem value={0}>No</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}><TextField fullWidth label="ST Depression (Oldpeak)" name="oldpeak" type="number" helperText="Typical range: 0 - 6.0" onChange={handleChange} /></Grid>

                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Slope of Peak ST</InputLabel>
                                        <Select name="slope" value={formData.slope} label="Slope of Peak ST" onChange={handleChange}>
                                            <MenuItem value={0}>Upsloping</MenuItem>
                                            <MenuItem value={1}>Flat</MenuItem>
                                            <MenuItem value={2}>Downsloping</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>No. Major Vessels (0-3)</InputLabel>
                                        <Select name="ca" value={formData.ca} label="No. Major Vessels (0-3)" onChange={handleChange}>
                                            <MenuItem value={0}>0</MenuItem>
                                            <MenuItem value={1}>1</MenuItem>
                                            <MenuItem value={2}>2</MenuItem>
                                            <MenuItem value={3}>3</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Thalassemia</InputLabel>
                                        <Select name="thal" value={formData.thal} label="Thalassemia" onChange={handleChange}>
                                            <MenuItem value={0}>Normal</MenuItem>
                                            <MenuItem value={1}>Fixed Defect</MenuItem>
                                            <MenuItem value={2}>Reversable Defect</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <Button variant="contained" fullWidth size="large" onClick={submit} disabled={loading}>
                                        {loading ? "Analyzing..." : "Predict Heart Disease Risk"}
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
