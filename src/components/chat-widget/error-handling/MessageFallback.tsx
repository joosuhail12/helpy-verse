
import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface MessageFallbackProps {
  error: Error;
  resetError: () => void;
}

/**
 * Fallback UI displayed when a messaging component crashes
 */
const MessageFallback: React.FC<MessageFallbackProps> = ({ error, resetError }) => {
  return (
    <div 
      role="alert" 
      aria-live="assertive"
      className="flex flex-col items-center justify-center p-4 rounded-lg bg-red-50 border border-red-200 text-center m-4"
    >
      <AlertTriangle className="h-8 w-8 text-red-500 mb-2" aria-hidden="true" />
      <h3 className="text-red-800 font-medium mb-1">
        Message Error
      </h3>
      <p className="text-red-600 text-sm mb-3">
        {error.message || 'There was a problem loading messages'}
      </p>
      <div className="space-y-2">
        <button
          onClick={resetError}
          className="flex items-center justify-center gap-1 bg-white border border-red-200 text-red-600 px-3 py-1.5 rounded-md text-sm hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 w-full"
          aria-label="Try again"
        >
          <RefreshCcw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Try again</span>
        </button>
      </div>
    </div>
  );
};

export default MessageFallback;
