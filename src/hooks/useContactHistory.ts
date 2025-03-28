
import { useState, useEffect } from 'react';
import { useEventSystem } from '@/hooks/useEventSystem';
import { ChatEventType } from '@/utils/events/eventTypes';

/**
 * Hook for managing conversation history with a contact
 */
export const useContactHistory = (contactId: string | null) => {
  const [recentConversations, setRecentConversations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { publish } = useEventSystem();

  useEffect(() => {
    const fetchConversationHistory = async () => {
      if (!contactId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      try {
        // In a real implementation, this would fetch from your API
        // This is mock data for demonstration
        const mockData = [
          {
            id: '1',
            title: 'Product inquiry',
            lastMessage: 'Thank you for your help!',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            messageCount: 12
          },
          {
            id: '2',
            title: 'Support request',
            lastMessage: 'I'll try that solution and let you know if it works.',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            messageCount: 8
          },
          {
            id: '3',
            title: 'Billing question',
            lastMessage: 'The invoice has been updated. You should receive it shortly.',
            date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            messageCount: 5
          }
        ];
        
        setRecentConversations(mockData);
        
        // Emit event that history was viewed
        publish({
          type: ChatEventType.HISTORY_VIEWED,
          timestamp: new Date().toISOString(),
          source: 'contact-history-hook',
          contactId
        });
        
      } catch (error) {
        console.error('Error fetching conversation history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversationHistory();
  }, [contactId, publish]);

  return {
    recentConversations,
    isLoading
  };
};
