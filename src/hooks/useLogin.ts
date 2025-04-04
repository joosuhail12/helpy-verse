
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { loginUser } from '../store/slices/authSlice';
import { toast } from '../components/ui/use-toast';
import { handleSetToken, isAuthenticated } from '@/utils/auth/tokenManager';
import { HttpClient } from '@/api/services/http';

/**
 * Custom hook to handle login functionality
 */
export const useLogin = (redirectPath: string = '/home/inbox/all') => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useAppSelector((state) => state.auth);
  const loading = auth?.loading ?? false;
  
  // Listen for online/offline status changes
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Check for auth errors and show toast
  useEffect(() => {
    if (auth.error && !loading && !isSubmitting) {
      // Better type handling for auth.error
      let errorMessage = 'Login failed. Please try again.';
      
      if (typeof auth.error === 'string') {
        errorMessage = auth.error;
      } else if (auth.error && typeof auth.error === 'object') {
        // Type assertion with unknown as an intermediate step
        const errorObject = auth.error as unknown;
        if (errorObject && typeof errorObject === 'object' && 'message' in errorObject) {
          const typedError = errorObject as { message: string };
          errorMessage = typedError.message || errorMessage;
        }
      }
        
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [auth.error, loading, isSubmitting]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Validate required fields
    if (!email || !password) {
      toast({
        title: 'Required Fields',
        description: 'Please enter both email and password',
        variant: 'destructive',
      });
      return;
    }
    
    // Check if offline first
    if (isOffline || HttpClient.isOffline()) {
      toast({
        title: 'You\'re offline',
        description: 'Please check your internet connection and try again.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log('Login attempt for:', email);
      
      // Real login process
      const result = await dispatch(loginUser({ email, password })).unwrap();
      console.log('Login result:', result);
      
      // Extract and store token regardless of response structure
      let token = null;
      
      // Handle different result structures
      if (result.data && result.data.accessToken) {
        // Handle nested data.accessToken structure
        if (typeof result.data.accessToken === 'string') {
          token = result.data.accessToken;
        } else if (result.data.accessToken.token) {
          token = result.data.accessToken.token;
        }
      } else if (result.accessToken) {
        // Handle direct accessToken structure
        if (typeof result.accessToken === 'string') {
          token = result.accessToken;
        } else if (result.accessToken.token) {
          token = result.accessToken.token;
        }
      }
      
      if (token) {
        // Ensure token is set
        handleSetToken(token);
        
        toast({
          title: 'Success',
          description: 'Logged in successfully',
        });
        
        // Navigate after successful login
        setTimeout(() => {
          if (isAuthenticated()) {
            console.log('Redirecting to:', redirectPath);
            navigate(redirectPath, { replace: true });
          }
        }, 300);
      } else {
        console.error('No token found in the response');
        toast({
          title: 'Login Error',
          description: 'Authentication succeeded but no token was found. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Check for specific error types
      const errorMessage = error?.message || 
        (typeof error === 'object' && 'message' in error ? error.message : null) ||
        'Login failed. Please try again.';
      
      toast({
        title: error?.isOfflineError ? 'Connection Error' : 'Login Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading: loading || isSubmitting,
    isOffline,
    handleLoginSubmit
  };
};
