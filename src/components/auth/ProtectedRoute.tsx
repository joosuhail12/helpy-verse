
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { getCookie } from '@/utils/helpers/helpers';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchUserData } from '@/store/slices/authSlice';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [isChecking, setIsChecking] = useState(true);
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const [hasToken, setHasToken] = useState(false);
  
  useEffect(() => {
    // Check if token exists, this is more reliable than state when page refreshes
    const token = getCookie("customerToken");
    setHasToken(!!token);
    
    // If there's a token but not authenticated in state, try to fetch user data
    if (token && !isAuthenticated) {
      dispatch(fetchUserData());
    }
    
    // Wait a short moment to ensure auth state is properly loaded
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [dispatch, isAuthenticated]);

  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If we have a token OR we're authenticated in state, render children
  if (isAuthenticated || hasToken) {
    console.log('ProtectedRoute: Authenticated, rendering protected content');
    return <>{children}</>;
  }

  console.log('ProtectedRoute: Not authenticated, redirecting to login');
  // Save the attempted URL for after login redirect
  return <Navigate to="/sign-in" state={{ from: location.pathname }} replace />;
};
