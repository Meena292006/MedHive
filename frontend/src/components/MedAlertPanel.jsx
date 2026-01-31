import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Mic, Square, AlertCircle, Phone, List, X, MessageSquare, Activity, ShieldAlert, Droplets } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MedAlertPanel = () => {
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
            const response = await axios.post('http://localhost:5000/api/medalert/analyze', {
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

    return (
        <div className="fixed bottom-8 right-8 z-[9999]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4 bg-[#1A3A4A]/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 w-[380px] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-5 flex items-center justify-between border-b border-white/5 bg-gradient-to-r from-red-500/10 to-transparent">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-500 rounded-xl shadow-lg shadow-red-500/20">
                                    <Activity size={18} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black text-white uppercase tracking-widest">MedAlert AI</h2>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Ready to Hear</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => setShowHistory(!showHistory)} className="p-2 text-gray-400 hover:text-white transition-colors">
                                    <List size={18} />
                                </button>
                                <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-white transition-colors">
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Voice Interaction Area */}
                            <div className="flex flex-col items-center gap-5 mb-8">
                                <div className="relative">
                                    {isListening && (
                                        <>
                                            <motion.div
                                                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="absolute inset-0 rounded-full bg-red-500"
                                            />
                                            <motion.div
                                                animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0, 0.2] }}
                                                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                                className="absolute inset-0 rounded-full bg-red-500"
                                            />
                                        </>
                                    )}
                                    <button
                                        onClick={toggleListening}
                                        className={`w-24 h-24 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-500 relative z-10 ${isListening
                                            ? "bg-gray-900 ring-4 ring-red-500/20"
                                            : "bg-gradient-to-br from-red-500 via-red-600 to-red-700 hover:scale-105 active:scale-95 border-4 border-white/10"
                                            }`}
                                    >
                                        {isListening ? (
                                            <div className="flex gap-1 items-end h-6">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <motion.div
                                                        key={i}
                                                        animate={{ height: [8, 24, 8] }}
                                                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                                                        className="w-1 bg-white rounded-full"
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <Mic size={40} strokeWidth={2.5} />
                                        )}
                                    </button>
                                </div>

                                <div className="text-center">
                                    <p className="text-lg font-bold text-white mb-1">
                                        {isListening ? "Listening..." : "Emergency Voice Assistant"}
                                    </p>
                                    <p className="text-xs text-gray-400 font-medium px-10">
                                        {isListening ? "Stop when you're done speaking" : "Describe your symptoms and AI will analyze risk level instantly"}
                                    </p>
                                </div>
                            </div>

                            {/* Response Area */}
                            <AnimatePresence mode="wait">
                                {(transcript || loading) && !advice && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-5 bg-black/30 rounded-2xl border border-white/5 mb-4"
                                    >
                                        <div className="flex items-center gap-2 mb-3">
                                            <MessageSquare size={12} className="text-red-500" />
                                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Live Transcript</span>
                                        </div>
                                        <p className="text-gray-200 italic text-sm leading-relaxed">
                                            {transcript ? `"${transcript}"` : "Analyzing speech patterns..."}
                                        </p>
                                        {loading && (
                                            <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    animate={{ x: [-100, 400] }}
                                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                                    className="h-full w-1/3 bg-red-500 rounded-full"
                                                />
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {advice && !loading && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-3"
                                    >
                                        {[
                                            { label: 'General', data: advice.general, icon: ShieldAlert },
                                            { label: 'Heart', data: advice.heart, icon: Activity },
                                            { label: 'Diabetes', data: advice.diabetes, icon: Droplets }
                                        ].map((item, idx) => (
                                            <div key={idx} className={`p-4 rounded-xl border flex items-center gap-3 ${item.data.risk === 'high' ? 'bg-red-500/20 border-red-500/30' :
                                                item.data.risk === 'elevated' ? 'bg-orange-500/20 border-orange-500/30' :
                                                    'bg-green-500/20 border-green-500/30'
                                                }`}>
                                                <div className={`p-2 rounded-lg ${item.data.risk === 'high' ? 'bg-red-500' :
                                                    item.data.risk === 'elevated' ? 'bg-orange-500' :
                                                        'bg-green-500'
                                                    }`}>
                                                    <item.icon size={16} className="text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest">{item.label}</h4>
                                                    <p className="text-white font-bold text-xs truncate">{item.data.title}</p>
                                                </div>
                                                <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${item.data.risk === 'high' ? 'bg-red-500 text-white' :
                                                    item.data.risk === 'elevated' ? 'bg-orange-500 text-white' :
                                                        'bg-green-500 text-white'
                                                    }`}>
                                                    {item.data.risk}
                                                </div>
                                            </div>
                                        ))}

                                        {advice.risk === 'high' && (
                                            <button
                                                onClick={() => alert("🚨 SIMULATED: Contacting Emergency Services 911...")}
                                                className="mt-4 w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-red-500/20 active:scale-[0.98] uppercase text-xs tracking-widest"
                                            >
                                                <Phone size={18} fill="currentColor" />
                                                Initiate Emergency Call
                                            </button>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* History Section */}
                            {showHistory && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-6 border-t border-white/5 pt-5"
                                >
                                    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Recent Sessions</h3>
                                    {history.length === 0 ? (
                                        <p className="text-center text-gray-500 py-6 text-xs italic">No prior logs saved</p>
                                    ) : (
                                        <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                            {history.map((entry) => (
                                                <div key={entry.id} className="p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-red-500/20 transition-all">
                                                    <div className="flex justify-between text-[9px] text-gray-500 mb-2 font-bold opacity-60">
                                                        <span>{entry.timestamp}</span>
                                                        <span className={entry.advice.risk === 'high' ? 'text-red-500' : 'text-green-500'}>
                                                            {entry.advice.risk.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-300 text-xs line-clamp-2 leading-relaxed">"{entry.text}"</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Pulse Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-[0_10px_30px_rgba(239,68,68,0.4)] transition-all duration-300 ${isOpen
                    ? "bg-gray-800 rotate-90"
                    : "bg-gradient-to-br from-red-500 to-red-600"
                    }`}
            >
                {isOpen ? <X size={28} /> : <Mic size={28} />}
                {!isOpen && (
                    <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-red-500 z-[-1]"
                    />
                )}
            </motion.button>
        </div>
    );
};

export default MedAlertPanel;
