// // // src/App.jsx
// // import React from "react";
// // import AppRoutes from "./routes.jsx";


// // export default function App() {
// //   return <AppRoutes />;
// // }



// // src/App.jsx
// import React, { useEffect, useState } from "react";
// import AppRoutes from "./routes.jsx";
// import { App as CapacitorApp } from "@capacitor/app";
// import { ThemeProvider } from "./context/ThemeContext";

// export default function App() {
//   const [backPressedOnce, setBackPressedOnce] = useState(false);

//   useEffect(() => {
//     const handler = CapacitorApp.addListener("backButton", (event) => {
//       event.preventDefault(); // prevent default app close

//       if (window.history.state?.idx > 0) {
//         // Navigate back if possible
//         window.history.back();
//       } else {
//         // Press again to exit behavior
//         if (backPressedOnce) {
//           CapacitorApp.exitApp(); // closes the app
//         } else {
//           setBackPressedOnce(true);
//           alert("Press back again to exit"); // or use a Toast
//           setTimeout(() => setBackPressedOnce(false), 2000); // 2s to press again
//         }
//       }
//     });

//     return () => handler.remove();
//   }, [backPressedOnce]);

//   return <AppRoutes />;
// }



// src/App.jsx
import React, { useEffect, useState } from "react";
import AppRoutes from "./routes.jsx";
import { App as CapacitorApp } from "@capacitor/app";
import { ThemeProvider } from "./context/ThemeContext";
import { ref, onValue } from "firebase/database";
import { db } from "./services/firebase";
import { scheduleDailyReminder, cancelAllNotifications } from "./services/notifications";

export default function App() {
  const [backPressedOnce, setBackPressedOnce] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem("loggedInUser"));

  // Effect for handling the Android back button
  useEffect(() => {
    const handler = CapacitorApp.addListener("backButton", (event) => {
      event.preventDefault();
      if (window.history.state?.idx > 0) {
        window.history.back();
      } else {
        if (backPressedOnce) {
          CapacitorApp.exitApp();
        } else {
          setBackPressedOnce(true);
          // Consider replacing alert with a native Toast notification for better UX
          alert("Press back again to exit"); 
          setTimeout(() => setBackPressedOnce(false), 2000);
        }
      }
    });

    return () => handler.remove();
  }, [backPressedOnce]);

  // Effect for handling notification scheduling based on Firebase preferences
  useEffect(() => {
    // This function listens for login/logout events to update the username
    const handleStorageChange = () => {
        setUsername(localStorage.getItem("loggedInUser"));
    };
    window.addEventListener('storage', handleStorageChange);
    // Also trigger on login/logout via removeItem
    window.addEventListener('local-storage', handleStorageChange);


    if (username && username !== "Unknown User") {
      // Path to the user's specific notification setting in Firebase
      const notificationsRef = ref(db, `userProfile/${username}/notifications/postureAlerts`);

      // onValue creates a listener that fires whenever the data changes
      const unsubscribe = onValue(notificationsRef, (snapshot) => {
          const areNotificationsEnabled = snapshot.val();
          
          if (areNotificationsEnabled === true) {
              console.log("User has notifications enabled. Scheduling daily reminder.");
              scheduleDailyReminder();
          } else {
              console.log("User has notifications disabled. Cancelling any existing reminders.");
              cancelAllNotifications();
          }
      });
      
      return () => {
          unsubscribe();
          window.removeEventListener('storage', handleStorageChange);
          window.removeEventListener('local-storage', handleStorageChange);
      };
    }
  }, [username]);

  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
}