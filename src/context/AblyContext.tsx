
import React, { createContext, useContext, useState, useEffect } from 'react';
import Ably from 'ably';

export interface AblyContextValue {
  ably: Ably.Realtime | null;
  isConnected: boolean;
  connectionState: string;
  connect: (clientId?: string) => void;
  disconnect: () => void;
  client: Ably.Realtime | null; // Add missing property
  clientId: string; // Add missing property
  getChannelName: (channelId: string) => string; // Add missing property
  workspaceId?: string; // Add optional workspaceId
}

const defaultContextValue: AblyContextValue = {
  ably: null,
  client: null,
  clientId: '',
  isConnected: false,
  connectionState: 'disconnected',
  connect: () => {},
  disconnect: () => {},
  getChannelName: () => ''
};

const AblyContext = createContext<AblyContextValue>(defaultContextValue);

export const useAbly = () => useContext(AblyContext);

interface AblyProviderProps {
  children: React.ReactNode;
  workspaceId?: string; // Add optional workspaceId prop
}

export const AblyProvider: React.FC<AblyProviderProps> = ({ children, workspaceId }) => {
  const [ably, setAbly] = useState<Ably.Realtime | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState('disconnected');
  const [clientId, setClientId] = useState(`user-${Math.random().toString(36).substring(2, 9)}`);

  const connect = (customClientId?: string) => {
    if (ably) {
      // Already connected or connecting
      return;
    }
    
    try {
      if (customClientId) {
        setClientId(customClientId);
      }
      
      const clientOptions: Ably.Types.ClientOptions = {
        authUrl: '/api/ably-token',
        clientId: customClientId || clientId,
      };

      const ablyInstance = new Ably.Realtime(clientOptions);
      setAbly(ablyInstance);

      ablyInstance.connection.on('connected', () => {
        setIsConnected(true);
        setConnectionState('connected');
        console.log('Ably connected');
      });

      ablyInstance.connection.on('disconnected', () => {
        setIsConnected(false);
        setConnectionState('disconnected');
        console.log('Ably disconnected');
      });

      ablyInstance.connection.on('failed', () => {
        setIsConnected(false);
        setConnectionState('failed');
        console.log('Ably connection failed');
      });
    } catch (error) {
      console.error('Failed to connect to Ably:', error);
      setConnectionState('failed');
    }
  };

  const disconnect = () => {
    if (ably) {
      ably.close();
      setAbly(null);
      setIsConnected(false);
      setConnectionState('disconnected');
    }
  };

  // Get channel name with workspace prefix if workspace ID is available
  const getChannelName = (channelId: string): string => {
    if (workspaceId) {
      return `workspace:${workspaceId}:${channelId}`;
    }
    return channelId;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (ably) {
        ably.close();
      }
    };
  }, [ably]);

  const contextValue: AblyContextValue = {
    ably,
    client: ably, // Set client to the same as ably
    clientId,
    isConnected,
    connectionState,
    connect,
    disconnect,
    getChannelName,
    workspaceId
  };

  return (
    <AblyContext.Provider value={contextValue}>
      {children}
    </AblyContext.Provider>
  );
};
