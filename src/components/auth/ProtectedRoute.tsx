
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { getCookie } from '@/utils/helpers/helpers';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  
  useEffect(() => {
    // Check if token exists, this is more reliable than state when page refreshes
    const hasToken = !!getCookie("customerToken");
    
    // Wait a short moment to ensure auth state is properly loaded
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Check token directly from cookie as a fallback
  const hasToken = !!getCookie("customerToken");
  
  if (!isAuthenticated && !hasToken) {
    console.log('ProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  console.log('ProtectedRoute: Authenticated, rendering protected content');
  return <>{children}</>;
};
