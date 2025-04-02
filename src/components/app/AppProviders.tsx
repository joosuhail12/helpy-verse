
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
  console.log("Rendering AppProviders");
  
  // Make sure React is properly initialized before rendering
  if (!React) {
    console.error("React is not properly initialized in AppProviders");
    return <div>Error initializing application</div>;
  }

  return (
    <AppErrorBoundary>
      {/* Redux Provider must come first since other components depend on it */}
      <Provider store={store}>
        <AppQueryProvider>
          <ThemeProvider initialTheme={{}}>
            <WidgetStateProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <AppInitializer>
                  <CaslProvider>
                    {children}
                  </CaslProvider>
                </AppInitializer>
              </TooltipProvider>
            </WidgetStateProvider>
          </ThemeProvider>
        </AppQueryProvider>
      </Provider>
    </AppErrorBoundary>
  );
};

export default AppProviders;
