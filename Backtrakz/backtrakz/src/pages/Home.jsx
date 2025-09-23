import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { ref, onValue, update } from "firebase/database";
import { db } from "../services/firebase";
import { motion } from "framer-motion";

// --- Import your icons ---
import historyIcon from "../assets/history-icon.png";
import goalsIcon from "../assets/goals-icon.png";
import sessionsIcon from "../assets/sessions-icon.png";
import alertsIcon from "../assets/alerts-icon.png";
import profileIcon from "../assets/profile-icon.png";
import liveMonitoringIcon from "../assets/live-monitoring-icon.png"; // Make sure this icon exists
import Header from "../components/Header";

// Reusable component for animated number counters
const AnimatedStat = ({ value, unit }) => {
    return (
        <motion.span
            key={value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-800"
        >
            {value}
            <span className="text-2xl">{unit}</span>
        </motion.span>
    );
};

// Reusable animated toggle switch
const AnimatedToggle = ({ checked, onChange }) => {
    return (
        <div
            className={`w-12 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors ${checked ? "bg-blue-600 justify-end" : "bg-gray-300 justify-start"
                }`}
            onClick={onChange}
        >
            <motion.div
                className="w-5 h-5 bg-white rounded-full shadow-md"
                layout
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
            />
        </div>
    );
};


export default function Home() {
    const navigate = useNavigate();
    const location = useLocation();
    const username = location.state?.username || localStorage.getItem("loggedInUser");

    // State for Quick Stats and System Status
    const [sensorStatus, setSensorStatus] = useState("off");
    const [sessionTime, setSessionTime] = useState(0);
    const [goodPosture, setGoodPosture] = useState(0);
    const [weeklyAvg, setWeeklyAvg] = useState(0);
    const [alertsToday, setAlertsToday] = useState(0);

    // State for the Performance Overview chart
    const [historyData, setHistoryData] = useState([]); // Raw history data
    const [chartTimeframe, setChartTimeframe] = useState('weekly'); // 'weekly' or 'monthly'
    const [performanceChartData, setPerformanceChartData] = useState([]); // Processed data for the chart

    // --- useEffect hooks for data fetching ---
    useEffect(() => {
        if (!username) { navigate('/login'); return; }
        const statusRef = ref(db, `sensor/${username}`);
        const unsubscribe = onValue(statusRef, (snapshot) => {
            const data = snapshot.val();
            if (data?.status) setSensorStatus(data.status);
        });
        return () => unsubscribe();
    }, [username, navigate]);

    // This useEffect fetches history and calculates Quick Stats
    useEffect(() => {
        if (!username) return;
        const historyRef = ref(db, `history/${username}`);
        const unsubscribe = onValue(historyRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) {
                setSessionTime(0); setGoodPosture(0); setWeeklyAvg(0); setHistoryData([]);
                return;
            }
            const sessions = Object.values(data);
            setHistoryData(sessions); // Store raw history for the chart processing useEffect

            let totalDuration = 0, totalGood = 0, totalCount = 0;
            const now = new Date();
            const weekAgo = new Date();
            weekAgo.setDate(now.getDate() - 7);
            let weeklyGoodPct = [];

            sessions.forEach((session) => {
                totalDuration += session.durationSeconds || 0;
                const g = session.goodCount || 0;
                const m = session.moderateCount || 0;
                const b = session.badCount || 0;
                totalGood += g;
                totalCount += g + m + b;

                if (session.sessionEndTime) {
                    const end = new Date(session.sessionEndTime);
                    if (end >= weekAgo && end <= now) {
                        const sessionTotal = (session.goodCount || 0) + (session.moderateCount || 0) + (session.badCount || 0);
                        if (sessionTotal > 0) weeklyGoodPct.push(((session.goodCount || 0) / sessionTotal) * 100);
                    }
                }
            });

            setSessionTime(totalDuration);
            if (totalCount > 0) setGoodPosture(Number(((totalGood / totalCount) * 100).toFixed(0)));
            if (weeklyGoodPct.length > 0) {
                const avg = weeklyGoodPct.reduce((a, b) => a + b, 0) / weeklyGoodPct.length;
                setWeeklyAvg(Number(avg.toFixed(0)));
            } else {
                setWeeklyAvg(0);
            }
        });
        return () => unsubscribe();
    }, [username]);

    // This useEffect processes the history data for the chart whenever the timeframe changes
    useEffect(() => {
        const processDataForChart = (sessions, timeframe) => {
            const now = new Date();
            const startDate = new Date();
            startDate.setDate(now.getDate() - (timeframe === 'weekly' ? 7 : 30));

            const recentSessions = sessions.filter(s => new Date(s.sessionEndTime) >= startDate);
            const dailyData = {};

            recentSessions.forEach(s => {
                const day = new Date(s.sessionEndTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                if (!dailyData[day]) {
                    dailyData[day] = { scores: [], distances: [], pitches: [], rolls: [], date: new Date(s.sessionEndTime) };
                }
                const total = (s.goodCount || 0) + (s.moderateCount || 0) + (s.badCount || 0);
                dailyData[day].scores.push(total > 0 ? ((s.goodCount || 0) / total) * 100 : 0);
                dailyData[day].distances.push(s.averageDistance || 0);
                dailyData[day].pitches.push(s.averagePitch || 0);
                dailyData[day].rolls.push(s.averageRoll || 0);
            });

            const processedData = Object.keys(dailyData).map(day => {
                const data = dailyData[day];
                return {
                    name: day,
                    date: data.date,
                    score: data.scores.reduce((a, b) => a + b, 0) / data.scores.length,
                    distance: data.distances.reduce((a, b) => a + b, 0) / data.distances.length,
                    pitch: data.pitches.reduce((a, b) => a + b, 0) / data.pitches.length,
                    roll: data.rolls.reduce((a, b) => a + b, 0) / data.rolls.length,
                };
            }).sort((a, b) => a.date - b.date);

            setPerformanceChartData(processedData);
        };

        processDataForChart(historyData, chartTimeframe);
    }, [historyData, chartTimeframe]);

    useEffect(() => {
        if (!username) return;
        const alertsRef = ref(db, `notifications/${username}`);
        const unsubscribe = onValue(alertsRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) { setAlertsToday(0); return; }
            const today = new Date();
            const todayMD = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            let count = 0;
            Object.values(data).forEach((alert) => {
                if (alert.timestamp?.startsWith(todayMD)) count++;
            });
            setAlertsToday(count);
        });
        return () => unsubscribe();
    }, [username]);

    // --- Helper functions and handlers ---
    const formatSessionTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    };
    const toggleSensorStatus = async () => {
        const newStatus = sensorStatus === "on" ? "off" : "on";
        try {
            await update(ref(db, `sensor/${username}`), {
                status: newStatus,
                lastUpdate: new Date().toISOString(),
            });
        } catch (err) {
            console.error("Failed to update sensor status:", err);
        }
    };
    const handleLogout = async () => {
        if (username) {
            try {
                await update(ref(db, `loginchecking/${username}`), {
                    logoutTime: Date.now(),
                });
            } catch (err) {
                console.error("Failed to update logout time:", err);
            }
        }
        localStorage.removeItem("loggedInUser");
        navigate("/login");
    };

    const navButtons = [
        { icon: liveMonitoringIcon, label: "Live-Monitroing", path: "/live-monitoring" },
        { icon: historyIcon, label: "History", path: "/history" },
        { icon: goalsIcon, label: "Goals", path: "/goals" },
        { icon: sessionsIcon, label: "Sessions", path: "/sessions" },
        { icon: alertsIcon, label: "Alerts", path: "/alerts" },
        { icon: profileIcon, label: "Profile", path: "/profile" },
    ];
    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5 } } };
    const chartTabs = ['Last 7 Days', 'Last 30 Days'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-6 flex flex-col">
            <Header />
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <motion.div variants={itemVariants} className="mb-6">
                    <h1 className="text-3xl font-extrabold text-[#1E52F1]">Welcome, {username}</h1>
                    <p className="text-sm text-black mt-1">Monitor and improve your posture with AI Insights</p>
                </motion.div>
                <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 mb-6">
                    {navButtons.map((btn) => (
                        <motion.button
                            key={btn.label}
                            onClick={() => navigate(btn.path)}
                            className="bg-white rounded-xl p-3 flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-shadow border border-gray-100"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <img src={btn.icon} alt={btn.label} className="h-8 w-8 mb-2" />
                            <span className="text-xs font-semibold text-gray-700">{btn.label}</span>
                        </motion.button>
                    ))}
                </motion.div>
                
                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-4 md:p-6 shadow-md border border-gray-100 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Performance Overview</h2>
                        <div className="flex space-x-1 border border-gray-200 bg-gray-50 rounded-lg p-1">
                            <button onClick={() => setChartTimeframe('weekly')} className={`px-3 py-1 text-sm font-semibold relative rounded-md transition-colors ${chartTimeframe === 'weekly' ? 'text-blue-700' : 'text-gray-500'}`}>
                                {chartTimeframe === 'weekly' && <motion.div className="absolute inset-0 bg-white rounded-md shadow-sm" layoutId="chart-tab" />}
                                <span className="relative z-10">Last 7 Days</span>
                            </button>
                            <button onClick={() => setChartTimeframe('monthly')} className={`px-3 py-1 text-sm font-semibold relative rounded-md transition-colors ${chartTimeframe === 'monthly' ? 'text-blue-700' : 'text-gray-500'}`}>
                                {chartTimeframe === 'monthly' && <motion.div className="absolute inset-0 bg-white rounded-md shadow-sm" layoutId="chart-tab" />}
                                <span className="relative z-10">Last 30 Days</span>
                            </button>
                        </div>
                    </div>
                    <div className="h-80">
                        {performanceChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={performanceChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis yAxisId="left" label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 12 }} domain={[0, 100]} />
                                    <YAxis yAxisId="right" orientation="right" label={{ value: 'Value (cm, °)', angle: 90, position: 'insideRight' }} tick={{ fontSize: 12 }} />
                                    <Tooltip contentStyle={{ borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", border: "none" }} />
                                    <Legend wrapperStyle={{fontSize: "12px"}}/>
                                    <Bar dataKey="score" yAxisId="left" name="Posture Score" fill="#8884d8" barSize={20} />
                                    <Line type="monotone" yAxisId="right" dataKey="distance" name="Distance" stroke="#82ca9d" strokeWidth={2}/>
                                    <Line type="monotone" yAxisId="right" dataKey="pitch" name="Pitch" stroke="#ffc658" strokeWidth={2}/>
                                    <Line type="monotone" yAxisId="right" dataKey="roll" name="Roll" stroke="#ff8042" strokeWidth={2}/>
                                </ComposedChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                <p>Not enough session data for this timeframe.</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-4 md:p-6 shadow-md border border-gray-100 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Stats</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-xl"><p className="text-sm text-blue-800 font-medium">Session Time</p><p className="text-3xl font-bold text-gray-800">{formatSessionTime(sessionTime)}</p></div>
                        <div className="bg-amber-50 p-4 rounded-xl"><p className="text-sm text-amber-800 font-medium">Alerts Today</p><AnimatedStat value={alertsToday} unit="" /></div>
                        <div className="bg-green-50 p-4 rounded-xl"><p className="text-sm text-green-800 font-medium">Good Posture</p><AnimatedStat value={goodPosture} unit="%" /></div>
                        <div className="bg-purple-50 p-4 rounded-xl"><p className="text-sm text-purple-800 font-medium">Weekly Avg</p><AnimatedStat value={weeklyAvg} unit="%" /></div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-4 md:p-6 shadow-md border border-gray-100 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">System Status</h2>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center"><div className={`w-3 h-3 rounded-full mr-3 transition-colors ${sensorStatus === "on" ? "bg-green-500" : "bg-red-500"}`}></div><span className="text-gray-700 font-medium">IoT Sensor</span></div>
                        <div className="flex items-center gap-4"><span className={`font-semibold transition-colors ${sensorStatus === "on" ? "text-green-600" : "text-red-600"}`}>{sensorStatus === "on" ? "Connected" : "Disconnected"}</span><AnimatedToggle checked={sensorStatus === "on"} onChange={toggleSensorStatus} /></div>
                    </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="mt-auto pt-6">
                    <motion.button onClick={handleLogout} whileTap={{ scale: 0.98 }} className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition shadow-md">
                        Logout
                    </motion.button>
                </motion.div>
            </motion.div>
        </div>
    );
}