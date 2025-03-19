
import React from 'react';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface RouteErrorBoundaryProps {
  children: React.ReactNode;
}

/**
 * A route-level error boundary that catches errors at the page level.
 * Provides a custom fallback UI for page-level errors.
 */
const RouteErrorBoundary: React.FC<RouteErrorBoundaryProps> = ({ children }) => {
  const RouteFallbackComponent = ({ error, reset }: { error: Error | null; reset: () => void }) => {
    const navigate = useNavigate();
    
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-orange-100 p-3 rounded-full">
              <AlertCircle className="h-6 w-6 text-orange-500" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-center mb-2">Page Error</h2>
          <p className="text-gray-600 mb-4 text-center">
            We encountered an error while loading this page.
          </p>
          {error && (
            <div className="bg-gray-50 p-3 rounded mb-4 text-sm">
              <p className="font-medium">Error message:</p>
              <p className="text-orange-500">{error.message}</p>
            </div>
          )}
          <div className="flex justify-center space-x-4">
            <Button onClick={() => navigate(-1)}>
              Go Back
            </Button>
            <Button variant="outline" onClick={reset}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary fallbackComponent={RouteFallbackComponent}>
      {children}
    </ErrorBoundary>
  );
};

export default RouteErrorBoundary;
