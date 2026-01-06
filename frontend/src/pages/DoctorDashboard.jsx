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
  Divider,
  useTheme,
  Avatar
} from "@mui/material";
import WarningIcon from "@mui/icons-material/WarningRounded";
import PersonIcon from "@mui/icons-material/PersonRounded";
import MedicalServicesIcon from "@mui/icons-material/MedicalServicesRounded";
import AnalyticsIcon from "@mui/icons-material/AnalyticsRounded";
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
  const theme = useTheme();

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
        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700 }}>
          Overview
        </Typography>
        <Typography variant="h4" fontWeight="800" color="text.primary" sx={{ mt: 0.5 }}>
          Doctor Dashboard
        </Typography>
        <Typography sx={{ color: theme.palette.text.secondary, mt: 1 }}>
          Clinical overview & AI-assisted analysis (latest 10 cases)
        </Typography>
      </Box>

      {/* ANALYTICS CARDS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>TOTAL CASES</Typography>
                <Typography variant="h3" fontWeight="bold" sx={{ mt: 1 }}>
                  {cases.length}
                </Typography>
              </Box>
              <Avatar sx={{ width: 56, height: 56, bgcolor: theme.palette.primary.light, color: "white" }}>
                <AnalyticsIcon />
              </Avatar>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>HIGH RISK</Typography>
                <Typography variant="h3" fontWeight="bold" color="error.main" sx={{ mt: 1 }}>
                  {highCount}
                </Typography>
              </Box>
              <Avatar sx={{ width: 56, height: 56, bgcolor: theme.palette.error.light, color: "white" }}>
                <WarningIcon />
              </Avatar>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>NORMAL</Typography>
                <Typography variant="h3" fontWeight="bold" color="success.main" sx={{ mt: 1 }}>
                  {normalCount}
                </Typography>
              </Box>
              <Avatar sx={{ width: 56, height: 56, bgcolor: theme.palette.success.light, color: "white" }}>
                <MedicalServicesIcon />
              </Avatar>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* GRAPH */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography fontWeight={700} variant="h6" sx={{ mb: 3 }}>
            Priority Distribution
          </Typography>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: theme.palette.text.secondary }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: theme.palette.text.secondary }}
              />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="count" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* PATIENT CASES */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Recent Cases</Typography>
      <Grid container spacing={3}>
        {cases.map((c) => (
          <Grid item xs={12} md={6} key={c.id}>
            <Card
              sx={{
                borderLeft: c.priority === "HIGH"
                  ? `6px solid ${theme.palette.error.main}`
                  : `6px solid ${theme.palette.success.main}`,
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-4px)", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* HEADER */}
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar sx={{ width: 40, height: 40, bgcolor: theme.palette.grey[100], color: theme.palette.text.primary, mr: 2 }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography fontWeight={700} variant="body1">
                        {c.patient_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">ID: #{c.id}</Typography>
                    </Box>
                  </Box>

                  <Chip
                    label={c.priority}
                    color={getPriorityColor(c.priority)}
                    icon={c.priority === "HIGH" ? <WarningIcon /> : undefined}
                    size="small"
                    sx={{ fontWeight: "bold" }}
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* SYMPTOMS */}
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase" }}>
                  Symptoms
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1, mb: 2 }}>
                  {JSON.parse(c.symptoms).map((s, i) => (
                    <Chip key={i} label={s} size="small" variant="outlined" sx={{ borderColor: theme.palette.divider }} />
                  ))}
                </Box>

                {/* AI PREDICTIONS */}
                <Box sx={{ bgcolor: theme.palette.background.default, p: 2, borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase" }}>
                    Top AI Predictions
                  </Typography>

                  {JSON.parse(c.predictions).map((p, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 1,
                        alignItems: "center"
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <MedicalServicesIcon sx={{ fontSize: 16, mr: 1, color: theme.palette.primary.main }} />
                        <Typography variant="body2" fontWeight={500}>
                          {p.disease}
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight={700} color="primary.main">
                        {p.probability}%
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* RISK SCORE */}
                <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                  <Typography variant="caption" sx={{ mr: 1 }}>Risk Score</Typography>
                  <Typography variant="body2" fontWeight={800}>{c.risk_score}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {cases.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ p: 4, textAlign: "center", border: `1px dashed ${theme.palette.divider}`, borderRadius: 2 }}>
              <Typography sx={{ color: theme.palette.text.secondary, fontStyle: "italic" }}>
                No recent patient cases available.
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </DashboardLayout>
  );
}
