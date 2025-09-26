import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Odin } from './components/Odin.jsx';
import AzureVoiceService from './services/azureVoiceService.js';
import './App.css';

function App() {
    const [odinStatus, setOdinStatus] = useState('idle');
    const [odinColor, setOdinColor] = useState('BLUE');
    const [showModal, setShowModal] = useState(false);
    const [isVoiceActive, setIsVoiceActive] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);

    const voiceServiceRef = useRef(null);

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [showModal]);

    // Initialize voice service
    useEffect(() => {
        const initVoice = async () => {
            try {
                const voiceService = new AzureVoiceService();

                // Set up event handlers
                voiceService.setOnStatusChange((status) => {
                    console.log('Voice status:', status);
                    switch (status) {
                        case 'connecting':
                            setOdinStatus('thinking');
                            setIsConnecting(true);
                            break;
                        case 'connected':
                            setOdinStatus('idle');
                            setIsVoiceActive(true);
                            setIsConnecting(false);
                            break;
                        case 'listening':
                            setOdinStatus('listening');
                            break;
                        case 'thinking':
                            setOdinStatus('thinking');
                            break;
                        case 'speaking':
                            setOdinStatus('speaking');
                            break;
                        case 'disconnected':
                            setOdinStatus('idle');
                            setIsVoiceActive(false);
                            setIsConnecting(false);
                            break;
                        default:
                            setOdinStatus('idle');
                    }
                });

                voiceService.setOnTranscriptUpdate((delta, role) => {
                    setTranscript(prev => prev + delta);
                });

                voiceService.setOnError((err) => {
                    console.error('Voice service error:', err);
                    setError(err.message);
                    setOdinStatus('idle');
                    setIsConnecting(false);
                    setIsVoiceActive(false);
                });

                voiceServiceRef.current = voiceService;

            } catch (err) {
                console.error('Failed to initialize voice service:', err);
                setError('Failed to initialize voice service');
            }
        };

        initVoice();

        // Cleanup on unmount
        return () => {
            if (voiceServiceRef.current) {
                voiceServiceRef.current.disconnect();
            }
        };
    }, []);

    const openModal = async () => {
        setShowModal(true);
        setError(null);
        setTranscript('');

        try {
            if (voiceServiceRef.current && !isVoiceActive) {
                setIsConnecting(true);
                const initialized = await voiceServiceRef.current.initialize();
                if (initialized) {
                    // Automatically start listening after connection
                    setTimeout(() => {
                        voiceServiceRef.current.startListening();
                    }, 1000);
                } else {
                    setError('Failed to connect to voice service');
                    setIsConnecting(false);
                }
            } else if (voiceServiceRef.current && isVoiceActive) {
                voiceServiceRef.current.startListening();
            }
        } catch (err) {
            console.error('Failed to start voice:', err);
            setError('Failed to start voice chat');
            setIsConnecting(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setTranscript('');
        setError(null);

        if (voiceServiceRef.current) {
            voiceServiceRef.current.disconnect();
        }

        setIsVoiceActive(false);
        setOdinStatus('idle');
        setIsConnecting(false);
    };


    return (
        <div className="app">
            {/* Main Landing Page */}
            <div className="relative z-10 flex flex-col items-center justify-center text-white">

                {/* Welcome Title */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >

                    {/* Animated Sparkle Button */}
                    <button className="button" onClick={openModal}>
                        <div className="dots_border"></div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="sparkle"
                        >
                            <path
                                className="path"
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                stroke="#ffffff"
                                fill="#ffffff"
                                d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z"
                            />
                            <path
                                className="path"
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                stroke="#ffffff"
                                fill="#ffffff"
                                d="M6 14.25L5.741 15.285C5.59267 15.8785 5.28579 16.4206 4.85319 16.8532C4.42059 17.2858 3.87853 17.5927 3.285 17.741L2.25 18L3.285 18.259C3.87853 18.4073 4.42059 18.7142 4.85319 19.1468C5.28579 19.5794 5.59267 20.1215 5.741 20.715L6 21.75L6.259 20.715C6.40725 20.1216 6.71398 19.5796 7.14639 19.147C7.5788 18.7144 8.12065 18.4075 8.714 18.259L9.75 18L8.714 17.741C8.12065 17.5925 7.5788 17.2856 7.14639 16.853C6.71398 16.4204 6.40725 15.8784 6.259 15.285L6 14.25Z"
                            />
                            <path
                                className="path"
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                stroke="#ffffff"
                                fill="#ffffff"
                                d="M6.5 4L6.303 4.5915C6.24777 4.75718 6.15472 4.90774 6.03123 5.03123C5.90774 5.15472 5.75718 5.24777 5.5915 5.303L5 5.5L5.5915 5.697C5.75718 5.75223 5.90774 5.84528 6.03123 5.96877C6.15472 6.09226 6.24777 6.24282 6.303 6.4085L6.5 7L6.697 6.4085C6.75223 6.24282 6.84528 6.09226 6.96877 5.96877C7.09226 5.84528 7.24282 5.75223 7.4085 5.697L8 5.5L7.4085 5.303C7.24282 5.24777 7.09226 5.15472 6.96877 5.03123C6.84528 4.90774 6.75223 4.75718 6.697 4.5915L6.5 4Z"
                            />
                        </svg>
                        <span className="text_button">Try Helly!</span>
                    </button>
                </motion.div>
            </div>

            {/* Modal Popup with Odin Orb */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 "
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={closeModal}
                    >
                        {/* Backdrop */}
                        <div className="fixed z-10 bg-slate-900/75 backdrop-blur-3xl w-svw h-[200vh]" />

                        {/* Modal Container */}
                        <motion.div
                            className="fixed z-20 bottom-full max-[479px]:bottom-auto bg-slate-800/95 backdrop-blur-sm border border-slate-600/30 rounded-3xl p-8 max-w-lg w-full shadow-2xl "
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", duration: 0.4 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={closeModal}
                                className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors duration-200 z-10"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Modal Content */}
                            <div className="text-center">

                                {/* Odin Orb Container */}
                                <div className="relative mb-8 flex justify-center">

                                    {/* Odin Component */}
                                    <div className="relative z-10">
                                        <Odin
                                            status={odinStatus}
                                            color={odinColor}
                                            className="h-48 w-48 sm:h-32 sm:w-32"
                                            onLoad={() => console.log('Helly is ready!')}
                                        />
                                    </div>

                                </div>

                                {/* Text Content */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                >
                                    <h2 className="text-3xl font-bold text-white mb-3 bottom-2 dm-sans-700">
                                        Hello! I'm Helly
                                    </h2>
                                    <p className="text-slate-300 mb-6 leading-relaxed text-sm dm-sans-500">
                                        Your 24/7 AI solution for clinical trial enrollment. I streamline the process
                                        by handling reception, automated scheduling, and patient outreach.
                                    </p>

                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;