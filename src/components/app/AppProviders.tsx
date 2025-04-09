
import * as React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import AppQueryProvider from './AppQueryProvider';
import AppErrorBoundary from './AppErrorBoundary';
import CaslProvider from "@/components/CaslProvider";
import { HttpClient } from "@/api/services/http";
import { toast } from "@/components/ui/use-toast";
import { isAuthenticated } from "@/utils/auth/tokenManager";

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Top-level providers component that wraps the entire application
 * with necessary providers and error boundaries.
 */
const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  // Initialize app only once on component mount
  React.useEffect(() => {
    // Check API connection once at app start if authenticated
    if (isAuthenticated()) {
      console.log('Checking API connection on app initialization');
      HttpClient.checkApiConnection()
        .then(isConnected => {
          console.log('Initial API connection test result:', isConnected ? 'Connected' : 'Failed');
          
          if (!isConnected) {
            toast({
              title: "Connection Issue",
              description: "Could not connect to the API server. Some features may be unavailable.",
              variant: "destructive",
            });
          }
        })
        .catch(error => {
          console.error('Error checking API connection:', error);
        });
    }
  }, []);

  return (
    <AppErrorBoundary>
      <AppQueryProvider>
        <CaslProvider>
          {children}
          <Toaster />
          <Sonner />
        </CaslProvider>
      </AppQueryProvider>
    </AppErrorBoundary>
  );
};

export default AppProviders;
