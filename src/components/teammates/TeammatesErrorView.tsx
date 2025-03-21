
import React from 'react';
import { AlertCircle, LogIn, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TeammatesErrorViewProps {
  error: string | Error | null;
  onRetry: () => void;
  isRetrying: boolean;
}

/**
 * Error view component for teammates page
 */
const TeammatesErrorView: React.FC<TeammatesErrorViewProps> = ({ 
  error, 
  onRetry, 
  isRetrying 
}) => {
  const errorMessage = typeof error === 'string' 
    ? error 
    : error?.toString() || 'There was an error loading your teammates. Please try again.';
  
  const isAuthError = typeof error === 'string' && 
    (error.includes('authentication') || error.includes('Authentication') || 
     error.includes('auth token') || error.includes('Unauthorized') ||
     error.includes('UNAUTHORIZED') || error.includes('login'));
  
  const handleLogin = () => {
    window.location.href = '/signin';
  };

  return (
    <div className="p-6 flex flex-col items-center justify-center h-[50vh]">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-xl font-semibold mb-2">Failed to load teammates</h3>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        {errorMessage}
      </p>
      <div className="flex gap-4">
        <Button 
          onClick={onRetry} 
          disabled={isRetrying} 
          className="flex items-center gap-2"
        >
          {isRetrying && <RefreshCw className="h-4 w-4 animate-spin" />}
          {isRetrying ? 'Retrying...' : 'Retry'}
        </Button>
        
        {isAuthError && (
          <Button 
            onClick={handleLogin}
            variant="outline" 
            className="flex items-center gap-2"
          >
            <LogIn className="h-4 w-4" />
            Sign In Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default TeammatesErrorView;
