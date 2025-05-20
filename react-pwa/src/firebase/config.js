import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration using environment variables
// First try to get from window.ENV (for production), then fallback to process.env (for development)
const getEnvVar = (key) => {
  // Check if window.ENV is available (production build)
  if (typeof window !== 'undefined' && window.ENV && window.ENV[key]) {
    return window.ENV[key];
  }
  // Fallback to process.env (development)
  return process.env[key];
};

const firebaseConfig = {
  apiKey: getEnvVar('REACT_APP_FIREBASE_API_KEY'),
  authDomain: getEnvVar('REACT_APP_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('REACT_APP_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('REACT_APP_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('REACT_APP_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('REACT_APP_FIREBASE_APP_ID'),
  measurementId: getEnvVar('REACT_APP_FIREBASE_MEASUREMENT_ID')
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
