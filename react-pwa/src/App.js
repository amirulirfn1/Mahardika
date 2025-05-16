import React from 'react';
import { useAuth } from './hooks/useAuth';
import GoogleSignIn from './components/auth/GoogleSignIn';
import { auth } from './firebase/config';
import { signOut } from 'firebase/auth';
import './App.css';

function App() {
  const { currentUser } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Welcome to Mahardika
        </h1>
        
        {currentUser ? (
          <div className="text-center">
            <div className="mb-4">
              {currentUser.photoURL && (
                <img 
                  src={currentUser.photoURL} 
                  alt={currentUser.displayName || 'User'}
                  className="w-20 h-20 rounded-full mx-auto mb-3"
                />
              )}
              <h2 className="text-xl font-semibold">
                Welcome, {currentUser.displayName || 'User'}!
              </h2>
              <p className="text-gray-600">{currentUser.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Sign Out
            </button>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-md text-left">
              <h3 className="font-medium mb-2">User Object:</h3>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                {JSON.stringify(currentUser, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <GoogleSignIn 
                buttonText="Sign in with Google"
                onSuccess={(user) => {
                  console.log('User signed in:', user);
                }}
                onError={(error) => {
                  console.error('Error signing in:', error);
                }}
              />
            </div>
            <p className="text-center text-sm text-gray-600">
              Sign in to access your account
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
