
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
      
      // Check for development mode
      const isDevelopmentMode = process.env.NODE_ENV === 'development' || import.meta.env.DEV;
      
      if (isDevelopmentMode) {
        console.log('Using development mode login (mock authentication)');
        
        // Create a mock token with email embedded for development
        const mockToken = `dev-token-${Date.now()}-${email.replace(/[^a-zA-Z0-9]/g, '')}`;
        
        // Always set token FIRST before updating redux state to avoid race conditions
        const tokenSuccess = handleSetToken(mockToken);
        console.log('Token set success:', tokenSuccess);
        
        // Also set these values directly
        localStorage.setItem("userId", `user-${Date.now()}`);
        localStorage.setItem("role", "ORGANIZATION_ADMIN");
        localStorage.setItem("workspaceId", "w1");
        
        // Simulate a successful login in Redux
        dispatch({
          type: 'auth/loginUser/fulfilled',
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
        
        // Wait a moment for token to be properly set
        setTimeout(() => {
          // Double-check auth status before redirecting
          if (isAuthenticated()) {
            console.log('Development login successful, redirecting to:', redirectPath);
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
