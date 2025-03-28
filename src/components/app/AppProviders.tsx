
import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '../ui/toaster';
import { ThemeProvider } from 'next-themes';
import AppErrorBoundary from './AppErrorBoundary';
import AppQueryProvider from './AppQueryProvider';
import CaslProvider from '../CaslProvider';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store/store';

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <React.StrictMode>
      <AppErrorBoundary>
        <ReduxProvider store={store}>
          <AppQueryProvider>
            <ThemeProvider attribute="class" defaultTheme="light">
              <CaslProvider>
                {children}
                <Toaster />
              </CaslProvider>
            </ThemeProvider>
          </AppQueryProvider>
        </ReduxProvider>
      </AppErrorBoundary>
    </React.StrictMode>
  );
};

export default AppProviders;
