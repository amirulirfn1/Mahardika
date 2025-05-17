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

  // Check if user is admin based on email
  const isAdminEmail = useCallback((email) => {
    // Admin emails that should always have admin access
    const adminEmails = ['amirulirfan.utm@gmail.com'];
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
    
    // Log initial state
    console.log('[DEBUG] AuthProvider - Initial state:', { 
      currentUser: currentUser ? 'Authenticated' : 'Not authenticated',
      loading,
      userRole,
      userData: !!userData
    });
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('[DEBUG] Auth state changed - User signed in:', user ? user.email : 'No user signed in');
      
      if (user) {
        console.log('[DEBUG] Auth state changed - User signed in:', user.email);
        try {
          const userData = await fetchUserData(user);
          console.log('[DEBUG] Fetched user data:', userData);
          
          // Set user role based on email or user data
          if (isAdminEmail(user.email) || (userData && userData.role === 'admin')) {
            setUserRole('admin');
          } else if (userData && userData.role) {
            setUserRole(userData.role);
          } else {
            setUserRole('user');
          }
          
          setUserData(userData);
          setCurrentUser({
            ...user,
            userRole: userRole || 'No role set',
            userData: !!userData
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserRole(null);
          setUserData(null);
          setCurrentUser(null);
        }
      } else {
        console.log('[DEBUG] Auth state changed - No user signed in');
        setCurrentUser(null);
        setUserRole(null);
        setUserData(null);
      }
      setLoading(false);
    });
    
    return () => {
      console.log('[DEBUG] AuthProvider - Cleaning up auth state listener');
      unsubscribe();
    };
  }, [fetchUserData, isAdminEmail]);

  // Sign in with email and password
  const signInWithEmail = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw new Error(error.message || 'Failed to sign in');
    }
  };
  
  // Alias for backward compatibility
  const loginWithEmail = signInWithEmail;

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
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw new Error(error.message || 'Failed to sign in with Google');
    }
  };

  // Sign out
  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  };
  
  // Alias for backward compatibility
  const logout = signOutUser;

  const value = {
    currentUser,
    userRole,
    userData,
    loading,
    isAdmin: userRole === 'admin' || isAdminEmail(currentUser?.email),
    isStaff: userRole === 'staff',
    isCustomer: userRole === 'customer' || userRole === 'user',
    loginWithEmail, // deprecated, use signInWithEmail instead
    signInWithEmail,
    signInWithGoogle,
    signUpWithEmail,
    logout, // deprecated, use signOutUser instead
    signOut: signOutUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
