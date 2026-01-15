import { useEffect, useState } from "react";
import { api } from "../api/api";
import DashboardLayout from "../components/DashboardLayout";
import { StatCard, TrendChart, PieChartCard } from "../components/AnalyticsCard";
import AnimatedCard from "../components/AnimatedCard";
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
import { motion } from "framer-motion";
import WarningIcon from "@mui/icons-material/WarningRounded";
import PersonIcon from "@mui/icons-material/PersonRounded";
import MedicalServicesIcon from "@mui/icons-material/MedicalServicesRounded";
import AnalyticsIcon from "@mui/icons-material/AnalyticsRounded";
import TrendingUpIcon from "@mui/icons-material/TrendingUpRounded";
import AssessmentIcon from "@mui/icons-material/AssessmentRounded";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
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
  const totalCases = cases.length;

  const chartData = [
    { name: "High Risk", count: highCount, fill: theme.palette.error.main },
    { name: "Normal", count: normalCount, fill: theme.palette.success.main }
  ];

  const pieData = [
    { name: "High Risk", value: highCount },
    { name: "Normal", value: normalCount }
  ];

  // Generate trend data (last 7 days simulation)
  const trendData = Array.from({ length: 7 }, (_, i) => ({
    name: `Day ${i + 1}`,
    value: Math.floor(Math.random() * 20) + 5
  }));

  const diseaseFrequency = {};
  cases.forEach(c => {
    try {
      const predictions = JSON.parse(c.predictions);
      predictions.forEach(p => {
        diseaseFrequency[p.disease] = (diseaseFrequency[p.disease] || 0) + 1;
      });
    } catch (e) {}
  });

  const topDiseases = Object.entries(diseaseFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, value: count }));

  const getPriorityColor = (p) => (p === "HIGH" ? "error" : "success");

  return (
    <DashboardLayout>
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="caption"
            sx={{
              letterSpacing: 2,
              fontWeight: 700,
              color: theme.palette.primary.main,
              textTransform: "uppercase"
            }}
          >
            Doctor Panel
          </Typography>

          <Typography variant="h4" fontWeight={900} sx={{ mt: 0.5 }}>
            Clinical Dashboard
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Real-time AI assisted patient overview & analytics
          </Typography>
        </Box>
      </motion.div>

      {/* STATS */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Total Cases"
            value={totalCases}
            icon={<AnalyticsIcon />}
            color={theme.palette.primary.main}
            delay={0.1}
            trend="up"
            trendValue="+12%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="High Risk"
            value={highCount}
            icon={<WarningIcon />}
            color={theme.palette.error.main}
            delay={0.2}
            trend="up"
            trendValue={`${totalCases > 0 ? ((highCount / totalCases) * 100).toFixed(1) : 0}%`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Normal Cases"
            value={normalCount}
            icon={<MedicalServicesIcon />}
            color={theme.palette.success.main}
            delay={0.3}
            trend="down"
            trendValue={`${totalCases > 0 ? ((normalCount / totalCases) * 100).toFixed(1) : 0}%`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Avg. Response"
            value="2.4h"
            icon={<TrendingUpIcon />}
            color={theme.palette.info.main}
            delay={0.4}
            trend="down"
            trendValue="-15%"
          />
        </Grid>
      </Grid>

      {/* CHARTS ROW */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} md={6}>
          <AnimatedCard delay={0.5}>
            <CardContent sx={{ p: 3 }}>
              <Typography fontWeight={800} mb={3} variant="h6">
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
                      boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
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
          </AnimatedCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <PieChartCard
            data={pieData}
            colors={[theme.palette.error.main, theme.palette.success.main]}
            delay={0.6}
          />
        </Grid>
      </Grid>

      {/* TREND CHART */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12}>
          <AnimatedCard delay={0.7}>
            <CardContent sx={{ p: 3 }}>
              <Typography fontWeight={800} mb={3} variant="h6">
                Cases Trend (Last 7 Days)
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "none",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={theme.palette.primary.main}
                    fill="url(#trendGradient)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </AnimatedCard>
        </Grid>
      </Grid>

      {/* TOP DISEASES */}
      {topDiseases.length > 0 && (
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12}>
            <AnimatedCard delay={0.8}>
              <CardContent sx={{ p: 3 }}>
                <Typography fontWeight={800} mb={3} variant="h6">
                  Most Common Conditions
                </Typography>
                <Grid container spacing={2}>
                  {topDiseases.map((disease, idx) => (
                    <Grid item xs={12} sm={6} md={4} key={disease.name}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + idx * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.primary.main}05)`,
                            border: `1px solid ${theme.palette.primary.main}30`,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography fontWeight={600}>{disease.name}</Typography>
                          <Chip
                            label={disease.value}
                            color="primary"
                            sx={{ fontWeight: 700 }}
                          />
                        </Box>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </AnimatedCard>
          </Grid>
        </Grid>
      )}

      {/* CASES */}
      <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>
        Recent Patient Cases
      </Typography>

      <Grid container spacing={3}>
        {cases.map((c, idx) => (
          <Grid item xs={12} md={6} key={c.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <AnimatedCard
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
                    boxShadow: "0 18px 45px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" mb={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.background.default,
                          color: theme.palette.primary.main,
                          boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
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
                          bgcolor: theme.palette.background.default,
                          fontWeight: 500,
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
              </AnimatedCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </DashboardLayout>
  );
}
