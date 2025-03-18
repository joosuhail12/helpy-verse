
import React, { memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useLogin } from '../../hooks/useLogin';
import { LoginFormHeader } from './login/LoginFormHeader';
import { EmailInput } from './login/EmailInput';
import { PasswordInput } from './login/PasswordInput';
import { LoginButton } from './login/LoginButton';
import { LoginLinks } from './login/LoginLinks';

/**
 * The main login form component
 * Handles login functionality and renders all login-related UI
 */
export const LoginForm = memo(() => {
  const location = useLocation();
  
  // Get redirect path from location state or default to /home
  const from = location.state?.from || '/home';
  
  // Use the login hook to handle login functionality
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleLoginSubmit
  } = useLogin(from);

  return (
    <div className="space-y-6 rounded-2xl bg-white/50 backdrop-blur-sm p-6 shadow-xl border border-white/20">
      <LoginFormHeader />

      <form onSubmit={handleLoginSubmit} className="space-y-5">
        <EmailInput 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          disabled={loading} 
        />

        <PasswordInput 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          disabled={loading} 
        />

        <div className="pt-2">
          <LoginButton isLoading={loading} />
        </div>
      </form>

      <LoginLinks />
      
      {/* Development mode message for testing */}
      {(process.env.NODE_ENV === 'development' || import.meta.env.DEV) && (
        <div className="mt-4 text-xs text-gray-500 border-t pt-4">
          <p>Development Mode: Login uses automatic authentication.</p>
        </div>
      )}
    </div>
  );
});

LoginForm.displayName = 'LoginForm';
