// // import { useState, useEffect } from "react";
// // import { useNavigate, useLocation } from "react-router-dom";
// // import { ref, onValue } from "firebase/database";
// // import { db } from "../services/firebase";
// // import logo from "../assets/logoicon.png";
// // import notificationIcon from "../assets/notification.png";
// // import { motion, AnimatePresence } from "framer-motion";

// // export default function Header() {
// //   const navigate = useNavigate();
// //   const location = useLocation();

// //   // ✨ FIX: Directly get the username string from localStorage.
// //   const username = localStorage.getItem("loggedInUser");

// //   const [unreadCount, setUnreadCount] = useState(0);
// //   const showNotificationIcon = location.pathname !== "/alerts";

// //   useEffect(() => {
// //     if (!username || !showNotificationIcon) return;

// //     const notificationsRef = ref(db, `notifications/${username}`);
// //     const unsubscribe = onValue(notificationsRef, (snapshot) => {
// //       const data = snapshot.val();
// //       if (!data) {
// //         setUnreadCount(0);
// //         return;
// //       }
// //       const unread = Object.values(data).filter((alert) => !alert.read).length;
// //       setUnreadCount(unread);
// //     });

// //     return () => unsubscribe();
// //   }, [username, showNotificationIcon]);

// //   return (
// //     <div className="flex justify-between items-center mb-4">
// //       <motion.button whileTap={{scale: 0.95}} onClick={() => navigate("/home")}>
// //         <img src={logo} alt="Logo" className="h-12 w-12 object-contain" />
// //       </motion.button>

// //       {showNotificationIcon && (
// //         <motion.button
// //           onClick={() => navigate("/alerts")}
// //           className="relative"
// //           whileHover={{ scale: 1.1 }}
// //           whileTap={{ scale: 0.9 }}
// //         >
// //           <img
// //             src={notificationIcon}
// //             alt="Notifications"
// //             className="h-7 w-7 object-contain"
// //           />
// //           <AnimatePresence>
// //             {unreadCount > 0 && (
// //               <motion.span
// //                 key={unreadCount}
// //                 className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-white"
// //                 initial={{ scale: 0, opacity: 0 }}
// //                 animate={{ scale: 1, opacity: 1 }}
// //                 exit={{ scale: 0, opacity: 0 }}
// //                 transition={{ type: "spring", stiffness: 500, damping: 20 }}
// //               >
// //                 {unreadCount > 9 ? "9+" : unreadCount}
// //               </motion.span>
// //             )}
// //           </AnimatePresence>
// //         </motion.button>
// //       )}
// //     </div>
// //   );
// // }


// import { useState, useEffect, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { ref, onValue, query, orderByChild, limitToLast } from "firebase/database";
// import { db } from "../services/firebase";
// import { motion, AnimatePresence } from "framer-motion";
// import { Haptics } from '@capacitor/haptics';
// import { LocalNotifications } from '@capacitor/local-notifications';

// import logo from "../assets/logoicon.png";
// import notificationIcon from "../assets/notification.png";

// export default function Header() {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const username = localStorage.getItem("loggedInUser");
//     const [unreadCount, setUnreadCount] = useState(0);
//     const isFirstLoad = useRef(true); // Prevents notification on initial app load

//     const showNotificationIcon = location.pathname !== "/alerts";

//     // ✨ NEW: This useEffect handles global notifications and vibrations
//     useEffect(() => {
//         if (!username) return;

//         // A. Request permissions on app start
//         LocalNotifications.requestPermissions();
        
//         // B. Listen for ALL notifications to find the newest one
//         const notificationsRef = ref(db, `notifications/${username}`);
//         let previousTotalCount = -1; // Use -1 to detect initial load

//         const unsubscribe = onValue(notificationsRef, (snapshot) => {
//             const data = snapshot.val();
//             if (!data) {
//                 setUnreadCount(0);
//                 previousTotalCount = 0;
//                 return;
//             }

//             const notifications = Object.values(data);
//             const newUnreadCount = notifications.filter(alert => !alert.read).length;
//             setUnreadCount(newUnreadCount);

//             // C. Check if a new notification was added
//             // This runs if the total number of notifications has increased
//             if (previousTotalCount !== -1 && notifications.length > previousTotalCount) {
                
//                 // Vibrate the device
//                 Haptics.vibrate({ duration: 300 });

//                 // Find the very latest notification to show its message
//                 const latestNotification = notifications.sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0];

//                 // Schedule a local push notification
//                 LocalNotifications.schedule({
//                     notifications: [
//                         {
//                             id: new Date().getTime(), // Unique ID for the notification
//                             title: "New Posture Alert",
//                             body: latestNotification.message || "Please check your posture.",
//                             schedule: { at: new Date(Date.now() + 100) }, // Show almost instantly
//                         },
//                     ],
//                 });
//             }
            
//             // D. Update the count for the next check
//             previousTotalCount = notifications.length;
//         });

//         return () => unsubscribe();
//     }, [username]);


//     return (
//         <div className="flex justify-between items-center mb-4">
//             <motion.button whileTap={{scale: 0.95}} onClick={() => navigate("/home")}>
//                 <img src={logo} alt="Logo" className="h-12 w-12 object-contain" />
//             </motion.button>

//             {showNotificationIcon && (
//                 <motion.button
//                     onClick={() => navigate("/alerts")}
//                     className="relative"
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                 >
//                     <img src={notificationIcon} alt="Notifications" className="h-7 w-7 object-contain" />
//                     <AnimatePresence>
//                         {unreadCount > 0 && (
//                             <motion.span
//                                 key={unreadCount}
//                                 className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-white"
//                                 initial={{ scale: 0 }}
//                                 animate={{ scale: 1 }}
//                                 exit={{ scale: 0 }}
//                                 transition={{ type: "spring", stiffness: 500, damping: 20 }}
//                             >
//                                 {unreadCount > 9 ? "9+" : unreadCount}
//                             </motion.span>
//                         )}
//                     </AnimatePresence>
//                 </motion.button>
//             )}
//         </div>
//     );
// }


import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ref, onValue, get } from "firebase/database"; // ✨ Import 'get' for a direct fetch
import { db } from "../services/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Haptics } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';

import logo from "../assets/logoicon.png";
import notificationIcon from "../assets/notification.png";

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const username = localStorage.getItem("loggedInUser");
    const [unreadCount, setUnreadCount] = useState(0);
    const showNotificationIcon = location.pathname !== "/alerts";

    // ✨ SIMPLIFIED: We now use a single, more robust useEffect
    useEffect(() => {
        if (!username) return;

        // Request permissions on app start, just once.
        LocalNotifications.requestPermissions();
        
        const notificationsRef = ref(db, `notifications/${username}`);
        let previousTotalCount = -1; // To detect when a *new* notification is added

        const unsubscribe = onValue(notificationsRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) {
                setUnreadCount(0);
                previousTotalCount = 0;
                return;
            }

            const notifications = Object.values(data);
            setUnreadCount(notifications.filter(alert => !alert.read).length);

            // Check if the total number of notifications has increased
            if (previousTotalCount !== -1 && notifications.length > previousTotalCount) {
                // A new notification has arrived. Now, check the user's preference.
                handleNewNotification();
            }
            
            previousTotalCount = notifications.length;
        });

        // This is the new, robust function
        const handleNewNotification = async () => {
            try {
                // 1. Get the preference directly from userProfile
                const profileRef = ref(db, `userProfile/${username}/notifications/postureAlerts`);
                const snapshot = await get(profileRef);
                const areNotificationsEnabled = snapshot.val();

                // 2. If the preference is true, then send the notification
                if (areNotificationsEnabled === true) {
                    const latestNotification = notifications.sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0];
                    
                    // Vibrate the device
                    Haptics.vibrate({ duration: 300 });

                    // Schedule the local push notification
                    await LocalNotifications.schedule({
                        notifications: [
                            {
                                id: new Date().getTime(),
                                title: "Posture Alert",
                                body: latestNotification.message || "Please check your posture.",
                                schedule: { at: new Date(Date.now() + 100) }, // Show almost instantly
                            },
                        ],
                    });
                }
            } catch (error) {
                console.error("Error handling new notification:", error);
            }
        };

        return () => unsubscribe();
    }, [username]);


    return (
        <div className="flex justify-between items-center mb-4">
            <motion.button whileTap={{scale: 0.95}} onClick={() => navigate("/home")}>
                <img src={logo} alt="Logo" className="h-12 w-12 object-contain" />
            </motion.button>

            {showNotificationIcon && (
                <motion.button
                    onClick={() => navigate("/alerts")}
                    className="relative"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <img src={notificationIcon} alt="Notifications" className="h-7 w-7 object-contain" />
                    <AnimatePresence>
                        {unreadCount > 0 && (
                            <motion.span
                                key={unreadCount}
                                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-white"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                            >
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>
            )}
        </div>
    );
}