import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  // Use environment variables if available (development), otherwise use hardcoded values (production)
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyD5JKcjbnU-fNWyR4Or8fqD08O-_uMvf9Q",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "mahardika-59eee.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "mahardika-59eee",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "mahardika-59eee.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "121241559543",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:121241559543:web:c6c137853403a833eecef2",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-KE2VXWQ3MS"
};

// Log Firebase initialization for debugging
console.log('[Firebase] Initializing with config:', {
  apiKey: firebaseConfig.apiKey ? "[HIDDEN]" : "[MISSING]",
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId ? "[PRESENT]" : "[MISSING]",
  measurementId: firebaseConfig.measurementId
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Analytics only in browser context
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then(yes => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

export { 
  auth, 
  db, 
  storage, 
  analytics,
  app as default 
};
