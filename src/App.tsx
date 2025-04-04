
import * as React from "react";
import AppQueryProvider from "./components/app/AppQueryProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import AppErrorBoundary from './components/app/AppErrorBoundary';
import CaslProvider from "@/components/CaslProvider";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

const App: React.FC = () => {
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
