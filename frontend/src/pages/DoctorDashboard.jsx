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
  Avatar,
  Stack
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
      const latest = res.data
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 10);
      setCases(latest);
    });
  }, []);

  const highCount = cases.filter(c => c.priority === "HIGH").length;
  const normalCount = cases.filter(c => c.priority === "NORMAL").length;

  const chartData = [
    { name: "High Risk", count: highCount },
    { name: "Normal", count: normalCount }
  ];

  const getPriorityColor = (p) => (p === "HIGH" ? "error" : "success");

  return (
    <DashboardLayout>
      {/* HEADER */}
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="caption"
          sx={{
            letterSpacing: 2,
            fontWeight: 700,
            color: theme.palette.primary.main
          }}
        >
          Doctor Panel
        </Typography>

        <Typography variant="h4" fontWeight={900}>
          Clinical Dashboard
        </Typography>

        <Typography color="text.secondary">
          Real-time AI assisted patient overview
        </Typography>
      </Box>

      {/* STATS */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {[
          {
            label: "Total Cases",
            value: cases.length,
            icon: <AnalyticsIcon />,
            color: theme.palette.primary.main
          },
          {
            label: "High Risk",
            value: highCount,
            icon: <WarningIcon />,
            color: theme.palette.error.main
          },
          {
            label: "Normal",
            value: normalCount,
            icon: <MedicalServicesIcon />,
            color: theme.palette.success.main
          }
        ].map((s, i) => (
          <Grid item xs={12} md={4} key={i}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 4,
                background: `linear-gradient(145deg, ${s.color}22, transparent)`,
                border: `1px solid ${theme.palette.divider}`,
                transition: "all .25s",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 18px 40px rgba(0,0,0,0.08)"
                }
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    color="text.secondary"
                  >
                    {s.label}
                  </Typography>
                  <Typography variant="h3" fontWeight={900}>
                    {s.value}
                  </Typography>
                </Box>

                <Avatar
                  sx={{
                    bgcolor: s.color,
                    width: 56,
                    height: 56,
                    boxShadow: `0 10px 25px ${s.color}55`
                  }}
                >
                  {s.icon}
                </Avatar>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* CHART */}
      <Card
        sx={{
          mb: 5,
          borderRadius: 4,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: "0 12px 30px rgba(0,0,0,0.06)"
        }}
      >
        <CardContent>
          <Typography fontWeight={800} mb={3}>
            Case Priority Distribution
          </Typography>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "none",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
                }}
              />
              <Bar
                dataKey="count"
                radius={[12, 12, 0, 0]}
                fill={theme.palette.primary.main}
                barSize={56}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* CASES */}
      <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>
        Recent Patient Cases
      </Typography>

      <Grid container spacing={3}>
        {cases.map(c => (
          <Grid item xs={12} md={6} key={c.id}>
            <Card
              sx={{
                borderRadius: 4,
                borderLeft: `6px solid ${
                  c.priority === "HIGH"
                    ? theme.palette.error.main
                    : theme.palette.success.main
                }`,
                border: `1px solid ${theme.palette.divider}`,
                transition: "all .25s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 18px 45px rgba(0,0,0,0.1)"
                }
              }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" mb={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.background.default,
                        color: theme.palette.primary.main,
                        boxShadow: "0 8px 20px rgba(0,0,0,0.12)"
                      }}
                    >
                      <PersonIcon />
                    </Avatar>

                    <Box>
                      <Typography fontWeight={700}>
                        {c.patient_name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Case #{c.id}
                      </Typography>
                    </Box>
                  </Stack>

                  <Chip
                    label={c.priority}
                    color={getPriorityColor(c.priority)}
                    sx={{ fontWeight: 800 }}
                  />
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="text.secondary"
                >
                  Symptoms
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                  {JSON.parse(c.symptoms).map((s, i) => (
                    <Chip
                      key={i}
                      label={s}
                      size="small"
                      sx={{
                        bgcolor: theme.palette.background.paper,
                        fontWeight: 500
                      }}
                    />
                  ))}
                </Box>

                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    borderRadius: 3,
                    bgcolor: theme.palette.background.default,
                    border: `1px dashed ${theme.palette.divider}`
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    color="text.secondary"
                  >
                    AI Predictions
                  </Typography>

                  {JSON.parse(c.predictions).map((p, i) => (
                    <Stack
                      key={i}
                      direction="row"
                      justifyContent="space-between"
                      mt={1}
                    >
                      <Typography fontWeight={600}>
                        {p.disease}
                      </Typography>
                      <Typography
                        fontWeight={800}
                        color="primary.main"
                      >
                        {p.probability}%
                      </Typography>
                    </Stack>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </DashboardLayout>
  );
}
