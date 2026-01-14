import { useState } from "react";
import { mlApi } from "../api/mlApi";
import DashboardLayout from "../components/DashboardLayout";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/FavoriteRounded";

export default function ECGPrediction() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
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

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <FavoriteIcon sx={{ fontSize: 40, color: "error.main" }} />
        <Typography variant="h4" fontWeight={800}>
          ECG Scan Analysis
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              onClick={submit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Analyze ECG"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {result && (
        <Card
          sx={{
            mt: 4,
            bgcolor:
              result.prediction === "Disease" ? "#FFF5F5" : "#F0FFF4",
            border: 1,
            borderColor:
              result.prediction === "Disease"
                ? "error.main"
                : "success.main",
          }}
        >
          <CardContent sx={{ textAlign: "center", p: 4 }}>
            <Typography
              variant="h5"
              fontWeight={700}
              color={
                result.prediction === "Disease"
                  ? "error.main"
                  : "success.main"
              }
            >
              {result.prediction}
            </Typography>

            <Typography variant="h3" fontWeight={800} sx={{ my: 2 }}>
              {result.confidence}%
            </Typography>

            <Typography color="text.secondary">
              Model Confidence
            </Typography>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}
