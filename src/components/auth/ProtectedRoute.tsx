
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, isTokenExpired } from '@/utils/auth/tokenManager';
import { toast } from '@/components/ui/use-toast';
import { HttpClient } from '@/api/services/http';
import ErrorBoundary from '@/components/common/ErrorBoundary';

/**
 * Enhanced ProtectedRoute component that handles authentication checks
 * and redirects to login if user is not authenticated
 */
export const ProtectedRoute = React.memo(({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [apiChecked, setApiChecked] = React.useState(false);
  
  // Single authentication check that runs once
  const isAuth = isAuthenticated();
  const isExpired = false; // Disable token expiration check for now
  
  React.useEffect(() => {
    console.log('ProtectedRoute: Auth check for path:', location.pathname);
    
    // Only run API check once per route change and only if authenticated
    if (isAuth && !isExpired && !apiChecked) {
      // Try to fetch user profile as a better API check
      HttpClient.apiClient.get('/profile')
        .then(() => {
          console.log('API connection successful');
          setApiChecked(true);
        })
        .catch(err => {
          console.error("API connection check failed:", err);
          setApiChecked(true);
          
          toast({
            title: "API Connection Issue",
            description: "Having trouble connecting to the server. Some features may be limited.",
            variant: "destructive",
          });
        });
    }
  }, [location.pathname, isAuth, isExpired, apiChecked]);
  
  // If authenticated and token is not expired, render children
  if (isAuth && !isExpired) {
    return (
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    );
  }
  
  console.log('ProtectedRoute: Redirecting to login from path:', location.pathname);
  // Store the attempted location for post-login redirect
  return <Navigate to="/sign-in" state={{ from: location.pathname }} replace />;
});

ProtectedRoute.displayName = 'ProtectedRoute';

export default ProtectedRoute;
