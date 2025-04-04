
import { useState, useEffect } from 'react';
import type { Ticket } from '@/types/ticket';
import { getAblyChannel } from '@/utils/ably';
import type { Message } from './useMessages';
import type { UserPresence } from '../types';

export const usePresence = (
  ticket: Ticket, 
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [activeUsers, setActiveUsers] = useState<UserPresence[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          
          const newUserPresence: UserPresence = {
            userId: member.data?.userId || 'unknown',
            name: member.data?.name || 'Unknown',
            lastActive: new Date().toISOString(),
            location: member.data?.location || undefined
          };
          
          setActiveUsers(prev => {
            const filtered = prev.filter(user => user.userId !== newUserPresence.userId);
            return [...filtered, newUserPresence];
          });
        });
        
        channel.presence.subscribe('update', (member: any) => {
          if (member.data?.isTyping) {
            setTypingUsers(prev => [...new Set([...prev, member.data.name])]);
          } else {
            setTypingUsers(prev => prev.filter(name => name !== member.data.name));
          }
        });
        
        channel.presence.subscribe('leave', (member: any) => {
          setActiveUsers(prev => prev.filter(user => user.userId !== member.data?.userId));
          setTypingUsers(prev => prev.filter(name => name !== member.data?.name));
        });
        
        // Subscribe to new messages
        channel.subscribe('message:new', (message: any) => {
          setMessages(prev => [...prev, message.data]);
        });
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to setup presence');
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
