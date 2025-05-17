import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app;
let auth;
let db;

try {
  // Check if Firebase app is already initialized
  if (getApps().length === 0) {
    // Initialize Firebase app if not already initialized
    app = initializeApp(firebaseConfig);
  } else {
    // Use existing app if already initialized
    app = getApp();
  }
  
  // Initialize auth and firestore
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Fallback initialization in case of any errors
  if (!app) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
}

export { auth, db };
export default app;
