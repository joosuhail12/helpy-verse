
import React, { Suspense, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import RouteErrorBoundary from '@/components/app/RouteErrorBoundary';
import { isAuthenticated, getAuthToken } from '@/utils/auth/tokenManager';
import { HttpClient } from '@/api/services/http';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { Loader2 } from 'lucide-react';
import { fetchUserData } from '@/store/slices/auth/userActions';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * A unified protected route component that handles authentication check,
 * suspense loading, and error boundaries in a single component
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('ProtectedRoute: Initializing auth for path:', location.pathname);
      
      // Get auth token directly from storage
      const token = getAuthToken();
      
      if (!token) {
        console.log('ProtectedRoute: No token found, will redirect to login');
        setIsLoading(false);
        return;
      }
      
      console.log('ProtectedRoute: Token found, configuring HTTP client');
      // Set up HTTP client with token
      HttpClient.setAxiosDefaultConfig(token);
      
      try {
        // Fetch user data to validate session
        await dispatch(fetchUserData()).unwrap();
        console.log('ProtectedRoute: User data fetched successfully');
      } catch (error) {
        console.error('ProtectedRoute: Error fetching user data:', error);
        // We continue even if this fails - the isAuthenticated check will handle redirection
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };
    
    initializeAuth();
  }, [dispatch, location.pathname]);

  // Show loading indicator while initializing
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Verifying your session...</span>
      </div>
    );
  }
  
  // If authentication check is done and user is not authenticated, redirect to login
  if (isInitialized && !isAuthenticated()) {
    console.log("ProtectedRoute: Not authenticated, redirecting from:", location.pathname);
    return <Navigate to="/sign-in" state={{ from: location.pathname }} replace />;
  }
  
  // User is authenticated, render the protected content
  return (
    <RouteErrorBoundary>
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner />
        </div>
      }>
        {children}
      </Suspense>
    </RouteErrorBoundary>
  );
};

export default ProtectedRoute;
