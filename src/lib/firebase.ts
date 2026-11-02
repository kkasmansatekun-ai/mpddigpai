import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Web app's Firebase configuration provided by user
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCHHuFKwzvPXCDc-dTanIB0yim-MrV4-uY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mpd-digpai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mpd-digpai",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mpd-digpai.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "741425404742",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:741425404742:web:1dfc240b4d30faa3942347"
};

// Initialize Firebase safely (avoid duplicate initialization)
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
