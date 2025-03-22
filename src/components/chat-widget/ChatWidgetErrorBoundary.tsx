
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './components/ErrorFallback';

interface ChatWidgetErrorBoundaryProps {
  children: React.ReactNode;
}

/**
 * Error boundary specifically for the chat widget
 */
const ChatWidgetErrorBoundary: React.FC<ChatWidgetErrorBoundaryProps> = ({ children }) => {
  const handleError = (error: Error, info: { componentStack: string }) => {
    // Log error to monitoring service
    console.error('Chat widget error:', error);
    console.error('Component stack:', info.componentStack);
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
      onReset={() => {
        // Reset app state here if needed
        console.log('Error boundary reset');
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ChatWidgetErrorBoundary;
