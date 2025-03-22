
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error | null;
  resetErrorBoundary: () => void;
}

/**
 * Error fallback component for chat widget error boundary
 */
const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center animate-fadeSlideIn">
      <div className="bg-amber-50 p-3 rounded-full mb-3">
        <AlertTriangle className="h-6 w-6 text-amber-500" />
      </div>
      
      <h3 className="text-lg font-medium mb-2">Something went wrong</h3>
      
      <p className="text-sm text-gray-600 mb-4">
        We encountered an issue with the chat widget
      </p>
      
      {error && (
        <div className="bg-gray-50 p-3 rounded-lg mb-4 max-w-full overflow-hidden">
          <p className="text-xs text-gray-500 truncate">{error.message}</p>
        </div>
      )}
      
      <button
        onClick={resetErrorBoundary}
        className="flex items-center px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Try Again
      </button>
    </div>
  );
};

export default ErrorFallback;
