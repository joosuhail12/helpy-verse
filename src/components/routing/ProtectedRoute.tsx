
import React, { Suspense } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '@/utils/auth/tokenManager';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import RouteErrorBoundary from '@/components/app/RouteErrorBoundary';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * A unified protected route component that handles authentication check,
 * suspense loading, and error boundaries in a single component
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  
  if (!isAuthenticated()) {
    console.log("ProtectedRoute: Not authenticated, redirecting from:", location.pathname);
    return <Navigate to="/sign-in" state={{ from: location.pathname }} />;
  }
  
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
