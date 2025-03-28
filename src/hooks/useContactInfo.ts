
import { useState, useEffect, useCallback } from 'react';
import { contactService } from '@/api/services/contactService';
import { Contact } from '@/types/contact';
import { useEventSystem } from '@/hooks/useEventSystem';
import { ChatEventType } from '@/utils/events/eventTypes';

/**
 * Hook for fetching and managing contact information in the chat widget
 */
export const useContactInfo = (contactId: string | null) => {
  const [contact, setContact] = useState<Contact | null>(null);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { publish } = useEventSystem();

  // Fetch contact information
  useEffect(() => {
    const fetchContactInfo = async () => {
      if (!contactId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch contact details
        const workspace_id = localStorage.getItem('workspaceId') || '';
        const contactData = await contactService.getContact(contactId, workspace_id);
        
        if (contactData) {
          setContact(contactData);
          
          // Log event that user was identified
          publish({
            type: ChatEventType.USER_IDENTIFIED,
            timestamp: new Date().toISOString(),
            source: 'contact-info-hook',
            contactId: contactId,
            metadata: {
              email: contactData.email,
              name: `${contactData.firstname} ${contactData.lastname}`
            }
          });
        }
      } catch (error) {
        console.error('Error fetching contact info:', error);
        setError('Failed to load contact information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContactInfo();
  }, [contactId, publish]);

  // Fetch conversation history
  useEffect(() => {
    const fetchConversationHistory = async () => {
      if (!contactId) return;
      
      try {
        // This would typically fetch from your API
        // For demo purposes, we're using mock data
        const mockHistory = [
          {
            id: '1',
            title: 'Technical Support Request',
            lastMessageDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            messageCount: 8,
            status: 'closed'
          },
          {
            id: '2',
            title: 'Billing Question',
            lastMessageDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            messageCount: 5,
            status: 'closed'
          },
          {
            id: '3',
            title: 'Feature Request',
            lastMessageDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            messageCount: 3,
            status: 'closed'
          }
        ];
        
        setConversationHistory(mockHistory);
      } catch (error) {
        console.error('Error fetching conversation history:', error);
      }
    };

    fetchConversationHistory();
  }, [contactId]);

  return {
    contact,
    conversationHistory,
    isLoading,
    error
  };
};
