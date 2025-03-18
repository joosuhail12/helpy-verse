
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { loginUser } from '../store/slices/authSlice';
import { toast } from '../components/ui/use-toast';
import { handleSetToken, isAuthenticated } from '@/utils/auth/tokenManager';
import { HttpClient } from '@/api/services/HttpClient';

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

  // Auto-redirect if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        console.log('Already authenticated, redirecting to:', redirectPath);
        // Navigate to redirect path
        navigate(redirectPath, { replace: true });
      }
    };
    
    checkAuth();
  }, [redirectPath, navigate]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !email || !password) return;
    
    try {
      setIsSubmitting(true);
      console.log('Login attempt for:', email);
      
      // Add development mode login for easier testing
      if (process.env.NODE_ENV === 'development' || import.meta.env.DEV) {
        // Mock successful login for development mode
        console.log('Using development mode login');
        
        // Set a mock token in development mode
        const mockToken = 'mock-token-for-development-' + Date.now();
        
        // Store in localStorage first (more reliable than cookies in some environments)
        localStorage.setItem("token", mockToken);
        
        // Then try to set the cookie
        const success = handleSetToken(mockToken);
        
        // Configure HttpClient with the token
        HttpClient.setAxiosDefaultConfig(mockToken);
        
        if (success || localStorage.getItem("token")) {
          // Show success toast
          toast({
            title: 'Development Mode',
            description: 'Logged in with development credentials',
          });
          
          // Trigger auth state update in Redux
          dispatch({
            type: 'auth/login/fulfilled',
            payload: { 
              data: { 
                accessToken: { token: mockToken },
                username: email
              }
            }
          });
          
          // Small delay before redirect
          setTimeout(() => {
            navigate(redirectPath, { replace: true });
          }, 500);
        } else {
          // Show error toast if token setting failed
          toast({
            title: 'Warning',
            description: 'Using fallback login mechanism - cookies may be blocked',
            variant: 'default',
          });
          
          // Try direct navigation as fallback
          setTimeout(() => {
            window.location.href = redirectPath;
          }, 1000);
        }
        
        setIsSubmitting(false);
        return;
      }
      
      // Real login process for production
      const result = await dispatch(loginUser({ email, password })).unwrap();
      
      // Handle successful login
      if (result && result.data && result.data.accessToken) {
        console.log('Login successful');
        
        toast({
          title: 'Success',
          description: 'Logged in successfully',
        });
        
        // Navigate after successful login
        setTimeout(() => {
          navigate(redirectPath, { replace: true });
        }, 500);
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
