import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  updateProfile,
  onAuthStateChanged 
} from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);

  // Admin emails that should always have admin access
  const adminEmails = ['amirulirfan.utm@gmail.com'];

  // Check if user is admin based on email
  const isAdminEmail = useCallback((email) => {
    return email && adminEmails.includes(email);
  }, []);

  // Fetch user data from Firestore
  const fetchUserData = useCallback(async (user) => {
    if (!user) return null;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    console.log('[DEBUG] AuthProvider - Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('[DEBUG] Auth state changed:', user ? 'User logged in' : 'No user');
      if (user) {
        // Check if user is admin by email
        const isAdmin = isAdminEmail(user.email);
        console.log('[DEBUG] User email:', user.email, 'Is admin:', isAdmin);
        
        // Get user data from Firestore
        console.log('[DEBUG] Fetching user data for UID:', user.uid);
        const userData = await fetchUserData(user);
        console.log('[DEBUG] User data from Firestore:', userData);
        setUserData(userData);
        
        // Set user role (prioritize Firestore role, fallback to email check)
        if (userData && userData.role) {
          setUserRole(userData.role);
        } else if (isAdmin) {
          setUserRole('admin');
        } else {
          setUserRole('user');
        }
      } else {
        setUserRole(null);
        setUserData(null);
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [fetchUserData, isAdminEmail]);

  // Sign in with email and password
  const loginWithEmail = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw new Error(error.message || 'Failed to sign in');
    }
  };

  // Sign up with email and password
  const signUpWithEmail = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with display name
      if (displayName) {
        await updateProfile(userCredential.user, {
          displayName
        });
      }

      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: displayName || '',
        role: 'user', // Default role
        createdAt: new Date().toISOString()
      });

      return userCredential.user;
    } catch (error) {
      console.error('Error signing up:', error);
      throw new Error(error.message || 'Failed to create an account');
    }
  };

  // Sign in with Google
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create user document if it doesn't exist
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          role: isAdminEmail(user.email) ? 'admin' : 'user',
          createdAt: new Date().toISOString()
        });
      }
      
      return user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw new Error(error.message || 'Failed to sign in with Google');
    }
  };

  // Sign out
  const logoutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  };

  const value = {
    currentUser,
    userRole,
    userData,
    loading,
    isAdmin: userRole === 'admin' || isAdminEmail(currentUser?.email),
    isStaff: userRole === 'staff',
    isCustomer: userRole === 'customer' || userRole === 'user',
    loginWithEmail,
    signUpWithEmail,
    loginWithGoogle,
    logout: logoutUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
