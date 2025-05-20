import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Check if configuration is complete
const missingKeys = Object.entries(firebaseConfig)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

// Log configuration status
if (missingKeys.length > 0) {
  console.warn(`[Firebase] Missing configuration keys: ${missingKeys.join(', ')}`);
  console.warn('[Firebase] Please ensure environment variables are properly set');
} else {
  console.log('[Firebase] Configuration loaded successfully');
}

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
