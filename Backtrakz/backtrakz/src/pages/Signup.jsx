import React, { useState } from "react";
import { signupUser } from "../services/userService";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Signup() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !username || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await signupUser(name, username, password);
      navigate("/home", { state: { username } });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <img
        src={logo}
        alt="BackTrackz Logo"
        className="h-32 w-32 mb-6 object-contain"
      />

      <h2 className="text-2xl font-semibold text-blue-600 mb-6">Sign Up</h2>

      <form onSubmit={handleSignup} className="w-full max-w-sm space-y-4">
        <div>
          <label className="block text-blue-800 font-medium mb-1">Name:</label>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-blue-800 font-medium mb-1">Username:</label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-blue-800 font-medium mb-1">Password:</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition text-lg"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <button
          type="button"
          className="text-blue-600 hover:underline font-medium"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </p>
    </div>
  );
}


// import React, { useState } from "react";
// import { signupUser } from "../services/userService";
// import { useNavigate } from "react-router-dom";
// import logo from "../assets/logo.png";

// // --- SVG Icons ---
// const NameIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
//     <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1.172a2 2 0 01-1.414-.586l-.828-.828A2 2 0 0011.172 2H8.828a2 2 0 00-1.414.586l-.828.828A2 2 0 015.172 4H4zm10 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
//   </svg>
// );
// const UserIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg> );
// const LockIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg> );
// const EyeOpenIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639l4.418-5.58a1.012 1.012 0 011.581 0l4.418 5.58c.278.352.278.885 0 1.238l-4.418 5.58a1.012 1.012 0 01-1.581 0l-4.418-5.58z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> );
// const EyeClosedIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228" /></svg> );


// export default function Signup() {
//   const [name, setName] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setError("");
//     setIsLoading(true);

//     // ✅ Trim whitespace from all inputs
//     const trimmedName = name.trim();
//     const trimmedUsername = username.trim();
//     const trimmedPassword = password.trim();

//     // ✅ Validate that inputs are not empty after trimming
//     if (!trimmedName || !trimmedUsername || !trimmedPassword) {
//       setError("Please fill in all fields.");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       await signupUser(trimmedName, trimmedUsername, trimmedPassword);
//       // On successful signup, navigate to login to encourage first login
//       navigate("/login");
//     } catch (err) {
//       setError(err.message || "Signup failed. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-white">
//       {/* Main Content Area */}
//       <main className="flex-grow flex flex-col justify-center px-6 py-12">
//         <div className="text-center">
//           <img src={logo} alt="BackTrackz Logo" className="h-20 w-20 mx-auto mb-4 object-contain" />
//           <h2 className="text-3xl font-bold text-gray-900">Create an Account</h2>
//           <p className="text-gray-500 mt-2">Let's get you started!</p>
//         </div>

//         {error && (
//           <div className="mt-6 w-full p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSignup} className="mt-8 space-y-6">
//           {/* Name Input */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <NameIcon />
//             </div>
//             <input
//               type="text"
//               placeholder="Full Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//               required
//             />
//           </div>

//           {/* Username Input */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <UserIcon />
//             </div>
//             <input
//               type="text"
//               placeholder="Username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//               required
//             />
//           </div>

//           {/* Password Input */}
//           <div className="relative">
//              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <LockIcon />
//             </div>
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//               required
//             />
//             <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center"
//             >
//                 {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
//             </button>
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full flex justify-center bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
//           >
//             {isLoading ? (
//               <>
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
//                 Creating Account...
//               </>
//             ) : (
//               'Sign Up'
//             )}
//           </button>
//         </form>
//       </main>

//       {/* Footer Area */}
//       <footer className="px-6 pb-8 text-center">
//         <p className="text-sm text-gray-600">
//           Already have an account?{" "}
//           <button
//             className="text-blue-600 hover:underline font-medium focus:outline-none"
//             onClick={() => navigate("/login")}
//           >
//             Login
//           </button>
//         </p>
//       </footer>
//     </div>
//   );
// }