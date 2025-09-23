import { useState, useEffect } from "react";
import { ref, onValue, query, limitToLast } from "firebase/database";
import { db } from "../services/firebase";
import Header from "../components/Header";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// ✨ Helper to determine the color and icon for each posture status
const getPostureStyle = (posture) => {
    switch (posture) {
        case "good":
            return {
                color: "text-green-500",
                bgColor: "bg-green-50",
                icon: "😊",
                label: "Good Posture"
            };
        case "moderate":
            return {
                color: "text-yellow-500",
                bgColor: "bg-yellow-50",
                icon: "😐",
                label: "Moderate Posture"
            };
        case "bad":
            return {
                color: "text-red-500",
                bgColor: "bg-red-50",
                icon: "😞",
                label: "Bad Posture"
            };
        default:
            return {
                color: "text-gray-500",
                bgColor: "bg-gray-100",
                icon: "...",
                label: "Waiting for Data"
            };
    }
};

// ✨ Reusable component for the small live charts
const LiveChart = ({ data, dataKey, color }) => (
    <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                <Tooltip
                    contentStyle={{ borderRadius: '8px', fontSize: '12px', padding: '4px 8px' }}
                    labelStyle={{ display: 'none' }}
                />
                <Area type="monotone" dataKey={dataKey} stroke={color} fillOpacity={0.2} fill={color} strokeWidth={2} />
            </AreaChart>
        </ResponsiveContainer>
    </div>
);


export default function LiveMonitoring() {
    const username = localStorage.getItem("loggedInUser") || "Unknown User";
    const [liveData, setLiveData] = useState([]);
    const latestData = liveData[liveData.length - 1] || {};

    useEffect(() => {
        if (!username) return;

        // Listen to the last 20 data points from the 'posture' table
        const postureRef = query(ref(db, `posture/${username}`), limitToLast(20));
        
        const unsubscribe = onValue(postureRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const formattedData = Object.values(data).map(entry => ({
                    ...entry,
                    // Format timestamp for display on the chart if needed
                    time: entry.timestamp.split(' ')[1] // e.g., "02:54:49"
                }));
                setLiveData(formattedData);
            }
        });

        return () => unsubscribe();
    }, [username]);

    const postureStyle = getPostureStyle(latestData.posture);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-6">
            <Header />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Live Monitoring</h1>
                <p className="text-gray-600 mb-6">Real-time data stream from your sensor.</p>
            </motion.div>

            <div className="space-y-6">
                {/* Live Status Card */}
                <motion.div
                    layout
                    className={`bg-white rounded-2xl p-6 shadow-md border-t-4 ${
                        latestData.posture === 'good' ? 'border-green-400' :
                        latestData.posture === 'moderate' ? 'border-yellow-400' :
                        latestData.posture === 'bad' ? 'border-red-400' : 'border-gray-200'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Current Status</h2>
                        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${postureStyle.bgColor} ${postureStyle.color}`}>
                            ● Live
                        </span>
                    </div>
                    <div className="text-center my-4">
                        <motion.p key={latestData.posture} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-6xl mb-2">{postureStyle.icon}</motion.p>
                        <p className={`text-2xl font-bold ${postureStyle.color}`}>{postureStyle.label}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center border-t pt-4">
                        <div>
                            <p className="text-sm text-gray-500">Distance</p>
                            <p className="text-lg font-semibold text-gray-800">{latestData.distance?.toFixed(0) ?? '...'} cm</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Pitch</p>
                            <p className="text-lg font-semibold text-gray-800">{latestData.pitch?.toFixed(1) ?? '...'}°</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Roll</p>
                            <p className="text-lg font-semibold text-gray-800">{latestData.roll?.toFixed(1) ?? '...'}°</p>
                        </div>
                    </div>
                </motion.div>

                {/* Graphs Section */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="bg-white rounded-2xl p-4 shadow-md">
                        <h3 className="font-semibold text-gray-700 mb-2">Distance (cm)</h3>
                        <LiveChart data={liveData} dataKey="distance" color="#3b82f6" />
                    </div>
                     <div className="bg-white rounded-2xl p-4 shadow-md">
                        <h3 className="font-semibold text-gray-700 mb-2">Pitch (°)</h3>
                        <LiveChart data={liveData} dataKey="pitch" color="#10b981" />
                    </div>
                     <div className="bg-white rounded-2xl p-4 shadow-md">
                        <h3 className="font-semibold text-gray-700 mb-2">Roll (°)</h3>
                        <LiveChart data={liveData} dataKey="roll" color="#8b5cf6" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}