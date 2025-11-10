// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, push, onValue, update } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIrVOglgZALaaK6IwPwqHMiynBGD4Z3JM",
  authDomain: "mohammedi-cabinet.firebaseapp.com",
  databaseURL: "https://mohammedi-cabinet-default-rtdb.firebaseio.com",
  projectId: "mohammedi-cabinet",
  storageBucket: "mohammedi-cabinet.firebasestorage.app",
  messagingSenderId: "666383356275",
  appId: "1:666383356275:web:09de11f9dfa2451d843506",
  measurementId: "G-VT06BFXNP1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
