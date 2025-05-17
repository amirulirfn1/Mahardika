import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  sendEmailVerification as sendEmailVerificationFirebase 
} from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

// Import necessary CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Import CSS from src directory
import '../../../../src/assets/dashboard/css/style.css';

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  // Add user to Firestore with role
  const addUserToFirestore = async (user, additionalData = {}) => {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // Set default role as 'user', will be updated if email matches admin
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        role: user.email === 'amirulirfan.utm@gmail.com' ? 'admin' : 'user',
        emailVerified: user.emailVerified,
        createdAt: new Date().toISOString(),
        ...additionalData
      };
      
      await setDoc(userRef, userData, { merge: true });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Add user to Firestore
      await addUserToFirestore(user, {
        displayName: user.displayName,
        photoURL: user.photoURL
      });
      
      // Send email verification if not verified
      if (!user.emailVerified) {
        // Note: Google Sign-In automatically verifies the email
        // So this is just a fallback
        await sendEmailVerification(user);
      }
      
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Google Sign In Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const sendEmailVerification = async (user) => {
    try {
      await sendEmailVerificationFirebase(user);
      return 'Verification email sent. Please check your inbox.';
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Add user to Firestore if new
      await addUserToFirestore(user);
      
      // Check if email is verified
      if (!user.emailVerified) {
        const message = await sendEmailVerification(user);
        await auth.signOut(); // Sign out if email is not verified
        setError(`Please verify your email before signing in. ${message}`);
        return;
      }
      
      // If email is verified, proceed to the app
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Auth error:', err);
      let errorMessage = 'Failed to sign in. Please check your credentials.';
      
      // Handle specific error cases
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later or reset your password.';
      } else if (err.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled. Please contact support.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Add NiceAdmin body class on mount
  useEffect(() => {
    document.body.classList.add('bg-light');
    return () => {
      document.body.classList.remove('bg-light');
    };
  }, []);

  return (
    <main>
      <div className="container">
        <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                <div className="d-flex justify-content-center py-4">
                  <a href="/" className="logo d-flex align-items-center w-auto">
                    <img src="/assets/dashboard/img/logo.png" alt="" />
                    <span className="d-none d-lg-block">Mahardika</span>
                  </a>
                </div>

                <div className="card mb-3">
                  <div className="card-body">
                    <div className="pt-4 pb-2">
                      <h5 className="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                      <p className="text-center small">Enter your email & password to login</p>
                    </div>

                    {error && (
                      <div className="alert alert-danger py-2" role="alert">
                        {error}
                      </div>
                    )}

                    <form className="row g-3 needs-validation" onSubmit={handleSubmit} noValidate>
                      <div className="col-12">
                        <label htmlFor="email" className="form-label">Email</label>
                        <div className="input-group has-validation">
                          <span className="input-group-text" id="inputGroupPrepend"><i className="bi bi-envelope"></i></span>
                          <input
                            type="email"
                            name="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                          <div className="invalid-feedback">Please enter your email.</div>
                        </div>
                      </div>

                      <div className="col-12">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                          type="password"
                          name="password"
                          className="form-control"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <div className="invalid-feedback">Please enter your password!</div>
                      </div>

                      <div className="col-12">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="remember"
                            value="true"
                            id="rememberMe"
                          />
                          <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                        </div>
                      </div>
                      
                      <div className="col-12">
                        <button
                          className="btn btn-primary w-100"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Loading...
                            </>
                          ) : 'Login'}
                        </button>
                      </div>
                      
                      <div className="col-12">
                        <div className="text-center my-3">
                          <div className="divider d-inline-flex align-items-center">
                            <span className="px-2">OR</span>
                          </div>
                        </div>
                        
                        <button
                          type="button"
                          className="btn btn-outline-primary w-100 mb-3 d-flex align-items-center justify-content-center"
                          onClick={handleGoogleSignIn}
                          disabled={loading}
                        >
                          <img 
                            src="https://www.google.com/favicon.ico" 
                            alt="Google" 
                            width="20" 
                            height="20" 
                            className="me-2"
                          />
                          Sign in with Google
                        </button>
                      </div>
                      
                      <div className="text-center mt-3">
                        <p className="small mb-0">
                          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                          <button 
                            type="button" 
                            className="btn btn-link p-0"
                            onClick={() => setIsSignUp(!isSignUp)}
                          >
                            {isSignUp ? 'Sign in' : 'Sign up'}
                          </button>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;
