
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '@/utils/auth/tokenManager';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAuth = isAuthenticated();
  
  console.log('ProtectedRoute: Auth check for path:', location.pathname, 'Result:', isAuth);
  
  if (isAuth) {
    return <>{children}</>;
  }
  
  console.log('ProtectedRoute: Redirecting to login from path:', location.pathname);
  return <Navigate to="/sign-in" state={{ from: location.pathname }} replace />;
};
