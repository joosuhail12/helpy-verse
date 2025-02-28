
import React from 'react';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Users } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchTeammates } from '@/store/slices/teammates/actions';

interface TeammatesErrorBoundaryProps {
  children: React.ReactNode;
}

/**
 * A teammates-specific error boundary that handles errors in the teammates feature.
 * Provides a custom fallback UI with teammates-specific actions.
 */
const TeammatesErrorBoundary: React.FC<TeammatesErrorBoundaryProps> = ({ children }) => {
  const TeammatesFallbackComponent = ({ error, reset }: { error: Error | null; reset: () => void }) => {
    const dispatch = useAppDispatch();
    
    const handleRetry = () => {
      console.log("Retrying teammates fetch...");
      dispatch(fetchTeammates());
      reset();
    };
    
    return (
      <div className="bg-white rounded-lg shadow p-6 my-4">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="bg-purple-100 p-4 rounded-full mb-4">
            <Users className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-medium mb-2">Error Loading Teammates</h3>
          <p className="text-gray-500 mb-4">
            We encountered a problem while loading your teammates data.
          </p>
          {error && (
            <div className="bg-gray-50 p-3 rounded mb-4 text-sm w-full">
              <p className="text-red-500">{error.message}</p>
            </div>
          )}
          <div className="flex space-x-4">
            <Button onClick={handleRetry}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh Data
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
    <ErrorBoundary fallbackComponent={TeammatesFallbackComponent}>
      {children}
    </ErrorBoundary>
  );
};

export default TeammatesErrorBoundary;
