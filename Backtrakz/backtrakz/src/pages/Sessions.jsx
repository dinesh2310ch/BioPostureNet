import { useState, useEffect, useRef } from "react";
import { ref, onValue, set, update, query, orderByChild } from "firebase/database";
import { db } from "../services/firebase";
import Header from "../components/Header";
import Calibration from "./Calibration";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CircularProgress = ({ progress }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <svg className="w-40 h-40" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r={radius} className="stroke-gray-200" strokeWidth="10" fill="transparent" />
            <motion.circle
                cx="60" cy="60" r={radius} className="stroke-blue-600"
                strokeWidth="10" fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1, ease: "linear" }}
            />
        </svg>
    );
};


export default function Sessions() {
    const navigate = useNavigate();
    const username = localStorage.getItem("loggedInUser") || "Unknown User";

    const [hasCalibration, setHasCalibration] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showTimerModal, setShowTimerModal] = useState(false);
    const [selectedTime, setSelectedTime] = useState(30);
    const [sessionStatus, setSessionStatus] = useState("idle");
    const [sessionTime, setSessionTime] = useState(0);
    const [history, setHistory] = useState([]);
    const [sensorStatus, setSensorStatus] = useState(null);
    
    // States for the Feedback Modal
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [painFelt, setPainFelt] = useState(null);
    const [painLevel, setPainLevel] = useState(5);
    const [feedbackText, setFeedbackText] = useState("");

    const sessionTimerRef = useRef(null);

    // useEffect for calibration check
    useEffect(() => {
        if (!username) return;
        const calibrationRef = ref(db, `calibration/${username}`);
        const unsubscribe = onValue(calibrationRef, (snapshot) => {
            setHasCalibration(!!snapshot.val());
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [username]);

    // useEffect for main sensor status check
    useEffect(() => {
        if (!username) return;
        const sensorStateRef = ref(db, `sensor/${username}`);
        const unsubscribe = onValue(sensorStateRef, (snapshot) => {
            setSensorStatus(snapshot.val()?.status || 'off');
        });
        return () => unsubscribe();
    }, [username]);

    // useEffect to redirect if sensor is off
    useEffect(() => {
        if (sensorStatus === 'off') {
            alert("Your sensor is disconnected. Please turn it on from the Home page first.");
            navigate('/home');
        }
    }, [sensorStatus, navigate]);

    // Simplified useEffect to load history
    useEffect(() => {
        if (!username) return;
        const historyRef = query(ref(db, `history/${username}`), orderByChild('sessionEndTime'));
        const unsubscribe = onValue(historyRef, (snapshot) => {
            const data = snapshot.val() || {};
            const historyList = Object.keys(data)
                .map(key => ({ id: key, ...data[key] }))
                .sort((a, b) => new Date(b.sessionEndTime) - new Date(a.sessionEndTime));
            setHistory(historyList);
        });
        return () => unsubscribe();
    }, [username]);

    // useEffect for managing the live session state
    useEffect(() => {
        if (!username) return;
        const sessionRef = ref(db, `sensorStatus/${username}`);
        const unsubscribe = onValue(sessionRef, (snapshot) => {
            const data = snapshot.val();
            if (data?.status === "active") {
                setSessionStatus("active");
                setSelectedTime(data.duration);
                setSessionTime(data.sessionTime || 0);
                if (!sessionTimerRef.current) {
                    startTimer(data.duration, data.sessionTime || 0);
                }
            } else {
                setSessionStatus("idle");
                if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
                sessionTimerRef.current = null;
            }
        });
        return () => {
            unsubscribe();
            if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
        };
    }, [username]);

    const startTimer = (durationMinutes, startFromSeconds = 0) => {
        if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
        const totalSeconds = durationMinutes * 60;
        sessionTimerRef.current = setInterval(() => {
            setSessionTime(prev => {
                const newTime = prev + 1;
                if (newTime >= totalSeconds) {
                    endSession(totalSeconds);
                    return totalSeconds;
                }
                return newTime;
            });
        }, 1000);
        setSessionTime(startFromSeconds);
    };

    const confirmStartSession = () => {
        setShowTimerModal(false);
        set(ref(db, `sensorStatus/${username}`), {
            status: "active", username, duration: selectedTime, sessionTime: 0,
            startTime: new Date().toISOString()
        });
    };

    const endSession = (finalTime = sessionTime) => {
        if (sessionTimerRef.current) {
            clearInterval(sessionTimerRef.current);
            sessionTimerRef.current = null;
        }
        setSessionStatus("completed");
        setTimeout(() => setSessionStatus("idle"), 2000);
        update(ref(db, `sensorStatus/${username}`), {
            status: "completed", sessionTime: finalTime,
            endTime: new Date().toISOString()
        });
        setTimeout(() => { setShowFeedbackModal(true); }, 2000);
    };

    const handleFeedbackSubmit = () => {
        if (!history || history.length === 0) {
            console.error("Cannot submit feedback, history is not available.");
            setShowFeedbackModal(false);
            return;
        }
        const latestSessionId = history[0].id;
        const feedbackData = {
            painLevel: painFelt === 'yes' ? painLevel : 0,
            feedback: feedbackText,
        };
        update(ref(db, `history/${username}/${latestSessionId}`), feedbackData);
        setShowFeedbackModal(false);
        setPainFelt(null);
        setPainLevel(5);
        setFeedbackText("");
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    const calculateScore = (session) => {
        const total = (session.goodCount || 0) + (session.moderateCount || 0) + (session.badCount || 0);
        return total > 0 ? Math.round(((session.goodCount || 0) / total) * 100) : 0;
    };

    if (isLoading || sensorStatus === null) {
        return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center"><p>Loading...</p></div>;
    }
    if (!hasCalibration) {
        return <Calibration />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-6">
            <Header />
            <div className="max-w-4xl mx-auto mt-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Monitoring Sessions</h1>
                    <p className="text-gray-600 mb-6">Manage and track your posture monitoring sessions.</p>
                </motion.div>
                
                <motion.div layout className="bg-white rounded-2xl p-6 shadow-md mb-8 flex flex-col items-center text-center">
                    <AnimatePresence mode="wait">
                        {sessionStatus !== "active" ? (
                            <motion.div key="start" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Ready to improve your posture?</h2>
                                <motion.button onClick={() => setShowTimerModal(true)} className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    Start New Session
                                </motion.button>
                            </motion.div>
                        ) : (
                            <motion.div key="active" className="w-full flex flex-col items-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                                <div className="relative mb-4">
                                    <CircularProgress progress={(sessionTime / (selectedTime * 60)) * 100} />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <p className="text-4xl font-bold text-blue-600">{formatTime(sessionTime)}</p>
                                        <p className="text-sm text-gray-500">of {selectedTime} min</p>
                                    </div>
                                </div>
                                <div className="text-green-600 font-medium mb-4 flex items-center">
                                    <span className="relative flex h-3 w-3 mr-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                    </span>
                                    Session Active
                                </div>
                                <motion.button onClick={() => endSession()} className="bg-red-500 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-red-600 transition" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    End Session
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
                
                <motion.div className="bg-white rounded-2xl p-6 shadow-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{delay: 0.2}}>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Session History</h2>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        {history.length > 0 ? history.slice(0, 5).map(session => (
                            <div key={session.id} className="p-4 border rounded-lg flex justify-between items-center bg-gray-50">
                                <div>
                                    <p className="font-semibold text-gray-700">{new Date(session.sessionEndTime.slice(0,-1)).toLocaleDateString()}</p>
                                    <p className="text-sm text-gray-500">{formatTime(session.durationSeconds || 0)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Score</p>
                                    <p className="font-bold text-lg text-blue-600">{calculateScore(session)}%</p>
                                </div>
                            </div>
                        )) : <p className="text-center text-gray-500 py-4">No completed sessions yet.</p>}
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {showTimerModal && (
                    <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                        <motion.div className="bg-white rounded-2xl p-6 w-full max-w-sm" initial={{y: 50, opacity:0}} animate={{y:0, opacity:1}} exit={{y:50, opacity:0}}>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Select Session Duration</h3>
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {[1, 10, 20, 30, 45, 60, 90].map((time) => (
                                    <button key={time} onClick={() => setSelectedTime(time)} className={`py-3 rounded-lg border-2 font-semibold transition ${selectedTime === time ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-700 hover:border-blue-300"}`}>{time} min</button>
                                ))}
                            </div>
                            <div className="flex space-x-3">
                                <button onClick={() => setShowTimerModal(false)} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">Cancel</button>
                                <button onClick={confirmStartSession} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Start</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showFeedbackModal && (
                    <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className="bg-white rounded-2xl p-6 w-full max-w-sm" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Session Feedback</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="font-semibold text-gray-700 mb-2">Did you feel any back pain?</p>
                                    <div className="flex gap-3">
                                        <button onClick={() => setPainFelt('no')} className={`flex-1 py-2 rounded-lg border-2 font-semibold transition ${painFelt === 'no' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200'}`}>No</button>
                                        <button onClick={() => setPainFelt('yes')} className={`flex-1 py-2 rounded-lg border-2 font-semibold transition ${painFelt === 'yes' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200'}`}>Yes</button>
                                    </div>
                                </div>
                                <AnimatePresence>
                                    {painFelt === 'yes' && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                            <p className="font-semibold text-gray-700 mb-2">How much? <span className="font-bold text-blue-600">{painLevel}</span>/10</p>
                                            <input type="range" min="1" max="10" value={painLevel} onChange={(e) => setPainLevel(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <div>
                                    <p className="font-semibold text-gray-700 mb-2">Any other feedback? (Optional)</p>
                                    <textarea value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} rows="3" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="e.g., I felt a strain in my lower back..." />
                                </div>
                            </div>
                            <div className="mt-6">
                                <button onClick={handleFeedbackSubmit} disabled={painFelt === null} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed">
                                    Submit Feedback
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}