
import React, { memo, useState } from 'react';
import { useLogin } from '../../hooks/useLogin';
import { LoginFormHeader } from './login/LoginFormHeader';
import { EmailInput } from './login/EmailInput';
import { PasswordInput } from './login/PasswordInput';
import { LoginButton } from './login/LoginButton';
import { LoginLinks } from './login/LoginLinks';
import { WifiOff } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast';
import axios from 'axios';
import { API_BASE_URL } from '@/api/services/http/config';

/**
 * The main login form component
 * Handles login functionality and renders all login-related UI
 */
export const LoginForm = memo(() => {
  // Use a default redirect path instead of relying on useLocation
  const defaultRedirectPath = '/home/inbox/all';
  
  // Use the login hook to handle login functionality
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    isOffline,
    handleLoginSubmit
  } = useLogin(defaultRedirectPath);

  console.log('LoginForm rendering with state:', { email, loading, isOffline });

  // Debug function for direct API test
  const handleDebugConnection = async () => {
    if (!email || !password) {
      toast({
        title: "Debug Error",
        description: "Please enter both email and password to test the connection",
        variant: "destructive"
      });
      return;
    }

    try {
      toast({
        title: "Debug Info",
        description: "Attempting direct API connection...",
      });
      
      // Show exactly what we're sending
      const payload = {
        email: email.trim(),
        password: password.trim()
      };
      
      console.log('Debug: Sending direct API request to', `${API_BASE_URL}/auth/login`);
      console.log('Debug: Request payload', { ...payload, password: '[REDACTED]' });

      // Create a new axios instance without interceptors
      const response = await axios.post(`${API_BASE_URL}/auth/login`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Debug direct API response:', response);
      
      toast({
        title: "Debug Success",
        description: "Direct API call successful. Check console for details.",
      });
    } catch (error: any) {
      console.error('Debug API error:', error);
      
      const errorDetails = error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      } : { message: error.message };
      
      console.log('Debug: Full error details:', errorDetails);
      
      toast({
        title: "Debug Error",
        description: `Error: ${error.response?.data?.message || error.message || 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };

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
          <LoginButton 
            isLoading={loading} 
            onDebug={handleDebugConnection}
          />
        </div>
      </form>

      <LoginLinks />
    </div>
  );
});

LoginForm.displayName = 'LoginForm';
