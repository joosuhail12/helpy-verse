
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Ably from 'ably';
import { v4 as uuidv4 } from 'uuid';

export interface AblyContextValue {
  client: Ably.Realtime | null;
  clientId: string;
  getChannelName: (conversationId: string) => string;
  isConnected: boolean;
  connectionState: string;
  connectionError: string | null;
}

const AblyContext = createContext<AblyContextValue>({
  client: null,
  clientId: '',
  getChannelName: () => '',
  isConnected: false,
  connectionState: 'initialized',
  connectionError: null
});

export interface AblyProviderProps {
  children: React.ReactNode;
  clientId?: string;
  apiKey?: string;
  workspaceId?: string;
}

export const AblyProvider: React.FC<AblyProviderProps> = ({
  children,
  clientId = uuidv4(),
  apiKey = 'your-ably-api-key', // In production, get this from ENV
  workspaceId = 'default'
}) => {
  const [client, setClient] = useState<Ably.Realtime | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState('initialized');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Create the Ably client when the component mounts
  useEffect(() => {
    let ablyClient: Ably.Realtime;
    
    try {
      // Create Ably client with client ID
      ablyClient = new Ably.Realtime({
        key: apiKey,
        clientId,
        echoMessages: false,
        logLevel: process.env.NODE_ENV === 'development' ? 4 : 2
      });
      
      // Setup connection state change handler
      ablyClient.connection.on('connected', () => {
        console.log('Connected to Ably');
        setIsConnected(true);
        setConnectionState('connected');
        setConnectionError(null);
      });
      
      ablyClient.connection.on('disconnected', () => {
        console.log('Disconnected from Ably');
        setIsConnected(false);
        setConnectionState('disconnected');
      });
      
      ablyClient.connection.on('suspended', () => {
        console.warn('Ably connection suspended');
        setIsConnected(false);
        setConnectionState('suspended');
      });
      
      ablyClient.connection.on('failed', (err) => {
        console.error('Ably connection failed:', err);
        setIsConnected(false);
        setConnectionState('failed');
        setConnectionError(err?.message || 'Connection failed');
      });
      
      // Store the client
      setClient(ablyClient);
      
      return () => {
        // Clean up when the component unmounts
        ablyClient.connection.off();
        ablyClient.close();
      };
    } catch (error) {
      console.error('Failed to initialize Ably client:', error);
      setConnectionError('Failed to initialize Ably client');
      return () => {};
    }
  }, [clientId, apiKey]);
  
  // Get channel name for a conversation
  const getChannelName = (conversationId: string): string => {
    return `chat:${workspaceId}:${conversationId}`;
  };
  
  const value: AblyContextValue = {
    client,
    clientId,
    getChannelName,
    isConnected,
    connectionState,
    connectionError
  };
  
  return (
    <AblyContext.Provider value={value}>
      {children}
    </AblyContext.Provider>
  );
};

export const useAbly = (): AblyContextValue => {
  const context = useContext(AblyContext);
  
  if (!context) {
    throw new Error('useAbly must be used within an AblyProvider');
  }
  
  return context;
};
