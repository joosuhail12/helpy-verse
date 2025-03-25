
import { useState, useEffect } from 'react';
import { useAbly } from '@/context/AblyContext';
import { enterPresence, updatePresence, leavePresence, getPresent } from '@/utils/ably/presenceService';
import { UserStatus } from '@/types/userStatus';

export interface AgentPresence {
  clientId: string;
  username?: string;
  status: UserStatus;
  lastSeen?: string;
  avatarUrl?: string;
}

export const useAgentPresence = (workspaceId: string, conversationId: string) => {
  const { clientId, isConnected } = useAbly();
  const [agents, setAgents] = useState<AgentPresence[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current presence data on mount
  useEffect(() => {
    const fetchPresence = async () => {
      if (!isConnected) return;
      
      try {
        setIsLoading(true);
        const presentClients = await getPresent(workspaceId, conversationId);
        
        // Filter for agents and normalize data
        const agentPresences = presentClients
          .filter(client => client.metadata?.isAgent)
          .map(client => ({
            clientId: client.clientId,
            username: client.username || 'Agent',
            status: (client.status as UserStatus) || 'offline',
            lastSeen: client.lastSeen,
            avatarUrl: client.metadata?.avatarUrl
          }));
        
        setAgents(agentPresences);
      } catch (error) {
        console.error('Failed to fetch presence data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPresence();
    
    // Set up subscription for presence updates
    const channelName = `workspace:${workspaceId}:conversations:${conversationId}`;
    const cleanupSubscription = subscribeToPresenceUpdates(channelName, (newAgents) => {
      setAgents(newAgents);
    });
    
    return () => {
      cleanupSubscription();
    };
  }, [workspaceId, conversationId, isConnected]);

  // Helper to subscribe to presence updates
  const subscribeToPresenceUpdates = (channelName: string, callback: (agents: AgentPresence[]) => void) => {
    // Implementation would connect to Ably channel and listen for presence events
    // This is a simplified version that would be expanded in a real implementation
    
    // In a real implementation, we would:
    // 1. Subscribe to enter/leave/update events
    // 2. Update our local state accordingly
    // 3. Return a cleanup function
    
    return () => {
      // Cleanup function
    };
  };

  // Update the current user's presence
  const updateCurrentPresence = async (status: UserStatus) => {
    if (!isConnected || !clientId) return;
    
    try {
      await updatePresence(workspaceId, conversationId, {
        clientId,
        status,
        lastSeen: new Date().toISOString(),
        metadata: {
          isAgent: true
        }
      });
    } catch (error) {
      console.error('Failed to update presence:', error);
    }
  };

  return {
    agents,
    isLoading,
    updateCurrentPresence
  };
};
