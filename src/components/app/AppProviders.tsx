
import * as React from 'react';
import { useEffect } from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
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
  useEffect(() => {
    // Check API connection on app start if user is authenticated, but don't block rendering
    if (isAuthenticated()) {
      HttpClient.checkApiConnection()
        .then(isConnected => {
          console.log('API connection test result:', isConnected ? 'Connected' : 'Failed');
          
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
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <CaslProvider>
            {children}
          </CaslProvider>
        </TooltipProvider>
      </AppQueryProvider>
    </AppErrorBoundary>
  );
};

export default AppProviders;
