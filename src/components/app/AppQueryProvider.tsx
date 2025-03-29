
import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

interface AppQueryProviderProps {
  children: React.ReactNode;
}

/**
 * Provider for React Query
 * Wraps the application with QueryClientProvider
 */
const AppQueryProvider: React.FC<AppQueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default AppQueryProvider;
