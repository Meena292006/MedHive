import { useState } from "react";
import { mlApi } from "../api/mlApi";
import DashboardLayout from "../components/DashboardLayout";

import {
  Button, TextField, Card, CardContent, Typography,
  Grid, Box, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";

import ScienceIcon from "@mui/icons-material/ScienceRounded";

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

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <ScienceIcon sx={{ fontSize: 40, color: "success.main" }} />
        <Typography variant="h4" fontWeight={800}>
          Liver Disease Analysis
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={3}>

                <Grid item xs={6}>
                  <TextField fullWidth label="Age" name="age" type="number" onChange={handleChange} />
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select name="gender" value={formData.gender} label="Gender" onChange={handleChange}>
                      <MenuItem value={1}>Male</MenuItem>
                      <MenuItem value={0}>Female</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6}><TextField fullWidth label="Total Bilirubin" name="total_bilirubin" onChange={handleChange} /></Grid>
                <Grid item xs={6}><TextField fullWidth label="Direct Bilirubin" name="direct_bilirubin" onChange={handleChange} /></Grid>

                <Grid item xs={6}><TextField fullWidth label="Alkaline Phosphotase" name="alkaline_phosphotase" onChange={handleChange} /></Grid>
                <Grid item xs={6}><TextField fullWidth label="ALT" name="alt" onChange={handleChange} /></Grid>

                <Grid item xs={6}><TextField fullWidth label="AST" name="ast" onChange={handleChange} /></Grid>
                <Grid item xs={6}><TextField fullWidth label="Total Proteins" name="total_proteins" onChange={handleChange} /></Grid>

                <Grid item xs={6}><TextField fullWidth label="Albumin" name="albumin" onChange={handleChange} /></Grid>
                <Grid item xs={6}><TextField fullWidth label="A/G Ratio" name="ag_ratio" onChange={handleChange} /></Grid>

                <Grid item xs={12}>
                  <Button variant="contained" fullWidth size="large" onClick={submit} disabled={loading}>
                    {loading ? "Analyzing..." : "Predict Liver Disease Risk"}
                  </Button>
                </Grid>

              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          {result && (
            <Card sx={{
              bgcolor: result.is_danger ? "#FFF5F5" : "#F0FFF4",
              border: 1,
              borderColor: result.is_danger ? "error.main" : "success.main"
            }}>
              <CardContent sx={{ textAlign: "center", p: 4 }}>
                <Typography variant="h5" fontWeight={700}
                  color={result.is_danger ? "error" : "success.main"}>
                  {result.prediction}
                </Typography>

                <Typography variant="h3" fontWeight={800} sx={{ my: 2 }}>
                  {result.probability}%
                </Typography>

                <Typography color="text.secondary">
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
