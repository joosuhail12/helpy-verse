
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useEffect, useState } from 'react';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const auth = useAppSelector((state) => state.auth);
  const isAuthenticated = auth.isAuthenticated;
  
  useEffect(() => {
    // Add debug logging for auth state
    console.log('ProtectedRoute: Auth state =', auth);
    console.log('ProtectedRoute: isAuthenticated =', isAuthenticated);
    
    // Short timeout to ensure auth state is fully loaded
    const timer = setTimeout(() => {
      setIsChecking(false);
      console.log('ProtectedRoute: isChecking =', false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [auth, isAuthenticated]);
  
  // Show nothing while checking authentication to prevent flashes
  if (isChecking) {
    console.log('ProtectedRoute: isChecking =', isChecking);
    return null;
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute: Redirecting to sign-in from', location.pathname);
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  console.log('ProtectedRoute: Rendering protected content');
  return <>{children}</>;
};
