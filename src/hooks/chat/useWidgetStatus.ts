
import { useState, useEffect, useCallback } from 'react';
import { useAgentPresence, AgentPresence } from '@/hooks/chat/useAgentPresence';
import { useAbly } from '@/context/AblyContext';
import { Types } from 'ably';

type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'failed';

/**
 * Hook for monitoring the widget's connection status
 */
export const useWidgetStatus = () => {
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [lastConnected, setLastConnected] = useState<Date | null>(null);
  const { client } = useAbly();
  
  // Monitor connection status
  useEffect(() => {
    if (!client) return;
    
    const handleStateChange = (stateChange: Types.ConnectionStateChange) => {
      console.log('Connection state changed:', stateChange.current);
      
      switch (stateChange.current) {
        case 'connected':
          setStatus('connected');
          setLastConnected(new Date());
          break;
        case 'connecting':
        case 'disconnected':
          setStatus('connecting');
          break;
        case 'suspended':
        case 'closing':
        case 'closed':
          setStatus('disconnected');
          break;
        case 'failed':
          setStatus('failed');
          break;
      }
    };
    
    // Initial status
    if (client.connection.state === 'connected') {
      setStatus('connected');
      setLastConnected(new Date());
    } else if (['connecting', 'disconnected'].includes(client.connection.state)) {
      setStatus('connecting');
    } else if (client.connection.state === 'failed') {
      setStatus('failed');
    } else {
      setStatus('disconnected');
    }
    
    // Subscribe to connection state changes
    client.connection.on(stateChange => {
      handleStateChange(stateChange);
    });
    
    return () => {
      client.connection.off(stateChange => {
        handleStateChange(stateChange);
      });
    };
  }, [client]);
  
  // Attempt to reconnect
  const reconnect = useCallback(() => {
    if (!client) return false;
    
    try {
      // Close current connection if in a bad state
      if (status === 'failed') {
        client.close();
      }
      
      // Attempt to connect
      client.connect();
      setStatus('connecting');
      return true;
    } catch (error) {
      console.error('Failed to reconnect:', error);
      setStatus('failed');
      return false;
    }
  }, [client, status]);
  
  return {
    status,
    isConnected: status === 'connected',
    isConnecting: status === 'connecting',
    isDisconnected: status === 'disconnected' || status === 'failed',
    lastConnected,
    reconnect
  };
};
