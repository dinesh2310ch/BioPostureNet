// // import Header from "../components/Header";

// // export default function Goals() {
// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-6">
// //       <Header />
      
// //       {/* Page Title */}
// //       <div className="mb-6">
// //         <h1 className="text-3xl font-bold text-gray-800 mb-2">Goals</h1>
// //         <p className="text-gray-600">Get and track your posture improvement goals</p>
// //       </div>

// //       {/* Goal Tracking Section */}
// //       <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
// //         <h2 className="text-xl font-bold text-gray-800 mb-4">Goal Tracking</h2>
        
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //           {/* Daily Good Posture Card */}
// //           <div className="bg-blue-50 rounded-xl p-5">
// //             <div className="flex justify-between items-center mb-4">
// //               <h3 className="text-lg font-semibold text-gray-800">Daily Good Posture</h3>
// //               <div className="bg-blue-100 text-blue-600 text-sm font-medium px-3 py-1 rounded-full">
// //                 68%
// //               </div>
// //             </div>
// //             <div className="w-full bg-gray-200 rounded-full h-2.5">
// //               <div 
// //                 className="bg-blue-600 h-2.5 rounded-full" 
// //                 style={{ width: '68%' }}
// //               ></div>
// //             </div>
// //             <p className="text-sm text-gray-600 mt-2">Target: 80%</p>
// //           </div>

// //           {/* Weekly Avg Score Card */}
// //           <div className="bg-green-50 rounded-xl p-5">
// //             <div className="flex justify-between items-center mb-4">
// //               <h3 className="text-lg font-semibold text-gray-800">Weekly Avg Score</h3>
// //               <div className="bg-green-100 text-green-600 text-sm font-medium px-3 py-1 rounded-full">
// //                 78%
// //               </div>
// //             </div>
// //             <div className="w-full bg-gray-200 rounded-full h-2.5">
// //               <div 
// //                 className="bg-green-600 h-2.5 rounded-full" 
// //                 style={{ width: '78%' }}
// //               ></div>
// //             </div>
// //             <p className="text-sm text-gray-600 mt-2">Target: 85%</p>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Current Goals Section */}
// //       <div className="bg-white rounded-2xl p-6 shadow-md">
// //         <h2 className="text-xl font-bold text-gray-800 mb-4">Current Goals</h2>
        
// //         {/* Goal Item */}
// //         <div className="border border-gray-200 rounded-xl p-4 mb-4">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <h3 className="font-semibold text-gray-800">Posture Score {'>'} 85</h3>
// //               <p className="text-sm text-gray-600">Maintain good posture throughout the day</p>
// //             </div>
// //             <div className="flex items-center">
// //               <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
// //                 <span className="text-blue-600 font-bold">72%</span>
// //               </div>
// //               <div className="text-right">
// //                 <p className="text-sm text-gray-600">Progress</p>
// //                 <p className="text-sm font-medium text-gray-800">6/8 days</p>
// //               </div>
// //             </div>
// //           </div>
// //           <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
// //             <div 
// //               className="bg-blue-600 h-2 rounded-full" 
// //               style={{ width: '72%' }}
// //             ></div>
// //           </div>
// //         </div>

// //         {/* Goal Item */}
// //         <div className="border border-gray-200 rounded-xl p-4 mb-4">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <h3 className="font-semibold text-gray-800">Reduce Slouching</h3>
// //               <p className="text-sm text-gray-600">Keep back straight while working</p>
// //             </div>
// //             <div className="flex items-center">
// //               <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
// //                 <span className="text-green-600 font-bold">85%</span>
// //               </div>
// //               <div className="text-right">
// //                 <p className="text-sm text-gray-600">Progress</p>
// //                 <p className="text-sm font-medium text-gray-800">17/20 days</p>
// //               </div>
// //             </div>
// //           </div>
// //           <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
// //             <div 
// //               className="bg-green-600 h-2 rounded-full" 
// //               style={{ width: '85%' }}
// //             ></div>
// //           </div>
// //         </div>

// //         {/* Goal Item */}
// //         <div className="border border-gray-200 rounded-xl p-4">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <h3 className="font-semibold text-gray-800">Regular Breaks</h3>
// //               <p className="text-sm text-gray-600">Take breaks every 45 minutes</p>
// //             </div>
// //             <div className="flex items-center">
// //               <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-3">
// //                 <span className="text-amber-600 font-bold">60%</span>
// //               </div>
// //               <div className="text-right">
// //                 <p className="text-sm text-gray-600">Progress</p>
// //                 <p className="text-sm font-medium text-gray-800">12/20 days</p>
// //               </div>
// //             </div>
// //           </div>
// //           <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
// //             <div 
// //               className="bg-amber-600 h-2 rounded-full" 
// //               style={{ width: '60%' }}
// //             ></div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Add New Goal Button */}
// //       <div className="fixed bottom-6 right-6">
// //         <button className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition">
// //           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
// //           </svg>
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }


// import { useState, useEffect } from "react";
// import { ref, onValue, push, serverTimestamp } from "firebase/database";
// import { db } from "../services/firebase";
// import { motion, AnimatePresence } from "framer-motion";

// import Header from "../components/Header";

// // ✨ Reusable Animated Progress Bar Component
// const AnimatedProgressBar = ({ progress }) => (
//   <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
//     <motion.div
//       className="bg-blue-600 h-2.5 rounded-full"
//       initial={{ width: 0 }}
//       animate={{ width: `${progress}%` }}
//       transition={{ duration: 0.8, ease: "easeInOut" }}
//     />
//   </div>
// );

// // ✨ Reusable Add Goal Modal Component
// const AddGoalModal = ({ username, onClose }) => {
//   const [title, setTitle] = useState("");
//   const [target, setTarget] = useState(80);

//   const handleAddGoal = () => {
//     if (!title || !target) {
//       alert("Please fill in all fields.");
//       return;
//     }

//     const goalsRef = ref(db, `goals/${username}`);
//     push(goalsRef, {
//       title,
//       type: "daily_posture_score", // For now, we'll default to this type
//       target: Number(target),
//       status: "active",
//       createdAt: serverTimestamp(),
//     }).then(() => {
//       onClose();
//     }).catch(err => {
//       console.error("Failed to add goal:", err);
//       alert("Could not add goal. Please try again.");
//     });
//   };

//   return (
//     <motion.div
//       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//     >
//       <motion.div
//         className="bg-white rounded-2xl p-6 w-full max-w-md"
//         initial={{ scale: 0.9, y: 20 }}
//         animate={{ scale: 1, y: 0 }}
//         exit={{ scale: 0.9, y: 20 }}
//       >
//         <h2 className="text-2xl font-bold text-gray-800 mb-4">Add a New Goal</h2>
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Goal Title</label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="e.g., Improve Daily Score"
//               className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Target Score (%)</label>
//             <input
//               type="number"
//               value={target}
//               onChange={(e) => setTarget(e.target.value)}
//               placeholder="e.g., 85"
//               className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>
//         <div className="mt-6 flex justify-end gap-3">
//           <button onClick={onClose} className="px-4 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition">Cancel</button>
//           <button onClick={handleAddGoal} className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition">Add Goal</button>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };


// export default function Goals() {
//   const [username, setUsername] = useState(null);
//   const [goals, setGoals] = useState([]);
//   const [dailyScore, setDailyScore] = useState(0);
//   const [weeklyScore, setWeeklyScore] = useState(0);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     const user = localStorage.getItem("loggedInUser");
//     setUsername(user);

//     if (user) {
//       // Fetch user's goals
//       const goalsRef = ref(db, `goals/${user}`);
//       onValue(goalsRef, (snapshot) => {
//         const data = snapshot.val();
//         const loadedGoals = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
//         setGoals(loadedGoals);
//       });

//       // Fetch history to calculate scores
//       const historyRef = ref(db, `history/${user}`);
//       onValue(historyRef, (snapshot) => {
//         const historyData = snapshot.val();
//         if (!historyData) return;

//         const sessions = Object.values(historyData);
//         calculateScores(sessions);
//       });
//     }
//   }, []);

//   const calculateScores = (sessions) => {
//     const now = new Date();
//     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//     const oneWeekAgo = new Date();
//     oneWeekAgo.setDate(now.getDate() - 7);

//     // Daily Score Calculation
//     const todaySessions = sessions.filter(s => new Date(s.sessionEndTime) >= today);
//     let todayGood = 0;
//     let todayTotal = 0;
//     todaySessions.forEach(s => {
//       todayGood += s.goodCount || 0;
//       todayTotal += (s.goodCount || 0) + (s.moderateCount || 0) + (s.badCount || 0);
//     });
//     setDailyScore(todayTotal > 0 ? Math.round((todayGood / todayTotal) * 100) : 0);
    
//     // Weekly Score Calculation
//     const weeklySessions = sessions.filter(s => new Date(s.sessionEndTime) >= oneWeekAgo);
//     let weeklyGood = 0;
//     let weeklyTotal = 0;
//     weeklySessions.forEach(s => {
//       weeklyGood += s.goodCount || 0;
//       weeklyTotal += (s.goodCount || 0) + (s.moderateCount || 0) + (s.badCount || 0);
//     });
//     setWeeklyScore(weeklyTotal > 0 ? Math.round((weeklyGood / weeklyTotal) * 100) : 0);
//   };

//   const calculateProgress = (goal) => {
//     // This can be expanded for different goal types
//     switch (goal.type) {
//       case "daily_posture_score":
//         return Math.min(Math.round((dailyScore / goal.target) * 100), 100);
//       default:
//         return 0;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-6">
//       <Header />
      
//       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
//         {/* Page Title */}
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">My Goals</h1>
//           <p className="text-gray-600">Track and achieve your posture improvement targets.</p>
//         </div>

//         {/* Goal Tracking Section */}
//         <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
//           <h2 className="text-xl font-bold text-gray-800 mb-4">Performance Summary</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="bg-blue-50 rounded-xl p-5">
//               <h3 className="text-lg font-semibold text-gray-800">Today's Good Posture</h3>
//               <p className="text-3xl font-bold text-blue-600 my-2">{dailyScore}%</p>
//               <div className="w-full bg-blue-200 rounded-full h-2.5">
//                 <motion.div className="bg-blue-600 h-2.5 rounded-full" initial={{width:0}} animate={{width:`${dailyScore}%`}}/>
//               </div>
//             </div>
//             <div className="bg-green-50 rounded-xl p-5">
//               <h3 className="text-lg font-semibold text-gray-800">Last 7 Days Average</h3>
//               <p className="text-3xl font-bold text-green-600 my-2">{weeklyScore}%</p>
//               <div className="w-full bg-green-200 rounded-full h-2.5">
//                 <motion.div className="bg-green-600 h-2.5 rounded-full" initial={{width:0}} animate={{width:`${weeklyScore}%`}}/>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Current Goals Section */}
//         <div className="bg-white rounded-2xl p-6 shadow-md">
//           <h2 className="text-xl font-bold text-gray-800 mb-4">Active Goals</h2>
//           <AnimatePresence>
//             {goals.length > 0 ? (
//               goals.map((goal, index) => (
//                 <motion.div
//                   key={goal.id}
//                   className="border border-gray-200 rounded-xl p-4 mb-4"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h3 className="font-semibold text-gray-800">{goal.title}</h3>
//                       <p className="text-sm text-gray-600">Target: {goal.target}%</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-sm font-bold text-blue-600">
//                         {calculateProgress(goal)}% Complete
//                       </p>
//                     </div>
//                   </div>
//                   <AnimatedProgressBar progress={calculateProgress(goal)} />
//                 </motion.div>
//               ))
//             ) : (
//               <p className="text-gray-500 text-center py-4">You have no active goals. Add one to get started!</p>
//             )}
//           </AnimatePresence>
//         </div>
//       </motion.div>

//       {/* Add New Goal Button */}
//       <div className="fixed bottom-6 right-6">
//         <motion.button
//           onClick={() => setIsModalOpen(true)}
//           className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//         >
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
//         </motion.button>
//       </div>
      
//       <AnimatePresence>
//         {isModalOpen && <AddGoalModal username={username} onClose={() => setIsModalOpen(false)} />}
//       </AnimatePresence>
//     </div>
//   );
// }

// src/pages/Goals.jsx


import { useState, useEffect } from "react";
import { ref, onValue, push, serverTimestamp, remove } from "firebase/database";
import { db } from "../services/firebase";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";

// Reusable Animated Progress Bar Component
const AnimatedProgressBar = ({ progress }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
    <motion.div
      className="bg-blue-600 h-2.5 rounded-full"
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    />
  </div>
);

// Reusable Add Goal Modal Component with Dropdown
const AddGoalModal = ({ username, onClose }) => {
  // State to manage dropdown selection and custom input
  const [selectedGoal, setSelectedGoal] = useState("Improve Daily Score");
  const [customTitle, setCustomTitle] = useState("");
  const [target, setTarget] = useState(80);

  // Predefined goal options for the dropdown
  const goalOptions = [
    "Improve Daily Score",
    "Maintain Good Posture",
    "Reduce Slouching Time",
    "Complete a 60-min session",
    "Other", // This will show the text input
  ];

  const handleAddGoal = () => {
    // Determine the final title based on dropdown selection
    const finalTitle = selectedGoal === "Other" ? customTitle : selectedGoal;

    if (!finalTitle || !target) {
      alert("Please ensure the goal title and target are filled in.");
      return;
    }

    const goalsRef = ref(db, `goals/${username}`);
    push(goalsRef, {
      title: finalTitle,
      type: "daily_posture_score", // For now, we'll default to this type
      target: Number(target),
      status: "active",
      createdAt: serverTimestamp(),
    }).then(() => {
      onClose();
    }).catch(err => {
      console.error("Failed to add goal:", err);
      alert("Could not add goal. Please try again.");
    });
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl p-6 w-full max-w-md"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Add a New Goal</h2>
        <div className="space-y-4">
          {/* Dropdown for Goal Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Select a Goal</label>
            <select
              value={selectedGoal}
              onChange={(e) => setSelectedGoal(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {goalOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Conditional Text Input for "Other" */}
          {selectedGoal === "Other" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="overflow-hidden"
            >
              <label className="block text-sm font-medium text-gray-700">Custom Goal Title</label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g., Sit straight for 2 hours"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </motion.div>
          )}

          {/* Target Score Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Target Score (%)</label>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="e.g., 85"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition">Cancel</button>
          <button onClick={handleAddGoal} className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition">Add Goal</button>
        </div>
      </motion.div>
    </motion.div>
  );
};


export default function Goals() {
  const [username, setUsername] = useState(null);
  const [goals, setGoals] = useState([]);
  const [dailyScore, setDailyScore] = useState(0);
  const [weeklyScore, setWeeklyScore] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    setUsername(user);

    if (user) {
      // Fetch user's goals
      const goalsRef = ref(db, `goals/${user}`);
      onValue(goalsRef, (snapshot) => {
        const data = snapshot.val();
        const loadedGoals = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
        setGoals(loadedGoals);
      });

      // Fetch history to calculate scores
      const historyRef = ref(db, `history/${user}`);
      onValue(historyRef, (snapshot) => {
        const historyData = snapshot.val();
        if (!historyData) return;

        const sessions = Object.values(historyData);
        calculateScores(sessions);
      });
    }
  }, []);

  const calculateScores = (sessions) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    // Daily Score Calculation
    const todaySessions = sessions.filter(s => new Date(s.sessionEndTime) >= today);
    let todayGood = 0;
    let todayTotal = 0;
    todaySessions.forEach(s => {
      todayGood += s.goodCount || 0;
      todayTotal += (s.goodCount || 0) + (s.moderateCount || 0) + (s.badCount || 0);
    });
    setDailyScore(todayTotal > 0 ? Math.round((todayGood / todayTotal) * 100) : 0);
    
    // Weekly Score Calculation
    const weeklySessions = sessions.filter(s => new Date(s.sessionEndTime) >= oneWeekAgo);
    let weeklyGood = 0;
    let weeklyTotal = 0;
    weeklySessions.forEach(s => {
      weeklyGood += s.goodCount || 0;
      weeklyTotal += (s.goodCount || 0) + (s.moderateCount || 0) + (s.badCount || 0);
    });
    setWeeklyScore(weeklyTotal > 0 ? Math.round((weeklyGood / weeklyTotal) * 100) : 0);
  };

  const calculateProgress = (goal) => {
    // This can be expanded for different goal types
    switch (goal.type) {
      case "daily_posture_score":
        return Math.min(Math.round((dailyScore / goal.target) * 100), 100);
      default:
        return 0;
    }
  };

  const handleDeleteGoal = (goalId) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      const goalRef = ref(db, `goals/${username}/${goalId}`);
      remove(goalRef)
        .then(() => {
          console.log("Goal deleted successfully!");
        })
        .catch(err => {
          console.error("Failed to delete goal:", err);
          alert("Could not delete goal. Please try again.");
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-6">
      <Header />
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Goals</h1>
          <p className="text-gray-600">Track and achieve your posture improvement targets.</p>
        </div>

        {/* Goal Tracking Section */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Performance Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-800">Today's Good Posture</h3>
              <p className="text-3xl font-bold text-blue-600 my-2">{dailyScore}%</p>
              <div className="w-full bg-blue-200 rounded-full h-2.5">
                <motion.div className="bg-blue-600 h-2.5 rounded-full" initial={{width:0}} animate={{width:`${dailyScore}%`}}/>
              </div>
            </div>
            <div className="bg-green-50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-800">Last 7 Days Average</h3>
              <p className="text-3xl font-bold text-green-600 my-2">{weeklyScore}%</p>
              <div className="w-full bg-green-200 rounded-full h-2.5">
                <motion.div className="bg-green-600 h-2.5 rounded-full" initial={{width:0}} animate={{width:`${weeklyScore}%`}}/>
              </div>
            </div>
          </div>
        </div>

        {/* Current Goals Section */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Active Goals</h2>
          <AnimatePresence>
            {goals.length > 0 ? (
              goals.map((goal, index) => (
                <motion.div
                  key={goal.id}
                  layout
                  className="border border-gray-200 rounded-xl p-4 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50, transition: { duration: 0.3 } }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{goal.title}</h3>
                      <p className="text-sm text-gray-600">Target: {goal.target}%</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-bold text-blue-600">
                          {calculateProgress(goal)}% Complete
                        </p>
                      </div>
                      <button 
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="text-gray-400 hover:text-red-500 transition"
                        aria-label="Delete goal"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </div>
                  <AnimatedProgressBar progress={calculateProgress(goal)} />
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">You have no active goals. Add one to get started!</p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Add New Goal Button */}
      <div className="fixed bottom-6 right-6">
        <motion.button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
        </motion.button>
      </div>
      
      <AnimatePresence>
        {isModalOpen && <AddGoalModal username={username} onClose={() => setIsModalOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}