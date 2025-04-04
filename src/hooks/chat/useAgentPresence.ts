
import { useState, useEffect } from 'react';
import { useAbly } from '@/context/AblyContext';
import { UserStatus } from '@/types/userStatus';

export interface AgentPresence {
  id: string;
  name: string;
  avatar?: string;
  lastActive: Date;
  status: 'online' | 'offline' | 'away' | 'busy';
  clientId?: string;
  username?: string;
}

/**
 * Hook to track agent presence in a conversation
 */
export const useAgentPresence = (conversationId: string, workspaceId?: string) => {
  const [agents, setAgents] = useState<AgentPresence[]>([]);
  const ably = useAbly();

  useEffect(() => {
    if (!ably.client || !ably.isConnected || !conversationId) return;

    // In a real app, this would connect to Ably presence
    // For demo purposes, we're setting mock data
    const mockAgents: AgentPresence[] = [
      {
        id: '1',
        name: 'Support Agent',
        avatar: 'https://i.pravatar.cc/150?img=1',
        lastActive: new Date(),
        status: 'online',
        clientId: 'agent-1',
        username: 'Support Agent'
      }
    ];

    setAgents(mockAgents);

    return () => {
      // Cleanup function
    };
  }, [conversationId, ably.client, ably.isConnected]);

  return {
    agents,
    isLoading: false,
    error: null
  };
};
