
import React, { createContext, useContext, useEffect, useState } from 'react';
import Ably from 'ably';

interface AblyContextType {
  client: Ably.Realtime | null;
  isConnected: boolean;
}

const AblyContext = createContext<AblyContextType>({
  client: null,
  isConnected: false
});

export const useAbly = () => useContext(AblyContext);

interface AblyProviderProps {
  children: React.ReactNode;
  apiKey?: string;
}

const AblyProvider: React.FC<AblyProviderProps> = ({ children, apiKey }) => {
  const [client, setClient] = useState<Ably.Realtime | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const key = apiKey || import.meta.env.VITE_ABLY_API_KEY || 'demo:key';
    const ably = new Ably.Realtime({ key });

    const handleConnected = () => {
      console.log('Ably connected');
      setIsConnected(true);
    };

    const handleDisconnected = () => {
      console.log('Ably disconnected');
      setIsConnected(false);
    };

    ably.connection.on('connected', handleConnected);
    ably.connection.on('disconnected', handleDisconnected);

    setClient(ably);

    return () => {
      ably.connection.off('connected', handleConnected);
      ably.connection.off('disconnected', handleDisconnected);
      ably.close();
    };
  }, [apiKey]);

  return (
    <AblyContext.Provider value={{ client, isConnected }}>
      {children}
    </AblyContext.Provider>
  );
};

export default AblyProvider;
