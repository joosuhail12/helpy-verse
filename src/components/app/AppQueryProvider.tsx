
import * as React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface AppQueryProviderProps {
  children: React.ReactNode;
}

const AppQueryProvider: React.FC<AppQueryProviderProps> = ({ children }) => {
  // Create and memoize the QueryClient to prevent unnecessary re-renders
  const queryClient = React.useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  }), []);
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default AppQueryProvider;
