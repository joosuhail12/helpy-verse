
import React, { useEffect, useState } from 'react';
import { isAuthenticated } from '@/utils/auth/tokenManager';
import { Loader2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const Unassigned = () => {
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const auth = isAuthenticated();
      setIsAuthorized(auth);
      setIsAuthChecking(false);
    };
    
    checkAuth();
  }, []);

  // Show loading indicator while checking authentication
  if (isAuthChecking) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Verifying credentials...</span>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthorized && !isAuthChecking) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Unassigned Tickets</h1>
      {/* Content will be added later */}
    </div>
  );
};

export default Unassigned;
