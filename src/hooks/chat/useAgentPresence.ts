
import { useState, useEffect } from 'react';
import { useAbly } from '@/context/AblyContext';

export interface AgentPresence {
  id: string;
  name: string;
  avatar?: string;
  lastActive: Date;
  status: 'online' | 'offline' | 'away' | 'busy';
}

/**
 * Hook to track agent presence in a conversation
 */
export const useAgentPresence = (conversationId: string) => {
  const [agents, setAgents] = useState<AgentPresence[]>([]);
  const { client, isConnected } = useAbly();

  useEffect(() => {
    if (!client || !isConnected || !conversationId) return;

    // In a real app, this would connect to Ably presence
    // For demo purposes, we're setting mock data
    const mockAgents: AgentPresence[] = [
      {
        id: '1',
        name: 'Support Agent',
        avatar: 'https://i.pravatar.cc/150?img=1',
        lastActive: new Date(),
        status: 'online'
      }
    ];

    setAgents(mockAgents);

    return () => {
      // Cleanup function
    };
  }, [conversationId, client, isConnected]);

  return {
    agents,
    isLoading: false,
    error: null
  };
};
