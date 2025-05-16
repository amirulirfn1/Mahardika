import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useGoogleSignIn from '../../hooks/useGoogleSignIn';

const GoogleSignIn = ({ buttonText = 'Continue with Google', onSuccess, onError }) => {
  const navigate = useNavigate();
  const { signInWithGoogle, loading } = useGoogleSignIn();

  const handleGoogleSignIn = async () => {
    const { success, user, error } = await signInWithGoogle();
    
    if (success) {
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(user);
      } else {
        // Default success behavior
        toast.success(`Welcome back, ${user.displayName || 'User'}!`);
        navigate('/dashboard');
      }
    } else if (error) {
      // Call error callback if provided
      if (onError) {
        onError(error);
      } else {
        // Default error handling
        toast.error(error.message || 'Failed to sign in with Google');
      }
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={loading}
      type="button"
      className={`w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${loading ? 'text-gray-500 bg-gray-100' : 'text-gray-700 bg-white hover:bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Signing in...
        </>
      ) : (
        <>
          <FcGoogle className="w-5 h-5 mr-2" />
          {buttonText}
        </>
      )}
    </button>
  );
};

export default GoogleSignIn;
