import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Box, Card, CardContent, Typography, Button, Avatar, Chip, List, ListItem, ListItemText, IconButton, Collapse
} from '@mui/material';
import {
    Mic, Square, Phone, List as ListIcon, Close, MessageSquare, Activity, ShieldAlert, Droplets
} from 'lucide-react';
import { useTheme } from '@mui/material';

const MedAlertPanel = () => {
    const theme = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [advice, setAdvice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

    const recognitionRef = useRef(null);

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
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error:", event.error);
                setIsListening(false);
            };
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            if (transcript) {
                analyzeTranscript(transcript);
            }
        } else {
            setTranscript('');
            setAdvice(null);
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const analyzeTranscript = async (text) => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5055/api/medalert/analyze', {
                transcript: text
            });
            setAdvice(response.data.advice);

            const entry = {
                id: Date.now(),
                date: new Date().toLocaleDateString(),
                timestamp: new Date().toLocaleTimeString(),
                text: text,
                advice: response.data.advice
            };
            setHistory(prev => [entry, ...prev.slice(0, 9)]);
        } catch (err) {
            console.error("Analysis error:", err);
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (risk) => {
        switch (risk) {
            case 'high': return theme.palette.error.main;
            case 'elevated': return theme.palette.warning.main;
            default: return theme.palette.success.main;
        }
    };

    return (
        <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        style={{ marginBottom: 16 }}
                    >
                        <Card sx={{
                            width: 420,
                            borderRadius: 4,
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                            border: `1px solid ${theme.palette.divider}`,
                            bgcolor: 'background.paper'
                        }}>
                            {/* Header */}
                            <Box sx={{
                                p: 2.5,
                                borderBottom: `1px solid ${theme.palette.divider}`,
                                background: `linear-gradient(135deg, ${theme.palette.error.main}15 0%, transparent 100%)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: theme.palette.error.main, width: 40, height: 40 }}>
                                        <Activity size={20} />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={800}>
                                            MedAlert AI
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <Box sx={{
                                                width: 6,
                                                height: 6,
                                                borderRadius: '50%',
                                                bgcolor: theme.palette.success.main,
                                                animation: 'pulse 2s infinite'
                                            }} />
                                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                Ready to Assist
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    <IconButton size="small" onClick={() => setShowHistory(!showHistory)}>
                                        <ListIcon size={18} />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => setIsOpen(false)}>
                                        <Close size={18} />
                                    </IconButton>
                                </Box>
                            </Box>

                            <CardContent sx={{ p: 3 }}>
                                {/* Voice Interaction Area */}
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, mb: 4 }}>
                                    <Box sx={{ position: 'relative' }}>
                                        {isListening && (
                                            <>
                                                <motion.div
                                                    animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                    style={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        borderRadius: '50%',
                                                        background: theme.palette.error.main,
                                                    }}
                                                />
                                                <motion.div
                                                    animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0, 0.2] }}
                                                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                                    style={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        borderRadius: '50%',
                                                        background: theme.palette.error.main,
                                                    }}
                                                />
                                            </>
                                        )}
                                        <Button
                                            onClick={toggleListening}
                                            sx={{
                                                width: 96,
                                                height: 96,
                                                borderRadius: '50%',
                                                background: isListening
                                                    ? theme.palette.grey[800]
                                                    : `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
                                                color: 'white',
                                                position: 'relative',
                                                zIndex: 10,
                                                boxShadow: `0 10px 30px ${theme.palette.error.main}40`,
                                                '&:hover': {
                                                    transform: 'scale(1.05)',
                                                    boxShadow: `0 15px 40px ${theme.palette.error.main}60`,
                                                },
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            {isListening ? (
                                                <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'flex-end', height: 24 }}>
                                                    {[1, 2, 3, 4, 5].map(i => (
                                                        <motion.div
                                                            key={i}
                                                            animate={{ height: [8, 24, 8] }}
                                                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                                                            style={{
                                                                width: 3,
                                                                background: 'white',
                                                                borderRadius: 2
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            ) : (
                                                <Mic size={40} strokeWidth={2.5} />
                                            )}
                                        </Button>
                                    </Box>

                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="body1" fontWeight={700} gutterBottom>
                                            {isListening ? "Listening..." : "Emergency Voice Assistant"}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ px: 4 }}>
                                            {isListening ? "Stop when you're done speaking" : "Describe your symptoms for instant AI analysis"}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Response Area */}
                                <AnimatePresence mode="wait">
                                    {(transcript || loading) && !advice && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <Card variant="outlined" sx={{ p: 2.5, mb: 2, bgcolor: theme.palette.action.hover }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                                    <MessageSquare size={14} color={theme.palette.error.main} />
                                                    <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                                        Live Transcript
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.primary' }}>
                                                    {transcript ? `"${transcript}"` : "Analyzing speech patterns..."}
                                                </Typography>
                                                {loading && (
                                                    <Box sx={{ mt: 2, height: 4, bgcolor: theme.palette.divider, borderRadius: 2, overflow: 'hidden' }}>
                                                        <motion.div
                                                            animate={{ x: [-100, 400] }}
                                                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                                            style={{
                                                                height: '100%',
                                                                width: '33%',
                                                                background: theme.palette.error.main,
                                                                borderRadius: 2
                                                            }}
                                                        />
                                                    </Box>
                                                )}
                                            </Card>
                                        </motion.div>
                                    )}

                                    {advice && !loading && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                                {[
                                                    { label: 'General', data: advice.general, icon: ShieldAlert },
                                                    { label: 'Heart', data: advice.heart, icon: Activity },
                                                    { label: 'Diabetes', data: advice.diabetes, icon: Droplets }
                                                ].map((item, idx) => (
                                                    <Card
                                                        key={idx}
                                                        variant="outlined"
                                                        sx={{
                                                            p: 2,
                                                            borderLeft: `4px solid ${getRiskColor(item.data.risk)}`,
                                                            bgcolor: `${getRiskColor(item.data.risk)}08`,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 2
                                                        }}
                                                    >
                                                        <Avatar sx={{
                                                            bgcolor: getRiskColor(item.data.risk),
                                                            width: 36,
                                                            height: 36
                                                        }}>
                                                            <item.icon size={18} />
                                                        </Avatar>
                                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                                            <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                                                {item.label}
                                                            </Typography>
                                                            <Typography variant="body2" fontWeight={700} noWrap>
                                                                {item.data.title}
                                                            </Typography>
                                                        </Box>
                                                        <Chip
                                                            label={item.data.risk}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: getRiskColor(item.data.risk),
                                                                color: 'white',
                                                                fontWeight: 800,
                                                                textTransform: 'uppercase',
                                                                fontSize: '0.65rem'
                                                            }}
                                                        />
                                                    </Card>
                                                ))}

                                                {advice.risk === 'high' && (
                                                    <Button
                                                        fullWidth
                                                        variant="contained"
                                                        color="error"
                                                        onClick={() => alert("🚨 SIMULATED: Contacting Emergency Services 911...")}
                                                        startIcon={<Phone size={18} />}
                                                        sx={{
                                                            mt: 2,
                                                            py: 1.5,
                                                            fontWeight: 800,
                                                            textTransform: 'uppercase',
                                                            letterSpacing: 1,
                                                            boxShadow: `0 8px 24px ${theme.palette.error.main}40`
                                                        }}
                                                    >
                                                        Initiate Emergency Call
                                                    </Button>
                                                )}
                                            </Box>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* History Section */}
                                <Collapse in={showHistory}>
                                    <Box sx={{ mt: 3, pt: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
                                        <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 2, display: 'block' }}>
                                            Recent Sessions
                                        </Typography>
                                        {history.length === 0 ? (
                                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3, fontStyle: 'italic' }}>
                                                No prior logs saved
                                            </Typography>
                                        ) : (
                                            <List sx={{ maxHeight: 200, overflowY: 'auto', p: 0 }}>
                                                {history.map((entry) => (
                                                    <ListItem
                                                        key={entry.id}
                                                        sx={{
                                                            mb: 1,
                                                            p: 1.5,
                                                            bgcolor: theme.palette.action.hover,
                                                            borderRadius: 2,
                                                            border: `1px solid ${theme.palette.divider}`,
                                                            '&:hover': { bgcolor: theme.palette.action.selected }
                                                        }}
                                                    >
                                                        <ListItemText
                                                            primary={
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                                        {entry.timestamp}
                                                                    </Typography>
                                                                    <Chip
                                                                        label={entry.advice.risk}
                                                                        size="small"
                                                                        sx={{
                                                                            height: 18,
                                                                            fontSize: '0.6rem',
                                                                            bgcolor: getRiskColor(entry.advice.risk),
                                                                            color: 'white',
                                                                            fontWeight: 700
                                                                        }}
                                                                    />
                                                                </Box>
                                                            }
                                                            secondary={
                                                                <Typography variant="body2" sx={{
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    display: '-webkit-box',
                                                                    WebkitLineClamp: 2,
                                                                    WebkitBoxOrient: 'vertical'
                                                                }}>
                                                                    "{entry.text}"
                                                                </Typography>
                                                            }
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        )}
                                    </Box>
                                </Collapse>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Pulse Button */}
            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    sx={{
                        width: 64,
                        height: 64,
                        minWidth: 64,
                        borderRadius: '50%',
                        background: isOpen
                            ? theme.palette.grey[800]
                            : `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
                        color: 'white',
                        boxShadow: `0 10px 30px ${theme.palette.error.main}60`,
                        position: 'relative',
                        '&:hover': {
                            background: isOpen
                                ? theme.palette.grey[700]
                                : `linear-gradient(135deg, ${theme.palette.error.dark} 0%, ${theme.palette.error.main} 100%)`,
                        },
                        transition: 'all 0.3s ease'
                    }}
                >
                    {isOpen ? <Close size={28} /> : <Mic size={28} />}
                    {!isOpen && (
                        <motion.div
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                borderRadius: '50%',
                                background: theme.palette.error.main,
                                zIndex: -1
                            }}
                        />
                    )}
                </Button>
            </motion.div>
        </Box>
    );
};

export default MedAlertPanel;
