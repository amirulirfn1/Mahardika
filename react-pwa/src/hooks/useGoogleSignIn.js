import { useState } from 'react';
import { auth, googleProvider, signInWithPopup, createUserProfileDocument } from '../firebase';

export function useGoogleSignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, googleProvider);
      const { user } = result;
      
      // Create or update user profile in Firestore
      await createUserProfileDocument(user);
      
      setLoading(false);
      return { success: true, user };
    } catch (error) {
      console.error('Google Sign In Error:', error);
      setError(error);
      setLoading(false);
      return { success: false, error };
    }
  };

  return { signInWithGoogle, loading, error };
}

export default useGoogleSignIn;
