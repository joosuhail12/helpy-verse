
import { useState, useEffect, useCallback } from 'react';
import { useAgentPresence, AgentPresence } from '@/hooks/chat/useAgentPresence';
import { useAbly } from '@/context/AblyContext';

/**
 * Hook for handling agent presence and notifications
 */
export const usePresenceNotifications = (conversationId: string, workspaceId: string) => {
  const [notifications, setNotifications] = useState<string[]>([]);
  const { agents, isLoading } = useAgentPresence(workspaceId, conversationId);
  const [activeAgents, setActiveAgents] = useState<AgentPresence[]>([]);
  const { client, clientId } = useAbly();
  
  // Track active agents and create notifications for status changes
  useEffect(() => {
    if (isLoading) return;
    
    // Filter out the current user
    const filteredAgents = agents.filter(agent => agent.clientId !== clientId);
    
    // If this is the first run, just set the active agents
    if (activeAgents.length === 0) {
      setActiveAgents(filteredAgents);
      return;
    }
    
    // Check for new agents that have come online
    const newAgents = filteredAgents.filter(
      agent => 
        agent.status !== 'offline' && 
        !activeAgents.some(a => a.clientId === agent.clientId && a.status !== 'offline')
    );
    
    // Check for agents that have gone offline
    const offlineAgents = activeAgents.filter(
      agent => 
        agent.status !== 'offline' && 
        !filteredAgents.some(a => a.clientId === agent.clientId && a.status !== 'offline')
    );
    
    // Create notifications
    const newNotifications: string[] = [];
    
    newAgents.forEach(agent => {
      newNotifications.push(`${agent.username} has joined the conversation.`);
    });
    
    offlineAgents.forEach(agent => {
      newNotifications.push(`${agent.username} has left the conversation.`);
    });
    
    // Update active agents and add new notifications
    if (newNotifications.length > 0) {
      setNotifications(prev => [...prev, ...newNotifications]);
    }
    
    setActiveAgents(filteredAgents);
  }, [agents, isLoading, activeAgents, clientId]);
  
  // Clear a notification
  const clearNotification = useCallback((index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  }, []);
  
  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);
  
  return {
    notifications,
    agents: activeAgents,
    isLoading,
    clearNotification,
    clearAllNotifications
  };
};
