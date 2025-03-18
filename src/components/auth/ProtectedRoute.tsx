
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { getCookie } from '@/utils/helpers/helpers';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchUserData } from '@/store/slices/authSlice';
import { HttpClient } from '@/api/services/HttpClient';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [isChecking, setIsChecking] = useState(true);
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const [hasToken, setHasToken] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      console.log('ProtectedRoute: Checking authentication status');
      
      // Get token from cookie
      const token = getCookie("customerToken");
      const hasValidToken = !!token;
      setHasToken(hasValidToken);
      
      // Ensure axios is configured with the token
      if (hasValidToken) {
        HttpClient.apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        HttpClient.setAxiosDefaultConfig();
        console.log('ProtectedRoute: Found valid token, configuring axios');
      }
      
      // If we have a token but Redux state says we're not authenticated,
      // try to refresh user data
      if (hasValidToken && !isAuthenticated) {
        try {
          console.log('ProtectedRoute: Have token but not authenticated in Redux, fetching user data');
          await dispatch(fetchUserData());
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Continue anyway since we have a token
        }
      }
      
      // Short delay to ensure state is settled
      setTimeout(() => {
        setIsChecking(false);
      }, 500);
    };
    
    checkAuth();
  }, [dispatch, isAuthenticated, location.pathname]);

  // Show loading state while checking
  if (isChecking || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // CRITICAL: We prioritize token existence over Redux state
  // If a token exists, the user should be considered authenticated
  if (hasToken) {
    console.log('ProtectedRoute: Token exists, rendering protected content');
    return <>{children}</>;
  }

  // No token, redirect to login
  console.log('ProtectedRoute: No token found, redirecting to login');
  return <Navigate to="/sign-in" state={{ from: location.pathname }} replace />;
};
