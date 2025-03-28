
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as Ably from 'ably';

interface AblyContextValue {
  isConnected: boolean;
  connectionState: string;
  getChannelName: (resourceId: string) => string;
  subscribe: (channelName: string, eventName: string, callback: (message: any) => void) => () => void;
  publish: (channelName: string, eventName: string, data: any) => Promise<void>;
  lastEvent: { channelName: string; eventName: string; data: any } | null;
}

const AblyContext = createContext<AblyContextValue | undefined>(undefined);

interface AblyProviderProps {
  children: React.ReactNode;
  workspaceId: string;
  clientId?: string;
}

export const AblyProvider: React.FC<AblyProviderProps> = ({ 
  children, 
  workspaceId,
  clientId = 'anonymous'
}) => {
  const [client, setClient] = useState<Ably.Realtime | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState('disconnected');
  const [lastEvent, setLastEvent] = useState<{ channelName: string; eventName: string; data: any } | null>(null);
  const [channels, setChannels] = useState<{ [key: string]: Ably.Types.RealtimeChannelPromise }>({});

  // Initialize Ably client
  useEffect(() => {
    try {
      // For simplicity in this example, we're using an anonymous client connection
      // In a real implementation, you'd obtain a token from your server
      const ably = new Ably.Realtime.Promise({
        authUrl: '/api/createAblyToken',
        clientId,
      });
      
      setClient(ably);
      
      // Set up connection state change listener
      ably.connection.on((stateChange: Ably.Types.ConnectionStateChange) => {
        setConnectionState(stateChange.current);
        setIsConnected(stateChange.current === 'connected');
        
        console.log(`Ably connection state changed to: ${stateChange.current}`, {
          reason: stateChange.reason || 'No reason provided'
        });
      });
      
      // Clean up
      return () => {
        Object.values(channels).forEach(channel => {
          channel.detach();
        });
        
        ably.close();
      };
    } catch (error) {
      console.error('Failed to initialize Ably:', error);
    }
  }, [workspaceId, clientId]);

  // Get a channel instance (creating if needed)
  const getChannel = useCallback((channelName: string) => {
    if (!client) {
      throw new Error('Ably client not initialized');
    }
    
    if (!channels[channelName]) {
      const channel = client.channels.get(channelName);
      setChannels(prev => ({
        ...prev,
        [channelName]: channel
      }));
      return channel;
    }
    
    return channels[channelName];
  }, [client, channels]);

  // Get a standard channel name based on resource ID
  const getChannelName = useCallback((resourceId: string) => {
    return `workspace:${workspaceId}:resource:${resourceId}`;
  }, [workspaceId]);

  // Subscribe to events on a channel
  const subscribe = useCallback((channelName: string, eventName: string, callback: (message: any) => void) => {
    if (!client) {
      console.warn('Ably client not initialized, cannot subscribe');
      return () => {}; // Return no-op unsubscribe function
    }
    
    try {
      const channel = getChannel(channelName);
      
      const onMessage = (message: Ably.Types.Message) => {
        setLastEvent({
          channelName,
          eventName,
          data: message.data
        });
        
        callback(message);
      };
      
      channel.subscribe(eventName, onMessage);
      
      // Return unsubscribe function
      return () => {
        channel.unsubscribe(eventName, onMessage);
      };
    } catch (error) {
      console.error('Failed to subscribe to Ably channel:', error);
      return () => {}; // Return no-op unsubscribe function
    }
  }, [client, getChannel]);

  // Publish an event to a channel
  const publish = useCallback(async (channelName: string, eventName: string, data: any) => {
    if (!client) {
      throw new Error('Ably client not initialized');
    }
    
    try {
      const channel = getChannel(channelName);
      await channel.publish(eventName, data);
      
      setLastEvent({
        channelName,
        eventName,
        data
      });
    } catch (error) {
      console.error('Failed to publish to Ably channel:', error);
      throw error;
    }
  }, [client, getChannel]);

  const value = {
    isConnected,
    connectionState,
    getChannelName,
    subscribe,
    publish,
    lastEvent
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

export default AblyContext;
