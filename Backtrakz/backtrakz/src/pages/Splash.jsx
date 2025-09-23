
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { SplashScreen } from "@capacitor/splash-screen";
// import { ref, onValue } from "firebase/database";
// import { db } from "../services/firebase";
// import { motion, AnimatePresence } from "framer-motion"; // ✨ Import for animations
// import logo from "../assets/logo.png";

// export default function Splash() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // This timer ensures the splash screen is visible for a minimum duration
//     const timer = setTimeout(() => {
//       // Hide the native (Capacitor) splash screen
//       SplashScreen.hide();

//       // ✨ FIX: Directly use the string from localStorage as the username
//       const username = localStorage.getItem("loggedInUser");

//       // If no user is stored, go to login
//       if (!username) {
//         console.log("No user found in localStorage, navigating to login.");
//         navigate("/login");
//         setLoading(false);
//         return;
//       }

//       // If a user is found, check for an active session in Firebase
//       const sessionRef = ref(db, `loginchecking/${username}`);
//       onValue(
//         sessionRef,
//         (snapshot) => {
//           const session = snapshot.val();
//           // An active session exists if logoutTime is null
//           if (session && session.logoutTime === null) {
//             console.log("Active Firebase session found for:", username);
//             navigate("/home", { state: { username } });
//           } else {
//             console.log("No active Firebase session, navigating to login.");
//             localStorage.removeItem("loggedInUser"); // Clean up stale data
//             navigate("/login");
//           }
//           // Hide the splash screen after navigation logic is complete
//           setLoading(false);
//         },
//         // Use { onlyOnce: true } to fetch the data once and not listen for future changes
//         { onlyOnce: true }
//       );
//     }, 2000); // Increased delay for a smoother feel

//     // Cleanup function to clear the timer if the component unmounts
//     return () => clearTimeout(timer);
//   }, [navigate]);

//   return (
//     // ✨ AnimatePresence allows the component to animate out when it's removed
//     <AnimatePresence>
//       {loading && (
//         <motion.div
//           className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-50"
//           // ✨ Fade out animation
//           exit={{ opacity: 0, transition: { duration: 0.5 } }}
//         >
//           <div className="flex flex-col items-center">
//             {/* ✨ Pulsing logo animation */}
//             <motion.img
//               src={logo}
//               alt="BackTrackz Logo"
//               className="h-48 w-48 object-contain mb-6"
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{
//                 opacity: 1,
//                 scale: [1, 1.05, 1], // "Breathe" effect
//               }}
//               transition={{
//                 opacity: { duration: 0.8 },
//                 scale: {
//                   duration: 2,
//                   repeat: Infinity, // Loop the breathing animation
//                   ease: "easeInOut",
//                 },
//               }}
//             />
//             {/* ✨ Fading text animation */}
//             <motion.p
//               className="text-gray-700 tracking-wider"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.5, duration: 0.8 }}
//             >
//               Loading...
//             </motion.p>
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SplashScreen } from "@capacitor/splash-screen";
import { ref, onValue } from "firebase/database";
import { db } from "../services/firebase";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";

export default function Splash() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            SplashScreen.hide();

            const username = localStorage.getItem("loggedInUser");

            if (!username) {
                console.log("No user found in localStorage, navigating to login.");
                navigate("/login");
                setLoading(false);
                return;
            }

            const sessionRef = ref(db, `loginchecking/${username}`);
            onValue(
                sessionRef,
                (snapshot) => {
                    const session = snapshot.val();
                    // ✨ FIX: Check if a session exists AND if logoutTime is NOT set.
                    // This handles cases where logoutTime is null OR doesn't exist.
                    if (session && !session.logoutTime) {
                        console.log("Active Firebase session found for:", username);
                        navigate("/home", { state: { username } });
                    } else {
                        console.log("No active Firebase session, navigating to login.");
                        localStorage.removeItem("loggedInUser"); // Clean up stale data
                        navigate("/login");
                    }
                    setLoading(false);
                },
                { onlyOnce: true }
            );
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-50"
                    exit={{ opacity: 0, transition: { duration: 0.5 } }}
                >
                    <div className="flex flex-col items-center">
                        <motion.img
                            src={logo}
                            alt="BackTrackz Logo"
                            className="h-48 w-48 object-contain mb-6"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                                opacity: 1,
                                scale: [1, 1.05, 1],
                            }}
                            transition={{
                                opacity: { duration: 0.8 },
                                scale: {
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                },
                            }}
                        />
                        <motion.p
                            className="text-gray-700 tracking-wider"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                        >
                            Loading...
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}