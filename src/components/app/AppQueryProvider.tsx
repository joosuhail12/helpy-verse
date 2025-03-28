
import * as React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

interface AppQueryProviderProps {
  children: React.ReactNode;
}

const AppQueryProvider: React.FC<AppQueryProviderProps> = ({ children }) => {
  // Ensure the QueryClient is instantiated only once
  const queryClientRef = React.useRef<QueryClient>(queryClient);
  
  return (
    <QueryClientProvider client={queryClientRef.current}>
      {children}
    </QueryClientProvider>
  );
};

export default AppQueryProvider;
