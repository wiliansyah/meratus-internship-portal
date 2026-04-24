// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Untuk Database
import { getAuth } from "firebase/auth";           // Untuk Fitur Login (opsional nanti)

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
const analytics = getAnalytics(app);

// Export Firestore dan Auth agar bisa digunakan di file React (komponen) Anda
export const db = getFirestore(app);
export const auth = getAuth(app);