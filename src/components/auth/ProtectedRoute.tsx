
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '@/utils/auth/tokenManager';
import { useEffect } from 'react';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAuth = isAuthenticated();
  
  useEffect(() => {
    console.log('ProtectedRoute: Auth check for path:', location.pathname, 'Result:', isAuth);
    
    // If not authenticated, we'll redirect in the render phase
    if (!isAuth) {
      console.log('ProtectedRoute: User not authenticated, will redirect from:', location.pathname);
    }
  }, [location.pathname, isAuth]);
  
  if (isAuth) {
    return <>{children}</>;
  }
  
  console.log('ProtectedRoute: Redirecting to login from path:', location.pathname);
  // Store the attempted location for post-login redirect
  return <Navigate to="/sign-in" state={{ from: location.pathname }} replace />;
};

export default ProtectedRoute;
