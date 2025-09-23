// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBKlkfBqYONPO1N-mvi6S-VAxbOAiXncvo",
  authDomain: "fir-realtimeapp-3a162.firebaseapp.com",
  databaseURL: "https://fir-realtimeapp-3a162-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fir-realtimeapp-3a162",
  storageBucket: "fir-realtimeapp-3a162.firebasestorage.app",
  messagingSenderId: "823562435061",
  appId: "1:823562435061:android:dbcb6ead649525e13208bc",
};


const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
