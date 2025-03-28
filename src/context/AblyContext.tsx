
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as Ably from 'ably';
import { v4 as uuidv4 } from 'uuid';

// Ably API key - would normally come from environment variables
const ABLY_API_KEY = 'X4jpaA.kKXoZg:oEr5R_kjKk06Wk0iilgK_rGAE9hbFjQMU8wYoE_BnEc';

interface AblyContextValue {
  isConnected: boolean;
  connectionState: string;
  getChannelName: (channelId: string) => string;
  subscribe: (channelName: string, eventName: string, callback: (message: any) => void) => () => void;
  publish: (channelName: string, eventName: string, data: any) => Promise<void>;
  presence: {
    enter: (channelName: string, data?: any) => Promise<void>;
    leave: (channelName: string) => Promise<void>;
    get: (channelName: string) => Promise<Ably.Types.PresenceMessage[]>;
    subscribe: (channelName: string, callback: (presenceMessage: Ably.Types.PresenceMessage) => void) => () => void;
  };
  clientId: string;
}

const AblyContext = createContext<AblyContextValue | undefined>(undefined);

interface AblyProviderProps {
  children: React.ReactNode;
  workspaceId: string;
}

export const AblyProvider: React.FC<AblyProviderProps> = ({ children, workspaceId }) => {
  const [client, setClient] = useState<Ably.Types.RealtimePromise | null>(null);
  const [clientId] = useState<string>(() => {
    const savedClientId = localStorage.getItem('ably_client_id');
    if (savedClientId) return savedClientId;
    
    const newClientId = uuidv4();
    localStorage.setItem('ably_client_id', newClientId);
    return newClientId;
  });
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionState, setConnectionState] = useState<string>('disconnected');
  const [channels, setChannels] = useState<Record<string, Ably.Types.RealtimeChannelPromise>>({});

  // Initialize Ably client
  useEffect(() => {
    const ablyClient = new Ably.Realtime.Promise({
      key: ABLY_API_KEY,
      clientId
    });
    
    setClient(ablyClient as Ably.Types.RealtimePromise);
    
    // Connection state change handler
    const handleConnectionStateChange = (stateChange: Ably.Types.ConnectionStateChange) => {
      setConnectionState(stateChange.current);
      setIsConnected(stateChange.current === 'connected');
      
      if (stateChange.current === 'connected') {
        console.log('Connected to Ably realtime service');
      } else if (stateChange.current === 'failed') {
        console.error('Failed to connect to Ably', stateChange.reason);
      }
    };
    
    ablyClient.connection.on('connected', handleConnectionStateChange);
    ablyClient.connection.on('disconnected', handleConnectionStateChange);
    ablyClient.connection.on('suspended', handleConnectionStateChange);
    ablyClient.connection.on('failed', handleConnectionStateChange);
    
    return () => {
      ablyClient.connection.off();
      ablyClient.close();
    };
  }, [clientId]);

  // Get a channel instance with proper caching
  const getChannel = useCallback((channelName: string): Ably.Types.RealtimeChannelPromise => {
    if (!client) {
      throw new Error('Ably client not initialized');
    }
    
    if (channels[channelName]) {
      return channels[channelName];
    }
    
    const channel = client.channels.get(channelName);
    
    setChannels(prev => ({
      ...prev,
      [channelName]: channel as Ably.Types.RealtimeChannelPromise
    }));
    
    return channel as Ably.Types.RealtimeChannelPromise;
  }, [client, channels]);

  // Get channel name with workspace prefix
  const getChannelName = useCallback((channelId: string): string => {
    return `workspace:${workspaceId}:${channelId}`;
  }, [workspaceId]);

  // Subscribe to a channel event
  const subscribe = useCallback((channelName: string, eventName: string, callback: (message: any) => void): () => void => {
    try {
      const channel = getChannel(channelName);
      
      const onMessage = (message: Ably.Types.Message) => {
        callback(message);
      };
      
      channel.subscribe(eventName, onMessage);
      
      return () => {
        channel.unsubscribe(eventName, onMessage);
      };
    } catch (error) {
      console.error(`Failed to subscribe to ${channelName}:${eventName}`, error);
      return () => {}; // Return no-op unsubscribe function
    }
  }, [getChannel]);

  // Publish a message to a channel
  const publish = useCallback(async (channelName: string, eventName: string, data: any): Promise<void> => {
    try {
      if (!isConnected) {
        throw new Error('Not connected to Ably');
      }
      
      const channel = getChannel(channelName);
      await channel.publish(eventName, data);
    } catch (error) {
      console.error(`Failed to publish to ${channelName}:${eventName}`, error);
      throw error;
    }
  }, [getChannel, isConnected]);

  // Presence operations
  const presence = {
    enter: useCallback(async (channelName: string, data: any = {}): Promise<void> => {
      try {
        if (!isConnected) {
          throw new Error('Not connected to Ably');
        }
        
        const channel = getChannel(channelName);
        await channel.presence.enter(data);
      } catch (error) {
        console.error(`Failed to enter presence for ${channelName}`, error);
        throw error;
      }
    }, [getChannel, isConnected]),
    
    leave: useCallback(async (channelName: string): Promise<void> => {
      try {
        if (!client) return;
        
        const channel = getChannel(channelName);
        await channel.presence.leave();
      } catch (error) {
        console.error(`Failed to leave presence for ${channelName}`, error);
      }
    }, [getChannel, client]),
    
    get: useCallback(async (channelName: string): Promise<Ably.Types.PresenceMessage[]> => {
      try {
        if (!isConnected) {
          return [];
        }
        
        const channel = getChannel(channelName);
        return await channel.presence.get();
      } catch (error) {
        console.error(`Failed to get presence for ${channelName}`, error);
        return [];
      }
    }, [getChannel, isConnected]),
    
    subscribe: useCallback((channelName: string, callback: (presenceMessage: Ably.Types.PresenceMessage) => void): () => void => {
      try {
        const channel = getChannel(channelName);
        
        channel.presence.subscribe('enter', callback);
        channel.presence.subscribe('leave', callback);
        channel.presence.subscribe('update', callback);
        
        return () => {
          channel.presence.unsubscribe('enter', callback);
          channel.presence.unsubscribe('leave', callback);
          channel.presence.unsubscribe('update', callback);
        };
      } catch (error) {
        console.error(`Failed to subscribe to presence for ${channelName}`, error);
        return () => {}; // Return no-op unsubscribe function
      }
    }, [getChannel])
  };

  const value = {
    isConnected,
    connectionState,
    getChannelName,
    subscribe,
    publish,
    presence,
    clientId
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
