
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { loginUser } from '../store/slices/authSlice';
import { toast } from '../components/ui/use-toast';
import { handleSetToken, isAuthenticated } from '@/utils/auth/tokenManager';

/**
 * Custom hook to handle login functionality
 */
export const useLogin = (redirectPath: string = '/home') => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useAppSelector((state) => state.auth);
  const loading = auth?.loading ?? false;
  
  // Check for auth errors and show toast
  useEffect(() => {
    if (auth.error && !loading && !isSubmitting) {
      toast({
        title: 'Error',
        description: auth.error || 'Login failed. Please try again.',
        variant: 'destructive',
      });
    }
  }, [auth.error, loading, isSubmitting]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !email || !password) return;
    
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
      toast({
        title: 'Error',
        description: error.message || 'Login failed. Please try again.',
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
    handleLoginSubmit
  };
};
