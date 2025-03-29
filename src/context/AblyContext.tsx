
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Ably from 'ably';

interface AblyContextType {
  client: Ably.Types.RealtimeClient | null;
  isConnected: boolean;
  error: Error | null;
}

const AblyContext = createContext<AblyContextType>({
  client: null,
  isConnected: false,
  error: null
});

export const useAbly = () => useContext(AblyContext);

interface AblyProviderProps {
  children: ReactNode;
  workspaceId: string;
}

export const AblyProvider: React.FC<AblyProviderProps> = ({ children, workspaceId }) => {
  const [client, setClient] = useState<Ably.Types.RealtimeClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // In a real app, you would fetch a client API key from your backend
    // For demo purposes, we're simulating the client connection
    try {
      // Use a mock client for demonstration purposes
      const mockClient = {
        connection: {
          state: 'connected',
          on: (callback: (stateChange: any) => void) => {
            // Simulate connection established
            callback({ current: 'connected' });
            return () => {}; // Mock cleanup function
          },
          off: () => {},
          connect: () => {},
          close: () => {}
        },
        channels: {
          get: () => ({
            subscribe: () => ({
              unsubscribe: () => {}
            }),
            publish: () => Promise.resolve()
          })
        }
      } as unknown as Ably.Types.RealtimeClient;
      
      setClient(mockClient);
      setIsConnected(true);
    } catch (err) {
      console.error('Failed to initialize Ably client:', err);
      setError(err instanceof Error ? err : new Error('Failed to initialize Ably client'));
    }

    return () => {
      // Cleanup Ably connection
      if (client) {
        client.connection.close();
      }
    };
  }, [workspaceId]);

  return (
    <AblyContext.Provider value={{ client, isConnected, error }}>
      {children}
    </AblyContext.Provider>
  );
};
