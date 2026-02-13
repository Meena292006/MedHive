import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Box, Typography, Grid, Card, CardContent, Avatar,
    LinearProgress, IconButton, useTheme, Stack, Divider, Paper, Chip,
    Tabs, Tab, Tooltip, Switch, Slider, Button
} from '@mui/material';
import DashboardLayout from '../components/DashboardLayout';
import { api } from "../api/api";
import ActivityIcon from '@mui/icons-material/LocalActivityRounded';
import HeartIcon from '@mui/icons-material/MonitorHeartRounded';
import DeviceIcon from '@mui/icons-material/WatchRounded';
import ReportIcon from '@mui/icons-material/DescriptionRounded';
import PsychologyIcon from '@mui/icons-material/PsychologyRounded';
import WarningIcon from '@mui/icons-material/ReportProblemRounded';
import SimulationIcon from '@mui/icons-material/ScienceRounded';
import SyncIcon from '@mui/icons-material/SyncRounded';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardRounded';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenterRounded';
import WaterDropIcon from '@mui/icons-material/WaterDropRounded';
import ThermostatIcon from '@mui/icons-material/ThermostatRounded';
import TerminalIcon from '@mui/icons-material/TerminalRounded';
import TimelineIcon from '@mui/icons-material/TimelineRounded';
import PersonIcon from '@mui/icons-material/PersonRounded';
import MedicationIcon from '@mui/icons-material/MedicationRounded';
import HistoryIcon from '@mui/icons-material/HistoryRounded';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActiveRounded';

const DigitalTwin = () => {
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState(0);
    const [syncStatus, setSyncStatus] = useState(0);
    const [reports, setReports] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [simulationActive, setSimulationActive] = useState(false);

    // 1. Core State Categories
    const [vitals, setVitals] = useState({
        heartRate: 72,
        bloodPressure: "118/76",
        spo2: 98,
        glucose: 94,
        temp: 98.4,
        resp: 16
    });

    const [simulationParams, setSimulationParams] = useState({
        sleepHours: 7,
        activityLevel: 60, // percentage
        stressLevel: 30,
        adherence: 95
    });

    const [logs, setLogs] = useState([
        "SYSTEM INITIALIZATION COMPLETE",
        "NEURAL_CORE_SYNC: ACTIVE",
        "MAPPING CLINICAL HISTOLOGY...",
        "DATA STREAM ENCRYPTION: V2"
    ]);

    useEffect(() => {
        const syncInterval = setInterval(() => {
            setSyncStatus(prev => (prev >= 100 ? 98 + Math.random() * 2 : prev + 1));
        }, 100);

        // Fetch reports and prescriptions
        Promise.all([
            api.get("/cases/my-reports"),
            api.get("/prescriptions/my")
        ]).then(([reportsRes, prescriptionsRes]) => {
            setReports(reportsRes.data);
            setPrescriptions(prescriptionsRes.data);
            setLogs(prev => [`Syncing ${reportsRes.data.length} clinical reports...`, `Compiling ${prescriptionsRes.data.length} active prescriptions...`, ...prev]);
        }).catch(err => console.error(err));

        const vitalsInterval = setInterval(() => {
            if (!simulationActive) {
                setVitals(v => ({
                    ...v,
                    heartRate: 70 + Math.floor(Math.random() * 5),
                    resp: 14 + Math.floor(Math.random() * 4)
                }));
            }
        }, 3000);

        return () => {
            clearInterval(syncInterval);
            clearInterval(vitalsInterval);
        };
    }, [simulationActive]);

    const handleSimulationToggle = (e) => {
        setSimulationActive(e.target.checked);
        if (e.target.checked) setLogs(prev => ["SIMULATION ENGINE INITIATED...", ...prev]);
        else setLogs(prev => ["ENGINE STANDBY. LIVE DATA SYNC RESUMED.", ...prev]);
    };

    const getSimulatedEffect = () => {
        if (!simulationActive) return null;
        const heartImpact = (simulationParams.stressLevel / 2) - (simulationParams.sleepHours * 2);
        return (70 + heartImpact).toFixed(0);
    };

    // --- SHARED UI COMPONENTS ---
    const GlassPanel = ({ children, sx = {}, status = 'default' }) => (
        <Paper sx={{
            p: 3, borderRadius: 5,
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)',
            position: 'relative',
            overflow: 'hidden',
            ...sx
        }}>
            {status !== 'default' && (
                <Box sx={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                    bgcolor: status === 'active' ? '#4facfe' : status === 'warning' ? '#ffa500' : 'rgba(255,255,255,0.1)'
                }} />
            )}
            {children}
        </Paper>
    );

    return (
        <DashboardLayout>
            <Box sx={{
                position: 'relative',
                minHeight: '100vh',
                background: `radial-gradient(circle at 50% -20%, #062c3d 0%, #010c14 70%)`,
                p: { xs: 2, md: 4 },
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                {/* --- TECH GRID OVERLAY --- */}
                <Box sx={{ position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none', background: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

                {/* --- HEADER STRIP --- */}
                <Box sx={{ position: 'relative', zIndex: 10, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Box sx={{ width: 40, height: 40, borderRadius: 2, border: '2px solid #4facfe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <SyncIcon sx={{ color: '#4facfe', animation: 'spin 4s linear infinite' }} />
                            </Box>
                            <Box>
                                <Typography variant="h5" fontWeight={900} sx={{ letterSpacing: -1, textTransform: 'uppercase' }}>
                                    Neural_Twin <span style={{ color: '#4facfe', fontSize: '0.8rem', opacity: 0.6 }}>v4.2.0</span>
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.4, letterSpacing: 2, display: 'block' }}>BIO-SYNAPTIC INTERFACE</Typography>
                            </Box>
                        </Stack>
                    </Box>

                    <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{
                        bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2, p: 0.5, border: '1px solid rgba(255,255,255,0.05)',
                        '& .MuiTabs-indicator': { bgcolor: '#4facfe', height: '100%', borderRadius: 1.5, zIndex: -1, opacity: 0.1 },
                        '& .MuiTab-root': { minHeight: 40, px: 3, fontSize: '0.75rem', fontWeight: 900, color: 'rgba(255,255,255,0.4)', '&.Mui-selected': { color: '#fff' } }
                    }}>
                        <Tab label="SYSTEM CORE" />
                        <Tab label="MEDICAL DATA" />
                        <Tab label="SIMULATION" />
                    </Tabs>
                </Box>

                <Grid container spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
                    {/* LEFT PANEL */}
                    <Grid item xs={12} lg={3}>
                        <AnimatePresence mode="wait">
                            {activeTab === 0 ? (
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                                    <Stack spacing={3}>
                                        <GlassPanel status="active">
                                            <Typography variant="caption" fontWeight={900} color="#4facfe" sx={{ letterSpacing: 1.5, mb: 2, display: 'block' }}>CORE_IDENTITY</Typography>
                                            <Stack spacing={3}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ bgcolor: 'rgba(79, 172, 254, 0.1)', color: '#4facfe', width: 50, height: 50, border: '1px solid #4facfe40' }}><PersonIcon /></Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle1" fontWeight={900}>John Doe</Typography>
                                                        <Typography variant="caption" sx={{ opacity: 0.4, fontFamily: 'monospace' }}>#MH-X99-2026</Typography>
                                                    </Box>
                                                </Box>
                                                <Grid container spacing={2}>
                                                    {[
                                                        { label: 'AGE', val: '42' }, { label: 'SEX', val: 'M' },
                                                        { label: 'BLOOD', val: 'A+' }, { label: 'BMI', val: '24.2' },
                                                        { label: 'HT', val: '182cm' }, { label: 'WT', val: '80kg' }
                                                    ].map((item, i) => (
                                                        <Grid item xs={4} key={i}>
                                                            <Typography variant="caption" sx={{ opacity: 0.4, display: 'block', fontSize: '0.65rem' }}>{item.label}</Typography>
                                                            <Typography variant="body2" fontWeight={800}>{item.val}</Typography>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </Stack>
                                        </GlassPanel>

                                        <GlassPanel>
                                            <Typography variant="caption" fontWeight={900} sx={{ letterSpacing: 1.5, mb: 2, display: 'block' }}>CLINICAL_SUMMARY</Typography>
                                            <Stack spacing={1.5}>
                                                {[
                                                    { l: 'Diagnosis', v: 'Stable Hypertension', c: '#4facfe' },
                                                    { l: 'History', v: 'Cardiac Stent (2024)', c: '#ffa500' },
                                                    { l: 'Risk', v: 'Genetic Heart (Mod)', c: '#f44336' }
                                                ].map((h, i) => (
                                                    <Box key={i}>
                                                        <Typography variant="caption" sx={{ opacity: 0.4 }}>{h.l.toUpperCase()}</Typography>
                                                        <Typography variant="body2" fontWeight={800} sx={{ color: h.c }}>{h.v}</Typography>
                                                    </Box>
                                                ))}
                                            </Stack>
                                        </GlassPanel>

                                        <GlassPanel sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.4)' }}>
                                            <Typography variant="caption" fontWeight={900} color="#00ffc3" sx={{ letterSpacing: 1.5, mb: 1.5, display: 'block' }}>NEURAL_SYS_LOGS</Typography>
                                            <Box sx={{ fontFamily: 'monospace', fontSize: '0.6rem', color: '#00ffc3', opacity: 0.8 }}>
                                                {logs.map((l, i) => (
                                                    <Typography key={i} variant="inherit" sx={{ display: 'block', mb: 0.5 }}>{`>> ${l}`}</Typography>
                                                ))}
                                            </Box>
                                        </GlassPanel>
                                    </Stack>
                                </motion.div>
                            ) : activeTab === 1 ? (
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                                    <GlassPanel sx={{ maxHeight: '75vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                        <Typography variant="caption" fontWeight={900} sx={{ letterSpacing: 1.5, mb: 2, display: 'block' }}>RECORDS_REPOSITORY</Typography>
                                        <Stack spacing={2} sx={{ overflowY: 'auto', pr: 1 }}>
                                            {reports.length > 0 ? reports.map((r, i) => (
                                                <Box key={i} sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ bgcolor: 'rgba(79, 172, 254, 0.05)', color: '#4facfe', width: 32, height: 32 }}><ReportIcon sx={{ fontSize: 16 }} /></Avatar>
                                                    <Box>
                                                        <Typography variant="caption" fontWeight={900} sx={{ display: 'block' }}>{r.type} SCAN</Typography>
                                                        <Typography variant="caption" sx={{ opacity: 0.4 }}>{new Date(r.created_at).toLocaleDateString()}</Typography>
                                                    </Box>
                                                    <Chip label={`${r.risk_score}%`} size="small" sx={{ ml: 'auto', bgcolor: r.risk_score > 50 ? 'rgba(244,67,54,0.1)' : 'rgba(79,172,254,0.1)', color: r.risk_score > 50 ? '#f44336' : '#4facfe', fontSize: '0.6rem', fontWeight: 900 }} />
                                                </Box>
                                            )) : (
                                                <Typography variant="caption" sx={{ opacity: 0.3, textAlign: 'center', py: 4 }}>NO RECORDS FOUND</Typography>
                                            )}
                                        </Stack>
                                    </GlassPanel>
                                </motion.div>
                            ) : (
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                                    <GlassPanel sx={{ p: 0, overflow: 'hidden' }} status="warning">
                                        <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Typography variant="caption" fontWeight={900} color="#ffa500">SIM_ENGINE_V2</Typography>
                                                <Switch checked={simulationActive} onChange={handleSimulationToggle} color="warning" size="small" />
                                            </Box>
                                            <Typography variant="body2" sx={{ opacity: 0.6, fontSize: '0.75rem' }}>Modify health parameters to predict vitality trends and cardiovascular risk.</Typography>
                                        </Box>
                                        <Stack spacing={3} sx={{ p: 3, opacity: simulationActive ? 1 : 0.3, pointerEvents: simulationActive ? 'auto' : 'none' }}>
                                            <Box>
                                                <Typography variant="caption" sx={{ opacity: 0.5, letterSpacing: 1 }}>REST_DURATION ({simulationParams.sleepHours}h)</Typography>
                                                <Slider value={simulationParams.sleepHours} min={2} max={12} onChange={(e, v) => setSimulationParams(p => ({ ...p, sleepHours: v }))} color="warning" />
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" sx={{ opacity: 0.5, letterSpacing: 1 }}>STRESS_LOAD ({simulationParams.stressLevel}%)</Typography>
                                                <Slider value={simulationParams.stressLevel} onChange={(e, v) => setSimulationParams(p => ({ ...p, stressLevel: v }))} color="error" />
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" sx={{ opacity: 0.5, letterSpacing: 1 }}>ADHERENCE ({simulationParams.adherence}%)</Typography>
                                                <Slider value={simulationParams.adherence} onChange={(e, v) => setSimulationParams(p => ({ ...p, adherence: v }))} color="success" />
                                            </Box>
                                            <Button fullWidth variant="contained" color="warning" sx={{ borderRadius: 2, fontWeight: 900, textTransform: 'uppercase', py: 1.5 }}>Predict Outcome</Button>
                                        </Stack>
                                    </GlassPanel>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Grid>

                    {/* CENTER: THE LIVING MODEL HUB */}
                    <Grid item xs={12} lg={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                        <Box sx={{ position: 'relative', width: '100%', maxWidth: 500, height: 600, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                            {/* --- PERFECTLY SYMMETRICAL HOLOGRAPHIC BODY --- */}
                            <Box sx={{ position: 'relative', zIndex: 2, transform: 'scale(1.1)' }}>
                                <svg width="400" height="500" viewBox="0 0 200 250" preserveAspectRatio="xMidYMid meet">
                                    <defs>
                                        <filter id="meshGlow">
                                            <feGaussianBlur stdDeviation="3.5" result="blur" />
                                            <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.3  0 0 0 0 0.9  0 0 0 0 1  0 0 0 1.2 0" />
                                            <feMerge>
                                                <feMergeNode />
                                                <feMergeNode in="SourceGraphic" />
                                            </feMerge>
                                        </filter>
                                        <linearGradient id="bodyMesh" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.1" />
                                            <stop offset="50%" stopColor="#4facfe" stopOpacity="0.8" />
                                            <stop offset="100%" stopColor="#00f2fe" stopOpacity="0.1" />
                                        </linearGradient>

                                        {/* PERFECTLY MIRRORED BODY PATH */}
                                        <path id="mirroredBody" d="
                                            M100,20 c-5,0-9,4-9,9 s4,9,9,9 s9-4,9-9 s-4-9-9-9 z
                                            M100,42 c-15,0-25,4-30,12 
                                            l-18,45 c-2,5,1,9,6,9 h12 l12-45 
                                            v65 
                                            l-8,90 c-1,8,4,12,10,12 h4 l5-75 
                                            h2 
                                            l5,75 h4 c6,0,11-4,10-12 l-8-90 
                                            v-65 
                                            l12,45 h12 c5,0,8-4,6-9 l-18-45 
                                            c-5-8-15-12-30-12 z
                                        " />
                                        <mask id="bodyMask">
                                            <use href="#mirroredBody" fill="white" />
                                        </mask>
                                    </defs>

                                    {/* Foundation Plasma Foundation */}
                                    <ellipse cx="100" cy="235" rx="50" ry="15" fill="url(#simGlow)" opacity="0.4" />
                                    <radialGradient id="simGlow" cx="50%" cy="50%" r="50%">
                                        <stop offset="0%" stopColor={simulationActive ? "#ffa500" : "#4facfe"} stopOpacity="0.5" />
                                        <stop offset="100%" stopColor="transparent" />
                                    </radialGradient>

                                    {/* MAIN RENDER */}
                                    <g filter="url(#meshGlow)">
                                        <use href="#mirroredBody" fill="url(#bodyMesh)" stroke="#4facfe" strokeWidth="1.2" />

                                        {/* Anatomical Symmetry Guides */}
                                        <g opacity="0.3">
                                            <path d="M85,75 Q100,85 115,75" fill="none" stroke="#fff" strokeWidth="1" />
                                            <path d="M82,120 Q100,135 118,120" fill="none" stroke="#fff" strokeWidth="1" />
                                            <line x1="100" y1="50" x2="100" y2="160" stroke="#fff" strokeWidth="0.5" strokeDasharray="3,3" />
                                        </g>
                                    </g>

                                    {/* Mapped Grid */}
                                    <g mask="url(#bodyMask)">
                                        {[...Array(20)].map((_, i) => (
                                            <line key={i} x1="0" y1={40 + i * 12} x2="200" y2={40 + i * 12} stroke="#4facfe" strokeWidth="0.2" opacity="0.2" />
                                        ))}
                                    </g>

                                    {/* Neural Data Points */}
                                    {[...Array(140)].map((_, i) => (
                                        <motion.circle
                                            key={i}
                                            cx={70 + Math.random() * 60}
                                            cy={30 + Math.random() * 200}
                                            r={Math.random() * 1.5}
                                            fill={simulationActive ? "#ffa500" : "#fff"}
                                            animate={{ opacity: [0.1, 0.8, 0.1], scale: [0.8, 1.4, 0.8] }}
                                            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity }}
                                        />
                                    ))}

                                    {/* Heart Core */}
                                    <motion.circle
                                        cx="100" cy="100" r="8"
                                        fill="#ff4b2b"
                                        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                                        transition={{ repeat: Infinity, duration: 0.8 }}
                                        style={{ filter: 'blur(2px)' }}
                                    />
                                    <motion.circle
                                        cx="100" cy="100" r="18"
                                        fill="#ff4b2b"
                                        opacity="0.2"
                                        animate={{ scale: [1, 2.2, 1], opacity: [0, 0.2, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.6 }}
                                    />
                                </svg>
                            </Box>

                            {/* SCANNING LASER */}
                            <motion.div
                                animate={{ top: ['10%', '90%', '10%'] }}
                                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                                style={{
                                    position: 'absolute', left: '10%', right: '10%', height: '1px',
                                    background: `linear-gradient(90deg, transparent, ${simulationActive ? '#ffa500' : '#4facfe'}, transparent)`,
                                    boxShadow: `0 0 20px ${simulationActive ? '#ffa500' : '#4facfe'}`, zIndex: 10
                                }}
                            />

                            {/* DATA ANCHOR WIDGETS */}
                            <Box sx={{ position: 'absolute', top: '15%', left: '0%', zIndex: 5 }}>
                                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                                    <GlassPanel sx={{ p: 1.5, py: 1, borderLeft: '3px solid #00ffc3' }}>
                                        <Typography variant="caption" sx={{ color: '#00ffc3', fontWeight: 900, fontSize: '0.6rem' }}>SYNAPSE_RATE</Typography>
                                        <Typography variant="body2" fontWeight={900}>420 MB/S</Typography>
                                    </GlassPanel>
                                </motion.div>
                            </Box>
                        </Box>

                        {/* VITALITY HUD */}
                        <Box sx={{ width: '100%', maxWidth: 500, display: 'flex', gap: 2, mt: -2 }}>
                            <Box sx={{ flex: 1 }}>
                                <GlassPanel sx={{ textAlign: 'center', py: 2 }}>
                                    <Typography variant="h3" fontWeight={900} sx={{ color: '#4facfe' }}>98</Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.4, fontWeight: 900, letterSpacing: 1.5 }}>VITALITY_INDEX</Typography>
                                </GlassPanel>
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <GlassPanel sx={{ textAlign: 'center', py: 2, border: '1px solid rgba(255,165,0,0.1)' }}>
                                    <Typography variant="h3" fontWeight={900} sx={{ color: '#ffa500' }}>12%</Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.4, fontWeight: 900, letterSpacing: 1.5 }}>PREDICTED_RISK</Typography>
                                </GlassPanel>
                            </Box>
                        </Box>
                    </Grid>

                    {/* RIGHT PANEL */}
                    <Grid item xs={12} lg={3}>
                        <Stack spacing={3}>
                            <GlassPanel status="active">
                                <Typography variant="caption" fontWeight={900} sx={{ letterSpacing: 1.5, mb: 2, display: 'block' }}>TEMPORAL_HUB</Typography>
                                <Stack spacing={2.5}>
                                    {[
                                        { t: 'PROJECTION (APR 26)', d: 'Vitals stable, +2% metabolic efficiency', s: '#00ffc3' },
                                        { t: 'CURRENT STATE (FEB 26)', d: 'Digital twin synchronized with wearables', s: '#4facfe' },
                                        { t: 'HISTORICAL (JAN 26)', d: 'Baseline state stored successfully', s: 'rgba(255,255,255,0.4)' }
                                    ].map((t, i) => (
                                        <Box key={i} sx={{ borderLeft: `2px solid ${t.s}`, pl: 2 }}>
                                            <Typography variant="caption" fontWeight={900} sx={{ color: t.s }}>{t.t}</Typography>
                                            <Typography variant="caption" sx={{ display: 'block', opacity: 0.4, fontSize: '0.65rem', mt: 0.5 }}>{t.d}</Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </GlassPanel>

                            <GlassPanel>
                                <Typography variant="caption" fontWeight={900} sx={{ letterSpacing: 1.5, mb: 2, display: 'block' }}>PHARMA_PROTOCOL</Typography>
                                <Stack spacing={1.5}>
                                    {prescriptions.length > 0 ? prescriptions.map((p, i) => (
                                        <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2 }}>
                                            <Box>
                                                <Typography variant="body2" fontWeight={800}>{p.medicine_name || "Amlodipine"}</Typography>
                                                <Typography variant="caption" sx={{ opacity: 0.4 }}>{p.dosage || "5mg"} // Once Daily</Typography>
                                            </Box>
                                            <Chip label="95%" size="small" sx={{ bgcolor: 'rgba(0,255,195,0.1)', color: '#00ffc3', fontSize: '0.6rem', fontWeight: 900 }} />
                                        </Box>
                                    )) : (
                                        <Typography variant="caption" sx={{ opacity: 0.3, textAlign: 'center' }}>NO ACTIVE PROTOCOLS</Typography>
                                    )}
                                </Stack>
                            </GlassPanel>
                        </Stack>
                    </Grid>
                </Grid>

                {/* --- FOOTER HUD --- */}
                <Box sx={{
                    position: 'fixed', bottom: 30, left: { xs: 20, md: 'calc(280px + 60px)' }, right: 40,
                    zIndex: 1000
                }}>
                    <GlassPanel sx={{ p: 0, overflow: 'visible', bgcolor: 'rgba(1, 12, 20, 0.8)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
                        <Grid container>
                            {[
                                { label: 'BPM', val: simulationActive ? getSimulatedEffect() : vitals.heartRate, icon: <HeartIcon />, color: '#f44336' },
                                { label: 'BP', val: vitals.bloodPressure, icon: <SyncIcon />, color: '#4facfe' },
                                { label: 'SPO2', val: vitals.spo2, icon: <WaterDropIcon />, color: '#00ffc3' },
                                { label: 'GLU', val: vitals.glucose, icon: <ActivityIcon />, color: '#ffa500' },
                                { label: 'RESP', val: vitals.resp, icon: <TimelineIcon />, color: '#f093fb' }
                            ].map((m, i) => (
                                <Grid item xs={2.4} key={i}>
                                    <Box sx={{
                                        textAlign: 'center', py: 2.5, px: 1,
                                        borderRight: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                        position: 'relative'
                                    }}>
                                        <Typography variant="caption" sx={{ opacity: 0.4, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, fontSize: '0.6rem' }}>
                                            {m.icon} {m.label}
                                        </Typography>
                                        <Typography variant="h5" fontWeight={900} sx={{ color: m.color, mt: 0.5 }}>{m.val}</Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </GlassPanel>
                </Box>

                <style>{`
                    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                    ::-webkit-scrollbar { width: 4px; }
                    ::-webkit-scrollbar-thumb { background: rgba(79, 172, 254, 0.2); border-radius: 10px; }
                    ::-webkit-scrollbar-track { background: transparent; }
                `}</style>
            </Box>
        </DashboardLayout>
    );
};

export default DigitalTwin;
