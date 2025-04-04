
import { useState, useEffect } from 'react';
import type { Ticket } from '@/types/ticket';
import { getAblyChannel } from '@/utils/ably';
import type { Message } from './useMessages';

export const usePresence = (
  ticket: Ticket, 
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let channel: any;
    
    const setupPresence = async () => {
      setIsLoading(true);
      try {
        channel = await getAblyChannel(`ticket:${ticket.id}`);
        
        // Subscribe to presence updates
        channel.presence.subscribe('enter', (member: any) => {
          if (member.data?.isTyping) {
            setTypingUsers(prev => [...new Set([...prev, member.data.name])]);
          }
          
          setActiveUsers(prev => [...new Set([...prev, member.data?.name || 'Unknown'])]);
        });
        
        channel.presence.subscribe('update', (member: any) => {
          if (member.data?.isTyping) {
            setTypingUsers(prev => [...new Set([...prev, member.data.name])]);
          } else {
            setTypingUsers(prev => prev.filter(name => name !== member.data.name));
          }
        });
        
        channel.presence.subscribe('leave', (member: any) => {
          setActiveUsers(prev => prev.filter(name => name !== member.data?.name));
          setTypingUsers(prev => prev.filter(name => name !== member.data?.name));
        });
        
        // Subscribe to new messages
        channel.subscribe('message:new', (message: any) => {
          setMessages(prev => [...prev, message.data]);
        });
        
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to setup presence'));
      } finally {
        setIsLoading(false);
      }
    };
    
    setupPresence();
    
    return () => {
      if (channel) {
        channel.presence.unsubscribe();
        channel.unsubscribe();
      }
    };
  }, [ticket.id, setMessages]);

  return {
    typingUsers,
    activeUsers,
    isLoading,
    error
  };
};
