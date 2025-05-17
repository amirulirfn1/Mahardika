import React from 'react';
import { useLocation } from 'react-router-dom';
import SignIn from '../../../components/auth/SignIn';

// Import CSS from src directory
import '../../../../src/assets/dashboard/css/style.css';

function SignInPage() {
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  
  return (
    <div className="signin-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <SignIn redirectTo={from} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
