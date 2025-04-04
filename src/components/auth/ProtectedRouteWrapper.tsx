
import { ReactNode, Suspense } from 'react';
import { ProtectedRoute } from './ProtectedRoute';
import RouteErrorBoundary from '@/components/app/RouteErrorBoundary';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface ProtectedRouteWrapperProps {
  children: ReactNode;
}

/**
 * A wrapper component that combines route protection, error boundary, and Suspense loading
 * for consistent route protection patterns across the application
 */
const ProtectedRouteWrapper: React.FC<ProtectedRouteWrapperProps> = ({ children }) => (
  <ProtectedRoute>
    <RouteErrorBoundary>
      <Suspense fallback={<div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>}>
        {children}
      </Suspense>
    </RouteErrorBoundary>
  </ProtectedRoute>
);

export default ProtectedRouteWrapper;
