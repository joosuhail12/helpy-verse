
import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client - move this inside the component to ensure React is available
const AppQueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Create the client inside the component to ensure React context is available
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
