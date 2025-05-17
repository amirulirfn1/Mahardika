import { auth, db, storage } from './config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  query, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Auth functions
export const loginWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const registerWithEmail = async (email, password, displayName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName });
  return userCredential;
};

export const logoutUser = () => {
  return signOut(auth);
};

export const resetPassword = (email) => {
  return sendPasswordResetEmail(auth, email);
};

// Firestore functions
export const createDocument = async (collectionName, documentId, data) => {
  const docRef = doc(db, collectionName, documentId);
  await setDoc(docRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef;
};

export const getDocument = async (collectionName, documentId) => {
  const docRef = doc(db, collectionName, documentId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

export const updateDocument = async (collectionName, documentId, data) => {
  const docRef = doc(db, collectionName, documentId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
  return docRef;
};

export const deleteDocument = (collectionName, documentId) => {
  return deleteDoc(doc(db, collectionName, documentId));
};

export const queryDocuments = async (collectionName, conditions) => {
  const q = query(collection(db, collectionName), ...conditions);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Storage functions
export const uploadFile = async (file, path) => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};

// Helper to create or update user profile in Firestore
export const createUserProfileDocument = async (user, additionalData = {}) => {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);
  const { displayName, email, photoURL } = user;
  const createdAt = new Date();

  if (!snapshot.exists()) {
    try {
      await setDoc(userRef, {
        displayName,
        email,
        photoURL,
        createdAt,
        updatedAt: createdAt,
        ...additionalData
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  } else {
    try {
      await updateDoc(userRef, {
        displayName: displayName || snapshot.data().displayName,
        photoURL: photoURL || snapshot.data().photoURL,
        updatedAt: createdAt
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  }

  return userRef;
};

// Helper to get current user
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};
