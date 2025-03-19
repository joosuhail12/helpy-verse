
import React from 'react';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

/**
 * An application-level error boundary that catches errors at the root level.
 * Provides a custom fallback UI for critical application errors.
 */
const AppErrorBoundary: React.FC<AppErrorBoundaryProps> = ({ children }) => {
  const handleError = (error: Error) => {
    // Log critical app errors to your monitoring service
    console.error('Critical application error:', error);
  };

  const AppFallbackComponent = ({ error, reset }: { error: Error | null; reset: () => void }) => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-center mb-2">Application Error</h2>
        <p className="text-gray-600 mb-4 text-center">
          We're sorry, something went wrong. Please try refreshing the page.
        </p>
        {error && (
          <div className="bg-gray-50 p-3 rounded mb-4 text-sm">
            <p className="font-medium">Error message:</p>
            <p className="text-red-600">{error.message}</p>
          </div>
        )}
        <div className="flex justify-center space-x-4">
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
          <Button variant="outline" onClick={reset}>
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary 
      fallbackComponent={AppFallbackComponent}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
};

export default AppErrorBoundary;
