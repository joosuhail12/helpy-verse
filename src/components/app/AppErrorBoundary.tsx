
import * as React from 'react';
import ErrorBoundary from '../common/ErrorBoundary';

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

const AppErrorBoundary: React.FC<AppErrorBoundaryProps> = ({ children }) => {
  const handleError = (error: Error) => {
    console.error('Application error caught by AppErrorBoundary:', error);
  };

  return (
    <ErrorBoundary onError={handleError}>
      {children}
    </ErrorBoundary>
  );
};

export default AppErrorBoundary;
