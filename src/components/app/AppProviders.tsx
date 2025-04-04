
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import AppQueryProvider from './AppQueryProvider';
import AppErrorBoundary from './AppErrorBoundary';
import CaslProvider from "@/components/CaslProvider";

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
      <Provider store={store}>
        <AppQueryProvider>
          <TooltipProvider>
            <CaslProvider>
              <Toaster />
              <Sonner />
              {children}
            </CaslProvider>
          </TooltipProvider>
        </AppQueryProvider>
      </Provider>
    </AppErrorBoundary>
  );
};

export default AppProviders;
