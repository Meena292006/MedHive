import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mic, Square, Activity, Heart, Droplets, ShieldAlert, AlertCircle
} from 'lucide-react';
import {
    Grid, Card, CardContent, Typography, Box, Avatar, Button, Chip, TextField, InputAdornment, List, ListItem, ListItemText, useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DashboardLayout from '../components/DashboardLayout';
import AnimatedCard from '../components/AnimatedCard';
import { useAuth } from '../context/AuthContext';

const MedAlertDashboard = () => {
    const theme = useTheme();
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

                // Real-time triage
                if (currentTranscript.trim().length > 5) {
                    analyzeTriage(currentTranscript);
                }
            };

            recognitionRef.current.onend = () => setIsListening(false);
            recognitionRef.current.onerror = () => setIsListening(false);
        }
    }, [user]);

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
            setTriageData(response.data);
            setAnalysis(response.data.advice);
        } catch (err) {
            console.error("Triage API error:", err);
        } finally {
            setLoading(false);
        }
    };

    const filters = ["All Events", "Dizziness", "Fever", "Chest Pain"];

    const getRiskColor = (risk) => {
        switch (risk?.toUpperCase()) {
            case 'HIGH': return theme.palette.error.main;
            case 'MODERATE': return theme.palette.warning.main;
            default: return theme.palette.success.main;
        }
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
                    style={{ position: 'absolute', top: '20%', right: '10%', opacity: 0.1 }}
                >
                    <Activity size={120} color={theme.palette.primary.main} />
                </motion.div>
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    style={{ position: 'absolute', bottom: '30%', left: '15%' }}
                >
                    <ShieldAlert size={100} color={theme.palette.secondary.main} />
                </motion.div>
            </Box>

            <Box sx={{ position: 'relative', zIndex: 1, minHeight: '100vh', p: 4 }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Avatar sx={{
                                bgcolor: theme.palette.error.main,
                                width: 56,
                                height: 56,
                                boxShadow: `0 10px 30px ${theme.palette.error.main}40`
                            }}>
                                <Activity size={28} />
                            </Avatar>
                        </motion.div>
                        <Box>
                            <Typography variant="h4" fontWeight={800} sx={{
                                background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${theme.palette.error.main})`,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                MedAlert Dashboard
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 0.5, color: theme.palette.text.secondary, fontWeight: 600 }}>
                                AI-powered emergency symptom analysis and triage
                            </Typography>
                        </Box>
                    </Box>
                </motion.div>

                {/* Search Bar */}
                <AnimatedCard delay={0.1} sx={{ mb: 3 }}>
                    <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                fullWidth
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && analyzeTriage(searchInput)}
                                placeholder="Search symptoms or patient events..."
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                variant="contained"
                                onClick={() => analyzeTriage(searchInput)}
                                disabled={loading || !searchInput.trim()}
                                sx={{
                                    px: 4,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                    fontWeight: 700,
                                    boxShadow: `0 8px 24px ${theme.palette.primary.main}40`,
                                    '&:hover': {
                                        boxShadow: `0 12px 32px ${theme.palette.primary.main}60`,
                                    }
                                }}
                            >
                                Analyze
                            </Button>
                        </Box>
                    </CardContent>
                </AnimatedCard>

                {/* Filters */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4, flexWrap: 'wrap' }}>
                    {filters.map((filter, i) => (
                        <Chip
                            key={filter}
                            label={filter}
                            onClick={() => { }}
                            sx={{
                                fontWeight: 700,
                                bgcolor: i === 0 ? theme.palette.primary.main : theme.palette.action.hover,
                                color: i === 0 ? 'white' : 'text.secondary',
                                '&:hover': {
                                    bgcolor: i === 0 ? theme.palette.primary.dark : theme.palette.action.selected
                                }
                            }}
                        />
                    ))}
                    <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 8, height: 8, bgcolor: theme.palette.success.main, borderRadius: '50%' }} />
                        <Typography variant="caption" fontWeight={700} color="text.secondary">
                            0 Clinical Rules Active
                        </Typography>
                    </Box>
                </Box>

                <Grid container spacing={3}>
                    {/* Main Content */}
                    <Grid item xs={12} lg={8}>
                        {/* Patient Status Banner */}
                        <AnimatedCard delay={0.2} sx={{ mb: 3 }}>
                            <CardContent sx={{ p: 4, position: 'relative', overflow: 'hidden' }}>
                                <Typography variant="subtitle2" fontWeight={700} color="primary" gutterBottom>
                                    Current Patient Status
                                </Typography>
                                <Typography variant="h3" fontWeight={900} gutterBottom sx={{ letterSpacing: -1 }}>
                                    {loading ? "Processing..." : analysis ? analysis.general.title : "Waiting for Input"}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '70%', fontWeight: 500 }}>
                                    {analysis ? analysis.general.message : "Use voice or text to describe patient symptoms for immediate AI analysis."}
                                </Typography>

                                {/* Decorative Element */}
                                <Box sx={{
                                    position: 'absolute',
                                    right: 40,
                                    top: '50%',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    width: 100,
                                    height: 160,
                                    bgcolor: theme.palette.primary.main,
                                    opacity: 0.08,
                                    borderRadius: 5,
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <Box sx={{ flex: 1, bgcolor: theme.palette.primary.light, borderRadius: '20px 20px 0 0', opacity: 0.5 }} />
                                    <Box sx={{ flex: 1, borderRadius: '0 0 20px 20px' }} />
                                </Box>
                            </CardContent>
                        </AnimatedCard>

                        {/* Recording Action Card */}
                        <AnimatedCard delay={0.3}>
                            <CardContent sx={{ p: 6, textAlign: 'center' }}>
                                <Box sx={{ mb: 4, position: 'relative', display: 'inline-block' }}>
                                    {isListening && (
                                        <motion.div
                                            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0, 0.1] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            style={{
                                                position: 'absolute',
                                                inset: -20,
                                                borderRadius: '50%',
                                                border: `2px solid ${theme.palette.primary.main}`
                                            }}
                                        />
                                    )}
                                    <Avatar sx={{
                                        width: 80,
                                        height: 80,
                                        bgcolor: 'background.paper',
                                        border: `2px solid ${theme.palette.divider}`
                                    }}>
                                        {isListening ? (
                                            <Square size={32} color={theme.palette.primary.main} fill={theme.palette.primary.main} />
                                        ) : (
                                            <Mic size={32} color={theme.palette.primary.main} />
                                        )}
                                    </Avatar>
                                </Box>

                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={toggleListening}
                                    sx={{
                                        px: 6,
                                        py: 1.8,
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                        fontWeight: 800,
                                        fontSize: '1.1rem',
                                        boxShadow: `0 10px 30px ${theme.palette.primary.main}40`,
                                        '&:hover': {
                                            boxShadow: `0 15px 40px ${theme.palette.primary.main}60`,
                                        }
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
                                            style={{ marginTop: 24 }}
                                        >
                                            <Typography variant="body1" sx={{ fontWeight: 600, fontStyle: 'italic', color: 'text.primary' }}>
                                                {isListening ? "Listening... " : ""}{transcript ? `"${transcript}"` : ""}
                                            </Typography>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                        </AnimatedCard>

                        {/* Quick Shortcuts */}
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" fontWeight={800} gutterBottom>
                                Quick Diagnostic Shortcuts
                            </Typography>
                            <Grid container spacing={2}>
                                {[
                                    { icon: ShieldAlert, label: "Triage Rules", color: theme.palette.error.main },
                                    { icon: Heart, label: "Cardiac Check", color: theme.palette.error.dark },
                                    { icon: Droplets, label: "Glucose Meter", color: theme.palette.primary.main }
                                ].map((item) => (
                                    <Grid item xs={12} sm={4} key={item.label}>
                                        <Card
                                            variant="outlined"
                                            sx={{
                                                p: 2,
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    bgcolor: theme.palette.action.hover,
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: `0 8px 24px ${item.color}20`
                                                }
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <item.icon size={20} color={item.color} />
                                                <Typography variant="body2" fontWeight={700}>
                                                    {item.label}
                                                </Typography>
                                            </Box>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Grid>

                    {/* Right Panel - Recent Activities */}
                    <Grid item xs={12} lg={4}>
                        <AnimatedCard delay={0.4}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={800} gutterBottom>
                                    Recent Activities
                                </Typography>
                                {!triageData ? (
                                    <Box sx={{ py: 8, textAlign: 'center' }}>
                                        <AlertCircle size={48} color={theme.palette.text.disabled} style={{ opacity: 0.3 }} />
                                        <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mt: 2 }}>
                                            No recent activities detected
                                        </Typography>
                                    </Box>
                                ) : (
                                    <List sx={{ p: 0 }}>
                                        <Card
                                            variant="outlined"
                                            sx={{
                                                borderLeft: `4px solid ${getRiskColor(triageData.risk)}`,
                                                bgcolor: `${getRiskColor(triageData.risk)}08`
                                            }}
                                        >
                                            <ListItem sx={{ p: 2 }}>
                                                <Box sx={{ width: '100%' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                        <Box sx={{
                                                            width: 12,
                                                            height: 12,
                                                            borderRadius: '50%',
                                                            bgcolor: getRiskColor(triageData.risk)
                                                        }} />
                                                        <Typography variant="body2" fontWeight={800}>
                                                            {triageData.advice.general.title}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                        {triageData.action}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.disabled">
                                                        Just now
                                                    </Typography>
                                                </Box>
                                            </ListItem>
                                        </Card>
                                    </List>
                                )}
                            </CardContent>
                        </AnimatedCard>
                    </Grid>
                </Grid>
            </Box>
        </DashboardLayout>
    );
};

export default MedAlertDashboard;
