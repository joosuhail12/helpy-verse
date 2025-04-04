
import * as React from "react";
import AppQueryProvider from "./components/app/AppQueryProvider";
import AppRoutes from "./components/app/AppRoutes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import AppErrorBoundary from './components/app/AppErrorBoundary';
import CaslProvider from "@/components/CaslProvider";

const App: React.FC = () => {
  return (
    <AppErrorBoundary>
      <AppQueryProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <CaslProvider>
            <AppRoutes />
          </CaslProvider>
        </TooltipProvider>
      </AppQueryProvider>
    </AppErrorBoundary>
  );
};

export default App;
