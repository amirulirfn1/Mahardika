'use client';

import { colors } from '../../../components/ui';
import AuthForm from '../../components/AuthForm';

export default function AuthPage() {
  // Mock authentication handlers
  const handleLogin = async (email: string, password: string) => {
    console.log('Login attempt:', { email, password });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert(`Login successful for ${email}`);
  };

  const handleRegister = async (
    email: string,
    password: string,
    confirmPassword: string,
    firstName: string,
    lastName: string
  ) => {
    console.log('Register attempt:', {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
    });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert(`Registration successful for ${firstName} ${lastName}!`);
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center py-5"
      style={{
        background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.gray[800]} 100%)`,
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12">
            <AuthForm
              onLogin={handleLogin}
              onRegister={handleRegister}
              className="fade-in-animation"
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .fade-in-animation {
          animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
