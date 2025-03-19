
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
      
      // Check for development mode
      const isDevelopmentMode = process.env.NODE_ENV === 'development' || import.meta.env.DEV;
      
      if (isDevelopmentMode) {
        console.log('Using development mode login (mock authentication)');
        
        // Create a mock token with email embedded for development
        const mockToken = `dev-token-${Date.now()}-${email.replace(/[^a-zA-Z0-9]/g, '')}`;
        
        // Store in localStorage first
        localStorage.setItem("token", mockToken);
        localStorage.setItem("userId", `user-${Date.now()}`);
        localStorage.setItem("role", "ORGANIZATION_ADMIN");
        
        // Then try to set the cookie
        const success = handleSetToken(mockToken);
        
        // Simulate a successful login in Redux
        dispatch({
          type: 'auth/login/fulfilled',
          payload: { 
            data: { 
              id: `user-${Date.now()}`,
              accessToken: { token: mockToken },
              username: email,
              defaultWorkspaceId: 'workspace-1'
            }
          }
        });
        
        // Show success toast
        toast({
          title: 'Development Mode Login',
          description: 'Logged in successfully with dev credentials',
        });
        
        // Navigate after a short delay
        setTimeout(() => {
          if (isAuthenticated()) {
            navigate(redirectPath, { replace: true });
          } else {
            // Fallback if cookies are blocked
            window.location.href = redirectPath;
          }
        }, 500);
        
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
