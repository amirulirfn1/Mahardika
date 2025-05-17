import { useState } from 'react';
import { auth } from '../lib/firebase';
import { createUserProfileDocument } from '../lib/user-utils';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export function useGoogleSignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Create a new Google provider instance
      const provider = new GoogleAuthProvider();
      
      // Sign in with Google
      const result = await signInWithPopup(auth, provider);
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
