
import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { initializeApp } from './AppInitializer';
import { isAuthenticated } from '@/utils/auth/tokenManager';
import { toast } from '@/components/ui/use-toast';
import { HttpClient } from '@/api/services/http';

const RootRedirect: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Initializing app from RootRedirect');
    
    // Check API connectivity
    HttpClient.checkApiConnection()
      .then(isConnected => {
        if (!isConnected) {
          toast({
            title: "API Connection Issue",
            description: "Could not connect to the API. Some features may not work correctly.",
            variant: "destructive",
          });
        }
      });
      
    // Initialize the app
    try {
      initializeApp();
    } catch (error) {
      console.error('Error initializing app:', error);
      toast({
        title: "Initialization Error",
        description: "There was a problem initializing the application.",
        variant: "destructive",
      });
    }
  }, []);

  // Check authentication directly
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
};

export default RootRedirect;
