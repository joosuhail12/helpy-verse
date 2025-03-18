
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { loginUser } from '../store/slices/authSlice';
import { toast } from '../components/ui/use-toast';
import { getCookie, handleSetToken, isAuthenticated } from '@/utils/helpers/helpers';
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
    if (isAuthenticated()) {
      console.log('Already authenticated, redirecting to:', redirectPath);
      
      // Ensure token is properly set in Axios headers
      HttpClient.setAxiosDefaultConfig();
      
      // Add a delay to ensure state is settled
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
        
        // As a fallback, use window.location for more reliable redirect
        setTimeout(() => {
          window.location.href = redirectPath;
        }, 300);
      }, 300);
    }
  }, [redirectPath, navigate]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !email || !password) return;
    
    try {
      setIsSubmitting(true);
      
      // Add mock login for development purposes
      if ((process.env.NODE_ENV === 'development' || import.meta.env.DEV) && 
          (email === 'test@example.com' && password === 'password')) {
        console.log('Using mock login for development');
        
        // Mock successful login
        const mockToken = 'mock-token-for-development';
        const tokenSet = handleSetToken(mockToken);
        
        if (tokenSet) {
          console.log('Development mode: mock token set successfully');
          HttpClient.setAxiosDefaultConfig();
          
          toast({
            title: 'Development Mode',
            description: 'Logged in with mock credentials',
          });
          
          // Short delay before redirect
          setTimeout(() => {
            navigate(redirectPath, { replace: true });
          }, 1000);
        } else {
          console.error('Development mode: Failed to set mock token');
          toast({
            title: 'Error',
            description: 'Development mode login failed - cookie issue',
            variant: 'destructive',
          });
        }
        setIsSubmitting(false);
        return;
      }
      
      // Real login process
      console.log('Attempting real login');
      const result = await dispatch(loginUser({ email, password })).unwrap();
      
      // Handle successful login
      if (result && result.data && result.data.accessToken) {
        console.log('Login successful, verifying token setup');
        
        // Verify token was properly set
        const token = getCookie('customerToken');
        
        if (token) {
          console.log('Token verified in cookie after login');
          toast({
            title: 'Success',
            description: 'Logged in successfully',
          });
          
          // Ensure Axios is configured with the token
          HttpClient.setAxiosDefaultConfig();
          
          // Add a delay to ensure toast is visible before redirect
          setTimeout(() => {
            navigate(redirectPath, { replace: true });
          }, 1000);
        } else {
          console.error('Token not found in cookie after login');
          // Try to set token again
          handleSetToken(result.data.accessToken.token);
          
          // Verify again
          const retryToken = getCookie('customerToken');
          if (retryToken) {
            console.log('Token set on retry');
            setTimeout(() => {
              navigate(redirectPath, { replace: true });
            }, 1000);
          } else {
            throw new Error('Failed to set authentication token');
          }
        }
      } else {
        console.error('Login response missing token data', result);
        toast({
          title: 'Error',
          description: 'Invalid login response from server',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Login failed. Please check your network connection and try again.',
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
