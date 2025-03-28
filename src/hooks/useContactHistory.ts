
import { useCallback } from 'react';
import { useAbly } from '../context/AblyContext';

export function useContactHistory(contactId: string) {
  const ably = useAbly();
  
  const fetchHistory = useCallback(async () => {
    // This would typically fetch contact history from an API
    // For now, we'll return mock data
    return [
      {
        id: '1',
        date: new Date(Date.now() - 86400000).toISOString(),
        type: 'email',
        description: 'Support ticket created',
      },
      {
        id: '2',
        date: new Date(Date.now() - 43200000).toISOString(),
        type: 'chat',
        description: 'Live chat session',
      },
      {
        id: '3',
        date: new Date().toISOString(),
        type: 'note',
        description: 'Customer follow-up scheduled',
      },
    ];
  }, []);
  
  const addHistoryItem = useCallback((item: { type: string; description: string }) => {
    // In a real app, this would save to a database
    // For now, we'll just publish a realtime event
    const channelName = ably.getChannelName(`contact:${contactId}`);
    
    try {
      ably.publish(channelName, 'history-update', {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        ...item
      });
    } catch (error) {
      console.error('Failed to add history item:', error);
    }
  }, [ably, contactId]);
  
  return {
    fetchHistory,
    addHistoryItem,
  };
}

export default useContactHistory;
