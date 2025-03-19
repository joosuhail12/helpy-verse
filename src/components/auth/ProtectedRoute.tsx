
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchUserData } from '@/store/slices/authSlice';
import { HttpClient } from '@/api/services/http';
import { isAuthenticated, getAuthToken, isTokenExpired } from '@/utils/auth/tokenManager';
import { refreshToken } from '@/store/slices/auth/authActions';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [isChecking, setIsChecking] = useState(true);
  const { loading } = useAppSelector((state) => state.auth);
  const [hasValidToken, setHasValidToken] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      console.log('ProtectedRoute: Checking authentication status');
      
      // Get token directly from tokenManager
      const token = getAuthToken();
      const isTokenPresent = !!token;
      console.log('ProtectedRoute: Token exists:', isTokenPresent, 'Token value:', token?.slice(0, 10));
      
      // Check token validity
      if (isTokenPresent) {
        // Check if token is expired
        if (isTokenExpired()) {
          console.log('Token is expired, attempting to refresh');
          try {
            // Try to refresh the token
            await dispatch(refreshToken()).unwrap();
            console.log('Token refreshed successfully');
          } catch (error) {
            console.error('Token refresh failed:', error);
            setHasValidToken(false);
            setIsChecking(false);
            return;
          }
        }
        
        // Token is valid or was refreshed
        setHasValidToken(true);
        console.log('ProtectedRoute: Found valid token, configuring axios');
        HttpClient.apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        HttpClient.setAxiosDefaultConfig(token);
        
        try {
          // Try to refresh user data if needed
          await dispatch(fetchUserData());
          console.log('ProtectedRoute: Successfully fetched user data');
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Continue anyway since we have a token
        }
      } else {
        console.log('ProtectedRoute: No valid token found');
        setHasValidToken(false);
      }
      
      // Short delay to ensure state is settled
      setTimeout(() => {
        setIsChecking(false);
      }, 500);
    };
    
    checkAuth();
  }, [dispatch, location.pathname]);

  // Add debug logging for render state
  useEffect(() => {
    console.log('ProtectedRoute state:', { 
      isChecking, 
      loading, 
      hasValidToken, 
      path: location.pathname
    });
  }, [isChecking, loading, hasValidToken, location.pathname]);

  // Show loading state while checking
  if (isChecking || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-primary">Checking authentication...</span>
      </div>
    );
  }

  // We prioritize token existence over Redux state
  if (hasValidToken && isAuthenticated()) {
    console.log('ProtectedRoute: Token exists, rendering protected content', location.pathname);
    return <>{children}</>;
  }

  // No token, redirect to login
  console.log('ProtectedRoute: No token found, redirecting to login');
  return <Navigate to="/sign-in" state={{ from: location.pathname }} replace />;
};
