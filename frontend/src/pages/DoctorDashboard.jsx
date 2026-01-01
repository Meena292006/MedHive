import { useEffect, useState } from "react";
import { api } from "../api/api";
import DashboardLayout from "../components/DashboardLayout";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Grid,
  Divider
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import PersonIcon from "@mui/icons-material/Person";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function DoctorDashboard() {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    api.get("/cases").then(res => {
      const latestCases = res.data
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 10);

      setCases(latestCases);
    });
  }, []);

  // =========================
  // ANALYTICS
  // =========================

  const highCount = cases.filter(c => c.priority === "HIGH").length;
  const normalCount = cases.filter(c => c.priority === "NORMAL").length;

  const chartData = [
    { name: "High Priority", count: highCount },
    { name: "Normal Priority", count: normalCount }
  ];

  const getPriorityColor = (priority) =>
    priority === "HIGH" ? "error" : "success";

  return (
    <DashboardLayout>
      {/* HEADER */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Doctor Dashboard
        </Typography>
        <Typography sx={{ color: "#64748b" }}>
          Clinical overview & AI-assisted analysis (latest 10 cases)
        </Typography>
      </Box>

      {/* ANALYTICS CARDS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="caption">Total Cases</Typography>
              <Typography variant="h4" fontWeight="bold">
                {cases.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="caption">High Priority</Typography>
              <Typography variant="h4" fontWeight="bold" color="error">
                {highCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="caption">Normal Priority</Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {normalCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* GRAPH */}
      <Card sx={{ borderRadius: 3, mb: 4 }}>
        <CardContent>
          <Typography fontWeight={600} sx={{ mb: 2 }}>
            Priority Distribution
          </Typography>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* PATIENT CASES */}
      <Grid container spacing={3}>
        {cases.map((c) => (
          <Grid item xs={12} md={6} key={c.id}>
            <Card
              sx={{
                borderRadius: 3,
                borderLeft: c.priority === "HIGH"
                  ? "6px solid #ef4444"
                  : "6px solid #22c55e"
              }}
            >
              <CardContent>
                {/* HEADER */}
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PersonIcon sx={{ mr: 1, color: "#0ea5e9" }} />
                    <Typography fontWeight={600}>
                      {c.patient_name}
                    </Typography>
                  </Box>

                  <Chip
                    label={c.priority}
                    color={getPriorityColor(c.priority)}
                    icon={c.priority === "HIGH" ? <WarningIcon /> : undefined}
                    size="small"
                  />
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* SYMPTOMS */}
                <Typography variant="caption" color="text.secondary">
                  Symptoms
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                  {JSON.parse(c.symptoms).map((s, i) => (
                    <Chip key={i} label={s} size="small" />
                  ))}
                </Box>

                {/* AI PREDICTIONS */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    AI Predicted Conditions
                  </Typography>

                  {JSON.parse(c.predictions).map((p, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 1
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <MedicalServicesIcon sx={{ fontSize: 16, mr: 1 }} />
                        <Typography variant="body2">
                          {p.disease}
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight={600}>
                        {p.probability}%
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* RISK SCORE */}
                <Typography sx={{ mt: 2 }} variant="body2">
                  Risk Score: <b>{c.risk_score}</b>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {cases.length === 0 && (
          <Typography sx={{ color: "#94a3b8", fontStyle: "italic" }}>
            No recent patient cases available.
          </Typography>
        )}
      </Grid>
    </DashboardLayout>
  );
}
