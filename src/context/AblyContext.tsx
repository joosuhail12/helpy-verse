
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AblyContextValue {
  client: any;
  clientId: string;
  getChannelName: (conversationId: string) => string;
  isConnected: boolean;
  connectionState: string;
  connect: () => Promise<void>;
  disconnect: () => void;
  publish: (channel: string, eventName: string, data: any) => Promise<void>;
  subscribe: (channel: string, eventName: string, callback: (message: any) => void) => () => void;
}

// Create context with default values
const AblyContext = createContext<AblyContextValue>({
  client: null,
  clientId: '',
  getChannelName: () => '',
  isConnected: false,
  connectionState: 'disconnected',
  connect: async () => {},
  disconnect: () => {},
  publish: async () => {},
  subscribe: () => () => {},
});

export const useAbly = () => useContext(AblyContext);

interface AblyProviderProps {
  children: React.ReactNode;
}

export const AblyProvider: React.FC<AblyProviderProps> = ({ children }) => {
  const [client, setClient] = useState<any>(null);
  const [clientId] = useState<string>(`client-${Math.random().toString(36).substring(2, 9)}`);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionState, setConnectionState] = useState<string>('disconnected');

  // Initialize Ably client
  useEffect(() => {
    const initializeAbly = async () => {
      try {
        // Check if we're in a browser environment
        if (typeof window !== 'undefined') {
          // For now, we're using a mock implementation since we don't actually have Ably installed
          console.log('Initializing mock Ably client with client ID:', clientId);
          
          // Create mock client
          const mockClient = {
            connection: {
              state: 'initialized',
              on: (event: string, callback: () => void) => {
                console.log(`[Ably Mock] Registered listener for ${event}`);
                return () => {}; // Unsubscribe function
              }
            },
            channels: {
              get: (channelName: string) => ({
                publish: async (eventName: string, data: any) => {
                  console.log(`[Ably Mock] Published to ${channelName}:${eventName}`, data);
                },
                subscribe: (eventName: string, callback: (message: any) => void) => {
                  console.log(`[Ably Mock] Subscribed to ${channelName}:${eventName}`);
                  return () => {
                    console.log(`[Ably Mock] Unsubscribed from ${channelName}:${eventName}`);
                  };
                }
              })
            }
          };
          
          setClient(mockClient);
          setConnectionState('connected');
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Failed to initialize Ably client:', error);
      }
    };
    
    initializeAbly();
    
    return () => {
      // Cleanup
      if (client) {
        console.log('[Ably Mock] Disconnecting');
      }
    };
  }, [clientId]);

  const getChannelName = (conversationId: string): string => {
    return `conversation:${conversationId}`;
  };

  const connect = async (): Promise<void> => {
    if (client) {
      console.log('[Ably Mock] Connecting');
      setConnectionState('connected');
      setIsConnected(true);
    }
  };

  const disconnect = (): void => {
    if (client) {
      console.log('[Ably Mock] Disconnecting');
      setConnectionState('disconnected');
      setIsConnected(false);
    }
  };

  const publish = async (channel: string, eventName: string, data: any): Promise<void> => {
    if (client && isConnected) {
      await client.channels.get(channel).publish(eventName, data);
    } else {
      console.warn('Cannot publish: Ably client not connected');
    }
  };

  const subscribe = (channel: string, eventName: string, callback: (message: any) => void): () => void => {
    if (client) {
      return client.channels.get(channel).subscribe(eventName, callback);
    }
    return () => {}; // Return empty unsubscribe function
  };

  const value: AblyContextValue = {
    client,
    clientId,
    getChannelName,
    isConnected,
    connectionState,
    connect,
    disconnect,
    publish,
    subscribe,
  };

  return <AblyContext.Provider value={value}>{children}</AblyContext.Provider>;
};

export default AblyContext;
