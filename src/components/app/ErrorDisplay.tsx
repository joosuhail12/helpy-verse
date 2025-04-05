
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

/**
 * A component to display errors with optional retry functionality
 */
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = 'Something went wrong',
  message,
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        {onRetry && (
          <Button 
            onClick={onRetry}
            variant="outline" 
            className="border-red-300 hover:bg-red-50"
          >
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
