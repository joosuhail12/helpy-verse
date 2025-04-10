
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { loginUser } from '../store/slices/auth/authActions';
import { toast } from '../components/ui/use-toast';
import { isAuthenticated } from '@/utils/auth/tokenManager';
import { HttpClient } from '@/api/services/http';

// Create a memoized selector for auth state
const selectAuthState = (state: any) => ({
  loading: state.auth.loading,
  error: state.auth.error
});

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
  
  // Use optimized selector
  const auth = useAppSelector(selectAuthState);
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
  
  // Check for auth errors and show toast - with proper dependencies
  useEffect(() => {
    if (auth.error && !loading && !isSubmitting) {
      // Fix TypeScript error by ensuring auth.error is not null and has the right format
      let errorMessage = 'Login failed. Please try again.';
      
      // Make sure to use conditionals that fully satisfy TypeScript's type guard
      if (auth.error !== null) {
        if (typeof auth.error === 'object' && auth.error !== null) {
          const errorObj = auth.error as { message?: string };
          if (errorObj.message && typeof errorObj.message === 'string') {
            errorMessage = errorObj.message;
          }
        } else if (typeof auth.error === 'string') {
          errorMessage = auth.error;
        } else {
          // Convert any other type to string safely
          errorMessage = String(auth.error);
        }
      }
        
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [auth.error, loading, isSubmitting]);

  // Memoize the login handler to prevent recreation on each render
  const handleLoginSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !email || !password) return;
    
    // Check if offline first
    if (isOffline || !navigator.onLine) {
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
      
      // Call the loginUser action creator function
      const result = await dispatch(loginUser({ email, password }));
      
      // Handle successful login
      if (result && !result.error) {
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
  }, [email, password, isSubmitting, isOffline, dispatch, redirectPath, navigate]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading: loading || isSubmitting,
    isOffline: isOffline || !navigator.onLine,
    handleLoginSubmit
  };
};
