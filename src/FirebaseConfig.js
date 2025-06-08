// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // 
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBmBZMbzppqBJhPqRMKCOxAnuBzStqiUto",
  authDomain: "petpooja-f5e8f.firebaseapp.com",
  projectId: "petpooja-f5e8f",
  storageBucket: "petpooja-f5e8f.firebasestorage.app",
  messagingSenderId: "878023409778",
  appId: "1:878023409778:web:aa67ea66cdb7a61247c2eb",
  measurementId: "G-2ZBYNKLNBY"
};

// ✅ Initialize app
const app = initializeApp(firebaseConfig);

// Optional analytics
const analytics = getAnalytics(app);

// ✅ Export Firebase services
export const auth = getAuth(app);

export const db = getFirestore(app);
