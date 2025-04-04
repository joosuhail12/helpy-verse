
import React, { ReactNode } from 'react';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import useAuthCheck from '@/hooks/useAuthCheck';

interface AuthCheckProps {
  children: ReactNode;
}

/**
 * Component that handles auth checking and renders appropriate UI based on auth state
 */
const AuthCheck: React.FC<AuthCheckProps> = ({ children }) => {
  const { isAuthChecking, isAuthorized, authError } = useAuthCheck();

  // Show loading indicator while checking authentication
  if (isAuthChecking) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Verifying your session...</span>
      </div>
    );
  }

  // Show error message if authentication failed
  if (authError) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Authentication Error</h2>
        <p className="text-gray-600 mb-4">{authError}</p>
        <Button onClick={() => window.location.href = '/sign-in'}>
          Sign In Again
        </Button>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthorized && !isAuthChecking) {
    return <Navigate to="/sign-in" replace />;
  }

  // If authenticated, render children
  return <>{children}</>;
};

export default AuthCheck;
