
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AblyContextValue {
  connected: boolean;
  subscribe: (channelName: string, callback: (data: any) => void) => () => void;
  publish: (channelName: string, data: any) => Promise<void>;
}

const AblyContext = createContext<AblyContextValue | undefined>(undefined);

interface AblyProviderProps {
  children: React.ReactNode;
  workspaceId: string;
}

export const AblyProvider: React.FC<AblyProviderProps> = ({ 
  children, 
  workspaceId 
}) => {
  const [connected, setConnected] = useState(false);
  
  // Mock implementation for now - in a real app, would connect to Ably
  useEffect(() => {
    console.log('AblyProvider: Connecting to workspace', workspaceId);
    // Simulate connection delay
    const timer = setTimeout(() => {
      setConnected(true);
      console.log('AblyProvider: Connected');
    }, 1000);
    
    return () => {
      clearTimeout(timer);
      console.log('AblyProvider: Disconnected');
    };
  }, [workspaceId]);
  
  // Mock subscription function
  const subscribe = (channelName: string, callback: (data: any) => void) => {
    console.log(`AblyProvider: Subscribed to ${channelName}`);
    
    // Return unsubscribe function
    return () => {
      console.log(`AblyProvider: Unsubscribed from ${channelName}`);
    };
  };
  
  // Mock publish function
  const publish = async (channelName: string, data: any) => {
    console.log(`AblyProvider: Published to ${channelName}`, data);
  };
  
  return (
    <AblyContext.Provider value={{ connected, subscribe, publish }}>
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
