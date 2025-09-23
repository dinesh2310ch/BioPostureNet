// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { ref, onValue, update, remove, query, orderByChild, equalTo, get } from "firebase/database";
// import { db } from "../services/firebase";
// import Header from "../components/Header";
// import { motion, AnimatePresence } from "framer-motion";

// // --- Reusable Components ---
// const SettingsToggle = ({ label, description, isEnabled, onToggle }) => (
//     <div className="flex justify-between items-center py-3">
//         <div>
//             <p className="font-medium text-gray-800">{label}</p>
//             <p className="text-sm text-gray-500">{description}</p>
//         </div>
//         <div onClick={onToggle} className={`w-12 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors ${isEnabled ? "bg-blue-600 justify-end" : "bg-gray-200 justify-start"}`}>
//             <motion.div className="w-5 h-5 bg-white rounded-full shadow-md" layout transition={{ type: "spring", stiffness: 700, damping: 30 }} />
//         </div>
//     </div>
// );

// const StatBox = ({ label, value }) => (
//     <div className="bg-gray-50 rounded-lg p-3 text-center">
//         <p className="text-2xl font-bold text-blue-600">{value}</p>
//         <p className="text-xs text-gray-500">{label}</p>
//     </div>
// );

// const ProfileCard = ({ title, icon, children }) => (
//     <motion.div
//         className="bg-white rounded-2xl p-6 shadow-md"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//     >
//         <div className="flex items-center mb-4">
//             {icon}
//             <h2 className="text-xl font-bold text-gray-800">{title}</h2>
//         </div>
//         {children}
//     </motion.div>
// );

// // --- Modal Components ---
// const EditProfileModal = ({ profile, onSave, onClose }) => {
//     const [formData, setFormData] = useState({
//         username: profile.username || '',
//         email: profile.email || ''
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSave = () => {
//         onSave(formData);
//         onClose();
//     };

//     return (
//         <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
//             <motion.div className="bg-white rounded-2xl p-6 w-full max-w-md" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
//                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Profile</h2>
//                 <div className="space-y-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Username</label>
//                         <input name="username" value={formData.username} onChange={handleChange} disabled className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" />
//                          <p className="text-xs text-gray-500 mt-1">Changing username is not supported.</p>
//                     </div>
//                      <div>
//                         <label className="block text-sm font-medium text-gray-700">Email</label>
//                         <input name="email" type="email" value={formData.email} onChange={handleChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg" />
//                     </div>
//                 </div>
//                 <div className="mt-6 flex justify-end gap-3">
//                     <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100">Cancel</button>
//                     <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Save Changes</button>
//                 </div>
//             </motion.div>
//         </motion.div>
//     );
// };

// const MedicalHistoryModal = ({ historyData, onSave, onClose }) => {
//     const [formData, setFormData] = useState(historyData || {});

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSave = () => {
//         onSave(formData);
//         onClose();
//     };

//     return (
//          <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
//             <motion.div className="bg-white rounded-2xl p-6 w-full max-w-md" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
//                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Medical History</h2>
//                 <div className="grid grid-cols-2 gap-4">
//                     <input name="height" value={formData.height || ''} onChange={handleChange} placeholder="Height (cm)" className="px-4 py-2 border rounded-lg" />
//                     <input name="weight" value={formData.weight || ''} onChange={handleChange} placeholder="Weight (kg)" className="px-4 py-2 border rounded-lg" />
//                     <input name="bloodType" value={formData.bloodType || ''} onChange={handleChange} placeholder="Blood Type" className="px-4 py-2 border rounded-lg" />
//                     <input name="exerciseFrequency" value={formData.exerciseFrequency || ''} onChange={handleChange} placeholder="Exercise Frequency" className="px-4 py-2 border rounded-lg" />
//                     <input name="sleepHours" value={formData.sleepHours || ''} onChange={handleChange} placeholder="Sleep Hours" className="px-4 py-2 border rounded-lg" />
//                     <input name="stressLevel" value={formData.stressLevel || ''} onChange={handleChange} placeholder="Stress Level" className="px-4 py-2 border rounded-lg" />
//                 </div>
//                 <div className="mt-6 flex justify-end gap-3">
//                     <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100">Cancel</button>
//                     <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Save Changes</button>
//                 </div>
//             </motion.div>
//         </motion.div>
//     )
// };

// const ChangePasswordModal = ({ onClose, onSave }) => {
//     const [currentPassword, setCurrentPassword] = useState('');
//     const [newPassword, setNewPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');

//     const handleSave = async () => {
//         setError('');
//         setSuccess('');
//         if (!currentPassword || !newPassword || !confirmPassword) {
//             setError("Please fill all fields.");
//             return;
//         }
//         if (newPassword !== confirmPassword) {
//             setError("New passwords do not match.");
//             return;
//         }
//         if (newPassword.length < 4) {
//             setError("New password must be at least 4 characters long.");
//             return;
//         }

//         try {
//             await onSave(currentPassword, newPassword);
//             setSuccess("Password updated successfully!");
//             setTimeout(onClose, 1500);
//         } catch (err) {
//             setError(err.message);
//         }
//     };

//     return (
//         <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
//             <motion.div className="bg-white rounded-2xl p-6 w-full max-w-md" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
//                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Change Password</h2>
//                 {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
//                 {success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}
//                 <div className="space-y-4">
//                     <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current Password" className="w-full px-4 py-2 border rounded-lg" />
//                     <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" className="w-full px-4 py-2 border rounded-lg" />
//                     <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" className="w-full px-4 py-2 border rounded-lg" />
//                 </div>
//                 <div className="mt-6 flex justify-end gap-3">
//                     <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100">Cancel</button>
//                     <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Save Changes</button>
//                 </div>
//             </motion.div>
//         </motion.div>
//     );
// };

// const DeleteAccountModal = ({ username, onClose, onDelete }) => {
//     const [confirmText, setConfirmText] = useState('');
//     const isMatch = confirmText === username;

//     return (
//         <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
//             <motion.div className="bg-white rounded-2xl p-6 w-full max-w-md" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
//                 <h2 className="text-2xl font-bold text-red-600 mb-4">Delete Account</h2>
//                 <p className="text-gray-600 mb-4">This action is irreversible. All your data, including history, goals, and settings, will be permanently deleted.</p>
//                 <p className="text-gray-800 mb-2">To confirm, please type your username: <span className="font-bold">{username}</span></p>
//                 <input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} className="w-full px-4 py-2 border rounded-lg mb-6" />
//                 <div className="flex justify-end gap-3">
//                     <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100">Cancel</button>
//                     <button onClick={onDelete} disabled={!isMatch} className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:bg-red-300 disabled:cursor-not-allowed">Delete My Account</button>
//                 </div>
//             </motion.div>
//         </motion.div>
//     );
// };


// // --- Main Profile Component ---
// export default function Profile() {
//     const navigate = useNavigate();
//     const username = localStorage.getItem("loggedInUser") || "Unknown User";
//     const [userId, setUserId] = useState(null);
//     const [profileData, setProfileData] = useState(null);
//     const [stats, setStats] = useState({ daysActive: 0, avgScore: 0, totalSessions: 0 });
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [isMedicalModalOpen, setIsMedicalModalOpen] = useState(false);
//     const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
//     // Fetch user profile and user ID
//     useEffect(() => {
//         if (!username || username === "Unknown User") return;

//         // Find the user's ID from the 'users' table based on their username
//         const usersQuery = query(ref(db, 'users'), orderByChild('username'), equalTo(username));
//         get(usersQuery).then((snapshot) => {
//             if (snapshot.exists()) {
//                 const userData = snapshot.val();
//                 const uId = Object.keys(userData)[0];
//                 setUserId(uId);
//             }
//         });

//         const profileRef = ref(db, `userProfile/${username}`);
//         const unsubscribeProfile = onValue(profileRef, (snapshot) => {
//             setProfileData(snapshot.val() || { email: "", medicalHistory: {}, preferences: {}, notifications: {} });
//         });
        
//         return () => {
//             unsubscribeProfile();
//         };
//     }, [username]);
    
//     // Calculate stats from history
//     useEffect(() => {
//         if (!username) return;
//         const historyRef = ref(db, `history/${username}`);
//         const unsubscribeHistory = onValue(historyRef, (snapshot) => {
//             const data = snapshot.val();
//             if (data) {
//                 const sessions = Object.values(data);
//                 const totalSessions = sessions.length;
//                 const totalScore = sessions.reduce((acc, s) => {
//                     const total = (s.goodCount || 0) + (s.moderateCount || 0) + (s.badCount || 0);
//                     const score = total > 0 ? ((s.goodCount || 0) / total) * 100 : 0;
//                     return acc + score;
//                 }, 0);
//                 const uniqueDays = new Set(sessions.map(s => new Date(s.sessionEndTime).toLocaleDateString())).size;
//                 setStats({
//                     totalSessions,
//                     avgScore: totalSessions > 0 ? Math.round(totalScore / totalSessions) : 0,
//                     daysActive: uniqueDays
//                 });
//             }
//         });
//         return () => unsubscribeHistory();
//     }, [username]);

//     // Generic function to update any field in the user's profile
//     const handleProfileUpdate = (path, value) => {
//         if (!username) return;
//         const updates = {};
//         updates[`userProfile/${username}/${path}`] = value;
//         update(ref(db), updates).catch(err => console.error("Update failed:", err));
//     };
    
//     // Specific handler for saving profile info from modal
//     const handleSaveProfileInfo = (newProfileData) => {
//         handleProfileUpdate('email', newProfileData.email);
//     };

//     // Logic for Changing Password
//     const handleChangePassword = async (currentPassword, newPassword) => {
//         if (!userId) throw new Error("Could not find user ID. Please try again.");
//         const userRef = ref(db, `users/${userId}`);
//         const snapshot = await get(userRef);
//         if (!snapshot.exists()) throw new Error("User record not found.");

//         const userData = snapshot.val();
//         if (userData.password !== currentPassword) {
//             throw new Error("The current password you entered is incorrect.");
//         }
        
//         return update(userRef, { password: newPassword });
//     };

//     // Logic for Deleting Account
//     const handleDeleteAccount = async () => {
//         if (!userId || !username) return;
//         const pathsToDelete = {
//             [`users/${userId}`]: null,
//             [`userProfile/${username}`]: null,
//             [`history/${username}`]: null,
//             [`goals/${username}`]: null,
//             [`notifications/${username}`]: null,
//             [`sensor/${username}`]: null,
//             [`sensorStatus/${username}`]: null,
//             [`calibration/${username}`]: null,
//             [`calibrationRequest/${username}`]: null,
//             [`loginchecking/${username}`]: null,
//             [`emailLogs/${username}`]: null
//         };

//         try {
//             await update(ref(db), pathsToDelete);
//             localStorage.removeItem("loggedInUser");
//             navigate('/login');
//         } catch (err) {
//             console.error("Failed to delete account:", err);
//             alert("An error occurred while deleting your account.");
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-6">
//             <Header />
            
//             <div className="max-w-2xl mx-auto space-y-6">
//                 <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
//                     <div className="inline-block relative">
//                         <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto shadow-lg">
//                             {username.charAt(0).toUpperCase()}
//                         </div>
//                     </div>
//                     <h1 className="text-3xl font-bold text-gray-800 mt-4">{username}</h1>
//                     <p className="text-gray-500">{profileData?.email || "No email set"}</p>
//                     <button onClick={() => setIsEditModalOpen(true)} className="mt-4 bg-blue-50 text-blue-600 font-semibold py-2 px-5 rounded-lg hover:bg-blue-100 transition">
//                         Edit Profile
//                     </button>
//                 </motion.div>

//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                     <StatBox label="Days Active" value={stats.daysActive} />
//                     <StatBox label="Avg. Score" value={`${stats.avgScore}%`} />
//                     <StatBox label="Total Sessions" value={stats.totalSessions} />
//                 </div>
                
//                 <ProfileCard title="Medical History" icon={<svg className="w-6 h-6 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}>
//                     {profileData?.medicalHistory && Object.keys(profileData.medicalHistory).length > 0 ? (
//                         <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600">
//                            {Object.entries(profileData.medicalHistory).map(([key, value]) => value && (
//                                 <div key={key}>
//                                     <span className="capitalize font-medium text-gray-800">{key.replace(/([A-Z])/g, ' $1')}: </span>{value}
//                                 </div>
//                            ))}
//                         </div>
//                     ) : (
//                         <p className="text-gray-500">No medical history provided.</p>
//                     )}
//                      <button onClick={() => setIsMedicalModalOpen(true)} className="mt-4 text-sm text-blue-600 font-semibold hover:underline">
//                         Update Medical History
//                     </button>
//                 </ProfileCard>

//                 <ProfileCard title="Monitoring Preferences" icon={<svg className="w-6 h-6 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
//                     <SettingsToggle label="Work Day Monitoring" description="Monitor posture during work hours only" isEnabled={profileData?.preferences?.workdayMonitoring || false} onToggle={() => handleProfileUpdate('preferences/workdayMonitoring', !profileData?.preferences?.workdayMonitoring)} />
//                     <SettingsToggle label="Weekend Monitoring" description="Continue monitoring on weekends" isEnabled={profileData?.preferences?.weekendMonitoring || false} onToggle={() => handleProfileUpdate('preferences/weekendMonitoring', !profileData?.preferences?.weekendMonitoring)} />
//                 </ProfileCard>
                
//                 <ProfileCard title="Notifications" icon={<svg className="w-6 h-6 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>}>
//                     <SettingsToggle label="Posture Alerts" description="Get notified for poor posture" isEnabled={profileData?.notifications?.postureAlerts || false} onToggle={() => handleProfileUpdate('notifications/postureAlerts', !profileData?.notifications?.postureAlerts)} />
//                     <SettingsToggle label="Break Reminders" description="Receive reminders to take breaks" isEnabled={profileData?.notifications?.breakReminders || false} onToggle={() => handleProfileUpdate('notifications/breakReminders', !profileData?.notifications?.breakReminders)} />
//                     <SettingsToggle label="Email Reports" description="Weekly summary reports via email" isEnabled={profileData?.notifications?.emailReports || false} onToggle={() => handleProfileUpdate('notifications/emailReports', !profileData?.notifications?.emailReports)} />
//                 </ProfileCard>

//                 <ProfileCard title="Account" icon={<svg className="w-6 h-6 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}>
//                     <div className="divide-y divide-gray-100">
//                         <button onClick={() => setIsPasswordModalOpen(true)} className="w-full text-left py-3 hover:bg-gray-50 rounded-lg px-2"><p className="font-medium text-gray-800">Change Password</p><p className="text-sm text-gray-500">Update your account password</p></button>
//                         <button onClick={() => setIsDeleteModalOpen(true)} className="w-full text-left py-3 text-red-600 hover:bg-red-50 rounded-lg px-2"><p className="font-medium">Delete Account</p><p className="text-sm text-red-500">Permanently delete your account</p></button>
//                     </div>
//                 </ProfileCard>
//             </div>
            
//             <AnimatePresence>
//                 {isEditModalOpen && <EditProfileModal profile={{ username, ...profileData }} onClose={() => setIsEditModalOpen(false)} onSave={handleSaveProfileInfo} />}
//                 {isMedicalModalOpen && <MedicalHistoryModal historyData={profileData?.medicalHistory} onClose={() => setIsMedicalModalOpen(false)} onSave={(data) => handleProfileUpdate('medicalHistory', data)} />}
//                 {isPasswordModalOpen && <ChangePasswordModal onClose={() => setIsPasswordModalOpen(false)} onSave={handleChangePassword} />}
//                 {isDeleteModalOpen && <DeleteAccountModal username={username} onClose={() => setIsDeleteModalOpen(false)} onDelete={handleDeleteAccount} />}
//             </AnimatePresence>
//         </div>
//     );
// }


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ref, onValue, update, remove, query, orderByChild, equalTo, get } from "firebase/database";
import { db } from "../services/firebase";
import Header from "../components/Header";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

// --- Reusable Components ---
const SettingsToggle = ({ label, description, isEnabled, onToggle }) => (
    <div className="flex justify-between items-center py-3">
        <div>
            <p className="font-medium text-gray-800 dark:text-gray-200">{label}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <div onClick={onToggle} className={`w-12 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors ${isEnabled ? "bg-blue-600 justify-end" : "bg-gray-200 dark:bg-gray-600 justify-start"}`}>
            <motion.div className="w-5 h-5 bg-white rounded-full shadow-md" layout transition={{ type: "spring", stiffness: 700, damping: 30 }} />
        </div>
    </div>
);

const StatBox = ({ label, value }) => (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </div>
);

const ProfileCard = ({ title, icon, children }) => (
    <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <div className="flex items-center mb-4">
            {icon}
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
        </div>
        {children}
    </motion.div>
);

// --- Modal Components ---
const EditProfileModal = ({ profile, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        username: profile.username || '',
        email: profile.email || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    return (
        <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-2xl p-6 w-full max-w-md" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Profile</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input name="username" value={formData.username} onChange={handleChange} disabled className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" />
                         <p className="text-xs text-gray-500 mt-1">Changing username is not supported.</p>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input name="email" type="email" value={formData.email} onChange={handleChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg" />
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Save Changes</button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const MedicalHistoryModal = ({ historyData, onSave, onClose }) => {
    const [formData, setFormData] = useState(historyData || {});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    return (
        <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-2xl p-6 w-full max-w-md" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Medical History</h2>
                <div className="grid grid-cols-2 gap-4">
                    <input name="height" value={formData.height || ''} onChange={handleChange} placeholder="Height (cm)" className="px-4 py-2 border rounded-lg" />
                    <input name="weight" value={formData.weight || ''} onChange={handleChange} placeholder="Weight (kg)" className="px-4 py-2 border rounded-lg" />
                    <input name="bloodType" value={formData.bloodType || ''} onChange={handleChange} placeholder="Blood Type" className="px-4 py-2 border rounded-lg" />
                    <input name="exerciseFrequency" value={formData.exerciseFrequency || ''} onChange={handleChange} placeholder="Exercise Frequency" className="px-4 py-2 border rounded-lg" />
                    <input name="sleepHours" value={formData.sleepHours || ''} onChange={handleChange} placeholder="Sleep Hours" className="px-4 py-2 border rounded-lg" />
                    <input name="stressLevel" value={formData.stressLevel || ''} onChange={handleChange} placeholder="Stress Level" className="px-4 py-2 border rounded-lg" />
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Save Changes</button>
                </div>
            </motion.div>
        </motion.div>
    )
};

const ChangePasswordModal = ({ onClose, onSave }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSave = async () => {
        setError('');
        setSuccess('');
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("Please fill all fields.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }
        if (newPassword.length < 4) {
            setError("New password must be at least 4 characters long.");
            return;
        }
        try {
            await onSave(currentPassword, newPassword);
            setSuccess("Password updated successfully!");
            setTimeout(onClose, 1500);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-2xl p-6 w-full max-w-md" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Change Password</h2>
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                {success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}
                <div className="space-y-4">
                    <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current Password" className="w-full px-4 py-2 border rounded-lg" />
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" className="w-full px-4 py-2 border rounded-lg" />
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Save Changes</button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const DeleteAccountModal = ({ username, onClose, onDelete }) => {
    const [confirmText, setConfirmText] = useState('');
    const isMatch = confirmText === username;

    return (
        <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-2xl p-6 w-full max-w-md" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
                <h2 className="text-2xl font-bold text-red-600 mb-4">Delete Account</h2>
                <p className="text-gray-600 mb-4">This action is irreversible. All your data, including history, goals, and settings, will be permanently deleted.</p>
                <p className="text-gray-800 mb-2">To confirm, please type your username: <span className="font-bold">{username}</span></p>
                <input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} className="w-full px-4 py-2 border rounded-lg mb-6" />
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100">Cancel</button>
                    <button onClick={onDelete} disabled={!isMatch} className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:bg-red-300 disabled:cursor-not-allowed">Delete My Account</button>
                </div>
            </motion.div>
        </motion.div>
    );
};


// --- Main Profile Component ---
export default function Profile() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const username = localStorage.getItem("loggedInUser") || "Unknown User";
    const [userId, setUserId] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [stats, setStats] = useState({ daysActive: 0, avgScore: 0, totalSessions: 0 });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isMedicalModalOpen, setIsMedicalModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    // Fetch user profile and user ID
    useEffect(() => {
        if (!username || username === "Unknown User") return;
        const usersQuery = query(ref(db, 'users'), orderByChild('username'), equalTo(username));
        get(usersQuery).then((snapshot) => {
            if (snapshot.exists()) {
                setUserId(Object.keys(snapshot.val())[0]);
            }
        });
        const profileRef = ref(db, `userProfile/${username}`);
        const unsubscribeProfile = onValue(profileRef, (snapshot) => {
            setProfileData(snapshot.val() || { email: "", medicalHistory: {}, preferences: {}, notifications: {} });
        });
        return () => unsubscribeProfile();
    }, [username]);
    
    // Calculate stats from history
    useEffect(() => {
        if (!username) return;
        const historyRef = ref(db, `history/${username}`);
        const unsubscribeHistory = onValue(historyRef, (snapshot) => {
            if (snapshot.exists()) {
                const sessions = Object.values(snapshot.val());
                const totalSessions = sessions.length;
                const totalScore = sessions.reduce((acc, s) => {
                    const total = (s.goodCount || 0) + (s.moderateCount || 0) + (s.badCount || 0);
                    return acc + (total > 0 ? ((s.goodCount || 0) / total) * 100 : 0);
                }, 0);
                const uniqueDays = new Set(sessions.map(s => new Date(s.sessionEndTime).toLocaleDateString())).size;
                setStats({
                    totalSessions,
                    avgScore: totalSessions > 0 ? Math.round(totalScore / totalSessions) : 0,
                    daysActive: uniqueDays
                });
            }
        });
        return () => unsubscribeHistory();
    }, [username]);

    const handleProfileUpdate = (path, value) => {
        if (!username) return;
        const updates = {};
        updates[`userProfile/${username}/${path}`] = value;
        update(ref(db), updates).catch(err => console.error("Update failed:", err));
    };
    
    const handleSaveProfileInfo = (newProfileData) => {
        handleProfileUpdate('email', newProfileData.email);
    };

    const handleChangePassword = async (currentPassword, newPassword) => {
        if (!userId) throw new Error("Could not find user ID.");
        const userRef = ref(db, `users/${userId}`);
        const snapshot = await get(userRef);
        if (!snapshot.exists() || snapshot.val().password !== currentPassword) {
            throw new Error("The current password you entered is incorrect.");
        }
        return update(userRef, { password: newPassword });
    };

    const handleDeleteAccount = async () => {
        if (!userId || !username) return;
        const pathsToDelete = {
            [`users/${userId}`]: null,
            [`userProfile/${username}`]: null,
            [`history/${username}`]: null,
            [`sensor/${username}`]: null,
            [`sensorStatus/${username}`]: null,
            [`calibration/${username}`]: null,
            [`calibrationRequest/${username}`]: null,
        };
        try {
            await update(ref(db), pathsToDelete);
            localStorage.removeItem("loggedInUser");
            navigate('/login');
        } catch (err) {
            console.error("Failed to delete account:", err);
            alert("An error occurred while deleting your account.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 px-4 py-6">
            <Header />
            <div className="max-w-2xl mx-auto space-y-6">
                <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="inline-block relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto shadow-lg">
                            {username.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-4">{username}</h1>
                    <p className="text-gray-500 dark:text-gray-400">{profileData?.email || "No email set"}</p>
                    <button onClick={() => setIsEditModalOpen(true)} className="mt-4 bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-300 font-semibold py-2 px-5 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-600 transition">
                        Edit Profile
                    </button>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <StatBox label="Days Active" value={stats.daysActive} />
                    <StatBox label="Avg. Score" value={`${stats.avgScore}%`} />
                    <StatBox label="Total Sessions" value={stats.totalSessions} />
                </div>
                
                <ProfileCard title="Appearance" icon={<svg className="w-6 h-6 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}>
                    <SettingsToggle 
                        label="Dark Mode" 
                        description="Reduce glare and improve night viewing" 
                        isEnabled={theme === 'dark'} 
                        onToggle={toggleTheme} 
                    />
                </ProfileCard>

                <ProfileCard title="Medical History" icon={<svg className="w-6 h-6 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}>
                    {profileData?.medicalHistory && Object.keys(profileData.medicalHistory).length > 0 ? (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
                           {Object.entries(profileData.medicalHistory).map(([key, value]) => value && (
                                <div key={key}>
                                    <span className="capitalize font-medium text-gray-800 dark:text-gray-100">{key.replace(/([A-Z])/g, ' $1')}: </span>{value}
                                </div>
                           ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">No medical history provided.</p>
                    )}
                     <button onClick={() => setIsMedicalModalOpen(true)} className="mt-4 text-sm text-blue-600 font-semibold hover:underline">
                         Update Medical History
                     </button>
                </ProfileCard>

                <ProfileCard title="Notifications" icon={<svg className="w-6 h-6 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>}>
                    <SettingsToggle label="Posture Alerts" description="Get device notifications for bad posture" isEnabled={profileData?.notifications?.postureAlerts || false} onToggle={() => handleProfileUpdate('notifications/postureAlerts', !profileData?.notifications?.postureAlerts)} />
                    <SettingsToggle label="Break Reminders" description="Receive reminders to take breaks" isEnabled={profileData?.notifications?.breakReminders || false} onToggle={() => handleProfileUpdate('notifications/breakReminders', !profileData?.notifications?.breakReminders)} />
                    <SettingsToggle label="Email Reports" description="Weekly summary reports via email" isEnabled={profileData?.notifications?.emailReports || false} onToggle={() => handleProfileUpdate('notifications/emailReports', !profileData?.notifications?.emailReports)} />
                </ProfileCard>

                <ProfileCard title="Account" icon={<svg className="w-6 h-6 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        <button onClick={() => setIsPasswordModalOpen(true)} className="w-full text-left py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg px-2"><p className="font-medium text-gray-800 dark:text-gray-200">Change Password</p><p className="text-sm text-gray-500 dark:text-gray-400">Update your account password</p></button>
                        <button onClick={() => setIsDeleteModalOpen(true)} className="w-full text-left py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg px-2"><p className="font-medium">Delete Account</p><p className="text-sm text-red-500">Permanently delete your account</p></button>
                    </div>
                </ProfileCard>
            </div>
            
            <AnimatePresence>
                {isEditModalOpen && <EditProfileModal profile={{ username, ...profileData }} onClose={() => setIsEditModalOpen(false)} onSave={handleSaveProfileInfo} />}
                {isMedicalModalOpen && <MedicalHistoryModal historyData={profileData?.medicalHistory} onClose={() => setIsMedicalModalOpen(false)} onSave={(data) => handleProfileUpdate('medicalHistory', data)} />}
                {isPasswordModalOpen && <ChangePasswordModal onClose={() => setIsPasswordModalOpen(false)} onSave={handleChangePassword} />}
                {isDeleteModalOpen && <DeleteAccountModal username={username} onClose={() => setIsDeleteModalOpen(false)} onDelete={handleDeleteAccount} />}
            </AnimatePresence>
        </div>
    );
}