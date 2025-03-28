
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import AppQueryProvider from './AppQueryProvider';
import AppErrorBoundary from './AppErrorBoundary';
import CaslProvider from "@/components/CaslProvider";
import AppInitializer from './AppInitializer';
import { NavigationProvider } from '@/context/NavigationContext';

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
      <React.StrictMode>
        <Provider store={store}>
          <AppQueryProvider>
            <NavigationProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <CaslProvider>
                  <AppInitializer>
                    {children}
                  </AppInitializer>
                </CaslProvider>
              </TooltipProvider>
            </NavigationProvider>
          </AppQueryProvider>
        </Provider>
      </React.StrictMode>
    </AppErrorBoundary>
  );
};

export default AppProviders;
