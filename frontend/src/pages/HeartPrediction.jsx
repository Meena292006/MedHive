import { useState } from "react";
import { mlApi } from "../api/mlApi";
import DashboardLayout from "../components/DashboardLayout";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/FavoriteRounded";

export default function HeartPrediction() {
  const [formData, setFormData] = useState({
    age: "57",
    sex: "1",
    cp: "0",
    trestbps: "140",
    chol: "241",
    fbs: "0",
    restecg: "1",
    thalach: "123",
    exang: "1",
    oldpeak: "0.2",
    slope: "1",
    ca: "0",
    thal: "2"
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
      const payload = {
        age: Number(formData.age),
        sex: Number(formData.sex),
        cp: Number(formData.cp),
        trestbps: Number(formData.trestbps),
        chol: Number(formData.chol),
        fbs: Number(formData.fbs),
        restecg: Number(formData.restecg),
        thalach: Number(formData.thalach),
        exang: Number(formData.exang),
        oldpeak: Number(formData.oldpeak),
        slope: Number(formData.slope),
        ca: Number(formData.ca),
        thal: Number(formData.thal)
      };

      const res = await mlApi.post("/predict/heart", payload);

      const isDanger = res.data.prediction === 1;

      setResult({
        isDanger,
        probability: res.data.probability,
        label: isDanger
          ? "High Risk of Heart Disease"
          : "Low Risk / Normal"
      });
    } catch (err) {
      alert(
        "Prediction failed\n" +
          (err.response?.data?.detail || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <FavoriteIcon sx={{ fontSize: 40, color: "error.main" }} />
        <Typography variant="h4" fontWeight={800}>
          Heart Disease Analysis
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <TextField fullWidth label="Age" name="age" type="number" value={formData.age} onChange={handleChange} />
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Sex</InputLabel>
                    <Select name="sex" value={formData.sex} onChange={handleChange}>
                      <MenuItem value={1}>Male</MenuItem>
                      <MenuItem value={0}>Female</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Chest Pain Type</InputLabel>
                    <Select name="cp" value={formData.cp} onChange={handleChange}>
                      <MenuItem value={0}>Typical Angina</MenuItem>
                      <MenuItem value={1}>Atypical Angina</MenuItem>
                      <MenuItem value={2}>Non-anginal Pain</MenuItem>
                      <MenuItem value={3}>Asymptomatic</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <TextField fullWidth label="Resting BP (mm Hg)" name="trestbps" type="number" value={formData.trestbps} onChange={handleChange} />
                </Grid>

                <Grid item xs={6}>
                  <TextField fullWidth label="Cholesterol (mg/dl)" name="chol" type="number" value={formData.chol} onChange={handleChange} />
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Fasting Blood Sugar</InputLabel>
                    <Select name="fbs" value={formData.fbs} onChange={handleChange}>
                      <MenuItem value={1}>High (&gt;120)</MenuItem>
                      <MenuItem value={0}>Normal</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Resting ECG</InputLabel>
                    <Select name="restecg" value={formData.restecg} onChange={handleChange}>
                      <MenuItem value={0}>Normal</MenuItem>
                      <MenuItem value={1}>ST-T Abnormality</MenuItem>
                      <MenuItem value={2}>LV Hypertrophy</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <TextField fullWidth label="Max Heart Rate (thalach)" name="thalach" type="number" value={formData.thalach} onChange={handleChange} />
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Exercise Angina</InputLabel>
                    <Select name="exang" value={formData.exang} onChange={handleChange}>
                      <MenuItem value={1}>Yes</MenuItem>
                      <MenuItem value={0}>No</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <TextField fullWidth label="ST Depression (oldpeak)" name="oldpeak" type="number" value={formData.oldpeak} onChange={handleChange} />
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Slope</InputLabel>
                    <Select name="slope" value={formData.slope} onChange={handleChange}>
                      <MenuItem value={0}>Upsloping</MenuItem>
                      <MenuItem value={1}>Flat</MenuItem>
                      <MenuItem value={2}>Downsloping</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Major Vessels (ca)</InputLabel>
                    <Select name="ca" value={formData.ca} onChange={handleChange}>
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
                    <Select name="thal" value={formData.thal} onChange={handleChange}>
                      <MenuItem value={0}>Normal</MenuItem>
                      <MenuItem value={1}>Fixed Defect</MenuItem>
                      <MenuItem value={2}>Reversible Defect</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Button fullWidth size="large" variant="contained" onClick={submit} disabled={loading}>
                    {loading ? "Analyzing..." : "Predict Heart Risk"}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          {result && (
            <Card sx={{ border: 1, borderColor: result.isDanger ? "error.main" : "success.main" }}>
              <CardContent sx={{ textAlign: "center", p: 4 }}>
                <Typography variant="h6" fontWeight={700} color={result.isDanger ? "error" : "success.main"}>
                  {result.label}
                </Typography>
                <Typography variant="h3" fontWeight={800} sx={{ my: 2 }}>
                  {result.probability}%
                </Typography>
                <Typography color="text.secondary">Prediction Confidence</Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
