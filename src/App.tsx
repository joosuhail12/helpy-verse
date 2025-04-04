
import * as React from "react";
import { useEffect } from "react";
import AppQueryProvider from "./components/app/AppQueryProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import AppErrorBoundary from './components/app/AppErrorBoundary';
import CaslProvider from "@/components/CaslProvider";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { HttpClient } from "./api/services/http";
import { initializeApp } from "./components/app/AppInitializer";
import { toast } from "@/components/ui/use-toast";
import { isAuthenticated } from "./utils/auth/tokenManager";

const App: React.FC = () => {
  console.log("App component rendering with router");
  
  useEffect(() => {
    // Initialize the app first
    try {
      console.log("Initializing app from App component");
      initializeApp();
    } catch (error) {
      console.error('Error initializing app:', error);
      toast({
        title: "Application Error",
        description: "There was a problem initializing the application.",
        variant: "destructive",
      });
    }
    
    // Check API connection on app start if user is authenticated
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
            <RouterProvider router={router} />
          </CaslProvider>
        </TooltipProvider>
      </AppQueryProvider>
    </AppErrorBoundary>
  );
};

export default App;
