
import { useState, useEffect } from 'react';
import { getAblyChannel, getWorkspaceChannelName } from '@/utils/ably';
import { useAbly } from '@/context/AblyContext';
import { UserStatus } from '@/types/userStatus';

export interface AgentPresence {
  clientId: string;
  username: string;
  status: UserStatus;
  lastSeen?: string;
  avatarUrl?: string;
}

const mapAblyStatusToUserStatus = (status: string): UserStatus => {
  switch (status) {
    case 'online':
      return 'available';
    case 'away':
      return 'inactive';
    case 'typing':
      return 'active-conversation';
    default:
      return 'offline';
  }
};

export const useAgentPresence = (workspaceId: string, conversationId: string) => {
  const [agents, setAgents] = useState<AgentPresence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { clientId } = useAbly();

  useEffect(() => {
    const updateAgentList = (presenceData: any[]) => {
      const uniqueAgents: Record<string, AgentPresence> = {};
      
      presenceData.forEach(presence => {
        const { clientId, data } = presence;
        
        // Skip if this is the current user
        if (clientId === clientId) return;
        
        // Extract agent data
        const username = data?.username || 'Anonymous Agent';
        const status = mapAblyStatusToUserStatus(data?.status || 'offline');
        const avatarUrl = data?.avatarUrl;
        const lastSeen = data?.lastSeen || new Date().toISOString();
        
        // Add to unique agents map
        uniqueAgents[clientId] = {
          clientId,
          username,
          status,
          lastSeen,
          avatarUrl
        };
      });
      
      // Convert to array
      setAgents(Object.values(uniqueAgents));
    };
    
    const fetchAgentPresence = async () => {
      try {
        setIsLoading(true);
        
        // Get channel for this conversation
        const channelName = getWorkspaceChannelName(workspaceId, `conversations:${conversationId}`);
        const channel = await getAblyChannel(channelName);
        
        // Get presence data
        channel.presence.get((err: Error | null, presenceData: any[]) => {
          if (err) {
            setError(err);
            setIsLoading(false);
            return;
          }
          
          updateAgentList(presenceData || []);
          setIsLoading(false);
          
          // Subscribe to presence updates
          const enterSubscription = channel.presence.subscribe('enter', (member: any) => {
            setAgents(prevAgents => {
              // Check if agent already exists
              const exists = prevAgents.some(agent => agent.clientId === member.clientId);
              
              if (exists) {
                // Update existing agent
                return prevAgents.map(agent => 
                  agent.clientId === member.clientId 
                    ? {
                        ...agent,
                        status: mapAblyStatusToUserStatus(member.data?.status || 'online'),
                        username: member.data?.username || agent.username,
                        avatarUrl: member.data?.avatarUrl || agent.avatarUrl,
                        lastSeen: new Date().toISOString()
                      } 
                    : agent
                );
              } else {
                // Add new agent
                return [...prevAgents, {
                  clientId: member.clientId,
                  username: member.data?.username || 'Anonymous Agent',
                  status: mapAblyStatusToUserStatus(member.data?.status || 'online'),
                  lastSeen: new Date().toISOString(),
                  avatarUrl: member.data?.avatarUrl
                }];
              }
            });
          });
          
          const leaveSubscription = channel.presence.subscribe('leave', (member: any) => {
            setAgents(prevAgents => 
              prevAgents.map(agent => 
                agent.clientId === member.clientId 
                  ? { ...agent, status: 'offline', lastSeen: new Date().toISOString() } 
                  : agent
              )
            );
          });
          
          const updateSubscription = channel.presence.subscribe('update', (member: any) => {
            setAgents(prevAgents => 
              prevAgents.map(agent => 
                agent.clientId === member.clientId 
                  ? {
                      ...agent,
                      status: mapAblyStatusToUserStatus(member.data?.status || agent.status),
                      username: member.data?.username || agent.username,
                      avatarUrl: member.data?.avatarUrl || agent.avatarUrl,
                      lastSeen: new Date().toISOString()
                    } 
                  : agent
              )
            );
          });
          
          // Return cleanup function
          return () => {
            enterSubscription.unsubscribe();
            leaveSubscription.unsubscribe();
            updateSubscription.unsubscribe();
          };
        });
      } catch (err) {
        console.error('Error fetching agent presence:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setIsLoading(false);
      }
    };
    
    fetchAgentPresence();
  }, [workspaceId, conversationId, clientId]);

  return {
    agents,
    isLoading,
    error
  };
};
