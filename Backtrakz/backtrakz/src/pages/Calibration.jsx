// // components/Calibration.js
// import { useState, useEffect } from "react";
// import { ref, onValue, set } from "firebase/database";
// import { db } from "../services/firebase";
// import Header from "../components/Header";

// export default function Calibration({ onComplete }) {
//   // If localStorage is storing string username
// const storedUser = localStorage.getItem("loggedInUser");
// const username = storedUser || "Unknown User";

//   const [calibrationData, setCalibrationData] = useState(null);
//   const [status, setStatus] = useState("waiting");
//   const [error, setError] = useState(null);

//   // Listen for calibration data from Firebase
//   useEffect(() => {
//     try {
//       const calibrationRef = ref(db, `sensorData/${username}`);
//       const unsubscribe = onValue(calibrationRef, (snapshot) => {
//         const data = snapshot.val();
//         if (data && status === "calibrating") {
//           setCalibrationData(data);
//           setStatus("completed");
          
//           // Save calibration data
//           set(ref(db, `calibration/${username}`), data)
//             .catch(err => {
//               console.error("Error saving calibration:", err);
//               setError("Failed to save calibration data");
//             });
//         }
//       }, (error) => {
//         console.error("Error reading sensor data:", error);
//         setError("Failed to read sensor data");
//       });

//       return () => unsubscribe();
//     } catch (error) {
//       console.error("Error in calibration effect:", error);
//       setError("An error occurred during calibration");
//     }
//   }, [username, status]);

//   const startCalibration = () => {
//     setStatus("calibrating");
//     setError(null);
    
//     // Signal ESP to send sensor data
//     try {
//       set(ref(db, "calibrationRequest"), { 
//         username: username,
//         request: true 
//       });
      
//       // Set timeout in case calibration fails
//       setTimeout(() => {
//         if (status === "calibrating") {
//           setError("Calibration timed out. Please try again.");
//           setStatus("waiting");
//         }
//       }, 10000); // 10 second timeout
//     } catch (error) {
//       console.error("Error starting calibration:", error);
//       setError("Failed to start calibration");
//       setStatus("waiting");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-6">
//       <Header />
      
//       <div className="bg-white rounded-2xl p-6 shadow-md max-w-md mx-auto mt-10">
//         <h1 className="text-2xl font-bold text-gray-800 mb-4">Sensor Calibration</h1>
        
//         {error && (
//           <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
//             <p className="text-red-800">{error}</p>
//           </div>
//         )}
        
//         <p className="text-gray-600 mb-6">
//           Please sit in your correct posture position. We'll calibrate the sensor 
//           to recognize this as your optimal posture.
//         </p>

//         {status === "waiting" && (
//           <>
//             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
//               <p className="text-yellow-800">
//                 <strong>Instructions:</strong> Sit straight in your chair with good posture, 
//                 then click "Start Calibration".
//               </p>
//             </div>
//             <button
//               onClick={startCalibration}
//               className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
//             >
//               Start Calibration
//             </button>
//           </>
//         )}

//         {status === "calibrating" && (
//           <div className="text-center">
//             <div className="animate-pulse bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
//               <div className="bg-blue-500 rounded-full w-8 h-8 mx-auto mt-4"></div>
//             </div>
//             <p className="text-gray-600 mb-6">Calibrating sensor... Please hold your posture.</p>
//             <div className="bg-gray-100 p-3 rounded-lg">
//               <p className="text-sm text-gray-600">Waiting for sensor data...</p>
//             </div>
//           </div>
//         )}

//         {status === "completed" && calibrationData && (
//           <>
//             <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
//               <p className="text-green-800 font-semibold">Calibration successful!</p>
//             </div>
//             <div className="bg-gray-50 p-4 rounded-lg mb-6">
//               <h3 className="font-semibold text-gray-800 mb-2">Calibration Values:</h3>
//               <p className="text-sm text-gray-600">Distance: {calibrationData.distance || "N/A"} cm</p>
//               <p className="text-sm text-gray-600">Pitch: {calibrationData.pitch || "N/A"}°</p>
//               <p className="text-sm text-gray-600">Roll: {calibrationData.roll || "N/A"}°</p>
//             </div>
//             <button
//               onClick={onComplete}
//               className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
//             >
//               Start Monitoring
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }


// // //Calibration.js
// // import { useState, useEffect } from "react";
// // import { ref, onValue, set } from "firebase/database";
// // import { db } from "../services/firebase";
// // import Header from "../components/Header";

// // export default function Calibration({ onComplete }) {
// //   const username = localStorage.getItem("loggedInUser") || "dinesh";
// //   const [calibrationData, setCalibrationData] = useState(null);
// //   const [status, setStatus] = useState("waiting");
// //   const [error, setError] = useState(null);

// //   const dummyCalibration = {
// //     distance: 45,
// //     pitch: 1.3,
// //     roll: 1.7,
// //     timestamp: Date.now(),
// //   };

// //   const saveCalibration = (data) => {
// //     set(ref(db, `calibration/${username}`), data)
// //       .then(() => {
// //         console.log("Calibration data saved successfully");
// //       })
// //       .catch((err) => {
// //         console.error("Error saving calibration data:", err);
// //         setError("Failed to save calibration data");
// //       });
// //   };

// //   useEffect(() => {
// //     const calibrationRef = ref(db, `calibration/${username}`);
// //     const unsubscribe = onValue(
// //       calibrationRef,
// //       (snapshot) => {
// //         const data = snapshot.val();
// //         if (data) {
// //           setCalibrationData(data);
// //           setStatus("completed");
// //         }
// //       },
// //       (err) => {
// //         console.error("Error reading calibration data:", err);
// //       }
// //     );

// //     return () => unsubscribe();
// //   }, [username]);

// //   const startCalibration = () => {
// //     setStatus("calibrating");
// //     setError(null);
// //     setTimeout(() => {
// //       setCalibrationData(dummyCalibration);
// //       setStatus("completed");
// //       saveCalibration(dummyCalibration);
// //     }, 2000);
// //   };

// //   const skipCalibration = () => {
// //     setCalibrationData(dummyCalibration);
// //     setStatus("completed");
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-6">
// //       <Header />

// //       <div className="max-w-4xl mx-auto mt-6">
// //         <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Sensor Calibration</h1>
// //         <p className="text-gray-600 text-center mb-8">
// //           Calibrate your sensor for optimal posture monitoring
// //         </p>

// //         <div className="grid md:grid-cols-2 gap-8">
// //           {/* Posture Guide Section */}
// //           <div className="bg-white rounded-2xl p-6 shadow-md">
// //             <h2 className="text-xl font-bold text-gray-800 mb-4">Proper Sitting Posture Guide</h2>
            
// //             <div className="space-y-6">
// //               {/* Posture Illustration */}
// //               <div className="bg-blue-50 rounded-xl p-4">
// //                 <div className="relative h-48 mb-4 flex justify-center">
// //                   {/* Simple posture diagram using CSS */}
// //                   <div className="relative">
// //                     {/* Chair */}
// //                     <div className="w-40 h-4 bg-gray-600 rounded-t-lg mx-auto"></div>
// //                     <div className="w-32 h-32 bg-gray-500 rounded-lg mx-auto -mt-1"></div>
                    
// //                     {/* Person */}
// //                     <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
// //                       {/* Head */}
// //                       <div className="w-12 h-12 bg-blue-400 rounded-full mx-auto mb-2"></div>
// //                       {/* Body */}
// //                       <div className="w-8 h-16 bg-blue-500 rounded mx-auto"></div>
// //                       {/* Arms */}
// //                       <div className="flex justify-between -mt-12 px-2">
// //                         <div className="w-1 h-8 bg-blue-500"></div>
// //                         <div className="w-1 h-8 bg-blue-500"></div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
// //                 <p className="text-sm text-blue-800 text-center">
// //                   Ideal sitting posture with straight back and proper alignment
// //                 </p>
// //               </div>

// //               {/* Posture Tips */}
// //               <div className="space-y-3">
// //                 <h3 className="font-semibold text-gray-800">Key Posture Points:</h3>
// //                 <div className="flex items-start space-x-2">
// //                   <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
// //                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
// //                   </div>
// //                   <p className="text-sm text-gray-600">Keep your back straight against the chair</p>
// //                 </div>
// //                 <div className="flex items-start space-x-2">
// //                   <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
// //                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
// //                   </div>
// //                   <p className="text-sm text-gray-600">Feet flat on the floor, knees at 90° angle</p>
// //                 </div>
// //                 <div className="flex items-start space-x-2">
// //                   <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
// //                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
// //                   </div>
// //                   <p className="text-sm text-gray-600">Screen at eye level to avoid neck strain</p>
// //                 </div>
// //                 <div className="flex items-start space-x-2">
// //                   <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
// //                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
// //                   </div>
// //                   <p className="text-sm text-gray-600">Elbows close to body, forearms parallel to floor</p>
// //                 </div>
// //               </div>

// //               {/* Calibration Instructions */}
// //               <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
// //                 <h3 className="font-semibold text-yellow-800 mb-2">Calibration Instructions:</h3>
// //                 <p className="text-sm text-yellow-700">
// //                   1. Sit in your normal working position<br/>
// //                   2. Maintain good posture as shown above<br/>
// //                   3. Click "Start Calibration" when ready<br/>
// //                   4. Hold still for 2 seconds during calibration
// //                 </p>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Calibration Control Section */}
// //           <div className="bg-white rounded-2xl p-6 shadow-md">
// //             <h2 className="text-xl font-bold text-gray-800 mb-4">Calibration Settings</h2>

// //             {error && (
// //               <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
// //                 <p className="text-red-800">{error}</p>
// //               </div>
// //             )}

// //             {status === "waiting" && (
// //               <>
// //                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
// //                   <p className="text-blue-800 text-sm">
// //                     <strong>Demo Mode:</strong> Using simulated calibration data for demonstration purposes.
// //                     Real calibration would use actual sensor readings.
// //                   </p>
// //                 </div>
                
// //                 <button
// //                   onClick={startCalibration}
// //                   className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 mb-3 transition duration-200"
// //                 >
// //                   Start Calibration
// //                 </button>
// //                 <button
// //                   onClick={skipCalibration}
// //                   className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition duration-200"
// //                 >
// //                   Skip & Use Default Values
// //                 </button>
// //               </>
// //             )}

// //             {status === "calibrating" && (
// //               <div className="text-center py-8">
// //                 <div className="animate-pulse bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
// //                   <div className="bg-blue-500 rounded-full w-8 h-8 mx-auto mt-4"></div>
// //                 </div>
// //                 <p className="text-gray-600 mb-4">Calibrating sensor...</p>
// //                 <p className="text-sm text-gray-500">Please maintain your posture</p>
// //                 <div className="bg-gray-100 p-3 rounded-lg mt-4">
// //                   <p className="text-sm text-gray-600">Using demo calibration data...</p>
// //                 </div>
// //               </div>
// //             )}

// //             {status === "completed" && calibrationData && (
// //               <>
// //                 <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
// //                   <p className="text-green-800 font-semibold">✓ Calibration successful!</p>
// //                   <p className="text-green-800 text-sm mt-1">Your sensor is now calibrated for optimal posture monitoring.</p>
// //                 </div>
                
// //                 <div className="bg-gray-50 p-4 rounded-lg mb-6">
// //                   <h3 className="font-semibold text-gray-800 mb-3">Calibration Values:</h3>
// //                   <div className="grid grid-cols-2 gap-4">
// //                     <div>
// //                       <p className="text-xs text-gray-500">Distance</p>
// //                       <p className="font-semibold">{calibrationData.distance} cm</p>
// //                     </div>
// //                     <div>
// //                       <p className="text-xs text-gray-500">Pitch</p>
// //                       <p className="font-semibold">{calibrationData.pitch}°</p>
// //                     </div>
// //                     <div>
// //                       <p className="text-xs text-gray-500">Roll</p>
// //                       <p className="font-semibold">{calibrationData.roll}°</p>
// //                     </div>
// //                     <div>
// //                       <p className="text-xs text-gray-500">Status</p>
// //                       <p className="font-semibold text-green-600">Optimal</p>
// //                     </div>
// //                   </div>
// //                   <p className="text-xs text-gray-500 mt-3">
// //                     <strong>Note:</strong> Demo values shown for testing
// //                   </p>
// //                 </div>

// //                 <button
// //                   onClick={onComplete}
// //                   className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-200"
// //                 >
// //                   Start Monitoring Session
// //                 </button>
// //               </>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


import { useState, useEffect } from "react";
import { ref, onValue, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import Header from "../components/Header";

export default function Calibration() {
  const storedUser = localStorage.getItem("loggedInUser");
  const username = storedUser || "Unknown User";

  const [calibrationData, setCalibrationData] = useState(null);
  const [status, setStatus] = useState("waiting");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Continuously listen for calibration data
  useEffect(() => {
    const calibrationDataRef = ref(db, `calibration/${username}`);
    const unsubscribe = onValue(calibrationDataRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.distance !== undefined && data.pitch !== undefined && data.roll !== undefined) {
        setCalibrationData(data);
        setStatus("completed");

        // After successful calibration, redirect to sessions page
        setTimeout(() => navigate("/sessions"), 1500);  // slight delay for user to see success
      }
    });

    return () => unsubscribe();
  }, [username, navigate]);

  const startCalibration = () => {
    setStatus("calibrating");
    setError(null);

    try {
      set(ref(db, `calibrationRequest/${username}`), { 
        username: username,
        request: true 
      });

      setTimeout(() => {
        if (status === "calibrating") {
          setError("Calibration timed out. Please try again.");
          setStatus("waiting");
        }
      }, 10000);
    } catch (error) {
      console.error("Error starting calibration:", error);
      setError("Failed to start calibration");
      setStatus("waiting");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-6">
      <Header />
      
      <div className="bg-white rounded-2xl p-6 shadow-md max-w-md mx-auto mt-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Sensor Calibration</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}
        
        <p className="text-gray-600 mb-6">
          Please sit in your correct posture position. We'll calibrate the sensor 
          to recognize this as your optimal posture.
        </p>

        {status === "waiting" && (
          <>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800">
                <strong>Instructions:</strong> Sit straight in your chair with good posture, 
                then click "Start Calibration".
              </p>
            </div>
            <button
              onClick={startCalibration}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Start Calibration
            </button>
          </>
        )}

        {status === "calibrating" && (
          <div className="text-center">
            <div className="animate-pulse bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
              <div className="bg-blue-500 rounded-full w-8 h-8 mx-auto mt-4"></div>
            </div>
            <p className="text-gray-600 mb-6">Calibrating sensor... Please hold your posture.</p>
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Waiting for sensor data...</p>
            </div>
          </div>
        )}

        {status === "completed" && calibrationData && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-center">
            <p className="text-green-800 font-semibold">✅ Calibration successful!</p>
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <h3 className="font-semibold text-gray-800 mb-2">Calibration Values:</h3>
              <p className="text-sm text-gray-600">Distance: {calibrationData.distance || "N/A"} cm</p>
              <p className="text-sm text-gray-600">Pitch: {calibrationData.pitch || "N/A"}°</p>
              <p className="text-sm text-gray-600">Roll: {calibrationData.roll || "N/A"}°</p>
              <p className="text-sm text-gray-600">Posture: {calibrationData.posture || "N/A"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
