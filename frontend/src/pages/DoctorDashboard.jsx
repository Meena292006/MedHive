import { useState, useEffect } from "react";
import { api } from "../api/api";
import DashboardLayout from "../components/DashboardLayout";
import {
  Typography, Box, Grid, TextField, InputAdornment,
  ToggleButtonGroup, ToggleButton, Container, useTheme,
  CircularProgress, Alert, Card, CardContent, Paper,
  LinearProgress, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, IconButton, Avatar, Divider,
  List, ListItem, ListItemIcon, ListItemText
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CelebrationIcon from "@mui/icons-material/Celebration";
import SearchIcon from "@mui/icons-material/SearchRounded";
import PeopleIcon from "@mui/icons-material/People";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TodayIcon from "@mui/icons-material/Today";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AssessmentIcon from "@mui/icons-material/Assessment";
import TimelineIcon from "@mui/icons-material/Timeline";
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import StarIcon from "@mui/icons-material/Star";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import HealingIcon from "@mui/icons-material/Healing";
import BiotechIcon from "@mui/icons-material/Biotech";
import PsychologyIcon from "@mui/icons-material/Psychology";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area, RadialBarChart, RadialBar, ComposedChart } from 'recharts';
import PatientCard from "../components/doctor/PatientCard";
import PatientReportModal from "../components/doctor/PatientReportModal";
import { fadeUp } from "../animations/motionPresets";
import AnimatedBackground from "../components/AnimatedBackground";

export default function DoctorDashboard() {
  const [allCases, setAllCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedCase, setSelectedCase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalPatients: 0,
    highRiskCases: 0,
    normalCases: 0,
    todayCases: 0
  });
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    fetchPatients();
    // Show welcome popup on first load
    const hasSeenWelcome = localStorage.getItem('doctorWelcomeShown');
    if (!hasSeenWelcome) {
      setWelcomeOpen(true);
      localStorage.setItem('doctorWelcomeShown', 'true');
    }
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await api.get("/doctor/all-patients");
      setAllCases(res.data);

      // Calculate stats
      const total = res.data.length;
      const highRisk = res.data.filter(c => c.priority?.toLowerCase() === 'high').length;
      const normal = total - highRisk;
      const today = res.data.filter(c => {
        const caseDate = new Date(c.created_at);
        const today = new Date();
        return caseDate.toDateString() === today.toDateString();
      }).length;

      setStats({
        totalPatients: total,
        highRiskCases: highRisk,
        normalCases: normal,
        todayCases: today
      });

      setError(null);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError("Failed to load patient records. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (patientCase) => {
    setSelectedCase(patientCase);
    setIsModalOpen(true);
  };

  const filteredCases = allCases.filter(c => {
    const matchesSearch = c.patient_name.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toString().includes(search);
    const matchesFilter = filter === 'all' || c.priority.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  // Sample data for charts (in real app, this would come from API)
  const weeklyData = [
    { name: 'Mon', cases: 12, highRisk: 3 },
    { name: 'Tue', cases: 19, highRisk: 5 },
    { name: 'Wed', cases: 15, highRisk: 2 },
    { name: 'Thu', cases: 22, highRisk: 7 },
    { name: 'Fri', cases: 18, highRisk: 4 },
    { name: 'Sat', cases: 8, highRisk: 1 },
    { name: 'Sun', cases: 6, highRisk: 2 }
  ];

  const pieData = [
    { name: 'Normal', value: stats.normalCases, color: theme.palette.success.main },
    { name: 'High Risk', value: stats.highRiskCases, color: theme.palette.error.main }
  ];

  const conditionData = [
    { name: 'Heart Disease', cases: 45, percentage: 35 },
    { name: 'Diabetes', cases: 32, percentage: 25 },
    { name: 'Liver Disease', cases: 28, percentage: 22 },
    { name: 'Other', cases: 22, percentage: 18 }
  ];

  return (
    <DashboardLayout>
      <AnimatedBackground />

      <Container
        maxWidth="xl"
        sx={{
          position: "relative",
          zIndex: 1,
          py: 6,
        }}
      >
        <motion.div {...fadeUp}>
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography variant="h3" fontWeight={800} sx={{
              color: '#FFFFFF',
              mb: 2,
              textShadow: `0 0 30px ${theme.palette.secondary.main}66`,
              letterSpacing: '-0.02em'
            }}>
              MedHive Analytics Dashboard
            </Typography>
            <Typography variant="h6" sx={{
              color: '#FFFFFF',
              opacity: 0.9,
              mb: 4,
              fontWeight: 400,
              lineHeight: 1.6
            }}>
              Enterprise-grade healthcare intelligence and real-time patient monitoring
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Chip
                label="🤖 AI-Powered Analytics"
                size="small"
                sx={{
                  bgcolor: `${theme.palette.secondary.main}20`,
                  color: theme.palette.secondary.main,
                  border: `1px solid ${theme.palette.secondary.main}50`,
                  fontWeight: 600,
                  backdropFilter: 'blur(12px)',
                  boxShadow: `0 0 15px ${theme.palette.secondary.main}30`,
                  fontSize: '0.8rem',
                  px: 2
                }}
              />
              <Chip
                label="📈 Real-time Monitoring"
                size="small"
                sx={{
                  bgcolor: `${theme.palette.primary.main}20`,
                  color: theme.palette.primary.main,
                  border: `1px solid ${theme.palette.primary.main}50`,
                  fontWeight: 600,
                  backdropFilter: 'blur(12px)',
                  boxShadow: `0 0 15px ${theme.palette.primary.main}30`,
                  fontSize: '0.8rem',
                  px: 2
                }}
              />
              <Chip
                label="⚡ Enterprise Performance"
                size="small"
                sx={{
                  bgcolor: 'rgba(6, 182, 212, 0.12)',
                  color: '#06B6D4',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  fontWeight: 600,
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 0 15px rgba(6, 182, 212, 0.2)',
                  fontSize: '0.8rem',
                  px: 2
                }}
              />
            </Box>
          </Box>

          {/* Top KPI Cards */}
          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div {...fadeUp}>
                <Card sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: 4,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  }
                }}>
                  <PeopleIcon sx={{ fontSize: 56, color: theme.palette.secondary.main, mb: 3 }} />
                  <Typography variant="h2" fontWeight={800} sx={{ color: '#FFFFFF', mb: 2, fontSize: '3rem' }}>
                    {stats.totalPatients}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#94A3B8', mb: 3, fontWeight: 500 }}>
                    Total Patients Today
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <TrendingUpIcon sx={{ color: theme.palette.secondary.main, fontSize: 18 }} />
                    <Typography variant="body2" sx={{ color: theme.palette.secondary.main, fontWeight: 600 }}>
                      +12% from yesterday
                    </Typography>
                  </Box>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <motion.div {...fadeUp}>
                <Card sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: 4,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  }
                }}>
                  <WarningIcon sx={{ fontSize: 56, color: '#EF4444', mb: 3 }} />
                  <Typography variant="h2" fontWeight={800} sx={{ color: '#FFFFFF', mb: 2, fontSize: '3rem' }}>
                    {stats.highRiskCases}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#94A3B8', mb: 3, fontWeight: 500 }}>
                    Critical Alerts
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <TrendingDownIcon sx={{ color: '#EF4444', fontSize: 18 }} />
                    <Typography variant="body2" sx={{ color: '#EF4444', fontWeight: 600 }}>
                      -5% from yesterday
                    </Typography>
                  </Box>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <motion.div {...fadeUp}>
                <Card sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: 4,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  }
                }}>
                  <TodayIcon sx={{ fontSize: 56, color: theme.palette.primary.main, mb: 3 }} />
                  <Typography variant="h2" fontWeight={800} sx={{ color: '#E2E8F0', mb: 2, fontSize: '3rem' }}>
                    24
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#94A3B8', mb: 3, fontWeight: 500 }}>
                    Appointments Scheduled
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <TrendingUpIcon sx={{ color: '#06B6D4', fontSize: 18 }} />
                    <Typography variant="body2" sx={{ color: '#06B6D4', fontWeight: 600 }}>
                      +8% from yesterday
                    </Typography>
                  </Box>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <motion.div {...fadeUp}>
                <Card sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: 4,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  }
                }}>
                  <AssessmentIcon sx={{ fontSize: 56, color: theme.palette.primary.main, mb: 3 }} />
                  <Typography variant="h2" fontWeight={800} sx={{ color: '#E2E8F0', mb: 2, fontSize: '3rem' }}>
                    94%
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#94A3B8', mb: 3, fontWeight: 500 }}>
                    Average Recovery Rate
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <TrendingUpIcon sx={{ color: '#06B6D4', fontSize: 18 }} />
                    <Typography variant="body2" sx={{ color: '#06B6D4', fontWeight: 600 }}>
                      +2% from last month
                    </Typography>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
          {/* Patient Alert Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card sx={{
              p: 4,
              mb: 6,
              borderRadius: 4
            }}>
              <Typography variant="h5" fontWeight={700} sx={{ color: theme.palette.secondary.main, mb: 4, textAlign: 'center' }}>
                Real-time Patient Monitoring
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {[
                  { id: 'PT-001', symptom: 'Severe chest pain', severity: 'critical', time: '2 min ago', vitals: 'HR: 120 bpm' },
                  { id: 'PT-045', symptom: 'High fever (102°F)', severity: 'moderate', time: '15 min ago', vitals: 'Temp: 102°F' },
                  { id: 'PT-023', symptom: 'Irregular heartbeat', severity: 'critical', time: '8 min ago', vitals: 'BP: 160/95' },
                  { id: 'PT-067', symptom: 'Persistent cough', severity: 'moderate', time: '32 min ago', vitals: 'O2: 95%' },
                  { id: 'PT-089', symptom: 'Stable vitals', severity: 'stable', time: '1 hour ago', vitals: 'All normal' }
                ].map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                  >
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 3,
                      borderRadius: 3,
                      background: alert.severity === 'critical' ? 'rgba(239, 68, 68, 0.08)' :
                        alert.severity === 'moderate' ? 'rgba(59, 130, 246, 0.08)' :
                          'rgba(6, 182, 212, 0.08)',
                      border: `1px solid ${alert.severity === 'critical' ? 'rgba(239, 68, 68, 0.3)' :
                        alert.severity === 'moderate' ? 'rgba(59, 130, 246, 0.3)' :
                          'rgba(6, 182, 212, 0.3)'}`,
                      boxShadow: alert.severity === 'critical' ? '0 4px 12px rgba(239, 68, 68, 0.15)' :
                        alert.severity === 'moderate' ? '0 4px 12px rgba(59, 130, 246, 0.15)' :
                          '0 4px 12px rgba(6, 182, 212, 0.15)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateX(4px)',
                        boxShadow: alert.severity === 'critical' ? '0 8px 20px rgba(239, 68, 68, 0.25)' :
                          alert.severity === 'moderate' ? '0 8px 20px rgba(59, 130, 246, 0.25)' :
                            '0 8px 20px rgba(6, 182, 212, 0.25)',
                      }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          backgroundColor: alert.severity === 'critical' ? '#EF4444' :
                            alert.severity === 'moderate' ? '#3B82F6' : '#06B6D4',
                          boxShadow: alert.severity === 'critical' ? '0 0 12px rgba(239, 68, 68, 0.6)' :
                            alert.severity === 'moderate' ? '0 0 12px rgba(59, 130, 246, 0.6)' :
                              '0 0 12px rgba(6, 182, 212, 0.6)',
                          animation: alert.severity === 'critical' ? 'pulse 2s infinite' : 'none'
                        }} />
                        <Box>
                          <Typography variant="h6" fontWeight={700} sx={{ color: '#E2E8F0', mb: 0.5 }}>
                            Patient {alert.id}
                          </Typography>
                          <Typography variant="body1" sx={{ color: '#94A3B8', mb: 0.5 }}>
                            {alert.symptom}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.8rem' }}>
                            {alert.vitals}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                        <Chip
                          label={alert.severity.toUpperCase()}
                          size="small"
                          sx={{
                            bgcolor: alert.severity === 'critical' ? 'rgba(239, 68, 68, 0.15)' :
                              alert.severity === 'moderate' ? 'rgba(59, 130, 246, 0.15)' :
                                'rgba(6, 182, 212, 0.15)',
                            color: alert.severity === 'critical' ? '#EF4444' :
                              alert.severity === 'moderate' ? '#3B82F6' : '#06B6D4',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            border: `1px solid ${alert.severity === 'critical' ? 'rgba(239, 68, 68, 0.4)' :
                              alert.severity === 'moderate' ? 'rgba(59, 130, 246, 0.4)' :
                                'rgba(6, 182, 212, 0.4)'}`,
                            px: 2
                          }}
                        />
                        <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem' }}>
                          {alert.time}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </Card>
          </motion.div>

          {/* Advanced Analytics Section */}
          <Grid container spacing={4} sx={{ mb: 6 }}>
            {/* Patient Trends Chart */}
            <Grid item xs={12} lg={8}>
              <motion.div {...fadeUp}>
                <Card sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 4,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <TimelineIcon sx={{ color: theme.palette.secondary.main, mr: 3, fontSize: 32 }} />
                    <Box>
                      <Typography variant="h5" fontWeight={700} sx={{ color: '#E2E8F0', mb: 0.5 }}>
                        Patient Intake Trends
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748B' }}>
                        Weekly patient volume and risk assessment patterns
                      </Typography>
                    </Box>
                  </Box>
                  <ResponsiveContainer width="100%" height={380}>
                    <AreaChart data={weeklyData}>
                      <defs>
                        <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#00D4FF" stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 212, 255, 0.1)" />
                      <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                      <YAxis stroke="#64748B" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(15, 23, 42, 0.95)',
                          border: '1px solid rgba(0, 212, 255, 0.3)',
                          borderRadius: 8,
                          color: '#E2E8F0',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="cases"
                        stroke={theme.palette.secondary.main}
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorCases)"
                      />
                      <Area
                        type="monotone"
                        dataKey="highRisk"
                        stroke={theme.palette.primary.main}
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRisk)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 6, mt: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: theme.palette.secondary.main, boxShadow: `0 0 10px ${theme.palette.secondary.main}80` }} />
                      <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 500 }}>Total Cases</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: theme.palette.primary.main, boxShadow: `0 0 10px ${theme.palette.primary.main}80` }} />
                      <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 500 }}>High Risk</Typography>
                    </Box>
                  </Box>
                </Card>
              </motion.div>
            </Grid>

            {/* Condition Distribution */}
            <Grid item xs={12} lg={4}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                <Card sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 4,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <BarChartIcon sx={{ color: theme.palette.primary.main, mr: 3, fontSize: 32 }} />
                    <Box>
                      <Typography variant="h5" fontWeight={700} sx={{ color: '#E2E8F0', mb: 0.5 }}>
                        Condition Analysis
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748B' }}>
                        Most common diagnoses this month
                      </Typography>
                    </Box>
                  </Box>
                  <ResponsiveContainer width="100%" height={380}>
                    <PieChart>
                      <Pie
                        data={conditionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="cases"
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                      >
                        {conditionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#06B6D4', '#00D4FF', '#3B82F6', '#EF4444'][index % 4]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(15, 23, 42, 0.95)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: 8,
                          color: '#E2E8F0',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <Box sx={{ mt: 3, p: 2, borderRadius: 2, bgcolor: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                    <Typography variant="body2" sx={{ color: '#06B6D4', fontWeight: 600, textAlign: 'center' }}>
                      {conditionData.reduce((sum, item) => sum + item.cases, 0)} total cases analyzed
                    </Typography>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          </Grid>

          {/* Performance Analytics */}
          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid item xs={12} md={6}>
              <motion.div {...fadeUp}>
                <Card sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 4,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <ThumbUpIcon sx={{ color: '#06B6D4', mr: 3, fontSize: 32 }} />
                    <Box>
                      <Typography variant="h5" fontWeight={700} sx={{ color: '#E2E8F0', mb: 0.5 }}>
                        Patient Satisfaction
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748B' }}>
                        Quality metrics and patient feedback analysis
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h1" fontWeight={800} sx={{ color: theme.palette.secondary.main, mb: 2, fontSize: '4rem' }}>
                      4.8/5
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, gap: 1 }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon key={star} sx={{ color: theme.palette.secondary.main, fontSize: 28 }} />
                      ))}
                    </Box>
                    <Typography variant="body1" sx={{ color: '#94A3B8', fontWeight: 500 }}>
                      Based on 1,247 patient reviews
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', gap: 2 }}>
                    <Box sx={{ flex: 1, p: 2, borderRadius: 2, bgcolor: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                      <Typography variant="h4" sx={{ color: '#06B6D4', fontWeight: 700 }}>98%</Typography>
                      <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.8rem' }}>Satisfied</Typography>
                    </Box>
                    <Box sx={{ flex: 1, p: 2, borderRadius: 2, bgcolor: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                      <Typography variant="h4" sx={{ color: '#3B82F6', fontWeight: 700 }}>2%</Typography>
                      <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.8rem' }}>Neutral</Typography>
                    </Box>
                  </Box>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
              >
                <Card sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 4,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <PeopleIcon sx={{ color: '#3B82F6', mr: 3, fontSize: 32 }} />
                    <Box>
                      <Typography variant="h5" fontWeight={700} sx={{ color: '#E2E8F0', mb: 0.5 }}>
                        Referral Network
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748B' }}>
                        Physician collaboration and patient referrals
                      </Typography>
                    </Box>
                  </Box>
                  <List sx={{ p: 0 }}>
                    <ListItem sx={{ px: 0, py: 2, borderRadius: 2, mb: 1, bgcolor: 'rgba(0, 212, 255, 0.04)', border: '1px solid rgba(0, 212, 255, 0.15)' }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: `${theme.palette.secondary.main}30`, color: theme.palette.secondary.main, fontWeight: 700 }}>
                          JD
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography sx={{ color: '#E2E8F0', fontWeight: 600 }}>Dr. John Doe</Typography>}
                        secondary={<Typography sx={{ color: '#94A3B8' }}>Referred 3 patients • +$2,400 revenue</Typography>}
                      />
                      <Chip label="Active" size="small" sx={{ bgcolor: `${theme.palette.secondary.main}20`, color: theme.palette.secondary.main, fontWeight: 600, border: `1px solid ${theme.palette.secondary.main}50` }} />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 2, borderRadius: 2, mb: 1, bgcolor: 'rgba(59, 130, 246, 0.04)', border: '1px solid rgba(59, 130, 246, 0.15)' }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: 'rgba(59, 130, 246, 0.2)', color: '#3B82F6', fontWeight: 700 }}>
                          SM
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography sx={{ color: '#E2E8F0', fontWeight: 600 }}>Dr. Sarah Miller</Typography>}
                        secondary={<Typography sx={{ color: '#94A3B8' }}>Referred 2 patients • +$1,600 revenue</Typography>}
                      />
                      <Chip label="Active" size="small" sx={{ bgcolor: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', fontWeight: 600, border: '1px solid rgba(59, 130, 246, 0.3)' }} />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 2, borderRadius: 2, bgcolor: 'rgba(6, 182, 212, 0.04)', border: '1px solid rgba(6, 182, 212, 0.15)' }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: 'rgba(6, 182, 212, 0.2)', color: '#06B6D4', fontWeight: 700 }}>
                          RB
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography sx={{ color: '#E2E8F0', fontWeight: 600 }}>Dr. Robert Brown</Typography>}
                        secondary={<Typography sx={{ color: '#94A3B8' }}>Referred 1 patient • +$800 revenue</Typography>}
                      />
                      <Chip label="Pending" size="small" sx={{ bgcolor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', fontWeight: 600, border: '1px solid rgba(245, 158, 11, 0.3)' }} />
                    </ListItem>
                  </List>
                  <Box sx={{ mt: 3, p: 2, borderRadius: 2, bgcolor: `${theme.palette.secondary.main}10`, border: `1px solid ${theme.palette.secondary.main}30` }}>
                    <Typography variant="body2" sx={{ color: theme.palette.secondary.main, fontWeight: 600, textAlign: 'center' }}>
                      6 total referrals this month • $4,800 additional revenue
                    </Typography>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>

        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Box
            sx={{
              "& .MuiOutlinedInput-root.Mui-focused": {
                borderColor: theme.palette.secondary.main,
                boxShadow: `0 0 0 3px ${theme.palette.secondary.main}40`,
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: theme.palette.secondary.main,
              },
            }}
          >
            <TextField
              placeholder="Search patients name or ID..."
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: 350 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                sx: { borderRadius: 3, bgcolor: 'background.paper' }
              }}
            />
          </Box>
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={(e, v) => v && setFilter(v)}
            size="small"
            color="primary"
          >
            <ToggleButton value="all" sx={{ px: 3 }}>All Cases</ToggleButton>
            <ToggleButton value="high" sx={{ px: 3 }}>High Risk</ToggleButton>
            <ToggleButton value="normal" sx={{ px: 3 }}>Normal</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10 }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="body1" sx={{ color: '#94A3B8', mb: 2 }}>
              Loading patient data...
            </Typography>
            <LinearProgress sx={{ width: '200px', borderRadius: 2 }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>
        ) : (
          <>
            <Grid container spacing={3}>
              {filteredCases.map((c) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={c.id}>
                  <PatientCard patientCase={c} onViewReport={handleViewReport} />
                </Grid>
              ))}
            </Grid>
            {filteredCases.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 10 }}>
                <Typography variant="h6" color="text.secondary">No patient records found.</Typography>
              </Box>
            )}
          </>
        )}

        <PatientReportModal
          open={isModalOpen}
          handleClose={() => setIsModalOpen(false)}
          patientCase={selectedCase}
        />

        {/* Welcome Popup */}
        <Dialog
          open={welcomeOpen}
          onClose={() => setWelcomeOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }
          }}
        >
          <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CelebrationIcon sx={{ fontSize: 60, color: '#fbbf24', mb: 2 }} />
            </motion.div>
            <Typography variant="h4" fontWeight={800} sx={{ color: 'white' }}>
              Welcome to MedHive!
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ textAlign: 'center', pb: 3 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: 'rgba(255,255,255,0.9)' }}>
                Your Advanced Clinical Dashboard is Ready
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                Access comprehensive patient analytics, real-time monitoring, and AI-powered insights
                to provide exceptional healthcare services.
              </Typography>
            </motion.div>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                onClick={() => setWelcomeOpen(false)}
                variant="contained"
                size="large"
                sx={{
                  background: 'white',
                  color: '#667eea',
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  '&:hover': {
                    background: '#f8fafc',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Get Started
              </Button>
            </motion.div>
          </DialogActions>
        </Dialog>
      </Container>
    </DashboardLayout>
  );
}
