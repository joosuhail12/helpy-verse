
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
      // Fix TypeScript error by ensuring auth.error is treated with the correct type
      let errorMessage = 'Login failed. Please try again.';
      
      if (typeof auth.error === 'string') {
        errorMessage = auth.error;
      } else if (auth.error && typeof auth.error === 'object' && 'message' in auth.error) {
        // Use a type assertion with unknown as an intermediate step
        const errorObject = auth.error as unknown as { message?: string };
        errorMessage = errorObject.message || 'Login failed. Please try again.';
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
    if (isSubmitting || !email || !password) return;
    
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
      
      // Handle successful login
      if (result && result.data && result.data.accessToken) {
        console.log('Login successful');
        
        toast({
          title: 'Success',
          description: 'Logged in successfully',
        });
        
        // Double-check auth status before redirecting
        setTimeout(() => {
          if (isAuthenticated()) {
            console.log('Redirecting to:', redirectPath);
            navigate(redirectPath, { replace: true });
          } else {
            console.error('Login appeared successful but token was not set correctly');
            toast({
              title: 'Login Error',
              description: 'Authentication succeeded but session setup failed. Please try again.',
              variant: 'destructive',
            });
          }
        }, 300);
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
