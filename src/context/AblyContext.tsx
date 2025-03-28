
import React, { createContext, useContext, useState, useEffect } from 'react';
import Ably from 'ably';

export interface AblyContextValue {
  ably: Ably.Realtime | null;
  isConnected: boolean;
  connectionState: string;
  connect: (clientId?: string) => void;
  disconnect: () => void;
}

const defaultContextValue: AblyContextValue = {
  ably: null,
  isConnected: false,
  connectionState: 'disconnected',
  connect: () => {},
  disconnect: () => {},
};

const AblyContext = createContext<AblyContextValue>(defaultContextValue);

export const useAbly = () => useContext(AblyContext);

export const AblyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ably, setAbly] = useState<Ably.Realtime | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState('disconnected');

  const connect = (clientId?: string) => {
    if (ably) {
      // Already connected or connecting
      return;
    }
    
    try {
      const clientOptions: Ably.Types.ClientOptions = {
        authUrl: '/api/ably-token',
        clientId: clientId || `user-${Math.random().toString(36).substring(2, 9)}`,
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
    isConnected,
    connectionState,
    connect,
    disconnect,
  };

  return (
    <AblyContext.Provider value={contextValue}>
      {children}
    </AblyContext.Provider>
  );
};
