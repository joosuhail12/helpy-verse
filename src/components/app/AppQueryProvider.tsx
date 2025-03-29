
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Provider component for React Query
 * Creates a new QueryClient instance for each component mount
 * to ensure proper React context is available
 */
const AppQueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use useState to create a stable QueryClient instance that persists between renders
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default AppQueryProvider;
