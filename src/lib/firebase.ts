import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgZUtc5aZguYz_MW5zISkuLvDgPmDixfg",
  authDomain: "meratus-frd-lms-10276.firebaseapp.com",
  projectId: "meratus-frd-lms-10276",
  storageBucket: "meratus-frd-lms-10276.firebasestorage.app",
  messagingSenderId: "845694770386",
  appId: "1:845694770386:web:2cc945da40fb4e5ffd610b",
  measurementId: "G-B630DF0RRP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export agar siap dipakai di komponen lain
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);