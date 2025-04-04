
import React, { memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useLogin } from '../../hooks/useLogin';
import { LoginFormHeader } from './login/LoginFormHeader';
import { EmailInput } from './login/EmailInput';
import { PasswordInput } from './login/PasswordInput';
import { LoginButton } from './login/LoginButton';
import { LoginLinks } from './login/LoginLinks';
import { WifiOff } from 'lucide-react';
import { Button } from '../ui/button';

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
    isOffline,
    handleLoginSubmit
  } = useLogin(from);

  // Display offline warning if needed
  if (isOffline) {
    return (
      <div className="space-y-6 rounded-2xl bg-white/50 backdrop-blur-sm p-6 shadow-xl border border-white/20">
        <LoginFormHeader />
        
        <div className="flex flex-col items-center py-6 space-y-4">
          <WifiOff className="h-12 w-12 text-gray-400" />
          <h2 className="text-xl font-medium text-primary">You're offline</h2>
          <p className="text-center text-gray-500">
            Please check your internet connection to log in.
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            className="mt-4"
          >
            Retry Connection
          </Button>
        </div>
        
        <LoginLinks />
      </div>
    );
  }

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
    </div>
  );
});

LoginForm.displayName = 'LoginForm';
