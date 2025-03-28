
import { useState, useEffect, useCallback } from 'react';
import { useAbly } from '@/context/AblyContext';
import { ChatEventType } from '@/utils/events/eventTypes';
import { eventTracker } from '@/utils/events/eventTracker';

interface AgentInfo {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'away';
  lastActive?: string;
}

export const useAgentPresence = (conversationId: string) => {
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const ably = useAbly();

  const fetchAgents = useCallback(async () => {
    setIsLoading(true);

    try {
      const channelName = ably.getChannelName(`agent-presence:${conversationId}`);
      const presenceData = await ably.presence.get(channelName);

      const agentData: AgentInfo[] = presenceData.map(message => ({
        id: message.clientId,
        name: message.data?.name || 'Agent',
        status: message.data?.status || 'online',
        lastActive: message.data?.lastActive || new Date().toISOString()
      }));

      setAgents(agentData);

      // Track agent presence event
      eventTracker.trackEvent({
        type: ChatEventType.AGENT_PRESENCE_UPDATED,
        timestamp: new Date().toISOString(),
        source: 'presence',
        agents: agentData.map(agent => ({
          id: agent.id,
          status: agent.status
        })),
        conversationId
      });
    } catch (error) {
      console.error('Failed to fetch agent presence:', error);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, ably]);

  useEffect(() => {
    fetchAgents();

    // Subscribe to presence updates
    const channelName = ably.getChannelName(`agent-presence:${conversationId}`);
    
    const unsubscribe = ably.presence.subscribe(channelName, message => {
      fetchAgents();
    });

    return () => {
      unsubscribe();
    };
  }, [conversationId, ably, fetchAgents]);

  return {
    agents,
    isLoading
  };
};

export default useAgentPresence;
