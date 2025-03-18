
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAuthenticated = useAppSelector((state) => {
    console.log('ProtectedRoute: Checking auth state:', state.auth);
    return state.auth.isAuthenticated;
  });

  console.log('ProtectedRoute: isAuthenticated =', isAuthenticated);

  if (!isAuthenticated) {
    console.log('ProtectedRoute: Redirecting to login');
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  console.log('ProtectedRoute: Rendering protected content');
  return <>{children}</>;
};
