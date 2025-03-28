
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Ably from 'ably';
import { v4 as uuidv4 } from 'uuid';

interface AblyContextValue {
  client: Ably.Realtime | null;
  clientId: string;
  isConnected: boolean;
  workspaceId: string;
  getChannelName: (channelId: string) => string;
}

const AblyContext = createContext<AblyContextValue | undefined>(undefined);

interface AblyProviderProps {
  children: React.ReactNode;
  workspaceId: string;
}

// Ably API key - this is a client key which is safe to expose
const ABLY_API_KEY = "X4jpaA.kKXoZg:oEr5R_kjKk06Wk0iilgK_rGAE9hbFjQMU8wYoE_BnEc";

export const AblyProvider: React.FC<AblyProviderProps> = ({ children, workspaceId }) => {
  const [client, setClient] = useState<Ably.Realtime | null>(null);
  const [clientId] = useState<string>(() => {
    // Generate a persistent client ID for this browser
    const savedClientId = localStorage.getItem('ably_client_id');
    if (savedClientId) return savedClientId;
    
    const newClientId = uuidv4();
    localStorage.setItem('ably_client_id', newClientId);
    return newClientId;
  });
  const [isConnected, setIsConnected] = useState(false);

  // Initialize Ably client
  useEffect(() => {
    const ablyClient = new Ably.Realtime({
      key: ABLY_API_KEY,
      clientId,
    });

    ablyClient.connection.on('connected', () => {
      console.log('Ably connected');
      setIsConnected(true);
    });

    ablyClient.connection.on('disconnected', () => {
      console.log('Ably disconnected');
      setIsConnected(false);
    });

    ablyClient.connection.on('failed', (error) => {
      console.error('Ably connection failed:', error);
      setIsConnected(false);
    });

    setClient(ablyClient);

    return () => {
      ablyClient.close();
    };
  }, [clientId]);

  // Helper to get standardized channel names
  const getChannelName = (channelId: string): string => {
    return `chat:${workspaceId}:${channelId}`;
  };

  const value = {
    client,
    clientId,
    isConnected,
    workspaceId,
    getChannelName,
  };

  return <AblyContext.Provider value={value}>{children}</AblyContext.Provider>;
};

export const useAbly = (): AblyContextValue => {
  const context = useContext(AblyContext);
  
  if (context === undefined) {
    throw new Error('useAbly must be used within an AblyProvider');
  }
  
  return context;
};
