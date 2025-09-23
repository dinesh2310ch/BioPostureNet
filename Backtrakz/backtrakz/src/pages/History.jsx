
import { useState, useEffect } from "react";
import { ref, onValue, remove } from "firebase/database";
import { db } from "../services/firebase";
import Header from "../components/Header";
import { motion, AnimatePresence } from "framer-motion";

// This component is unchanged
const SessionDetailView = ({ session }) => {
    const details = [
        { label: "Good Posture Count", value: session.goodCount ?? 'N/A' },
        { label: "Moderate Posture Count", value: session.moderateCount ?? 'N/A' },
        { label: "Bad Posture Count", value: session.badCount ?? 'N/A' },
        { label: "Average Distance", value: `${session.averageDistance?.toFixed(1) ?? 'N/A'} cm` },
        { label: "Average Pitch", value: `${session.averagePitch?.toFixed(1) ?? 'N/A'} °` },
        { label: "Average Roll", value: `${session.averageRoll?.toFixed(1) ?? 'N/A'} °` },
        { label: "Pain Level After Session", value: session.painLevel ? `${session.painLevel}/10` : 'Not recorded' },
        { label: "User Feedback", value: session.feedback || 'Not recorded' },
    ];

    const formatDuration = (seconds) => {
        if (seconds < 60) return `${seconds}s`;
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    return (
        <motion.div
            className="mt-2 mb-4 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            <div className="bg-gray-50 rounded-lg p-4 border max-h-72 overflow-y-auto">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-700">Session Summary</h4>
                    <span className="text-sm font-semibold text-gray-700">
                        Duration: {formatDuration(session.durationSeconds)}
                    </span>
                </div>
                <table className="w-full text-sm text-left">
                    <tbody>
                        {details.map(detail => (
                            <tr key={detail.label} className="border-b border-gray-200 last:border-b-0">
                                <td className="py-2 pr-2 text-gray-600">{detail.label}</td>
                                <td className="py-2 font-medium text-gray-800 text-right">{detail.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};


const SessionCard = ({ session, onDelete, onClick, isSelected }) => {
    const { goodCount = 0, moderateCount = 0, badCount = 0, sessionEndTime } = session;
    const total = goodCount + moderateCount + badCount;
    const goodPercent = total > 0 ? (goodCount / total) * 100 : 0;
    const badPercent = total > 0 ? (badCount / total) * 100 : 0;

    // ✨ FIX: Create a date object by removing the 'Z' from the timestamp.
    // This forces the browser to interpret the time as local, not UTC.
    const localDate = new Date(sessionEndTime.slice(0, -1));

    return (
        <div
            onClick={() => onClick(session.id)}
            className={`bg-white rounded-xl p-4 shadow-md border transition-all cursor-pointer ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-100 hover:border-gray-300'}`}
        >
            <div className="flex justify-between items-start">
                <div>
                    {/* ✨ FIX: Use the new 'localDate' object for display */}
                    <p className="font-bold text-gray-800">{localDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    <p className="text-sm text-gray-500">{localDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="flex items-center gap-4">
                    <motion.button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(session.id);
                        }}
                        className="text-gray-400 hover:text-red-500 transition"
                        whileTap={{ scale: 0.9 }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </motion.button>
                </div>
            </div>
            <div className="mt-4">
                <p className="text-sm font-medium text-gray-600 mb-2">Posture Quality</p>
                <div className="w-full flex h-2 rounded-full overflow-hidden bg-gray-200">
                    <div className="bg-green-500" style={{ width: `${goodPercent}%` }} />
                    <div className="bg-yellow-500" style={{ width: `${100 - goodPercent - badPercent}%` }} />
                    <div className="bg-red-500" style={{ width: `${badPercent}%` }} />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>{Math.round(goodPercent)}% Good</span>
                    <span>{Math.round(badPercent)}% Bad</span>
                </div>
            </div>
        </div>
    );
};


// This component is unchanged
export default function History() {
    const username = localStorage.getItem("loggedInUser") || "Unknown User";
    const [sessions, setSessions] = useState([]);
    const [calibrations, setCalibrations] = useState([]);
    const [selectedTab, setSelectedTab] = useState('Sessions');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [selectedSessionId, setSelectedSessionId] = useState(null);

    const tabs = ['Sessions', 'Calibrations'];

    useEffect(() => {
        if (!username) return;

        const historyRef = ref(db, `history/${username}`);
        const unsubscribeHistory = onValue(historyRef, (snapshot) => {
            const data = snapshot.val() || {};
            const loadedSessions = Object.keys(data)
                .map((key) => ({ id: key, ...data[key] }))
                .filter(session => session.durationSeconds > 0)
                .sort((a, b) => new Date(b.sessionEndTime) - new Date(a.sessionEndTime));
            setSessions(loadedSessions);
        });

        const calibrationRef = ref(db, `calibration/${username}`);
        const requestRef = ref(db, `calibrationRequest/${username}`);

        let calibData = null;
        let reqData = null;

        const combineAndSetData = () => {
            if (calibData === undefined || reqData === undefined) return;
            if (calibData || reqData) {
                const combinedData = {
                    id: username,
                    ...(calibData || {}),
                    requestStatus: reqData?.request
                };
                setCalibrations([combinedData]);
            } else {
                setCalibrations([]);
            }
        };

        const unsubscribeCalibrations = onValue(calibrationRef, (snapshot) => {
            calibData = snapshot.val();
            combineAndSetData();
        });

        const unsubscribeRequests = onValue(requestRef, (snapshot) => {
            reqData = snapshot.val();
            combineAndSetData();
        });

        return () => {
            unsubscribeHistory();
            unsubscribeCalibrations();
            unsubscribeRequests();
        };
    }, [username]);

    const handleDelete = () => {
        if (!itemToDelete) return;

        if (selectedTab === 'Sessions') {
            const path = `history/${username}/${itemToDelete}`;
            remove(ref(db, path));
        } else if (selectedTab === 'Calibrations') {
            remove(ref(db, `calibration/${username}`));
            remove(ref(db, `calibrationRequest/${username}`));
        }
        
        setShowDeleteModal(false);
        setItemToDelete(null);
    };

    const confirmDelete = (id) => {
        setItemToDelete(id);
        setShowDeleteModal(true);
    };
    
    const handleSessionSelect = (sessionId) => {
        setSelectedSessionId(prevId => (prevId === sessionId ? null : sessionId));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-6">
            <Header />
            <motion.h1
                className="text-3xl font-bold mb-6 text-gray-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                History
            </motion.h1>

            <div className="flex space-x-2 mb-4 border-b border-gray-200">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setSelectedTab(tab)}
                        className={`px-4 py-2 text-sm font-medium relative transition-colors ${selectedTab === tab ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                        {tab}
                        {selectedTab === tab && (
                            <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" layoutId="underline" />
                        )}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedTab}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {selectedTab === 'Sessions' && (
                        sessions.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <p className="text-lg">⏱ No sessions recorded yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {sessions.map((session) => (
                                    <div key={session.id}>
                                        <SessionCard
                                            session={session}
                                            onDelete={confirmDelete}
                                            onClick={handleSessionSelect}
                                            isSelected={selectedSessionId === session.id}
                                        />
                                        <AnimatePresence>
                                            {selectedSessionId === session.id && (
                                                <SessionDetailView session={session} />
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        )
                    )}

                    {selectedTab === 'Calibrations' && (
                        calibrations.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <p className="text-lg">⚙️ No calibration data found.</p>
                            </div>
                        ) : (
                             <div className="space-y-4">
                                 {calibrations.map((cal) => (
                                     <div key={cal.id} className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                                         <div className="flex justify-between items-start">
                                             <div>
                                                 <p className="font-semibold text-gray-800">Active Calibration Record</p>
                                                 <p className="text-sm text-gray-500">
                                                     Distance: {cal.distance?.toFixed(1) ?? 'N/A'} cm, Pitch: {cal.pitch?.toFixed(1) ?? 'N/A'}°, Roll: {cal.roll?.toFixed(1) ?? 'N/A'}°
                                                 </p>
                                                 <p className={`text-sm mt-1 font-medium ${cal.requestStatus ? 'text-green-600' : 'text-gray-500'}`}>
                                                     Request Active: {typeof cal.requestStatus === 'boolean' ? (cal.requestStatus ? 'Yes' : 'No') : 'N/A'}
                                                 </p>
                                             </div>
                                             <motion.button onClick={() => confirmDelete(cal.id)} className="text-gray-400 hover:text-red-500 transition" whileTap={{scale: 0.9}}>
                                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                             </motion.button>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                        )
                    )}
                </motion.div>
            </AnimatePresence>

            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className="bg-white rounded-xl p-6 shadow-lg space-y-4 max-w-sm w-full mx-4"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <p className="text-gray-800 font-semibold text-lg">Confirm Deletion</p>
                            <p className="text-gray-600 text-sm">Are you sure you want to delete this record? This action cannot be undone.</p>
                            <div className="flex justify-end space-x-3 pt-2">
                                <motion.button whileTap={{scale: 0.95}} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-medium text-sm" onClick={() => setShowDeleteModal(false)}>
                                    Cancel
                                </motion.button>
                                <motion.button whileTap={{scale: 0.95}} className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium text-sm" onClick={handleDelete}>
                                    Delete
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}