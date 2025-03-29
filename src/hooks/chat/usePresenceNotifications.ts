
import { useState, useEffect } from 'react';
import { useAbly } from '@/context/AblyContext';
import { useAgentPresence } from './useAgentPresence';

/**
 * Hook to manage presence notifications in chat
 */
export const usePresenceNotifications = (conversationId: string, workspaceId: string) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const { client, isConnected } = useAbly();
  const { agents } = useAgentPresence(conversationId);

  useEffect(() => {
    if (!client || !isConnected || !conversationId) return;

    // In a real app, we would subscribe to presence events
    // For demo purposes, we'll just set up a dummy notification
    const dummyNotification = {
      id: 'welcome',
      type: 'system',
      content: 'Welcome to the conversation!',
      timestamp: new Date()
    };

    setNotifications([dummyNotification]);

    return () => {
      // Cleanup
    };
  }, [client, conversationId, isConnected, workspaceId]);

  // Add a notification
  const addNotification = (notification: any) => {
    setNotifications(prev => [...prev, notification]);
  };

  // Clear a notification
  const clearNotification = (index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    agents,
    addNotification,
    clearNotification,
    clearAllNotifications
  };
};
