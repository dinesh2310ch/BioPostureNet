// // src/routes.jsx
// import React, { useEffect } from "react";  // ✅ Import useEffect here
// import { Routes, Route } from "react-router-dom";
// import Splash from "./pages/Splash";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Home from "./pages/Home";
// import { StatusBar, Style } from '@capacitor/status-bar';
// import LiveMonitoring from "./pages/LiveMonitoring";
// import History from "./pages/History";
// import Goals from "./pages/Goals";
// import Sessions from "./pages/Sessions";
// import Alerts from "./pages/Alerts";
// import Profile from "./pages/Profile";
// import ErrorBoundary from './components/ErrorBoundary';

// export default function AppRoutes() {
//   useEffect(() => {
//     // Set status bar style and avoid overlapping for entire app
//     StatusBar.setStyle({ style: Style.Dark });
//     StatusBar.setOverlaysWebView({ overlay: false });
//   }, []);

//   return (
//     <ErrorBoundary>
      
  
//     <Routes>
//       <Route path="/" element={<Splash />} />       {/* Splash screen */}
//       <Route path="/login" element={<Login />} />  {/* After splash */}
//       <Route path="/signup" element={<Signup />} />
//       <Route path="/home" element={<Home />} />
//       <Route path="/live-monitoring" element={<LiveMonitoring />} />
//       <Route path="/history" element={<History />} />
//       <Route path="/goals" element={<Goals />} />
//       <Route path="/sessions" element={<Sessions />} />
//       <Route path="/alerts" element={<Alerts />} />
//       <Route path="/profile" element={<Profile />} />
//     </Routes>
//       </ErrorBoundary>
//   );
// }


// src/routes.jsx
import React, { useEffect } from "react";
// ✅ 1. Import hooks from react-router-dom and the Capacitor App plugin
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { App } from '@capacitor/app';

import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import { StatusBar, Style } from '@capacitor/status-bar';
import LiveMonitoring from "./pages/LiveMonitoring";
import History from "./pages/History";
import Goals from "./pages/Goals";
import Sessions from "./pages/Sessions";
import Alerts from "./pages/Alerts";
import Profile from "./pages/Profile";
import ErrorBoundary from './components/ErrorBoundary';

export default function AppRoutes() {
  // ✅ 2. Initialize navigate and location hooks
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set status bar style and avoid overlapping for entire app
    StatusBar.setStyle({ style: Style.Dark });
    StatusBar.setOverlaysWebView({ overlay: false });

    // ✅ 3. Add the back button listener
    const listener = App.addListener('backButton', ({ canGoBack }) => {
      // These are your "main" pages. If the user is here, we exit the app.
      const isAppRoot = location.pathname === "/home" || location.pathname === "/login";

      if (isAppRoot) {
        // If on a main page, exit the app
        App.exitApp();
      } else if (canGoBack) {
        // If there's history in the web view, go back
        navigate(-1);
      } else {
        // Fallback for any other case (e.g., no history)
        navigate('/home');
      }
    });

    // ✅ 4. Clean up the listener when the component unmounts
    return () => {
      listener.remove();
    };

  }, [location.pathname, navigate]); // Rerun effect if navigation changes

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/live-monitoring" element={<LiveMonitoring />} />
        <Route path="/history" element={<History />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </ErrorBoundary>
  );
}