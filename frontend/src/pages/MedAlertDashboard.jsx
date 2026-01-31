import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    Mic, Square, Search, Activity, Heart, Droplets,
    ShieldAlert, Clock, ChevronRight, LayoutDashboard, History, BarChart3, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import {
    Grid, Card, CardContent, Typography, Box,
    Avatar, Button, Chip, TextField, InputAdornment, Divider, List, ListItem, ListItemText, ListItemIcon
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const MedAlertDashboard = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [triageData, setTriageData] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [loading, setLoading] = useState(false);
    const recognitionRef = useRef(null);
    const { user } = useAuth();

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                let currentTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    currentTranscript += event.results[i][0].transcript;
                }
                setTranscript(currentTranscript);

                // 🔥 REAL-TIME TRIAGE (As requested: Call backend during recording)
                if (currentTranscript.trim().length > 5) {
                    analyzeTriage(currentTranscript);
                }
            };

            recognitionRef.current.onend = () => setIsListening(false);
            recognitionRef.current.onerror = () => setIsListening(false);
        }
    }, [user]); // user dependency to ensure patientName is updated

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            if (transcript) analyzeTriage(transcript);
        } else {
            setTranscript('');
            setTriageData(null);
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const analyzeTriage = async (text) => {
        if (!text || text.trim().length < 3) return;
        if (loading) return;

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5055/api/medalert/triage', {
                symptoms: text,
                patientName: user?.displayName || user?.email || "Patient"
            });
            // response.data = { risk, score, action, advice }
            setTriageData(response.data);
            setAnalysis(response.data.advice);
        } catch (err) {
            console.error("Triage API error:", err);
        } finally {
            setLoading(false);
        }
    };

    const filters = ["All Events", "Dizziness", "Fever", "Chest Pain"];

    return (
        <DashboardLayout>
            <Box sx={{ display: 'flex', height: '100%', bgcolor: '#F8FAFC', minHeight: 'calc(100vh - 64px)' }}>
                {/* Main Content */}
                <Box sx={{ flexGrow: 1, p: 4, overflowY: 'auto' }}>

                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ width: 40, height: 40, bgcolor: '#EDE9FE', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Activity size={24} color="#7C3AED" />
                            </Box>
                            <Typography variant="h5" fontWeight={800} color="#1E293B">MedAlert Dashboard</Typography>
                        </Box>
                        <Typography variant="subtitle2" fontWeight={700} color="#64748B">{user?.displayName || "Pro Account"}</Typography>
                    </Box>

                    {/* Search Bar */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 4, bgcolor: 'white', p: 1, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                        <TextField
                            fullWidth
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && analyzeTriage(searchInput)}
                            placeholder="Search symptoms or patient events..."
                            variant="outlined"
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><Search size={20} color="#94A3B8" /></InputAdornment>,
                                sx: { bgcolor: '#F1F5F9', borderRadius: 2, border: 'none', '& fieldset': { border: 'none' } }
                            }}
                        />
                        <Button
                            variant="contained"
                            disableElevation
                            onClick={() => analyzeTriage(searchInput)}
                            disabled={loading || !searchInput.trim()}
                            sx={{ borderRadius: 2, px: 4, bgcolor: '#3B82F6', fontWeight: 700, textTransform: 'none' }}
                        >
                            Analyze
                        </Button>
                    </Box>

                    {/* Filters */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 6 }}>
                        {filters.map((filter, i) => (
                            <Chip
                                key={filter}
                                label={filter}
                                onClick={() => { }}
                                sx={{
                                    px: 1,
                                    borderRadius: 2,
                                    bgcolor: i === 0 ? '#3B82F6' : '#F1F5F9',
                                    color: i === 0 ? 'white' : '#64748B',
                                    fontWeight: 700,
                                    '&:hover': { bgcolor: i === 0 ? '#2563EB' : '#E2E8F0' }
                                }}
                            />
                        ))}
                        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 8, height: 8, bgcolor: '#22C55E', borderRadius: '50%' }} />
                            <Typography variant="caption" fontWeight={700} color="#64748B">0 Clinical Rules Active</Typography>
                        </Box>
                    </Box>

                    {/* Patient Status Banner */}
                    <Card sx={{
                        borderRadius: 5,
                        bgcolor: '#EFF6FF',
                        boxShadow: 'none',
                        mb: 4,
                        position: 'relative',
                        overflow: 'hidden',
                        border: '1px solid #DBEAFE'
                    }}>
                        <CardContent sx={{ p: 5 }}>
                            <Typography variant="subtitle2" fontWeight={700} color="#3B82F6" gutterBottom>
                                Current Patient Status
                            </Typography>
                            <Typography variant="h3" fontWeight={900} color="#1E3A8A" gutterBottom sx={{ letterSpacing: -1 }}>
                                {loading ? "Processing..." : analysis ? analysis.general.title : "Waiting for Input"}
                            </Typography>
                            <Typography variant="body1" color="#64748B" sx={{ maxWidth: '60%', fontWeight: 500 }}>
                                {analysis ? analysis.general.message : "Use voice or text to describe patient symptoms for immediate agentic analysis."}
                            </Typography>

                            {/* Decorative Capsule Illustration (Mock) */}
                            <Box sx={{
                                position: 'absolute',
                                right: 60,
                                top: '50%',
                                transform: 'translateY(-50%)'
                            }}>
                                <Box sx={{
                                    width: 100,
                                    height: 160,
                                    bgcolor: '#DBEAFE',
                                    borderRadius: 20,
                                    transform: 'rotate(45deg)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    opacity: 0.8
                                }}>
                                    <Box sx={{ flex: 1, bgcolor: '#BFDBFE', borderRadius: '20px 20px 0 0' }} />
                                    <Box sx={{ flex: 1, bgcolor: '#DBEAFE', borderRadius: '0 0 20px 20px' }} />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Recording Action Card */}
                    <Card sx={{
                        borderRadius: 5,
                        bgcolor: 'white',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                        p: 8,
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 6,
                        border: '1px solid #F1F5F9'
                    }}>
                        <Box sx={{ mb: 4, position: 'relative' }}>
                            {isListening && (
                                <motion.div
                                    animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0, 0.1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    style={{
                                        position: 'absolute',
                                        inset: -20,
                                        borderRadius: '50%',
                                        border: '1px solid #3B82F6'
                                    }}
                                />
                            )}
                            <Box sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid #E2E8F0',
                                bgcolor: 'white'
                            }}>
                                {isListening ? (
                                    <Square size={32} color="#3B82F6" fill="#3B82F6" />
                                ) : (
                                    <Mic size={32} color="#3B82F6" />
                                )}
                            </Box>
                        </Box>

                        <Button
                            variant="contained"
                            disableElevation
                            onClick={toggleListening}
                            sx={{
                                borderRadius: 3,
                                px: 5,
                                py: 1.5,
                                bgcolor: '#3B82F6',
                                fontWeight: 800,
                                textTransform: 'none',
                                fontSize: '1.1rem',
                                '&:hover': { bgcolor: '#2563EB' }
                            }}
                        >
                            {isListening ? "Stop Recording" : "Start Recording"}
                        </Button>

                        {/* Live Transcript Display */}
                        <AnimatePresence>
                            {(transcript || isListening) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{ marginTop: '24px', maxWidth: '80%' }}
                                >
                                    <Typography variant="body1" sx={{ color: '#1E293B', fontWeight: 600, fontStyle: 'italic' }}>
                                        {isListening ? "Listening..." : ""} {transcript ? `"${transcript}"` : ""}
                                    </Typography>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Card>

                    {/* Quick Shortcuts (Minimalist) */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" fontWeight={800} color="#1E293B" gutterBottom>
                            Quick Diagnostic Shortcuts
                        </Typography>
                        <Grid container spacing={2}>
                            {[
                                { icon: ShieldAlert, label: "Triage Rules", color: "#EF4444" },
                                { icon: Heart, label: "Cardiac Check", color: "#F43F5E" },
                                { icon: Droplets, label: "Glucose Meter", color: "#3B82F6" }
                            ].map((item) => (
                                <Grid size={{ xs: 12, sm: 4 }} key={item.label}>
                                    <Card variant="outlined" sx={{ borderRadius: 3, p: 2, cursor: 'pointer', '&:hover': { bgcolor: '#F1F5F9' } }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <item.icon size={20} color={item.color} />
                                            <Typography variant="body2" fontWeight={700} color="#475569">{item.label}</Typography>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>

                {/* Right Panel - Recent Activities */}
                <Box sx={{
                    width: 350,
                    bgcolor: 'white',
                    borderLeft: '1px solid #E2E8F0',
                    display: { xs: 'none', lg: 'flex' },
                    flexDirection: 'column'
                }}>
                    <Box sx={{ p: 4, borderBottom: '1px solid #F1F5F9' }}>
                        <Typography variant="h6" fontWeight={800}>Recent Activities</Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                        {!triageData ? (
                            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
                                <Typography variant="body2" fontWeight={700}>No recent activities detected.</Typography>
                            </Box>
                        ) : (
                            <List sx={{ width: '100%', p: 0 }}>
                                <Card variant="outlined" sx={{ borderRadius: 3, mb: 2, border: '1px solid #E2E8F0' }}>
                                    <ListItem sx={{ p: 2 }}>
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            <Box sx={{
                                                width: 12,
                                                height: 12,
                                                borderRadius: '50%',
                                                bgcolor: triageData.risk === 'HIGH' ? '#EF4444' : triageData.risk === 'MODERATE' ? '#F59E0B' : '#22C55E'
                                            }} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={<Typography fontWeight={800} variant="body2">{triageData.advice.general.title}</Typography>}
                                            secondary={
                                                <Box sx={{ mt: 0.5 }}>
                                                    <Typography color="text.secondary" variant="caption" display="block" sx={{ fontWeight: 600 }}>{triageData.action}</Typography>
                                                    <Typography color="#94A3B8" variant="caption">Just now</Typography>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                </Card>
                            </List>
                        )}
                    </Box>
                </Box>
            </Box>
        </DashboardLayout>
    );
};

export default MedAlertDashboard;
