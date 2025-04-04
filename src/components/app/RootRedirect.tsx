
import { useEffect, memo } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { isAuthenticated } from '@/utils/auth/tokenManager';
import { HttpClient } from '@/api/services/http';

/**
 * Component to handle root path redirects based on authentication state
 * Also performs API connectivity check
 */
const RootRedirect: React.FC = memo(() => {
  useEffect(() => {
    console.log('RootRedirect: Checking API connectivity');
    
    // Single API check on component mount
    HttpClient.checkApiConnection()
      .then(isConnected => {
        if (!isConnected) {
          toast({
            title: "API Connection Issue",
            description: "Could not connect to the API. Some features may not work correctly.",
            variant: "destructive",
          });
        }
      })
      .catch(error => {
        console.error("API connection check failed:", error);
      });
  }, []);

  // Check authentication directly - only once
  const isAuth = isAuthenticated();
  console.log('RootRedirect - Authentication status:', isAuth);
  
  // Direct to home/inbox/all as the default authenticated route
  if (isAuth) {
    console.log('RootRedirect: User is authenticated, redirecting to inbox');
    return <Navigate to="/home/inbox/all" replace />;
  } else {
    console.log('RootRedirect: User is not authenticated, redirecting to sign-in');
    return <Navigate to="/sign-in" replace />;
  }
});

RootRedirect.displayName = 'RootRedirect';

export default RootRedirect;
