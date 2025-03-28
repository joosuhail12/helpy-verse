
import * as React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create client configuration with defaults
const createQueryClient = () => new QueryClient({
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
  // Create and memoize the QueryClient to prevent unnecessary re-renders
  const queryClientRef = React.useRef<QueryClient>(null);
  
  // Initialize queryClient on first render
  if (queryClientRef.current === null) {
    queryClientRef.current = createQueryClient();
  }
  
  return (
    <QueryClientProvider client={queryClientRef.current}>
      {children}
    </QueryClientProvider>
  );
};

export default AppQueryProvider;
