
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { loginUser } from '../store/slices/auth/authActions';
import { toast } from '../components/ui/use-toast';
import { HttpClient } from '@/api/services/http';
import { useAuthContext } from './useAuthContext';

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
  const { login } = useAuthContext();
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

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs before submitting
    if (isSubmitting || !email.trim() || !password.trim()) {
      if (!email.trim()) {
        toast({
          title: 'Validation Error',
          description: 'Email is required',
          variant: 'destructive',
        });
      } else if (!password.trim()) {
        toast({
          title: 'Validation Error',
          description: 'Password is required',
          variant: 'destructive',
        });
      }
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
      
      // Real login process with trimmed values to avoid whitespace issues
      const result = await dispatch(loginUser({ 
        email: email.trim(), 
        password: password.trim() 
      })).unwrap();
      
      console.log('Login result:', result);
      
      // Handle successful login
      if (result && result.data && result.data.accessToken) {
        console.log('Login successful, token:', result.data.accessToken.token);
        
        // Use the centralized auth context to set token and update state
        login(result.data.accessToken.token);
        
        toast({
          title: 'Success',
          description: 'Logged in successfully',
        });
        
        // Redirect after a short delay to allow state to update
        setTimeout(() => {
          console.log('Redirecting to:', redirectPath);
          navigate(redirectPath, { replace: true });
        }, 300);
      } else {
        console.error('Missing token in login response:', result);
        toast({
          title: 'Login Error',
          description: 'Invalid response from server',
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
