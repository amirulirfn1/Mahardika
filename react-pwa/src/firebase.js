// Firebase App (the core Firebase SDK) is always required
import { initializeApp } from 'firebase/app';

// Import specific Firebase services
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';

import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';

import { 
  getAnalytics, 
  isSupported,
  logEvent
} from 'firebase/analytics';

// Helper function to get config variables from window.ENV (production) or process.env (development)
const getEnvVar = (key) => {
  // Check if window.ENV is available (production build)
  if (typeof window !== 'undefined' && window.ENV && window.ENV[key]) {
    return window.ENV[key];
  }
  // Fallback to process.env (development)
  return process.env[key];
};

// Firebase configuration
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
  console.warn('[Firebase] Create a .env file in the project root with the required variables');
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

// Auth Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Firestore helpers
const createUserProfileDocument = async (userAuth, additionalData = {}) => {
  if (!userAuth) return;

  const userRef = doc(db, 'users', userAuth.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { displayName, email, photoURL } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userRef, {
        displayName,
        email,
        photoURL,
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.error('Error creating user profile', error);
    }
  }

  return userRef;
};

// Storage helpers
const uploadFile = async (file, path) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

const deleteFile = async (filePath) => {
  const fileRef = ref(storage, filePath);
  return deleteObject(fileRef);
};

// Export everything
export {
  // Core
  app,
  auth,
  db,
  storage,
  analytics,
  serverTimestamp,
  Timestamp,
  
  // Auth
  googleProvider,
  facebookProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  onAuthStateChanged,
  
  // Firestore
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  
  // Storage
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  
  // Helpers
  createUserProfileDocument,
  uploadFile,
  deleteFile,
  
  // Analytics
  logEvent
};

export default app;
