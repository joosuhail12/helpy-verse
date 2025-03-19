
import React, { memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useLogin } from '../../hooks/useLogin';
import { LoginFormHeader } from './login/LoginFormHeader';
import { EmailInput } from './login/EmailInput';
import { PasswordInput } from './login/PasswordInput';
import { LoginButton } from './login/LoginButton';
import { LoginLinks } from './login/LoginLinks';
import { AlertCircle } from 'lucide-react';

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

  // Determine if we're in development mode
  const isDevelopmentMode = process.env.NODE_ENV === 'development' || import.meta.env.DEV;

  return (
    <div className="space-y-6 rounded-2xl bg-white/50 backdrop-blur-sm p-6 shadow-xl border border-white/20">
      <LoginFormHeader />

      {/* Development Mode Banner */}
      {isDevelopmentMode && (
        <div className="px-3 py-2 bg-green-100 border border-green-300 rounded-md flex items-center gap-2 text-sm text-green-800">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <span>
            <strong>Development Mode Active</strong> - Enter any email and password to login
          </span>
        </div>
      )}

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
          <LoginButton isLoading={loading} isDevelopmentMode={isDevelopmentMode} />
        </div>
      </form>

      <LoginLinks />
      
      {/* Development mode message for testing */}
      {isDevelopmentMode && (
        <div className="mt-4 text-xs text-gray-500 border-t pt-4">
          <p className="font-medium text-green-600">Development Mode Details:</p>
          <p>In development mode, authentication is mocked. Any email and password combination will work.</p>
          <p className="mt-1 text-gray-400">If cookies are blocked, we'll fall back to localStorage for authentication.</p>
        </div>
      )}
    </div>
  );
});

LoginForm.displayName = 'LoginForm';
