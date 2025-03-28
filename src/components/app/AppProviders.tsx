
import React from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import AppQueryProvider from './AppQueryProvider';
import AppErrorBoundary from './AppErrorBoundary';
import CaslProvider from "@/components/CaslProvider";
import AppInitializer from './AppInitializer';

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Top-level providers component that wraps the entire application
 * with necessary providers and error boundaries.
 */
const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <AppErrorBoundary>
      <AppQueryProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <CaslProvider>
            <AppInitializer>
              {children}
            </AppInitializer>
          </CaslProvider>
        </TooltipProvider>
      </AppQueryProvider>
    </AppErrorBoundary>
  );
};

export default AppProviders;
