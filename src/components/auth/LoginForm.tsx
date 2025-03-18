
import React, { memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useLogin } from '../../hooks/useLogin';
import { LoginFormHeader } from './login/LoginFormHeader';
import { EmailInput } from './login/EmailInput';
import { PasswordInput } from './login/PasswordInput';
import { LoginButton } from './login/LoginButton';
import { LoginLinks } from './login/LoginLinks';

export const LoginForm = memo(() => {
  const location = useLocation();
  
  // Get redirect path from location state or default to /home
  const from = location.state?.from || '/home';
  
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

        <LoginButton isLoading={loading} />
      </form>

      <LoginLinks />
    </div>
  );
});

LoginForm.displayName = 'LoginForm';
