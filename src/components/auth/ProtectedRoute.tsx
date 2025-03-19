
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchUserData } from '@/store/slices/authSlice';
import { HttpClient } from '@/api/services/http';
import { isAuthenticated, getAuthToken } from '@/utils/auth/tokenManager';

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
      const hasToken = isAuthenticated();
      const token = getAuthToken();
      setHasValidToken(hasToken);
      
      // Ensure axios is configured with the token
      if (hasToken && token) {
        HttpClient.apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        HttpClient.setAxiosDefaultConfig(token);
        console.log('ProtectedRoute: Found valid token, configuring axios');
        
        try {
          // Try to refresh user data if needed
          await dispatch(fetchUserData());
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Continue anyway since we have a token
        }
      } else {
        console.log('ProtectedRoute: No valid token found');
      }
      
      // Short delay to ensure state is settled
      setTimeout(() => {
        setIsChecking(false);
      }, 300);
    };
    
    checkAuth();
  }, [dispatch, location.pathname]);

  // Show loading state while checking
  if (isChecking || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // CRITICAL: We prioritize token existence over Redux state
  if (hasValidToken) {
    console.log('ProtectedRoute: Token exists, rendering protected content');
    return <>{children}</>;
  }

  // No token, redirect to login
  console.log('ProtectedRoute: No token found, redirecting to login');
  return <Navigate to="/sign-in" state={{ from: location.pathname }} replace />;
};
