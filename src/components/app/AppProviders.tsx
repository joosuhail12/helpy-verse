
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
import { ThemeProvider } from '@/context/ThemeContext';
import { WidgetStateProvider } from '@/widgets/chat/context/WidgetStateContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Top-level providers component that wraps the entire application
 * with necessary providers and error boundaries.
 */
const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  // Make sure React is properly initialized before rendering Provider
  if (!React.useState) {
    console.error("React hooks are not available - potential React initialization issue");
    return <div>Application initialization error</div>;
  }

  return (
    <AppErrorBoundary>
      <Provider store={store}>
        <ThemeProvider initialTheme={{}}>
          <WidgetStateProvider>
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
          </WidgetStateProvider>
        </ThemeProvider>
      </Provider>
    </AppErrorBoundary>
  );
};

export default AppProviders;
