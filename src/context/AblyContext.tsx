
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Ably from 'ably';

interface AblyContextType {
  client: Ably.Realtime | null;
  isConnected: boolean;
  error: Error | null;
  clientId: string;
  getChannelName: (channelId: string) => string;
  workspaceId: string;
}

const AblyContext = createContext<AblyContextType>({
  client: null,
  isConnected: false,
  error: null,
  clientId: '',
  getChannelName: () => '',
  workspaceId: ''
});

export const useAbly = () => useContext(AblyContext);

interface AblyProviderProps {
  children: ReactNode;
  workspaceId: string;
}

export const AblyProvider: React.FC<AblyProviderProps> = ({ children, workspaceId }) => {
  const [client, setClient] = useState<Ably.Realtime | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [clientId] = useState(() => `user-${Math.random().toString(36).substring(2, 9)}`);

  const getChannelName = (channelId: string) => {
    return `workspace:${workspaceId}:conversation:${channelId}`;
  };

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
      } as unknown as Ably.Realtime;
      
      setClient(mockClient);
      setIsConnected(true);
    } catch (err) {
      console.error('Failed to initialize Ably client:', err);
      setError(err instanceof Error ? err : new Error('Failed to initialize Ably client'));
    }

    return () => {
      // Cleanup Ably connection
      if (client) {
        client.close();
      }
    };
  }, [workspaceId]);

  return (
    <AblyContext.Provider value={{ 
      client, 
      isConnected, 
      error, 
      clientId, 
      getChannelName,
      workspaceId 
    }}>
      {children}
    </AblyContext.Provider>
  );
};
