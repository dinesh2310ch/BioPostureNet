import { useState, useEffect } from "react";
import { ref, onValue, update } from "firebase/database";
import { db } from "../services/firebase";
import Header from "../components/Header";
import { motion, AnimatePresence } from "framer-motion";

// Helper to format time (no change)
function formatTimeAgo(timestampStr) {
  if (!timestampStr) return "Some time ago";
  const now = new Date();
  const [datePart, timePart] = timestampStr.split(' ');
  const [month, day] = datePart.split('-').map(Number);
  const [hour, minute, second] = timePart.split(':').map(Number);
  const timestampDate = new Date(now.getFullYear(), month - 1, day, hour, minute, second);
  const diff = now - timestampDate;

  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

// Reusable animated stat card
const AnimatedStatCard = ({ title, value, color, delay }) => (
    <motion.div 
        className="bg-white rounded-2xl p-6 shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
    >
        <div className="flex justify-between items-center mb-1">
            <h3 className={`text-lg font-bold text-gray-800`}>{title}</h3>
            <motion.span key={value} initial={{opacity:0}} animate={{opacity:1}} className={`text-3xl font-bold ${color}`}>
                {value}
            </motion.span>
        </div>
        <p className="text-sm text-gray-600">Today</p>
    </motion.div>
);

export default function Alerts() {
    const username = localStorage.getItem("loggedInUser");
    const [alerts, setAlerts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // ✨ ADDED BACK: State for tabs and stats
    const [activeTab, setActiveTab] = useState("All");
    const [stats, setStats] = useState({ postureAlerts: 0, breakReminders: 0, systemAlerts: 0 });

    const tabs = ["All", "Unread"];

    // This useEffect now fetches alerts and calculates stats
    useEffect(() => {
        if (!username) return;
        
        const alertsRef = ref(db, `notifications/${username}`);
        const unsubscribe = onValue(alertsRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) {
                setAlerts([]);
                setIsLoading(false);
                return;
            }

            const alertsList = Object.keys(data).map(key => ({ 
                id: key, 
                ...data[key] 
            })).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
            
            setAlerts(alertsList);
            updateStats(alertsList); // Calculate stats whenever data changes
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [username]);

    // ✨ ADDED BACK: Function to calculate daily stats
    const updateStats = (alertsList) => {
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        const todayAlerts = alertsList.filter(alert => {
            if (!alert.timestamp) return false;
            const [datePart, timePart] = alert.timestamp.split(' ');
            const [month, day] = datePart.split('-').map(Number);
            const [hour, minute, second] = timePart.split(':').map(Number);
            const alertDate = new Date(today.getFullYear(), month - 1, day, hour, minute, second);
            return alertDate >= todayStart;
        });
        const postureAlerts = todayAlerts.filter(a => a.message?.toLowerCase().includes('posture')).length;
        const breakReminders = todayAlerts.filter(a => a.message?.toLowerCase().includes('break')).length;
        const systemAlerts = todayAlerts.length - postureAlerts - breakReminders;

        setStats({ postureAlerts, breakReminders, systemAlerts });
    };

    // ✨ ADDED BACK: Function to mark all alerts as read
    const markAllAsRead = () => {
        if (!username || alerts.length === 0) return;
        const updates = {};
        alerts.forEach(alert => {
            if (!alert.read) {
                updates[`notifications/${username}/${alert.id}/read`] = true;
            }
        });

        if (Object.keys(updates).length > 0) {
            update(ref(db), updates);
        }
    };
    
    const unreadCount = alerts.filter(alert => !alert.read).length;
    const filteredAlerts = activeTab === "Unread" ? alerts.filter(alert => !alert.read) : alerts;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-6">
            <Header />
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Notifications</h1>
                <p className="text-gray-600 mb-6">Here are your recent alerts and reminders.</p>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div 
                    className="lg:col-span-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    {/* ✨ ADDED BACK: Tabs and Mark as Read button */}
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex space-x-1 border border-gray-200 bg-gray-50 rounded-lg p-1">
                           {tabs.map(tab => (
                               <button
                                   key={tab}
                                   onClick={() => setActiveTab(tab)}
                                   className={`px-4 py-1.5 text-sm font-semibold relative rounded-md transition-colors ${activeTab === tab ? 'text-blue-700' : 'text-gray-500 hover:text-gray-800'}`}
                               >
                                   {activeTab === tab && (
                                       <motion.div className="absolute inset-0 bg-white rounded-md shadow-sm" layoutId="tab-underline" />
                                   )}
                                   <span className="relative z-10">{tab}</span>
                               </button>
                           ))}
                        </div>
                        <button onClick={markAllAsRead} disabled={unreadCount === 0} className="text-sm font-medium text-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed">
                           Mark all as read
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-md min-h-[300px]">
                        {isLoading ? (
                            <p className="text-center text-gray-500 py-8">Loading alerts...</p>
                        ) : filteredAlerts.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">{activeTab === 'Unread' ? 'No Unread Notifications' : 'No Notifications'}</h3>
                                <p className="mt-1 text-sm text-gray-500">You're all caught up!</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
                                <AnimatePresence>
                                {filteredAlerts.map((alert) => (
                                    <motion.div key={alert.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                                        className={`flex items-start p-4 rounded-xl transition-colors ${alert.read ? 'bg-gray-50' : 'bg-blue-50'}`}
                                    >
                                        {!alert.read && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5 mr-4 flex-shrink-0" />}
                                        <div className={`flex-grow ${!alert.read ? '' : 'ml-[26px]'}`}>
                                            <p className={`font-medium ${alert.read ? 'text-gray-600' : 'text-gray-800'}`}>{alert.message}</p>
                                            <span className="text-xs text-gray-400 mt-1 block">{formatTimeAgo(alert.timestamp)}</span>
                                        </div>
                                    </motion.div>
                                ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* ✨ ADDED BACK: Daily Stats Cards */}
                <div className="space-y-6">
                    <AnimatedStatCard title="Posture Alerts" value={stats.postureAlerts} color="text-blue-600" delay={0.2} />
                    <AnimatedStatCard title="Break Reminders" value={stats.breakReminders} color="text-green-600" delay={0.3} />
                    <AnimatedStatCard title="System Alerts" value={stats.systemAlerts} color="text-purple-600" delay={0.4} />
                </div>
            </div>
        </div>
    );
}