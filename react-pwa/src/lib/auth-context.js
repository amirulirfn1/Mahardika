import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if user is admin by email
        const isAdmin = isAdminEmail(user.email);
        
        // Get user data from Firestore
        const userData = await fetchUserData(user);
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

  const value = {
    currentUser,
    userRole,
    userData,
    loading,
    isAdmin: userRole === 'admin' || isAdminEmail(currentUser?.email),
    isStaff: userRole === 'staff',
    isCustomer: userRole === 'customer' || userRole === 'user'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
