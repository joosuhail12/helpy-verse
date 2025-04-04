
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

const App: React.FC = () => {
  console.log("App component rendering with router");
  
  useEffect(() => {
    // Check API connection on app start
    HttpClient.checkApiConnection()
      .then(isConnected => {
        console.log('API connection test result:', isConnected ? 'Connected' : 'Failed');
      })
      .catch(error => {
        console.error('Error checking API connection:', error);
      });
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
