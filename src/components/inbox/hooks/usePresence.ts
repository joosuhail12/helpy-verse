
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { getAblyChannel, subscribeToPresence, enterChannelPresence } from '@/utils/ably';
import type { UserPresence, Message } from '../types';
import type { Ticket } from '@/types/ticket';
import type * as Ably from 'ably';

export const usePresence = (ticket: Ticket, setMessages: (updater: (prev: Message[]) => Message[]) => void) => {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [activeUsers, setActiveUsers] = useState<UserPresence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const setupPresence = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Enter the presence channel
        await enterChannelPresence(`ticket:${ticket.id}`, {
          userId: 'Agent',
          name: 'Agent',
          lastActive: new Date().toISOString(),
          location: {
            ticketId: ticket.id,
            area: 'conversation'
          }
        });

        // Set up presence subscriptions
        const presenceSubscription = await subscribeToPresence(`ticket:${ticket.id}`, (member) => {
          const presenceAction = member.action;
          
          if (presenceAction === 'enter') {
            toast({
              description: `${member.data?.name || 'Someone'} joined the conversation`,
            });
            setActiveUsers(prev => [...prev, member.data as UserPresence]);
          } 
          else if (presenceAction === 'leave') {
            toast({
              description: `${member.data?.name || 'Someone'} left the conversation`,
            });
            setActiveUsers(prev => prev.filter(user => user.userId !== member.data?.userId));
          }
          else if (presenceAction === 'update') {
            if (member.data?.isTyping) {
              setTypingUsers(prev => [...new Set([...prev, member.data.name])]);
            } else {
              setTypingUsers(prev => prev.filter(user => user !== member.data.name));
            }

            if (member.data?.lastRead) {
              setMessages(prev => prev.map(msg => ({
                ...msg,
                readBy: [...(msg.readBy || []), member.data.userId]
              })));
            }

            if (member.data?.location) {
              setActiveUsers(prev => prev.map(user => 
                user.userId === member.data.userId 
                  ? { ...user, location: member.data.location }
                  : user
              ));
            }
          }
        });

        // Get current presence data
        const channel = await getAblyChannel(`ticket:${ticket.id}`);
        try {
          channel.presence.get((err, members) => {
            if (err) {
              console.error('Error getting presence data:', err);
              return;
            }
            
            if (members && Array.isArray(members)) {
              const presentMembers = members.map(member => ({
                userId: member.clientId,
                name: member.data?.name || 'Unknown',
                lastActive: member.data?.lastActive || new Date().toISOString(),
                location: member.data?.location
              } as UserPresence));
              setActiveUsers(presentMembers);
            }
          });
        } catch (error) {
          console.error('Error fetching presence data:', error);
        }

        setIsLoading(false);

        return () => {
          // Leave presence and clean up
          const leavePresence = async () => {
            try {
              const channel = await getAblyChannel(`ticket:${ticket.id}`);
              channel.presence.leave();
            } catch (err) {
              console.error('Error leaving presence:', err);
            }
          };
          
          leavePresence();
          presenceSubscription();
        };
      } catch (error) {
        console.error('Error setting up presence:', error);
        setError('Failed to connect to the conversation. Please try again.');
        setIsLoading(false);
        return () => {};
      }
    };

    const cleanup = setupPresence();
    return () => {
      Promise.resolve(cleanup).then(cleanupFn => {
        if (typeof cleanupFn === 'function') cleanupFn();
      });
    };
  }, [ticket.id, toast, setMessages]);

  return { typingUsers, activeUsers, isLoading, error };
};
