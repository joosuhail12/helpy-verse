
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type AblyContextType = {
  client: any;
  isConnected: boolean;
  workspaceId: string;
  clientId: string;
  connect: () => void;
  disconnect: () => void;
  getChannel: (channelName: string) => any;
};

const AblyContext = createContext<AblyContextType | undefined>(undefined);

interface AblyProviderProps {
  children: ReactNode;
  workspaceId: string;
}

export const AblyProvider: React.FC<AblyProviderProps> = ({ children, workspaceId }) => {
  const [client, setClient] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [clientId, setClientId] = useState<string>('user-' + Math.random().toString(36).substring(2, 9));

  // Initialize Ably client mock - in a real app, you would use the actual Ably SDK
  useEffect(() => {
    // For now, just create a mock client
    console.info(`AblyProvider: Connecting to workspace ${workspaceId}`);
    
    // Simulate connection
    setTimeout(() => {
      setIsConnected(true);
      console.info(`AblyProvider: Connected`);
    }, 500);

    return () => {
      console.info(`AblyProvider: Disconnected`);
      setIsConnected(false);
    };
  }, [workspaceId]);

  const connect = () => {
    console.info(`AblyProvider: Connecting to workspace ${workspaceId}`);
    setIsConnected(true);
  };

  const disconnect = () => {
    console.info(`AblyProvider: Disconnecting`);
    setIsConnected(false);
  };

  const getChannel = (channelName: string) => {
    console.info(`AblyProvider: Getting channel ${channelName}`);
    // Return a mock channel
    return {
      subscribe: (eventName: string, callback: Function) => {
        console.info(`AblyProvider: Subscribed to ${eventName} on ${channelName}`);
        return {
          unsubscribe: () => {
            console.info(`AblyProvider: Unsubscribed from ${eventName} on ${channelName}`);
          }
        };
      },
      publish: (eventName: string, data: any) => {
        console.info(`AblyProvider: Published ${eventName} to ${channelName}`, data);
        return Promise.resolve();
      }
    };
  };

  return (
    <AblyContext.Provider
      value={{
        client,
        isConnected,
        workspaceId,
        clientId,
        connect,
        disconnect,
        getChannel
      }}
    >
      {children}
    </AblyContext.Provider>
  );
};

export const useAbly = () => {
  const context = useContext(AblyContext);
  
  if (context === undefined) {
    throw new Error('useAbly must be used within an AblyProvider');
  }
  
  return context;
};

export default AblyContext;
