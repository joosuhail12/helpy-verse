
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { loginUser } from '../store/slices/auth/authActions';
import { toast } from '../components/ui/use-toast';
import { handleSetToken, isAuthenticated } from '@/utils/auth/tokenManager';

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
      // Fix TypeScript error by ensuring auth.error is not null and has the right format
      let errorMessage = 'Login failed. Please try again.';
      
      if (auth.error !== null) {
        if (typeof auth.error === 'object' && auth.error !== null) {
          const errorObj = auth.error as { message?: string };
          if (errorObj.message && typeof errorObj.message === 'string') {
            errorMessage = errorObj.message;
          }
        } else if (typeof auth.error === 'string') {
          errorMessage = auth.error;
        } else {
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

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // For testing purposes, let's accept any credentials
    if (isSubmitting || !email || !password) return;
    
    try {
      setIsSubmitting(true);
      console.log('Login attempt for:', email);
      
      // Use the mock login for development
      const result = await dispatch(loginUser({ email, password })).unwrap();
      
      console.log('Login result:', result);
      
      // Show success toast
      toast({
        title: 'Success',
        description: 'Logged in successfully',
      });
      
      // If we get here, login was successful
      console.log('Login successful, redirecting to:', redirectPath);
      setTimeout(() => navigate(redirectPath, { replace: true }), 500);
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Error handling
      toast({
        title: 'Login Failed',
        description: error?.message || 'Could not authenticate. Please try again.',
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
