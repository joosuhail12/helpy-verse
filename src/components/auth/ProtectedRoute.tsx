
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, isTokenExpired } from '@/utils/auth/tokenManager';
import { useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { HttpClient } from '@/api/services/http';

/**
 * Enhanced ProtectedRoute component that handles authentication checks
 * and redirects to login if user is not authenticated
 */
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAuth = isAuthenticated();
  const isExpired = isAuth ? isTokenExpired() : true;
  
  useEffect(() => {
    console.log('ProtectedRoute: Auth check for path:', location.pathname);
    console.log('ProtectedRoute: Authentication status:', isAuth);
    console.log('ProtectedRoute: Token expired status:', isExpired);
    
    // Verify API connection on protected route entry
    if (isAuth && !isExpired) {
      HttpClient.checkApiConnection()
        .then(isConnected => {
          if (!isConnected) {
            toast({
              title: "API Connection Issue",
              description: "Having trouble connecting to the server. Some features may be limited.",
              variant: "destructive",
            });
          }
        })
        .catch(err => {
          console.error("API connection check failed:", err);
        });
    }
    
    // If not authenticated, we'll redirect in the render phase
    if (!isAuth || isExpired) {
      console.log('ProtectedRoute: User not authenticated or token expired, will redirect from:', location.pathname);
    }
  }, [location.pathname, isAuth, isExpired]);
  
  // If authenticated and token is not expired, render children
  if (isAuth && !isExpired) {
    return <>{children}</>;
  }
  
  console.log('ProtectedRoute: Redirecting to login from path:', location.pathname);
  // Store the attempted location for post-login redirect
  return <Navigate to="/sign-in" state={{ from: location.pathname }} replace />;
};

export default ProtectedRoute;
