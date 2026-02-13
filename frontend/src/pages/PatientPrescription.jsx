import { useEffect, useState } from "react";
import { api } from "../api/api";
import DashboardLayout from "../components/DashboardLayout";
import AnimatedCard from "../components/AnimatedCard";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box, Typography, Card, CardContent, Chip, Avatar, Divider, Grid, useTheme, IconButton, Tooltip
} from "@mui/material";
import MedicationIcon from "@mui/icons-material/MedicationRounded";
import CalendarTodayIcon from "@mui/icons-material/CalendarTodayRounded";
import AccessTimeIcon from "@mui/icons-material/AccessTimeRounded";
import PersonIcon from "@mui/icons-material/PersonRounded";
import LocalHospitalIcon from "@mui/icons-material/LocalHospitalRounded";
import DescriptionIcon from "@mui/icons-material/DescriptionRounded";
import DownloadIcon from "@mui/icons-material/DownloadRounded";
import PrintIcon from "@mui/icons-material/PrintRounded";
import VerifiedIcon from "@mui/icons-material/VerifiedRounded";

export default function PatientPrescriptions() {
  const theme = useTheme();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/prescriptions/my")
      .then(res => {
        setPrescriptions(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handlePrint = (prescription) => {
    window.print();
  };

  const handleDownload = (prescription) => {
    // Implement download functionality
    alert("Download feature coming soon!");
  };

  return (
    <DashboardLayout>
      {/* Animated Background */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        background: theme.gradients.main,
      }}>
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', top: '15%', right: '8%', opacity: 0.08 }}
        >
          <MedicationIcon sx={{ fontSize: 140, color: theme.palette.primary.main }} />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.12, 0.08] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', bottom: '25%', left: '10%' }}
        >
          <LocalHospitalIcon sx={{ fontSize: 120, color: theme.palette.secondary.main }} />
        </motion.div>
      </Box>

      <Box sx={{ position: 'relative', zIndex: 1, minHeight: '100vh', p: 4 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Avatar sx={{
                bgcolor: theme.palette.primary.main,
                width: 64,
                height: 64,
                boxShadow: `0 10px 30px ${theme.palette.primary.main}40`
              }}>
                <MedicationIcon sx={{ fontSize: 32 }} />
              </Avatar>
            </motion.div>
            <Box>
              <Typography variant="h3" fontWeight={900} sx={{
                background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: -1
              }}>
                My Prescriptions
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5, color: theme.palette.text.secondary, fontWeight: 600 }}>
                View and manage your medical prescriptions
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { label: "Total Prescriptions", value: prescriptions.length, icon: DescriptionIcon, color: theme.palette.primary.main },
            { label: "This Month", value: prescriptions.filter(p => new Date(p.created_at).getMonth() === new Date().getMonth()).length, icon: CalendarTodayIcon, color: theme.palette.secondary.main },
            { label: "Active", value: prescriptions.length, icon: VerifiedIcon, color: theme.palette.success.main }
          ].map((stat, idx) => (
            <Grid item xs={12} sm={4} key={idx}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card sx={{
                  background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
                  border: `1px solid ${stat.color}30`,
                  borderRadius: 4,
                  boxShadow: 'none'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                          {stat.label}
                        </Typography>
                        <Typography variant="h3" fontWeight={900} sx={{ mt: 1, color: stat.color }}>
                          {stat.value}
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: stat.color, width: 56, height: 56 }}>
                        <stat.icon sx={{ fontSize: 28 }} />
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Prescriptions List */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>
                Loading prescriptions...
              </Typography>
            </motion.div>
          ) : prescriptions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card sx={{
                borderRadius: 5,
                border: `2px dashed ${theme.palette.divider}`,
                bgcolor: 'transparent',
                boxShadow: 'none'
              }}>
                <CardContent sx={{ py: 10, textAlign: 'center' }}>
                  <MedicationIcon sx={{ fontSize: 80, color: theme.palette.text.disabled, opacity: 0.3, mb: 2 }} />
                  <Typography variant="h5" fontWeight={700} gutterBottom>
                    No Prescriptions Yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your prescriptions will appear here once your doctor creates them
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
              {prescriptions.map((prescription, idx) => (
                <motion.div
                  key={prescription.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card sx={{
                    mb: 3,
                    borderRadius: 5,
                    overflow: 'hidden',
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: `0 8px 30px ${theme.palette.primary.main}20`,
                      transform: 'translateY(-2px)'
                    }
                  }}>
                    {/* Prescription Header */}
                    <Box sx={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}10 100%)`,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      p: 3
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{
                            bgcolor: theme.palette.primary.main,
                            width: 48,
                            height: 48,
                            boxShadow: `0 4px 12px ${theme.palette.primary.main}40`
                          }}>
                            <MedicationIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight={800}>
                              Prescription #{prescription.id}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <Chip
                                icon={<VerifiedIcon sx={{ fontSize: 14 }} />}
                                label="Verified"
                                size="small"
                                sx={{
                                  bgcolor: theme.palette.success.main,
                                  color: 'white',
                                  fontWeight: 700,
                                  fontSize: '0.7rem',
                                  height: 22
                                }}
                              />
                              <Chip
                                label="Active"
                                size="small"
                                sx={{
                                  bgcolor: theme.palette.primary.main,
                                  color: 'white',
                                  fontWeight: 700,
                                  fontSize: '0.7rem',
                                  height: 22
                                }}
                              />
                            </Box>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Print Prescription">
                            <IconButton
                              onClick={() => handlePrint(prescription)}
                              sx={{
                                bgcolor: theme.palette.background.paper,
                                '&:hover': { bgcolor: theme.palette.primary.main, color: 'white' }
                              }}
                            >
                              <PrintIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download PDF">
                            <IconButton
                              onClick={() => handleDownload(prescription)}
                              sx={{
                                bgcolor: theme.palette.background.paper,
                                '&:hover': { bgcolor: theme.palette.secondary.main, color: 'white' }
                              }}
                            >
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarTodayIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                            <Typography variant="caption" fontWeight={600} color="text.secondary">
                              Date:
                            </Typography>
                            <Typography variant="caption" fontWeight={700}>
                              {new Date(prescription.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTimeIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                            <Typography variant="caption" fontWeight={600} color="text.secondary">
                              Time:
                            </Typography>
                            <Typography variant="caption" fontWeight={700}>
                              {new Date(prescription.created_at).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Prescription Content */}
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{
                        p: 3,
                        borderRadius: 3,
                        bgcolor: theme.palette.action.hover,
                        border: `1px solid ${theme.palette.divider}`
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'start', gap: 2, mb: 2 }}>
                          <DescriptionIcon sx={{ color: theme.palette.primary.main, mt: 0.5 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 1 }}>
                              Prescription Details
                            </Typography>
                            <Typography variant="body1" sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                              {prescription.message}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 3 }} />

                      {/* Footer Info */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PersonIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
                          <Typography variant="caption" fontWeight={600} color="text.secondary">
                            Prescribed by:
                          </Typography>
                          <Typography variant="caption" fontWeight={700}>
                            Dr. {prescription.doctor_name || "Medical Professional"}
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ fontStyle: 'italic', color: theme.palette.text.disabled }}>
                          ⚠️ Follow your doctor's instructions carefully
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
          )}
        </AnimatePresence>
      </Box>
    </DashboardLayout>
  );
}
