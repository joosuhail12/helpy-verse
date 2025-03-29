
import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Provider component for React Query
 */
const AppQueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Create a new QueryClient instance
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default AppQueryProvider;
