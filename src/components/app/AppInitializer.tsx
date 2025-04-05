
import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { HttpClient } from '@/api/services/http';
import { isAuthenticated } from '@/utils/auth/tokenManager';
import ErrorDisplay from './ErrorDisplay';
import { toast } from '@/components/ui/use-toast';

interface AppInitializerProps {
  children: React.ReactNode;
}

// Export the initialization function for direct use
export const initializeApp = (): void => {
  try {
    console.log('Initializing application services...');
    
    // Set up API client with token if authenticated
    if (isAuthenticated()) {
      const token = localStorage.getItem('token');
      if (token) {
        HttpClient.setAxiosDefaultConfig(token);
        console.log('HTTP client configured with auth token');
      }
    }
    
    // Set default workspace ID for development if needed
    if (import.meta.env.DEV && !localStorage.getItem('workspaceId')) {
      localStorage.setItem('workspaceId', '6c22b22f-7bdf-43db-b7c1-9c5884125c63');
      console.log('DEV: Set default workspace ID for development');
    }
    
    console.log('Application core services initialized');
  } catch (err) {
    console.error('Failed to initialize application services:', err);
    
    toast({
      title: 'Initialization Error',
      description: 'There was a problem initializing application services.',
      variant: 'destructive',
    });
    
    throw err; // Re-throw to allow handling by error boundaries
  }
};

/**
 * Component responsible for initializing app-wide services and configurations
 */
const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const initializeAppComponent = async () => {
      try {
        console.log('Initializing application component...');
        
        // Call the shared initialization function
        initializeApp();
        
        // Component-specific initialization can go here
        
        // App successfully initialized
        setInitialized(true);
        console.log('Application initialization complete');
      } catch (err) {
        console.error('Failed to initialize application component:', err);
        setError('Failed to initialize application. Please refresh the page.');
        
        toast({
          title: 'Initialization Error',
          description: 'There was a problem starting the application.',
          variant: 'destructive',
        });
      }
    };
    
    initializeAppComponent();
  }, [dispatch]);
  
  // Show error if initialization failed
  if (error) {
    return <ErrorDisplay message={error} onRetry={() => window.location.reload()} />;
  }
  
  // Show loading if still initializing
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-2 text-lg">Initializing application...</span>
      </div>
    );
  }
  
  // Render children once initialized
  return <>{children}</>;
};

export default AppInitializer;
