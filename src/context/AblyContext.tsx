
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Ably from 'ably';

// Mock API key for development - in a real app, this would be an environment variable
const ABLY_API_KEY = "X4jpaA.kKXoZg:oEr5R_kjKk06Wk0iilgK_rGAE9hbFjQMU8wYoE_BnEc";

interface AblyContextState {
  clientId: string;
  workspaceId: string;
  isConnected: boolean;
  client: Ably.Realtime | null;
  getChannel: (channelName: string) => Ably.Types.RealtimeChannel;
}

const AblyContext = createContext<AblyContextState | undefined>(undefined);

interface AblyProviderProps {
  children: React.ReactNode;
  workspaceId: string;
}

export const AblyProvider: React.FC<AblyProviderProps> = ({ children, workspaceId }) => {
  const [client, setClient] = useState<Ably.Realtime | null>(null);
  const [state, setState] = useState<AblyContextState>({
    clientId: `user-${Math.random().toString(36).substring(2, 9)}`,
    workspaceId,
    isConnected: false,
    client: null,
    getChannel: (channelName: string) => {
      if (!client) {
        throw new Error('Ably client not initialized');
      }
      return client.channels.get(channelName);
    }
  });

  useEffect(() => {
    // Initialize Ably client
    const ablyClient = new Ably.Realtime({
      key: ABLY_API_KEY,
      clientId: state.clientId
    });

    // Set up connection listeners
    ablyClient.connection.on('connected', () => {
      console.log('Ably connected successfully');
      setState(prev => ({ 
        ...prev, 
        isConnected: true,
        client: ablyClient,
        getChannel: (channelName: string) => ablyClient.channels.get(channelName)
      }));
    });

    ablyClient.connection.on('disconnected', () => {
      console.log('Ably disconnected');
      setState(prev => ({ ...prev, isConnected: false }));
    });

    ablyClient.connection.on('failed', (err) => {
      console.error('Ably connection failed:', err);
      setState(prev => ({ ...prev, isConnected: false }));
    });

    setClient(ablyClient);

    // Cleanup function
    return () => {
      ablyClient.close();
    };
  }, [workspaceId]);

  return (
    <AblyContext.Provider value={state}>
      {children}
    </AblyContext.Provider>
  );
};

export const useAbly = (): AblyContextState => {
  const context = useContext(AblyContext);
  
  if (context === undefined) {
    throw new Error('useAbly must be used within an AblyProvider');
  }
  
  return context;
};
